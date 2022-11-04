interface TcpRedirection {
  namespace: string;
  isPrivate: boolean;
  sourcePort?: number;
}

export type TcpRedirectionState = TcpRedirectionStateLoading | TcpRedirectionStateLoaded | TcpRedirectionStateWaiting;

interface TcpRedirectionStateLoading {
  state: "loading";
}

interface TcpRedirectionStateLoaded extends TcpRedirection {
  state: "loaded";
}

interface TcpRedirectionStateWaiting extends TcpRedirection {
  state: "waiting";
}

interface CreateTcpRedirection {
  namespace: string;
}

interface DeleteTcpRedirection {
  namespace: string;
  sourcePort: number;
}
