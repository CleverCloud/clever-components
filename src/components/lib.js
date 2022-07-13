// export function getVariants (config, variants = [{}]) {
//   if (config.length === 0) {
//     return variants;
//   }
//   const firstEntry = config[0];
//   const nextConfig = config.slice(1);
//   const [matcher, propName, valueList] = firstEntry;
//   const nextVariants = variants.flatMap((variant) => {
//     const matchesObject = Object.entries(matcher)
//       .every(([key, val]) => variant[key] === val);
//     if (matchesObject) {
//       return valueList.map((value) => {
//         return { ...variant, [propName]: value };
//       });
//     }
//     return variant;
//   });
//   return getVariants(nextConfig, nextVariants);
// }

export function getVariants (config, variants = [{}]) {
  const configEntries = Object.entries(config);
  if (configEntries.length === 0) {
    return variants;
  }
  const firstEntry = configEntries[0];
  const nextConfigEntries = configEntries.slice(1);
  const nextConfig = Object.fromEntries(nextConfigEntries);
  const [propName, rawValueList] = firstEntry;
  const nextVariants = rawValueList.flatMap((value) => {
    return variants.map((variant) => {
      return { ...variant, [propName]: value };
    });
  });
  return getVariants(nextConfig, nextVariants);
}
