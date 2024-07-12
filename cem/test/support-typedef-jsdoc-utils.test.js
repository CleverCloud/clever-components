import { expect } from 'chai';
import fs, { readFileSync } from 'fs';
import path from 'path';
import ts from 'typescript';
import {
  convertInterface,
  findCustomType,
  findInterfacesFromExtends,
  findPathAndTypesFromImports,
  findSubtypes,
  findTypePath,
  getConstructorNode,
  getTypesFromClass,
  getTypesFromConstructor,
  getTypesFromEventTags,
} from '../support-typedef-jsdoc-utils.js';

const filename = 'cem/test/fixtures/cc-test-component.js';
const sourceCode = fs.readFileSync(filename, { encoding: 'utf-8' });

const sourceAst = ts.createSourceFile(filename, sourceCode, ts.ScriptTarget.ES2015, true);
const classNode = sourceAst.statements.find((node) => node.kind === ts.SyntaxKind.ClassDeclaration);

function getClassNodeFromSource(source) {
  const ast = ts.createSourceFile('foo', source, ts.ScriptTarget.ES2015, true);
  return ast.statements.find((node) => node.kind === ts.SyntaxKind.ClassDeclaration);
}

const ROOT_DIR = process.cwd();
const MODULE_DIR = 'cem/test/fixtures';

describe('getConstructorNode()', function () {
  it('should get the constructor node.', function () {
    const constructorNode = getConstructorNode(classNode, ts);
    expect(constructorNode.kind).to.equal(ts.SyntaxKind.Constructor);
  });

  it("should return null when there's no constructor", function () {
    const source = `export class CcTestComponent extends LitElement {}`;
    const ast = ts.createSourceFile('foo', source, ts.ScriptTarget.ES2015, true);
    const classNodeWithoutConstr = ast.statements.find((node) => node.kind === ts.SyntaxKind.ClassDeclaration);
    const constructorNode = getConstructorNode(classNodeWithoutConstr, ts);
    expect(constructorNode).to.equal(null);
  });
});

describe('getTypesFromClass()', function () {
  it('should retrieve the types present in the constructor and from event tags', function () {
    const types = getTypesFromClass(classNode, ts);
    expect(types).to.have.members([
      'Foo',
      'Bar',
      'TheInterface',
      'TheType',
      'TupleFoo',
      'TupleBar',
      'CustomEventFoo',
      'CustomEventBar',
      'CustomEventBaz',
    ]);
  });
});

describe('getTypesFromConstructor()', function () {
  it('should retrieve the types present in the constructor.', function () {
    const constructorNode = getConstructorNode(classNode, ts);
    const types = getTypesFromConstructor(constructorNode, ts);
    expect(types).to.have.members(['Foo', 'Bar', 'TheInterface', 'TheType', 'TupleFoo', 'TupleBar']);
  });

  it('should return an empty array when the constructor is empty.', function () {
    const classNodeWithEmptyConstr = getClassNodeFromSource(
      `export class CcTestComponent extends LitElement { constructor() {} }`,
    );
    const constructorNode = getConstructorNode(classNodeWithEmptyConstr, ts);
    const typesFromConstructor = getTypesFromConstructor(constructorNode, ts);
    // eslint-disable-next-line no-unused-expressions
    expect(typesFromConstructor).to.be.empty;
  });

  it('should retrieve the types present in the constructor and the private one if needed', function () {
    const constructorNode = getConstructorNode(classNode, ts);
    const types = getTypesFromConstructor(constructorNode, ts, true);
    expect(types).to.have.members([
      'Foo',
      'Bar',
      'TheInterface',
      'TheType',
      'TupleFoo',
      'TupleBar',
      'PrivateInterface',
    ]);
  });
});

describe('getTypesFromEventTags()', () => {
  it('should retrieve the types in event tags', () => {
    const types = getTypesFromEventTags(classNode, ts);
    expect(types).to.have.members(['CustomEventFoo', 'CustomEventBar', 'CustomEventBaz']);
  });

  it('should return an empty array when no jsDoc', () => {
    const classNode = getClassNodeFromSource(`export class CcTestComponent extends LitElement { constructor() {} }`);
    const types = getTypesFromEventTags(classNode, ts);
    // eslint-disable-next-line no-unused-expressions
    expect(types).to.be.empty;
  });

  it('should return an empty array when empty jsDoc', () => {
    const classNode = getClassNodeFromSource(
      `/***/\nexport class CcTestComponent extends LitElement { constructor() {} }`,
    );
    const types = getTypesFromEventTags(classNode, ts);
    // eslint-disable-next-line no-unused-expressions
    expect(types).to.be.empty;
  });
});

