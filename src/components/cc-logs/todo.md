# TODO

* [x] réparer Safari
* [x] répare le focus
* [x] reset text selection on drag
* [x] refactor + this._host._logsRef.value
* [x] split les 2 animations
* [x] speed
* [x] animation runner trop stylé

* [x] fix le fait que ça tremble d'un pixel avec les arrondis de em
  * quand on utilise un line-height à l'interieur du `p.log`, les transforms de lit-virt semblent imposer un calcul .0001px au navigateur (visible devtools FF).
  * line-height en px ou em change rien
  * line-height + zoom
* [x] améliorer le CSS autour du bouton/icon/span
    * [x] bouger le click et focus sur tout le span.gutter
* [x] renommer le _logs en _logsCtrl
* [x] select() number[] => number
* [x] regions + ordre des trucs dans le logs-foo (composant, inputCtrl, logsCtrl)
* [x] LogsController demande un requestUpdate mais il ne dit pas sur quoi
    * à priori, c'est forcément sur la liste des logs
    * investiguer si ça améliorer ou pas
    * => ça ne sert à rien
* [x] virer la classe visually-hidden-focusable

* [x] follow (test le pin)
* [x] remettre le système de render custom sur les metadatas
* [x] data-index et data-id directement sur button/icon
* [x] check le getList() qui fait un slice() à chaque fois
* [x] stop follow when start selection
* [x] rename logs-foo => logs
* [ ] cleanup
  * [ ] git history: squash
  * [x] rollback tests root dir
  * [x] JSDoc (@type, @typedef, @event ...)
  * [x] Story
    * [x] extract playground into a dedicated demo page
    * [x] simplify log generation (maybe use lorem ipsum like for sandbox)
* [ ] vérifier que les éléments de revues sont pris en compte
* [ ] bug, si on click et qu'on drag vite, la sélection rate quelques lignes
    * [ ] check que le drag pend bien le premier dans la sélection
* [x] data-index et data-id directement sur button/icon
* [x] check le getList() qui fait un slice() à chaque fois
* [x] improve unit tests CcLogsController
  * test rename spy => requestUpdateSpy
  * improve the spy count system
  * split big tests into multiple it()

* [ ] on a encore le "pb" du espace/enter avec shift/ctrl sur firefox
* [ ] Ctrl+A to select all
  * plutôt oui
* [ ] Home, End
  * ctrl+shift+ HOMe/End => expand selection 
* [ ] triple click hole line selection
```js
  /**
   * We force the triple click to select the whole line of logs
   */
  _handleTripleClick (logElement) {
    window.getSelection().empty();
    const range = document.createRange();
    range.selectNode(logElement);
    window.getSelection().addRange(range);
  }
```
