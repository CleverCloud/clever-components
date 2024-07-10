import{p as e}from"./i18n-number-a9c20d27.js";import"./cc-icon-f84255c7.js";import{j as t}from"./cc-remix.icons-d7d44eac.js";import{t as s,i}from"./info-tiles-8286a15a.js";import{s as a}from"./skeleton-68a3d018.js";import{s as r,x as l,i as o}from"./lit-element-98ed46d4.js";import{o as n}from"./class-map-1feb5cf7.js";import{l as c}from"./if-defined-cd9b1ec0.js";const m=e("fr","o"," ");const d=e=>{return[`CPUs : ${(t=e).cpus}`+(t.microservice?" (partagé)":""),t.gpus>0?`GPUs : ${t.gpus}`:"",`RAM : ${m(1024*t.mem*1024)}`].filter((e=>e)).join("\n");var t},p={minFlavor:{name:"??",cpus:0,gpus:0,mem:0,microservice:!1,monthlyCost:0},maxFlavor:{name:"?",cpus:0,gpus:0,mem:0,microservice:!1,monthlyCost:0},minInstances:0,maxInstances:0};class v extends r{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading"}}_formatFlavorName(e){return e.replace(/^ML_/,"")}_getFlavorDetails(e){return null==e.cpus?null:d({...e})}render(){const e="loading"===this.state.type,{minFlavor:s,maxFlavor:i,minInstances:a,maxInstances:r}="loaded"===this.state.type?this.state:p,o="loaded"===this.state.type||"loading"===this.state.type;return l`
      <div class="tile_title">${"Scalabilité"}</div>

      ${"error"===this.state.type?l`
        <div class="tile_message">
          <div class="error-message">
            <cc-icon .icon="${t}" a11y-name="${"Avertissement"}" class="icon-warning"></cc-icon>
            <p>${"Une erreur est survenue pendant le chargement de la configuration de scalabilité."}</p>
          </div>
        </div>
      `:""}

      ${o?l`
        <div class="tile_body">
          <div class="label">${"Taille"}</div>
          <div class="info">
            <div 
              class="size-label ${n({skeleton:e})}"
              title=${c(this._getFlavorDetails(s))}
            >
              ${this._formatFlavorName(s.name)}
            </div>
            <div class="separator"></div>
            <div 
              class="size-label ${n({skeleton:e})}"
              title=${c(this._getFlavorDetails(i))}
            >
              ${this._formatFlavorName(i.name)}
            </div>
          </div>
          <div class="label">${"Nombre"}</div>
          <div class="info">
            <div class="count-bubble ${n({skeleton:e})}">${a}</div>
            <div class="separator"></div>
            <div class="count-bubble ${n({skeleton:e})}">${r}</div>
          </div>
        </div>
      `:""}
    `}static get styles(){return[s,i,a,o`
        .tile_body {
          align-items: center;
          grid-column-gap: 2em;
          grid-row-gap: 1em;
          grid-template-columns: auto 1fr;
        }

        .info {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
        }

        .separator {
          width: 1.5em;
          flex: 1 1 0;
          border-top: 1px dashed var(--cc-color-border-neutral-strong, #8c8c8c);
        }

        [title] {
          cursor: help;
        }

        .error-message {
          display: grid;
          gap: 0.75em;
          grid-template-columns: min-content 1fr;
          text-align: left;
        }

        .error-message p {
          margin: 0;
        }

        .icon-warning {
          align-self: center;
          color: var(--cc-color-text-warning);

          --cc-icon-size: 1.25em;
        }
      `]}}window.customElements.define("cc-tile-scalability",v);export{v as CcTileScalability};
