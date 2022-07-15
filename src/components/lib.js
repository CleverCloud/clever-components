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

export async function getVariantsFromComponent (componentName) {

  const completeJson = await fetch('/dist/custom-elements.json').then((r) => r.json());
  const componentModule = completeJson.modules.find((m) => m.path.endsWith(`/${componentName}.js`));

  console.log(componentModule);

  const propertiesFromCem = componentModule.declarations[0].members
    ?.filter((m) => {
      return m.kind === 'field' && m?.type?.text === 'boolean';
    })
    ?.map((m) => [m.name, [false, true]]);

  return Object.fromEntries(propertiesFromCem);
}
