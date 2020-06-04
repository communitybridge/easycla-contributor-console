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
