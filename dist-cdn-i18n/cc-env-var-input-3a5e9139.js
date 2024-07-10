import"./cc-button-fafeef50.js";import"./cc-input-text-8d29ec56.js";import{d as e}from"./events-4c8e3503.js";import{s as t}from"./skeleton-68a3d018.js";import{s as a,x as s,i as l}from"./lit-element-98ed46d4.js";import{o as n}from"./class-map-1feb5cf7.js";class i extends a{static get properties(){return{deleted:{type:Boolean},disabled:{type:Boolean},edited:{type:Boolean},name:{type:String},new:{type:Boolean},readonly:{type:Boolean},skeleton:{type:Boolean},value:{type:String}}}constructor(){super(),this.deleted=!1,this.disabled=!1,this.edited=!1,this.name=null,this.new=!1,this.readonly=!1,this.skeleton=!1,this.value=""}_onInput({detail:t}){this.value=t,e(this,"input",{name:this.name,value:this.value})}_onDelete(){e(this,"delete",{name:this.name})}_onKeep(){e(this,"keep",{name:this.name})}render(){return s`
      <div class="wrapper">
        
        <span class="name ${n({deleted:this.deleted})}"><!-- no-whitespace
          --><span class=${n({skeleton:this.skeleton})}>${this.name}</span><!-- no-whitespace
        --></span>

        <div class="input-btn">

          <cc-input-text
            label="${(({variableName:e})=>`valeur de la variable ${e}`)({variableName:this.name})}"
            hidden-label
            class="value"
            name="value"
            value=${this.value}
            multi
            clipboard
            ?disabled=${this.deleted||this.disabled}
            ?skeleton=${this.skeleton}
            ?readonly=${this.readonly}
            placeholder=${"valeur de la variable"}
            @cc-input-text:input=${this._onInput}
          ></cc-input-text>

          ${this.readonly?"":s`
            <cc-button
              ?skeleton=${this.skeleton}
              ?disabled=${this.disabled}
              ?danger=${!this.deleted}
              ?outlined=${!this.deleted}
              @cc-button:click=${this.deleted?this._onKeep:this._onDelete}
            >
              ${this.deleted?"Garder":"Enlever"}
            </cc-button>
          `}

        </div>
      </div>
    `}static get styles(){return[t,l`
        :host {
          display: block;
        }

        .wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        .name {
          display: inline-block;
          box-sizing: border-box;
          flex: 1 1 17em;
          padding-top: 0.35em;
          font-family: var(--cc-ff-monospace, monospace);
          font-size: 0.875em;
          line-height: 1.6em;
          word-break: break-all;
        }

        .name.deleted {
          text-decoration: line-through;
        }

        .skeleton {
          background-color: #bbb;
        }

        .input-btn {
          display: flex;
          flex: 2 1 27em;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        .value {
          /* 100 seems weird but it is necessary */
          /* it helps to have a button that almost does not grow except when it wraps on its own line */
          flex: 100 1 20em;
          align-self: self-start;
        }

        cc-button {
          flex: 1 1 6em;
          align-self: flex-start;
          white-space: nowrap;
        }

        cc-input-text {
          --cc-input-font-family: var(--cc-ff-monospace, monospace);
        }
      `]}}window.customElements.define("cc-env-var-input",i);export{i as CcEnvVarInput};
