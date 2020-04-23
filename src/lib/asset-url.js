export function assetUrl (importMeta, relativeAssetPath) {
  return new URL(relativeAssetPath, importMeta.url).href;
}
