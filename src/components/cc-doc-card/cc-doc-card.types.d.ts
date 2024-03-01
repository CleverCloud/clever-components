export type DocCardState = DocCardStateLoaded | DocCardStateLoading;

interface DocCardStateLoaded {
    type: 'loaded';
    description: string;
    heading: string;
    icons: string[];
    link: string;
}

interface DocCardStateLoading {
    type: 'loading';
}
