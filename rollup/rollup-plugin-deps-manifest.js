import fs from 'fs';
import path from 'path';
import { DepGraph } from 'dependency-graph';

export function depsManifestPlugin ({ packageVersion }) {
  return {
    generateBundle: function (options, outputBundle) {
      const depsManifestDir = path.join(process.cwd(), options.dir);
      const depsManifestFilepath = path.join(process.cwd(), options.dir, `deps-manifest-${packageVersion}.json`);

      const graph = new DepGraph();

      // Look for JS imports and referenced assets => graph
      for (const [id, bundle] of Object.entries(outputBundle)) {
        graph.addNode(id);
        for (const imp of bundle.imports ?? []) {
          graph.addNode(imp);
          graph.addDependency(id, imp);
        }
        for (const rf of bundle.referencedFiles ?? []) {
          graph.addNode(rf);
          graph.addDependency(id, rf);
        }
      }

      const depsManifest = {
        // In case we need to change the behavior later
        manifestVersion: '2',
        packageVersion,
        files: [],
        styles: [],
      };

      for (const [hashedId, bundle] of Object.entries(outputBundle)) {
        // Ignore SVG assets
        if (hashedId.endsWith('.svg')) {
          continue;
        }

        if (hashedId.endsWith('.css')) {
          depsManifest.styles.push({
            path: hashedId,
          });
          continue;
        }

        const modules = Object.keys(bundle.modules);
        depsManifest.files.push({
          id: getId(hashedId, bundle),
          path: hashedId,
          dependencies: graph.dependenciesOf(hashedId),
          sources: modules.map((rawFilepath) => {
            // Still not sure where do those come from...
            const filepath = rawFilepath.replace('\x00', '');
            return path.relative(process.cwd(), filepath);
          }),
        });
      }

      // Easier to debug and diff (warning, sort modifies the array)
      depsManifest.files.sort((a, b) => a.id.localeCompare(b.id));

      const depsManifestJson = JSON.stringify(depsManifest, null, '  ');
      fs.mkdirSync(depsManifestDir, { recursive: true });
      fs.writeFileSync(depsManifestFilepath, depsManifestJson);
    },
  };
}

// We want to load components (and some libs) via a short name.
// No dir prefix, no extension suffix, just a simple short unique ID.
// We're using Rollup's facadeModuleId for that,
// if it's a chunk, we won't need to load it directly so we just return ''.
function getId (id, bundle) {
  return (bundle.facadeModuleId != null)
    ? path.parse(bundle.facadeModuleId).name
    : '';
}
