function sleep (duration) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration);
  });
}

function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function rand (val, percent = 50) {
  const twentyPercents = val * percent / 100;
  return random(val - twentyPercents, val + twentyPercents);
}

async function executeStep (step, { first, last }) {
  if (step.startsWith('$wait:')) {
    const duration = parseInt(step.substring('$wait:'.length));
    console.log('wait', duration);

    await sleep(rand(duration));
  }
  else if (step.startsWith('$logs:')) {
    const spec = step.substring('$logs:'.length);
    console.log('logs', spec);
    const split = spec.split('-');
    const rate = rand(parseInt(split[0]));
    const count = rand(parseInt(split[1]));

    if (rate === 0) {
      self.postMessage({
        type: 'addLogs',
        data: count,
      });
    }
    else {
      return new Promise((resolve) => {
        let i = 0;
        const interval = setInterval(() => {
          if (i === count) {
            clearInterval(interval);
            resolve();
          }
          else {
            self.postMessage({
              type: 'addLogs',
              data: 1,
            });
            i++;
          }
        }, rate);
      });
    }
  }
  else {
    self.postMessage({
      type: 'executeStep',
      data: {
        step,
        first,
        last,
      },
    });
  }
}

async function start (steps) {
  for (let i = 0; i < steps.length; i++) {
    await executeStep(steps[i], { first: i === 0, last: i === steps.length - 1 });
  }
}

self.addEventListener('message', function (e) {
  const data = e.data;
  start(data.steps).then();
});
