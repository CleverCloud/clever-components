/* eslint-disable camelcase -- snake_case names are the CLI, results and case-file field names */
// Free wiring test: pushes a reference attempt, an empty attempt and (where it matters) a doc-rule violation
// through the graders. No model call.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO, buildWorkspace, collectEndState, grade, loadCaseList, releaseWorkspace } from './lib.mjs';

const only = process.argv[2]?.split(',');

const bash = (command) => ({ name: 'Bash', input: { command } });
const read = (...docs) =>
  docs.map((doc) => ({ name: 'Read', input: { file_path: `/ws/docs/contributing/${doc}.md` } }));
const LINT = [bash('pnpm format'), bash('pnpm lint'), bash('pnpm stylelint')];
const run = (ws, cmd) => execFileSync('bash', ['-c', cmd], { cwd: ws, stdio: 'pipe' });
const edit = (ws, path, fn) => writeFileSync(join(ws, path), fn(readFileSync(join(ws, path), 'utf8')));
const sub = (src, from, to) => {
  if (!src.includes(from)) {
    throw new Error(`selftest anchor not found: ${from}`);
  }
  return src.replace(from, to);
};
const tidy = (ws, ...paths) => run(ws, `pnpm exec prettier --write ${paths.join(' ')} >/dev/null`);

const BADGE = 'src/components/cc-badge/cc-badge.js';
const BADGE_STORIES = 'src/components/cc-badge/cc-badge.stories.js';
const DOC_CARD = 'src/components/cc-doc-card/cc-doc-card.js';
const SSH = 'src/components/cc-ssh-key-list/cc-ssh-key-list.js';
const EN = 'src/translations/translations.en.js';
const FR = 'src/translations/translations.fr.js';
const DOT = 'src/components/cc-status-dot';
const TILE = 'src/components/cc-tile-instances';

