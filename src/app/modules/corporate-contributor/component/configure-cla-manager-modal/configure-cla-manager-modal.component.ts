// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, TemplateRef, ViewChild } from '@angular/core';
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
  @ViewChild('WarningModal') WarningModal: TemplateRef<any>;
  title: string;
  message: string;
  hasError: boolean;
  company: OrganizationModel;
  hasCLAManagerDesignee: boolean;

  constructor(
    private claContributorService: ClaContributorService,
    private authService: AuthService,
    private storageService: StorageService,
    private modalService: NgbModal
  ) {
    this.hasCLAManagerDesignee = false;
    this.hasError = false;
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
      this.title = 'LF Login Required';
      this.message = 'You are missing a LF Login to proceed to next step.' +
        ' We will be redirecting you to LF Login screen, once you have created' +
        ' a LF Login you will be redirected to complete CLA process';
      this.openDialog(this.WarningModal);
    }
  }

  addAsCLAManagerDesignee() {
    this.hasCLAManagerDesignee = false;
    this.company = JSON.parse(this.storageService.getItem(AppSettings.SELECTED_COMPANY));
    const projectId = JSON.parse(this.storageService.getItem(AppSettings.PROJECT_ID));
    const authData = JSON.parse(this.storageService.getItem(AppSettings.AUTH_DATA));
    const data = {
      userEmail: authData.user_email
    };
    this.claContributorService.addAsCLAManagerDesignee(this.company.companyExternalID, projectId, data).subscribe(
      () => {
        this.storageService.removeItem(AppSettings.ACTION_TYPE);
        this.hasError = false;
        this.hasCLAManagerDesignee = true;
      },
      (exception) => {
        this.title = 'Request Failed';
        this.hasError = true;
        this.message = exception.error.Message;
        this.openDialog(this.WarningModal);
      }
    );
  }

  onClickProceedBtn() {
    const url = this.claContributorService.getLFXCorporateURL();
    window.open(url, '_self');
  }

  onClickProccedModalBtn() {
    if (this.hasError) {
      this.modalService.dismissAll();
    } else {
      this.storageService.setItem(AppSettings.ACTION_TYPE, AppSettings.SIGN_CLA);
      this.authService.login();
    }
  }

  openDialog(content) {
    this.modalService.dismissAll();
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }

}
