import {insertApiToken} from '../migrations/api-token';
import {initFirebaseApp} from '../firebase';
import {mailInstance} from '../email';

export const bootstrapApp = async () => {
  try {
    await insertApiToken();
    await initFirebaseApp();
    await mailInstance.setupTransport();
  } catch (e) {
    console.error(e);
  }
};
