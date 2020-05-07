// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

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
