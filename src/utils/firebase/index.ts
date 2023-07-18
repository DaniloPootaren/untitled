import * as admin from 'firebase-admin';
import {huaweiPushInstance} from './huawei';
import {formatDate} from '../date';

const PUBLIC_TOPIC = 'public';
const PUBLIC_TOPIC_DEV = 'public_dev';
const NOTIFICATION_EVENT = 'EVENT';

const getPublicTopic = (baseUrl: string): string => {
  switch (true) {
    case !!baseUrl.match('devwho'):
    case !!baseUrl.match('testwho'):
    case !!baseUrl.match('192.168'):
    case !!baseUrl.match('10.0.2.2'):
    case !!baseUrl.match('smarthealthtest'):
      return PUBLIC_TOPIC_DEV;
    default:
      return PUBLIC_TOPIC;
  }
};

const getFirebaseServiceAcc = () => require('./service-account.json');

export const initFirebaseApp = () =>
  admin.initializeApp({
    credential: admin.credential.cert(getFirebaseServiceAcc()),
  });

export const sendNotificationToTopic = async (notification: {
  title: string;
  description: string;
  image: string;
  id: number;
  start_date: string;
  end_date: string;
}): Promise<void> => {
  const {title, description, image, id, start_date, end_date} = notification;
  const data = {
    id: id.toString(),
    title,
    description,
    image,
    start_date,
    end_date,
    type: NOTIFICATION_EVENT,
  };

  const summary = `${formatDate(start_date, 'without-year')} - ${formatDate(
    end_date,
    'without-year',
  )}`;

  const baseurl = process.env.BASE_URL;
  const color = '#008DC9';
  await huaweiPushInstance.sendNotificationToTopic(
    data,
    summary,
    getPublicTopic(baseurl),
  );

  await admin.messaging().send({
    data,
    notification: {
      title,
      body: description,
    },
    topic: getPublicTopic(baseurl),
    apns: {
      payload: {
        aps: {
          alert: {
            title,
            body: description,
            subtitle: summary,
          },
          mutableContent: true,
          sound: 'default',
        },
      },
      fcmOptions: {
        imageUrl: baseurl.concat(image),
      },
      headers: {
        'apns-push-type': 'alert',
        'apns-priority': '10',
        'apns-topic': 'org.govmu.mobien',
      },
    },
    android: {
      priority: 'high',
      notification: {
        imageUrl: baseurl.concat(image),
        channelId: 'default',
        defaultSound: true,
        defaultVibrateTimings: true,
        eventTimestamp: new Date(),
        icon: 'ic_launcher',
        color,
        body: summary + '\n' + description,
      },
    },
  });
};
