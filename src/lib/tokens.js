/**
 * @typedef {import("./tokens.types.js").ExpirationWarningThresholds} ExpirationWarningThresholds
 */

/** @type {ExpirationWarningThresholds} */
const DEFAULT_THRESHOLDS = [
  { maxApplicableTokenLifetimeInDays: 7, warningThresholdInDays: 2 },
  { maxApplicableTokenLifetimeInDays: 30, warningThresholdInDays: 7 },
  { maxApplicableTokenLifetimeInDays: 60, warningThresholdInDays: 10 },
  { maxApplicableTokenLifetimeInDays: 90, warningThresholdInDays: 20 },
  { maxApplicableTokenLifetimeInDays: 365, warningThresholdInDays: 30 },
];

/**
 * Checks if a token is close to expiration based on its lifetime.
 *
 * Uses a tiered threshold system where tokens with longer lifespans have larger
 * warning thresholds. For example, 7-day tokens warn at 2 days remaining, while
 * 90-day tokens warn at 20 days remaining.
 *
 * Uses DEFAULT_THRESHOLDS by default, but custom thresholds can be provided.
 * Falls back to highest threshold for tokens exceeding defined lifespans.
 *
 * @param {Object} tokenInfo - Creation & expiration date
 * @param {Date} tokenInfo.creationDate - The creation date of the token
 * @param {Date} tokenInfo.expirationDate - The expiration date of the token
 * @param {ExpirationWarningThresholds} [thresholds] - Optional custom thresholds configuration
 * @returns {boolean} True if the token is close to expiration
 */
export function isExpirationClose({ creationDate, expirationDate }, thresholds = DEFAULT_THRESHOLDS) {
  const now = new Date();
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  // Calculate token's total lifetime and remaining days
  const expirationTimestamp = expirationDate.getTime();
  const creationTimestamp = creationDate.getTime();
  const totalTokenLifetimeInDays = Math.floor((expirationTimestamp - creationTimestamp) / MILLISECONDS_PER_DAY);

  // Calculate days remaining until expiration
  const daysUntilExpiration = (expirationDate.getTime() - now.getTime()) / MILLISECONDS_PER_DAY;

  // Sort thresholds by maxApplicableTokenLifetimeInDays in ascending order to find the appropriate
  // threshold based on the token's total lifetime
  const sortedThresholds = [...thresholds].sort(
    (a, b) => a.maxApplicableTokenLifetimeInDays - b.maxApplicableTokenLifetimeInDays,
  );

  // Find the first threshold that applies to this token's lifetime
  const thresholdToApply = sortedThresholds.find((threshold) => {
    return totalTokenLifetimeInDays <= threshold.maxApplicableTokenLifetimeInDays;
  });

  // If no matching threshold found, use the one with the highest max days as fallback
  const highestThreshold = sortedThresholds[sortedThresholds.length - 1];

  // Determine the appropriate warning threshold in days
  const warningThreshold = thresholdToApply
    ? thresholdToApply.warningThresholdInDays
    : highestThreshold.warningThresholdInDays;

  // Return true if remaining time is less than or equal to the warning threshold
  return daysUntilExpiration <= warningThreshold;
}
