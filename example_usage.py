#!/usr/bin/env python3
"""
Example usage of ScrapeCreators YouTube, TikTok & Reddit API integration
"""

import os
from dotenv import load_dotenv
from scrape_creators_integration import ScrapeCreatorsIntegration

# Load environment variables from .env file
load_dotenv()

def main():
    """Main example function"""
    
    # Configuration - Set these in your environment or .env file
    API_KEY = os.getenv('SCRAPE_CREATORS_API_KEY')
    BRAND_NAME = os.getenv('BRAND_NAME', 'YourBrandName')
    
    if not API_KEY:
        print("❌ Error: Please set SCRAPE_CREATORS_API_KEY in your environment or .env file")
        print("💡 Example: export SCRAPE_CREATORS_API_KEY='your-api-key-here'")
        return
    
    print(f"🚀 Starting YouTube, TikTok & Reddit mention extraction for: {BRAND_NAME}")
    print(f"🔑 API Key: {API_KEY[:8]}...")
    
    # Initialize the scraper
    scraper = ScrapeCreatorsIntegration(api_key=API_KEY, brand_name=BRAND_NAME)
    
    try:
        # Example 1: Simple YouTube search
        print("\n📺 Example 1: Simple YouTube search")
        youtube_result = scraper.search_youtube(query=BRAND_NAME)
        
        videos_found = len(youtube_result.get('videos', []))
        shorts_found = len(youtube_result.get('shorts', []))
        channels_found = len(youtube_result.get('channels', []))
        print(f"✅ YouTube search results for '{BRAND_NAME}':")
        print(f"   • Videos: {videos_found}")
        print(f"   • Shorts: {shorts_found}")
        print(f"   • Channels: {channels_found}")
        
        # Example 2: Simple TikTok search
        print("\n📱 Example 2: Simple TikTok search")
        result = scraper.search_tiktok(query=BRAND_NAME, trim=True)
        
        videos_found = len(result.get('search_item_list', []))
        print(f"✅ Found {videos_found} TikTok videos for '{BRAND_NAME}'")
        
        # Example 3: Advanced YouTube search with filters
        print("\n🔍 Example 3: Advanced YouTube search with filters")
        recent_youtube = scraper.search_youtube(
            query=BRAND_NAME,
            upload_date='this_week',
            sort_by='view_count'
        )
        recent_videos = len(recent_youtube.get('videos', []))
        print(f"✅ Found {recent_videos} recent YouTube videos sorted by views")
        
        # Example 4: Search with additional TikTok parameters
        print("\n🔍 Example 4: Advanced TikTok search with parameters")
        advanced_result = scraper.search_tiktok(
            query=f"#{BRAND_NAME.lower()}",
            region="US",  # Use US proxy
            trim=True
        )
        
        hashtag_videos = len(advanced_result.get('search_item_list', []))
        print(f"✅ Found {hashtag_videos} videos for hashtag '#{BRAND_NAME.lower()}'")
        
        # Example 5: Simple Reddit search
        print("\n📱 Example 5: Simple Reddit search")
        reddit_result = scraper.search_reddit(query=BRAND_NAME, timeframe='week')
        
        reddit_posts = len(reddit_result.get('posts', []))
        print(f"✅ Reddit search results for '{BRAND_NAME}':")
        print(f"   • Posts: {reddit_posts}")
        print(f"   • Success: {reddit_result.get('success', False)}")
        
        # Example 6: Fetch and process YouTube mentions
        print("\n🔄 Example 6: Fetch and process YouTube brand mentions")
        youtube_mentions = scraper.fetch_youtube_mentions(max_results=5)
        
        if youtube_mentions:
            print(f"✅ Processed {len(youtube_mentions)} YouTube mentions")
            
            # Show top YouTube video by views
            top_youtube = max(youtube_mentions, key=lambda x: x.get('engagement', {}).get('views', 0))
            print(f"\n🏆 Top YouTube mention by views:")
            print(f"   👤 Channel: {top_youtube.get('author')}")
            print(f"   📺 Title: {top_youtube.get('content', '')[:80]}...")
            print(f"   👀 Views: {top_youtube.get('engagement', {}).get('views', 0):,}")
            print(f"   ⏱️  Duration: {top_youtube.get('video_duration', 0)} seconds")
            print(f"   🔗 URL: {top_youtube.get('url')}")
        
        # Example 7: Fetch and process Reddit mentions
        print("\n🔄 Example 7: Fetch and process Reddit brand mentions")
        reddit_mentions = scraper.fetch_reddit_mentions(max_results=5)
        
        if reddit_mentions:
            print(f"✅ Processed {len(reddit_mentions)} Reddit mentions")
            
            # Show top Reddit post by score
            top_reddit = max(reddit_mentions, key=lambda x: x.get('engagement', {}).get('score', 0))
            print(f"\n🏆 Top Reddit mention by score:")
            print(f"   📝 Title: {top_reddit.get('title', 'No title')[:80]}...")
            print(f"   👤 Author: u/{top_reddit.get('author', 'unknown')}")
            print(f"   📍 Subreddit: r/{top_reddit.get('subreddit', 'unknown')}")
            print(f"   📊 Score: {top_reddit.get('engagement', {}).get('score', 0)}")
            print(f"   💬 Comments: {top_reddit.get('engagement', {}).get('comments', 0)}")
            print(f"   📈 Upvote ratio: {top_reddit.get('engagement', {}).get('upvote_ratio', 0):.2%}")
            print(f"   🔗 URL: {top_reddit.get('url')}")
        
        # Example 8: Fetch and process TikTok mentions
        print("\n🔄 Example 8: Fetch and process TikTok brand mentions")
        mentions = scraper.fetch_tiktok_mentions(max_results=10)
        
        if mentions:
            print(f"✅ Processed {len(mentions)} mentions")
            
            # Show top engagement
            top_mention = max(mentions, key=lambda x: x.get('engagement', {}).get('likes', 0))
            print(f"\n🏆 Top performing mention:")
            print(f"   👤 Author: {top_mention.get('author')} (@{top_mention.get('author_username')})")
            print(f"   💬 Content: {top_mention.get('content', '')[:100]}...")
            print(f"   ❤️  Likes: {top_mention.get('engagement', {}).get('likes', 0):,}")
            print(f"   💬 Comments: {top_mention.get('engagement', {}).get('comments', 0):,}")
            print(f"   🔗 URL: {top_mention.get('url')}")
            
            # Example 7: Save results and combine platforms
            print("\n💾 Example 7: Save results and combine platforms")
            
            # Combine YouTube, TikTok, and Reddit mentions
            all_mentions = []
            if 'youtube_mentions' in locals():
                all_mentions.extend(youtube_mentions)
            if 'reddit_mentions' in locals():
                all_mentions.extend(reddit_mentions)
            all_mentions.extend(mentions)
            
            csv_file = scraper.save_to_csv(all_mentions, f'{BRAND_NAME.lower()}_all_mentions.csv')
            json_file = scraper.save_to_json(all_mentions, f'{BRAND_NAME.lower()}_all_mentions.json')
            dashboard_csv = scraper.generate_dashboard_csv(all_mentions, f'{BRAND_NAME.lower()}_dashboard.csv')
            
            print(f"📄 Files saved:")
            print(f"   • Detailed CSV: {csv_file}")
            print(f"   • JSON data: {json_file}")
            print(f"   • Dashboard CSV: {dashboard_csv}")
            
            # Example 8: Analytics summary across platforms
            print("\n📊 Example 8: Quick analytics across platforms")
            total_likes = sum(m.get('engagement', {}).get('likes', 0) for m in all_mentions)
            total_comments = sum(m.get('engagement', {}).get('comments', 0) for m in all_mentions)
            total_shares = sum(m.get('engagement', {}).get('shares', 0) for m in all_mentions)
            total_views = sum(m.get('engagement', {}).get('views', 0) for m in all_mentions)
            
            positive_mentions = len([m for m in all_mentions if m.get('sentiment') == 'positive'])
            negative_mentions = len([m for m in all_mentions if m.get('sentiment') == 'negative'])
            
            # Platform breakdown
            platform_breakdown = {}
            for mention in all_mentions:
                platform = mention.get('platform', 'unknown')
                platform_breakdown[platform] = platform_breakdown.get(platform, 0) + 1
            
            print(f"   📈 Total Engagement:")
            print(f"      • Likes: {total_likes:,}")
            print(f"      • Comments: {total_comments:,}")
            print(f"      • Shares: {total_shares:,}")
            print(f"      • Views: {total_views:,}")
            print(f"   📱 Platform Breakdown:")
            for platform, count in platform_breakdown.items():
                print(f"      • {platform.title()}: {count}")
            print(f"   😊 Sentiment:")
            print(f"      • Positive: {positive_mentions}")
            print(f"      • Negative: {negative_mentions}")
            print(f"      • Neutral: {len(all_mentions) - positive_mentions - negative_mentions}")
            
        else:
            print("ℹ️  No mentions found for the specified brand")
        
        print("\n🎉 Example completed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("💡 Make sure your API key is valid and you have internet connection")

def test_api_connection():
    """Test if the API connection works"""
    
    API_KEY = os.getenv('SCRAPE_CREATORS_API_KEY')
    if not API_KEY:
        return False
    
    try:
        scraper = ScrapeCreatorsIntegration(api_key=API_KEY, brand_name="test")
        # Test YouTube, TikTok, and Reddit endpoints
        youtube_result = scraper.search_youtube(query="test")
        tiktok_result = scraper.search_tiktok(query="test", trim=True)
        reddit_result = scraper.search_reddit(query="test", trim=True)
        return True
    except Exception as e:
        print(f"❌ API connection test failed: {e}")
        return False

if __name__ == "__main__":
    print("🔬 ScrapeCreators YouTube, TikTok & Reddit API - Example Usage")
    print("=" * 60)
    
    # Test API connection first
    print("🔌 Testing API connection...")
    if test_api_connection():
        print("✅ API connection successful")
        main()
    else:
        print("❌ API connection failed")
        print("💡 Please check your API key and internet connection") 