import"./cc-datetime-relative-cd85326a.js";import"./cc-icon-f84255c7.js";import"./cc-input-text-8d29ec56.js";import"./cc-loader-c9072fed.js";import"./cc-notice-9b1eec7a.js";import"./cc-toggle-34554172.js";import{M as e,N as t,O as n,q as s,P as c,h as i,Q as a,R as o,S as r}from"./cc-remix.icons-d7d44eac.js";import{d as l}from"./events-4c8e3503.js";import{g as d}from"./utils-aa566623.js";import{s as m,x as p,i as h}from"./lit-element-98ed46d4.js";const u=(e,t)=>{const n=e.index-t.index;if(0!==n)return n;const s=e.creationDate.getTime()-t.creationDate.getTime();return 0!==s?s:"BUILD"===e.kind?-1:1},g=(e,t)=>e.id.localeCompare(t.id),y=["BOOTING","STARTING","DEPLOYING","READY"],f=["UP","MIGRATION_IN_PROGRESS","TASK_IN_PROGRESS","BUILDING"],I=["QUEUED","WORK_IN_PROGRESS"];class _ extends m{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={state:"loading"}}_isSelected(e){return"loaded"===this.state.state&&null!=this.state.selection&&this.state.selection.includes(e)}_onInstanceClick(e){const t=e.target.id;this._isSelected(t)?this.state={...this.state,selection:this.state.selection.filter((e=>e!==t))}:this.state={...this.state,selection:[...this.state.selection??[],t]},l(this,"selection-change",this.state.selection)}render(){return"error"===this.state.state?p`
        <div class="wrapper wrapper--center">
          <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des instances."}"></cc-notice>
        </div>
      `:"loading"===this.state.state?p`
        <div class="wrapper wrapper--center">
          <cc-loader a11y-name="${"Instances en cours de chargement"}"></cc-loader>
        </div>
      `:"cold"===this.state.mode?this._renderColdMode(this.state.instances):this._renderLiveMode(this.state.instances)}_renderColdMode(e){const{ghost:t,real:n}=d(e,(e=>e.ghost?"ghost":"real"));return p`
      <fieldset class="section section--cold">
        ${this._renderHeader({title:"Instances"})}
        ${n?.length>0?this._renderInstancesGroupedByDeployment(e,!1):p`<div class="empty">${"Aucune instance"}</div>`}
      </fieldset>
      ${this._renderGhostInstances(t)}
    `}_renderLiveMode(e){const t=[],n=[],s=[],c=[],{ghost:i,real:a}=d(e,(e=>e.ghost?"ghost":"real"));return(a||[]).sort(u).forEach((e=>{I.includes(e.deployment.state)?t.push(e):"DELETED"===e.state?c.push(e):"STOPPING"===e.state?s.push(e):n.push(e)})),p`
      ${this._renderDeployingInstances(t)}
      ${this._renderRunningInstances(n)}
      ${this._renderStoppingInstances(s)}
      ${this._renderDeletedInstances(c)}
      ${this._renderGhostInstances(i)}
    `}_renderDeployingInstances(t){return 0===t.length?"":p`
      <fieldset class="section section--deploying">
        ${this._renderHeader({title:"Déploiement en cours",icon:e,commit:t[0].deployment.commitId})}
        <div class="section-content instances instances--with-state">
          ${this._renderInstances(t,!0)}
        </div>
      </fieldset>
    `}_renderRunningInstances(e){return 0===e.length?p`
        <fieldset class="section section--running">
          ${this._renderHeader({title:"Instances démarrées",icon:t})}
          <div class="empty">
            ${"Aucune instance démarrée"}
          </div>
        </fieldset>
      `:p`
      <fieldset class="section section--running">
        ${this._renderHeader({title:"Instances démarrées",icon:t,commit:e[0].deployment.commitId})}
        <div class="section-content instances">
          ${this._renderInstances(e,!1)}
        </div>
      </fieldset>
    `}_renderStoppingInstances(e){return 0===e.length?"":p`
      <fieldset class="section section--stopping">
        ${this._renderHeader({title:"Instances arrêtées",icon:n,commit:e[0].deployment.commitId})}
        <div class="section-content instances">
          ${this._renderInstances(e,!1)}
        </div>
      </fieldset>
    `}_renderDeletedInstances(e){return 0===e.length?"":p`
      <fieldset class="section section--deleted">
        ${this._renderHeader({title:"Instances supprimées",icon:s})}
        ${this._renderInstancesGroupedByDeployment(e,!1)}
      </fieldset>
    `}_renderGhostInstances(e){return null==e||0===e.length?"":p`
      <fieldset class="section section--ghost">
        ${this._renderHeader({title:"Instances fantômes",icon:c})}

        <div class="section-content">
          <cc-notice intent="info" message="${"Des instances indésirables sont toujours en cours d'exécution, mais seront bientôt détruites par notre orchestrateur. Pour en savoir plus, vous pouvez contacter le support."}"></cc-notice>
          <div class="instances instances--ghost">
            ${e.sort(g).map((e=>p`
            <label class="instance" for="${e.id}">
              <input type="checkbox"
                     id="${e.id}"
                     .checked=${this._isSelected(e.id)}
                     @change=${this._onInstanceClick}>
              <span class="instance-id">${e.id}</span>
            </label>
          `))}
          </div>
        </div>
      </fieldset>
    `}_renderHeader({title:e,icon:t,commit:n}){return p`
      <legend class="section-header">
        ${null!=t?p`
          <cc-icon class="section-header-icon" .icon=${t}></cc-icon>
        `:""}
        <span class="section-header-title">${e}</span>
        ${null!=n?this._renderCommit(n):""}
      </legend>
    `}_renderInstancesGroupedByDeployment(e,t){const n=d(e,(e=>e.deployment?.id));return p`
      <div class="section-content deployments">
        ${Object.values(n).map((e=>({deploymentDate:e[0].deployment.creationDate,instances:e}))).sort(((e,t)=>t.deploymentDate-e.deploymentDate)).map((({instances:e})=>p`
            <fieldset class="deployment">
              ${this._renderDeploymentDetails(e[0].deployment)}
              <div class="instances">
                ${this._renderInstances(e,t)}
              </div>
            </fieldset>
          `))}
      </div>
    `}_renderInstances(e,t){return e.sort(u).map((e=>this._renderInstance(e,t)))}_renderInstance(e,t){return p`
      <label class="instance" for="${e.id}">
        <input type="checkbox"
               id="${e.id}"
               .checked=${this._isSelected(e.id)}
               @change=${this._onInstanceClick}>
        <span class="instance-name">${e.name}</span>
      </label>
      ${t?this._renderInstanceState(e):""}
      ${this._renderInstanceIndex(e)}
    `}_renderDeploymentDetails(e){return p`
      <legend class="deployment-detail">
        <div>${this._renderDeploymentState(e.state)}</div>
        <div>
          ${"Déployée"}&nbsp;<cc-datetime-relative datetime=${e.creationDate.toISOString()}></cc-datetime-relative>
        </div>
        ${this._renderCommit(e.commitId)}
      </legend>
    `}_getDeploymentStateIcon(t){return I.includes(t)?{a11yName:"Déploiement en cours",icon:e,class:"deployment-state--wip"}:"SUCCEEDED"===t?{a11yName:"Déploiement réussi",icon:i,class:"deployment-state--succeeded"}:"FAILED"===t?{a11yName:"Déploiement en échec",icon:a,class:"deployment-state--failed"}:"CANCELLED"===t?{a11yName:"Déploiement annulé",icon:o,class:"deployment-state--cancelled"}:void 0}_renderDeploymentState(e){const t=this._getDeploymentStateIcon(e);return p`
      <cc-icon .icon=${t.icon}
               a11y-name="${t.a11yName}"
               class="deployment-state ${t.class}"></cc-icon>
    `}_getInstanceStateIcon(c){return y.includes(c.state)?{a11yName:"Instance en cours de déploiement",icon:e,class:"instance-state--deploying"}:f.includes(c.state)?{a11yName:"Instance démarrée",icon:t,class:"instance-state--running"}:"STOPPING"===c.state?{a11yName:"Instance en cours d'arrêt",icon:n,class:"instance-state--stopping"}:"DELETED"===c.state&&"WORK_IN_PROGRESS"===c.deployment.state?{a11yName:"Instance supprimée",icon:s,class:"instance-state--deleted"}:null}_renderInstanceState(e){const t=this._getInstanceStateIcon(e);return null==t?p`<span></span>`:p`
      <cc-icon .icon=${t.icon}
               a11y-name="${t.a11yName}"
               class="instance-state ${t.class}"></cc-icon>
    `}_renderCommit(e){return p`
      <span class="commit" title=${(({commit:e})=>`Commit déployé: ${e}`)({commit:e})}>
        ${e.substring(0,7)}
      </span>`}_renderInstanceIndex(e){const t="BUILD"===e.kind?"Instance de build":(({index:e})=>`Instance #${e}`)({index:e.index});return p`
      <span class="instance-index" title=${t}>
        ${"BUILD"===e.kind?p`
            <cc-icon .icon=${r}></cc-icon>
          `:""}
        ${"BUILD"!==e.kind?p`
          ${e.index}
          `:""}
      </span>`}static get styles(){return[h`
        :host {
          display: flex;
          overflow: auto;
          flex-direction: column;
        }
        
        /* RESET */

        fieldset {
          display: flex;
          min-width: 0;
          flex-direction: column;
          padding: 0;
          border: 0;
          margin: 0;
        }

        legend {
          display: table;
          padding: 0;
          margin: 0;
          float: left;
        }

        .wrapper {
          padding: 0.5em 0.75em;
        }

        .wrapper.wrapper--center {
          display: flex;
          flex: 1;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        cc-loader.loading {
          min-height: 20em;
        }

        .section {
          margin-bottom: 1em;
        }

        .section--deploying {
          --section-header-color: var(--cc-color-text-primary);
        }

        .section--running {
          --section-header-color: var(--cc-color-text-success);
        }

        .section--stopping {
          --section-header-color: var(--cc-color-text-warning);
        }

        .section--deleted,
        .section--cold,
        .section--ghost {
          --section-header-color: var(--cc-color-text-weak, #555);
        }

        .section-header {
          display: flex;
          align-items: center;
          padding: 0.5em 0.75em;
          margin-bottom: 0.5em;
          background-color: var(--cc-color-bg-neutral, #eee);
          color: var(--cc-color-text-weak, #555);
          gap: 0.5em;
        }

        .section-header-icon {
          width: 1.5em;
          height: 1.5em;

          --cc-icon-color: var(--section-header-color);
        }

        .section-header-title {
          flex: 1;
          font-size: 1em;
          font-weight: bold;
        }

        .commit {
          display: flex;
          align-items: center;
          padding: 0.2em;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-neutral-readonly, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          color: var(--cc-color-text-weak, #555);
          font-family: var(--cc-ff-monospace, monospace);
          font-size: 0.7em;
        }

        .section-content {
          display: flex;
          flex-direction: column;
          padding: 0.25em 0.75em 0.25em 1em;
        }

        .instances {
          display: grid;
          align-items: center;
          gap: 0.5em;
          grid-template-columns: max-content max-content;
        }

        .instances.instances--with-state {
          grid-template-columns: max-content max-content max-content;
        }
        
        .instances.instances--ghost {
          display: flex;
          flex-direction: column;
          margin-top: 1em;
        }

        .instance {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }
        
        .instance-id {
          line-height: 1em;
          overflow-wrap: break-word;
        }

        .instance-index {
          display: flex;
          width: 1em;
          height: 1em;
          align-items: center;
          justify-content: center;
          padding: 0.2em;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-neutral-readonly, #aaa);
          border-radius: 100%;
          color: var(--cc-color-text-weak, #555);
          font-family: var(--cc-ff-monospace, monospace);
          font-size: 0.7em;
        }
        
        .instance-state {
          --cc-icon-size: 1.2em;
        }

        .deployments {
          gap: 1em;
        }

        .deployment {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }

        .deployment-detail {
          display: grid;
          align-items: center;
          color: var(--cc-color-text-weak, #555);
          gap: 0.5em;
          grid-template-columns: auto 1fr auto;
        }

        .deployment .instances {
          padding-left: 1.5em;
        }

        cc-icon.deployment-state {
          display: inline-flex;
          width: 1.2em;
          height: 1.2em;
          flex: auto 0 0;
        }

        .instance-state--deploying,
        .deployment-state--wip {
          --cc-icon-color: var(--cc-color-text-primary);
        }

        .instance-state--running,
        .deployment-state--succeeded {
          --cc-icon-color: var(--cc-color-text-success);
        }

        .instance-state--stopping,
        .deployment-state--cancelled {
          --cc-icon-color: var(--cc-color-text-warning);
        }

        .instance-state--deleted {
          --cc-icon-color: var(--cc-color-text-weak, #555);
        }

        .deployment-state--failed {
          --cc-icon-color: var(--cc-color-text-danger);
        }

        .empty {
          padding-left: 0.75em;
          font-style: italic;
        }

        input[type='checkbox'] {
          width: 1em;
          height: 1em;
          /* pixel perfect horizontal alignement with the header icon */
          margin: 0 0 0 0.1em;
        }
      `]}}window.customElements.define("cc-logs-instances-beta",_);export{_ as CcLogsInstances};
