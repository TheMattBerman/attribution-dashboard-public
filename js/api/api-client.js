// API Client Module for Dashboard Backend Communication

// Base API client configuration
const API_BASE_URL = '';  // Same origin
const DEFAULT_TIMEOUT = 30000; // 30 seconds

// Generic API client wrapper with error handling
class DashboardAPIClient {
    constructor() {
        this.defaultOptions = {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }

    // Generic GET request
    async get(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            method: 'GET',
            ...this.defaultOptions,
            ...options
        };

        return this.makeRequest(url, config);
    }

    // Generic POST request
    async post(endpoint, data = null, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            method: 'POST',
            ...this.defaultOptions,
            ...options,
            body: data ? JSON.stringify(data) : null
        };

        return this.makeRequest(url, config);
    }

    // Generic PUT request
    async put(endpoint, data = null, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            method: 'PUT',
            ...this.defaultOptions,
            ...options,
            body: data ? JSON.stringify(data) : null
        };

        return this.makeRequest(url, config);
    }

    // Generic DELETE request
    async delete(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            method: 'DELETE',
            ...this.defaultOptions,
            ...options
        };

        return this.makeRequest(url, config);
    }

    // Make HTTP request with timeout and error handling
    async makeRequest(url, config) {
        try {
            // Add timeout to request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
            
            config.signal = controller.signal;

            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            // Check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Try to parse JSON response
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out');
            }
            throw error;
        }
    }

    // Test API connection
    async testConnection() {
        try {
            const response = await this.get('/api/health');
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Fetch dashboard metrics
    async getDashboardMetrics(daysBack = 7) {
        try {
            const response = await this.get(`/api/dashboard-metrics?days_back=${daysBack}`);
            return { success: true, data: response };
        } catch (error) {
            console.error('Error fetching dashboard metrics:', error);
            return { success: false, error: error.message };
        }
    }

    // Fetch mentions
    async getMentions(daysBack = 7, platform = 'all') {
        try {
            const response = await this.get(`/api/fetch-mentions?days_back=${daysBack}&platform=${platform}`);
            return { success: true, data: response };
        } catch (error) {
            console.error('Error fetching mentions:', error);
            return { success: false, error: error.message };
        }
    }

    // Refresh mentions from external APIs
    async refreshMentions(daysBack = 7) {
        try {
            const response = await this.post('/api/refresh-mentions', { days_back: daysBack });
            return { success: true, data: response };
        } catch (error) {
            console.error('Error refreshing mentions:', error);
            return { success: false, error: error.message };
        }
    }

    // Save brand configuration
    async saveBrandConfig(brandData) {
        try {
            const response = await this.post('/api/brand-config', brandData);
            return { success: true, data: response };
        } catch (error) {
            console.error('Error saving brand config:', error);
            return { success: false, error: error.message };
        }
    }

    // Test sentiment analysis
    async testSentiment(text) {
        try {
            const response = await this.post('/api/test-sentiment', { text });
            return { success: true, data: response };
        } catch (error) {
            console.error('Error testing sentiment:', error);
            return { success: false, error: error.message };
        }
    }

    // Test webhook
    async testWebhook(webhookUrl, testData = {}) {
        try {
            const response = await this.post('/api/test-webhook', { 
                webhook_url: webhookUrl,
                test_data: testData
            });
            return { success: true, data: response };
        } catch (error) {
            console.error('Error testing webhook:', error);
            return { success: false, error: error.message };
        }
    }
}

// Create global API client instance
const apiClient = new DashboardAPIClient();

// Export API client and convenience functions
window.apiClient = apiClient;

// Convenience functions for common API operations
window.testAPIConnection = async function() {
    const result = await apiClient.testConnection();
    if (result.success) {
        if (typeof showNotification === 'function') {
            showNotification('✅ API connection successful', 'success');
        }
    } else {
        if (typeof showNotification === 'function') {
            showNotification(`❌ API connection failed: ${result.error}`, 'error');
        }
    }
    return result;
};

window.fetchDashboardMetrics = async function(daysBack = 7) {
    const result = await apiClient.getDashboardMetrics(daysBack);
    if (result.success && result.data.status === 'success') {
        return result.data.data;
    } else {
        console.error('Failed to fetch dashboard metrics:', result.error || result.data?.message);
        return null;
    }
};

window.fetchMentionsData = async function(daysBack = 7, platform = 'all') {
    const result = await apiClient.getMentions(daysBack, platform);
    if (result.success && result.data.status === 'success') {
        return result.data.data;
    } else {
        console.error('Failed to fetch mentions:', result.error || result.data?.message);
        return [];
    }
};

window.refreshMentionsData = async function(daysBack = 7) {
    const result = await apiClient.refreshMentions(daysBack);
    if (result.success) {
        if (typeof showNotification === 'function') {
            showNotification('✅ Mentions refreshed successfully', 'success');
        }
        return result.data;
    } else {
        if (typeof showNotification === 'function') {
            showNotification(`❌ Failed to refresh mentions: ${result.error}`, 'error');
        }
        return null;
    }
};

window.saveBrandConfiguration = async function(brandData) {
    const result = await apiClient.saveBrandConfig(brandData);
    if (result.success) {
        if (typeof showNotification === 'function') {
            showNotification('✅ Brand configuration saved', 'success');
        }
        return result.data;
    } else {
        if (typeof showNotification === 'function') {
            showNotification(`❌ Failed to save brand config: ${result.error}`, 'error');
        }
        return null;
    }
};

window.testSentimentAnalysis = async function(text) {
    const result = await apiClient.testSentiment(text);
    if (result.success) {
        return result.data;
    } else {
        console.error('Failed to test sentiment:', result.error);
        return null;
    }
};

window.testWebhookEndpoint = async function(webhookUrl, testData = {}) {
    const result = await apiClient.testWebhook(webhookUrl, testData);
    if (result.success) {
        if (typeof showNotification === 'function') {
            showNotification('✅ Webhook test successful', 'success');
        }
        return result.data;
    } else {
        if (typeof showNotification === 'function') {
            showNotification(`❌ Webhook test failed: ${result.error}`, 'error');
        }
        return null;
    }
};