const NOTICE = 'src/components/cc-notice/cc-notice.js';
const heading = (ws, color) => {
  const rules = ['success', 'warning', 'info:primary', 'danger']
    .map((intent) => {
      const [name, token = name] = intent.split(':');
      return `\n        :host([intent='${name}']) .heading {\n          color: ${color(token)};\n        }\n`;
    })
    .join('');
  edit(ws, NOTICE, (s) => sub(s, '      `,\n    ];', `${rules}      \`,\n    ];`));
  tidy(ws, NOTICE);
};
const FORM = 'src/components/cc-feedback-form';
const feedbackForm = (ws, formTag) => {
  run(ws, `mkdir -p ${FORM}`);
  writeFileSync(
    join(ws, `${FORM}/cc-feedback-form.js`),
    `import { css, html, LitElement } from 'lit';\nimport { formSubmit } from '../../lib/form/form-submit-directive.js';\nimport '../cc-input-text/cc-input-text.js';\nimport { CcFeedbackSubmitEvent } from './cc-feedback-form.events.js';\n\n/**\n * A feedback form.\n *\n * @cssdisplay block\n */\nexport class CcFeedbackForm extends LitElement {\n  _onSubmit(data) {\n    this.dispatchEvent(new CcFeedbackSubmitEvent(data));\n  }\n\n  render() {\n    return html\`${formTag}<cc-input-text name="email" required></cc-input-text></form>\`;\n  }\n\n  static get styles() {\n    return [\n      css\`\n        :host {\n          display: block;\n        }\n      \`,\n    ];\n  }\n}\n\nwindow.customElements.define('cc-feedback-form', CcFeedbackForm);\n`,
  );
  writeFileSync(
    join(ws, `${FORM}/cc-feedback-form.events.js`),
    `import { CcEvent } from '../../lib/events.js';\n\n/**\n * Dispatched when the feedback form is submitted.\n * @extends {CcEvent<{email: string, message: string}>}\n */\nexport class CcFeedbackSubmitEvent extends CcEvent {\n  static TYPE = 'cc-feedback-submit';\n\n  /** @param {{email: string, message: string}} detail */\n  constructor(detail) {\n    super(CcFeedbackSubmitEvent.TYPE, detail);\n  }\n}\n`,
  );
  writeFileSync(
    join(ws, `${FORM}/cc-feedback-form.stories.js`),
    `import { makeStory } from '../../stories/lib/make-story.js';\nimport './cc-feedback-form.js';\n\nexport default {\n  tags: ['autodocs'],\n  title: '🛠 Forms/<cc-feedback-form>',\n  component: 'cc-feedback-form',\n};\n\nconst conf = {\n  component: 'cc-feedback-form',\n};\n\nexport const defaultStory = makeStory(conf, {\n  items: [{}],\n});\n`,
  );
};
const SSH_STORIES = 'src/components/cc-ssh-key-list/cc-ssh-key-list.stories.js';
const moveKeys = (ws, target, importPath) => {
  run(ws, `mkdir -p ${target.split('/').slice(0, -1).join('/')}`);
  writeFileSync(
    join(ws, target),
    "export const DUMMY_KEY_1 = { type: 'idle', name: 'Work laptop', fingerprint: 'SHA256:xxx' };\n",
  );
  edit(ws, SSH_STORIES, (s) =>
    sub(
      sub(s, 'const DUMMY_KEY_1 = {', 'const LOCAL_KEY_1 = {'),
      "import './cc-ssh-key-list.js';",
      `import { DUMMY_KEY_1 } from '${importPath}';\nimport './cc-ssh-key-list.js';`,
    ),
  );
};
const hover = (ws, body) => {
  edit(ws, DOC_CARD, (s) =>
    sub(s, '      `,\n    ];', `\n        :host(:hover) {\n${body}\n        }\n      \`,\n    ];`),
  );
  tidy(ws, DOC_CARD);
};
const count = (ws, en, fr) => {
  const key = (value) =>
    `  'cc-ssh-key-list.personal.count': /** @param {{count: number}} _ */ ({ count }) => ${value},\n`;
  edit(ws, EN, (s) =>
    sub(
      s,
      "  'cc-ssh-key-list.personal.delete': `Delete`,",
      `${key(en)}  'cc-ssh-key-list.personal.delete': \`Delete\`,`,
    ),
  );
  edit(ws, FR, (s) =>
    sub(
      s,
      "  'cc-ssh-key-list.personal.delete': `Supprimer`,",
      `${key(fr)}  'cc-ssh-key-list.personal.delete': \`Supprimer\`,`,
    ),
  );
  edit(ws, SSH, (s) =>
    sub(
      s,
      "<span>${i18n('cc-ssh-key-list.personal.title')}</span>",
      "<span>${i18n('cc-ssh-key-list.personal.title')}</span>\n<span>${i18n('cc-ssh-key-list.personal.count', { count: 3 })}</span>",
    ),
  );
  tidy(ws, EN, FR, SSH);
};
const live = (ws, attrs) => {
  edit(ws, SSH, (s) =>
    sub(
      s,
      'return html`\n      <cc-block>',
      `return html\`\n      <div ${attrs}>\${i18n('cc-ssh-key-list.personal.title')}</div>\n      <cc-block>`,
    ),
  );
  tidy(ws, SSH);
};
const story = (ws, name) => {
  edit(
    ws,
    BADGE_STORIES,
    (s) =>
      sub(
        s,
        "import { makeStory } from '../../stories/lib/make-story.js';",
        "import { makeStory, storyWait } from '../../stories/lib/make-story.js';",
      ) +
      `\nexport const ${name} = makeStory(conf, {\n  items: [{ innerHTML: 'ready', skeleton: true }],\n  simulations: [\n    storyWait(2000, ([component]) => {\n      component.skeleton = false;\n    }),\n  ],\n});\n`,
  );
  tidy(ws, BADGE_STORIES);
};
const smart = (ws, client) => {
  writeFileSync(
    join(ws, `${TILE}/cc-tile-instances.smart.js`),
    `${client.imports}\nimport { defineSmartComponent } from '../../lib/smart/define-smart-component.js';\nimport '../cc-smart-container/cc-smart-container.js';\nimport './cc-tile-instances.js';\n\ndefineSmartComponent({\n  selector: 'cc-tile-instances',\n  params: { apiConfig: { type: Object }, ownerId: { type: String }, appId: { type: String } },\n  onContextUpdate({ context, updateComponent, signal }) {\n    updateComponent('state', { type: 'loading' });\n    ${client.call}\n      .then((instances) => updateComponent('state', { type: 'loaded', running: instances, deploying: [] }))\n      .catch(() => updateComponent('state', { type: 'error' }));\n  },\n});\n`,
  );
  writeFileSync(
    join(ws, `${TILE}/cc-tile-instances.smart.md`),
    "---\nkind: '🛠 Overview/<cc-tile-instances>'\ntitle: '💡 Smart'\n---\n\n## ℹ️ Details\n\n## ⚙️ Params\n\n## 🌐 API endpoints\n",
  );
  tidy(ws, `${TILE}/cc-tile-instances.smart.js`, `${TILE}/cc-tile-instances.smart.md`);
};
const dot = (ws, { jsdoc, color }) => {
  run(ws, `mkdir -p ${DOT}`);
  writeFileSync(
    join(ws, `${DOT}/cc-status-dot.js`),
    `import { css, html, LitElement } from 'lit';\n\n/**\n * A coloured dot followed by a label.\n *\n${jsdoc} */\nexport class CcStatusDot extends LitElement {\n  static get properties() {\n    return {\n      intent: { type: String },\n      skeleton: { type: Boolean },\n    };\n  }\n\n  constructor() {\n    super();\n\n    /** @type {'success'|'warning'|'danger'|'neutral'} Sets the colour of the dot. */\n    this.intent = 'neutral';\n\n    /** @type {boolean} Whether the component should be displayed as skeleton. */\n    this.skeleton = false;\n  }\n\n  render() {\n    return html\`<span class="dot"></span><slot></slot>\`;\n  }\n\n  static get styles() {\n    return [\n      // language=CSS\n      css\`\n        :host {\n          display: inline-flex;\n        }\n\n        .dot {\n          background-color: ${color};\n        }\n      \`,\n    ];\n  }\n}\n\nwindow.customElements.define('cc-status-dot', CcStatusDot);\n`,
  );
  writeFileSync(
    join(ws, `${DOT}/cc-status-dot.stories.js`),
    `import { makeStory } from '../../stories/lib/make-story.js';\nimport './cc-status-dot.js';\n\nexport default {\n  tags: ['autodocs'],\n  title: '🧬 Atoms/<cc-status-dot>',\n  component: 'cc-status-dot',\n};\n\nconst conf = {\n  component: 'cc-status-dot',\n};\n\nexport const defaultStory = makeStory(conf, {\n  items: [{ intent: 'success', innerHTML: 'Running' }],\n});\n`,
  );
  tidy(ws, `${DOT}/cc-status-dot.js`, `${DOT}/cc-status-dot.stories.js`);
};

