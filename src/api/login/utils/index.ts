import {Role} from '../../../models/api-model';
import {RoleEnum} from '../models';

export const getRoleEntity = async (): Promise<Role> => {
  const roles = await strapi.entityService.findMany(
    'plugin::users-permissions.role',
  );

  return roles.find(role => role.name === RoleEnum.HW);
};
