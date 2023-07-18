/**
 * training-category service.
 */

import {factories} from '@strapi/strapi';
import {FindParams} from '@strapi/database';

const SLUG = 'api::training-category.training-category';

export default factories.createCoreService(
  'api::training-category.training-category',
  ({strapi}) => ({
    async find(...args) {
      const {id} = args[0] as any;

      let filters: FindParams<any> = {
        where: {},
      };

      if (id != null) {
        filters.where.id = id;
      }

      const trainingDetailsPopulate = [
        'image',
        'description',
        'youTube',
        'files',
        'contact_info',
      ].map(detail => 'training_details' + '.' + detail);

      const mcqPopulate = ['multiple_choice', 'question'].map(
        item => 'mcq' + '.' + item,
      );

      const preTestPopulate = [
        'title',
        'image',
        'passing_marks',
        'display',
        ...mcqPopulate,
        'pretest_summary',
      ].map(item => 'pre_test' + '.' + item);

      const postTestPopulate = ['passing_marks', 'display', ...mcqPopulate].map(
        item => 'post_test' + '.' + item,
      );

      const appendTrainings = item => 'trainings' + '.' + item;

      const res = await strapi.db.query(SLUG).findMany({
        where: filters.where,
        populate: [
          'trainings',
          'trainings.image',
          ...preTestPopulate.map(appendTrainings),
          ...postTestPopulate.map(appendTrainings),
          ...trainingDetailsPopulate.map(appendTrainings),
        ],
      });

      return {results: res};
    },
  }),
);
