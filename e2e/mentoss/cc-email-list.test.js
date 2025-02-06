import { expect } from '@open-wc/testing';
import { html } from 'lit';
import { FetchMocker, MockServer } from 'mentoss';
import '../../src/components/cc-email-list/cc-email-list.smart.js';
import '../../src/components/cc-smart-container/cc-smart-container.js';
import { addTranslations, setLanguage } from '../../src/lib/i18n/i18n.js';
import { sleep } from '../../src/lib/utils.js';
import { translations } from '../../src/translations/translations.en.js';
import { getElement } from '../../test/helpers/element-helper.js';

before(() => {
  addTranslations('en', translations);
  setLanguage('en');
});

describe('with mentoss', () => {
  const server = new MockServer('https://api.example.com');

  const mocker = new FetchMocker({
    servers: [server],
  });

  before(() => {
    mocker.mockGlobal();
  });

  afterEach(() => {
    mocker.clearAll();
  });

  after(() => {
    mocker.unmockGlobal();
  });

  it('should display the right primary email', async () => {
    server.get('/v2/self', {
      status: 200,
      body: {
        email: 'foo@example.com',
        emailValidated: true,
      },
    });
    server.get('/v2/self/emails', {
      status: 200,
      body: [],
    });

    const component = await createComponentWithSmart('https://api.example.com');
    await sleep(100);

    const primaryAddressElement = component.shadowRoot.querySelector('.address-line.primary .address span');
    expect(primaryAddressElement.innerText).to.eql('foo@example.com');
  });
});

async function createComponentWithSmart(apiHost) {
  const context = { apiConfig: { API_HOST: apiHost } };

  const element = await getElement(
    html`<cc-smart-container .context=${context}><cc-email-list></cc-email-list></cc-smart-container>`,
  );

  return element.querySelector('cc-email-list');
}
