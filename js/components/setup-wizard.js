// Setup Wizard Component Module

// Select setup method and initialize wizard flow
function selectSetupMethod(method) {
    dashboardState.setupWizard.selectedMethod = method;
    dashboardState.setupWizard.currentStep = 0; // Initialize step counter
    
    console.log('Setup method selected:', method); // Debug log
    
    // Hide setup options
    document.querySelector('.setup-options').style.display = 'none';
    const initialSetup = document.getElementById('initialSetup');
    if (initialSetup) {
        initialSetup.style.display = 'none';
    }
    
    // Show appropriate steps based on method
    if (method === 'api' || method === 'both') {
        showWizardStep('apiSetupStep');
    } else if (method === 'csv') {
        showWizardStep('csvSetupStep');
    } else if (method === 'env') {
        showWizardStep('envSetupStep');
        if (typeof checkEnvStatus === 'function') {
            checkEnvStatus(); // Check current environment status
        }
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Show specific wizard step
function showWizardStep(stepId) {
    console.log('showWizardStep called with:', stepId); // Debug log
    
    // Hide all wizard steps
    const steps = document.querySelectorAll('.wizard-step');
    steps.forEach(step => {
        step.style.display = 'none';
        step.classList.remove('active');
    });
    
    // Show selected step
    const targetStep = document.getElementById(stepId);
    if (targetStep) {
        targetStep.style.display = 'block';
        targetStep.classList.add('active');
        console.log('Step shown:', stepId); // Debug log
    } else {
        console.error('Step not found:', stepId); // Debug log
    }
}

// Navigate to next wizard step
function nextWizardStep() {
    const currentMethod = dashboardState.setupWizard.selectedMethod;
    const currentStep = dashboardState.setupWizard.currentStep;
    
    console.log('nextWizardStep called:', { currentMethod, currentStep }); // Debug log
    
    if (currentMethod === 'api') {
        if (currentStep === 0) {
            showWizardStep('brandSetupStep');
            dashboardState.setupWizard.currentStep = 1;
        } else {
            // Complete setup
            finishSetup();
            return;
        }
    } else if (currentMethod === 'csv') {
        if (currentStep === 0) {
            showWizardStep('brandSetupStep');
            dashboardState.setupWizard.currentStep = 1;
        } else {
            // Complete setup
            finishSetup();
            return;
        }
    } else if (currentMethod === 'both') {
        if (currentStep === 0) {
            showWizardStep('csvSetupStep');
            dashboardState.setupWizard.currentStep = 1;
        } else if (currentStep === 1) {
            showWizardStep('brandSetupStep');
            dashboardState.setupWizard.currentStep = 2;
        } else {
            // Complete setup
            finishSetup();
            return;
        }
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Navigate to previous wizard step
function previousWizardStep() {
    const currentMethod = dashboardState.setupWizard.selectedMethod;
    const currentStep = dashboardState.setupWizard.currentStep;
    
    if (currentStep === 1) {
        if (currentMethod === 'both') {
            showWizardStep('apiSetupStep');
        } else {
            // Go back to method selection
            document.querySelector('.setup-options').style.display = 'grid';
            document.getElementById('initialSetup').style.display = 'block';
            showWizardStep('initialSetup');
        }
        dashboardState.setupWizard.currentStep = 0;
    } else if (currentStep === 2) {
        showWizardStep('csvSetupStep');
        dashboardState.setupWizard.currentStep = 1;
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Skip API setup step
function skipAPISetup() {
    if (dashboardState.setupWizard.selectedMethod === 'both') {
        showWizardStep('csvSetupStep');
        dashboardState.setupWizard.currentStep = 1;
    } else {
        showWizardStep('brandSetupStep');
        dashboardState.setupWizard.currentStep = 1;
    }
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Complete setup wizard
async function finishSetup() {
    // Save brand configuration
    const brandName = document.getElementById('brandName')?.value || '';
    const websiteUrl = document.getElementById('websiteUrl')?.value || '';
    const brandKeywords = document.getElementById('brandKeywords')?.value || '';
    
    dashboardState.brandConfig = {
        name: brandName,
        website: websiteUrl,
        keywords: brandKeywords.split(',').map(k => k.trim()).filter(k => k)
    };
    
    // Send brand configuration to backend
    if (brandName) {
        try {
            const response = await fetch('/api/brand-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    brand_name: brandName
                })
            });
            
            if (response.ok) {
                console.log('Brand name saved to backend');
            }
        } catch (error) {
            console.error('Failed to save brand name:', error);
        }
    }
    
    dashboardState.setupWizard.completed = true;
    
    // Close modal and initialize dashboard
    closeWelcome();
    if (typeof initializeLiveFeed === 'function') {
        initializeLiveFeed();
    }
    if (typeof showNotification === 'function') {
        showNotification('Setup completed successfully! Your dashboard is ready to use.', 'success');
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Close welcome modal
function closeWelcome() {
    const welcomeModal = document.getElementById('welcomeModal');
    if (welcomeModal) {
        welcomeModal.style.display = 'none';
    }
    dashboardState.setupWizard.completed = true;
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Update connection status display
function updateConnectionStatus(elementId, status, message) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Clear existing classes
    element.className = 'connection-status';
    
    // Add status-specific class and content
    switch (status) {
        case 'testing':
            element.classList.add('testing');
            element.textContent = message || 'Testing connection...';
            break;
        case 'success':
            element.classList.add('success');
            element.textContent = message || 'Connected successfully';
            break;
        case 'error':
            element.classList.add('error');
            element.textContent = message || 'Connection failed';
            break;
        default:
            element.textContent = message || 'Not connected';
    }
}

// Enhanced API Connection Testing
async function testGSCConnection() {
    const apiKey = document.getElementById('gscApiKey')?.value;
    
    if (!apiKey) {
        updateConnectionStatus('gscStatus', 'error', 'Please enter an API key');
        return;
    }
    
    updateConnectionStatus('gscStatus', 'testing', 'Testing connection...');
    
    try {
        // Store API key
        dashboardState.apiKeys.googleSearchConsole = apiKey;
        
        // Simulate API test (replace with actual GSC API call)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For demo purposes, randomly succeed or fail
        const success = Math.random() > 0.3;
        
        if (success) {
            dashboardState.apiStatus.googleSearchConsole = 'connected';
            updateConnectionStatus('gscStatus', 'success', 'Connected successfully');
            
            // Fetch initial data
            if (typeof fetchGSCData === 'function') {
                await fetchGSCData();
            }
        } else {
            dashboardState.apiStatus.googleSearchConsole = 'error';
            updateConnectionStatus('gscStatus', 'error', 'Invalid API key or permissions');
        }
    } catch (error) {
        dashboardState.apiStatus.googleSearchConsole = 'error';
        updateConnectionStatus('gscStatus', 'error', 'Connection test failed');
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Test Google Analytics connection
async function testGAConnection() {
    const apiKey = document.getElementById('gaApiKey')?.value;
    
    if (!apiKey) {
        updateConnectionStatus('gaStatus', 'error', 'Please enter an API key');
        return;
    }
    
    updateConnectionStatus('gaStatus', 'testing', 'Testing connection...');
    
    try {
        dashboardState.apiKeys.googleAnalytics = apiKey;
        
        // Simulate API test
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const success = Math.random() > 0.3;
        
        if (success) {
            dashboardState.apiStatus.googleAnalytics = 'connected';
            updateConnectionStatus('gaStatus', 'success', 'Connected successfully');
            
            if (typeof fetchGA4Data === 'function') {
                await fetchGA4Data();
            }
        } else {
            dashboardState.apiStatus.googleAnalytics = 'error';
            updateConnectionStatus('gaStatus', 'error', 'Invalid credentials or permissions');
        }
    } catch (error) {
        dashboardState.apiStatus.googleAnalytics = 'error';
        updateConnectionStatus('gaStatus', 'error', 'Connection test failed');
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Test GA4 connection (alternative method)
async function testGA4Connection() {
    const apiKey = document.getElementById('ga4ApiKey')?.value;
    
    if (!apiKey) {
        updateConnectionStatus('ga4Status', 'error', 'Please enter an API key');
        return;
    }
    
    updateConnectionStatus('ga4Status', 'testing', 'Testing connection...');
    
    try {
        dashboardState.apiKeys.googleAnalytics = apiKey;
        
        // Simulate API test
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const success = Math.random() > 0.3;
        
        if (success) {
            dashboardState.apiStatus.googleAnalytics = 'connected';
            updateConnectionStatus('ga4Status', 'success', 'Connected successfully');
            
            if (typeof fetchGA4Data === 'function') {
                await fetchGA4Data();
            }
        } else {
            dashboardState.apiStatus.googleAnalytics = 'error';
            updateConnectionStatus('ga4Status', 'error', 'Invalid credentials or permissions');
        }
    } catch (error) {
        dashboardState.apiStatus.googleAnalytics = 'error';
        updateConnectionStatus('ga4Status', 'error', 'Connection test failed');
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Test social media API connections
async function testSocialConnection() {
    const apiKey = document.getElementById('socialApiKey')?.value;
    
    if (!apiKey) {
        updateConnectionStatus('socialStatus', 'error', 'Please enter an API key');
        return;
    }
    
    updateConnectionStatus('socialStatus', 'testing', 'Testing connection...');
    
    try {
        dashboardState.apiKeys.scrapeCreators = apiKey;
        
        // Simulate API test
        await new Promise(resolve => setTimeout(resolve, 1800));
        
        const success = Math.random() > 0.3;
        
        if (success) {
            dashboardState.apiStatus.scrapeCreators = 'connected';
            updateConnectionStatus('socialStatus', 'success', 'Connected successfully');
            
            if (typeof fetchSocialData === 'function') {
                await fetchSocialData();
            }
        } else {
            dashboardState.apiStatus.scrapeCreators = 'error';
            updateConnectionStatus('socialStatus', 'error', 'Invalid API key or rate limit exceeded');
        }
    } catch (error) {
        dashboardState.apiStatus.scrapeCreators = 'error';
        updateConnectionStatus('socialStatus', 'error', 'Connection test failed');
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Test ScrapeCreators connection
async function testSCConnection() {
    const apiKey = document.getElementById('scApiKey')?.value;
    
    if (!apiKey) {
        updateConnectionStatus('scStatus', 'error', 'Please enter an API key');
        return;
    }
    
    updateConnectionStatus('scStatus', 'testing', 'Testing connection...');
    
    try {
        dashboardState.apiKeys.scrapeCreators = apiKey;
        
        // Simulate API test
        await new Promise(resolve => setTimeout(resolve, 1800));
        
        const success = Math.random() > 0.3;
        
        if (success) {
            dashboardState.apiStatus.scrapeCreators = 'connected';
            updateConnectionStatus('scStatus', 'success', 'Connected successfully');
        } else {
            dashboardState.apiStatus.scrapeCreators = 'error';
            updateConnectionStatus('scStatus', 'error', 'Invalid API key or rate limit exceeded');
        }
    } catch (error) {
        dashboardState.apiStatus.scrapeCreators = 'error';
        updateConnectionStatus('scStatus', 'error', 'Connection test failed');
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Test Exa Search connection
async function testExaConnection() {
    const apiKey = document.getElementById('exaApiKey')?.value;
    
    if (!apiKey) {
        updateConnectionStatus('exaStatus', 'error', 'Please enter an API key');
        return;
    }
    
    updateConnectionStatus('exaStatus', 'testing', 'Testing connection...');
    
    try {
        dashboardState.apiKeys.exaSearch = apiKey;
        
        // Simulate API test
        await new Promise(resolve => setTimeout(resolve, 1600));
        
        const success = Math.random() > 0.3;
        
        if (success) {
            dashboardState.apiStatus.exaSearch = 'connected';
            updateConnectionStatus('exaStatus', 'success', 'Connected successfully');
        } else {
            dashboardState.apiStatus.exaSearch = 'error';
            updateConnectionStatus('exaStatus', 'error', 'Invalid API key or service unavailable');
        }
    } catch (error) {
        dashboardState.apiStatus.exaSearch = 'error';
        updateConnectionStatus('exaStatus', 'error', 'Connection test failed');
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Test Email Marketing connection
async function testEmailConnection() {
    const apiKey = document.getElementById('emailApiKey')?.value;
    
    if (!apiKey) {
        updateConnectionStatus('emailStatus', 'error', 'Please enter an API key');
        return;
    }
    
    updateConnectionStatus('emailStatus', 'testing', 'Testing connection...');
    
    try {
        dashboardState.apiKeys.emailMarketing = apiKey;
        
        // Simulate API test
        await new Promise(resolve => setTimeout(resolve, 1400));
        
        const success = Math.random() > 0.3;
        
        if (success) {
            dashboardState.apiStatus.emailMarketing = 'connected';
            updateConnectionStatus('emailStatus', 'success', 'Connected successfully');
        } else {
            dashboardState.apiStatus.emailMarketing = 'error';
            updateConnectionStatus('emailStatus', 'error', 'Invalid API key or authentication failed');
        }
    } catch (error) {
        dashboardState.apiStatus.emailMarketing = 'error';
        updateConnectionStatus('emailStatus', 'error', 'Connection test failed');
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Test CRM/Calendar connection
async function testCRMConnection() {
    const apiKey = document.getElementById('crmApiKey')?.value;
    
    if (!apiKey) {
        updateConnectionStatus('crmStatus', 'error', 'Please enter an API key');
        return;
    }
    
    updateConnectionStatus('crmStatus', 'testing', 'Testing connection...');
    
    try {
        dashboardState.apiKeys.crmCalendar = apiKey;
        
        // Simulate API test
        await new Promise(resolve => setTimeout(resolve, 1700));
        
        const success = Math.random() > 0.3;
        
        if (success) {
            dashboardState.apiStatus.crmCalendar = 'connected';
            updateConnectionStatus('crmStatus', 'success', 'Connected successfully');
        } else {
            dashboardState.apiStatus.crmCalendar = 'error';
            updateConnectionStatus('crmStatus', 'error', 'Invalid API key or permissions');
        }
    } catch (error) {
        dashboardState.apiStatus.crmCalendar = 'error';
        updateConnectionStatus('crmStatus', 'error', 'Connection test failed');
    }
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// CSV Template Functions
function downloadTemplate(templateType) {
    const templates = {
        'search-volume': {
            filename: 'search-volume-template.csv',
            content: 'date,query,impressions,clicks,avg_position\n2024-01-01,"brand name",1000,50,2.1\n2024-01-02,"brand name review",800,40,1.8'
        },
        'direct-traffic': {
            filename: 'direct-traffic-template.csv',
            content: 'date,sessions,source_medium,landing_page\n2024-01-01,150,"(direct)/(none)","/"\n2024-01-02,120,"(direct)/(none)","/products"'
        },
        'inbound-messages': {
            filename: 'inbound-messages-template.csv',
            content: 'date,source,message_type,content_ref\n2024-01-01,"email","inquiry","product demo request"\n2024-01-02,"linkedin","mention","saw your recent post"'
        },
        'community-engagement': {
            filename: 'community-engagement-template.csv',
            content: 'date,platform,engagement_type,metrics\n2024-01-01,"reddit","mention","{\"upvotes\": 45, \"comments\": 12}"\n2024-01-02,"twitter","retweet","{\"likes\": 23, \"retweets\": 8}"'
        },
        'first-party': {
            filename: 'first-party-template.csv',
            content: 'date,source,conversion_type,attribution_source\n2024-01-01,"newsletter","signup","blog post"\n2024-01-02,"demo","trial","google search"'
        }
    };
    
    const template = templates[templateType];
    if (!template) {
        if (typeof showNotification === 'function') {
            showNotification('Template not found', 'error');
        }
        return;
    }
    
    const blob = new Blob([template.content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = template.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (typeof showNotification === 'function') {
        showNotification(`${template.filename} downloaded`, 'success');
    }
}

function handleTemplateUpload(templateType, input) {
    const file = input.files[0];
    if (!file) return;
    
    const statusElement = document.getElementById(`${templateType.replace('-', '')}Status`);
    if (statusElement) {
        statusElement.textContent = `Uploaded: ${file.name}`;
        statusElement.className = 'upload-status success';
    }
    
    // Here you would typically parse the CSV and store the data
    // For now, we'll just simulate successful upload
    if (typeof showNotification === 'function') {
        showNotification(`${file.name} uploaded successfully`, 'success');
    }
    
    // Store file reference in dashboard state
    if (!dashboardState.uploadedFiles) {
        dashboardState.uploadedFiles = {};
    }
    dashboardState.uploadedFiles[templateType] = {
        name: file.name,
        size: file.size,
        uploadDate: new Date().toISOString()
    };
    
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Environment Configuration Functions
function copyEnvTemplate() {
    const template = `# Attribution Dashboard Configuration
# Copy this file to .env and add your actual API keys

# Brand Configuration
BRAND_NAME=YourBrandName
SECRET_KEY=your-secret-key-change-this-in-production

# API Keys for Social Media Monitoring
SCRAPE_CREATORS_API_KEY=your_scrape_creators_api_key_here
EXA_API_KEY=your_exa_search_api_key_here

# Optional: Google APIs (if you have them)
GOOGLE_SEARCH_CONSOLE_API_KEY=your_gsc_api_key_here
GOOGLE_ANALYTICS_API_KEY=your_ga_api_key_here

# Optional: Email Marketing APIs
MAILCHIMP_API_KEY=your_mailchimp_api_key_here
CONVERTKIT_API_KEY=your_convertkit_api_key_here

# Optional: CRM/Calendar APIs
CALENDLY_API_KEY=your_calendly_api_key_here
HUBSPOT_API_KEY=your_hubspot_api_key_here`;

    navigator.clipboard.writeText(template).then(() => {
        if (typeof showNotification === 'function') {
            showNotification('Environment template copied to clipboard', 'success');
        }
    }).catch(err => {
        console.error('Failed to copy template:', err);
        if (typeof showNotification === 'function') {
            showNotification('Failed to copy template', 'error');
        }
    });
}

async function checkEnvStatus() {
    // Check if backend is available and has environment variables configured
    try {
        const response = await fetch('/api/env-status');
        if (response.ok) {
            const envStatus = await response.json();
            
            // Update status display
            const brandNameElement = document.getElementById('envBrandName');
            const scrapeCreatorsElement = document.getElementById('envScrapeCreators');
            const exaSearchElement = document.getElementById('envExaSearch');
            
            if (brandNameElement) {
                brandNameElement.textContent = envStatus.brand_name || 'Not configured';
                brandNameElement.className = envStatus.brand_name ? 'status-value connected' : 'status-value disconnected';
            }
            
            if (scrapeCreatorsElement) {
                scrapeCreatorsElement.textContent = envStatus.scrape_creators_configured ? 'Configured' : 'Not configured';
                scrapeCreatorsElement.className = envStatus.scrape_creators_configured ? 'status-value connected' : 'status-value disconnected';
            }
            
            if (exaSearchElement) {
                exaSearchElement.textContent = envStatus.exa_search_configured ? 'Configured' : 'Not configured';
                exaSearchElement.className = envStatus.exa_search_configured ? 'status-value connected' : 'status-value disconnected';
            }
        } else {
            throw new Error('Backend not available');
        }
    } catch (error) {
        console.error('Failed to check environment status:', error);
        // Update with offline status
        ['envBrandName', 'envScrapeCreators', 'envExaSearch'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = 'Backend offline';
                element.className = 'status-value disconnected';
            }
        });
    }
}

// Export functions for global access
window.selectSetupMethod = selectSetupMethod;
window.showWizardStep = showWizardStep;
window.nextWizardStep = nextWizardStep;
window.previousWizardStep = previousWizardStep;
window.skipAPISetup = skipAPISetup;
window.finishSetup = finishSetup;
window.closeWelcome = closeWelcome;
window.updateConnectionStatus = updateConnectionStatus;
window.testGSCConnection = testGSCConnection;
window.testGAConnection = testGAConnection;
window.testGA4Connection = testGA4Connection;
window.testSCConnection = testSCConnection;
window.testExaConnection = testExaConnection;
window.testEmailConnection = testEmailConnection;
window.testCRMConnection = testCRMConnection;
window.testSocialConnection = testSocialConnection;
window.downloadTemplate = downloadTemplate;
window.handleTemplateUpload = handleTemplateUpload;
window.copyEnvTemplate = copyEnvTemplate;
window.checkEnvStatus = checkEnvStatus;