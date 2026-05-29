import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { iconRemixPlayFill } from '../../assets/cc-remix.icons.js';
import { i18n } from '../../translations/translation.js';
import '../cc-icon/cc-icon.js';
import '../cc-link/cc-link.js';

/**
 * A component displaying a YouTube video thumbnail with a play button overlay.
 *
 * Clicking the play button replaces the thumbnail with an embedded YouTube iframe.
 *
 * ## Sizing
 *
 * The embedded video always keeps a 16/9 ratio. Two layouts are supported:
 *
 * - **Width-driven (default):** give the component a width and let its height grow on its own. The video
 *   fills the width and its height follows the 16/9 ratio. Typical in a single-column layout.
 * - **Contained:** give the component both a width and a height (e.g. a grid cell whose height is imposed
 *   by a sibling) and set `--cc-homepage-video-container-type: size`. The 16/9 video is then scaled to fit
 *   within both dimensions and centered below the header.
 *
 * @cssdisplay grid
 *
 * @cssprop {normal|size|inline-size} --cc-homepage-video-container-type - Sizing mode of the video area. Defaults to `inline-size` (width-driven). Set to `size` when the component has an imposed height, to contain the 16/9 video within both dimensions.
 */
export class CcHomepageVideo extends LitElement {
  static get properties() {
    return {
      channelUrl: { type: String, attribute: 'channel-url' },
      videoUrl: { type: String, attribute: 'video-url' },
      _playing: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();

    /** @type {string} YouTube video URL (e.g. https://youtu.be/xxx or https://www.youtube.com/watch?v=xxx) */
    this.videoUrl = '';

    /** @type {string} URL to the YouTube channel */
    this.channelUrl = '';

    /** @type {boolean} */
    this._playing = false;

    /** @type {import('lit/directives/ref.js').Ref<HTMLIFrameElement>} */
    this._iframeRef = createRef();
  }

  /**
   * Extracts the video ID from a YouTube URL.
   * Supports youtu.be/ID, youtube.com/watch?v=ID, and youtube.com/embed/ID formats.
   * @param {string} url
   * @returns {string}
   */
  _extractVideoId(url) {
    try {
      const parsed = new URL(url);
      if (parsed.hostname === 'youtu.be') {
        return parsed.pathname.slice(1);
      }
      if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtube-nocookie.com')) {
        if (parsed.pathname.startsWith('/embed/')) {
          return parsed.pathname.split('/')[2];
        }
        return parsed.searchParams.get('v');
      }
    } catch {
      // not a valid URL
    }
    return 'xxxxxxxxxxx';
  }

  async _onPlay() {
    this._playing = true;
    await this.updateComplete;
    this._iframeRef.value.focus();
  }

  render() {
    const videoId = this._extractVideoId(this.videoUrl);
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

    return html`
      <div class="header">${i18n('cc-homepage-video.title')}</div>
      <cc-link href=${this.channelUrl}>${i18n('cc-homepage-video.link')}</cc-link>
      <div class="main">
        <div class="video-container">
          ${this._playing
            ? html`
                <iframe
                  ${ref(this._iframeRef)}
                  tabindex="-1"
                  src=${embedUrl}
                  title=${i18n('cc-homepage-video.iframe-title')}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                ></iframe>
              `
            : html`
                <img class="thumbnail" src=${thumbnailUrl} alt="" />
                <button class="play-button" @click=${this._onPlay}>
                  <cc-icon .icon=${iconRemixPlayFill} a11y-name=${i18n('cc-homepage-video.play')}></cc-icon>
                </button>
              `}
        </div>
      </div>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          /* Aspect ratio of the video area. Referenced twice below (height derivation + width clamp), hence a variable. */
          --video-aspect-ratio: 16 / 9;
          /* Diameter of the round play button overlay. */
          --play-icon-size: 4.5em;

          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          box-sizing: border-box;
          display: grid;
          gap: 2em;
          grid-template-columns: 1fr auto;
          grid-template-rows: auto 1fr;
          padding: 2em;
        }

        .header {
          align-items: center;
          color: var(--cc-color-text-primary-strongest);
          font-size: 1.2em;
          font-weight: bold;
        }

        .main {
          /*
           * The video area below is sized with container query units against this element. See the
           * component JSDoc for the two layouts; this is why the default matters here:
           * - inline-size: only the width is a query reference, cqh resolves against the viewport (so the
           *   height term of the min() is inert). Always safe, even without a definite height.
           * - size: both axes are query references, but a definite height is required or the container
           *   collapses. Hence "size" is opt-in (set by consumers) and "inline-size" is the default.
           */
          container-type: var(--cc-homepage-video-container-type, inline-size);
          display: grid;
          grid-column: 1 / -1;
          min-height: 0;
        }

        .video-container {
          /* Derives the height from the resolved width, keeping the video at a constant ratio. */
          aspect-ratio: var(--video-aspect-ratio);
          display: grid;
          /* Centers the video within .main, used when it is contained (smaller than the container). */
          margin: auto;
          /*
           * Pick the most constraining bound so the video always fits:
           * - 100cqw: never wider than the container.
           * - 100cqh * ratio: the width that keeps the video within the available height (height -> width).
           * In inline-size mode the second term is huge (cqh = viewport) and min() falls back to 100cqw.
           */
          width: min(100cqw, 100cqh * var(--video-aspect-ratio));
        }

        iframe,
        .thumbnail,
        .play-button {
          border-radius: 0.8em;
          /* All three share the single grid cell => the play button is stacked on top of the thumbnail. */
          grid-area: 1 / 1 / 2 / 2;
          height: 100%;
          overflow: hidden;
          width: 100%;
        }

        iframe {
          border: none;
        }

        .play-button {
          background: unset;
          border: none;
          cursor: pointer;
          display: block;
          font-family: inherit;
          font-size: unset;
          margin: 0;
          padding: 0;
        }

        .play-button:focus-visible {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset);
        }

        cc-icon {
          background: linear-gradient(135deg, #7b2ff7, #2196f3);
          border: 0.6em solid #fff;
          border-radius: 50%;
          box-sizing: border-box;
          color: #fff;
          height: var(--play-icon-size);
          padding: 0.6em;
          width: var(--play-icon-size);
        }

        .play-button:hover cc-icon {
          background: linear-gradient(135deg, #6a1be0, #1a7fd4);
        }
      `,
    ];
  }
}

window.customElements.define('cc-homepage-video', CcHomepageVideo);
