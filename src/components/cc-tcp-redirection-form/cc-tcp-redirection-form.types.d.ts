import {
  TcpRedirectionStateLoaded,
  TcpRedirectionStateWaiting
} from "../cc-tcp-redirection/cc-tcp-redirection.types.js";

export type TcpRedirectionFormContextType = "user" | "admin";

export type TcpRedirectionFormState =
  TcpRedirectionFormStateLoading
  | TcpRedirectionFormStateLoaded
  | TcpRedirectionFormStateError;

export interface TcpRedirectionFormStateLoading {
  type: "loading";
}

export interface TcpRedirectionFormStateLoaded {
  type: "loaded";
  redirections: Array<TcpRedirectionStateLoaded | TcpRedirectionStateWaiting>;
}

export interface TcpRedirectionFormStateError {
  type: "error";
}

