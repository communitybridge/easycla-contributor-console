// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT


// To run this project you required node version 12.0.0 or higher, yarn 1.13.0 or higher.

import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorageService } from './shared/services/storage.service';
import { AppSettings } from './config/app-settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'easycla-contributor-console';
  hasExpanded: boolean;
  hasTermAccepted: boolean;
  showDashboard: boolean;
  links: any[];

  onToggled() {
    this.hasExpanded = !this.hasExpanded;
  }

  constructor(private storageService: StorageService) {
    this.showDashboard = false;
    this.hasTermAccepted = false;
  }

  ngOnInit() {
    // Added for future use to not show the terms page if the user has already accepted the terms
    
    // const hasAlreadyAcceptedTerms = JSON.parse(
    //   this.storageService.getItem(AppSettings.ACCEPTED_TERMS)
    // );
    // if(hasAlreadyAcceptedTerms) {
    //   this.showDashboard = true;
    //   this.hasTermAccepted = true;
    // } else {
    //   this.showDashboard = false;
    //   this.hasTermAccepted = false;
    // }

    this.mountHeader();
    this.hasExpanded = true;
  }

  onClickTermAccepted(event:boolean) {
    this.hasTermAccepted = event
    this.storageService.setItem(AppSettings.ACCEPTED_TERMS, this.hasTermAccepted);
  }

  onClickContinue() {
    if(this.hasTermAccepted) {
      this.storageService.setItem(AppSettings.ACCEPTED_TERMS, true);
      this.showDashboard = true;
    }
  }

  private mountHeader(): void {
    const script = document.createElement('script');
    script.setAttribute('src', environment.lfxHeader + '/lfx-header-v2.js');
    script.setAttribute('async', 'true');
    document.head.appendChild(script);
  }
}
