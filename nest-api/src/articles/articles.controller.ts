import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { BackendValidationPipe } from 'src/shared/pipes/backend.validation.pipe';
import { User } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseInterface } from './types/article.response.interface';
import { ArticlesResponseInterface } from './types/articles.response.interface';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articlesService.findAll(currentUserId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articlesService.getFeed(currentUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @User() user: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articlesService.create(user, createArticleDto);
    return this.articlesService.buildArticleResponse(article);
  }

  @Get(':slug')
  async getBySlug(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articlesService.findBySlug(slug);
    return this.articlesService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async removeArticle(
    @User('id') currentUser: number,
    @Param('slug') slug: string,
  ) {
    return await this.articlesService.deleteArticle(slug, currentUser);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async updateArticle(
    @User('id') currentUser: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articlesService.updateArticle(
      slug,
      currentUser,
      updateArticleDto,
    );
    return this.articlesService.buildArticleResponse(article);
  }

  @Post(':slug/favorites')
  @UseGuards(AuthGuard)
  async addArticlesToFavorite(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articlesService.addArticleToFavorites(
      slug,
      currentUserId,
    );
    return this.articlesService.buildArticleResponse(article);
  }

  @Delete(':slug/favorites')
  @UseGuards(AuthGuard)
  async deleteArticlesFromFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articlesService.deleteArticleFromFavorites(
      slug,
      currentUserId,
    );
    return this.articlesService.buildArticleResponse(article);
  }
}
