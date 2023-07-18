import {trainingReportQuery} from '../helpers';
import {TestResult, UserTraining} from '../../../models/api-model';
import {
  convertToExcelSheet,
  getMimeType,
  getTrainingReportFilename,
} from '../helpers/csvHelper';
import {groupByTraining, transformTrainingData} from '../helpers/exportCSV';
import {FileFormat} from '../../../admin/extensions/model';
import {utils} from 'xlsx-js-style';

export default () => ({
  // Api getTrainingReport
  getTrainingReport: async ctx => {
    const {query} = ctx.request;
    const type: FileFormat = query.type;

    const data: UserTraining[] = await (
      strapi.service('api::training-report.training-report') as any
    ).getUserTrainings(ctx);

    let buffer = null;
    const workbook = utils.book_new();
    if (data.length) {
      const transformedData = transformTrainingData(data);
      const groupedByTrainingData = groupByTraining(transformedData);

      buffer = convertToExcelSheet(groupedByTrainingData, type, workbook);
    } else {
      return ctx.badRequest('No records found!', {
        error: 'NO_RECORD_FOUND',
      });
    }

    // Set the headers for the file download
    ctx.attachment(
      getTrainingReportFilename(query.start_date_from, query.end_date_to, type),
    );
    ctx.type = getMimeType(type);
    ctx.set(
      'Access-Control-Expose-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Content-Disposition',
    );

    // Send the CSV data as the response body
    ctx.body = buffer;
  },

  // Api getUserTrainings
  getUserTrainings: async (ctx): Promise<UserTraining[]> => {
    // query params object
    const {query} = ctx.request;

    const filtersObj: any = {};

    if (query.title) {
      filtersObj.title = {
        $contains: query.title,
      };
    }

    if (query.start_date_from) {
      filtersObj.start_date = {
        $gte: query.start_date_from,
      };
    }

    if (query.start_date_to) {
      filtersObj.start_date = {
        ...filtersObj.start_date,
        $lte: query.start_date_to,
      };
    }

    if (query.end_date_from) {
      filtersObj.end_date = {
        $gte: query.end_date_from,
      };
    }

    if (query.end_date_to) {
      filtersObj.end_date = {
        ...filtersObj.end_date,
        $lte: query.end_date_to,
      };
    }

    const filters = trainingReportQuery(filtersObj);

    const data: TestResult[] = await strapi.db
      .query('api::test-result.test-result')
      .findMany(filters);

    return data.map(testResult => {
      const {users_permissions_user} = testResult;
      const {id, username, profile} = users_permissions_user;

      return {
        id,
        username,
        profile,
        test_results: [testResult],
      };
    });
  },
  async searchTrainingTitle(ctx) {
    const {name} = ctx.request.query;

    let filters: any = {};

    if (name != null) {
      filters.title = {
        $contains: name,
      };
    }

    return await strapi.db.query('api::training.training').findMany({
      where: {
        ...filters,
      },
      limit: 20,
    });
  },
});