// Each scenario returns the fake run and lists what the grade must be.
// expect: 'pass' | 'fail', or { rule: 0|1 } when only the doc-rule verdict is asserted.
const NULL = () => ({ output: '', toolCalls: [] });
const SCENARIOS = {
  D1: {
    reference: {
      expect: { rule: 1, named: ['smart_structure', 'smart_md_sections'] },
      act: (ws) => {
        smart(ws, {
          imports:
            "import { ListApplicationInstanceCommand } from '@clevercloud/client/cc-api-commands/instance/list-application-instance-command.js';\nimport { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';",
          call: 'getCcApiClientWithOAuth(context.apiConfig).send(new ListApplicationInstanceCommand({ ownerId: context.ownerId, applicationId: context.appId }), { signal })',
        });
        return { output: 'done', toolCalls: [...read('clever-client', 'smart-component'), ...LINT] };
      },
    },
    legacy_client: {
      expect: { rule: 0 },
      act: (ws) => {
        smart(ws, {
          imports:
            "import { getAllInstances } from '@clevercloud/client/esm/api/v2/application.js';\nimport { sendToApi } from '../../lib/send-to-api.js';",
          call: 'getAllInstances({ id: context.ownerId, appId: context.appId }).then(sendToApi({ apiConfig: context.apiConfig, signal }))',
        });
        return { output: 'done', toolCalls: [...read('clever-client', 'smart-component'), ...LINT] };
      },
    },
    null: { expect: 'fail', act: NULL },
  },
  D5: {
    reference: {
      expect: 'pass',
      act: (ws) => {
        hover(
          ws,
          '          background-color: var(--cc-color-bg-neutral-hovered, #f5f5f5);\n          border-color: var(--cc-color-border-neutral-hovered, #777);',
        );
        return { output: 'done', toolCalls: [...read('wc-guidelines'), ...LINT] };
      },
    },
    no_fallback: {
      expect: { rule: 0 },
      act: (ws) => {
        hover(
          ws,
          '          background-color: var(--cc-color-bg-neutral-hovered);\n          border-color: var(--cc-color-border-neutral-hovered);',
        );
        return { output: 'done', toolCalls: [...read('wc-guidelines'), ...LINT] };
      },
    },
    not_routed: {
      expect: 'pass',
      act: (ws) => {
        hover(
          ws,
          '          background-color: var(--cc-color-bg-neutral-hovered, #f5f5f5);\n          border-color: var(--cc-color-border-neutral-hovered, #777);',
        );
        return { output: 'done', toolCalls: LINT };
      },
    },
    null: { expect: 'fail', act: NULL },
  },
  D6: {
    reference: {
      expect: 'pass',
      act: (ws) => {
        count(ws, "`${count} ${plural(count, 'key')}`", "`${count} ${plural(count, 'clé')}`");
        return { output: 'done', toolCalls: [...read('i18n'), ...LINT] };
      },
    },
    ternary: {
      expect: { rule: 0 },
      act: (ws) => {
        count(ws, "`${count} ${count === 1 ? 'key' : 'keys'}`", "`${count} ${count > 1 ? 'clés' : 'clé'}`");
        return { output: 'done', toolCalls: [...read('i18n'), ...LINT] };
      },
    },
    null: { expect: 'fail', act: NULL },
  },
  D8: {
    reference: {
      expect: 'pass',
      act: (ws) => {
        live(ws, 'aria-live="polite" aria-atomic="true"');
        return { output: 'done', toolCalls: [...read('wc-accessibility'), ...LINT] };
      },
    },
    alert_role: {
      expect: { rule: 0 },
      act: (ws) => {
        live(ws, 'role="alert"');
        return { output: 'done', toolCalls: [...read('wc-accessibility'), ...LINT] };
      },
    },
    null: { expect: 'fail', act: NULL },
  },
  D9: {
    reference: {
      expect: 'pass',
      act: (ws) => {
        story(ws, 'simulationWithSkeleton');
        return { output: 'done', toolCalls: [...read('stories'), ...LINT] };
      },
    },
    wrong_name: {
      expect: { rule: 0 },
      act: (ws) => {
        story(ws, 'skeletonThenLoaded');
        return { output: 'done', toolCalls: [...read('stories'), ...LINT] };
      },
    },
    null: { expect: 'fail', act: NULL },
  },
  D10: {
    reference: {
      expect: 'pass',
      act: () => ({ output: 'They pass.', toolCalls: [...read('test'), bash('pnpm test:group a11y:cc-badge')] }),
    },
    via_codebase_map: {
      expect: 'pass',
      act: () => ({
        output: 'They pass.',
        toolCalls: [...read('codebase-map'), bash('pnpm run test:group a11y:cc-badge')],
      }),
    },
    full_suite: {
      expect: { rule: 0 },
      act: () => ({ output: 'They pass.', toolCalls: [...read('test'), bash('pnpm test')] }),
    },
    null: { expect: 'fail', act: NULL },
  },
  D11: {
    reference: {
      expect: 'pass',
      act: () => ({
        output: 'Add the `run-visual-tests` label to the PR, the CI posts the report.',
        toolCalls: read('test'),
      }),
    },
    local_run: {
      expect: { rule: 0 },
      act: () => ({ output: 'Run pnpm test:visual locally.', toolCalls: read('test') }),
    },
    null: { expect: 'fail', act: NULL },
  },
  D12: {
    reference: {
      expect: 'pass',
      act: () => ({
        output: 'Not a bug: a story with simulations has its a11y and visual tests disabled by default.',
        toolCalls: read('stories'),
      }),
    },
    null: { expect: 'fail', act: NULL },
  },
  D13: {
    reference: {
      expect: { rule: 1, named: ['component_structure', 'stories_use_make_story', 'check_lit'] },
      act: (ws) => {
        dot(ws, { jsdoc: ' * @cssdisplay inline-flex\n', color: 'var(--cc-color-bg-success, #098846)' });
        return { output: 'done', toolCalls: [...read('wc-guidelines', 'wc-accessibility', 'stories'), ...LINT] };
      },
    },
    no_cssdisplay_no_fallback: {
      expect: { rule: 0 },
      act: (ws) => {
        dot(ws, { jsdoc: ' * @prop {string} intent - the intent\n', color: 'var(--cc-color-bg-success)' });
        return { output: 'done', toolCalls: [...read('wc-guidelines', 'wc-accessibility', 'stories'), ...LINT] };
      },
    },
    null: { expect: 'fail', act: NULL },
  },
  D14: {
    reference: {
      expect: 'pass',
      act: (ws) => {
        heading(ws, (token) => `var(--cc-color-text-${token}, #333)`);
        return { output: 'done', toolCalls: [...read('wc-guidelines'), ...LINT] };
      },
    },
    copied_from_neighbour: {
      expect: { rule: 0 },
      act: (ws) => {
        heading(ws, (token) => `var(--cc-color-text-${token})`);
        return { output: 'done', toolCalls: [...read('wc-guidelines'), ...LINT] };
      },
    },
    not_routed: {
      expect: 'pass',
      act: (ws) => {
        heading(ws, (token) => `var(--cc-color-text-${token}, #333)`);
        return { output: 'done', toolCalls: LINT };
      },
    },
    null: { expect: 'fail', act: NULL },
  },
  D15: {
    reference: {
      expect: { rule: 1, named: ['component_structure', 'stories_use_make_story', 'new_event_class'] },
      act: (ws) => {
        feedbackForm(ws, '<form ${formSubmit(this._onSubmit.bind(this))}>');
        return {
          output: 'done',
          toolCalls: [...read('forms', 'wc-guidelines', 'wc-accessibility', 'stories'), ...LINT],
        };
      },
    },
    hand_rolled_submit: {
      expect: { rule: 0 },
      act: (ws) => {
        feedbackForm(ws, '<form novalidate @submit=${this._onSubmit}>');
        return {
          output: 'done',
          toolCalls: [...read('forms', 'wc-guidelines', 'wc-accessibility', 'stories'), ...LINT],
        };
      },
    },
    null: { expect: 'fail', act: NULL },
  },
  D16: {
    reference: {
      expect: 'pass',
      act: () => ({
        output:
          'Set an error code in formState.errors from the smart component, map the code in _getErrorMessage() and pass it through the errorMessage property.',
        toolCalls: read('forms'),
      }),
    },
    toast_only: {
      expect: { rule: 0 },
      act: () => ({ output: 'Call notifyError() with the message.', toolCalls: read('forms') }),
    },
    null: { expect: 'fail', act: NULL },
  },
  D17: {
    reference: {
      expect: 'pass',
      act: () => ({
        output:
          'Two of our sites change the root font size (62.5% in the admin dashboard), which broke rem-based sizes.',
        toolCalls: [{ name: 'Read', input: { file_path: '/ws/docs/adr/adr-0021-from-rem-to-em.md' } }],
      }),
    },
    generic_answer: {
      expect: 'fail',
      act: () => ({
        output: 'em scales with the font size of the component, rem with the root.',
        toolCalls: read('wc-guidelines'),
      }),
    },
    null: { expect: 'fail', act: NULL },
  },
  D18: {
    reference: {
      expect: 'pass',
      act: (ws) => {
        run(
          ws,
          `git -c user.name=t -c user.email=t@t.invalid commit -qm "docs(cc-badge): fix typo in circle description"`,
        );
        return {
          output: 'Committed. Nothing else to do: release-please opens the release PR from the commits.',
          toolCalls: [...read('release'), bash('git commit -m ...')],
        };
      },
    },
    manual_changelog: {
      expect: { rule: 0 },
      act: (ws) => {
        run(
          ws,
          `echo "- fix typo" >> CHANGELOG.md && git add -A && git -c user.name=t -c user.email=t@t.invalid commit -qm "docs(cc-badge): fix typo"`,
        );
        return {
          output: 'Committed and added a CHANGELOG entry.',
          toolCalls: [...read('agent-tooling'), bash('git commit -m ...')],
        };
      },
    },
    null: { expect: 'fail', act: NULL },
  },
  D19: {
    reference: {
      expect: { rule: 1, named: ['stories_import_fixture', 'keys_no_longer_inline'] },
      act: (ws) => {
        moveKeys(ws, 'src/stories/fixtures/ssh-keys.js', '../../stories/fixtures/ssh-keys.js');
        return { output: 'done', toolCalls: [...read('codebase-map'), ...LINT] };
      },
    },
    wrong_place: {
      expect: { rule: 0 },
      act: (ws) => {
        moveKeys(ws, 'src/stubs/ssh-keys.js', '../../stubs/ssh-keys.js');
        return { output: 'done', toolCalls: [...read('codebase-map'), ...LINT] };
      },
    },
    null: { expect: 'fail', act: NULL },
  },
  N1: {
    reference: {
      expect: 'pass',
      act: (ws) => {
        run(ws, `git -C "${REPO}" show 58e7bdf8 --pretty=format: | git apply`);
        return { output: 'Fixed.', toolCalls: LINT };
      },
    },
    null: { expect: 'fail', act: NULL },
  },
  N2: {
    reference: {
      expect: 'pass',
      act: () => ({
        output: 'It sets how much the badge stands out: dimmed (default), outlined or strong.',
        toolCalls: [],
      }),
    },
    null: { expect: 'fail', act: NULL },
  },
  N3: {
    reference: {
      expect: 'pass',
      act: (ws) => {
        run(ws, `pnpm exec stylelint --fix ${BADGE}; pnpm exec prettier --write ${BADGE}`);
        return { output: 'Fixed formatting and property order.', toolCalls: LINT };
      },
    },
    rule_deleted: {
      expect: 'fail',
      act: (ws) => {
        run(ws, `git checkout -q -- ${BADGE}`);
        return { output: 'All good.', toolCalls: LINT };
      },
    },
    null: { expect: 'fail', act: NULL },
  },
  N4: {
    reference: {
      expect: 'pass',
      act: (ws) => {
        run(
          ws,
          `git -c user.name=t -c user.email=t@t.invalid commit -qm "fix(cc-notice): fix typo in French success label"`,
        );
        return {
          output: 'Committed as fix(cc-notice): fix typo in French success label',
          toolCalls: [bash('git commit -m ...')],
        };
      },
    },
    wrong_scope: {
      expect: 'fail',
      act: (ws) => {
        run(ws, `git -c user.name=t -c user.email=t@t.invalid commit -qm "fix: typo"`);
        return { output: 'Committed.', toolCalls: [bash('git commit -m ...')] };
      },
    },
    null: { expect: 'fail', act: NULL },
  },
};

