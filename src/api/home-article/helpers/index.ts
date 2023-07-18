import {
  Article,
  HomeMainCategory,
  MobileMainCategory,
} from '../../../models/api-model';
import {uniqBy, filter} from 'lodash';

export const transformHomeCategoryApi = (
  data: HomeMainCategory[],
): MobileMainCategory[] => {
  return data.map(item => {
    let duplicateArticles: Article[] = [];
    item.article_sub_categories?.forEach(subcat => {
      duplicateArticles.push(...subcat.articles);
    });
    const distinctArticles = uniqBy(duplicateArticles, elem => elem.id);
    const publishedArticles = filter(
      distinctArticles,
      article => article.publishedAt !== null,
    );

    return {
      id: item.id,
      count: publishedArticles.length,
      mainCategory: item.name,
      articles: publishedArticles,
      subCategories: item.article_sub_categories,
    };
  });
};
