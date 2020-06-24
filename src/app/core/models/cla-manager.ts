export class CLAManagerModel {
    approved_on: Date;
    cla_group_name: string;
    email: string;
    lf_username: string;
    name: string;
    organization_name: string;
    organization_sfid: string;
    project_id: string;
    project_name: string;
    project_sfid: string;
    user_sfid: string;
}

export class CLAManagersModel {
    list: CLAManagerModel[];
}