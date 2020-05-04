import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-contributor-buttons',
  templateUrl: './dashboard-contributor-buttons.component.html',
  styleUrls: ['./dashboard-contributor-buttons.component.scss']
})
export class DashboardContributorButtonsComponent {
  @Input() type: string = '';

  constructor() { }

}
