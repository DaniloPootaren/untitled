import loginMiddleware from '../middlewares/login-validation';

export default {
  routes: [
    {
      method: "POST",
      path: "/login",
      handler: "login.authenticate",
      config: {
        policies: [],
        middlewares: [loginMiddleware],
      },
    },
  ],
};
