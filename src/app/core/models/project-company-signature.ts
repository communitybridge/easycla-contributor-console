export class SignatureACL {
    companyID: string;
    dateCreated: Date;
    dateModified: Date;
    emails?: any;
    lfEmail: string;
    lfUsername: string;
    userID: string;
    username: string;
    version: string;
}

export class Signature {
    companyName: string;
    created: Date;
    domainApprovalList?: any;
    emailApprovalList?: any;
    githubOrgApprovalList?: any;
    githubUsernameApprovalList?: any;
    modified: Date;
    projectID: string;
    signatureACL: SignatureACL[];
    signatureApproved: boolean;
    signatureCreated: Date;
    signatureID: string;
    signatureMajorVersion: string;
    signatureMinorVersion: string;
    signatureModified: Date;
    signatureReferenceID: string;
    signatureReferenceName: string;
    signatureReferenceNameLower: string;
    signatureReferenceType: string;
    signatureSigned: boolean;
    signatureType: string;
    version: string;
}

export class ProjectCompanySingatureModel {
    projectID: string;
    resultCount: number;
    signatures: Signature[];
    totalCount: number;
}
