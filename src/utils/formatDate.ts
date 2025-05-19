/**
 * Converts a date or date string to ISO 8601 local format (without milliseconds or timezone).
 *
 * @param date - The date (as a `Date` object or ISO-like string) to convert.
 * @returns The date in ISO format: YYYY-MM-DDTHH:MM:SS
 */
export const getLocalISODate = (date: Date | string): string | null => {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) return null;

  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = parsedDate.getFullYear();
  const month = pad(parsedDate.getMonth() + 1);
  const day = pad(parsedDate.getDate());
  const hours = pad(parsedDate.getHours());
  const minutes = pad(parsedDate.getMinutes());
  const seconds = pad(parsedDate.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
