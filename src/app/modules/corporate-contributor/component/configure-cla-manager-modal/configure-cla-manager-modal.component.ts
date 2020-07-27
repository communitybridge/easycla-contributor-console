// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AppSettings } from 'src/app/config/app-settings';
import { StorageService } from 'src/app/shared/services/storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-configure-cla-manager-modal',
  templateUrl: './configure-cla-manager-modal.component.html',
  styleUrls: ['./configure-cla-manager-modal.component.scss']
})
export class ConfigureClaManagerModalComponent {
  @ViewChild('WarningModal') WarningModal: TemplateRef<any>;
  @Output() ProccedCLAEmitter: EventEmitter<any> = new EventEmitter<any>();
  isProcessed: boolean;

  constructor(
    private claContributorService: ClaContributorService,
    private authService: AuthService,
    private storageService: StorageService,
    private modalService: NgbModal
  ) {
    this.isProcessed = false;
    setTimeout(() => {
      this.isProcessed = true;
    }, 2000);
  }

  onClickProceedBtn() {
    if (this.claContributorService.getUserLFID()) {
      window.open(environment.lfxCorporateUrl, '_self');
    } else {
      this.openDialog(this.WarningModal);
    }
  }

  onClickProccedWithLFLogin() {
    this.storageService.setItem(AppSettings.ACTION_TYPE, AppSettings.SIGN_CLA);
    this.authService.login();
  }

  openDialog(content) {
    this.modalService.dismissAll();
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }

}
