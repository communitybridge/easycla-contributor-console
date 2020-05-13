import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorporateDashboardComponent } from './container/corporate-dashboard/corporate-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectCompanyComponent } from './component/select-company/select-company.component';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CorporateDashboardComponent, SelectCompanyComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule
  ]
})
export class CorporateContributorModule { }
