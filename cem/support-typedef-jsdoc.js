import ts from 'typescript';

/**
 * Recursively expands a TypeScript type into a readable string representation
 * @param {ts.Type} type - The type to expand
 * @param {ts.TypeChecker} checker - The type checker instance
 * @param {ts.Node} parentNode - Parent node for context
 * @param {number} depth - Current recursion depth
 * @param {number} maxDepth - Maximum recursion depth
 * @returns {string} Expanded type representation
 */
function getExpandedType(type, checker, parentNode, depth = 0, maxDepth = 5) {
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

  // Don't expand common built-in global types and library types
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
      'AnimateController', // @lit-labs/motion
      'Chart', // chart.js
      // DOM types
      'Node',
      'Element',
      'HTMLElement',
      'Document',
      'Window',
      'EventTarget',
    ];
    if (builtInTypes.includes(name)) {
      return typeString;
    }
  }

  // Handle union types (e.g., string | number)
  if (type.isUnion()) {
    return type.types.map((t) => getExpandedType(t, checker, parentNode, depth, maxDepth)).join(' | ');
  }

  // Handle intersection types (e.g., A & B)
  if (type.isIntersection()) {
    return type.types.map((t) => getExpandedType(t, checker, parentNode, depth, maxDepth)).join(' & ');
  }

  // Handle array types
  if (checker.isArrayType(type)) {
    const typeArgs = checker.getTypeArguments(type);
    if (typeArgs && typeArgs.length > 0) {
      const elementType = getExpandedType(typeArgs[0], checker, parentNode, depth + 1, maxDepth);
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
      const expandedPropType = getExpandedType(propType, checker, parentNode, depth + 1, maxDepth);

      return `${indent}${propName}${isOptional ? '?' : ''}: ${expandedPropType}`;
    });

    return `{\n${propStrings.join(';\n')}\n${closeIndent}}`;
  }

  // Fallback to default string representation
  return typeString;
}

/**
 * Extracts type information for class properties from constructor assignments
 * @param {ts.ClassDeclaration} classNode - The class node to extract types from
 * @param {ts.TypeChecker} checker - The type checker instance
 * @returns {Array<{name: string, type: string, jsDoc: string}>} Array of property information
 */
function extractTypesFromClass(classNode, checker) {
  const properties = [];

  // Find the constructor
  const constructor = classNode.members.find((member) => ts.isConstructorDeclaration(member));

  if (!constructor || !constructor.body) {
    return properties;
  }

  // Iterate through constructor statements to find property assignments
  for (const statement of constructor.body.statements) {
    if (!ts.isExpressionStatement(statement)) {
      continue;
    }

    const expr = statement.expression;

    // Look for: this.propertyName = value
    if (
      ts.isBinaryExpression(expr) &&
      expr.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isPropertyAccessExpression(expr.left) &&
      expr.left.expression.kind === ts.SyntaxKind.ThisKeyword
    ) {
      const propName = expr.left.name.getText();

      // Skip private properties (starting with _)
      if (propName.startsWith('_')) {
        continue;
      }

      console.log(`[typedef-jsdoc] Analyzing property: ${propName}`);

      // Get the type at this location
      const type = checker.getTypeAtLocation(expr.left.name);
      console.log(`[typedef-jsdoc] Got type for ${propName}, expanding...`);
      const expandedType = getExpandedType(type, checker, expr.left.name);
      console.log(`[typedef-jsdoc] Expanded type for ${propName}: ${expandedType}`);

      // Get JSDoc comment from the statement
      let jsDoc = '';
      if (statement.jsDoc && statement.jsDoc.length > 0) {
        jsDoc = statement.jsDoc[0].comment || '';
        if (typeof jsDoc !== 'string') {
          jsDoc = ts.displayPartsToString(jsDoc);
        }
      }

      properties.push({
        name: propName,
        type: expandedType,
        jsDoc: jsDoc,
      });
    }
  }

  return properties;
}

export default function supportTypedefJsdoc() {
  return {
    name: 'support-typedef-jsdoc',
    async moduleLinkPhase({ moduleDoc }) {
      // Skip files that we don't need to process
      if (
        moduleDoc.path.includes('.events.js') ||
        moduleDoc.path.includes('.smart.js') ||
        moduleDoc.path.includes('.client.js')
      ) {
        return;
      }

      // Access the shared TypeScript program and type checker from the config
      const tsProgram = global.__CEM_PROGRAM__;
      const checker = global.__CEM_TYPE_CHECKER__;

      if (!tsProgram || !checker) {
        console.error(
          '[typedef-jsdoc] ERROR: TypeScript program not available. Make sure overrideModuleCreation is configured.',
        );
        return;
      }

      // Get the source file from the shared program
      const sourceFile = tsProgram.getSourceFile(moduleDoc.path);

      if (!sourceFile) {
        console.warn(`[typedef-jsdoc] WARNING: Could not find source file for ${moduleDoc.path}`);
        return;
      }

      // Iterate through all class declarations
      for (const statement of sourceFile.statements) {
        if (!ts.isClassDeclaration(statement) || !statement.name) {
          continue;
        }

        const componentName = statement.name.getText();

        // Check if the class is a Lit component
        const isLitComponent =
          statement?.heritageClauses?.[0]?.types[0]?.expression?.getText() === 'LitElement' ||
          statement?.heritageClauses?.[0]?.types[0]?.expression?.getText() === 'CcFormControlElement';

        if (!isLitComponent) {
          continue;
        }

        // Extract all properties with their types using the type checker
        const properties = extractTypesFromClass(statement, checker);

        if (properties.length === 0) {
          continue;
        }

        // Generate markdown documentation for properties
        const propertyDocs = properties
          .map((prop) => {
            let doc = `#### \`${prop.name}\`\n\n`;

            if (prop.jsDoc) {
              doc += `${prop.jsDoc}\n\n`;
            }

            doc += '**Type:**\n\n```typescript\n' + prop.type + '\n```';

            return doc;
          })
          .join('\n\n');

        const displayText = propertyDocs ? '### Properties\n\n' + propertyDocs : '';

        // Find the corresponding declaration in the moduleDoc
        const declaration = moduleDoc.declarations.find((declaration) => declaration.name === componentName);

        if (declaration) {
          declaration.description = declaration.description + '\n\n' + displayText;
        }

        console.log('FINISHED ANALYZING', sourceFile.fileName);
      }
    },
  };
}
