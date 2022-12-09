// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ClaNotSignedModalComponent } from './cla-not-signed-modal.component';

describe('ClaNotSignedModalComponent', () => {
    let component: ClaNotSignedModalComponent;
    let fixture: ComponentFixture<ClaNotSignedModalComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ClaNotSignedModalComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ClaNotSignedModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
