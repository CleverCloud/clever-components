# Client API findings — work that could move from consumers to `@clevercloud/client`

Audit of every consumer of `@clevercloud/client` in `clever-components` (branch `refactor/new-client`,
~80 files), looking for work done on the consumer side that arguably belongs in the client library
(`../clever-client.js`).

Each finding has a stable ID (`CB-*`, `EC-*`, `CO-*`, `RS-*`, `SW-*`, `MD-*`, `WR-*`) so it can be
picked up in a separate conversation without re-deriving the context.

## Working on a finding

The client library lives in `../clever-client.js` and is consumed here as a local tarball
(`file:clevercloud-client-*.tgz`). After changing it, rebuild and reinstall it with:

```
pnpm run install-local:client
```

That packs `../clever-client.js` and force-installs the tarball, so the client change is visible to
`clever-components` before doing the consumer-side half of the fix.

---

## Table of contents

- [Confirmed client bugs](#confirmed-client-bugs) — `CB-1` … `CB-3`
- [Raw error codes leaking into components](#raw-error-codes-leaking-into-components) — `EC-1` … `EC-7`
- [Command compositions that should be single commands](#command-compositions-that-should-be-single-commands) — `CO-1` … `CO-12`
- [Output / input reshaping](#output--input-reshaping) — `RS-1` … `RS-12`
- [Silent-wrongness worth flagging](#silent-wrongness-worth-flagging) — `SW-1` … `SW-7`
- [Migration debt](#migration-debt) — `MD-1` … `MD-3`
- [The local client wrapper](#the-local-client-wrapper) — `WR-1` … `WR-5`

---

## Confirmed client bugs

These were verified against the installed client sources, not just inferred from consumer code.
They are the highest-confidence items and the best candidates to raise upstream first.

### CB-1 — `pricePlans` sorted by `price` instead of `maxQuantity` — ✅ **FIXED**

Fixed client-side; the consumer re-sort in `src/lib/product.js` is deleted. Original report below.

Confirmed against `billing-api`: `max_quantity` is the **upper bound of a degressive pricing tier**
(cumulative from 0, `None` = no limit) — see `models/PriceSystem.scala:176-199`. `price_plans` is a
`SortedSet` ordered by exactly that rule, and `PolicyDao.scala:437` orders by `cpl.max_quantity`
(NULLS LAST). Billing is genuinely progressive: `CountableComputer.scala:147-175` folds the plans in
ascending order and bills `min(maxQuantity - alreadyBilled, remaining)` per tier. Sorting by price
destroyed the server's canonical order.

`dist/src/clients/cc-api/commands/price-system/price-system-transform.js:29-33`

```js
pricePlans: sortBy(payload.price_plans.map((p) => ({
  planId: p.plan_id, maxQuantity: p.max_quantity, price: p.price,
})), 'price'),
```

Price plans are contiguous quantity intervals — each one starts where the previous ends — so they must
be ordered by `maxQuantity` (`null` meaning "no limit"). Sorting by price is only accidentally correct
while price is monotonic with quantity.

The consumer already undoes this, with a comment explaining why, at `src/lib/product.js:172-174`:

```js
// The client sorts price plans by price, but intervals are contiguous quantity ranges: each one starts
// where the previous one ends, so they have to be ordered by `maxQuantity` (`null` meaning "no limit").
const pricePlans = [...service.pricePlans].sort((a, b) => (a.maxQuantity ?? Infinity) - (b.maxQuantity ?? Infinity));
```

**Fix:** sort by `maxQuantity` in the client; delete the consumer re-sort.
**Blast radius:** one consumer line, feeding every consumption product (cellar, fsbucket, pulsar ×4
sections, heptapod ×3).

### CB-2 — dead no-op statement in `transformPriceSystem` — ✅ **FIXED**

Removed client-side. Original report below.

`price-system-transform.js:3-7`

```js
export function transformPriceSystem(payload) {
    sortBy([].map((p) => ({ planId: p.plan_id, maxQuantity: p.max_quantity, price: p.price })), 'price');
    return { ... };
}
```

Maps an empty array literal and discards the result. Leftover from a refactor. Harmless but should go.

### CB-3 — the client exports no error classes — ✅ **FIXED**

Fixed by exporting predicates rather than the classes. `utils/error-utils.js` now also exports
`isCcHttpErrorWithStatus(error, status)`, `isCcHttpErrorWithCode(error, code)` and
`isRateLimitError(error)`, all narrowing to `CcHttpError`, plus `tolerateNotFound(promise)` (see
`EC-5`). Consumer side, `src/lib/cc-api-errors.js` is **deleted**: both `isNotFoundError` wrappers
(including the duck-typing one in `logs-stream.js`) became direct `isCcHttpErrorWithStatus(error, 404)`
calls, and `isRateLimitError` / `tolerateNotFound` are imported straight from the client.
Original report below.

`package.json` `exports` only surfaces `./utils/*` for anything error-related, so `isCcHttpError` is
reachable but the error classes themselves are not.

Consequence, `src/lib/logs/logs-stream.js:442-450`:

```js
// We don't import the class: the new client's error classes are not part of its public API.
function isNotFoundError(error) { return error?.statusCode === 404; }
```

This is a strictly weaker duplicate of `src/lib/cc-api-errors.js:31-33` — it omits the
`isCcHttpError(error)` guard, so **any** object carrying a `statusCode` property matches.

**Fix:** export the error classes, or export predicates (`isNotFoundError`, `isRateLimitError`, …)
from the client. See also `EC-*` — most of that section exists because of this.

---

## Raw error codes leaking into components

`src/lib/cc-api-errors.js:9-19` already documents the intended pattern: the client normalizes two
different backend shapes (a 429 on v4, a 403 with body `id` 403 on legacy v2) into one named code
`clever.core.too-many-requests`. And `cc-email-list.smart.js:248` already consumes namespaced codes.
So the client is mid-migration, and everything below is a straggler.

### EC-1 — numeric legacy error ids compared as strings — ✅ **FIXED**

The five commands behind those ids now implement `transformErrorCode`, the way
`CreateProfileEmailAddressCommand` already did, so the legacy numbering no longer reaches a consumer:

| Command | numeric id → named code |
|---|---|
| `AddOrganisationMemberCommand` | `6451` → `clever.organisation.member.unauthorised-addition`, `6453` → `…unauthorised-role-assignment` |
| `UpdateOrganisationMemberCommand` | the two above, plus `6501` → `clever.organisation.member.not-found` |
| `RemoveOrganisationMemberCommand` | `6452` → `clever.organisation.member.unauthorised-deletion`, `6501` → `…not-found` |
| `SetPrimaryDomainCommand` | `3004` → `clever.domain.not-found` |
| `DeployApplicationCommand` | `4014` → `clever.application.never-deployed` |

Consumer side, the 7 comparison sites became `isCcHttpErrorWithCode(error, …)` calls and the three
`Error & { code?: string }` casts are gone.

Verified against `cc-api` (`models/message/impl/Errors.java`) rather than inferred:

- `3004` is `INVALID_APPLICATION_DATA`, a *generic* id. Renaming it to `clever.domain.not-found` is only
  correct per-command: on `PUT …/vhosts/favourite`, `markFavouriteVhost` (`ApplicationHelper.java:1156-1167`)
  emits it exactly when the given `fqdn` matches none of the app's vhosts.
- `6453` (`ORGA_MEMBER_ROLE_ASSIGNMENT_RIGHT`) was **not** handled consumer-side and fell through to the
  generic error toast. It is now mapped and treated as the other unauthorised cases. It is also the code the
  API returns for the manager-editing-admin case that `MD-3` reimplements client-side — so that workaround
  may now be removable.

Original report below.

| File | Codes |
|---|---|
| `cc-orga-member-list/cc-orga-member-list.smart.js:15-17` | `MEMBER_NOT_FOUND = '6501'`, `UNAUTHORISED_ADMIN_ADDITION = '6451'`, `UNAUTHORISED_ADMIN_DELETION = '6452'` — used at `:96`, `:161`, `:166`, `:210`, `:215` |
| `cc-domain-management/cc-domain-management.smart.js:190` | `if (error.code === '3004')` (domain not found), with a locally-typed `Error & { code?: string }` cast at `:184` |
| `cc-env-var-form/cc-env-var-form.smart-env-var-app.js:14` | `const APP_CANNOT_BE_DEPLOYED_ERROR_CODE = '4014'` — used at `:110` |

**3 files, 7 comparison sites.** All should become named/typed errors from the client.

### EC-2 — error classification by substring-matching English prose

`cc-domain-management/cc-domain-management.smart.js:304-314`

```js
function convertApiError(apiError) {
  // FIXME: ask the API for a proper id to map a message to an error
  if (apiError.message.includes('Invalid domain') || apiError.message.includes('is invalid')) {
```

Derives `'invalid-format' | 'already-used'` from server prose. Even if the API can't be fixed soon,
this normalization belongs next to `CreateDomainCommand` in the client
(`isDomainAlreadyUsedError` / `isInvalidDomainError`), not in a smart component. Self-flagged FIXME.

### EC-3 — Cellar error-code literals, with inconsistent namespaces — ⚠️ **PARTIALLY FIXED**

The namespace inconsistency was **not** an upstream question: the `clever.file-explorer-proxy.cellar.*`
codes are dead. They come from `file-explorer-proxy` (`src/module/cellar/cellar-errors.js`), which the
Cellar commands no longer go through — they hit `/v4/cellar/...`, served by `ovd`'s cellar module.

Verified against `ovd` (`modules/cellar/src/main/scala/com/clevercloud/cellar/`): the routes return
`EitherT[IO, CellarApiError, _]` and map it with `_.output`
(`routes/CellarRoutes.scala:432-470`), so the `OVDHTTPError[CellarApiError]` instance
(`errors/CellarApiError.scala:35-135`) is what builds the wire body, and its `code` comes from
`errors/CellarErrorCode.scala` — prefix `clever.cellar`, no exceptions. Full set:

| code | HTTP |
|---|---|
| `clever.cellar.bucket-not-found` | 404 |
| `clever.cellar.object-not-found` | 404 |
| `clever.cellar.not-found` (the cellar addon itself) | 404 |
| `clever.cellar.bucket-already-exists` | 409 |
| `clever.cellar.bucket-not-empty` | 409 |
| `clever.cellar.too-many-buckets` | 409 |
| `clever.cellar.key-already-exists` | 409 |
| `clever.cellar.invalid-bucket-name` | 400 |
| `clever.cellar.internal-error` | 500 |
| `clever.cellar.upload-failed` | 500 |

The 5 stale literals in `cc-cellar-bucket-list.ctrl.js` are **fixed** — re-prefixed to `clever.cellar`,
and `bucket-name-invalid` corrected to `invalid-bucket-name` (the word order differed too, so that
branch was doubly dead). `cc-cellar-object-list.ctrl.js:340-343` was already correct.

A 6th was missed by that pass and is now **fixed** too: `cc-cellar-bucket-list.ctrl.js:182` compared against
`clever.file-explorer-proxy.cellar.bucket-not-empty` where the table above says
`clever.cellar.bucket-not-empty`, so the branch was dead and deleting a non-empty bucket fell through to the
generic "deletion failed" toast instead of the specific "bucket not empty" one.

Still open: the 7 literals are still literals. They should become constants/predicates exported by the
client next to the Cellar commands. Two of the unused codes above are also relevant elsewhere —
`clever.cellar.not-found` is exactly what `CO-8` wants the Cellar commands to surface instead of a
probe `GetAddonCommand`, and `clever.cellar.upload-failed` is the error the hand-rolled `fetch()` in
`CO-9` had to decode itself — since `CO-9` is fixed it now arrives as a regular `CcHttpError` code, but
it is still compared as a literal.

### EC-4 — reaching into the raw response body — ✅ **FIXED**

Resolved by `CB-3`: the site now calls
`isCcHttpErrorWithCode(e, 'clever.redis-http.list-element-not-found')`, so the `any` cast and the raw
body read are gone. `CcHttpError#code` is the body's `code` passed through
`Command#transformErrorCode` (identity by default), so the compared literal is unchanged.

Note the sibling raw reads in the same directory are **not** covered: `cc-kv-explorer.smart.js:363,378`,
`kv-details-ctrl.js:150` and `kv-terminal-ctrl.js:67,75` still go through the `responseBody` alias
that `kv-client.js#rethrowAdapted` bolts on — `.context.key` and `.message` have no predicate
equivalent, so they need the client to expose the parsed error body (see `WR-5`).

Original report below.

`cc-kv-explorer/kv-key-editor-list-ctrl.js:236`

```js
if (err?.responseBody?.code === 'clever.redis-http.list-element-not-found') {
```

### EC-5 — `nullOnNotFound` as a repo-wide idiom — ✅ **FIXED**

The helper moved to the client as `tolerateNotFound(promise)` (resolving to `undefined`, not `null`),
so the repo no longer restates the `try`/`catch`.

The original report also argued that `GetGrafanaCommand` should resolve a status rather than reject
with a 404. **Decided against**: a 404 stays a 404, `tolerateNotFound` is the answer for callers that
treat it as a legitimate state. Original report below.

`src/lib/cc-api-errors.js:42-51`. The comment at `:22-27` records that commands *used to* resolve
`null` on a 404 and now reject, so every "missing resource is a legitimate state" case has to re-wrap.

Used in **7 places**: `cc-grafana-info.smart.js:145`, `cc-addon-info.client.js:57`,
`cc-tile-metrics.smart.js:107`, `cc-network-group-member-list.smart.js:306` and `:321`,
`cc-logs-app-runtime.smart.js:667` and `:810`.

The clearest case is `GetGrafanaCommand`: a 404 means "Grafana is not enabled for this owner", which is
API semantics, not an error. It should resolve `{ status: 'enabled' | 'disabled' }` (or `null`)
directly. See `CO-6`.

### EC-6 — the normalized rate-limit code is hardcoded consumer-side — ✅ **FIXED**

Resolved by `CB-3`: the client exports `isRateLimitError`, the consumer restates nothing.
Original report below.

`src/lib/cc-api-errors.js:9`

```js
const TOO_MANY_REQUESTS_ERROR_CODE = 'clever.core.too-many-requests';
```

The doc comment describes normalization the *client* performs. The client should export the constant
or the predicate rather than making consumers restate it.

### EC-7 — `cc-oauth-consumer-info` contradicts the repo convention — ✅ **FIXED**

`cc-oauth-consumer-info/cc-oauth-consumer-info.smart.js:96-98`

```js
if (oauthConsumer == null) { throw new Error(`OAuth consumer "${this._key}" not found`); }
```

Hand-rolls not-found handling instead of using `nullOnNotFound` / a typed error, unlike the 5 other
files listed in `EC-5`.

---

## Command compositions that should be single commands

### CO-1 — `GetAddonCommand` → `GetZoneCommand({ zoneName: addon.zone })` — **10 identical sites**

`cc-addon-header/cc-addon-header.smart-cellar.js:41-49`

```js
.send(new GetAddonCommand({ ownerId, addonId }), { signal })
.then((addon) => Promise.all([addon, ..., ccApiClient.send(new GetZoneCommand({ zoneName: addon.zone, ownerId }), { signal })]))
```

Same shape in `smart-config-provider.js:30-37`, `smart-elastic.js:45-53`, `smart-jenkins.js:41-49`,
`smart-keycloak.js:54-62`, `smart-materia-kv.js:40-47`, `smart-matomo.js:54-62`,
`smart-metabase.js:54-62`, `smart-otoroshi.js:54-62`, `smart-pulsar.js:33-40`.

Nobody wants a bare zone *name*. The same join is solved two other ways elsewhere:

- `cc-addon-linked-apps/cc-addon-linked-apps.smart.js:57-73` — manual `zones.find(z => z.name === zoneName)` join
- `cc-addon-header/cc-addon-header.smart-kubernetes.js:97-106` — a hardcoded `par` zone object literal (lat/lon/tags) standing in for a lookup

Also inconsistent caching: `cc-addon-linked-apps.smart.js:87` caches zones with `ttl: ONE_DAY`, the 10
sites above use no cache config at all. Zone TTL is a client-level policy.

**Fix:** `GetAddonCommand({ withZone: true })` or a `GetAddonWithZoneCommand`.

### CO-2 — `addon.realId` translation — **13 sites**

Every consumer holding an `addon_*` id fetches the whole addon just to translate it to `realId` before
calling a provider-level command.

Sites: `cc-addon-header.smart-{elastic,otoroshi,config-provider,materia-kv,metabase,matomo,keycloak,jenkins,pulsar}.js`,
`cc-addon-info.smart-elastic.js:162`, `cc-env-var-form.smart-config-provider.js:42`,
`cc-network-group-member-list.smart.js:275`, `cc-network-group-list.smart.js:66`.

The infrastructure already exists — `resourceIdResolverStore`, `src/lib/cc-api-client.js:113` — but see
`WR-4`: it is wired **only** for the API-token client, so OAuth-based components (nearly all of them)
get no resolution at all.

Related: `cc-network-group-list.smart.js:58` sniffs id kind by string prefix (`resourceId.startsWith('addon_')`),
encoding the API's id scheme in a component.

### CO-3 — `GetProfileCommand` + another command — **4 sites**

- `cc-token-api-list/cc-token-api-list.smart.js:140-158` — `Promise.all([_getUserInfo(), ListApiTokenCommand])`, where `_getUserInfo` (`:132-138`) exists *only* to stash `email`/`partnerId` on `this` so `resetPassword()` (`:169-177`) can later build `RequestAuthPasswordResetCommand({ login, partnerId })`.
- `cc-token-api-creation-form/cc-token-api-creation-form.smart.js:126-132` + `:118-124` — same trick, with the comment *"the form can only be submitted once the user info has been fetched so `_userEmail` cannot be `null`"*. `CreateApiTokenCommand` should not require the caller to supply the authenticated user's own email.
- `cc-orga-member-list/cc-orga-member-list.smart.js:315-332` — `Promise.all([GetProfileCommand, ListOrganisationMemberCommand])` then computes `isCurrentUser: member.id === profile.id`.
- `cc-ssh-key-list/cc-ssh-key-list.smart.js:172-185` — `Promise.all([GetProfileCommand, ListPersonalSshKeyCommand])`, then a *conditional* `ListGithubSshKeyCommand` gated on `user.isLinkedToGitHub`. The comment at `:34-36` documents this as a two-step protocol; it wants one `ListSshKeysCommand` returning `{ isGithubLinked, personalKeys, githubKeys }`.

Also duplicated in 2 of these: the `preferredMFA === 'TOTP'` → boolean derivation
(`cc-token-api-creation-form.smart.js:130`, `cc-orga-member-list.smart.js:328`).

### CO-4 — `revokeAll` bulk fan-out — duplicated verbatim

`cc-token-session-list/cc-token-session-list.smart.js:198-221`

```js
return Promise.allSettled(tokensToRevoke.map((token) => this.revokeSessionToken(token.id).then(() => token.id))).then(
  (results) => { revokedTokens = results.filter((r) => r.status === 'fulfilled').map(({ value }) => value);
    errors = results.filter((result) => result.status === 'rejected'); ...
```

`cc-token-oauth-list/cc-token-oauth-list.smart.js:192-213` is byte-for-byte the same with
`revokeOauthToken`. Both hand-roll partial-failure accounting (`{ remainingTokens, revokedTokens, errors }`).

The comment at `cc-token-session-list.smart.js:191-194` even explains *why* the server's bulk endpoint
can't be used — that is client-library domain knowledge sitting in a component.

**Fix:** one `RevokeOauthTokensCommand({ tokens })` returning a typed partial-success result.

### CO-5 — update-then-recheck version — **3 sites**

`cc-addon-info/cc-addon-info.smart-keycloak.js:141-142`

```js
.send(new UpdateKeycloakVersionCommand({ addonId, targetVersion }))
.then(() => ccApiClient.send(new CheckKeycloakVersionCommand({ addonId })))
```

Same at `cc-addon-info.smart-metabase.js:146-147` and `cc-addon-info.smart-otoroshi.js:141-142`.
The update command should resolve with the refreshed version info.

Related: the three `Check*VersionCommandOutput` types are structurally identical and are unified by
hand as a 3-way JSDoc union at `cc-addon-info.client.js:14`. That union belongs in the client as one
`OperatorVersionInfo` type.

### CO-6 — Grafana org fetch + dashboard URL — **3 implementations, 7 call sites** — ✅ **FIXED**

- `cc-grafana-info/cc-grafana-info.smart.js:128-131` + `:142-151` — `buildGrafanaLink`, path `/d/home/clever-cloud-metrics-home`, sets `orgId`
- `cc-tile-metrics/cc-tile-metrics.smart.js:105-118` — path `/d/runtime/application-runtime`, sets `orgId` + `var-SELECT_APP`
- `cc-addon-info/cc-addon-info.client.js:51-67` + `:139-156` — `getGrafanaAppLink`, parameterized `dashboardPath`, same two params

All three do `nullOnNotFound(send(GetGrafanaCommand))` → `new URL(path, base)` → `searchParams.set('orgId', String(org.id))`.
The last two are line-for-line equivalent apart from the hardcoded path. Four more sites pass the path
as a literal: `cc-addon-info.smart-{metabase,otoroshi,keycloak,matomo}.js`.

**Fix:** a `GetGrafanaDashboardUrlCommand`, or at minimum consolidate on the existing `getGrafanaAppLink`.

Note: the three call sites now read `tolerateNotFound(send(GetGrafanaCommand))` — the 404 handling is
settled (see `EC-5`), only the URL-building duplication is still open here.

### CO-7 — unset-then-set primary domain, with no rollback

`cc-domain-management/cc-domain-management.smart.js:273-277`

```js
await ccApiClient.send(new UnsetPrimaryDomainCommand({ ownerId, applicationId: appId }));
await ccApiClient.send(new SetPrimaryDomainCommand({ ownerId, applicationId: appId, domain: id }));
```

Sequential, no consumer-visible intermediate state, **no rollback** — if the second call fails the
application is left with no primary domain at all. Should be one `SetPrimaryDomainCommand`.

### CO-8 — Cellar: a round-trip discarded as an existence check — ✅ **FIXED**

`cc-cellar-explorer/cc-cellar-explorer.smart.js:36-42`

```js
ccApiClient.send(new GetAddonCommand({ ownerId, addonId }), { signal }).then(() => {
  // The cellar commands resolve `addonId` to the real addon id themselves, we only fetch the
  // addon here to make sure it actually exists before showing the explorer
```

The Cellar commands already resolve `addonId`; they should surface "addon does not exist" themselves.

### CO-9 — Cellar upload: presign + hand-rolled `fetch()` — ✅ **FIXED**

`UploadCellarObjectCommand` now does both steps in the client: it gets the presigned URL, then sends the
content to it as a regular command (absolute URL, no client credentials, CORS enabled). `uploadObject()` is
a plain `send()` like every other method of the file, and an upload failure arrives as a `CcHttpError` whose
`code` is the body's — the same `clever.cellar.*` code the hand-rolled decoding produced.

That was the last thing `CellarExplorerError` existed for, so it is gone too, along with `catchError` and
`isCellarExplorerError{,WithCode}`. It only ever carried `code` through: its `message` and `context` were
written but never read, and its `catchError` had two branches — one re-wrapping a `CcHttpError` into an
equivalent error, one reading `error.response.body` directly, which no longer had a producer once the raw
`fetch()` went away. The two call sites now use the client's own `isCcHttpErrorWithCode`.

Original report below.

`cc-cellar-explorer/cc-cellar-explorer.client.js:168-195` — gets a presigned URL from the client, then
hand-rolls a raw `fetch()` with its own method/`Content-Type` defaulting, `!response.ok` handling, JSON
body decoding, and two distinct throw paths. Entirely outside the client. Should be one
`UploadCellarObjectCommand`.

### CO-10 — deployment fetching in `cc-logs-app-runtime`

Three separate items in the same file:

- **v4 → v2 fallback chain**, `:805-815` — two commands chained on a 404 (`GetDeploymentCommand`, then `GetDeploymentCommandLegacy`). API-version smoothing belongs behind one command.
- **N+1 batched fetch**, `:762-777` — dedup + non-final-state filter + `Promise.all` of N `GetDeploymentCommand`s. Wants `ListDeploymentCommand({ deploymentIds })`.
- **a converter that issues a command**, `:862-877` — `_convertV2` fetches instances just to derive the deployment's `endDate`. `endDate` should come from the deployment command.

### CO-11 — TCP redirections ⋈ namespaces join

`cc-tcp-redirection-form/cc-tcp-redirection-form.smart.js:155-165`

```js
const [namespaces, redirections] = await Promise.all([this.fetchNamespaces(...), this.fetchRedirections(...)]);
return namespaces.map(({ namespace }) => {
  const sourcePort = redirections.find((r) => r.namespace === namespace)?.port;
```

Two list commands joined on `namespace` plus a defaulting rule. No consumer wants the two raw lists
separately. Plus `PUBLIC_NAMESPACES = ['default', 'cleverapps']` at `:20` — a platform property
hardcoded in a component.

### CO-12 — smaller compositions

- `cc-addon-admin/cc-addon-admin.smart.js:170-174` — `Promise.all([fetchAddon, fetchTags])`; tags are addon sub-state.
- `cc-oauth-consumer-info/cc-oauth-consumer-info.smart.js:114-125` — `Promise.allSettled([getOauthConsumer, getSecret])` with manual per-branch unwrapping. Note `GetOauthConsumerCommand` even takes a `withSecret` flag (`:94`) — the capability exists and is being discarded.
- `cc-addon-credentials/cc-addon-credentials.smart-cellar.js:63-66` — `Promise.all([GetCellarCredentialsCommand, GetCellarCredentialsPresignedUrlCommand])`, then `:112-123` re-runs both after `RenewCellarCredentialsCommand` (a second "mutate then refetch", same shape as `CO-5`).
- `cc-network-group-member-list/cc-network-group-member-list.smart.js:244-255`, `:302-340`, `:378-388` — unbounded N+1 fan-out to hydrate members (a `GetApplicationCommand`/`GetAddonCommand` per member, just for a logo URL and name; a wireguard-config-URL command per external peer), with 404-means-deleted handling duplicated in each branch. No concurrency limit.
- `cc-addon-backups/cc-addon-backups.smart.js:94-111` — 2 parallel + 1 conditional sequential command, plus the `es-addon` / `es-addon-old` legacy split encoded consumer-side. See `RS-5`.
- `cc-env-var-form.smart-exposed-config.js:34-40` and `cc-env-var-linked-services.smart-{app,addon}.js:31-33` — **3 sites** pair an env-var command with a full `GetApplicationCommand` solely to read `.name`. Same for `smart-config-provider.js:41` with `addon.name`.
- `cc-pricing-product.smart-runtime.js:63-68` and `cc-pricing-product.smart-addon.js:66-71` — **2 sites** of `Promise.all([product, priceSystem])` then a join on `priceId`. A `GetPricedProductCommand({ productId, zone, currency })` would collapse this together with `RS-9` and `RS-10`.

---

## Output / input reshaping

### RS-1 — token lists: date parsing + field renaming — **3 files**

`cc-token-session-list/cc-token-session-list.smart.js:163-174`

```js
.filter((token) => token.consumer.key === this._apiConfig.OAUTH_CONSUMER_KEY || token.employeeId != null)
.map((token) => { const formattedToken = { id: token.token, isCleverTeam: token.employeeId != null,
  creationDate: new Date(token.creationDate), expirationDate: new Date(token.expirationDate), lastUsedDate: new Date(token.lastUtilisationDate) };
```

`cc-token-oauth-list/cc-token-oauth-list.smart.js:154-172` is the exact mirror image — same command,
**inverted** filter, same three `new Date(...)` conversions, same renames.
`cc-token-api-list/cc-token-api-list.smart.js:144-156` repeats the shape for API tokens
(`apiTokenId → id`, two `new Date(...)`, `state === 'EXPIRED' → isExpired`).

Two concerns: the client should return parsed `Date`s and stable names (`id`, `lastUsedDate` — note the
raw field is the typo'd `lastUtilisationDate`), **and** it should own the session-vs-third-party
partitioning. The two filters are complementary by construction and nothing enforces that they stay
in sync.

### RS-2 — `DISABLED_RIGHTS_BY_DEFAULT` copy-pasted across two component directories

`cc-oauth-consumer-info/cc-oauth-consumer-info.smart.js:16-29` and
`cc-oauth-consumer-form/cc-oauth-consumer-form.smart-update.js:21-34` declare the *identical* 12-key
literal, and both apply the identical merge (`:50-53` and `:53-56`):

```js
const rights = { ...DISABLED_RIGHTS_BY_DEFAULT,
  ...Object.fromEntries(Object.entries(data.rights).filter(([, isEnabled]) => isEnabled != null)) };
```

`GetOauthConsumerCommand` returns a sparse/nullable rights object; it should return a fully-populated
one with `false` defaults. Highest-risk duplication in the audit: adding a new right to the API
requires editing two unrelated component directories.

### RS-3 — `kv-client.js` casts through `any` to recover a dropped field — **4 sites**

`cc-kv-explorer/kv-client.js:80-85, 156-162, 222-227, 293-298`

```js
total: /** @type {any} */ (result).total,
```

The comment at `:158-159` says it outright: the endpoint returns `total` but `ScanHashKeyCommandOutput`
doesn't declare it. Four sites (`scanKeys`, `scanHash`, `scanList`, `scanSet`). A missing field in the
client's output types, not consumer work.

Two more in the same file:
- `omitNulls()` (`:386-391`) applied at 4 call sites (`:77`, `:151`, `:219`, `:288`) purely because commands reject explicit `undefined`/`null` optional inputs.
- `:84` — `type: /** @type {CcKvKeyType} */ (key.type)`: the client types `Key#type` as plain `string` and the consumer re-narrows to the closed union. The union belongs in the client.

### RS-4 — secability / interval left raw, forcing price-factor math consumer-side

`src/lib/product.js:44` and `:164-170`

```js
const secability = service?.dataQuantityForPrice?.secability === 'insecable' ? service.dataQuantityForPrice.quantity : 1;
const timeFactor = service?.timeIntervalForPrice?.interval === 'PT1H' ? THIRTY_DAYS_IN_HOURS : 1;
const priceFactor = timeFactor / quantityFactor;
```

The client types (`price-system.types.d.ts:23-31`) declare `Secability = 'secable' | 'insecable'` (the
raw lowercase API enum) and `BillableTime.interval: string` (a raw ISO-8601 duration), and
`price-system-transform.js:27-28` passes `data_quantity_for_price` / `time_interval_for_price` straight
through untransformed. So the consumer must string-compare a raw enum, string-compare `'PT1H'`, and
hardcode `THIRTY_DAYS_IN_HOURS = 24 * 30`.

See `SW-1` for the correctness consequence.

**Fix:** parse the ISO-8601 duration in the client, expose secability as a resolved numeric batch size
(or a discriminated union). One declaration site, ~10 call sites via `formatProductConsumptionIntervals`.

### RS-5 — Elasticsearch: `services.find(s => s.name === ...)` — **4 files, 6 sites**

`cc-addon-backups/cc-addon-backups.smart.js:108`

```js
const kibana = esInfo.services.find((service) => service.name === 'kibana');
providerId = kibana != null && kibana.enabled ? 'es-addon' : 'es-addon-old';
```

Also `cc-addon-credentials.smart-elastic.js:84-87`, `cc-addon-header.smart-elastic.js:58` and `:66`,
`cc-addon-info.smart-elastic.js:178-180`.

`GetElasticsearchInfoCommand` should return `services` keyed by name (`services.kibana.enabled`)
instead of an array requiring a `find` on a magic string in every consumer.

Same family — URL construction from the raw host, `cc-addon-header.smart-elastic.js:60` and `:68`:

```js
const apmUrl = `https://kibana-${esInfo.config.host}/app/apm`;
const kibanaUrl = `https://kibana-${esInfo.config.host}/`;
```

The `kibana-` host prefix convention is API knowledge, not UI knowledge.

### RS-6 — plan-features extraction, duplicated verbatim

`cc-addon-info/cc-addon-info.smart-jenkins.js:80-102` and `cc-addon-info.smart-elastic.js:131-154` are
byte-for-byte identical:

```js
const selectedFeatureCodes = ['cpu', 'memory', 'disk-size'];
const features = selectedFeatureCodes.map((code) => addon.plan.features.find((f) => f.nameCode === code))
  .filter((feature) => feature != null)
  .map((feature) => ({ code: feature.nameCode, type: feature.type.toLowerCase(), value: feature.computableValue ?? '', name: feature.name }));
```

Filtering + renaming (`nameCode` → `code`) + case normalization + defaulting. `Addon.plan.features`
should arrive normalized. Paired with `features.find(f => f.name === 'encryption')` at
`cc-addon-info.smart-elastic.js:156` and `cc-addon-info.smart-jenkins.js:103` — encryption should be a
boolean field.

### RS-7 — addon field renaming — **9 sites**

`cc-addon-header/cc-addon-header.smart-pulsar.js:42-48`

```js
providerId: addon.provider.name,
providerLogoUrl: addon.provider.logoUrl,
id: addon.realId,
```

Same three lines in `smart-config-provider.js:39-44`, `smart-elastic.js:76-80`,
`smart-jenkins.js:55-59`, `smart-keycloak.js:68-72`, `smart-materia-kv.js:52-56`,
`smart-matomo.js:68-72`, `smart-metabase.js:68-72`, `smart-otoroshi.js:68-72`.

Note `smart-cellar.js:52-55` **diverges** (`name: cellarInfo.name, id: cellarInfo.id`) — a likely
inconsistency caused by nine copies of one mapping.

### RS-8 — Cellar listing shape and ordering

- `cc-cellar-object-list/cc-cellar-object-list.ctrl.js:270-273` — the command returns `{content, directories, cursor}` as two disjoint arrays; every consumer re-merges them into one ordered listing. `ListCellarObjectCommand` should return a single merged `entries` array.
- `cc-cellar-object-list.ctrl.js:389-403` — a 15-line comparator (volatile-first, then directories-before-files, then `localeCompare`) reimplementing the server's own listing order so a locally-created directory lands in the right slot. This is currently the *only* definition of the canonical order, yet `#fetchObjects` (`:270`) relies on the server producing the same one. **Two independent sources of truth for one ordering.**
- `cc-cellar-explorer/cc-cellar-explorer.client.js:99` — `const prefix = pathToString(path) + (options.filter ?? '')`. The path-array → S3-prefix rule is S3 semantics; it should be a command input (`path: Array<string>`, `filter: string`). Three variants of the same join exist: here, `cc-cellar-object-list.ctrl.js:420`, and `cc-cellar-object-list.ctrl.js:384` (which subtly omits the trailing slash).
- `cc-cellar-explorer.client.js:109` — `count: 50` page size hardcoded consumer-side.
- `cc-cellar-object-list.ctrl.js:36-40, 149-169` — a full cursor pagination state machine (`#nextCursor`, `#currentCursor`, `#previousPages` stack), including the "S3 has no backwards cursor so push visited cursors on a stack" workaround at `:164`. A paginator abstraction in the client removes all of it.
- `cc-cellar-bucket-list/cc-cellar-bucket-list.ctrl.js:285-301` — client-side sort+filter over the full bucket list because `ListCellarBucketCommand` exposes no `sort`/`filter` input. Note `listBuckets` has no pagination at all while `listObjects` does — an inconsistency in the client's Cellar surface.

### RS-9 — "fetch the whole list, then `.find()` one" — **2 sites**

- `cc-pricing-product/cc-pricing-product.smart-runtime.js:84-99` — `ListProductRuntimeCommand()` → `allRuntimes.find(f => f.variant.slug === productId)` → throw `Unknown variant slug`
- `cc-pricing-product/cc-pricing-product.smart-addon.js:88-98` — `ListProductAddonCommand({withVersions:false})` → `allAddonProviders.find(ap => ap.id === productId)` → throw `Unknown add-on provider ID`

Both want `GetProductRuntimeCommand({ slug })` / `GetProductAddonCommand({ id })`. The filtering *and*
the not-found error shape are client concerns.

### RS-10 — redundant double-`toLowerCase()` priceId join — **2 sites**

`src/lib/product.js:234-236` and `:291-293`

```js
const priceItem = priceSystem.runtime.find((runtime) => runtime.priceId.toLowerCase() === plan.priceId?.toLowerCase());
```

The client already lowercases one side (`price-system-transform.js:17`: `priceId: r.slug_id.toLowerCase()`),
so half of this is dead defensiveness. The other half exists because `AddonProviderPlan.priceId` /
`ProductRuntimeFlavor.priceId` are *not* normalized by their commands. Normalize both, and the join
becomes a plain `===`.

### RS-11 — `product.js` carries API domain knowledge

- **`:52-152`** — four near-identical functions (`formatAddonCellar` `:52`, `formatAddonFsbucket` `:75`, `formatAddonPulsar` `:93`, `formatAddonHeptapod` `:130`) encoding which `countable.service` strings belong to which product and which are `progressive: true`. Consumed in 3 places: `cc-pricing-product-consumption.smart.js:58,64,70,76`, `product.js:469-472`, `src/stories/cc-pricing-page-sandbox.js:135-153`.
- **`:347-450`** — `getRunnerProduct()` synthesizes whole `ProductRuntime` objects (fake UUIDs, fake `version: '20211001'`, seven hand-written flavors each) because `ListProductRuntimeCommand` omits jenkins/heptapod runners. Already so ill-fitting that the caller needs `@ts-expect-error` (`cc-pricing-product.smart-runtime.js:83`). ~100 lines of fake API payload in a consumer.

### RS-12 — assorted smaller reshapes

- **Network groups: pure field renaming.** `cc-network-group-dashboard.smart.js:36-45` — `label→name`, `networkIp→subnet`, `lastAllocatedIp→lastIp`, plus two `.length` derivations. `label→name` recurs at `cc-network-group-list.smart.js:94` and `:101`.
- **Peer IP discrimination, byte-identical in 2 files.** `cc-network-group-member-list.smart.js:399` and `cc-network-group-list.smart.js:108`: `peer.endpoint.type === 'ServerEndpoint' ? peer.endpoint.ngTerm.host : peer.endpoint.ngIp`. The client already ships `network-group-utils.js`.
- **`cc-network-group-list.smart.js:75-81`** — two full scans of the same list to partition linked/unlinked members.
- **Env-var command output unwrapping.** `cc-env-var-form.smart-env-var-addon.js:57-58`, `smart-env-var-app.js:129-132` unwrap `{ environment }`; the two linked-services files unwrap `linkedAddonsEnvironment` / `linkedApplicationsEnvironment` from the same command. One command returning four differently-named payloads depending on flags forces every caller to unwrap.
- **`cc-env-var-linked-services.smart-{app,addon}.js:65-71`** — same reshape twice; the two commands return structurally identical data under different field names. (The two files are ~95% identical overall — only lines 16, 35, 59-72 differ, and `fetchAppName` at `:82-85` is byte-identical.)
- **Domain re-parsing.** `cc-domain-management.smart.js:213-232` runs `parseDomain` on every domain string the API returned; `:246` re-assembles it for `CreateDomainCommand`; `:262` passes the raw string back. `parseDomain` already ships in the client (`utils/domain-utils.js`) — `ListDomainCommand` should return the parsed shape.
- **Env-var editor pre-serialization filtering — 2 places, inconsistent.** `cc-env-var-editor-expert.js:127` filters `!isDeleted`; `cc-env-var-editor-json.js:139` filters *and* maps to `{name, value}` to strip `isNew`/`isEdited`/`isDeleted`. `toJson`/`toNameEqualsValueString` in the client should own that contract.
- **Metrics defaulting.** `cc-tile-metrics.smart.js:90-93` — `{ cpuMetrics: metrics.cpu ?? [], memMetrics: metrics.mem ?? [] }`. The command should never return `undefined` series for metrics it was explicitly asked for.
- **Zone tag filtering.** `cc-pricing-header.smart.js:90, 100-102` — `zones.filter(z => z.tags.includes('for:applications'))` then `tags.filter(t => !t.startsWith('for:'))`. `for:` is an API tag namespace convention; `ListZoneCommand({ for: 'applications' })` should filter and expose the namespace as a field.
- **Log dates — 3 sites.** `cc-logs-app-runtime.smart.js:165`, `cc-logs-app-access.smart.js:189`, `cc-logs-addon-runtime.smart.js:185` all do `date: new Date(rawLog.date)`. The stream commands already reshape these logs (`http` → `detail`, per the comment at `cc-logs-app-access.smart.js:175-177`), so they should emit `Date` too. Same for instances (`cc-logs-app-runtime.smart.js:698-699`) and deployments (`:826`, `:831`, `:882`).
- **Invoice reshaping.** `src/lib/api-helpers.js:89-102, 110-125` — `formatInvoice()` derives `total` by summing `totalTax + totalTaxExcluded` and defaults `type` from `kind || 'INVOICE'`; `getPaymentUrl()` branches on `ownerId.startsWith('user_')`. The summation and the `user_` prefix convention are API semantics; only the console path is genuinely app-specific.
- **Backup output renaming.** `cc-addon-backups.smart.js:125-133` — `creationDate→createdAt`, `expirationDate→expiresAt`, `downloadUrl→url`, etc.
- **Kubernetes status casing.** `cc-addon-header.smart-kubernetes.js:120` — `kubeInfo.status.toLowerCase()` behind an unchecked cast to `DeploymentStatus`. See `SW-6`.
- **`formatNgData` duplicated.** `cc-addon-credentials.smart-otoroshi.js:241-250` and `smart-keycloak.js:199-208` — identical functions converting `operator.features.networkGroup` (nullable) into an enabled/disabled union. They differ only in JSDoc nullability, which is itself evidence the two commands type `networkGroup` inconsistently.
- **`ONE_DAY` copy-pasted in 7 files** — `api-helpers.js:16`, `cc-pricing-header.smart.js:14`, `cc-pricing-product.smart-runtime.js:17`, `cc-pricing-product.smart-addon.js:18`, `cc-ssh-key-list.smart.js:13`, `cc-addon-linked-apps.smart.js:8`, `cc-network-group-list.smart.js:29`. Per-command default TTLs would remove all 7.
- **`cc-article-list.smart.js:24`** — `limit = 9` default, a leftover from the deleted `parseRssFeed`'s own default parameter. Belongs in `ListArticleCommand`.

---

## Silent-wrongness worth flagging

Items where the consumer-side workaround doesn't just add code, it produces wrong behaviour.

### SW-1 — non-`PT1H` intervals silently mis-price

`src/lib/product.js:164-170` (see `RS-4`) falls back to `timeFactor = 1` for any interval that isn't
the literal string `'PT1H'`. If the API returns `PT24H` or `P1D`, prices are silently wrong. Root cause
is `RS-4`: the interval is passed through as an unparsed string.

### SW-2 — Pulsar builds `pulsar+ssl://` for the non-TLS port - FIXED

`cc-addon-credentials/cc-addon-credentials.smart-pulsar.js:71-80`

```js
if (pulsarInfo.cluster.pulsarTlsPort != null) { cliUrl = `pulsar+ssl://${pulsarInfo.cluster.url}:${pulsarInfo.cluster.pulsarTlsPort}`; }
else if (pulsarInfo.cluster.pulsarPort != null) { cliUrl = `pulsar+ssl://${...pulsarPort}`; }
else { throw new Error('Missing TLS port and default port'); }
```

The fallback branch keeps the `+ssl` scheme while using the plaintext port. A bug that only exists
because protocol knowledge lives in the UI. `GetPulsarInfoCommand` should expose `cliUrl`, `apiUrl`,
`tenantNamespace` (the last also hand-built at `:80`, plus `https://${cluster.url}:${cluster.webTlsPort}` at `:86`).

### SW-3 — empty load-balancer array throws in the dumb component

`cc-domain-management/cc-domain-management.smart.js:287-298`

```js
const defaultLoadBalancerData = defaultLoadBalancers[0];
return { cnameRecord: defaultLoadBalancerData?.dns?.cname, aRecords: defaultLoadBalancerData?.dns?.a };
```

"The default load balancer is element 0" plus optional chaining yields
`{ cnameRecord: undefined, aRecords: undefined }` on an empty array, which then reaches
`cc-domain-management.js:733` (`aRecords.join('\n')`) and throws. Should be a
`GetDefaultLoadBalancerDnsCommand`.

### SW-4 — `isAppStopped` depends on params defined 100 lines away

`cc-tile-metrics/cc-tile-metrics.smart.js:16, 125-127`

```js
function isAppStopped(data) { return data.filter((data) => data.value === 0).length === NUMBER_OF_POINTS; }
```

`NUMBER_OF_POINTS = 24` is only correct because of `interval: 'P1D', span: 'PT1H'` at `:82-83`. Either
the command reports its point count, or this should be `.every(v => v.value === 0)`. As written it
breaks the moment interval/span changes.

Same family: `cc-tile-requests.smart.js:49-50, 61-64` computes the "last complete hour" boundary *and*
re-derives the 1-hour bucket width that `GetStatusCodeDistributionCommand` itself chose:

```js
return data.byDate.map((entry) => { const time = new Date(entry.date).getTime(); return [time, time + 1000*60*60 - 1, entry.total]; });
```

If the command's bucketing changes, this silently produces wrong intervals. Related:
`cc-tile-status-codes.smart.js:58` (`data.byStatusCode.statuses`) and `cc-tile-requests.smart.js:61`
(`data.byDate`) are two projections of one command split across two files, each holding half the
knowledge of its response shape, with divergent params.

### SW-5 — Cellar client silently ignores its own close signal

`cc-cellar-explorer/cc-cellar-explorer.client.js:30, 34` and `signal ?? this._abortController.signal`
repeated at `:44, 57, 111, 125, 147`. Whenever a per-call signal is passed, the client-wide close signal
is dropped. `kv-client.js:348-353` (`_signal()`, called at 17 sites) does it correctly with
`AbortSignal.any`.

**Fix:** the client's `send()` should accept a client-level signal, and neither wrapper is needed.
See also `WR-*` and the abort-adapter note in `RS-8`.

### SW-6 — divergent Kubernetes deleted-status checks

`cc-addon-header/cc-addon-header.smart-kubernetes.js:92` checks `status === 'DELETED' || status === 'DELETING'`;
`cc-addon-info.smart-kubernetes.js:47` checks only `=== 'DELETED'`. A divergence caused by the
duplication. Also `:13, 53` — `const FIFTY_MINUTES` encodes the kubeconfig presigned URL's
**server-side TTL** in the consumer.

### SW-7 — a state map that exists only to undo another state map

`cc-logs-app-runtime/cc-logs-app-runtime.smart.js:897-903, 939`

```js
const V2_DEPLOYMENT_STATE_REVERSE_MAP = { WORK_IN_PROGRESS: 'WIP', TASK_IN_PROGRESS: 'TASK_RUNNING', FAILED: 'FAIL', ... };
state: V2_DEPLOYMENT_STATE_REVERSE_MAP[/** @type {string} */ (deployment.state)],
```

`GetDeploymentCommandLegacy` maps v2 states to v4 naming; `fetchDeploymentV2()` maps them straight back
so `_convertV2()` (`:843-886`) still sees the old names. A pure round-trip. The cast is forced by
`DeploymentLegacy['state']` being typed as `Omit<DeploymentState, 'QUEUED'>` — `Omit` on a string-literal
union is a client type bug worth fixing regardless (comment at `:937-938`).

Adjacent, same file, `:139-140` and `:450-485`:

```js
// This optimization should be done by the API.
const optimizedRange = this._optimizeDateRange(dateRange);
```

Narrows `since`/`until` to the min creation / max deletion date of selected instances, with `Infinity`
sentinels. The author already says where it belongs.

---

## Migration debt

### MD-1 — three files still on the legacy `esm/utils/` path

- `cc-warning-payment/cc-warning-payment.js:1` — `import { ERROR_TYPES } from '@clevercloud/client/esm/utils/payment.js'`
- `cc-env-var-editor-expert/cc-env-var-editor-expert.js:1` — `esm/utils/env-vars.js`
- `cc-env-var-editor-json/cc-env-var-editor-json.js:1` — `esm/utils/env-vars.js`

Every other consumer uses `@clevercloud/client/cc-api-commands/*` and `@clevercloud/client/utils/*`.

The consequence for `cc-warning-payment` is **public**: `cc-warning-payment.types.d.ts` declares
`type: number`, so the component's own API surface leaks the client's opaque numeric enum, and
`_getOrgaError` (`:38-58`) / `_getHomeError` (`:64-73`) switch on it. Should become a named string
union owned by the client.

### MD-2 — active drift on `isNetworkGroupAddonCandidate`

The client already exports this rule. `cc-network-group-member-list.smart.js:268` uses it correctly:

```js
const supportedAddons = addons.filter((addon) => isNetworkGroupAddonCandidate(addon));
```

`cc-network-group-list.smart.js:57-69` reimplements a **narrower** version inline:

```js
return { resolvedResourceId: addon.realId, isSupported: addon.plan.slug !== 'dev' };
```

Two divergent encodings of one domain rule.

### MD-3 — a missing server-side authorization rule, reimplemented client-side

`cc-orga-member-list/cc-orga-member-list.smart.js:45-51` — `isManagerEditingAdmin`, with the comment at
`:122-124`: *"The API does not prevent Managers from editing Admins yet."*

A genuine workaround, but it belongs next to `UpdateOrganisationMemberCommand` so it can be deleted in
one place when the API catches up. Right now nothing links the workaround to the command it guards.

---

## The local client wrapper

`src/lib/cc-api-client.js` — what the library itself could absorb.

### WR-1 — the whole client-instance cache

Lines 14-18 and 27-32: `clientCache`, `bridgeClientCache`, and `configToKey` (with its
`JSON.stringify(config, sortedKeys)` trick) exist only because constructing a client is
expensive/stateful. A `CcApiClient.forConfig()` factory — or documented cheap construction — removes
~40 lines.

Note: `configToKey` embeds **OAuth secrets** into `Map` keys that live for the page lifetime.

### WR-2 — the `ApiConfig` → auth-method mapping, duplicated

Lines 42-61 (`getOAuthMethod`) translate the console's `ApiConfig` shape (`OAUTH_CONSUMER_KEY`,
`API_OAUTH_TOKEN`, …) into the client's `{type: 'oauth-v1', oauthTokens: {consumerKey, …}}`. The same
mapping is repeated at lines 136-141 for `CcApiBridgeClient`.

`ApiConfig` / `AuthBridgeConfig` (`send-to-api.types.d.ts:1-15`) are the console's public contract and
differ only by host field. The library should accept this shape directly, or export the mapping.

### WR-3 — "missing any one credential ⇒ silently unauthenticated"

Lines 43-50. A partially-configured app makes **anonymous** requests rather than failing loudly. A
security-relevant policy decision currently implemented in the consumer.

### WR-4 — `resourceIdResolverStore` is wired only for the API-token client

Line 113 sets `new LocalStorageStore(...)` for the token client. The OAuth client (lines 79-87) and the
bridge client get none — so OAuth-based components, which is nearly all of them, re-resolve resource
ids on every page load. Either the library should default this, or it is an outright gap. Directly
worsens `CO-2`.

### WR-5 — error-hook and defaults inconsistency

- `defaultRequestConfig: { cors: true }` repeated 3× (lines 84, 112, 143); should be the library default for browser builds.
- `createClient()` (lines 157-166) exists solely to attach an `onError` hook dispatching a global `CcApiErrorEvent` on `window`. The event class (`send-to-api.events.js:7-16`) is typed `CcEvent<any>` — the client should export its error type so this isn't `any`.
- `getCcApiBridgeClient` (line 135) **bypasses `createClient` entirely**, so bridge-client errors never fire `cc-api-error`. Making the error hook part of standard construction eliminates the inconsistency.

Adjacent, outside this file — two hand-rolled error-shape adapters exist because of `CB-3`:
`cc-cellar-explorer.client.js:202-211` (`catchError`) and `kv-client.js:370-379` (`rethrowAdapted`),
both reaching into `error.response.body` directly (`:206`, `:375`), plus a third raw read at
`cc-cellar-explorer.client.js:189-190`. `rethrowAdapted` additionally converts `code === 'ABORTED'` back
into a native `DOMException`/`AbortError` because `src/lib/abortable.js` and `kv-details-ctrl.js`
duck-type on `AbortError` — three files depend on that hand-rolled re-wrap. The client should either
throw a native `AbortError` or export `isAbortError()`.

---

## Verified clean

Checked and found to need no action, recorded so it isn't re-investigated:

- **XML parsing is fully gone.** `src/lib/xml-parser.js` and `src/lib/send-to-api.js` are deleted, and a repo-wide grep for `DOMParser|parseFromString|application/xml|text/xml|parseRssFeed` over `src/` returns zero hits. `ListArticleCommand` absorbs both the parsing and the `limit` slicing. (Only leftover: the `limit = 9` default, noted in `RS-12`.)
- **`cc-domain-management.js`** (the dumb component) correctly delegates all domain parsing/sorting/URL building to `@clevercloud/client/utils/domain-utils.js`. This is the model the smart files should follow.
- **i18n mapping of `ERROR_TYPES`** in `cc-env-var-editor-expert.js:62-107` / `cc-env-var-editor-json.js:65-110` is structurally parallel but correctly consumer-side — translation is not the client's job, and the client already provides the typed discriminants.
- **Console routing / presentation** — `getApplicationLink` (`cc-addon-linked-apps.smart.js:108-112`), the `*UrlPattern.replace(':id', …)` calls, `getDocUrl`/`getAssetUrl`, and the `LOADING_STATE` skeletons all correctly stay consumer-side.
- **`src/lib/tokens.js:30-63`** — `isExpirationClose` and its tiered `DEFAULT_THRESHOLDS` are token-domain policy consumed by 3 components. Arguably client territory, but it is already correctly factored into a shared lib, so this is the weakest case in the audit.
