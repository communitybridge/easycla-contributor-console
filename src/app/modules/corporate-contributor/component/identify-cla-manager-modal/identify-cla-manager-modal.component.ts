// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit, Input } from '@angular/core';
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
import { CompanyAdminDesigneeModel } from 'src/app/core/models/company-admin-designee';

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
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(255),
        Validators.pattern(new RegExp(AppSettings.NON_WHITE_SPACE_REGEX)
        )]
      )],
      email: ['', Validators.compose([
        Validators.required,
        EmailValidator.isValid,
        Validators.maxLength(255)
      ])],
    });
  }

  onClickSubmit(content) {
    this.inviteCLAManager(false, content);
  }

  onClickContactAdmin(content) {
    this.inviteCLAManager(true, content);
  }

  inviteCLAManager(hasCompanyAdmin: boolean, content: any) {
    const company: OrganizationModel = JSON.parse(this.storageService.getItem(AppSettings.SELECTED_COMPANY));
    const project: ProjectModel = JSON.parse(this.storageService.getItem(AppSettings.PROJECT));
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
    const user: UserModel = JSON.parse(this.storageService.getItem(AppSettings.USER));
    if (user.user_id) {
      this.claContributorService.inviteManager(user.user_id, data).subscribe(
        (response: CompanyAdminDesigneeModel) => {
          this.handleSuccess(hasCompanyAdmin, content, response);
        },
        (exception) => {
          this.handleError(exception, content);
        }
      );
    }
  }

  handleSuccess(hasCompanyAdmin: boolean, content: any, response: CompanyAdminDesigneeModel) {
    this.hasError = false;
    if (hasCompanyAdmin) {
      this.title = 'Request Submitted to Company Admin';
      this.message = 'Your Company Admin ';
      for (const [index, admin] of response.list.entries()) {
        this.message += admin.name;
        if (index !== response.list.length - 1 && admin.name.trim().length > 0) {
          this.message += ', ';
        }
      }
      this.message += ' has been contacted, you will need to follow up with them to process your CLA request.';
    } else {
      // Two diffrent success message as per from which screen he came
      // Add Organization or from Company search page.
      if (this.hasShowContactAdmin) {
        // Came from Search organization flow.
        this.title = 'Request Submitted';
        this.message = 'Your authorized representative has been contacted. You will need to follow up with them to process your CLA request.';
      } else {
        // Came from Add organization flow.
        this.title = 'Notification Sent';
        this.message = 'An email has been sent to "' + this.form.controls.email.value + '" to request that they start the CLA signature process.';
      }
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
    const redirectUrl = JSON.parse(this.storageService.getItem(AppSettings.REDIRECT));
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
      backdrop: 'static',
      keyboard: false
    });
  }

  onClickBackToCLANotFound() {
    const data = {
      action: 'CLA_NOT_SIGN',
      payload: false
    }
    this.claContributorService.openDialogModalEvent.next(data);
  }

  onClickGoBackToIdentifyCLAManger() {
    const data = {
      action: 'IDENTIFY_CLA_MANAGER',
      payload: ''
    }
    this.claContributorService.openDialogModalEvent.next(data);
  }
}
