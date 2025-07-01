// Main Application Entry Point - Refactored Attribution Dashboard
// All functionality has been modularized into separate components

// Global variables for chart and timeframe management
let mentionsChart = null;
let currentTimeframe = '7d';

// Navigation and Section Management
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionName = link.getAttribute('data-section');
            navigateToSection(sectionName);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function navigateToSection(sectionName) {
    // Hide all sections by removing active class
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section by adding active class
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Update URL hash
        window.location.hash = sectionName;
        
        // Load section-specific data
        loadSectionData(sectionName);
    }
}

function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'signalsSection':
            loadDashboardData();
            break;
        case 'mentions':
            // Initialize chart if not already done
            if (!mentionsChart) {
                initializeChart();
            }
            break;
        case 'echoes':
            if (typeof populateEchoes === 'function') {
                populateEchoes();
            }
            break;
        case 'campaigns':
            if (typeof populateCampaigns === 'function') {
                populateCampaigns();
            }
            break;
        case 'liveFeedSection':
            if (typeof populateLiveFeed === 'function') {
                populateLiveFeed();
            }
            if (typeof updateFeedStats === 'function') {
                updateFeedStats();
            }
            break;
        case 'prompts':
            if (typeof populatePrompts === 'function') {
                populatePrompts();
            }
            break;
        case 'integrations':
        case 'social':
        case 'sentimentTesting':
            // These sections don't need special loading
            break;
    }
}

function loadDashboardData() {
    // Update signal displays
    if (typeof updateSignalDisplays === 'function') {
        updateSignalDisplays();
    }
    
    // Populate campaigns and echoes
    if (typeof populateCampaigns === 'function') {
        populateCampaigns();
    }
    if (typeof populateEchoes === 'function') {
        populateEchoes();
    }
    
    // Initialize chart if not already done
    if (!mentionsChart) {
        initializeChart();
    }
    
    // Update live feed
    if (typeof populateLiveFeed === 'function') {
        populateLiveFeed();
    }
    if (typeof updateFeedStats === 'function') {
        updateFeedStats();
    }
}

// Chart Initialization and Management
function initializeChart() {
    const ctx = document.getElementById('mentionsChart');
    if (!ctx) return;
    
    const data = currentTimeframe === '7d' ? 
        dashboardState.mentionsData['7d'] : 
        dashboardState.mentionsData['30d'];
    
    mentionsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.day),
            datasets: [{
                label: 'Mentions',
                data: data.map(d => d.mentions),
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            }
        }
    });
}

function updateChart(timeframe) {
    if (!mentionsChart) {
        initializeChart();
        return;
    }
    
    currentTimeframe = timeframe;
    const data = dashboardState.mentionsData[timeframe];
    
    mentionsChart.data.labels = data.map(d => d.day);
    mentionsChart.data.datasets[0].data = data.map(d => d.mentions);
    mentionsChart.update();
}

function refreshChart() {
    if (mentionsChart) {
        const data = currentTimeframe === '7d' ? 
            dashboardState.mentionsData['7d'] : 
            dashboardState.mentionsData['30d'];
        
        mentionsChart.data.labels = data.map(d => d.day);
        mentionsChart.data.datasets[0].data = data.map(d => d.mentions);
        mentionsChart.update();
    }
}

// Data Population Functions (Simple ones that weren't extracted)
function populateInitialData() {
    if (typeof updateSignalDisplays === 'function') {
        updateSignalDisplays();
    }
    if (typeof populateCampaigns === 'function') {
        populateCampaigns();
    }
    if (typeof populateEchoes === 'function') {
        populateEchoes();
    }
}

