export function formatDateTimeLocal(timestamp: string, readable: boolean) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = date.getMonth(); // No +1 yet because we want month name
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  if (readable) {
    const monthNames = [
      "Jan.",
      "Feb.",
      "Mar.",
      "Apr.",
      "May.",
      "Jun.",
      "Jul.",
      "Aug.",
      "Sep.",
      "Oct.",
      "Nov.",
      "Dec.",
    ];

    const hour12 = hours % 12 || 12; // convert 0 => 12
    const ampm = hours >= 12 ? "PM" : "AM";

    return `${monthNames[month]} ${day}, ${year} ${hour12}:${minutes}${ampm}`;
  } else {
    // Return normal for input[type="datetime-local"]
    const monthPadded = String(month + 1).padStart(2, "0");
    const dayPadded = String(day).padStart(2, "0");
    const hoursPadded = String(hours).padStart(2, "0");

    return `${year}-${monthPadded}-${dayPadded}T${hoursPadded}:${minutes}`;
  }
}
