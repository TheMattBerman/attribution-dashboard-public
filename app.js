// Enhanced Dashboard State Management with Data Persistence
const dashboardState = {
    signals: {
        brandedSearchVolume: 2847,
        directTraffic: 1234,
        inboundMessages: 89,
        communityEngagement: 156,
        firstPartyData: 67,
        attributionScore: 8.7
    },
    brandConfig: {
        name: '',
        website: '',
        keywords: []
    },
    apiKeys: {
        googleSearchConsole: '',
        googleAnalytics: '',
        scrapeCreators: '',
        exaSearch: '',
        emailMarketing: '',
        crmCalendar: ''
    },
    apiStatus: {
        googleSearchConsole: 'disconnected',
        googleAnalytics: 'disconnected',
        scrapeCreators: 'disconnected',
        exaSearch: 'disconnected',
        emailMarketing: 'disconnected',
        crmCalendar: 'disconnected'
    },
    liveFeed: {
        mentions: [],
        isActive: true,
        lastUpdate: new Date(),
        filters: {
            platform: '',
            sentiment: '',
            keyword: ''
        }
    },
    setupWizard: {
        currentStep: 0,
        selectedMethod: '',
        completed: false
    },
    campaigns: [
        {
            name: "Q1 Content Push",
            brandedSearchDelta: "+23%",
            mentions: 156,
            signups: 89,
            communityBuzz: "High",
            notes: "Strong performance on LinkedIn"
        },
        {
            name: "Podcast Tour",
            brandedSearchDelta: "+45%",
            mentions: 278,
            signups: 134,
            communityBuzz: "Very High",
            notes: "Major spike after Joe Rogan appearance"
        },
        {
            name: "Email Sequence",
            brandedSearchDelta: "+12%",
            mentions: 67,
            signups: 45,
            communityBuzz: "Medium",
            notes: "Steady growth, good retention"
        }
    ],
    echoes: [
        {
            id: Date.now() + 1,
            timestamp: "2024-06-27 14:30",
            type: "Unsolicited Mention",
            content: "Customer mentioned us in Industry Slack channel",
            source: "Slack"
        },
        {
            id: Date.now() + 2,
            timestamp: "2024-06-27 11:15",
            type: "Campaign Response",
            content: "Direct response to newsletter CTA",
            source: "Email"
        },
        {
            id: Date.now() + 3,
            timestamp: "2024-06-26 16:45",
            type: "New Activity",
            content: "Featured in competitor's case study",
            source: "Blog"
        }
    ],
    prompts: [
        // Survey Questions
        {
            category: "Survey Questions",
            title: "Discovery Attribution Survey",
            content: "We'd love to understand your journey better! How did you first discover {brand_name}? Was it through: a) Google search, b) Social media (which platform?), c) Friend/colleague recommendation, d) Podcast/YouTube mention, e) Industry publication, f) Other (please specify). Understanding this helps us reach more people like you!"
        },
        {
            category: "Survey Questions",
            title: "Post-Purchase Attribution",
            content: "Thank you for your purchase! To help us understand what influenced your decision, could you share: 1) Where you first heard about us, 2) What specific content/review/recommendation convinced you to buy, 3) How long you researched before purchasing? Your insights help us serve future customers better."
        },
        {
            category: "Survey Questions",
            title: "Referral Source Deep Dive",
            content: "You mentioned you heard about us through a recommendation - that's wonderful! Could you help us with a few more details: 1) Who referred you (name/company if comfortable sharing), 2) In what context did they mention us (casual conversation, presentation, etc.), 3) What specifically did they say that caught your attention?"
        },
        {
            category: "Survey Questions",
            title: "Channel Effectiveness Survey",
            content: "We're curious about your research process! Before choosing {brand_name}, did you: a) Read our blog posts, b) Watch our videos/demos, c) Read reviews on third-party sites, d) Join our community/social media, e) Attend a webinar/event, f) Speak with our sales team? Which of these was most helpful in your decision?"
        },
        {
            category: "Survey Questions",
            title: "Content Attribution Tracker",
            content: "We create lots of content to help potential customers! Was there a specific piece of content that helped you decide to work with us? For example: a particular blog post, video, case study, whitepaper, or social media post. If so, could you share which one and how it influenced your decision?"
        },

        // Email Signatures
        {
            category: "Email Signatures",
            title: "Professional Attribution Request",
            content: "P.S. We're always trying to understand how our clients discover us. Would you mind sharing how you first heard about {brand_name}? It takes just a moment and helps us focus our efforts on what works best."
        },
        {
            category: "Email Signatures",
            title: "Casual Attribution Tracking",
            content: "P.S. Quick question - how did you first find out about us? Was it through Google, a referral, social media, or somewhere else? Just curious how people discover {brand_name} these days!"
        },
        {
            category: "Email Signatures",
            title: "Newsletter Attribution",
            content: "P.S. Since you're subscribed to our newsletter, we'd love to know: what originally brought you to {brand_name}? Was it a specific search, recommendation, or piece of content? Your answer helps us create better resources for future subscribers."
        },
        {
            category: "Email Signatures",
            title: "Follow-up Attribution Question",
            content: "P.S. I hope this email finds you well! Out of curiosity, how did you originally discover {brand_name}? Understanding our customers' journeys helps us improve how we connect with people who could benefit from our solution."
        },

        // Follow-up Messages
        {
            category: "Follow-up Messages",
            title: "Post-Demo Attribution",
            content: "Thanks for taking the time to see our demo! Before we continue, I'd love to understand your journey better. What originally brought you to {brand_name}? Was it a specific search, a colleague's recommendation, content you read, or something else? This helps us tailor our follow-up to what resonates most with you."
        },
        {
            category: "Follow-up Messages",
            title: "Trial-to-Paid Attribution",
            content: "Congratulations on completing your trial! As you consider next steps, we'd appreciate understanding what initially led you to try {brand_name}. Was it through search, a referral, specific content, or another channel? This insight helps us support similar customers in their evaluation process."
        },
        {
            category: "Follow-up Messages",
            title: "Support Ticket Attribution",
            content: "While I have you, I'm curious about your journey with {brand_name}. How did you originally discover us? Was it through a Google search, colleague recommendation, industry publication, or another way? Understanding this helps our team identify what's working well in how we reach new customers."
        },
        {
            category: "Follow-up Messages",
            title: "Customer Success Check-in",
            content: "I hope you're seeing great results with {brand_name}! As part of our customer success program, we're tracking what brings people to us initially. Could you remind me how you first heard about {brand_name}? This helps us ensure we're reaching other potential customers who could benefit like you have."
        },

        // Social Media Posts
        {
            category: "Social Media Posts",
            title: "LinkedIn Attribution Post",
            content: "Curious question for my network: When you're evaluating a new {product_category} solution, what sources do you trust most? Industry publications? Peer recommendations? Review sites? YouTube demos? Trying to understand how professionals in our space make decisions. Drop a comment with your go-to research method!"
        },
        {
            category: "Social Media Posts",
            title: "Twitter Attribution Poll",
            content: "Quick poll: How do you typically discover new {product_category} tools? 🧵\nA) Google search\nB) Friend/colleague rec\nC) Social media\nD) Industry content\n\nAlways fascinated by the customer journey! #SaaS #CustomerJourney #Attribution"
        },
        {
            category: "Social Media Posts",
            title: "Facebook Community Attribution",
            content: "Hey {community_name} community! We're seeing amazing growth and I'm curious about something. For those who've tried {brand_name}, how did you first hear about us? Was it through this group, a Google search, or somewhere else? Understanding this helps us contribute more meaningfully to communities like this one."
        },

        // Landing Pages
        {
            category: "Landing Pages",
            title: "Homepage Attribution Capture",
            content: "Before you explore our solution, we'd love to know: How did you hear about {brand_name}? This quick question helps us understand what's working and ensures we can help others discover us too. Your journey matters to us!"
        },
        {
            category: "Landing Pages",
            title: "Download Attribution Gate",
            content: "One quick question before you download our {resource_name}: How did you find {brand_name}? Was it through search, a referral, social media, or another source? This helps us create more valuable content for people like you."
        },
        {
            category: "Landing Pages",
            title: "Demo Request Attribution",
            content: "Excited to show you {brand_name} in action! To help us prepare the most relevant demo, could you share how you discovered us? This context helps our team understand your perspective and tailor the demo to what brought you here."
        },

        // Feedback Forms
        {
            category: "Feedback Forms",
            title: "Exit Survey Attribution",
            content: "Thank you for your feedback! One final question: How did you originally discover {brand_name}? Understanding this helps us improve how we reach and serve customers. Your complete customer journey helps us better support future users."
        },
        {
            category: "Feedback Forms",
            title: "Product Feedback Attribution",
            content: "Your product feedback is invaluable! As part of understanding our user base better, could you share how you first learned about {brand_name}? This context helps us correlate feedback with customer acquisition channels."
        },
        {
            category: "Feedback Forms",
            title: "NPS Attribution Enhancement",
            content: "Thank you for rating your experience! To help us understand what brings our most satisfied customers to us, could you share how you originally discovered {brand_name}? This helps us focus our efforts on channels that attract customers who love our solution."
        }
    ],
    mentionsData: {
        '7d': generateSevenDayData(),
        '30d': generateThirtyDayData()
    },
    settings: {
        apiKeys: {
            googleSearchConsole: '',
            exaSearch: '',
            scrapeCreators: ''
        },
        webhooks: [],
        csvSources: []
    }
};

// Generate realistic 30-day data
function generateThirtyDayData() {
    const data = [];
    const baseValue = 65;
    for (let i = 29; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const variance = Math.floor(Math.random() * 40) - 20; // -20 to +20
        const seasonalBoost = i < 7 ? Math.floor(Math.random() * 15) : 0; // Recent boost
        const weekendBoost = [0, 6].includes(date.getDay()) ? Math.floor(Math.random() * 10) : 0; // Weekend boost
        data.push({
            day: `Day ${30 - i}`,
            mentions: Math.max(10, baseValue + variance + seasonalBoost + weekendBoost),
            date: date.toLocaleDateString()
        });
    }
    return data;
}

// Generate realistic 7-day data with more variation
function generateSevenDayData() {
    const data = [];
    const baseValue = 75;
    for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const variance = Math.floor(Math.random() * 30) - 15; // -15 to +15
        const weekendBoost = [0, 6].includes(date.getDay()) ? Math.floor(Math.random() * 20) : 0; // Weekend boost
        const recentBoost = i < 2 ? Math.floor(Math.random() * 10) : 0; // Recent activity boost
        data.push({
            day: `Day ${7 - i}`,
            mentions: Math.max(15, baseValue + variance + weekendBoost + recentBoost),
            date: date.toLocaleDateString()
        });
    }
    return data;
}

let mentionsChart = null;
let currentTimeframe = '7d';
let liveFeedInterval = null;

// Enhanced Setup Wizard Functions
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
        checkEnvStatus(); // Check current environment status
    }
    
    saveToLocalStorage();
}

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
    
    saveToLocalStorage();
}

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
    
    saveToLocalStorage();
}

function skipAPISetup() {
    if (dashboardState.setupWizard.selectedMethod === 'both') {
        showWizardStep('csvSetupStep');
        dashboardState.setupWizard.currentStep = 1;
    } else {
        showWizardStep('brandSetupStep');
        dashboardState.setupWizard.currentStep = 1;
    }
    saveToLocalStorage();
}

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
    initializeLiveFeed();
    showNotification('Setup completed successfully! Your dashboard is ready to use.', 'success');
    
    saveToLocalStorage();
}

// Enhanced API Connection Testing
async function testGSCConnection() {
    const apiKey = document.getElementById('gscApiKey')?.value;
    const statusElement = document.getElementById('gscStatus');
    
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
            await fetchGSCData();
        } else {
            dashboardState.apiStatus.googleSearchConsole = 'error';
            updateConnectionStatus('gscStatus', 'error', 'Invalid API key or permissions');
        }
    } catch (error) {
        dashboardState.apiStatus.googleSearchConsole = 'error';
        updateConnectionStatus('gscStatus', 'error', 'Connection failed');
    }
    
    saveToLocalStorage();
}

