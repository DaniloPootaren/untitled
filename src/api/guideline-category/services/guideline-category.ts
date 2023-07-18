/**
 * guideline-category service
 */

import {factories} from '@strapi/strapi';

export default factories.createCoreService(
  'api::guideline-category.guideline-category',
  ({strapi}) => ({
    async find() {
      const response = await strapi.db
        .query('api::guideline-category.guideline-category')
        .findMany({});

      return {results: response};
    },
  }),
);
