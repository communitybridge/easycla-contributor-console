// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CorporateDashboardComponent} from './container/corporate-dashboard/corporate-dashboard.component';
import {SharedModule} from 'src/app/shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ClaNotSignedModalComponent} from './component/cla-not-signed-modal/cla-not-signed-modal.component';
import {AddCompanyModalComponent} from './component/add-company-modal/add-company-modal.component';
import {IdentifyClaManagerModalComponent} from './component/identify-cla-manager-modal/identify-cla-manager-modal.component';
import {ConfigureClaManagerModalComponent} from './component/configure-cla-manager-modal/configure-cla-manager-modal.component';
import {ModalHeaderComponent} from './component/modal-header/modal-header.component';
import {ClaRequestAuthorizationComponent} from './container/cla-request-authorization/cla-request-authorization.component';

@NgModule({
  declarations: [CorporateDashboardComponent, ClaNotSignedModalComponent, AddCompanyModalComponent,
    IdentifyClaManagerModalComponent, ConfigureClaManagerModalComponent, ModalHeaderComponent,
    ClaRequestAuthorizationComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class CorporateContributorModule {
}
