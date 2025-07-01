// Live Feed Management Component Module

// Global variable for feed update interval
let liveFeedInterval = null;

// Initialize live feed with real or sample data
async function initializeLiveFeed() {
    // Try to load real data first, fallback to sample data
    try {
        if (typeof showNotification === 'function') {
            showNotification('Loading live feed data...', 'info');
        }
        
        await refreshFeedWithRealData();
        console.log('Live feed initialized with real data');
    } catch (error) {
        console.log('Loading sample data for live feed:', error);
        
        if (typeof showNotification === 'function') {
            showNotification('Unable to load live data, showing sample data. Check API configuration.', 'warning');
        }
        
        // Generate initial sample mentions as fallback
        dashboardState.liveFeed.mentions = generateSampleMentions();
        
        // Populate the feed
        populateLiveFeed();
        updateFeedStats();
    }
    
    // Start live updates
    startLiveFeedUpdates();
}

// Generate sample mentions for demo purposes
function generateSampleMentions() {
    const platforms = ['twitter', 'reddit', 'discord', 'linkedin', 'web'];
    const sentiments = ['positive', 'neutral', 'negative'];
    const sampleContents = [
        'Just discovered YourBrand and loving the features!',
        'Has anyone tried YourBrand? Looking for reviews.',
        'YourBrand helped us solve our attribution problem.',
        'Comparing YourBrand vs competitors - thoughts?',
        'Great customer service from YourBrand team.',
        'YourBrand pricing seems reasonable for the value.',
        'Tutorial on YourBrand was very helpful.',
        'YourBrand integration with our tools works perfectly.',
        'Recommended YourBrand to my team today.',
        'YourBrand dashboard is intuitive and well-designed.'
    ];
    
    const mentions = [];
    for (let i = 0; i < 25; i++) {
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
        const content = sampleContents[Math.floor(Math.random() * sampleContents.length)];
        
        mentions.push({
            id: Date.now() + i,
            platform: platform,
            content: content,
            sentiment: sentiment,
            engagement: Math.floor(Math.random() * 50) + 1,
            author: `user${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            url: `https://${platform}.com/mention/${i}`,
            source: 'api'
        });
    }
    
    return mentions.sort((a, b) => b.timestamp - a.timestamp);
}

// Populate the live feed display
function populateLiveFeed() {
    const feedContainer = document.getElementById('mentionsFeed');
    if (!feedContainer) return;
    
    const filteredMentions = filterMentions();
    
    feedContainer.innerHTML = '';
    
    filteredMentions.slice(0, 20).forEach(mention => {
        const mentionElement = createMentionElement(mention);
        feedContainer.appendChild(mentionElement);
    });
    
    if (filteredMentions.length === 0) {
        feedContainer.innerHTML = '<div class="no-mentions">No mentions found matching your filters.</div>';
    }
}

// Create DOM element for a single mention
function createMentionElement(mention) {
    const mentionDiv = document.createElement('div');
    mentionDiv.className = 'mention-item';
    mentionDiv.innerHTML = `
        <div class="mention-header">
            <div class="mention-platform">
                ${getPlatformIcon(mention.platform)} ${mention.platform}
            </div>
            <div class="mention-time">${formatTimeAgo(mention.timestamp)}</div>
        </div>
        <div class="mention-content">${mention.content}</div>
        <div class="mention-footer">
            <div class="mention-sentiment ${mention.sentiment}" title="${getSentimentTooltip(mention)}">
                ${getSentimentDisplay(mention)}
            </div>
            <div class="mention-engagement">${mention.engagement} interactions</div>
            <div class="mention-author">by ${mention.author}</div>
        </div>
    `;
    
    return mentionDiv;
}

// Get platform icon emoji
function getPlatformIcon(platform) {
    const icons = {
        twitter: '🐦',
        reddit: '🟠',
        discord: '💬',
        linkedin: '💼',
        web: '🌐'
    };
    return icons[platform] || '📱';
}

// Display sentiment with confidence if available
function getSentimentDisplay(mention) {
    const sentiment = mention.sentiment;
    const sentimentData = mention.sentiment_details || {};
    const confidence = sentimentData.confidence || 0;
    const method = sentimentData.method || 'basic';
    
    // Show confidence if available and > 0
    if (confidence > 0 && method !== 'fallback') {
        const confidencePercent = Math.round(confidence * 100);
        const confidenceBar = getConfidenceBar(confidence);
        return `${sentiment} ${confidenceBar} ${confidencePercent}%`;
    } else {
        // Basic display for fallback method
        return sentiment;
    }
}

