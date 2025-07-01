# Troubleshooting Guide

## Common Issues and Solutions

### 🔧 JSON Errors When Testing API Keys

**Problem**: Getting JSON parsing errors when testing API connections in the dashboard.

**Solutions**:

1. **Check API Key Format**

   - Ensure your API key doesn't have extra spaces or characters
   - Copy the key directly from the provider's dashboard
   - Don't include quotes around the key

2. **Verify Network Connection**

   - Make sure your internet connection is stable
   - Check if your firewall is blocking the requests
   - Try refreshing the page and testing again

3. **API Service Status**

   - Check if the API service (ScrapeCreators, Exa) is currently operational
   - Visit their status pages or documentation for any known issues

4. **Browser Console Debugging**
   - Open browser developer tools (F12)
   - Check the Console tab for detailed error messages
   - Look for network errors in the Network tab

### 🔑 API Key Management

**Problem**: API keys not persisting between sessions.

**Solutions**:

1. **Use Environment Variables** (Recommended)

   ```bash
   # Copy the example file
   cp config.env.example .env

   # Edit with your actual keys
   nano .env

   # Restart the server
   python3 backend_server.py
   ```

2. **Session Storage** (Temporary)
   - API keys entered in the web interface are stored for the current session
   - They will be lost when you close the browser or restart the server
   - Use this for testing, .env for production

### 🌐 Connection Issues

**Problem**: "Connection failed" or timeout errors.

**Solutions**:

1. **Check Server Status**

   ```bash
   # Make sure the backend server is running
   python3 backend_server.py
   ```

2. **Port Conflicts**

   - Default port is 8080
   - If port is in use, change it in the .env file:

   ```
   PORT=8081
   ```

3. **CORS Issues**
   - Make sure you're accessing the dashboard through the server URL
   - Don't open index.html directly in browser
   - Use: http://localhost:8080

### 📊 Data Not Loading

**Problem**: Dashboard shows no data or loading errors.

**Solutions**:

1. **API Key Configuration**

   - Verify at least one API key is properly configured
   - Test the connection using the "Test" buttons
   - Check the browser console for error messages

2. **Brand Name Setup**

   - Make sure BRAND_NAME is set in .env or configured in the dashboard
   - The brand name is used for mention searches

3. **Rate Limiting**
   - Some APIs have rate limits
   - Wait a few minutes and try again
   - Check API provider documentation for limits

### 🔐 Security Considerations

**Best Practices**:

1. **Environment Variables**

   - Always use .env files for production
   - Never commit .env files to version control
   - Add .env to your .gitignore file

2. **API Key Security**

   - Don't share API keys in screenshots or logs
   - Rotate keys regularly
   - Use different keys for development and production

3. **Server Security**
   - Change the default SECRET_KEY in production
   - Use HTTPS in production deployments
   - Restrict server access to authorized users only

### 🐛 Debug Mode

**Enable Debug Logging**:

1. **Backend Debugging**

   ```python
   # In backend_server.py, the debug mode is already enabled
   app.run(host='0.0.0.0', port=8080, debug=True)
   ```

2. **Frontend Debugging**
   ```javascript
   // Open browser console and check for errors
   // All API calls are logged with detailed information
   ```

### 📞 Getting Help

**If you're still having issues**:

1. **Check the Logs**

   - Backend server logs show detailed error messages
   - Browser console shows frontend errors

2. **Common Error Messages**:

   - `"No data provided"` → Check request format
   - `"API key is required"` → Verify key is set
   - `"Connection failed"` → Check network/API status
   - `"Service parameter is required"` → Check API endpoint

3. **Test API Keys Manually**
   ```bash
   # Test ScrapeCreators API
   curl -X POST "your-api-endpoint" \
        -H "Authorization: Bearer YOUR_API_KEY" \
        -H "Content-Type: application/json"
   ```

### 🔄 Reset and Restart

**Complete Reset Process**:

1. **Clear Browser Data**

   - Clear localStorage: `localStorage.clear()` in console
   - Clear cookies for localhost
   - Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

2. **Restart Server**

   ```bash
   # Stop server (Ctrl+C)
   # Start again
   python3 backend_server.py
   ```

3. **Reset Configuration**

   ```bash
   # Remove custom .env file
   rm .env

   # Copy fresh example
   cp config.env.example .env

   # Edit with correct values
   nano .env
   ```

### 📈 Performance Tips

**Optimize Dashboard Performance**:

1. **Reduce API Calls**

   - Use environment variables instead of session storage
   - Cache results when possible
   - Don't test API connections repeatedly

2. **Browser Performance**

   - Close unnecessary tabs
   - Use latest browser version
   - Clear browser cache if experiencing issues

3. **Server Performance**
   - Use production WSGI server for deployment
   - Consider using Redis for session storage
   - Monitor server resource usage

---

## Quick Reference

### Environment Variables Template

```bash
# Required
BRAND_NAME=YourBrandName
SECRET_KEY=your-secret-key
SCRAPE_CREATORS_API_KEY=your_key_here
EXA_API_KEY=your_key_here
```

### Server Commands

```bash
# Start server
python3 backend_server.py

# Start with custom port
PORT=8081 python3 backend_server.py

# Check if server is running
curl http://localhost:8080/api/brand-config
```

### Browser Debug Commands

```javascript
// Clear all stored data
localStorage.clear();

// Check current API status
fetch("/api/brand-config")
  .then((r) => r.json())
  .then(console.log);

// Test API connection
fetch("/api/test-connection", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ service: "scrape_creators", api_key: "your_key" }),
})
  .then((r) => r.json())
  .then(console.log);
```
