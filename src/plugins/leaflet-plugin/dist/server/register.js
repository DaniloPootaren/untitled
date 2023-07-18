'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.default = ({strapi}) => {
  strapi.customFields.register({
    name: 'leaflet-plugin',
    plugin: 'leaflet-plugin',
    type: 'string',
  });
};
