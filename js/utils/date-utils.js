// Date Utilities Module

// Format date to readable string
function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    
    const formatOptions = { ...defaultOptions, ...options };
    
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    if (!(date instanceof Date) || isNaN(date)) {
        return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-US', formatOptions);
}

// Format time to readable string
function formatTime(date, options = {}) {
    const defaultOptions = {
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const formatOptions = { ...defaultOptions, ...options };
    
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    if (!(date instanceof Date) || isNaN(date)) {
        return 'Invalid Time';
    }
    
    return date.toLocaleTimeString('en-US', formatOptions);
}

// Format date and time together
function formatDateTime(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const formatOptions = { ...defaultOptions, ...options };
    
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    if (!(date instanceof Date) || isNaN(date)) {
        return 'Invalid DateTime';
    }
    
    return date.toLocaleString('en-US', formatOptions);
}

// Get time ago string (e.g., "2 hours ago")
function getTimeAgo(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    if (!(date instanceof Date) || isNaN(date)) {
        return 'Invalid Date';
    }
    
    const now = new Date();
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffSeconds < 60) {
        return diffSeconds <= 1 ? 'Just now' : `${diffSeconds} seconds ago`;
    } else if (diffMinutes < 60) {
        return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
        return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays < 7) {
        return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    } else if (diffWeeks < 4) {
        return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`;
    } else if (diffMonths < 12) {
        return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
    } else {
        return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
    }
}

// Get date range for specific periods
function getDateRange(period) {
    const now = new Date();
    const end = new Date(now);
    let start = new Date(now);
    
    switch (period) {
        case '1d':
        case 'today':
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case '7d':
        case 'week':
            start.setDate(now.getDate() - 6);
            start.setHours(0, 0, 0, 0);
            break;
        case '30d':
        case 'month':
            start.setDate(now.getDate() - 29);
            start.setHours(0, 0, 0, 0);
            break;
        case '90d':
        case 'quarter':
            start.setDate(now.getDate() - 89);
            start.setHours(0, 0, 0, 0);
            break;
        case '365d':
        case 'year':
            start.setDate(now.getDate() - 364);
            start.setHours(0, 0, 0, 0);
            break;
        default:
            // Default to 7 days
            start.setDate(now.getDate() - 6);
            start.setHours(0, 0, 0, 0);
    }
    
    return { start, end };
}

// Check if date is within range
function isDateInRange(date, start, end) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    if (typeof start === 'string') {
        start = new Date(start);
    }
    if (typeof end === 'string') {
        end = new Date(end);
    }
    
    return date >= start && date <= end;
}

// Get days between two dates
function getDaysBetween(date1, date2) {
    if (typeof date1 === 'string') {
        date1 = new Date(date1);
    }
    if (typeof date2 === 'string') {
        date2 = new Date(date2);
    }
    
    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Get start of day/week/month/year
function getStartOf(date, unit) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    const result = new Date(date);
    
    switch (unit) {
        case 'day':
            result.setHours(0, 0, 0, 0);
            break;
        case 'week':
            const day = result.getDay();
            const diff = result.getDate() - day;
            result.setDate(diff);
            result.setHours(0, 0, 0, 0);
            break;
        case 'month':
            result.setDate(1);
            result.setHours(0, 0, 0, 0);
            break;
        case 'year':
            result.setMonth(0, 1);
            result.setHours(0, 0, 0, 0);
            break;
    }
    
    return result;
}

// Get end of day/week/month/year
function getEndOf(date, unit) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    const result = new Date(date);
    
    switch (unit) {
        case 'day':
            result.setHours(23, 59, 59, 999);
            break;
        case 'week':
            const day = result.getDay();
            const diff = 6 - day;
            result.setDate(result.getDate() + diff);
            result.setHours(23, 59, 59, 999);
            break;
        case 'month':
            result.setMonth(result.getMonth() + 1, 0);
            result.setHours(23, 59, 59, 999);
            break;
        case 'year':
            result.setMonth(11, 31);
            result.setHours(23, 59, 59, 999);
            break;
    }
    
    return result;
}

// Check if date is today
function isToday(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

// Check if date is yesterday
function isYesterday(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
}

// Check if date is this week
function isThisWeek(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    const now = new Date();
    const weekStart = getStartOf(now, 'week');
    const weekEnd = getEndOf(now, 'week');
    
    return date >= weekStart && date <= weekEnd;
}

// Check if date is this month
function isThisMonth(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

// Generate date series for charts
function generateDateSeries(start, end, interval = 'day') {
    const dates = [];
    let current = new Date(start);
    const endDate = new Date(end);
    
    while (current <= endDate) {
        dates.push(new Date(current));
        
        switch (interval) {
            case 'hour':
                current.setHours(current.getHours() + 1);
                break;
            case 'day':
                current.setDate(current.getDate() + 1);
                break;
            case 'week':
                current.setDate(current.getDate() + 7);
                break;
            case 'month':
                current.setMonth(current.getMonth() + 1);
                break;
            case 'year':
                current.setFullYear(current.getFullYear() + 1);
                break;
        }
    }
    
    return dates;
}

// Parse various date formats
function parseDate(dateString) {
    if (!dateString) return null;
    
    // Try ISO format first
    let date = new Date(dateString);
    if (!isNaN(date)) {
        return date;
    }
    
    // Try common formats
    const formats = [
        /^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/, // MM/DD/YYYY
        /^(\\d{4})-(\\d{1,2})-(\\d{1,2})$/, // YYYY-MM-DD
        /^(\\d{1,2})-(\\d{1,2})-(\\d{4})$/, // DD-MM-YYYY
    ];
    
    for (const format of formats) {
        const match = dateString.match(format);
        if (match) {
            // Adjust parsing based on format
            if (format === formats[0]) { // MM/DD/YYYY
                date = new Date(match[3], match[1] - 1, match[2]);
            } else if (format === formats[1]) { // YYYY-MM-DD
                date = new Date(match[1], match[2] - 1, match[3]);
            } else if (format === formats[2]) { // DD-MM-YYYY
                date = new Date(match[3], match[2] - 1, match[1]);
            }
            
            if (!isNaN(date)) {
                return date;
            }
        }
    }
    
    return null;
}

// Convert timezone
function convertTimezone(date, fromTz, toTz) {
    // This is a simplified version - for production use a library like moment-timezone
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    // Basic UTC conversion (expand for full timezone support)
    return date;
}

// Export functions for global access
window.formatDate = formatDate;
window.formatTime = formatTime;
window.formatDateTime = formatDateTime;
window.getTimeAgo = getTimeAgo;
window.getDateRange = getDateRange;
window.isDateInRange = isDateInRange;
window.getDaysBetween = getDaysBetween;
window.getStartOf = getStartOf;
window.getEndOf = getEndOf;
window.isToday = isToday;
window.isYesterday = isYesterday;
window.isThisWeek = isThisWeek;
window.isThisMonth = isThisMonth;
window.generateDateSeries = generateDateSeries;
window.parseDate = parseDate;
window.convertTimezone = convertTimezone;

// Alias formatTimeAgo to existing function name for compatibility
window.formatTimeAgo = getTimeAgo;