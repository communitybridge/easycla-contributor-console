// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/config/app-settings';
import { GerritUserModel } from 'src/app/core/models/gerrit';
import { ProjectModel } from 'src/app/core/models/project';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { AlertService } from '../../services/alert.service';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '@auth0/auth0-angular';
import { User } from '@auth0/auth0-spa-js';
import { first } from 'rxjs/operators';
import { LfxHeaderService } from '../../services/lfx-header.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  message: string;
  contractType: string;
  projectId: string;
  hasGerrit: string;
  userId: string;
  actionType: string;
  previousURL: string;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private claContributorService: ClaContributorService,
    private alertService: AlertService,
    private authService: AuthService,
    private lfxHeaderService: LfxHeaderService
  ) {}

  ngOnInit(): void {
    this.contractType = JSON.parse(
      this.storageService.getItem(AppSettings.CONTRACT_TYPE)
    );
    this.hasGerrit = JSON.parse(
      this.storageService.getItem(AppSettings.HAS_GERRIT)
    );
    this.actionType = JSON.parse(
      this.storageService.getItem(AppSettings.ACTION_TYPE)
    );
    this.projectId = JSON.parse(
      this.storageService.getItem(AppSettings.PROJECT_ID)
    );
    this.userId = JSON.parse(this.storageService.getItem(AppSettings.USER_ID));
    this.previousURL = decodeURIComponent(window.location.hash.split('=')[1]);

    this.setMessage();
    this.handleRedirection();
  }

  handleRedirection() {
    this.performActionAsPerType();
  }

  setMessage() {
    if (this.actionType === AppSettings.SIGN_CLA) {
      this.message =
        'Wait... You are being redirected to the Configure CLA Manager.';
      return;
    }

    if (this.hasGerrit) {
      this.message = 'Validating user session, please wait...';
      return;
    }

    this.message = 'The page you are looking for was not found.';
  }

  performActionAsPerType() {
    if (this.actionType === AppSettings.SIGN_CLA) {
      const url = '/corporate-dashboard/' + this.projectId + '/' + this.userId;
      this.router.navigate([url], {
        queryParams: { view: AppSettings.SIGN_CLA },
      });
      return;
    }

    if (this.hasGerrit) {
      this.getGerritProjectInfo();
      return;
    }

    if (this.previousURL !== undefined && this.previousURL !== 'undefined') {
      this.router.navigateByUrl(this.previousURL);
      return;
    } else {
      // Redirect to landing page.
      const redirectUrl = JSON.parse(
        this.storageService.getItem(AppSettings.REDIRECT)
      );
      this.router.navigate(
        ['/cla/project/' + this.projectId + '/user/' + this.userId],
        { queryParams: { redirect: redirectUrl } }
      );
    }

    // *todo: handle default case
  }

  getUserInfo() {
    this.message = 'Fetching user details, please wait ...';
    this.claContributorService.getGerritUserInfo().subscribe(
      (response: GerritUserModel) => {
        this.userId = response.user_id;
        this.storageService.setItem(AppSettings.USER_ID, response.user_id);
        this.storageService.setItem(AppSettings.USER, response);
        this.redirectForGerritFlow();
      },
      (exception) => {
        this.message =
          'Failed to redirect on a ' + this.contractType + ' console.';
        this.alertService.error(exception.error);
      }
    );
  }

  getGerritProjectInfo() {
    this.message = 'Fetching Gerrit details, please wait ...';
    this.claContributorService.getGerritProjectInfo(this.projectId).subscribe(
      (response: any) => {
        if (response.errors && response.errors.project_id) {
          this.message =
            'Gerrit project is not valid, please contact to your admin.';
        } else {
          this.storageService.setItem(
            AppSettings.PROJECT_NAME,
            response.project_name
          );
          this.storageService.setItem(AppSettings.PROJECT, response);
          this.getUserInfo();
        }
      },
      (exception) => {
        this.message =
          'Failed to redirect on a ' + this.contractType + ' console.';
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
