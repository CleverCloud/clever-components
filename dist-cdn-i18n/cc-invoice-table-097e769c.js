import{b as t}from"./i18n-date-d99182e3.js";import{f as e}from"./i18n-number-a9c20d27.js";import{s as o}from"./i18n-sanitize-4edc4a2d.js";import"./cc-icon-f84255c7.js";import{x as r}from"./cc-remix.icons-d7d44eac.js";import{R as n}from"./resize-controller-3aadf1c4.js";import{s as i}from"./utils-aa566623.js";import{s}from"./skeleton-68a3d018.js";import{c as a,l as c}from"./cc-link-f2b8f554.js";import{s as l,x as d,i as m}from"./lit-element-98ed46d4.js";import{o as u}from"./class-map-1feb5cf7.js";const p="fr",b=["PENDING","PAYMENTHELD","WONTPAY"],h="PROCESSING",v=["PAID","CANCELED","REFUNDED"],g=[{emissionDate:"2020-01-01",number:"????????????",type:"INVOICE",status:"PENDING",total:{currency:"EUR",amount:10},downloadUrl:"",paymentUrl:"",invoiceHtml:""},{emissionDate:"2020-02-01",number:"????????????",type:"INVOICE",status:"PENDING",total:{currency:"EUR",amount:200},downloadUrl:"",paymentUrl:"",invoiceHtml:""},{emissionDate:"2020-03-01",number:"????????????",type:"INVOICE",status:"PENDING",total:{currency:"EUR",amount:3e3},downloadUrl:"",paymentUrl:"",invoiceHtml:""}];class f extends l{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading"},this._resizeController=new n(this)}_formatInvoices(t){return t.map((t=>{const e="CREDITNOTE"===t.type?-1:1;return{...t,total:{...t.total,amount:t.total.amount*e}}})).sort(i("emissionDate",!0))}render(){const t=this._resizeController.width>700,e="loading"===this.state.type,o="loaded"===this.state.type?this._formatInvoices(this.state.invoices):this._formatInvoices(g);return t?this._renderTable(e,o):this._renderList(e,o)}_renderTable(o,r){return d`
      <table>
        <tr>
          <th>${"Date d'émission"}</th>
          <th>${"Numéro"}</th>
          <th class="number">${"Total"}</th>
          <th></th>
        </tr>
        ${r.map((r=>d`
          <tr>
            <td>
              <span class="${u({skeleton:o})}">${(({date:e})=>`${t(p,e)}`)({date:r.emissionDate})}</span>
            </td>
            <td>
              <span class="${u({skeleton:o})}">${r.number}</span>
            </td>
            <td class="number">
              <code class="${u({skeleton:o,"credit-note":"CREDITNOTE"===r.type})}">
                ${(({amount:t})=>`${e(p,t)}`)({amount:r.total.amount})}
              </code>
            </td>
            <td>
              ${this._renderLinks(o,r)}
            </td>
          </tr>
        `))}
      </table>
    `}_renderList(n,i){return d`
      <div class="invoice-list">
        ${i.map((i=>d`
          <div class="invoice">
            <cc-icon class="invoice-icon" size="lg" .icon=${r}></cc-icon>
            <div class="invoice-text ${u({skeleton:n})}">
              ${(({number:r,date:n,amount:i})=>o`Facture <strong>${r}</strong> émise le <strong>${t(p,n)}</strong> pour un total de <code>${e(p,i)}</code>`)({number:i.number,date:i.emissionDate,amount:i.total.amount})}
              <br>
              ${this._renderLinks(n,i)}
            </div>
          </div>
        `))}
      </div>
    `}_renderLinks(t,e){return d`
      <div class="links">
        ${a(e.downloadUrl,"Télécharger le PDF",t)}
        ${b.includes(e.status)?d`
          ${a(e.paymentUrl,"Régler",t)}
        `:""}
      </div>
    `}static get styles(){return[s,c,m`
        :host {
          display: block;
        }

        /* region COMMON */
        /* we should use a class (something like "number-value") but it's not possible right now in i18n */

        code {
          font-family: var(--cc-ff-monospace, monospace);
        }

        .credit-note {
          font-style: italic;
        }

        .cc-link {
          white-space: nowrap;
        }

        .links {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1em;
        }

        /* endregion */

        /* region SMALL */

        .invoice-list {
          display: grid;
          gap: 1.5em;
        }

        .invoice {
          display: flex;
          line-height: 1.5em;
        }

        .invoice-icon,
        .invoice-text {
          margin-right: 0.5em;
        }

        .invoice-icon {
          --cc-icon-color: var(--cc-color-text-primary);

          flex: 0 0 auto;
        }

        .invoice-text {
          color: var(--cc-color-text-weak);
        }

        .invoice-text code,
        .invoice-text strong {
          color: var(--cc-color-text-strongest);
          font-weight: bold;
          white-space: nowrap;
        }

        .invoice-list .skeleton code,
        .invoice-list .skeleton strong {
          background-color: #bbb;
          color: transparent;
        }
        /* endregion */

        /* region BIG */

        table {
          overflow: hidden;
          border-collapse: collapse;
          border-radius: 5px;
        }

        th,
        td {
          padding: 0.5em 1em;
          text-align: left;
        }

        th {
          background-color: var(--cc-color-bg-neutral-alt, #eee);
          color: var(--cc-color-text-strongest);
        }

        td {
          background-color: var(--cc-color-bg-neutral);
          color: var(--cc-color-text-normal);
        }

        tr:not(:last-child) td {
          border-bottom: 1px solid var(--cc-color-border-neutral-weak, #eee);
        }

        /* applied on th and td */

        .number {
          text-align: right;
        }

        td.number {
          /* "-ø###,###.##" OR "-### ###,## ø" => 13ch */
          min-width: 13ch;
        }

        tr:hover td {
          background-color: var(--cc-color-bg-neutral-hovered, #f9f9f9);
        }

        table .skeleton {
          background-color: #bbb;
        }

        /* endregion */
      `]}}window.customElements.define("cc-invoice-table",f);export{f as CcInvoiceTable,b as PENDING_STATUSES,v as PROCESSED_STATUSES,h as PROCESSING_STATUS};
