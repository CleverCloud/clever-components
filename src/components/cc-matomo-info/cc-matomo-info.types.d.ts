export type MatomoInfoState = MatomoInfoStateLoaded | MatomoInfoStateLoading | MatomoInfoStateError;

interface MatomoInfoStateLoaded {
    type: 'loaded';
    matomoUrl: string;
    mysqlUrl: string;
    phpUrl: string;
    redisUrl: string;
}

interface MatomoInfoStateLoading {
    type: 'loading';
}

interface MatomoInfoStateError {
    type: 'error';
}
