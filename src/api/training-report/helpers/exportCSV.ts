import {
  FailSuccess,
  GroupedTraining,
  TransformedTrainingModel,
  UserTraining,
} from '../../../models/api-model';
import {groupBy} from 'lodash';
import {formatDate} from '../../../utils/date';

export const transformTrainingData = (
  response: UserTraining[],
): TransformedTrainingModel[] => {
  const listOfTrainings: TransformedTrainingModel[] = [];

  response.forEach(data => {
    const {profile, test_results} = data;

    test_results?.forEach(result => {
      const {pre_test_result, post_test_result, training} = result;

      if (!training) {
        return;
      }

      listOfTrainings.push({
        user: ((profile.name ?? '') + ' ' + (profile.surname ?? '')).trim(),
        nic: profile.nic,
        training: training.title || '',
        submittedDate: formatDate(result.updatedAt, 'date-time'),
        pre_test_pass_mark: training.pre_test?.passing_marks,
        pre_test_score: pre_test_result?.score,
        post_test_pass_mark: training.post_test?.passing_marks,
        post_test_score: post_test_result?.score,
        trainingId: training.id,
        pre_test_result: training.pre_test
          ? pre_test_result.score >= training.pre_test.passing_marks
            ? FailSuccess.Passed
            : FailSuccess.Failed
          : null,
        post_test_result: training.post_test
          ? post_test_result.score >= training.post_test.passing_marks
            ? FailSuccess.Passed
            : FailSuccess.Failed
          : null,
      });
    });
  });

  return listOfTrainings;
};

export const groupByTraining = (
  data: TransformedTrainingModel[],
): GroupedTraining => {
  return groupBy(data, (item: TransformedTrainingModel) => item.trainingId);
};
