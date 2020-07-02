// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT
export class ProjectModel {
    date_created: Date;
    date_modified: Date;
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
