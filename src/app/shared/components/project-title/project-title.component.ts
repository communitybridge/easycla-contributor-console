// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { ProjectModel } from 'src/app/core/models/project';
import { UserModel } from 'src/app/core/models/user';
import { StorageService } from '../../services/storage.service';
import { AppSettings } from 'src/app/config/app-settings';

@Component({
  selector: 'app-project-title',
  templateUrl: './project-title.component.html',
  styleUrls: ['./project-title.component.scss'],
})
export class ProjectTitleComponent implements OnInit {
  @Input() projectId: string;
  @Input() userId: string;
  @Output() errorEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() successEmitter: EventEmitter<any> = new EventEmitter<any>();

  project = new ProjectModel();
  user = new UserModel();

  constructor(
    private storageService: StorageService,
    private claContributorService: ClaContributorService
  ) {}

  ngOnInit(): void {
    const hasGerrit = JSON.parse(
      this.storageService.getItem(AppSettings.HAS_GERRIT)
    );
    if (hasGerrit) {
      this.project.project_name = JSON.parse(
        this.storageService.getItem(AppSettings.PROJECT_NAME)
      );
    } else {
      this.validateGithubFlow();
    }
  }

  validateGithubFlow() {
    this.getUser();
    this.getProject();
  }

  getProject() {
    this.claContributorService.getProject(this.projectId).subscribe(
      (response) => {
        this.project = response;
        this.storageService.setItem(
          AppSettings.PROJECT_NAME,
          this.project.project_name
        );
        this.storageService.setItem(AppSettings.PROJECT_ID, this.projectId);
        this.storageService.setItem(AppSettings.PROJECT, this.project);
        this.successEmitter.emit('Project');
      },
      (exception) => {
        this.errorEmitter.emit(true);
        this.claContributorService.handleError(exception);
      }
    );
  }

  getUser() {
    this.claContributorService.getUser(this.userId).subscribe(
      (response) => {
        this.user = response;
        this.storageService.setItem(AppSettings.USER_ID, this.userId);
        this.storageService.setItem(AppSettings.USER, this.user);
        this.successEmitter.emit('User');
      },
      (exception) => {
        this.errorEmitter.emit(true);
        this.claContributorService.handleError(exception);
      }
    );
  }
}
