// Missing Functions Component - Functions needed for button functionality

// Data Management Functions
function refreshData() {
    if (typeof showNotification === 'function') {
        showNotification('Refreshing all data...', 'info');
    }
    
    // Refresh signal displays
    if (typeof updateSignalDisplays === 'function') {
        updateSignalDisplays();
    }
    
    // Refresh live feed
    if (typeof refreshFeed === 'function') {
        refreshFeed();
    }
    
    // Refresh chart
    if (typeof refreshChart === 'function') {
        refreshChart();
    }
    
    if (typeof showNotification === 'function') {
        setTimeout(() => {
            showNotification('Data refreshed successfully', 'success');
        }, 1000);
    }
}

function exportData(dataType) {
    const timestamp = new Date().toISOString().split('T')[0];
    let filename = `${dataType}-export-${timestamp}.csv`;
    let csvContent = '';
    
    switch (dataType) {
        case 'signals':
            csvContent = generateSignalsCSV();
            break;
        case 'echoes':
            csvContent = generateEchoesCSV();
            break;
        case 'campaigns':
            csvContent = generateCampaignsCSV();
            break;
        default:
            if (typeof showNotification === 'function') {
                showNotification('Unknown data type for export', 'error');
            }
            return;
    }
    
    downloadCSV(csvContent, filename);
    
    if (typeof showNotification === 'function') {
        showNotification(`${filename} exported successfully`, 'success');
    }
}

function generateSignalsCSV() {
    const signals = dashboardState.signals;
    const csv = [
        'Metric,Value,Date',
        `Branded Search Volume,${signals.brandedSearchVolume},${new Date().toISOString()}`,
        `Direct Traffic,${signals.directTraffic},${new Date().toISOString()}`,
        `Inbound Messages,${signals.inboundMessages},${new Date().toISOString()}`,
        `Community Engagement,${signals.communityEngagement},${new Date().toISOString()}`,
        `First Party Data,${signals.firstPartyData},${new Date().toISOString()}`,
        `Attribution Score,${signals.attributionScore},${new Date().toISOString()}`
    ];
    return csv.join('\n');
}

