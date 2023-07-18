import {RoleEnum} from '../api/login/models';

export interface ApiModel<T = any> {
  pagination: Pagination;
  results: T[];
}

export interface Pagination {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}

export interface AdminUser {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
}

export interface ID {
  id: number;
}

export interface AuditModel {
  createdAt: string;
  createdBy: AdminUser;
  updatedAt: string;
  updatedBy: AdminUser;
}

export interface Training extends AuditModel, ID {
  content: string;
  title: string;
  pre_test: {
    passing_marks: number;
  };
  post_test: {
    passing_marks: number;
  };
  start_date: string;
  end_date: string;
  image: ImageModel;
}

export interface TrainingApiTransformed {
  imageUrl: string;
  content: string;
  title: string;
  pre_test_passing_mark: number;
  post_test_passing_mark: number;
  start_date: string;
  end_date: string;
}

export interface ImageModel {
  id: string;
  // contains other properties which are omitted here
  url: string;
}

export interface User extends AuditModel, ID {
  blocked: boolean;
  confirmed: boolean;
  email: string;
  username: string;
  profile: Profile;
  role: Role;
  test_results?: TestResult[];
}

export interface Role extends ID, AuditModel {
  name: RoleEnum;
  description: string;
  type: string;
  permissions: any[];
}

export interface Profile extends AuditModel, ID {
  license_no: string;
  name: string;
  surname: string;
  nic: string;
  dob: string;
  job: Job;
}

export interface Job extends AuditModel, ID {
  Position: string;
}

export interface UserTraining extends ID {
  username: string;
  profile: Profile;
  test_results: TestResult[];
  training_feedbacks?: TrainingFeedback[];
}

export interface TrainingFeedback extends ID, AuditModel {
  comment: string;
  rating: number;
  training: Training;
}

export enum TrainingStatus {
  available = 'available',
  pending = 'pending',
  completed = 'completed',
}

export interface TestResult extends ID, AuditModel {
  status: TrainingStatus;
  training: Training;
  pre_test_result: TestResultDetail;
  post_test_result: TestResultDetail;
  feedback?: {
    comment: string;
    rating: number;
  };
  users_permissions_user: User;
}

export interface TestResultDetail extends ID {
  score: number;
  questions_passed: Record<string, string>;
  questions_failed: Record<string, string>;
}

export enum FailSuccess {
  Failed = 'Failed',
  Passed = 'Passed',
}

export interface TransformedTrainingModel {
  trainingId: number;
  user: string;
  nic: string;
  training: string;
  submittedDate: string;
  pre_test_score: number;
  post_test_score: number;
  pre_test_pass_mark: number;
  post_test_pass_mark: number;
  pre_test_result: FailSuccess;
  post_test_result: FailSuccess;
}

export interface TestMetrics {
  number_of_trainee: number;
  pre_test_average_score: string;
  post_test_average_score: string;
}

export interface GroupedTraining {
  [training: string]: TransformedTrainingModel[];
}

