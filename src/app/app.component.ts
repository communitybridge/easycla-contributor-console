// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { redirectForGerritFlow } from './config/auth-utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor(
    public authService: AuthService
  ) {
    this.authService.handleAuthentication();
  }
  title = 'easycla-contributor-console';
}

