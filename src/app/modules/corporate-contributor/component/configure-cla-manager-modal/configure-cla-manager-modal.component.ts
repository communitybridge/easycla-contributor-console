// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-configure-cla-manager-modal',
  templateUrl: './configure-cla-manager-modal.component.html',
  styleUrls: ['./configure-cla-manager-modal.component.scss']
})
export class ConfigureClaManagerModalComponent {
  isProcessed: boolean;
  @Output() ProccedCLAEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.isProcessed = false;
    setTimeout(() => {
      this.isProcessed = true;
    }, 2000);
  }

  onClickProceedBtn() {

  }

}
