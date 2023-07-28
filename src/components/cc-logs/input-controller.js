const MIN_FRAMES = 10;
const ANIMATION_SPEED = 2;

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
      if (this._animation == null) {
        let i = 0;
        this._animation = () => {
          if ((i === 0 || i > MIN_FRAMES) && (i % ANIMATION_SPEED) === 0) {
            this._host._onArrow(direction);
          }
          if (this._animation != null) {
            requestAnimationFrame(this._animation);
          }
          i += 1;
        };
        this._animation();
      }
    }
  }

  onKeyUp (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      this._animation = null;
    }
  }

}
