import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClaContributorService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getProject(projectId) {
    const url = 'https://api.dev.lfcla.com/v2/project/' + projectId;
    return this.httpClient.get(url);
  }
}
