// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { AppSettings } from 'src/app/config/app-settings';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})

export class PageNotFoundComponent implements OnInit {
  message: string;
  actionType: string;

  constructor(
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
    this.actionType = JSON.parse(this.storageService.getItem(AppSettings.ACTION_TYPE));
    this.setMessage();
  }

  setMessage() {
    if (this.actionType !== undefined && this.actionType !== null && this.actionType !== '') {
      this.message = 'Wait... we are validating session';
    } else {
      this.message = 'The page you are looking for was not found.';
    }
  }
}
