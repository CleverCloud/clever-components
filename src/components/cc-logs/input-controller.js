export class InputController {

  constructor (host) {
    this._host = host;
  }

  onClick (e) {

    const clickDetails = {
      inGutter: false,
      logId: null,
      ctrlKey: e.ctrlKey,
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

}
