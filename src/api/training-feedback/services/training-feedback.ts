/**
 * training-feedback service.
 */

import {factories} from '@strapi/strapi';
import {User} from '../../../models/api-model';

const SLUG = 'api::training-feedback.training-feedback';

export default factories.createCoreService(SLUG, ({strapi}) => ({
  async find(...args) {
    const ctx = strapi.requestContext.get();
    const user: User = ctx.state.user;
    const {sortBy, sortOrder, training} = args[0] as any;

    let filters: any = {
      where: {
        users_permissions_user: user.id,
      },
    };

    if (sortBy != null) {
      filters.orderBy = {
        [sortBy]: sortOrder ?? 'asc',
      };
    }

    if (training != null) {
      filters.where.training = training;
    }

    const response = await strapi.db.query(SLUG).findMany({
      ...filters,
    });

    return {results: response};
  },
}));
