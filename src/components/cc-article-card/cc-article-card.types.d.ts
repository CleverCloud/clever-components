export type ArticleCardState = ArticleCardStateLoaded | ArticleCardStateLoading;

interface ArticleCardStateLoaded {
    type: 'loaded';
    banner: string;
    date: string;
    description: string;
    link: string;
    title: string;
}

interface ArticleCardStateLoading {
    type: 'loading';
}

export interface SkeletonArticle {
    date: string;
    description: string;
    banner: null;
    title: string;
}
