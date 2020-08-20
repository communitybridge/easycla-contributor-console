// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaIconComponent } from './cla-icon.component';

describe('ClaIconComponent', () => {
    let component: ClaIconComponent;
    let fixture: ComponentFixture<ClaIconComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ClaIconComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ClaIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
