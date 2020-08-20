// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectModel } from 'src/app/core/models/project';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AppSettings } from 'src/app/config/app-settings';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
@Component({
  selector: 'app-cla-dashboard',
  templateUrl: './cla-dashboard.component.html',
  styleUrls: ['./cla-dashboard.component.scss']
})
export class ClaDashboardComponent implements OnInit {
  projectId: string;
  userId: string;
  corporateHightlights: string[];
  individualHightlights: string[];
  corporateContributor = 'Corporate Contributor';
  individualContributor = 'Individual Contributor';
  exitEasyCLA = 'exitEasyCLA';
  hasError: boolean;
  project = new ProjectModel();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private alertService: AlertService,
    private claContributorService: ClaContributorService
  ) {
    this.storageService.removeGerritItems();
    this.storageService.setItem(AppSettings.HAS_GERRIT, false);
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.userId = this.route.snapshot.paramMap.get('userId');
    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    this.storageService.setItem(AppSettings.REDIRECT, redirect);
    this.hasErrorPresent();
  }

  ngOnInit(): void {
    this.corporateHightlights = [
      'If you are making a contribution of content owned by your employer, you should proceed as a corporate contributor.',
      'The Corporate CLA process requires you to be approved by your organization\'s CLA Manager. A CLA Manager at your organization will receive your request via email immediately after you submit it. To expedite the process, you can follow up with them directly.',
      'If your organization has not yet signed a CLA for this project, you will be able to coordinate designating a CLA Manager and having the CLA signed by someone at your organization who is authorized to sign.',
      'If your organization is not registered in CommunityBridge, then you can also optionally create a profile for your organization in CommunityBridge if you would like.'
    ];

    this.individualHightlights = [
      'If you are making a contribution of content that you own, and not content owned by your employer, you should proceed as an individual contributor.',
      'If you are in doubt whether your contribution is owned by you or your employer, you should check with your employer or an attorney.'
    ];
  }


  onClickCorporateProceed() {
    if (!this.project.project_ccla_enabled) {
      this.alertService.error('CCLA is not enabled to this project please contact to your administrator.');
      return false;
    }
    if (!this.hasError) {
      const url = '/corporate-dashboard/' + this.projectId + '/' + this.userId;
      this.router.navigate([url]);
    }
  }

  onClickIndividualProceed() {
    if (!this.project.project_icla_enabled) {
      this.alertService.error('ICLA is not enabled to this project please contact to your administrator.');
      return false;
    }
    if (!this.hasError) {
      const url = '/individual-dashboard/' + this.projectId + '/' + this.userId;
      this.router.navigate([url]);
    }
  }

  onAPILoad(APIType: string) {
    if (APIType === 'Project') {
      this.project = JSON.parse(this.storageService.getItem('project'));
    }
  }


  onExitEasyCLA() {
    const redirectUrl = JSON.parse(this.storageService.getItem('redirect'));
    if (redirectUrl !== null) {
      window.open(redirectUrl, '_self');
    } else {
      const error = 'Unable to fetch redirect URL.';
      this.alertService.error(error);
    }
  }

  onClickPreviewPDF(consoleType: string) {
    let documents = [];
    if (consoleType === 'CORPORATE') {
      documents = this.project.project_corporate_documents;
    } else {
      documents = this.project.project_individual_documents;
    }
    if (documents.length > 0) {
      const latestDoc = documents[documents.length - 1].document_s3_url;
      const filename = documents[documents.length - 1].document_name;
      if (latestDoc) {
        this.claContributorService.downloadFile(latestDoc, filename);
      } else {
        this.alertService.error('Document link missing please co-ordinate with your administrator.')
      }
    } else {
      this.alertService.error('No document found to download.')
    }
  }

  hasErrorPresent(error?) {
    this.hasError = false;
    if (error) {
      this.hasError = true;
    }
  }
}
