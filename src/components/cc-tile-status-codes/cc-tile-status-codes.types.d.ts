export type TileStatusCodesState = TileStatusCodesStateLoading | TileStatusCodesStateLoaded | TileStatusCodesStateError;

interface TileStatusCodesStateLoading {
  type: 'loading';
}

interface TileStatusCodesStateLoaded {
  type: 'loaded';
  statusCodes: StatusCodesData;
}

interface TileStatusCodesStateError {
  type: 'error';
}

interface StatusCodesData {
  // Status code number as property.
  // Number of requests as value.
  [index: number]: number;
}
