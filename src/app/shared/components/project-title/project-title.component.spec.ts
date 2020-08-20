// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectTitleComponent } from './project-title.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '../../services/alert.service';
import { StorageService } from '../../services/storage.service';
import { HttpClientModule } from '@angular/common/http';

describe('ProjectTitleComponent', () => {
    let component: ProjectTitleComponent;
    let fixture: ComponentFixture<ProjectTitleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProjectTitleComponent],
            imports: [RouterTestingModule, HttpClientModule],
            providers: [AlertService, StorageService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectTitleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
