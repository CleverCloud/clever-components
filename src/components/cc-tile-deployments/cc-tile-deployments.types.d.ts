export type TileDeploymentsState = TileDeploymentsStateLoading | TileDeploymentsStateLoaded | TileDeploymentsStateError;

interface TileDeploymentsStateLoading {
  type: 'loading';
}

interface TileDeploymentsStateLoaded {
  type: 'loaded';
  deploymentsInfo: Array<DeploymentTileInfo>;
}

interface TileDeploymentsStateError {
  type: 'error';
}

interface DeploymentTileInfo {
  state: string;
  action: string;
  date: string;
  logsUrl: string;
}
