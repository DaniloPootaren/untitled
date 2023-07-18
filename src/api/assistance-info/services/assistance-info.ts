import {Strapi} from '@strapi/strapi';
import {AssistanceDetail, GetAssistanceCount} from '../models';
import {transformAssistanceCountApi} from '../helpers';

const SLUG = 'api::assistance-detail.assistance-detail';

export default () => ({
  getAssistanceCount: async (ctx): Promise<GetAssistanceCount[]> => {
    const {name} = ctx.query;

    let filters = {};
    if (name != null) {
      filters = {
        assistance_category: {
          name: {
            $contains: name,
          },
        },
      };
    }

    const response: AssistanceDetail[] = await (strapi as Strapi).db
      .query(SLUG)
      .findMany({
        populate: ['assistance_category'],
        where: {
          ...filters,
        },
      });

    return transformAssistanceCountApi(response);
  },

  findAssistanceById: async (ctx): Promise<AssistanceDetail[]> => {
    const {query} = ctx.request;

    let filters: any = {};
    if (query.name) {
      filters = {
        name: {
          $contains: query.name,
        },
      };
    }

    const response = await (strapi as Strapi).db.query(SLUG).findMany({
      populate: ['assistance_category', 'working_hours'],
      where: {
        assistance_category: {
          id: query.id,
        },
        ...filters,
      },
    });

    return response;
  },
});
