import Joi from 'joi';

const loginSchema = Joi.object({
  email: Joi.string().required(),
  license_no: Joi.string()
    .regex(/^[^a-zA-Z]*\d{4,6}$/)
    .required()
    .messages({
      'string.pattern.base':
        'License number must be at least 4 digits and may or may not contain a special character at the beginning, and must not be longer than 6 digits',
    }),
  password: Joi.string().required(),
  job: Joi.string().required(),
  department: Joi.string().required(),
});

export default async function (ctx, next) {
  const {body} = ctx.request;

  // Validate the request body against the schema
  const {error} = loginSchema.validate(body);
  if (error) {
    ctx.status = 400;
    ctx.body = {
      error: 'Bad Request',
      message: error.details[0].message,
    };
    return;
  }

  // Proceed to the next middleware if validation succeeds
  await next();
}
