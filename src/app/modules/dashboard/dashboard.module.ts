import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaDashboardComponent } from './container/cla-dashboard/cla-dashboard.component';
import { DashboardContributorCardComponent } from './component/dashboard-contributor-card/dashboard-contributor-card.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [ClaDashboardComponent,
    DashboardContributorCardComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class DashboardModule { }
