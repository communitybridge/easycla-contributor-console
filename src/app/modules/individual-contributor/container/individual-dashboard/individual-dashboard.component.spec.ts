import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDashboardComponent } from './individual-dashboard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from 'src/app/shared/services/alert.service';
import { HttpClientModule } from '@angular/common/http';
import { StorageService } from 'src/app/shared/services/storage.service';

describe('IndividualDashboardComponent', () => {
    let component: IndividualDashboardComponent;
    let fixture: ComponentFixture<IndividualDashboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IndividualDashboardComponent],
            imports: [RouterTestingModule, HttpClientModule],
            providers: [AlertService, StorageService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IndividualDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
