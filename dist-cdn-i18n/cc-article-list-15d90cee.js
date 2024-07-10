import"./cc-article-card-8a12acd3.js";import"./cc-notice-9b1eec7a.js";import{s as e,x as t,i as c}from"./lit-element-98ed46d4.js";class r extends e{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading"}}render(){return"error"===this.state.type?t`
        <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des articles."}"></cc-notice>
      `:t`
      <div class="article-container">
        ${"loading"===this.state.type?t`
          ${new Array(9).fill(t`
            <cc-article-card></cc-article-card>
          `)}
        `:""}

        ${"loaded"===this.state.type?t`
          ${this.state.articles.map((e=>t`
            <cc-article-card .state=${{type:"loaded",...e}}></cc-article-card>
          `))}
        `:""}
      </div>
    `}static get styles(){return[c`
        :host {
          display: block;
        }

        .article-container {
          display: grid;
          gap: 1em;
          grid-template-columns: repeat(auto-fit, minmax(20em, 1fr));
        }
      `]}}window.customElements.define("cc-article-list",r);export{r as CcArticleList};
