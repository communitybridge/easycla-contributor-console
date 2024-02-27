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
    private alertService: AlertService
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

    this.performActionAsPerType();
  }

  performActionAsPerType() {
    console.log(this.actionType)
    if (this.actionType === AppSettings.SIGN_CLA) {
      const url = '/corporate-dashboard/' + this.projectId + '/' + this.userId;
      this.router.navigate([url], {
        queryParams: { view: AppSettings.SIGN_CLA },
      });
      return;
    }

    if (this.hasGerrit) {
      this.getGerritProjectInfo();
      this.getUserInfo();
      return;
    }

    if (this.previousURL !== undefined && this.previousURL !== 'undefined') {
      this.router.navigateByUrl(this.previousURL);
      return;
    }
    // Redirect to landing page.
    const redirectUrl = JSON.parse(
      this.storageService.getItem(AppSettings.REDIRECT)
    );
    this.router.navigate(
      ['/cla/project/' + this.projectId + '/user/' + this.userId],
      { queryParams: { redirect: redirectUrl } }
    );
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
        this.message =
          'Failed to redirect on a ' + this.contractType + ' console.';
        this.alertService.error(exception.error);
      }
    );
  }
  
  getGerritProjectInfo() {
    this.claContributorService.getGerritProjectInfo(this.projectId).subscribe(
      (response: ProjectModel) => {
        this.storageService.setItem(
          AppSettings.PROJECT_NAME,
          response.project_name
        );
        this.storageService.setItem(AppSettings.PROJECT, response);
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
