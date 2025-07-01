// Export Utilities Module

// Export data to various formats
function exportData(type) {
    let data, filename, headers;
    
    switch (type) {
        case 'signals':
            data = [dashboardState.signals];
            filename = `attribution-signals-${getCurrentDateString()}.csv`;
            headers = ['brandedSearchVolume', 'directTraffic', 'inboundMessages', 'communityEngagement', 'firstPartyData', 'attributionScore'];
            break;
            
        case 'campaigns':
            data = dashboardState.campaigns || [];
            filename = `campaigns-${getCurrentDateString()}.csv`;
            headers = ['name', 'brandedSearchDelta', 'mentions', 'signups', 'communityBuzz', 'notes'];
            break;
            
        case 'echoes':
            data = dashboardState.echoes || [];
            filename = `echoes-${getCurrentDateString()}.csv`;
            headers = ['timestamp', 'type', 'content', 'source'];
            break;
            
        case 'mentions':
            data = dashboardState.liveFeed?.mentions || [];
            filename = `mentions-${getCurrentDateString()}.csv`;
            headers = ['timestamp', 'platform', 'content', 'sentiment', 'engagement', 'author', 'url'];
            break;
            
        case 'all':
            exportAllData();
            return;
            
        default:
            if (typeof showNotification === 'function') {
                showNotification('Unknown export type', 'error');
            }
            return;
    }
    
    if (data.length === 0) {
        if (typeof showNotification === 'function') {
            showNotification(`No ${type} data to export`, 'warning');
        }
        return;
    }
    
    exportToCSV(data, filename, headers);
}

// Export all dashboard data as JSON
function exportAllData() {
    const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        data: {
            signals: dashboardState.signals,
            campaigns: dashboardState.campaigns,
            echoes: dashboardState.echoes,
            mentions: dashboardState.liveFeed?.mentions || [],
            brandConfig: dashboardState.brandConfig,
            settings: dashboardState.settings
        }
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const filename = `attribution-dashboard-export-${getCurrentDateString()}.json`;
    
    downloadBlob(blob, filename);
    
    if (typeof showNotification === 'function') {
        showNotification('Complete dashboard data exported', 'success');
    }
}

// Export to CSV format
function exportToCSV(data, filename, headers = null) {
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
            
            // Handle different data types
            if (value instanceof Date) {
                value = value.toISOString();
            } else if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            
            // Escape quotes and wrap in quotes if contains comma or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\\n'))) {
                value = '"' + value.replace(/"/g, '""') + '"';
            }
            
            return value;
        });
        csvContent += values.join(',') + '\\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename);
    
    if (typeof showNotification === 'function') {
        showNotification(`Exported ${data.length} records to ${filename}`, 'success');
    }
}

// Export chart data and image
function exportChart() {
    if (typeof mentionsChart === 'undefined' || !mentionsChart) {
        if (typeof showNotification === 'function') {
            showNotification('No chart available to export', 'warning');
        }
        return;
    }
    
    try {
        // Get chart canvas
        const canvas = mentionsChart.canvas;
        
        // Create download link for image
        canvas.toBlob(function(blob) {
            const filename = `mentions-chart-${getCurrentDateString()}.png`;
            downloadBlob(blob, filename);
            
            if (typeof showNotification === 'function') {
                showNotification('Chart image exported successfully', 'success');
            }
        });
        
        // Also export the chart data
        const chartData = mentionsChart.data;
        const exportData = {
            labels: chartData.labels,
            datasets: chartData.datasets.map(dataset => ({
                label: dataset.label,
                data: dataset.data,
                backgroundColor: dataset.backgroundColor,
                borderColor: dataset.borderColor
            }))
        };
        
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const dataFilename = `mentions-chart-data-${getCurrentDateString()}.json`;
        downloadBlob(blob, dataFilename);
        
    } catch (error) {
        console.error('Error exporting chart:', error);
        if (typeof showNotification === 'function') {
            showNotification('Failed to export chart', 'error');
        }
    }
}

