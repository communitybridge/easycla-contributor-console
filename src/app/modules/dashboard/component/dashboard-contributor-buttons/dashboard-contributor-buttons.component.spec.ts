// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardContributorButtonsComponent } from './dashboard-contributor-buttons.component';

describe('DashboardContributorButtonsComponent', () => {
    let component: DashboardContributorButtonsComponent;
    let fixture: ComponentFixture<DashboardContributorButtonsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [DashboardContributorButtonsComponent],

        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardContributorButtonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
