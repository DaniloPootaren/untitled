import {TestResult} from '../../../models/api-model';

export const transformTestResults = (results: TestResult[]): TestResult[] => {
  const resultSet = [];
  return results.filter(testResult => {
    const trainingId = testResult.training.id;
    if (!resultSet.includes(trainingId)) {
      resultSet.push(trainingId);
      return true;
    }

    return false;
  });
};
