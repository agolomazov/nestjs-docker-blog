import { ArticleType } from './article.response.interface';

export interface ArticlesResponseInterface {
  articles: ArticleType[];
  articlesCount: number;
}
