export function setFixedTimePlugin() {
  return {
    name: 'set-fixed-time-plugin',

    async executeCommand({ command, session, payload }) {
      if (command === 'set-fixed-time') {
        const newDate = payload != null ? payload : new Date('2024-02-02T10:00:00');
        const page = session.browser.getPage(session.id);
        await page.clock.setFixedTime(newDate);
        return true;
      }
    },
  };
}