// Export filtered mentions
function exportFilteredMentions() {
    let mentions = [];
    
    if (typeof filterMentions === 'function') {
        mentions = filterMentions();
    } else if (dashboardState.liveFeed?.mentions) {
        mentions = dashboardState.liveFeed.mentions;
    }
    
    if (mentions.length === 0) {
        if (typeof showNotification === 'function') {
            showNotification('No mentions to export', 'warning');
        }
        return;
    }
    
    const headers = ['timestamp', 'platform', 'content', 'sentiment', 'engagement', 'author', 'url'];
    const filename = `filtered-mentions-${getCurrentDateString()}.csv`;
    
    exportToCSV(mentions, filename, headers);
}

// Export campaign performance report
function exportCampaignReport() {
    const campaigns = dashboardState.campaigns || [];
    if (campaigns.length === 0) {
        if (typeof showNotification === 'function') {
            showNotification('No campaigns to export', 'warning');
        }
        return;
    }
    
    // Create detailed report
    const reportData = campaigns.map(campaign => ({
        ...campaign,
        exportDate: getCurrentDateString(),
        attributionScore: dashboardState.signals.attributionScore || 0
    }));
    
    const filename = `campaign-performance-report-${getCurrentDateString()}.csv`;
    const headers = ['name', 'brandedSearchDelta', 'mentions', 'signups', 'communityBuzz', 'notes', 'exportDate', 'attributionScore'];
    
    exportToCSV(reportData, filename, headers);
}

// Export attribution summary
function exportAttributionSummary() {
    const summary = {
        exportDate: getCurrentDateString(),
        timeframe: typeof currentTimeframe !== 'undefined' ? currentTimeframe : '7d',
        signals: dashboardState.signals,
        totalCampaigns: dashboardState.campaigns?.length || 0,
        totalEchoes: dashboardState.echoes?.length || 0,
        totalMentions: dashboardState.liveFeed?.mentions?.length || 0,
        apiConnections: {
            googleSearchConsole: dashboardState.apiStatus?.googleSearchConsole || 'disconnected',
            googleAnalytics: dashboardState.apiStatus?.googleAnalytics || 'disconnected',
            scrapeCreators: dashboardState.apiStatus?.scrapeCreators || 'disconnected',
            exaSearch: dashboardState.apiStatus?.exaSearch || 'disconnected'
        },
        brandConfig: dashboardState.brandConfig
    };
    
    const jsonString = JSON.stringify(summary, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const filename = `attribution-summary-${getCurrentDateString()}.json`;
    
    downloadBlob(blob, filename);
    
    if (typeof showNotification === 'function') {
        showNotification('Attribution summary exported', 'success');
    }
}

// Import data from file
function importData(file, type = 'auto') {
    if (!file) {
        if (typeof showNotification === 'function') {
            showNotification('Please select a file', 'warning');
        }
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            
            if (file.name.toLowerCase().endsWith('.json')) {
                importJSONData(content);
            } else if (file.name.toLowerCase().endsWith('.csv')) {
                importCSVData(content, type);
            } else {
                throw new Error('Unsupported file format. Please use JSON or CSV files.');
            }
        } catch (error) {
            console.error('Import error:', error);
            if (typeof showNotification === 'function') {
                showNotification(`Import failed: ${error.message}`, 'error');
            }
        }
    };
    
    reader.readAsText(file);
}

