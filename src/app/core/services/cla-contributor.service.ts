// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectModel } from '../models/project';
import { UserModel } from '../models/user';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ActiveSignatureModel } from '../models/active-signature';
import { IndividualRequestSignatureModel } from '../models/individual-request-signature';
import { ProjectCompanySingatureModel } from '../models/project-company-signature';
import { OrganizationModel, OrganizationListModel } from '../models/organization';
import { InviteCompanyModel } from '../models/invite-company';
import { AddCompanyModel } from '../models/add-company';

@Injectable({
  providedIn: 'root'
})
export class ClaContributorService {
  baseURL = environment.baseUrl;
  v4BaseUrl = environment.v4BaseUrl;

  constructor(
    private httpClient: HttpClient,
    private alertService: AlertService
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

  requestToBeOnCompanyApprovedList(companyId: string, projectId: string, data: any): Observable<any> {
    const url = this.baseURL + 'v3/company/' + companyId + '/ccla-whitelist-requests/' + projectId;
    return this.httpClient.post<any>(url, data);
  }

  inviteManager(userLFID: string, data: any): Observable<InviteCompanyModel> {
    const url = this.v4BaseUrl + 'v4/user/' + userLFID + '/invite-company-admin';
    return this.httpClient.post<InviteCompanyModel>(url, data);
  }

  getProjectCompanySignature(projectId: string, companyId: string): Observable<ProjectCompanySingatureModel> {
    const url = this.baseURL + 'v3/signatures/project/' + projectId + '/company/' + companyId;
    return this.httpClient.get<ProjectCompanySingatureModel>(url);
  }

  addCompany(userId: string, data: any): Observable<AddCompanyModel> {
    const url = this.v4BaseUrl + 'v4/user/' + userId + '/company';
    return this.httpClient.post<AddCompanyModel>(url, data);
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
}
