// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

export class UserModel {
    date_created: Date;
    date_modified: Date;
    lf_email?: string;
    lf_sub?: string;
    lf_username?: string;
    note?: string;
    user_company_id: string;
    user_emails: string[];
    user_external_id?: string;
    user_github_id: string;
    user_github_username: string;
    user_id: string;
    user_ldap_id?: string;
    user_name?: string;
    version: string;
}


export class UpdateUserModel {
    companyID: string;
    dateCreated: Date;
    dateModified: Date;
    emails?: any;
    githubID: string;
    githubUsername: string;
    lfEmail: string;
    lfUsername: string;
    userID: string;
    username: string;
    version: string;
}

export class UserFromTokenModel {
    dateCreated: string
    dateModified: string
    emails: any
    lfEmail: string
    lfUsername: string
    userID: string
    username: string
    version: string
  }

  export class UserFromSessionModel {
    date_created: string
    date_modified: string
    lf_email: any
    lf_sub: any
    lf_username: any
    note: any
    user_company_id: any
    user_emails: string[]
    user_external_id: any
    user_github_id: string
    user_github_username: string
    user_gitlab_id: any
    user_gitlab_username: any
    user_id: string
    user_ldap_id: any
    user_name: string
    version: string
  }