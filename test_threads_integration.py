#!/usr/bin/env python3
"""
Test script for Threads integration
Tests the ScrapeCreators Threads API integration with the Attribution Dashboard
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import our new Threads integration
try:
    from threads_integration import ThreadsIntegration
    print("✅ Successfully imported ThreadsIntegration")
except ImportError as e:
    print(f"❌ Failed to import ThreadsIntegration: {e}")
    sys.exit(1)

def main():
    print("🧵 Testing Threads Integration for Attribution Dashboard")
    print("=" * 60)
    
    # Get API key
    api_key = os.getenv('SCRAPE_CREATORS_API_KEY')
    brand_name = os.getenv('BRAND_NAME', 'Tesla')  # Default to Tesla for testing
    
    if not api_key:
        print("❌ SCRAPE_CREATORS_API_KEY not found in environment variables")
        print("Please set your ScrapeCreators API key in the .env file")
        return
    
    print(f"🏷️  Brand: {brand_name}")
    print(f"🔑 API Key: {api_key[:8]}***")
    print()
    
    # Initialize Threads integration
    try:
        threads_client = ThreadsIntegration(api_key, brand_name)
        print("✅ ThreadsIntegration initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize ThreadsIntegration: {e}")
        return
    
    # Test 1: Basic search functionality
    print("\n📝 Test 1: Basic Threads search")
    try:
        result = threads_client.search_threads(brand_name, trim=True)
        if result.get('success', False):
            posts_count = len(result.get('posts', []))
            print(f"✅ Search successful - Found {posts_count} posts")
            
            # Show sample data if posts found
            if posts_count > 0:
                first_post = result['posts'][0]
                print(f"   Sample post ID: {first_post.get('id', 'N/A')}")
                print(f"   Author: {first_post.get('user', {}).get('username', 'N/A')}")
                content = ""
                text_fragments = first_post.get('text_post_app_info', {}).get('text_fragments', {}).get('fragments', [])
                for fragment in text_fragments:
                    if fragment.get('fragment_type') == 'plaintext':
                        content += fragment.get('plaintext', '')
                if content:
                    print(f"   Content: {content[:100]}{'...' if len(content) > 100 else ''}")
        else:
            print(f"❌ Search returned success=false")
    except Exception as e:
        print(f"❌ Search test failed: {e}")
    
    # Test 2: Fetch mentions with processing
    print("\n🔍 Test 2: Fetch processed mentions")
    try:
        mentions = threads_client.fetch_threads_mentions(days_back=7, max_results=10)
        print(f"✅ Fetched {len(mentions)} processed mentions")
        
        if mentions:
            # Show sentiment breakdown
            sentiments = {}
            platforms = set()
            for mention in mentions:
                sentiment = mention.get('sentiment', 'unknown')
                sentiments[sentiment] = sentiments.get(sentiment, 0) + 1
                platforms.add(mention.get('platform', 'unknown'))
            
            print(f"   Platforms: {', '.join(platforms)}")
            print(f"   Sentiment breakdown: {dict(sentiments)}")
            
            # Show sample processed mention
            sample = mentions[0]
            print(f"\n   Sample processed mention:")
            print(f"   - ID: {sample.get('id')}")
            print(f"   - Platform: {sample.get('platform')}")
            print(f"   - Author: {sample.get('author')}")
            print(f"   - Content: {sample.get('content', '')[:100]}{'...' if len(sample.get('content', '')) > 100 else ''}")
            print(f"   - Sentiment: {sample.get('sentiment')}")
            print(f"   - Created: {sample.get('created_at')}")
            print(f"   - Engagement: {sample.get('engagement', {})}")
    except Exception as e:
        print(f"❌ Mentions processing test failed: {e}")
    
    # Test 3: Data export functionality
    print("\n💾 Test 3: Data export")
    try:
        if 'mentions' in locals() and mentions:
            # Test CSV export
            csv_file = threads_client.save_to_csv(mentions, 'test_threads_export.csv')
            print(f"✅ CSV export successful: {csv_file}")
            
            # Test JSON export
            json_file = threads_client.save_to_json(mentions, 'test_threads_export.json')
            print(f"✅ JSON export successful: {json_file}")
            
            # Test dashboard CSV
            dashboard_csv = threads_client.generate_dashboard_csv(mentions, 'test_dashboard_threads.csv')
            print(f"✅ Dashboard CSV export successful: {dashboard_csv}")
        else:
            print("⚠️  No mentions to export")
    except Exception as e:
        print(f"❌ Export test failed: {e}")
    
    # Test 4: Sentiment analysis
    print("\n🎭 Test 4: Sentiment analysis")
    test_texts = [
        "I love using this product! It's amazing and works perfectly.",
        "This is okay, nothing special but does the job.",
        "Terrible experience, waste of money. Very disappointed."
    ]
    
    for i, text in enumerate(test_texts, 1):
        try:
            sentiment = threads_client.analyze_sentiment(text)
            detailed = threads_client.analyze_sentiment_detailed(text)
            print(f"   Text {i}: {text[:50]}{'...' if len(text) > 50 else ''}")
            print(f"   Sentiment: {sentiment} (confidence: {detailed.get('confidence', 0):.2f})")
        except Exception as e:
            print(f"   ❌ Sentiment analysis {i} failed: {e}")
    
    print("\n" + "=" * 60)
    print("🎉 Threads integration testing completed!")
    print("\n💡 Next steps:")
    print("   1. Start the backend server: python3 backend_server.py")
    print("   2. Open http://localhost:8080 in your browser")
    print("   3. Navigate to the Live Feed section")
    print("   4. Look for Threads mentions with the 🧵 icon")
    print("   5. Test the platform filter to show only Threads mentions")

if __name__ == "__main__":
    main()