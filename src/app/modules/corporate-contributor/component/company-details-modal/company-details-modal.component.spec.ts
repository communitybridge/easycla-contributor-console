import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyDetailsModalComponent } from './company-details-modal.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('CompanyDetailsModalComponent', () => {
    let component: CompanyDetailsModalComponent;
    let fixture: ComponentFixture<CompanyDetailsModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CompanyDetailsModalComponent],
            imports: [FormsModule, ReactiveFormsModule, RouterTestingModule],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CompanyDetailsModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
