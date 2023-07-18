import {FindParams} from '@strapi/database';
import {
  Checklist,
  ChecklistResult,
  ChecklistResultApiModel,
  User,
} from '../../../models/api-model';
import {
  generateChecklistReport,
  getChecklistById,
  getChecklistResults,
  getReportFilters,
  RESULT_FIELDS,
  sendChecklistReport,
  transformChecklistResults,
  transformGetChecklistResultsApi,
  validateChecklistResult,
  validateDeleteChecklist,
} from '../helpers';
import {FileFormat} from '../../../admin/extensions/model';
import {CHECKLIST_SLUG, RESULT_SLUG} from '../../../utils/slugs';

export default () => ({
  getNewChecklists: async ctx => {
    const {query} = ctx.request;
    const {name} = query;
    let filters: FindParams<any> = {
      where: {},
    };
    if (name) {
      filters.where.name = {
        $contains: name,
      };
    }
    const res = await strapi.db.query(CHECKLIST_SLUG).findMany({
      populate: ['section.answers', 'section.ratings'],
      where: filters.where,
    });

    return res;
  },
  getChecklistResults: async (ctx): Promise<ChecklistResultApiModel[]> => {
    const {query} = ctx.request;
    const status = query.status;
    const name = query.name;
    const user: User = ctx.state.user;
    let filters: FindParams<any> = {
      where: {
        users_permissions_user: user.id,
      },
    };
    if (status) {
      filters.where.status = status;
    }

    if (name) {
      filters.where.checklist = {
        name: {
          $contains: name,
        },
      };
    }

    const res: ChecklistResult[] = await strapi.db.query(RESULT_SLUG).findMany({
      where: filters.where,
      populate: RESULT_FIELDS,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return transformGetChecklistResultsApi(res);
  },
  generateChecklistReport: async ctx => {
    const {
      hospital,
      ward,
      checklist,
      approved,
      checklistName,
      hospitalName,
      type = FileFormat.XLSX,
      checklistType,
      submitted_date_from,
      submitted_date_to,
    } = ctx.query;
    const filters = getReportFilters({
      hospital,
      ward,
      checklist,
      approved,
      submitted_date_from,
      submitted_date_to,
    });

    const checklists: Checklist[] = await getChecklistById(checklist);

    const results: ChecklistResult[] = await getChecklistResults(filters);

    if (!results.length) {
      return ctx.badRequest('No records found!', {
        error: 'NO_RECORD_FOUND',
      });
    }

    const {buffer} = generateChecklistReport(
      checklists[0],
      transformChecklistResults(results),
      type,
      checklistType,
    );

    sendChecklistReport({
      ctx,
      type,
      buffer,
      checklist: checklistName,
      ward,
      hospital: hospitalName,
    });
  },
  createChecklist: async ctx => {
    const {body} = ctx.request;
    const error = validateChecklistResult(body, ctx);
    if (error) {
      return ctx.badRequest(error);
    }
    const res = await strapi.entityService.create(RESULT_SLUG, {
      populate: RESULT_FIELDS,
      data: {
        ...body,
      },
    });

    return res;
  },
  updateChecklist: async ctx => {
    const {body}: {body: ChecklistResult} = ctx.request;
    const error = validateChecklistResult(body, ctx);

    if (error) {
      return ctx.badRequest(error);
    }

    const {id} = body;
    const res = await strapi.entityService.update(RESULT_SLUG, id, {
      populate: RESULT_FIELDS,
      data: {
        ...body,
      },
    });

    return res;
  },
  deleteChecklist: async ctx => {
    const {params} = ctx.request;
    const {id} = params;

    const findChecklistToDelete: ChecklistResult =
      await strapi.entityService.findOne(RESULT_SLUG, id, {
        populate: RESULT_FIELDS,
      });

    validateDeleteChecklist(findChecklistToDelete, ctx);

    const res = await strapi.entityService.delete(RESULT_SLUG, id, {
      populate: RESULT_FIELDS,
    });

    return res;
  },
});
