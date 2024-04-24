/* eslint-disable no-case-declarations */

function isStatic(ts, member) {
  return member?.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword);
}

function isGetter(ts, member) {
  return member.kind === ts.SyntaxKind.GetAccessor;
}

/**
 * CEM analyzer plugin: identify-readonly-members
 *
 * This plugin identifies non static properties that have a getter and no setter as readonly.
 */
export default function identifyReadonlyMembers() {
  return {
    name: 'identify-readonly-members',
    analyzePhase({ ts, node, moduleDoc }) {
      switch (node.kind) {
        case ts.SyntaxKind.ClassDeclaration:
          const className = node.name.getText();
          const classDeclaration = moduleDoc.declarations.find((declaration) => {
            return declaration.kind === 'class' && declaration.name === className;
          });

          const settersNames = node.members
            ?.filter((member) => member.kind === ts.SyntaxKind.SetAccessor)
            ?.map((member) => member.name.getText());

          node.members
            ?.filter((member) => {
              return isGetter(ts, member) && !isStatic(ts, member) && !settersNames.includes(member.name.getText());
            })
            ?.forEach((readonlyGetter) => {
              const classMember = classDeclaration?.members?.find(
                (m) => m.kind === 'field' && m.name === readonlyGetter.name.getText(),
              );
              if (classMember != null) {
                classMember.readonly = true;
              }
            });

          break;
      }
    },
  };
}
