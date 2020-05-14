import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndividualDashboardComponent } from './container/individual-dashboard/individual-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocusignSignatureModelComponent } from './component/docusign-signature-model/docusign-signature-model.component';


@NgModule({
  declarations: [IndividualDashboardComponent, DocusignSignatureModelComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class IndividualContributorModule { }
