// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-contributor-buttons',
  templateUrl: './dashboard-contributor-buttons.component.html',
  styleUrls: ['./dashboard-contributor-buttons.component.scss']
})
export class DashboardContributorButtonsComponent implements OnInit {
  @Input() type: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
