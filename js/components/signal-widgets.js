// Signal Widgets and Metrics Component Module

// Update a specific signal value and recalculate attribution score
function updateSignal(type, value) {
    const signalMappings = {
        'brandedSearch': {
            element: 'brandedSearchValue',
            stateKey: 'brandedSearchVolume'
        },
        'directTraffic': {
            element: 'directTrafficValue',
            stateKey: 'directTraffic'
        },
        'inboundMessages': {
            element: 'inboundMessagesValue',
            stateKey: 'inboundMessages'
        },
        'communityEngagement': {
            element: 'communityEngagementValue',
            stateKey: 'communityEngagement'
        },
        'firstPartyData': {
            element: 'firstPartyDataValue',
            stateKey: 'firstPartyData'
        }
    };
    
    const mapping = signalMappings[type];
    if (!mapping) return;
    
    // Update dashboard state
    dashboardState.signals[mapping.stateKey] = value;
    
    // Update UI
    updateSignalValue(mapping.element, value);
    
    // Recalculate attribution score
    calculateAttributionScore();
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Update signal value display in DOM
function updateSignalValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = typeof value === 'number' ? value.toLocaleString() : value;
    }
}

// Update signal trend display with appropriate styling
function updateSignalTrend(elementId, trend) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.textContent = trend;
    
    // Update trend class
    element.classList.remove('positive', 'negative', 'neutral');
    if (trend.startsWith('+')) {
        element.classList.add('positive');
    } else if (trend.startsWith('-')) {
        element.classList.add('negative');
    } else {
        element.classList.add('neutral');
    }
}

// Calculate overall attribution score based on weighted signals
function calculateAttributionScore() {
    const signals = dashboardState.signals;
    
    // Weighted scoring algorithm
    const weights = {
        brandedSearchVolume: 0.25,
        directTraffic: 0.2,
        inboundMessages: 0.2,
        communityEngagement: 0.2,
        firstPartyData: 0.15
    };
    
    // Normalize values (assuming max reasonable values)
    const maxValues = {
        brandedSearchVolume: 5000,
        directTraffic: 2000,
        inboundMessages: 200,
        communityEngagement: 300,
        firstPartyData: 100
    };
    
    let score = 0;
    Object.keys(weights).forEach(key => {
        const normalizedValue = Math.min(signals[key] / maxValues[key], 1);
        score += normalizedValue * weights[key] * 10;
    });
    
    // Add bonus for having multiple active signals
    const activeSignals = Object.values(signals).filter(val => val > 0).length;
    const bonusMultiplier = 1 + (activeSignals - 1) * 0.1;
    score *= bonusMultiplier;
    
    // Round to one decimal place
    score = Math.round(score * 10) / 10;
    
    // Update state and UI
    dashboardState.signals.attributionScore = score;
    updateSignalValue('attributionScoreValue', score);
    
    // Update trend based on previous score (simplified)
    const previousScore = parseFloat(localStorage.getItem('previousAttributionScore') || score);
    const diff = score - previousScore;
    if (Math.abs(diff) > 0.1) {
        updateSignalTrend('attributionScoreTrend', `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}`);
        localStorage.setItem('previousAttributionScore', score.toString());
    }
    
    return score;
}

