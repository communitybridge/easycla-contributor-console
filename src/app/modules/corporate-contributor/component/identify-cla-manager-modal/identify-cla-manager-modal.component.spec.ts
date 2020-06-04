import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IdentifyClaManagerModalComponent } from './identify-cla-manager-modal.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AlertService } from 'src/app/shared/services/alert.service';
import { StorageService } from 'src/app/shared/services/storage.service';

describe('IdentifyClaManagerModalComponent', () => {
    let component: IdentifyClaManagerModalComponent;
    let fixture: ComponentFixture<IdentifyClaManagerModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IdentifyClaManagerModalComponent],
            imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule],
            providers: [AlertService, StorageService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IdentifyClaManagerModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
