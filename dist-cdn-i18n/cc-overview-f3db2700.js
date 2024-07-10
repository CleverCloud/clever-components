import{R as e}from"./resize-controller-3aadf1c4.js";import{s as t,x as r,i as n}from"./lit-element-98ed46d4.js";const a=[570,860,1150];class o extends t{static get properties(){return{mode:{type:String,reflect:!0}}}constructor(){super(),this.mode=null,new e(this,{widthBreakpoints:a})}render(){return r`
      <slot></slot>
    `}static get styles(){return n`
      :host {
        /*
          We ask the user to specify this number (if > 1)
          because the information is known and detecting it automatically and properly requires a MutationObserver
          to count them in the \` < slot >\` and it seems overkill.
        */
        --cc-overview-head-count: 1;

        display: grid;
        grid-gap: 1em;
      }

      /* region GRID LAYOUT */

      :host([w-lt-570]) {
        grid-template-columns: [main-start] 1fr [main-end];
      }

      :host([w-gte-570][w-lt-860]) {
        grid-template-columns: [main-start] 1fr 1fr [main-end];
      }

      :host([w-gte-860][w-lt-1150]) {
        grid-template-columns: [main-start] 1fr 1fr [main-end] 1fr;
      }

      :host([w-gte-1150]) {
        grid-template-columns: [main-start] 1fr 1fr 1fr [main-end] 1fr;
      }

      /* endregion */

      /* region GRID LAYOUT (app) */

      :host([mode='app'][w-lt-570]) {
        grid-template-rows: repeat(calc(var(--cc-overview-head-count) + 6), min-content) [main-start] 1fr [main-end];
      }

      :host([mode='app'][w-gte-570][w-lt-860]) {
        grid-template-rows: repeat(calc(var(--cc-overview-head-count) + 3), min-content) [main-start] 1fr [main-end];
      }

      :host([mode='app'][w-gte-860][w-lt-1150]) {
        grid-template-rows: repeat(calc(var(--cc-overview-head-count) + 1), min-content) 
          [main-start] min-content 1fr 1fr [main-end];
      }

      :host([mode='app'][w-gte-1150]) {
        grid-template-rows: repeat(calc(var(--cc-overview-head-count) + 1), min-content)
          [main-start] 1fr 1fr [main-end];
      }

      /* endregion */

      /* region GRID LAYOUT (orga) */

      :host([mode='orga'][w-lt-570]) {
        grid-template-rows: repeat(calc(var(--cc-overview-head-count) + 2), min-content) [main-start] 1fr [main-end];
      }

      :host([mode='orga'][w-gte-570][w-lt-860]) {
        grid-template-rows: repeat(calc(var(--cc-overview-head-count) + 1), min-content) [main-start] 1fr [main-end];
      }

      :host([mode='orga'][w-gte-860]) {
        grid-template-rows: repeat(calc(var(--cc-overview-head-count) + 0), min-content) 
          [main-start] 1fr 1fr [main-end];
      }

      /* endregion */

      /* .head TILE POSITION/SIZE */

      ::slotted(*.head) {
        grid-column: 1 / -1;
      }

      /* .main TILE POSITION/SIZE */

      ::slotted(*.main) {
        width: auto;
        height: auto;
        min-height: 25em;
        grid-column: main-start / main-end;
        grid-row: main-start / main-end;
      }
    `}}window.customElements.define("cc-overview",o);export{o as CcOverview};
