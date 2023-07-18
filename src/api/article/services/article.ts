/**
 * article service.
 */

import {factories} from '@strapi/strapi';

const SLUG = 'api::article.article';

export default factories.createCoreService(SLUG, ({strapi}) => ({
  async find(...args) {
    const {articleIds, sort, sortOrder} = args[0] as any;
    let filters = {};
    if (articleIds) {
      filters = {
        id: articleIds,
      };
    }

    const response = await strapi.db.query(SLUG).findMany({
      where: {
        ...filters,
      },
      orderBy: {
        [sort]: sortOrder,
      },
    });

    return {results: response};
  },
}));
