/**
 * department service
 */

const SLUG = 'api::department.department';

import {factories} from '@strapi/strapi';

export default factories.createCoreService(SLUG, ({strapi}) => ({
  async find() {
    const response = await strapi.db.query(SLUG).findMany({});

    return {results: response};
  },
}));
