// Dashboard State Management Module

// Generate realistic data functions
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

function generateSevenDayData() {
    const data = [];
    const baseValue = 45;
    for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const variance = Math.floor(Math.random() * 30) - 15; // -15 to +15
        const weekendBoost = [0, 6].includes(date.getDay()) ? Math.floor(Math.random() * 8) : 0; // Weekend boost
        data.push({
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            mentions: Math.max(5, baseValue + variance + weekendBoost),
            date: date.toLocaleDateString()
        });
    }
    return data;
}

// Default prompts data
const defaultPrompts = [
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
        content: "Quick poll: How do you typically discover new {product_category} tools? 🧵\\nA) Google search\\nB) Friend/colleague rec\\nC) Social media\\nD) Industry content\\n\\nAlways fascinated by the customer journey! #SaaS #CustomerJourney #Attribution"
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
];

// Main dashboard state object
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
        googleAnalyticsGA4: '',
        scrapeCreators: '',
        exaSearch: '',
        emailMarketing: '',
        crmCalendar: ''
    },
    apiStatus: {
        googleSearchConsole: 'disconnected',
        googleAnalytics: 'disconnected',
        googleAnalyticsGA4: 'disconnected',
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
    prompts: defaultPrompts,
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

// Auto-save on data changes
function updateDashboardState(section, data) {
    dashboardState[section] = { ...dashboardState[section], ...data };
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
    }
}

// Export for module usage
window.dashboardState = dashboardState;
window.updateDashboardState = updateDashboardState;
window.generateSevenDayData = generateSevenDayData;
window.generateThirtyDayData = generateThirtyDayData;