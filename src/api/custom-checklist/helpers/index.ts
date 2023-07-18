import {
  Checklist,
  ChecklistReportCols,
  ChecklistResult,
  ChecklistResultApiModel,
  ChecklistResultRatingScore,
  ChecklistResultTransformed,
  ChecklistStatus,
  ComponentEnum,
  FieldLabel,
  GroupedChecklist,
  Section,
  SectionCols,
  User,
} from '../../../models/api-model';
import {groupBy} from 'lodash';
import {WhereParams} from '@strapi/database';
import {FileFormat} from '../../../admin/extensions/model';
import {BookType, SheetAOAOpts, utils, WorkSheet, write} from 'xlsx-js-style';
import {getMimeType} from '../../training-report/helpers/csvHelper';
import {CHECKLIST_SLUG, RESULT_SLUG} from '../../../utils/slugs';
import {formatDate} from '../../../utils/date';

const strapiUtils = require('@strapi/utils');
const {ForbiddenError} = strapiUtils.errors;

export const SECTION_FIELDS = [
  'section.title',
  'section.ratings',
  'section.answers',
];
export const RESULT_FIELDS = [
  'users_permissions_user.profile',
  'hospital',
  ...SECTION_FIELDS,
  ...SECTION_FIELDS.map(item => `checklist.${item}`),
];

export const getChecklistById = async (
  checklist: number,
): Promise<Checklist[]> => {
  return await strapi.db.query(CHECKLIST_SLUG).findMany({
    where: {
      id: checklist,
    },
    populate: [...SECTION_FIELDS, 'name'],
  });
};

export const getChecklistResults = async (
  filters: WhereParams<any>,
): Promise<ChecklistResult[]> => {
  return await strapi.db.query(RESULT_SLUG).findMany({
    where: {
      ...filters,
      status: ChecklistStatus.submitted,
    },
    populate: [...RESULT_FIELDS, 'users_permissions_user.profile', 'checklist'],
  });
};

export const transformGetChecklistResultsApi = (
  res: ChecklistResult[],
): ChecklistResultApiModel[] => {
  const groupedChecklist: GroupedChecklist = groupBy(res, item =>
    formatDate(item.updatedAt, 'dd/MM/yyyy'),
  );
  return Object.entries(groupedChecklist).map(([key, value]) => {
    return {
      date: key,
      results: value,
    };
  });
};

export const validateDeleteChecklist = (
  res: ChecklistResult,
  ctx: any,
): void => {
  const user: User = ctx.state.user;
  if (user.id !== res.users_permissions_user.id) {
    throwForbiddenError();
  }
};

export const throwForbiddenError = (): void => {
  throw new ForbiddenError("You are not allowed to modify other users' data!");
};

export const getReportFilters = ({
  hospital,
  ward,
  checklist,
  approved,
  id,
  submitted_date_from,
  submitted_date_to,
}: {
  hospital?: string;
  ward?: string;
  checklist?: string;
  approved?: boolean;
  id?: number;
  submitted_date_from?: string;
  submitted_date_to?: string;
}): WhereParams<any> => {
  let filters: WhereParams<any> = {};

  if (submitted_date_from) {
    filters.updatedAt = {
      $gte: submitted_date_from,
    };
  }

  if (submitted_date_to) {
    filters.updatedAt = {
      ...filters.updatedAt,
      $lte: submitted_date_to,
    };
  }

  if (hospital) {
    filters.hospital = +hospital;
  }

  if (ward) {
    filters.ward = {
      $contains: ward,
    };
  }

  if (checklist) {
    filters.checklist = +checklist;
  }

  if (approved != null) {
    filters.approved = approved;
  }

  if (id != null) {
    filters.id = id;
  }

  return filters;
};

const getColsData = (columns: ChecklistReportCols): string[][] => {
  const cols: string[][] = [[]];
  Object.entries(columns).forEach(([key, value]) => {
    if (!['sections', 'averageScore'].includes(key)) {
      cols[0].push((value as FieldLabel).label);
    }
  });

  columns.sections?.forEach(section => {
    cols[0].push(section.label);
  });

  Object.entries(columns).forEach(([key, value]) => {
    if (['averageScore'].includes(key)) {
      cols[0].push((value as FieldLabel).label);
    }
  });

  return cols;
};

const opts: SheetAOAOpts = {
  origin: -1,
};

