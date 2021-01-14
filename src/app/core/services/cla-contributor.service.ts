// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Project, ProjectModel } from '../models/project';
import { UpdateUserModel, UserModel } from '../models/user';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ActiveSignatureModel } from '../models/active-signature';
import { IndividualRequestSignatureModel } from '../models/individual-request-signature';
import { ClearBitModel, CompanyModel, OrganizationListModel, OrganizationModel } from '../models/organization';
import { EmployeeSignatureModel } from '../models/employee-signature';
import { InviteCompanyModel } from '../models/invite-company';
import { CLAManagersModel } from '../models/cla-manager';
import { AppSettings } from 'src/app/config/app-settings';
import { StorageService } from 'src/app/shared/services/storage.service';
import { GerritUserModel } from '../models/gerrit';
import { CompanyAdminDesigneeModel, CompnayAdminListModel } from '../models/company-admin-designee';
import { EnvConfig } from 'src/app/config/cla-env-utils';

declare const require: any;
const FileSaver = require('file-saver');

@Injectable({
  providedIn: 'root'
})
export class ClaContributorService {
  public openDialogModalEvent = new Subject<any>();
  public proccedWithExistingOrganizationEvent = new Subject<any>();

  baseURL = EnvConfig.default['api-base'] + '/';
  v4BaseUrl = EnvConfig.default['api-v4-base'] + '/';
  corporateV2Base = EnvConfig.default['corporate-v2-base'] + '/';

  constructor(
    private httpClient: HttpClient,
    private alertService: AlertService,
    private storageService: StorageService,
  ) { }

  getUser(userId: string): Observable<UserModel> {
    const url = this.baseURL + 'v2/user/' + userId;
    return this.httpClient.get<UserModel>(url);
  }

  updateUser(data: any): Observable<UpdateUserModel> {
    const url = this.baseURL + 'v3/users';
    return this.httpClient.put<UpdateUserModel>(url, data);
  }

  getProject(projectId: string): Observable<ProjectModel> {
    const url = this.baseURL + 'v2/project/' + projectId;
    return this.httpClient.get<ProjectModel>(url);
  }

  getUserActiveSignature(userId: string): Observable<ActiveSignatureModel> {
    const url = this.baseURL + 'v2/user/' + userId + '/active-signature';
    return this.httpClient.get<ActiveSignatureModel>(url);
  }

  searchOrganization(organizationName: string, organizationWebsite?: string): Observable<OrganizationListModel> {
    let url = this.baseURL + 'v3/organization/search?';
    if (organizationName) {
      url += 'companyName=' + organizationName;
    }
    if (organizationWebsite) {
      url += 'websiteName=' + organizationWebsite;
    }
    return this.httpClient.get<OrganizationListModel>(url);
  }

  getClearBitData(organizationWebsite: string): Observable<ClearBitModel> {
    const url = this.v4BaseUrl + 'v4/company/lookup?websiteName=' + organizationWebsite;
    return this.httpClient.get<ClearBitModel>(url);
  }

  hasOrganizationExist(organizationName: string, organizationWebsite: string): Observable<OrganizationListModel> {
    let url = this.baseURL + 'v3/organization/search?';
    if (organizationName) {
      url += '$filter=name eq ' + organizationName;
    }
    if (organizationWebsite) {
      url += '$filter=website eq ' + organizationWebsite;
    }
    return this.httpClient.get<OrganizationListModel>(url);
  }

  getOrganizationDetails(companySFID: string): Observable<OrganizationModel> {
    const url = this.baseURL + 'v3/company/external/' + companySFID;
    return this.httpClient.get<OrganizationModel>(url);
  }

  getSigningEntityNameDetails(signingEntityName: string, companySFID: string): Observable<OrganizationModel> {
    const url = this.baseURL + 'v3/company/signing-entity-name?name=' + signingEntityName + '&companySFID=' + companySFID;
    return this.httpClient.get<OrganizationModel>(url);
  }

  postIndividualSignatureRequest(data: any): Observable<IndividualRequestSignatureModel> {
    const url = this.baseURL + 'v2/request-individual-signature';
    return this.httpClient.post<IndividualRequestSignatureModel>(url, data);
  }

  CheckPreparedEmployeeSignature(data: any): Observable<any> {
    const url = this.baseURL + 'v2/check-prepare-employee-signature';
    return this.httpClient.post<any>(url, data);
  }

  postEmployeeSignatureRequest(signatureRequest: any): Observable<EmployeeSignatureModel> {
    const url: string = this.baseURL + 'v2/request-employee-signature';
    return this.httpClient.post<EmployeeSignatureModel>(url, signatureRequest);
  }

  getLastIndividualSignature(userId: string, projectId: string): Observable<any> {
    const url = this.baseURL + 'v2/user/' + userId + '/project/' + projectId + '/last-signature';
    return this.httpClient.get<InviteCompanyModel>(url);
  }

  getGerritUserInfo(): Observable<GerritUserModel> {
    const url = this.baseURL + 'v1/user/gerrit';
    return this.httpClient.post<GerritUserModel>(url, '');
  }

  getGerritProjectInfo(projectId: string): Observable<ProjectModel> {
    const url = this.baseURL + 'v2/project/' + projectId;
    return this.httpClient.get<ProjectModel>(url);
  }

  inviteManager(userLFID: string, data: any): Observable<CompanyAdminDesigneeModel> {
    const url = this.v4BaseUrl + 'v4/user/' + userLFID + '/invite-company-admin';
    return this.httpClient.post<CompanyAdminDesigneeModel>(url, data);
  }

