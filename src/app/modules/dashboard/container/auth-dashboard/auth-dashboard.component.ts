import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/config/app-settings';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-auth-dashboard',
  templateUrl: './auth-dashboard.component.html',
  styleUrls: ['./auth-dashboard.component.scss']
})
export class AuthDashboardComponent implements OnInit {

  constructor(private router:Router, private storageService:StorageService) { }

  ngOnInit(): void {
    const projectId = JSON.parse(this.storageService.getItem(AppSettings.PROJECT_ID));
    const userId = JSON.parse(this.storageService.getItem(AppSettings.USER_ID));
    const redirectUrl = JSON.parse(this.storageService.getItem(AppSettings.REDIRECT));

    this.router.navigate([`/cla/project/${projectId}/user/${userId}`], { queryParams: { redirect:redirectUrl, loggedIn: true} })
  }

}
