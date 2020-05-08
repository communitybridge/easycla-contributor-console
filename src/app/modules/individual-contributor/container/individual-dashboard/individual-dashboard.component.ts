// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-individual-dashboard',
  templateUrl: './individual-dashboard.component.html',
  styleUrls: ['./individual-dashboard.component.scss']
})
export class IndividualDashboardComponent implements OnInit {
  projectId: string;
  userId: string;
  status: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.userId = this.route.snapshot.paramMap.get('userId');
  }

  ngOnInit(): void {
    this.status = 'Pending';

    setTimeout(() => {
      this.status = 'Completed';
    }, 5000);
  }

  onBackClick() {
    this.router.navigate(['/dashboard'],
      { queryParams: { projectId: this.projectId, userId: this.userId } });
  }
}
