import {FindParams} from '@strapi/database';

export const trainingReportQuery = (
  filtersObj: Record<string, any>,
  additionalQuery: Record<string, any> = {},
): FindParams<any> => {
  return {
    where: {
      ...additionalQuery,
      training: {
        ...filtersObj,
      },
      $or: [
        {
          post_test_result: {
            id: {
              $notNull: true,
            },
          },
        },
        {
          pre_test_result: {
            id: {
              $notNull: true,
            },
          },
        },
      ],
    },
    populate: [
      'users_permissions_user',
      'users_permissions_user.profile',
      'training.pre_test.passing_marks',
      'training.post_test.passing_marks',
      'pre_test_result',
      'post_test_result',
    ],
  };
};
