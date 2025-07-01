# Attribution Dashboard

![Social Listening Dashboard](https://github.com/TheMattBerman/attribution-dashboard-public/raw/main/social-listening-dashboard.jpg)

A comprehensive social media monitoring and attribution tracking dashboard that helps you understand where your brand mentions are coming from across the internet.

## Features

- **Multi-Platform Monitoring**: Track mentions across TikTok, YouTube, Reddit, and the wider web
- **AI-Powered Sentiment Analysis**: Analyze sentiment of mentions using advanced AI models
- **Real-Time Analytics**: View your brand's performance metrics in real-time
- **Google Integration**: Connect Google Search Console and GA4 for branded search tracking
- **Beautiful Dashboard**: Modern, responsive UI with dark mode and real-time updates
- **Caching System**: Efficient data caching to minimize API calls

## 🔥 Key Features

### Real-Time Mentions Graph

- **Accurate Data Representation**: The mentions graph now automatically reflects your actual mentions data for both 7-day and 30-day timeframes
- **Live Updates**: Chart data updates automatically when new mentions are fetched from APIs or imported via CSV
- **Dynamic Switching**: Toggle between 7-day and 30-day views with accurate counts and daily breakdowns
- **Real-time Refresh**: Use the refresh button to get the latest data and update the graph immediately

### How the Mentions Graph Works

1. **Data Source**: Pulls from your actual mentions stored in `dashboardState.liveFeed.mentions`
2. **Time Aggregation**: Groups mentions by day for the selected timeframe (7 or 30 days)
3. **Auto-Update**: Refreshes automatically when:
   - New mentions are fetched from social media APIs
   - Web mentions are retrieved via Exa Search
   - CSV data is imported
   - The refresh button is clicked
   - Timeframe is switched between 7d/30d

### Social Listening & Attribution

- **Multi-Platform Monitoring**: Track mentions across Twitter/X, Reddit, Discord, TikTok, YouTube, and web
- **Sentiment Analysis**: Advanced sentiment tracking with confidence scores and emotional categories
- **Attribution Scoring**: Calculate attribution impact based on mentions, engagement, and brand signals
- **Real-time Feed**: Live stream of brand mentions with filtering and export capabilities

### Analytics & Insights

- **Signal Tracking**: Monitor branded search volume, direct traffic, community engagement
- **Campaign Attribution**: Track marketing campaign performance and brand mention correlation
- **Data Export**: Export mentions, charts, and analytics data in CSV/PNG formats
- **Historical Analysis**: View trends over 7-day and 30-day periods

## Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/attribution-dashboard-public.git
   cd attribution-dashboard-public
   ```

2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Configure your environment**

   ```bash
   cp config.env.example .env
   # Edit .env with your API keys
   ```

4. **Start the dashboard**

   ```bash
   python backend_server.py
   ```

5. **Open your browser** to `http://localhost:8080`

## Required API Keys

At minimum, you'll need:

- **BRAND_NAME**: Your brand name to monitor
- **SCRAPE_CREATORS_API_KEY**: For social media monitoring ([Get key](https://scrapecreators.com/))
- **EXA_API_KEY**: For web-wide mention tracking ([Get key](https://exa.ai/))

## Optional Enhancements

- **OpenRouter API**: For AI-powered sentiment analysis ([Get key](https://openrouter.ai/))
- **Google APIs**: For branded search and direct traffic tracking
- **Email Marketing APIs**: Connect Mailchimp, ConvertKit, or Klaviyo
- **CRM Integration**: Connect HubSpot, Pipedrive, or Calendly

## Documentation

- **[Quick Start Guide](QUICK_START.md)** - Get up and running in 30 seconds
- [Setup Guide](SETUP_GUIDE.md) - Detailed setup instructions
- [API Configuration](API_FIXES_SUMMARY.md) - API setup details
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues and solutions

## Architecture

The dashboard consists of:

- **Backend**: Python Flask server with API integrations
- **Frontend**: Vanilla JavaScript with real-time updates
- **Caching**: Local file-based caching system
- **APIs**: Modular integration system for various data sources

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## 🛠 Roadmap & To-Do

### 🗄 **Database Integration**

- **Supabase Integration**: Add persistent data storage for historical tracking, saved reports, and user preferences
- **Data Export**: Enable CSV/JSON exports of historical data
- **Custom Date Ranges**: Store and retrieve data for custom time periods

### 🌐 **Enhanced Web Monitoring**

- **Comprehensive Exa Integration**: Expand beyond basic mentions to include sentiment analysis, source categorization, and trend detection
- **Advanced Web Scraping**: Monitor news sites, forums, and industry publications
- **Competitor Tracking**: Compare your brand mentions against competitors

### 📱 **Extended Social Media Coverage**

- **LinkedIn Mentions**: Track professional discussions and industry content
- **Facebook Mentions**: Monitor public posts and page interactions
- **Instagram Mentions**: Track hashtags, stories, and public posts
- **X (Twitter) Mentions**: Real-time tweet monitoring and engagement tracking

> **Note**: Public APIs are not available for all social platforms. Additional integrations may require:
>
> - Custom development with specialized API keys
> - Third-party services like RapidAPI or Apify
> - Web scraping solutions with proper rate limiting and compliance

### 🤖 **AI & Analytics Enhancements**

- **Advanced Sentiment Analysis**: Multi-language support and emotion detection
- **Trend Prediction**: AI-powered forecasting based on historical data
- **Automated Reporting**: Scheduled reports with key insights and recommendations
- **Smart Alerts**: Custom notifications for significant changes or opportunities

### 🔗 **Additional Integrations**

- **More Email Platforms**: Constant Contact, AWeber, GetResponse
- **E-commerce Platforms**: Shopify, WooCommerce attribution tracking
- **Ad Platforms**: Google Ads, Facebook Ads, LinkedIn Ads performance correlation
- **Customer Support**: Zendesk, Intercom, Freshdesk integration

### 📊 **Advanced Features**

- **Multi-Brand Support**: Monitor multiple brands from one dashboard
- **Team Collaboration**: User roles, shared dashboards, and commenting
- **Custom Metrics**: Define and track brand-specific KPIs
- **API Rate Optimization**: Smart caching and request batching for better performance

## Support

For questions or issues, please open a GitHub issue or reach out to the community.

## Built By

Created with 🔥 by [Matt Berman](https://bigplayers.co) – CEO of [Emerald Digital](https://emerald.digital) and creator of the _Big Players_ newsletter.  
Follow me on [X/Twitter](https://twitter.com/themattberman) for marketing, AI, and growth systems.

Want more tools like this? → [BigPlayers.co](https://bigplayers.co)
