/* eslint-disable camelcase -- snake_case names are the CLI, results and case-file field names */
// Workspace builder, headless agent runner and graders for the AGENTS.md eval.
// The app under test is `claude -p` run in a disposable copy of the repo.

import { execFile, spawn } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileP = promisify(execFile);

export const EVAL_DIR = dirname(fileURLToPath(import.meta.url));
const CONFIG = JSON.parse(readFileSync(join(EVAL_DIR, 'cases.json'), 'utf8'));
// The eval lives outside the repository it tests: point EVAL_REPO at another checkout if needed.
export const REPO = process.env.EVAL_REPO ?? join(homedir(), 'dev/projects/github/clever-components');
// Workspaces live outside the repo: a copy nested in it would inherit the repo's own AGENTS.md and git state.
const WORK_DIR = process.env.EVAL_WORK_DIR ?? join(tmpdir(), 'clever-components-agents-md-eval');
const WS_ROOT = join(WORK_DIR, 'workspaces');
const TMP_ROOT = join(WORK_DIR, 'tmp');
// Agent instructions under test, taken from the working tree so uncommitted edits are evaluated.
const INSTRUCTION_PATHS = ['AGENTS.md', 'CLAUDE.md', 'docs'];
const GIT_ID = ['-c', 'user.name=eval', '-c', 'user.email=eval@example.invalid', '-c', 'commit.gpgsign=false'];
const MAX_BUFFER = 256 * 1024 * 1024;

export function loadCaseList() {
  return CONFIG.cases;
}

/** Runs a command, never throws on a non-zero exit. */
async function sh(cmd, args, opts = {}) {
  try {
    const { stdout, stderr } = await execFileP(cmd, args, { maxBuffer: MAX_BUFFER, ...opts });
    return { code: 0, stdout, stderr };
  } catch (e) {
    if (typeof e.code !== 'number') {
      throw e;
    }
    return { code: e.code, stdout: e.stdout ?? '', stderr: e.stderr ?? '' };
  }
}

/** Runs a command that is part of the harness: a failure is a harness error, not a grade. */
async function must(cmd, args, opts = {}) {
  const r = await sh(cmd, args, opts);
  if (r.code !== 0) {
    throw new Error(`harness: ${cmd} ${args.join(' ')} exited ${r.code}: ${(r.stderr || r.stdout).slice(-500)}`);
  }
  return r.stdout;
}

function scratchDir(prefix) {
  mkdirSync(TMP_ROOT, { recursive: true });
  return mkdtempSync(join(TMP_ROOT, prefix));
}

/**
 * Deletes a finished workspace. Each one costs about 65k inodes with its dependencies, and a few hundred
 * leftover copies exhaust a tmpfs. The diff the agent left is kept in the trace.
 */
export function releaseWorkspace(ws) {
  rmSync(ws, { recursive: true, force: true });
}

