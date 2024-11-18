/**
 * This function calculates the Time To Live (TTL) in seconds from the current time until UTC 00:00 the next day
 *
 * @returns {number} The TTL in seconds.
 */
export function calculateSecondsUntilMidnightUTC() {
  const now = new Date();
  const tomorrow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  );
  const ttl = Math.floor((tomorrow.getTime() - now.getTime()) / 1000); // Convert to seconds
  return ttl;
}

export function formatCronToHour(cron: string): string {
  const cronParts = cron.split(" ");
  const hour = parseInt(cronParts[1]);
  const period = hour >= 12 ? "pm" : "am";
  const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${formattedHour}:00 ${period} UTC`;
}
