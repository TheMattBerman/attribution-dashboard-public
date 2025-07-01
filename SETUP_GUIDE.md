# Attribution Dashboard Setup Guide 🛠️

Complete setup instructions to get your attribution dashboard running in under 10 minutes.

## 📋 Prerequisites

- Web browser (Chrome, Firefox, Safari, or Edge)
- For social monitoring scripts: Python 3.7+ (optional)
- API keys for integrations (optional but recommended)

## 🚀 Quick Start

### 1. Download & Open Dashboard

```bash
# Method 1: Download ZIP
# - Download the ZIP file from GitHub
# - Extract to your desired folder
# - Open index.html in your browser

# Method 2: Clone Repository
git clone https://github.com/your-username/attribution-dashboard.git
cd attribution-dashboard
open index.html
```

### 2. First Launch

1. **Open `index.html`** in your web browser
2. **Click "Get Started"** on the welcome modal
3. **Navigate sections** using the left sidebar
4. **Start adding data** manually or via CSV upload

🎉 **Your dashboard is now ready!** All data is automatically saved to your browser.

## 📊 Adding Your First Data

### Manual Entry

1. **Signals Tracking**:

   - Enter current branded search volume
   - Add direct traffic numbers
   - Log inbound mentions manually
   - Track form fills

2. **Campaign Scorecard**:

   - Click "Add Campaign"
   - Enter campaign name and metrics
   - Add notes for context

3. **Echoes Log**:
   - Click "Add Entry"
   - Select type (Unsolicited Mention, Campaign Response, etc.)
   - Add content and source

### CSV Upload

Upload data in these formats:

**Mentions Data** (`mentions.csv`):

```csv
date,mentions
2024-01-01,45
2024-01-02,67
2024-01-03,52
```

**Signals Data** (`signals.csv`):

```csv
metric,value
branded search,2847
direct traffic,1234
inbound mentions,89
form fills,23
```

**Campaign Data** (`campaigns.csv`):

```csv
campaign,mentions,signups
Q1 Content Push,156,89
Podcast Tour,278,134
```

## 🔌 API Integrations

### Google Search Console

1. **Get API Key**:

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Google Search Console API
   - Create credentials (API key)

2. **Connect in Dashboard**:
   - Navigate to "API Integrations"
   - Enter your API key
   - Click "Test Connection"

### Webhook Setup

1. **Configure Webhook**:

   - Get webhook URL from your system (Zapier, Make, etc.)
   - Add authentication token if required
   - Test connection in dashboard

2. **Webhook Data Format**:

```json
{
  "eventType": "signal_updated",
  "timestamp": "2024-01-01T12:00:00Z",
  "data": {
    "metric": "branded_search",
    "value": 2847,
    "change": "+23%"
  },
  "dashboard": "attribution-dashboard"
}
```

## 🤖 Social Monitoring Setup

### Prerequisites

```bash
# Install Python dependencies
pip install requests python-dotenv
```

### ScrapeCreators Integration