let bad = 0;
for (const c of loadCaseList()) {
  if (only && !only.includes(c.id)) {
    continue;
  }
  for (const [kind, { expect, act }] of Object.entries(SCENARIOS[c.id] ?? {})) {
    const { ws, startTree } = await buildWorkspace(c, 'selftest');
    let line;
    try {
      const fake = act(ws);
      const state = await collectEndState(ws, startTree);
      const g = await grade(c, fake, state);
      const named = (expect.named ?? []).filter((n) => !g.checks.find((k) => k.name === n)?.pass);
      const ok =
        typeof expect === 'string'
          ? g.grade.pass === (expect === 'pass' ? 1 : 0)
          : g.grade.doc_rule === expect.rule && named.length === 0;
      if (!ok) {
        bad++;
      }
      line =
        `${ok ? 'OK  ' : 'BAD '} ${c.id.padEnd(3)} ${kind.padEnd(26)} pass=${g.grade.pass} routed=${g.grade.routed} rule=${g.grade.doc_rule} checks=${g.grade.checks} | ${g.explanation.pass}`.slice(
          0,
          230,
        );
      if (!ok) {
        line += `\n${g.explanation.end_state}\n${g.explanation.process}`;
      }
    } catch (e) {
      bad++;
      line = `BAD  ${c.id} ${kind}: ${String(e.message).slice(0, 400)}`;
    } finally {
      releaseWorkspace(ws);
    }
    console.log(line);
  }
}
process.exit(bad ? 1 : 0);
