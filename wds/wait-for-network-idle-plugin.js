export function waitForNetworkIdlePlugin() {
  return {
    name: 'wait-for-network-idle-plugin',

    async executeCommand({ command, session }) {
      if (command === 'wait-for-network-idle') {
        const page = session.browser.getPage(session.id);
        await page.waitForLoadState('networkidle');
        return true;
      }
    },
  };
}