async function testGAConnection() {
    const apiKey = document.getElementById('gaApiKey')?.value;
    const statusElement = document.getElementById('gaStatus');
    
    if (!apiKey) {
        updateConnectionStatus('gaStatus', 'error', 'Please enter an API key');
        return;
    }
    
    updateConnectionStatus('gaStatus', 'testing', 'Testing connection...');
    
    try {
        // Store API key
        dashboardState.apiKeys.googleAnalytics = apiKey;
        
        // Simulate API test
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const success = Math.random() > 0.3;
        
        if (success) {
            dashboardState.apiStatus.googleAnalytics = 'connected';
            updateConnectionStatus('gaStatus', 'success', 'Connected successfully');
            
            // Fetch initial data
            await fetchGAData();
        } else {
            dashboardState.apiStatus.googleAnalytics = 'error';
            updateConnectionStatus('gaStatus', 'error', 'Invalid API key or permissions');
        }
    } catch (error) {
        dashboardState.apiStatus.googleAnalytics = 'error';
        updateConnectionStatus('gaStatus', 'error', 'Connection failed');
    }
    
    saveToLocalStorage();
}

async function testSCConnection() {
    const apiKey = document.getElementById('scApiKey')?.value;
    const statusElement = document.getElementById('scStatus');
    
    if (!apiKey) {
        updateConnectionStatus('scStatus', 'error', 'Please enter an API key');
        return;
    }
    
    updateConnectionStatus('scStatus', 'testing', 'Testing connection...');
    
    try {
        // Store API key in session first
        const storeResponse = await fetch('/api/store-api-key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                service: 'scrape_creators',
                api_key: apiKey
            })
        });
        
        if (!storeResponse.ok) {
            throw new Error('Failed to store API key');
        }
        
        // Test real API connection
        const response = await fetch('/api/test-connection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                service: 'scrape_creators',
                api_key: apiKey
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'success') {
            dashboardState.apiStatus.scrapeCreators = 'connected';
            dashboardState.apiKeys.scrapeCreators = apiKey;
            updateConnectionStatus('scStatus', 'success', result.message);
            
            // Initialize live feed
            initializeLiveFeed();
            showNotification('ScrapeCreators API connected successfully!', 'success');
        } else {
            dashboardState.apiStatus.scrapeCreators = 'error';
            updateConnectionStatus('scStatus', 'error', result.message);
            showNotification('ScrapeCreators API connection failed', 'error');
        }
    } catch (error) {
        console.error('ScrapeCreators connection error:', error);
        dashboardState.apiStatus.scrapeCreators = 'error';
        updateConnectionStatus('scStatus', 'error', 'Connection failed: ' + error.message);
        showNotification('ScrapeCreators API connection failed: ' + error.message, 'error');
    }
    
    saveToLocalStorage();
}

async function testExaConnection() {
    const apiKey = document.getElementById('exaApiKey')?.value;
    const statusElement = document.getElementById('exaStatus');
    
    if (!apiKey) {
        updateConnectionStatus('exaStatus', 'error', 'Please enter an API key');
        return;
    }
    
    updateConnectionStatus('exaStatus', 'testing', 'Testing connection...');
    
    try {
        // Store API key in session first
        const storeResponse = await fetch('/api/store-api-key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                service: 'exa_search',
                api_key: apiKey
            })
        });
        
        if (!storeResponse.ok) {
            throw new Error('Failed to store API key');
        }
        
        // Test real API connection
        const response = await fetch('/api/test-connection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                service: 'exa_search',
                api_key: apiKey
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'success') {
            dashboardState.apiStatus.exaSearch = 'connected';
            dashboardState.apiKeys.exaSearch = apiKey;
            updateConnectionStatus('exaStatus', 'success', result.message);
            
            // Initialize live feed
            initializeLiveFeed();
            showNotification('Exa Search API connected successfully!', 'success');
        } else {
            dashboardState.apiStatus.exaSearch = 'error';
            updateConnectionStatus('exaStatus', 'error', result.message);
            showNotification('Exa Search API connection failed', 'error');
        }
    } catch (error) {
        console.error('Exa Search connection error:', error);
        dashboardState.apiStatus.exaSearch = 'error';
        updateConnectionStatus('exaStatus', 'error', 'Connection failed: ' + error.message);
        showNotification('Exa Search API connection failed: ' + error.message, 'error');
    }
    
    saveToLocalStorage();
}

async function testEmailConnection() {
    const apiKey = document.getElementById('emailApiKey')?.value;
    
    if (!apiKey) {
        updateConnectionStatus('emailStatus', 'error', 'Please enter an API key');
        return;
    }
    
    updateConnectionStatus('emailStatus', 'testing', 'Testing email API connection...');
    
    try {
        dashboardState.apiKeys.emailMarketing = apiKey;
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const success = Math.random() > 0.25;
        
        if (success) {
            dashboardState.apiStatus.emailMarketing = 'connected';
            updateConnectionStatus('emailStatus', 'success', 'Email API connected!');
        } else {
            dashboardState.apiStatus.emailMarketing = 'error';
            updateConnectionStatus('emailStatus', 'error', 'Email API connection failed');
        }
    } catch (error) {
        dashboardState.apiStatus.emailMarketing = 'error';
        updateConnectionStatus('emailStatus', 'error', 'Connection error');
    }
    
    saveToLocalStorage();
}

async function testCRMConnection() {
    const apiKey = document.getElementById('crmApiKey')?.value;
    
    if (!apiKey) {
        updateConnectionStatus('crmStatus', 'error', 'Please enter an API key');
        return;
    }
    
    updateConnectionStatus('crmStatus', 'testing', 'Testing CRM/Calendar API...');
    
    try {
        dashboardState.apiKeys.crmCalendar = apiKey;
        await new Promise(resolve => setTimeout(resolve, 1800));
        
        const success = Math.random() > 0.3;
        
        if (success) {
            dashboardState.apiStatus.crmCalendar = 'connected';
            updateConnectionStatus('crmStatus', 'success', 'CRM/Calendar API connected!');
        } else {
            dashboardState.apiStatus.crmCalendar = 'error';
            updateConnectionStatus('crmStatus', 'error', 'CRM API connection failed');
        }
    } catch (error) {
        dashboardState.apiStatus.crmCalendar = 'error';
        updateConnectionStatus('crmStatus', 'error', 'Connection error');
    }
    
    saveToLocalStorage();
}

function updateConnectionStatus(elementId, status, message) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Remove existing status classes
    element.classList.remove('testing', 'success', 'error');
    
    // Add new status class
    element.classList.add(status);
    
    // Update text
    element.textContent = message;
}

// Enhanced Data Fetching Functions
async function fetchGSCData() {
    if (dashboardState.apiStatus.googleSearchConsole !== 'connected') return;
    
    try {
        // Simulate fetching branded search volume data
        const mockData = {
            brandedSearchVolume: Math.floor(Math.random() * 1000) + 2000,
            trend: Math.random() > 0.5 ? 'positive' : 'negative',
            trendValue: Math.floor(Math.random() * 50) + 10
        };
        
        updateSignal('brandedSearch', mockData.brandedSearchVolume);
        updateSignalTrend('brandedSearchTrend', `${mockData.trend === 'positive' ? '+' : '-'}${mockData.trendValue}%`);
        
        showNotification('Branded search volume updated from Google Search Console', 'success');
    } catch (error) {
        console.error('Error fetching GSC data:', error);
        showNotification('Failed to fetch search console data', 'error');
    }
}

async function fetchGAData() {
    if (dashboardState.apiStatus.googleAnalytics !== 'connected') return;
    
    try {
        // Simulate fetching direct traffic data
        const mockData = {
            directTraffic: Math.floor(Math.random() * 800) + 1000,
            trend: Math.random() > 0.5 ? 'positive' : 'negative',
            trendValue: Math.floor(Math.random() * 40) + 5
        };
        
        updateSignal('directTraffic', mockData.directTraffic);
        updateSignalTrend('directTrafficTrend', `${mockData.trend === 'positive' ? '+' : '-'}${mockData.trendValue}%`);
        
        showNotification('Direct traffic data updated from Google Analytics', 'success');
    } catch (error) {
        console.error('Error fetching GA data:', error);
        showNotification('Failed to fetch analytics data', 'error');
    }
}

// CSV Template Generation and Processing
function downloadTemplate(type) {
    const templates = {
        'search-volume': {
            filename: 'branded_search_volume_template.csv',
            headers: ['date', 'search_volume', 'brand_term', 'impressions', 'clicks'],
            sampleData: [
                ['2024-01-01', '2847', 'YourBrand', '15234', '1247'],
                ['2024-01-02', '2956', 'YourBrand', '16123', '1334'],
                ['2024-01-03', '2734', 'YourBrand', '14567', '1198']
            ]
        },
        'direct-traffic': {
            filename: 'direct_traffic_template.csv',
            headers: ['date', 'direct_visits', 'bookmarks', 'type_ins', 'returning_visitors'],
            sampleData: [
                ['2024-01-01', '1234', '456', '778', '892'],
                ['2024-01-02', '1345', '478', '867', '934'],
                ['2024-01-03', '1198', '434', '764', '823']
            ]
        },
        'inbound-messages': {
            filename: 'inbound_messages_template.csv',
            headers: ['date', 'source', 'message_type', 'content_reference', 'sender', 'content'],
            sampleData: [
                ['2024-01-01', 'email', 'inquiry', 'blog_post_123', 'john@example.com', 'Read your post about X, want to learn more'],
                ['2024-01-02', 'contact_form', 'demo_request', 'case_study_456', 'jane@company.com', 'Saw your case study, interested in demo'],
                ['2024-01-03', 'social_dm', 'question', 'video_tutorial_789', '@user123', 'Your tutorial helped me solve this problem']
            ]
        },
        'community-engagement': {
            filename: 'community_engagement_template.csv',
            headers: ['date', 'platform', 'type', 'content', 'replies', 'mentions', 'dm_conversations'],
            sampleData: [
                ['2024-01-01', 'discord', 'mention', 'Someone mentioned YourBrand in #general', '5', '1', '0'],
                ['2024-01-02', 'forum', 'reply', 'Reply to thread about YourBrand', '3', '1', '0'],
                ['2024-01-03', 'slack', 'dm', 'Direct message about YourBrand', '0', '0', '1']
            ]
        },
        'first-party': {
            filename: 'first_party_data_template.csv',
            headers: ['date', 'type', 'source', 'count', 'conversion_value', 'attribution_source'],
            sampleData: [
                ['2024-01-01', 'email_signup', 'newsletter', '23', '0', 'organic_search'],
                ['2024-01-02', 'trial_signup', 'product_page', '12', '99', 'direct'],
                ['2024-01-03', 'calendar_booking', 'contact_form', '8', '500', 'referral']
            ]
        }
    };
    
    const template = templates[type];
    if (!template) {
        showNotification('Template not found', 'error');
        return;
    }
    
    // Create CSV content
    const csvContent = [
        template.headers.join(','),
        ...template.sampleData.map(row => row.join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', template.filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(`Template downloaded: ${template.filename}`, 'success');
}

function handleTemplateUpload(type, input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const csvData = e.target.result;
        processTemplateCSV(type, csvData);
    };
    reader.readAsText(file);
}

function processTemplateCSV(type, csvData) {
    try {
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
            const values = line.split(',');
            const row = {};
            headers.forEach((header, index) => {
                row[header.trim()] = values[index]?.trim() || '';
            });
            return row;
        }).filter(row => Object.values(row).some(val => val !== ''));
        
        // Process data based on type
        switch (type) {
            case 'search-volume':
                updateSearchVolumeData(data);
                break;
            case 'direct-traffic':
                updateDirectTrafficData(data);
                break;
            case 'inbound-messages':
                updateInboundMessagesData(data);
                break;
            case 'community-engagement':
                updateCommunityEngagementData(data);
                break;
            case 'first-party':
                updateFirstPartyData(data);
                break;
        }
        
        showNotification(`${type} data imported successfully (${data.length} records)`, 'success');
        
    } catch (error) {
        console.error('Error processing CSV:', error);
        showNotification('Error processing CSV file. Please check the format.', 'error');
    }
}

