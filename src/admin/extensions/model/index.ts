export enum FileFormat {
  CSV = 'CSV',
  XLSX = 'XLSX',
}

export interface Options<T = any> {
  value: T;
  label: string;
}

export enum ComponentEnum {
  free_text = 'checklist.free-text',
  rating = 'checklist.rating',
}

export interface ChecklistReportFormModel {
  checklist: Options | string;
  hospital: Options | string;
  ward: string;
  approved: boolean | undefined;
  submitted_date_from: string;
  submitted_date_to: string;
}

export interface HospitalResponse {
  data: {
    id: number;
    attributes: {
      name: string;
    };
  }[];
}

export interface ChecklistResponse {
  data: {
    id: number;
    attributes: {
      name: string;
    };
  }[];
}

export interface TrainingReportFormModel {
  title: Options | string;
  start_date_from: string;
  start_date_to: string;
  end_date_from: string;
  end_date_to: string;
}
