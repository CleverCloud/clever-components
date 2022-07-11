const modeValues = ['home', 'overview', 'billing'];

const ACME_CORP_ERROR_1 = { type: 1, orgaName: 'ACME coporation', orgaBillingLink: '/the-page/acme-coporation' };
const MY_SIDE_PROJECT_ERROR_2 = { type: 2, orgaName: 'My side project', orgaBillingLink: '/the-page/my-side-project' };
const SECRET_STARTUP_ERROR_3 = { type: 3, orgaName: 'Secret startup', orgaBillingLink: '/the-page/secret-startup' };

export const variants = [
  { mode: 'billing', errors: [{ type: ACME_CORP_ERROR_1.type }] },
  { mode: 'billing', errors: [{ type: MY_SIDE_PROJECT_ERROR_2.type }] },
  { mode: 'billing', errors: [{ type: SECRET_STARTUP_ERROR_3.type }] },
  { mode: 'overview', errors: [ACME_CORP_ERROR_1] },
  { mode: 'overview', errors: [MY_SIDE_PROJECT_ERROR_2] },
  { mode: 'overview', errors: [SECRET_STARTUP_ERROR_3] },
  { mode: 'home', errors: [ACME_CORP_ERROR_1] },
  { mode: 'home', errors: [MY_SIDE_PROJECT_ERROR_2] },
  { mode: 'home', errors: [SECRET_STARTUP_ERROR_3] },
  { mode: 'home', errors: [ACME_CORP_ERROR_1, MY_SIDE_PROJECT_ERROR_2, SECRET_STARTUP_ERROR_3] },
];

export const style = `
  cc-warning-payment:not(:defined) {
    background-color: #fff9cb;
    border: 1px solid #e9e138;
    border-radius: 0.25em;
    color: #262626;
    display: grid;
    gap: 1em;
    grid-template-columns: min-content 1fr;
    line-height: 1.5;
    padding: 1em;
    min-height: 4em;
  }
`;
