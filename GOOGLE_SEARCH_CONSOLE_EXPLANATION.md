# Google Search Console Data in Attribution Dashboard

## 🔍 What You're Currently Seeing

### **The 4455 Number**

- **What it is**: **Estimated** branded search volume (not real Google Search Console data)
- **How it's calculated**: `total_mentions × 15` (estimation multiplier)
- **Data source**: Based on social media mentions from your APIs

### **"Based on X mentions" Text**

- This shows the actual number of social media mentions used for the estimation
- **Previously showed "0 mentions"** due to a frontend bug (now fixed)
- **Should now show the correct mention count** from your social media APIs

## 📊 Current Data Sources

The dashboard currently shows **estimated data** because:

1. ❌ **Google Search Console not connected**
2. ❌ **Google Analytics 4 not connected**
3. ✅ **Social media mentions available** (from ScrapeCreators/Exa APIs)

## 🔧 How to Get Real Google Search Console Data

### Step 1: Set up GA4 Integration

Google Search Console data flows through the GA4 integration:

```bash
# Add to your .env file:
GA4_PROPERTY_ID=your-property-id-here
GA4_CREDENTIALS_PATH=/path/to/service-account.json
# OR
GA4_CREDENTIALS_JSON='{"type":"service_account",...}'
```

### Step 2: Create GA4 Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a service account for your project
3. Download the JSON credentials file
4. Enable the Google Analytics Data API

### Step 3: Connect Property

1. Add the service account email to your GA4 property as a Viewer
2. Note your GA4 Property ID (format: 123456789)

### Step 4: Install Dependencies

```bash
pip install google-analytics-data google-auth google-auth-oauthlib
```

### Step 5: Restart Dashboard

```bash
python backend_server.py
```

## 📈 What Real GSC Data Provides

Once connected, you'll see:

### **Branded Search Volume Widget**

- **Real search data** from Google Analytics
- **Actual branded search sessions** instead of estimates
- **Source**: "Google Analytics 4" instead of "Estimated from mentions"

### **Direct Traffic Widget**

- **Real direct traffic sessions**
- **Landing page analysis**
- **Source attribution data**

### **Better Attribution Scoring**

- **Combined social + search data**
- **More accurate attribution metrics**
- **Real conversion data**

## 🎯 Current vs Future State

### **Current (Estimated Data)**

```
Branded Search: 4,455
Source: "Estimated from mentions"
Details: "Estimated searches based on 297 mentions"
```

### **Future (Real GSC Data)**

```
Branded Search: 2,847
Source: "Google Analytics 4"
Details: "Real branded search sessions from GA4"
```

## 🛠 Troubleshooting

### "Still seeing estimated data after setup"

1. Check server logs for GA4 connection errors
2. Verify service account has proper permissions
3. Confirm GA4_PROPERTY_ID is correct
4. Test connection via API endpoint: `/api/test-connection`

### "Numbers seem too high/low"

- **Estimated data** uses rough multipliers (mentions × 15)
- **Real data** will be more accurate and likely different
- **Social mentions ≠ search volume** (different behaviors)

## 📋 Setup Checklist

- [ ] GA4 property created and configured
- [ ] Service account created with Analytics Data API access
- [ ] Service account added as viewer to GA4 property
- [ ] Credentials file downloaded or JSON copied
- [ ] Environment variables set in `.env` file
- [ ] Python dependencies installed
- [ ] Dashboard server restarted
- [ ] Connection tested successfully

## 💡 Pro Tips

1. **Real data takes 24-48 hours** to appear in GA4 after setup
2. **Branded search detection** looks for queries containing your brand name
3. **Direct traffic** excludes referral traffic to focus on attribution
4. **Historical data** is available (not just real-time)
5. **Multiple brand variations** are automatically detected

---

**Need help?** Check the `GA4_SETUP_GUIDE.md` for detailed setup instructions.
