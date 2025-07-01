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
    
    // Generate chart data from existing mentions
    if (typeof updateMentionsChartData === 'function') {
        updateMentionsChartData();
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
    
    // Check if dashboardState is defined and has mentionsData
    if (!dashboardState || !dashboardState.mentionsData) {
        console.warn('Dashboard state or mentions data not available for chart initialization');
        return;
    }
    
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

// Helper function to update chart data and labels
function updateChartData(timeframe) {
    if (!mentionsChart || !dashboardState || !dashboardState.mentionsData || !dashboardState.mentionsData[timeframe]) return;
    
    const data = dashboardState.mentionsData[timeframe];
    mentionsChart.data.labels = data.map(d => d.day);
    mentionsChart.data.datasets[0].data = data.map(d => d.mentions);
    mentionsChart.update();
}

function updateChart(timeframe) {
    if (!mentionsChart) {
        initializeChart();
        return;
    }
    
    currentTimeframe = timeframe;
    updateChartData(timeframe);
}

function refreshChart() {
    // First update chart data from current mentions
    if (typeof updateMentionsChartData === 'function') {
        updateMentionsChartData();
    }
    
    // Then update the chart display
    if (mentionsChart) {
        updateChartData(currentTimeframe);
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
        const campaignDiv = createCampaignElement(campaign, index);
        container.appendChild(campaignDiv);
    });
}

// Helper function to create campaign elements securely
function createCampaignElement(campaign, index) {
    const campaignDiv = document.createElement('div');
    campaignDiv.className = 'campaign-item';
    
    // Create campaign header
    const header = document.createElement('div');
    header.className = 'campaign-header';
    
    const title = document.createElement('h4');
    title.textContent = campaign.name; // Safe text content
    
    const actions = document.createElement('div');
    actions.className = 'campaign-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'btn-small';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editCampaign(index));
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-small btn-danger';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteCampaign(index));
    
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    header.appendChild(title);
    header.appendChild(actions);
    
    // Create campaign stats
    const stats = document.createElement('div');
    stats.className = 'campaign-stats';
    
    // Search Delta stat
    const deltaStat = createStatElement('Search Delta:', campaign.brandedSearchDelta);
    const deltaValue = deltaStat.querySelector('.stat-value');
    deltaValue.className = `stat-value ${campaign.brandedSearchDelta.startsWith('+') ? 'positive' : 'negative'}`;
    stats.appendChild(deltaStat);
    
    // Other stats
    stats.appendChild(createStatElement('Mentions:', campaign.mentions));
    stats.appendChild(createStatElement('Signups:', campaign.signups));
    stats.appendChild(createStatElement('Buzz:', campaign.communityBuzz));
    
    // Create campaign notes
    const notes = document.createElement('div');
    notes.className = 'campaign-notes';
    notes.textContent = campaign.notes; // Safe text content
    
    // Assemble the campaign element
    campaignDiv.appendChild(header);
    campaignDiv.appendChild(stats);
    campaignDiv.appendChild(notes);
    
    return campaignDiv;
}

// Helper function to create stat elements securely
function createStatElement(label, value) {
    const stat = document.createElement('div');
    stat.className = 'stat';
    
    const labelSpan = document.createElement('span');
    labelSpan.className = 'stat-label';
    labelSpan.textContent = label;
    
    const valueSpan = document.createElement('span');
    valueSpan.className = 'stat-value';
    valueSpan.textContent = value; // Safe text content
    
    stat.appendChild(labelSpan);
    stat.appendChild(valueSpan);
function editCampaign(index) {
    // Validate index is an integer within range
    if (!Number.isInteger(index) || index < 0 || index >= dashboardState.campaigns.length) {
        console.error('Invalid campaign index:', index);
        return;
    }

    const campaign = dashboardState.campaigns[index];

    document.getElementById('campaignName').value = campaign.name;
    document.getElementById('campaignDelta').value = campaign.brandedSearchDelta;
    document.getElementById('campaignMentions').value = campaign.mentions;
    document.getElementById('campaignSignups').value = campaign.signups;
    document.getElementById('campaignBuzz').value = campaign.communityBuzz;
    document.getElementById('campaignNotes').value = campaign.notes;
    document.getElementById('campaignIndex').value = index;
    
    document.getElementById('campaignModal').style.display = 'block';
}
    
    emptyState.appendChild(titleElement);
    emptyState.appendChild(descElement);
    
    if (buttonText && buttonCallback) {
        const button = document.createElement('button');
        button.className = 'btn btn-primary';
        button.textContent = buttonText; // Safe text content
        button.addEventListener('click', buttonCallback);
        emptyState.appendChild(button);
    }
    
    return emptyState;
}

