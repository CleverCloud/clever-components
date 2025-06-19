let i = 1;

export function setFixedTimePlugin() {
  return {
    name: 'set-fixed-time-plugin',

    async executeCommand({ command, session, payload }) {
      if (command === 'install-clock') {
        const newDate = payload != null ? payload : new Date('2024-02-02T10:00:00');
        const page = session.browser.getPage(session.id);
        console.log('TRYING TO INSTALL TIME');
        // we have to use this instead of setFixedTime because we need to patch the whole `Date`, not only the constructor & Date.now()
        await page.clock.install({ time: newDate });
        // await page.clock.setFixedTime(newDate);
        console.log('INSTALLED TIME');
        return true;
      }

      if (command === 'pause-clock') {
        const page = session.browser.getPage(session.id);

        // console.log('installing mock date');
        const baseTime = new Date('2024-02-02T15:05:00');
        const pauseTime = new Date(baseTime.getTime() + i * 5 * 60 * 1000);
        i++;
        await page.clock.pauseAt(pauseTime);
        console.log('FIXED TIME');
        // console.log('pausing mock date');
        return true;
      }

      if (command === 'resume-clock') {
        const page = session.browser.getPage(session.id);
        console.log('RESUMING');
        await page.clock.resume();
        console.log('resumed mock date');
        return true;
      }
    },
  };
}
