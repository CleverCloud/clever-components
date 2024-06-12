import { Article } from '../cc-article-card/cc-article-card.types.js';

export type ArticleListState = ArticleListStateLoaded | ArticleListStateLoading | ArticleListStateError;

export interface ArticleListStateLoaded {
  type: 'loaded';
  articles: Article[];
}

export interface ArticleListStateLoading {
  type: 'loading';
}

export interface ArticleListStateError {
  type: 'error';
}

