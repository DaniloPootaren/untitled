import {User} from '../../models/api-model';

const utils = require('@strapi/utils');
const {ForbiddenError} = utils.errors;

/**
 * This method is used to check if other users are either accessing/deleting
 * other users' data
 * @param ctx -  context object
 * @param type - Request Body or Query Params or Path Variable
 * @param args - field to check in request body
 */
export const restrictUnwantedUser = (
  ctx: any,
  type: 'body' | 'query' | 'path',
  ...args: string[]
): boolean => {
  const request = ctx.request;
  const user: User = ctx.state.user;
  let isValid = true;

  switch (type) {
    case 'body':
      isValid = validateBody(user, request.body, ...args);
      break;
  }

  if (!isValid) {
    throwForbiddenError();
  }

  return isValid;
};

const throwForbiddenError = (): void => {
  throw new ForbiddenError("You are not allowed to modify other users' data!");
};

const getDeepValue = (obj: any, ...args: string[]): any => {
  let clonedObj = Object.assign({}, obj);
  for (let i = 0; i < args.length; i++) {
    clonedObj = clonedObj[args[i]];
  }

  return clonedObj;
};

const validateBody = (user: User, body: any, ...args: string[]): boolean => {
  const bodyUserId = getDeepValue(body, ...args);
  return user.id === bodyUserId;
};
