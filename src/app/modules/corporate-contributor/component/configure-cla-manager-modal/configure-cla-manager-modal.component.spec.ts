// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigureClaManagerModalComponent } from './configure-cla-manager-modal.component';

describe('ConfigureClaManagerModalComponent', () => {
    let component: ConfigureClaManagerModalComponent;
    let fixture: ComponentFixture<ConfigureClaManagerModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfigureClaManagerModalComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigureClaManagerModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
