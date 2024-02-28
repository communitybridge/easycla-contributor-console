// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AppSettings } from 'src/app/config/app-settings';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-gerrit-dashboard',
  templateUrl: './gerrit-dashboard.component.html',
  styleUrls: ['./gerrit-dashboard.component.scss'],
})
export class GerritDashboardComponent implements OnInit, AfterViewInit {
  projectId: string;
  contractType: string;

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private authService: AuthService
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
    this.authService.login();
  }

  login() {
    this.authService.logout();
    this.authService.login();
  }
}
