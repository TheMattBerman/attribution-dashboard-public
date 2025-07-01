// Notification System Module

// Show notification toast
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="closeNotification(this)">&times;</button>
        </div>
    `;
    
    // Position notification (stack multiple notifications)
    const existingNotifications = document.querySelectorAll('.notification');
    const topOffset = 20 + (existingNotifications.length * 80);
    notification.style.top = `${topOffset}px`;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-remove after duration based on type
    const duration = getNotificationDuration(type);
    if (duration > 0) {
        setTimeout(() => {
            closeNotification(notification);
        }, duration);
    }
}

// Get icon for notification type
function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

// Get duration for notification type
function getNotificationDuration(type) {
    const durations = {
        success: 3000,   // 3 seconds
        error: 5000,     // 5 seconds
        warning: 4000,   // 4 seconds
        info: 3000       // 3 seconds
    };
    return durations[type] || durations.info;
}

// Close notification
function closeNotification(element) {
    const notification = element.classList ? element : element.closest('.notification');
    if (notification) {
        notification.classList.remove('show');
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
                // Reposition remaining notifications
                repositionNotifications();
            }
        }, 300);
    }
}

// Reposition notifications after one is removed
function repositionNotifications() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach((notification, index) => {
        const topOffset = 20 + (index * 80);
        notification.style.top = `${topOffset}px`;
    });
}

// Show loading notification
function showLoadingNotification(message) {
    showNotification(`<div class="loading-spinner"></div> ${message}`, 'info');
}

// Show success notification with custom duration
function showSuccessNotification(message, duration = 3000) {
    showNotification(message, 'success');
    if (duration !== 3000) {
        setTimeout(() => {
            const notification = document.querySelector('.notification-success');
            if (notification) {
                closeNotification(notification);
            }
        }, duration);
    }
}

// Show error notification with custom duration
function showErrorNotification(message, duration = 5000) {
    showNotification(message, 'error');
    if (duration !== 5000) {
        setTimeout(() => {
            const notification = document.querySelector('.notification-error');
            if (notification) {
                closeNotification(notification);
            }
        }, duration);
    }
}

// Show warning notification
function showWarningNotification(message, duration = 4000) {
    showNotification(message, 'warning');
    if (duration !== 4000) {
        setTimeout(() => {
            const notification = document.querySelector('.notification-warning');
            if (notification) {
                closeNotification(notification);
            }
        }, duration);
    }
}

// Show info notification
function showInfoNotification(message, duration = 3000) {
    showNotification(message, 'info');
    if (duration !== 3000) {
        setTimeout(() => {
            const notification = document.querySelector('.notification-info');
            if (notification) {
                closeNotification(notification);
            }
        }, duration);
    }
}

// Show persistent notification (doesn't auto-close)
function showPersistentNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} notification-persistent`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="closeNotification(this)">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    return notification;
}

// Clear all notifications
function clearAllNotifications() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => {
        closeNotification(notification);
    });
}

// Show notification with action button
function showActionNotification(message, actionText, actionCallback, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} notification-action`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-action-btn" onclick="${actionCallback}">${actionText}</button>
            <button class="notification-close" onclick="closeNotification(this)">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-remove after longer duration for action notifications
    setTimeout(() => {
        closeNotification(notification);
    }, 8000);
    
    return notification;
}

// Show confirmation notification
function showConfirmationNotification(message, onConfirm, onCancel = null) {
    const notification = document.createElement('div');
    notification.className = 'notification notification-confirmation';
    
    const confirmId = 'confirm_' + Date.now();
    const cancelId = 'cancel_' + Date.now();
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">❓</span>
            <span class="notification-message">${message}</span>
            <div class="notification-actions">
                <button class="notification-btn notification-confirm" id="${confirmId}">Confirm</button>
                <button class="notification-btn notification-cancel" id="${cancelId}">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add event listeners
    document.getElementById(confirmId).onclick = () => {
        closeNotification(notification);
        if (onConfirm) onConfirm();
    };
    
    document.getElementById(cancelId).onclick = () => {
        closeNotification(notification);
        if (onCancel) onCancel();
    };
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    return notification;
}

// Progress notification for long-running tasks
function showProgressNotification(message, progress = 0) {
    let notification = document.querySelector('.notification-progress');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification notification-progress';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">⏳</span>
                <span class="notification-message">${message}</span>
                <div class="notification-progress-bar">
                    <div class="notification-progress-fill" style="width: ${progress}%"></div>
                </div>
                <span class="notification-progress-text">${progress}%</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
    } else {
        // Update existing progress notification
        const messageEl = notification.querySelector('.notification-message');
        const progressFill = notification.querySelector('.notification-progress-fill');
        const progressText = notification.querySelector('.notification-progress-text');
        
        if (messageEl) messageEl.textContent = message;
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${progress}%`;
    }
    
    // Auto-close when progress reaches 100%
    if (progress >= 100) {
        setTimeout(() => {
            closeNotification(notification);
        }, 1500);
    }
    
    return notification;
}

// Initialize notification system CSS if not already present
function initializeNotificationSystem() {
    // Check if notification styles are already loaded
    if (document.querySelector('#notification-styles')) {
        return;
    }
    
    // Minimal fallback styles - main styles are in style.css
    const styles = `
        <style id="notification-styles">
        /* Fallback notification styles for when main CSS isn't loaded */
        .notification:not([style]) {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            min-width: 300px !important;
            max-width: 500px !important;
            background: white !important;
            color: #1a1a1a !important;
            border: 1px solid #e0e0e0 !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
            z-index: 10000 !important;
            padding: 0 !important;
        }
        
        .notification-content {
            padding: 15px !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
        }
        
        .notification-icon {
            font-size: 18px !important;
            flex-shrink: 0 !important;
        }
        
        .notification-message {
            flex-grow: 1 !important;
            font-size: 14px !important;
            line-height: 1.4 !important;
            font-weight: 500 !important;
        }
        
        .notification-close {
            background: none !important;
            border: none !important;
            font-size: 18px !important;
            cursor: pointer !important;
            padding: 4px !important;
            width: 24px !important;
            height: 24px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: #666 !important;
            border-radius: 4px !important;
        }
        
        .loading-spinner {
            display: inline-block !important;
            width: 16px !important;
            height: 16px !important;
            border: 2px solid #f3f3f3 !important;
            border-top: 2px solid #007bff !important;
            border-radius: 50% !important;
            animation: spin 1s linear infinite !important;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// Auto-initialize when module loads
if (typeof document !== 'undefined') {
    initializeNotificationSystem();
}

// Export functions for global access
window.showNotification = showNotification;
window.closeNotification = closeNotification;
window.showLoadingNotification = showLoadingNotification;
window.showSuccessNotification = showSuccessNotification;
window.showErrorNotification = showErrorNotification;
window.showWarningNotification = showWarningNotification;
window.showInfoNotification = showInfoNotification;
window.showPersistentNotification = showPersistentNotification;
window.clearAllNotifications = clearAllNotifications;
window.showActionNotification = showActionNotification;
window.showConfirmationNotification = showConfirmationNotification;
window.showProgressNotification = showProgressNotification;
window.initializeNotificationSystem = initializeNotificationSystem;