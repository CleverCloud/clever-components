import{b as t}from"./i18n-date-d99182e3.js";import{f as e}from"./i18n-number-a9c20d27.js";import{s}from"./i18n-sanitize-4edc4a2d.js";import"./cc-block-025e5b2d.js";import"./cc-html-frame-c7329d21.js";import{o as r}from"./cc-icon-f84255c7.js";import"./cc-notice-9b1eec7a.js";import{x as o}from"./cc-remix.icons-d7d44eac.js";import{s as a}from"./skeleton-68a3d018.js";import{c,l as i}from"./cc-link-f2b8f554.js";import{s as n,x as m,i as l}from"./lit-element-98ed46d4.js";import{o as d}from"./class-map-1feb5cf7.js";const p={emissionDate:"2020-01-01",number:"????????????",status:"PENDING",amount:10};class f extends n{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading"}}render(){const a=this.state.number,i=null==a,n=i?p.number:a,l=i||"loading"===this.state.type,f=l?p:this.state,u=`Facture ${n}`;return m`
      <cc-block .icon=${o} class=${d({"has-errors":"error"===this.state.type})}>
        <div slot="title">
          ${i?m`
            ${"Facture"} <span class="skeleton">${n}</span>
          `:u}
        </div>
        
        ${"error"===this.state.type?m`
          <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement de la facture."}"></cc-notice>
        `:""}

        ${"error"!==this.state.type?m`
          <div slot="button">
            ${c(f.downloadUrl,"Télécharger le PDF",l)}
          </div>
          <div class="info">
            <em class=${d({skeleton:l})}>
              ${(({date:r,amount:o})=>s`Cette facture a été émise le <strong>${t("fr",r)}</strong> pour un total de <strong>${e("fr",o)}</strong>.`)({date:f.emissionDate,amount:f.amount})}
            </em>
          </div>
          <cc-html-frame class="frame" ?loading="${l}" iframe-title="${u}">
            ${null!=f.invoiceHtml?r(`<template>${f.invoiceHtml}</template>`):""}
          </cc-html-frame>
        `:""}
      </cc-block>
    `}static get styles(){return[i,a,l`
        :host {
          display: block;
        }

        [slot='button'] {
          align-self: start;
          margin-left: 1em;
        }

        cc-block {
          --cc-icon-color: var(--cc-color-text-primary);
        }

        .has-errors {
          --cc-skeleton-state: paused;
        }

        .skeleton {
          background-color: #bbb;
        }

        .info,
        .frame {
          justify-self: center;
        }

        .frame {
          width: 100%;
          max-width: 22cm;
          height: 31cm;
          /* height and max-width are roughly set to have a standard letter / A4 paper ratio */
          box-shadow: 0 0 0.5em rgb(0 0 0 / 40%);
        }
      `]}}window.customElements.define("cc-invoice",f);export{f as CcInvoice};
