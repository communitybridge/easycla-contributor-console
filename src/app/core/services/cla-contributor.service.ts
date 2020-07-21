// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectModel } from '../models/project';
import { UserModel } from '../models/user';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ActiveSignatureModel } from '../models/active-signature';
import { IndividualRequestSignatureModel } from '../models/individual-request-signature';
import { OrganizationModel, OrganizationListModel } from '../models/organization';
import { InviteCompanyModel } from '../models/invite-company';
import { AddCompanyModel } from '../models/add-company';
import { CLAManagersModel } from '../models/cla-manager';
import { AppSettings } from 'src/app/config/app-settings';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GerritUserModel } from '../models/gerrit';

@Injectable({
  providedIn: 'root'
})
export class ClaContributorService {
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

  getProject(projectId: string): Observable<ProjectModel> {
    const url = this.baseURL + 'v2/project/' + projectId;
    return this.httpClient.get<ProjectModel>(url);
  }

  getUserActiveSignature(userId: string): Observable<ActiveSignatureModel> {
    const url = this.baseURL + 'v2/user/' + userId + '/active-signature';
    return this.httpClient.get<ActiveSignatureModel>(url);
  }

  searchOrganization(searchText: string): Observable<OrganizationListModel> {
    const url = this.baseURL + 'v3/organization/search?companyName=' + searchText;
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

  inviteManager(userLFID: string, data: any): Observable<InviteCompanyModel> {
    const url = this.v4BaseUrl + 'v4/user/' + userLFID + '/invite-company-admin';
    return this.httpClient.post<InviteCompanyModel>(url, data);
  }

  getProjectCLAManagers(projectId: string, companyId: string): Observable<CLAManagersModel> {
    const url = this.v4BaseUrl + 'v4/company/' + companyId + '/cla-group/' + projectId + '/cla-managers';
    return this.httpClient.get<CLAManagersModel>(url);
  }

  addCompany(userId: string, data: any): Observable<AddCompanyModel> {
    const url = this.v4BaseUrl + 'v4/user/' + userId + '/company';
    return this.httpClient.post<AddCompanyModel>(url, data);
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
    const gerritUserModel: GerritUserModel = JSON.parse(this.storageService.getItem(AppSettings.GERRIT_USER));
    if (hasGerrit) {
      return gerritUserModel.lf_username;
    } else {
      return userModel.lf_username;
    }
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
