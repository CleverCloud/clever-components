import{b as e,a as t}from"./i18n-number-a9c20d27.js";import"./cc-datetime-relative-cd85326a.js";import"./cc-icon-f84255c7.js";import"./cc-input-date-add93eea.js";import"./cc-loader-c9072fed.js";import"./cc-logs-control-2aa4d644.js";import"./cc-logs-instances-94013017.js";import"./cc-notice-9b1eec7a.js";import"./cc-popover-d4d407cc.js";import"./cc-toggle-34554172.js";import{y as a,z as i,A as s,B as n,b as r,C as o,D as l,E as c,F as d,G as g,H as u}from"./cc-remix.icons-d7d44eac.js";import{d as h}from"./events-4c8e3503.js";import{p}from"./logs-controller-d4586a2c.js";import{i as m}from"./utils-aa566623.js";import{dateRangeSelectionToDateRange as _}from"./date-range-selection-313ae90d.js";import{isLive as f,shiftDateRange as v,isRightDateRangeAfterNow as b}from"./date-range-378a7f50.js";import{s as y,x as R,i as D}from"./lit-element-98ed46d4.js";import{e as $,n as w}from"./ref-948c5e44.js";import{o as C}from"./class-map-1feb5cf7.js";const x="fr",S={instanceId:()=>({hidden:!0}),instance:e=>{let t=e.value;return e.value.length>18&&(t=e.value.substring(0,17)+"."),{strong:!0,text:t,size:18}}},k=["live","lastHour","last4Hours","today","yesterday","last7Days","custom"];class F extends y{static get properties(){return{dateRangeSelection:{type:Object,attribute:"date-range-selection"},limit:{type:Number},options:{type:Object},overflowWatermarkOffset:{type:Number,attribute:"overflow-watermark-offset"},selectedInstances:{type:Array,attribute:"selected-instances"},state:{type:Object},_selectedDateRangeMenuEntry:{type:String,state:!0},_dateRangeValidation:{type:Object,state:!0},_customDateRange:{type:Object,state:!0},_overflowDecision:{type:String,state:!0},_messageFilter:{type:String,state:!0},_messageFilterMode:{type:String,state:!0},_fullscreen:{type:Boolean,state:!0}}}constructor(){super(),this.dateRangeSelection={type:"live"},this.limit=1e3,this.options={"date-display":"datetime-iso","metadata-display":{instance:!1},palette:"default","strip-ansi":!1,timezone:"UTC","wrap-lines":!1},this.overflowWatermarkOffset=10,this.selectedInstances=[],this.state={type:"loadingInstances"},this._selectedDateRangeMenuEntry=this._getDateRangeSelectionMenuEntry(this.dateRangeSelection),this._customDateRange=null,this._currentDateRange=_(this.dateRangeSelection),this._dateRangeValidation={since:{valid:!0},until:{valid:!0}},this._refs={since:$(),until:$(),logs:$(),dateRangeSelector:$()},this._loadingProgressCtrl=new M(this),this._metadataDisplay={instance:{label:"Afficher le nom de l'instance",hidden:!this.options["metadata-display"].instance}},this._overflowDecision="none",this._messageFilter="",this._messageFilterMode="loose",this._messageFilterValid=!0,this._fullscreen=!1}appendLogs(e){null==e||e.length<=0||"receivingLogs"===this.state.type&&(this._refs.logs.value.appendLogs(e),this._loadingProgressCtrl.progress(e))}clear(){this._refs.logs.value?.clear(),this._loadingProgressCtrl.reset()}getDateRange(){return this._currentDateRange}_getDateRangeSelectionMenuEntry(e){return"predefined"===e.type?e.def:e.type}_getDateRangeSelectionMenuEntryIcon(e){return"live"===e?a:"custom"===e?i:s}_getDateRangeSelectionMenuEntryLabel(e){if("live"===e)return"Vue en temps réel";if("custom"===e)return"Personnalisé";if("lastHour"===e)return"Dernière heure";if("last4Hours"===e)return"4 dernières heures";if("today"===e)return"Aujourd'hui";if("yesterday"===e)return"Hier";if("last7Days"===e)return"7 derniers jours";throw new Error(`Unsupported menu entry "${e}"`)}_getLoadingProgressTitle(){return"completed"===this._loadingProgressCtrl.state?"Logs chargés : 100%":null==this._loadingProgressCtrl.percent?"Chargement en temps réel...":(({percent:t})=>`Chargement des logs : ${e(x,t)}`)({percent:this._loadingProgressCtrl.percent/100})}_validateCustomDateRange(){null!=this._customDateRange&&(this._refs.since.value.max=this._customDateRange.until,this._refs.until.value.min=this._customDateRange.since,this._dateRangeValidation={since:this._refs.since.value.validate(),until:this._refs.until.value.validate()})}_getDateError(e,t){return"empty"===e?"Veuillez saisir une valeur":"badInput"===e?"Format de date invalide (YYYY-MM-DD HH:mm:ss)":"rangeOverflow"===e?(({max:e})=>`La date doit être inférieure à ${e}`)(t):"rangeUnderflow"===e?(({min:e})=>`La date doit être supérieure à ${e}`)(t):null}_applyDateRange(e){this._loadingProgressCtrl.cancel(),this.dateRangeSelection=e,this._currentDateRange=_(this.dateRangeSelection),this._overflowDecision="none",h(this,"date-range-change",this._currentDateRange),h(this,"date-range-selection-change",this.dateRangeSelection)}_validateMessageFilter(){if(m(this._messageFilter))this._messageFilterValid=!0;else if("regex"===this._messageFilterMode)try{p(this._messageFilter),this._messageFilterValid=!0}catch(e){this._messageFilterValid=!1}else this._messageFilterValid=!0}_onDateSelectionRangeItemClick(e){this._selectedDateRangeMenuEntry=e.target.dataset.type;const t=e.target.dataset.current;this._refs.dateRangeSelector.value.close(),"true"!==t&&("custom"===this._selectedDateRangeMenuEntry?this.dateRangeSelection={type:"custom",since:this._currentDateRange.since,until:f(this._currentDateRange)?(new Date).toISOString():this._currentDateRange.until}:"live"===this._selectedDateRangeMenuEntry?this._applyDateRange({type:"live"}):this._applyDateRange({type:"predefined",def:this._selectedDateRangeMenuEntry}))}_onCustomDateChanged(e,t){this._customDateRange={...this._customDateRange,[e]:t},this._validateCustomDateRange()}_onCustomSinceDateChanged({detail:e}){this._onCustomDateChanged("since",e)}_onCustomUntilDateChanged({detail:e}){this._onCustomDateChanged("until",e)}_onCustomDateRangeShiftLeft(){this._customDateRange=v(this._customDateRange,"left")}_onCustomDateRangeShiftRight(){this._customDateRange=v(this._customDateRange,"right")}_onApplyCustomDateRange(){this._applyDateRange({type:"custom",since:this._customDateRange.since,until:this._customDateRange.until})}_onInstanceSelectionChange({detail:e}){f(this._currentDateRange)?this.state={...this.state,selection:e}:(this._loadingProgressCtrl.cancel(),h(this,"instance-selection-change",e))}_onLogsOptionChange({detail:e}){this.options={...this.options,[e.name]:e.value},h(this,"options-change",this.options)}_onFullscreenToggle(){this._fullscreen=!this._fullscreen}_onPause(){h(this,"pause")}_onResume(){h(this,"resume")}_onOverflowWatermarkReached(){"none"===this._overflowDecision&&h(this,"pause")}_onAcceptOverflow(){this._overflowDecision="accepted",h(this,"resume")}_onDiscardOverflow(){this._overflowDecision="discarded",this.dateRangeSelection={type:"custom",since:this._currentDateRange.since,until:this._loadingProgressCtrl.lastLogDate.toISOString()}}_onTextFilterInput({detail:e}){this._messageFilter=e,this._validateMessageFilter()}_onTextFilterModeClick(e){const t=e.target.dataset.mode;this._messageFilterMode===t?this._messageFilterMode="loose":this._messageFilterMode=t,this._validateMessageFilter()}updated(e){e.has("_customDateRange")&&this._validateCustomDateRange()}willUpdate(e){const t=e.has("state")&&e.get("state")?.type!==this.state.type;e.has("dateRangeSelection")&&(this._selectedDateRangeMenuEntry=this._getDateRangeSelectionMenuEntry(this.dateRangeSelection),this._customDateRange="custom"===this.dateRangeSelection.type?{since:this.dateRangeSelection.since,until:this.dateRangeSelection.until}:null,this._currentDateRange=_(this.dateRangeSelection)),t&&("errorLogs"===this.state.type?this._loadingProgressCtrl.reset():"connectingLogs"===this.state.type?this._loadingProgressCtrl.init(this._currentDateRange):"receivingLogs"===this.state.type?this._loadingProgressCtrl.start():"logStreamPaused"===this.state.type?this._loadingProgressCtrl.pause():"logStreamEnded"===this.state.type&&this._loadingProgressCtrl.complete()),e.has("options")&&(this._metadataDisplay={instance:{label:this._metadataDisplay.instance.label,hidden:!this.options["metadata-display"].instance}})}render(){const e={overlay:!0,fullscreen:this._fullscreen},t={wrapper:!0,fullscreen:this._fullscreen};return R`
      <div class=${C(e)}>
        <div class=${C(t)}>
          <div class="left">
            ${this._renderDateRangeSelection()}
            ${this._renderCustomDateRange()}
            ${this._renderInstances()}
            ${this._renderLoadingProgress()}
          </div>
  
          <div class="logs-wrapper">
            ${this._renderLogs()}
          </div>
        </div>
      </div>
    `}_renderDateRangeSelection(){return R`
      <cc-popover 
        ${w(this._refs.dateRangeSelector)}
        .icon=${this._getDateRangeSelectionMenuEntryIcon(this._selectedDateRangeMenuEntry)}
        class="date-range-selection"
      >
        <div slot="button-content" class="date-range-selection-button-content">
          <div>${this._getDateRangeSelectionMenuEntryLabel(this._selectedDateRangeMenuEntry)}</div>
          <cc-icon class="date-range-selection-icon" .icon=${n}></cc-icon>
        </div>
        <div class="date-range-selection-list" style="display: flex; flex-direction: column; gap: 0.25em;">
          ${k.map((e=>{const t=e===this._selectedDateRangeMenuEntry;return R`<button 
              class="date-range-selection-menu-entry" 
              data-type="${e}"
              data-current="${t}"
              @click=${this._onDateSelectionRangeItemClick}>
              <cc-icon .icon=${this._getDateRangeSelectionMenuEntryIcon(e)} data-type="${e}"></cc-icon>
              <span data-type="${e}">${this._getDateRangeSelectionMenuEntryLabel(e)}</span>
              ${t?R`<cc-icon class="date-range-selection-current" .icon=${r} data-type="${e}"></cc-icon>`:""}
            </button>`}))}
        </div>
      </cc-popover>
    `}_renderCustomDateRange(){if(null==this._customDateRange)return null;const e=!0===this._dateRangeValidation.since.valid?null:this._getDateError(this._dateRangeValidation.since.code,{min:this._customDateRange.since,max:this._customDateRange.until}),t=!0===this._dateRangeValidation.until.valid?null:this._getDateError(this._dateRangeValidation.until.code,{min:this._customDateRange.since,max:this._customDateRange.until}),a=b(this._customDateRange),i=!this._dateRangeValidation.since.valid||!this._dateRangeValidation.until.valid;return R`
      <div class="date-range">
        <cc-input-date
          ${w(this._refs.since)}
          .value=${this._customDateRange.since}
          label=${"UTC"===this.options.timezone?"Début (UTC)":"Début (heure locale)"}
          .max=${this._customDateRange.until}
          timezone=${this.options.timezone}
          @cc-input-date:input=${this._onCustomSinceDateChanged}
          @cc-input-date:requestimplicitsubmit=${this._onApplyCustomDateRange}
        >
          ${null!=e?R`<p slot="error">${e}</p>`:""}
        </cc-input-date>
        <cc-input-date
          ${w(this._refs.until)}
          .value=${this._customDateRange.until}
          label=${"UTC"===this.options.timezone?"Fin (UTC)":"Fin (heure locale)"}
          .min=${this._customDateRange.since}
          timezone=${this.options.timezone}
          @cc-input-date:input=${this._onCustomUntilDateChanged}
          @cc-input-date:requestimplicitsubmit=${this._onApplyCustomDateRange}
        >
          ${null!=t?R`<p slot="error">${t}</p>`:""}
        </cc-input-date>
        <div class="date-range-buttons">
          <cc-button class="date-range-left"
                     ?disabled=${i}
                     .icon=${o}
                     hide-text
                     a11y-name=${"Décaler à l'interval précédent"}
                     @cc-button:click=${this._onCustomDateRangeShiftLeft}>
          </cc-button>
          <cc-button class="date-range-right"
                     ?disabled=${a||i}
                     .icon=${l}
                     hide-text
                     a11y-name=${"Décaler à l'interval suivant"}
                     @cc-button:click=${this._onCustomDateRangeShiftRight}>
          </cc-button>
          <cc-button
            class="date-range-apply-button"
            ?disabled=${i}
            @cc-button:click=${this._onApplyCustomDateRange}
          >${"Appliquer"}
          </cc-button>                 
        </div>
      </div>
    `}_renderInstances(){let e;return e="loadingInstances"===this.state.type?{state:"loading"}:"errorInstances"===this.state.type?{state:"error"}:{state:"loaded",mode:f(this._currentDateRange)?"live":"cold",instances:this.state.instances,selection:this.state.selection},R`<cc-logs-instances-beta 
      .state=${e} 
      class="cc-logs-instances"
      @cc-logs-instances:selection-change=${this._onInstanceSelectionChange}
    ></cc-logs-instances-beta>`}_renderLoadingProgress(){if(0===this._loadingProgressCtrl.value)return null;const e="none"===this._overflowDecision&&this._loadingProgressCtrl.overflowWatermarkReached,a=!e&&("running"===this._loadingProgressCtrl.state||"paused"===this._loadingProgressCtrl.state),i=!e&&this._loadingProgressCtrl.overflowing,s=(()=>a?"running"===this._loadingProgressCtrl.state?{icon:g,a11yName:"Mettre en pause",onclick:this._onPause}:"paused"===this._loadingProgressCtrl.state?{icon:u,a11yName:"Reprendre",onclick:this._onResume}:null:null)();return R`
      <div class="logs-loading-state">
        <div class="loading-state-heading">
          <div class="loading-state-title">
            ${this._getLoadingProgressTitle()}
          </div>

          ${null!=s?R`
            <cc-button .icon=${s.icon}
                       hide-text
                       a11y-name=${s.a11yName}
                       @cc-button:click=${s.onclick}
            ></cc-button>
          `:""}
        </div>
        ${null!=this._loadingProgressCtrl.percent?R`
          <div class="progress-bar">
            <div class="progress-bar-track" style="width: ${this._loadingProgressCtrl.percent}%;"></div>
          </div>
        `:""}
        <div class="loading-state-content">
          <div class="loading-state-text">
            ${(({count:e})=>`${t(x,e)} logs chargés`)({count:this._loadingProgressCtrl.value})}
          </div>
          
          ${e?R`
            <cc-notice intent="info" heading="${"Volume important"}">
              <div slot="message">
                ${(({limit:e})=>`Vous allez atteindre ${t(x,e)} logs chargés. Que voulez-vous faire ?`)({limit:this.limit})}
                <div class="overflow-control">
                  <cc-button link @cc-button:click=${this._onAcceptOverflow}>
                    ${"Continuer"}
                  </cc-button>
                  <cc-button link @cc-button:click=${this._onDiscardOverflow}>
                    ${"Arrêter"}
                  </cc-button>
                </div>
              </div>
            </cc-notice>
          `:""}

          ${i?R`
            <cc-notice intent="info" no-icon>
              <div slot="message">
                ${(({limit:e})=>`Pour assurer de bonnes performances, seuls les ${t(x,e)} derniers logs sont visible.`)({limit:this.limit})}
              </div>
            </cc-notice>
          `:""}
        </div>
      </div>
    `}_renderLogs(){if("errorLogs"===this.state.type)return R`
        <div class="center-logs-wrapper">
          <cc-notice slot="header"
                     intent="warning"
                     message=${"Une erreur est survenue pendant le chargement des logs"}
          ></cc-notice>
        </div>
      `;const e="connectingLogs"===this.state.type||"receivingLogs"===this.state.type||"logStreamEnded"===this.state.type||"logStreamPaused"===this.state.type?this.state.selection?.map((e=>({metadata:"instanceId",value:e}))):[],t="Filtrer avec une chaîne exacte",a="Filtrer avec une expression régulière";return R`
      <cc-logs-control-beta
        ${w(this._refs.logs)}
        class="logs"
        follow
        limit="${this.limit}"
        .dateDisplay=${this.options["date-display"]}
        .metadataDisplay=${this._metadataDisplay}
        .messageFilter=${this._messageFilter}
        .messageFilterMode=${this._messageFilterMode}
        .metadataFilter=${e}
        .metadataRenderers=${S}
        .palette=${this.options.palette}
        ?strip-ansi=${this.options["strip-ansi"]}
        .timezone=${this.options.timezone}
        ?wrap-lines=${this.options["wrap-lines"]}
        @cc-logs-control:option-change=${this._onLogsOptionChange}
      >
        <div slot="header">
          <div class="logs-header">
            <div class="input-wrapper">
              <cc-input-text
                class="logs-filter-input"
                label=${"Filtrer"}
                .value=${this._messageFilter}
                inline
                @cc-input-text:input=${this._onTextFilterInput}
              >
              </cc-input-text>
              
              <div class="inner-buttons-wrapper">
                ${this._messageFilterValid?"":R`
                  <div class="logs-filter-input-error" id="logs-filter-input-error">${"Regex invalide"}</div>
                `} 
                <button
                  data-mode="strict"
                  title="${t}"
                  aria-label="${t}"
                  aria-pressed=${"strict"===this._messageFilterMode}
                  @click=${this._onTextFilterModeClick}
                >“”</button>
                <button
                  data-mode="regex"
                  title="${a}"
                  aria-label="${a}"
                  aria-pressed=${"regex"===this._messageFilterMode}
                  @click=${this._onTextFilterModeClick}
                  aria-describedby="${this._messageFilterValid?"":"logs-filter-input-error"}"
                >.*</button>
              </div>
            </div>
            
            <cc-button
              class="header-fullscreen-button"
              .icon=${this._fullscreen?c:d}
              a11y-name=${this._fullscreen?"Sortir du mode plein écran":"Mode plein écran"}
              hide-text
              @cc-button:click=${this._onFullscreenToggle}
            ></cc-button>
          </div>
        </div>
      </cc-logs-control-beta>

      ${"completed"===this._loadingProgressCtrl.state&&0===this._loadingProgressCtrl.value?R`
        <div class="overlay-logs-wrapper">
          <cc-notice intent="info"
                     heading=${"Aucun log"}
                     message=${"Il n'y a aucun log qui correspond aux critères sélectionnés"}
          ></cc-notice>
        </div>
      `:""}

      ${"init"===this._loadingProgressCtrl.state||"started"===this._loadingProgressCtrl.state?R`
        <div class="overlay-logs-wrapper">
          <cc-notice intent="info" no-icon>
            <div class="overlay-logs-wrapper--loader" slot="message">
              <cc-loader></cc-loader>
              <span>${"Recherche de logs..."}</span>
            </div>
          </cc-notice>
        </div>
      `:""}

      ${"waiting"===this._loadingProgressCtrl.state?R`
        <div class="overlay-logs-wrapper">
          <cc-notice intent="info"
                     heading=${"Aucun log pour le moment"}
                     message=${"Les logs émis par l'application apparaîtront ici"}
          ></cc-notice>
        </div>
      `:""}
    `}static get styles(){return[D`
        /* stylelint-disable no-duplicate-selectors */
        
        :host {
          display: block;
        }

        .overlay {
          display: flex;
          height: 100%;
        }

        .overlay.fullscreen {
          position: fixed;
          z-index: 999;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          backdrop-filter: blur(5px);
        }

        .wrapper {
          display: flex;
          flex: 1;
          gap: 0.5em;
        }

        .wrapper.fullscreen {
          padding: 1em;
          border: 1px solid var(--cc-color-border-neutral);
          margin: 1em;
          background-color: var(--cc-color-bg-default);
          border-radius: var(--cc-border-radius-default);
        }

        .left {
          display: flex;
          width: 18em;
          height: 100%;
          flex-direction: column;
          gap: 0.5em;
        }

        .cc-logs-instances {
          flex: 1;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .mode {
          padding: 0.25em;
          grid-area: mode;
        }

        .date-range {
          display: flex;
          flex-direction: column;
          padding: 0.5em;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          gap: 0.75em;
          grid-area: date-range;
        }

        .date-range-buttons {
          display: grid;
          align-items: center;
          grid-gap: 0.5em;
          grid-template-areas: 'left right spacer apply';
          grid-template-columns: auto auto 1fr auto;
        }

        .date-range-apply-button {
          grid-area: apply;
        }

        .date-range-selection {
          --cc-button-font-weight: normal;
          --cc-button-text-transform: none;
          --cc-popover-trigger-button-width: 100%;
        }

        .date-range-selection-button-content {
          display: flex;
          align-items: center;
          font-size: 1.2em;
          gap: 1em;
        }

        .date-range-selection-button-content div {
          display: flex;
          flex: 1;
          justify-content: start;
        }

        .date-range-selection-button-content cc-icon {
          transition: transform 0.2s;
        }

        .date-range-selection[is-open] .date-range-selection-button-content cc-icon {
          transform: rotate(180deg);
        }

        .date-range-selection-list {
          display: flex;
        }

        button {
          display: block;
          padding: 0;
          border: none;
          margin: 0;
          background: unset;
          font-family: inherit;
          font-size: unset;
        }

        .date-range-selection-menu-entry {
          display: grid;
          align-items: start;
          padding: 0.5em;
          cursor: pointer;
          gap: 0.5em;
          grid-template-columns: auto 1fr auto;
          justify-items: start;
        }

        .date-range-selection-current {
          align-self: end;
        }

        .date-range-selection-button:hover,
        .date-range-selection-button[data-current='true'] {
          background-color: var(--cc-color-bg-neutral);
        }

        .logs-loading-state {
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .loading-state-heading {
          display: flex;
          max-height: 2em;
          align-items: center;
          padding: 0.5em;
          background-color: var(--cc-color-bg-neutral, #eee);
          border-top-left-radius: var(--cc-border-radius-default, 0.25em);
          border-top-right-radius: var(--cc-border-radius-default, 0.25em);
          gap: 0.3em;
        }

        .loading-state-title {
          flex: 1;
          color: var(--cc-color-text-default, #000);
          font-weight: bold;
        }

        .loading-state-content {
          display: flex;
          flex-direction: column;
          padding: 1em;
          color: var(--cc-color-text-weak);
          gap: 1em;
        }

        .progress-bar {
          overflow: hidden;
          width: 100%;
          height: 0.2em;
          background-color: var(--cc-color-bg-primary-weak);
        }

        .progress-bar-track {
          height: 100%;
          background-color: var(--cc-color-bg-primary);
        }

        .progress-bar-track.indeterminate {
          width: 100%;
          animation: indeterminate-animation 1s infinite linear;
          transform-origin: 0 50%;
        }

        .overflow-control {
          display: flex;
          gap: 1.5em;
        }

        @keyframes indeterminate-animation {

          0% {
            transform: translateX(0) scaleX(0);
          }

          40% {
            transform: translateX(0) scaleX(0.4);
          }

          100% {
            transform: translateX(100%) scaleX(0.5);
          }
        }

        .logs-wrapper {
          position: relative;
          flex: 1;
        }

        .logs {
          height: 100%;
        }

        .logs-header {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 1em;
        }

        .logs-filter-input {
          --cc-input-font-family: var(--cc-ff-monospace, monospace);
          
          flex: 1;
        }

        .center-logs-wrapper {
          display: flex;
          height: 100%;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }

        .overlay-logs-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .overlay-logs-wrapper--loader {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }

        .overlay-logs-wrapper--loader cc-loader {
          width: 1.5em;
          height: 1.5em;
        }

        .spacer {
          flex: 1;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          flex: 1;
        }

        .input-wrapper .inner-buttons-wrapper {
          position: absolute;
          z-index: 2;
          right: 5px;
          display: flex;
          height: 100%;
          align-items: center;
        }

        .inner-buttons-wrapper button {
          width: 1.6em;
          height: 1.6em;
          flex-shrink: 0;
          background: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.15em);
          color: var(--cc-input-btn-icons-color, #595959);
          cursor: pointer;
          font-family: var(--cc-ff-monospace, monospace);
        }

        .inner-buttons-wrapper button:focus {
          z-index: 1;
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .inner-buttons-wrapper button:active,
        .inner-buttons-wrapper button:hover {
          box-shadow: none;
          outline: 0;
        }

        .inner-buttons-wrapper button:hover {
          background-color: var(--cc-color-bg-neutral-hovered);
        }

        .inner-buttons-wrapper button:active,
        .inner-buttons-wrapper button[aria-pressed='true'] {
          background-color: var(--cc-color-bg-neutral-active);
          color: var(--cc-color-text-primary);
        }

        .inner-buttons-wrapper button::-moz-focus-inner {
          border: 0;
        }

        .inner-buttons-wrapper button:first-of-type {
          border-bottom-right-radius: 0;
          border-top-right-radius: 0;
        }
        
        .inner-buttons-wrapper button:last-of-type {
          border-bottom-left-radius: 0;
          border-top-left-radius: 0;
        }

        .logs-filter-input-error {
          margin-right: 0.5em;
          background: var(--cc-color-bg-default, #fff);
          color: var(--cc-color-text-danger);
        }
      `]}}window.customElements.define("cc-logs-application-view-beta",F);class M{constructor(e){this._host=e,this._debug=!1,this.reset()}reset(){this._dateRange=null,this._isLive=!1,this._dateRangeStart=null,this._dateRangeDuration=null,this._lastLogDate=null,this._state="none",this._percent=0,this._value=0,this._clearWaitingTimeout(),this._host.requestUpdate()}init(e){this.reset(),this._dateRange=e,this._step("init",{none:()=>(this._isLive=f(this._dateRange),this._dateRangeStart=new Date(this._dateRange.since).getTime(),this._dateRangeDuration=this._isLive?0:new Date(this._dateRange.until).getTime()-this._dateRangeStart,"init")})}start(){this._step("start",{none:()=>"none",paused:()=>"running",init:()=>(this._waitingTimeoutId=setTimeout((()=>{this._step("nothingReceived",{started:()=>this._isLive?"waiting":"completed"})}),2e3),"started")})}progress(e){if(0===e.length)return;const t=()=>{if(this._value=this._value+e.length,this._lastLogDate=e[e.length-1].date,!this._isLive){const e=this._lastLogDate.getTime()-this._dateRangeStart;this._percent=100*e/this._dateRangeDuration}this.overflowWatermarkReached&&this._host._onOverflowWatermarkReached()};this._step("progress",{started:()=>(this._clearWaitingTimeout(),t(),"running"),waiting:()=>(t(),"running"),running:()=>(t(),"running"),completed:()=>(t(),"running")})}pause(){this._step("pause",{running:()=>"paused"})}complete(){this._step("complete",{none:()=>"none",init:()=>"init",started:()=>(this._clearWaitingTimeout(),this._percent=100,"completed"),"*":()=>(this._percent=100,"completed")})}cancel(){this._step("cancel",{"*":()=>(this.reset(),"none")})}get state(){return this._state}get percent(){return this._isLive?null:this._percent}get value(){return this._value}get overflowing(){return this._value>this._host.limit}get overflowWatermarkReached(){return this._value>=this._host.limit-this._host.overflowWatermarkOffset}get lastLogDate(){return this._lastLogDate}_clearWaitingTimeout(){null!=this._waitingTimeoutId&&(clearTimeout(this._waitingTimeoutId),this._waitingTimeoutId=null)}_step(e,t){const a=this._state;this._log(`progressCtrl: ACTION<${e}> from state ${a}`);const i=t[a]??t["*"];if(null==i)return void console.warn(`progressCtrl: ACTION<${e}>: no step walker found from state ${a}`);const s=i();null!=s&&(s!==this._state&&(this._log(`progressCtrl: ${this._state} -> ${s}`),this._state=s),this._host.requestUpdate())}_log(...e){this._debug&&console.log(...e)}}export{F as CcLogsApplicationView};