function populateCampaigns() {
    const container = document.getElementById('campaignsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    dashboardState.campaigns.forEach((campaign, index) => {
        const campaignDiv = document.createElement('div');
        campaignDiv.className = 'campaign-item';
        campaignDiv.innerHTML = `
            <div class="campaign-header">
                <h4>${campaign.name}</h4>
                <div class="campaign-actions">
                    <button onclick="editCampaign(${index})" class="btn-small">Edit</button>
                    <button onclick="deleteCampaign(${index})" class="btn-small btn-danger">Delete</button>
                </div>
            </div>
            <div class="campaign-stats">
                <div class="stat">
                    <span class="stat-label">Search Delta:</span>
                    <span class="stat-value ${campaign.brandedSearchDelta.startsWith('+') ? 'positive' : 'negative'}">
                        ${campaign.brandedSearchDelta}
                    </span>
                </div>
                <div class="stat">
                    <span class="stat-label">Mentions:</span>
                    <span class="stat-value">${campaign.mentions}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Signups:</span>
                    <span class="stat-value">${campaign.signups}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Buzz:</span>
                    <span class="stat-value">${campaign.communityBuzz}</span>
                </div>
            </div>
            <div class="campaign-notes">${campaign.notes}</div>
        `;
        container.appendChild(campaignDiv);
    });
}

function populateEchoes() {
    const container = document.getElementById('echoesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    dashboardState.echoes.forEach((echo, index) => {
        const echoDiv = document.createElement('div');
        echoDiv.className = 'echo-item';
        echoDiv.innerHTML = `
            <div class="echo-header">
                <span class="echo-type">${echo.type}</span>
                <span class="echo-time">${echo.timestamp}</span>
                <div class="echo-actions">
                    <button onclick="editEcho(${index})" class="btn-small">Edit</button>
                    <button onclick="deleteEcho(${index})" class="btn-small btn-danger">Delete</button>
                </div>
            </div>
            <div class="echo-content">${echo.content}</div>
            <div class="echo-source">Source: ${echo.source}</div>
        `;
        container.appendChild(echoDiv);
    });
}

// Modal Management
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Campaign and Echo Management (Simple CRUD operations)
function addCampaign() {
    document.getElementById('campaignModal').style.display = 'block';
    document.getElementById('campaignForm').reset();
    document.getElementById('campaignIndex').value = '';
}

function addEchoEntry() {
    document.getElementById('echoModal').style.display = 'block';
    document.getElementById('echoForm').reset();
    document.getElementById('echoIndex').value = '';
}

function editCampaign(index) {
    const campaign = dashboardState.campaigns[index];
    if (!campaign) return;
    
    document.getElementById('campaignName').value = campaign.name;
    document.getElementById('campaignDelta').value = campaign.brandedSearchDelta;
    document.getElementById('campaignMentions').value = campaign.mentions;
    document.getElementById('campaignSignups').value = campaign.signups;
    document.getElementById('campaignBuzz').value = campaign.communityBuzz;
    document.getElementById('campaignNotes').value = campaign.notes;
    document.getElementById('campaignIndex').value = index;
    
    document.getElementById('campaignModal').style.display = 'block';
}

function editEcho(index) {
    const echo = dashboardState.echoes[index];
    if (!echo) return;
    
    document.getElementById('echoType').value = echo.type;
    document.getElementById('echoContent').value = echo.content;
    document.getElementById('echoSource').value = echo.source;
    document.getElementById('echoIndex').value = index;
    
    document.getElementById('echoModal').style.display = 'block';
}

function deleteCampaign(index) {
    if (confirm('Are you sure you want to delete this campaign?')) {
        dashboardState.campaigns.splice(index, 1);
        populateCampaigns();
        if (typeof saveToLocalStorage === 'function') {
            saveToLocalStorage();
        }
        if (typeof showNotification === 'function') {
            showNotification('Campaign deleted', 'success');
        }
    }
}

function deleteEcho(index) {
    if (confirm('Are you sure you want to delete this echo?')) {
        dashboardState.echoes.splice(index, 1);
        populateEchoes();
        if (typeof saveToLocalStorage === 'function') {
            saveToLocalStorage();
        }
        if (typeof showNotification === 'function') {
            showNotification('Echo deleted', 'success');
        }
    }
}

