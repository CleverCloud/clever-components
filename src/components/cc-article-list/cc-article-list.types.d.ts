export type ArticleListState = ArticleListStateLoading | ArticleListStateError | ArticleListStateLoaded;

interface ArticleListStateLoading {
  type: 'loading';
}

interface ArticleListStateError {
  type: 'error';
}

interface ArticleListStateLoaded {
  type: 'loaded';
  articles: Array<Article>;
}

interface Article {
  banner: string;
  title: string;
  link: string;
  description: string;
  date: string;
}
