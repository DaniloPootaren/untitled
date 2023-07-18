import {ChecklistResult, Training} from '../../../models/api-model';

interface Error {
  error: string;
}

const validateChecklists = (data: ChecklistResult): Error => {
  let error: any;
  const uniqueTitleObj: Record<string, number> = {};

  data.section.forEach(section => {
    const title = section.title.trim();
    uniqueTitleObj[title] ??= 0;
    uniqueTitleObj[title]++;
  });

  Object.entries(uniqueTitleObj).forEach(([key, value]) => {
    if (value > 1) {
      error = {
        error: 'Duplicate Title: ' + key,
      };
    }
  });

  return error;
};

const validateTraining = (data: Training): Error => {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);

  if (startDate > endDate) {
    return {
      error: 'Start Date should not be greater than End Date',
    };
  }

  return null;
};

const validateEvent = (data: {start_date: string; end_date: string}): Error => {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);

  if (startDate > endDate) {
    return {
      error: 'Start Date should not be greater than End Date',
    };
  }

  return null;
};

export const validateChecklistResults = (data: ChecklistResult): Error => {
  const isPending = data.status === 'pending';
  const isApproved = data.approved;

  if (isPending && isApproved) {
    return {
      error: 'Pending results cannot be approved',
    };
  }

  return null;
};

export const editViewValidator = {
  'api::checklist.checklist': validateChecklists,
  'api::training.training': validateTraining,
  'api::event.event': validateEvent,
  'api::checklist-result.checklist-result': validateChecklistResults,
};
