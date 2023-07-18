import {AuditModel, ID} from '../../../models/api-model';

export interface GetAssistanceCount {
  id: number;
  name: string;
  count: number;
}

export interface AssistanceDetail extends ID, AuditModel {
  name: string;
  address: string;
  telephone: string;
  email: string;
  website: string;
  assistance_category: AssistanceCategory;
}

export interface AssistanceCategory {
  id: number;
  name: string;
}
