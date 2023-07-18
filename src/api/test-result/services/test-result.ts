/**
 * test-result service.
 */

import {factories} from '@strapi/strapi';
import {TestResult, TrainingStatus, User} from '../../../models/api-model';
import {transformTestResults} from '../helpers';
const SLUG = 'api::test-result.test-result';

export default factories.createCoreService(SLUG, ({strapi}) => ({
  async find(...args) {
    const ctx = strapi.requestContext.get();
    const user: User = ctx.state.user;

    const {status, name} = args[0] as any;
    let filters: any = {
      where: {
        users_permissions_user: user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    };

    if (status != null) {
      filters.where.status = status;
    }

    if (name != null) {
      filters.where.training = {
        title: {
          $contains: name,
        },
      };
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

    const populate = [
      'pre_test_result',
      'post_test_result',
      ...[
        'image',
        'start_date',
        'end_date',
        ...postTestPopulate,
        ...preTestPopulate,
        ...trainingDetailsPopulate,
      ].map(data => 'training' + '.' + data),
    ];

    let response: TestResult[] = await strapi.db.query(SLUG).findMany({
      ...filters,
      populate,
    });

    if (status === TrainingStatus.completed) {
      response = transformTestResults(response);
    }

    return {results: response};
  },
}));
