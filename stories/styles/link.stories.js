import { Meta, Preview, Story } from '@storybook/addon-docs/blocks';
import {html} from 'lit-html';
import { linkStyles} from  '../../components/styles/link.js';

<Meta title="🎨 Styles|link" />

# Link styles

We're trying to blbla

## How to use?

```html
<a class="link" href="https://example.com">This is a link</a>
```

## Example

<Preview>
<Story name="foo">
{() => html`
<style>${linkStyles}</style>
<a class="link" href="https://example.com">This is a link</a>
`}
</Story>
</Preview>

<a class="link">gferg oeizje fij </a>
