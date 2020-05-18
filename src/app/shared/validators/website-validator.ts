// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { FormControl } from '@angular/forms';
import { AppSettings } from 'src/app/config/app-settings';

export class UrlValidator {
    static isValid(control: FormControl): any {
        const WEB_PATTERN = new RegExp([AppSettings.URL_PATTERN].join(''));
        const url = control.value;
        const isValid = WEB_PATTERN.test(url);
        if (!isValid) {
            return {
                'not a valid URL': true
            };
        }

        return null;
    }
}
