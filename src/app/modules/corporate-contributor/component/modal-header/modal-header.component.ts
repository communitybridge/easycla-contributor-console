// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss']
})
export class ModalHeaderComponent {
  @Input() title: string;
  @Input() showCloseBtn: boolean;
  @Output() closeDialogEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  onClickClose() {
    this.closeDialogEmitter.emit();
  }
}