function updateSearchVolumeData(data) {
    if (data.length === 0) return;
    
    // Calculate total search volume
    const totalVolume = data.reduce((sum, row) => sum + parseInt(row.search_volume || 0), 0);
    const avgVolume = Math.floor(totalVolume / data.length);
    
    // Update widget
    dashboardState.signals.brandedSearchVolume = avgVolume;
    updateSignal('brandedSearch', avgVolume);
    
    // Calculate trend (compare last 7 days vs previous 7 days if enough data)
    if (data.length >= 14) {
        const recent = data.slice(-7).reduce((sum, row) => sum + parseInt(row.search_volume || 0), 0);
        const previous = data.slice(-14, -7).reduce((sum, row) => sum + parseInt(row.search_volume || 0), 0);
        const trendPercent = Math.round(((recent - previous) / previous) * 100);
        updateSignalTrend('brandedSearchTrend', `${trendPercent >= 0 ? '+' : ''}${trendPercent}%`);
    }
    
    // Update status
    const statusElement = document.getElementById('searchVolumeStatus');
    if (statusElement) {
        statusElement.innerHTML = `<span class="status status--success">✓ ${data.length} records imported</span>`;
    }
}

function updateDirectTrafficData(data) {
    if (data.length === 0) return;
    
    const totalTraffic = data.reduce((sum, row) => sum + parseInt(row.direct_visits || 0), 0);
    const avgTraffic = Math.floor(totalTraffic / data.length);
    
    dashboardState.signals.directTraffic = avgTraffic;
    updateSignal('directTraffic', avgTraffic);
    
    if (data.length >= 14) {
        const recent = data.slice(-7).reduce((sum, row) => sum + parseInt(row.direct_visits || 0), 0);
        const previous = data.slice(-14, -7).reduce((sum, row) => sum + parseInt(row.direct_visits || 0), 0);
        const trendPercent = Math.round(((recent - previous) / previous) * 100);
        updateSignalTrend('directTrafficTrend', `${trendPercent >= 0 ? '+' : ''}${trendPercent}%`);
    }
    
    // Update status
    const statusElement = document.getElementById('directTrafficStatus');
    if (statusElement) {
        statusElement.innerHTML = `<span class="status status--success">✓ ${data.length} records imported</span>`;
    }
}

function updateInboundMessagesData(data) {
    if (data.length === 0) return;
    
    // Process inbound messages referencing content
    data.forEach(row => {
        const message = {
            id: Date.now() + Math.random(),
            platform: row.source || 'email',
            content: row.content || '',
            sentiment: 'positive', // Inbound messages are generally positive intent
            engagement: 1, // Each message counts as 1 engagement
            author: row.sender || 'Unknown',
            timestamp: new Date(row.date || Date.now()),
            source: 'csv_import',
            messageType: row.message_type || 'inquiry',
            contentReference: row.content_reference || ''
        };
        dashboardState.liveFeed.mentions.unshift(message);
    });
    
    // Update inbound messages count
    const totalMessages = data.length;
    dashboardState.signals.inboundMessages += totalMessages;
    updateSignal('inboundMessages', dashboardState.signals.inboundMessages);
    
    // Refresh live feed display
    populateLiveFeed();
    updateFeedStats();
    
    // Update status
    const statusElement = document.getElementById('inboundMessagesStatus');
    if (statusElement) {
        statusElement.innerHTML = `<span class="status status--success">✓ ${data.length} messages imported</span>`;
    }
}

function updateCommunityEngagementData(data) {
    if (data.length === 0) return;
    
    const totalEngagement = data.reduce((sum, row) => {
        return sum + parseInt(row.replies || 0) + parseInt(row.mentions || 0) + parseInt(row.dm_conversations || 0);
    }, 0);
    
    dashboardState.signals.communityEngagement = totalEngagement;
    updateSignal('communityEngagement', totalEngagement);
    
    // Update status
    const statusElement = document.getElementById('communityEngagementStatus');
    if (statusElement) {
        statusElement.innerHTML = `<span class="status status--success">✓ ${data.length} records imported</span>`;
    }
}

function updateFirstPartyData(data) {
    if (data.length === 0) return;
    
    const totalCount = data.reduce((sum, row) => sum + parseInt(row.count || 0), 0);
    
    dashboardState.signals.firstPartyData = totalCount;
    updateSignal('firstPartyData', totalCount);
    
    // Update status
    const statusElement = document.getElementById('firstPartyStatus');
    if (statusElement) {
        statusElement.innerHTML = `<span class="status status--success">✓ ${data.length} records imported</span>`;
    }
}

// Live Feed Management
async function initializeLiveFeed() {
    // Try to load real data first, fallback to sample data
    try {
        await refreshFeedWithRealData();
        console.log('Live feed initialized with real data');
    } catch (error) {
        console.log('Loading sample data for live feed');
        // Generate initial sample mentions as fallback
        dashboardState.liveFeed.mentions = generateSampleMentions();
        
        // Populate the feed
        populateLiveFeed();
        updateFeedStats();
    }
    
    // Start live updates
    startLiveFeedUpdates();
}

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

function getConfidenceBar(confidence) {
    // Create a simple confidence indicator
    if (confidence >= 0.8) return '●●●';
    if (confidence >= 0.6) return '●●○';
    if (confidence >= 0.4) return '●○○';
    return '○○○';
}

function getSentimentTooltip(mention) {
    const sentimentData = mention.sentiment_details || {};
    
    if (!sentimentData.reasoning) {
        return `Sentiment: ${mention.sentiment}`;
    }
    
    let tooltip = `Sentiment: ${mention.sentiment}\n`;
    tooltip += `Confidence: ${Math.round((sentimentData.confidence || 0) * 100)}%\n`;
    tooltip += `Method: ${sentimentData.method || 'basic'}\n`;
    
    if (sentimentData.reasoning) {
        tooltip += `Reasoning: ${sentimentData.reasoning}\n`;
    }
    
    if (sentimentData.emotional_categories && sentimentData.emotional_categories.length > 0) {
        tooltip += `Emotions: ${sentimentData.emotional_categories.join(', ')}\n`;
    }
    
    if (sentimentData.intensity) {
        tooltip += `Intensity: ${sentimentData.intensity}`;
    }
    
    return tooltip;
}

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

function updateFeedStats() {
    const mentions = dashboardState.liveFeed.mentions;
    const total = mentions.length;
    const positive = mentions.filter(m => m.sentiment === 'positive').length;
    const neutral = mentions.filter(m => m.sentiment === 'neutral').length;
    const negative = mentions.filter(m => m.sentiment === 'negative').length;
    
    document.getElementById('totalMentions').textContent = total;
    document.getElementById('positiveMentions').textContent = positive;
    document.getElementById('neutralMentions').textContent = neutral;
    document.getElementById('negativeMentions').textContent = negative;
}

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

function toggleFeed() {
    const button = event.target;
    const statusIndicator = document.getElementById('feedStatus');
    
    if (dashboardState.liveFeed.isActive) {
        dashboardState.liveFeed.isActive = false;
        button.textContent = 'Resume Feed';
        statusIndicator.classList.remove('active');
        stopLiveFeedUpdates();
        showNotification('Live feed paused', 'info');
    } else {
        dashboardState.liveFeed.isActive = true;
        button.textContent = 'Pause Feed';
        statusIndicator.classList.add('active');
        startLiveFeedUpdates();
        showNotification('Live feed resumed', 'success');
    }
    
    saveToLocalStorage();
}

function startLiveFeedUpdates() {
    if (liveFeedInterval) clearInterval(liveFeedInterval);
    
    liveFeedInterval = setInterval(() => {
        if (dashboardState.liveFeed.isActive) {
            updateLiveFeed();
        }
    }, 30000); // Update every 30 seconds
}

function stopLiveFeedUpdates() {
    if (liveFeedInterval) {
        clearInterval(liveFeedInterval);
        liveFeedInterval = null;
    }
}

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
        document.getElementById('lastUpdate').textContent = 'Just now';
        
        saveToLocalStorage();
    }
}

async function fetchFreshData() {
    try {
        showNotification('Fetching fresh data from APIs...', 'info');
        
        const daysBack = currentTimeframe === '7d' ? 7 : 30;
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
            // Update live feed with fresh data
            const mentions = result.data;
            dashboardState.liveFeed.mentions = [];
            
            mentions.forEach(mention => {
                dashboardState.liveFeed.mentions.push({
                    id: mention.id || Date.now() + Math.random(),
                    timestamp: mention.timestamp || new Date().toISOString(),
                    type: mention.platform === 'web' ? 'Web Mention' : 'Social Mention',
                    content: mention.content || mention.title || '',
                    source: mention.source || mention.platform || 'Unknown',
                    platform: mention.platform || 'web',
                    url: mention.url,
                    author: mention.author,
                    sentiment: mention.sentiment || 'neutral',
                    relevance_score: mention.relevance_score || 0.5
                });
            });
            
            populateLiveFeed();
            updateFeedStats();
            
            // Also refresh chart and dashboard data
            await updateChartWithRealData();
            await refreshData();
            
            showNotification(`✅ Fetched ${mentions.length} fresh mentions and saved to cache!`, 'success');
        } else {
            throw new Error(result.message || 'Failed to fetch fresh data');
        }
        
    } catch (error) {
        console.error('Error fetching fresh data:', error);
        showNotification('❌ Failed to fetch fresh data: ' + error.message, 'error');
    }
}

async function checkCacheStatus() {
    try {
        const response = await fetch('/api/cache-status', {
            credentials: 'include'
        });
        const result = await response.json();
        
        if (result.status === 'success') {
            if (result.cached) {
                const ageText = result.file_age_hours < 1 ? 
                    `${Math.round(result.file_age_hours * 60)} minutes` : 
                    `${result.file_age_hours} hours`;
                    
                const statusText = result.is_stale ? '⚠️ STALE' : '✅ FRESH';
                
                showNotification(
                    `📁 Cache: ${result.total_mentions} mentions, ${ageText} old (${result.file_size_kb}KB) ${statusText}`,
                    result.is_stale ? 'warning' : 'success'
                );
            } else {
                showNotification('📁 No cached data available. Click "Fetch Fresh Data" to populate cache.', 'info');
            }
        } else {
            throw new Error(result.message || 'Failed to check cache status');
        }
        
    } catch (error) {
        console.error('Error checking cache status:', error);
        showNotification('❌ Failed to check cache status: ' + error.message, 'error');
    }
}

async function refreshFeed() {
    showNotification('Refreshing feed...', 'info');
    
    try {
        // Try to fetch real data
        await refreshFeedWithRealData();
        
        dashboardState.liveFeed.lastUpdate = new Date();
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = 'Just now';
        }
        
        showNotification('Feed refreshed with real data', 'success');
    } catch (error) {
        console.error('Failed to refresh with real data, using sample data:', error);
        
        // Fallback to adding sample mentions
        const newMentions = generateSampleMentions().slice(0, 3);
        newMentions.forEach(mention => {
            mention.timestamp = new Date();
            dashboardState.liveFeed.mentions.unshift(mention);
        });
        
        populateLiveFeed();
        updateFeedStats();
        
        showNotification('Feed refreshed with sample data', 'info');
    }
    
    saveToLocalStorage();
}

function filterFeed() {
    populateLiveFeed();
}

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
    
    showNotification(`Loaded ${additionalMentions.length} more mentions`, 'success');
    saveToLocalStorage();
}

function exportFeed() {
    const mentions = filterMentions();
    
    if (mentions.length === 0) {
        showNotification('No mentions to export', 'warning');
        return;
    }
    
    const csvContent = [
        'Date,Platform,Content,Sentiment,Engagement,Author,URL',
        ...mentions.map(mention => {
            const date = new Date(mention.timestamp).toISOString().split('T')[0];
            const content = mention.content.replace(/"/g, '""'); // Escape quotes
            return `${date},${mention.platform},"${content}",${mention.sentiment},${mention.engagement},${mention.author},${mention.url}`;
        })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mentions_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(`Exported ${mentions.length} mentions`, 'success');
}

// Enhanced Signal Management
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
    
    saveToLocalStorage();
}

function updateSignalValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = typeof value === 'number' ? value.toLocaleString() : value;
    }
}

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

