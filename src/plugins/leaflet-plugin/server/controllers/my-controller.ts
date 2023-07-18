import {Strapi} from '@strapi/strapi';

export default ({strapi}: {strapi: Strapi}) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('leaflet-plugin')
      .service('myService')
      .getWelcomeMessage();
  },
});
