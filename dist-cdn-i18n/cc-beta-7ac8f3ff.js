import{s as t,x as e,i as o}from"./lit-element-98ed46d4.js";class i extends t{static get properties(){return{fill:{type:Boolean,reflect:!0},position:{type:String,reflect:!0}}}constructor(){super(),this.fill=!1,this.position="top-left"}render(){return e`
      <slot></slot>
      <div class="beta">${"bêta"}</div>
    `}static get styles(){return[o`
        :host {
          position: relative;
          display: grid;
          overflow: hidden;
        }

        :host([fill]) ::slotted(*) {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }

        .beta {
          --height: 1.75em;
          --width: 8em;

          position: absolute;
          z-index: 2;
          width: var(--width);
          height: var(--height);
          background: var(--cc-color-bg-strong, #000);
          color: var(--cc-color-text-inverted, #fff);
          font-size: 0.85em;
          font-weight: bold;
          line-height: var(--height);
          text-align: center;
          transform: rotate(var(--r)) translateY(var(--translate));
        }

        :host([position^='top-']) .beta {
          --translate: 1.85em;

          top: calc(var(--height) / -2);
        }

        :host([position^='bottom-']) .beta {
          --translate: -1.85em;

          bottom: calc(var(--height) / -2);
        }

        :host([position$='-left']) .beta {
          left: calc(var(--width) / -2);
        }

        :host([position$='-right']) .beta {
          right: calc(var(--width) / -2);
        }

        :host([position='top-left']) .beta,
        :host([position='bottom-right']) .beta {
          --r: -45deg;
        }

        :host([position='bottom-left']) .beta,
        :host([position='top-right']) .beta {
          --r: 45deg;
        }
      `]}}window.customElements.define("cc-beta",i);export{i as CcBeta};
