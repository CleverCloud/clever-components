import{s as o,x as t,i as r}from"./lit-element-98ed46d4.js";const e=["#40b970","#36a562","#2c9254","#237f46","#1a6c39","#115a2c","#084920","#003814"];class s extends o{static get properties(){return{anchor:{type:Array},count:{type:Number,reflect:!0},size:{type:Array},tooltip:{type:Array},_color:{type:String,state:!0}}}constructor(){super(),this.anchor=[8,8],this.count=null,this.size=[16,16],this.tooltip=[0,0],this._color=null}_getColorFromCount(o){const t=Math.floor(Math.log(o)),r=Math.min(t,e.length-1);return e[r]}willUpdate(o){o.has("count")&&(this._color=this._getColorFromCount(this.count))}render(){return t`
      <div style=${`--dot-color:${this._color}ff;--dot-color-half:${this._color}66;--dot-color-zero:${this._color}00`}></div>
    `}static get styles(){return[r`
        :host {
          /* Make sure container size adapts to inner div */
          display: inline-block;
        }

        div {
          --dot-size: var(--cc-map-marker-dot-size, 6px);

          width: var(--dot-size);
          height: var(--dot-size);
          animation: pulse 2s infinite;
          background: var(--dot-color);
          border-radius: 50%;
          cursor: pointer;
        }

        @keyframes pulse {

          0% {
            box-shadow: 0 0 0 0 var(--dot-color-half);
          }

          70% {
            box-shadow: 0 0 0 var(--dot-size) var(--dot-color-zero);
          }

          100% {
            box-shadow: 0 0 0 0 var(--dot-color-zero);
          }
        }
      `]}}window.customElements.define("cc-map-marker-dot",s);export{s as CcMapMarkerDot};
