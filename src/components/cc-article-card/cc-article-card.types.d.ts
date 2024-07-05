export type ArticleCardState = ArticleCardStateLoaded | ArticleCardStateLoading;

export interface ArticleCardStateLoaded extends ArticleCard {
  type: 'loaded';
}

export interface ArticleCardStateLoading {
  type: 'loading';
}

export interface ArticleCard {
  banner: string;
  date: string;
  description: string;
  link: string;
  title: string;
}
