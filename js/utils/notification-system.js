// Notification System Module

// Helper function to create notification elements programmatically (secure)
function createNotificationElement(message, type, options = {}) {
    // Create main notification container
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Create content container
    const content = document.createElement('div');
    content.className = 'notification-content';
    
    // Create icon element
    const icon = document.createElement('span');
    icon.className = 'notification-icon';
    icon.textContent = getNotificationIcon(type);
    
    // Create message element - use textContent for security
    const messageEl = document.createElement('span');
    messageEl.className = 'notification-message';
    
    // Handle loading spinner case
    if (options.hasSpinner) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        messageEl.appendChild(spinner);
        messageEl.appendChild(document.createTextNode(' ' + message));
    } else {
        messageEl.textContent = message;
    }
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.textContent = '×';
    closeBtn.onclick = function() {
        closeNotification(this);
    };
    
    // Assemble the notification
    content.appendChild(icon);
    content.appendChild(messageEl);
    
    // Add action button if specified
    if (options.actionText && options.actionCallback) {
        const actionBtn = document.createElement('button');
        actionBtn.className = 'notification-action-btn';
        actionBtn.textContent = options.actionText;
        actionBtn.onclick = options.actionCallback;
        content.appendChild(actionBtn);
    }
    
    // Add confirmation buttons if specified
    if (options.isConfirmation) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'notification-actions';
        
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'notification-btn notification-confirm';
        confirmBtn.textContent = 'Confirm';
        confirmBtn.onclick = options.onConfirm;
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'notification-btn notification-cancel';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = options.onCancel;
        
        actionsDiv.appendChild(confirmBtn);
        actionsDiv.appendChild(cancelBtn);
        content.appendChild(actionsDiv);
    }
    
    // Add progress bar if specified
    if (options.hasProgress) {
        const progressBar = document.createElement('div');
        progressBar.className = 'notification-progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'notification-progress-fill';
        progressFill.style.width = `${options.progress || 0}%`;
        
        const progressText = document.createElement('span');
        progressText.className = 'notification-progress-text';
        progressText.textContent = `${options.progress || 0}%`;
        
        progressBar.appendChild(progressFill);
        content.appendChild(progressBar);
        content.appendChild(progressText);
    }
    
    content.appendChild(closeBtn);
    notification.appendChild(content);
    
    // Add additional classes if specified
    if (options.additionalClasses) {
        options.additionalClasses.forEach(cls => {
            notification.classList.add(cls);
        });
    }
    
    return notification;
}

// Show notification toast
function showNotification(message, type = 'info') {
    // Create notification element securely
    const notification = createNotificationElement(message, type);
    
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
    // Create notification element with spinner using secure method
    const notification = createNotificationElement(message, 'info', { hasSpinner: true });
    
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
    
    // Auto-remove after duration
    const duration = getNotificationDuration('info');
    if (duration > 0) {
        setTimeout(() => {
            closeNotification(notification);
        }, duration);
    }
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
    const notification = createNotificationElement(message, type, { 
        additionalClasses: ['notification-persistent'] 
    });
    
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
    const notification = createNotificationElement(message, type, {
        actionText: actionText,
        actionCallback: actionCallback,
        additionalClasses: ['notification-action']
    });
    
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
    const notification = createNotificationElement(message, 'confirmation', {
        isConfirmation: true,
        onConfirm: () => {
            closeNotification(notification);
            if (onConfirm) onConfirm();
        },
        onCancel: () => {
            closeNotification(notification);
            if (onCancel) onCancel();
        }
    });
    
    // Override the icon for confirmation
    const icon = notification.querySelector('.notification-icon');
    icon.textContent = '❓';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    return notification;
}

// Progress notification for long-running tasks
function showProgressNotification(message, progress = 0) {
    let notification = document.querySelector('.notification-progress');
    
    if (!notification) {
        notification = createNotificationElement(message, 'progress', {
            hasProgress: true,
            progress: progress,
            additionalClasses: ['notification-progress']
        });
        
        // Override the icon for progress
        const icon = notification.querySelector('.notification-icon');
        icon.textContent = '⏳';
        
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