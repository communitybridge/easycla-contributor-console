// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { FormControl } from '@angular/forms';

export class TelephoneNumberValidator {
    static isValid(control: FormControl): any {
        const TELEPHONE_PATTERN = new RegExp(['^\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$'].join(''));
        const number = control.value;
        const isValid = TELEPHONE_PATTERN.test(number);
        if (!isValid) {
            return {
                'not a valid telephone number': true
            };
        }

        return null;
    }
}
