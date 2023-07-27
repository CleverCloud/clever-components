export class SelectionCtrl {

  constructor (host) {
    this._selection = new Set();
    this.host = host;
  }

  set selection (selection) {
    this._selection = new Set(selection);
    this._requestUpdate();
  }

  get selection () {
    return Array.from(this._selection);
  }

  clear () {
    this._selection.clear();
    this._requestUpdate();
  }

  isSelected (item) {
    return this._selection.has(item);
  }

  size () {
    return this._selection.size;
  }

  isEmpty () {
    return this.size() === 0;
  }

  add (item) {
    this._selection.add(item);
    this._requestUpdate();
  }

  remove (item) {
    this._selection.delete(item);
    this._requestUpdate();
  }

  removeAll (items) {
    items.forEach((item) => this._selection.delete(item));
    this._requestUpdate();
  }

  _requestUpdate () {
    if (!this.isEmpty()) {
      document.getSelection().empty();
    }
    this.host.requestUpdate();
  }
}
