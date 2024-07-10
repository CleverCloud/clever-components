import"./cc-block-025e5b2d.js";import"./cc-notice-9b1eec7a.js";import"./cc-icon-f84255c7.js";import{i as e}from"./cc-clever.icons-e2a98bd6.js";import{n as t,o as r}from"./cc-remix.icons-d7d44eac.js";import{s as a}from"./skeleton-68a3d018.js";import{s as o,x as i,i as s}from"./lit-element-98ed46d4.js";import{o as c}from"./class-map-1feb5cf7.js";const n={cpus:t,vcpus:t,disk:r,memory:e,ram:e},l=["cpus","vcpus","memory","disk"],d=[{name:"??????",value:"????????"},{name:"????",value:"??"},{name:"?????",value:"????"},{name:"???????",value:"????????"}];class u extends o{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading"}}_getFeatureName(e,t){return"disk"===e?"Disque":"nodes"===e?"Nœuds":"memory"===e?"Mémoire":t}_getFeatureValue(e,t){return"dedicated"===e?"Dédié":"no"===e?"Non":"yes"===e?"Oui":t}_sortFeatures(e){const t=e.slice(0);return t.sort(((e,t)=>{const r=l.indexOf(e.name.toLowerCase())+1||l.length+1,a=l.indexOf(t.name.toLowerCase())+1||l.length+1;return String(r).localeCompare(String(a),void 0,{numeric:!0})})),t}render(){const e="loading"===this.state.type,t=("loaded"===this.state.type?this.state.features:d).map((e=>{const t=e.name.toLowerCase(),r=e.value.toLowerCase();return{...e,icon:n[t],name:this._getFeatureName(t,e.name),value:this._getFeatureValue(r,e.value)}})),r=this._sortFeatures(t),a="loaded"===this.state.type||e;return i`
      <cc-block>
        <div slot="title">${"Spécifications"}</div>
          
        <div>${"Ci-dessous, les spécifications de votre add-on. Elles peuvent évoluer et une migration de l'add-on peut être nécessaire pour en bénéficier."}</div>
        
        ${"error"===this.state.type?i`
          <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des spécifications de l'add-on"}"></cc-notice>
        `:""}
        
        ${a?i`
          <div class="feature-list">
            ${r.map((t=>i`
              <div class="feature ${c({skeleton:e})}">
                ${null!=t.icon?i`
                  <div class="feature-icon">
                    <cc-icon size="lg" class="feature-icon_img" .icon="${t.icon}"></cc-icon>
                  </div>
                `:""}
                <div class="feature-name">${t.name}</div>
                <div class="feature-value">${t.value}</div>
              </div>
            `))}
          </div>
        `:""}
      </cc-block>
    `}static get styles(){return[a,s`
        :host {
          display: block;
        }

        .feature-list {
          --bdw: 2px;
          --color: var(--cc-color-bg-primary);
          --padding: 0.6em;

          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .feature {
          display: flex;
          flex-wrap: wrap;
          border: var(--bdw) solid var(--color);
          background-color: var(--color);
          border-radius: calc(2 * var(--bdw));
        }

        .feature-icon {
          display: inline-flex;
          width: 1.3em;
          align-items: center;
          margin-inline-start: var(--padding);
        }

        .feature-icon_img {
          --cc-icon-color: var(--cc-color-text-inverted);
        }

        .feature-name,
        .feature-value {
          box-sizing: border-box;
          flex: 1 1 auto;
          padding: calc(var(--padding) / 2) var(--padding);
          font-weight: bold;
          text-align: center;
        }

        .feature-name {
          color: var(--cc-color-text-inverted, #fff);
        }

        .skeleton .feature-name {
          color: var(--color);
        }

        .feature-value {
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--bdw);
          color: var(--color);
        }

        .skeleton .feature-value {
          color: #fff;
        }
      `]}}window.customElements.define("cc-addon-features",u);export{u as CcAddonFeatures};
