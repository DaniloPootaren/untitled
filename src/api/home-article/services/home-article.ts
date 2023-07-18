import {Strapi} from '@strapi/strapi';
import {HomeMainCategory} from '../../../models/api-model';
import {transformHomeCategoryApi} from '../helpers';

const articleFields = [
  'image',
  'files',
  'content',
  'youtube',
  'contact_info',
  'article_sub_categories',
];
const ARTICLE_SLUG = 'api::article.article';
const SUB_CATEGORY_SLUG = 'api::article-sub-category.article-sub-category';

export default () => {
  return {
    getFeaturedArticles: async ctx => {
      const {body} = ctx.request;
      const hasInterest = !!body.interests?.length;
      const interestFilter = hasInterest
        ? {
            article_sub_categories: body.interests,
          }
        : {};

      const response = await (strapi as Strapi).db
        .query(ARTICLE_SLUG)
        .findMany({
          where: {
            featured: true,
            publishedAt: {
              $ne: null,
            },
            ...interestFilter,
          },
          populate: [...articleFields],
          limit: 5,
          orderBy: {
            publishedAt: 'DESC',
          },
        });

      return response;
    },
    getLatestNews: async ctx => {
      const {body} = ctx.request;
      const hasInterest = !!body.interests?.length;
      const interestFilter = hasInterest
        ? {
            article_sub_categories: body.interests,
          }
        : {};
      const response = await (strapi as Strapi).db
        .query(ARTICLE_SLUG)
        .findMany({
          populate: [...articleFields],
          limit: 5,
          where: {
            publishedAt: {
              $ne: null,
            },
            ...interestFilter,
          },
          orderBy: {
            publishedAt: 'DESC',
          },
        });

      return response;
    },
    getHomeCategories: async ctx => {
      const {query} = ctx.request;
      const hasInterest = !!query.interests?.length;
      const interestFilter = hasInterest
        ? {
            article_sub_categories: query.interests,
          }
        : {};
      const response: HomeMainCategory[] = await (strapi as Strapi).db
        .query('api::article-main-category.article-main-category')
        .findMany({
          populate: articleFields.map(
            field => 'article_sub_categories.articles' + '.' + field,
          ),
          limit: query.limit,
          where: {
            ...interestFilter,
          },
        });

      return transformHomeCategoryApi(response);
    },

    getArticles: async ctx => {
      const {
        articleIds,
        sort = 'createdAt',
        sortOrder = 'desc',
        subCategoryIds,
        title,
      } = ctx.request.query;
      let filters = {};
      if (articleIds) {
        filters = {
          id: articleIds,
        };
      }

      if (subCategoryIds) {
        filters = {
          ...filters,
          article_sub_categories: subCategoryIds,
        };
      }

      if (title) {
        filters = {
          ...filters,
          title: {
            $contains: title,
          },
        };
      }

      const response = await strapi.db.query(ARTICLE_SLUG).findMany({
        where: {
          ...filters,
          publishedAt: {
            $ne: null,
          },
        },
        orderBy: {
          [sort]: sortOrder,
        },
        populate: [...articleFields],
      });

      return response;
    },
    getAllInterests: async ctx => {
      const {sortBy = 'rank', sortOrder = 'asc'} = ctx.request.query;
      const articlesPopulate = articleFields.map(
        item => 'articles' + '.' + item,
      );
      const response = await strapi.db.query(SUB_CATEGORY_SLUG).findMany({
        populate: [...articlesPopulate],
        orderBy: {
          [sortBy]: sortOrder,
        },
      });

      return response;
    },
  };
};
