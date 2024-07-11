import { CcEvent } from '../../lib/events.js';

export class CcSshKeyListCreateEvent extends CcEvent {
  static TYPE = 'cc-create-ssh-key';

  /**
   * @param {object} param
   * @param {string} param.keyName
   * @param {string} param.publicKey
   */
  constructor({ keyName, publicKey }) {
    super(CcSshKeyListCreateEvent.TYPE);

    this._keyName = keyName;
    this._publicKey = publicKey;
  }

  /**
   * @return {string}
   */
  get publicKey() {
    return this._publicKey;
  }

  /**
   * @return {string}
   */
  get keyName() {
    return this._keyName;
  }
}

export class CcSshKeyListDeleteEvent extends CcEvent {
  static TYPE = 'cc-delete-ssh-key';

  /**
   * @param {string} keyName
   */
  constructor(keyName) {
    super(CcSshKeyListDeleteEvent.TYPE);

    this._keyName = keyName;
  }

  /**
   * @return {string}
   */
  get keyName() {
    return this._keyName;
  }
}
