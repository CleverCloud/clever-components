import { InvalidSchemaOrValidatorsError, InvalidValuesError, init } from './clever-config.js';
import { stringNonEmpty } from './string-non-empty.js';

/**
 * @typedef {import('./clever-config.types.js').OptionSchema} OptionSchema
 */

/** @type {Record<string, OptionSchema>} */
const schema = {
  MATOMO_URL: {
    format: 'string-non-empty',
    optional: false,
    documentation: 'the matomo url',
    tags: ['client'],
  },
  // ANALYTICS_ENABLED: {
  //   format: 'boolean',
  //   optional: false,
  //   documentation: 'analytics enabled or not',
  //   tags: ['client'],
  // },
  // OPTIONAL_OPTION: {
  //   format: 'number',
  //   optional: true,
  //   defaultValue: 0,
  //   tags: ['server'],
  //   documentation: 'fake option',
  // },
};

const validators = {
  'string-non-empty': stringNonEmpty, // importé depuis les validateurs de base
  'string-foo': {
    doc: { en: 'zefzef' },
    validate() {},
  },
};

try {
  const cleverConfigSchema = init({ schema, validators });

  // const docsMd = cleverConfigSchema.generateDocs();

  cleverConfigSchema.addSource('env', {
    MATOMO_URL: 'http://toto.com',
  });

  cleverConfigSchema.addSource('settingsApi', {
    MATOMO_URL: 'http://foobar.com',
  });

  // const configFromFile = await fs.readFile(/* ... */);
  // cleverConfigSchema.addSource('json-file', configFromFile);

  const cleverConfig = cleverConfigSchema.generateConfig();

  // cleverConfig.debugValues();

  const MATOMO_URL = cleverConfig.getValue('MATOMO_URL');

  console.log(MATOMO_URL);

  const allWithoutTag = cleverConfig.getAll();
  const allWithTag = cleverConfig.getAll('toto');

  console.log(allWithoutTag);

  console.log(allWithTag);

  // const { ENABLE_ANALYTICS, FOOBAR } = cleverConfig.getAll();
} catch (e) {
  if (e instanceof InvalidSchemaOrValidatorsError) {
    // erreur sur le init
    console.error(e);
  }
  if (e instanceof InvalidValuesError) {
    // erreur sur le generateConfig
    console.error(e);
  }
}
