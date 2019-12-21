import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';

const cleverTheme = create({
  brandTitle: 'Clever Cloud components',
  brandUrl: 'https://www.clever-cloud.com',
  brandImage: 'https://www.clever-cloud.com/images/brand-assets/logos/v2/logo_on_white.svg',
});

addons.setConfig({
  theme: cleverTheme,
  showRoots: false,
});
