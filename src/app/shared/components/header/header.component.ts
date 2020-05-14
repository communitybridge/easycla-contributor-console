// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-cla-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() logoEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  onClickLogo() {
    this.logoEmitter.emit();
  }

}
