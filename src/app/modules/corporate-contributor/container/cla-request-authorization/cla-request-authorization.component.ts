// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/shared/services/storage.service';
import { PlatformLocation } from '@angular/common';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { ProjectCompanySingatureModel, SignatureACL, Signature } from 'src/app/core/models/project-company-signature';
import { OrganizationModel } from 'src/app/core/models/organization';
import { UserModel } from 'src/app/core/models/user';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private storageService: StorageService,
    private location: PlatformLocation,
    private claContributorService: ClaContributorService
  ) {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.location.onPopState(() => this.modalService.dismissAll());
  }

  ngOnInit(): void {
    const company: OrganizationModel = JSON.parse(this.storageService.getItem('selectedCompany'));
    // this.selectedCompany = company.companyID;
    this.selectedCompany = '08c1d2e9-7a22-48b8-b8b1-e56cb9a559e0';
    this.getProjectCompanySignature();
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
    let data = {
      contributorId: user.user_id,
      contributorName: user.user_github_username,
      contributorEmail: user.user_emails[0],
      message: '',
      recipientName: manager.username,
      recipientEmail: manager.lfEmail,
    };
    this.claContributorService.requestToBeOnCompanyApprovedList(this.selectedCompany, this.projectId, data).subscribe(
      () => {
        this.hasError = false;
        this.title = 'Request Submitted';
        const projectName = JSON.parse(this.storageService.getItem('projectName'));
        this.message = 'The CLA Manager for ' + projectName + ' will be notified of your request to be authorized for contributions.' +
          ' You will be notified via email when the status has been approved or rejected.';
        this.showDialogModal(content);
      },
      () => {
        this.hasError = true;
        this.title = 'Problem Sending Request';
        this.message = 'The request already exists for you. Please ask the CLA Manager to log into the EasyCLA Corporate Console and authorize you using one of the available methods.';
        this.showDialogModal(content);
      }
    );
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
  }

  showDialogModal(content) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }
}
