// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { EnvConfig } from '../../config/cla-env-utils';
import { AppSettings } from '../../config/app-settings';
import { environment } from '../../../environments/environment';

const script = document.createElement('script');
    script.setAttribute(
      'src',
      EnvConfig.default[AppSettings.LFX_HEADER]
    );
    document.head.appendChild(script);

@Injectable({
  providedIn: 'root'
})
export class LfxHeaderService {
  links: any[];

  constructor(
    private auth: AuthService
  ) {
    this.setUserInLFxHeader();
    this.setLinks();
    this.setCallBackUrl();
  }

  setLinks() {
    this.links = [
      {
        title: 'Project Login',
        url: environment.PROJECT_CONSOLE,
      },
      {
        title: 'CLA Manager Login',
        url: environment.CORPORATE_CONSOLE,
      },
      {
        title: 'Developer',
        url: AppSettings.LEARN_MORE
      }
    ];
    const element: any = document.getElementById('lfx-header');
    element.links = this.links;
  }

  setCallBackUrl() {
    const lfHeaderEl: any = document.getElementById('lfx-header');
    if (!lfHeaderEl) {
      return;
    }
    lfHeaderEl.callbackurl = this.auth.auth0Options.callbackUrl;
  }

  setUserInLFxHeader(): void {
    setTimeout(() => {
      const lfHeaderEl: any = document.getElementById('lfx-header');
      if (!lfHeaderEl) {
        return;
      }
      this.auth.userProfile$.subscribe((data) => {
        if (data) {
          lfHeaderEl.authuser = data;
        }
      });
    }, 2000);
  }
}
