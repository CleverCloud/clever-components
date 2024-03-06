export type DocCardState = DocCardStateLoaded | DocCardStateLoading;

export interface DocCardStateLoaded {
    type: 'loaded';
    description: string;
    heading: string;
    icons: string[];
    link: string;
}

export interface DocCardStateLoading {
    type: 'loading';
}
