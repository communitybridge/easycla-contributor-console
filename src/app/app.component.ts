// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'easycla-contributor-console';
  hasExpanded: boolean;
  links: any[];

  onToggled() {
    this.hasExpanded = !this.hasExpanded;
  }

  ngOnInit() {
    this.mountHeader();
    this.hasExpanded = true;
  }

  private mountHeader(): void {
    const script = document.createElement('script');
    script.setAttribute('src', environment.lfxHeader + '/lfx-header-v2.js');
    script.setAttribute('async', 'true');
    document.head.appendChild(script);
  }
}
