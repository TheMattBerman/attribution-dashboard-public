// Analytics Integrations Module (Google Search Console & Google Analytics)

// Test Google Search Console connection
async function testGSCConnection() {
    const apiKey = document.getElementById('gscApiKey')?.value;
    
    if (!apiKey) {
        if (typeof updateConnectionStatus === 'function') {
            updateConnectionStatus('gscStatus', 'error', 'Please enter an API key');
        }
        return;
    }
    
    if (typeof updateConnectionStatus === 'function') {
        updateConnectionStatus('gscStatus', 'testing', 'Testing connection...');
    }
    
    try {
        // Store API key
        dashboardState.apiKeys.googleSearchConsole = apiKey;
        
        // Test the API connection via backend
        const response = await fetch('/api/test-google-search-console', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                api_key: apiKey
            })
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            dashboardState.apiStatus.googleSearchConsole = 'connected';
            if (typeof updateConnectionStatus === 'function') {
                updateConnectionStatus('gscStatus', 'success', 'Connected successfully');
            }
            
            // Fetch initial data
            await fetchGSCData();
        } else {
            dashboardState.apiStatus.googleSearchConsole = 'error';
            if (typeof updateConnectionStatus === 'function') {
                updateConnectionStatus('gscStatus', 'error', result.message || 'Invalid API key or permissions');
            }
        }
    } catch (error) {
        dashboardState.apiStatus.googleSearchConsole = 'error';
        if (typeof updateConnectionStatus === 'function') {
            updateConnectionStatus('gscStatus', 'error', 'Connection failed');
        }
        console.error('Google Search Console connection test failed:', error);
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Test Google Analytics connection
async function testGAConnection() {
    const apiKey = document.getElementById('gaApiKey')?.value;
    
    if (!apiKey) {
        if (typeof updateConnectionStatus === 'function') {
            updateConnectionStatus('gaStatus', 'error', 'Please enter an API key');
        }
        return;
    }
    
    if (typeof updateConnectionStatus === 'function') {
        updateConnectionStatus('gaStatus', 'testing', 'Testing connection...');
    }
    
    try {
        // Store API key
        dashboardState.apiKeys.googleAnalytics = apiKey;
        
        // Test the API connection via backend
        const response = await fetch('/api/test-google-analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                api_key: apiKey
            })
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            dashboardState.apiStatus.googleAnalytics = 'connected';
            if (typeof updateConnectionStatus === 'function') {
                updateConnectionStatus('gaStatus', 'success', 'Connected successfully');
            }
            
            // Fetch initial data
            await fetchGAData();
        } else {
            dashboardState.apiStatus.googleAnalytics = 'error';
            if (typeof updateConnectionStatus === 'function') {
                updateConnectionStatus('gaStatus', 'error', result.message || 'Invalid API key or permissions');
            }
        }
    } catch (error) {
        dashboardState.apiStatus.googleAnalytics = 'error';
        if (typeof updateConnectionStatus === 'function') {
            updateConnectionStatus('gaStatus', 'error', 'Connection failed');
        }
        console.error('Google Analytics connection test failed:', error);
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Test GA4 connection (modern Google Analytics)
async function testGA4Connection() {
    const apiKey = document.getElementById('ga4ApiKey')?.value;
    
    if (!apiKey) {
        if (typeof updateConnectionStatus === 'function') {
            updateConnectionStatus('ga4Status', 'error', 'Please enter an API key');
        }
        return;
    }
    
    if (typeof updateConnectionStatus === 'function') {
        updateConnectionStatus('ga4Status', 'testing', 'Testing connection...');
    }
    
    try {
        // Store API key
        dashboardState.apiKeys.googleAnalytics = apiKey;
        
        // Test the API connection via backend
        const response = await fetch('/api/test-ga4', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                api_key: apiKey
            })
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            dashboardState.apiStatus.googleAnalytics = 'connected';
            if (typeof updateConnectionStatus === 'function') {
                updateConnectionStatus('ga4Status', 'success', 'Connected successfully');
            }
            
            // Fetch initial data
            await fetchGA4Data();
        } else {
            dashboardState.apiStatus.googleAnalytics = 'error';
            if (typeof updateConnectionStatus === 'function') {
                updateConnectionStatus('ga4Status', 'error', result.message || 'Invalid credentials or permissions');
            }
        }
    } catch (error) {
        dashboardState.apiStatus.googleAnalytics = 'error';
        if (typeof updateConnectionStatus === 'function') {
            updateConnectionStatus('ga4Status', 'error', 'Connection test failed');
        }
        console.error('GA4 connection test failed:', error);
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Fetch Google Search Console data
async function fetchGSCData() {
    if (dashboardState.apiStatus.googleSearchConsole !== 'connected') return;
    
    try {
        if (typeof showNotification === 'function') {
            showNotification('Fetching search console data...', 'info');
        }
        
        const daysBack = (typeof currentTimeframe !== 'undefined' && currentTimeframe === '7d') ? 7 : 30;
        const response = await fetch(`/api/fetch-gsc-data?days_back=${daysBack}`, {
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            const gscData = result.data;
            
            // Update branded search volume signal
            if (gscData.branded_search_volume !== undefined) {
                if (typeof updateSignal === 'function') {
                    updateSignal('brandedSearch', gscData.branded_search_volume);
                }
            }
            
            // Update dashboard state with real data
            if (gscData.branded_search_volume) {
                dashboardState.signals.brandedSearchVolume = gscData.branded_search_volume;
            }
            
            if (typeof showNotification === 'function') {
                showNotification('✅ Search Console data fetched', 'success');
            }
        } else {
            throw new Error(result.message || 'Failed to fetch GSC data');
        }
        
    } catch (error) {
        console.error('Error fetching GSC data:', error);
        if (typeof showNotification === 'function') {
            showNotification(`❌ Failed to fetch search data: ${error.message}`, 'error');
        }
        
        // Fallback to mock data for demo
        const mockData = {
            brandedSearchVolume: Math.floor(Math.random() * 1000) + 2000,
            trend: Math.random() > 0.5 ? 'positive' : 'negative',
            trendValue: Math.floor(Math.random() * 50) + 10
        };
        
        if (typeof updateSignal === 'function') {
            updateSignal('brandedSearch', mockData.brandedSearchVolume);
        }
        if (typeof updateSignalTrend === 'function') {
            updateSignalTrend('brandedSearchTrend', 
                `${mockData.trend === 'positive' ? '+' : '-'}${mockData.trendValue}%`);
        }
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Fetch Google Analytics data
async function fetchGAData() {
    if (dashboardState.apiStatus.googleAnalytics !== 'connected') return;
    
    try {
        if (typeof showNotification === 'function') {
            showNotification('Fetching analytics data...', 'info');
        }
        
        const daysBack = (typeof currentTimeframe !== 'undefined' && currentTimeframe === '7d') ? 7 : 30;
        const response = await fetch(`/api/fetch-ga-data?days_back=${daysBack}`, {
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            const gaData = result.data;
            
            // Update direct traffic signal
            if (gaData.direct_traffic !== undefined) {
                if (typeof updateSignal === 'function') {
                    updateSignal('directTraffic', gaData.direct_traffic);
                }
            }
            
            // Update dashboard state with real data
            if (gaData.direct_traffic) {
                dashboardState.signals.directTraffic = gaData.direct_traffic;
            }
            
            if (typeof showNotification === 'function') {
                showNotification('✅ Analytics data fetched', 'success');
            }
        } else {
            throw new Error(result.message || 'Failed to fetch GA data');
        }
        
    } catch (error) {
        console.error('Error fetching GA data:', error);
        if (typeof showNotification === 'function') {
            showNotification(`❌ Failed to fetch analytics data: ${error.message}`, 'error');
        }
        
        // Fallback to mock data for demo
        const mockData = {
            directTraffic: Math.floor(Math.random() * 800) + 1000,
            trend: Math.random() > 0.5 ? 'positive' : 'negative',
            trendValue: Math.floor(Math.random() * 40) + 5
        };
        
        if (typeof updateSignal === 'function') {
            updateSignal('directTraffic', mockData.directTraffic);
        }
        if (typeof updateSignalTrend === 'function') {
            updateSignalTrend('directTrafficTrend', 
                `${mockData.trend === 'positive' ? '+' : '-'}${mockData.trendValue}%`);
        }
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Fetch GA4 data (modern Google Analytics)
async function fetchGA4Data() {
    if (dashboardState.apiStatus.googleAnalytics !== 'connected') return;
    
    try {
        if (typeof showNotification === 'function') {
            showNotification('Fetching GA4 data...', 'info');
        }
        
        const daysBack = (typeof currentTimeframe !== 'undefined' && currentTimeframe === '7d') ? 7 : 30;
        const response = await fetch(`/api/fetch-ga4-data?days_back=${daysBack}`, {
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            const ga4Data = result.data;
            
            // Update multiple signals from GA4 data
            if (ga4Data.direct_traffic !== undefined) {
                if (typeof updateSignal === 'function') {
                    updateSignal('directTraffic', ga4Data.direct_traffic);
                }
            }
            
            if (ga4Data.branded_search_volume !== undefined) {
                if (typeof updateSignal === 'function') {
                    updateSignal('brandedSearch', ga4Data.branded_search_volume);
                }
            }
            
            // Update dashboard state with real data
            Object.assign(dashboardState.signals, {
                directTraffic: ga4Data.direct_traffic || dashboardState.signals.directTraffic,
                brandedSearchVolume: ga4Data.branded_search_volume || dashboardState.signals.brandedSearchVolume
            });
            
            if (typeof showNotification === 'function') {
                showNotification('✅ GA4 data fetched', 'success');
            }
        } else {
            throw new Error(result.message || 'Failed to fetch GA4 data');
        }
        
    } catch (error) {
        console.error('Error fetching GA4 data:', error);
        if (typeof showNotification === 'function') {
            showNotification(`❌ Failed to fetch GA4 data: ${error.message}`, 'error');
        }
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Refresh all analytics data
async function refreshAnalyticsData() {
    const promises = [];
    
    if (dashboardState.apiStatus.googleSearchConsole === 'connected') {
        promises.push(fetchGSCData());
    }
    
    if (dashboardState.apiStatus.googleAnalytics === 'connected') {
        promises.push(fetchGA4Data());
    }
    
    if (promises.length === 0) {
        if (typeof showNotification === 'function') {
            showNotification('No analytics APIs connected', 'warning');
        }
        return;
    }
    
    try {
        await Promise.all(promises);
        if (typeof showNotification === 'function') {
            showNotification('✅ All analytics data refreshed', 'success');
        }
    } catch (error) {
        console.error('Error refreshing analytics data:', error);
        if (typeof showNotification === 'function') {
            showNotification(`❌ Error refreshing analytics data: ${error.message}`, 'error');
        }
    }
}

// Test all analytics connections
async function testAllAnalyticsConnections() {
    const promises = [];
    
    // Test Google Search Console if API key is available
    if (document.getElementById('gscApiKey')?.value) {
        promises.push(testGSCConnection());
    }
    
    // Test Google Analytics if API key is available
    if (document.getElementById('gaApiKey')?.value || document.getElementById('ga4ApiKey')?.value) {
        if (document.getElementById('ga4ApiKey')?.value) {
            promises.push(testGA4Connection());
        } else {
            promises.push(testGAConnection());
        }
    }
    
    if (promises.length === 0) {
        if (typeof showNotification === 'function') {
            showNotification('Please enter API keys to test connections', 'warning');
        }
        return;
    }
    
    try {
        await Promise.all(promises);
        if (typeof showNotification === 'function') {
            showNotification('✅ Analytics connection tests completed', 'success');
        }
    } catch (error) {
        console.error('Error testing analytics connections:', error);
        if (typeof showNotification === 'function') {
            showNotification(`❌ Error testing connections: ${error.message}`, 'error');
        }
    }
}

// Get analytics statistics
function getAnalyticsStats() {
    const signals = dashboardState.signals;
    
    return {
        brandedSearchVolume: signals.brandedSearchVolume || 0,
        directTraffic: signals.directTraffic || 0,
        totalTraffic: (signals.brandedSearchVolume || 0) + (signals.directTraffic || 0),
        attributionScore: signals.attributionScore || 0,
        hasRealData: dashboardState.apiStatus.googleSearchConsole === 'connected' || 
                    dashboardState.apiStatus.googleAnalytics === 'connected'
    };
}

// Export functions for global access
window.testGSCConnection = testGSCConnection;
window.testGAConnection = testGAConnection;
window.testGA4Connection = testGA4Connection;
window.fetchGSCData = fetchGSCData;
window.fetchGAData = fetchGAData;
window.fetchGA4Data = fetchGA4Data;
window.refreshAnalyticsData = refreshAnalyticsData;
window.testAllAnalyticsConnections = testAllAnalyticsConnections;
window.getAnalyticsStats = getAnalyticsStats;