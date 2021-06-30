import { promises as fs } from 'fs';

async function run () {

  const cemJson = await fs.readFile('./dist/custom-elements.json', 'utf8');
  const cem = JSON.parse(cemJson);

  const wca = {
    version: 'experimental',
  };

  wca.tags = cem.modules
    .map((module) => {
      const customElement = module.exports.find((exp) => exp.kind === 'custom-element-definition');
      if (customElement != null) {
        const declaration = module.declarations.find((dec) => dec.name === customElement.declaration.name);
        if (declaration != null) {

          const wcaTag = {
            name: customElement.name,
            path: './../' + module.path,
            description: declaration.description,
          };

          const attributes = declaration.attributes
            ?.map((attr) => {
              const wcaAttribute = {
                name: attr.name,
              };
              const property = declaration.members?.find((member) => member.kind === 'field' && member.name === attr.fieldName);
              if (property != null) {
                wcaAttribute.description = property.description;
                wcaAttribute.type = property?.type?.text ?? property.type;
                if (property.default != null) {
                  wcaAttribute.default = property.default;
                }
              }
              return wcaAttribute;
            });
          if (attributes != null && attributes.length > 0) {
            wcaTag.attributes = attributes;
          }

          const properties = declaration.members
            ?.filter((member) => member.kind === 'field')
            ?.map((prop) => {
              const wcaProperty = {
                name: prop.name,
              };
              const attribute = declaration.attributes?.find((attr) => attr.fieldName === prop.name);
              if (attribute != null) {
                wcaProperty.attribute = attribute.name;
              }

              wcaProperty.description = prop.description;
              wcaProperty.type = prop?.type?.text ?? prop.type;
              if (prop.default != null) {
                wcaProperty.default = prop.default;
              }
              return wcaProperty;
            });
          if (properties != null && properties.length > 0) {
            wcaTag.properties = properties;
          }

          const events = declaration.events
            ?.map((event) => {
              return {
                name: event.name,
                description: event.description,
              };
            });
          if (events != null && events.length > 0) {
            wcaTag.events = events;
          }

          const slots = declaration.slots
            ?.map((slot) => {
              return {
                name: slot.name,
                description: slot.description,
              };
            });
          if (slots != null && slots.length > 0) {
            wcaTag.slots = slots;
          }

          const cssProperties = declaration.cssProperties
            ?.map((cssProp) => {
              return {
                name: cssProp.name,
                description: cssProp.description,
                type: cssProp?.type?.text ?? cssProp.type,
              };
            });
          if (cssProperties != null && cssProperties.length > 0) {
            wcaTag.cssProperties = cssProperties;
          }

          return wcaTag;
        }
      }
      return null;
    })
    .filter((a) => a != null);

  const wcaJson = JSON.stringify(wca, null, '  ');
  await fs.writeFile('./.components-docs/custom-elements2.json', wcaJson);
}

run()
  .catch(console.error);
