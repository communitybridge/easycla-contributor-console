// Copyright The Linux Foundation and each contributor to CommunityBridge.// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/config/app-settings';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { GerritUserModel } from 'src/app/core/models/gerrit';
import { ProjectModel } from 'src/app/core/models/project';
import { AlertService } from '../../services/alert.service';
import { UserModel, UpdateUserModel } from 'src/app/core/models/user';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})

export class PageNotFoundComponent implements OnInit {
  message: string;
  contractType: string;
  projectId: string;
  hasGerrit: string;
  userId: string;
  actionType: string;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private claContributorService: ClaContributorService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.contractType = JSON.parse(this.storageService.getItem(AppSettings.CONTRACT_TYPE));
    this.hasGerrit = JSON.parse(this.storageService.getItem(AppSettings.HAS_GERRIT));
    this.actionType = JSON.parse(this.storageService.getItem(AppSettings.ACTION_TYPE));
    this.projectId = JSON.parse(this.storageService.getItem(AppSettings.PROJECT_ID));
    this.userId = JSON.parse(this.storageService.getItem(AppSettings.USER_ID));

    this.setMessage();

    setTimeout(() => {
      if (this.authService.isAuthenticated()) {
        if (this.hasGerrit) {
          this.performActionAsPerType();
        } else {
          this.updateUserInfo();
        }
      } else {
        this.message = 'The page you are looking for was not found.';
      }
    }, 2000);
  }

  setMessage() {
    if (this.actionType === AppSettings.ADD_ORGANIZATION) {
      this.message = 'Wait... we are completing authentication process.';
    } else if (this.actionType === AppSettings.SIGN_CLA) {
      this.message = 'Wait... You are being redirected to the the Corporate Console.';
    } else if (this.hasGerrit) {
      this.message = 'You are being redirected to the ' + this.contractType + ' console.';
    } else {
      this.message = 'The page you are looking for was not found.';
    }
  }

  performActionAsPerType() {
    if (this.actionType === AppSettings.ADD_ORGANIZATION) {
      // Redirect to Add Organization.
      const url = '/corporate-dashboard/' + this.projectId + '/' + this.userId;
      this.router.navigate([url], { queryParams: { view: AppSettings.ADD_ORGANIZATION } });
    } else if (this.actionType === AppSettings.SIGN_CLA) {
      // redirect to CLA not Sign.
      const url = '/corporate-dashboard/' + this.projectId + '/' + this.userId;
      this.router.navigate([url], { queryParams: { view: AppSettings.SIGN_CLA } });
    } else if (this.hasGerrit) {
      this.getGerritProjectInfo();
      this.getUserInfo();
    }
  }

  getUserInfo() {
    this.claContributorService.getGerritUserInfo().subscribe(
      (response: GerritUserModel) => {
        this.userId = response.user_id;
        this.storageService.setItem(AppSettings.USER_ID, response.user_id);
        this.storageService.setItem(AppSettings.USER, response);
        this.redirectForGerritFlow();
      },
      (exception) => {
        this.message = 'Failed to redirect on a ' + this.contractType + ' console.';
        this.alertService.error(exception.error);
      }
    );
  }

  updateUserInfo() {
    const autData = JSON.parse(this.storageService.getItem(AppSettings.AUTH_DATA));
    const user: UserModel = JSON.parse(this.storageService.getItem(AppSettings.USER));
    const data = {
      lfEmail: autData.user_email,
      lfUsername: autData.userid, //LF username is actually userId in the auth service/EasyCLA.
      githubUsername: user.user_github_username,
      githubID: user.user_github_id
    }
    this.claContributorService.updateUser(data).subscribe(
      (response: UpdateUserModel) => {
        // Update new values in local storage.
        user.lf_username = response.lfUsername;
        user.lf_email = response.lfEmail;
        this.storageService.setItem(AppSettings.USER, user);
        this.performActionAsPerType();
      },
      (exception) => {
        this.alertService.error(exception.error.Message);
        this.message = 'Error occured during updating user info. Please contact to your administrator.';
      }
    );
  }

  getGerritProjectInfo() {
    this.claContributorService.getGerritProjectInfo(this.projectId).subscribe(
      (response: ProjectModel) => {
        this.storageService.setItem(AppSettings.PROJECT_NAME, response.project_name);
        this.storageService.setItem(AppSettings.PROJECT, response);
      },
      (exception) => {
        this.message = 'Failed to redirect on a ' + this.contractType + ' console.';
        this.claContributorService.handleError(exception);
      }
    );
  }

  redirectForGerritFlow() {
    if (this.contractType === 'individual') {
      const url = '/individual-dashboard/' + this.projectId + '/' + this.userId;
      this.router.navigate([url]);
    } else if (this.contractType === 'corporate') {
      const url = '/corporate-dashboard/' + this.projectId + '/' + this.userId;
      this.router.navigate([url]);
    } else {
      this.message = 'Contract type is invalid.';
    }
  }
}
