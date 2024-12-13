// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppSettings } from 'src/app/config/app-settings';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-docusign-signature-model',
  templateUrl: './docusign-signature-model.component.html',
  styleUrls: ['./docusign-signature-model.component.scss']
})
export class DocusignSignatureModelComponent {
  @Input() status: string;
  @Output() backBtnEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() signCLAEmitter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('successModal') successModal: TemplateRef<any>;

  title: string;
  message: string;
  hasTermAccepted = false;

  constructor(
    private storageService: StorageService,
    private modalService: NgbModal
  ) { }

  onClickBack() {
    this.backBtnEmitter.emit();
  }

  onClickSignCLA() {
    const hasGerrit = JSON.parse(this.storageService.getItem(AppSettings.HAS_GERRIT));
    const consoleType = JSON.parse(this.storageService.getItem(AppSettings.CONTRACT_TYPE));
    if (hasGerrit && consoleType === 'individual') {
      this.showGerritMessage();
    } else {
      this.signCLAEmitter.emit();
    }
  }

  showGerritMessage() {
    this.title = 'Important Note';
    this.message = 'Please note that after you have signed the CLA, you will need to logout and log back in to your Gerrit account to get the updated permissions. After completing this, ' +
      'the EasyCLA check will be complete and enabled for all future code contributions for this project.';
    this.modalService.open(this.successModal, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  }

  onClickModalSuccessBtn() {
    this.modalService.dismissAll();
    this.signCLAEmitter.emit();
  }
}
