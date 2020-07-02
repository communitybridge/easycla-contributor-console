// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT
export class GerritUserModel {
    date_created: Date;
    date_modified: Date;
    lf_email: string;
    lf_sub?: any;
    lf_username: string;
    note?: any;
    user_company_id: string;
    user_emails?: any;
    user_external_id?: any;
    user_github_id?: any;
    user_github_username?: any;
    user_id: string;
    user_ldap_id?: any;
    user_name: string;
    version: string;
}

export class GerritModel {
    date_created: Date;
    date_modified: Date;
    gerrit_id: string;
    gerrit_name: string;
    gerrit_url: string;
    group_id_ccla: string;
    group_id_icla: string;
    group_name_ccla: string;
    group_name_icla: string;
    project_id: string;
    version: string;
}
