// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AppSettings } from 'src/app/config/app-settings';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { ProjectModel } from 'src/app/core/models/project';
import { GerritUserModel } from 'src/app/core/models/gerrit';
import { AlertService } from 'src/app/shared/services/alert.service';
@Component({
  selector: 'app-gerrit-dashboard',
  templateUrl: './gerrit-dashboard.component.html',
  styleUrls: ['./gerrit-dashboard.component.scss'],
})
export class GerritDashboardComponent implements OnInit, AfterViewInit {
  projectId: string;
  contractType: string;
  userId: string;

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private authService: AuthService,
    private claContributorService: ClaContributorService,
    private router: Router,
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
  }

  ngAfterViewInit(): void {
    this.authService.userProfile$.subscribe((data) => {
      console.log(data);
      if (data) {
        this.getGerritProjectInfo();
        this.getUserInfo();
      } else {
        this.authService.login();
      }
    });
  }

  getGerritProjectInfo() {
    const projectId = JSON.parse(
      this.storageService.getItem(AppSettings.PROJECT_ID)
    );
    this.claContributorService.getGerritProjectInfo(projectId).subscribe(
      (response: ProjectModel) => {
        this.storageService.setItem(
          AppSettings.PROJECT_NAME,
          response.project_name
        );
        this.storageService.setItem(AppSettings.PROJECT, response);
      },
      (exception) => {
        this.alertService.error(exception);
      }
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
    }
  }
}
