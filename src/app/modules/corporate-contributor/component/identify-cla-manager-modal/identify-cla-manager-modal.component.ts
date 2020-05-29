// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { UserModel } from 'src/app/core/models/user';
import { ProjectModel } from 'src/app/core/models/project';

@Component({
  selector: 'app-identify-cla-manager-modal',
  templateUrl: './identify-cla-manager-modal.component.html',
  styleUrls: ['./identify-cla-manager-modal.component.scss']
})
export class IdentifyClaManagerModalComponent implements OnInit {
  @Input() hasShowContactAdmin: boolean;
  form: FormGroup;
  message: string;
  title: string;
  hasError: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private claContributorService: ClaContributorService,
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
    });
  }

  onClickSubmit(content) {
    this.postEmailToCompanyAdmin(content);
  }

  postEmailToCompanyAdmin(content) {
    const project: ProjectModel = JSON.parse(this.storageService.getItem('project'));
    const user: UserModel = JSON.parse(this.storageService.getItem('user'));
    let data = {
      contributor_name: user.user_github_username,
      contributor_email: user.user_emails[0],
      cla_manager_name: 'Amol Sontakke',
      cla_manager_email: this.form.controls.email.value,
      project_name: project.project_name,
      company_name: 'Proxima',
    };
    this.claContributorService.postEmailToCompanyAdmin(user.user_id, data).subscribe(
      () => {
        this.hasError = false;
        this.title = 'Notification Sent';
        this.message = 'An email has been sent to "' + this.form.controls.email.value + '" to request that they start the CLA signature process.';
        if (this.hasShowContactAdmin) {
          this.title = 'Request Submitted';
          this.message = 'Your authorized representative has been contacted. You will need to follow up with them to process your CLA request.';
        }
        this.openDialogModal(content);
      },
      (exception) => {
        this.hasError = true;
        this.title = 'Request Failed';
        this.message = 'Your request is Failed due to internal server error please try later.';
        this.openDialogModal(content);
        this.claContributorService.handleError(exception);
      }
    );
  }

  onClickContactAdmin(content) {

    this.hasError = false;
    this.title = 'Request Submitted to Company Admin';
    this.message = 'Your Company Admin has been contacted, you will need to follow up with them to process your CLA request.';
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }

  onClickExitCLABtn() {
    this.modalService.dismissAll();
  }

  openDialogModal(content) {
    this.modalService.dismissAll();
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }

}
