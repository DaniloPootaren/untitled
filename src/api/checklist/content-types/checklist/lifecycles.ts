import {Strapi} from '@strapi/strapi';
import {ChecklistResult} from '../../../../models/api-model';
import {validateChecklists} from '../../helpers';

export default {
  async beforeUpdate(event) {
    const {params, model} = event;

    const persistedData: ChecklistResult = await (strapi as Strapi).db
      .query(model.uid)
      .findOne({
        where: params.where,
        populate: ['section'],
      });
    validateChecklists(persistedData);
  },
};
