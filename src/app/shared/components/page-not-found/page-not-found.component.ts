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
    this.projectId = JSON.parse(this.storageService.getItem(AppSettings.PROJECT_ID));

    if (this.hasGerrit) {
      this.message = 'You are being redirected to the ' + this.contractType + ' console.';
    } else {
      this.message = 'The page you are looking for was not found.';
    }

    setTimeout(() => {
      if (this.authService.isAuthenticated()) {
        this.getGerritProjectInfo();
        this.getUserInfo();
      } else {
        this.message = 'The page you are looking for was not found.';
      }
    }, 2000);
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
