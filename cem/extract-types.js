import ts from 'typescript';

const program = ts.createProgram(
  ['/home/flo-pro/Projects/clever-components/src/components/cc-domain-management/cc-domain-management.js'],
  {
    target: ts.ScriptTarget.ES2022,
    checkJs: true,
    allowJs: true,
    module: ts.ModuleKind.NodeNext,
  },
);

const checker = program.getTypeChecker();

for (const sourceFile of program.getSourceFiles()) {
  if (!sourceFile.isDeclarationFile) {
    ts.forEachChild(sourceFile, visit);
  }
}

/** @param {ts.Node} node */
function visit(node) {
  if (ts.isClassDeclaration(node) && node.name) {
    const classSymbol = checker.getSymbolAtLocation(node.name);
    if (classSymbol != null) {
      extractMember(classSymbol, node);
    }
  }
}

/**
 * @param {ts.Symbol} classSymbol
 * @param {ts.ClassDeclaration} classNode
 */
function extractMember(classSymbol, classNode) {
  // console.log(classNode.name);
  classNode.members.forEach((member) => {
    if (ts.isConstructorDeclaration(member)) {
      member.parameters.forEach((param) => {
        console.log(param.name);
        if (ts.isParameterPropertyDeclaration(param, member)) {
          console.log(param.name);
        }
      });
    }
  });
}
