// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, Output, EventEmitter, Input } from '@angular/core';
@Component({
  selector: 'lfx-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() expanded: boolean;
  
  constructor() { }

}
