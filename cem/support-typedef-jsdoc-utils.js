import { readFileSync } from 'fs';
import path from 'path';

export function getTypesFromClass(classNode, ts, retrievePrivate = false) {
  const types = [];

  const constructor = getConstructorNode(classNode, ts);
  if (constructor != null) {
    types.push(...getTypesFromConstructor(constructor, ts, retrievePrivate));
  }

  return types;
}

export function getConstructorNode(classNode, ts) {
  return classNode?.members?.find((member) => member.kind === ts.SyntaxKind.Constructor) ?? null;
}

export function getTypesFromConstructor(constructorNode, ts, retrievePrivate = false) {
  const constructorTypes = new Set();

  constructorNode.body.statements
    .flatMap((node) => {
      if (!isVarInitWithDoc(node, ts, retrievePrivate)) {
        return [];
      }
      // Retrieve only from the first JSDoc
      return getTypesFromJsDocCommentNode(node.jsDoc[0], ts);
    })
    .forEach((type) => {
      constructorTypes.add(type);
    });

  return Array.from(constructorTypes);
}

function getTypesFromJsDocCommentNode(node, ts) {
  if (node.kind !== ts.SyntaxKind.JSDocComment) {
    return [];
  }

  // Retrieve only the first @type found
  const rawType = node.tags[0].typeExpression.type;

  const isUnionType = rawType.kind === ts.SyntaxKind.UnionType;
  const isTupleType = rawType.kind === ts.SyntaxKind.TupleType;

  let types;
  if (isUnionType) {
    types = rawType.types;
  } else if (isTupleType) {
    types = rawType.elements;
  } else {
    types = [rawType];
  }

  const typesSet = new Set();
  types.forEach((type) => {
    const foundType = findCustomType(type, ts);
    if (foundType != null) {
      typesSet.add(foundType);
    }
  });

  return Array.from(typesSet);
}

const BUILTIN_TYPES = [
  'String',
  'Boolean',
  'Number',
  'BigInt',
  'Date',
  'Map',
  'Set',
  'WeakMap',
  'WeakSet',
  'Object',
  'Promise',
  'Symbol',
  'ElementInternals',
];
export function findCustomType(nodeType, ts) {
  if (nodeType == null) {
    return null;
  }

  const nodeKind = nodeType.kind;
  const typeName = nodeType.typeName?.getText();

  // any[]
  if (nodeKind === ts.SyntaxKind.ArrayType) {
    // recursion to handle nested arrays
    return findCustomType(nodeType.elementType, ts);
  }

  // Array or Array<any>
  if (nodeKind === ts.SyntaxKind.TypeReference && typeName === 'Array') {
    // recursion to handle nested arrays
    return findCustomType(nodeType.typeArguments?.[0], ts);
  }
  // {{key: string]: any}
  if (nodeKind === ts.SyntaxKind.TypeLiteral && nodeType.members[0]?.kind === ts.SyntaxKind.IndexSignature) {
    return findCustomType(nodeType.members[0].type, ts);
  }

  // Type
  if (nodeKind === ts.SyntaxKind.TypeReference) {
    // we ignore builtin types
    if (BUILTIN_TYPES.includes(typeName)) {
      return null;
    }

    // we don't support custom types with generics
    if (nodeType.typeArguments != null) {
      return null;
    }

    return typeName;
  }

  return null;
}

function isVarInitWithDoc(node, ts, gatherPrivate = false) {
  // We don't want a node that doesn't contain jsDoc and the super() keyword
  // We also want to make sure that the field that we're going through is a var init (this.X = Y)
  // and that the field is not private (no this._X = Y)
  const isBinaryExpression =
    node.kind === ts.SyntaxKind.ExpressionStatement && node.expression.kind === ts.SyntaxKind.BinaryExpression;
  const isVarInit = isBinaryExpression && node.expression?.left?.expression.kind === ts.SyntaxKind.ThisKeyword;
  const hasJsDoc = node?.jsDoc != null && node.jsDoc.length > 0;
  const hasTypeIdentifier = hasJsDoc && node.jsDoc[0].tags[0].kind === ts.SyntaxKind.JSDocTypeTag;
  const isFieldPrivate = isVarInit && node.expression.left.name.getText().charAt(0) === '_';

  return isVarInit && hasJsDoc && hasTypeIdentifier && (!isFieldPrivate || gatherPrivate);
}

export function findTypePath(importTag, rootDir, moduleDir) {
  // Remove leading and ending quotes
  const typeRelativePath = importTag.typeExpression?.type?.argument?.literal.getText().slice(1, -1);

  if (typeRelativePath == null) {
    return null;
  }

  const { dir: typeDir, name: typeFileName } = path.parse(typeRelativePath);
  const typeToTs = convertToTSExt(typeFileName);

  return path.resolve(rootDir, moduleDir, typeDir, typeToTs);
}

export function findSubtypes(ts, node, types, parents) {
  const subtypes = [];

  if (ts == null || node == null) {
    return null;
  }

  node.statements
    .filter((typeDeclaration) => types.includes(typeDeclaration.name?.getText()))
    .forEach((td) => {
      const currentParent = parents == null ? [td.name.getText()] : parents;
      switch (td.kind) {
        case ts.SyntaxKind.TypeAliasDeclaration: {
          subtypes.push(...handleTypeDeclaration(td, node, ts, Array.from(new Set(currentParent))));
          break;
        }
        default: {
          subtypes.push(...handleInterface(td, node, ts, Array.from(new Set(currentParent))));
        }
      }
    });

  return Array.from(new Set(subtypes));
}