describe('findCustomType()', function () {
  function testCustomType(jsDocType, expectedType) {
    const source = `
       /** @type {${jsDocType}} - lorem ipsum.  */
       this.union = null;
    `;
    const node = ts.createSourceFile('foo', source, ts.ScriptTarget.ES2015, true).statements[0].jsDoc[0].tags[0]
      .typeExpression.type;
    const type = findCustomType(node, ts);
    expect(type).to.equal(expectedType);
  }

  it('should return `Type` for a `Type[]` type.', function () {
    testCustomType('Foo[]', 'Foo');
  });

  it('should return `Type` for a `Type[][]` type.', function () {
    testCustomType('Foo[][]', 'Foo');
  });

  it('should return `null` for a `primitive[][]` type.', function () {
    testCustomType('string[][]', null);
  });

  it('should return `null` for a `Array<Array<primitive>>` type.', function () {
    testCustomType('Array<Array<string>>', null);
  });

  it('should return `null` for a base `Array`.', function () {
    testCustomType('Array', null);
  });

  it('should return `null` for nested Arrays `Array<Array<Array>>` type.', function () {
    testCustomType('Array<Array<Array>>', null);
  });

  it('should return `Type` for a `Array<Type>` type.', function () {
    testCustomType('Array<Foo>', 'Foo');
  });

  it('should return the type deeply nested in Arrays `Array<Array<Array<Foo>>` type.', function () {
    testCustomType('Array<Array<Array<Foo>>', 'Foo');
  });

  it('should return `Type` for a non primitive type.', function () {
    testCustomType('Foo', 'Foo');
  });

  ['string', 'boolean', 'number'].forEach((type) => {
    it(`should return \`null\` for primitive type ${type}`, () => {
      testCustomType(type, null);
    });

    it(`should return \`null\` for array of primitive: Array<${type}>`, () => {
      testCustomType(`Array<${type}>`, null);
    });

    it(`should return \`null\` for array of primitive: ${type}[]`, () => {
      testCustomType(`${type}[]`, null);
    });
  });

  [
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
  ].forEach((type) => {
    it(`should return \`null\` for built-in type ${type}`, () => {
      testCustomType(type, null);
    });

    it(`should return \`null\` for array of built-in type: Array<${type}>`, () => {
      testCustomType(`Array<${type}>`, null);
    });

    it(`should return \`null\` for array of built-in type: ${type}[]`, () => {
      testCustomType(`${type}[]`, null);
    });
  });

  it('should ignore custom types with generics.', function () {
    testCustomType('Foo<Bar>', null);
  });

  it('should return the type used in Object value.', function () {
    testCustomType('{[key: string]: Foo}', 'Foo');
  });

  it('should return the type used in Object value inside array.', function () {
    testCustomType('{[key: string]: Foo}[]', 'Foo');
  });

  it('should return the type used in Object value inside Array.', function () {
    testCustomType('Array<{[key: string]: Foo}>', 'Foo');
  });
});

describe('findPath()', function () {
  const importsNode = classNode.jsDoc[0].tags;
  const importLength = importsNode.length;

  it('should retrieve the @typedef filePath from the first one in the test file.', function () {
    const filePath = findTypePath(importsNode[0], ROOT_DIR, MODULE_DIR);
    expect(filePath).to.equal(`${ROOT_DIR}/${MODULE_DIR}/cc-test-component.types.d.ts`);
  });

  it('should retrieve the common @typedef filePath located at the end of the test file.', function () {
    const filePath = findTypePath(importsNode[importLength - 1], ROOT_DIR, MODULE_DIR);
    expect(filePath).to.equal(`${ROOT_DIR}/cem/test/common.types.d.ts`);
  });

  it('should return null if the filePath is incorrect.', function () {
    const filePath = findTypePath(importsNode[importLength - 2], ROOT_DIR, MODULE_DIR);
    expect(filePath).to.equal(null);
  });
});

