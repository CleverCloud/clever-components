class t{start(t){this._animation=i=>{t(i,this._startTimestamp,this._lastTimestamp)&&(this._lastTimestamp=i),null!=this._animation&&requestAnimationFrame(this._animation)},this._startTimestamp=performance.now(),this._lastTimestamp=this._startTimestamp,this._animation(this._startTimestamp)}isStopped(){return null==this._animation}stop(){this._animation=null}}export{t as AnimationRunner};