// interface {...}
function handleInterface(typeInterface, node, ts, parents) {
  const types = [];

  typeInterface.members.forEach((t) => {
    const type = findCustomType(t.type, ts);
    if (type != null && !parents.includes(type)) {
      types.push(type);
      types.push(...findSubtypes(ts, node, [type], [...parents, type]));
    } else if (t.type.kind === ts.SyntaxKind.TupleType) {
      types.push(...handleTuple(t.type, node, ts, parents));
    } else if (t.type.kind === ts.SyntaxKind.UnionType) {
      types.push(...handleUnion(t.type, node, ts, parents));
    }
  });
  return types;
}

// type foo = ...;
// Need to check what we're supposed to do if we have type = smth;
function handleTypeDeclaration(typeDeclaration, node, ts, parents) {
  const types = [];

  // Is this useful?
  if (typeDeclaration.type?.types == null) {
    const type = findCustomType(typeDeclaration.type, ts);
    if (type != null && !parents.includes(type)) {
      types.push(type);
      types.push(...findSubtypes(ts, node, [type], [...parents, type]));
      return types;
    }
  }

  typeDeclaration.type?.types?.forEach((t) => {
    const type = findCustomType(t, ts);
    if (type != null && !parents.includes(type)) {
      types.push(type);
      types.push(...findSubtypes(ts, node, [type], [...parents, type]));
    }
  });
  return types;
}

function handleUnion(unionType, node, ts, parents) {
  const types = [];

  unionType?.types?.forEach((t) => {
    const type = findCustomType(t, ts);
    if (type != null && !parents.includes(type)) {
      types.push(type);
      types.push(...findSubtypes(ts, node, [type], [...parents, type]));
    }
  });
  return types;
}

// [number, Baz,...]
function handleTuple(tuple, node, ts, parents) {
  const types = [];

  tuple.elements.forEach((element) => {
    const type = findCustomType(element, ts);
    if (type != null && !parents.includes(type)) {
      types.push(type);
      types.push(...findSubtypes(ts, node, [type], [...parents, type]));
    }
  });
  return types;
}

export function convertInterface(ts, node, code, interfaceName) {
  const st = node?.statements.find((st) => st?.name?.getText() === interfaceName);
  if (st == null) {
    return '';
  }

  const start = st?.modifiers?.find((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)?.end ?? st?.pos;
  const typeDeclaration = code.substring(start, st?.end).trim();
  const typeDisplay = '```ts\n\n' + typeDeclaration + '\n\n```';

  return typeDisplay;
}

export function convertToTSExt(filename) {
  const { name: parsedName, ext: extension } = path.parse(filename);
  const typeToTs =
    extension !== '.ts'
      ? path.format({
          name: parsedName,
          ext: extension === '.types' ? '.types.d.ts' : '.d.ts',
        })
      : filename;

  return path.parse(typeToTs).base;
}

export function findPathAndTypesFromImports(ts, filePath, ancestors = null) {
  const imports = [];
  let sourceCode = '';

  const parsedPath = path.parse(filePath);
  const formattedFilePath = path.resolve(parsedPath.dir, convertToTSExt(filePath));

  const currentAncestors = ancestors == null ? [formattedFilePath] : ancestors;

  // Open file
  try {
    sourceCode = readFileSync(formattedFilePath).toString();
  } catch (e) {
    console.error(e);
    return [];
  }

  // transform to AST
  const sourceAst = ts.createSourceFile(formattedFilePath, sourceCode, ts.ScriptTarget.ES2015, true);

  // Gather only imports from the AST
  const importsDeclaration = sourceAst.statements.filter((node) => node.kind === ts.SyntaxKind.ImportDeclaration);
  if (importsDeclaration == null) {
    return [];
  }

  importsDeclaration.forEach((importNode) => {
    const types = [];
    const importFile = importNode.moduleSpecifier.text;
    const isImportRelative = importFile.startsWith('./') || importFile.startsWith('../');
    if (!isImportRelative) {
      return;
    }

    const parsedImportPath = path.parse(importFile);

    const formattedImportPath = path.join(parsedPath.dir, parsedImportPath.dir, convertToTSExt(parsedImportPath.base));

    if (!currentAncestors.includes(formattedImportPath)) {
      importNode.importClause.namedBindings.elements.forEach((nodeType) => types.push(nodeType.getText()));
      imports.push({ types, path: formattedImportPath });
      imports.push(...findPathAndTypesFromImports(ts, formattedImportPath, [...currentAncestors, formattedImportPath]));
    }
  });
  return imports;
}

export function findInterfacesFromExtends(ts, parentNode) {
  const interfaces = [];

  if (ts == null || parentNode == null || typeof parentNode !== 'object') {
    return null;
  }

  parentNode.statements
    .filter((node) => node?.heritageClauses != null)
    .forEach((node) => {
      const interfaceName = node.name.getText();
      const heritageClause = node.heritageClauses[0];
      heritageClause.types.forEach((nodeType) => {
        interfaces.push({ interface: interfaceName, extends: nodeType.getText() });
      });
    });

  const withRelatives = findRelatives(interfaces);

  return withRelatives;
}

function findRelatives(interfaces) {
  let currentExtend;
  const withRelatives = [];
  interfaces.forEach((anInterface) => {
    const relatives = [];
    currentExtend = anInterface;
    while (true) {
      const theRelativeExtend = interfaces.find((subInterface) => subInterface.interface === currentExtend.extends);
      if (theRelativeExtend == null) {
        break;
      }
      relatives.push(theRelativeExtend.extends);
      currentExtend = theRelativeExtend;
    }
    withRelatives.push({ ...anInterface, relatives });
  });

  return withRelatives;
}