describe('findSubtypes()', function () {
  const importsNode = classNode.jsDoc[0].tags;
  const filePath = findTypePath(importsNode[0], ROOT_DIR, MODULE_DIR);
  const sourceCode = readFileSync(filePath).toString();
  const sourceAst = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.ES2015, true);

  it('should find the subtypes for a given type/interface', function () {
    expect(findSubtypes(ts, sourceAst, ['TheInterface', 'TheType'])).to.have.members([
      'SubInterface',
      'OtherInterface',
      'OtherInterfaceTwo',
      'SubType',
      'UnionFoo',
      'SubUnionFoo',
      'UnionBar',
      'SubUnionBar',
      'TheOnlyType',
      'SubOnlyType',
    ]);
  });

  it('should work with cycles', function () {
    expect(findSubtypes(ts, sourceAst, ['CycleTest'])).to.have.members(['SubCycleTest', 'MoreCycleTest']);
  });

  it('should work with tuple interfaces', function () {
    expect(findSubtypes(ts, sourceAst, ['TupleInterface'])).to.have.members([
      'TupleFoo',
      'TupleFooBar',
      'TupleBar',
      'TupleBaz',
    ]);
  });

  it('should work with unions', function () {
    expect(findSubtypes(ts, sourceAst, ['UnionInterface'])).to.have.members([
      'UnionFoo',
      'SubUnionFoo',
      'UnionBar',
      'SubUnionBar',
    ]);
  });

  it('should work with type', function () {
    expect(findSubtypes(ts, sourceAst, ['TheType'])).to.have.members([
      'SubInterface',
      'OtherInterface',
      'OtherInterfaceTwo',
    ]);
  });

  it("should return an empty array when there's no subtypes", function () {
    expect(findSubtypes(ts, sourceAst, ['NoChild'])).to.have.members([]);
  });

  it('should return an empty array when no types are provided', function () {
    expect(findSubtypes(ts, sourceAst, [])).to.have.members([]);
  });

  it("should return null when there is no node or TS isn't provided", function () {
    expect(findSubtypes(null, null, ['TheType'])).to.equal(null);
  });
});

describe('convertInterface()', function () {
  it('should return the needed interface in the type file for a given interface name.', function () {
    const importsNode = classNode.jsDoc[0].tags;
    const filePath = findTypePath(importsNode[0], ROOT_DIR, MODULE_DIR);
    const sourceCode = readFileSync(filePath).toString();
    const sourceAst = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.ES2015, true);
    const interfaceStr = convertInterface(ts, sourceAst, sourceCode, 'TheInterface', filePath);
    expect(interfaceStr).to.equal(
      '```ts\n\n' +
        'interface TheInterface {\n' +
        '  one: number;\n' +
        '  two: string;\n' +
        '  sub: SubInterface;\n' +
        '  subSpecialArray: Array<OtherInterface>;\n' +
        '  subArray: OtherInterfaceTwo[];\n' +
        '  subType: SubType;\n' +
        '  subUnion: UnionFoo | UnionBar;\n' +
        '  onlyType : TheOnlyType;\n' +
        '}\n' +
        '\n' +
        '```',
    );
  });
});

describe('findInterfacesFromExtends()', function () {
  it('should return an array with all the types (interfaces) from the extends found', function () {
    const file = 'cc-test-component.types.d.ts';
    const filePath = path.resolve(ROOT_DIR, MODULE_DIR, file);
    const sourceCode = readFileSync(filePath).toString();
    const sourceAst = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.ES2015, true);
    expect(findInterfacesFromExtends(ts, sourceAst)).to.have.deep.members([
      { interface: 'ToBeExtended', extends: 'ExtendedInterface', relatives: ['AnotherExtendsInt'] },
      { interface: 'toBeImpExtended', extends: 'ImpExtendInterface', relatives: [] },
      { interface: 'ExtendedInterface', extends: 'AnotherExtendsInt', relatives: [] },
    ]);
  });
});

describe('findPathAndTypesFromImports()', function () {
  it('should return an array with all the imports filePath', function () {
    const file = 'cc-test-component.types.js';
    const pathFile = path.resolve(ROOT_DIR, MODULE_DIR, file);
    const rootPath = path.resolve(ROOT_DIR, MODULE_DIR);

    expect(findPathAndTypesFromImports(ts, pathFile)).to.have.deep.members([
      {
        types: ['ToImport', 'ImpExtendInterface'],
        path: `${rootPath}/test-imports.types.d.ts`,
      },
      {
        types: ['ToSubImport', 'ToSubImportBar'],
        path: `${rootPath}/cem-test-import/cc-test-imports-sub.types.d.ts`,
      },
    ]);
  });
});
