
export class EmployeeSignatureModel {
    date_created: Date;
    date_modified: Date;
    domain_whitelist?: any;
    email_whitelist?: any;
    github_org_whitelist?: any;
    github_whitelist?: any;
    note?: any;
    signatory_name?: any;
    signature_acl: string[];
    signature_approved: boolean;
    signature_callback_url?: any;
    signature_company_initial_manager_email?: any;
    signature_company_initial_manager_id?: any;
    signature_company_initial_manager_name?: any;
    signature_company_secondary_manager_list?: any;
    signature_company_signatory_email?: any;
    signature_company_signatory_id?: any;
    signature_company_signatory_name?: any;
    signature_document_major_version: string;
    signature_document_minor_version: string;
    signature_envelope_id?: any;
    signature_external_id?: any;
    signature_id: string;
    signature_project_external_id?: any;
    signature_project_id: string;
    signature_reference_id: string;
    signature_reference_name?: any;
    signature_reference_name_lower?: any;
    signature_reference_type: string;
    signature_return_url: string;
    signature_return_url_type?: any;
    signature_sign_url?: any;
    signature_signed: boolean;
    signature_type: string;
    signature_user_ccla_company_id: string;
    signed_on?: any;
    sigtype_signed_approved_id?: any;
    user_email?: any;
    user_github_username?: any;
    user_name?: any;
    version: string;
}

