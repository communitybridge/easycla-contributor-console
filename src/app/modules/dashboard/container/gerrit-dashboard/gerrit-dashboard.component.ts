// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AppSettings } from 'src/app/config/app-settings';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { GerritUserModel } from 'src/app/core/models/gerrit';
import { AlertService } from 'src/app/shared/services/alert.service';
import { GerritError, ProjectModel } from 'src/app/core/models/project';

@Component({
  selector: 'app-gerrit-dashboard',
  templateUrl: './gerrit-dashboard.component.html',
  styleUrls: ['./gerrit-dashboard.component.scss'],
})
export class GerritDashboardComponent implements OnInit {
  projectId: string;
  contractType: string;
  message = 'Validating user session, please wait...';
  userId: string;

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private claContributorService: ClaContributorService,
    private alertService: AlertService
  ) {
    this.storageService.removeGithubItems();
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.contractType = this.route.snapshot.paramMap.get('contractType');
    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    this.storageService.setItem(AppSettings.REDIRECT, redirect);
    this.storageService.setItem(AppSettings.HAS_GERRIT, true);
    this.storageService.setItem(AppSettings.PROJECT_ID, this.projectId);
    this.storageService.setItem(AppSettings.CONTRACT_TYPE, this.contractType);

    this.authService.user$.subscribe((sessionData) => {
      if (sessionData) {
        this.storageService.setItem(AppSettings.AUTH_DATA, sessionData);
        this.getGerritProjectInfo();
      } else {
        this.authService.loginWithRedirect();
      }
    });
  }

  getGerritProjectInfo() {
    this.message = 'Fetching Gerrit details, please wait...';
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

  getUserInfo() {
    this.message = 'Fetching user details, please wait...';
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
