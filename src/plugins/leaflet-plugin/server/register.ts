import {Strapi} from '@strapi/strapi';

export default ({strapi}: {strapi: Strapi}) => {
  strapi.customFields.register({
    name: 'leaflet-plugin',
    plugin: 'leaflet-plugin',
    type: 'string',
  });
};
