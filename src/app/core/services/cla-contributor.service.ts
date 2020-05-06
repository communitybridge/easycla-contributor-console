// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ClaContributorService {
  baseURL = environment.baseUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  getProject(projectId): Observable<Project> {
    const url = this.baseURL + 'v2/project/' + projectId;
    return this.httpClient.get<Project>(url);
  }
}
