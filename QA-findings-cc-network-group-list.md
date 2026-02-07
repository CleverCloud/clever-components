# QA Findings: cc-network-group-list

## Component Classification
- **Type**: Mixed (Form + Read-Only)
- **Characteristics**: Two-block component with a form to link network groups and a read-only list of linked network groups with their peers

## Pattern Compliance

| Pattern | Status | Code Location | Notes |
|---------|--------|---------------|-------|
| Form reset on success | OK | smart.js:85-87 | `refreshFormAndList()` reloads data on success |
| Error preserves data | OK | smart.js:89-95 | `.catch()` sets state to `idle`, select value preserved |
| State cleanup | OK | smart.js:85-94 | Both paths handled (`.then()` refreshes, `.catch()` resets to idle) |
| Success notification | OK | smart.js:87 | `notifySuccess(i18n('cc-network-group-list.link.success'))` |
| Error notification | OK | smart.js:91 | `notifyError(i18n('cc-network-group-list.link.error'))` |
| Event dispatch | INTENTIONAL | N/A | No dispatch after link - component is self-contained, parent doesn't need notification |

## Edge Cases Investigated

| Scenario | Status | Notes |
|----------|--------|-------|
| Double-click submit | OK | `cc-button` blocks clicks when `waiting=true` (cc-button.js:198) |
| Network timeout | OK | Standard error handling via `.catch()` |
| Empty select options | OK | Shows "Create" link when no options remain (cc-network-group-list.js:114-116) |
| Unmount during link | OK | LitElement handles unmount gracefully (user confirmed) |
| Component unmount during fetch | OK | Uses abort signal for initial fetch (smart.js:37) |

## Resolutions

| Finding | Decision | Rationale |
|---------|----------|-----------|
| No `.finally()` for state cleanup | INTENTIONAL | Both `.then()` and `.catch()` handle state appropriately |
| No event dispatch after link | INTENTIONAL | Component is self-contained, parent doesn't need notification |
| Link call doesn't use abort signal | ALREADY_HANDLED | LitElement handles unmount gracefully |

## State Machine

### linkFormState
```
loading → idle (data loaded)
loading → error (fetch failed)
idle → linking (user submits form)
linking → idle (via refreshFormAndList on success)
linking → idle (on error)
```

### listState
```
loading → loaded (data loaded)
loading → error (fetch failed)
loaded → loaded (refreshed after link)
```

## Stories Available for Testing

| Story | linkFormState | listState | Use Case |
|-------|---------------|-----------|----------|
| `defaultStory` | idle + options | loaded + items | Normal state with data |
| `dataLoadedWithEmpty` | idle + options | loaded + empty | No linked groups yet |
| `dataLoadedWithNoNetworkGroupToLink` | idle + empty | loaded + empty | All groups already linked |
| `loading` | loading | loading | Initial loading state |
| `linkFormLinking` | linking + options | loaded + items | During link operation |
| `error` | error | error | Both blocks in error state |

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/v4/networkgroups/organisations/{ownerId}/networkgroups` | Fetch all network groups |
| POST | `/v4/networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/members` | Link resource to network group |

## Additional Notes

- The form uses `formSubmit` directive for form handling
- Select options are sorted alphabetically before display (cc-network-group-list.js:111)
- The component properly filters network groups into "linked" and "unlinked" categories (smart.js:39-44)
- Each network group card displays: name, ID with clipboard, dashboard link, and peer list
- Network group peer cards are rendered using `cc-network-group-peer-card` sub-component
