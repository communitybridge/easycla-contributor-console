// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, TemplateRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AppSettings } from 'src/app/config/app-settings';
import { StorageService } from 'src/app/shared/services/storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationModel } from 'src/app/core/models/organization';

@Component({
  selector: 'app-configure-cla-manager-modal',
  templateUrl: './configure-cla-manager-modal.component.html',
  styleUrls: ['./configure-cla-manager-modal.component.scss']
})
export class ConfigureClaManagerModalComponent {
  @ViewChild('errorModal') errorModal: TemplateRef<any>;
  @ViewChild('warningModal') warningModal: TemplateRef<any>;
  @Output() backBtnEmitter: EventEmitter<any> = new EventEmitter<any>();

  title: string;
  message: string;
  company: OrganizationModel;
  hasCLAManagerDesignee: boolean;

  constructor(
    private claContributorService: ClaContributorService,
    private authService: AuthService,
    private storageService: StorageService,
    private modalService: NgbModal
  ) {
    this.hasCLAManagerDesignee = false;
    setTimeout(() => {
      this.manageAuthRedirection();
    }, 100);
  }

  manageAuthRedirection() {
    const actionType = JSON.parse(this.storageService.getItem(AppSettings.ACTION_TYPE));
    if (actionType === AppSettings.SIGN_CLA) {
      this.addAsCLAManagerDesignee();
    } else {
      this.validateUserLFID();
    }
  }

  validateUserLFID() {
    if (this.claContributorService.getUserLFID()) {
      this.storageService.removeItem(AppSettings.ACTION_TYPE);
      this.addAsCLAManagerDesignee();
    } else {
      this.message = '<p>You will need to create an SSO account with the Linux Foundation to proceed.</p>' +
        '<p>On successful creation of your account, you will be redirected to sign in with your SSO account' +
        ' into the company dashboard where you can setup CLAs and approve contributors on behalf of your company.</p>';
      this.openDialog(this.warningModal);
    }
  }

  addAsCLAManagerDesignee() {
    this.hasCLAManagerDesignee = false;
    this.company = JSON.parse(this.storageService.getItem(AppSettings.SELECTED_COMPANY));
    const projectId = JSON.parse(this.storageService.getItem(AppSettings.PROJECT_ID));
    const data = {
      userEmail: this.claContributorService.getUserPublicEmail()
    };
    this.claContributorService.addAsCLAManagerDesignee(this.company.companyExternalID, projectId, data).subscribe(
      () => {
        this.storageService.removeItem(AppSettings.ACTION_TYPE);
        this.hasCLAManagerDesignee = true;
      },
      (exception) => {
        this.title = 'Request Failed';
        this.message = exception.error.Message;
        this.openDialog(this.errorModal);
      }
    );
  }

  onClickProceedBtn() {
    this.modalService.dismissAll();
    this.message = '<p>You will be redirected to sign in with your SSO account <b>' + this.claContributorService.getUserLFID() +
      '</b> into the company dashboard where you can setup CLAs and approve contributors on behalf of your company.</p>' +
      '<p>Your GitHub session has been opened in a current tab so that you can come back to GitHub and submit your code contribution</p>'
    this.openDialog(this.warningModal);
  }

  onClickProccedModalBtn() {
    if (!this.hasCLAManagerDesignee) {
      this.storageService.setItem(AppSettings.ACTION_TYPE, AppSettings.SIGN_CLA);
      this.authService.login();
    } else {
      const redirectUrl = JSON.parse(this.storageService.getItem('redirect'));
      const corporateUrl = this.claContributorService.getLFXCorporateURL();
      window.open(corporateUrl, '_blank');
      window.open(redirectUrl, '_self');
    }
  }

  onClickBackBtn() {
    this.backBtnEmitter.emit();
  }

  openDialog(content) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }

}
