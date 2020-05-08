// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { CorporateIconComponent } from './svg/corporate-icon/corporate-icon.component';
import { IndividualIconComponent } from './svg/individual-icon/individual-icon.component';
import { ClaIconComponent } from './svg/cla-icon/cla-icon.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoaderComponent } from './components/loader/loader.component';
import { StorageService } from './services/storage.service';
import { ProjectTitleComponent } from './components/project-title/project-title.component';
import { TrimCharactersPipe } from './pipes/trim-characters';

@NgModule({
    declarations: [
        HeaderComponent,
        CorporateIconComponent,
        IndividualIconComponent,
        ClaIconComponent,
        PageNotFoundComponent,
        LoaderComponent,
        ProjectTitleComponent,
        TrimCharactersPipe
    ],
    imports: [

    ],
    exports: [
        HeaderComponent,
        CorporateIconComponent,
        IndividualIconComponent,
        ClaIconComponent,
        PageNotFoundComponent,
        LoaderComponent,
        ProjectTitleComponent,
        TrimCharactersPipe
    ],
    providers: [StorageService]
})
export class SharedModule { }
