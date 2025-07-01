# Multi-Platform API Integration Guide (YouTube, TikTok & Reddit)

This guide explains how to use the ScrapeCreators API integration for comprehensive brand mention tracking across YouTube, TikTok, and Reddit platforms.

## 🚀 Quick Start

### 1. Set Up Your Environment

```bash
# Set your API key
export SCRAPE_CREATORS_API_KEY="your-api-key-here"
export BRAND_NAME="YourBrandName"

# Or create a .env file
echo "SCRAPE_CREATORS_API_KEY=your-api-key-here" > .env
echo "BRAND_NAME=YourBrandName" >> .env
```

### 2. Install Dependencies

```bash
pip install requests python-dotenv
```

### 3. Run the Example

```bash
python example_usage.py
```

## 📚 API Reference

### YouTube Search

```python
from scrape_creators_integration import ScrapeCreatorsIntegration

# Initialize
scraper = ScrapeCreatorsIntegration(api_key="your-key", brand_name="YourBrand")

# Basic YouTube search
result = scraper.search_youtube(query="YourBrand")

# Advanced YouTube search with filters
result = scraper.search_youtube(
    query="YourBrand",
    upload_date='week',     # hour, today, week, month, year
    sort_by='view_count',   # relevance, upload_date, view_count, rating
    filter_type='video'     # Only works with query alone
)

# With pagination
result = scraper.search_youtube(
    query="YourBrand",
    continuation_token="EooDEg..."  # From previous response
)
```

### Reddit Search

```python
# Basic Reddit search
result = scraper.search_reddit(query="YourBrand")

# Advanced Reddit search with filters
result = scraper.search_reddit(
    query="YourBrand",
    sort='relevance',       # relevance, hot, top, new, comments
    timeframe='week',       # hour, day, week, month, year, all
    trim=True               # Get trimmed response
)

# With pagination
result = scraper.search_reddit(
    query="YourBrand",
    after="t3_1ihh437"      # From previous response
)
```

### Basic TikTok Search

```python
# Simple search
result = scraper.search_tiktok(query="OpenAI", trim=True)
print(f"Found {len(result['search_item_list'])} videos")
```

### Advanced Search Options

```python
# Search with all parameters
result = scraper.search_tiktok(
    query="artificial intelligence",
    date_posted="7d",      # Time frame (if supported)
    sort_by="popularity",  # Sort criteria (if supported)
    region="US",           # 2-letter country code for proxy
    cursor=None,           # For pagination
    trim=True              # Get trimmed response
)
```

### Fetch Brand Mentions

```python
# Get YouTube mentions
youtube_mentions = scraper.fetch_youtube_mentions(
    days_back=7,        # Filter by upload date
    max_results=50      # Maximum number of results to fetch
)

# Get TikTok mentions
tiktok_mentions = scraper.fetch_tiktok_mentions(
    days_back=7,        # Not directly used for TikTok (API limitation)
    max_results=50      # Maximum number of results to fetch
)

# Get Reddit mentions
reddit_mentions = scraper.fetch_reddit_mentions(
    days_back=7,        # Maps to Reddit timeframe filters
    max_results=50      # Maximum number of results to fetch
)

# Get mentions from all platforms
all_mentions = scraper.fetch_mentions(
    platforms=['youtube', 'tiktok', 'reddit'],
    days_back=7
)

# Process YouTube results
for mention in youtube_mentions:
    print(f"Platform: {mention['platform']} ({mention['content_type']})")
    print(f"Channel: {mention['author']}")
    print(f"Title: {mention['content']}")
    print(f"Views: {mention['engagement']['views']}")
    print(f"Duration: {mention['video_duration']} seconds")
    print(f"URL: {mention['url']}")

# Process TikTok results
for mention in tiktok_mentions:
    print(f"Author: {mention['author']}")
    print(f"Content: {mention['content']}")
    print(f"Likes: {mention['engagement']['likes']}")
    print(f"URL: {mention['url']}")

# Process Reddit results
for mention in reddit_mentions:
    print(f"Platform: {mention['platform']} ({mention['content_type']})")
    print(f"Title: {mention['title']}")
    print(f"Author: u/{mention['author']}")
    print(f"Subreddit: r/{mention['subreddit']}")
    print(f"Score: {mention['engagement']['score']}")
    print(f"Comments: {mention['engagement']['comments']}")
    print(f"Upvote ratio: {mention['engagement']['upvote_ratio']:.2%}")
    print(f"URL: {mention['url']}")
```

