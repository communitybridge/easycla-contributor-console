// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component } from '@angular/core';
import { StorageService } from './shared/services/storage.service';
import { AppSettings } from './config/app-settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor(
    private storageService: StorageService,
  ) {
    this.storageService.setItem(AppSettings.TOKEN_KEY, AppSettings.TOKEN);
  }
  title = 'easycla-contributor-console';
}
