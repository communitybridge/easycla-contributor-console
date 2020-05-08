// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(
    private router: Router
  ) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next();
        }
      }
    });
  }

  success(message: string, hideAfterMillisec?: number) {
    if (hideAfterMillisec) {
      this.hideAfterMillisec(hideAfterMillisec);
    }
    this.subject.next({ type: 'success', text: message, hideAfterMilSec: hideAfterMillisec });
  }

  error(message: string, hideAfterMillisec?: number) {
    if (hideAfterMillisec) {
      this.hideAfterMillisec(hideAfterMillisec);
    }
    this.subject.next({ type: 'error', text: message, hideAfterMilSec: hideAfterMillisec });
  }

  hideAfterMillisec(millisec: number) {
    setTimeout(() => {
      this.clearAlert();
    }, millisec);
  }

  clearAlert() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
