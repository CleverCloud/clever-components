import"./cc-button-fafeef50.js";import"./cc-icon-f84255c7.js";import{d as e}from"./cc-logs-fa2bc153.js";import"./cc-popover-d4d407cc.js";import"./cc-select-9160eb0c.js";import"./cc-toggle-34554172.js";import{I as t,J as a,K as i,z as s,L as r}from"./cc-remix.icons-d7d44eac.js";import{a as o}from"./ansi-palette-style-b61eb317.js";import{d as n}from"./events-4c8e3503.js";import{D as l,T as c}from"./date-displayer-3095b7b1.js";import{s as d,x as h,i as g}from"./lit-element-98ed46d4.js";import{e as p,n as m}from"./ref-948c5e44.js";import{o as b}from"./class-map-1feb5cf7.js";const u={default:o(e),"One Light":o({foreground:"#2A2B32",background:"#F8F8F8","background-hover":"#EEEEEE","background-selected":"#E4E4E4",black:"#000000",red:"#D13B38",green:"#3B813D",yellow:"#855504",blue:"#315EEE",magenta:"#930092",cyan:"#0E6FAD",white:"#8E8F96","bright-black":"#2A2B32","bright-red":"#D13B38","bright-green":"#3B813D","bright-yellow":"#855504","bright-blue":"#315EEE","bright-magenta":"#930092","bright-cyan":"#0E6FAD","bright-white":"#FFFEFE"}),"Tokyo Night Light":o({foreground:"#565A6E",background:"#D5D6DB","background-hover":"#CBCCD1","background-selected":"#C1C2C7",black:"#0F0F14",red:"#8C4351",green:"#485E30",yellow:"#855215",blue:"#34548A",magenta:"#5A4A78",cyan:"#0F4B6E",white:"#343B58","bright-black":"#9699A3","bright-red":"#8C4351","bright-green":"#485E30","bright-yellow":"#855215","bright-blue":"#34548A","bright-magenta":"#5A4A78","bright-cyan":"#0F4B6E","bright-white":"#343B58"}),"Night Owl":o({foreground:"#D6DEEB",background:"#011627","background-hover":"#0B2031","background-selected":"#152A3B",black:"#011627",red:"#EF5350",green:"#22DA6E",yellow:"#ADDB67",blue:"#82AAFF",magenta:"#C792EA",cyan:"#21C7A8",white:"#FFFFFF","bright-black":"#575656","bright-red":"#EF5350","bright-green":"#22DA6E","bright-yellow":"#FFEB95","bright-blue":"#82AAFF","bright-magenta":"#C792EA","bright-cyan":"#7FDBCA","bright-white":"#FFFFFF"}),Everblush:o({foreground:"#DADADA",background:"#141B1E","background-hover":"#1E2528","background-selected":"#282F32",black:"#232A2D",red:"#E57474",green:"#8CCF7E",yellow:"#E5C76B",blue:"#67B0E8",magenta:"#C47FD5",cyan:"#6CBFBF",white:"#B3B9B8","bright-black":"#2D3437","bright-red":"#EF7E7E","bright-green":"#96D988","bright-yellow":"#F4D67A","bright-blue":"#71BAF2","bright-magenta":"#CE89DF","bright-cyan":"#67CBE7","bright-white":"#BDC3C2"}),Hyoob:o({foreground:"#FFFFFF",background:"#000000","background-hover":"#1E1E1E","background-selected":"#2B2B2B",black:"#000000",red:"#FF4040",green:"#90AF7D",yellow:"#FFFF66",blue:"#9999FF",magenta:"#FF4BB9",cyan:"#3AEEE0",white:"#FFFFFF","bright-black":"#BBBBBB","bright-red":"#FF4040","bright-green":"#90AF7D","bright-yellow":"#FFFF66","bright-blue":"#9999FF","bright-magenta":"#FF4BB9","bright-cyan":"#3AEEE0","bright-white":"#FFFFFF"})};class F extends d{static get properties(){return{dateDisplay:{type:String,attribute:"date-display"},follow:{type:Boolean},limit:{type:Number},logs:{type:Array},metadataDisplay:{type:Object},messageFilter:{type:String,attribute:"message-filter"},messageFilterMode:{type:String,attribute:"message-filter-mode"},metadataFilter:{type:Array,attribute:"metadata-filter"},metadataRenderers:{type:Object},palette:{type:String},stripAnsi:{type:Boolean,attribute:"strip-ansi"},timezone:{type:String},wrapLines:{type:Boolean,attribute:"wrap-lines"}}}constructor(){super(),this.dateDisplay="datetime-iso",this.follow=!1,this.limit=null,this.logs=[],this.messageFilter=null,this.messageFilterMode="loose",this.metadataDisplay={},this.metadataFilter=[],this.metadataRenderers={},this.palette="default",this.stripAnsi=!1,this.timezone="UTC",this.wrapLines=!1,this._logsRef=p(),this._resolvedMetadataRenderers={}}appendLogs(e){this._logsRef.value?.appendLogs(e)}clear(){this._logsRef.value?.clear()}_onScrollToBottomButtonClick(){this._logsRef.value?.scrollToBottom()}_onPaletteChange({detail:e}){this.palette=e,n(this,"option-change",{name:"palette",value:this.palette})}_onStripAnsiChange(e){this.stripAnsi=e.target.checked,n(this,"option-change",{name:"strip-ansi",value:this.stripAnsi})}_onWrapLinesChange(e){this.wrapLines=e.target.checked,n(this,"option-change",{name:"wrap-lines",value:this.wrapLines})}_onDateDisplayChange({detail:e}){this.dateDisplay=e,n(this,"option-change",{name:"date-display",value:this.dateDisplay})}_onTimezoneChange({detail:e}){this.timezone=e,n(this,"option-change",{name:"timezone",value:this.timezone})}_onMetadataChange(e){const t=e.target.dataset.name,a=!e.target.checked;this.metadataDisplay={...this.metadataDisplay,[t]:{...this.metadataDisplay[t],hidden:a}};const i=Object.fromEntries(Object.entries(this.metadataDisplay).map((([e,t])=>[e,!t.hidden])));n(this,"option-change",{name:"metadata-display",value:i})}_resolveMetadataRenderers(e,t){return Object.fromEntries(Object.entries(e).map((([e,a])=>{const i=t[e];return[e,null!=i&&i.hidden?{hidden:!0}:a]})))}_getDateDisplayLabel(e){return"none"===e?"Ne pas afficher":"datetime-iso"===e?"Date et heure ISO":"time-iso"===e?"Heure ISO":"datetime-short"===e?"Date et heure":"time-short"===e?"Heure":void 0}_getTimezoneLabel(e){return"UTC"===e?"UTC":"local"===e?"Heure locale":void 0}_getPaletteLabel(e){return"default"===e?"Thème par défaut":e}willUpdate(e){(e.has("metadataRenderers")||e.has("metadataDisplay"))&&(this._resolvedMetadataRenderers=this._resolveMetadataRenderers(this.metadataRenderers,this.metadataDisplay))}render(){return h`
      <div class="header"><slot name="header"></slot></div>

      <cc-button
        class="header-scroll-button"
        .icon=${t}
        a11y-name="${"Défiler vers le bas"}"
        hide-text
        @cc-button:click=${this._onScrollToBottomButtonClick}
      ></cc-button>

      <cc-popover
        class="header-options-popover"
        .icon=${a}
        a11y-name="${"Options"}"
        hide-text
        position="bottom-right"
      >
        <div class="options">
          ${this._renderDisplayOptions()}
          ${this._renderDateOptions()}
          ${this._renderMetadataOptions()}
        </div>
      </cc-popover>

      <cc-logs-beta
        class="logs"
        ${m(this._logsRef)}
        .dateDisplay=${this.dateDisplay}
        ?follow=${this.follow}
        .limit=${this.limit}
        .logs=${this.logs}
        .messageFilter=${this.messageFilter}
        .messageFilterMode=${this.messageFilterMode}
        .metadataFilter=${this.metadataFilter}
        .metadataRenderers=${this._resolvedMetadataRenderers}
        ?strip-ansi=${this.stripAnsi}
        style=${u[this.palette]}
        .timezone=${this.timezone}
        ?wrap-lines=${this.wrapLines}
      ></cc-logs-beta>
    `}_renderDisplayOptions(){const e=Object.entries(u).map((([e])=>({label:this._getPaletteLabel(e),value:e})));return h`
      <div class="options-header">
        <cc-icon .icon=${i} size="lg"></cc-icon>
        <span>${"Affichage"}</span>
      </div>
      <div class="options-group">
        <cc-select
          label="${"Thème"}"
          .options=${e}
          .value=${this.palette}
          @cc-select:input=${this._onPaletteChange}
        ></cc-select>

        <label for="strip-ansi">
          <input id="strip-ansi"
                 type="checkbox"
                 @change=${this._onStripAnsiChange}
                 .checked=${this.stripAnsi}> ${"Désactiver les séquences ANSI"}
        </label>

        <label for="wrap-lines">
          <input id="wrap-lines"
                 type="checkbox"
                 @change=${this._onWrapLinesChange}
                 .checked=${this.wrapLines}> ${"Forcer le retour à la ligne"}
        </label>
      </div>`}_renderDateOptions(){const e=l.map((e=>({label:this._getDateDisplayLabel(e),value:e}))),t=c.map((e=>({label:this._getTimezoneLabel(e),value:e})));return h`
      <div class="options-header">
        <cc-icon .icon=${s} size="lg"></cc-icon>
        <span>${"Date"}</span>
      </div>
      <div class="options-group">
        <cc-select
          label="${"Format de date"}"
          .options=${e}
          .value=${this.dateDisplay}
          @cc-select:input=${this._onDateDisplayChange}
        ></cc-select>

        <cc-select
          label="${"Zone"}"
          .options=${t}
          .value=${this.timezone}
          @cc-select:input=${this._onTimezoneChange}
        ></cc-select>
      </div>
    `}_renderMetadataOptions(){const e=Object.entries(this.metadataDisplay??{});return 0===e.length?null:h`
      <div class="options-header">
        <cc-icon .icon=${r} size="lg"></cc-icon>
        <span>${"Métadonnées"}</span>
      </div>
      <div class="options-group">
        ${e.map((([e,t])=>h`
            <label
              for="metadata-${e}"
              class=${b({span:null==t.icon})}
            >
              <input id="metadata-${e}"
                     type="checkbox"
                     data-name="${e}"
                     @change=${this._onMetadataChange}
                     .checked=${!t.hidden}> ${t.label}
            </label>
          `))}
      </div>
    `}static get styles(){return[g`
        :host {
          display: grid;
          align-items: center;
          column-gap: 0.35em;
          grid-template-areas: 
            'header scroll-button options-popover'
            'logs   logs          logs';
          grid-template-columns: 1fr auto auto;
          grid-template-rows: max-content 1fr;
          row-gap: 0.5em;
        }

        .header {
          grid-area: header;
        }

        .header-scroll-button {
          grid-area: scroll-button;
        }

        .header-options-popover {
          grid-area: options-popover;
        }

        .logs {
          align-self: normal;
          grid-area: logs;
        }

        .options {
          margin: 0.5em 0.75em;
          white-space: nowrap;
        }

        .options-header {
          display: grid;
          width: 100%;
          align-items: center;
          color: var(--cc-color-text-weak, #333);
          font-weight: bold;
          grid-gap: 0.5em;
          grid-template-columns: auto auto 1fr;
        }

        .options-header:not(:first-of-type) {
          margin-top: 1.85em;
        }

        .options-header::after {
          height: 1px;
          background-color: var(--cc-color-text-weak, #333);
          content: '';
        }

        .options-group {
          display: grid;
          margin: 1em 0.75em 0.75em;
          grid-template-columns: minmax(max-content, 1fr);
          row-gap: 0.75em;
        }

        input[type='checkbox'] {
          width: 1em;
          height: 1em;
          margin: 0;
        }

        input[type='checkbox']:focus {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }
      `]}}window.customElements.define("cc-logs-control-beta",F);export{F as CcLogsControl};
