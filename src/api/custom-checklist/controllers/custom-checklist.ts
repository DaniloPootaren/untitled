import {throwForbiddenError} from '../helpers';

const utils = require('@strapi/utils');
const {ForbiddenError} = utils.errors;

const SLUG = 'api::custom-checklist.custom-checklist';

export default {
  getNewChecklists: async ctx => {
    try {
      return await (strapi.service(SLUG) as any).getNewChecklists(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
  getChecklistResults: async ctx => {
    try {
      return await (strapi.service(SLUG) as any).getChecklistResults(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
  createChecklist: async ctx => {
    try {
      return await (strapi.service(SLUG) as any).createChecklist(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
  updateChecklist: async ctx => {
    try {
      return await (strapi.service(SLUG) as any).updateChecklist(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
  deleteChecklist: async ctx => {
    try {
      return await (strapi.service(SLUG) as any).deleteChecklist(ctx);
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throwForbiddenError();
      }
      throw new Error(err);
    }
  },
  generateChecklistReport: async ctx => {
    try {
      return await (strapi.service(SLUG) as any).generateChecklistReport(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
};
