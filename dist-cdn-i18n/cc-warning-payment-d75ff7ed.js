import{s as e}from"./i18n-sanitize-4edc4a2d.js";import{p as r}from"./i18n-string-3f556d8d.js";import{l as i}from"./cc-link-f2b8f554.js";import"./cc-notice-9b1eec7a.js";import{s as t,x as n,i as s}from"./lit-element-98ed46d4.js";const o=r("fr"),a=({orgaName:r,orgaBillingLink:i})=>e`<a href="${i}" aria-label="Se rendre sur la page de facturation - ${r}">Se rendre sur la page de facturation</a>`,d=1,m=2,u=3;class g extends t{static get properties(){return{errors:{type:Array},mode:{type:String}}}constructor(){super(),this.errors=[{type:d}],this.mode="billing"}_getOrgaError({type:e}){return e===d?{title:"Attention ! Vous n'avez aucun moyen de paiement enregistré",error:"Pour éviter tout risque de suspension de vos services et de suppression de vos données, merci d'ajouter un moyen de paiement valide et de le définir par défaut."}:e===m?{title:"Attention ! Vous avez des moyens de payments enregistrés, mais aucun d'entre eux n'est défini par défaut",error:"Pour éviter tout risque de suspension de vos services et de suppression de vos données, merci de définir un de vos moyen de paiement par défaut."}:e===u?{title:"Attention ! Votre moyen de paiement est expiré",error:"Pour éviter tout risque de suspension de vos services et de suppression de vos données, merci d'ajouter un moyen de paiement valide et de le définir par défaut."}:void 0}render(){const{title:e,error:r}="overview"===this.mode||"billing"===this.mode?this._getOrgaError(this.errors[0]):"",i="overview"===this.mode?a(this.errors[0]):"";return n`
        ${"home"===this.mode?n`
          <cc-notice
            .heading="${"Attention ! Quelque chose pose problème avec vos moyens de paiement."}"
            intent="warning"
          >
            <div slot="message" class="error-container">
              <span>${(({orgaCount:e})=>`Pour éviter tout risque de suspension de vos services et de suppression de vos données, merci de vérifier les informations de facturation liées ${o(e,"à l'organisation suivante","aux organisations suivantes")} :`)({orgaCount:this.errors.length})}</span>
              <ul>
                ${this.errors.map((e=>n`
                  <li>${this._renderHomeItem(e)}</li>
                `))}
              </ul>
            </div>
          </cc-notice>
        `:""}


        ${"overview"===this.mode||"billing"===this.mode?n`
          <cc-notice
            .heading="${e}"
            intent="warning"
          >
            <div slot="message">
              ${r}
              ${i}
            </div>
          </cc-notice>
        `:""}
    `}_renderHomeItem({type:r,orgaName:i,orgaBillingLink:t}){return r===d?n`
        ${(({orgaName:r})=>e`<strong>${r}</strong> n'a aucun moyen de paiement enregistré.`)({orgaName:i})}
        ${a({orgaName:i,orgaBillingLink:t})}
      `:r===m?n`
        ${(({orgaName:r})=>e`<strong>${r}</strong> a des moyens de payments enregistrés mais aucun d'entre eux n'est défini par défaut.`)({orgaName:i})}
        ${a({orgaName:i,orgaBillingLink:t})}
      `:r===u?n`
        ${(({orgaName:r})=>e`<strong>${r}</strong> a un moyen de paiement enregistré mais il est expiré.`)({orgaName:i})}
        ${a({orgaName:i,orgaBillingLink:t})}
      `:void 0}static get styles(){return[i,s`
        :host {
          display: block;
        }
        
        ul {
          padding: 0;
          margin: 0.5em 0 0 1.5em;
        }
        
        li {
          margin-top: 0.5em;
        }
      `]}}window.customElements.define("cc-warning-payment",g);export{g as CcWarningPayment};
