// Social Media Integrations Module

// Test ScrapeCreators API connection
async function testSCConnection() {
    const apiKey = document.getElementById('scApiKey')?.value;
    
    if (!apiKey) {
        if (typeof updateConnectionStatus === 'function') {
            updateConnectionStatus('scStatus', 'error', 'Please enter an API key');
        }
        return;
    }
    
    if (typeof updateConnectionStatus === 'function') {
        updateConnectionStatus('scStatus', 'testing', 'Testing connection...');
    }
    
    try {
        // Store API key
        dashboardState.apiKeys.scrapeCreators = apiKey;
        
        // Test the API connection via backend
        const response = await fetch('/api/test-scrape-creators', {
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
            dashboardState.apiStatus.scrapeCreators = 'connected';
            if (typeof updateConnectionStatus === 'function') {
                updateConnectionStatus('scStatus', 'success', 'Connected successfully');
            }
            
            // Fetch initial data
            await fetchSocialData();
        } else {
            dashboardState.apiStatus.scrapeCreators = 'error';
            if (typeof updateConnectionStatus === 'function') {
                updateConnectionStatus('scStatus', 'error', result.message || 'Invalid API key or permissions');
            }
        }
    } catch (error) {
        dashboardState.apiStatus.scrapeCreators = 'error';
        if (typeof updateConnectionStatus === 'function') {
            updateConnectionStatus('scStatus', 'error', 'Connection failed');
        }
        console.error('ScrapeCreators connection test failed:', error);
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Test Exa Search API connection
async function testExaConnection() {
    const apiKey = document.getElementById('exaApiKey')?.value;
    
    if (!apiKey) {
        if (typeof updateConnectionStatus === 'function') {
            updateConnectionStatus('exaStatus', 'error', 'Please enter an API key');
        }
        return;
    }
    
    if (typeof updateConnectionStatus === 'function') {
        updateConnectionStatus('exaStatus', 'testing', 'Testing connection...');
    }
    
    try {
        // Store API key
        dashboardState.apiKeys.exaSearch = apiKey;
        
        // Test the API connection via backend
        const response = await fetch('/api/test-exa-search', {
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
            dashboardState.apiStatus.exaSearch = 'connected';
            if (typeof updateConnectionStatus === 'function') {
                updateConnectionStatus('exaStatus', 'success', 'Connected successfully');
            }
            
            // Fetch initial data
            await fetchWebMentions();
        } else {
            dashboardState.apiStatus.exaSearch = 'error';
            if (typeof updateConnectionStatus === 'function') {
                updateConnectionStatus('exaStatus', 'error', result.message || 'Invalid API key or permissions');
            }
        }
    } catch (error) {
        dashboardState.apiStatus.exaSearch = 'error';
        if (typeof updateConnectionStatus === 'function') {
            updateConnectionStatus('exaStatus', 'error', 'Connection failed');
        }
        console.error('Exa Search connection test failed:', error);
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Fetch social media data from ScrapeCreators API
async function fetchSocialData() {
    if (dashboardState.apiStatus.scrapeCreators !== 'connected') return;
    
    try {
        if (typeof showNotification === 'function') {
            showNotification('Fetching social media data...', 'info');
        }
        
        const daysBack = (typeof currentTimeframe !== 'undefined' && currentTimeframe === '7d') ? 7 : 30;
        const response = await fetch(`/api/fetch-social-mentions?days_back=${daysBack}`, {
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            const socialData = result.data;
            
            // Update community engagement signal
            const engagementCount = socialData.length;
            if (typeof updateSignal === 'function') {
                updateSignal('communityEngagement', engagementCount);
            }
            
            // Add to live feed if mentions exist
            if (socialData.length > 0 && dashboardState.liveFeed) {
                socialData.forEach(mention => {
                    if (!dashboardState.liveFeed.mentions.find(m => m.id === mention.id)) {
                        dashboardState.liveFeed.mentions.unshift({
                            id: mention.id || Date.now() + Math.random(),
                            platform: mention.platform || 'social',
                            content: mention.content || mention.text || 'No content available',
                            sentiment: mention.sentiment || 'neutral',
                            sentiment_details: mention.sentiment_details || {},
                            engagement: mention.engagement || 0,
                            author: mention.author || 'Anonymous',
                            timestamp: mention.timestamp || new Date().toISOString(),
                            url: mention.url || '#',
                            source: 'scrape_creators'
                        });
                    }
                });
                
                // Keep only last 100 mentions
                if (dashboardState.liveFeed.mentions.length > 100) {
                    dashboardState.liveFeed.mentions = dashboardState.liveFeed.mentions.slice(0, 100);
                }
                
                // Update feed display if functions are available
                if (typeof populateLiveFeed === 'function') {
                    populateLiveFeed();
                }
                if (typeof updateFeedStats === 'function') {
                    updateFeedStats();
                }
            }
            
            if (typeof showNotification === 'function') {
                showNotification(`✅ Fetched ${socialData.length} social mentions`, 'success');
            }
        } else {
            throw new Error(result.message || 'Failed to fetch social data');
        }
        
    } catch (error) {
        console.error('Error fetching social data:', error);
        if (typeof showNotification === 'function') {
            showNotification(`❌ Failed to fetch social data: ${error.message}`, 'error');
        }
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Fetch web mentions from Exa Search API
async function fetchWebMentions() {
    if (dashboardState.apiStatus.exaSearch !== 'connected') return;
    
    try {
        if (typeof showNotification === 'function') {
            showNotification('Fetching web mentions...', 'info');
        }
        
        const daysBack = (typeof currentTimeframe !== 'undefined' && currentTimeframe === '7d') ? 7 : 30;
        const response = await fetch(`/api/fetch-web-mentions?days_back=${daysBack}`, {
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            const webMentions = result.data;
            
            // Add to live feed if mentions exist
            if (webMentions.length > 0 && dashboardState.liveFeed) {
                webMentions.forEach(mention => {
                    if (!dashboardState.liveFeed.mentions.find(m => m.id === mention.id)) {
                        dashboardState.liveFeed.mentions.unshift({
                            id: mention.id || Date.now() + Math.random(),
                            platform: 'web',
                            content: mention.content || mention.text || mention.title || 'No content available',
                            sentiment: mention.sentiment || 'neutral',
                            sentiment_details: mention.sentiment_details || {},
                            engagement: mention.engagement || 0,
                            author: mention.author || mention.domain || 'Web',
                            timestamp: mention.timestamp || new Date().toISOString(),
                            url: mention.url || '#',
                            source: 'exa_search'
                        });
                    }
                });
                
                // Keep only last 100 mentions
                if (dashboardState.liveFeed.mentions.length > 100) {
                    dashboardState.liveFeed.mentions = dashboardState.liveFeed.mentions.slice(0, 100);
                }
                
                // Update feed display if functions are available
                if (typeof populateLiveFeed === 'function') {
                    populateLiveFeed();
                }
                if (typeof updateFeedStats === 'function') {
                    updateFeedStats();
                }
            }
            
            if (typeof showNotification === 'function') {
                showNotification(`✅ Fetched ${webMentions.length} web mentions`, 'success');
            }
        } else {
            throw new Error(result.message || 'Failed to fetch web mentions');
        }
        
    } catch (error) {
        console.error('Error fetching web mentions:', error);
        if (typeof showNotification === 'function') {
            showNotification(`❌ Failed to fetch web mentions: ${error.message}`, 'error');
        }
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Refresh social data from all connected APIs
async function refreshSocialData() {
    const promises = [];
    
    if (dashboardState.apiStatus.scrapeCreators === 'connected') {
        promises.push(fetchSocialData());
    }
    
    if (dashboardState.apiStatus.exaSearch === 'connected') {
        promises.push(fetchWebMentions());
    }
    
    if (promises.length === 0) {
        if (typeof showNotification === 'function') {
            showNotification('No social APIs connected', 'warning');
        }
        return;
    }
    
    try {
        await Promise.all(promises);
        if (typeof showNotification === 'function') {
            showNotification('✅ All social data refreshed', 'success');
        }
    } catch (error) {
        console.error('Error refreshing social data:', error);
        if (typeof showNotification === 'function') {
            showNotification(`❌ Error refreshing social data: ${error.message}`, 'error');
        }
    }
}

// Test all social connections
async function testAllSocialConnections() {
    const promises = [];
    
    // Test ScrapeCreators if API key is available
    if (document.getElementById('scApiKey')?.value) {
        promises.push(testSCConnection());
    }
    
    // Test Exa Search if API key is available
    if (document.getElementById('exaApiKey')?.value) {
        promises.push(testExaConnection());
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
            showNotification('✅ Social connection tests completed', 'success');
        }
    } catch (error) {
        console.error('Error testing social connections:', error);
        if (typeof showNotification === 'function') {
            showNotification(`❌ Error testing connections: ${error.message}`, 'error');
        }
    }
}

// Get social platform statistics
function getSocialStats() {
    const mentions = dashboardState.liveFeed?.mentions || [];
    const socialMentions = mentions.filter(m => 
        ['twitter', 'reddit', 'discord', 'linkedin', 'tiktok', 'youtube'].includes(m.platform)
    );
    
    const stats = {
        total: socialMentions.length,
        byPlatform: {},
        bySentiment: {
            positive: 0,
            neutral: 0,
            negative: 0
        },
        totalEngagement: 0
    };
    
    socialMentions.forEach(mention => {
        // Count by platform
        stats.byPlatform[mention.platform] = (stats.byPlatform[mention.platform] || 0) + 1;
        
        // Count by sentiment
        if (mention.sentiment) {
            stats.bySentiment[mention.sentiment] = (stats.bySentiment[mention.sentiment] || 0) + 1;
        }
        
        // Sum engagement
        stats.totalEngagement += mention.engagement || 0;
    });
    
    return stats;
}

// Export functions for global access
window.testSCConnection = testSCConnection;
window.testExaConnection = testExaConnection;
window.fetchSocialData = fetchSocialData;
window.fetchWebMentions = fetchWebMentions;
window.refreshSocialData = refreshSocialData;
window.testAllSocialConnections = testAllSocialConnections;
window.getSocialStats = getSocialStats;