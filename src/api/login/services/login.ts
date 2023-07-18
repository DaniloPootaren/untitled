/**
 * login service.
 */

import {Login, LoginResponse, Me} from '../models';
import {
  createNewUser,
  getMaupassUser,
  getUserByEmail,
  issueToken,
  updateProfile,
} from './helpers';

export default () => ({
  authenticateUser: async (login: Login): Promise<LoginResponse> => {
    const {email, password, job, license_no, department} = login;
    let maupassUser: Me = null;

    try {
      maupassUser = await getMaupassUser({email, password});
    } catch (e) {
      throw new Error(e.details);
    }

    if (maupassUser) {
      const {name, surname, nic, dateOfBirth, emailAddress} = maupassUser;
      const user = await getUserByEmail(emailAddress);

      if (user) {
        if (user.profile.job.Position === job) {
          if (user.profile.license_no === license_no) {
            const token = await issueToken(user);
            const profile = await updateProfile({
              name,
              surname,
              nic,
              dateOfBirth,
              id: user.profile.id,
            });
            const {id, username, email} = user;

            return {
              me: maupassUser,
              role: user.role.name,
              access_token: token,
              profileId: profile.id,
              user: {
                id,
                username,
                email,
              },
            };
          } else {
            throw new Error('Incorrect license no');
          }
        } else {
          throw new Error('Incorrect job');
        }
      } else {
        const newLogin = {
          ...login,
          email: emailAddress,
        };

        const {user: newUser, profile} = await createNewUser({
          ...newLogin,
          name,
          surname,
          nic,
          dateOfBirth,
          department,
        });

        const token = await issueToken(newUser);
        const {id, username, email} = newUser;

        return {
          me: maupassUser,
          role: newUser.role.name,
          access_token: token,
          profileId: profile.id,
          user: {
            id,
            username,
            email,
          },
        };
      }
    } else {
      return;
    }
  },
});
