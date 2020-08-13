// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit, ViewChild, TemplateRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UrlValidator } from 'src/app/shared/validators/website-validator';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AppSettings } from 'src/app/config/app-settings';
import { UserModel } from 'src/app/core/models/user';

@Component({
  selector: 'app-add-company-modal',
  templateUrl: './add-company-modal.component.html',
  styleUrls: ['./add-company-modal.component.scss']
})
export class AddCompanyModalComponent implements OnInit {
  @Output() CLANotSignEmitter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('successModal') successModal: TemplateRef<any>;
  form: FormGroup;
  checkboxText1: string;
  checkboxText2: string;
  message: string;
  title: string;
  hasError: boolean;
  hasOrganizationExist: boolean;
  modelRef: NgbModalRef;
  searchTimeout = null;
  hasAutofilledContent: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private claContributorService: ClaContributorService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.hasAutofilledContent = false;
    this.form = this.formBuilder.group({
      companyName: ['', Validators.compose([Validators.required, Validators.pattern(AppSettings.COMPANY_NAME_REGEX), Validators.minLength(2), Validators.maxLength(60)])],
      companyWebsite: ['', Validators.compose([Validators.required, UrlValidator.isValid, Validators.maxLength(255)])],
    });
  }

  onClickProceed() {
    this.addOrganization();
  }

  openDialog(content) {
    this.modelRef = this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }

  onWebsiteKeypress() {
    this.hasOrganizationExist = false;
    if (this.form.controls.companyWebsite.valid) {
      this.checkOrganization('ORGANIZATION_WEBSITE');
    }
  }

  onNameKeypress() {
    this.hasOrganizationExist = false;
    if (this.form.controls.companyName.valid) {
      this.checkOrganization('ORGANIZATION_NAME');
    }
  }

  checkOrganization(action) {
    if (this.searchTimeout !== null) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      // Added seperate method for autofilled companyName or companyWebsite.
      this.removedAutofilled(action);
      if (action === 'ORGANIZATION_WEBSITE') {
        this.validateOrganizationWebsite();
      } else {
        this.validateOrganizationName();
      }
    }, 500);
  }

  removedAutofilled(action) {
    // Removed autofilled content if user start editing it again.
    if (this.hasAutofilledContent) {
      this.hasAutofilledContent = false;
      if (action === 'ORGANIZATION_WEBSITE') {
        this.form.controls.companyName.setValue('');
      } else {
        this.form.controls.companyWebsite.setValue('');
      }
    }
  }

  validateOrganizationName() {
    const companyName = this.form.controls.companyName.value;
    this.claContributorService.hasOrganizationExist(companyName, null).subscribe(
      (response) => {
        if (response.list.length > 0) {
          this.hasAutofilledContent = true;
          this.hasOrganizationExist = true;
          const organization = response.list[0];
          this.form.controls.companyWebsite.setValue(organization.organization_website);
        }
      },
      (exception) => {
        this.claContributorService.handleError(exception);
      }
    );
  }

  validateOrganizationWebsite() {
    const companyWebsite = (new URL(this.form.controls.companyWebsite.value)).hostname;
    this.claContributorService.hasOrganizationExist(null, companyWebsite).subscribe(
      (response) => {
        if (response.list.length > 0) {
          this.hasAutofilledContent = true;
          this.hasOrganizationExist = true;
          const organization = response.list[0];
          this.form.controls.companyName.setValue(organization.organization_name);
        }
      },
      (exception) => {
        this.claContributorService.handleError(exception);
      }
    );
  }

  addOrganization() {
    const publicEmail = this.claContributorService.getUserPublicEmail();
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
    if (!this.hasError) {
      this.CLANotSignEmitter.emit();
    }
  }

  onClickNoBtn() {

  }

  onClickYesBtn() {

  }

  onClickClose() {
    this.modalService.dismissAll();
  }
}
