import {Strapi} from '@strapi/strapi';

const SLUG = 'api::custom-article.custom-article';

export default {
  viewArticle: async ctx => {
    try {
      return await ((strapi as Strapi).service(SLUG) as any).viewArticle(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
  findArticleById: async ctx => {
    try {
      return await ((strapi as Strapi).service(SLUG) as any).findArticleById(
        ctx,
      );
    } catch (err) {
      throw new Error(err);
    }
  },
  findArticles: async ctx => {
    try {
      return await ((strapi as Strapi).service(SLUG) as any).findArticles(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
};
