// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailValidator } from 'src/app/shared/validators/email-validator';

@Component({
  selector: 'app-identify-cla-manager-modal',
  templateUrl: './identify-cla-manager-modal.component.html',
  styleUrls: ['./identify-cla-manager-modal.component.scss']
})
export class IdentifyClaManagerModalComponent implements OnInit {
  form: FormGroup;
  message: string;
  title: string;
  hasError: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email:  ['', Validators.compose([Validators.required, EmailValidator.isValid])],
    });
  }

  onClickSubmit(content) {
    this.modalService.dismissAll();
    this.title = 'Request Submitted';
    this.message = 'Your authorized representative has been contacted. You will need to follow up with them to process your CLA request.';
    this.hasError = false;
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }

  onClickExitCLABtn() {
    this.modalService.dismissAll();
  }

}
