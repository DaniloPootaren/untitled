import {restrictUnwantedUser} from '../../../utils/user-permissions';

export default {
  routes: [
    {
      method: 'GET',
      path: '/getNewChecklists',
      handler: 'custom-checklist.getNewChecklists',
      config: {},
    },
    {
      method: 'GET',
      path: '/getChecklistResults',
      handler: 'custom-checklist.getChecklistResults',
      config: {},
    },
    {
      method: 'POST',
      path: '/createChecklist',
      handler: 'custom-checklist.createChecklist',
      config: {},
    },
    {
      method: 'PUT',
      path: '/updateChecklist',
      handler: 'custom-checklist.updateChecklist',
      config: {
        policies: [
          ctx =>
            restrictUnwantedUser(ctx, 'body', 'users_permissions_user', 'id'),
        ],
      },
    },
    {
      method: 'DELETE',
      path: '/deleteChecklist/:id',
      handler: 'custom-checklist.deleteChecklist',
      config: {},
    },
    {
      method: 'GET',
      path: '/generateChecklistReport',
      handler: 'custom-checklist.generateChecklistReport',
      config: {
        auth: {
          scope: ['find'],
        },
      },
    },
  ],
};
