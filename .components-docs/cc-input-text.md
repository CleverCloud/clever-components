# cc-input-text

A text input (with optional multiline support)

## Details

* uses a native `<input>` element by default and a `<textarea>` element when `multi` is true

## Properties

| Property      | Attribute     | Type      | Description                                      |
|---------------|---------------|-----------|--------------------------------------------------|
| `disabled`    | `disabled`    | `boolean` | same as native a input/textarea element          |
| `multi`       | `multi`       | `boolean` | enable multiline support (with a textarea)       |
| `name`        | `name`        | `string`  | same as native a input/textarea element          |
| `placeholder` | `placeholder` | `string`  | same as native a input/textarea element          |
| `readonly`    | `readonly`    | `boolean` | same as native a input/textarea element          |
| `skeleton`    | `skeleton`    | `boolean` | enable skeleton screen UI pattern (loading hint) |
| `value`       | `value`       | `string`  | same as native a input/textarea element          |

## Events

| Event                 | Description                                      |
|-----------------------|--------------------------------------------------|
| `cc-input-text:input` | mirrors native input/textarea events with the `value` on `detail` |