const addChecklistResults = (
  worksheet: WorkSheet,
  results: ChecklistResultTransformed[],
  columnData: ChecklistReportCols,
): {worksheet: WorkSheet} => {
  const rows: string[][] = [];
  const scores: ChecklistResultRatingScore = {};
  let rowToColor: number = 0;

  // adding result information such as user etc.. first
  Object.entries(columnData).forEach(([key, value]) => {
    if (!['sections', 'averageScore'].includes(key)) {
      results.forEach((result, index) => {
        rows[index] ??= [];
        const fieldLabel = (value as FieldLabel).field;

        if (fieldLabel === 'updatedAt') {
          rows[index].push(formatDate(result[fieldLabel], 'date-time'));
        } else {
          rows[index].push(result[fieldLabel]);
        }
      });
    }
  });

  // increment row count to color this specific row later
  rowToColor += results.length;

  // adding section information to excel rows
  columnData.sections?.forEach(columnSectionDtl => {
    results.forEach((result, index) => {
      const sectionInResult = result.section?.find(
        item => item.title === columnSectionDtl.section,
      );

      if (sectionInResult?.__component === ComponentEnum.free_text) {
        const answer = sectionInResult.answers?.find(
          answer => answer.question === columnSectionDtl.question,
        );

        if (answer) {
          if (columnSectionDtl.isComment) {
            rows[index].push(answer.comment);
          } else if (answer.is_close_ended) {
            rows[index].push(getBooleanString(answer.booleanAnswer));
          } else {
            rows[index].push(answer.response);
          }
        }
      }

      if (sectionInResult?.__component === ComponentEnum.rating) {
        const rating = sectionInResult.ratings?.find(
          data => data.question === columnSectionDtl.question,
        );

        if (rating && (rating.performance != null || rating.is_close_ended)) {
          const performance = rating.performance;

          if (columnSectionDtl.isComment) {
            rows[index].push(rating.comment);
          } else if (rating.is_close_ended) {
            rows[index].push(getBooleanString(rating.booleanAnswer));
          } else {
            rows[index].push(performance.toString());
          }

          // total score should be placed below respective column
          const columnIndex = rows[index].length - 1;

          if (rating.is_close_ended && !columnSectionDtl.isComment) {
            scores[columnSectionDtl.label] ??= {
              totalYes: 0,
              totalNo: 0,
              totalRecord: 0,
              columnIndex,
              displayScore: false,
            };

            scores[columnSectionDtl.label] = {
              totalYes: (scores[columnSectionDtl.label].totalYes +=
                rating.booleanAnswer ? 1 : 0),
              totalNo: (scores[columnSectionDtl.label].totalNo +=
                rating.booleanAnswer ? 0 : 1),
              totalRecord: ++scores[columnSectionDtl.label].totalRecord,
              columnIndex,
              displayScore: false,
            };
          } else if (!columnSectionDtl.isComment && !rating.is_close_ended) {
            scores[columnSectionDtl.label] ??= {
              totalRecord: 0,
              totalScore: 0,
              columnIndex,
              displayScore: true,
            };

            scores[columnSectionDtl.label] = {
              totalScore: (scores[columnSectionDtl.label].totalScore +=
                rating.performance),
              totalRecord: ++scores[columnSectionDtl.label].totalRecord,
              columnIndex,
              displayScore: true,
            };
          }
        } else {
          rows[index].push('N/A');
        }
      }
    });
  });

  // adding average score to excel rows
  results.forEach((result, index) => {
    rows[index].push(result.averageScore || 'N/A');
  });

  utils.sheet_add_aoa(worksheet, rows, opts);
  addScoreToWorksheet(worksheet, scores, rowToColor);
  return {worksheet};
};

const getBooleanString = (booleanAnswer: boolean): string => {
  return booleanAnswer === true ? 'Yes' : 'No';
};

const addScoreToWorksheet = (
  worksheet: WorkSheet,
  scores: ChecklistResultRatingScore,
  rowToColor: number,
): void => {
  //append empty row
  utils.sheet_add_aoa(worksheet, [], opts);
  ++rowToColor;

  const rows = [[]];
  const NUMBER_OF_COLS_TO_SKIP = 7;

  // this is done so that average score displayed under their respective column
  const emptyCells = Array(NUMBER_OF_COLS_TO_SKIP).fill(
    '',
    0,
    NUMBER_OF_COLS_TO_SKIP,
  );
  rows[0].push(...emptyCells);

  // adding total score on last line
  Object.entries(scores).forEach(([key, value]) => {
    if (value.displayScore) {
      rows[0].push(
        `${key} : ${(value.totalScore / value.totalRecord).toFixed(2)}`,
      );
    } else {
      rows[0].push(`${key} : ${value.totalYes} Yes, ${value.totalNo} No`);
    }

    // skip comment column
    rows[0].push('');
  });
  utils.sheet_add_aoa(worksheet, rows, opts);
  ++rowToColor;

  for (const i in worksheet) {
    const cell = utils.decode_cell(i);

    if ([rowToColor].includes(cell.r)) {
      // check if value present, then color cell
      if (worksheet[i].v) {
        worksheet[i].s = {
          fill: {
            fgColor: {
              rgb: 'E9E9E9',
            },
          },
        };
      }
    }
  }
};

const modifyChecklistWorkSheet = (
  worksheet: WorkSheet,
  columnData: ChecklistReportCols,
): void => {
  const {sections, ...dataWithoutSections} = columnData;
  const numberOfCols =
    (sections?.length ?? 0) + Object.keys(dataWithoutSections).length;

  // fill an array up to a length. This is done to set the width of all columns in the
  // excel to 28 as specified below
  worksheet['!cols'] = Array(numberOfCols)
    .fill(1, 0, numberOfCols)
    .map(() => ({
      wch: 28,
    }));
};

