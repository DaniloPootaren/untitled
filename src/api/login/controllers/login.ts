/**
 * A set of functions called "actions" for `login`
 */

import { LoginResponse } from "../models";

export default {
  authenticate: async (ctx, next) => {
    try {
      const { body } = ctx.request;
      const loginResponse = (await (
        strapi.service("api::login.login") as any
      ).authenticateUser(body)) as LoginResponse;
      ctx.body = loginResponse;
    } catch (err) {
      ctx.status = 400;
      ctx.body = { message: err.message };    }
  },
};
