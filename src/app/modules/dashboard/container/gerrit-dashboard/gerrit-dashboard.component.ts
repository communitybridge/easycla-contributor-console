import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AppSettings } from 'src/app/config/app-settings';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-gerrit-dashboard',
  templateUrl: './gerrit-dashboard.component.html',
  styleUrls: ['./gerrit-dashboard.component.scss']
})
export class GerritDashboardComponent implements OnInit {
  gerritId: string;
  contractType: string;

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.gerritId = this.route.snapshot.paramMap.get('gerritId');
    this.contractType = this.route.snapshot.paramMap.get('contractType');
    this.storageService.setItem(AppSettings.GERRIT_ID, this.gerritId);
    this.storageService.setItem(AppSettings.CONTRACT_TYPE, this.contractType);
    this.authService.login();
  }

}
