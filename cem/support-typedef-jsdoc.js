import { readFileSync } from 'fs';
import ts from 'typescript';
import {
  convertInterface,
  findInterfacesFromExtends,
  findPathAndTypesFromImports,
  findSubtypes,
} from './support-typedef-jsdoc-utils.js';

const ROOT_DIR = process.cwd();

export default function supportTypedefJsdoc() {
  // Map that contains a `type-path` as a key and has its markdown interface as a value.
  const typesStore = new Map();
  // Map that contains for a type file path the corresponding AST and code as a string.
  // e.g: {'projectfolder/src/component/x.d.ts' => {code: thesourcecode, ast: theast}}
  const fileCache = new Map();
  // Foreach component it retrieves the correct file component and the types associated
  // e.g: {'projectfolder/src/component/x.d.ts' => [foo, bar],  'projectfolder/src/component/y.d.ts' => [foobar, baz]}
  const moduleTypeCache = new Map();

  function convertImports(ts, imports) {
    const markdownInterfaces = [];

    // type-cc-x.d.ts => [Foo, Bar...]
    imports.forEach((typesSet, filename) => {
      let sourceCode;
      let sourceAst;

      const inMemoryType = fileCache.get(filename);
      if (inMemoryType == null) {
        try {
          sourceCode = readFileSync(filename).toString();
        } catch (e) {
          console.error(e);
          return;
        }
        sourceAst = ts.createSourceFile(filename, sourceCode, ts.ScriptTarget.ES2015, true);
        fileCache.set(filename, { code: sourceCode, ast: sourceAst });
      } else {
        sourceCode = inMemoryType.code;
        sourceAst = inMemoryType.ast;
      }

      const typesFromSet = Array.from(typesSet);
      // Find the imports and their associated types in the parent file
      const interfaceImports = findPathAndTypesFromImports(ts, filename);

      interfaceImports.forEach((interfaceImport) => {
        let importSourceCode;
        try {
          importSourceCode = readFileSync(interfaceImport.path).toString();
        } catch (e) {
          console.error(e);
          return;
        }
        // We append the source code of the parent type file with the source code of the imports
        sourceCode += importSourceCode;
      });
      // Then we create an AST with this big source code with all the interfaces
      sourceAst = ts.createSourceFile('ast', sourceCode, ts.ScriptTarget.ES2015, true);

      // Find the subtypes for base types.
      const subtypes = findSubtypes(ts, sourceAst, typesFromSet);
      typesFromSet.push(...subtypes);

      const foundExtends = findInterfacesFromExtends(ts, sourceAst);
      foundExtends.forEach((fromExtend) => {
        // We need to take the interfaces that are extended from an interface we need and their relatives.
        // Imagine we need Foo, and it extends Bar, we will add Bar to our types needed.
        // But if Bar itself extends Baz we will also add Baz as its related to Bar that we need.
        if (typesFromSet.includes(fromExtend.interface)) {
          typesFromSet.push(fromExtend.extends, ...fromExtend.relatives);
        }
      });

      // Find the subtypes for the extended interfaces
      const subTypesFromExt = findSubtypes(ts, sourceAst, typesFromSet);
      typesFromSet.push(...subTypesFromExt);

      const filteredTypes = Array.from(new Set(typesFromSet));

      filteredTypes.forEach((type) => {
        if (typesStore.has(`${type}-${filename}`)) {
          markdownInterfaces.push(typesStore.get(`${type}-${filename}`));
        } else {
          const typeDisplay = convertInterface(ts, sourceAst, sourceCode, type, filename);
          if (typeDisplay != null) {
            markdownInterfaces.push(typeDisplay);
            typesStore?.set(`${type}-${filename}`, typeDisplay);
          }
        }
      });
    });

    return markdownInterfaces.join('\n');
  }

  return {
    name: 'support-typedef-jsdoc',
    moduleLinkPhase({ moduleDoc }) {
      const classDeclaration = moduleDoc.declarations.find((declaration) => declaration.kind === 'class');
      const properties = classDeclaration.members.filter((member) => member.kind === 'field');
      // console.log(moduleDoc);
      // console.log(properties);
      const tsProgram = ts.createProgram([moduleDoc.path], {
        target: ts.ScriptTarget.ES2020,
        checkJs: true,
        allowJs: true,
        module: ts.ModuleKind.NodeNext,
      });
      const fileAst = tsProgram.getSourceFile(moduleDoc.path);
      const classes = fileAst.statements.filter(ts.isClassDeclaration);
      const checker = tsProgram.getTypeChecker();
      const classSymbol = checker.getSymbolAtLocation(classes[0].name);

      const rootSymbols = checker.getRootSymbols(classSymbol);
      const classType = checker.getDeclaredTypeOfSymbol(classSymbol);

      // Get only declared properties (not inherited, not methods)
      const declaredProperties = [];
      if (classSymbol.members) {
        classSymbol.members.forEach((member, key) => {
          if (key !== '__constructor' && member.flags & ts.SymbolFlags.Property) {
            const memberType = checker.getTypeOfSymbolAtLocation(member, member.valueDeclaration);
            const jsdoc = member
              .getDocumentationComment(checker)
              .map((part) => part.text)
              .join('');
            declaredProperties.push({
              name: key,
              type: checker.typeToString(memberType, undefined, ts.TypeFormatFlags.InTypeAlias),
              // Doesn't work, jsdoc isn't picked up
              jsdoc: jsdoc || undefined,
            });
          }
        });
      }

      console.log('Declared properties only:', declaredProperties);
    },
  };
}
