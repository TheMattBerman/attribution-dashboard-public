// Local Storage Management Module

// Save dashboard state to localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('attributionDashboardState', JSON.stringify(dashboardState));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        if (typeof showNotification === 'function') {
            showNotification('Failed to save data locally', 'warning');
        }
    }
}

// Load dashboard state from localStorage
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
                if (typeof showNotification === 'function') {
                    showNotification('Fixed corrupted data - dashboard restored to working state', 'success');
                }
            }
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        if (typeof showNotification === 'function') {
            showNotification('Failed to load saved data', 'warning');
        }
    }
}

// Clear all stored data
function clearLocalStorage() {
    try {
        localStorage.removeItem('attributionDashboardState');
        if (typeof showNotification === 'function') {
            showNotification('Local data cleared successfully', 'success');
        }
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        if (typeof showNotification === 'function') {
            showNotification('Failed to clear local data', 'warning');
        }
    }
}

// Export specific sections of data
function exportStoredData(section = null) {
    try {
        const stored = localStorage.getItem('attributionDashboardState');
        if (!stored) return null;
        
        const data = JSON.parse(stored);
        return section ? data[section] : data;
    } catch (error) {
        console.error('Error exporting stored data:', error);
        return null;
    }
}

// Import data to specific section
function importToStorage(section, data) {
    try {
        const currentState = exportStoredData() || {};
        currentState[section] = data;
        localStorage.setItem('attributionDashboardState', JSON.stringify(currentState));
        
        // Update dashboard state if available
        if (typeof dashboardState !== 'undefined') {
            dashboardState[section] = data;
        }
        
        if (typeof showNotification === 'function') {
            showNotification(`${section} data imported successfully`, 'success');
        }
    } catch (error) {
        console.error('Error importing data to storage:', error);
        if (typeof showNotification === 'function') {
            showNotification(`Failed to import ${section} data`, 'warning');
        }
    }
}

// Get storage usage info
function getStorageInfo() {
    try {
        const stored = localStorage.getItem('attributionDashboardState');
        const size = stored ? new Blob([stored]).size : 0;
        const sizeKB = (size / 1024).toFixed(2);
        
        return {
            size: size,
            sizeKB: sizeKB,
            itemCount: stored ? Object.keys(JSON.parse(stored)).length : 0,
            lastSaved: stored ? new Date().toISOString() : null
        };
    } catch (error) {
        console.error('Error getting storage info:', error);
        return null;
    }
}

// Export functions for global access
window.saveToLocalStorage = saveToLocalStorage;
window.loadFromLocalStorage = loadFromLocalStorage;
window.clearLocalStorage = clearLocalStorage;
window.exportStoredData = exportStoredData;
window.importToStorage = importToStorage;
window.getStorageInfo = getStorageInfo;