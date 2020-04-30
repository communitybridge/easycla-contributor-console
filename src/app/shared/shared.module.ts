import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { CorporateIconComponent } from './svg/corporate-icon/corporate-icon.component';
import { IndividualIconComponent } from './svg/individual-icon/individual-icon.component';
import { ClaIconComponent } from './svg/cla-icon/cla-icon.component';

@NgModule({
    declarations: [
        HeaderComponent,
        CorporateIconComponent,
        IndividualIconComponent,
        ClaIconComponent
    ],
    imports: [

    ],
    exports: [
        HeaderComponent,
        CorporateIconComponent,
        IndividualIconComponent,
        ClaIconComponent
    ],
    providers: []
})
export class SharedModule { }
