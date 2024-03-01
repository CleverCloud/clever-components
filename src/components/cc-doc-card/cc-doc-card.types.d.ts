export type DocCardState = DocCardStateLoaded | DocCardStateLoading;

export interface DocCardStateLoaded extends DocCard {
    type: 'loaded';
}

export interface DocCardStateLoading {
    type: 'loading';
}

export interface DocCard {
    description: string;
    heading: string;
    icons: string[];
    link: string;
}
