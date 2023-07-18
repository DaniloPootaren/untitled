import axios from 'axios';
import {MAUPASS_GET_USER_PROFILE_URL, MAUPASS_LOGIN_URL} from '../../constants';
import {
  MaupassGetCurrentUserProfileResponse,
  MaupassPayload,
  MaupassResponse,
  Me,
} from '../../models';
import {getRoleEntity} from '../../utils';
import {Job, Profile, User} from '../../../../models/api-model';

export const getMaupassUser = async (
  payload: MaupassPayload,
): Promise<Me | null> => {
  const {email, password} = payload;
  try {
    const maupassResponse: MaupassResponse = await axios.post(
      MAUPASS_LOGIN_URL,
      {
        usernameOrEmailAddress: email,
        password,
      },
    );

    const maupassGetUserResponse: MaupassGetCurrentUserProfileResponse =
      await axios.get(MAUPASS_GET_USER_PROFILE_URL, {
        headers: {
          Authorization: `Bearer ${maupassResponse.data.result.accessToken}`,
        },
      });

    if (
      maupassResponse.data.success &&
      maupassResponse.data.result.accessToken &&
      maupassGetUserResponse.data.success
    ) {
      return maupassGetUserResponse.data.result;
    } else {
      return null;
    }
  } catch (e) {
    throw e.response.data.error;
  }
};

export const updateProfile = async ({
  name,
  surname,
  id,
  nic,
  dateOfBirth,
}): Promise<Profile> => {
  try {
    return await strapi.db.query('api::profile.profile').update({
      populate: ['job'],
      data: {
        name,
        surname,
        nic,
        dob: dateOfBirth,
      },
      where: {
        id,
      },
    });
  } catch (e) {
    throw new Error(e);
  }
};

export const createNewUser = async ({
  job,
  email,
  license_no,
  name,
  surname,
  nic,
  dateOfBirth,
  department,
}): Promise<{
  user: User;
  profile: Profile;
}> => {
  try {
    const jobId = (await findJobByName(job)).id;
    const departmentId = (await findDepartmentByName(department)).id;

    const newUser = await strapi.db
      .query('plugin::users-permissions.user')
      .create({
        populate: ['role'],
        data: {
          username: email,
          email,
          provider: 'MAUPASS',
          confirmed: true,
          role: (await getRoleEntity()).id,
          department: departmentId,
        },
      });

    const profile = await strapi.db.query('api::profile.profile').create({
      populate: ['job', 'department'],
      data: {
        license_no,
        job: jobId,
        users_permissions_user: newUser.id,
        name,
        surname,
        nic,
        dob: dateOfBirth,
      },
    });

    return {user: newUser, profile};
  } catch (e) {
    throw e;
  }
};

export const getUserByEmail = async (email: string): Promise<User> => {
  try {
    const [user] = await strapi.entityService.findMany(
      'plugin::users-permissions.user',
      {
        populate: ['profile', 'profile.job', 'role'],
        filters: {
          email,
        },
      },
    );
    return user;
  } catch (e) {
    throw e;
  }
};

export const issueToken = (user: any) => {
  return strapi.plugins['users-permissions'].services.jwt.issue({
    id: user.id,
    role: user.role.name,
  });
};

export const findJobByName = async (name: string): Promise<Job> => {
  return await strapi.db.query('api::job.job').findOne({
    where: {
      Position: name,
    },
  });
};

export const findDepartmentByName = async (
  department: string,
): Promise<any> => {
  return await strapi.db.query('api::department.department').findOne({
    where: {
      name: department,
    },
  });
};
