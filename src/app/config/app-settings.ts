// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Injectable } from '@angular/core';

@Injectable()
export class AppSettings {
    /* eslint-disable */
    public static COOKIE_EXPIRY = (30 * 24 * 60 * 60 * 1000);
    public static CLA_USER = 'cla-user';
    public static HAS_GERRIT_USER = 'hasGerritUser';
    public static GERRIT_USER = 'gerritUser';
    public static HEADER_ACCEPT_LANGUAGE = 'en-US';
    public static HEADER_CONTENT_TYPE = 'application/json';
    public static EMAIL_PATTERN = '[a-z|A-Z|0-9]+[@]+[a-z|A-Z|0-9]+[.]+([a-z|A-Z|0-9]){2}';
    public static USERNAME_REGEX = '/^[a-zA-Z0-9_]{1,15}$/';
    public static COMPANY_NAME_REGEX = '^([\\w\\d\\s\\-\\,\\./]+)$';
    public static URL_PATTERN = '^((ht|f)tp(s?))\://([0-9a-zA-Z\-]+\.)+[0-9a-zA-Z]{2,6}(\:[0-9]+)?(/\S*)?$';
}
