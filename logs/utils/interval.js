export function intervalPromise (fn, rate, timeout) {
  return new Promise((resolve, reject) => {
    const start = new Date().getTime();

    const interval = setInterval(async () => {
      if (await fn() === false) {
        clearInterval(interval);
        resolve();
      }

      if (timeout > 0 && new Date().getTime() - start >= timeout) {
        reject(new Error('timeout'));
      }
    }, rate);
  });
}
