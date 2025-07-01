# 🚀 Attribution Dashboard - Quick Start Guide

## 📊 What You'll See in the Dashboard

### **Before Setting Up APIs (Demo Mode)**

Your dashboard will show **estimated data** to help you understand what the platform does:

- **~4,455 Branded Search Volume** - Estimated based on social media mentions
- **~2,376 Direct Traffic** - Estimated website visits
- **Community Engagement** - Real data from social platforms (when APIs connected)
- All estimated metrics have a **~** symbol and yellow "EST" indicator

### **After Connecting APIs (Live Mode)**

Real data from your connected services:

- **📊 Google Analytics 4** - Real branded search and direct traffic data
- **🌐 Social Media APIs** - Live mentions from TikTok, YouTube, Reddit
- **🔍 Web Search** - Brand mentions across the web
- Real metrics show precise numbers without the **~** symbol

---

## ⚡ 30-Second Setup (See Demo Data)

1. **Download the project** and open terminal in the folder
2. **Install dependencies**: `pip install -r requirements.txt`
3. **Start the dashboard**: `python backend_server.py`
4. **Open browser**: Go to `http://localhost:8080`

✅ **You'll immediately see estimated data** based on sample social media mentions!

---

## 🔧 Connect Real Data Sources (5-10 minutes)

### **Step 1: Copy Environment File**

```bash
cp config.env.example .env
```

### **Step 2: Add Your Brand Name**

Edit `.env` file:

```bash
BRAND_NAME="Your Company Name"
```

### **Step 3: Connect APIs (Optional)**

#### **🌐 Social Media Data** (Most Important)

- **ScrapeCreators API** - Get TikTok, YouTube, Reddit mentions
- **Exa Search API** - Find web mentions and articles

#### **📊 Analytics Data** (For Real Numbers)

- **Google Analytics 4** - Replace estimated traffic with real data
- **Google Search Console** - Real branded search volume

---

## 🎯 What Each Data Source Provides

| Metric                   | **Estimated** (Default)         | **Real Data** (With APIs)         |
| ------------------------ | ------------------------------- | --------------------------------- |
| **Branded Search**       | `~4,455` (social mentions × 15) | Real GA4 search data              |
| **Direct Traffic**       | `~2,376` (social mentions × 8)  | Real GA4 website visits           |
| **Community Engagement** | Live social mentions            | Same (always real when connected) |
| **Inbound Messages**     | Estimated from web mentions     | Real email/CRM integration        |

### **🔍 How to Tell Data Type**

- **Estimated**: Yellow "EST" badge, `~` before numbers, orange-tinted widgets
- **Real**: Blue "NEW" badge, precise numbers, normal widget styling

---

## 📋 Detailed Setup Guides

For complete API setup instructions:

- **[GA4 Setup Guide](GA4_SETUP_GUIDE.md)** - Connect Google Analytics
- **[TikTok API Guide](TIKTOK_API_GUIDE.md)** - Social media monitoring
- **[Setup Guide](SETUP_GUIDE.md)** - Complete configuration
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues

---

## ⚠️ Important Notes

### **Data Understanding**

- **Estimated data helps you see the dashboard's potential**
- **Social APIs provide the most valuable real-time insights**
- **GA4 connection removes estimation and provides precise analytics**

### **Privacy & Security**

- All API keys stored locally in `.env` file
- No data sent to external servers
- Dashboard runs entirely on your machine

### **Getting Started Recommendation**

1. **Start with demo data** to explore the interface
2. **Connect social APIs first** for real mention tracking
3. **Add GA4 later** for precise analytics replacement

---

## 🆘 Need Help?

**Dashboard not starting?**

- Check [Troubleshooting Guide](TROUBLESHOOTING.md)
- Ensure Python 3.8+ installed
- Try: `pip install --upgrade -r requirements.txt`

**Can't see your brand mentions?**

- Verify brand name in `.env` file
- Check API keys are correctly formatted
- Wait 2-3 minutes for data collection

**Questions about data accuracy?**

- Estimated metrics are rough approximations for demo purposes
- Connect real APIs for accurate tracking
- See [Google Search Console Explanation](GOOGLE_SEARCH_CONSOLE_EXPLANATION.md)

---

🎉 **Ready to start?** Run `python backend_server.py` and explore your attribution dashboard!
