import { serveContent, unindent, useCdnOrigin } from '../cdn-server/server-utils.js';

const PATH_REGEX = /^\/custom-config-([a-z0-9-]*)\/simple\.html$/;

export function applyTemplate (context) {
  if (!context.requestUrl.pathname.match(PATH_REGEX)) {
    return;
  }
  const content = renderContent(context);
  return serveContent(context, content, 'text/html');
}

function renderContent (context) {

  const configId = PATH_REGEX.exec(context.requestUrl.pathname)[1];

  const entryPointUrl = configId.includes('all-bundle')
    ? useCdnOrigin('./all-bundle.js', context.requestUrlWithOptions)
    : configId.includes('dedicated-bundle')
      ? './simple-bundle.js'
      : useCdnOrigin('./simple-split.js', context.requestUrlWithOptions);

  // language=HTML
  return unindent`
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Simple page</title>
      <link rel="stylesheet" href="../global-styles.css">
      <script>
      const d = window.customElements.define.bind(window.customElements);
      window.customElements.define = (n, c) => {
        d(n, c);
        performance.mark('<' + n + '> is defined');
      }</script>
      <script type="module" src="${entryPointUrl}"></script>
      <script type="module" src="../setup-simple.js" defer></script>
    </head>
    <body>

    <header>
      <h1>Clever components benchmark / simple (custom config / ${configId})</h1>
      <span>
        <a href="./simple.html" class="active">simple</a>
        <a href="./multiple.html#one">multiple (one)</a>
        <a href="./multiple.html#two">multiple (two)</a>
        <a href="./multiple.html#three">multiple (three)</a>
      </span>
    </header>

    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla mauris sem, ultricies a pharetra eget, interdum in ex. In accumsan mi vitae velit pulvinar tempus. Cras tempor porta nisi nec dignissim. Donec quis dolor congue neque tincidunt euismod. Morbi eu efficitur nisl, sit amet aliquam urna. Phasellus ac ante vel felis volutpat lacinia. Aenean lobortis dictum mi, ac placerat metus sollicitudin et. Integer blandit consectetur lorem. Vivamus rhoncus dapibus rhoncus. Morbi ornare finibus lorem, eu sollicitudin nunc fermentum sed. Maecenas sit amet porttitor orci. Nunc nec condimentum eros. Pellentesque fringilla, ligula ut laoreet vestibulum, nulla risus volutpat elit, eu egestas mi nulla non dolor. Nullam iaculis magna sapien, hendrerit iaculis quam laoreet quis. Mauris eleifend euismod felis at accumsan.</p>

    <p>
      <cc-input-text value="9d252e47-36f6-4ba8-a5d0-7c01983551f6" readonly clipboard></cc-input-text>
    </p>

    <p>Nunc ac sem ligula. Mauris nec est ac libero aliquam aliquet sed hendrerit risus. Donec a erat ut augue ultrices porta id vel est. Ut rutrum lorem quis fermentum maximus. Vestibulum elit velit, dapibus in erat nec, mattis suscipit justo. Aliquam ultricies efficitur elit, vitae tempus tellus auctor quis. Praesent vulputate tellus sed dictum vehicula. Suspendisse bibendum tempor sem, ut auctor elit. Cras commodo enim ut metus imperdiet, eget ullamcorper lacus porta. Curabitur egestas placerat quam in faucibus. Pellentesque vitae nisi nisi. Vestibulum efficitur rhoncus lectus, vitae fringilla enim blandit ut. Maecenas mollis at purus in blandit.</p>

    <p>
      <cc-input-text value="TszOB-k91V0wtbU_nWAm1hH0ypE" readonly clipboard secret></cc-input-text>
    </p>

    <p>Sed facilisis tristique massa non tempor. Vestibulum auctor est non pellentesque vehicula. In ac lorem leo. Pellentesque bibendum suscipit suscipit. Suspendisse porttitor erat mollis sodales fringilla. Vestibulum tempus est eget ipsum pellentesque cursus at in purus. Donec tempor nunc eu fermentum porta. Praesent pretium ornare felis, at venenatis urna faucibus ut. Fusce ipsum dui, vulputate sit amet turpis ut, hendrerit consequat arcu. Donec nunc nibh, pulvinar a turpis ac, posuere pulvinar sapien. Integer placerat dictum diam, nec lacinia turpis blandit quis. Vivamus pulvinar pellentesque diam, sit amet tempor velit commodo quis. Nunc viverra neque vel quam porttitor gravida.</p>

    <cc-tcp-redirection-form redirections='[{"namespace":"default","sourcePort":5220},{"namespace":"cleverapps"}]'></cc-tcp-redirection-form>

    <p>In molestie, arcu laoreet luctus facilisis, arcu tortor mollis arcu, vitae lobortis mauris risus sed elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas faucibus magna a odio accumsan venenatis. Phasellus ullamcorper quis urna a dapibus. Etiam et tempor lorem, sed volutpat nisi. Mauris accumsan erat in erat tristique faucibus. Donec volutpat ipsum in purus congue, non interdum nunc vestibulum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget velit magna. Donec molestie turpis nec arcu lacinia luctus. Morbi vitae suscipit lorem, eget scelerisque est. Pellentesque sed tempus ante.</p>

    </body>
    </html>
  `;
}
