import { serveContent, unindent, useCdnOrigin } from '../cdn-server/server-utils.js';

const PATH_REGEX = /^\/custom-config-([a-z0-9-]*)\/multiple\.js$/;

export function applyTemplate (context) {
  if (!context.requestUrl.pathname.match(PATH_REGEX)) {
    return;
  }
  const content = renderContent(context);
  return serveContent(context, content, 'application/javascript');
};

function renderContent (context) {

  const configId = PATH_REGEX.exec(context.requestUrl.pathname)[1];

  const entryPointUrl = (page) => {
    return configId.includes('all-bundle')
      ? useCdnOrigin('./all-bundle.js', context.requestUrlWithOptions)
      : configId.includes(`dedicated-bundle`)
        ? `./multiple-${page}-bundle.js`
        : useCdnOrigin(`./multiple-${page}.js`, context.requestUrlWithOptions);
  };

  // language=JavaScript
  return unindent`
    function updateMainView () {

      for (const node of document.querySelectorAll('header a')) {
        node.classList.toggle('active', node.href === document.location.href);
      }

      const hash = document.location.hash;
      main.dataset.page = hash.slice(1);
      main.innerHTML = \`loading...\`;

      switch (hash) {

        case '#one':
          import('${entryPointUrl('one')}');
          import('../setup-multiple-one.js').then(({ initView }) => initView());
          break;

        case '#two':
          import('${entryPointUrl('two')}');
          import('../setup-multiple-two.js').then(({ initView }) => initView());
          break;

        case '#three':
          import('${entryPointUrl('three')}');
          import('../setup-multiple-three.js').then(({ initView }) => initView());
          break;

        default:
          window.history.replaceState({}, '', '#one');
          updateMainView();
          break;
      }
    }

    // Watch route changes
    window.onpopstate = updateMainView;

    // Init first state
    updateMainView();
  `;
}
