export function toJson (object) {
  const pre = document.createElement('pre');
  pre.innerHTML = _toJson(object);
  return pre;
}

function _toJson (object) {
  return JSON.stringify(object, null, 4);
}