// Generate confidence indicator
function getConfidenceBar(confidence) {
    // Create a simple confidence indicator
    if (confidence >= 0.8) return '●●●';
    if (confidence >= 0.6) return '●●○';
    if (confidence >= 0.4) return '●○○';
    return '○○○';
}

// Generate sentiment tooltip with details
function getSentimentTooltip(mention) {
    const sentimentData = mention.sentiment_details || {};
    
    if (!sentimentData.reasoning) {
        return `Sentiment: ${mention.sentiment}`;
    }
    
    let tooltip = `Sentiment: ${mention.sentiment}\\n`;
    tooltip += `Confidence: ${Math.round((sentimentData.confidence || 0) * 100)}%\\n`;
    tooltip += `Method: ${sentimentData.method || 'basic'}\\n`;
    
    if (sentimentData.reasoning) {
        tooltip += `Reasoning: ${sentimentData.reasoning}\\n`;
    }
    
    if (sentimentData.emotional_categories && sentimentData.emotional_categories.length > 0) {
        tooltip += `Emotions: ${sentimentData.emotional_categories.join(', ')}\\n`;
    }
    
    if (sentimentData.intensity) {
        tooltip += `Intensity: ${sentimentData.intensity}`;
    }
    
    return tooltip;
}

// Format time relative to now
function formatTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
}

// Update feed statistics display
function updateFeedStats() {
    const mentions = dashboardState.liveFeed.mentions;
    const total = mentions.length;
    const positive = mentions.filter(m => m.sentiment === 'positive').length;
    const neutral = mentions.filter(m => m.sentiment === 'neutral').length;
    const negative = mentions.filter(m => m.sentiment === 'negative').length;
    
    const totalElement = document.getElementById('totalMentions');
    const positiveElement = document.getElementById('positiveMentions');
    const neutralElement = document.getElementById('neutralMentions');
    const negativeElement = document.getElementById('negativeMentions');
    
    if (totalElement) totalElement.textContent = total;
    if (positiveElement) positiveElement.textContent = positive;
    if (neutralElement) neutralElement.textContent = neutral;
    if (negativeElement) negativeElement.textContent = negative;
}

// Filter mentions based on current filter settings
function filterMentions() {
    const platformFilter = document.getElementById('platformFilter')?.value || '';
    const sentimentFilter = document.getElementById('sentimentFilter')?.value || '';
    const keywordFilter = document.getElementById('keywordFilter')?.value.toLowerCase() || '';
    
    return dashboardState.liveFeed.mentions.filter(mention => {
        const platformMatch = !platformFilter || mention.platform === platformFilter;
        const sentimentMatch = !sentimentFilter || mention.sentiment === sentimentFilter;
        const keywordMatch = !keywordFilter || mention.content.toLowerCase().includes(keywordFilter);
        
        return platformMatch && sentimentMatch && keywordMatch;
    });
}

