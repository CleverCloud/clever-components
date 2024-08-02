export type Language = string;

export type TranslationsMap = { [key: Language]: Translations };

export type Translations = { [key: string]: string | TranslateFunction };

export type TranslateFunction = (args: Object) => string | DocumentFragment;