async function refreshSignalData() {
    try {
        showNotification('Refreshing signal data...', 'info');
        
        const daysBack = currentTimeframe === '7d' ? 7 : 30;
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
            showNotification('✅ Signal data refreshed!', 'success');
        } else {
            throw new Error(result.message || 'Failed to refresh signal data');
        }
        
    } catch (error) {
        console.error('Error refreshing signal data:', error);
        showNotification('❌ Failed to refresh signal data: ' + error.message, 'error');
        showEmptySignalStates();
    }
}

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
    }, currentTimeframe);
    
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
    }, currentTimeframe);
    
    // Update Community Engagement
    updateSignalWidget('communityEngagement', {
        value: metrics.community_engagement || 0,
        source: metrics.community_engagement > 0 ? 'Social APIs (ScrapeCreators)' : 'No data available',
        details: metrics.community_engagement > 0 ? 
            `Social mentions and engagement across platforms` : 
            'Social mentions not found. Check API connections.',
        hasData: metrics.community_engagement > 0,
        apiName: 'Social APIs'
    }, currentTimeframe);
    
    // Update Inbound Messages
    updateSignalWidget('inboundMessages', {
        value: metrics.inbound_messages || 0,
        source: metrics.inbound_messages > 0 ? 'Email/CRM APIs' : 'No data available',
        details: metrics.inbound_messages > 0 ? 
            `Messages referencing your content` : 
            'Connect email or CRM APIs to track inbound messages',
        hasData: metrics.inbound_messages > 0,
        apiName: 'Email/CRM APIs'
    }, currentTimeframe);
    
    // Update First-Party Data
    updateSignalWidget('firstPartyData', {
        value: metrics.first_party_data || 0,
        source: metrics.first_party_data > 0 ? 'Multiple APIs' : 'No data available',
        details: metrics.first_party_data > 0 ? 
            `Email opt-ins, trials, and bookings` : 
            'Connect CRM, email marketing, or calendar APIs',
        hasData: metrics.first_party_data > 0,
        apiName: 'CRM/Email APIs'
    }, currentTimeframe);
    
    // Update Attribution Score
    updateSignalWidget('attributionScore', {
        value: metrics.attribution_score || 0,
        source: 'Calculated',
        details: metrics.attribution_score > 0 ? 
            `Composite score across all attribution signals` : 
            'Score will appear when data is available',
        hasData: metrics.attribution_score > 0,
        apiName: null
    }, currentTimeframe);
    
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
        
        // Add estimated indicator if applicable
        if (data.isEstimated) {
            valueElement.textContent = `~${displayValue}`;
            valueElement.style.fontStyle = 'italic';
            valueElement.title = 'This is an estimated value based on social media data';
        } else {
            valueElement.style.fontStyle = 'normal';
            valueElement.title = '';
        }
    }
    
    if (sourceElement) sourceElement.textContent = data.source;
    if (detailsElement) detailsElement.textContent = data.details;
    if (actionsElement) actionsElement.style.display = data.hasData ? 'none' : 'block';
    
    // Update trend (simplified - show neutral for now)
    if (trendElement) {
        if (data.isEstimated) {
            trendElement.textContent = 'EST';
            trendElement.className = 'trend estimated';
            trendElement.title = 'Estimated value';
        } else {
            trendElement.textContent = data.hasData ? 'NEW' : '--';
            trendElement.className = `trend ${data.hasData ? 'neutral' : 'neutral'}`;
            trendElement.title = '';
        }
    }
    
    // Update timeframe display
    if (timeframeElement && timeframe) {
        timeframeElement.textContent = timeframe === '7d' ? '(7 Days)' : '(30 Days)';
    }
    
    // Update widget class based on data availability and estimation status
    if (widgetElement) {
        widgetElement.classList.toggle('empty-state', !data.hasData);
        widgetElement.classList.toggle('estimated-data', data.isEstimated);
    }
}

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
            details: signal.apiName ? `Connect ${signal.apiName} to get real data` : 'No data to calculate score',
            hasData: false,
            apiName: signal.apiName
        }, currentTimeframe);
    });
}

// Helper functions for connecting APIs
function connectGoogleSearchConsole() {
    showNotification('💡 To connect Google Search Console, set up GA4_PROPERTY_ID in your .env file', 'info');
    navigateToSection('integrations');
}

function connectGA4() {
    showNotification('💡 To connect GA4, set GA4_PROPERTY_ID and credentials in your .env file', 'info');
    navigateToSection('integrations');
}

function connectEmailAPI() {
    showNotification('💡 Connect email marketing APIs (Mailchimp, ConvertKit) in the integrations section', 'info');
    navigateToSection('integrations');
}

function connectCRM() {
    showNotification('💡 Connect CRM/Calendar APIs (HubSpot, Calendly) in the integrations section', 'info');
    navigateToSection('integrations');
}

// Data Persistence Functions
function saveToLocalStorage() {
    try {
        localStorage.setItem('attributionDashboardState', JSON.stringify(dashboardState));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showNotification('Failed to save data locally', 'warning');
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('attributionDashboardState');
        if (saved) {
            const savedState = JSON.parse(saved);
            
            // Merge saved state with default state, handling arrays properly
            Object.keys(savedState).forEach(key => {
                if (dashboardState[key] !== undefined) {
                    // Check if the property should be an array
                    if (Array.isArray(dashboardState[key])) {
                        // For arrays, directly assign if saved data is also an array
                        if (Array.isArray(savedState[key])) {
                            dashboardState[key] = savedState[key];
                        }
                        // If saved data is not an array, keep the default array
                    } else if (dashboardState[key] && typeof dashboardState[key] === 'object') {
                        // For objects, merge properties
                        dashboardState[key] = { ...dashboardState[key], ...savedState[key] };
                    } else {
                        // For primitives, directly assign
                        dashboardState[key] = savedState[key];
                    }
                } else {
                    // If key doesn't exist in default state, add it
                    dashboardState[key] = savedState[key];
                }
            });
            
            // Validate critical array properties to ensure they remain arrays
            const arrayProperties = ['prompts', 'echoes', 'campaigns'];
            let needsReset = false;
            arrayProperties.forEach(prop => {
                if (dashboardState[prop] && !Array.isArray(dashboardState[prop])) {
                    console.warn(`Property ${prop} was corrupted, resetting to default value`);
                    // Reset to the original default values for these properties
                    if (prop === 'prompts') {
                        dashboardState[prop] = [
                            {
                                category: "Survey Questions",
                                title: "How did you hear about us?",
                                content: "We'd love to know how you discovered our company! Was it through a referral, social media, search, or something else? Your answer helps us understand what's working best."
                            },
                            {
                                category: "Email Signatures", 
                                title: "Attribution Request",
                                content: "P.S. If you don't mind sharing, how did you first hear about us? Just reply to this email - it helps us know what's working!"
                            },
                            {
                                category: "Follow-up Messages",
                                title: "Post-Demo Survey",
                                content: "Thanks for the demo! Quick question: what originally brought you to our website? Knowing this helps us serve customers like you better."
                            }
                        ];
                    } else {
                        dashboardState[prop] = [];
                    }
                    needsReset = true;
                }
            });
            
            // Save the corrected state back to localStorage
            if (needsReset) {
                saveToLocalStorage();
                showNotification('Fixed corrupted data - dashboard restored to working state', 'success');
            }
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        showNotification('Failed to load saved data', 'warning');
    }
}

// Auto-save on data changes
function updateDashboardState(section, data) {
    dashboardState[section] = { ...dashboardState[section], ...data };
    saveToLocalStorage();
}

// Navigation Functions
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
    // Hide all sections
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Initialize section-specific functionality
        switch (sectionName) {
            case 'mentions':
                if (!mentionsChart) {
                    initializeMentionsChart().catch(console.error);
                }
                break;
            case 'liveFeedSection':
                if (dashboardState.liveFeed.mentions.length === 0) {
                    initializeLiveFeed();
                }
                break;
            case 'signalsSection':
                updateSignalDisplays();
                refreshSignalData();
                break;
        }
    }
}

// Chart Initialization and Management
async function initializeMentionsChart() {
    const ctx = document.getElementById('mentionsChart');
    const loadingElement = document.getElementById('chartLoading');
    
    if (!ctx) {
        console.error('Chart canvas element not found');
        return;
    }
    
    console.log(`Initializing mentions chart for timeframe: ${currentTimeframe}`);
    
    // Show loading state
    if (loadingElement) {
        loadingElement.style.display = 'flex';
        ctx.style.display = 'none';
    }
    
    try {
        // Try to fetch real data first
        await updateChartWithRealData();
    } catch (error) {
        console.warn('Failed to fetch real data, using mock data:', error);
        // Fallback to mock data
        renderChart();
    }
    
    // Hide loading state
    if (loadingElement) {
        loadingElement.style.display = 'none';
        ctx.style.display = 'block';
    }
    
    console.log('Chart initialization completed');
}