// Toggle live feed on/off
function toggleFeed(event) {
    // Handle case where event might not be passed (fallback to global event)
    const actualEvent = event || window.event;
    const button = actualEvent ? actualEvent.target : document.querySelector('.btn[onclick*="toggleFeed"]');
    const statusIndicator = document.getElementById('feedStatus');
    
    if (dashboardState.liveFeed.isActive) {
        dashboardState.liveFeed.isActive = false;
        if (button) button.textContent = 'Resume Feed';
        if (statusIndicator) statusIndicator.classList.remove('active');
        stopLiveFeedUpdates();
        if (typeof showNotification === 'function') {
            showNotification('Live feed paused', 'info');
        }
    } else {
        dashboardState.liveFeed.isActive = true;
        if (button) button.textContent = 'Pause Feed';
        if (statusIndicator) statusIndicator.classList.add('active');
        startLiveFeedUpdates();
        if (typeof showNotification === 'function') {
            showNotification('Live feed resumed', 'success');
        }
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Start live feed updates
function startLiveFeedUpdates() {
    if (liveFeedInterval) clearInterval(liveFeedInterval);
    
    liveFeedInterval = setInterval(() => {
        if (dashboardState.liveFeed.isActive) {
            updateLiveFeed();
        }
    }, 30000); // Update every 30 seconds
}

// Stop live feed updates
function stopLiveFeedUpdates() {
    if (liveFeedInterval) {
        clearInterval(liveFeedInterval);
        liveFeedInterval = null;
    }
}

// Update live feed with new mentions
function updateLiveFeed() {
    // Simulate new mentions coming in
    if (Math.random() > 0.7) { // 30% chance of new mention
        const newMention = generateSampleMentions()[0];
        newMention.timestamp = new Date();
        dashboardState.liveFeed.mentions.unshift(newMention);
        
        // Keep only last 100 mentions
        if (dashboardState.liveFeed.mentions.length > 100) {
            dashboardState.liveFeed.mentions = dashboardState.liveFeed.mentions.slice(0, 100);
        }
        
        // Update display
        populateLiveFeed();
        updateFeedStats();
        
        // Update last update time
        dashboardState.liveFeed.lastUpdate = new Date();
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = 'Just now';
        }
        
        if (typeof saveToLocalStorage === 'function') {
            saveToLocalStorage();
        }
    }
}

// Refresh feed with real data
async function refreshFeed() {
    if (typeof showNotification === 'function') {
        showNotification('Refreshing feed...', 'info');
    }
    
    try {
        const daysBack = (typeof currentTimeframe !== 'undefined' && currentTimeframe === '7d') ? 7 : 30;
        
        // Force refresh from APIs
        const response = await fetch('/api/refresh-mentions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                days_back: daysBack,
                platform: 'all'
            })
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            const mentions = result.data;
            console.log(`Refresh API returned ${mentions.length} mentions for live feed`);
            
            // Clear existing mentions
            dashboardState.liveFeed.mentions = [];
            
            // Convert API data to dashboard format
            mentions.forEach(mention => {
                dashboardState.liveFeed.mentions.push({
                    id: mention.id || Date.now() + Math.random(),
                    timestamp: mention.timestamp || mention.created_at || new Date().toISOString(),
                    type: mention.platform === 'web' ? 'Web Mention' : 'Social Mention',
                    content: mention.content || mention.text || 'No content available',
                    platform: mention.platform || 'unknown',
                    author: mention.author || 'Anonymous',
                    engagement: mention.engagement || 0,
                    sentiment: mention.sentiment || 'neutral',
                    sentiment_details: mention.sentiment_details || {},
                    url: mention.url || '#',
                    source: 'api'
                });
            });
            
            // Sort by timestamp (newest first)
            dashboardState.liveFeed.mentions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            // Update display
            populateLiveFeed();
            updateFeedStats();
            
            dashboardState.liveFeed.lastUpdate = new Date();
            const lastUpdateElement = document.getElementById('lastUpdate');
            if (lastUpdateElement) {
                lastUpdateElement.textContent = 'Just now';
            }
            
            if (typeof showNotification === 'function') {
                showNotification(`Feed refreshed with ${mentions.length} fresh mentions from APIs`, 'success');
            }
        } else {
            throw new Error(result.message || 'Failed to refresh mentions');
        }
    } catch (error) {
        console.error('Failed to refresh with real data, using sample data:', error);
        
        // Fallback to adding sample mentions
        const newMentions = generateSampleMentions().slice(0, 3);
        newMentions.forEach(mention => {
            mention.timestamp = new Date();
            dashboardState.liveFeed.mentions.unshift(mention);
        });
        
        // Keep only last 100 mentions
        if (dashboardState.liveFeed.mentions.length > 100) {
            dashboardState.liveFeed.mentions = dashboardState.liveFeed.mentions.slice(0, 100);
        }
        
        populateLiveFeed();
        updateFeedStats();
        
        dashboardState.liveFeed.lastUpdate = new Date();
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = 'Just now';
        }
        
        if (typeof showNotification === 'function') {
            showNotification('API refresh failed, showing sample data. Check your API keys in settings.', 'warning');
        }
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Filter feed based on current filters
function filterFeed() {
    populateLiveFeed();
}

