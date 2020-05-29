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
}