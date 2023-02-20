---
kind: '📌 Docs/Architecture Decision Records'
---
# ADR ???: Why a CDN

🗓️ 2023-??-?? · ✍️ ??

## Objectif de départ

Besoin : on peut rendre accessible nos composants en mode CDN <script src="">

Requirements :

* on veut que l'utilisateur téléchargement uniquement les composants nécessaires
  ** avec la configuration de la langue
* le plus rapidement possible
* avec le meilleur cache possible
  ** rechargement
  ** chargement incrémental composant A oui B
  ** version 1.4 vers 1.5, on ne recharge que ce qui a changé

* URL des images
* relinker les bare imports en relatif

## idées principales testées

* compilation/bundling avec rollup
  ** creation du load.js
  ** move away from import non js => import.meta.url
* gzip (brotli?)
* preload avec header HTTP Link
* HTTP/2
* compilation de sous fichier par langue
* pousser sur un CDN (cellar) avec header
  ** gzip ok
  ** link NOK

* (pick/pkg)
* (snowpack)

## import.meta

Avec `import.meta.url` et `new URL('./foo.svg', import.meta.url)`
=> on peut avoir une URL relative à un fichier JS loadé qui lui sait d'où il vient et où sont les images

* C'est que stage 3 mais supporté par notre cible
* Cette idée fonctionne avec du natif browser
* C'est un peu verbeux de faire new URL partout
* On pert la notion d'import et donc la facilité de faire un loader webpack (pour copier les fichiers au bon endroit)
* La syntaxe pose problème avec webpack

https://github.com/rollup/rollup/pull/2164
https://github.com/rollup/rollup/pull/2164#issuecomment-386465259
https://github.com/rollup/rollup/issues/2748
https://github.com/cfware/babel-plugin-bundled-import-meta#readme
https://github.com/rollup/rollup/pull/2785
https://github.com/rollup/rollup/issues/3151
https://github.com/rollup/rollup/issues/2748

## structure des dossier

ce qui n'est pas très pratique actuellement c'est de retrouver

// components has components in subfolders and other kind of files
// only components and lib/i18n.js and translations/* are supposed to be used from the outside
// what about mixins ?
// what about templates ?
// what about styles ?
// all icons should be in the same folder
components
addon (cmp)
atoms (cmp)
env-var (cmp)
icons
lib
maps (cmp)
mixins
molecules (cmp)
overview (cmp)
styles
templates
translations
stories


src
components
addon
atoms
env-var
maps
molecules
overview
assets (icons + other files like geojson map)
lib
mixins
styles
templates
translations

stories
components
addon
atoms
env-var
maps
molecules
overview
assets
lib
mixins
templates
welcome


import '@clevercloud/components/dist/addon/cc-elasticsearch-info.js';

https://cdn.clever-cloud.com/components/1.3.0/load.js?lang=fr&components=cc-error,cc-loader
https://cdn.clever-cloud.com/components/1.3.0/load.js?lang=fr&categories=env-var
https://cdn.clever-cloud.com/components/1.3.0/load.js?lang=fr&all=true

should we pass the version as a query param
would be great if we could reuse hashed files from a built to another

1.3.0
load.js



on pourrait ajouter des hash dans les fichiers générés mais je me dis que si on range les fichiers dans une version dans l'URL, ça peut suffir


on a 3 arbos :

* celle du code
  ** import './components/addon/cc-elasticsearch-info.js';
* celle de npm
  ** import '@clevercloud/components/dist/addon/cc-elasticsearch-info.js';
* celle du cdn
  ** import 'https://cdn.clever-cloud.com/components/1.3.0/addon/cc-elasticsearch-info.js';

Normalement, tous les noms de composants sont uniques donc est-ce qu'on a besoin des sous dossiers ?
=> Par vraiment mais dans le cadre des sources, ça reste bien de ranger par dossier.
=> Pour l'import npm, c'est un peu plus verbeux
=> Pour l'ajout CDN on aura de toute façon

Si on range les composants dans des dossiers, où est ce qu'on range les pas composants, le système actuel est pas si mal, il nécessite juste de savoir dans quels dossiers sont les composants à extraire
=> on va lister les dossiers les fichiers qui nécessite d'être mirroré en CDN avec des globs, les autres peuvent être réécrits


expliquer en quoi on pourra éventuellement faire un loader


https://open-wc.org/building/building-webpack.html#common-extensions
https://github.com/webpack-contrib/copy-webpack-plugin
https://github.com/open-wc/open-wc/blob/master/packages/webpack-import-meta-loader/webpack-import-meta-loader.js