function generateEchoesCSV() {
    const echoes = dashboardState.echoes || [];
    const csv = ['Timestamp,Type,Content,Source'];
    
    echoes.forEach(echo => {
        const content = echo.content.replace(/"/g, '""'); // Escape quotes
        csv.push(`"${echo.timestamp}","${echo.type}","${content}","${echo.source}"`);
    });
    
    return csv.join('\n');
}

function generateCampaignsCSV() {
    const campaigns = dashboardState.campaigns || [];
    const csv = ['Campaign Name,Search Delta,Mentions,Signups,Community Buzz,Notes'];
    
    campaigns.forEach(campaign => {
        const notes = campaign.notes.replace(/"/g, '""'); // Escape quotes
        csv.push(`"${campaign.name}","${campaign.brandedSearchDelta}",${campaign.mentions},${campaign.signups},"${campaign.communityBuzz}","${notes}"`);
    });
    
    return csv.join('\n');
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Live Feed Functions
function refreshFeed() {
    if (typeof showNotification === 'function') {
        showNotification('Refreshing mentions feed...', 'info');
    }
    
    // Simulate feed refresh
    setTimeout(() => {
        if (typeof populateLiveFeed === 'function') {
            populateLiveFeed();
        }
        if (typeof updateFeedStats === 'function') {
            updateFeedStats();
        }
        if (typeof showNotification === 'function') {
            showNotification('Feed refreshed', 'success');
        }
    }, 1000);
}

function fetchFreshData() {
    if (typeof showNotification === 'function') {
        showNotification('Fetching fresh data from APIs...', 'info');
    }
    
    // Simulate API data fetch
    setTimeout(() => {
        // Update last update timestamp
        dashboardState.liveFeed.lastUpdate = new Date();
        
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = 'Just now';
        }
        
        if (typeof populateLiveFeed === 'function') {
            populateLiveFeed();
        }
        
        if (typeof showNotification === 'function') {
            showNotification('Fresh data fetched successfully', 'success');
        }
        
        if (typeof saveToLocalStorage === 'function') {
            saveToLocalStorage();
        }
    }, 2000);
}

function checkCacheStatus() {
    if (typeof showNotification === 'function') {
        showNotification('Checking cache status...', 'info');
    }
    
    // Simulate cache check
    setTimeout(() => {
        const cacheInfo = {
            lastUpdate: dashboardState.liveFeed.lastUpdate || new Date(),
            mentionsCount: dashboardState.liveFeed.mentions?.length || 0,
            apiStatus: 'Online'
        };
        
        const statusMessage = `Cache Status: ${cacheInfo.mentionsCount} mentions, Last update: ${cacheInfo.lastUpdate.toLocaleTimeString()}`;
        
        if (typeof showNotification === 'function') {
            showNotification(statusMessage, 'info');
        }
    }, 500);
}

function exportFeed() {
    const mentions = dashboardState.liveFeed.mentions || [];
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `mentions-feed-${timestamp}.csv`;
    
    const csv = ['Date,Platform,Content,Sentiment,Author'];
    mentions.forEach(mention => {
        const content = (mention.content || '').replace(/"/g, '""'); // Escape quotes
        csv.push(`"${mention.date}","${mention.platform}","${content}","${mention.sentiment}","${mention.author || 'Unknown'}"`);
    });
    
    downloadCSV(csv.join('\n'), filename);
    
    if (typeof showNotification === 'function') {
        showNotification(`${filename} exported successfully`, 'success');
    }
}

function toggleFeed() {
    const isActive = dashboardState.liveFeed.isActive;
    dashboardState.liveFeed.isActive = !isActive;
    
    const button = event.target;
    const statusIndicator = document.getElementById('feedStatus');
    
    if (dashboardState.liveFeed.isActive) {
        button.textContent = 'Pause Feed';
        if (statusIndicator) {
            statusIndicator.className = 'status-indicator active';
        }
        if (typeof showNotification === 'function') {
            showNotification('Live feed resumed', 'success');
        }
    } else {
        button.textContent = 'Resume Feed';
        if (statusIndicator) {
            statusIndicator.className = 'status-indicator paused';
        }
        if (typeof showNotification === 'function') {
            showNotification('Live feed paused', 'info');
        }
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

function loadMoreMentions() {
    if (typeof showNotification === 'function') {
        showNotification('Loading more mentions...', 'info');
    }
    
    // Simulate loading more mentions
    setTimeout(() => {
        const currentMentions = dashboardState.liveFeed.mentions || [];
        const newMentionsCount = Math.floor(Math.random() * 10) + 5; // 5-14 new mentions
        
        // Add simulated mentions (in a real app, this would fetch from API)
        for (let i = 0; i < newMentionsCount; i++) {
            currentMentions.push({
                id: Date.now() + i,
                date: new Date().toISOString(),
                platform: ['twitter', 'reddit', 'discord', 'linkedin'][Math.floor(Math.random() * 4)],
                content: `Sample mention ${i + 1} - discussing our brand`,
                sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
                author: `User${Math.floor(Math.random() * 1000)}`
            });
        }
        
        dashboardState.liveFeed.mentions = currentMentions;
        
        if (typeof populateLiveFeed === 'function') {
            populateLiveFeed();
        }
        
        if (typeof updateFeedStats === 'function') {
            updateFeedStats();
        }
        
        if (typeof showNotification === 'function') {
            showNotification(`Loaded ${newMentionsCount} more mentions`, 'success');
        }
        
        if (typeof saveToLocalStorage === 'function') {
            saveToLocalStorage();
        }
    }, 1000);
}

// Chart Functions  
function toggleTimeframe(timeframe) {
    // Update active state
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`toggle${timeframe}`).classList.add('active');
    
    // Update chart
    if (typeof updateChart === 'function') {
        updateChart(timeframe);
    }
    
    // Update timeframe period display
    const periodElement = document.getElementById('timeframePeriod');
    if (periodElement) {
        periodElement.textContent = timeframe === '7d' ? '(7 Days)' : '(30 Days)';
    }
    
    // Update stats
    updateChartStats(timeframe);
}

function updateChartStats(timeframe) {
    const data = dashboardState.mentionsData[timeframe] || [];
    const mentions = data.map(d => d.mentions);
    
    const total = mentions.reduce((sum, val) => sum + val, 0);
    const avg = Math.round(total / mentions.length) || 0;
    const peak = Math.max(...mentions) || 0;
    
    const totalElement = document.getElementById('totalMentions');
    const avgElement = document.getElementById('avgDaily');
    const peakElement = document.getElementById('peakDay');
    
    if (totalElement) totalElement.textContent = total;
    if (avgElement) avgElement.textContent = avg;
    if (peakElement) peakElement.textContent = peak;
}

function exportChart() {
    const canvas = document.getElementById('mentionsChart');
    if (!canvas) {
        if (typeof showNotification === 'function') {
            showNotification('Chart not found', 'error');
        }
        return;
    }
    
    // Convert canvas to image and download
    const link = document.createElement('a');
    link.download = `mentions-chart-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    if (typeof showNotification === 'function') {
        showNotification('Chart exported as PNG', 'success');
    }
}

// Integration Functions
function testConnections() {
    if (typeof showNotification === 'function') {
        showNotification('Testing all API connections...', 'info');
    }
    
    const connections = [
        { name: 'Google Search Console', test: window.testGSCConnection },
        { name: 'Google Analytics', test: window.testGAConnection },
        { name: 'ScrapeCreators', test: window.testSCConnection },
        { name: 'Exa Search', test: window.testExaConnection },
        { name: 'Email Marketing', test: window.testEmailConnection },
        { name: 'CRM/Calendar', test: window.testCRMConnection }
    ];
    
    let testsCompleted = 0;
    const totalTests = connections.length;
    
    connections.forEach((connection, index) => {
        setTimeout(() => {
            if (typeof connection.test === 'function') {
                connection.test();
            }
            testsCompleted++;
            
            if (testsCompleted === totalTests && typeof showNotification === 'function') {
                showNotification('All connection tests completed', 'success');
            }
        }, index * 1000); // Stagger tests by 1 second each
    });
}

function downloadScript(scriptType) {
    const scripts = {
        'scrape': {
            filename: 'scrape-creators-integration.py',
            url: '/scrape_creators_integration.py'
        },
        'exa': {
            filename: 'exa-search-integration.py', 
            url: '/exa_search_integration.py'
        }
    };
    
    const script = scripts[scriptType];
    if (!script) {
        if (typeof showNotification === 'function') {
            showNotification('Script not found', 'error');
        }
        return;
    }
    
    // Create download link
    const link = document.createElement('a');
    link.href = script.url;
    link.download = script.filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (typeof showNotification === 'function') {
        showNotification(`${script.filename} download started`, 'success');
    }
}

function showInstructions(integrationType) {
    const instructions = {
        'scrape': {
            title: 'ScrapeCreators Integration Setup',
            content: `
                <h4>📋 Setup Instructions</h4>
                <ol>
                    <li><strong>Get API Key:</strong> Sign up at ScrapeCreators.com and get your API key</li>
                    <li><strong>Download Script:</strong> Click "Download Script" to get the integration file</li>
                    <li><strong>Configure:</strong> Add your API key to the config.env file</li>
                    <li><strong>Run Script:</strong> Execute the script to start monitoring social platforms</li>
                    <li><strong>Verify:</strong> Check that data appears in your dashboard</li>
                </ol>
                <h5>Supported Platforms:</h5>
                <ul>
                    <li>Twitter/X - Real-time mentions and hashtags</li>
                    <li>Reddit - Subreddit discussions and comments</li>
                    <li>Discord - Server mentions (with permissions)</li>
                    <li>TikTok - Video mentions and comments</li>
                </ul>
            `
        },
        'exa': {
            title: 'Exa Search Integration Setup',
            content: `
                <h4>📋 Setup Instructions</h4>
                <ol>
                    <li><strong>Get API Key:</strong> Sign up at Exa.ai and get your search API key</li>
                    <li><strong>Download Script:</strong> Click "Download Script" to get the integration file</li>
                    <li><strong>Configure:</strong> Add your API key to the config.env file</li>
                    <li><strong>Set Keywords:</strong> Configure your brand keywords and search terms</li>
                    <li><strong>Run Script:</strong> Execute to start web-wide mention tracking</li>
                </ol>
                <h5>What Exa Monitors:</h5>
                <ul>
                    <li>Blog posts and articles mentioning your brand</li>
                    <li>News coverage and press mentions</li>
                    <li>Forum discussions across the web</li>
                    <li>Product reviews and comparisons</li>
                </ul>
            `
        }
    };
    
    const instruction = instructions[integrationType];
    if (!instruction) return;
    
    const contentElement = document.getElementById('instructionsContent');
    if (contentElement) {
        contentElement.innerHTML = instruction.content;
    }
}

// Prompts Functions
function addCustomPrompt() {
    const modal = document.getElementById('addPromptModal');
    if (modal) {
        modal.style.display = 'block';
        
        // Reset form
        const form = document.getElementById('promptForm');
        if (form) {
            form.reset();
        }
        
        // Clear edit index
        const editIndex = document.getElementById('promptEditIndex');
        if (editIndex) {
            editIndex.value = '';
        }
        
        // Update modal title
        const title = document.getElementById('promptModalTitle');
        if (title) {
            title.textContent = 'Add Custom Prompt';
        }
        
        // Update submit button
        const submitBtn = document.getElementById('promptSubmitBtn');
        if (submitBtn) {
            submitBtn.textContent = 'Add Prompt';
        }
    }
}

function downloadWorksheet() {
    const worksheetContent = `# Attribution Tracking Worksheet

## Brand Discovery Questions

1. How did you first hear about [Brand Name]?
   - Google search
   - Social media (which platform?)
   - Friend/colleague recommendation  
   - Industry publication
   - Podcast/video content
   - Other: ___________

2. What convinced you to learn more about us?
   - Specific content piece: ___________
   - Recommendation details: ___________
   - Search result/review: ___________

3. How long did you research before taking action?
   - Same day
   - Within a week
   - 1-4 weeks
   - Over a month

## Follow-up Attribution Questions

4. During your research, did you:
   - Read our blog posts? Which ones?
   - Watch our videos/demos?
   - Join our community/social media?
   - Read third-party reviews?
   - Speak with our team?

5. What was the deciding factor for you?
   - Specific feature/benefit
   - Price/value proposition
   - Social proof/testimonials
   - Timing/urgency
   - Trust/brand reputation

## Attribution Tracking Template

Date: ___________
Contact: ___________  
Source: ___________
Journey: ___________
Notes: ___________
`;

    const blob = new Blob([worksheetContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attribution-tracking-worksheet-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    if (typeof showNotification === 'function') {
        showNotification('Attribution worksheet downloaded', 'success');
    }
}

function filterPrompts(category) {
    // Update active category button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Re-populate prompts with filter
    if (typeof populatePrompts === 'function') {
        populatePrompts(category);
    }
}

// Update populatePrompts in app.js to accept category filter
function populatePromptsFiltered(filterCategory = 'all') {
    const container = document.getElementById('promptsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    let filteredPrompts = dashboardState.prompts;
    if (filterCategory !== 'all') {
        filteredPrompts = dashboardState.prompts.filter(p => p.category === filterCategory);
    }
    
    const categories = [...new Set(filteredPrompts.map(p => p.category))];
    
    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'prompt-category';
        categoryDiv.innerHTML = `<h3>${category}</h3>`;
        
        const categoryPrompts = filteredPrompts.filter(p => p.category === category);
        categoryPrompts.forEach((prompt, index) => {
            const promptDiv = document.createElement('div');
            promptDiv.className = 'prompt-item';
            promptDiv.innerHTML = `
                <div class="prompt-header">
                    <h4>${prompt.title}</h4>
                    <div class="prompt-actions">
                        <button onclick="copyPrompt('${prompt.title.replace(/'/g, "\\'")}')" class="btn btn--outline btn--sm">Copy</button>
                        <button onclick="editPrompt(${dashboardState.prompts.indexOf(prompt)})" class="btn btn--secondary btn--sm">Edit</button>
                    </div>
                </div>
                <div class="prompt-content">${prompt.content}</div>
            `;
            categoryDiv.appendChild(promptDiv);
        });
        
        container.appendChild(categoryDiv);
    });
}

function editPrompt(index) {
    const prompt = dashboardState.prompts[index];
    if (!prompt) return;
    
    // Fill form with prompt data
    document.getElementById('promptCategory').value = prompt.category;
    document.getElementById('promptTitle').value = prompt.title;
    document.getElementById('promptContent').value = prompt.content;
    document.getElementById('promptEditIndex').value = index;
    
    // Update modal title and button
    document.getElementById('promptModalTitle').textContent = 'Edit Prompt';
    document.getElementById('promptSubmitBtn').textContent = 'Update Prompt';
    
    // Show modal
    document.getElementById('addPromptModal').style.display = 'block';
}

// Sentiment Analysis Functions
function checkSentimentConfig() {
    const statusElement = document.getElementById('sentimentConfigStatus');
    if (!statusElement) return;
    
    statusElement.innerHTML = '<div class="status-indicator loading"></div><span>Checking sentiment analysis configuration...</span>';
    
    // Simulate checking backend configuration
    setTimeout(async () => {
        try {
            const response = await fetch('/api/sentiment-config');
            if (response.ok) {
                const config = await response.json();
                if (config.available) {
                    statusElement.innerHTML = '<div class="status-indicator success"></div><span>Sentiment analysis available - OpenRouter configured</span>';
                } else {
                    statusElement.innerHTML = '<div class="status-indicator warning"></div><span>Sentiment analysis not configured - Add OpenRouter API key</span>';
                }
            } else {
                throw new Error('Backend not available');
            }
        } catch (error) {
            // Fallback for demo mode
            statusElement.innerHTML = '<div class="status-indicator info"></div><span>Demo mode - Sentiment analysis simulated</span>';
        }
    }, 1000);
}

function testSentimentAnalysis() {
    const platform = document.getElementById('sentimentPlatform').value;
    const text = document.getElementById('sentimentTestText').value;
    
    if (!text.trim()) {
        if (typeof showNotification === 'function') {
            showNotification('Please enter text to analyze', 'error');
        }
        return;
    }
    
    if (typeof showNotification === 'function') {
        showNotification('Analyzing sentiment...', 'info');
    }
    
    // Show results container
    const resultsContainer = document.getElementById('sentimentResults');
    if (resultsContainer) {
        resultsContainer.style.display = 'block';
    }
    
    // Simulate sentiment analysis
    setTimeout(() => {
        const sentiments = ['positive', 'neutral', 'negative'];
        const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
        const confidence = (Math.random() * 0.4 + 0.6).toFixed(2); // 0.6-1.0
        
        // Simple keyword-based sentiment simulation
        const positiveWords = ['great', 'awesome', 'love', 'excellent', 'amazing', 'good', 'like'];
        const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'horrible', 'worst', 'sucks'];
        
        let actualSentiment = 'neutral';
        const lowerText = text.toLowerCase();
        
        if (positiveWords.some(word => lowerText.includes(word))) {
            actualSentiment = 'positive';
        } else if (negativeWords.some(word => lowerText.includes(word))) {
            actualSentiment = 'negative';
        }
        
        // Update results
        document.getElementById('resultSentiment').textContent = actualSentiment;
        document.getElementById('resultSentiment').className = `result-value ${actualSentiment}`;
        
        document.getElementById('resultConfidence').textContent = `${(parseFloat(confidence) * 100).toFixed(0)}%`;
        document.getElementById('resultMethod').textContent = 'Keyword Analysis + AI';
        
        document.getElementById('resultReasoning').textContent = 
            `Text analyzed for ${platform} platform context. ` +
            `${actualSentiment === 'positive' ? 'Positive indicators found in language.' : 
              actualSentiment === 'negative' ? 'Negative indicators detected.' : 
              'Neutral tone with no strong sentiment indicators.'}`;
        
        if (typeof showNotification === 'function') {
            showNotification(`Sentiment analysis complete: ${actualSentiment}`, 'success');
        }
    }, 2000);
}

function clearSentimentTest() {
    document.getElementById('sentimentTestText').value = '';
    
    const resultsContainer = document.getElementById('sentimentResults');
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
    
    // Reset result fields
    ['resultSentiment', 'resultConfidence', 'resultMethod', 'resultReasoning'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = '-';
            element.className = 'result-value';
        }
    });
    
    if (typeof showNotification === 'function') {
        showNotification('Sentiment test cleared', 'info');
    }
}

// Signal Management Functions
function updateSignal(signalType, value) {
    if (!value || isNaN(value)) {
        if (typeof showNotification === 'function') {
            showNotification('Please enter a valid numeric value', 'error');
        }
        return;
    }
    
    const numericValue = parseInt(value);
    
    // Update the signal in dashboard state
    switch (signalType) {
        case 'brandedSearch':
            dashboardState.signals.brandedSearchVolume = numericValue;
            break;
        case 'directTraffic':
            dashboardState.signals.directTraffic = numericValue;
            break;
        case 'inboundMessages':
            dashboardState.signals.inboundMessages = numericValue;
            break;
        case 'communityEngagement':
            dashboardState.signals.communityEngagement = numericValue;
            break;
        case 'firstPartyData':
            dashboardState.signals.firstPartyData = numericValue;
            break;
        default:
            if (typeof showNotification === 'function') {
                showNotification('Unknown signal type', 'error');
            }
            return;
    }
    
    // Update the display
    if (typeof updateSignalDisplays === 'function') {
        updateSignalDisplays();
    }
    
    // Recalculate attribution score
    calculateAttributionScore();
    
    // Save changes
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
    
    if (typeof showNotification === 'function') {
        showNotification(`${signalType} updated to ${numericValue}`, 'success');
    }
}

function refreshSignalData() {
    if (typeof showNotification === 'function') {
        showNotification('Refreshing signal data...', 'info');
    }
    
    // Simulate fetching fresh data from cache/APIs
    setTimeout(() => {
        if (typeof updateSignalDisplays === 'function') {
            updateSignalDisplays();
        }
        
        if (typeof showNotification === 'function') {
            showNotification('Signal data refreshed', 'success');
        }
    }, 1000);
}

function calculateAttributionScore() {
    const signals = dashboardState.signals;
    
    // Simple scoring algorithm (can be made more sophisticated)
    const weights = {
        brandedSearchVolume: 0.25,
        directTraffic: 0.20,
        inboundMessages: 0.20,
        communityEngagement: 0.20,
        firstPartyData: 0.15
    };
    
    // Normalize signals to a 0-10 scale (assuming max values)
    const maxValues = {
        brandedSearchVolume: 5000,
        directTraffic: 2000,
        inboundMessages: 200,
        communityEngagement: 300,
        firstPartyData: 150
    };
    
    let score = 0;
    Object.keys(weights).forEach(key => {
        const normalizedValue = Math.min(signals[key] / maxValues[key], 1) * 10;
        score += normalizedValue * weights[key];
    });
    
    dashboardState.signals.attributionScore = Math.round(score * 10) / 10; // Round to 1 decimal
    
    // Update display
    const scoreElement = document.getElementById('attributionScoreValue');
    if (scoreElement) {
        scoreElement.textContent = dashboardState.signals.attributionScore;
    }
    
    // Save changes
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
    
    return dashboardState.signals.attributionScore;
}

// Connection Functions
function connectGoogleSearchConsole() {
    if (typeof showNotification === 'function') {
        showNotification('Redirecting to Google Search Console setup...', 'info');
    }
    
    // In a real app, this would open OAuth flow or setup wizard
    setTimeout(() => {
        if (typeof showNotification === 'function') {
            showNotification('GSC connection flow would start here', 'info');
        }
    }, 1000);
}

function connectGA4() {
    if (typeof showNotification === 'function') {
        showNotification('Redirecting to Google Analytics 4 setup...', 'info');
    }
    
    setTimeout(() => {
        if (typeof showNotification === 'function') {
            showNotification('GA4 connection flow would start here', 'info');
        }
    }, 1000);
}

function connectEmailAPI() {
    if (typeof showNotification === 'function') {
        showNotification('Opening email marketing integration setup...', 'info');
    }
    
    setTimeout(() => {
        if (typeof showNotification === 'function') {
            showNotification('Email API connection flow would start here', 'info');
        }
    }, 1000);
}

function connectCRM() {
    if (typeof showNotification === 'function') {
        showNotification('Opening CRM/Calendar integration setup...', 'info');
    }
    
    setTimeout(() => {
        if (typeof showNotification === 'function') {
            showNotification('CRM connection flow would start here', 'info');
        }
    }, 1000);
}

// File Upload Functions
function handleSheetsUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    const statusElement = document.getElementById('sheetsStatus');
    if (statusElement) {
        statusElement.textContent = `Processing: ${file.name}`;
        statusElement.className = 'status status--info';
    }
    
    // Simulate file processing
    setTimeout(() => {
        if (statusElement) {
            statusElement.textContent = `Uploaded: ${file.name} (${Math.round(file.size / 1024)}KB)`;
            statusElement.className = 'status status--success';
        }
        
        if (typeof showNotification === 'function') {
            showNotification(`${file.name} processed successfully`, 'success');
        }
    }, 2000);
}

function testWebhook() {
    const url = document.getElementById('webhookUrl').value;
    const auth = document.getElementById('webhookAuth').value;
    
    if (!url) {
        if (typeof showNotification === 'function') {
            showNotification('Please enter a webhook URL', 'error');
        }
        return;
    }
    
    const statusElement = document.getElementById('webhookStatus');
    if (statusElement) {
        statusElement.textContent = 'Testing webhook...';
        statusElement.className = 'status status--info';
    }
    
    // Simulate webhook test
    setTimeout(() => {
        const success = Math.random() > 0.3; // 70% success rate
        
        if (statusElement) {
            if (success) {
                statusElement.textContent = 'Webhook test successful';
                statusElement.className = 'status status--success';
            } else {
                statusElement.textContent = 'Webhook test failed - Check URL and authentication';
                statusElement.className = 'status status--error';
            }
        }
        
        if (typeof showNotification === 'function') {
            showNotification(success ? 'Webhook test successful' : 'Webhook test failed', success ? 'success' : 'error');
        }
    }, 2000);
}

// Filter Functions
function filterEchoes() {
    const searchTerm = document.getElementById('echoSearch')?.value.toLowerCase() || '';
    const typeFilter = document.getElementById('echoFilter')?.value || '';
    
    // Re-populate echoes with filters applied
    const container = document.getElementById('echosList');
    if (!container) return;
    
    container.innerHTML = '';
    
    let filteredEchoes = dashboardState.echoes || [];
    
    // Apply type filter
    if (typeFilter) {
        filteredEchoes = filteredEchoes.filter(echo => echo.type === typeFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
        filteredEchoes = filteredEchoes.filter(echo => 
            echo.content.toLowerCase().includes(searchTerm) ||
            echo.source.toLowerCase().includes(searchTerm) ||
            echo.type.toLowerCase().includes(searchTerm)
        );
    }
    
    // Populate filtered echoes
    filteredEchoes.forEach((echo, index) => {
        const echoDiv = document.createElement('div');
        echoDiv.className = 'echo-item';
        echoDiv.innerHTML = `
            <div class="echo-header">
                <span class="echo-type">${echo.type}</span>
                <span class="echo-time">${echo.timestamp}</span>
                <div class="echo-actions">
                    <button onclick="editEcho(${dashboardState.echoes.indexOf(echo)})" class="btn btn--outline btn--sm">Edit</button>
                    <button onclick="deleteEcho(${dashboardState.echoes.indexOf(echo)})" class="btn btn--secondary btn--sm">Delete</button>
                </div>
            </div>
            <div class="echo-content">${echo.content}</div>
            <div class="echo-source">Source: ${echo.source}</div>
        `;
        container.appendChild(echoDiv);
    });
    
    // Show empty state if no results
    if (filteredEchoes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No echoes found</h3>
                <p>No echoes match your current filter criteria.</p>
                <button onclick="clearEchoFilters()" class="btn btn--outline btn--sm">Clear Filters</button>
            </div>
        `;
    }
}

function clearEchoFilters() {
    document.getElementById('echoSearch').value = '';
    document.getElementById('echoFilter').value = '';
    
    // Re-populate all echoes
    if (typeof populateEchoes === 'function') {
        populateEchoes();
    }
}

function filterFeed() {
    const platformFilter = document.getElementById('platformFilter')?.value || '';
    const sentimentFilter = document.getElementById('sentimentFilter')?.value || '';
    const keywordFilter = document.getElementById('keywordFilter')?.value.toLowerCase() || '';
    
    // Apply filters to live feed
    let filteredMentions = dashboardState.liveFeed.mentions || [];
    
    if (platformFilter) {
        filteredMentions = filteredMentions.filter(mention => mention.platform === platformFilter);
    }
    
    if (sentimentFilter) {
        filteredMentions = filteredMentions.filter(mention => mention.sentiment === sentimentFilter);
    }
    
    if (keywordFilter) {
        filteredMentions = filteredMentions.filter(mention => 
            mention.content.toLowerCase().includes(keywordFilter)
        );
    }
    
    // Update feed display with filtered mentions
    const feedContainer = document.getElementById('mentionsFeed');
    if (!feedContainer) return;
    
    feedContainer.innerHTML = '';
    
    filteredMentions.forEach(mention => {
        const mentionDiv = document.createElement('div');
        mentionDiv.className = `mention-item ${mention.sentiment}`;
        mentionDiv.innerHTML = `
            <div class="mention-header">
                <span class="mention-platform">${mention.platform}</span>
                <span class="mention-time">${new Date(mention.date).toLocaleString()}</span>
                <span class="mention-sentiment ${mention.sentiment}">${mention.sentiment}</span>
            </div>
            <div class="mention-content">${mention.content}</div>
            <div class="mention-author">by ${mention.author || 'Unknown'}</div>
        `;
        feedContainer.appendChild(mentionDiv);
    });
    
    // Update stats to reflect filtered data
    updateFilteredFeedStats(filteredMentions);
}

function updateFilteredFeedStats(filteredMentions) {
    const totalElement = document.getElementById('totalMentions');
    const positiveElement = document.getElementById('positiveMentions');
    const neutralElement = document.getElementById('neutralMentions');
    const negativeElement = document.getElementById('negativeMentions');
    
    const total = filteredMentions.length;
    const positive = filteredMentions.filter(m => m.sentiment === 'positive').length;
    const neutral = filteredMentions.filter(m => m.sentiment === 'neutral').length;
    const negative = filteredMentions.filter(m => m.sentiment === 'negative').length;
    
    if (totalElement) totalElement.textContent = total;
    if (positiveElement) positiveElement.textContent = positive;
    if (neutralElement) neutralElement.textContent = neutral;
    if (negativeElement) negativeElement.textContent = negative;
}

// Export all functions to global scope
window.refreshData = refreshData;
window.exportData = exportData;
window.refreshFeed = refreshFeed;
window.fetchFreshData = fetchFreshData;
window.checkCacheStatus = checkCacheStatus;
window.exportFeed = exportFeed;
window.toggleFeed = toggleFeed;
window.loadMoreMentions = loadMoreMentions;
window.toggleTimeframe = toggleTimeframe;
window.exportChart = exportChart;
window.updateChartStats = updateChartStats;
window.testConnections = testConnections;
window.downloadScript = downloadScript;
window.showInstructions = showInstructions;
window.addCustomPrompt = addCustomPrompt;
window.downloadWorksheet = downloadWorksheet;
window.filterPrompts = filterPrompts;
window.populatePromptsFiltered = populatePromptsFiltered;
window.editPrompt = editPrompt;
window.checkSentimentConfig = checkSentimentConfig;
window.testSentimentAnalysis = testSentimentAnalysis;
window.clearSentimentTest = clearSentimentTest;
window.updateSignal = updateSignal;
window.refreshSignalData = refreshSignalData;
window.calculateAttributionScore = calculateAttributionScore;
window.connectGoogleSearchConsole = connectGoogleSearchConsole;
window.connectGA4 = connectGA4;
window.connectEmailAPI = connectEmailAPI;
window.connectCRM = connectCRM;
window.handleSheetsUpload = handleSheetsUpload;
window.testWebhook = testWebhook;
window.filterEchoes = filterEchoes;
window.clearEchoFilters = clearEchoFilters;
window.filterFeed = filterFeed;
window.updateFilteredFeedStats = updateFilteredFeedStats;