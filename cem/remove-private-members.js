function isPrivate (item) {
  return item.name.startsWith('_');
}

/**
 * CEM analyzer plugin: remove-private-members
 *
 * This plugin removes private fields from CEM.
 * It relies on the "_" prefix convention to identify private members of a class.
 */
export default function removePrivateMembers () {
  return {
    name: 'remove-private-members',
    packageLinkPhase ({ customElementsManifest }) {

      customElementsManifest?.modules?.forEach((module) => {
        module?.declarations?.forEach((declaration) => {

          if (declaration.members != null) {
            declaration.members = declaration.members.filter((member) => {
              const propertyOrMethod = (member.kind === 'field' || member.kind === 'method');
              return !(propertyOrMethod && isPrivate(member));
            });
          }

          if (declaration.attributes != null) {
            declaration.attributes = declaration.attributes.filter((attribute) => {
              return !isPrivate(attribute);
            });
          }

        });
      });

    },
  };
}
