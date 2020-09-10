// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectModel } from '../models/project';
import { UserModel, UpdateUserModel } from '../models/user';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ActiveSignatureModel } from '../models/active-signature';
import { IndividualRequestSignatureModel } from '../models/individual-request-signature';
import { OrganizationModel, OrganizationListModel, CompanyModel } from '../models/organization';
import { EmployeeSignatureModel } from '../models/employee-signature';
import { InviteCompanyModel } from '../models/invite-company';
import { CLAManagersModel } from '../models/cla-manager';
import { AppSettings } from 'src/app/config/app-settings';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GerritUserModel } from '../models/gerrit';
import { CompanyAdminDesigneeModel, CompnayAdminListModel } from '../models/company-admin-designee';
declare const require: any
const FileSaver = require('file-saver');

@Injectable({
  providedIn: 'root'
})
export class ClaContributorService {
  public openDialogModalEvent = new Subject<any>();
  public proccedWithExistingOrganizationEvent = new Subject<any>();

  baseURL = environment.baseUrl;
  v4BaseUrl = environment.v4BaseUrl;

  constructor(
    private httpClient: HttpClient,
    private alertService: AlertService,
    private storageService: StorageService,
    private authService: AuthService
  ) { }

  getUser(userId: string): Observable<UserModel> {
    const url = this.baseURL + 'v2/user/' + userId;
    return this.httpClient.get<UserModel>(url);
  }

  updateUser(data: any): Observable<UpdateUserModel> {
    const url = this.baseURL + 'v3/users';
    return this.httpClient.put<UpdateUserModel>(url, data, this.getHeaders());
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
    return this.httpClient.post<GerritUserModel>(url, '', this.getHeaders());
  }

  getGerritProjectInfo(projectId: string): Observable<ProjectModel> {
    const url = this.baseURL + 'v2/project/' + projectId;
    return this.httpClient.get<ProjectModel>(url, this.getHeaders());
  }

  inviteManager(userLFID: string, data: any): Observable<CompanyAdminDesigneeModel> {
    const url = this.v4BaseUrl + 'v4/user/' + userLFID + '/invite-company-admin';
    return this.httpClient.post<CompanyAdminDesigneeModel>(url, data);
  }

  setContributorAssociation(companySFID: string, claGroupID: string, data: any): Observable<any> {
    const url = this.v4BaseUrl + 'v4/company/' + companySFID + '/claGroup/' + claGroupID + '/contributorAssociation';
    return this.httpClient.post<any>(url, data);
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
    return this.httpClient.post<any>(url, data, this.getHeaders());
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

  getHeaders() {
    return { headers: this.getHttpClientHeaders() };
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
    const project: ProjectModel = JSON.parse(this.storageService.getItem(AppSettings.PROJECT));
    const projectDetails = project.projects;
    if (projectDetails.length === 0) {
      // No SFID associated with project so redirect at corporate console dashboard.
      url = environment.lfxCorporateUrl + 'company/dashboard';
    } else if (project.signed_at_foundation_level) {
      // Signed at foundation level.
      url = environment.lfxCorporateUrl + 'foundation/' + projectDetails[0].foundation_sfid + '/cla';
    } else {
      // Signed at project level.
      url = environment.lfxCorporateUrl + 'foundation/' + projectDetails[0].foundation_sfid + '/project/' + projectDetails[0].project_sfid + '/cla';
    }
    return url;
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
    fileName += '_License_Agreement.pdf'
    this.saveAs(url, fileName);
  }

  saveAs(URLToPDF, fileName) {
    const oReq = new XMLHttpRequest();
    oReq.open('GET', URLToPDF, true);
    oReq.responseType = 'blob';
    oReq.onload = function () {
      const file = new Blob([oReq.response], {
        type: 'application/pdf'
      });
      FileSaver.saveAs(file, fileName);
    };

    oReq.send();
  }

  hasTokenValid() {
    const tokenId = this.authService.getIdToken();
    if (tokenId !== undefined && tokenId !== null && tokenId.length > 0) {
      return true;
    }
    return false;
  }

  private getHttpClientHeaders(): HttpHeaders {
    const tokenId = this.authService.getIdToken();
    if (tokenId !== undefined && tokenId !== null && tokenId.length > 0) {
      return new HttpHeaders({
        'Content-Type': AppSettings.HEADER_CONTENT_TYPE,
        Accept: AppSettings.HEADER_CONTENT_TYPE,
        Authorization: 'Bearer ' + tokenId
      });
    }
    return new HttpHeaders({
      'Content-Type': AppSettings.HEADER_CONTENT_TYPE,
      Accept: AppSettings.HEADER_CONTENT_TYPE
    });
  }
}
