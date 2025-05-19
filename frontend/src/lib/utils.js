/**
 * Formats a timestamp into a readable time string
 * @param {string} timestamp - ISO date string
 * @returns {string} - Formatted time string
 */
export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  // Format for hours and minutes
  const timeOptions = { hour: 'numeric', minute: 'numeric' };
  const timeString = date.toLocaleTimeString([], timeOptions);
  
  // If message is from today, just show the time
  if (isToday) {
    return timeString;
  }
  
  // If message is from this year but not today
  if (date.getFullYear() === now.getFullYear()) {
    const dateOptions = { month: 'short', day: 'numeric' };
    return `${date.toLocaleDateString([], dateOptions)} ${timeString}`;
  }
  
  // If message is from a different year
  const fullOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return `${date.toLocaleDateString([], fullOptions)} ${timeString}`;
};
