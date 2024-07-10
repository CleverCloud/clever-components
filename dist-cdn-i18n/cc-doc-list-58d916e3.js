import"./cc-doc-card-0f2c27f5.js";import"./cc-notice-9b1eec7a.js";import{s as e,x as t,i as c}from"./lit-element-98ed46d4.js";class r extends e{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading"}}render(){return"error"===this.state.type?t`
        <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement de la documentation"}"></cc-notice>
      `:t`
      <div class="doc-wrapper">
        ${"loading"===this.state.type?t`
          ${new Array(9).fill(t`
            <cc-doc-card></cc-doc-card>
          `)}
        `:""}

        ${"loaded"===this.state.type?t`
          ${this.state.docs.map((e=>t`
            <cc-doc-card .state=${{type:"loaded",...e}}></cc-doc-card>
          `))}
        `:""}
      </div>
    `}static get styles(){return[c`
        :host {
          display: block;
        }

        .doc-wrapper {
          display: grid;
          gap: 1em;
          grid-template-columns: repeat(auto-fit, minmax(20em, 1fr));
        }
      `]}}window.customElements.define("cc-doc-list",r);export{r as CcDocList};
