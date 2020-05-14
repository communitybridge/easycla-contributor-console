// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { ProjectCorporateDocument } from './project-corporate-document';
import { ProjectIndividualDocument } from './project-individual-document';

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
