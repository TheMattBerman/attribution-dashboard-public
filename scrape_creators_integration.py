#!/usr/bin/env python3
"""
ScrapeCreators Integration Script for Attribution Dashboard
Automatically pull brand mentions from TikTok, X, Discord, Reddit, etc.

Installation:
pip install requests python-dotenv

Usage:
1. Set your ScrapeCreators API key in environment variables or .env file
2. Update BRAND_NAME with your brand name
3. Run: python scrape_creators_integration.py
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

class ScrapeCreatorsIntegration:
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
    
    def search_tiktok(self, query: str, date_posted: str = None, sort_by: str = None, 
                     region: str = None, cursor: int = None, trim: bool = True) -> Dict[str, Any]:
        """
        Search TikTok videos matching a keyword using ScrapeCreators API
        
        Args:
            query (str): Keyword to search for (required)
            date_posted (str): Time frame filter (optional)
            sort_by (str): Sort by criteria (optional)
            region (str): 2-letter country code for proxy location (optional)
            cursor (int): Cursor for pagination (optional)
            trim (bool): Get trimmed response (default: True)
            
        Returns:
            Dict containing the API response
        """
        endpoint = f"{self.base_url}/v1/tiktok/search/keyword"
        
        # Build parameters
        params = {
            'query': query,
            'trim': str(trim).lower()
        }
        
        # Add optional parameters if provided
        if date_posted:
            params['date_posted'] = date_posted
        if sort_by:
            params['sort_by'] = sort_by
        if region:
            params['region'] = region
        if cursor is not None:
            params['cursor'] = cursor
        
        try:
            logger.info(f"Searching TikTok for query: {query}")
            response = self.session.get(endpoint, params=params)
            response.raise_for_status()
            
            data = response.json()
            logger.info(f"TikTok search successful. Found {len(data.get('search_item_list', []))} videos")
            return data
            
        except requests.exceptions.RequestException as e:
            logger.error(f"TikTok API request failed: {e}")
            if hasattr(e, 'response') and e.response is not None:
                logger.error(f"Response status: {e.response.status_code}")
                logger.error(f"Response text: {e.response.text}")
            raise
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}")
            raise
    
    def search_youtube(self, query: str, upload_date: str = None, sort_by: str = None, 
                      filter_type: str = None, continuation_token: str = None) -> Dict[str, Any]:
        """
        Search YouTube videos, channels, playlists, shorts, etc. using ScrapeCreators API
        
        Args:
            query (str): Search query (required)
            upload_date (str): Upload date filter (optional)
            sort_by (str): Sort by criteria (optional)
            filter_type (str): Filter by type - only works with query alone (optional)
            continuation_token (str): Continuation token for pagination (optional)
            
        Returns:
            Dict containing the API response with videos, channels, playlists, shorts, etc.
        """
        endpoint = f"{self.base_url}/v1/youtube/search"
        
        # Build parameters
        params = {
            'query': query
        }
        
        # Add optional parameters if provided
        if upload_date:
            params['uploadDate'] = upload_date
        if sort_by:
            params['sortBy'] = sort_by
        if filter_type:
            params['filter'] = filter_type
        if continuation_token:
            params['continuationToken'] = continuation_token
        
        try:
            logger.info(f"Searching YouTube for query: {query}")
            response = self.session.get(endpoint, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            # Count total results across all types
            total_videos = len(data.get('videos', []))
            total_channels = len(data.get('channels', []))
            total_playlists = len(data.get('playlists', []))
            total_shorts = len(data.get('shorts', []))
            total_lives = len(data.get('lives', []))
            
            logger.info(f"YouTube search successful. Found: {total_videos} videos, "
                       f"{total_channels} channels, {total_playlists} playlists, "
                       f"{total_shorts} shorts, {total_lives} live streams")
            return data
            
        except requests.exceptions.RequestException as e:
            logger.error(f"YouTube API request failed: {e}")
            if hasattr(e, 'response') and e.response is not None:
                logger.error(f"Response status: {e.response.status_code}")
                logger.error(f"Response text: {e.response.text}")
            raise
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}")
            raise
    
    def search_reddit(self, query: str, sort: str = None, timeframe: str = None, 
                     after: str = None, trim: bool = True) -> Dict[str, Any]:
        """
        Search Reddit posts using ScrapeCreators API
        
        Args:
            query (str): Search query (required)
            sort (str): Sort by criteria (optional)
            timeframe (str): Timeframe filter (optional)
            after (str): Pagination token (optional)
            trim (bool): Get trimmed response (default: True)
            
        Returns:
            Dict containing the API response with posts
        """
        endpoint = f"{self.base_url}/v1/reddit/search"
        
        # Build parameters
        params = {
            'query': query,
            'trim': str(trim).lower()
        }
        
        # Add optional parameters if provided
        if sort:
            params['sort'] = sort
        if timeframe:
            params['timeframe'] = timeframe
        if after:
            params['after'] = after
        
        try:
            logger.info(f"Searching Reddit for query: {query}")
            response = self.session.get(endpoint, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            # Count total results
            total_posts = len(data.get('posts', []))
            
            logger.info(f"Reddit search successful. Found {total_posts} posts")
            return data
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Reddit API request failed: {e}")
            if hasattr(e, 'response') and e.response is not None:
                logger.error(f"Response status: {e.response.status_code}")
                logger.error(f"Response text: {e.response.text}")
            raise
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}")
            raise
    
    def fetch_youtube_mentions(self, days_back: int = 7, max_results: int = 100) -> List[Dict[str, Any]]:
        """Fetch brand mentions from YouTube"""
        all_mentions = []
        
        # Build search queries with brand variations
        search_queries = [
            self.brand_name,
            f'"{self.brand_name}"',  # Exact match
            f'{self.brand_name} review',
            f'{self.brand_name} tutorial',
            f'{self.brand_name} unboxing'
        ]
        
        for query in search_queries:
            try:
                # Search with different filters and time frames
                upload_date = None
                if days_back <= 1:
                    upload_date = 'today'
                elif days_back <= 7:
                    upload_date = 'this_week'
                elif days_back <= 30:
                    upload_date = 'this_month'
                
                result = self.search_youtube(
                    query=query,
                    upload_date=upload_date
                )
                
                # Process all content types
                content_types = ['videos', 'shorts', 'lives']
                for content_type in content_types:
                    if content_type in result:
                        for item in result[content_type]:
                            processed_mention = self.process_youtube_mention(item, content_type)
                            if processed_mention:
                                all_mentions.append(processed_mention)
                
                # Handle pagination if continuation token is available
                continuation_token = result.get('continuationToken')
                while continuation_token and len(all_mentions) < max_results:
                    try:
                        logger.info(f"Fetching more YouTube results with continuation token")
                        result = self.search_youtube(
                            query=query,
                            continuation_token=continuation_token
                        )
                        
                        # Process paginated results
                        for content_type in content_types:
                            if content_type in result:
                                for item in result[content_type]:
                                    processed_mention = self.process_youtube_mention(item, content_type)
                                    if processed_mention:
                                        all_mentions.append(processed_mention)
                        
                        continuation_token = result.get('continuationToken')
                        
                        # Rate limiting - be nice to the API
                        time.sleep(1)
                        
                    except Exception as e:
                        logger.error(f"Error in YouTube pagination: {e}")
                        break
                
                # Rate limiting between queries
                time.sleep(2)
                
            except Exception as e:
                logger.error(f"Error searching YouTube for query '{query}': {e}")
                continue
        
        # Remove duplicates based on video ID
        unique_mentions = {}
        for mention in all_mentions:
            video_id = mention.get('id')
            if video_id and video_id not in unique_mentions:
                unique_mentions[video_id] = mention
        
        return list(unique_mentions.values())
    
    def fetch_reddit_mentions(self, days_back: int = 7, max_results: int = 100) -> List[Dict[str, Any]]:
        """Fetch brand mentions from Reddit"""
        all_mentions = []
        
        # Build search queries with brand variations
        search_queries = [
            self.brand_name,
            f'"{self.brand_name}"',  # Exact match
            f'{self.brand_name} review',
            f'{self.brand_name} opinion',
            f'{self.brand_name} experience'
        ]
        
        # Determine timeframe based on days_back
        timeframe = None
        if days_back <= 1:
            timeframe = 'day'
        elif days_back <= 7:
            timeframe = 'week'
        elif days_back <= 30:
            timeframe = 'month'
        elif days_back <= 365:
            timeframe = 'year'
        
        for query in search_queries:
            try:
                # Search with different sort options and timeframes
                result = self.search_reddit(
                    query=query,
                    sort='relevance',
                    timeframe=timeframe,
                    trim=True
                )
                
                # Process posts
                if 'posts' in result:
                    for post in result['posts']:
                        processed_mention = self.process_reddit_mention(post)
                        if processed_mention:
                            all_mentions.append(processed_mention)
                
                # Handle pagination if after token is available
                after = result.get('after')
                while after and len(all_mentions) < max_results:
                    try:
                        logger.info(f"Fetching more Reddit results with after token")
                        result = self.search_reddit(
                            query=query,
                            sort='relevance',
                            timeframe=timeframe,
                            after=after,
                            trim=True
                        )
                        
                        # Process paginated results
                        if 'posts' in result:
                            for post in result['posts']:
                                processed_mention = self.process_reddit_mention(post)
                                if processed_mention:
                                    all_mentions.append(processed_mention)
                        
                        after = result.get('after')
                        
                        # Rate limiting - be nice to the API
                        time.sleep(1)
                        
                    except Exception as e:
                        logger.error(f"Error in Reddit pagination: {e}")
                        break
                
                # Rate limiting between queries
                time.sleep(2)
                
            except Exception as e:
                logger.error(f"Error searching Reddit for query '{query}': {e}")
                continue
        
        # Remove duplicates based on post ID
        unique_mentions = {}
        for mention in all_mentions:
            post_id = mention.get('id')
            if post_id and post_id not in unique_mentions:
                unique_mentions[post_id] = mention
        
        return list(unique_mentions.values())
    
    def fetch_tiktok_mentions(self, days_back: int = 7, max_results: int = 100) -> List[Dict[str, Any]]:
        """Fetch brand mentions from TikTok"""
        all_mentions = []
        
        # Build search queries with brand variations
        search_queries = [
            self.brand_name,
            f'#{self.brand_name.lower()}',
            f'@{self.brand_name.lower()}',
            f'"{self.brand_name}"'  # Exact match
        ]
        
        for query in search_queries:
            try:
                # Search with different time frames if supported
                result = self.search_tiktok(
                    query=query,
                    trim=True
                )
                
                if 'search_item_list' in result:
                    for item in result['search_item_list']:
                        processed_mention = self.process_tiktok_mention(item)
                        if processed_mention:
                            all_mentions.append(processed_mention)
                
                # Handle pagination if cursor is available
                cursor = result.get('cursor')
                while cursor and len(all_mentions) < max_results:
                    try:
                        logger.info(f"Fetching more results with cursor: {cursor}")
                        result = self.search_tiktok(
                            query=query,
                            cursor=cursor,
                            trim=True
                        )
                        
                        if 'search_item_list' in result:
                            for item in result['search_item_list']:
                                processed_mention = self.process_tiktok_mention(item)
                                if processed_mention:
                                    all_mentions.append(processed_mention)
                        
                        cursor = result.get('cursor')
                        
                        # Rate limiting - be nice to the API
                        time.sleep(1)
                        
                    except Exception as e:
                        logger.error(f"Error in pagination: {e}")
                        break
                
                # Rate limiting between queries
                time.sleep(2)
                
            except Exception as e:
                logger.error(f"Error searching TikTok for query '{query}': {e}")
                continue
        
        # Remove duplicates based on aweme_id
        unique_mentions = {}
        for mention in all_mentions:
            video_id = mention.get('id')
            if video_id and video_id not in unique_mentions:
                unique_mentions[video_id] = mention
        
        return list(unique_mentions.values())
    
    def process_youtube_mention(self, youtube_item: Dict[str, Any], content_type: str) -> Optional[Dict[str, Any]]:
        """Process YouTube video/short/live data into standardized mention format"""
        try:
            # Extract basic video info
            video_id = youtube_item.get('id', '')
            channel_info = youtube_item.get('channel', {})
            
            # Build YouTube URL
            video_url = youtube_item.get('url', '')
            
            # Extract creation/publish time
            published_time = youtube_item.get('publishedTime', '')
            if published_time:
                try:
                    created_at = datetime.fromisoformat(published_time.replace('Z', '+00:00')).isoformat()
                except:
                    created_at = datetime.now().isoformat()
            else:
                created_at = datetime.now().isoformat()
            
            # Get video title and description
            title = youtube_item.get('title', '')
            
            # Extract view count
            view_count = youtube_item.get('viewCountInt', 0)
            
            # Extract duration
            duration_seconds = youtube_item.get('lengthSeconds', 0)
            
            processed = {
                'id': video_id,
                'platform': 'youtube',
                'content_type': content_type,  # video, short, live
                'content': title,  # Using title as content since we don't have description
                'author': channel_info.get('title', 'Unknown'),
                'author_username': channel_info.get('handle', '').replace('@', '') if channel_info.get('handle') else '',
                'author_id': channel_info.get('id', ''),
                'created_at': created_at,
                'url': video_url,
                'engagement': {
                    'views': view_count,
                    'likes': 0,  # Not provided in search results
                    'comments': 0,  # Not provided in search results
                    'shares': 0  # Not provided in search results
                },
                'video_duration': duration_seconds,
                'thumbnail': youtube_item.get('thumbnail', ''),
                'badges': youtube_item.get('badges', []),
                'published_time_text': youtube_item.get('publishedTimeText', ''),
                'view_count_text': youtube_item.get('viewCountText', ''),
                'length_text': youtube_item.get('lengthText', ''),
                'sentiment': self.analyze_sentiment(title),
                'relevance_score': self.calculate_relevance(title),
                'extracted_at': datetime.now().isoformat(),
                'raw_data': youtube_item  # Keep original data for debugging
            }
            
            return processed
            
        except Exception as e:
            logger.error(f"Error processing YouTube mention: {e}")
            return None
    
    def process_reddit_mention(self, reddit_post: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Process Reddit post data into standardized mention format"""
        try:
            # Extract basic post info
            post_id = reddit_post.get('id', '')
            subreddit = reddit_post.get('subreddit', '')
            author = reddit_post.get('author', 'Unknown')
            
            # Build Reddit URL
            permalink = reddit_post.get('permalink', '')
            post_url = f"https://www.reddit.com{permalink}" if permalink else reddit_post.get('url', '')
            
            # Extract creation time
            created_utc = reddit_post.get('created_utc', 0)
            if created_utc:
                created_at = datetime.fromtimestamp(created_utc).isoformat()
            else:
                # Fallback to ISO format if available
                created_at_iso = reddit_post.get('created_at_iso', '')
                if created_at_iso:
                    created_at = created_at_iso
                else:
                    created_at = datetime.now().isoformat()
            
            # Get post title and content
            title = reddit_post.get('title', '')
            selftext = reddit_post.get('selftext', '')
            content = f"{title}\n{selftext}".strip() if selftext else title
            
            # Extract engagement metrics
            score = reddit_post.get('score', 0)
            ups = reddit_post.get('ups', 0)
            downs = reddit_post.get('downs', 0)
            num_comments = reddit_post.get('num_comments', 0)
            upvote_ratio = reddit_post.get('upvote_ratio', 0.0)
            
            # Determine post type
            is_self = reddit_post.get('is_self', False)
            domain = reddit_post.get('domain', '')
            post_type = 'text' if is_self else 'link'
            
            processed = {
                'id': post_id,
                'platform': 'reddit',
                'content_type': post_type,
                'content': content,
                'title': title,
                'author': author,
                'author_username': author,  # Reddit uses same for both
                'subreddit': subreddit,
                'subreddit_prefixed': reddit_post.get('subreddit_name_prefixed', f'r/{subreddit}'),
                'subreddit_subscribers': reddit_post.get('subreddit_subscribers', 0),
                'created_at': created_at,
                'url': post_url,
                'engagement': {
                    'score': score,
                    'ups': ups,
                    'downs': downs,
                    'comments': num_comments,
                    'upvote_ratio': upvote_ratio
                },
                'domain': domain,
                'is_self_post': is_self,
                'over_18': reddit_post.get('over_18', False),
                'spoiler': reddit_post.get('spoiler', False),
                'locked': reddit_post.get('locked', False),
                'stickied': reddit_post.get('stickied', False),
                'gilded': reddit_post.get('gilded', 0),
                'total_awards': reddit_post.get('total_awards_received', 0),
                'sentiment': self.analyze_sentiment(content),
                'relevance_score': self.calculate_relevance(content),
                'extracted_at': datetime.now().isoformat(),
                'raw_data': reddit_post  # Keep original data for debugging
            }
            
            return processed
            
        except Exception as e:
            logger.error(f"Error processing Reddit mention: {e}")
            return None
    
    def process_tiktok_mention(self, tiktok_item: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Process TikTok video data into standardized mention format"""
        try:
            aweme_info = tiktok_item.get('aweme_info', {})
            
            # Extract basic video info
            video_id = aweme_info.get('aweme_id', '')
            author_info = aweme_info.get('author', {})
            statistics = aweme_info.get('statistics', {})
            
            # Build TikTok URL
            author_username = author_info.get('unique_id', '')
            video_url = f"https://www.tiktok.com/@{author_username}/video/{video_id}" if author_username and video_id else ""
            
            # Extract creation time
            create_time = aweme_info.get('create_time', 0)
            created_at = datetime.fromtimestamp(create_time).isoformat() if create_time else datetime.now().isoformat()
            
            # Get video description/content
            content = aweme_info.get('desc', '')
            
            processed = {
                'id': video_id,
                'platform': 'tiktok',
                'content': content,
                'author': author_info.get('nickname', author_info.get('unique_id', 'Unknown')),
                'author_username': author_username,
                'author_followers': author_info.get('follower_count', 0),
                'created_at': created_at,
                'url': video_url,
                'engagement': {
                    'likes': statistics.get('digg_count', 0),
                    'shares': statistics.get('share_count', 0),
                    'comments': statistics.get('comment_count', 0),
                    'plays': statistics.get('play_count', 0)
                },
                'video_duration': aweme_info.get('video', {}).get('duration', 0) / 1000,  # Convert to seconds
                'hashtags': self.extract_hashtags(aweme_info.get('text_extra', [])),
                'sentiment': self.analyze_sentiment(content),
                'relevance_score': self.calculate_relevance(content),
                'extracted_at': datetime.now().isoformat(),
                'raw_data': tiktok_item  # Keep original data for debugging
            }
            
            return processed
            
        except Exception as e:
            logger.error(f"Error processing TikTok mention: {e}")
            return None
    
    def extract_hashtags(self, text_extra: List[Dict]) -> List[str]:
        """Extract hashtags from TikTok text_extra field"""
        hashtags = []
        for item in text_extra:
            if item.get('type') == 1:  # Type 1 is hashtag
                hashtag_name = item.get('hashtag_name', '')
                if hashtag_name:
                    hashtags.append(f"#{hashtag_name}")
        return hashtags
    
    def fetch_mentions(self, platforms: List[str] = None, days_back: int = 7) -> List[Dict[str, Any]]:
        """Fetch brand mentions from specified platforms"""
        if platforms is None:
            platforms = ['youtube', 'tiktok', 'reddit', 'twitter', 'discord', 'telegram', 'linkedin']
        
        all_mentions = []
        
        for platform in platforms:
            logger.info(f"Fetching mentions from {platform}...")
            try:
                if platform.lower() == 'youtube':
                    mentions = self.fetch_youtube_mentions(days_back=days_back)
                elif platform.lower() == 'tiktok':
                    mentions = self.fetch_tiktok_mentions(days_back=days_back)
                elif platform.lower() == 'reddit':
                    mentions = self.fetch_reddit_mentions(days_back=days_back)
                else:
                    # For other platforms, use the existing method
                    end_date = datetime.now()
                    start_date = end_date - timedelta(days=days_back)
                    mentions = self.search_platform(platform, start_date, end_date)
                
                all_mentions.extend(mentions)
                logger.info(f"Found {len(mentions)} mentions on {platform}")
            except Exception as e:
                logger.error(f"Error fetching from {platform}: {e}")
        
        return all_mentions
    
    def search_platform(self, platform: str, start_date: datetime, end_date: datetime) -> List[Dict[str, Any]]:
        """Search for brand mentions on specific platform"""
        endpoint = f"{self.base_url}/search/{platform}"
        
        # Build search query with brand variations
        search_terms = [
            self.brand_name,
            self.brand_name.lower(),
            f'"{self.brand_name}"',  # Exact match
            f'@{self.brand_name.lower()}',  # Handle mentions
        ]
        
        params = {
            'query': ' OR '.join(search_terms),
            'start_time': start_date.isoformat(),
            'end_time': end_date.isoformat(),
            'limit': 100,
            'include_replies': True,
            'include_retweets': False if platform == 'twitter' else True
        }
        
        try:
            response = self.session.get(endpoint, params=params)
            response.raise_for_status()
            
            data = response.json()
            mentions = data.get('data', [])
            
            # Process and clean mentions
            processed_mentions = []
            for mention in mentions:
                processed_mention = self.process_mention(mention, platform)
                if processed_mention:
                    processed_mentions.append(processed_mention)
            
            return processed_mentions
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed for {platform}: {e}")
            return []
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error for {platform}: {e}")
            return []
    
    def process_mention(self, mention: Dict[str, Any], platform: str) -> Dict[str, Any]:
        """Process and standardize mention data"""
        try:
            # Extract common fields across platforms
            processed = {
                'id': mention.get('id', ''),
                'platform': platform,
                'content': mention.get('text', mention.get('content', '')),
                'author': mention.get('author', {}).get('username', 'Unknown'),
                'author_followers': mention.get('author', {}).get('followers_count', 0),
                'created_at': mention.get('created_at', ''),
                'url': mention.get('url', ''),
                'engagement': {
                    'likes': mention.get('like_count', 0),
                    'shares': mention.get('retweet_count', mention.get('share_count', 0)),
                    'comments': mention.get('reply_count', mention.get('comment_count', 0))
                },
                'sentiment': self.analyze_sentiment(mention.get('text', mention.get('content', '')), platform),
                'relevance_score': self.calculate_relevance(mention.get('text', mention.get('content', ''))),
                'extracted_at': datetime.now().isoformat()
            }
            
            # Platform-specific processing
            if platform == 'reddit':
                processed['subreddit'] = mention.get('subreddit', '')
                processed['post_type'] = 'comment' if mention.get('parent_id') else 'post'
            elif platform == 'discord':
                processed['server'] = mention.get('guild', {}).get('name', '')
                processed['channel'] = mention.get('channel', {}).get('name', '')
            elif platform == 'linkedin':
                processed['post_type'] = mention.get('type', 'post')
                processed['company'] = mention.get('author', {}).get('company', '')
            
            return processed
            
        except Exception as e:
            logger.error(f"Error processing mention: {e}")
            return None
    
    def analyze_sentiment(self, text: str, platform: str = None) -> str:
        """Enhanced sentiment analysis with Gemini Flash 2 or fallback to rule-based"""
        if not text:
            return 'neutral'
        
        if ENHANCED_SENTIMENT_AVAILABLE:
            try:
                # Use enhanced sentiment analysis with platform context
                context = {
                    'brand': self.brand_name,
                    'platform': platform or 'social_media'
                }
                return get_sentiment_only(text)
            except Exception as e:
                logger.warning(f"Enhanced sentiment analysis failed, using fallback: {e}")
                return self._analyze_sentiment_fallback(text)
        else:
            return self._analyze_sentiment_fallback(text)
    
    def analyze_sentiment_detailed(self, text: str, platform: str = None) -> Dict[str, Any]:
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
                    'platform': platform or 'social_media'
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
            filename = f'mentions_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        
        if not mentions:
            logger.warning("No mentions to save")
            return filename
        
        fieldnames = [
            'id', 'platform', 'content_type', 'content', 'title', 'author', 'author_username', 'author_id', 'author_followers',
            'subreddit', 'subreddit_subscribers', 'created_at', 'url', 'likes', 'shares', 'comments', 'plays', 'views',
            'score', 'ups', 'downs', 'upvote_ratio', 'video_duration', 'hashtags', 'thumbnail', 'badges', 
            'gilded', 'total_awards', 'sentiment', 'relevance_score', 'extracted_at'
        ]
        
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            for mention in mentions:
                row = {
                    'id': mention.get('id', ''),
                    'platform': mention.get('platform', ''),
                    'content_type': mention.get('content_type', ''),
                    'content': mention.get('content', '').replace('\n', ' ')[:500],  # Truncate long content
                    'title': mention.get('title', ''),
                    'author': mention.get('author', ''),
                    'author_username': mention.get('author_username', ''),
                    'author_id': mention.get('author_id', ''),
                    'author_followers': mention.get('author_followers', 0),
                    'subreddit': mention.get('subreddit', ''),
                    'subreddit_subscribers': mention.get('subreddit_subscribers', 0),
                    'created_at': mention.get('created_at', ''),
                    'url': mention.get('url', ''),
                    'likes': mention.get('engagement', {}).get('likes', 0),
                    'shares': mention.get('engagement', {}).get('shares', 0),
                    'comments': mention.get('engagement', {}).get('comments', 0),
                    'plays': mention.get('engagement', {}).get('plays', 0),
                    'views': mention.get('engagement', {}).get('views', 0),
                    'score': mention.get('engagement', {}).get('score', 0),
                    'ups': mention.get('engagement', {}).get('ups', 0),
                    'downs': mention.get('engagement', {}).get('downs', 0),
                    'upvote_ratio': mention.get('engagement', {}).get('upvote_ratio', 0),
                    'video_duration': mention.get('video_duration', 0),
                    'hashtags': ', '.join(mention.get('hashtags', [])),
                    'thumbnail': mention.get('thumbnail', ''),
                    'badges': ', '.join(mention.get('badges', [])),
                    'gilded': mention.get('gilded', 0),
                    'total_awards': mention.get('total_awards', 0),
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
            filename = f'mentions_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        
        with open(filename, 'w', encoding='utf-8') as jsonfile:
            json.dump(mentions, jsonfile, indent=2, ensure_ascii=False)
        
        logger.info(f"Saved {len(mentions)} mentions to {filename}")
        return filename
    
    def generate_dashboard_csv(self, mentions: List[Dict[str, Any]], filename: str = None) -> str:
        """Generate CSV in format compatible with Attribution Dashboard"""
        if not filename:
            filename = f'dashboard_mentions_{datetime.now().strftime("%Y%m%d")}.csv'
        
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
    scraper = ScrapeCreatorsIntegration(api_key=API_KEY, brand_name=BRAND_NAME)
    
    # Fetch mentions from last 7 days (YouTube, TikTok, and Reddit)
    logger.info(f"Starting mention extraction for brand: {BRAND_NAME}")
    mentions = scraper.fetch_mentions(platforms=['youtube', 'tiktok', 'reddit'], days_back=7)
    
    if mentions:
        logger.info(f"Total mentions found: {len(mentions)}")
        
        # Save in multiple formats
        csv_file = scraper.save_to_csv(mentions)
        json_file = scraper.save_to_json(mentions)
        dashboard_csv = scraper.generate_dashboard_csv(mentions)
        
        # Print summary
        platforms = set(m.get('platform') for m in mentions)
        sentiments = {}
        for mention in mentions:
            sentiment = mention.get('sentiment', 'neutral')
            sentiments[sentiment] = sentiments.get(sentiment, 0) + 1
        
        print("\n=== EXTRACTION SUMMARY ===")
        print(f"Brand: {BRAND_NAME}")
        print(f"Total Mentions: {len(mentions)}")
        print(f"Platforms: {', '.join(platforms)}")
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
        logger.warning("No mentions found")

if __name__ == "__main__":
    main() 