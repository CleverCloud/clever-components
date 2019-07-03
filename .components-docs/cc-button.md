# cc-button

A button

## Details

* attributes `primary`, `success` and `danger` define the mode of the button and are exclusive.
* You can only set one mode at a time.
* When you don't use any of these values, the mode defaults to `simple`.

## Properties

| Property   | Attribute  | Type      | Description                                      |
|------------|------------|-----------|--------------------------------------------------|
| `danger`   | `danger`   | `boolean` | set button UI mode to danger                     |
| `disabled` | `disabled` | `boolean` | same as native button element `disabled` attribute |
| `outlined` | `outlined` | `boolean` | set button UI as outlined (white background instead of filled color) |
| `primary`  | `primary`  | `boolean` | set button UI mode to primary                    |
| `skeleton` | `skeleton` | `boolean` | enable skeleton screen UI pattern (loading hint) |
| `success`  | `success`  | `boolean` | set button UI mode to success                    |

## Events

| Event   | Description                                  |
|---------|----------------------------------------------|
| `click` | Native click event from inner button element |

## Slots

| Name | Description                              |
|------|------------------------------------------|
|      | The content of the button (text or HTML) |
