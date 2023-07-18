export default {
  routes: [
    {
      method: 'GET',
      path: '/getEvents',
      handler: 'custom-event.getEvents',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/getEventById',
      handler: 'custom-event.getEventById',
      config: {
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/updateEvent',
      handler: 'custom-event.updateEvent',
      config: {
        auth: {
          scope: ['find'],
        },
      },
    },
    {
      method: 'GET',
      path: '/getEventByDate',
      handler: 'custom-event.getEventByDate',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/viewEvent/:id',
      handler: 'custom-event.viewEvent',
      config: {
        auth: false,
      },
    },
  ],
};