## 🔧 Key Features

### 1. Automatic Query Variations

The integration automatically searches for multiple variations of your brand:

- Direct brand name: `"YourBrand"`
- Hashtag format: `"#yourbrand"`
- Mention format: `"@yourbrand"`
- Exact match: `"YourBrand"`

### 2. Data Processing

Each YouTube video/short/live stream is processed into a standardized format:

```python
{
    'id': 'video_id',
    'platform': 'youtube',
    'content_type': 'video',  # video, short, live
    'content': 'video title',
    'author': 'Channel Name',
    'author_username': 'channel_handle',
    'author_id': 'channel_id',
    'created_at': '2024-01-01T12:00:00',
    'url': 'https://www.youtube.com/watch?v=video_id',
    'engagement': {
        'views': 50000,
        'likes': 0,      # Not available in search results
        'comments': 0,   # Not available in search results
        'shares': 0      # Not available in search results
    },
    'video_duration': 300,  # seconds
    'thumbnail': 'https://...',
    'badges': ['4K', 'CC'],
    'sentiment': 'positive',
    'relevance_score': 0.8,
    'extracted_at': '2024-01-01T12:00:00'
}
```

Each TikTok video is processed into a standardized format:

```python
{
    'id': 'video_id',
    'platform': 'tiktok',
    'content': 'video description',
    'author': 'display_name',
    'author_username': 'username',
    'author_followers': 12345,
    'created_at': '2024-01-01T12:00:00',
    'url': 'https://www.tiktok.com/@user/video/id',
    'engagement': {
        'likes': 1000,
        'shares': 50,
        'comments': 25,
        'plays': 5000
    },
    'video_duration': 30.5,
    'hashtags': ['#ai', '#tech'],
    'sentiment': 'positive',
    'relevance_score': 0.8,
    'extracted_at': '2024-01-01T12:00:00'
}
```

Each Reddit post is processed into a standardized format:

```python
{
    'id': 'post_id',
    'platform': 'reddit',
    'content_type': 'text',  # text or link
    'content': 'post title and content',
    'title': 'post title',
    'author': 'username',
    'author_username': 'username',
    'subreddit': 'subreddit_name',
    'subreddit_prefixed': 'r/subreddit_name',
    'subreddit_subscribers': 58838,
    'created_at': '2024-01-01T12:00:00',
    'url': 'https://www.reddit.com/r/subreddit/comments/...',
    'engagement': {
        'score': 361,
        'ups': 400,
        'downs': 39,
        'comments': 102,
        'upvote_ratio': 0.91
    },
    'domain': 'self.subreddit',
    'is_self_post': True,
    'over_18': False,
    'spoiler': False,
    'locked': False,
    'stickied': False,
    'gilded': 0,
    'total_awards': 0,
    'sentiment': 'positive',
    'relevance_score': 0.8,
    'extracted_at': '2024-01-01T12:00:00'
}
```

### 3. Pagination Support

The integration handles pagination automatically:

```python
# Fetch with pagination
tiktok_mentions = scraper.fetch_tiktok_mentions(max_results=100)
# Will automatically follow pagination cursors

reddit_mentions = scraper.fetch_reddit_mentions(max_results=100)
# Will automatically follow pagination tokens

youtube_mentions = scraper.fetch_youtube_mentions(max_results=100)
# Will automatically follow continuation tokens
```

### 4. Export Options

