// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UrlValidator } from 'src/app/shared/validators/website-validator';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AppSettings } from 'src/app/config/app-settings';
import { AuthService } from 'src/app/shared/services/auth.service';

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
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      companyName: ['', Validators.compose([Validators.required, Validators.pattern(AppSettings.COMPANY_NAME_REGEX), Validators.minLength(2), Validators.maxLength(60)])],
      companyWebsite: ['', Validators.compose([Validators.required, UrlValidator.isValid, Validators.maxLength(255)])],
    });

    this.validateLFLoginResponse();
  }

  validateLFLoginResponse() {
    const actionType = JSON.parse(this.storageService.getItem(AppSettings.ACTION_TYPE));
    const actionData = JSON.parse(this.storageService.getItem(AppSettings.ACTION_DATA));
    if (actionType && actionData) {
      // preserve value and call add organization method.
      this.form.controls.companyName.setValue(actionData.companyName);
      this.form.controls.companyWebsite.setValue(actionData.companyWebsite);
      setTimeout(() => {
        this.storageService.removeItem(AppSettings.ACTION_TYPE);
        this.storageService.removeItem(AppSettings.ACTION_DATA);
        this.addOrganization();
      }, 500);
    }
  }

  onClickProceed() {
    if (!this.authService.isAuthenticated()) {
      this.openDialog(this.WarningModal);
    } else {
      this.addOrganization();
    }
  }

  onClickProccedWithLFLogin() {
    this.redirectToLFLogin();
  }

  redirectToLFLogin() {
    const data = {
      companyName: this.form.controls.companyName.value,
      companyWebsite: this.form.controls.companyWebsite.value
    };
    this.storageService.setItem(AppSettings.ACTION_TYPE, AppSettings.ADD_ORGANIZATION);
    this.storageService.setItem(AppSettings.ACTION_DATA, data);
    this.authService.login();
  }

  openDialog(content) {
    this.modalService.dismissAll();
    this.modelRef = this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }

  addOrganization() {
    const userId = JSON.parse(this.storageService.getItem('userId'));
    const data = {
      companyName: this.form.controls.companyName.value,
      companyWebsite: this.form.controls.companyWebsite.value
    };

    this.claContributorService.addCompany(userId, data).subscribe(
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
      const url = this.claContributorService.getLFXCorporateURL();
      window.open(url, '_self');
    } else {
      this.modelRef.close();
    }
  }

}
