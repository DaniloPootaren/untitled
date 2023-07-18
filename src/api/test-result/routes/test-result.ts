/**
 * test-result router.
 */

import {factories} from '@strapi/strapi';
import {restrictUnwantedUser} from '../../../utils/user-permissions';

export default factories.createCoreRouter('api::test-result.test-result', {
  prefix: '',
  only: ['find', 'findOne', 'create', 'update'],
  except: [],
  config: {
    find: {},
    findOne: {},
    create: {
      policies: [
        ctx =>
          restrictUnwantedUser(ctx, 'body', 'data', 'users_permissions_user'),
      ],
    },
    update: {
      policies: [
        ctx =>
          restrictUnwantedUser(ctx, 'body', 'data', 'users_permissions_user'),
      ],
    },
    delete: {},
  },
});
