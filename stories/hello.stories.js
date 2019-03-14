'use strict'

import { storiesOf } from '@storybook/html'

storiesOf('Hello component', module)
  .add('Hello story', () => {
    return `<h1>Hello</h1>`
  }, { notes: 'Hello docs' })
