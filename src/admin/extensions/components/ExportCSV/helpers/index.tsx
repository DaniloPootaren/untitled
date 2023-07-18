import {constructSearchTitleApi} from '../../../utils/url';
import {ChecklistResponse} from '../../../model';
import {fetchData} from '../../../utils/contentApis';
import {apiTokenOptions} from '../../../helpers/exportCSV';

export const searchTitles = async (name?: string): Promise<any> => {
  const url = constructSearchTitleApi();
  const params: any = {};
  if (name != null) {
    params.name = name;
  }
  const res: {data: ChecklistResponse} = await fetchData(url, {
    ...apiTokenOptions,
    params,
  });
  return res.data;
};
