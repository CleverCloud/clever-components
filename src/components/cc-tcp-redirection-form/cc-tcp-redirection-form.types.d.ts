export interface RedirectionNamespace {
  namespace: string,
}

export interface Redirection {
  namespace: string,
  sourcePort: number,
}

export type ContextRedirectionType = "user" | "admin";
