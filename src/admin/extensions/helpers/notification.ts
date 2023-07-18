import {getUpdateEventApiUrl} from '../utils/url';
import axios from 'axios';
import {apiTokenOptions} from './exportCSV';
import {updateData} from '../utils/contentApis';

export const updateEvent = async (
  id: number,
  notified: boolean,
): Promise<any> => {
  const url = getUpdateEventApiUrl(id, notified);
  const res = updateData(
    url,
    {},
    {
      ...apiTokenOptions,
    },
  );
  return res;
};

export const handleNotification = async (data: {
  id: number;
  notified: boolean;
}): Promise<void> => {
  const {id, notified} = data;
  await updateEvent(id, notified);
};
