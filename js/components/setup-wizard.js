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
window.testGA4Connection = testGA4Connection;
window.testSocialConnection = testSocialConnection;