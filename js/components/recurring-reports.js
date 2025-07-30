// Recurring Reports Management Component

// State management for recurring reports
let reportsState = {
    reports: [],
    templates: [],
    history: [],
    status: null,
    loading: false,
    selectedReport: null
};

// Initialize recurring reports component
function initializeRecurringReports() {
    // Load initial data
    loadReports();
    loadTemplates();
    loadReportsStatus();
    
    // Set up event listeners
    setupReportsEventListeners();
    
    // Set up periodic refresh
    setInterval(refreshReportsStatus, 30000); // Refresh every 30 seconds
}

// Load all reports
async function loadReports() {
    try {
        reportsState.loading = true;
        updateReportsLoadingState();
        
        const response = await fetch('/api/reports');
        const result = await response.json();
        
        if (result.status === 'success') {
            reportsState.reports = result.data;
            updateReportsList();
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error loading reports:', error);
        showNotification('Failed to load reports', 'error');
    } finally {
        reportsState.loading = false;
        updateReportsLoadingState();
    }
}

// Load available templates
async function loadTemplates() {
    try {
        const response = await fetch('/api/reports/templates');
        const result = await response.json();
        
        if (result.status === 'success') {
            reportsState.templates = result.data;
            updateTemplatesDropdown();
        } else {
            console.warn('Templates not available:', result.message);
        }
    } catch (error) {
        console.error('Error loading templates:', error);
    }
}

// Load reports status
async function loadReportsStatus() {
    try {
        const response = await fetch('/api/reports/status');
        const result = await response.json();
        
        if (result.status === 'success') {
            reportsState.status = result.data;
            updateStatusDisplay();
        }
    } catch (error) {
        console.error('Error loading reports status:', error);
    }
}

// Refresh status (periodic update)
async function refreshReportsStatus() {
    if (document.getElementById('recurringReportsSection')?.classList.contains('active')) {
        await loadReportsStatus();
    }
}

// Setup event listeners
function setupReportsEventListeners() {
    // Create report button
    const createBtn = document.getElementById('createReportBtn');
    if (createBtn) {
        createBtn.addEventListener('click', showCreateReportModal);
    }
    
    // Create from template button
    const templateBtn = document.getElementById('createFromTemplateBtn');
    if (templateBtn) {
        templateBtn.addEventListener('click', showTemplateModal);
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshReportsBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadReports();
            loadReportsStatus();
        });
    }
    
    // Modal close buttons
    document.querySelectorAll('.modal .close').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Modal background click to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
}

