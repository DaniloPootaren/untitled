export default {
  routes: [
    {
      method: 'POST',
      path: '/getFeaturedArticles',
      handler: 'home-article.getFeaturedArticles',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/getLatestNews',
      handler: 'home-article.getLatestNews',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/getHomeCategories',
      handler: 'home-article.getHomeCategories',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/getArticles',
      handler: 'home-article.getArticles',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/getAllInterests',
      handler: 'home-article.getAllInterests',
      config: {
        auth: false,
      },
    },
  ],
};
