export default [
  'strapi::errors',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'img-src': [
            'self',
            'data:',
            'blob:',
            '*',
            'unpkg.com',
            '*.tile.openstreetmap.org',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
];
