import {
  FailSuccess,
  GroupedTraining,
  MimeType,
  TestMetrics,
  TransformedTrainingModel,
} from '../../../models/api-model';
import {head, mapValues, startCase, toPairs} from 'lodash';
import format from 'date-fns/format';
import {FileFormat} from '../../../admin/extensions/model';
import {
  BookType,
  SheetAOAOpts,
  utils,
  WorkBook,
  WorkSheet,
  write,
} from 'xlsx-js-style';

const calculateTotal = (data: number[]): number => {
  return data.reduce((acc, val) => {
    return acc + val;
  }, 0);
};

const calculateAvgScore = (
  data: TransformedTrainingModel[],
  field: keyof TransformedTrainingModel,
): string => {
  return (
    calculateTotal(data.map(val => val[field]).filter(Boolean) as number[]) /
    data.length
  ).toFixed(2);
};

const calcTestMetrics = (
  data: GroupedTraining,
): Record<string, TestMetrics> => {
  return mapValues(data, trainings => {
    return {
      number_of_trainee: new Set(trainings.map(item => item.user)).size,
      pre_test_average_score: calculateAvgScore(trainings, 'pre_test_score'),
      post_test_average_score: calculateAvgScore(trainings, 'post_test_score'),
    };
  });
};

const transformFieldKeys = (
  keys: (keyof TransformedTrainingModel)[],
): string[] => {
  return keys.filter(key => key !== 'trainingId').map(key => startCase(key));
};

export const convertToExcelSheet = (
  data: GroupedTraining,
  type: FileFormat,
  workbook: WorkBook,
): any => {
  if (!data) {
    return null;
  }

  const [firstKey, firstValue] = head(toPairs(data));
  const keys = Object.keys(firstValue[0]);

  // post_test when passed through startCase will return Post Test. It is capitalized and
  // underscores/other characters removed
  const transformedKeys = transformFieldKeys(
    keys as (keyof TransformedTrainingModel)[],
  );

  let worksheet = utils.aoa_to_sheet([transformedKeys]);
  const processedSheet = addDataToXlsx(worksheet, data);
  worksheet = processedSheet.worksheet;
  const listOfMetricRow = processedSheet.listOfMetricRowsIndex;

  for (const i in worksheet) {
    const cell = utils.decode_cell(i);
    if (listOfMetricRow.includes(cell.r)) {
      worksheet[i].s = {
        fill: {
          fgColor: {
            rgb: 'E9E9E9',
          },
        },
      };
    }

    if (cell.c === 8 || cell.c === 9) {
      if (worksheet[i].v === FailSuccess.Failed) {
        worksheet[i].s = {
          font: {
            color: {
              rgb: 'f63232',
            },
            bold: true,
          },
        };
      } else if (worksheet[i].v === FailSuccess.Passed) {
        worksheet[i].s = {
          font: {
            color: {
              rgb: '2db028',
            },
            bold: true,
          },
        };
      }
    }
  }

  utils.book_append_sheet(workbook, worksheet);
  return write(workbook, {
    type: 'buffer',
    bookType: type.toLowerCase() as BookType,
  });
};

const addDataToXlsx = (
  worksheet: WorkSheet,
  data: GroupedTraining,
): {
  worksheet: WorkSheet;
  listOfMetricRowsIndex: number[];
} => {
  // calculate metrics for each training
  const metrics = calcTestMetrics(data);
  const EMPTY_ROWS = [];

  // options needed so that rows are added from bottom of excel sheet => no overrides
  const opts: SheetAOAOpts = {
    origin: -1,
  };
  let row = 0;
  const listOfMetricRowsIndex: number[] = [];

  // get all rows of metrics so that bg color can be set
  const addRow = (isMetricRow: boolean = false): void => {
    ++row;
    if (isMetricRow) {
      listOfMetricRowsIndex.push(row);
    }
  };

  for (const [key, value] of Object.entries(data)) {
    value.forEach(item => {
      // cloning item to delete unused column trainingId
      const clonedItem = {...item};
      delete clonedItem.trainingId;
      utils.sheet_add_aoa(worksheet, [Object.values(clonedItem)], opts);
      addRow();
    });

    utils.sheet_add_aoa(worksheet, EMPTY_ROWS, opts);
    addRow();

    const currentMetric: TestMetrics = metrics[key];
    const transformedMetric = Object.entries(currentMetric).map(
      ([key, value]) => {
        // startCase will remove underscore and capitalise the words to be used in excel columns
        // e.g average_score => Average Score
        return `${startCase(key)}: ${value}`;
      },
    );

    utils.sheet_add_aoa(worksheet, [transformedMetric], opts);
    addRow(true);

    utils.sheet_add_aoa(worksheet, EMPTY_ROWS, opts);
    addRow();
  }

  // settings width of each column
  worksheet['!cols'] = Object.keys(Object.values(metrics)[0]).map(() => ({
    wch: 28,
  }));

  return {worksheet, listOfMetricRowsIndex};
};

export const getTrainingReportFilename = (
  startDate: string,
  endDate: string,
  type: FileFormat,
): string => {
  let filename = 'Training';
  const formatDate = (date: string) => format(new Date(date), 'dd-MM-yyyy');

  if (startDate && endDate) {
    filename += ` ${formatDate(startDate)} - ${formatDate(endDate)}`;
  } else if (startDate) {
    filename += ` as from ${formatDate(startDate)}`;
  } else if (endDate) {
    filename += ` before ${formatDate(endDate)}`;
  }

  return filename.concat('.').concat(type.toLowerCase());
};

export const getMimeType = (fileFormat: FileFormat): MimeType => {
  switch (fileFormat) {
    case FileFormat.CSV:
      return MimeType.CSV;
    case FileFormat.XLSX:
      return MimeType.XLSX;
    default:
      return null;
  }
};
