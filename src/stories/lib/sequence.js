function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export function sequence(callback) {
  setTimeout(() => callback(wait), 50);
}
