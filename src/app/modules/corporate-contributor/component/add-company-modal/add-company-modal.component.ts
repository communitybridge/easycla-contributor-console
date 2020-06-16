// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UrlValidator } from 'src/app/shared/validators/website-validator';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { NameValidator } from 'src/app/shared/validators/name-validator';

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

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private claContributorService: ClaContributorService
  ) { }

  ngOnInit(): void {
    this.isChecked = false;
    this.checkboxText1 = 'Create a complete CommunityBridge profile for your company.';
    this.checkboxText2 = ' Leave unchecked if you do not want to create a full profile now.';
    this.form = this.formBuilder.group({
      companyName: ['', Validators.compose([Validators.required, NameValidator.isValid])],
      companyWebsite: ['', Validators.compose([Validators.required, UrlValidator.isValid])],
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
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }

  addOrganization(content) {
    const data = {
      companyName: this.form.controls.companyName.value,
      companyWebsite: this.form.controls.companyWebsite.value
    };

    this.claContributorService.addCompany(data).subscribe(
      () => {
        this.hasError = false;
        this.title = 'Successfully Added';
        this.message = 'Your company has been successfully added to our data. Please proceed further to continue the process to add a CLA Manager.';
        this.openDialog(content);
      },
      () => {
        this.title = 'Company Already Exist';
        this.message = 'Your Company already exists in our database. Please go back to the search stage in order to find your company.';
        this.openDialog(content);
      }
    );
  }

  onClickDialogBtn() {
    if (!this.hasError) {
      this.ProccedCLAEmitter.emit(false);
    } else {
      this.modalService.dismissAll();
    }
  }

}
