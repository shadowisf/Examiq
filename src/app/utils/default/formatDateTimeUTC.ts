export function formatDateTimeToUTC(timestamp: string) {
  const localDate = new Date(timestamp);

  // Convert local time to UTC time manually
  const year = localDate.getUTCFullYear();
  const month = String(localDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(localDate.getUTCDate()).padStart(2, "0");
  const hours = String(localDate.getUTCHours()).padStart(2, "0");
  const minutes = String(localDate.getUTCMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:00Z`; // Add 'Z' meaning UTC
}
