// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Injectable } from '@angular/core';

@Injectable()
export class AppSettings {
    /* eslint-disable */
    public static COOKIE_EXPIRY = (30 * 24 * 60 * 60 * 1000);
    public static GERRIT = 'Gerrit';
    public static GITHUB = 'Github';
    public static PROJECT_ID = 'projectId';
    public static HAS_GERRIT = 'hasGerrit';
    public static PROJECT_NAME = 'projectName';
    public static USER = 'user';
    public static PROJECT = 'project';
    public static USER_ID = 'userId';
    public static CONTRACT_TYPE = 'contractType';
    public static ID_TOKEN = 'id_token';
    public static SELECTED_COMPANY = 'selectedCompany';
    public static REDIRECT = 'redirect';
    public static AUTH_DATA = 'authData';
    public static ACTION_TYPE = 'actionType';
    public static ACTION_DATA = 'actionData';
    public static SIGN_CLA = 'signCLA';
    public static HEADER_ACCEPT_LANGUAGE = 'en-US';
    public static HEADER_CONTENT_TYPE = 'application/json';
    public static EMAIL_PATTERN = '[a-z|A-Z|0-9]+[@]+[a-z|A-Z|0-9]+[.]+([a-z|A-Z|0-9]){2}';
    public static USERNAME_REGEX = '/^[a-zA-Z0-9_]{1,15}$/';
    public static COMPANY_NAME_REGEX = '^([\\w\\d\\s\\-\\,\\./]+)$';
    public static URL_PATTERN = '^((ht|f)tp(s?))\://([0-9a-zA-Z\-]+\.)+[0-9a-zA-Z]{2,6}(\:[0-9]+)?(/\S*)?$';
    public static  NON_WHITE_SPACE_REGEX: RegExp = new RegExp('.*S.*');

}


