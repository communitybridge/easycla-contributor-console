// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

export class CompanyAdminDesignee {
    assigned_on: string;
    company_sfid: string;
    email: string;
    lf_username: string;
    name: string;
    project_name: string;
    project_sfid: string;
    type: string;
    user_sfid: string;
}

export class CompanyAdminDesigneeModel {
    list: CompanyAdminDesignee[];
}


export interface CompanyAdminModel {
    email: string;
    id: string;
    username: string;
}

export interface CompnayAdminListModel {
    list: CompanyAdminModel[];
}