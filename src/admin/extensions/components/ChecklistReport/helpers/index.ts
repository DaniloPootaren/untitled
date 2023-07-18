import {ChecklistResponse, HospitalResponse, Options} from '../../../model';
import {fetchData} from '../../../utils/contentApis';
import {
  constructChecklistApi,
  constructChecklistReportUrl,
  constructHospitalApi,
} from '../../../utils/url';
import {apiTokenOptions, axiosRequestConfig} from '../../../helpers/exportCSV';
import {AxiosResponse} from 'axios';
import {ComponentEnum} from '../../../../../models/api-model';

export const checklistReportHandler = async (
  type: ComponentEnum,
  data: {
    checklist: number;
    checklistName: string;
    hospitalName: string;
    hospital: number;
    ward: string;
    approved: boolean | undefined;
    submitted_date_from: string;
    submitted_date_to: string;
  },
): Promise<AxiosResponse> => {
  const url = constructChecklistReportUrl(null, type);
  const res = await fetchData(url, {
    ...axiosRequestConfig,
    params: {
      ...data,
    },
  });
  return res;
};

const paginationParams = {
  'pagination[page]': 1,
  'pagination[pageSize]': 10,
};

export const hospitalSearch = async (
  name?: string,
): Promise<HospitalResponse['data']> => {
  const url = constructHospitalApi();
  const params: any = paginationParams;
  if (name != null) {
    params.name = name;
  }
  const res: {data: HospitalResponse} = await fetchData(url, {
    ...apiTokenOptions,
    params,
  });
  return res.data.data;
};

export const checklistSearch = async (name?: string): Promise<any> => {
  const url = constructChecklistApi();
  const params: any = paginationParams;
  if (name != null) {
    params.name = name;
  }
  const res: {data: ChecklistResponse} = await fetchData(url, {
    ...apiTokenOptions,
    params,
  });
  return res.data.data;
};

export const transformApiToOptions = (
  data: HospitalResponse['data'] | ChecklistResponse['data'],
): Options[] => {
  return data.map(item => ({
    value: item.id,
    label: item.attributes.name,
  }));
};
