import {ChecklistResult} from '../../../models/api-model';

export const validateChecklists = (data: ChecklistResult): void => {
  const uniqueTitleObj: Record<string, number> = {};

  data.section.forEach(section => {
    const title = section.title.trim();
    uniqueTitleObj[title] ??= 0;
    uniqueTitleObj[title]++;
  });

  Object.entries(uniqueTitleObj).forEach(([key, value]) => {
    if (value > 1) {
      throw new Error('Duplicate title for ' + key);
    }
  });
};
