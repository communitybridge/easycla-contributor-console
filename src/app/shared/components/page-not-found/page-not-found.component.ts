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
  redirectUrl:string;

  constructor(private storageService:StorageService){

  }

  ngOnInit(): void {
    this.redirectUrl = JSON.parse(this.storageService.getItem(AppSettings.REDIRECT));
  }
}
