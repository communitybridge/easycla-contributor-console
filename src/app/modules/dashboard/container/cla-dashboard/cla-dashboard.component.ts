// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';
import { ClaContributorService } from 'src/app/services/cla-contributor.service';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/core/models/project';
import { AlertService } from 'src/app/shared/services/alert.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AppSettings } from 'src/app/config/app-settings';
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
  project = new Project();

  constructor(
    private route: ActivatedRoute,
    private claContributorService: ClaContributorService,
    private alertService: AlertService,
    private storageService: StorageService
  ) {
    this.projectId = this.route.snapshot.queryParamMap.get('projectId');
    this.userId = this.route.snapshot.queryParamMap.get('userId');
    if (this.projectId === null) {
      this.alertService.error('Project id is missing in URL');
    } else if (this.userId === null) {
      this.alertService.error('User id is missing in URL');
    }
  }

  ngOnInit(): void {
    this.corporateHightlights = [
      'If you are making a contribution of content owned by your employer, you should proceed as a corporate contributor.',
      'The Corporate CLA process requires you to be whitelisted by your company\'s CLA Manager. A CLA Manager at your company will receive your request via email immediately after you submit it.To expedite the process, you can follow up with them directly.',
      'If your company has not yet signed a CLA for this project, you will be able to coordinate designating a CLA Manager and having the CLA signed by someone at your company who is authorized to sign.',
      'If your company is not registered in CommunityBridge, then you can also optionally create a profile for your company in CommunityBridge if you would like.'
    ];

    this.individualHightlights = [
      'If you are making a contribution of content that you own, and not content owned by your employer, you should proceed as an individual contributor.',
      'If you are in doubt whether your contribution is owned by you or your employer, you should check with your employer or an attorney.'
    ];
    this.getProject();
  }

  getProject() {
    if (this.projectId && this.userId) {
      this.claContributorService.getProject(this.projectId).subscribe(
        (response) => {
          this.project = response;
          this.storageService.setItem(AppSettings.PROJECTID, this.projectId);
          this.storageService.setItem(AppSettings.USERID, this.userId);
        },
        (exception) => {
          const error = exception.error.errors.project_id;
          this.alertService.error(error, 2000);
        }
      );
    }
  }

  onClickCorporateProceed() {
    // TODO
  }

  onClickIndividualProceed() {
    // TODO
  }
}

