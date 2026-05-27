/**
 * @param {string[]} variables Array of environment variables to check
 * @returns {string[]} Array of errors
 */
export function validateEnv(variables) {
  const errors = [];
  for (const envVar of variables) {
    if (!process.env[envVar]) {
      errors.push(`${envVar} is required`);
    }
  }
  return errors;
}
