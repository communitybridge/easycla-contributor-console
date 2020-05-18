// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UrlValidator } from 'src/app/shared/validators/website-validator';

@Component({
  selector: 'app-add-company-modal',
  templateUrl: './add-company-modal.component.html',
  styleUrls: ['./add-company-modal.component.scss']
})
export class AddCompanyModalComponent implements OnInit {

  form: FormGroup;
  isChecked: boolean;
  checkboxText: string;
  message: string;
  title: string;
  hasError: boolean;
  @Output() ProccedCLAEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.checkboxText = 'Create a complete CommunityBridge profile for your company' +
      'Leave unchecked if you do not want to create a full profile now.';
    this.form = this.formBuilder.group({
      companyName: ['', Validators.compose([Validators.required])],
      companyWebsite: ['', Validators.compose([Validators.required, UrlValidator.isValid])],
    });
  }

  onClickCheckbox(checked) {
    this.isChecked = checked;
  }

  onClickProceed(content) {
    this.title = 'Successfully Added';
    this.message = 'Your company has been successfully added to our data. Please proceed further to continue the process to add a CLA Manager.';

    // this.title = 'Company Already Exist';
    // this.message = 'Your Company already exists in our database. Please go back to the search stage in order to find your company.';

    this.hasError = false;
    // this.claContributorService.searchOrganization(searchText).subscribe(
    //   (response) => {
    //     console.log(response);
    //   },
    //   (exception) => {
    //     this.claContributorService.handleError(exception);
    //   }
    // );
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }

  onClickDialogBtn() {
    if (!this.hasError) {
      this.ProccedCLAEmitter.emit();
    } else {
      this.modalService.dismissAll();
    }
  }

}
