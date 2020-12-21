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
    public static SELECTED_COMPANY = 'selectedCompany';
    public static REDIRECT = 'redirect';
    public static AUTH_DATA = 'authData';
    public static ACTION_TYPE = 'actionType';
    public static ACTION_DATA = 'actionData';
    public static SIGN_CLA = 'signCLA';
    public static PROJECT_CONSOLE_LINK = 'proj-console-link';
    public static CORPORATE_CONSOLE_LINK = 'corp-console-link';
    public static AUTH_0_REDIRECTION = 'auth0Redirection';
    public static ORGANIZATION_DETAILS = 'organizationDetails';
    public static HEADER_ACCEPT_LANGUAGE = 'en-US';
    public static HEADER_CONTENT_TYPE = 'application/json';
    public static EMAIL_PATTERN = /^([a-zA-Z0-9_\-\.\+]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    public static USERNAME_REGEX = '/^[a-zA-Z0-9_]{1,15}$/';
    public static COMPANY_NAME_REGEX = '^([\\w\\d\\s\\-\\,\\./]+)$';
    public static URL_PATTERN = /^((http|https):\/\/)?(www.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,}){1,3}(#?\/?[a-zA-Z0-9#-]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
    public static NON_WHITE_SPACE_REGEX = /.*\S.*/;
    public static USER_FIRST_LAST_NAME_REGEX = /^[a-zA-Z]+(([',. -][a-zA-Z])?[a-zA-Z]*)*$/;
    public static GITHUB_EMAIL_CONTENT = 'noreply.github.com';
    public static NEW_ORGANIZATIONS = 'newOrganizations';
    public static LEARN_MORE = 'https://docs.linuxfoundation.org/docs/communitybridge/easycla';
    public static TICKET_URL = 'https://jira.linuxfoundation.org/servicedesk/customer/portal/4/create/143';
    public static LFX_FOOTER = 'lfx-footer';
    public static LFX_HEADER = 'lfx-header';
    public static MAX_FAILED_COUNT = 12;

}
