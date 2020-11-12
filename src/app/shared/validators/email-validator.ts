// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { FormControl } from '@angular/forms';
import { AppSettings } from 'src/app/config/app-settings';

export class EmailValidator {
    static isValid(control: FormControl): any {
        const EMAIL_PATTERN = new RegExp(AppSettings.EMAIL_PATTERN);
        const email = control.value;
        const isValid = EMAIL_PATTERN.test(email);
        if (!isValid) {
            return {
                'not a valid email address': true
            };
        }

        return null;
    }
}
