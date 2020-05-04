// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaDashboardComponent } from './container/cla-dashboard/cla-dashboard.component';
import { DashboardContributorCardComponent } from './component/dashboard-contributor-card/dashboard-contributor-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardContributorButtonsComponent } from './component/dashboard-contributor-buttons/dashboard-contributor-buttons.component';

@NgModule({
  declarations: [ClaDashboardComponent,
    DashboardContributorCardComponent,
    DashboardContributorButtonsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class DashboardModule { }
