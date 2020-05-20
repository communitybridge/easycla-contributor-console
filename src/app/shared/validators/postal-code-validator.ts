// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { FormControl } from '@angular/forms';

export class PostalCodeValidator {
    static isValid(control: FormControl): any {
        const POSTAL_CODE_PATTERN = new RegExp(['^[0-9]{5}(?:-[0-9]{4})?$'].join(''));
        const number = control.value;
        let isValid = POSTAL_CODE_PATTERN.test(number);
        if (!isValid) {
            return {
                'not a valid postal code': true
            };
        }

        return null;
    }
}
