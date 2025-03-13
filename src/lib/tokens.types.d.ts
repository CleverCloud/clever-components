export type ExpirationWarningThresholds = Array<{
  /** Number of days representing the maximum lifetime for which the given threshold is applicable */
  maxApplicableTokenLifetimeInDays: number;
  /** Number of days below which the token is considered close to expiration (must be lower than maxApplicableTokenLifetimeInDays) */
  warningThresholdInDays: number;
}>;
