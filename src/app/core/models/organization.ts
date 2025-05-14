// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

export class OrganizationModel {
  companyACL: string[];
  companyExternalID: string;
  companyID: string;
  companyManagerID: string;
  companyName: string;
  signingEntityName: string;
  created: string;
  updated: string;
  isSanctioned:string;
}

export class OrganizationListModel {
  list: Organization[];
}

export class Organization {
  ccla_enabled: boolean;
  organization_id: string;
  organization_name: string;
  organization_website: string;
  signing_entity_names: string[];
}

export class CompanyModel {
  companyID: string;
  companyName: string;
  companyWebsite: string;
  logoURL: string;
}
export class ClearBitModel {
  Employees: string;
  ID: string;
  Industry: string;
  Link: string;
  Name: string;
  Sector: string;
  Source: string;
  signingEntityNames: string[];
}
