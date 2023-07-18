export default {
  routes: [
    {
      method: 'GET',
      path: '/viewArticle/:id',
      handler: 'custom-article.viewArticle',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/findArticleById/:id',
      handler: 'custom-article.findArticleById',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/findArticles',
      handler: 'custom-article.findArticles',
      config: {
        auth: false,
      },
    },
  ],
};
