export function setPredictibleRandomPlugin() {
  return {
    name: 'set-predictible-random-plugin',

    async executeCommand({ command, session }) {
      if (command === 'set-predictible-random') {
        const page = session.browser.getPage(session.id);
        console.log('setting predictible random');
        await page.addInitScript({ content: "Math.random = () => { console.log('randooooom'); return 1 }" });
        return true;
      }
    },
  };
}
