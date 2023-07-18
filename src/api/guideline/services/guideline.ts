/**
 * guideline service
 */

import {factories} from '@strapi/strapi';

export default factories.createCoreService(
  'api::guideline.guideline',
  ({strapi}) => ({
    async find(...args) {
      const {name, pagination, categoryId} = args[0] as any;
      let filters: any = {};

      if (name) {
        filters = {
          pagination,
          where: {
            name: {
              $contains: name,
            },
          },
        };
      }

      if (categoryId != null) {
        filters = {
          ...filters,
          where: {
            ...filters.where,
            guideline_categories: categoryId,
          },
        };
      }

      filters = {
        ...filters,
        where: {
          ...filters.where,
          publishedAt: {
            $ne: null,
          },
        },
      };

      const [response, count] = await strapi.db
        .query('api::guideline.guideline')
        .findWithCount({
          ...filters,
          populate: ['document'],
        });

      return {
        results: response,
        pagination: {
          ...pagination,
          total: count,
        },
      };
    },
  }),
);
