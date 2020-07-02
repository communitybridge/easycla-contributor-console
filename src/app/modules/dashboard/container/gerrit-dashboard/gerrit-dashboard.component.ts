import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AppSettings } from 'src/app/config/app-settings';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-gerrit-dashboard',
  templateUrl: './gerrit-dashboard.component.html',
  styleUrls: ['./gerrit-dashboard.component.scss']
})
export class GerritDashboardComponent implements OnInit {
  projectId: string;
  userId: string;
  contractType: string;

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.storageService.setItem(AppSettings.HAS_GERRIT_USER, true);
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.storageService.setItem('projectId', this.projectId);
    this.contractType = this.route.snapshot.paramMap.get('contractType');
    this.storageService.setItem('contractType', this.contractType);
    if (this.authService.isAuthenticated()) {
      this.redirectAsPerContract();
    } else {
      this.authService.login();
    }
  }

  redirectAsPerContract() {
    if (this.contractType === 'individual') {
      const url = '/individual-dashboard/' + this.projectId + '/' + this.userId;
      this.router.navigate([url]);
    } else if (this.contractType === 'corporate') {
      const url = '/corporate-dashboard/' + this.projectId + '/' + this.userId;
      this.router.navigate([url]);
    } else {
      this.alertService.error('Contract type is invalid.')
    }
  }

}
