import {Strapi} from '@strapi/strapi';

const SLUG = 'api::custom-event.custom-event';

export default {
  getEvents: async ctx => {
    try {
      return await ((strapi as Strapi).service(SLUG) as any).getEvents(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
  getEventById: async ctx => {
    try {
      return await ((strapi as Strapi).service(SLUG) as any).getEventById(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
  updateEvent: async ctx => {
    try {
      return await ((strapi as Strapi).service(SLUG) as any).updateEvent(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
  getEventByDate: async ctx => {
    try {
      return await ((strapi as Strapi).service(SLUG) as any).getEventByDate(
        ctx,
      );
    } catch (err) {
      throw new Error(err);
    }
  },
  viewEvent: async ctx => {
    try {
      return await ((strapi as Strapi).service(SLUG) as any).viewEvent(ctx);
    } catch (err) {
      throw new Error(err);
    }
  },
};