function populateEchoes() {
    const container = document.getElementById('echoesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    dashboardState.echoes.forEach((echo, index) => {
        const echoDiv = createEchoElement(echo, index);
        container.appendChild(echoDiv);
    });
}

// Helper function to create echo elements securely
function createEchoElement(echo, index) {
    const echoDiv = document.createElement('div');
    echoDiv.className = 'echo-item';
    
    // Create echo header
    const header = document.createElement('div');
    header.className = 'echo-header';
    
    const typeSpan = document.createElement('span');
    typeSpan.className = 'echo-type';
    typeSpan.textContent = echo.type; // Safe text content
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'echo-time';
    timeSpan.textContent = echo.timestamp; // Safe text content
    
    const actions = document.createElement('div');
    actions.className = 'echo-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'btn-small';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editEcho(index));
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-small btn-danger';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteEcho(index));
    
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    header.appendChild(typeSpan);
    header.appendChild(timeSpan);
    header.appendChild(actions);
    
    // Create echo content
    const content = document.createElement('div');
    content.className = 'echo-content';
    content.textContent = echo.content; // Safe text content
    
    // Create echo source
    const source = document.createElement('div');
    source.className = 'echo-source';
    source.textContent = `Source: ${echo.source}`; // Safe text content
    
    // Assemble the echo element
    echoDiv.appendChild(header);
    echoDiv.appendChild(content);
    echoDiv.appendChild(source);
    
    return echoDiv;
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
    document.getElementById('addEchoModal').style.display = 'block';
    document.getElementById('echoForm').reset();
    if (document.getElementById('echoIndex')) {
        document.getElementById('echoIndex').value = '';
    }
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
    if (document.getElementById('echoIndex')) {
        document.getElementById('echoIndex').value = index;
    }
    
    document.getElementById('addEchoModal').style.display = 'block';
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
    
    const campaign = {
        name: document.getElementById('campaignName').value,
        brandedSearchDelta: document.getElementById('campaignDelta').value,
        mentions: parseInt(document.getElementById('campaignMentions').value) || 0,
        signups: parseInt(document.getElementById('campaignSignups').value) || 0,
        communityBuzz: document.getElementById('campaignBuzz').value,
        notes: document.getElementById('campaignNotes').value
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
    
    const echo = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        type: document.getElementById('echoType').value,
        content: document.getElementById('echoContent').value,
        source: document.getElementById('echoSource').value
    };
    
    const index = document.getElementById('echoIndex') ? document.getElementById('echoIndex').value : '';
    
    if (index === '') {
        // Adding new echo
        dashboardState.echoes.unshift(echo);
    } else {
        // Editing existing echo
        dashboardState.echoes[parseInt(index)] = echo;
    }
    
    populateEchoes();
    closeModal('addEchoModal');
    
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
        
        // Create category header securely
        const categoryHeader = document.createElement('h3');
        categoryHeader.textContent = category; // Safe text content
        categoryDiv.appendChild(categoryHeader);
        
        const categoryPrompts = filteredPrompts.filter(p => p.category === category);
        
        // Build an index map for efficient lookup and to avoid O(n²) complexity
        const promptIndexMap = new Map();
        dashboardState.prompts.forEach((prompt, index) => {
            promptIndexMap.set(prompt, index);
        });
        
        categoryPrompts.forEach(prompt => {
            const promptDiv = createPromptElement(prompt, promptIndexMap.get(prompt));
            categoryDiv.appendChild(promptDiv);
        });
        
        container.appendChild(categoryDiv);
    });
}

