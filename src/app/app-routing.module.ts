// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClaDashboardComponent } from './modules/dashboard/container/cla-dashboard/cla-dashboard.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { IndividualDashboardComponent } from './modules/individual-contributor/container/individual-dashboard/individual-dashboard.component';
import { CorporateDashboardComponent } from './modules/corporate-contributor/container/corporate-dashboard/corporate-dashboard.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard'
  },
  {
    path: 'dashboard',
    pathMatch: 'full',
    component: ClaDashboardComponent
  },
  {
    path: 'individual-dashboard/:projectId/:userId',
    pathMatch: 'full',
    component: IndividualDashboardComponent
  },
  {
    path: 'corporate-dashboard/:projectId/:userId',
    pathMatch: 'full',
    component: CorporateDashboardComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
