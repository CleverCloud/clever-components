import { toCdnEntryName } from '../tasks/cdn-entry-name.js';
import { CDN_ENVIRONMENTS } from '../tasks/cdn-environments.js';
import { getCurrentBranch } from '../tasks/git-utils.js';
import { getCdnRollupConfig } from './rollup-cdn-common.js';

const nameFromEnv = process.env.PREVIEW;
const name = (nameFromEnv == null || nameFromEnv.length === 0) ? getCurrentBranch() : nameFromEnv;
const cdnEntryName = toCdnEntryName(CDN_ENVIRONMENTS.preview, name);

export default getCdnRollupConfig(cdnEntryName, false);
