// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClaDashboardComponent } from './modules/dashboard/container/cla-dashboard/cla-dashboard.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { IndividualDashboardComponent } from './modules/individual-contributor/container/individual-dashboard/individual-dashboard.component';
import { CorporateDashboardComponent } from './modules/corporate-contributor/container/corporate-dashboard/corporate-dashboard.component';
import { ClaRequestAuthorizationComponent } from './modules/corporate-contributor/container/cla-request-authorization/cla-request-authorization.component';
import { GerritDashboardComponent } from './modules/dashboard/container/gerrit-dashboard/gerrit-dashboard.component';
import { AuthComponent } from './shared/components/auth/auth.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/cla'
  },
  {
    path: 'auth',
    pathMatch: 'full',
    component: AuthComponent
  },
  {
    path: 'cla/project/:projectId',
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
    component: CorporateDashboardComponent,
  },
  {
    path: 'corporate-dashboard/request-authorization/:projectId/:userId',
    pathMatch: 'full',
    component: ClaRequestAuthorizationComponent
  },
  {
    path: 'cla/gerrit/project/:projectId/:contractType',
    pathMatch: 'full',
    component: GerritDashboardComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
