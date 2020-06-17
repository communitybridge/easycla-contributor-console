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
import { InviteCompanyModel } from 'src/app/core/models/invite-company';

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
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
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
      companySFID: company.companyID,
      contactAdmin: hasCompanyAdmin,
      projectSFID: project.project_id,
      userEmail: hasCompanyAdmin ? '' : this.form.controls.email.value
    }
    this.callInviteManagerAPI(data, hasCompanyAdmin, content);
  }

  callInviteManagerAPI(data: any, hasCompanyAdmin: boolean, content: any) {
    this.alertService.clearAlert();
    const user: UserModel = JSON.parse(this.storageService.getItem('user'));
    if (user.user_id) {
      this.claContributorService.inviteManager(user.user_id, data).subscribe(
        (response: InviteCompanyModel) => {
          this.hasError = false;
          this.title = 'Notification Sent';
          this.message = 'An email has been sent to "' + response.email + '" to request that they start the CLA signature process.';
          if (hasCompanyAdmin) {
            this.title = 'Request Submitted to Company Admin';
            this.message = 'Your Company Admin has been contacted, you will need to follow up with them to process your CLA request.';
          }
          this.openDialogModal(content);
        },
        (exception) => {
          console.log(exception);
          this.hasError = true;
          this.title = 'Request Failed';
          this.message = 'Your request is Failed due to internal server error please try later.';
          if (exception.error?.Message) {
            this.message = exception.error.Message;
          }
          this.openDialogModal(content);
        }
      );
    }
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
