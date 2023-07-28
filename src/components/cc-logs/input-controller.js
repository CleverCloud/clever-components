export class InputController {

  constructor (host) {
    this._host = host;
  }

  onClick (e) {

    const clickDetails = {
      inGutter: false,
      logId: null,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
    };

    for (const element of e.composedPath()) {
      // if (element === this._logsRef.value) {
      //   break;
      // }
      if (element.classList == null) {
        continue;
      }
      clickDetails.inGutter ||= element.classList.contains('gutter');
      if (element.classList.contains('log')) {
        clickDetails.logId = element.dataset.id;
        break;
      }
    }

    this._host._onClickLog(clickDetails);
  }

  onKeyDown (e) {

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {

      // we don't want to use the native behavior: scroll up/down
      // Note that user will still have PageUp and PageDown keys to scroll up and down
      e.preventDefault();

      const direction = (e.key === 'ArrowDown') ? 'down' : 'up';
      this._host._onArrow(direction);
    }
  }

}
