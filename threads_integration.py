#!/usr/bin/env python3
"""
Threads Integration for Attribution Dashboard
Search for brand mentions on Meta's Threads platform using ScrapeCreators API.

Installation:
pip install requests python-dotenv

Usage:
1. Set your ScrapeCreators API key in environment variables or .env file
2. Update BRAND_NAME with your brand name
3. Run: python threads_integration.py
"""

import requests
import json
import csv
import os
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import logging
import time

# Import enhanced sentiment analysis
try:
    from openrouter_sentiment_integration import analyze_sentiment_enhanced, get_sentiment_only
    ENHANCED_SENTIMENT_AVAILABLE = True
except ImportError:
    ENHANCED_SENTIMENT_AVAILABLE = False

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ThreadsIntegration:
    def __init__(self, api_key: str, brand_name: str):
        self.api_key = api_key
        self.brand_name = brand_name
        self.base_url = "https://api.scrapecreators.com"
        self.session = requests.Session()
        self.session.headers.update({
            'x-api-key': api_key,
            'Content-Type': 'application/json',
            'User-Agent': 'Attribution-Dashboard/1.0'
        })
    
    def search_threads(self, query: str, trim: bool = True) -> Dict[str, Any]:
        """
        Search for posts by keyword on Threads using ScrapeCreators API
        
        Args:
            query (str): Keyword to search for (required)
            trim (bool): Set to true for a trimmed down version of the response (default: True)
            
        Returns:
            Dict containing the API response with posts
            
        Note:
            Threads only returns 20-30 results at a time according to the API documentation
        """
        endpoint = f"{self.base_url}/v1/threads/search"
        
        # Build parameters
        params = {
            'query': query,
            'trim': str(trim).lower()
        }
        
        try:
            logger.info(f"Searching Threads for query: {query}")
            response = self.session.get(endpoint, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get('success', False):
                posts_count = len(data.get('posts', []))
                logger.info(f"Threads search successful. Found {posts_count} posts")
                return data
            else:
                logger.warning(f"Threads API returned success=false for query: {query}")
                return {'success': False, 'posts': []}
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Threads API request failed: {e}")
            if hasattr(e, 'response') and e.response is not None:
                logger.error(f"Response status: {e.response.status_code}")
                logger.error(f"Response text: {e.response.text}")
            raise
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}")
            raise
    
    def fetch_threads_mentions(self, days_back: int = 7, max_results: int = 100) -> List[Dict[str, Any]]:
        """Fetch brand mentions from Threads"""
        all_mentions = []
        
        # Build search queries with brand variations
        search_queries = [
            self.brand_name,
            f'"{self.brand_name}"',  # Exact match
            f'@{self.brand_name.lower()}',  # Handle mentions
            f'{self.brand_name} review',
            f'{self.brand_name} opinion'
        ]
        
        for query in search_queries:
            try:
                result = self.search_threads(query=query, trim=True)
                
                if result.get('success', False) and 'posts' in result:
                    for post in result['posts']:
                        processed_mention = self.process_threads_mention(post)
                        if processed_mention:
                            # Filter by date if needed (Threads API doesn't support date filtering)
                            if self._is_within_date_range(processed_mention, days_back):
                                all_mentions.append(processed_mention)
                
                # Rate limiting between queries - be nice to the API
                time.sleep(2)
                
                # Break if we have enough results (since Threads only returns 20-30 at a time)
                if len(all_mentions) >= max_results:
                    break
                
            except Exception as e:
                logger.error(f"Error searching Threads for query '{query}': {e}")
                continue
        
        # Remove duplicates based on post ID
        unique_mentions = {}
        for mention in all_mentions:
            post_id = mention.get('id')
            if post_id and post_id not in unique_mentions:
                unique_mentions[post_id] = mention
        
        final_mentions = list(unique_mentions.values())
        logger.info(f"Found {len(final_mentions)} unique Threads mentions")
        return final_mentions
    
    def process_threads_mention(self, threads_post: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Process Threads post data into standardized mention format"""
        try:
            # Extract basic post info
            post_id = threads_post.get('id', '')
            pk = threads_post.get('pk', '')
            
            # Extract user information
            user_info = threads_post.get('user', {})
            username = user_info.get('username', 'Unknown')
            user_id = user_info.get('id', user_info.get('pk', ''))
            profile_pic = user_info.get('profile_pic_url', '')
            is_verified = user_info.get('is_verified', False)
            
            # Extract post content from text_post_app_info
            text_post_info = threads_post.get('text_post_app_info', {})
            
            # Extract text content from fragments
            content = ''
            text_fragments = text_post_info.get('text_fragments', {}).get('fragments', [])
            for fragment in text_fragments:
                if fragment.get('fragment_type') == 'plaintext':
                    content += fragment.get('plaintext', '')
            
            # If no content in fragments, try caption
            if not content:
                caption = threads_post.get('caption', {})
                content = caption.get('text', '') if isinstance(caption, dict) else str(caption)
            
            # Extract engagement metrics
            like_count = threads_post.get('like_count', 0)
            reshare_count = text_post_info.get('reshare_count', 0)
            direct_reply_count = text_post_info.get('direct_reply_count', 0)
            repost_count = text_post_info.get('repost_count', 0)
            quote_count = text_post_info.get('quote_count', 0)
            
            # Extract creation time
            taken_at = threads_post.get('taken_at', 0)
            if taken_at:
                created_at = datetime.fromtimestamp(taken_at).isoformat()
            else:
                created_at = datetime.now().isoformat()
            
            # Build Threads URL (approximation based on typical Threads URL structure)
            code = threads_post.get('code', '')
            threads_url = f"https://www.threads.net/@{username}/post/{code}" if username and code else ""
            
            # Extract media information
            media_type = threads_post.get('media_type', 19)  # 19 seems to be text post
            image_versions = threads_post.get('image_versions2', {}).get('candidates', [])
            video_versions = threads_post.get('video_versions', [])
            has_audio = threads_post.get('has_audio', False)
            
            # Determine content type
            content_type = 'text'
            if image_versions:
                content_type = 'image'
            elif video_versions:
                content_type = 'video'
            elif has_audio:
                content_type = 'audio'
            
            processed = {
                'id': post_id,
                'pk': pk,
                'platform': 'threads',
                'content_type': content_type,
                'content': content,
                'author': username,
                'author_username': username,
                'author_id': user_id,
                'author_verified': is_verified,
                'author_profile_pic': profile_pic,
                'created_at': created_at,
                'url': threads_url,
                'engagement': {
                    'likes': like_count,
                    'reshares': reshare_count,
                    'replies': direct_reply_count,
                    'reposts': repost_count,
                    'quotes': quote_count
                },
                'media_type': media_type,
                'code': code,
                'has_images': len(image_versions) > 0,
                'has_video': len(video_versions) > 0,
                'has_audio': has_audio,
                'is_reply': text_post_info.get('is_reply', False),
                'reply_control': text_post_info.get('reply_control', 'everyone'),
                'sentiment': self.analyze_sentiment(content),
                'relevance_score': self.calculate_relevance(content),
                'extracted_at': datetime.now().isoformat(),
                'raw_data': threads_post  # Keep original data for debugging
            }
            
            return processed
            
        except Exception as e:
            logger.error(f"Error processing Threads mention: {e}")
            return None
    
    def _is_within_date_range(self, mention: Dict[str, Any], days_back: int) -> bool:
        """Check if mention is within the specified date range"""
        try:
            created_at_str = mention.get('created_at', '')
            if not created_at_str:
                return True  # Include if no date available
            
            created_at = datetime.fromisoformat(created_at_str.replace('Z', '+00:00'))
            cutoff_date = datetime.now() - timedelta(days=days_back)
            
            return created_at >= cutoff_date
        except Exception as e:
            logger.warning(f"Error parsing date for filtering: {e}")
            return True  # Include if date parsing fails
    
    def analyze_sentiment(self, text: str) -> str:
        """Enhanced sentiment analysis with Gemini Flash 2 or fallback to rule-based"""
        if not text:
            return 'neutral'
        
        if ENHANCED_SENTIMENT_AVAILABLE:
            try:
                return get_sentiment_only(text)
            except Exception as e:
                logger.warning(f"Enhanced sentiment analysis failed, using fallback: {e}")
                return self._analyze_sentiment_fallback(text)
        else:
            return self._analyze_sentiment_fallback(text)
    
    def analyze_sentiment_detailed(self, text: str) -> Dict[str, Any]:
        """Get detailed sentiment analysis with confidence and reasoning"""
        if not text:
            return {
                'sentiment': 'neutral',
                'confidence': 0.0,
                'reasoning': 'Empty text',
                'method': 'fallback'
            }
        
        if ENHANCED_SENTIMENT_AVAILABLE:
            try:
                context = {
                    'brand': self.brand_name,
                    'platform': 'threads'
                }
                return analyze_sentiment_enhanced(text, context)
            except Exception as e:
                logger.warning(f"Enhanced sentiment analysis failed: {e}")
                return self._analyze_sentiment_detailed_fallback(text)
        else:
            return self._analyze_sentiment_detailed_fallback(text)
    
    def _analyze_sentiment_fallback(self, text: str) -> str:
        """Fallback rule-based sentiment analysis"""
        text_lower = text.lower()
        
        positive_words = ['love', 'great', 'awesome', 'excellent', 'amazing', 'fantastic', 'recommend', 'best']
        negative_words = ['hate', 'terrible', 'awful', 'worst', 'bad', 'disappointed', 'avoid', 'sucks']
        
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            return 'positive'
        elif negative_count > positive_count:
            return 'negative'
        else:
            return 'neutral'
    
    def _analyze_sentiment_detailed_fallback(self, text: str) -> Dict[str, Any]:
        """Detailed fallback sentiment analysis"""
        sentiment = self._analyze_sentiment_fallback(text)
        text_lower = text.lower()
        
        positive_words = ['love', 'great', 'awesome', 'excellent', 'amazing', 'fantastic', 'recommend', 'best']
        negative_words = ['hate', 'terrible', 'awful', 'worst', 'bad', 'disappointed', 'avoid', 'sucks']
        
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        confidence = 0.3
        if positive_count > negative_count:
            confidence = min(0.8, 0.4 + (positive_count - negative_count) * 0.1)
        elif negative_count > positive_count:
            confidence = min(0.8, 0.4 + (negative_count - positive_count) * 0.1)
        
        return {
            'sentiment': sentiment,
            'confidence': confidence,
            'reasoning': f'Rule-based analysis: {positive_count} positive, {negative_count} negative keywords',
            'emotional_categories': [],
            'intensity': 'medium' if confidence > 0.6 else 'low',
            'context_awareness': 'Limited context awareness with rule-based analysis',
            'method': 'rule_based_fallback',
            'text_length': len(text),
            'timestamp': time.time()
        }
    
    def calculate_relevance(self, text: str) -> float:
        """Calculate how relevant the mention is to the brand"""
        if not text:
            return 0.0
        
        text_lower = text.lower()
        brand_lower = self.brand_name.lower()
        
        # Basic relevance scoring
        score = 0.0
        
        # Direct brand mention
        if brand_lower in text_lower:
            score += 0.8
        
        # Context relevance keywords (customize based on your industry)
        context_keywords = ['software', 'app', 'tool', 'platform', 'service', 'product']
        for keyword in context_keywords:
            if keyword in text_lower:
                score += 0.1
        
        # Length penalty for very short mentions
        if len(text.split()) < 5:
            score *= 0.7
        
        return min(score, 1.0)
    
    def save_to_csv(self, mentions: List[Dict[str, Any]], filename: str = None) -> str:
        """Save mentions to CSV file"""
        if not filename:
            filename = f'threads_mentions_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        
        if not mentions:
            logger.warning("No mentions to save")
            return filename
        
        fieldnames = [
            'id', 'pk', 'platform', 'content_type', 'content', 'author', 'author_username', 'author_id',
            'author_verified', 'created_at', 'url', 'likes', 'reshares', 'replies', 'reposts', 'quotes',
            'media_type', 'code', 'has_images', 'has_video', 'has_audio', 'is_reply', 'reply_control',
            'sentiment', 'relevance_score', 'extracted_at'
        ]
        
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            for mention in mentions:
                row = {
                    'id': mention.get('id', ''),
                    'pk': mention.get('pk', ''),
                    'platform': mention.get('platform', ''),
                    'content_type': mention.get('content_type', ''),
                    'content': mention.get('content', '').replace('\n', ' ')[:500],  # Truncate long content
                    'author': mention.get('author', ''),
                    'author_username': mention.get('author_username', ''),
                    'author_id': mention.get('author_id', ''),
                    'author_verified': mention.get('author_verified', False),
                    'created_at': mention.get('created_at', ''),
                    'url': mention.get('url', ''),
                    'likes': mention.get('engagement', {}).get('likes', 0),
                    'reshares': mention.get('engagement', {}).get('reshares', 0),
                    'replies': mention.get('engagement', {}).get('replies', 0),
                    'reposts': mention.get('engagement', {}).get('reposts', 0),
                    'quotes': mention.get('engagement', {}).get('quotes', 0),
                    'media_type': mention.get('media_type', ''),
                    'code': mention.get('code', ''),
                    'has_images': mention.get('has_images', False),
                    'has_video': mention.get('has_video', False),
                    'has_audio': mention.get('has_audio', False),
                    'is_reply': mention.get('is_reply', False),
                    'reply_control': mention.get('reply_control', ''),
                    'sentiment': mention.get('sentiment', ''),
                    'relevance_score': mention.get('relevance_score', 0),
                    'extracted_at': mention.get('extracted_at', '')
                }
                writer.writerow(row)
        
        logger.info(f"Saved {len(mentions)} mentions to {filename}")
        return filename
    
    def save_to_json(self, mentions: List[Dict[str, Any]], filename: str = None) -> str:
        """Save mentions to JSON file"""
        if not filename:
            filename = f'threads_mentions_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        
        with open(filename, 'w', encoding='utf-8') as jsonfile:
            json.dump(mentions, jsonfile, indent=2, ensure_ascii=False)
        
        logger.info(f"Saved {len(mentions)} mentions to {filename}")
        return filename
    
    def generate_dashboard_csv(self, mentions: List[Dict[str, Any]], filename: str = None) -> str:
        """Generate CSV in format compatible with Attribution Dashboard"""
        if not filename:
            filename = f'dashboard_threads_mentions_{datetime.now().strftime("%Y%m%d")}.csv'
        
        # Aggregate mentions by date
        daily_counts = {}
        for mention in mentions:
            try:
                # Parse date from created_at
                date_str = mention.get('created_at', '')
                if date_str:
                    date = datetime.fromisoformat(date_str.replace('Z', '+00:00')).date()
                    daily_counts[date] = daily_counts.get(date, 0) + 1
            except Exception as e:
                logger.warning(f"Error parsing date: {e}")
        
        # Write dashboard-compatible CSV
        with open(filename, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['date', 'mentions'])
            
            for date, count in sorted(daily_counts.items()):
                writer.writerow([date.strftime('%Y-%m-%d'), count])
        
        logger.info(f"Generated dashboard CSV: {filename}")
        return filename

def main():
    """Main execution function"""
    # Configuration
    BRAND_NAME = os.getenv('BRAND_NAME', 'YourBrandName')  # Replace with your brand name
    API_KEY = os.getenv('SCRAPE_CREATORS_API_KEY')  # Set this in your environment
    
    if not API_KEY:
        logger.error("Please set SCRAPE_CREATORS_API_KEY environment variable")
        return
    
    # Initialize integration
    threads_client = ThreadsIntegration(api_key=API_KEY, brand_name=BRAND_NAME)
    
    # Fetch mentions from last 7 days
    logger.info(f"Starting Threads mention extraction for brand: {BRAND_NAME}")
    mentions = threads_client.fetch_threads_mentions(days_back=7, max_results=100)
    
    if mentions:
        logger.info(f"Total Threads mentions found: {len(mentions)}")
        
        # Save in multiple formats
        csv_file = threads_client.save_to_csv(mentions)
        json_file = threads_client.save_to_json(mentions)
        dashboard_csv = threads_client.generate_dashboard_csv(mentions)
        
        # Print summary
        sentiments = {}
        content_types = {}
        for mention in mentions:
            sentiment = mention.get('sentiment', 'neutral')
            sentiments[sentiment] = sentiments.get(sentiment, 0) + 1
            
            content_type = mention.get('content_type', 'text')
            content_types[content_type] = content_types.get(content_type, 0) + 1
        
        print("\n=== THREADS EXTRACTION SUMMARY ===")
        print(f"Brand: {BRAND_NAME}")
        print(f"Total Mentions: {len(mentions)}")
        print(f"Platform: Threads")
        print(f"Content Types: {dict(content_types)}")
        print(f"Sentiment Breakdown: {dict(sentiments)}")
        print(f"\nFiles Generated:")
        print(f"  - Detailed CSV: {csv_file}")
        print(f"  - JSON Data: {json_file}")
        print(f"  - Dashboard CSV: {dashboard_csv}")
        print(f"\nTo import into Attribution Dashboard:")
        print(f"  1. Open your dashboard")
        print(f"  2. Go to Mentions Graph section")
        print(f"  3. Upload {dashboard_csv}")
        
    else:
        logger.warning("No Threads mentions found")

if __name__ == "__main__":
    main()