import"./cc-block-025e5b2d.js";import"./cc-block-section-3a3736ca.js";import"./cc-button-fafeef50.js";import"./cc-notice-9b1eec7a.js";import"./cc-select-9160eb0c.js";import"./cc-toggle-34554172.js";import{R as e}from"./resize-controller-3aadf1c4.js";import{u as t,s as c}from"./utils-aa566623.js";import{PENDING_STATUSES as i,PROCESSING_STATUS as s,PROCESSED_STATUSES as n}from"./cc-invoice-table-097e769c.js";import{s as o,x as l,i as a}from"./lit-element-98ed46d4.js";const r=[520];function d(e){const t=new Date(e).getUTCFullYear();return String(t)}class u extends o{static get properties(){return{state:{type:Object},_yearFilter:{type:String,state:!0}}}constructor(){super(),this.state={type:"loading"},this._yearFilter=null,new e(this,{widthBreakpoints:r})}_onYearFilterValue({detail:e}){this._yearFilter=e}render(){if("error"===this.state.type)return this._renderView(l`
        <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des factures."}"></cc-notice>
      `);if("loading"===this.state.type)return this._renderView(l`
        <cc-block-section>
          <div slot="title">${"Factures en attente de paiement"}</div>
          <cc-invoice-table></cc-invoice-table>
        </cc-block-section>

        <cc-block-section>
          <div slot="title">${"Factures réglées"}</div>
          <cc-invoice-table></cc-invoice-table>
        </cc-block-section>
      `);const e={type:"loaded",invoices:this.state.invoices.filter((e=>i.includes(e.status)))},o={type:"loaded",invoices:this.state.invoices.filter((e=>e.status===s))},a={type:"loaded",invoices:this.state.invoices.filter((e=>n.includes(e.status)))},r=a.invoices.map((e=>d(e.emissionDate))).flatMap(t),u=r.map((e=>({label:e,value:e}))).sort(c("label")),v=null==this._yearFilter?function(e){const t=e.map((e=>Number(e))),c=Math.max(...t);return String(c)}(r):this._yearFilter,p={type:"loaded",invoices:a.invoices.filter((e=>d(e.emissionDate)===v))},m=p.invoices.length>0&&u.length>1;return this._renderView(l`
      <cc-block-section>
        <div slot="title">${"Factures en attente de paiement"}</div>
        ${e.invoices.length>0?l`
          <cc-invoice-table .state=${e}></cc-invoice-table>
        `:""}
        ${0===e.invoices.length?l`
          <div class="empty-msg">${"Il n'y a aucune facture en attente de paiement pour le moment."}</div>
        `:""}
      </cc-block-section>

      ${o.invoices.length>0?l`
        <cc-block-section>
          <div slot="title">${"Factures dont le paiement est en cours de validation"}</div>
          <cc-invoice-table .state=${o}></cc-invoice-table>
        </cc-block-section>
      `:""}

      <cc-block-section>
        <div slot="title">${"Factures réglées"}</div>
        ${m?l`
          <cc-toggle
            legend=${"Année :"}
            .choices=${u}
            value=${v}
            inline
            @cc-toggle:input=${this._onYearFilterValue}
          ></cc-toggle>
          <cc-select
            label=${"Année :"}
            .options=${u}
            value=${v}
            inline
            @cc-select:input=${this._onYearFilterValue}
          ></cc-select>
        `:""}
        ${p.invoices.length>0?l`
          <cc-invoice-table .state=${p}></cc-invoice-table>
        `:""}
        ${0===p.invoices.length?l`
          <div class="empty-msg ">${"Il n'y a aucune facture réglée pour le moment."}</div>
        `:""}
      </cc-block-section>
    `)}_renderView(e){return l`
      <cc-block>
        <div slot="title">${"Factures"}</div>
        ${e}
      </cc-block>
    `}static get styles(){return[a`
        :host {
          display: block;
        }

        cc-toggle {
          justify-self: start;
        }

        :host([w-lt-520]) cc-toggle {
          display: none;
        }

        :host([w-gte-520]) cc-select {
          display: none;
        }

        cc-select {
          width: max-content;
        }

        .empty-msg {
          color: var(--cc-color-text-weak);
          font-style: italic;
        }
      `]}}window.customElements.define("cc-invoice-list",u);export{u as CcInvoiceList};
