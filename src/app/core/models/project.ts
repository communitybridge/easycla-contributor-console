// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT
// This is actually a CLA Group model (but we call it ProjectModel for historical reasons)
export class ProjectModel {
  date_created: Date;
  date_modified: Date;
  foundation_sfid: string;
  project_acl: string[];
  project_ccla_enabled: boolean;
  project_ccla_requires_icla_signature: boolean;
  project_corporate_documents: ProjectCorporateDocument[];
  project_icla_enabled: boolean;
  project_id: string;
  project_individual_documents: ProjectIndividualDocument[];
  project_member_documents: any[];
  project_name: string;
  project_name_lower: string;
  version: string;
  logoUrl: string;
  projects: Project[];
  signed_at_foundation_level: boolean;
}

export class ProjectCorporateDocument {
  document_name: string;
  document_file_id: string;
  document_content_type: string;
  document_content?: any;
  document_author_name: string;
  document_major_version: number;
  document_minor_version: number;
  document_creation_date: Date;
  document_preamble: string;
  document_legal_entity_name: string;
  document_s3_url: string;
  document_tabs: string[][];
}

export class ProjectIndividualDocument {
  document_name: string;
  document_file_id: string;
  document_content_type: string;
  document_content?: any;
  document_author_name: string;
  document_major_version: number;
  document_minor_version: number;
  document_creation_date: Date;
  document_preamble: string;
  document_legal_entity_name: string;
  document_s3_url: string;
  document_tabs: string[][];
}

// Project CLA Group mapping record/model
export class Project {
  cla_group_id: string;
  cla_group_name: string;
  date_created: Date;
  date_modified: Date;
  foundation_name?: any;
  foundation_sfid: string;
  note?: any;
  project_name: string;
  project_sfid: string;
  repositories_count: string;
  standalone_project: boolean;
  lf_supported: boolean;
  version: string;
  github_repos: GithubRepository[];
  gerrit_repos: GerritRepository[];
}

// Github Repository Model
export class GithubRepository {
  date_created: string;
  date_modified: string;
  enabled: boolean;
  note?: any;
  project_sfid: string;
  repository_external_id: string;
  repository_id: string;
  repository_name: string;
  repository_organization_name: string;
  repository_project_id: string;
  repository_sfdc_id: string;
  repository_type: string;
  repository_url: string;
  version: string;
}


// Gerrit Repository Model
export class GerritRepository {
  date_created: string;
  date_modified: string;
  gerrit_id: string;
  gerrit_name: string;
  gerrit_url: string;
  group_id_ccla: string;
  group_id_icla: string;
  group_name_ccla: string;
  group_name_icla: string;
  project_id: string;
  project_sfid: string;
  version: string;
}
