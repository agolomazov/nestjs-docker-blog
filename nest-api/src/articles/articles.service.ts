import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleEntity } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleResponseInterface } from './types/article.response.interface';
import slugify from 'slugify';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async create(
    user: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);
    article.author = user;
    article.slug = this.getSlug(createArticleDto.title);

    if (!article.tagList) {
      article.tagList = [];
    }

    return await this.articleRepository.save(article);
  }

  async findBySlug(slug: string) {
    return await this.articleRepository.findOne({
      where: {
        slug,
      },
      select: {
        title: true,
        description: true,
        body: true,
        tagList: true,
      },
    });
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return {
      article,
    };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, {
        lower: true,
      }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
