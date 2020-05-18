// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cla-not-signed-modal',
  templateUrl: './cla-not-signed-modal.component.html',
  styleUrls: ['./cla-not-signed-modal.component.scss']
})
export class ClaNotSignedModalComponent {
  @Output() yesEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() noEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  onClickNoBtn() {
    this.noEmitter.emit();
  }

  onClickYesBtn() {
    this.yesEmitter.emit();
  }

}