// Import JSON data
function importJSONData(jsonString) {
    const data = JSON.parse(jsonString);
    
    // Validate data structure
    if (data.data) {
        // Full dashboard export
        if (data.data.signals) {
            Object.assign(dashboardState.signals, data.data.signals);
        }
        if (data.data.campaigns) {
            dashboardState.campaigns = data.data.campaigns;
        }
        if (data.data.echoes) {
            dashboardState.echoes = data.data.echoes;
        }
        if (data.data.mentions) {
            dashboardState.liveFeed = dashboardState.liveFeed || {};
            dashboardState.liveFeed.mentions = data.data.mentions;
        }
        if (data.data.brandConfig) {
            dashboardState.brandConfig = data.data.brandConfig;
        }
        
        if (typeof showNotification === 'function') {
            showNotification('Complete dashboard data imported successfully', 'success');
        }
    } else {
        // Assume it's raw data
        if (Array.isArray(data)) {
            // Determine data type and import accordingly
            if (data[0]?.platform && data[0]?.content) {
                dashboardState.liveFeed = dashboardState.liveFeed || {};
                dashboardState.liveFeed.mentions = data;
            } else if (data[0]?.name && data[0]?.brandedSearchDelta) {
                dashboardState.campaigns = data;
            }
        }
        
        if (typeof showNotification === 'function') {
            showNotification('Data imported successfully', 'success');
        }
    }
    
    // Update displays
    if (typeof updateSignalDisplays === 'function') {
        updateSignalDisplays();
    }
    if (typeof populateLiveFeed === 'function') {
        populateLiveFeed();
    }
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Import CSV data
function importCSVData(csvString, type) {
    if (typeof processTemplateCSV === 'function') {
        processTemplateCSV(type, csvString);
    } else {
        if (typeof showNotification === 'function') {
            showNotification('CSV import functionality not available', 'error');
        }
    }
}

// Helper function to download blob
function downloadBlob(blob, filename) {
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

// Helper function to get current date string
function getCurrentDateString() {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD format
}

// Backup current state to local file
function backupDashboardState() {
    const backup = {
        backupDate: new Date().toISOString(),
        version: '1.0',
        state: dashboardState
    };
    
    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const filename = `dashboard-backup-${getCurrentDateString()}.json`;
    
    downloadBlob(blob, filename);
    
    if (typeof showNotification === 'function') {
        showNotification('Dashboard state backed up successfully', 'success');
    }
}

// Restore state from backup file
function restoreDashboardState(file) {
    if (!file) {
        if (typeof showNotification === 'function') {
            showNotification('Please select a backup file', 'warning');
        }
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            
            if (backup.state) {
                // Confirm before restoring
                if (typeof showConfirmationNotification === 'function') {
                    showConfirmationNotification(
                        'This will replace all current data with the backup. Are you sure?',
                        () => {
                            Object.assign(dashboardState, backup.state);
                            
                            // Update all displays
                            if (typeof updateSignalDisplays === 'function') {
                                updateSignalDisplays();
                            }
                            if (typeof populateLiveFeed === 'function') {
                                populateLiveFeed();
                            }
                            if (typeof saveToLocalStorage === 'function') {
                                saveToLocalStorage();
                            }
                            
                            if (typeof showNotification === 'function') {
                                showNotification('Dashboard state restored successfully', 'success');
                            }
                        }
                    );
                } else {
                    // Fallback if confirmation not available
                    Object.assign(dashboardState, backup.state);
                    if (typeof showNotification === 'function') {
                        showNotification('Dashboard state restored successfully', 'success');
                    }
                }
            } else {
                throw new Error('Invalid backup file format');
            }
        } catch (error) {
            console.error('Restore error:', error);
            if (typeof showNotification === 'function') {
                showNotification(`Restore failed: ${error.message}`, 'error');
            }
        }
    };
    
    reader.readAsText(file);
}

// Export functions for global access
window.exportData = exportData;
window.exportAllData = exportAllData;
window.exportToCSV = exportToCSV;
window.exportChart = exportChart;
window.exportFilteredMentions = exportFilteredMentions;
window.exportCampaignReport = exportCampaignReport;
window.exportAttributionSummary = exportAttributionSummary;
window.importData = importData;
window.importJSONData = importJSONData;
window.importCSVData = importCSVData;
window.downloadBlob = downloadBlob;
window.getCurrentDateString = getCurrentDateString;
window.backupDashboardState = backupDashboardState;
window.restoreDashboardState = restoreDashboardState;