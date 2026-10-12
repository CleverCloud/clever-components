---
kind: '👋 Contributing'
title: 'Tooling for AI agents'
---

# Tooling for AI agents

Guidance for AI coding agents (and their humans) when a task needs something beyond the repo's own `pnpm` scripts.
The list of editor and developer tools we recommend is in [Tools](👋-contributing-tools--docs).

> **Never read or print credentials.** `gh auth token` and the contents of `~/.config/gh/hosts.yml` are off-limits: printing a token leaks it into the transcript and forces a rotation. Call the CLI directly, and if it is not authenticated, ask the user to log in.

## `gh`: GitHub

This repository lives on GitHub: **`CleverCloud/clever-components`**. So does `clever-client.js`.

Releases are handled by **release-please**: it opens a `chore(master): release X.Y.Z` PR that aggregates the CHANGELOG from conventional commit messages. Don't hand-edit `CHANGELOG.md` or bump the version in `package.json`.

## `playwright-cli`: browsing and screenshots

Use it to look at the rendered result rather than guessing: start `pnpm storybook:dev` (port 6006, ask the user first, it is a long-running server), then drive the browser to the relevant story and take a screenshot.

Rules that matter:

- **Never point `--profile` / `--persistent` at a real browser profile.** Playwright writes automation preferences into the user-data-dir and permanently breaks normal browsing. Use the default isolated profile, or a dedicated throwaway path.
- Storybook story URLs follow `http://localhost:6006/iframe.html?id=<kind>--<story>`, which renders the story alone, much better for screenshots than the full Storybook chrome.
- Machine-specific browser paths and launch flags belong in your agent's local, unversioned instruction file, not here.

For the visual regression suite, use `pnpm test:visual` instead: it already drives Playwright with the right viewports.

## Figma MCP

If a Figma MCP server is configured in your agent, use it when a task references a Figma design: to read the frame, extract spacing, colors and typography, and map them onto the design tokens in `src/styles/default-theme.css`.

Translate what you find into existing tokens. If a value has no token, say so and ask: inventing a raw hex value in a component contradicts ADR-0017 and ADR-0020.

## `clever-tools`: the `clever` CLI

The Clever Cloud CLI, useful for inspecting real applications and add-ons when working on a component that renders their data (logs, metrics, add-on options), so the mock data in `src/stories/fixtures/` stays faithful.

```bash
clever profile
clever applications
clever logs --alias <app>
```

Read-only commands are fine. **Anything that deploys, restarts, scales, or deletes must be confirmed by the user first**: these act on production infrastructure.

The `preview:*` and `cdn-*` scripts additionally need Cellar credentials (`PREVIEWS_CELLAR_KEY_ID`, `PREVIEWS_CELLAR_SECRET_KEY`, and the release equivalents) which an agent should never handle on its own.

## `mise`

Node and pnpm versions are pinned in `mise.toml`, and `mise` loads `.env`. If a command fails with a version error, check that `mise` is active rather than switching versions by hand.
