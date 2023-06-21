import { toCdnEntryName } from '../tasks/cdn-entry-name.js';
import { CDN_ENVIRONMENTS } from '../tasks/cdn-environments.js';
import { getCdnRollupConfig } from './rollup-cdn-common.js';

const version = process.env.VERSION;
if (version == null) {
  throw new Error('VERSION env var is required.');
}
const cdnEntryName = toCdnEntryName(CDN_ENVIRONMENTS.release, version);

export default getCdnRollupConfig(cdnEntryName, true);