// Helper function to create prompt elements securely
function createPromptElement(prompt, promptIndex) {
    const promptDiv = document.createElement('div');
    promptDiv.className = 'prompt-item';
    
    // Create prompt header
    const header = document.createElement('div');
    header.className = 'prompt-header';
    
    const title = document.createElement('h4');
    title.textContent = prompt.title; // Safe text content
    
    const actions = document.createElement('div');
    actions.className = 'prompt-actions';
    
    // Create copy button with secure event binding
    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn btn--outline btn--sm';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', () => copyPromptByIndex(promptIndex));
    
    // Create edit button with secure event binding
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn--secondary btn--sm';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editPrompt(promptIndex));
    
    actions.appendChild(copyBtn);
    actions.appendChild(editBtn);
    header.appendChild(title);
    header.appendChild(actions);
    
    // Create prompt content
    const content = document.createElement('div');
    content.className = 'prompt-content';
    content.textContent = prompt.content; // Safe text content
    
    // Assemble the prompt element
    promptDiv.appendChild(header);
    promptDiv.appendChild(content);
    
    return promptDiv;
}

// Updated copy function using index instead of title for better performance and security
function copyPromptByIndex(index) {
    const prompt = dashboardState.prompts[index];
    if (prompt) {
        navigator.clipboard.writeText(prompt.content).then(() => {
            if (typeof showNotification === 'function') {
                showNotification('Prompt copied to clipboard', 'success');
            }
        });
    }
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

// Create empty state element with title, description, and optional action button
function createEmptyStateElement(title, description, buttonText = null, buttonCallback = null) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    
    const titleEl = document.createElement('h3');
    titleEl.className = 'empty-state-title';
    titleEl.textContent = title;
    
    const descEl = document.createElement('p');
    descEl.className = 'empty-state-description';
    descEl.textContent = description;
    
    emptyState.appendChild(titleEl);
    emptyState.appendChild(descEl);
    
    // Add action button if provided
    if (buttonText && buttonCallback) {
        const buttonEl = document.createElement('button');
        buttonEl.className = 'empty-state-button btn btn-primary';
        buttonEl.textContent = buttonText;
        buttonEl.onclick = buttonCallback;
        emptyState.appendChild(buttonEl);
    }
    
    return emptyState;
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
        const emptyState = createEmptyStateElement(
            'No attribution echoes yet',
            'Start logging customer feedback and mentions to track attribution signals.',
            'Add First Echo',
            addEchoEntry
        );
        container.appendChild(emptyState);
    }
}

function checkCampaignsEmptyState() {
    const container = document.getElementById('campaignsContainer');
    const campaigns = dashboardState.campaigns || [];
    
    if (container && campaigns.length === 0) {
        const emptyState = createEmptyStateElement(
            'No campaigns tracked yet',
            'Add your marketing campaigns to track their attribution impact.',
            'Add First Campaign',
            addCampaign
        );
        container.appendChild(emptyState);
    }
}

function checkMentionsEmptyState() {
    const container = document.getElementById('mentionsFeed');
    const mentions = dashboardState.liveFeed?.mentions || [];
    
    if (container && mentions.length === 0) {
        const emptyState = createEmptyStateElement(
            'No mentions found',
            'Connect your APIs or import data to see brand mentions here.'
        );
        container.appendChild(emptyState);
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
window.copyPromptByIndex = copyPromptByIndex;
window.createPromptElement = createPromptElement;
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
window.createCampaignElement = createCampaignElement;
window.createEchoElement = createEchoElement;
window.createStatElement = createStatElement;
window.createEmptyStateElement = createEmptyStateElement;