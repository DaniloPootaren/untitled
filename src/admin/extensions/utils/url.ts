import {FileFormat} from '../model';
import {ComponentEnum} from '../../../models/api-model';

export const CONTENT_MANAGER = 'content-manager';
export const COLLECTION_TYPE = 'collectionType';

const API_URL = '/api/';

export const constructAdminApiUrl = (slug: string, filters: string): string => {
  return `${API_URL}getTrainingReport${filters}`;
};

export const constructTrainingUrl = (
  slug: string,
  filters: string,
  fileFormat: FileFormat,
): string => {
  filters = (filters || '?') + (filters ? '&' : '') + `type=${fileFormat}`;
  return constructAdminApiUrl(slug, filters);
};

export const constructChecklistReportUrl = (
  filters: string,
  format: ComponentEnum,
): string => {
  filters = (filters || '?') + (filters ? '&' : '') + `checklistType=${format}`;
  return `${API_URL}generateChecklistReport${filters}`;
};

export const constructHospitalApi = (): string => {
  return `${API_URL}hospitals`;
};

export const constructChecklistApi = (): string => {
  return `${API_URL}checklists`;
};

export const getUpdateEventApiUrl = (id: number, notified: boolean): string =>
  `${API_URL}updateEvent?id=${id}&notified=${notified}`;

export const getCurrentSlug = (pathname: string): string => {
  const paths = pathname.split('/');
  return paths.find(path => path.includes('api'));
};

export const constructSearchTitleApi = (): string => {
  return `${API_URL}searchTrainingTitle`;
};
