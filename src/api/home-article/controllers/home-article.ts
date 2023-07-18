const SLUG = 'api::home-article.home-article';

export default {
  getFeaturedArticles: async (ctx, next) => {
    try {
      return await (strapi.service(SLUG) as any).getFeaturedArticles(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
  getLatestNews: async (ctx, next) => {
    try {
      return await (strapi.service(SLUG) as any).getLatestNews(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
  getHomeCategories: async ctx => {
    try {
      return await (strapi.service(SLUG) as any).getHomeCategories(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
  getArticles: async ctx => {
    try {
      return await (strapi.service(SLUG) as any).getArticles(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
  getAllInterests: async ctx => {
    try {
      return await (strapi.service(SLUG) as any).getAllInterests(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
};