// Form Handlers
function handleCampaignFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const campaign = {
        name: formData.get('name'),
        brandedSearchDelta: formData.get('delta'),
        mentions: parseInt(formData.get('mentions')) || 0,
        signups: parseInt(formData.get('signups')) || 0,
        communityBuzz: formData.get('buzz'),
        notes: formData.get('notes')
    };
    
    const index = document.getElementById('campaignIndex').value;
    
    if (index === '') {
        // Adding new campaign
        dashboardState.campaigns.push(campaign);
    } else {
        // Editing existing campaign
        dashboardState.campaigns[parseInt(index)] = campaign;
    }
    
    populateCampaigns();
    closeModal('campaignModal');
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
    if (typeof showNotification === 'function') {
        showNotification(index === '' ? 'Campaign added' : 'Campaign updated', 'success');
    }
}

function handleEchoFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const echo = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        type: formData.get('type'),
        content: formData.get('content'),
        source: formData.get('source')
    };
    
    const index = document.getElementById('echoIndex').value;
    
    if (index === '') {
        // Adding new echo
        dashboardState.echoes.unshift(echo);
    } else {
        // Editing existing echo
        dashboardState.echoes[parseInt(index)] = echo;
    }
    
    populateEchoes();
    closeModal('echoModal');
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
    if (typeof showNotification === 'function') {
        showNotification(index === '' ? 'Echo added' : 'Echo updated', 'success');
    }
}

