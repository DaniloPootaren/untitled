import {Strapi} from '@strapi/strapi';
import {EventModel} from '../../../models/api-model';
const SLUG = 'api::event.event';

export const updateEvent = async (id: number, data: any): Promise<void> => {
  return await (strapi as Strapi).db.query(SLUG).update({
    where: {
      id,
    },
    data,
  });
};

export const findEvent = async (id: number): Promise<EventModel> => {
  return await (strapi as Strapi).db.query(SLUG).findOne({
    where: {
      id,
    },
    populate: ['image'],
  });
};
