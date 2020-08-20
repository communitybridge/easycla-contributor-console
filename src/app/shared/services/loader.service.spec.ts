// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoaderService', () => {
    let service: LoaderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        });
        service = TestBed.inject(LoaderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
