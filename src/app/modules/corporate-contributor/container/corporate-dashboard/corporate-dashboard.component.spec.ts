import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateDashboardComponent } from './corporate-dashboard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from 'src/app/shared/services/alert.service';
import { HttpClientModule } from '@angular/common/http';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('CorporateDashboardComponent', () => {
    let component: CorporateDashboardComponent;
    let fixture: ComponentFixture<CorporateDashboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CorporateDashboardComponent],
            imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientModule],
            providers: [AlertService, StorageService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CorporateDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
