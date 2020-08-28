// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

export class OrganizationModel {
    companyACL: string[];
    companyExternalID: string;
    companyID: string;
    companyManagerID: string;
    companyName: string;
    created: string;
    updated: string;
}

export class OrganizationListModel {
    list: Organization[];
}
export class Organization {
    organization_id: string;
    organization_name: string;
    organization_website: string;
}

export class CompanyModel {
    companyID: string;
    companyName: string;
    companyWebsite: string;
    logoURL: string;
}