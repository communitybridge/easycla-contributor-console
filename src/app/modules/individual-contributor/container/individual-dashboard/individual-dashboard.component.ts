// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ActiveSignatureModel } from 'src/app/core/models/active-signature';
import { IndividualRequestSignatureModel } from 'src/app/core/models/individual-request-signature';

@Component({
  selector: 'app-individual-dashboard',
  templateUrl: './individual-dashboard.component.html',
  styleUrls: ['./individual-dashboard.component.scss']
})
export class IndividualDashboardComponent implements OnInit {
  projectId: string;
  userId: string;
  status: string;
  activeSignatureModel = new ActiveSignatureModel();
  individualRequestSignatureModel = new IndividualRequestSignatureModel();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private claContributorService: ClaContributorService,
    private alertService: AlertService
  ) {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.userId = this.route.snapshot.paramMap.get('userId');
  }

  ngOnInit(): void {
    this.status = 'Pending';
    this.findActiveSignature();
  }

  findActiveSignature() {
    this.claContributorService.getUserActiveSignature(this.userId).subscribe(
      (response) => {
        if (response) {
          this.activeSignatureModel = response;
          this.postIndivdualRequestSignature();
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

  postIndivdualRequestSignature() {
    const data = {
      project_id: this.projectId,
      user_id: this.userId,
      return_url_type: 'Github',
      return_url: this.activeSignatureModel.return_url
    };
    this.claContributorService.postIndividualSignatureRequest(data).subscribe(
      (response) => {
        this.status = 'Completed';
        this.individualRequestSignatureModel = response;
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
      const error = 'Something went wrong to request individual signature. Contact your administrator.';
      this.alertService.error(error);
    }
  }

  onBackClick() {
    this.router.navigate(['/cla/project/' + this.projectId + '/user/' + this.userId]);
  }
}