// Prompts Management (if not moved to separate component)
function populatePrompts(filterCategory = 'all') {
    // Use the new filtered version if available
    if (typeof populatePromptsFiltered === 'function') {
        populatePromptsFiltered(filterCategory);
        return;
    }
    
    // Fallback to original implementation
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
        categoryPrompts.forEach(prompt => {
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

function copyPrompt(title) {
    const prompt = dashboardState.prompts.find(p => p.title === title);
    if (prompt) {
        navigator.clipboard.writeText(prompt.content).then(() => {
            if (typeof showNotification === 'function') {
                showNotification('Prompt copied to clipboard', 'success');
            }
        });
    }
}

// Error Handling and Empty States
function setupErrorHandling() {
    // Global error handler for uncaught JavaScript errors
    window.addEventListener('error', function(event) {
        console.error('Uncaught error:', event.error);
        if (typeof showNotification === 'function') {
            showNotification('An unexpected error occurred. Please try again.', 'error');
        }
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
        if (typeof showNotification === 'function') {
            showNotification('An unexpected error occurred. Please try again.', 'error');
        }
    });
}

function checkForEmptyStates() {
    checkEchoesEmptyState();
    checkCampaignsEmptyState();
    checkMentionsEmptyState();
}

function checkEchoesEmptyState() {
    const container = document.getElementById('echoesContainer');
    const echoes = dashboardState.echoes || [];
    
    if (container && echoes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No attribution echoes yet</h3>
                <p>Start logging customer feedback and mentions to track attribution signals.</p>
                <button onclick="addEchoEntry()" class="btn btn-primary">Add First Echo</button>
            </div>
        `;
    }
}

function checkCampaignsEmptyState() {
    const container = document.getElementById('campaignsContainer');
    const campaigns = dashboardState.campaigns || [];
    
    if (container && campaigns.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No campaigns tracked yet</h3>
                <p>Add your marketing campaigns to track their attribution impact.</p>
                <button onclick="addCampaign()" class="btn btn-primary">Add First Campaign</button>
            </div>
        `;
    }
}

function checkMentionsEmptyState() {
    const container = document.getElementById('mentionsFeed');
    const mentions = dashboardState.liveFeed?.mentions || [];
    
    if (container && mentions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No mentions found</h3>
                <p>Connect your APIs or import data to see brand mentions here.</p>
            </div>
        `;
    }
}

// Enhanced function wrapping for error handling
function safeFunction(fn, errorMessage = 'An error occurred') {
    return function(...args) {
        try {
            return fn.apply(this, args);
        } catch (error) {
            console.error(errorMessage, error);
            if (typeof showNotification === 'function') {
                showNotification(errorMessage, 'error');
            }
        }
    };
}

// Event Listeners Setup
function setupEventListeners() {
    // Setup error handling first
    setupErrorHandling();
    
    // Navigation
    initializeNavigation();
    
    // Form submissions
    const campaignForm = document.getElementById('campaignForm');
    if (campaignForm) {
        campaignForm.addEventListener('submit', handleCampaignFormSubmit);
    }
    
    const echoForm = document.getElementById('echoForm');
    if (echoForm) {
        echoForm.addEventListener('submit', handleEchoFormSubmit);
    }
    
    // Timeframe selectors
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('timeframe-btn')) {
            const timeframe = e.target.getAttribute('data-timeframe');
            if (timeframe) {
                // Update active state
                document.querySelectorAll('.timeframe-btn').forEach(btn => 
                    btn.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update chart
                updateChart(timeframe);
            }
        }
    });
    
    // Modal close buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        }
    });
    
    // Hash change for navigation
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            navigateToSection(hash);
        }
    });
}

// Initialize Dashboard
async function initializeDashboard() {
    try {
        // Load saved data
        if (typeof loadFromLocalStorage === 'function') {
            loadFromLocalStorage();
        }
        
        // Setup event listeners
        setupEventListeners();
        
        // Populate initial data
        populateInitialData();
        
        // Initialize chart
        initializeChart();
        
        // Initialize live feed if function exists
        if (typeof initializeLiveFeed === 'function') {
            await initializeLiveFeed();
        }
        
        // Check for empty states
        checkForEmptyStates();
        
        // Navigate to initial section
        const initialSection = window.location.hash.substring(1) || 'signalsSection';
        navigateToSection(initialSection);
        
        // Show setup wizard if not completed
        if (!dashboardState.setupWizard.completed) {
            const welcomeModal = document.getElementById('welcomeModal');
            if (welcomeModal) {
                welcomeModal.style.display = 'block';
            }
        }
        
        console.log('Attribution Dashboard initialized successfully');
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        if (typeof showNotification === 'function') {
            showNotification('Error initializing dashboard. Please refresh the page.', 'error');
        }
    }
}

// Module loading management
let modulesLoaded = {
    dashboardState: false,
    storageManager: false,
    notificationSystem: false,
    setupWizard: false,
    signalWidgets: false,
    liveFeed: false,
    missingFunctions: false
};

function checkModuleLoaded(moduleName) {
    modulesLoaded[moduleName] = true;
    
    // Check if all critical modules are loaded
    const criticalModules = ['dashboardState', 'notificationSystem', 'missingFunctions'];
    const allCriticalLoaded = criticalModules.every(module => modulesLoaded[module]);
    
    if (allCriticalLoaded && !window.dashboardInitialized) {
        window.dashboardInitialized = true;
        initializeDashboard();
    }
}

// Wait for DOM and all modules to load
document.addEventListener('DOMContentLoaded', function() {
    // Check if essential modules are already loaded
    if (typeof dashboardState !== 'undefined') modulesLoaded.dashboardState = true;
    if (typeof showNotification !== 'undefined') modulesLoaded.notificationSystem = true;
    if (typeof refreshData !== 'undefined') modulesLoaded.missingFunctions = true;
    
    // Start initialization with a delay to allow module loading
    setTimeout(() => {
        checkModuleLoaded('dom');
    }, 200);
});

// Export key functions for global access
window.navigateToSection = navigateToSection;
window.updateChart = updateChart;
window.refreshChart = refreshChart;
window.populateCampaigns = populateCampaigns;
window.populateEchoes = populateEchoes;
window.populatePrompts = populatePrompts;
window.copyPrompt = copyPrompt;
window.closeModal = closeModal;
window.addCampaign = addCampaign;
window.addEchoEntry = addEchoEntry;
window.editCampaign = editCampaign;
window.editEcho = editEcho;
window.deleteCampaign = deleteCampaign;
window.deleteEcho = deleteEcho;
window.handleCampaignFormSubmit = handleCampaignFormSubmit;
window.handleEchoFormSubmit = handleEchoFormSubmit;
window.setupErrorHandling = setupErrorHandling;
window.safeFunction = safeFunction;
window.checkForEmptyStates = checkForEmptyStates;