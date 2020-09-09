// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, TemplateRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AppSettings } from 'src/app/config/app-settings';
import { StorageService } from 'src/app/shared/services/storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationModel } from 'src/app/core/models/organization';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-configure-cla-manager-modal',
  templateUrl: './configure-cla-manager-modal.component.html',
  styleUrls: ['./configure-cla-manager-modal.component.scss']
})
export class ConfigureClaManagerModalComponent {
  @ViewChild('errorModal') errorModal: TemplateRef<any>;
  @ViewChild('warningModal') warningModal: TemplateRef<any>;
  @Output() showCloseBtnEmitter: EventEmitter<any> = new EventEmitter<any>();

  title: string;
  message: string;
  company: OrganizationModel;
  hasCLAManagerDesignee: boolean;

  constructor(
    private claContributorService: ClaContributorService,
    private authService: AuthService,
    private storageService: StorageService,
    private modalService: NgbModal,
    private alertService: AlertService
  ) {
    this.hasCLAManagerDesignee = false;
    this.showCloseBtnEmitter.emit(false);

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
      if (this.claContributorService.hasTokenValid()) {
        this.addAsCLAManagerDesignee();
      } else {
        this.redirectToAuth0();
      }
    } else {
      this.message = '<p>You will need to create an SSO account with the Linux Foundation to proceed.</p>' +
        '<p>On successful creation of your account, you will be redirected to sign in with your SSO account' +
        ' into the organization dashboard where you can sign the CLAs and approve contributors on behalf of your organization.</p>';
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
        this.proccedToCorporateConsole();
      },
      (exception) => {
        if (exception.status === 409) {
          // User has already CLA manager designee.
          this.proccedToCorporateConsole();
        } else {
          this.title = 'Request Failed';
          this.storageService.removeItem(AppSettings.ACTION_TYPE);
          this.message = exception.error.Message;
          this.openDialog(this.errorModal);
        }
      }
    );
  }

  proccedToCorporateConsole() {
    this.storageService.removeItem(AppSettings.ACTION_TYPE);
    this.hasCLAManagerDesignee = true;
    this.showCloseBtnEmitter.emit(true);
  }

  onClickProceedBtn() {
    this.modalService.dismissAll();
    this.message = '<p>You will be redirected to the organization dashboard where you can sign the CLAs and approve contributors on behalf of your organization.</p>';
    this.message += '<p>Note: To continue please disable pop-up blocker for this site.</p>';
    this.openDialog(this.warningModal);
  }

  onClickProccedModalBtn() {
    if (!this.hasCLAManagerDesignee) {
      this.redirectToAuth0();
    } else {
      this.modalService.dismissAll();
      const hasGerrit = JSON.parse(this.storageService.getItem(AppSettings.HAS_GERRIT));
      const flashMsg = 'Your ' + (hasGerrit ? 'Gerrit' : 'GitHub') + ' session has been preserved in the current tab so that you can always come back to it after completing CLA signing';
      this.alertService.success(flashMsg);
      setTimeout(() => {
        this.storageService.removeItem(AppSettings.ACTION_TYPE);
        const corporateUrl = this.claContributorService.getLFXCorporateURL();
        window.open(corporateUrl, '_blank');
      }, 4500);

      setTimeout(() => {
        const redirectUrl = JSON.parse(this.storageService.getItem(AppSettings.REDIRECT));
        window.open(redirectUrl, '_self');
      }, 5000);
    }
  }

  redirectToAuth0() {
    this.storageService.setItem(AppSettings.ACTION_TYPE, AppSettings.SIGN_CLA);
    this.authService.login();
  }

  onClickBackBtn() {
    const data = {
      action: 'CLA_NOT_SIGN',
      payload: false
    }
    this.claContributorService.openDialogModalEvent.next(data);
  }

  onClickClose() {
    this.modalService.dismissAll();
  }

  openDialog(content) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  }

}
