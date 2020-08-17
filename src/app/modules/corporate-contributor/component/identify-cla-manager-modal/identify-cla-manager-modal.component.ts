// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { UserModel } from 'src/app/core/models/user';
import { ProjectModel } from 'src/app/core/models/project';
import { OrganizationModel } from 'src/app/core/models/organization';
import { AlertService } from 'src/app/shared/services/alert.service';
import { EmailValidator } from 'src/app/shared/validators/email-validator';
import { AppSettings } from 'src/app/config/app-settings';

@Component({
  selector: 'app-identify-cla-manager-modal',
  templateUrl: './identify-cla-manager-modal.component.html',
  styleUrls: ['./identify-cla-manager-modal.component.scss']
})
export class IdentifyClaManagerModalComponent implements OnInit {
  @Output() backBtnEmitter: EventEmitter<any> = new EventEmitter<any>();
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
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(255), Validators.pattern(AppSettings.NON_WHITE_SPACE_REGEX)])],
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid, Validators.maxLength(255)])],
    });
  }

  onClickSubmit(content) {
    this.inviteCLAManager(false, content);
  }

  onClickContactAdmin(content) {
    this.inviteCLAManager(true, content);
  }

  inviteCLAManager(hasCompanyAdmin: boolean, content: any) {
    const company: OrganizationModel = JSON.parse(this.storageService.getItem('selectedCompany'));
    const project: ProjectModel = JSON.parse(this.storageService.getItem('project'));
    const data = {
      companyID: company.companyID,
      contactAdmin: hasCompanyAdmin,
      claGroupID: project.project_id,
      name: hasCompanyAdmin ? '' : this.form.controls.name.value,
      userEmail: hasCompanyAdmin ? '' : this.form.controls.email.value
    }
    this.callInviteManagerAPI(data, hasCompanyAdmin, content);
  }

  callInviteManagerAPI(data: any, hasCompanyAdmin: boolean, content: any) {
    this.alertService.clearAlert();
    const user: UserModel = JSON.parse(this.storageService.getItem('user'));
    if (user.user_id) {
      this.claContributorService.inviteManager(user.user_id, data).subscribe(
        () => {
          this.handleSuccess(hasCompanyAdmin, content);
        },
        (exception) => {
          console.log(exception);
          this.handleError(exception, content);
        }
      );
    }
  }

  handleSuccess(hasCompanyAdmin, content) {
    this.hasError = false;
    this.title = 'Notification Sent';
    this.message = 'An email has been sent to "' + this.form.controls.email.value + '" to request that they start the CLA signature process.';
    if (hasCompanyAdmin) {
      this.title = 'Request Submitted to Company Admin';
      this.message = 'Your Company Admin has been contacted, you will need to follow up with them to process your CLA request.';
    }
    this.openDialogModal(content);
  }

  handleError(exception, content) {
    this.hasError = true;
    this.title = 'Request Failed';
    this.message = 'Your request is Failed due to internal server error please try later.';
    if (exception.error?.Message) {
      this.message = exception.error.Message;
    }
    this.openDialogModal(content);
  }

  onClickExitCLABtn() {
    const redirectUrl = JSON.parse(this.storageService.getItem('redirect'));
    if (redirectUrl !== null) {
      window.open(redirectUrl, '_self');
    } else {
      const error = 'Unable to fetch redirect URL.';
      this.alertService.error(error);
      this.modalService.dismissAll();
    }
  }

  openDialogModal(content) {
    this.modalService.dismissAll();
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }

  onClickBackToCLANotFound() {
    this.backBtnEmitter.emit();
  }

}
