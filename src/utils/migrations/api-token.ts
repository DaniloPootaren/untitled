import {Strapi} from '@strapi/strapi';

export const insertApiToken = async () => {
  const response = await (strapi as Strapi).db.connection.raw(
    'SELECT * from strapi_api_tokens where name="Super Admin"',
  );

  if (!response[0][0]) {
    await strapi.db.connection.raw(
      'Insert into strapi_api_tokens(description, name, type, access_key)' +
        "VALUES ('', 'Super Admin', 'read-only', '2c618592dd9ae014975b5b3e2f41ce2cf5a5a5b8b25635f94d1d3a3e29835c8105a950086b9a6e798afac8fe05a1ecde6328677a1bdfeaeb663c94d7788019bb') ",
    );
    console.log('API Token data inserted successfully');
  }
};
