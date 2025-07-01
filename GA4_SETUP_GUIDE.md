# Google Analytics 4 (GA4) Integration Setup Guide

This guide will help you set up real GA4 integration to automatically pull direct traffic and branded search data into your Attribution Dashboard.

## 🎯 What You'll Get

With GA4 integration, your dashboard will automatically pull:

- **Real Direct Traffic Data**: Actual sessions, users, and pageviews from GA4
- **Branded Search Estimates**: Intelligent estimates based on your organic search traffic
- **Landing Page Analysis**: Top landing pages for direct traffic
- **Historical Data**: Support for both 7-day and 30-day timeframes

## 📋 Prerequisites

1. **GA4 Property**: You need an active Google Analytics 4 property
2. **Google Cloud Project**: Access to Google Cloud Console
3. **Admin Access**: GA4 property admin or editor permissions

## 🔧 Step 1: Create a Service Account

### 1.1 Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Enable the Google Analytics Data API

### 1.2 Create Service Account

1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Fill in details:
   - **Name**: `attribution-dashboard-ga4`
   - **Description**: `Service account for Attribution Dashboard GA4 integration`
4. Click **Create and Continue**

### 1.3 Generate Key

1. Click on your new service account
2. Go to **Keys** tab
3. Click **Add Key** → **Create New Key**
4. Choose **JSON** format
5. Download the JSON file
6. **Keep this file secure!** It contains sensitive credentials

## 🔧 Step 2: Grant GA4 Access

### 2.1 Get Service Account Email

From the downloaded JSON file, copy the `client_email` value (looks like `attribution-dashboard-ga4@your-project.iam.gserviceaccount.com`)

### 2.2 Add to GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your GA4 property
3. Go to **Admin** (gear icon)
4. Under **Property**, click **Property Access Management**
5. Click **+** → **Add Users**
6. Enter the service account email
7. Select **Viewer** role (minimum required)
8. Click **Add**

## 🔧 Step 3: Find Your GA4 Property ID

### Method 1: From GA4 Interface

1. In GA4, go to **Admin** → **Property Settings**
2. Copy the **Property ID** (looks like `123456789`)

### Method 2: From URL

When viewing your GA4 property, the URL contains your property ID:

```
https://analytics.google.com/analytics/web/#/pXXXXXXXXX/
```

The `XXXXXXXXX` part is your property ID.

## 🔧 Step 4: Configure Your Dashboard

### Option A: Using .env File (Recommended)

1. **Place the JSON file** in your project directory (e.g., `ga4-credentials.json`)

2. **Update your .env file**:

```bash
# GA4 Configuration
GA4_PROPERTY_ID=123456789
GA4_CREDENTIALS_PATH=./ga4-credentials.json

# Your brand name (used for branded search estimation)
BRAND_NAME=YourActualBrandName
```

### Option B: Using Environment Variable (Cloud Deployment)

For cloud deployments, you can provide credentials as a JSON string:

```bash
GA4_PROPERTY_ID=123456789
GA4_CREDENTIALS_JSON={"type":"service_account","project_id":"your-project",...}
```

## 🔧 Step 5: Install Dependencies

Install the required Python packages:

```bash
pip install google-analytics-data google-auth google-auth-oauthlib
```

Or update from requirements.txt:

```bash
pip install -r requirements.txt
```

## 🔧 Step 6: Test the Integration

### 6.1 Test from Command Line

```bash
python google_analytics_integration.py 123456789 ./ga4-credentials.json
```

### 6.2 Test from Dashboard

1. Start your dashboard: `python backend_server.py`
2. You should see: `GA4 Analytics: ✓ Connected`
3. Open the dashboard in your browser
4. Go to the setup wizard and test the GA4 connection

## 📊 What Data You'll See

### Direct Traffic Widget

- **Real Sessions**: Actual direct traffic sessions from GA4
- **Trend Analysis**: Comparison between time periods
- **Source**: "GA4 Analytics" (instead of estimated)

### Branded Search Widget

- **Intelligent Estimates**: 30% of your organic search traffic
- **Based on Real Data**: Calculated from actual GA4 organic search sessions
- **Customizable**: You can adjust the estimation percentage in the code

## 🔍 Troubleshooting

### Common Issues

#### 1. "GA4 integration not available"

**Solution**: Install dependencies

```bash
pip install google-analytics-data google-auth
```

#### 2. "GA4 Property ID is required"

**Solution**: Check your .env file has `GA4_PROPERTY_ID=123456789`

#### 3. "GA4 credentials are required"

**Solution**: Ensure you have either:

- `GA4_CREDENTIALS_PATH=./path/to/file.json`
- Or `GA4_CREDENTIALS_JSON={"type":"service_account",...}`

#### 4. "Permission denied" or "403 Forbidden"

**Solution**:

- Verify the service account email is added to your GA4 property
- Ensure it has at least "Viewer" permissions
- Wait a few minutes for permissions to propagate

#### 5. "Property not found"

**Solution**:

- Double-check your GA4 Property ID
- Ensure you're using the numeric ID, not the measurement ID (G-XXXXXXXXXX)

### Debug Mode

Enable detailed logging by adding to your .env:

```bash
LOG_LEVEL=DEBUG
```

## 🚀 Advanced Configuration

### Custom Branded Search Estimation

By default, we estimate branded search as 30% of organic search traffic. To customize this:

1. Edit `google_analytics_integration.py`
2. Find line: `estimated_branded_sessions = int(organic_sessions * 0.3)`
3. Change `0.3` to your preferred percentage (e.g., `0.4` for 40%)

### Multiple Brand Terms

To track multiple brand variations:

```python
brand_terms = ['YourBrand', 'Your Brand', 'yourbrand.com']
branded_data = ga4_integration.get_branded_search_data(brand_terms, days_back)
```

## 📈 Data Refresh

- **Automatic**: Dashboard refreshes GA4 data when you click "Refresh" or switch timeframes
- **Real-time**: Data is fetched fresh from GA4 on each request
- **Caching**: Consider implementing caching for high-traffic dashboards

## 🔒 Security Best Practices

1. **Never commit** your service account JSON file to version control
2. **Add to .gitignore**:
   ```
   ga4-credentials.json
   .env
   ```
3. **Use environment variables** in production
4. **Rotate credentials** periodically
5. **Use least-privilege access** (Viewer role only)

## 📞 Support

If you encounter issues:

1. **Check the logs** in your terminal when starting the server
2. **Test the connection** using the command line tool
3. **Verify permissions** in GA4 Admin panel
4. **Check API quotas** in Google Cloud Console

## 🎉 Success!

Once configured, you'll see:

- ✅ Real direct traffic numbers instead of estimates
- ✅ "GA4 Analytics" data source labels
- ✅ Accurate 7-day and 30-day comparisons
- ✅ Branded search estimates based on real organic data

Your Attribution Dashboard is now fully automated with real GA4 data! 🚀
