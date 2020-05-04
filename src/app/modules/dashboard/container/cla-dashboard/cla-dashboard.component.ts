// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-cla-dashboard',
  templateUrl: './cla-dashboard.component.html',
  styleUrls: ['./cla-dashboard.component.scss']
})
export class ClaDashboardComponent implements OnInit {
  corporateHightlights: string[];
  individualHightlights: string[];
  corporateContributor = 'Corporate Contributor';
  individualContributor = 'Individual Contributor';

  constructor() { }

  ngOnInit(): void {
    this.corporateHightlights = [
      'If you are making a contribution of content owned by your employer, you should proceed as a corporate contributor.',
      'The Corporate CLA process requires you to be whitelisted by your company\'s CLA Manager. A CLA Manager at your company will receive your request via email immediately after you submit it.To expedite the process, you can follow up with them directly.',
      'If your company has not yet signed a CLA for this project, you will be able to coordinate designating a CLA Manager and having the CLA signed by someone at your company who is authorized to sign.',
      'If your company is not registered in CommunityBridge, then you can also optionally create a profile for your company in CommunityBridge if you would like.'
    ];

    this.individualHightlights = [
      'If you are making a contribution of content that you own, and not content owned by your employer, you should proceed as an individual contributor.',
      'If you are in doubt whether your contribution is owned by you or your employer, you should check with your employer or an attorney.'
    ];
  }

  onClickCorporateProceed() {
    // TODO
  }

  onClickIndividualProceed() {
    // TODO
  }
}

