import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaDashboardComponent } from './cla-dashboard.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ClaDashboardComponent', () => {
    let component: ClaDashboardComponent;
    let fixture: ComponentFixture<ClaDashboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ClaDashboardComponent],
            imports: [RouterTestingModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ClaDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
