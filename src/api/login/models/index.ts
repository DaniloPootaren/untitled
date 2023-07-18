export interface Login {
  email: string;
  password: string;
  job: string;
  license_no: string;
  department: number;
}

export type MaupassPayload = {
  email: string;
  password: string;
};

export enum RoleEnum {
  HW = 'HW',
  IPC = 'IPC',
}

export interface MaupassResponse {
  data: {
    result: {
      accessToken: string;
      encryptedAccessToken: string;
      expireInSeconds: number;
      shouldResetPassword: boolean;
      passwordResetCode: null;
      userId: number;
      requiresTwoFactorVerification: boolean;
      twoFactorAuthProviders: string[];
      twoFactorRememberClientToken: null;
      returnUrl: null;
      refreshToken: string;
      refreshTokenExpireInSeconds: number;
      shouldRegisterDevice: boolean;
    };
    targetUrl: null;
    success: boolean;
    error: null;
    unAuthorizedRequest: boolean;
    __abp: boolean;
  };
}

export interface MaupassGetCurrentUserProfileResponse {
  data: {
    result: Me;
    targetUrl: null;
    success: boolean;
    error: null;
    unAuthorizedRequest: boolean;
    __abp: boolean;
  };
}

export type Me = {
  userName: string;
  name: string;
  surname: string;
  surnameAtBirth: string;
  gender: string;
  dateOfBirth: string;
  isCitizen: boolean;
  passportNumber: string;
  nic: string;
  isTwoFactorEnabled: boolean;
  otpPreference: null;
  creationTime: string;
  emailAddress: string;
  phoneNumber: string;
  fixedLineNumber: null;
  address: string;
  city: string;
  country: string;
  nationality: string;
  state: string;
  townVillage: string;
  zipCode: string;
  subLocalityId: number;
  townVillageId: number;
  subLocalityName: string;
};

export type LoginResponse = {
  access_token?: string;
  role?: RoleEnum;
  me?: Me;
  profileId: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
};
