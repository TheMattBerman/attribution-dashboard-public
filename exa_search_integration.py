#!/usr/bin/env python3
"""
Exa Search API Integration Script for Attribution Dashboard
Fetch and record recent brand mentions from the open web

Installation:
pip install requests python-dotenv

Usage:
1. Set your Exa API key in environment variables or .env file
2. Update BRAND_NAME with your brand name
3. Run: python exa_search_integration.py
"""

import requests
import json
import csv
import os
import time
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import logging
import re
from urllib.parse import urlparse

# Import enhanced sentiment analysis
try:
    from openrouter_sentiment_integration import analyze_sentiment_enhanced, get_sentiment_only
    ENHANCED_SENTIMENT_AVAILABLE = True
except ImportError:
    ENHANCED_SENTIMENT_AVAILABLE = False

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ExaSearchIntegration:
    def __init__(self, api_key: str, brand_name: str):
        self.api_key = api_key
        self.brand_name = brand_name
        self.base_url = "https://api.exa.ai"
        self.session = requests.Session()
        self.session.headers.update({
            'x-api-key': api_key,
            'Content-Type': 'application/json',
            'User-Agent': 'Attribution-Dashboard/1.0'
        })
        
        # Rate limiting
        self.last_request_time = 0
        self.min_request_interval = 1  # seconds between requests
    
    def _rate_limit(self):
        """Enforce rate limiting between API calls"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.min_request_interval:
            time.sleep(self.min_request_interval - time_since_last)
        self.last_request_time = time.time()
    
    def search_mentions(self, days_back: int = 7, max_results: int = 50) -> List[Dict[str, Any]]:
        """Search for brand mentions in the last N days"""
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)
        
        # Build comprehensive search queries
        search_queries = self._build_search_queries()
        
        all_results = []
        for query in search_queries:
            logger.info(f"Searching with query: {query}")
            try:
                self._rate_limit()
                results = self._execute_search(query, start_date, end_date, max_results // len(search_queries))
                all_results.extend(results)
                logger.info(f"Found {len(results)} results for query")
            except Exception as e:
                logger.error(f"Search failed for query '{query}': {e}")
        
        # Remove duplicates and filter relevant mentions
        unique_results = self._deduplicate_results(all_results)
        relevant_mentions = self._filter_relevant_mentions(unique_results)
        
        return relevant_mentions
    
    def _build_search_queries(self) -> List[str]:
        """Build multiple search queries for comprehensive coverage"""
        brand_lower = self.brand_name.lower()
        brand_variations = [
            self.brand_name,
            brand_lower,
            f'"{self.brand_name}"',  # Exact match
            f'{self.brand_name} review',
            f'{self.brand_name} alternative',
            f'{self.brand_name} comparison',
            f'using {self.brand_name}',
            f'tried {self.brand_name}',
        ]
        
        return brand_variations[:5]  # Limit to avoid too many API calls
    
    def _execute_search(self, query: str, start_date: datetime, end_date: datetime, num_results: int) -> List[Dict[str, Any]]:
        """Execute a single search query"""
        payload = {
            "query": query,
            "type": "neural",
            "useAutoprompt": True,
            "numResults": num_results,
            "startPublishedDate": start_date.isoformat(),
            "endPublishedDate": end_date.isoformat(),
            "includeDomains": [],  # Can specify specific domains to include
            "excludeDomains": [    # Exclude low-quality or irrelevant domains
                "pinterest.com",
                "instagram.com", 
                "facebook.com",
                "spam-domain.com"
            ],
            "includeText": True,
            "text": {
                "maxCharacters": 2000,
                "includeHtmlTags": False
            }
        }
        
        try:
            response = self.session.post(f"{self.base_url}/search", json=payload)
            response.raise_for_status()
            
            data = response.json()
            results = data.get('results', [])
            
            # Process each result
            processed_results = []
            for result in results:
                processed_result = self._process_result(result, query)
                if processed_result:
                    processed_results.append(processed_result)
            
            return processed_results
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Search request failed: {e}")
            if hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text}")
            return []
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}")
            return []
    
    def _process_result(self, result: Dict[str, Any], search_query: str) -> Optional[Dict[str, Any]]:
        """Process and standardize search result data"""
        try:
            url = result.get('url', '')
            domain = urlparse(url).netloc if url else ''
            
            processed = {
                'id': result.get('id', url),
                'title': result.get('title', ''),
                'url': url,
                'domain': domain,
                'content': result.get('text', ''),
                'published_date': result.get('publishedDate', ''),
                'author': result.get('author', ''),
                'search_query': search_query,
                'relevance_score': self._calculate_relevance_score(result),
                'sentiment': self._analyze_sentiment(result.get('text', '') + ' ' + result.get('title', '')),
                'content_type': self._classify_content_type(result),
                'extracted_at': datetime.now().isoformat()
            }
            
            # Extract additional metadata
            processed['word_count'] = len(processed['content'].split()) if processed['content'] else 0
            processed['has_contact_info'] = self._has_contact_info(processed['content'])
            processed['mention_context'] = self._extract_mention_context(processed['content'])
            
            return processed
            
        except Exception as e:
            logger.error(f"Error processing result: {e}")
            return None
    
    def _calculate_relevance_score(self, result: Dict[str, Any]) -> float:
        """Calculate how relevant the result is to brand tracking"""
        score = 0.0
        
        title = result.get('title', '').lower()
        content = result.get('text', '').lower()
        brand_lower = self.brand_name.lower()
        
        # Title mentions (higher weight)
        if brand_lower in title:
            score += 0.6
        
        # Content mentions
        content_mentions = content.count(brand_lower)
        score += min(content_mentions * 0.2, 0.4)
        
        # Context relevance
        relevant_keywords = [
            'review', 'comparison', 'alternative', 'vs', 'versus',
            'experience', 'opinion', 'recommend', 'using', 'tried',
            'features', 'pricing', 'benefits', 'pros', 'cons'
        ]
        
        for keyword in relevant_keywords:
            if keyword in content or keyword in title:
                score += 0.05
        
        # Quality indicators
        if len(content.split()) > 100:  # Substantial content
            score += 0.1
        
        if result.get('publishedDate'):  # Has publication date
            score += 0.05
        
        return min(score, 1.0)
    
    def _analyze_sentiment(self, text: str) -> str:
        """Enhanced sentiment analysis with Gemini Flash 2 or fallback to rule-based"""
        if not text:
            return 'neutral'
        
        if ENHANCED_SENTIMENT_AVAILABLE:
            try:
                # Use enhanced sentiment analysis with web content context
                context = {
                    'brand': self.brand_name,
                    'platform': 'web_content'
                }
                return get_sentiment_only(text)
            except Exception as e:
                logger.warning(f"Enhanced sentiment analysis failed, using fallback: {e}")
                return self._analyze_sentiment_fallback(text)
        else:
            return self._analyze_sentiment_fallback(text)
    
    def _analyze_sentiment_detailed(self, text: str) -> Dict[str, Any]:
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
                    'platform': 'web_content'
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
        
        positive_indicators = [
            'love', 'great', 'awesome', 'excellent', 'amazing', 'fantastic',
            'recommend', 'best', 'perfect', 'outstanding', 'impressive',
            'helpful', 'useful', 'valuable', 'effective', 'successful'
        ]
        
        negative_indicators = [
            'hate', 'terrible', 'awful', 'worst', 'bad', 'disappointed',
            'avoid', 'sucks', 'horrible', 'useless', 'failed', 'broken',
            'frustrating', 'annoying', 'expensive', 'overpriced'
        ]
        
        positive_count = sum(1 for word in positive_indicators if word in text_lower)
        negative_count = sum(1 for word in negative_indicators if word in text_lower)
        
        if positive_count > negative_count + 1:
            return 'positive'
        elif negative_count > positive_count + 1:
            return 'negative'
        else:
            return 'neutral'
    
    def _analyze_sentiment_detailed_fallback(self, text: str) -> Dict[str, Any]:
        """Detailed fallback sentiment analysis"""
        sentiment = self._analyze_sentiment_fallback(text)
        text_lower = text.lower()
        
        positive_indicators = [
            'love', 'great', 'awesome', 'excellent', 'amazing', 'fantastic',
            'recommend', 'best', 'perfect', 'outstanding', 'impressive',
            'helpful', 'useful', 'valuable', 'effective', 'successful'
        ]
        
        negative_indicators = [
            'hate', 'terrible', 'awful', 'worst', 'bad', 'disappointed',
            'avoid', 'sucks', 'horrible', 'useless', 'failed', 'broken',
            'frustrating', 'annoying', 'expensive', 'overpriced'
        ]
        
        positive_count = sum(1 for word in positive_indicators if word in text_lower)
        negative_count = sum(1 for word in negative_indicators if word in text_lower)
        
        confidence = 0.3
        if positive_count > negative_count + 1:
            confidence = min(0.8, 0.4 + (positive_count - negative_count) * 0.1)
        elif negative_count > positive_count + 1:
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
    
    def _classify_content_type(self, result: Dict[str, Any]) -> str:
        """Classify the type of content"""
        url = result.get('url', '').lower()
        title = result.get('title', '').lower()
        content = result.get('text', '').lower()
        
        # Blog/Article indicators
        if any(indicator in url for indicator in ['blog', 'article', 'post', 'news']):
            return 'blog_article'
        
        # Review indicators
        if any(indicator in title + content for indicator in ['review', 'rating', 'stars']):
            return 'review'
        
        # Forum/Discussion
        if any(indicator in url for indicator in ['forum', 'discussion', 'reddit', 'stackoverflow']):
            return 'forum_discussion'
        
        # Documentation
        if any(indicator in url for indicator in ['docs', 'documentation', 'help', 'support']):
            return 'documentation'
        
        # News
        if any(indicator in url for indicator in ['news', 'press', 'announcement']):
            return 'news'
        
        return 'general'
    
    def _has_contact_info(self, content: str) -> bool:
        """Check if content contains contact information"""
        if not content:
            return False
        
        # Simple patterns for email and contact info
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        phone_pattern = r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b'
        
        return bool(re.search(email_pattern, content) or re.search(phone_pattern, content))
    
    def _extract_mention_context(self, content: str) -> str:
        """Extract surrounding context of brand mentions"""
        if not content:
            return ''
        
        brand_lower = self.brand_name.lower()
        content_lower = content.lower()
        
        # Find brand mentions and extract surrounding context
        contexts = []
        words = content.split()
        words_lower = [w.lower() for w in words]
        
        for i, word in enumerate(words_lower):
            if brand_lower in word:
                # Extract 10 words before and after
                start = max(0, i - 10)
                end = min(len(words), i + 11)
                context = ' '.join(words[start:end])
                contexts.append(context)
        
        return ' ... '.join(contexts[:2])  # Return first 2 contexts
    
    def _deduplicate_results(self, results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate results based on URL"""
        seen_urls = set()
        unique_results = []
        
        for result in results:
            url = result.get('url', '')
            if url and url not in seen_urls:
                seen_urls.add(url)
                unique_results.append(result)
        
        return unique_results
    
    def _filter_relevant_mentions(self, results: List[Dict[str, Any]], min_relevance: float = 0.3) -> List[Dict[str, Any]]:
        """Filter results to only include relevant mentions"""
        relevant = []
        
        for result in results:
            relevance_score = result.get('relevance_score', 0)
            if relevance_score >= min_relevance:
                relevant.append(result)
        
        # Sort by relevance score (highest first)
        relevant.sort(key=lambda x: x.get('relevance_score', 0), reverse=True)
        
        return relevant
    
    def save_to_csv(self, mentions: List[Dict[str, Any]], filename: str = None) -> str:
        """Save mentions to CSV file"""
        if not filename:
            filename = f'exa_mentions_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        
        if not mentions:
            logger.warning("No mentions to save")
            return filename
        
        fieldnames = [
            'title', 'url', 'domain', 'content', 'published_date', 'author',
            'search_query', 'relevance_score', 'sentiment', 'content_type',
            'word_count', 'has_contact_info', 'mention_context', 'extracted_at'
        ]
        
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            for mention in mentions:
                row = {field: mention.get(field, '') for field in fieldnames}
                # Truncate long content for CSV readability
                if row['content'] and len(row['content']) > 500:
                    row['content'] = row['content'][:500] + '...'
                writer.writerow(row)
        
        logger.info(f"Saved {len(mentions)} mentions to {filename}")
        return filename
    
    def save_to_json(self, mentions: List[Dict[str, Any]], filename: str = None) -> str:
        """Save mentions to JSON file"""
        if not filename:
            filename = f'exa_mentions_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        
        with open(filename, 'w', encoding='utf-8') as jsonfile:
            json.dump(mentions, jsonfile, indent=2, ensure_ascii=False)
        
        logger.info(f"Saved {len(mentions)} mentions to {filename}")
        return filename
    
    def generate_dashboard_csv(self, mentions: List[Dict[str, Any]], filename: str = None) -> str:
        """Generate CSV in format compatible with Attribution Dashboard"""
        if not filename:
            filename = f'dashboard_exa_mentions_{datetime.now().strftime("%Y%m%d")}.csv'
        
        # Aggregate mentions by date
        daily_counts = {}
        for mention in mentions:
            try:
                date_str = mention.get('published_date', mention.get('extracted_at', ''))
                if date_str:
                    # Parse date
                    if 'T' in date_str:
                        date = datetime.fromisoformat(date_str.replace('Z', '+00:00')).date()
                    else:
                        date = datetime.fromisoformat(date_str).date()
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
    
    def generate_summary_report(self, mentions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate summary statistics for the mentions"""
        if not mentions:
            return {}
        
        # Basic stats
        total_mentions = len(mentions)
        domains = [m.get('domain', '') for m in mentions if m.get('domain')]
        unique_domains = len(set(domains))
        
        # Sentiment breakdown
        sentiments = {}
        for mention in mentions:
            sentiment = mention.get('sentiment', 'neutral')
            sentiments[sentiment] = sentiments.get(sentiment, 0) + 1
        
        # Content type breakdown
        content_types = {}
        for mention in mentions:
            content_type = mention.get('content_type', 'general')
            content_types[content_type] = content_types.get(content_type, 0) + 1
        
        # Top domains
        domain_counts = {}
        for domain in domains:
            if domain:
                domain_counts[domain] = domain_counts.get(domain, 0) + 1
        
        top_domains = sorted(domain_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        
        # Average relevance score
        relevance_scores = [m.get('relevance_score', 0) for m in mentions]
        avg_relevance = sum(relevance_scores) / len(relevance_scores) if relevance_scores else 0
        
        return {
            'total_mentions': total_mentions,
            'unique_domains': unique_domains,
            'sentiment_breakdown': sentiments,
            'content_type_breakdown': content_types,
            'top_domains': top_domains,
            'average_relevance_score': round(avg_relevance, 3),
            'high_relevance_mentions': len([m for m in mentions if m.get('relevance_score', 0) > 0.7])
        }

def main():
    """Main execution function"""
    # Configuration
    BRAND_NAME = os.getenv('BRAND_NAME', 'YourBrandName')  # Replace with your brand name
    API_KEY = os.getenv('EXA_API_KEY')  # Set this in your environment
    
    if not API_KEY:
        logger.error("Please set EXA_API_KEY environment variable")
        print("\nTo get an Exa API key:")
        print("1. Visit https://exa.ai")
        print("2. Sign up for an account")
        print("3. Get your API key from the dashboard")
        print("4. Set it as environment variable: export EXA_API_KEY='your-key-here'")
        return
    
    # Initialize integration
    exa = ExaSearchIntegration(api_key=API_KEY, brand_name=BRAND_NAME)
    
    # Search for mentions from last 7 days
    logger.info(f"Starting web search for brand: {BRAND_NAME}")
    mentions = exa.search_mentions(days_back=7, max_results=50)
    
    if mentions:
        logger.info(f"Total relevant mentions found: {len(mentions)}")
        
        # Save in multiple formats
        csv_file = exa.save_to_csv(mentions)
        json_file = exa.save_to_json(mentions)
        dashboard_csv = exa.generate_dashboard_csv(mentions)
        
        # Generate summary report
        summary = exa.generate_summary_report(mentions)
        
        # Print summary
        print("\n=== EXA SEARCH SUMMARY ===")
        print(f"Brand: {BRAND_NAME}")
        print(f"Total Mentions: {summary.get('total_mentions', 0)}")
        print(f"Unique Domains: {summary.get('unique_domains', 0)}")
        print(f"Average Relevance Score: {summary.get('average_relevance_score', 0)}")
        print(f"High Relevance Mentions: {summary.get('high_relevance_mentions', 0)}")
        print(f"Sentiment Breakdown: {summary.get('sentiment_breakdown', {})}")
        
        if summary.get('top_domains'):
            print(f"\nTop Domains:")
            for domain, count in summary['top_domains'][:5]:
                print(f"  - {domain}: {count} mentions")
        
        print(f"\nFiles Generated:")
        print(f"  - Detailed CSV: {csv_file}")
        print(f"  - JSON Data: {json_file}")
        print(f"  - Dashboard CSV: {dashboard_csv}")
        print(f"\nTo import into Attribution Dashboard:")
        print(f"  1. Open your dashboard")
        print(f"  2. Go to Mentions Graph section")
        print(f"  3. Upload {dashboard_csv}")
        
    else:
        logger.warning("No relevant mentions found")
        print("\nTips for better results:")
        print("- Make sure your brand name is spelled correctly")
        print("- Try searching for a more well-known brand to test")
        print("- Check if your brand has recent online mentions")

if __name__ == "__main__":
    main() 