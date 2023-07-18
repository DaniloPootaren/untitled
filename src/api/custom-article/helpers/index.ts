import {Strapi} from '@strapi/strapi';
import {ArticleModel} from '../../../models/api-model';
const SLUG = 'api::article.article';

export const updateArticle = async (id: number, data: any): Promise<void> => {
  return await (strapi as Strapi).db.query(SLUG).update({
    where: {
      id,
    },
    data,
  });
};

export const findArticle = async (id: number): Promise<ArticleModel> => {
  return await (strapi as Strapi).db.query(SLUG).findOne({
    where: {
      id,
    },
  });
};
