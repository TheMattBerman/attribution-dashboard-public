// Data Processing Utilities Module

// CSV Template Generation and Processing
function downloadTemplate(type) {
    let csvContent = '';
    let filename = '';
    
    switch (type) {
        case 'search':
            csvContent = 'Date,Query,Impressions,Clicks,CTR,Position\\n';
            csvContent += '2024-06-01,your brand name,1250,125,10.0%,2.5\\n';
            csvContent += '2024-06-02,your brand pricing,875,87,9.9%,3.2\\n';
            csvContent += '2024-06-03,your brand review,1100,110,10.0%,2.8\\n';
            filename = 'search_console_template.csv';
            break;
            
        case 'traffic':
            csvContent = 'Date,Source,Sessions,Users,PageViews,BounceRate\\n';
            csvContent += '2024-06-01,Direct,450,380,1250,25.5%\\n';
            csvContent += '2024-06-02,Direct,523,445,1456,23.2%\\n';
            csvContent += '2024-06-03,Direct,398,340,1123,28.1%\\n';
            filename = 'analytics_template.csv';
            break;
            
        case 'mentions':
            csvContent = 'Date,Platform,Content,Sentiment,Engagement,Author,URL\\n';
            csvContent += '2024-06-01,Twitter,"Love the new features from YourBrand!",positive,15,@user123,https://twitter.com/user123/status/123\\n';
            csvContent += '2024-06-02,Reddit,"Has anyone tried YourBrand? Looking for reviews.",neutral,8,user456,https://reddit.com/r/tools/comments/abc\\n';
            csvContent += '2024-06-03,LinkedIn,"YourBrand helped us solve our attribution problem.",positive,23,John Doe,https://linkedin.com/posts/johndoe-123\\n';
            filename = 'mentions_template.csv';
            break;
            
        case 'emails':
            csvContent = 'Date,Subject,Type,Opens,Clicks,Replies,Source\\n';
            csvContent += '2024-06-01,"Newsletter: Attribution Insights",newsletter,1250,125,12,campaign\\n';
            csvContent += '2024-06-02,"Re: Your inquiry about YourBrand",inbound,1,0,1,inquiry\\n';
            csvContent += '2024-06-03,"Follow-up: Demo feedback",followup,1,1,1,demo\\n';
            filename = 'email_template.csv';
            break;
            
        default:
            if (typeof showNotification === 'function') {
                showNotification('Unknown template type', 'error');
            }
            return;
    }
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (typeof showNotification === 'function') {
        showNotification(`Downloaded ${filename} template`, 'success');
    }
}

// Handle CSV file upload and processing
function handleTemplateUpload(type, input) {
    if (!input.files || input.files.length === 0) {
        if (typeof showNotification === 'function') {
            showNotification('Please select a file', 'warning');
        }
        return;
    }
    
    const file = input.files[0];
    if (!file.name.toLowerCase().endsWith('.csv')) {
        if (typeof showNotification === 'function') {
            showNotification('Please select a CSV file', 'warning');
        }
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const csvData = e.target.result;
        processTemplateCSV(type, csvData);
    };
    reader.readAsText(file);
}

// Process CSV data based on type
function processTemplateCSV(type, csvData) {
    try {
        const lines = csvData.trim().split('\\n');
        if (lines.length < 2) {
            throw new Error('CSV file must contain at least a header and one data row');
        }
        
        const headers = parseCSVLine(lines[0]);
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = parseCSVLine(lines[i]);
                if (values.length === headers.length) {
                    const row = {};
                    headers.forEach((header, index) => {
                        row[header.toLowerCase().replace(/[^a-z0-9]/g, '_')] = values[index];
                    });
                    data.push(row);
                }
            }
        }
        
        if (data.length === 0) {
            throw new Error('No valid data rows found in CSV');
        }
        
        // Process based on type
        switch (type) {
            case 'search':
                updateSearchVolumeData(data);
                break;
            case 'traffic':
                updateDirectTrafficData(data);
                break;
            case 'mentions':
                updateInboundMessagesData(data);
                break;
            case 'emails':
                updateCommunityEngagementData(data);
                break;
            default:
                throw new Error('Unknown data type');
        }
        
        if (typeof showNotification === 'function') {
            showNotification(`Successfully imported ${data.length} ${type} records`, 'success');
        }
        
    } catch (error) {
        console.error('Error processing CSV:', error);
        if (typeof showNotification === 'function') {
            showNotification(`Error processing CSV: ${error.message}`, 'error');
        }
    }
}

// Parse a single CSV line handling quoted values
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                // Escaped quote
                current += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // End of field
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    // Add final field
    result.push(current.trim());
    
    return result;
}

