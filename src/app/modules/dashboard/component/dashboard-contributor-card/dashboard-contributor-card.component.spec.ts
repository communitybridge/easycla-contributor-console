import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardContributorCardComponent } from './dashboard-contributor-card.component';

describe('DashboardContributorCardComponent', () => {
    let component: DashboardContributorCardComponent;
    let fixture: ComponentFixture<DashboardContributorCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DashboardContributorCardComponent],

        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardContributorCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
