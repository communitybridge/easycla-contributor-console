// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-corporate-dashboard',
  templateUrl: './corporate-dashboard.component.html',
  styleUrls: ['./corporate-dashboard.component.scss']
})
export class CorporateDashboardComponent {
  projectId: string;
  userId: string;

  constructor(
    private route: ActivatedRoute
  ) {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.userId = this.route.snapshot.paramMap.get('userId');
  }
}