async function snapshotTree(ws) {
  const dir = scratchDir('idx-');
  const env = { ...process.env, GIT_INDEX_FILE: join(dir, 'index') };
  try {
    await must('git', ['add', '-A'], { cwd: ws, env });
    return (await must('git', ['write-tree'], { cwd: ws, env })).trim();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// --- workspace --------------------------------------------------------------

/**
 * Builds a fresh, history-less copy of the repo for one attempt.
 * `oracle: true` skips the reverse-apply so the workspace already holds the reference solution.
 */
export async function buildWorkspace(c, variant, { oracle = false } = {}) {
  mkdirSync(join(WS_ROOT, variant), { recursive: true });
  const ws = mkdtempSync(join(WS_ROOT, variant, `${c.id}_`));
  await must('bash', ['-c', `git -C "${REPO}" archive ${CONFIG.base_sha} | tar -x -C "${ws}"`]);
  for (const path of INSTRUCTION_PATHS) {
    cpSync(join(REPO, path), join(ws, path), { recursive: true });
  }
  if (c.replay && !oracle) {
    // newest first: follow-up commits that depend on the replayed one are reversed too, so they cannot leak its solution
    for (const sha of [c.replay].flat()) {
      await must('bash', ['-c', `git -C "${REPO}" show ${sha} --pretty=format: | git apply -R`], { cwd: ws });
    }
  }
  // a pre-patch puts the workspace in the state the user's pending change starts from (e.g. a typo to fix)
  if (c.seed?.pre_patch) {
    await must('git', ['apply', join(EVAL_DIR, 'seeds', c.seed.pre_patch)], { cwd: ws });
  }
  // Offline first (fast, no network). The store next to the workspaces can be empty, e.g. after /tmp was cleared.
  const offline = await sh('pnpm', ['install', '--frozen-lockfile', '--offline'], { cwd: ws });
  if (offline.code !== 0) {
    await must('pnpm', ['install', '--frozen-lockfile'], { cwd: ws });
  }
  await must('git', ['init', '-q'], { cwd: ws });
  await must('git', ['add', '-A'], { cwd: ws });
  await must('git', [...GIT_ID, 'commit', '-q', '-m', 'baseline'], { cwd: ws });
  if (c.seed) {
    await must('git', ['apply', join(EVAL_DIR, 'seeds', c.seed.patch)], { cwd: ws });
    if (c.seed.staged) {
      await must('git', ['add', '-A'], { cwd: ws });
    }
  }
  return { ws, startTree: await snapshotTree(ws) };
}

// --- agent ------------------------------------------------------------------

const TOOL_RESULT_MAX = 6000;

function blockText(content) {
  if (typeof content === 'string') {
    return content;
  }
  if (!Array.isArray(content)) {
    return content == null ? '' : JSON.stringify(content);
  }
  return content.map((b) => (b.type === 'text' ? b.text : `[${b.type}]`)).join('\n');
}

/** Turns the stream-json events of `claude -p` into report turns and a flat tool-call list. */
export function parseStream(stdout, prompt) {
  const events = [];
  for (const line of stdout.split('\n')) {
    if (!line.trim()) {
      continue;
    }
    try {
      events.push(JSON.parse(line));
    } catch {
      // partial or non-JSON line: ignored, the result event check below catches a broken stream
    }
  }
  const init = events.find((e) => e.type === 'system' && e.subtype === 'init');
  const result = events.findLast((e) => e.type === 'result');
  const turns = [
    {
      role: 'system',
      content: `claude -p (Claude Code ${init?.claude_code_version ?? '?'}), model ${init?.model ?? '?'}, permission mode ${init?.permissionMode ?? '?'}.\nAGENTS.md is loaded through CLAUDE.md. The user-level CLAUDE.md is loaded too.`,
    },
    { role: 'user', content: prompt },
  ];
  const toolCalls = [];
  const byId = new Map();
  let model = null;
  let pendingThinking = '';
  for (const e of events) {
    if (e.type === 'assistant') {
      if (e.parent_tool_use_id == null && model == null) {
        model = e.message?.model ?? null;
      }
      for (const b of e.message?.content ?? []) {
        if (b.type === 'thinking') {
          pendingThinking += b.thinking ?? '';
        } else if (b.type === 'text' && b.text.trim()) {
          turns.push({ role: 'assistant', content: b.text, ...(pendingThinking ? { thinking: pendingThinking } : {}) });
          pendingThinking = '';
        } else if (b.type === 'tool_use') {
          const call = {
            id: b.id,
            name: b.name,
            input: b.input ?? {},
            result: null,
            is_error: false,
            sub: e.parent_tool_use_id != null,
          };
          toolCalls.push(call);
          byId.set(b.id, call);
          turns.push({
            role: 'tool_call',
            name: b.name,
            content: JSON.stringify(b.input ?? {}, null, 2),
            ...(pendingThinking ? { thinking: pendingThinking } : {}),
          });
          pendingThinking = '';
        }
      }
    } else if (e.type === 'user') {
      for (const b of Array.isArray(e.message?.content) ? e.message.content : []) {
        if (b.type !== 'tool_result') {
          continue;
        }
        const text = blockText(b.content);
        const call = byId.get(b.tool_use_id);
        if (call) {
          call.result = text;
          call.is_error = b.is_error === true;
        }
        turns.push({
          role: 'tool_result',
          content:
            text.length > TOOL_RESULT_MAX
              ? `${text.slice(0, TOOL_RESULT_MAX)}\n[... ${text.length - TOOL_RESULT_MAX} more characters]`
              : text,
        });
      }
    }
  }
  return { init, result, turns, toolCalls, model };
}

function runClaude(args, { cwd, timeoutMs }) {
  return new Promise((resolve, reject) => {
    const env = { ...process.env };
    delete env.CLAUDECODE;
    delete env.CLAUDE_CODE_ENTRYPOINT;
    const child = spawn('claude', args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('error', (e) => {
      clearTimeout(timer);
      reject(e);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (timedOut) {
        const e = new Error(`claude killed after ${Math.round(timeoutMs / 1000)}s`);
        e.failure_class = 'timeout';
        return reject(e);
      }
      resolve({ code, stdout, stderr });
    });
  });
}

export async function runAgent(c, { ws, model, timeoutS, extraArgs = [] }) {
  const args = [
    '-p',
    c.prompt,
    '--model',
    model,
    '--output-format',
    'stream-json',
    '--verbose',
    '--dangerously-skip-permissions',
    '--strict-mcp-config',
    '--no-session-persistence',
    '--max-budget-usd',
    String(CONFIG.max_budget_usd),
    ...extraArgs,
  ];
  const { code, stdout, stderr } = await runClaude(args, { cwd: ws, timeoutMs: Math.max(60, timeoutS - 180) * 1000 });
  const parsed = parseStream(stdout, c.prompt);
  const { result } = parsed;
  if (result == null) {
    throw new Error(`claude exited ${code} without a result event: ${stderr.slice(-400)}`);
  }
  const budgetStop = /max_budget|max_turns/.test(result.subtype ?? '');
  if ((result.is_error || result.subtype !== 'success') && !budgetStop) {
    throw new Error(`claude result ${result.subtype}: ${String(result.result ?? stderr).slice(0, 400)}`);
  }
  const u = result.usage ?? {};
  const usage = {
    input_tokens: u.input_tokens ?? 0,
    output_tokens: u.output_tokens ?? 0,
    cache_read_input_tokens: u.cache_read_input_tokens ?? 0,
    cache_creation_input_tokens: u.cache_creation_input_tokens ?? 0,
  };
  if (parsed.model == null || usage.output_tokens === 0) {
    throw new Error(`run is missing model or usage (model=${parsed.model}, output_tokens=${usage.output_tokens})`);
  }
  return {
    output: String(result.result ?? ''),
    transcript: parsed.turns,
    toolCalls: parsed.toolCalls,
    model: parsed.model,
    usage,
    stop_reason: result.stop_reason ?? result.subtype,
    status: budgetStop ? 'truncated' : 'ok',
    cost_cli_usd: result.total_cost_usd,
    num_turns: result.num_turns,
    duration_s: (result.duration_ms ?? 0) / 1000,
  };
}

// --- end state --------------------------------------------------------------

export async function collectEndState(ws, startTree) {
  const endTree = await snapshotTree(ws);
  const names = (await must('git', ['diff', '--name-status', '--no-renames', startTree, endTree], { cwd: ws }))
    .split('\n')
    .filter(Boolean)
    .map((l) => {
      const [status, path] = l.split('\t');
      return { status, path };
    });
  const diff = await must('git', ['diff', '--no-renames', startTree, endTree], { cwd: ws });
  const baseSha = (await must('git', ['rev-list', '--max-parents=0', 'HEAD'], { cwd: ws })).trim();
  const commits = (await must('git', ['log', '--format=%s', `${baseSha}..HEAD`], { cwd: ws }))
    .split('\n')
    .filter(Boolean);
  return { ws, startTree, endTree, changed: names, diff, commits };
}

// --- transcript facts -------------------------------------------------------

const RUNNER = String.raw`(?:pnpm|npm|npx|yarn)\s+(?:(?:run|exec|-s|--silent)\s+)*`;
const RE = {
  format: new RegExp(`${RUNNER}(?:format\\b|prettier\\b)`),
  lint: new RegExp(`${RUNNER}(?:lint\\b|eslint\\b)`),
  stylelint: new RegExp(`${RUNNER}stylelint\\b`),
  eventsGenerate: /components:events-map-generate|generate-events-map\.js(?!\s+check)/,
  anyScript: /(?:^|[\s;&|(])(?:pnpm|npm|npx|yarn)\s/,
  forbidden: new RegExp(
    `${RUNNER}(?:preview:|cdn-preview:|cdn-release:|prepack|test:visual|storybook:dev|test:watch|test:mocha:watch)` +
      String.raw`|tasks/preview\.js|tasks/cdn-cli\.js|web-test-runner\.visual-tests\.config|--update-expectation`,
  ),
};
// a contributor doc is named by its file stem ("forms"), an ADR by its number ("adr-0021")
const DOC_RE = /docs\/(?:contributing\/([\w-]+)\.md|adr\/(adr-\d{4}))/g;

export function transcriptFacts(toolCalls) {
  const commands = toolCalls.filter((t) => t.name === 'Bash').map((t) => String(t.input.command ?? ''));
  const docsRead = new Set();
  for (const t of toolCalls) {
    if (t.name === 'Read') {
      for (const m of String(t.input.file_path ?? '').matchAll(DOC_RE)) {
        docsRead.add(m[1] ?? m[2]);
      }
    } else if (t.name === 'Bash' && /\b(cat|head|tail|sed|less|bat|awk)\b/.test(String(t.input.command))) {
      for (const m of String(t.input.command).matchAll(DOC_RE)) {
        docsRead.add(m[1] ?? m[2]);
      }
    }
  }
  const edited = toolCalls
    .filter((t) => ['Edit', 'Write', 'MultiEdit', 'NotebookEdit'].includes(t.name))
    .map((t) => String(t.input.file_path ?? ''));
  return { commands, docsRead, edited };
}

// --- checks -----------------------------------------------------------------

const check = (kind, name, pass, detail = '') => ({ kind, name, pass: Boolean(pass), detail });
const tail = (r) => (r.stdout + r.stderr).trim().split('\n').slice(-6).join('\n').slice(-600);

/** Lines added by the agent in one file (`path`) or in every file matching `pathRe`. */
function addedLines(diff, path, pathRe) {
  const out = [];
  let inFile = false;
  const re = pathRe ? new RegExp(pathRe) : null;
  for (const line of diff.split('\n')) {
    if (line.startsWith('diff --git ')) {
      inFile = re ? re.test(line.split(' b/')[1] ?? '') : line.endsWith(` b/${path}`);
    } else if (inFile && line.startsWith('+') && !line.startsWith('+++')) {
      out.push(line.slice(1));
    }
  }
  return out.join('\n');
}

async function fileAt(ws, tree, path) {
  const r = await sh('git', ['show', `${tree}:${path}`], { cwd: ws });
  return r.code === 0 ? r.stdout : '';
}

function translationKeys(source) {
  return [...source.matchAll(/^\s*'([^']+)':/gm)].map((m) => m[1]);
}

const CASE_CHECKS = {
  /** A new class extending CcEvent with a static TYPE exists in the events file. */
  async new_event_class(spec, s) {
    const count = (src) =>
      [...src.matchAll(/class\s+Cc\w+Event\s+extends\s+CcEvent\b[\s\S]*?static\s+TYPE\s*=\s*'cc-[\w-]+'/g)].length;
    const before = count(await fileAt(s.ws, s.startTree, spec.path));
    const after = count(await fileAt(s.ws, s.endTree, spec.path));
    return check('end', `new_event_class`, after > before, `${spec.path}: ${before} -> ${after} event classes`);
  },
  /** Every regex matches the lines the agent added to the file. */
  async added_lines_match(spec, s) {
    const added = addedLines(s.diff, spec.path, spec.path_re);
    const missing = spec.regexes.filter((r) => !new RegExp(r, 's').test(added));
    return check(
      'end',
      spec.name,
      missing.length === 0,
      missing.length ? `not found in added lines of ${spec.path ?? spec.path_re}: ${missing.join(' | ')}` : '',
    );
  },
  /** No regex matches the lines the agent added. */
  async added_lines_no_match(spec, s) {
    const added = addedLines(s.diff, spec.path, spec.path_re);
    const hits = spec.regexes.map((r) => added.match(new RegExp(r, 'm'))?.[0]).filter(Boolean);
    return check(
      'end',
      spec.name,
      hits.length === 0,
      hits.length ? `found in added lines of ${spec.path ?? spec.path_re}: ${hits.join(' | ').slice(0, 200)}` : '',
    );
  },
  /** The file exists in the end state. */
  async file_exists(spec, s) {
    const present = existsSync(join(s.ws, spec.path));
    return check(
      'end',
      spec.name ?? `exists_${spec.path.split('/').pop()}`,
      present,
      present ? '' : `${spec.path} is missing`,
    );
  },
  /** The end state of the file matches none of the regexes. */
  async file_not_matches(spec, s) {
    const src = await fileAt(s.ws, s.endTree, spec.path);
    const hits = spec.regexes.map((r) => src.match(new RegExp(r, 'm'))?.[0]).filter(Boolean);
    return check(
      'end',
      spec.name,
      hits.length === 0,
      hits.length ? `found in ${spec.path}: ${hits.join(' | ').slice(0, 200)}` : '',
    );
  },
  /** A command run in the end state exits 0. */
  async cmd(spec, s) {
    const r = await sh('bash', ['-c', spec.run], { cwd: s.ws });
    return check('end', spec.name, r.code === 0, r.code === 0 ? '' : tail(r));
  },
  /** None of the changed paths matches the regex. */
  async paths_untouched(spec, s) {
    const hits = s.changed.map((f) => f.path).filter((path) => new RegExp(spec.regex).test(path));
    return check('end', spec.name, hits.length === 0, hits.length ? `changed: ${hits.join(', ')}` : '');
  },
  /** At least one file was added at a path matching the regex. */
  async path_added(spec, s) {
    const added = s.changed.filter((f) => f.status === 'A').map((f) => f.path);
    const ok = added.some((path) => new RegExp(spec.regex).test(path));
    return check('end', spec.name, ok, ok ? '' : `files added: ${added.join(', ') || 'none'}`);
  },
  /** Exactly one commit was added and its subject matches the regex. */
  async commit_subject(spec, s) {
    const ok = s.commits.length === 1 && new RegExp(spec.regex).test(s.commits[0]);
    return check('end', spec.name, ok, `commits: ${JSON.stringify(s.commits)}`);
  },
  /** The end state of the file matches every regex. */
  async file_matches(spec, s) {
    const src = await fileAt(s.ws, s.endTree, spec.path);
    const missing = spec.regexes.filter((r) => !new RegExp(r, 's').test(src));
    return check(
      'end',
      spec.name,
      missing.length === 0,
      missing.length ? `not found in ${spec.path}: ${missing.join(' | ')}` : '',
    );
  },
  /** At least one new key with the prefix exists in both language files, each in alphabetical position. */
  async i18n_keys(spec, s) {
    const problems = [];
    const added = {};
    for (const lang of ['en', 'fr']) {
      const path = `src/translations/translations.${lang}.js`;
      const before = new Set(translationKeys(await fileAt(s.ws, s.startTree, path)));
      const keys = translationKeys(await fileAt(s.ws, s.endTree, path));
      added[lang] = keys.filter((k) => k.startsWith(spec.prefix) && !before.has(k));
      for (const k of added[lang]) {
        const i = keys.indexOf(k);
        const prev = keys[i - 1];
        const next = keys[i + 1];
        if (prev?.startsWith(spec.prefix) && prev > k) {
          problems.push(`${lang}: ${k} is after ${prev}`);
        }
        if (next?.startsWith(spec.prefix) && next < k) {
          problems.push(`${lang}: ${k} is before ${next}`);
        }
        if (!prev?.startsWith(spec.prefix) && !next?.startsWith(spec.prefix)) {
          problems.push(`${lang}: ${k} is outside its region`);
        }
      }
    }
    if (added.en.length === 0) {
      problems.push(`no new ${spec.prefix}* key in en`);
    }
    if (added.en.slice().sort().join() !== added.fr.slice().sort().join()) {
      problems.push(`en and fr differ: [${added.en}] vs [${added.fr}]`);
    }
    return check('end', 'i18n_keys', problems.length === 0, problems.join('; ') || `added ${added.en.join(', ')}`);
  },
  /** The final answer matches every regex. */
  async answer_matches(spec, s) {
    const missing = spec.regexes.filter((r) => !new RegExp(r, 'i').test(s.output));
    return check(
      'end',
      spec.name,
      missing.length === 0,
      missing.length ? `answer does not mention: ${missing.join(' | ')}` : '',
    );
  },
  /** Every regex matches at least one Bash command the agent ran. */
  async ran_commands(spec, s) {
    const missing = spec.regexes.filter((r) => !s.facts.commands.some((c) => new RegExp(r).test(c)));
    return check('process', spec.name, missing.length === 0, missing.length ? `never ran: ${missing.join(' | ')}` : '');
  },
  /** No Bash command matches the regex. */
  async no_command(spec, s) {
    const hit = s.facts.commands.find((c) => new RegExp(spec.regex).test(c));
    return check('process', spec.name, !hit, hit ? `ran: ${hit.slice(0, 160)}` : '');
  },
};

/**
 * Programmatic checks on what the agent left behind (kind "end") and on the rules it followed (kind "process").
 * `s` = { ws, startTree, endTree, changed, diff, commits, output, facts }.
 */
export async function runChecks(c, s) {
  const checks = [];
  const changedLive = s.changed.filter((f) => f.status !== 'D').map((f) => f.path);
  // seeded files are checked even when the agent left them untouched
  const live = [...new Set([...changedLive, ...(c.always_check ?? [])])];
  const all = s.changed.map((f) => f.path);
  const allowed = (c.allowed ?? []).map((r) => new RegExp(r));

  const outside = all.filter((p) => !allowed.some((r) => r.test(p)));
  checks.push(
    check(
      'end',
      allowed.length ? 'only_allowed_paths' : 'no_file_changed',
      outside.length === 0,
      outside.length ? `unexpected changes: ${outside.join(', ')}` : '',
    ),
  );
  const offLimits = all.filter((p) =>
    /\.(a11y|visual)\.test\.js$|^dist\/|^custom-elements\.json$|^src\/assets\/cc-.*\.icons\.js$/.test(p),
  );
  checks.push(check('end', 'no_generated_file_touched', offLimits.length === 0, offLimits.join(', ')));

  if (live.length > 0) {
    const prettier = await sh('pnpm', ['exec', 'prettier', '--check', '--ignore-unknown', ...live], { cwd: s.ws });
    checks.push(check('end', 'format_clean', prettier.code === 0, prettier.code === 0 ? '' : tail(prettier)));
    const js = live.filter((p) => /\.(js|mjs|ts)$/.test(p));
    if (js.length > 0) {
      const eslint = await sh('pnpm', ['exec', 'eslint', '--no-warn-ignored', ...js], { cwd: s.ws });
      checks.push(check('end', 'lint_clean', eslint.code === 0, eslint.code === 0 ? '' : tail(eslint)));
    }
    const styled = live.filter((p) => /^src\/components\/[^/]+\/[^/]+\.js$/.test(p));
    if (styled.length > 0) {
      const stylelint = await sh('pnpm', ['exec', 'stylelint', ...styled], { cwd: s.ws });
      checks.push(check('end', 'stylelint_clean', stylelint.code === 0, stylelint.code === 0 ? '' : tail(stylelint)));
    }
    const i18n = await sh('pnpm', ['-s', 'components:check-i18n'], { cwd: s.ws });
    checks.push(check('end', 'i18n_check', i18n.code === 0, i18n.code === 0 ? '' : tail(i18n)));
    const eventsMap = await sh('pnpm', ['-s', 'components:events-map-check'], { cwd: s.ws });
    checks.push(check('end', 'events_map_check', eventsMap.code === 0, eventsMap.code === 0 ? '' : tail(eventsMap)));

    const ran = ['format', 'lint', ...(c.needs_stylelint ? ['stylelint'] : [])];
    const notRun = ran.filter((k) => !s.facts.commands.some((cmd) => RE[k].test(cmd)));
    checks.push(
      check(
        'process',
        'ran_format_and_lint',
        notRun.length === 0,
        notRun.length ? `never ran: ${notRun.join(', ')}` : '',
      ),
    );
  }

  if (all.includes('src/lib/events-map.types.d.ts')) {
    const handEdited = s.facts.edited.some((p) => p.endsWith('events-map.types.d.ts'));
    const generated = s.facts.commands.some((cmd) => RE.eventsGenerate.test(cmd));
    checks.push(
      check(
        'process',
        'events_map_generated',
        generated && !handEdited,
        handEdited ? 'events map edited by hand' : generated ? '' : 'generator never run',
      ),
    );
  }

  const forbidden = s.facts.commands.find((cmd) => RE.forbidden.test(cmd));
  checks.push(check('process', 'no_forbidden_script', !forbidden, forbidden ? `ran: ${forbidden.slice(0, 160)}` : ''));

  for (const spec of c.checks ?? []) {
    const fn = CASE_CHECKS[spec.type];
    if (fn == null) {
      throw new Error(`unknown check type ${spec.type} in case ${c.id}`);
    }
    // rule: true marks the check of a rule that is written only in the routed doc
    checks.push({ ...(await fn(spec, s)), rule: spec.rule === true });
  }
  return checks;
}

export function docRouting(c, facts) {
  // a required entry is a doc name, or a list of docs that give the same information (any one is enough)
  const required = (c.docs?.required ?? []).map((d) => [d].flat());
  const optional = c.docs?.optional ?? [];
  const read = [...facts.docsRead].sort();
  const missing = required.filter((alts) => !alts.some((d) => facts.docsRead.has(d))).map((alts) => alts.join(' or '));
  const extra = read.filter((d) => !required.flat().includes(d) && !optional.includes(d));
  return {
    recall: required.length === 0 ? 1 : (required.length - missing.length) / required.length,
    read,
    missing,
    extra,
  };
}

// --- grade ------------------------------------------------------------------

/** Full grade for one attempt: programmatic checks, then doc routing. */
export async function grade(c, run, state) {
  const facts = transcriptFacts(run.toolCalls);
  const s = { ...state, output: run.output, facts };
  const checks = await runChecks(c, s);
  const routing = docRouting(c, facts);
  const frac = (kind) => {
    const of = checks.filter((k) => k.kind === kind);
    return of.length === 0 ? 1 : of.filter((k) => k.pass).length / of.length;
  };
  const describe = (kind) =>
    checks
      .filter((k) => k.kind === kind)
      .map((k) => `${k.pass ? 'ok' : 'FAIL'} ${k.name}${k.rule ? ' (doc rule)' : ''}${k.detail ? `: ${k.detail}` : ''}`)
      .join('\n');
  const failed = checks.filter((k) => !k.pass).map((k) => k.name);
  const ruleFailed = checks.filter((k) => k.rule && !k.pass).map((k) => k.name);
  const otherFailed = checks.filter((k) => !k.rule && !k.pass).map((k) => k.name);
  return {
    grade: {
      // headline: the task is done right AND every doc the routing table calls for was opened
      pass: failed.length === 0 && routing.missing.length === 0 ? 1 : 0,
      routed: routing.missing.length === 0 ? 1 : 0,
      doc_rule: ruleFailed.length === 0 ? 1 : 0,
      checks: otherFailed.length === 0 ? 1 : 0,
      end_state: frac('end'),
      process: frac('process'),
      doc_recall: routing.recall,
    },
    explanation: {
      pass: [
        failed.length === 0 ? 'all checks pass' : `failed checks: ${failed.join(', ')}`,
        routing.missing.length === 0 ? 'required docs read' : `required docs not read: ${routing.missing.join(', ')}`,
      ].join('; '),
      routed: routing.missing.length === 0 ? 'required docs read' : `not read: ${routing.missing.join(', ')}`,
      doc_rule: !checks.some((k) => k.rule)
        ? 'no doc-only rule in this case'
        : ruleFailed.length === 0
          ? 'doc-only rule respected'
          : `violated: ${ruleFailed.join(', ')}`,
      checks: otherFailed.length === 0 ? 'all other checks pass' : `failed: ${otherFailed.join(', ')}`,
      end_state: describe('end'),
      process: describe('process'),
      doc_recall: `read: ${routing.read.join(', ') || 'none'}; missing: ${routing.missing.join(', ') || 'none'}; not needed: ${routing.extra.join(', ') || 'none'}`,
    },
    routing,
    checks,
  };
}

export function saveArtifact(dir, name, content) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(join(dir, name), content);
}
