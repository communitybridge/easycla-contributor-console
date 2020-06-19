// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/shared/services/storage.service';
import { PlatformLocation } from '@angular/common';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { ProjectCompanySingatureModel, SignatureACL } from 'src/app/core/models/project-company-signature';
import { UserModel } from 'src/app/core/models/user';
import { OrganizationModel } from 'src/app/core/models/organization';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-cla-request-authorization',
  templateUrl: './cla-request-authorization.component.html',
  styleUrls: ['./cla-request-authorization.component.scss']
})
export class ClaRequestAuthorizationComponent implements OnInit {
  projectId: string;
  userId: string;
  hasError: boolean;
  title: string;
  message: string;
  projectSignature = new ProjectCompanySingatureModel();
  managers: SignatureACL[] = [];
  selectedCompany: string;
  company: OrganizationModel;
  claManagerError: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private storageService: StorageService,
    private location: PlatformLocation,
    private claContributorService: ClaContributorService,
    private alertService: AlertService
  ) {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.location.onPopState(() => this.modalService.dismissAll());
  }

  ngOnInit(): void {
    this.claManagerError = 'Wait... we are loading CLA manager(s).';
    this.company = JSON.parse(this.storageService.getItem('selectedCompany'));
    if (this.company) {
      this.selectedCompany = this.company.companyID;
      this.getProjectCompanySignature();
    }
  }

  onClickBack() {
    this.modalService.dismissAll();
    const url = '/corporate-dashboard/' + this.projectId + '/' + this.userId;
    this.router.navigate([url]);
  }

  onClickRequestAuthorization(content: any, manager: SignatureACL) {
    this.callRequestAuthorization(content, manager);
  }

  callRequestAuthorization(content: any, manager: SignatureACL) {
    const user: UserModel = JSON.parse(this.storageService.getItem('user'));
    this.title = 'Request Submitted';
    this.message = 'The CLA Manager for ' + this.company.companyName + ' will be notified of your request to be authorized for contributions.' +
      ' You will be notified via email when the status has been approved or rejected.';
    if (user.user_emails === null) {
      this.alertService.error('User email id is not found on github.')
      return false;
    }
    const data = {
      contributorId: user.user_id,
      contributorName: user.user_github_username,
      contributorEmail: user.user_emails[0],
      message: 'Please add me.',
      recipientName: manager.username,
      recipientEmail: manager.lfEmail,
    };
    this.claContributorService.requestToBeOnCompanyApprovedList(this.selectedCompany, this.projectId, data).subscribe(
      () => {
        this.showDialogModal(content);
      },
      () => {
        this.showDialogModal(content);
      }
    );
  }

  exitEasyCLA() {
    const redirectUrl = JSON.parse(this.storageService.getItem('redirect'));
    if (redirectUrl !== null) {
      window.open(redirectUrl, '_self');
    } else {
      const error = 'Unable to fetch redirect URL.';
      this.alertService.error(error);
    }
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  getProjectCompanySignature() {
    this.claContributorService.getProjectCompanySignature(this.projectId, this.selectedCompany).subscribe(
      (response) => {
        this.projectSignature = response;
        this.getCLAManagers();
      },
      (exception) => {
        this.claContributorService.handleError(exception);
      }
    );
  }

  getCLAManagers() {
    for (const signatures of this.projectSignature.signatures) {
      if (signatures !== null) {
        for (const acl of signatures.signatureACL) {
          this.managers.push(acl);
        }
      }
    }

    if (this.managers.length <= 0) {
      this.claManagerError = 'No CLA manager found.';
    }
  }

  showDialogModal(content) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }
}
