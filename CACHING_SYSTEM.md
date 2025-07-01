# Attribution Dashboard - Caching System

## 🚀 **Overview**

The Attribution Dashboard now includes a smart caching system that reduces API calls and improves performance by storing mention data locally.

## 📁 **How It Works**

### **Data Flow:**

1. **User triggers data fetch** → Calls live APIs
2. **Data gets cached locally** → Saves to `data_cache/mentions_cache.json`
3. **Dashboard loads from cache** → Fast, no API calls needed
4. **Cache expires after 24 hours** → Automatically suggests refresh

### **File Structure:**

```
attribution-dashboard/
├── data_cache/
│   └── mentions_cache.json    # Cached mention data (623KB)
└── backend_server.py          # Cache management logic
```

## 🎛️ **Dashboard Controls**

### **Live Feed Section - New Buttons:**

| Button                  | Action                 | Purpose                     |
| ----------------------- | ---------------------- | --------------------------- |
| **Refresh Feed**        | Load from cache        | Quick refresh of display    |
| **🔄 Fetch Fresh Data** | Call live APIs + cache | Get new data from APIs      |
| **📁 Cache Status**     | Check cache info       | See cache age, size, status |

## 🔧 **API Endpoints**

### **GET `/api/fetch-mentions`**

- **Default behavior:** Loads from cache if available
- **Parameters:** `days_back=7`, `platform=all`, `force_refresh=true`
- **Response:** Includes `source: "cache"` or `source: "empty"`

### **POST `/api/refresh-mentions`**

- **Action:** Fetches fresh data from APIs and saves to cache
- **Body:** `{"days_back": 7, "platform": "all"}`
- **Response:** Includes `source: "live_api"`, `cached: true`

### **GET `/api/cache-status`**

- **Action:** Returns cache file information
- **Response:** File age, size, total mentions, staleness

## 💡 **Benefits**

### ✅ **Performance**

- **No repeated API calls** - Data loads instantly from cache
- **Reduced costs** - Fewer API requests to ScrapeCreators/Exa
- **Faster dashboard** - No waiting for API responses

### ✅ **User Experience**

- **Manual control** - User decides when to fetch fresh data
- **Cache transparency** - Clear indication of data source and age
- **Offline capability** - Dashboard works with cached data

### ✅ **Development**

- **Testing friendly** - Work with cached data during development
- **Debug easier** - Consistent data set for troubleshooting

## 📊 **Current Cache Stats**

- **File:** `data_cache/mentions_cache.json` (623KB)
- **Content:** 300 mentions from Reddit, YouTube, TikTok, and Web sources
- **Freshness:** Auto-expires after 24 hours
- **Filtering:** Supports 7-day and 30-day timeframes from cached data

## 🛠️ **Technical Details**

### **Cache File Format:**

```json
{
  "timestamp": "2025-06-29T21:51:32",
  "brand_name": "Emerald Digital",
  "total_count": 300,
  "mentions": [
    {
      "id": "unique_id",
      "timestamp": "2025-06-29T...",
      "platform": "reddit|youtube|tiktok|web",
      "content": "mention content...",
      "source": "reddit.com",
      "title": "post title",
      "author": "username",
      "sentiment": "neutral|positive|negative",
      "url": "https://..."
    }
  ]
}
```

### **Backend Logic:**

- **`load_cached_mentions()`** - Loads and validates cache
- **`save_mentions_to_cache()`** - Saves API data to cache
- **Data normalization** - Ensures consistent field names across APIs
- **Timestamp filtering** - Filters cached data by timeframe

## 🔄 **Workflow Examples**

### **First Time Setup:**

1. Open dashboard → Shows "No cached data"
2. Click "Fetch Fresh Data" → Calls APIs, saves 300 mentions
3. Dashboard displays real data from cache

### **Daily Usage:**

1. Open dashboard → Loads instantly from cache
2. Click "Cache Status" → Shows "✅ FRESH, 2 hours old"
3. Work with data → No API calls needed

### **Weekly Refresh:**

1. Click "Cache Status" → Shows "⚠️ STALE, 25 hours old"
2. Click "Fetch Fresh Data" → Gets fresh data, updates cache
3. Continue working → Fresh data available

## 🚫 **What's NOT Cached**

- **Dashboard metrics** (branded search, direct traffic) - Still uses live/estimated data
- **GA4 data** - Will be live when configured
- **API connection testing** - Always live

This caching system strikes the perfect balance between performance and data freshness!
