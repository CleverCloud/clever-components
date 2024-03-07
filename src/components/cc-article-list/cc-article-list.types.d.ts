import {ArticleCardStateLoaded} from '../cc-article-card/cc-article-card.types.js';
export type ArticleListState = ArticleListStateLoading | ArticleListStateError | ArticleListStateLoaded;

interface ArticleListStateLoading {
  type: 'loading';
}

interface ArticleListStateError {
  type: 'error';
}

interface ArticleListStateLoaded {
  type: 'loaded';
  articles: ArticleCardStateLoaded[] ;
}
