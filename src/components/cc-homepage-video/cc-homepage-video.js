import { css, html, LitElement } from 'lit';
import { iconRemixPlayFill } from '../../assets/cc-remix.icons.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block/cc-block.js';
import '../cc-icon/cc-icon.js';
import '../cc-link/cc-link.js';

/**
 * A component displaying a YouTube video thumbnail with a play button overlay.
 *
 * Clicking the play button replaces the thumbnail with an embedded YouTube iframe.
 *
 * @cssdisplay block
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
  }

  _onPlay() {
    this._playing = true;
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
      if (parsed.hostname.includes('youtube.com')) {
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

  render() {
    const videoId = this._extractVideoId(this.videoUrl);
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

    return html`
      <cc-block class="block">
        <div slot="header-title" class="header">${i18n('cc-homepage-video.title')}</div>
        <cc-link slot="header-right" href=${this.channelUrl}>${i18n('cc-homepage-video.link')}</cc-link>
        <div slot="content" class="video-container">
          ${this._playing
            ? html`
                <iframe
                  src=${embedUrl}
                  title=${i18n('cc-homepage-video.iframe-title')}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                ></iframe>
              `
            : html`
                <button class="thumbnail" @click=${this._onPlay}>
                  <img src=${thumbnailUrl} alt="" />
                  <div class="play-button">
                    <cc-icon .icon=${iconRemixPlayFill} size="xl" a11y-name=${i18n('cc-homepage-video.play')}></cc-icon>
                  </div>
                </button>
              `}
        </div>
      </cc-block>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        .block {
          border: solid 1px var(--cc-color-border-neutral-weak);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: block;
          padding: 1em;
        }

        .video-container {
          aspect-ratio: 16 / 9;
          margin-top: -0.6em;
          position: relative;
        }

        .video-container iframe {
          border: none;
          border-radius: 0.8em;
          height: 100%;
          width: 100%;
        }

        .thumbnail {
          background: none;
          border: none;
          border-radius: 0.8em;
          cursor: pointer;
          display: block;
          height: 100%;
          padding: 0;
          position: relative;
          width: 100%;
        }

        .thumbnail:focus-visible {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset);
        }

        .thumbnail img {
          border-radius: 0.8em;
          display: block;
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        .play-button {
          align-items: center;
          background: linear-gradient(135deg, #7b2ff7, #2196f3);
          border: solid 0.7em white;
          border-radius: 50%;
          color: #fff;
          display: flex;
          height: 4em;
          justify-content: center;
          left: 50%;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 4em;
        }

        .thumbnail:hover .play-button {
          background: linear-gradient(135deg, #6a1be0, #1a7fd4);
        }
      `,
    ];
  }
}

window.customElements.define('cc-homepage-video', CcHomepageVideo);
