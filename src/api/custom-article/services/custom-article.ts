import {findArticle, updateArticle} from '../helpers';
import {ArticleApiEnum} from '../../../models/api-model';
import {Strapi} from '@strapi/strapi';

const SLUG = 'api::article.article';

export default () => ({
  viewArticle: async ctx => {
    const {params} = ctx.request;
    const {id} = params;
    const article = await findArticle(id);

    if (article) {
      return await updateArticle(id, {...article, ...{views: ++article.views}});
    }
    return null;
  },
  findArticleById: async ctx => {
    const {params} = ctx.request;
    const {id} = params;
    const article = await findArticle(id);

    if (article) {
      return article;
    }
    return null;
  },
  findArticles: async ctx => {
    const {
      articleType,
      interests,
      offset,
      title,
    }: {
      articleType: ArticleApiEnum;
      interests: string[];
      offset: number;
      title: string;
    } = ctx.query;

    const limit = 100;

    const titleSearch = title
      ? {
          title: {
            $contains: title,
          },
        }
      : {};

    const interestsSearch = interests?.length
      ? {
          article_sub_categories: interests,
        }
      : {};

    if (articleType === ArticleApiEnum.MO_NEWS) {
      const articles = await (strapi as Strapi).db.query(SLUG).findMany({
        where: {
          ...interestsSearch,
          ...titleSearch,
        },
        populate: ['image'],
        offset,
        limit,
      });
      return articles;
    }

    if (articleType === ArticleApiEnum.LATEST_NEWS) {
      return await (strapi as Strapi).db.query(SLUG).findMany({
        populate: ['image'],
        where: {
          ...titleSearch,
          ...interestsSearch,
        },
        offset,
        limit,
        orderBy: {
          publishedAt: 'desc',
        },
      });
    }

    if (articleType === ArticleApiEnum.MOST_POPULAR) {
      return await (strapi as Strapi).db.query(SLUG).findMany({
        populate: ['image'],
        offset,
        limit,
        where: {
          ...titleSearch,
          ...interestsSearch,
        },
        orderBy: {
          views: 'desc',
        },
      });
    }
  },
});