// Update reports list display
function updateReportsList() {
    const container = document.getElementById('reportsList');
    if (!container) return;
    
    if (reportsState.reports.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No Recurring Reports</h3>
                <p>Create your first recurring report to start automated data collection.</p>
                <button class="btn btn-primary" onclick="showCreateReportModal()">
                    Create Report
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = reportsState.reports.map(report => `
        <div class="report-card" data-report-id="${report.id}">
            <div class="report-header">
                <h4>${report.name}</h4>
                <div class="report-status ${report.enabled ? 'enabled' : 'disabled'}">
                    ${report.enabled ? 'Active' : 'Disabled'}
                </div>
            </div>
            
            <div class="report-details">
                <p class="report-description">${report.description || 'No description'}</p>
                
                <div class="report-meta">
                    <div class="meta-item">
                        <strong>Schedule:</strong> ${formatSchedule(report.schedule)}
                    </div>
                    <div class="meta-item">
                        <strong>Data Sources:</strong> ${report.query_config?.data_sources?.join(', ') || 'None'}
                    </div>
                    <div class="meta-item">
                        <strong>Output:</strong> ${report.output_format?.toUpperCase() || 'CSV'}
                    </div>
                </div>
                
                <div class="report-stats">
                    <div class="stat">
                        <span class="stat-label">Runs:</span>
                        <span class="stat-value">${report.run_count || 0}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Last Run:</span>
                        <span class="stat-value">${formatDateTime(report.last_run) || 'Never'}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Next Run:</span>
                        <span class="stat-value">${formatDateTime(report.next_run) || 'N/A'}</span>
                    </div>
                </div>
            </div>
            
            <div class="report-actions">
                <button class="btn btn-sm btn-primary" onclick="runReportNow('${report.id}')">
                    Run Now
                </button>
                <button class="btn btn-sm btn-secondary" onclick="viewReportHistory('${report.id}')">
                    History
                </button>
                <button class="btn btn-sm btn-secondary" onclick="editReport('${report.id}')">
                    Edit
                </button>
                <button class="btn btn-sm btn-toggle" onclick="toggleReport('${report.id}', ${!report.enabled})">
                    ${report.enabled ? 'Disable' : 'Enable'}
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteReport('${report.id}')">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Update templates dropdown
function updateTemplatesDropdown() {
    const dropdown = document.getElementById('templateSelect');
    if (!dropdown) return;
    
    dropdown.innerHTML = '<option value="">Select a template...</option>' +
        Object.entries(reportsState.templates).map(([key, template]) => `
            <option value="${key}">${template.name}</option>
        `).join('');
}

// Update status display
function updateStatusDisplay() {
    const container = document.getElementById('reportsStatus');
    if (!container || !reportsState.status) return;
    
    const status = reportsState.status;
    
    container.innerHTML = `
        <div class="status-grid">
            <div class="status-item">
                <div class="status-value">${status.total_reports}</div>
                <div class="status-label">Total Reports</div>
            </div>
            <div class="status-item">
                <div class="status-value">${status.enabled_reports}</div>
                <div class="status-label">Active Reports</div>
            </div>
            <div class="status-item">
                <div class="status-value">${status.recent_executions_7d}</div>
                <div class="status-label">Runs (7d)</div>
            </div>
            <div class="status-item">
                <div class="status-value">${status.failed_executions}</div>
                <div class="status-label">Failed Runs</div>
            </div>
        </div>
        
        ${status.next_jobs && status.next_jobs.length > 0 ? `
            <div class="next-jobs">
                <h4>Upcoming Reports</h4>
                <ul>
                    ${status.next_jobs.map(job => `
                        <li>
                            <strong>${job.name}</strong> - 
                            ${formatDateTime(job.next_run) || 'Not scheduled'}
                        </li>
                    `).join('')}
                </ul>
            </div>
        ` : ''}
    `;
}

// Update loading state
function updateReportsLoadingState() {
    const container = document.getElementById('reportsList');
    if (!container) return;
    
    if (reportsState.loading) {
        container.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading reports...</p>
            </div>
        `;
    }
}

// Show create report modal
function showCreateReportModal() {
    const modal = document.getElementById('createReportModal');
    if (modal) {
        // Reset form
        const form = modal.querySelector('form');
        if (form) form.reset();
        
        modal.style.display = 'block';
    }
}

// Show template selection modal
function showTemplateModal() {
    const modal = document.getElementById('templateModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Close modal
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Create report from form
async function createReport() {
    try {
        const form = document.getElementById('createReportForm');
        const formData = new FormData(form);
        
        // Build report configuration
        const config = {
            name: formData.get('name'),
            description: formData.get('description'),
            query_config: {
                data_sources: Array.from(form.querySelectorAll('input[name="data_sources"]:checked')).map(cb => cb.value),
                date_range: parseInt(formData.get('date_range')) || 7,
                brand_name: formData.get('brand_name') || ''
            },
            schedule: {
                type: formData.get('schedule_type'),
                interval_type: formData.get('interval_type'),
                interval_value: parseInt(formData.get('interval_value')) || 1
            },
            output_format: formData.get('output_format') || 'csv',
            enabled: formData.get('enabled') === 'on'
        };
        
        const response = await fetch('/api/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showNotification('Report created successfully', 'success');
            closeModal();
            loadReports();
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error creating report:', error);
        showNotification('Failed to create report', 'error');
    }
}

// Create report from template
async function createFromTemplate() {
    try {
        const templateSelect = document.getElementById('templateSelect');
        const templateName = templateSelect.value;
        
        if (!templateName) {
            showNotification('Please select a template', 'warning');
            return;
        }
        
        // Get customizations from form
        const customizations = {
            name: document.getElementById('templateReportName').value,
            schedule: {
                type: 'interval',
                interval_type: document.getElementById('templateScheduleType').value || 'days',
                interval_value: parseInt(document.getElementById('templateScheduleValue').value) || 1
            }
        };
        
        const response = await fetch(`/api/reports/templates/${templateName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customizations)
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showNotification(`Report created from ${templateName} template`, 'success');
            closeModal();
            loadReports();
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error creating report from template:', error);
        showNotification('Failed to create report from template', 'error');
    }
}

// Run report now
async function runReportNow(reportId) {
    try {
        const response = await fetch(`/api/reports/${reportId}/run`, {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showNotification('Report execution triggered', 'success');
            // Refresh status after a short delay
            setTimeout(() => {
                loadReportsStatus();
                loadReports();
            }, 1000);
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error running report:', error);
        showNotification('Failed to run report', 'error');
    }
}

// Toggle report enabled/disabled
async function toggleReport(reportId, enabled) {
    try {
        const response = await fetch(`/api/reports/${reportId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ enabled })
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showNotification(`Report ${enabled ? 'enabled' : 'disabled'}`, 'success');
            loadReports();
            loadReportsStatus();
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error toggling report:', error);
        showNotification('Failed to update report', 'error');
    }
}

// Delete report
async function deleteReport(reportId) {
    if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/reports/${reportId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showNotification('Report deleted successfully', 'success');
            loadReports();
            loadReportsStatus();
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error deleting report:', error);
        showNotification('Failed to delete report', 'error');
    }
}

// View report history
async function viewReportHistory(reportId) {
    try {
        const response = await fetch(`/api/reports/${reportId}/history`);
        const result = await response.json();
        
        if (result.status === 'success') {
            showHistoryModal(result.data, reportId);
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error loading report history:', error);
        showNotification('Failed to load report history', 'error');
    }
}

// Show history modal
function showHistoryModal(history, reportId) {
    const modal = document.getElementById('historyModal');
    const content = document.getElementById('historyContent');
    
    if (!modal || !content) return;
    
    content.innerHTML = `
        <h3>Execution History</h3>
        ${history.length === 0 ? '<p>No execution history available.</p>' : `
            <div class="history-list">
                ${history.map(entry => `
                    <div class="history-item ${entry.status}">
                        <div class="history-header">
                            <span class="status-badge ${entry.status}">${entry.status}</span>
                            <span class="timestamp">${formatDateTime(entry.timestamp)}</span>
                        </div>
                        <div class="history-details">
                            <div class="detail-item">
                                <strong>Duration:</strong> ${entry.duration ? entry.duration.toFixed(2) + 's' : 'N/A'}
                            </div>
                            <div class="detail-item">
                                <strong>Records:</strong> ${entry.records_generated || 0}
                            </div>
                            ${entry.output_files?.length ? `
                                <div class="detail-item">
                                    <strong>Files:</strong> ${entry.output_files.join(', ')}
                                </div>
                            ` : ''}
                            ${entry.error_message ? `
                                <div class="detail-item error">
                                    <strong>Error:</strong> ${entry.error_message}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `}
    `;
    
    modal.style.display = 'block';
}

// Edit report (placeholder)
function editReport(reportId) {
    showNotification('Edit functionality coming soon', 'info');
}

// Utility functions
function formatSchedule(schedule) {
    if (!schedule) return 'Not configured';
    
    if (schedule.type === 'interval') {
        return `Every ${schedule.interval_value || 1} ${schedule.interval_type || 'hours'}`;
    } else if (schedule.type === 'cron') {
        if (schedule.cron_expression) {
            return `Cron: ${schedule.cron_expression}`;
        } else {
            return `${schedule.minute || '0'}:${schedule.hour || '9'} daily`;
        }
    }
    
    return 'Unknown schedule';
}

function formatDateTime(dateString) {
    if (!dateString) return null;
    
    try {
        const date = new Date(dateString);
        return date.toLocaleString();
    } catch (error) {
        return dateString;
    }
}

// Template selection handler
function onTemplateSelect() {
    const templateSelect = document.getElementById('templateSelect');
    const templateInfo = document.getElementById('templateInfo');
    
    if (!templateSelect || !templateInfo) return;
    
    const templateName = templateSelect.value;
    
    if (!templateName || !reportsState.templates[templateName]) {
        templateInfo.innerHTML = '';
        return;
    }
    
    const template = reportsState.templates[templateName];
    
    templateInfo.innerHTML = `
        <div class="template-info">
            <h4>${template.name}</h4>
            <p>${template.description}</p>
            
            <div class="template-details">
                <div class="detail-section">
                    <strong>Data Sources:</strong>
                    <ul>
                        ${template.data_sources.map(source => `<li>${source}</li>`).join('')}
                    </ul>
                </div>
                
                ${template.api_requirements ? `
                    <div class="detail-section">
                        <strong>API Requirements:</strong>
                        <ul>
                            ${Object.entries(template.api_requirements).map(([source, reqs]) => `
                                <li>${source}: ${reqs.join(', ')}</li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${template.suggested_schedule ? `
                    <div class="detail-section">
                        <strong>Suggested Schedule:</strong>
                        Every ${template.suggested_schedule.interval_value} ${template.suggested_schedule.interval_type}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Export functions for global access
window.initializeRecurringReports = initializeRecurringReports;
window.loadReports = loadReports;
window.createReport = createReport;
window.createFromTemplate = createFromTemplate;
window.runReportNow = runReportNow;
window.toggleReport = toggleReport;
window.deleteReport = deleteReport;
window.viewReportHistory = viewReportHistory;
window.editReport = editReport;
window.onTemplateSelect = onTemplateSelect;
window.closeModal = closeModal;
window.showCreateReportModal = showCreateReportModal;
window.showTemplateModal = showTemplateModal;