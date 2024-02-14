import { ArticleEntity } from '../article.entity';

export type ArticleType = Omit<ArticleEntity, 'updatedTimestamp'>;

export interface ArticleResponseInterface {
  article: ArticleType;
}
