// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaRequestAuthorizationComponent } from './cla-request-authorization.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from 'src/app/shared/services/alert.service';
import { HttpClientModule } from '@angular/common/http';
import { StorageService } from 'src/app/shared/services/storage.service';

describe('ClaRequestAuthorizationComponent', () => {
    let component: ClaRequestAuthorizationComponent;
    let fixture: ComponentFixture<ClaRequestAuthorizationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ClaRequestAuthorizationComponent],
            imports: [RouterTestingModule, HttpClientModule],
            providers: [AlertService, StorageService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ClaRequestAuthorizationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
