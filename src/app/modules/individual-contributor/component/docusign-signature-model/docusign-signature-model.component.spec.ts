// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocusignSignatureModelComponent } from './docusign-signature-model.component';

describe('DocusignSignatureModelComponent', () => {
    let component: DocusignSignatureModelComponent;
    let fixture: ComponentFixture<DocusignSignatureModelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DocusignSignatureModelComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DocusignSignatureModelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
