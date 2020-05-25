// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UrlValidator } from 'src/app/shared/validators/website-validator';
import { NameValidator } from 'src/app/shared/validators/name-validator';
import { TelephoneNumberValidator } from 'src/app/shared/validators/telephone-validator';

@Component({
  selector: 'app-company-details-modal',
  templateUrl: './company-details-modal.component.html',
  styleUrls: ['./company-details-modal.component.scss']
})
export class CompanyDetailsModalComponent implements OnInit {
  form: FormGroup;
  hasValidFile: boolean;
  @Output() nextCompanyDetailEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      companyName: ['', Validators.compose([Validators.required, NameValidator.isValid])],
      website: ['', Validators.compose([Validators.required, UrlValidator.isValid])],
      streetAddress: ['', Validators.compose([Validators.required, NameValidator.isValid])],
      city: ['', Validators.compose([Validators.required, NameValidator.isValid])],
      state: ['', Validators.compose([Validators.required, NameValidator.isValid])],
      postalCode: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required, NameValidator.isValid])],
      telephoneNo: ['', Validators.compose([Validators.required, TelephoneNumberValidator.isValid])],
    });
  }

  onClickProceed() {
    this.nextCompanyDetailEmitter.emit();
  }

  onClickUploadLogo(event) {
    this.hasValidFile = false;
    const selectedFile = event.target.files[0];
    const idxDot = selectedFile.name.lastIndexOf('.') + 1;
    const extFile = selectedFile.name.substr(idxDot, selectedFile.name.length).toLowerCase();
    if (extFile === 'svg') {
      this.hasValidFile = true;
      // upload file
    }
  }
}
