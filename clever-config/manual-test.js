import { init } from './clever-config.js';
import { stringNonEmpty } from './string-non-empty.js';

const schema = {
  // ...
};

const validators = {
  // ...
  'string-non-empty': stringNonEmpty, // importé depuis les validateurs de base
  'string-foo': {
    doc: { en: 'zefzef' },
    validate() {},
  },
};

try {
  const cleverConfigSchema = init({ schema, validators });

  const docsMd = cleverConfigSchema.generateDocs();

  cleverConfigSchema.addSource('env', process.env);
  const configFromFile = await fs.readFile(/* ... */);
  cleverConfigSchema.addSource('json-file', configFromFile);

  const cleverConfig = cleverConfigSchema.generateConfig();

  cleverConfig.debugValues();

  const MATOMO_URL = cleverConfig.getValue('MATOMO_URL');

  const { ENABLE_ANALYTICS, FOOBAR } = cleverConfig.getAll();
} catch (e) {
  if (e instanceof InvalidSchemaOrValidatorsError) {
    // erreur sur le init
  }
  if (e instanceof InvalidValuesError) {
    // erreur sur le generateConfig
  }
}
