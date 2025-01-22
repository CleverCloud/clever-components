/**
 * Creates a promise that resolves after a specified delay
 *
 * @param {number} delay - The delay time in milliseconds
 * @returns {Promise<void>} Promise that resolves after the delay
 */
function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

/**
 * Run the sequence if we have simulations
 *
 * @param {function(typeof wait): Promise<void>} callback - Function to wait for specified delay.
 * @returns {void}
 */
export function sequence(callback) {
  setTimeout(() => callback(wait), 50);
}
