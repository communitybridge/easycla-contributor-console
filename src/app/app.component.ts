// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'easycla-contributor-console';
  hasExpanded: boolean;
  links: any[];

  constructor(
    public authService: AuthService
  ) {
    this.authService.handleAuthentication();
  }

  onToggled() {
    this.hasExpanded = !this.hasExpanded;
  }

  ngOnInit() {
    this.hasExpanded = true;
    this.links = [
      {
        title: 'Project Login',
        url: environment.PROJECT_LOGIN_URL
      },
      {
        title: 'CLA Manager Login',
        url: environment.CORPORATE_LOGIN_URL
      },
      {
        title: 'Developer',
        url: environment.CONTRIBUTOR_LOGIN_URL
      }
    ];
    const element: any = document.getElementById('lfx-header');
    element.links = this.links;
    this.mounted();
  }

  mounted() {
    const script = document.createElement('script');
    script.setAttribute(
      'src',
      environment.LFX_HEADER_URL
    );
    document.head.appendChild(script);
  }
}
