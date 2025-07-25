// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  lfxHeader: 'https://cdn.dev.platform.linuxfoundation.org',
  ACCEPTABLE_USER_POLICY:
    'https://communitybridge.dev.platform.linuxfoundation.org/acceptable-use/',
  SERVICE_SPECIFIC_TERM:
    'https://communitybridge.dev.platform.linuxfoundation.org/service-terms/',
  PLATFORM_USER_AGREEMENT:
    'https://communitybridge.dev.platform.linuxfoundation.org/platform-use-agreement/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