export enum MimeType {
  CSV = 'text/csv',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

interface YoutubeLink {
  id: number;
  link: string;
}

export interface ContactInfo {
  id: number;
  email: string;
  phonenumber: number;
  description: string;
  address: string;
}

export interface FileData {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width: null;
  height: null;
  formats: null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
}

interface ImageData {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: {
    large: {
      ext: string;
      url: string;
      hash: string;
      mime: string;
      name: string;
      path: null;
      size: number;
      width: number;
      height: number;
    };
    small: {
      ext: string;
      url: string;
      hash: string;
      mime: string;
      name: string;
      path: null;
      size: number;
      width: number;
      height: number;
    };
    medium: {
      ext: string;
      url: string;
      hash: string;
      mime: string;
      name: string;
      path: null;
      size: number;
      width: number;
      height: number;
    };
    thumbnail: {
      ext: string;
      url: string;
      hash: string;
      mime: string;
      name: string;
      path: null;
      size: number;
      width: number;
      height: number;
    };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  content: string;
  image: ImageData;
  youtube: YoutubeLink[];
  contact_info: ContactInfo;
  files: FileData[];
  article_sub_category: ArticleSubCategory[];
}

export interface ArticleSubCategory extends ID, AuditModel {
  name: string;
  articles: Article[];
  rank: number;
}

export interface HomeMainCategory extends ID, AuditModel {
  article_sub_categories: ArticleSubCategory[];
  name: string;
}

export interface MobileMainCategory extends ID {
  mainCategory: string;
  count: number;
  articles: Article[];
  subCategories: ArticleSubCategory[];
}

export enum ChecklistStatus {
  pending = 'pending',
  submitted = 'submitted',
}

export interface Hospital extends ID, AuditModel {
  name: string;
}

export enum ComponentEnum {
  free_text = 'checklist.free-text',
  rating = 'checklist.rating',
  admin_free_text = 'checklist.admin-free-text',
  admin_rating = 'checklist.admin-rating',
}

export interface Answer extends ID {
  question: string;
  response: string;
  comment: string;
  is_close_ended: boolean;
  booleanAnswer: boolean;
}

export interface Rating extends ID {
  performance: number;
  comment: string;
  question: string;
  is_close_ended: boolean;
  booleanAnswer: boolean;
}

export interface Section extends ID {
  __component: ComponentEnum;
  title: string;
  answers?: Answer[];
  ratings?: Rating[];
}

export interface ChecklistResult extends ID, AuditModel {
  department: string;
  approved: boolean;
  ward: string;
  visiting_team: string;
  general_comment: string;
  status: ChecklistStatus;
  users_permissions_user: User;
  hospital: Hospital;
  section: Section[];
  checklist?: {
    name: string;
    id: number;
  } & ChecklistResult['section'];
}

export interface Checklist extends ID, AuditModel {
  name: string;
  section: Section[];
}

export interface ChecklistResultTransformed extends ChecklistResult {
  username: string;
  hospitalName: string;
  checklistName: string;
  averageScore: string;
}

export interface GroupedChecklist {
  [date: string]: ChecklistResult[];
}

export interface ChecklistResultApiModel {
  date: string;
  results: ChecklistResult[];
}

export interface ChecklistReportModel {}

export interface FieldLabel<T = any> {
  field: keyof T; // field name
  label: string; // label to display in column
}

export interface SectionCols {
  section: string; // title of section e.g Isolation
  question: string;
  label: string;
  checklistType: ComponentEnum;
  isComment: boolean;
}

export interface ChecklistReportCols {
  checklist: FieldLabel<ChecklistResultTransformed>;
  user: FieldLabel<ChecklistResultTransformed>;
  hospital: FieldLabel<ChecklistResultTransformed>;
  ward: FieldLabel<ChecklistResultTransformed>;
  department: FieldLabel<ChecklistResultTransformed>;
  team: FieldLabel<ChecklistResultTransformed>;
  submittedDate: FieldLabel<ChecklistResultTransformed>;
  sections: SectionCols[];
  averageScore: FieldLabel<ChecklistResultTransformed>;
}

export interface ChecklistResultRatingScore {
  [question: string]: {
    columnIndex: number;
    totalRecord: number;
    totalScore?: number;
    totalYes?: number;
    totalNo?: number;
    displayScore: boolean;
  };
}

export interface EventModel {
  name: string;
  description: string;
  image: ImageModel;
  venue: string;
  important: boolean;
  start_date: string;
  end_date: string;
  views: number;
}

export interface ArticleModel {
  id: number;
  title: string;
  content: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  views: number;
}

interface ResultScore extends ID {
  score: number;
}

export enum ArticleApiEnum {
  MO_NEWS = 'mo-news',
  LATEST_NEWS = 'latest-news',
  MOST_POPULAR = 'most-popular',
}