  getProjectCLAManagers(projectId: string, companyId: string): Observable<CLAManagersModel> {
    const url = this.v4BaseUrl + 'v4/company/' + companyId + '/cla-group/' + projectId + '/cla-managers';
    return this.httpClient.get<CLAManagersModel>(url);
  }

  addCompany(userId: string, data: any): Observable<CompanyModel> {
    const url = this.v4BaseUrl + 'v4/user/' + userId + '/company';
    return this.httpClient.post<CompanyModel>(url, data);
  }

  getCompanyAdminList(companySFID: string): Observable<CompnayAdminListModel> {
    const url = this.v4BaseUrl + 'v4/company/' + companySFID + '/admin';
    return this.httpClient.get<CompnayAdminListModel>(url);
  }

  addAsCLAManagerDesignee(companyId: string, projectId: string, data: any): Observable<any> {
    const url = this.v4BaseUrl + 'v4/company/' + companyId + '/claGroup/' + projectId + '/cla-manager-designee';
    return this.httpClient.post<any>(url, data);
  }

  notifyCLAMangers(data: any): Observable<any> {
    const url = this.v4BaseUrl + 'v4/notify-cla-managers';
    return this.httpClient.post<any>(url, data);
  }

  handleError(errorObj: any) {
    const errors = errorObj.error.errors;
    if (errors) {
      for (const property in errors) {
        if (property) {
          const errorMsg = property + ': ' + errors[property];
          this.alertService.error(errorMsg);
        }
      }
    }
  }

  getUserLFID(): string {
    const hasGerrit = JSON.parse(this.storageService.getItem(AppSettings.HAS_GERRIT));
    const userModel: UserModel = JSON.parse(this.storageService.getItem(AppSettings.USER));
    const gerritUserModel: GerritUserModel = JSON.parse(this.storageService.getItem(AppSettings.AUTH_DATA));
    if (hasGerrit) {
      return gerritUserModel.lf_username;
    } else {
      return userModel.lf_username;
    }
  }

  getLFXCorporateURL(): string {
    let url = '';
    // Load the CLA Group models from local storage - should only be 1 CLA Group
    const project: ProjectModel = JSON.parse(this.storageService.getItem(AppSettings.PROJECT));
    // We may have zero or more SF Projects attached to this CLA Group
    const projectDetails = project.projects;

    // TODO: figure out the github repository that was used to come here...
    // pick the matching SF Project based on the repository name, instead of just using the first project in the list

    // No SF Projects for this CLA Group
    if (projectDetails.length === 0) {
      // No SFID associated with project so redirect at corporate console dashboard.
      url = this.corporateV2Base + 'company/dashboard';
    } else if (project.signed_at_foundation_level) {
      // Signed at foundation level.
      url = this.corporateV2Base + 'foundation/' + projectDetails[0].foundation_sfid + '/cla';
    } else {
      const project = this.getProjectFromRepo(projectDetails);
      if (project !== null) {
        // For standalone project we must redirect to the SFID of The Linux Foundation
        url = this.corporateV2Base + 'foundation/' + project.foundation_sfid + '/project/' + project.project_sfid + '/cla';
      } else {
        this.alertService.error('Unable to find project by repository, please contact to your administrator.');
      }
    }
    return url;
  }

  getProjectFromRepo(projects: Project[]) {
    const repoURL = JSON.parse(this.storageService.getItem(AppSettings.REDIRECT));
    if (repoURL) {
      for (const project of projects) {
        // Checked in Github Repo
        if (project.github_repos.length > 0) {
          const repos = project.github_repos;
          for (const repo of repos) {
            if (repoURL.indexOf(repo.repository_name) >= 0) {
              return project;
            }
          }
        }
        // Checked in Gerrit Repo
        if (project.gerrit_repos.length > 0) {
          const repos = project.gerrit_repos;
          for (const repo of repos) {
            if (repoURL.indexOf(repo.gerrit_url) >= 0) {
              return project;
            }
          }
        }
      }
    }
    return null;
  }

  getUserPublicEmail(): string {
    const hasGerrit = JSON.parse(this.storageService.getItem(AppSettings.HAS_GERRIT));
    const userModel: UserModel = JSON.parse(this.storageService.getItem(AppSettings.USER));
    const gerritUserModel: GerritUserModel = JSON.parse(this.storageService.getItem(AppSettings.USER));
    let emails;
    if (hasGerrit) {
      return gerritUserModel.lf_email;
    } else {
      if (userModel.lf_email) {
        return userModel.lf_email;
      }
      emails = userModel.user_emails;
    }
    return this.findPublicEmail(emails);
  }

  findPublicEmail(emailArray) {
    for (const email of emailArray) {
      if (email.indexOf(AppSettings.GITHUB_EMAIL_CONTENT) < 0) {
        return email;
      }
    }
    return null;
  }

  downloadFile(projectId: string, claType: string) {
    const url = this.v4BaseUrl + 'v4/template/' + projectId + '/preview?watermark=true&claType=' + claType;
    let fileName = claType === 'icla' ? 'Individual_Contributor' : 'Corporate_Contributor';
    fileName += '_License_Agreement.pdf';
    this.saveAs(url, fileName);
  }

  saveAs(URLToPDF, fileName) {
    const oReq = new XMLHttpRequest();
    oReq.open('GET', URLToPDF, true);
    oReq.responseType = 'blob';
    oReq.onload = () => {
      const file = new Blob([oReq.response], {
        type: 'application/pdf'
      });
      FileSaver.saveAs(file, fileName);
    };

    oReq.send();
  }
}
