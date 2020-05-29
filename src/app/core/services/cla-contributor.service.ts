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
import { StorageService } from 'src/app/shared/services/storage.service';
import { ProjectCompanySingatureModel } from '../models/project-company-signature';
import { OrganizationModel, OrganizationListModel } from '../models/organization';

@Injectable({
  providedIn: 'root'
})
export class ClaContributorService {
  baseURL = environment.baseUrl;

  constructor(
    private httpClient: HttpClient,
    private alertService: AlertService,
    private storageService: StorageService
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

  postEmailToCompanyAdmin(userId: string, data: any): Observable<any> {
    const url = this.baseURL + 'v2/user/' + userId + '/invite-company-admin';
    return this.httpClient.post<any>(url, data);
  }

  getProjectCompanySignature(projectId: string, companyId: string): Observable<ProjectCompanySingatureModel> {
    const url = this.baseURL + 'v3/signatures/project/' + projectId + '/company/' + companyId;
    return this.httpClient.get<ProjectCompanySingatureModel>(url);
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
