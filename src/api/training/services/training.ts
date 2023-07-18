/**
 * training service.
 */

import {factories} from '@strapi/strapi';

const SLUG = 'api::training.training';
export default factories.createCoreService(SLUG, ({strapi}) => ({
  async find(...args) {
    const {name, category} = args[0] as any;

    let filters: any = {
      start_date: {
        $lte: new Date().toISOString(),
      },
      end_date: {
        $gte: new Date().toISOString(),
      },
      publishedAt: {
        $ne: null,
      },
    };

    if (name != null) {
      filters = {
        ...filters,
        title: {
          $contains: name,
        },
      };
    }

    if (category != null && category > 0) {
      filters.training_categories = [category];
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

    const response = await strapi.db.query(SLUG).findMany({
      populate: [
        'image',
        ...preTestPopulate,
        ...postTestPopulate,
        ...trainingDetailsPopulate,
      ],
      where: {
        ...filters,
      },
    });

    return {results: response};
  },
}));
