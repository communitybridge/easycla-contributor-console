// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { ProjectModel } from 'src/app/core/models/project';
import { UserModel } from 'src/app/core/models/user';
import { StorageService } from '../../services/storage.service';
import { AppSettings } from 'src/app/config/app-settings';

@Component({
  selector: 'app-project-title',
  templateUrl: './project-title.component.html',
  styleUrls: ['./project-title.component.scss']
})
export class ProjectTitleComponent implements AfterViewInit {
  @Output() errorEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() successEmitter: EventEmitter<any> = new EventEmitter<any>();

  project = new ProjectModel();
  user = new UserModel();

  constructor(
    private alertService: AlertService,
    private storageService: StorageService,
    private claContributorService: ClaContributorService,
  ) {
   }

  ngAfterViewInit(): void {
    const hasGerrit = JSON.parse(this.storageService.getItem(AppSettings.HAS_GERRIT));
    if (hasGerrit) {
      this.project.project_name = JSON.parse(this.storageService.getItem(AppSettings.PROJECT_NAME));
    } else {
      this.validateGithubFlow();
    }
  }

  validateGithubFlow() {
    this.getProject();
  }

  getProject() {
    const projectId = JSON.parse(this.storageService.getItem(AppSettings.PROJECT_ID));
    if (projectId) {
      this.claContributorService.getProject(projectId).subscribe(
        (response) => {
          this.project = response;
          this.storageService.setItem(AppSettings.PROJECT_NAME, this.project.project_name);
          this.storageService.setItem(AppSettings.PROJECT_ID, projectId);
          this.storageService.setItem(AppSettings.PROJECT, this.project);
          this.successEmitter.emit(response);
          this.getUser();
        },
        (exception) => {
          this.errorEmitter.emit(true);
          this.claContributorService.handleError(exception);
        }
      );
    } else {
      this.errorEmitter.emit(true);
      this.alertService.error('There is an invalid project ID in the URL');
    }
  }

  getUserFromToken() {
    this.claContributorService.getUserFromToken().subscribe(
      (response) => {
        this.user = response;
        this.storageService.setItem(AppSettings.USER_ID, this.user.userID);
        this.storageService.setItem(AppSettings.USER, this.user);
      },
      (exception) => {
        this.errorEmitter.emit(true);
        this.claContributorService.handleError(exception);
      }
    );
  }

  getUser() {
    const userId = JSON.parse(this.storageService.getItem(AppSettings.USER_ID));
    if (userId) {
      this.claContributorService.getUser(userId).subscribe(
        (response) => {
          this.user = response;
          this.storageService.setItem(AppSettings.USER_ID, userId);
          this.storageService.setItem(AppSettings.USER, this.user);
        },
        (exception) => {
          this.errorEmitter.emit(true);
          this.claContributorService.handleError(exception);
        }
      );
    } else {
      this.errorEmitter.emit(true);
      this.alertService.error('There is an invalid user ID in the URL');
    }
  }
}
