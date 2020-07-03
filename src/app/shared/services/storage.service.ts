// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/config/app-settings';

@Injectable()
export class StorageService {
  cookiesItems = [];
  constructor(
  ) { }

  getItem<T>(key: string): T {
    const result = localStorage.getItem(key);
    let resultJson = null;
    if (result != null) {
      resultJson = result;
    }
    return resultJson;
  }

  setItem<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  setItemInCookies(key: string, value: any) {
    this.cookiesItems.push(key);
    const d = new Date();
    d.setTime(d.getTime() + AppSettings.COOKIE_EXPIRY);
    const expires = 'expires=' + d.toUTCString();
    document.cookie = key + '=' + value + ';' + expires + ';path=/';
  }

  getItemFromCookies(key: string) {
    const name = key + '=';
    const ca = document.cookie.split(';');
    for (const i of ca) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  removeItem<T>(key: string) {
    localStorage.removeItem(key);
  }

  removeGerritItems<T>() {
    localStorage.removeItem(AppSettings.GERRIT_ID);
    localStorage.removeItem(AppSettings.GERRIT_USER);
    localStorage.removeItem(AppSettings.ID_TOKEN);
    localStorage.removeItem(AppSettings.CONTRACT_TYPE);
    localStorage.removeItem(AppSettings.SELECTED_COMPANY);
  }

  removeGithubItems<T>() {
    localStorage.removeItem(AppSettings.USER);
    localStorage.removeItem(AppSettings.SELECTED_COMPANY);
  }

  removeAll<T>() {
    localStorage.clear();
  }

  removeAllCookies() {
    const that = this;
    this.cookiesItems.forEach(key => {
      that.setItemInCookies(key, '');
    });
  }
}
