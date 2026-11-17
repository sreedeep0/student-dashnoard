/**
 * Date Utility Helpers
 * Handles date-only strings consistently in the user's local timezone.
 */

/**
 * Parses a YYYY-MM-DD string into a local Date object at local midnight.
 * Avoids the standard UTC interpretation shift in JavaScript.
 */
export function parseLocalDate(dateString) {
  if (!dateString) return null;
  if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString.trim())) {
    const [year, month, day] = dateString.trim().split('-').map(Number);
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  }
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Formats a local Date object into a YYYY-MM-DD string without UTC conversion.
 */
export function formatLocalDateString(date) {
  if (!date || isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a date-only string for display (e.g. "Nov 15, 2026") in local time.
 */
export function formatDate(dateString) {
  if (!dateString) return 'No due date';
  const d = parseLocalDate(dateString);
  if (!d) return dateString;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Checks if an assignment is due within the next 48 hours (including due later today),
 * and is not already overdue.
 */
export function isDueSoon(dateString) {
  if (!dateString) return false;
  const due = parseLocalDate(dateString);
  if (!due) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // 0 days (due today), 1 day (tomorrow), 2 days (48 hours)
  return diffDays >= 0 && diffDays <= 2;
}

/**
 * Checks if a due date has passed. Does not mark assignments overdue on their local due date.
 */
export function isOverdue(dateString) {
  if (!dateString) return false;
  const due = parseLocalDate(dateString);
  if (!due) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today.getTime() > due.getTime();
}

/**
 * Returns human-readable relative time string based on local calendar day differences.
 */
export function getRelativeDueLabel(dateString) {
  if (!dateString) return '';
  const due = parseLocalDate(dateString);
  if (!due) return '';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays === -1) return 'Overdue by 1 day';
  if (diffDays < -1) return `Overdue by ${Math.abs(diffDays)} days`;
  return `Due in ${diffDays} days`;
}
