import { TcpRedirectionState } from "../cc-tcp-redirection/cc-tcp-redirection.types";

export type TcpRedirectionFormContextType = "user" | "admin";

export type TcpRedirectionFormState =
  TcpRedirectionFormStateLoading
  | TcpRedirectionFormStateLoaded
  | TcpRedirectionFormStateError;

interface TcpRedirectionFormStateLoading {
  state: "loading";
}

interface TcpRedirectionFormStateLoaded {
  state: "loaded";
  value: TcpRedirectionState[]
}

interface TcpRedirectionFormStateError {
  state: "error";
}