## changements sur nos composants

* attributs sur object/array pour usage HTML
* import svg => import.meta.url
  ** on devrait renommer le helper en resolveUrl

## idées pas testée ou a creuser

* ne charger que par le load.js
* import maps
* treeshake.moduleSideEffects avec v2
* partage de chunk entre version (ne mettre derrière un v1.4.0 que le load.js)
* compilation inlining des langues dans les fichiers
* plugin rollup/webpack pour les assets
* separate imports components from file contents

## raw notes (pika/snowpack)

* https://www.youtube.com/watch?v=nbwt3A9RzNw
* snowpack est une commande qui prend les modules ESM du package json et qui les bundles dans web_modules
* ils ont un registry mais je comprends pas trop vu qu'ils parlent d'un Get Early Access
* ils ont un éditeur "This Code Editor Will Save the Internet" mais pourquoi ?
* ils ont un CDN (à la unpkg) dédié au modules ESM, ça a l'air cool
* ils ont une commande pika/pack qui ressemble à ce que je veux
* pika a aussi un système de sécurité ? WTF

### test snowpack

npx snowpack dans le repo components
=> il ne trouve que lit-element, lit-html et resize-observer-polyfill
=> il a créé un common (qui doit regrouper j'imagine les trucs entre lit-html et lit-element)

que faire pour marquer le clever client as ESM

je comprends pas bien ce qu'on peut faire quand on a des deps pas ESM

### test pika

npm install @pika/pack

le projet n'a pas bougé depuis sept 2019

le screenshot du readme dit qu'il faut faire `pack build`
=> il n'y a pas/plus de bin `pack` d'installé

le quickstart dit de lancer pika pack, ça n'existe pas/PLUS

il parle de `pika build`, ça donne cette erreur

```
$ npm run pika

> @clevercloud/components@1.4.0 pika /home/hsablonniere/dev/clever-components
> pika build

@pika/pack v0.5.0
[1/4] Validating source...
[2/4] Preparing pipeline...
      ❇️  pkg/
[3/4] Pipeline is empty! See https://github.com/pikapkg/pack for help getting started...
[4/4] Finalizing package...
      » copying CHANGELOG.md...
      » copying README.md...
Error: ENOENT: no such file or directory, open '/home/hsablonniere/dev/clever-components/pkg/package.json'
Error: ENOENT: no such file or directory, copyfile '/home/hsablonniere/dev/clever-components/CHANGELOG.md' -> '/home/hsablonniere/dev/clever-components/pkg/CHANGELOG.md'
Error: ENOENT: no such file or directory, copyfile '/home/hsablonniere/dev/clever-components/README.md' -> '/home/hsablonniere/dev/clever-components/pkg/README.md'
Error: Command failed with exit code 1 (EPERM): npx pika-pack
    at makeError (/home/hsablonniere/dev/clever-components/node_modules/@pika/cli/node_modules/execa/lib/error.js:59:11)
    at handlePromise (/home/hsablonniere/dev/clever-components/node_modules/@pika/cli/node_modules/execa/index.js:112:26)
    at processTicksAndRejections (internal/process/task_queues.js:82:5)
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! @clevercloud/components@1.4.0 pika: `pika build`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the @clevercloud/components@1.4.0 pika script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /home/hsablonniere/.npm/_logs/2020-02-12T16_17_56_506Z-debug.log
```

c'est moi ou le truc a essayé de faire un npx ?

si tu run pika tout court, tu as ça :

```

Usage:
  pika [command] [flags]
Commands:
  help                output usage information
  build               https://www.pika.dev/cli/commands/build
  install             https://www.pika.dev/cli/commands/install
  publish             https://www.pika.dev/cli/commands/publish
Global Options:
  -v, --version       output the CLI version
  -h, --help          output usage information
  --cwd               set the current
  --dry-run           don't actually run any commands
```

aucune de ces 3 pages n'existe :-(

* en ajoutant des trucs ds la pipeline ça a l'air d'aider
* on ne peut pas utiliser src
* de ce que je comprends, pika/build ne va pas m'aider à s'occuper des lib tierces
* attention au .js ou pas
* j'essaie avec les 3 modules
  ** "@pika/plugin-standard-pkg",
  ** "@pika/plugin-build-web"
  ** "@pika/plugin-bundle-web"

https://github.com/pikapkg/builders

résultat : un index.bundled.js de 685k (avec sourcemap)
les imports dynamiques import() sont générés à

sachant que pour l'instant, j'ai pété les images

en fait tout ceci utilise rollup et babel
unpkg utilise rollup

https://www.snowpack.dev/
https://www.pika.dev/
https://github.com/pikapkg/pack
https://github.com/pikapkg/builders
https://www.pika.dev/blog/introducing-pika-pack/

## what we tried with rollup

* changing entry names
* playing with manualchunks
* smartasset plugin to keep importing svg
* plugin rollup-plugin-size-snapshot does not work with multiple entries
* was hard to remove moment

## load.js

si on impose un chargement via le load.js :

* on est capable de charger que des chunk avec des hash
* et du coup, on peut les garder dans le browser à l'infini sans se faire chier
* est-ce qu'on veut load.js?v=1.4.0 ou 1.4.0/load.js
  ** le deuxième parait plus logique vu qu'on peut changer l'implem de load.js
* tous les composants utilisant un chunk qui a été changé vont changer de hash
* avec des import maps, ça pourrait être fun
* si on fait pas un sous dossier par image, ça fout la merdre sans réécrire les URLs
* le load.js pourrait être en CDN ou pas
* si le load.js était derrière une API, il pourrait maitriser les header link et le fait de ne charger que ce qu'il faut
* comment gérer les langues??
* treeshake.moduleSideEffects

## Links to sort

https://www.smashingmagazine.com/2020/01/front-end-performance-checklist-2020-pdf-pages/
https://medium.com/@Rich_Harris/small-modules-it-s-not-quite-that-simple-3ca532d65de4

### preload

https://3perf.com/blog/link-rels/
https://bugs.webkit.org/show_bug.cgi?id=180574
https://bugzilla.mozilla.org/show_bug.cgi?id=1394778
https://bugzilla.mozilla.org/show_bug.cgi?id=1425310
https://caniuse.com/#feat=link-rel-prefetch
https://css-tricks.com/prefetching-preloading-prebrowsing/
https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content
https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#cache-control
https://dexecure.com/blog/http2-push-vs-http-preload/
https://gist.github.com/adamzr/0c4e14999263aa4854b91f9245e16de8
https://github.com/whatwg/html/pull/2383
https://github.com/whatwg/html/pull/2383
https://medium.com/reloading/a-link-rel-preload-analysis-from-the-chrome-data-saver-team-5edf54b08715
https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf
https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf
https://web.dev/preload-critical-assets/
https://www.chromestatus.com/feature/5762805915451392
https://www.keycdn.com/blog/resource-hints
https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/
https://www.zachleat.com/web/preload/

### caching

https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching
https://www.keycdn.com/blog/http-cache-headers

### HTTP2

https://medium.com/@asyncmax/the-right-way-to-bundle-your-assets-for-faster-sites-over-http-2-437c37efe3ff
http://engineering.khanacademy.org/posts/js-packaging-http2.htm

### Rollup, pika, unpkg

https://www.snowpack.dev/
https://github.com/mjackson/unpkg/blob/7f90203a66d29c2dd29deb5522bb91c73f048d43/modules/actions/serveJavaScriptModule.js
https://github.com/mjackson/unpkg/blob/master/modules/middleware/findEntry.js
https://github.com/mjackson/unpkg/blob/master/modules/middleware/validateFilename.js
https://github.com/mjackson/unpkg/blob/master/modules/plugins/unpkgRewrite.js
https://github.com/mjackson/unpkg/blob/master/modules/utils/rewriteBareModuleIdentifiers.js
https://github.com/mjackson/unpkg/tree/master/modules
https://github.com/mjackson/unpkg/tree/master/modules/middleware
https://github.com/mjackson/unpkg/tree/master/modules/utils
https://github.com/rollup/awesome
https://rollupjs.org/guide/en/#hooks
https://rollupjs.org/guide/en/#why-do-additional-imports-turn-up-in-my-entry-chunks-when-code-splitting

### Import meta

https://github.com/cfware/babel-plugin-bundled-import-meta#readme
https://github.com/open-wc/open-wc/tree/master/packages/webpack-import-meta-loader
https://github.com/rollup/rollup/issues/2748
https://github.com/rollup/rollup/issues/3151
https://github.com/rollup/rollup/pull/2164
https://github.com/rollup/rollup/pull/2785
https://github.com/webpack/webpack/issues/6719
https://github.com/babel/proposals/issues/10
https://github.com/open-wc/open-wc/blob/master/packages/building-rollup/modern-config.js
https://open-wc.org/building/building-rollup.html#copy-assets

## questions

pourquoi pas un bundle unique à la volée :
* cache
* chargement progressif