```python
# Save to CSV
csv_file = scraper.save_to_csv(mentions, 'tiktok_mentions.csv')

# Save to JSON
json_file = scraper.save_to_json(mentions, 'tiktok_mentions.json')

# Generate dashboard-compatible CSV
dashboard_csv = scraper.generate_dashboard_csv(mentions, 'dashboard.csv')
```

## 🔍 Error Handling

The integration includes comprehensive error handling:

```python
try:
    result = scraper.search_tiktok(query="test")
except requests.exceptions.RequestException as e:
    print(f"API request failed: {e}")
except json.JSONDecodeError as e:
    print(f"Invalid JSON response: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
```

## 📊 Analytics Features

### Sentiment Analysis

Basic sentiment analysis is performed on video descriptions:

- `positive`: Contains positive keywords
- `negative`: Contains negative keywords
- `neutral`: Neutral or mixed sentiment

### Relevance Scoring

Each mention gets a relevance score (0.0 to 1.0) based on:

- Direct brand mentions
- Context keywords
- Content length

### Engagement Metrics

Track comprehensive engagement data across platforms:

**YouTube:**

- Views (viewCountInt)
- Video duration (lengthSeconds)
- Upload date (publishedTime)
- Channel subscribers (not available in search)

**TikTok:**

- Likes (digg_count)
- Comments (comment_count)
- Shares (share_count)
- Plays (play_count)

## 🚨 Rate Limiting

The integration includes built-in rate limiting:

- 1 second delay between paginated requests
- 2 second delay between different queries
- Automatic retry logic for failed requests

## 🔐 Authentication

The ScrapeCreators API uses the `x-api-key` header format:

```python
headers = {
    'x-api-key': 'your-api-key',
    'Content-Type': 'application/json'
}
```

## 📝 Example Output

### Console Output

```
🚀 Starting TikTok mention extraction for: OpenAI
🔑 API Key: sk-1234...

📱 Example 1: Simple TikTok search
✅ Found 25 videos for 'OpenAI'

🔄 Example 3: Fetch and process brand mentions
✅ Processed 25 mentions

🏆 Top performing mention:
   👤 Author: TechReviewer (@techreviewer)
   💬 Content: Amazing new AI technology from OpenAI! This is revolutionary...
   ❤️  Likes: 15,432
   💬 Comments: 234
   🔗 URL: https://www.tiktok.com/@techreviewer/video/1234567890
```

### CSV Output

```csv
id,platform,content,author,author_username,author_followers,created_at,url,likes,shares,comments,plays,video_duration,hashtags,sentiment,relevance_score,extracted_at
1234567890,tiktok,"Amazing AI tech!",TechReviewer,techreviewer,50000,2024-01-01T12:00:00,https://www.tiktok.com/@techreviewer/video/1234567890,15432,89,234,125000,30.5,"#ai, #tech",positive,0.9,2024-01-01T13:00:00
```

## 🐛 Troubleshooting

### Common Issues

1. **Invalid API Key**

   ```
   Error: 401 Unauthorized
   Solution: Check your SCRAPE_CREATORS_API_KEY
   ```

2. **No Results Found**

   ```
   Solution: Try different query variations or check if your brand has TikTok presence
   ```

3. **Rate Limiting**
   ```
   Error: 429 Too Many Requests
   Solution: The integration handles this automatically with delays
   ```

### Debug Mode

Enable debug logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 🔗 Integration with Attribution Dashboard

The generated CSV files are compatible with your attribution dashboard:

1. Run the TikTok extraction:

   ```bash
   python scrape_creators_integration.py
   ```

2. Upload the generated `dashboard_mentions_YYYYMMDD.csv` to your dashboard

3. The data will appear in your mentions graph automatically

## 📞 Support

If you encounter issues:

1. Check your API key is valid
2. Verify internet connection
3. Review the error logs
4. Test with the `test_tiktok_api.py` script

For ScrapeCreators API issues, contact their support team.
