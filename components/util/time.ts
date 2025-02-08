const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatTime(date: Date) {
  const currentTime = new Date();
  const diffInMillis = currentTime.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMillis / (1000 * 60 * 60)); // Convert to hours

  let timeText: string; 

  if (diffInMillis < DAY) {
    // Less than 24 hours
    timeText = `${diffInHours}hrs ago`;
  } else {
    timeText = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return timeText;
}