// Load more historical mentions
function loadMoreMentions() {
    // Generate more historical mentions
    const additionalMentions = generateSampleMentions();
    additionalMentions.forEach(mention => {
        // Make them older
        mention.timestamp = new Date(mention.timestamp.getTime() - 7 * 24 * 60 * 60 * 1000);
    });
    
    dashboardState.liveFeed.mentions.push(...additionalMentions);
    populateLiveFeed();
    updateFeedStats();
    
    if (typeof showNotification === 'function') {
        showNotification(`Loaded ${additionalMentions.length} more mentions`, 'success');
    }
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Export feed data to CSV
function exportFeed() {
    const mentions = filterMentions();
    
    if (mentions.length === 0) {
        if (typeof showNotification === 'function') {
            showNotification('No mentions to export', 'warning');
        }
        return;
    }
    
    const csvContent = [
        'Date,Platform,Content,Sentiment,Engagement,Author,URL',
        ...mentions.map(mention => {
            const date = new Date(mention.timestamp).toISOString().split('T')[0];
            const content = mention.content.replace(/"/g, '""'); // Escape quotes
            return `${date},${mention.platform},"${content}",${mention.sentiment},${mention.engagement},${mention.author},${mention.url}`;
        })
    ].join('\\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mentions-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (typeof showNotification === 'function') {
        showNotification(`Exported ${mentions.length} mentions to CSV`, 'success');
    }
}

// Refresh feed with real data from API
async function refreshFeedWithRealData() {
    try {
        const daysBack = (typeof currentTimeframe !== 'undefined' && currentTimeframe === '7d') ? 7 : 30;
        
        // First, try to get cached data
        let response = await fetch(`/api/fetch-mentions?days_back=${daysBack}&platform=all`, {
            credentials: 'include'
        });
        let result = await response.json();
        
        // If no cached data or force refresh, call refresh endpoint
        if (result.status === 'success' && result.data.length === 0 && result.source === 'empty') {
            console.log('No cached data found, fetching fresh data from APIs...');
            
            if (typeof showNotification === 'function') {
                showNotification('Fetching fresh data from social media APIs...', 'info');
            }
            
            // Call refresh endpoint to get fresh data
            response = await fetch('/api/refresh-mentions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    days_back: daysBack,
                    platform: 'all'
                })
            });
            result = await response.json();
        }
        
        if (result.status === 'success') {
            const mentions = result.data;
            console.log(`API returned ${mentions.length} mentions for live feed (source: ${result.source || 'unknown'})`);
            
            // Clear existing mentions
            dashboardState.liveFeed.mentions = [];
            
            // Convert API data to dashboard format
            mentions.forEach(mention => {
                dashboardState.liveFeed.mentions.push({
                    id: mention.id || Date.now() + Math.random(),
                    timestamp: mention.timestamp || mention.created_at || new Date().toISOString(),
                    type: mention.platform === 'web' ? 'Web Mention' : 'Social Mention',
                    content: mention.content || mention.text || 'No content available',
                    platform: mention.platform || 'unknown',
                    author: mention.author || 'Anonymous',
                    engagement: mention.engagement || 0,
                    sentiment: mention.sentiment || 'neutral',
                    sentiment_details: mention.sentiment_details || {},
                    url: mention.url || '#',
                    source: 'api'
                });
            });
            
            // Sort by timestamp (newest first)
            dashboardState.liveFeed.mentions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            // Update display
            populateLiveFeed();
            updateFeedStats();
            
            if (typeof saveToLocalStorage === 'function') {
                saveToLocalStorage();
            }
            
            // Show success notification with source info
            if (typeof showNotification === 'function') {
                if (result.source === 'live_api') {
                    showNotification(`Loaded ${mentions.length} fresh mentions from APIs`, 'success');
                } else if (result.source === 'cache') {
                    showNotification(`Loaded ${mentions.length} cached mentions`, 'info');
                }
            }
        } else {
            throw new Error(result.message || 'Failed to fetch mentions');
        }
    } catch (error) {
        console.error('Error refreshing feed with real data:', error);
        throw error;
    }
}

// Export functions for global access
window.initializeLiveFeed = initializeLiveFeed;
window.generateSampleMentions = generateSampleMentions;
window.populateLiveFeed = populateLiveFeed;
window.createMentionElement = createMentionElement;
window.getPlatformIcon = getPlatformIcon;
window.getSentimentDisplay = getSentimentDisplay;
window.getConfidenceBar = getConfidenceBar;
window.getSentimentTooltip = getSentimentTooltip;
window.formatTimeAgo = formatTimeAgo;
window.updateFeedStats = updateFeedStats;
window.filterMentions = filterMentions;
window.toggleFeed = toggleFeed;
window.startLiveFeedUpdates = startLiveFeedUpdates;
window.stopLiveFeedUpdates = stopLiveFeedUpdates;
window.updateLiveFeed = updateLiveFeed;
window.refreshFeed = refreshFeed;
window.filterFeed = filterFeed;
window.loadMoreMentions = loadMoreMentions;
window.exportFeed = exportFeed;
window.refreshFeedWithRealData = refreshFeedWithRealData;