function renderChart() {
    const ctx = document.getElementById('mentionsChart');
    if (!ctx) {
        console.error('Chart canvas element not found in renderChart');
        return;
    }
    
    const chartData = dashboardState.mentionsData[currentTimeframe];
    console.log('Rendering chart with data:', chartData);
    
    if (mentionsChart) {
        console.log('Destroying existing chart');
        mentionsChart.destroy();
    }
    
    // Get CSS variables for theming
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#21808d';
    const surfaceColor = getComputedStyle(document.documentElement).getPropertyValue('--color-surface').trim() || '#ffffff';
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() || '#333333';
    const textSecondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary').trim() || '#666666';
    const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-border').trim() || '#e0e0e0';
    
    mentionsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.map(d => d.date || d.day),
            datasets: [{
                label: 'Mentions',
                data: chartData.map(d => d.mentions),
                borderColor: primaryColor,
                backgroundColor: primaryColor + '20',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: primaryColor,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: primaryColor,
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: surfaceColor,
                    titleColor: textColor,
                    bodyColor: textColor,
                    borderColor: borderColor,
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    callbacks: {
                        title: function(context) {
                            const dataIndex = context[0].dataIndex;
                            const dataPoint = chartData[dataIndex];
                            return dataPoint.date || dataPoint.day;
                        },
                        label: function(context) {
                            return `Mentions: ${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: textSecondaryColor,
                        font: {
                            size: 12
                        },
                        maxTicksLimit: currentTimeframe === '7d' ? 7 : 8,
                        callback: function(value, index) {
                            const dataPoint = chartData[index];
                            if (currentTimeframe === '7d') {
                                return dataPoint ? new Date(dataPoint.date || dataPoint.day).toLocaleDateString('en-US', { weekday: 'short' }) : '';
                            } else {
                                return dataPoint ? new Date(dataPoint.date || dataPoint.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
                            }
                        }
                    }
                },
                y: {
                    display: true,
                    beginAtZero: true,
                    grid: {
                        color: borderColor + '40',
                        drawBorder: false
                    },
                    ticks: {
                        color: textSecondaryColor,
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            hover: {
                animationDuration: 200
            }
        }
    });
    
    updateChartStats();
}

async function updateMentionsChart(timeframe) {
    currentTimeframe = timeframe;
    
    // Update toggle buttons
    document.querySelectorAll('.toggle-group .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`toggle${timeframe}`).classList.add('active');
    
    await initializeMentionsChart();
    
    // Also refresh signal data to update timeframe indicators
    await refreshSignalData();
}

// Welcome Modal Functions
function initializeWelcomeModal() {
    console.log('initializeWelcomeModal called, completed:', dashboardState.setupWizard.completed); // Debug log
    
    if (!dashboardState.setupWizard.completed) {
        const modal = document.getElementById('welcomeModal');
        if (modal) {
            modal.style.display = 'flex';
            console.log('Modal displayed'); // Debug log
        } else {
            console.error('Modal element not found'); // Debug log
        }
    }
}

function closeWelcome() {
    document.getElementById('welcomeModal').style.display = 'none';
    dashboardState.setupWizard.completed = true;
    saveToLocalStorage();
}

// Data Population Functions
function populateInitialData() {
    updateSignalDisplays();
    populateCampaigns();
    populateEchoes();
    populatePrompts();
}

function updateSignalDisplays() {
    const signals = dashboardState.signals;
    updateSignalValue('brandedSearchValue', signals.brandedSearchVolume);
    updateSignalValue('directTrafficValue', signals.directTraffic);
    updateSignalValue('inboundMessagesValue', signals.inboundMessages);
    updateSignalValue('communityEngagementValue', signals.communityEngagement);
    updateSignalValue('firstPartyDataValue', signals.firstPartyData);
    updateSignalValue('attributionScoreValue', signals.attributionScore);
}

function populateCampaigns() {
    const campaignTableBody = document.getElementById('campaignTableBody');
    if (!campaignTableBody) return;
    
    if (!dashboardState.campaigns || dashboardState.campaigns.length === 0) {
        campaignTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">
                    <div class="empty-state">
                        <p>No campaigns tracked yet.</p>
                        <button class="btn btn--primary" onclick="addCampaign()">Add Your First Campaign</button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    campaignTableBody.innerHTML = dashboardState.campaigns.map((campaign, index) => `
        <tr>
            <td>${campaign.name}</td>
            <td class="delta ${campaign.brandedSearchDelta.includes('+') ? 'positive' : 'negative'}">${campaign.brandedSearchDelta}</td>
            <td>${campaign.mentions}</td>
            <td>${campaign.signups}</td>
            <td>
                <span class="buzz-indicator buzz-${campaign.communityBuzz.toLowerCase().replace(' ', '-')}">${campaign.communityBuzz}</span>
            </td>
            <td>${campaign.notes}</td>
            <td>
                <button class="btn btn--outline btn--sm" onclick="editCampaign(${index})">Edit</button>
                <button class="btn btn--outline btn--sm" onclick="deleteCampaign(${index})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function populateEchoes() {
    const echosList = document.getElementById('echosList');
    if (!echosList) return;
    
    if (!dashboardState.echoes || dashboardState.echoes.length === 0) {
        echosList.innerHTML = `
            <div class="empty-state">
                <p>No echoes recorded yet.</p>
                <button class="btn btn--primary" onclick="addEchoEntry()">Add Your First Echo</button>
            </div>
        `;
        return;
    }
    
    echosList.innerHTML = dashboardState.echoes.map((echo, index) => `
        <div class="echo-entry">
            <div class="echo-header">
                <span class="echo-type">${echo.type}</span>
                <span class="echo-timestamp">${echo.timestamp}</span>
                <span class="echo-source">${echo.source}</span>
            </div>
            <div class="echo-content">${echo.content}</div>
            <div class="echo-actions">
                <button class="btn btn--outline btn--sm" onclick="editEcho(${index})">Edit</button>
                <button class="btn btn--outline btn--sm" onclick="deleteEcho(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

function addEchoEntry() {
    // Reset form and show modal
    const form = document.getElementById('echoForm');
    if (form) {
        form.reset();
    }
    
    // Show the modal
    const modal = document.getElementById('addEchoModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function addCampaign() {
    // Check if modal exists, if not create it
    let modal = document.getElementById('addCampaignModal');
    if (!modal) {
        // Create the campaign modal dynamically
        const modalHTML = `
            <div id="addCampaignModal" class="modal">
                <div class="modal-content">
                    <h3>Add Campaign</h3>
                    <form id="campaignForm">
                        <div class="form-group">
                            <label class="form-label">Campaign Name</label>
                            <input type="text" class="form-control" id="campaignName" placeholder="Enter campaign name" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Search Delta</label>
                            <input type="text" class="form-control" id="campaignDelta" placeholder="e.g., +23%" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Mentions</label>
                            <input type="number" class="form-control" id="campaignMentions" placeholder="0" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Sign-ups</label>
                            <input type="number" class="form-control" id="campaignSignups" placeholder="0" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Community Buzz</label>
                            <select class="form-control" id="campaignBuzz" required>
                                <option value="">Select buzz level</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Very High">Very High</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Notes</label>
                            <textarea class="form-control" id="campaignNotes" rows="3" placeholder="Campaign notes..."></textarea>
                        </div>
                        <div class="form-group flex gap-8">
                            <button type="button" class="btn btn--outline" onclick="closeModal('addCampaignModal')">Cancel</button>
                            <button type="submit" class="btn btn--primary">Add Campaign</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Add modal to the page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById('addCampaignModal');
        
        // Add event listener for the form
        const campaignForm = document.getElementById('campaignForm');
        if (campaignForm) {
            campaignForm.addEventListener('submit', handleCampaignFormSubmit);
        }
    }
    
    // Reset form and show modal
    const form = document.getElementById('campaignForm');
    if (form) {
        form.reset();
    }
    
    modal.style.display = 'flex';
}

function handleEchoFormSubmit(event) {
    event.preventDefault();
    
    const type = document.getElementById('echoType').value;
    const content = document.getElementById('echoContent').value.trim();
    const source = document.getElementById('echoSource').value.trim();
    const editIndex = document.getElementById('echoForm').dataset.editIndex;
    
    if (!content) {
        showNotification('Please enter echo content', 'error');
        return;
    }
    
    if (!source) {
        showNotification('Please enter echo source', 'error');
        return;
    }
    
    const echoData = {
        id: editIndex !== undefined ? dashboardState.echoes[editIndex].id : Date.now(),
        timestamp: editIndex !== undefined ? dashboardState.echoes[editIndex].timestamp : new Date().toLocaleString(),
        type: type,
        content: content,
        source: source
    };
    
    if (!dashboardState.echoes) {
        dashboardState.echoes = [];
    }
    
    if (editIndex !== undefined && editIndex !== '') {
        // Update existing echo
        dashboardState.echoes[editIndex] = echoData;
        showNotification('Echo entry updated successfully!', 'success');
        // Clear edit index
        document.getElementById('echoForm').dataset.editIndex = '';
    } else {
        // Add new echo
        dashboardState.echoes.unshift(echoData); // Add to beginning
        showNotification('Echo entry added successfully!', 'success');
    }
    
    saveToLocalStorage();
    populateEchoes();
    closeModal('addEchoModal');
}

function handleCampaignFormSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('campaignName').value.trim();
    const delta = document.getElementById('campaignDelta').value.trim();
    const mentions = parseInt(document.getElementById('campaignMentions').value);
    const signups = parseInt(document.getElementById('campaignSignups').value);
    const buzz = document.getElementById('campaignBuzz').value;
    const notes = document.getElementById('campaignNotes').value.trim();
    const editIndex = document.getElementById('campaignForm').dataset.editIndex;
    
    if (!name || !delta || isNaN(mentions) || isNaN(signups) || !buzz) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const campaignData = {
        name: name,
        brandedSearchDelta: delta,
        mentions: mentions,
        signups: signups,
        communityBuzz: buzz,
        notes: notes || 'No notes'
    };
    
    if (!dashboardState.campaigns) {
        dashboardState.campaigns = [];
    }
    
    if (editIndex !== undefined && editIndex !== '') {
        // Update existing campaign
        dashboardState.campaigns[editIndex] = campaignData;
        showNotification('Campaign updated successfully!', 'success');
        // Clear edit index
        document.getElementById('campaignForm').dataset.editIndex = '';
    } else {
        // Add new campaign
        dashboardState.campaigns.unshift(campaignData); // Add to beginning
        showNotification('Campaign added successfully!', 'success');
    }
    
    saveToLocalStorage();
    populateCampaigns();
    closeModal('addCampaignModal');
}

function editEcho(index) {
    const echo = dashboardState.echoes[index];
    if (!echo) return;
    
    // Populate form with existing data
    document.getElementById('echoType').value = echo.type;
    document.getElementById('echoContent').value = echo.content;
    document.getElementById('echoSource').value = echo.source;
    
    // Store the index for updating
    document.getElementById('echoForm').dataset.editIndex = index;
    
    // Show modal
    const modal = document.getElementById('addEchoModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function deleteEcho(index) {
    if (confirm('Are you sure you want to delete this echo entry?')) {
        dashboardState.echoes.splice(index, 1);
        saveToLocalStorage();
        populateEchoes();
        showNotification('Echo entry deleted', 'info');
    }
}

function editCampaign(index) {
    const campaign = dashboardState.campaigns[index];
    if (!campaign) return;
    
    // Create the modal if it doesn't exist
    if (!document.getElementById('addCampaignModal')) {
        addCampaign(); // This will create the modal
        closeModal('addCampaignModal'); // Close it immediately
    }
    
    // Populate form with existing data
    document.getElementById('campaignName').value = campaign.name;
    document.getElementById('campaignDelta').value = campaign.brandedSearchDelta;
    document.getElementById('campaignMentions').value = campaign.mentions;
    document.getElementById('campaignSignups').value = campaign.signups;
    document.getElementById('campaignBuzz').value = campaign.communityBuzz;
    document.getElementById('campaignNotes').value = campaign.notes;
    
    // Store the index for updating
    document.getElementById('campaignForm').dataset.editIndex = index;
    
    // Show modal
    const modal = document.getElementById('addCampaignModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function deleteCampaign(index) {
    if (confirm('Are you sure you want to delete this campaign?')) {
        dashboardState.campaigns.splice(index, 1);
        saveToLocalStorage();
        populateCampaigns();
        showNotification('Campaign deleted', 'info');
    }
}

function populatePrompts() {
    const promptsList = document.getElementById('promptsList');
    if (!promptsList) return;
    
    // Ensure prompts is always an array
    let prompts = dashboardState.prompts || [];
    if (!Array.isArray(prompts)) {
        console.warn('prompts property is not an array, resetting to default');
        prompts = [
            {
                category: "Survey Questions",
                title: "How did you hear about us?",
                content: "We'd love to know how you discovered our company! Was it through a referral, social media, search, or something else? Your answer helps us understand what's working best."
            },
            {
                category: "Email Signatures", 
                title: "Attribution Request",
                content: "P.S. If you don't mind sharing, how did you first hear about us? Just reply to this email - it helps us know what's working!"
            },
            {
                category: "Follow-up Messages",
                title: "Post-Demo Survey",
                content: "Thanks for the demo! Quick question: what originally brought you to our website? Knowing this helps us serve customers like you better."
            }
        ];
        dashboardState.prompts = prompts;
        saveToLocalStorage();
    }
    
    if (prompts.length === 0) {
        promptsList.innerHTML = `
            <div class="no-prompts">
                <p>No prompts available yet.</p>
                <button class="btn btn--primary" onclick="addCustomPrompt()">Add Your First Prompt</button>
            </div>
        `;
        return;
    }
    
    promptsList.innerHTML = prompts.map(prompt => `
        <div class="prompt-card" data-category="${prompt.category}">
            <div class="prompt-header">
                <div>
                    <h4 class="prompt-title">${prompt.title}</h4>
                    <span class="prompt-category">${prompt.category}</span>
                </div>
                <div class="prompt-actions">
                    <button class="btn btn--outline btn--sm" onclick="copyPrompt('${prompt.title}')">Copy</button>
                    <button class="btn btn--secondary btn--sm" onclick="editPrompt('${prompt.title}')">Edit</button>
                </div>
            </div>
            <div class="prompt-content">${prompt.content}</div>
        </div>
    `).join('');
}

function addCustomPrompt() {
    // Set modal to add mode
    document.getElementById('promptModalTitle').textContent = 'Add Custom Prompt';
    document.getElementById('promptSubmitBtn').textContent = 'Add Prompt';
    document.getElementById('promptEditIndex').value = '';
    
    // Reset form and show modal
    const form = document.getElementById('promptForm');
    if (form) {
        form.reset();
        document.getElementById('customCategoryGroup').style.display = 'none';
        document.getElementById('customCategoryName').required = false;
    }
    
    // Show the modal
    const modal = document.getElementById('addPromptModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function handlePromptFormSubmit(event) {
    event.preventDefault();
    
    const category = document.getElementById('promptCategory').value;
    const customCategory = document.getElementById('customCategoryName').value;
    const title = document.getElementById('promptTitle').value.trim();
    const content = document.getElementById('promptContent').value.trim();
    const editIndex = document.getElementById('promptEditIndex').value;
    
    // Validation
    if (!title) {
        showNotification('Please enter a prompt title', 'error');
        return;
    }
    
    if (!content) {
        showNotification('Please enter prompt content', 'error');
        return;
    }
    
    const finalCategory = category === 'Custom' ? customCategory.trim() : category;
    if (!finalCategory) {
        showNotification('Please enter a category name', 'error');
        return;
    }
    
    const isEditMode = editIndex !== '';
    
    // Check for duplicate titles (skip current prompt when editing)
    const existingPrompt = dashboardState.prompts.find((p, index) => 
        p.title.toLowerCase() === title.toLowerCase() && (!isEditMode || index != editIndex)
    );
    if (existingPrompt) {
        showNotification('A prompt with this title already exists', 'error');
        return;
    }
    
    const promptData = {
        category: finalCategory,
        title: title,
        content: content,
        isCustom: true
    };
    
    if (isEditMode) {
        // Update existing prompt
        const currentPrompt = dashboardState.prompts[editIndex];
        dashboardState.prompts[editIndex] = {
            ...currentPrompt,
            ...promptData,
            updatedAt: new Date().toISOString()
        };
        showNotification('Prompt updated successfully!', 'success');
    } else {
        // Add new prompt
        promptData.createdAt = new Date().toISOString();
        dashboardState.prompts.push(promptData);
        showNotification('Custom prompt added successfully!', 'success');
    }
    
    saveToLocalStorage();
    populatePrompts();
    closeModal('addPromptModal');
}

function handleCategoryChange() {
    const category = document.getElementById('promptCategory').value;
    const customGroup = document.getElementById('customCategoryGroup');
    
    if (category === 'Custom') {
        customGroup.style.display = 'block';
        document.getElementById('customCategoryName').required = true;
    } else {
        customGroup.style.display = 'none';
        document.getElementById('customCategoryName').required = false;
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function downloadWorksheet() {
    const worksheetContent = `# Attribution Tracking Worksheet

## Prompt Library

${dashboardState.prompts.map(prompt => `
### ${prompt.title} (${prompt.category})
${prompt.content}

`).join('')}

## Usage Instructions

1. Choose the appropriate prompt for your situation
2. Customize the language to match your brand voice
3. Track responses and attribution sources
4. Update your dashboard with new data

Generated on: ${new Date().toLocaleDateString()}
`;
    
    const blob = new Blob([worksheetContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attribution-worksheet.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Worksheet downloaded successfully!', 'success');
}

function filterPrompts(category) {
    const promptCards = document.querySelectorAll('.prompt-card');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    // Update active button
    categoryBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    // Filter cards
    promptCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function copyPrompt(title) {
    const prompt = dashboardState.prompts.find(p => p.title === title);
    if (!prompt) return;
    
    navigator.clipboard.writeText(prompt.content).then(() => {
        showNotification('Prompt copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = prompt.content;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Prompt copied to clipboard!', 'success');
    });
}

function editPrompt(title) {
    const promptIndex = dashboardState.prompts.findIndex(p => p.title === title);
    if (promptIndex === -1) return;
    
    const selectedPrompt = dashboardState.prompts[promptIndex];
    
    // Set modal to edit mode
    document.getElementById('promptModalTitle').textContent = 'Edit Custom Prompt';
    document.getElementById('promptSubmitBtn').textContent = 'Update Prompt';
    document.getElementById('promptEditIndex').value = promptIndex;
    
    // Pre-populate form fields
    document.getElementById('promptTitle').value = selectedPrompt.title;
    document.getElementById('promptContent').value = selectedPrompt.content;
    
    // Handle category selection
    const categorySelect = document.getElementById('promptCategory');
    const customCategoryGroup = document.getElementById('customCategoryGroup');
    const customCategoryName = document.getElementById('customCategoryName');
    
    // Check if it's a predefined category
    const predefinedCategories = ['Survey Questions', 'Email Signatures', 'Follow-up Messages', 'Social Media Posts', 'Landing Pages', 'Feedback Forms'];
    
    if (predefinedCategories.includes(selectedPrompt.category)) {
        categorySelect.value = selectedPrompt.category;
        customCategoryGroup.style.display = 'none';
        customCategoryName.required = false;
    } else {
        categorySelect.value = 'Custom';
        customCategoryGroup.style.display = 'block';
        customCategoryName.value = selectedPrompt.category;
        customCategoryName.required = true;
    }
    
    // Show the modal
    const modal = document.getElementById('addPromptModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// API Integrations Functions
function testConnections() {
    showNotification('Testing all API connections...', 'info');
    
    const apiKeys = dashboardState.apiKeys;
    const tests = [];
    
    // Test Google Search Console if key exists
    if (apiKeys.googleSearchConsole) {
        tests.push(testGSCConnection());
    }
    
    // Test Google Analytics if key exists
    if (apiKeys.googleAnalytics) {
        tests.push(testGAConnection());
    }
    
    // Test ScrapeCreators if key exists
    if (apiKeys.scrapeCreators) {
        tests.push(testSCConnection());
    }
    
    // Test Exa Search if key exists
    if (apiKeys.exaSearch) {
        tests.push(testExaConnection());
    }
    
    // Test Email API if key exists
    if (apiKeys.email) {
        tests.push(testEmailConnection());
    }
    
    // Test CRM API if key exists
    if (apiKeys.crm) {
        tests.push(testCRMConnection());
    }
    
    if (tests.length === 0) {
        showNotification('No API keys configured to test. Please add API keys first.', 'warning');
        return;
    }
    
    Promise.allSettled(tests).then(results => {
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        
        if (failed === 0) {
            showNotification(`All ${successful} API connections successful!`, 'success');
        } else {
            showNotification(`${successful} successful, ${failed} failed. Check individual statuses.`, 'warning');
        }
    });
}

function handleSheetsUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    if (!file.name.match(/\.(csv|xlsx)$/)) {
        showNotification('Please upload a CSV or Excel file.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            if (file.name.endsWith('.csv')) {
                parseCSVData(content, file.name);
            } else {
                showNotification('Excel files not yet supported. Please convert to CSV.', 'warning');
            }
        } catch (error) {
            console.error('File parsing error:', error);
            showNotification('Error parsing file. Please check format.', 'error');
        }
    };
    
    reader.readAsText(file);
}

function parseCSVData(csvContent, filename) {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
        showNotification('CSV file must contain at least header and one data row.', 'error');
        return;
    }
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        return row;
    });
    
    // Store uploaded data
    if (!dashboardState.uploadedData) {
        dashboardState.uploadedData = {};
    }
    dashboardState.uploadedData[filename] = {
        headers: headers,
        data: data,
        uploadedAt: new Date().toISOString()
    };
    
    saveToLocalStorage();
    updateSheetsStatus(`Uploaded: ${filename} (${data.length} rows)`);
    showNotification(`Successfully uploaded ${filename} with ${data.length} rows!`, 'success');
}

function updateSheetsStatus(message) {
    const statusElement = document.getElementById('sheetsStatus');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = 'status status--success';
    }
}

function testWebhook() {
    const webhookUrl = document.getElementById('webhookUrl').value;
    const webhookAuth = document.getElementById('webhookAuth').value;
    
    if (!webhookUrl) {
        showNotification('Please enter webhook URL first.', 'warning');
        return;
    }
    
    const statusElement = document.getElementById('webhookStatus');
    if (statusElement) {
        statusElement.textContent = 'Testing...';
        statusElement.className = 'status status--info';
    }
    
    const testPayload = {
        test: true,
        timestamp: new Date().toISOString(),
        message: 'Test webhook from Attribution Dashboard'
    };
    
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (webhookAuth) {
        headers['Authorization'] = webhookAuth.startsWith('Bearer ') ? webhookAuth : `Bearer ${webhookAuth}`;
    }
    
    fetch(webhookUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(testPayload)
    })
    .then(response => {
        if (response.ok) {
            if (statusElement) {
                statusElement.textContent = 'Connected';
                statusElement.className = 'status status--success';
            }
            showNotification('Webhook test successful!', 'success');
            
            // Save webhook configuration
            dashboardState.webhookConfig = {
                url: webhookUrl,
                auth: webhookAuth,
                status: 'connected'
            };
            saveToLocalStorage();
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    })
    .catch(error => {
        console.error('Webhook test failed:', error);
        if (statusElement) {
            statusElement.textContent = 'Connection Failed';
            statusElement.className = 'status status--error';
        }
        showNotification(`Webhook test failed: ${error.message}`, 'error');
    });
}

// Social Monitoring Functions
function downloadScript(type) {
    let scriptContent = '';
    let filename = '';
    
    if (type === 'scrape') {
        filename = 'scrape-creators-setup.py';
        scriptContent = `#!/usr/bin/env python3
"""
ScrapeCreators Integration Setup Script
This script helps you configure ScrapeCreators API for social media monitoring.
"""

import requests
import json
import os
from datetime import datetime

# Configuration
API_KEY = "your_scrape_creators_api_key_here"
BRAND_NAME = "your_brand_name"
PLATFORMS = ["twitter", "reddit", "discord", "linkedin"]

def test_api_connection():
    """Test ScrapeCreators API connection"""
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get('https://api.scrapecreators.com/status', headers=headers)
        if response.status_code == 200:
            print("✅ ScrapeCreators API connection successful")
            return True
        else:
            print(f"❌ API connection failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False

def fetch_brand_mentions():
    """Fetch recent brand mentions"""
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'query': BRAND_NAME,
        'platforms': PLATFORMS,
        'limit': 50,
        'time_range': '7d'
    }
    
    try:
        response = requests.post('https://api.scrapecreators.com/search', 
                               headers=headers, json=payload)
        if response.status_code == 200:
            mentions = response.json()
            print(f"✅ Found {len(mentions.get('results', []))} mentions")
            return mentions
        else:
            print(f"❌ Failed to fetch mentions: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Fetch error: {e}")
        return None

def save_mentions_to_file(mentions):
    """Save mentions to JSON file"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f'brand_mentions_{timestamp}.json'
    
    with open(filename, 'w') as f:
        json.dump(mentions, f, indent=2)
    
    print(f"✅ Mentions saved to {filename}")

if __name__ == "__main__":
    print("ScrapeCreators Setup Script")
    print("=" * 30)
    
    # Test connection
    if test_api_connection():
        # Fetch mentions
        mentions = fetch_brand_mentions()
        if mentions:
            save_mentions_to_file(mentions)
    
    print("Setup complete!")
`;
    } else if (type === 'exa') {
        filename = 'exa-search-setup.py';
        scriptContent = `#!/usr/bin/env python3
"""
Exa Search Integration Setup Script
This script helps you configure Exa Search API for web mention tracking.
"""

import requests
import json
import os
from datetime import datetime, timedelta

# Configuration
API_KEY = "your_exa_api_key_here"
BRAND_NAME = "your_brand_name"
SEARCH_DOMAINS = ["all"]  # or specific domains like ["reddit.com", "twitter.com"]

def test_api_connection():
    """Test Exa Search API connection"""
    headers = {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get('https://api.exa.ai/status', headers=headers)
        if response.status_code == 200:
            print("✅ Exa Search API connection successful")
            return True
        else:
            print(f"❌ API connection failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False

def search_brand_mentions():
    """Search for brand mentions across the web"""
    headers = {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
    }
    
    # Search for various forms of brand mentions
    queries = [
        BRAND_NAME,
        f'"{BRAND_NAME}"',
        f'{BRAND_NAME} review',
        f'{BRAND_NAME} experience'
    ]
    
    all_results = []
    
    for query in queries:
        payload = {
            'query': query,
            'num_results': 20,
            'start_crawl_date': (datetime.now() - timedelta(days=7)).isoformat(),
            'end_crawl_date': datetime.now().isoformat(),
            'include_domains': SEARCH_DOMAINS if SEARCH_DOMAINS != ["all"] else None
        }
        
        try:
            response = requests.post('https://api.exa.ai/search', 
                                   headers=headers, json=payload)
            if response.status_code == 200:
                results = response.json()
                all_results.extend(results.get('results', []))
                print(f"✅ Found {len(results.get('results', []))} results for '{query}'")
            else:
                print(f"❌ Search failed for '{query}': {response.status_code}")
        except Exception as e:
            print(f"❌ Search error for '{query}': {e}")
    
    return all_results

def save_results_to_file(results):
    """Save search results to JSON file"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f'exa_mentions_{timestamp}.json'
    
    with open(filename, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"✅ Results saved to {filename}")

if __name__ == "__main__":
    print("Exa Search Setup Script")
    print("=" * 25)
    
    # Test connection
    if test_api_connection():
        # Search for mentions
        results = search_brand_mentions()
        if results:
            save_results_to_file(results)
            print(f"✅ Total unique mentions found: {len(results)}")
    
    print("Setup complete!")
`;
    } else {
        showNotification('Unknown script type', 'error');
        return;
    }
    
    // Create and download the file
    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`${filename} downloaded successfully!`, 'success');
}

function showInstructions(type) {
    const instructionsContent = document.getElementById('instructionsContent');
    if (!instructionsContent) return;
    
    let instructions = '';
    
    if (type === 'scrape') {
        instructions = `
            <h4>🐦 ScrapeCreators Setup Instructions</h4>
            <ol>
                <li><strong>Get API Key:</strong> Sign up at <a href="https://scrapecreators.com" target="_blank">ScrapeCreators.com</a> and get your API key</li>
                <li><strong>Download Script:</strong> Click "Download Script" above to get the setup script</li>
                <li><strong>Configure:</strong> Edit the script and replace:
                    <ul>
                        <li><code>your_scrape_creators_api_key_here</code> with your actual API key</li>
                        <li><code>your_brand_name</code> with your brand name</li>
                    </ul>
                </li>
                <li><strong>Install Dependencies:</strong> Run <code>pip install requests</code></li>
                <li><strong>Run Script:</strong> Execute <code>python scrape-creators-setup.py</code></li>
                <li><strong>Upload Data:</strong> Use the generated JSON file in the CSV upload section</li>
            </ol>
            
            <h5>What it monitors:</h5>
            <ul>
                <li>🐦 Twitter mentions and hashtags</li>
                <li>📱 Reddit posts and comments</li>
                <li>💬 Discord server discussions</li>
                <li>💼 LinkedIn professional content</li>
            </ul>
            
            <h5>Expected Output:</h5>
            <p>The script will create a JSON file with brand mentions, including sentiment analysis, engagement metrics, and source attribution.</p>
        `;
    } else if (type === 'exa') {
        instructions = `
            <h4>🔎 Exa Search Setup Instructions</h4>
            <ol>
                <li><strong>Get API Key:</strong> Sign up at <a href="https://exa.ai" target="_blank">Exa.ai</a> and get your API key</li>
                <li><strong>Download Script:</strong> Click "Download Script" above to get the setup script</li>
                <li><strong>Configure:</strong> Edit the script and replace:
                    <ul>
                        <li><code>your_exa_api_key_here</code> with your actual API key</li>
                        <li><code>your_brand_name</code> with your brand name</li>
                    </ul>
                </li>
                <li><strong>Install Dependencies:</strong> Run <code>pip install requests</code></li>
                <li><strong>Run Script:</strong> Execute <code>python exa-search-setup.py</code></li>
                <li><strong>Upload Data:</strong> Use the generated JSON file in the CSV upload section</li>
            </ol>
            
            <h5>What it searches:</h5>
            <ul>
                <li>🌐 Entire web for brand mentions</li>
                <li>📝 Blog posts and articles</li>
                <li>📰 News mentions</li>
                <li>🎥 YouTube descriptions and comments</li>
                <li>📚 Documentation and reviews</li>
            </ul>
            
            <h5>Search Strategies:</h5>
            <ul>
                <li>Exact brand name matches</li>
                <li>Brand + "review" combinations</li>
                <li>Brand + "experience" discussions</li>
                <li>Recent content (last 7 days)</li>
            </ul>
            
            <h5>Expected Output:</h5>
            <p>The script will create a JSON file with web mentions, including URLs, content snippets, and metadata for further analysis.</p>
        `;
    } else {
        instructions = '<p>Select a monitoring tool above to view setup instructions.</p>';
    }
    
    instructionsContent.innerHTML = instructions;
}

// Error Handling and Empty States
function setupErrorHandling() {
    // Global error handler for uncaught JavaScript errors
    window.addEventListener('error', function(event) {
        console.error('Uncaught error:', event.error);
        showNotification('An unexpected error occurred. Please try again.', 'error');
    });
    
    // Promise rejection handler
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
        showNotification('A network or processing error occurred. Please check your connection.', 'error');
    });
}

function checkForEmptyStates() {
    // Check and update empty states for various sections
    checkEchoesEmptyState();
    checkCampaignsEmptyState();
    checkMentionsEmptyState();
}

function checkEchoesEmptyState() {
    const echosList = document.getElementById('echosList');
    if (!echosList) return;
    
    const echoes = dashboardState.echoes || [];
    if (echoes.length === 0) {
        echosList.innerHTML = `
            <div class="no-echoes">
                <h4>📝 No Echoes Logged Yet</h4>
                <p>Start tracking manual mentions and observations about your brand's impact.</p>
                <p><strong>What are echoes?</strong> Manual logs of brand mentions, customer feedback, or attribution signals you discover.</p>
                <button class="btn btn--primary" onclick="addEchoEntry()">Add Your First Echo</button>
            </div>
        `;
    }
}

function checkCampaignsEmptyState() {
    const campaignTableBody = document.getElementById('campaignTableBody');
    if (!campaignTableBody) return;
    
    const campaigns = dashboardState.campaigns || [];
    if (campaigns.length === 0) {
        campaignTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-campaigns">
                    <div class="empty-state-content">
                        <h4>🚀 No Campaigns Tracked Yet</h4>
                        <p>Start tracking your marketing campaigns to measure their attribution impact.</p>
                        <button class="btn btn--primary" onclick="addCampaign()">Add Your First Campaign</button>
                    </div>
                </td>
            </tr>
        `;
    }
}

function checkMentionsEmptyState() {
    const mentionsFeed = document.getElementById('mentionsFeed');
    if (!mentionsFeed) return;
    
    // If no mentions are populated, show helpful guidance
    if (mentionsFeed.children.length === 0) {
        mentionsFeed.innerHTML = `
            <div class="no-mentions">
                <h4>📡 No Live Mentions Yet</h4>
                <p>Connect your APIs or upload data to see brand mentions appear here in real-time.</p>
                <div class="next-steps">
                    <h5>Quick Start Options:</h5>
                    <ul>
                        <li>🔗 <a href="#" onclick="showSection('integrations')">Set up API integrations</a> for automatic monitoring</li>
                        <li>📊 <a href="#" onclick="showSection('integrations')">Upload CSV data</a> with existing mentions</li>
                        <li>🐦 <a href="#" onclick="showSection('social')">Download monitoring scripts</a> for social platforms</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });
}

// Enhanced function wrapping for error handling
function safeFunction(fn, errorMessage = 'An error occurred') {
    return function(...args) {
        try {
            return fn.apply(this, args);
        } catch (error) {
            console.error(`Error in ${fn.name}:`, error);
            showNotification(`${errorMessage}: ${error.message}`, 'error');
        }
    };
}

// Event Listeners Setup
function setupEventListeners() {
    // Setup error handling first
    setupErrorHandling();
    
    // Navigation
    initializeNavigation();
    
    // Modal keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('welcomeModal');
            if (modal && modal.style.display === 'flex') {
                closeWelcome();
            }
            
            // Close other modals
            const promptModal = document.getElementById('addPromptModal');
            if (promptModal && promptModal.style.display === 'flex') {
                closeModal('addPromptModal');
            }
            
            const echoModal = document.getElementById('addEchoModal');
            if (echoModal && echoModal.style.display === 'flex') {
                closeModal('addEchoModal');
            }
            
            const campaignModal = document.getElementById('addCampaignModal');
            if (campaignModal && campaignModal.style.display === 'flex') {
                closeModal('addCampaignModal');
            }
        }
    });
    
    // Prompt form event listeners
    const promptForm = document.getElementById('promptForm');
    if (promptForm) {
        promptForm.addEventListener('submit', handlePromptFormSubmit);
    }
    
    // Echo form event listeners
    const echoForm = document.getElementById('echoForm');
    if (echoForm) {
        echoForm.addEventListener('submit', handleEchoFormSubmit);
    }
    
    const promptCategory = document.getElementById('promptCategory');
    if (promptCategory) {
        promptCategory.addEventListener('change', handleCategoryChange);
    }
    
    // Chart timeframe toggles
    document.addEventListener('click', (e) => {
        if (e.target.matches('[onclick*="toggleTimeframe"]')) {
            const timeframe = e.target.textContent.includes('7') ? '7d' : '30d';
            updateMentionsChart(timeframe).catch(console.error);
        }
    });
    
    // Live feed filters
    const filters = ['platformFilter', 'sentimentFilter', 'keywordFilter'];
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', filterFeed);
            if (filterId === 'keywordFilter') {
                element.addEventListener('input', filterFeed);
            }
        }
    });
}

