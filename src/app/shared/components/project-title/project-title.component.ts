// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, Input, EventEmitter, Output, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { ProjectModel } from 'src/app/core/models/project';
import { UserFromSessionModel, UserFromTokenModel, UserModel } from 'src/app/core/models/user';
import { StorageService } from '../../services/storage.service';
import { AppSettings } from 'src/app/config/app-settings';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-title',
  templateUrl: './project-title.component.html',
  styleUrls: ['./project-title.component.scss']
})
export class ProjectTitleComponent implements OnInit {
  @ViewChild('warningModal') warningModal: TemplateRef<any>;

  @Input() projectId: string;
  @Input() userId: string;
  @Output() errorEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() successEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() setUserIdEmitter: EventEmitter<any> = new EventEmitter<any>();

  message: string;
  redirectUrl: string;
  project = new ProjectModel();
  userFromToken = new UserFromTokenModel();
  user = new UserModel();
  userFromSession = new UserFromSessionModel();
  constructor(
    private alertService: AlertService,
    private storageService: StorageService,
    private claContributorService: ClaContributorService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    const hasGerrit = JSON.parse(this.storageService.getItem(AppSettings.HAS_GERRIT));
    if (hasGerrit) {
      this.project.project_name = JSON.parse(this.storageService.getItem(AppSettings.PROJECT_NAME));
    } else {
      this.validateGithubFlow();
    }
  }

  validateGithubFlow() {
    console.log('validateGithubFlow'+this.projectId)
    if (this.projectId ) {
      this.getProject();
      if (this.userId) {
        // get user from user id
        this.getUser();
      } else {
        // get user from token if user id is not present in url
        this.getUserFromToken();
      }
    } else {
      this.errorEmitter.emit(true);
      this.alertService.error('Invalid project id in URL');
    }
  }

  getProject() {
    this.claContributorService.getProject(this.projectId).subscribe(
      (response) => {
        this.project = response;
        this.storageService.setItem(AppSettings.PROJECT_NAME, this.project.project_name);
        this.storageService.setItem(AppSettings.PROJECT_ID, this.projectId);
        this.storageService.setItem(AppSettings.PROJECT, this.project);
        this.successEmitter.emit('Project');
      }
    );
  }

  getUser() {
    if (this.userId) {
      this.claContributorService.getUser(this.userId).subscribe(
        (response) => {
          this.user = response;
          this.storageService.setItem(AppSettings.USER_ID, this.userId);
          this.storageService.setItem(AppSettings.USER, this.user);
          this.successEmitter.emit('User');
        },
        (exception) => {
          this.errorEmitter.emit(true);
          this.claContributorService.handleError(exception);
        }
      );
    } else {
      this.errorEmitter.emit(true);
      this.alertService.error('Invalid user id in URL');
    }
  }


  getUserFromToken() {
    this.claContributorService.getUserFromToken().subscribe(
      (response) => {
        console.log('getUserFromToken response ==>', response)
        this.userFromToken = response;
        this.storageService.setItem(AppSettings.USER_ID, this.userFromToken.userID);
        this.storageService.setItem(AppSettings.USER, this.userFromToken);
        this.successEmitter.emit('User');
        this.setUserIdEmitter.emit(this.userFromToken.userID);
        this.router.navigate(['/cla/project/' + this.projectId + '/user/' + this.userFromToken.userID]);
      },
      () => {
        // If user is not found in token, get user from session
        this.getUserFromSession();
      }
    );
}

  getUserFromSession() {
    this.claContributorService.getUserFromSession().subscribe(
      (response: any) => {
        console.log('getUserFromSession response ==>', response)
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
        console.log('getUserFromSession exception ==>', exception)
        this.errorEmitter.emit(true);
        this.alertService.error('An error occurred while retrieving the GitHub user from the session.');
        this.claContributorService.handleError(exception);
      }
    );
  }
}
