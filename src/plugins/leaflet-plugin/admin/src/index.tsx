import pluginId from './pluginId';
import PluginIcon from './components/PluginIcon';
import React from 'react';
import getTrad from './utils/getTrad';

export const coordinateRegex = /^-?\d{1,2}\.\d{3,},\s*-?\d{1,3}\.\d{3,}$/;

export default {
  register(app: any) {
    app.customFields.register({
      name: 'leaflet-plugin',
      type: 'string',
      pluginId,
      icon: PluginIcon,
      intlLabel: {
        id: 'leaflet.map.label',
        defaultMessage: 'Leaflet Map',
      },
      intlDescription: {
        id: 'leaflet.map.desc',
        defaultMessage: 'Leaflet map for coordinates use',
      },
      components: {
        Input: async () => import('./components'),
      },
      options: {
        advanced: [
          {
            sectionTitle: null,
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: 'leaflet.required.label',
                  defaultMessage: 'Required field',
                },
                description: {
                  id: 'leaflet.required.description',
                  defaultMessage:
                    'If this field is empty, validation error occurs',
                },
              },
              {
                name: 'options.maxLengthCharacters',
                type: 'checkbox-with-number-field',
                intlLabel: {
                  id: 'leaflet.maxLength.label',
                  defaultMessage: 'Maximum length (characters)',
                },
              },
              {
                intlLabel: {
                  id: getTrad('form.attribute.item.text.regex'),
                  defaultMessage: 'RegExp pattern',
                },
                name: 'regex',
                type: 'text',
                description: {
                  id: getTrad('form.attribute.item.text.regex.description'),
                  defaultMessage: 'The text of the regular expression',
                },
              },
            ],
          },
        ],
      },
    });
  },

  bootstrap(app: any) {},
};
