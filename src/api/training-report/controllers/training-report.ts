const SLUG = 'api::training-report.training-report';

export default {
  getTrainingReport: async (ctx, next) => {
    try {
      return await (strapi.service(SLUG) as any).getTrainingReport(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
  getUserTrainings: async (ctx, next) => {
    try {
      return await (strapi.service(SLUG) as any).getUserTrainings(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
  findTrainingsByUser: async (ctx, next) => {
    try {
      return await (strapi.service(SLUG) as any).findTrainingsByUser(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
  searchTrainingTitle: async (ctx, next) => {
    try {
      return await (strapi.service(SLUG) as any).searchTrainingTitle(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
};
