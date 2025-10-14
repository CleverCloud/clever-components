import ts from 'typescript';

const program = ts.createProgram(
  [
    '/home/flo-pro/Projects/clever-components/src/components/cc-domain-management/cc-domain-management.js',
    '/home/flo-pro/Projects/clever-components/src/components/cc-badge/cc-badge.js',
  ],
  {
    target: ts.ScriptTarget.ES2022,
    checkJs: true,
    allowJs: true,
    module: ts.ModuleKind.NodeNext,
  },
);

const checker = program.getTypeChecker();

for (const sourceFile of program.getSourceFiles()) {
  if (!sourceFile.isDeclarationFile && sourceFile.fileName.endsWith('cc-domain-management.js')) {
    console.log('File: ', sourceFile.fileName);
    ts.forEachChild(sourceFile, visit);
  }
}

/** @param {ts.Node} node */
function visit(node) {
  if (ts.isClassDeclaration(node) && node.name) {
    const classSymbol = checker.getSymbolAtLocation(node.name);
    if (classSymbol != null) {
      console.log('Class: ', classSymbol.name);
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
      // console.log(
      //   'Constructor: ',
      //   member.body.statements.map((statement) => console.log(statement.getText())),
      // );
      member.body.statements.forEach((statement) => {
        if (ts.isExpressionStatement(statement)) {
          const expr = statement.expression;
          if (
            ts.isBinaryExpression(expr) &&
            expr.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
            ts.isPropertyAccessExpression(expr.left) &&
            expr.left.expression.kind === ts.SyntaxKind.ThisKeyword
          ) {
            const type = checker.getTypeAtLocation(expr.left.name);
            if (!expr.left.name.getText().startsWith('_')) {
              const expandedType = getExpandedType(type, expr.left.name);
              console.log({ expandedType });
            }
          }
        }
      });
    }
  });
}

/**
 * @param {ts.Type} type
 * @param {ts.Node} parentNode
 * @param {number} depth
 * @param {number} maxDepth
 * @returns {string}
 */
function getExpandedType(type, parentNode, depth = 0, maxDepth = 5) {
  // Prevent infinite recursion
  if (depth > maxDepth) {
    return checker.typeToString(type);
  }

  // Get the string representation early to check for primitives and built-ins
  const typeString = checker.typeToString(type);

  // Check if this is a primitive type using TypeScript's type flags
  if (
    type.flags & ts.TypeFlags.String ||
    type.flags & ts.TypeFlags.Number ||
    type.flags & ts.TypeFlags.Boolean ||
    type.flags & ts.TypeFlags.Null ||
    type.flags & ts.TypeFlags.Undefined ||
    type.flags & ts.TypeFlags.Void ||
    type.flags & ts.TypeFlags.Any ||
    type.flags & ts.TypeFlags.Unknown ||
    type.flags & ts.TypeFlags.Never ||
    type.flags & ts.TypeFlags.ESSymbol ||
    type.flags & ts.TypeFlags.BigInt ||
    type.flags & ts.TypeFlags.StringLiteral ||
    type.flags & ts.TypeFlags.NumberLiteral ||
    type.flags & ts.TypeFlags.BooleanLiteral ||
    type.flags & ts.TypeFlags.BigIntLiteral
  ) {
    return typeString;
  }

  // Don't expand common built-in global types
  const symbol = type.getSymbol();
  if (symbol) {
    const name = symbol.getName();
    const builtInTypes = [
      'String',
      'Number',
      'Boolean',
      'RegExp',
      'Date',
      'Error',
      'Promise',
      'Map',
      'Set',
      'WeakMap',
      'WeakSet',
      'Array',
      'ReadonlyArray',
      'Function',
      'Object',
    ];
    if (builtInTypes.includes(name)) {
      return typeString;
    }
  }

  // Handle union types (e.g., string | number)
  if (type.isUnion()) {
    return type.types.map((t) => getExpandedType(t, parentNode, depth, maxDepth)).join(' | ');
  }

  // Handle intersection types (e.g., A & B)
  if (type.isIntersection()) {
    return type.types.map((t) => getExpandedType(t, parentNode, depth, maxDepth)).join(' & ');
  }

  // Handle array types
  if (checker.isArrayType(type)) {
    const typeArgs = checker.getTypeArguments(type);
    if (typeArgs && typeArgs.length > 0) {
      const elementType = getExpandedType(typeArgs[0], parentNode, depth + 1, maxDepth);
      return `Array<${elementType}>`;
    }
  }

  // Handle object types (interfaces, type literals, classes)
  const props = type.getProperties();
  if (props.length > 0) {
    const indent = '  '.repeat(depth + 1);
    const closeIndent = '  '.repeat(depth);

    const propStrings = props.map((prop) => {
      const propType = checker.getTypeOfSymbolAtLocation(prop, parentNode);
      const propName = prop.getName();
      const isOptional = (prop.flags & ts.SymbolFlags.Optional) !== 0;
      const expandedPropType = getExpandedType(propType, parentNode, depth + 1, maxDepth);

      return `${indent}${propName}${isOptional ? '?' : ''}: ${expandedPropType}`;
    });

    return `{\n${propStrings.join(';\n')}\n${closeIndent}}`;
  }

  // Fallback to default string representation
  return typeString;
}
