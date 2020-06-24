// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UrlValidator } from 'src/app/shared/validators/website-validator';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AppSettings } from 'src/app/config/app-settings';

@Component({
  selector: 'app-add-company-modal',
  templateUrl: './add-company-modal.component.html',
  styleUrls: ['./add-company-modal.component.scss']
})
export class AddCompanyModalComponent implements OnInit {
  @Output() ProccedCLAEmitter: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  isChecked: boolean;
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
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.isChecked = false;
    this.checkboxText1 = 'Create a complete CommunityBridge profile for your organization.';
    this.checkboxText2 = ' Leave unchecked if you do not want to create a full profile now.';
    this.form = this.formBuilder.group({
      companyName: ['', Validators.compose([Validators.required, Validators.pattern(AppSettings.COMPANY_NAME_REGEX), Validators.minLength(2), Validators.maxLength(60)])],
      companyWebsite: ['', Validators.compose([Validators.required, UrlValidator.isValid, Validators.maxLength(255)])],
    });
  }

  onClickCheckbox(checked) {
    this.isChecked = checked;
  }

  onClickProceed(content) {
    if (this.isChecked) {
      this.ProccedCLAEmitter.emit(true);
    } else {
      this.addOrganization(content);
    }
  }

  openDialog(content) {
    this.modelRef = this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }

  addOrganization(content) {
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
        this.openDialog(content);
      },
      () => {
        this.hasError = true;
        this.title = 'Organization Already Exist';
        this.message = 'Your organization already exists in our database. Please go back to the search stage in order to find your organization.';
        this.openDialog(content);
      }
    );
  }

  onClickDialogBtn() {
    if (!this.hasError) {
      this.ProccedCLAEmitter.emit(false);
    } else {
      this.modelRef.close();
    }
  }

}
