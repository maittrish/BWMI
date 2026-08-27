/**
 * Format currency in Indian Rupees
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format date to readable string
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Format date to short string
 */
export function formatDateShort(dateString) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short'
  });
}

/**
 * Get time string (HH:MM)
 */
export function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Get status color class
 */
export function getStatusColor(status) {
  switch (status) {
    case 'approved': case 'done': return 'approved';
    case 'processing': case 'active': return 'processing';
    case 'rejected': case 'failed': return 'rejected';
    default: return 'pending';
  }
}

/**
 * Get severity emoji
 */
export function getSeverityEmoji(severity) {
  switch (severity) {
    case 'high': return '🔴';
    case 'medium': return '🟡';
    case 'low': return '🟢';
    default: return '⚪';
  }
}

/**
 * Mask UAN for display (show last 4 digits)
 */
export function maskUAN(uan) {
  if (!uan || uan.length < 4) return uan;
  return '••••••••' + uan.slice(-4);
}
