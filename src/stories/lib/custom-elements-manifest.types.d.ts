export interface CustomElementDeclaration {
  tagName?: string;
  events?: Array<{
    name: string;
  }>;
}

export interface CustomElementsManifest {
  modules: Array<{
    declarations: CustomElementDeclaration[];
  }>;
}
