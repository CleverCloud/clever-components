export type MatomoInfoState = MatomoInfoStateLoaded | MatomoInfoStateLoading | MatomoInfoStateError;

export interface MatomoInfoStateLoaded {
    type: 'loaded';
    matomoUrl: string;
    mysqlUrl: string;
    phpUrl: string;
    redisUrl: string;
}

export interface MatomoInfoStateLoading {
    type: 'loading';
}

export interface MatomoInfoStateError {
    type: 'error';
}
