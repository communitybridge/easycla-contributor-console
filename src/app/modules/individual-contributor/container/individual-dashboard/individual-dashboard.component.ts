// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ActiveSignatureModel } from 'src/app/core/models/active-signature';
import { IndividualRequestSignatureModel } from 'src/app/core/models/individual-request-signature';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AppSettings } from 'src/app/config/app-settings';

@Component({
  selector: 'app-individual-dashboard',
  templateUrl: './individual-dashboard.component.html',
  styleUrls: ['./individual-dashboard.component.scss']
})
export class IndividualDashboardComponent implements OnInit {
  projectId: string;
  userId: string;
  status: string;
  hasGerrit: string;
  activeSignatureModel = new ActiveSignatureModel();
  individualRequestSignatureModel = new IndividualRequestSignatureModel();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private claContributorService: ClaContributorService,
    private alertService: AlertService,
    private storageService: StorageService
  ) {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.userId = this.route.snapshot.paramMap.get('userId');
  }

  ngOnInit(): void {
    this.hasGerrit = JSON.parse(this.storageService.getItem(AppSettings.HAS_GERRIT));
    this.status = 'Pending';
    if (this.hasGerrit) {
      this.postIndividualRequestSignature();
    } else {
      this.findActiveSignature();
    }
  }

  findActiveSignature() {
    this.claContributorService.getUserActiveSignature(this.userId).subscribe(
      (response) => {
        if (response) {
          this.activeSignatureModel = response;
          this.postIndividualRequestSignature();
        } else {
          this.status = 'Failed';
          const error = 'Whoops, It looks like you don\'t have any signatures in progress.' +
            ' Try going back to your pull request and restarting the signing process from your pull request if necessary.';
          this.alertService.error(error);
        }
      },
      (exception) => {
        this.claContributorService.handleError(exception);
      }
    );
  }

  postIndividualRequestSignature() {
    const redirectUrl = this.storageService.getItem(AppSettings.REDIRECT);
    const data = {
      project_id: this.projectId,
      user_id: this.userId,
      return_url_type: this.hasGerrit ? AppSettings.GERRIT :this.claContributorService.getTypeByUrl(),
      return_url: this.hasGerrit ? redirectUrl || '' : this.activeSignatureModel.return_url
    };
    this.claContributorService.postIndividualSignatureRequest(data).subscribe(
      (response) => {
        this.individualRequestSignatureModel = response;
        const url = this.individualRequestSignatureModel.sign_url;
        if (url) {
          this.status = 'Completed';
        } else {
          this.status = 'Incomplete';
          let error = 'CLA system is not able to support your request. Please ';
          error += '<a href="https://jira.linuxfoundation.org/servicedesk/customer/portal/4" style="color:#0099cc" target="_blank">create a ticket</a>';
          error += ' to help us resolve this issue';
          this.alertService.error(error);
        }
      },
      (exception) => {
        this.claContributorService.handleError(exception);
      }
    );
  }

  onClickSignCLA() {
    const url = this.individualRequestSignatureModel.sign_url;
    if (url) {
      window.open(url, '_self');
    } else {
      this.alertService.error('Redirect URL not found, Please contact to your administrator.');
    }
  }

  onBackClick() {
    const redirectUrl = JSON.parse(this.storageService.getItem(AppSettings.REDIRECT));
    if (!this.hasGerrit) {
      // Redirect to Github home page.
      this.router.navigate(['/cla/project/' + this.projectId + '/user/' + this.userId],
        { queryParams: { redirect: redirectUrl } });
    } else {
      if (redirectUrl !== null) {
        window.open(redirectUrl, '_self');
      } else {
        const error = 'Unable to fetch redirect URL.';
        this.alertService.error(error);
      }
    }
  }
}
