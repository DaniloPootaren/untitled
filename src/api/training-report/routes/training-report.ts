export default {
  routes: [
    {
      method: 'GET',
      path: '/getTrainingReport',
      handler: 'training-report.getTrainingReport',
      config: {
        auth: {
          scope: ['find'],
        },
      },
    },
    {
      method: 'GET',
      path: '/getUserTrainings',
      handler: 'training-report.getUserTrainings',
      config: {
        auth: {
          scope: ['find'],
        },
      },
    },
    {
      method: 'GET',
      path: '/findTrainingsByUser',
      handler: 'training-report.findTrainingsByUser',
      config: {},
    },
    {
      method: 'GET',
      path: '/searchTrainingTitle',
      handler: 'training-report.searchTrainingTitle',
      config: {
        auth: {
          scope: ['find'],
        },
      },
    },
  ],
};