// Utility Functions
async function refreshData() {
    showNotification('Refreshing all data sources...', 'info');
    
    try {
        // Fetch real metrics from backend
        console.log('Fetching dashboard metrics...');
        const daysBack = currentTimeframe === '7d' ? 7 : 30;
        const response = await fetch(`/api/dashboard-metrics?days_back=${daysBack}`, {
            credentials: 'include'
        });
        const result = await response.json();
        
        console.log('Dashboard metrics response:', result);
        
        if (result.status === 'success') {
            const metrics = result.data;
            
            console.log('Received metrics:', metrics);
            
            // Update dashboard signals with real data
            dashboardState.signals.brandedSearchVolume = metrics.branded_search_volume;
            dashboardState.signals.directTraffic = metrics.direct_traffic;
            dashboardState.signals.inboundMessages = metrics.inbound_messages;
            dashboardState.signals.communityEngagement = metrics.community_engagement;
            dashboardState.signals.firstPartyData = metrics.first_party_data;
            dashboardState.signals.attributionScore = metrics.attribution_score;
            
            // Update displays
            updateSignalDisplays();
            
            showNotification(`Data refreshed! Found ${result.metadata.total_mentions} mentions`, 'success');
        } else {
            console.error('Failed to fetch metrics:', result);
            throw new Error(result.message || 'Failed to fetch metrics');
        }
        
        // Check stored API keys for debugging
        try {
            const keysResponse = await fetch('/api/get-stored-keys', {
                credentials: 'include'
            });
            const keysResult = await keysResponse.json();
            console.log('Stored API keys status:', keysResult);
        } catch (error) {
            console.error('Failed to check stored keys:', error);
        }
        
        // Refresh live feed with real data (always try, fallback to sample data if no APIs)
        await refreshFeedWithRealData();
        
    } catch (error) {
        console.error('Error refreshing data:', error);
        showNotification('Failed to refresh data: ' + error.message, 'error');
        
        // Fallback to mock data for demo
        const variance = () => Math.floor(Math.random() * 20) - 10;
        Object.keys(dashboardState.signals).forEach(key => {
            if (key !== 'attributionScore') {
                const currentValue = dashboardState.signals[key];
                const newValue = Math.max(0, currentValue + variance());
                dashboardState.signals[key] = newValue;
            }
        });
        updateSignalDisplays();
        calculateAttributionScore();
    }
    
    // Refresh chart data
    if (mentionsChart) {
        await updateChartWithRealData();
    }
    
    saveToLocalStorage();
}

