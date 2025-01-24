/**
 * Creates a promise that resolves after a specified delay
 *
 * @param {number} delay - The delay in milliseconds
 * @returns {Promise<void>} A promise that resolves after the delay
 */
function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

/**
 * Executes a callback function with a wait utility after a 50ms delay
 *
 * @param {(waitCallback: typeof wait) => void} callback - The callback function to execute
 * @returns {void}
 */
export function sequence(callback) {
  setTimeout(() => callback(wait), 50);
}
