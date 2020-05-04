// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-dashboard-contributor-card',
  templateUrl: './dashboard-contributor-card.component.html',
  styleUrls: ['./dashboard-contributor-card.component.scss']
})
export class DashboardContributorCardComponent {
  @Input() type: string;
  @Input() highlights: string[];

  constructor() { }

}
