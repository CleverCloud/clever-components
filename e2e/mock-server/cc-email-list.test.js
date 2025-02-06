import { expect } from '@open-wc/testing';
import { html } from 'lit';
import '../../src/components/cc-email-list/cc-email-list.smart.js';
import '../../src/components/cc-smart-container/cc-smart-container.js';
import { addTranslations, setLanguage } from '../../src/lib/i18n/i18n.js';
import { sleep } from '../../src/lib/utils.js';
import { translations } from '../../src/translations/translations.en.js';
import { getElement } from '../../test/helpers/element-helper.js';
import { MockServerClient } from './mock-server-client.js';

// before running this test run:
//   npm run e2e:mock-server:start

before(() => {
  addTranslations('en', translations);
  setLanguage('en');
});

describe('with mock-server', () => {
  const mockServerClient = new MockServerClient();

  afterEach(async () => {
    await mockServerClient.reset();
  });

  it('should display the right primary email', async () => {
    await mockServerClient.addExpectation('/v2/self', {
      email: 'foo@example.com',
      emailValidated: true,
    });
    await mockServerClient.addExpectation('/v2/self/emails', []);

    const component = await createComponentWithSmart('http://localhost:1080');
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
