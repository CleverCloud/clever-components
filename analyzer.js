import { createPackageAnalyzer } from '@lit-labs/analyzer/package-analyzer.js';
import { generateManifest } from '@lit-labs/gen-manifest';
import * as path from 'path';

const packagePath = path.resolve('./src/components/cc-addon-admin');
const analyzer = createPackageAnalyzer(packagePath);
const pkg = analyzer.getPackage();

generateManifest(pkg).then((filetree) => {
  console.log(filetree);
  // fs.writeFileSync(path.resolve('./custom-elements-lit.json'), filetree);
});
