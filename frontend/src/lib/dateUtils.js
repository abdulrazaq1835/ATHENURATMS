/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'full', or custom
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return 'N/A';

  try {
    const dateObj = new Date(date);

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    switch (format) {
      case 'short':
        // Format: Jan 15, 2024
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

      case 'long':
        // Format: January 15, 2024
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

      case 'full':
        // Format: Monday, January 15, 2024
        return dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

      case 'iso':
        // Format: 2024-01-15
        return dateObj.toISOString().split('T')[0];

      case 'time':
        // Format: 2:30 PM
        return dateObj.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

      case 'datetime':
        // Format: Jan 15, 2024, 2:30 PM
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

      default:
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Calculate days left until deadline
 * @param {string|Date} deadline - Deadline date
 * @returns {number|null} Number of days left (negative if overdue)
 */
export const daysLeft = (deadline) => {
  if (!deadline) return null;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  } catch (error) {
    console.error('Error calculating days left:', error);
    return null;
  }
};

/**
 * Check if date is overdue
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isOverdue = (date) => {
  if (!date) return false;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate < today;
  } catch (error) {
    console.error('Error checking overdue:', error);
    return false;
  }
};

/**
 * Get relative time string (e.g., "2 days ago", "in 3 days")
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return 'N/A';

  try {
    const now = new Date();
    const targetDate = new Date(date);
    const diffMs = targetDate - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `in ${diffDays} days`;
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;

    return formatDate(date);
  } catch (error) {
    console.error('Error getting relative time:', error);
    return formatDate(date);
  }
};

/**
 * Format time ago (e.g., "5 minutes ago", "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Time ago string
 */
export const timeAgo = (date) => {
  if (!date) return 'N/A';

  try {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffMonth / 12);

    if (diffYear > 0) return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
    if (diffMonth > 0) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
    if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffSec > 10) return `${diffSec} seconds ago`;

    return 'Just now';
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return formatDate(date);
  }
};

/**
 * Get date range string
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @param {string} format - Format type
 * @returns {string} Date range string
 */
export const getDateRange = (startDate, endDate, format = 'short') => {
  if (!startDate || !endDate) return 'N/A';

  const start = formatDate(startDate, format);
  const end = formatDate(endDate, format);

  return `${start} - ${end}`;
};

/**
 * Check if date is within current week
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is within current week
 */
export const isThisWeek = (date) => {
  if (!date) return false;

  try {
    const now = new Date();
    const targetDate = new Date(date);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return targetDate >= startOfWeek && targetDate <= endOfWeek;
  } catch (error) {
    console.error('Error checking if date is this week:', error);
    return false;
  }
};

/**
 * Check if date is within current month
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is within current month
 */
export const isThisMonth = (date) => {
  if (!date) return false;

  try {
    const now = new Date();
    const targetDate = new Date(date);

    return now.getMonth() === targetDate.getMonth() &&
           now.getFullYear() === targetDate.getFullYear();
  } catch (error) {
    console.error('Error checking if date is this month:', error);
    return false;
  }
};

/**
 * Get formatted date for input fields (YYYY-MM-DD)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date for input
 */
export const getInputDate = (date) => {
  if (!date) return '';

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';

    return dateObj.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting input date:', error);
    return '';
  }
};

/**
 * Parse date from input field
 * @param {string} dateString - Date string from input (YYYY-MM-DD)
 * @returns {Date|null} Parsed date object or null
 */
export const parseInputDate = (dateString) => {
  if (!dateString) return null;

  try {
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day);
  } catch (error) {
    console.error('Error parsing input date:', error);
    return null;
  }
};
