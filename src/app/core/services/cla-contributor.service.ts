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

@Injectable({
  providedIn: 'root'
})
export class ClaContributorService {
  baseURL = environment.baseUrl;

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

  searchOrganization(searchText: string): Observable<any> {
    const url = 'https://api-gw.dev.platform.linuxfoundation.org/v1/orgs/search?name=' + searchText;
    return this.httpClient.get<any>(url);
  }

  postIndividualSignatureRequest(data: any): Observable<IndividualRequestSignatureModel> {
    const url = this.baseURL + 'v2/request-individual-signature';
    return this.httpClient.post<IndividualRequestSignatureModel>(url, data);
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
