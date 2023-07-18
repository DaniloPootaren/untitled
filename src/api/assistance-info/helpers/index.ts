import {AssistanceDetail, GetAssistanceCount} from '../models';
import {groupBy} from 'lodash';

export const transformAssistanceCountApi = (
  assistanceDetail: AssistanceDetail[],
): GetAssistanceCount[] => {
  if (!assistanceDetail.length) {
    return [];
  }

  const groupedByDetail = groupBy(assistanceDetail, 'assistance_category.id');
  const response: GetAssistanceCount[] = [];
  for (const [key, value] of Object.entries(groupedByDetail)) {
    const categoryName = value[0].assistance_category.name;
    response.push({
      name: categoryName,
      count: value.length,
      id: +key,
    });
  }
  return response;
};