// Update search volume data from CSV
function updateSearchVolumeData(data) {
    let totalImpressions = 0;
    let totalClicks = 0;
    
    data.forEach(row => {
        const impressions = parseInt(row.impressions) || 0;
        const clicks = parseInt(row.clicks) || 0;
        totalImpressions += impressions;
        totalClicks += clicks;
    });
    
    // Update dashboard state
    if (typeof updateSignal === 'function') {
        updateSignal('brandedSearch', totalClicks);
    }
    
    // Store raw data for further analysis
    dashboardState.importedData = dashboardState.importedData || {};
    dashboardState.importedData.searchData = data;
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Update direct traffic data from CSV
function updateDirectTrafficData(data) {
    let totalSessions = 0;
    
    data.forEach(row => {
        if (row.source && row.source.toLowerCase().includes('direct')) {
            const sessions = parseInt(row.sessions) || 0;
            totalSessions += sessions;
        }
    });
    
    // Update dashboard state
    if (typeof updateSignal === 'function') {
        updateSignal('directTraffic', totalSessions);
    }
    
    // Store raw data
    dashboardState.importedData = dashboardState.importedData || {};
    dashboardState.importedData.trafficData = data;
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Update inbound messages data from CSV
function updateInboundMessagesData(data) {
    let totalMentions = 0;
    const processedMentions = [];
    
    data.forEach(row => {
        totalMentions++;
        
        // Add to live feed if it exists
        if (dashboardState.liveFeed) {
            processedMentions.push({
                id: Date.now() + Math.random(),
                platform: row.platform || 'imported',
                content: row.content || 'No content available',
                sentiment: row.sentiment || 'neutral',
                engagement: parseInt(row.engagement) || 0,
                author: row.author || 'Unknown',
                timestamp: row.date ? new Date(row.date) : new Date(),
                url: row.url || '#',
                source: 'csv_import'
            });
        }
    });
    
    // Update mentions in live feed
    if (processedMentions.length > 0 && dashboardState.liveFeed) {
        dashboardState.liveFeed.mentions.unshift(...processedMentions);
        
        // Keep only last 100 mentions
        if (dashboardState.liveFeed.mentions.length > 100) {
            dashboardState.liveFeed.mentions = dashboardState.liveFeed.mentions.slice(0, 100);
        }
        
        // Update feed display
        if (typeof populateLiveFeed === 'function') {
            populateLiveFeed();
        }
        if (typeof updateFeedStats === 'function') {
            updateFeedStats();
        }
    }
    
    // Update signal
    if (typeof updateSignal === 'function') {
        updateSignal('inboundMessages', totalMentions);
    }
    
    // Store raw data
    dashboardState.importedData = dashboardState.importedData || {};
    dashboardState.importedData.mentionsData = data;
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Update community engagement data from CSV
function updateCommunityEngagementData(data) {
    let totalEngagement = 0;
    
    data.forEach(row => {
        const opens = parseInt(row.opens) || 0;
        const clicks = parseInt(row.clicks) || 0;
        const replies = parseInt(row.replies) || 0;
        totalEngagement += opens + clicks + replies;
    });
    
    // Update dashboard state
    if (typeof updateSignal === 'function') {
        updateSignal('communityEngagement', totalEngagement);
    }
    
    // Store raw data
    dashboardState.importedData = dashboardState.importedData || {};
    dashboardState.importedData.emailData = data;
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Update first party data from CSV
function updateFirstPartyData(data) {
    let totalFirstParty = 0;
    
    data.forEach(row => {
        // Count different types of first-party interactions
        const signups = parseInt(row.signups) || 0;
        const trials = parseInt(row.trials) || 0;
        const bookings = parseInt(row.bookings) || 0;
        totalFirstParty += signups + trials + bookings;
    });
    
    // Update dashboard state
    if (typeof updateSignal === 'function') {
        updateSignal('firstPartyData', totalFirstParty);
    }
    
    // Store raw data
    dashboardState.importedData = dashboardState.importedData || {};
    dashboardState.importedData.firstPartyData = data;
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Export data to CSV format
function exportDataToCSV(data, filename, headers = null) {
    if (!data || data.length === 0) {
        if (typeof showNotification === 'function') {
            showNotification('No data to export', 'warning');
        }
        return;
    }
    
    // Auto-generate headers if not provided
    if (!headers) {
        headers = Object.keys(data[0]);
    }
    
    // Create CSV content
    let csvContent = headers.join(',') + '\\n';
    
    data.forEach(row => {
        const values = headers.map(header => {
            let value = row[header] || '';
            // Escape quotes and wrap in quotes if contains comma
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                value = '"' + value.replace(/"/g, '""') + '"';
            }
            return value;
        });
        csvContent += values.join(',') + '\\n';
    });
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (typeof showNotification === 'function') {
        showNotification(`Exported ${data.length} records to ${filename}`, 'success');
    }
}

// Parse JSON data from string
function parseJSONData(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
    }
}

// Validate data structure
function validateDataStructure(data, requiredFields) {
    if (!Array.isArray(data)) {
        return { valid: false, error: 'Data must be an array' };
    }
    
    if (data.length === 0) {
        return { valid: false, error: 'Data array is empty' };
    }
    
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        for (const field of requiredFields) {
            if (!(field in row)) {
                return { valid: false, error: `Missing required field '${field}' in row ${i + 1}` };
            }
        }
    }
    
    return { valid: true };
}

// Sanitize data for safe processing
function sanitizeData(data) {
    if (Array.isArray(data)) {
        return data.map(item => sanitizeData(item));
    } else if (typeof data === 'object' && data !== null) {
        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            sanitized[key] = sanitizeData(value);
        }
        return sanitized;
    } else if (typeof data === 'string') {
        // Remove potential XSS vectors
        return data.replace(/<script[^>]*>.*?<\/script>/gi, '').trim();
    }
    return data;
}

// Export functions for global access
window.downloadTemplate = downloadTemplate;
window.handleTemplateUpload = handleTemplateUpload;
window.processTemplateCSV = processTemplateCSV;
window.parseCSVLine = parseCSVLine;
window.updateSearchVolumeData = updateSearchVolumeData;
window.updateDirectTrafficData = updateDirectTrafficData;
window.updateInboundMessagesData = updateInboundMessagesData;
window.updateCommunityEngagementData = updateCommunityEngagementData;
window.updateFirstPartyData = updateFirstPartyData;
window.exportDataToCSV = exportDataToCSV;
window.parseJSONData = parseJSONData;
window.validateDataStructure = validateDataStructure;
window.sanitizeData = sanitizeData;