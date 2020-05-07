import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../core/models/project';

@Injectable({
  providedIn: 'root'
})
export class ClaContributorService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getProject(projectId): Observable<Project> {
    const url = 'https://api.dev.lfcla.com/v2/project/' + projectId;
    return this.httpClient.get<Project>(url);
  }
}
