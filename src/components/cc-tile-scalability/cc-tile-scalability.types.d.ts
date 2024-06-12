import { Scalability } from "../common.types.js";

export type TileScalabilityState = TileScalabilityStateLoaded | TileScalabilityStateLoading | TileScalabilityStateError;

export interface TileScalabilityStateLoaded extends Scalability {
    type: 'loaded';
}

export interface TileScalabilityStateLoading  {
    type: 'loading';
}

export interface TileScalabilityStateError {
    type: 'error';
}
