export default {
  routes: [
    {
      method: 'GET',
      path: '/getAssistanceCount',
      handler: 'assistance-info.getAssistanceCount',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/findAssistanceById',
      handler: 'assistance-info.findAssistanceById',
      config: {
        auth: false,
      },
    },
  ],
};
