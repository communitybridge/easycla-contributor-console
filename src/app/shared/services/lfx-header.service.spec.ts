// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { TestBed } from '@angular/core/testing';

import { LfxHeaderService } from './lfx-header.service';

describe('LfxHeaderService', () => {
  let service: LfxHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LfxHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
