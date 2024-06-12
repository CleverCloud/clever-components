export type ArticleCardState = ArticleCardStateLoaded | ArticleCardStateLoading;

export interface ArticleCardStateLoaded extends Article {
    type: 'loaded';
}

export interface ArticleCardStateLoading {
    type: 'loading';
}

export interface Article {
    banner: string;
    date: string;
    description: string;
    link: string;
    title: string;
}
