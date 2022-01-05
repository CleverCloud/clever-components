import { addons } from '@web/storybook-prebuilt/addons.js';
import { create } from '@web/storybook-prebuilt/theming.js';

const cleverTheme = create({
  brandTitle: 'Clever Cloud components',
  brandUrl: 'https://www.clever-cloud.com/doc/',
  brandImage: 'https://www.clever-cloud.com/app/themes/cc-wp-theme/assets/img/logo_on_white.svg',
});

addons.setConfig({
  theme: cleverTheme,
});
