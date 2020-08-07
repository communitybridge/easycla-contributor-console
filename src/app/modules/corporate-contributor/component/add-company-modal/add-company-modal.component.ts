// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UrlValidator } from 'src/app/shared/validators/website-validator';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AppSettings } from 'src/app/config/app-settings';
import { UserModel } from 'src/app/core/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-company-modal',
  templateUrl: './add-company-modal.component.html',
  styleUrls: ['./add-company-modal.component.scss']
})
export class AddCompanyModalComponent implements OnInit {
  @ViewChild('successModal') successModal: TemplateRef<any>;
  @ViewChild('WarningModal') WarningModal: TemplateRef<any>;
  form: FormGroup;
  checkboxText1: string;
  checkboxText2: string;
  message: string;
  title: string;
  hasError: boolean;
  modelRef: NgbModalRef;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private claContributorService: ClaContributorService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      companyName: ['', Validators.compose([Validators.required, Validators.pattern(AppSettings.COMPANY_NAME_REGEX), Validators.minLength(2), Validators.maxLength(60)])],
      companyWebsite: ['', Validators.compose([Validators.required, UrlValidator.isValid, Validators.maxLength(255)])],
    });
  }

  onClickProceed() {
    this.addOrganization();
  }

  openDialog(content) {
    this.modalService.dismissAll();
    this.modelRef = this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }

  addOrganization() {
    const publicEmail = this.claContributorService.getUserPublicEmail();
    console.log(publicEmail);
    if (publicEmail !== null) {
      this.callAddOrganizationAPI(publicEmail);
    } else {
      // Show warning that user email is not public.
      this.hasError = true;
      this.title = 'Email Not Public';
      this.message = 'It\'s look like your Github account email is not public please make it public and try again.';
      this.openDialog(this.successModal);
    }
  }

  callAddOrganizationAPI(publicEmail) {
    const userModel: UserModel = JSON.parse(this.storageService.getItem(AppSettings.USER));
    const data = {
      companyName: this.form.controls.companyName.value,
      companyWebsite: this.form.controls.companyWebsite.value,
      userEmail: publicEmail
    };
    this.claContributorService.addCompany(userModel.user_id, data).subscribe(
      () => {
        this.hasError = false;
        this.title = 'Successfully Added';
        this.message = 'Your organization has been successfully added to our data. Please proceed further to continue the process to add a CLA Manager.';
        this.openDialog(this.successModal);
      },
      (exception) => {
        this.hasError = true;
        this.title = 'Request Failed';
        this.message = exception.error.Message;
        this.openDialog(this.successModal);
      }
    );
  }

  onClickDialogBtn() {
    this.modelRef.close();
    if (!this.hasError) {
      this.openCLANotSignModal();
    }
  }

  openCLANotSignModal() {
    const userId = JSON.parse(this.storageService.getItem(AppSettings.USER_ID));
    const projectId = JSON.parse(this.storageService.getItem(AppSettings.PROJECT_ID));
    const url = '/corporate-dashboard/' + projectId + '/' + userId;
    this.router.navigate([url], { queryParams: { view: AppSettings.CLA_NOT_SIGN } });
  }
}
