const SLUG = 'api::assistance-info.assistance-info';

export default {
  getAssistanceCount: async ctx => {
    try {
      return await (strapi.service(SLUG) as any).getAssistanceCount(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
  findAssistanceById: async ctx => {
    try {
      return await (strapi.service(SLUG) as any).findAssistanceById(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
};
