# Attribution Dashboard 🚀

A modular, founder-ready marketing dashboard designed for attributionless impact tracking in the era of AI, answer engines, and "dark" social.

![Dashboard Preview](mentions_chart.png)

## ✨ Features

### 🎯 Core Tracking Panels

- **Signals Tracking**: Real-time widgets for branded search volume, direct traffic, inbound mentions, and form fills
- **Real-Time Mentions Graph**: Interactive 7/30-day chart with Chart.js visualization
- **Echoes Log**: Manual logging system for organic mentions and campaign responses
- **Campaign Scorecard**: Comprehensive campaign performance tracking with metrics
- **API Integrations**: Google Search Console, webhooks, and CSV data sources
- **Social Monitoring**: Ready-to-go scripts for X, Reddit, Discord mentions via ScrapeCreators & Exa APIs

### 🎨 UI/UX Features

- **Color-Coded Interface**: Blue (API-tracked), Yellow (Manual), Green (Positive velocity)
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode**: Automatic theme switching based on system preference
- **One-Click Export**: CSV export for all data sections
- **Data Persistence**: Automatic localStorage backup of all your data

### 🔧 Automation Ready

- **CSV Upload**: Support for mentions, signals, and campaign data formats
- **API Integration Panel**: Easy setup for Google Search Console and custom webhooks
- **Social Scripts**: Download ready-to-use Python scripts for automated mention tracking
- **Data Refresh**: One-click refresh from all connected sources

## 🚀 Quick Start (< 10 Minutes)

### 1. Download & Setup

```bash
# Clone or download the repository
git clone https://github.com/your-repo/attribution-dashboard.git
cd attribution-dashboard

# Open in your browser
open index.html
```

### 2. Initial Setup

1. **Welcome Modal**: Click "Get Started" to dismiss the welcome screen
2. **Add Your First Data**:
   - Navigate to "Signals Tracking"
   - Update metrics manually or upload CSV data
3. **Create Campaigns**:
   - Go to "Campaign Scorecard"
   - Click "Add Campaign" to start tracking

### 3. Data Import Options

#### CSV Upload Formats:

**Mentions Data:**

```csv
date,mentions
2024-01-01,45
2024-01-02,67
2024-01-03,52
```

**Signals Data:**

```csv
metric,value
branded search,2847
direct traffic,1234
inbound mentions,89
form fills,23
```

**Campaign Data:**

```csv
campaign,mentions,signups
Q1 Content Push,156,89
Podcast Tour,278,134
```

## 📊 Dashboard Sections

### Signals Tracking Panel

Track your core marketing signals with both automatic and manual input options:

- **Branded Search Volume** (API-tracked)
- **Direct Traffic** (API-tracked)
- **Inbound Mentions** (Manual logging)
- **Form Fills** (Manual logging)

### Real-Time Mentions Graph

Interactive chart showing brand mention trends:

- Toggle between 7-day and 30-day views
- Hover tooltips with detailed data
- Export chart data to CSV
- Custom data import support

### Echoes Log

Manual tracking system for organic activity:

- **Unsolicited Mentions**: Customer references in communities
- **Campaign Responses**: Direct responses to marketing efforts
- **New Activity**: Unexpected sources of brand awareness
- Search and filter functionality

### Campaign Scorecard

Comprehensive campaign performance tracking:

- Campaign name and notes
- Branded search delta percentage
- Total mentions count
- Sign-ups/conversions
- Community buzz indicator
- Edit/delete campaign functionality

## 🔌 API Integrations

### Google Search Console

1. Go to "API Integrations" panel
2. Enter your GSC API key
3. Click "Test Connection"
4. Automatic data refresh every hour

### Custom Webhooks

1. Add webhook URL in integrations panel
2. Set authentication token
3. Configure data mapping
4. Test webhook connection

### CSV/Google Sheets

- Drag & drop CSV files for instant import
- Google Sheets integration for automatic updates
- Multiple data format support

## 🤖 Social Monitoring Scripts

### ScrapeCreators Integration

Download and run the Python script for automated social monitoring:

```python
# Automatically pulls mentions from:
# - X (Twitter)
# - Reddit
# - Discord
# - Other social platforms

python scrape_creators_integration.py
```

### Exa Search Integration

Web-wide mention tracking via search API:

```python
# Searches the open web for brand mentions
# - News articles
# - Blog posts
# - Forum discussions
# - Review sites

python exa_search_integration.py
```

## 📋 Prompts & Worksheets

### Built-in Prompt Library

Ready-to-use attribution tracking prompts:

- **Survey Questions**: "How did you hear about us?"
- **Email Signatures**: Attribution request templates
- **Follow-up Messages**: Post-demo survey prompts

### Weekly Worksheet

Download and print weekly tracking worksheet for manual echo logging:

- Daily monitoring checklist
- Source categorization
- Weekly summary template

## 💾 Data Management

### Automatic Backup

- All data automatically saved to browser localStorage
- No data loss between sessions
- Import/export functionality for data portability

### Export Options

- **JSON Export**: Full data backup for all sections
- **CSV Export**: Chart data, campaigns, signals, echoes
- **Notion Integration**: Copy-paste ready formats

## 🎯 Use Cases

### For Founders

- Track organic growth and word-of-mouth spread
- Monitor campaign effectiveness without cookies
- Identify which marketing activities drive real impact

### For Marketers

- Attribution tracking in privacy-first world
- Community buzz and sentiment monitoring
- Campaign ROI measurement beyond traditional metrics

### For Growth Teams

- Social listening and mention tracking
- Direct traffic and branded search analysis
- User acquisition source identification

## 🔧 Customization

### Adding New Metrics

1. Update `dashboardState.signals` in `app.js`
2. Add new widget HTML in `index.html`
3. Update CSS classes for styling
4. Add export functionality

### Custom Integrations

1. Add API credentials in settings
2. Create data fetch functions
3. Map data to dashboard format
4. Set up automatic refresh

## 📱 Browser Support

- **Chrome/Edge**: Full support with all features
- **Firefox**: Full support with all features
- **Safari**: Full support with all features
- **Mobile**: Responsive design works on all devices

## 🚨 Privacy & Security

- **No Server Required**: Runs entirely in browser
- **Local Data Storage**: All data stays on your device
- **API Key Security**: Keys stored locally, never transmitted
- **GDPR Compliant**: No tracking, no cookies, no external data collection

## 🤝 Contributing

This dashboard is designed to be easily customizable for your specific needs:

1. Fork the repository
2. Add your custom features
3. Share improvements with the community
4. Create integrations for your favorite tools

## 📄 License

MIT License - feel free to use this for your business and modify as needed.

## 🆘 Support

- **Setup Issues**: Check browser console for errors
- **Data Problems**: Verify CSV format matches examples
- **API Integrations**: Test connections in integrations panel
- **Custom Features**: Modify the code to fit your needs

---

**Built for founders, by founders.** Track what matters in the age of attributionless marketing. 🚀