function updateChartStats() {
    const chartData = dashboardState.mentionsData[currentTimeframe];
    const total = chartData.reduce((sum, point) => sum + point.mentions, 0);
    const avg = Math.round(total / chartData.length);
    const peak = Math.max(...chartData.map(point => point.mentions));
    
    // Update the timeframe period display
    const timeframePeriod = document.getElementById('timeframePeriod');
    if (timeframePeriod) {
        timeframePeriod.textContent = currentTimeframe === '7d' ? '(7 Days)' : '(30 Days)';
    }
    
    document.getElementById('totalMentions').textContent = total;
    document.getElementById('avgDaily').textContent = avg;
    document.getElementById('peakDay').textContent = peak;
}

async function toggleTimeframe(timeframe) {
    await updateMentionsChart(timeframe);
}

// Add a refresh chart function
async function refreshChart() {
    const loadingElement = document.getElementById('chartLoading');
    const ctx = document.getElementById('mentionsChart');
    
    if (loadingElement && ctx) {
        loadingElement.style.display = 'flex';
        ctx.style.display = 'none';
    }
    
    try {
        await updateChartWithRealData();
    } catch (error) {
        console.warn('Refresh failed, using existing data:', error);
        renderChart();
    } finally {
        if (loadingElement && ctx) {
            loadingElement.style.display = 'none';
            ctx.style.display = 'block';
        }
    }
}

