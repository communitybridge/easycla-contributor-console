// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {
  @Input() checked: boolean;
  @Input() message1: string;
  @Input() message2: string;
  @Output() checkboxEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  onCheckboxClick() {
    this.checked = !this.checked;
    this.checkboxEmitter.emit(this.checked);
  }

}
