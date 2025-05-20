export interface UserAddressModel {
  addressLine: string;
  city: string;
  state: string;
  postCode: string;
}

export interface UserCommunicationModel {
  email: boolean;
  sms: boolean;
  phone: boolean;
}

export interface UserEmailSettingsModel {
  emailNotification?: boolean;
  sendCopyToPersonalEmail?: boolean;
  activityRelatesEmail?: {
    youHaveNewNotifications?: boolean;
    youAreSentADirectMessage?: boolean;
    someoneAddsYouAsAsAConnection?: boolean;
    uponNewOrder?: boolean;
    newMembershipApproval?: boolean;
    memberRegistration?: boolean;
  };
  updatesFromKeenthemes?: {
    newsAboutKeenthemesProductsAndFeatureUpdates?: boolean;
    tipsOnGettingMoreOutOfKeen?: boolean;
    thingsYouMissedSindeYouLastLoggedIntoKeen?: boolean;
    newsAboutStartOnPartnerProductsAndOtherServices?: boolean;
    tipsOnStartBusinessProducts?: boolean;
  };
}

export interface UserSocialNetworksModel {
  linkedIn: string;
  facebook: string;
  twitter: string;
  instagram: string;
}

export interface UserModel {
  // id: number
  // username: string
  // password: string | undefined
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  // fullname?: string
  // occupation?: string
  // companyName?: string
  // phone?: string
  // roles?: Array<number>
  // pic?: string
  // language?: 'en' | 'de' | 'es' | 'fr' | 'ja' | 'zh' | 'ru'
  // timeZone?: string
  // website?: 'https://keenthemes.com'
  // emailSettings?: UserEmailSettingsModel
  // auth?: AuthModel
  // communication?: UserCommunicationModel
  // address?: UserAddressModel
  // socialNetworks?: UserSocialNetworksModel
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RecruiterRefreshToken {
  token: string;
  expiryDate: number;
}

export interface Recruiter {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: string;
  totalSubmissions: number;
  successfulPlacements: number;
  performanceScore: number;
  createdAt: number;
  updatedAt: number;
  __v: number;
  refreshToken: RecruiterRefreshToken;
}

export interface AuthPayload {
  refreshToken: String;
  token: String;
  // recruiter: Recruiter;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  result: AuthPayload;
}
