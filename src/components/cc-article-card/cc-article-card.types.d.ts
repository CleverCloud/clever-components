export type ArticleCardState = ArticleCardStateLoaded | ArticleCardStateLoading;

export interface ArticleCardStateLoaded {
    type: 'loaded';
    banner: string;
    date: string;
    description: string;
    link: string;
    title: string;
}

export interface ArticleCardStateLoading {
    type: 'loading';
}

export interface SkeletonArticle {
    banner: null;
    date: string;
    description: string;
    link: null;
    title: string;
}
