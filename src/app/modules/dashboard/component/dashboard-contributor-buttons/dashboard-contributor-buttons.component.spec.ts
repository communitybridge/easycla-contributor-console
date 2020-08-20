// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardContributorButtonsComponent } from './dashboard-contributor-buttons.component';

describe('DashboardContributorButtonsComponent', () => {
    let component: DashboardContributorButtonsComponent;
    let fixture: ComponentFixture<DashboardContributorButtonsComponent>;

    beforeEach(async(() => {
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
