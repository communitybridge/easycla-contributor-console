// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { CorporateIconComponent } from './svg/corporate-icon/corporate-icon.component';
import { IndividualIconComponent } from './svg/individual-icon/individual-icon.component';
import { ClaIconComponent } from './svg/cla-icon/cla-icon.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

@NgModule({
    declarations: [
        HeaderComponent,
        CorporateIconComponent,
        IndividualIconComponent,
        ClaIconComponent,
        PageNotFoundComponent
    ],
    imports: [

    ],
    exports: [
        HeaderComponent,
        CorporateIconComponent,
        IndividualIconComponent,
        ClaIconComponent,
        PageNotFoundComponent
    ],
    providers: []
})
export class SharedModule { }
