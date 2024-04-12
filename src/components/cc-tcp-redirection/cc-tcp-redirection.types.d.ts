export interface TcpRedirection {
  namespace: string;
  isPrivate: boolean;
  sourcePort?: number | null;
}

export type TcpRedirectionState = TcpRedirectionStateLoading | TcpRedirectionStateLoaded | TcpRedirectionStateWaiting;

export interface TcpRedirectionStateLoading {
  type: "loading";
}

export interface TcpRedirectionStateLoaded extends TcpRedirection {
  type: "loaded";
}

export interface TcpRedirectionStateWaiting extends TcpRedirection {
  type: "waiting";
}

export interface CreateTcpRedirection {
  namespace: string;
}

export interface DeleteTcpRedirection {
  namespace: string;
  sourcePort: number;
}