// Refresh signal data from API
async function refreshSignalData() {
    try {
        if (typeof showNotification === 'function') {
            showNotification('Refreshing signal data...', 'info');
        }
        
        const daysBack = (typeof currentTimeframe !== 'undefined' && currentTimeframe === '7d') ? 7 : 30;
        const response = await fetch(`/api/dashboard-metrics?days_back=${daysBack}`, {
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            const metrics = result.data;
            // Add metadata to metrics for display purposes
            if (result.metadata) {
                metrics.total_mentions = result.metadata.total_mentions || 0;
                metrics.positive_mentions = result.metadata.positive_mentions || 0;
            }
            updateSignalWidgets(metrics);
            if (typeof showNotification === 'function') {
                showNotification('✅ Signal data refreshed!', 'success');
            }
        } else {
            throw new Error(result.message || 'Failed to refresh signal data');
        }
        
    } catch (error) {
        console.error('Error refreshing signal data:', error);
        if (typeof showNotification === 'function') {
            showNotification('❌ Failed to refresh signal data: ' + error.message, 'error');
        }
        showEmptySignalStates();
    }
}

// Update all signal widgets with metrics data
function updateSignalWidgets(metrics) {
    // Check if we have real GA4 data vs estimates
    const hasRealGA4Data = metrics.data_source && metrics.data_source.includes('ga4');
    const totalMentions = metrics.total_mentions || 0;
    
    // Update Branded Search Volume
    updateSignalWidget('brandedSearch', {
        value: metrics.branded_search_volume || 0,
        source: hasRealGA4Data ? '📊 Google Analytics 4' : '📈 Estimated from social data',
        details: hasRealGA4Data ? 
            `Real branded search data from GA4 (${totalMentions} mentions analyzed)` :
            (metrics.branded_search_volume > 0 ? 
                `⚠️ ESTIMATED: Based on ${totalMentions} social mentions × 15` : 
                'Connect Google Analytics 4 for real search data'),
        hasData: metrics.branded_search_volume > 0,
        apiName: 'Google Search Console',
        isEstimated: !hasRealGA4Data && metrics.branded_search_volume > 0
    }, typeof currentTimeframe !== 'undefined' ? currentTimeframe : '7d');
    
    // Update Direct Traffic
    updateSignalWidget('directTraffic', {
        value: metrics.direct_traffic || 0,
        source: hasRealGA4Data ? '📊 Google Analytics 4' : '📈 Estimated from social data',
        details: hasRealGA4Data ? 
            `Real direct traffic sessions from GA4` :
            (metrics.direct_traffic > 0 ? 
                `⚠️ ESTIMATED: Based on ${totalMentions} social mentions × 8` : 
                'Connect Google Analytics 4 for real traffic data'),
        hasData: metrics.direct_traffic > 0,
        apiName: 'Google Analytics 4',
        isEstimated: !hasRealGA4Data && metrics.direct_traffic > 0
    }, typeof currentTimeframe !== 'undefined' ? currentTimeframe : '7d');
    
    // Update Community Engagement
    updateSignalWidget('communityEngagement', {
        value: metrics.community_engagement || 0,
        source: metrics.community_engagement > 0 ? 'Social APIs (ScrapeCreators)' : 'No data available',
        details: metrics.community_engagement > 0 ? 
            `Social mentions and engagement across platforms` : 
            'Social mentions not found. Check API connections.',
        hasData: metrics.community_engagement > 0,
        apiName: 'Social APIs'
    }, typeof currentTimeframe !== 'undefined' ? currentTimeframe : '7d');
    
    // Update Inbound Messages
    updateSignalWidget('inboundMessages', {
        value: metrics.inbound_messages || 0,
        source: metrics.inbound_messages > 0 ? 'Email/CRM APIs' : 'No data available',
        details: metrics.inbound_messages > 0 ? 
            `Messages referencing your content` : 
            'Connect email or CRM APIs to track inbound messages',
        hasData: metrics.inbound_messages > 0,
        apiName: 'Email/CRM APIs'
    }, typeof currentTimeframe !== 'undefined' ? currentTimeframe : '7d');
    
    // Update First-Party Data
    updateSignalWidget('firstPartyData', {
        value: metrics.first_party_data || 0,
        source: metrics.first_party_data > 0 ? 'Multiple APIs' : 'No data available',
        details: metrics.first_party_data > 0 ? 
            `Email opt-ins, trials, and bookings` : 
            'Connect CRM, email marketing, or calendar APIs',
        hasData: metrics.first_party_data > 0,
        apiName: 'CRM/Email APIs'
    }, typeof currentTimeframe !== 'undefined' ? currentTimeframe : '7d');
    
    // Update Attribution Score
    updateSignalWidget('attributionScore', {
        value: metrics.attribution_score || 0,
        source: 'Calculated',
        details: metrics.attribution_score > 0 ? 
            `Composite score across all attribution signals` : 
            'Score will appear when data is available',
        hasData: metrics.attribution_score > 0,
        apiName: null
    }, typeof currentTimeframe !== 'undefined' ? currentTimeframe : '7d');
    
    // Update the dashboard state for consistency
    dashboardState.signals = {
        brandedSearchVolume: metrics.branded_search_volume || 0,
        directTraffic: metrics.direct_traffic || 0,
        inboundMessages: metrics.inbound_messages || 0,
        communityEngagement: metrics.community_engagement || 0,
        firstPartyData: metrics.first_party_data || 0,
        attributionScore: metrics.attribution_score || 0
    };
}

// Update individual signal widget display
function updateSignalWidget(signalType, data, timeframe = null) {
    const valueElement = document.getElementById(`${signalType}Value`);
    const sourceElement = document.getElementById(`${signalType}Source`);
    const detailsElement = document.getElementById(`${signalType}Details`);
    const actionsElement = document.getElementById(`${signalType}Actions`);
    const trendElement = document.getElementById(`${signalType}Trend`);
    const widgetElement = document.getElementById(`${signalType}Widget`);
    const timeframeElement = document.getElementById(`${signalType}Timeframe`);
    
    if (valueElement) {
        const displayValue = data.hasData ? data.value.toLocaleString() : '---';
        valueElement.textContent = displayValue;
    }
    
    if (sourceElement) {
        sourceElement.textContent = data.source || 'No data available';
    }
    
    if (detailsElement) {
        detailsElement.textContent = data.details || 'No details available';
    }
    
    if (timeframeElement && timeframe) {
        timeframeElement.textContent = `(${timeframe === '7d' ? '7 days' : '30 days'})`;
    }
    
    // Update widget styling based on data availability
    if (widgetElement) {
        widgetElement.classList.remove('has-data', 'no-data', 'estimated');
        if (data.hasData) {
            widgetElement.classList.add('has-data');
            if (data.isEstimated) {
                widgetElement.classList.add('estimated');
            }
        } else {
            widgetElement.classList.add('no-data');
        }
    }
    
    // Update actions based on data availability
    if (actionsElement) {
        if (data.hasData) {
            actionsElement.innerHTML = '<button class="btn-small" onclick="refreshSignalData()">Refresh</button>';
        } else if (data.apiName) {
            actionsElement.innerHTML = `<button class="btn-small connect-btn" onclick="showConnectionHelp('${data.apiName}')">Connect ${data.apiName}</button>`;
        } else {
            actionsElement.innerHTML = '';
        }
    }
}

// Show empty states for all signals
function showEmptySignalStates() {
    const emptySignals = [
        { type: 'brandedSearch', apiName: 'Google Search Console' },
        { type: 'directTraffic', apiName: 'Google Analytics 4' },
        { type: 'communityEngagement', apiName: 'Social APIs' },
        { type: 'inboundMessages', apiName: 'Email/CRM APIs' },
        { type: 'firstPartyData', apiName: 'CRM/Email APIs' },
        { type: 'attributionScore', apiName: null }
    ];
    
    emptySignals.forEach(signal => {
        updateSignalWidget(signal.type, {
            value: 0,
            source: 'No data available',
            details: signal.apiName ? `Connect ${signal.apiName} to view data` : 'Score will appear when data is available',
            hasData: false,
            apiName: signal.apiName
        });
    });
}

// Update all signal displays from current state
function updateSignalDisplays() {
    const signals = dashboardState.signals;
    updateSignalValue('brandedSearchValue', signals.brandedSearchVolume);
    updateSignalValue('directTrafficValue', signals.directTraffic);
    updateSignalValue('inboundMessagesValue', signals.inboundMessages);
    updateSignalValue('communityEngagementValue', signals.communityEngagement);
    updateSignalValue('firstPartyDataValue', signals.firstPartyData);
    updateSignalValue('attributionScoreValue', signals.attributionScore);
}

// Helper function to show connection help for specific APIs
function showConnectionHelp(apiName) {
    if (typeof showNotification === 'function') {
        showNotification(`Please configure ${apiName} in the Setup section to view real data`, 'info');
    }
    
    // Optionally navigate to setup section
    if (typeof navigateToSection === 'function') {
        navigateToSection('setup');
    }
}

// Helper functions for connecting specific APIs
function connectGoogleSearchConsole() {
    if (typeof showNotification === 'function') {
        showNotification('Google Search Console integration coming soon', 'info');
    }
}

function connectGA4() {
    if (typeof showNotification === 'function') {
        showNotification('Google Analytics 4 integration coming soon', 'info');
    }
}

function connectEmailAPI() {
    if (typeof showNotification === 'function') {
        showNotification('Email API integration coming soon', 'info');
    }
}

function connectCRM() {
    if (typeof showNotification === 'function') {
        showNotification('CRM integration coming soon', 'info');
    }
}

// Export functions for global access
window.updateSignal = updateSignal;
window.updateSignalValue = updateSignalValue;
window.updateSignalTrend = updateSignalTrend;
window.calculateAttributionScore = calculateAttributionScore;
window.refreshSignalData = refreshSignalData;
window.updateSignalWidgets = updateSignalWidgets;
window.updateSignalWidget = updateSignalWidget;
window.showEmptySignalStates = showEmptySignalStates;
window.updateSignalDisplays = updateSignalDisplays;
window.showConnectionHelp = showConnectionHelp;
window.connectGoogleSearchConsole = connectGoogleSearchConsole;
window.connectGA4 = connectGA4;
window.connectEmailAPI = connectEmailAPI;
window.connectCRM = connectCRM;