1. **Get API Key**:

   - Visit [ScrapeCreators](https://scrapecreators.com)
   - Sign up and get API key
   - Note: This is a hypothetical service for example

2. **Setup Script**:

```bash
# Copy configuration file
cp config.env.example .env

# Edit .env file
BRAND_NAME=YourBrandName
SCRAPE_CREATORS_API_KEY=your_api_key_here

# Run script
python scrape_creators_integration.py
```

3. **Import Results**:
   - Script generates `dashboard_mentions_YYYYMMDD.csv`
   - Upload this file in dashboard's Mentions Graph section

### Exa Search Integration

1. **Get API Key**:

   - Visit [Exa.ai](https://exa.ai)
   - Sign up and get API key

2. **Setup Script**:

```bash
# Edit .env file
EXA_API_KEY=your_exa_api_key_here

# Run script
python exa_search_integration.py
```

3. **Import Results**:
   - Import generated CSV into dashboard

## 📱 Mobile & Responsive Usage

The dashboard works perfectly on mobile devices:

- **Navigation**: Tap hamburger menu to access sections
- **Data Entry**: All forms are touch-friendly
- **Charts**: Interactive and responsive
- **Export**: Works on mobile browsers

## 💾 Data Management

### Backup Your Data

```javascript
// Manual backup (run in browser console)
const data = localStorage.getItem("attributionDashboard");
console.log("Copy this data for backup:", data);
```

### Restore Data

```javascript
// Restore from backup (run in browser console)
const backupData = "YOUR_BACKUP_DATA_HERE";
localStorage.setItem("attributionDashboard", backupData);
location.reload();
```

### Export Data

- **CSV Export**: Available in each section
- **JSON Export**: Full data backup
- **Chart Export**: Download chart as CSV

## 🎨 Customization

### Color Scheme

Edit `style.css` to customize colors:

```css
:root {
  --color-primary: rgba(33, 128, 141, 1); /* Your brand color */
  --color-success: rgba(33, 128, 141, 1); /* Success green */
  --color-warning: rgba(168, 75, 47, 1); /* Warning orange */
}
```

### Add Custom Signals

1. **Update JavaScript** (`app.js`):

```javascript
// Add to dashboardState.signals
customMetric: 0,
  // Add to updateSignalDisplays()
  (document.getElementById("customMetric").textContent =
    dashboardState.signals.customMetric.toLocaleString());
```

2. **Update HTML** (`index.html`):

```html
<div class="signal-widget manual-logged">
  <div class="widget-header">
    <h4>Custom Metric</h4>
    <span class="data-source">Manual</span>
  </div>
  <div class="widget-value">
    <span class="value" id="customMetric">0</span>
  </div>
</div>
```

### Custom Integrations

Create new integration by:

1. Adding API configuration to settings
2. Creating fetch function
3. Mapping data to dashboard format
4. Adding UI controls

## 🔧 Troubleshooting

### Common Issues

**Dashboard won't load**:

- Check browser console for errors
- Ensure all files are in same directory
- Try different browser

**Chart not displaying**:

- Verify Chart.js is loading
- Check browser console for errors
- Try refreshing the page

**CSV upload fails**:

- Verify CSV format matches examples
- Check file encoding (use UTF-8)
- Ensure headers match exactly

**API connections fail**:

- Verify API keys are correct
- Check network connectivity
- Review API documentation for changes

### Browser Console

Access browser console to debug:

- **Chrome**: F12 or Ctrl+Shift+I
- **Firefox**: F12 or Ctrl+Shift+K
- **Safari**: Cmd+Option+I
- **Edge**: F12 or Ctrl+Shift+I

### Reset Dashboard

To completely reset:

```javascript
// Run in browser console
localStorage.removeItem("attributionDashboard");
location.reload();
```

## 📞 Support

### Self-Help

1. **Check README.md** for feature documentation
2. **Review code comments** for implementation details
3. **Search GitHub issues** for similar problems

### Getting Help

- **Documentation Issues**: Check this guide and README
- **Bug Reports**: Create GitHub issue with browser details
- **Feature Requests**: Submit GitHub issue with use case
- **Implementation Help**: Review code and add console.log for debugging

## 🔄 Regular Maintenance

### Weekly Tasks

- **Run social monitoring scripts** for fresh data
- **Export backup** of dashboard data
- **Review echo entries** for accuracy
- **Update campaign metrics** manually

### Monthly Tasks

- **Analyze trends** in mentions and signals
- **Update API keys** if needed
- **Review and clean** old data
- **Test all integrations** for functionality

## 🚀 Advanced Usage

### Automation Setup

1. **Cron Jobs** for Python scripts:

```bash
# Run social monitoring daily at 9 AM
0 9 * * * cd /path/to/dashboard && python scrape_creators_integration.py
0 9 * * * cd /path/to/dashboard && python exa_search_integration.py
```

2. **Webhook Automation**:
   - Connect to Zapier/Make.com
   - Auto-import data from various sources
   - Send notifications on threshold events

### Multi-Brand Setup

1. **Duplicate dashboard** for each brand
2. **Update brand name** in configuration
3. **Separate data directories** for each brand
4. **Use different API keys** if needed

---

🎯 **You're all set!** Your attribution dashboard is ready to track marketing impact in the age of dark social and AI-driven discovery.

For questions or issues, check the troubleshooting section or create a GitHub issue.
