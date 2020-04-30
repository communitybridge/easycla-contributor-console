import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { LogoSvgComponent } from './components/logo-svg/logo-svg.component';

@NgModule({
    declarations: [
        HeaderComponent,
        LogoSvgComponent
    ],
    imports: [

    ],
    exports: [
        HeaderComponent
    ],
    providers: []
})
export class SharedModule { }
