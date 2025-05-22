// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { ProjectModel } from 'src/app/core/models/project';
import { UserFromSessionModel, UserFromTokenModel } from 'src/app/core/models/user';
import { StorageService } from '../../services/storage.service';
import { AppSettings } from 'src/app/config/app-settings';

@Component({
  selector: 'app-project-title',
  templateUrl: './project-title.component.html',
  styleUrls: ['./project-title.component.scss']
})
export class ProjectTitleComponent implements OnInit {
  @Input() projectId: string;
  @Input() userId: string;
  @Output() errorEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() successEmitter: EventEmitter<any> = new EventEmitter<any>();

  project = new ProjectModel();
  user = new UserFromTokenModel();
  userFromSession = new UserFromSessionModel();
  constructor(
    private alertService: AlertService,
    private storageService: StorageService,
    private claContributorService: ClaContributorService,
  ) { }

  ngOnInit(): void {
    const hasGerrit = JSON.parse(this.storageService.getItem(AppSettings.HAS_GERRIT));
    if (hasGerrit) {
      this.project.project_name = JSON.parse(this.storageService.getItem(AppSettings.PROJECT_NAME));
    } else {
      this.validateGithubFlow();
    }
  }

  validateGithubFlow() {
    if (this.projectId) {
        this.getProject();
        this.getUser();
    } else {
      this.errorEmitter.emit(true);
      this.alertService.error('Invalid project id in URL');
    }
  }

  getProject() {
    if (this.projectId) {
      this.claContributorService.getProject(this.projectId).subscribe(
        (response) => {
          this.project = response;
          this.storageService.setItem(AppSettings.PROJECT_NAME, this.project.project_name);
          this.storageService.setItem(AppSettings.PROJECT_ID, this.projectId);
          this.storageService.setItem(AppSettings.PROJECT, this.project);
          this.successEmitter.emit('Project');
        },
        (exception) => {
          this.errorEmitter.emit(true);
          this.claContributorService.handleError(exception);
        }
      );
    } else {
      this.errorEmitter.emit(true);
      this.alertService.error('Invalid project id in URL');
    }
  }


  getUser() {
      this.claContributorService.getUserFromToken().subscribe(
        (response) => {
          this.user = response;
          this.storageService.setItem(AppSettings.USER_ID, this.user.userID);
          this.storageService.setItem(AppSettings.USER, this.user);
          this.successEmitter.emit('User');
        },
        () => {
          // If user is not found in token, get user from session
          this.getUserFromSession();
        }
      );
  }

  getUserFromSession() {
    this.claContributorService.getUserFromSession().subscribe(
      (response) => {
        console.log(response)
        this.userFromSession = response;
        this.storageService.setItem(AppSettings.USER_ID, this.userFromSession.user_id);
        this.storageService.setItem(AppSettings.USER, {
          dateCreated: this.userFromSession.date_created,
          dateModified: this.userFromSession.date_modified,
          emails: this.userFromSession.user_emails,
          lfEmail: this.userFromSession.lf_email,
          lfUsername: this.userFromSession.lf_username,
          userID: this.userFromSession.user_id,
          username: this.userFromSession.user_name,
          version: this.userFromSession.version
        });
        this.successEmitter.emit('User');
      },
      (exception) => {
        console.log(exception)
        // window.open('https://github.com/login/oauth/authorize?response_type=code&client_id=38f6d46ff92b7ed04071&redirect_uri=https%3A%2F%2Fapi.lfcla.dev.platform.linuxfoundation.org%2Fv2%2Fgithub%2Finstallation&scope=user%3Aemail&state=4CSOmSBNwx8Oi5liEEi5wEyKy3IkWQ', '_self');
        this.errorEmitter.emit(true);
        // this.alertService.error('An error occurred while retrieving the GitHub user from the session. '+
        //   'To use this feature, you must be logged in to your GitHub account and your browser must be set to accept cookies.');
        this.claContributorService.handleError(exception);
      }
    );
  }
}
