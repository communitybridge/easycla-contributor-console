// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-docusign-signature-model',
  templateUrl: './docusign-signature-model.component.html',
  styleUrls: ['./docusign-signature-model.component.scss']
})
export class DocusignSignatureModelComponent implements OnInit {
  @Input() status: string;
  @Output() backBtnEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() signCLAEmitter: EventEmitter<any> = new EventEmitter<any>();
  checkedItems: string[];

  constructor() { }

  ngOnInit(): void {
    this.checkedItems = [
      'Generating Contract',
      'Adding Information',
      'Document Ready'
    ];
  }

  onClickBack() {
    this.backBtnEmitter.emit();
  }

  onClickSignCLA() {
    this.signCLAEmitter.emit();
  }
}
