// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})

export class PageNotFoundComponent implements OnInit {
  message: string;
  actionType: string;

  constructor(
  ) { }

  ngOnInit(): void {
    this.message = 'Wait... we are validating session';
    // If auth0 response is null then page not exist.
    setTimeout(() => {
      this.message = 'The page you are looking for was not found.';
    }, 2000);
  }
}
