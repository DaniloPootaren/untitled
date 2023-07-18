module.exports = ({env}) => {
  const jwtSecret = env('JWT_SECRET', 'default_secret');

  return {
    'drag-drop-content-types': {
      enabled: true,
    },
    'import-export-entries': {
      enabled: false,
    },
    'leaflet-plugin': {
      enabled: true,
      resolve: './src/plugins/leaflet-plugin',
    },
    plugins: {
      'users-permissions': {
        jwt: {
          secret: jwtSecret,
          expiresIn: '1d',
        },
      },

      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          directives: {
            'img-src': ['*'],
          },
        },
      },
    },
  };
};
