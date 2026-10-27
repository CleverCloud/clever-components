---
kind: '👋 Contributing'
title: 'API client'
---

# Clever client

`clever-components` talks to the Clever Cloud API through [`clever-client.js`](https://github.com/CleverCloud/clever-client.js), published as `@clevercloud/client` and a direct dependency of this project.

This page explains which client API to use and how to work against a local checkout of the client.
How to call the client from a smart component is detailed in the [Smart Component guidelines](👋-contributing-smart-component-guidelines--docs).

## Which client API to use

Every API call goes through the command-based client: `@clevercloud/client/cc-api-client.js` and `cc-api-commands/`.

```js
import { CcApiClient } from '@clevercloud/client/cc-api-client.js';
import { GetApplicationCommand } from '@clevercloud/client/cc-api-commands/application/get-application-command.js';
```

Command pattern, built-in auth, SSE streaming with retry. Wired here through `src/lib/cc-api-client.js`. Still marked beta upstream.

The legacy function-per-endpoint API (`@clevercloud/client/esm/api/v2/...`, `/esm/api/v4/...`) and the `sendToApi` helper that sent its requests are no longer used in this repository: `src/lib/send-to-api.js` has been removed.

**Rule:** never reintroduce the legacy API, in a smart component or anywhere else.

## Working against a local checkout of the client

To test an unreleased change to the client without publishing:

```bash
pnpm install-local:client   # packs ../clever-client.js and installs the tarball
```

This assumes `clever-client.js` is cloned **as a sibling of this repository**. The task leaves a `.tgz` in the repo root and rewrites `package.json`, so undo that before committing.

## Where the client docs live

In the `clever-client.js` repository: `README.md`, `NEW_CLIENT.md` (the new client) and its two ADRs, `docs/adr/adr-0001-why-this-new-client.md` and `docs/adr/adr-0002-why-exposing-data-as-events.md`.
