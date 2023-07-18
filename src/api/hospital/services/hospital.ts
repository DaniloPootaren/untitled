/**
 * hospital service
 */

import {factories} from '@strapi/strapi';

export default factories.createCoreService(
  'api::hospital.hospital',
  ({strapi}) => ({
    async find(...args) {
      const {name} = args[0] as any;
      let filters = {};
      if (name) {
        filters = {
          name: {
            $contains: name,
          },
        };
      }
      const response = await strapi.db
        .query('api::hospital.hospital')
        .findMany({
          where: {
            ...filters,
          },
        });

      return {results: response};
    },
  }),
);
