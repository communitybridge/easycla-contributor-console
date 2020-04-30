import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-contributor-card',
  templateUrl: './dashboard-contributor-card.component.html',
  styleUrls: ['./dashboard-contributor-card.component.scss']
})
export class DashboardContributorCardComponent implements OnInit {
  @Input() type: string = '';
  @Input() highlights: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
