import{p as e}from"./i18n-string-3f556d8d.js";import"./cc-badge-e1a0f4b6.js";import"./cc-button-fafeef50.js";import"./cc-icon-f84255c7.js";import"./cc-loader-c9072fed.js";import"./cc-notice-9b1eec7a.js";import{T as t,U as o}from"./cc-remix.icons-d7d44eac.js";import{a as s}from"./ansi-palette-style-b61eb317.js";import{M as n,a as i}from"./date-displayer-3095b7b1.js";import{x as a,i as l,r,s as c}from"./lit-element-98ed46d4.js";import{h as d}from"./dom-ad431943.js";import{d as g}from"./events-4c8e3503.js";import{b as h}from"./notifications-1d2a2395.js";import{i as p}from"./utils-aa566623.js";import{L as u}from"./logs-controller-d4586a2c.js";import{LogsInputController as m}from"./logs-input-controller-1cd6b05a.js";import{e as f,n as _}from"./ref-948c5e44.js";import{o as b}from"./class-map-1feb5cf7.js";const y=e("fr");function w({onlyFirst:e=!1}={}){const t=["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)","(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"].join("|");return new RegExp(t,e?void 0:"g")}let x;const v=[{name:"bold",code:1,escapes:[21,22],style:"font-weight: bold"},{name:"dim",code:2,escapes:[21,22],style:"opacity: 0.5"},{name:"italic",code:3,escapes:[23],style:"font-style: italic"},{name:"underline",code:4,escapes:[24],style:"text-decoration: underline"},{name:"inverse",code:7,escapes:[27]},{name:"hidden",code:8,escapes:[28],style:"display: none"},{name:"strikethrough",code:9,escapes:[29],style:"text-decoration: line-through;"}],C=[{name:"black",code:30},{name:"red",code:31},{name:"green",code:32},{name:"yellow",code:33},{name:"blue",code:34},{name:"magenta",code:35},{name:"cyan",code:36},{name:"white",code:37},{name:"bright-black",code:90},{name:"bright-red",code:91},{name:"bright-green",code:92},{name:"bright-yellow",code:93},{name:"bright-blue",code:94},{name:"bright-magenta",code:95},{name:"bright-cyan",code:96},{name:"bright-white",code:97}],$=new Map;function F(e){return e.replace(w(),"")}v.forEach((e=>{$.set(e.name,{...e,type:"effect"})})),C.forEach((e=>{const t=`text-${e.name}`,o=`bg-${e.name}`,s=e.code,n=e.code+10;$.set(t,{name:t,code:s,escapes:[39],type:"color"}),$.set(o,{name:o,code:n,escapes:[49],type:"color"})}));const S=[l`
    .ansi-reset {
      background-color: var(--cc-color-ansi-background);
      color: var(--cc-color-ansi-foreground);
      font-style: normal;
      font-weight: normal;
      opacity: 1;
      text-decoration: none;
    }

    .ansi-inverse {
      background-color: var(--cc-color-ansi-foreground);
      color: var(--cc-color-ansi-background);
    }
  `,...[...v.map((e=>null!=e.style?`.ansi-${e.name} {${e.style};}`:null)).filter((e=>null!=e)),...C.map((e=>{const t=e.name,o=`var(--cc-color-ansi-${t})`;return`\n          .ansi-text-${t} {\n            color: ${o};\n          }\n          .ansi-text-${t}.ansi-inverse {\n            background-color: ${o} !important;\n          }\n          .ansi-bg-${t} {\n            background-color: ${o};\n          }\n          .ansi-bg-${t}.ansi-inverse {\n            color: ${o} !important;\n          }`}))].map(r)];class D{constructor(){this.codeToStyle=new Map,this.escapeCodes=new Map,this.cache=new n((e=>this._doParse(e)),1e3),this._init()}_init(){const e=new Map,t=(t,o,s)=>{const n=z(o);this.codeToStyle.set(n,t),s.forEach((o=>{const s=z(o);L(this.escapeCodes,s,t),L(e,s,n)})),L(this.escapeCodes,z(""),t),L(this.escapeCodes,z(0),t)};$.forEach((e=>{t(e.name,e.code,e.escapes)}));for(const t of e.values())t.forEach((e=>{t.forEach((t=>{e!==t&&L(this.escapeCodes,e,this.codeToStyle.get(t))}))}))}parse(e){return this.cache.get(e)}_doParse(e){const t=[];let o=e;const s=[];let n=w().exec(o);for(;null!=n;){n.index>0&&t.push({styles:s.slice(0),text:o.substring(0,n.index)});(i=n[0],i.slice(2,i.length-1)).split(";").map((e=>z(e))).forEach((e=>{this.escapeCodes.get(e)?.forEach((e=>{k(s,e)})),this.codeToStyle.has(e)&&s.push(this.codeToStyle.get(e))})),o=o.substring(n.index+n[0].length),n=w().exec(o)}var i;return o.length>0&&t.push({styles:s,text:o}),t}}function L(e,t,o){e.has(t)||e.set(t,new Set),e.get(t).add(o)}function k(e,t){const o=e.indexOf(t);o>=0&&e.splice(o,1)}function z(e){return`[${e}m`}var E={foreground:"#000000",background:"#FFFFFF","background-hover":"#F5F5F5","background-selected":"#EBEBEB",black:"#000000",red:"#990000",green:"#0C7814",yellow:"#6D6B12",blue:"#0000B2",magenta:"#B200B2",cyan:"#28757B",white:"#BFBFBF","bright-black":"#666666","bright-red":"#D60000","bright-green":"#00D900","bright-yellow":"#E5E500","bright-blue":"#0000FF","bright-magenta":"#E500E5","bright-cyan":"#00E5E5","bright-white":"#E5E5E5"};function R(e){const t=e.join("\n"),o=function(e){if(0===e.length)return"";if(1===e.length)return`<code>${e[0]}</code>`;return`<pre>${e.join("<br>")}</pre>`}(e);return{text:t,html:o}}const M={hidden:!1,intent:"neutral",showName:!1,size:"auto",strong:!1},I=s(Object.fromEntries(Object.entries(E).map((([e,t])=>[e,`var(--cc-color-ansi-default-${e}, ${t})`]))));class j{constructor(e,t){this._callback=e,this._timeout=t,this._timestamp=0}disable(){this._timestamp=(new Date).getTime()}call(){if((new Date).getTime()-this._timestamp>this._timeout)return this._callback()}}class B extends c{static get properties(){return{follow:{type:Boolean},limit:{type:Number},logs:{type:Array},messageFilter:{type:String,attribute:"message-filter"},messageFilterMode:{type:String,attribute:"message-filter-mode"},metadataFilter:{type:Array,attribute:"metadata-filter"},metadataRenderers:{type:Object},stripAnsi:{type:Boolean,attribute:"strip-ansi"},dateDisplay:{type:String,attribute:"date-display"},timezone:{type:String},wrapLines:{type:Boolean,attribute:"wrap-lines"},_horizontalScrollbarHeight:{type:Number,state:!0}}}constructor(){super(),this.follow=!1,this.limit=null,this.logs=[],this.messageFilter=null,this.messageFilterMode="loose",this.metadataFilter=[],this.metadataRenderers=null,this.stripAnsi=!1,this.dateDisplay="datetime-iso",this.timezone="UTC",this.wrapLines=!1,this._draggedLogIndex=null,this._focusedIndexIsInDom=!1,this._followSynchronizer=new j((()=>this._synchronizeFollow()),150),this._inputCtrl=new m(this),this._logsCtrl=new u(this),this._logsRef=f(),this._dateDisplayer=this._resolveDateDisplayer(),this._visibleRange={first:-1,last:-1},this._horizontalScrollbarHeight=0,this._onMouseDownGutter=this._onMouseDownGutter.bind(this),this._onFocusLog=this._onFocusLog.bind(this)}appendLogs(e){this._followSynchronizer.disable(),this._logsCtrl.append(e)}clear(){this._logsCtrl.clear()}scrollToBottom(){this._setFollow(!0)}_resolveDateDisplayer(){return new i(this.dateDisplay,this.timezone)}_onFocusLogsContainer(){this._focusedIndexIsInDom&&this._logsCtrl.clearFocus(!1)}_onFocusLog(e){const t=e.target,o=Number(t.closest(".log").dataset.index);this._logsCtrl.focus(o,!1)}_onFocusedLogChange(e){if(null==e)this._logsRef.value.focus();else{this._logsRef.value.element(e)?.scrollIntoView({block:"nearest"});const t=()=>{const t=this._logsRef.value.querySelector(`.log[data-index="${e}"] .select_button`);return null!=t&&(t.focus(),!0)};t()||this._logsRef.value.layoutComplete.then(t)}}_onArrow(e){this._logsCtrl.moveFocus(e,this._visibleRange)}_onHome(e){e?this._logsCtrl.extendSelection(0,"replace"):this._logsCtrl.focus(0)}_onEnd(e){e?this._logsCtrl.extendSelection(this._logsCtrl.listLength-1,"replace"):this._logsCtrl.focus(this._logsCtrl.listLength-1)}_onRangeChanged(e){this._focusedIndexIsInDom=this._logsCtrl.isFocusedIndexInRange({first:e.first,last:e.last}),this._focusedIndexIsInDom||null==this.shadowRoot.activeElement||this._logsRef.value.focus()}_onMouseDownGutter(e){e.composedPath().some((e=>d(e,"select_button")))||e.preventDefault(),this._inputCtrl.onMouseDownGutter(e),this._draggedLogIndex=null}_onDrag({logIndex:e,direction:t,offset:o},s){s&&document.getSelection().empty();const n=null!=e?e:this._getNewDraggedLogIndex(t,o??1);n!==this._draggedLogIndex&&(s?this._logsCtrl.select(n):this._logsCtrl.extendSelection(n,"replace"),"up"!==t&&"down"!==t||this._logsRef.value.element(n)?.scrollIntoView({block:"nearest"}),this._draggedLogIndex=n)}_getNewDraggedLogIndex(e,t){if("up"===e)return Math.max(0,this._draggedLogIndex-t);if("down"===e)return Math.min(this._draggedLogIndex+t,this._logsCtrl.listLength-1);throw new Error(`Illegal argument. direction ${e} is not valid`)}_onClickLog(e,{ctrl:t,shift:o}){t&&!o?this._logsCtrl.toggleSelection(e):o?this._logsCtrl.extendSelection(e,t?"append":"replace"):!this._logsCtrl.isSelected(e)||this._logsCtrl.selectionLength>1?this._logsCtrl.select(e):this._logsCtrl.clearSelection(),this._logsCtrl.isSelectionEmpty()||document.getSelection().empty()}_onEscape(){this._logsCtrl.clearSelection()}_onClick(e){if(3===e.detail){const t=e.target.closest(".log");if(null!=t){window.getSelection().empty();const e=document.createRange();e.selectNode(t),window.getSelection().addRange(e)}}else this._logsCtrl.clearSelection()}_onSelectionChanged(){this._followSynchronizer.disable(),this._setFollow(!1)}_onSelectAll(){this._logsCtrl.selectAll()}_onCopy(e){const t=R(document.getSelection().toString().split(/[\r\n]+/gm));e.clipboardData.setData("text/plain",t.text),e.clipboardData.setData("text/html",t.html),e.preventDefault()}_onCopySelectionToClipboard(){if(this._logsCtrl.isSelectionEmpty())return;const e=this._logsCtrl.getSelectedLogs().map((e=>[this._dateDisplayer.format(e.date),...e.metadata?.map((e=>({metadata:e,metadataRendering:this._getMetadataRendering(e)}))).filter((({metadataRendering:e})=>!e.hidden)).map((({metadata:e,metadataRendering:t})=>this._getMetadataText(e,t)))??[],F(e.message)].filter((e=>e?.length>0)).join(" "))),t=R(e);(async function(e,t=null){if(null!=navigator.clipboard?.write){const o={"text/plain":new Blob([e],{type:"text/plain"})};null!=t&&(o["text/html"]=new Blob([t],{type:"text/html"})),await navigator.clipboard.write([new ClipboardItem(o)])}else if(null!=document.execCommand){const o=o=>{o.clipboardData.setData("text/plain",e),null!=t&&o.clipboardData.setData("text/html",t),o.preventDefault()};document.addEventListener("copy",o),document.execCommand("copy"),document.removeEventListener("copy",o)}else await(navigator.clipboard?.writeText(e))})(t.text,t.html).then((()=>{h((({count:e})=>`${y(e,"Copiée")} (${e} ${y(e,"ligne")})`)({count:e.length}))}))}_onWheel(e){e.deltaY<0&&(this._followSynchronizer.disable(),this._setFollow(!1))}_onVisibilityChanged(e){this._visibleRange={first:e.first,last:e.last},this._followSynchronizer.call()}_synchronizeFollow(){this._setFollow(this._visibleRange.last===Math.max(0,this._logsCtrl.listLength-1))}_setFollow(e){const t=this.follow;this.follow=e,t!==this.follow&&g(this,"followChange",this.follow)}_getMetadataRendering(e){const t=this.metadataRenderers?.[e.name];if(null==t)return M;const o="function"==typeof t?t(e):t;return{...M,...o}}_getMetadataText(e,t){return null!=t.text?t.text:`${t.showName?`${e.name}: `:""}${e.value}`}willUpdate(e){(e.has("dateDisplay")||e.has("timezone"))&&(this._dateDisplayer=this._resolveDateDisplayer()),e.has("logs")&&(this.clear(),this.appendLogs(this.logs)),e.has("limit")&&(this._logsCtrl.limit=this.limit),(e.has("messageFilter")||e.has("messageFilterMode")||e.has("metadataFilter"))&&(this._logsCtrl.filter={message:p(this.messageFilter)?null:{value:this.messageFilter,type:this.messageFilterMode},metadata:this.metadataFilter})}updated(e){this._horizontalScrollbarHeight=this.wrapLines?0:this._logsRef.value.offsetHeight-this._logsRef.value.clientHeight}render(){const e=this.follow&&this._logsCtrl.listLength>0?{pin:{index:this._logsCtrl.listLength-1,block:"start"}}:null;return a`
      <div class="wrapper" style="--last-log-margin: ${this._horizontalScrollbarHeight}px">
        <lit-virtualizer
          ${_(this._logsRef)}
          class="logs_container"
          tabindex="0"
          .items=${this._logsCtrl.getList().slice()}
          ?scroller=${!0}
          .keyFunction=${function(e){return e.id}}
          .renderItem=${(e,t)=>this._renderLog(e,t)}
          .layout=${e}
          @click=${this._inputCtrl.onClick}
          @keydown=${this._inputCtrl.onKeyDown}
          @keyup=${this._inputCtrl.onKeyUp}
          @copy=${this._onCopy}
          @focus=${this._onFocusLogsContainer}
          @visibilityChanged=${this._onVisibilityChanged}
          @rangeChanged=${this._onRangeChanged}
          @wheel=${this._onWheel}
        ></lit-virtualizer>
        ${this._logsCtrl.isSelectionEmpty()?null:a`
            <cc-button
              class="copy_button"
              .icon=${t}
              @cc-button:click=${this._onCopySelectionToClipboard}
            >
              ${"Copier"}
            </cc-button>`}
      </div>
    `}_renderLog(e,t){const s=this.wrapLines,n=this._dateDisplayer,i=this._logsCtrl.isSelected(t),l=i?(({index:e})=>`Désélectionner la ligne ${e}`)({index:t+1}):(({index:e})=>`Sélectionner la ligne ${e}`)({index:t+1});return a`
      <p
        class="log ${b({selected:i})}"
        data-index="${t}"
      >
        <span
          class="gutter"
          @mousedown=${this._onMouseDownGutter}
          @click=${this._inputCtrl.onClickLog}>
          <button
            class="select_button"
            title="${l}"
            aria-label="${l}"
            aria-pressed=${i}
            tabindex="-1"
            @click=${this._inputCtrl.onClickLog}
            @focus=${this._onFocusLog}
          >
            <cc-icon .icon=${o} size="xs"></cc-icon>
          </button>
        </span>
        ${this._renderLogTimestamp(e,n)}
        <span class="log--right ${b({wrap:s})}">${this._renderLogMetadata(e)}${this._renderLogMessage(e)}</span>
      </p>
    `}_renderLogTimestamp(e,t){return"none"===t.display?null:a`<span class="date">
      ${t.formatAndMapParts(e.date,((e,t)=>a`<span class="${e}">${t}</span>`))}
    </span>`}_renderLogMetadata(e){if(null==e.metadata||0===e.metadata.length)return null;const t=e.metadata.map((e=>this._renderMetadata(e))).filter((e=>null!=e));return 0===t.length?null:a`<span class="metadata--wrapper">${function*(e,t){const o="function"==typeof t;if(void 0!==e){let s=-1;for(const n of e)s>-1&&(yield o?t(s):t),s++,yield n}}(t,a`&nbsp;`)}</span>`}_renderMetadata(e){const t=this._getMetadataRendering(e);if(t.hidden)return null;const o=this._getMetadataText(e,t),s=t.size??0,n={metadata:!0,strong:t.strong,[t.intent]:!0};return a`<span class="${b(n)}" style="min-width: ${s}ch;">${o}</span>`}_renderLogMessage(e){return a`<span class="message">${this.stripAnsi?F(e.message):(t=e.message,null==x&&(x=new D),x.parse(t).map(((e,t)=>{if(0===e.styles.length)return e.text;const o=e.styles.map((e=>`ansi-${e}`)).join(" ");return a`<span class="${o}">${e.text}</span>`})))}</span>`;var t}static get styles(){return[...S,r(`:host {${I}}`),l`
        :host {
          display: block;
          overflow: hidden;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          
          --font-size: 0.875em;
        }

        :focus {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }
        
        .wrapper {
          position: relative;
          display: flex;
          height: 100%;
          flex-direction: column;
        }

        .logs_container {
          flex: 1;
          font-family: var(--cc-ff-monospace, monospace);
          font-size: var(--font-size);
        }

        .log {
          display: flex;
          width: 100%;
          align-items: center;
          margin: 0;
          gap: 0.5em;

          /* We don't need em here. At least with px we avoid strange blinking effect. */
          --spacing: 2px;
          --gutter-size: 1.5em;
        }

        .log:hover {
          background-color: var(--cc-color-ansi-background-hover);
        }

        .log.selected {
          background-color: var(--cc-color-ansi-background-selected);
        }

        .log:last-of-type {
          margin-bottom: var(--last-log-margin);
        }

        .date,
        .log--right {
          padding: var(--spacing) 0;
          line-height: var(--gutter-size);
        }

        .log--right {
          white-space: pre;
        }

        .log--right.wrap {
          white-space: pre-wrap;
        }

        .gutter {
          flex: 0 0 auto;
          align-self: stretch;
          border-right: 1px solid var(--cc-color-ansi-foreground);
          cursor: pointer;
        }

        .select_button {
          display: flex;
          width: var(--gutter-size);
          height: var(--gutter-size);
          align-items: center;
          justify-content: center;
          padding: 0;
          border: 0;
          margin: var(--spacing);
          background: none;
          color: var(--cc-color-ansi-foreground);
          cursor: pointer;
          outline-offset: 0;
        }

        .select_button cc-icon {
          color: #737373;
          opacity: 0;
        }

        .log:hover cc-icon,
        .select_button:focus cc-icon {
          opacity: 1;
        }

        .select_button[aria-pressed='true'] cc-icon {
          color: var(--cc-color-text-primary, #000);
          opacity: 1;
        }

        .copy_button {
          position: absolute;
          top: 0.5em;
          right: 1em;
        }

        .metadata {
          display: inline-block;
        }
        
        .metadata--wrapper {
          margin-right: var(--font-size);
        }

        .strong {
          font-weight: bold;
        }

        .neutral {
          color: var(--cc-color-ansi-foreground);
        }

        .info {
          color: var(--cc-color-ansi-blue);
        }

        .success {
          color: var(--cc-color-ansi-green);
        }

        .warning {
          color: var(--cc-color-ansi-yellow);
        }

        .danger {
          color: var(--cc-color-ansi-red);
        }
        
        .date {
          align-self: start;
          white-space: nowrap;
        }

        .milliseconds,
        .separator,
        .timezone {
          opacity: 0.7;
        }
      `]}}window.customElements.define("cc-logs-beta",B);export{B as C,E as d};
