// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';


const script = document.createElement('script');
script.setAttribute(
  'src',
  'http://127.0.0.1:8081/lfx-header.js'
  // EnvConfig.default[AppSettings.LFX_HEADER]
);
document.head.appendChild(script);

@Injectable({
  providedIn: 'root'
})
export class LfxHeaderService {

  constructor(
    private auth: AuthService
  ) {
    this.setUserInLFxHeader();
    // this.setCallBackUrl();
  }

  setCallBackUrl() {
    console.log('### 1 entered setCallBackUrl');
    const lfHeaderEl: any = document.getElementById('lfx-header');
    if (!lfHeaderEl) {
      return;
    }
    console.log('### 2 app setCallBackUrl ', this.auth.auth0Options.callbackUrl);
    lfHeaderEl.callbackurl = this.auth.auth0Options.callbackUrl;
  }

  setUserInLFxHeader(): void {
    const lfHeaderEl: any = document.getElementById('lfx-header');
    if (!lfHeaderEl) {
      return;
    }
    this.auth.userProfile$.subscribe((data) => {
      if (data) {
        lfHeaderEl.authuser = data;
      }
    });
    // setTimeout(() => {
    // }, 2000);
  }
}
