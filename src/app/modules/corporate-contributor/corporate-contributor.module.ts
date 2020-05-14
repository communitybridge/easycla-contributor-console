import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorporateDashboardComponent } from './container/corporate-dashboard/corporate-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CorporateDashboardComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class CorporateContributorModule { }
