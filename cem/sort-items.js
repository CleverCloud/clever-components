import { sortBy } from '../src/lib/utils.js';

/**
 * CEM analyzer plugin: sort-items
 *
 * This plugin sorts all items alphabetically by their name.
 * This is very useful when you want to diff different manifests.
 */
export default function sortItems() {
  return {
    name: 'sort-items',
    packageLinkPhase({ customElementsManifest }) {
      if (customElementsManifest.modules == null) {
        return;
      }

      for (const module of customElementsManifest.modules) {
        if (module.declarations != null) {
          for (const declaration of module.declarations) {
            declaration.attributes?.sort(sortBy('name'));
            declaration.cssParts?.sort(sortBy('name'));
            declaration.cssProperties?.sort(sortBy('name'));
            declaration.events?.sort(sortBy('name'));
            declaration.members?.sort(sortBy('name'));
            declaration.slots?.sort(sortBy('name'));
          }
        }
      }

      customElementsManifest.modules.sort(sortBy('path'));
    },
  };
}
