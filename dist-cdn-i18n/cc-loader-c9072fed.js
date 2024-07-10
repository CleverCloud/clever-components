import{s as e,x as r,i as t}from"./lit-element-98ed46d4.js";import{l as a}from"./if-defined-cd9b1ec0.js";class s extends e{static get properties(){return{a11yName:{type:String,attribute:"a11y-name"}}}constructor(){super(),this.a11yName="Chargement en cours"}render(){const e=null==this.a11yName||0===this.a11yName.length?void 0:this.a11yName,t=null==e?{hidden:!0}:{label:e,role:"img",labelledby:"title"};return r`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="20 20 40 40"
           aria-hidden=${a(t.hidden)}
           aria-label=${a(t.label)}
           aria-labelledby=${a(t.labelledby)}
           role=${a(t.role)}
      >
        ${null!=e?r`<title id="title">${e}</title>`:""}
        <circle cx="40px" cy="40px" r="16px"></circle>
      </svg>
    `}static get styles(){return[t`
        :host {
          display: flex;
        }

        svg {
          width: 100%;
          max-width: 2.5em;
          height: 100%;
          max-height: 2.5em;
          margin: auto;
          animation: progress-circular-rotate 1.75s linear infinite;
        }

        circle {
          animation: progress-circular-dash 1.75s ease-in-out infinite;
          fill: transparent;
          stroke: var(--cc-loader-color, var(--cc-color-bg-primary-highlight, blue));
          stroke-linecap: round;
          stroke-width: 5px;
        }

        @keyframes progress-circular-rotate {

          0% {
            transform: rotate(0turn);
          }

          100% {
            transform: rotate(1turn);
          }
        }

        /* radius is set at 16px => perimeter: 100.53096491487 ~= 100 */
        @keyframes progress-circular-dash {

          0% {
            stroke-dasharray: 0, 100px;
            stroke-dashoffset: 0;
          }

          50% {
            stroke-dasharray: 80px, 100px;
            stroke-dashoffset: 0;
          }

          100% {
            stroke-dasharray: 80px, 100px;
            stroke-dashoffset: -100px;
          }
        }
      `]}}window.customElements.define("cc-loader",s);export{s as CcLoader};