export const getChecklistReportName = (
  checklist: string,
  hospital: string,
  ward: string,
): string => {
  let name = checklist;
  name += `_${hospital || 'all'}`;
  name += `_${ward || 'all'}`;

  return name.concat('.xlsx');
};

export const sendChecklistReport = (data: {
  ctx: any;
  type: FileFormat;
  buffer: any;
  checklist: string;
  hospital: string;
  ward: string;
}): void => {
  const {ctx, type, buffer, checklist, hospital, ward} = data;

  ctx.attachment(getChecklistReportName(checklist, hospital, ward));
  ctx.type = getMimeType(type);
  ctx.set(
    'Access-Control-Expose-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Content-Disposition',
  );
  ctx.body = buffer;
};

export const generateChecklistReport = (
  checklist: Checklist,
  results: ChecklistResultTransformed[],
  type: FileFormat = FileFormat.XLSX,
  requestedChecklistType?: ComponentEnum,
): {buffer: any} => {
  let buffer = null;
  const workbook = utils.book_new();

  if (checklist) {
    const columnData = transformChecklistToColumns(
      checklist,
      requestedChecklistType,
    );
    let worksheet = utils.aoa_to_sheet(getColsData(columnData));
    addChecklistResults(worksheet, results, columnData);
    modifyChecklistWorkSheet(worksheet, columnData);
    utils.book_append_sheet(workbook, worksheet);
  }

  buffer = write(workbook, {
    type: 'buffer',
    bookType: type.toLowerCase() as BookType,
  });

  return {buffer};
};

export const calculateAverageScore = (data: ChecklistResult): string | null => {
  let totalScore = null,
    totalMarks = null;
  data.section.forEach(section => {
    section.ratings?.forEach(rating => {
      if (rating.performance != null) {
        totalScore ??= 0;
        totalMarks ??= 0;
        totalScore += rating.performance;
        totalMarks += 5;
      }

      if (rating.is_close_ended) {
        totalScore ??= 0;
        totalMarks ??= 0;
        totalScore += rating.booleanAnswer ? 5 : 0;
        totalMarks += 5;
      }
    });
  });

  if (totalScore === null || totalMarks === null) {
    return null;
  }

  const averageScore = (totalScore / totalMarks) * 100;

  return averageScore.toFixed(2);
};

export const transformChecklistResults = (
  results: ChecklistResult[],
): ChecklistResultTransformed[] => {
  return results.map(data => {
    const {name, surname} = data.users_permissions_user.profile;
    return {
      ...data,
      username: name + ' ' + surname,
      hospitalName: data.hospital.name,
      checklistName: data.checklist.name,
      averageScore: calculateAverageScore(data),
    };
  });
};

const getSectionsCols = (
  sections: Section[],
  requestedChecklistType: ComponentEnum,
): SectionCols[] => {
  const sectionCols: SectionCols[] = [];
  sections?.forEach(section => {
    const {title, answers, ratings} = section;

    if (requestedChecklistType === ComponentEnum.free_text) {
      answers?.forEach(item => {
        sectionCols.push({
          section: title,
          label: title + ': ' + item.question,
          question: item.question,
          checklistType: ComponentEnum.free_text,
          isComment: false,
        });

        sectionCols.push({
          section: title,
          label: title + ': ' + item.question + ' (comment)',
          question: item.question,
          checklistType: ComponentEnum.free_text,
          isComment: true,
        });
      });
    }

    if (requestedChecklistType === ComponentEnum.rating) {
      ratings?.forEach(item => {
        sectionCols.push({
          section: title,
          label: title + ': ' + item.question,
          question: item.question,
          checklistType: ComponentEnum.rating,
          isComment: false,
        });

        sectionCols.push({
          section: title,
          label: title + ': ' + item.question + ' (comment)',
          question: item.question,
          checklistType: ComponentEnum.rating,
          isComment: true,
        });
      });
    }
  });

  return sectionCols;
};

export const transformChecklistToColumns = (
  checklists: Checklist,
  requestedChecklistType: ComponentEnum,
): ChecklistReportCols => {
  const {section} = checklists;

  return {
    user: {
      field: 'username',
      label: 'User',
    },
    checklist: {
      field: 'checklistName',
      label: 'Checklist',
    },
    hospital: {
      field: 'hospitalName',
      label: 'Hospital',
    },
    ward: {
      field: 'ward',
      label: 'Ward',
    },
    department: {
      field: 'department',
      label: 'Department',
    },
    team: {
      field: 'visiting_team',
      label: 'Visiting Team',
    },
    submittedDate: {
      field: 'updatedAt',
      label: 'Submitted Date',
    },
    sections: getSectionsCols(section, requestedChecklistType),
    averageScore: {
      field: 'averageScore',
      label: 'Average Score (%)',
    },
  };
};

export const validateChecklistResult = (
  body: ChecklistResult,
  ctx: any,
): string => {
  if (!body.checklist) {
    return 'Checklist is required';
  }
  return;
};