function exportChart() {
    const chartData = dashboardState.mentionsData[currentTimeframe];
    const csvContent = [
        'Date,Day,Mentions',
        ...chartData.map(point => `${point.date},${point.day},${point.mentions}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mentions_chart_${currentTimeframe}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(`Chart data exported (${currentTimeframe})`, 'success');
}

function exportData(type) {
    let data, filename;
    
    switch (type) {
        case 'signals':
            data = [
                'Metric,Value,Last Updated',
                `Branded Search Volume,${dashboardState.signals.brandedSearchVolume},${new Date().toISOString()}`,
                `Direct Traffic,${dashboardState.signals.directTraffic},${new Date().toISOString()}`,
                `Inbound Messages,${dashboardState.signals.inboundMessages},${new Date().toISOString()}`,
                `Community Engagement,${dashboardState.signals.communityEngagement},${new Date().toISOString()}`,
                `First-Party Data,${dashboardState.signals.firstPartyData},${new Date().toISOString()}`,
                `Attribution Score,${dashboardState.signals.attributionScore},${new Date().toISOString()}`
            ].join('\n');
            filename = `attribution_signals_${new Date().toISOString().split('T')[0]}.csv`;
            break;
        default:
            showNotification('Export type not supported', 'warning');
            return;
    }
    
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(`${type} data exported`, 'success');
}

async function refreshFeedWithRealData() {
    try {
        const daysBack = currentTimeframe === '7d' ? 7 : 30;
        const response = await fetch(`/api/fetch-mentions?days_back=${daysBack}&platform=all`, {
            credentials: 'include'
        });
        const result = await response.json();
        
        if (result.status === 'success') {
            const mentions = result.data;
            console.log(`API returned ${mentions.length} mentions for live feed`);
            
            // Clear existing mentions
            dashboardState.liveFeed.mentions = [];
            
            // Convert API data to dashboard format
            mentions.forEach(mention => {
                dashboardState.liveFeed.mentions.push({
                    id: mention.id || Date.now() + Math.random(),
                    timestamp: mention.timestamp || new Date().toISOString(),
                    type: mention.platform === 'web' ? 'Web Mention' : 'Social Mention',
                    content: mention.content || mention.title || '',
                    source: mention.source || mention.platform || 'Unknown',
                    platform: mention.platform || 'web',
                    url: mention.url,
                    author: mention.author,
                    sentiment: mention.sentiment || 'neutral',
                    relevance_score: mention.relevance_score || 0.5
                });
            });
            
            // Update feed display
            populateLiveFeed();
            updateFeedStats();
            
            console.log(`Updated live feed with ${mentions.length} real mentions`);
        }
    } catch (error) {
        console.error('Error refreshing live feed:', error);
        // Fallback to generating sample mentions
        generateSampleMentions();
        populateLiveFeed();
    }
}

async function updateChartWithRealData() {
    try {
        const daysBack = currentTimeframe === '7d' ? 7 : 30;
        const response = await fetch(`/api/fetch-mentions?days_back=${daysBack}&platform=all`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'success' && result.data && result.data.length > 0) {
            const mentions = result.data;
            console.log(`Fetched ${mentions.length} mentions for chart`);
            
            // Group mentions by day
            const mentionsByDay = {};
            const today = new Date();
            
            // Initialize all days with 0
            for (let i = daysBack - 1; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
                mentionsByDay[dateStr] = 0;
            }
            
            // Count mentions per day
            mentions.forEach(mention => {
                if (mention.timestamp) {
                    const mentionDate = new Date(mention.timestamp).toISOString().split('T')[0];
                    if (mentionsByDay.hasOwnProperty(mentionDate)) {
                        mentionsByDay[mentionDate]++;
                    }
                }
            });
            
            // Update chart data
            const chartData = Object.entries(mentionsByDay)
                .sort(([a], [b]) => new Date(a) - new Date(b))
                .map(([date, count], index) => ({
                    day: `Day ${index + 1}`,
                    mentions: count,
                    date: new Date(date).toLocaleDateString()
                }));
            
            dashboardState.mentionsData[currentTimeframe] = chartData;
            
            // Also update the other timeframe if we have enough data
            if (daysBack === 30) {
                dashboardState.mentionsData['7d'] = chartData.slice(-7);
            }
            
            // Render chart with real data
            renderChart();
            updateChartStats();
            
            console.log(`Updated chart with real data: ${chartData.length} data points`);
            showNotification(`Chart updated with real mentions data (${chartData.reduce((sum, d) => sum + d.mentions, 0)} total mentions)`, 'success');
            
        } else {
            throw new Error('No mentions data available from API');
        }
    } catch (error) {
        console.warn('Failed to fetch real mentions data:', error);
        // Use mock data as fallback
        renderChart();
        showNotification('Using sample data - connect your APIs for real-time mentions', 'info');
        throw error; // Re-throw to trigger fallback in calling function
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to notifications container or create one
    let container = document.querySelector('.notifications');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notifications';
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Add click to dismiss
    notification.addEventListener('click', () => {
        notification.remove();
    });
}

// Environment Variables Functions
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
        showNotification('Environment template copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy template:', err);
        showNotification('Failed to copy template. Please copy manually.', 'error');
    });
}

async function checkEnvStatus() {
    try {
        const response = await fetch('/api/brand-config', {
            credentials: 'include'
        });
        const result = await response.json();
        
        // Update brand name
        const brandElement = document.getElementById('envBrandName');
        if (brandElement) {
            brandElement.textContent = result.brand_name || 'Not configured';
            brandElement.className = result.brand_name ? 'status-value success' : 'status-value error';
        }
        
        // Update ScrapeCreators status
        const scElement = document.getElementById('envScrapeCreators');
        if (scElement) {
            const isConfigured = result.configured_apis?.scrape_creators;
            scElement.textContent = isConfigured ? '✓ Configured' : '✗ Not configured';
            scElement.className = isConfigured ? 'status-value success' : 'status-value error';
        }
        
        // Update Exa Search status
        const exaElement = document.getElementById('envExaSearch');
        if (exaElement) {
            const isConfigured = result.configured_apis?.exa_search;
            exaElement.textContent = isConfigured ? '✓ Configured' : '✗ Not configured';
            exaElement.className = isConfigured ? 'status-value success' : 'status-value error';
        }
        
        showNotification('Environment status updated', 'info');
    } catch (error) {
        console.error('Error checking environment status:', error);
        showNotification('Failed to check environment status', 'error');
    }
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data
    loadFromLocalStorage();
    
    // Initialize components
    setupEventListeners();
    populateInitialData();
    checkForEmptyStates();
    initializeWelcomeModal();
    
    // Initialize chart if on mentions section
    if (document.getElementById('mentions').classList.contains('active')) {
        initializeMentionsChart().catch(console.error);
    }
    
    // Initialize live feed (always initialize, fallback to sample data if no APIs)
    initializeLiveFeed().catch(console.error);
    
    // Initialize signal data
    refreshSignalData().catch(console.error);
    
    // Show welcome message
    if (dashboardState.setupWizard.completed) {
        showNotification('Welcome back! Your attribution dashboard is ready.', 'success');
    }
    
    // Initialize sentiment configuration check
    checkSentimentConfig();
});

// Sentiment Analysis Testing Functions
async function checkSentimentConfig() {
    const statusElement = document.getElementById('sentimentConfigStatus');
    
    try {
        const response = await fetch('/api/sentiment-config', {
            credentials: 'include'
        });
        const result = await response.json();
        
        let statusHTML = '';
        if (result.openrouter_configured) {
            statusHTML = `
                <div class="status-indicator success"></div>
                <span>🤖 AI Sentiment Analysis (${result.current_model}) - Active</span>
            `;
        } else if (result.openrouter_available && !result.openrouter_api_key_set) {
            statusHTML = `
                <div class="status-indicator warning"></div>
                <span>⚠️ OpenRouter available but API key not configured - Using basic analysis</span>
            `;
        } else {
            statusHTML = `
                <div class="status-indicator error"></div>
                <span>❌ Basic rule-based sentiment analysis only</span>
            `;
        }
        
        if (statusElement) {
            statusElement.innerHTML = statusHTML;
        }
        
    } catch (error) {
        console.error('Error checking sentiment config:', error);
        if (statusElement) {
            statusElement.innerHTML = `
                <div class="status-indicator error"></div>
                <span>❌ Failed to check sentiment configuration</span>
            `;
        }
    }
}

async function testSentimentAnalysis() {
    const textElement = document.getElementById('sentimentTestText');
    const platformElement = document.getElementById('sentimentPlatform');
    const resultsElement = document.getElementById('sentimentResults');
    
    const text = textElement?.value?.trim();
    const platform = platformElement?.value || 'web';
    
    if (!text) {
        showNotification('Please enter some text to analyze', 'warning');
        return;
    }
    
    // Show loading state
    const analyzeButton = document.querySelector('[onclick="testSentimentAnalysis()"]');
    if (analyzeButton) {
        analyzeButton.textContent = 'Analyzing...';
        analyzeButton.disabled = true;
    }
    
    try {
        const response = await fetch('/api/sentiment-analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                text: text,
                platform: platform
            })
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            displaySentimentResults(result.data);
            if (resultsElement) {
                resultsElement.style.display = 'block';
            }
            showNotification('Sentiment analysis completed', 'success');
        } else {
            showNotification('Sentiment analysis failed: ' + result.message, 'error');
        }
        
    } catch (error) {
        console.error('Error testing sentiment analysis:', error);
        showNotification('Failed to analyze sentiment: ' + error.message, 'error');
    } finally {
        // Reset button state
        if (analyzeButton) {
            analyzeButton.textContent = 'Analyze Sentiment';
            analyzeButton.disabled = false;
        }
    }
}

function displaySentimentResults(data) {
    // Update basic results
    const sentimentElement = document.getElementById('resultSentiment');
    const confidenceElement = document.getElementById('resultConfidence');
    const methodElement = document.getElementById('resultMethod');
    const reasoningElement = document.getElementById('resultReasoning');
    const emotionsElement = document.getElementById('resultEmotions');
    const contextElement = document.getElementById('resultContext');
    
    if (sentimentElement) {
        sentimentElement.textContent = data.sentiment || 'unknown';
        sentimentElement.className = `result-value ${data.sentiment}`;
    }
    
    if (confidenceElement) {
        const confidence = data.confidence || 0;
        confidenceElement.textContent = `${Math.round(confidence * 100)}%`;
        confidenceElement.className = `result-value ${confidence > 0.7 ? 'positive' : confidence > 0.4 ? 'neutral' : 'negative'}`;
    }
    
    if (methodElement) {
        const method = data.method || 'unknown';
        const isAI = method.startsWith('openrouter_');
        methodElement.textContent = isAI ? 'AI (OpenRouter)' : method;
        methodElement.className = `result-value ${isAI ? 'positive' : 'neutral'}`;
    }
    
    if (reasoningElement) {
        reasoningElement.textContent = data.reasoning || 'No reasoning provided';
    }
    
    // Handle emotional categories
    const emotionsContainer = document.getElementById('resultEmotionsContainer');
    if (emotionsElement && emotionsContainer) {
        if (data.emotional_categories && data.emotional_categories.length > 0) {
            emotionsElement.textContent = data.emotional_categories.join(', ');
            emotionsContainer.style.display = 'block';
        } else {
            emotionsContainer.style.display = 'none';
        }
    }
    
    // Handle context awareness
    const contextContainer = document.getElementById('resultContextContainer');
    if (contextElement && contextContainer) {
        if (data.context_awareness) {
            contextElement.textContent = data.context_awareness;
            contextContainer.style.display = 'block';
        } else {
            contextContainer.style.display = 'none';
        }
    }
}

function clearSentimentTest() {
    const textElement = document.getElementById('sentimentTestText');
    const resultsElement = document.getElementById('sentimentResults');
    
    if (textElement) {
        textElement.value = '';
    }
    
    if (resultsElement) {
        resultsElement.style.display = 'none';
    }
    
    showNotification('Sentiment test cleared', 'info');
}