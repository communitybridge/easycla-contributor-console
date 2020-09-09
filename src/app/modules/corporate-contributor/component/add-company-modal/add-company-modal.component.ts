// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit, ViewChild, TemplateRef, Renderer2, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AppSettings } from 'src/app/config/app-settings';
import { UserModel } from 'src/app/core/models/user';
import { OrganizationListModel, Organization, CompanyModel } from 'src/app/core/models/organization';

@Component({
  selector: 'app-add-company-modal',
  templateUrl: './add-company-modal.component.html',
  styleUrls: ['./add-company-modal.component.scss']
})
export class AddCompanyModalComponent implements OnInit {
  @ViewChild('successModal') successModal: TemplateRef<any>;
  @ViewChild('addEmailModal') addEmailModal: TemplateRef<any>;
  @ViewChild('organizationName') organizationName: ElementRef;
  @ViewChild('organizationWebsite') organizationWebsite: ElementRef;

  form: FormGroup;
  publicEmailform: FormGroup;
  message: string;
  title: string;
  hasError: boolean;
  hasOrganizationExist: boolean;
  modelRef: NgbModalRef;
  searchTimeout = null;
  organizationList = new OrganizationListModel();
  searchType: string;
  hasShowDropdown: boolean;
  selectedOrganization: Organization;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private claContributorService: ClaContributorService,
    private storageService: StorageService,
    private renderer: Renderer2
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (!this.organizationName.nativeElement.contains(e.target) && !this.organizationWebsite.nativeElement.contains(e.target)) {
        this.hasShowDropdown = false;
      }
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      companyName: ['', Validators.compose([
        Validators.required,
        Validators.pattern(AppSettings.COMPANY_NAME_REGEX),
        Validators.pattern(new RegExp(AppSettings.NON_WHITE_SPACE_REGEX)),
        Validators.minLength(2),
        Validators.maxLength(255)
      ])],
      companyWebsite: ['', Validators.compose([
        Validators.required,
        Validators.pattern(AppSettings.URL_PATTERN),
        Validators.minLength(8),
        Validators.maxLength(255)
      ])],
    });

    this.publicEmailform = this.formBuilder.group({
      publicEmail: ['', Validators.compose([
        Validators.required,
        Validators.pattern(new RegExp(AppSettings.EMAIL_PATTERN)),
      ])]
    });
    this.setOrganizationDetails();
  }

  onClickProceed() {
    if (this.hasOrganizationExist) {
      this.modalService.dismissAll();
      this.claContributorService.proccedWithExistingOrganizationEvent.next(this.selectedOrganization);
    } else {
      this.addOrganization();
    }
  }

  onWebsiteKeypress() {
    this.hasOrganizationExist = false;
    this.searchType = 'ORGANIZATION_WEBSITE';
    if (this.form.controls.companyWebsite.valid) {
      this.checkOrganization();
    } else {
      this.resetOrganizationList();
    }
  }

  onNameKeypress() {
    this.hasOrganizationExist = false;
    this.searchType = 'ORGANIZATION_NAME';
    if (this.form.controls.companyName.valid) {
      this.checkOrganization();
    } else {
      this.resetOrganizationList();
    }
  }

  checkOrganization() {
    if (this.searchTimeout !== null) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.searchOrganization();
    }, 500);
  }

  searchOrganization() {
    let companyName = null;
    let companyWebsite = null;
    if (this.searchType === 'ORGANIZATION_NAME') {
      companyName = this.form.controls.companyName.value;
    } else {
      companyWebsite = this.form.controls.companyWebsite.value;
    }
    this.claContributorService.searchOrganization(companyName, companyWebsite).subscribe(
      (response) => {
        this.organizationList = response;
        this.hasShowDropdown = true;
        if (this.organizationList.list.length === 0) {
          this.resetOrganizationList();
        }
        if (this.searchType === 'ORGANIZATION_NAME') {
          if (!this.form.controls.companyName.valid) {
            this.resetOrganizationList();
          }
        } else {
          if (!this.form.controls.companyWebsite.valid) {
            this.resetOrganizationList();
          }
        }
      },
      (exception) => {
        this.claContributorService.handleError(exception);
      }
    );
  }

  resetOrganizationList() {
    this.hasShowDropdown = false;
    this.organizationList.list = [];
  }

  addOrganization() {
    const publicEmail = this.claContributorService.getUserPublicEmail();
    if (publicEmail !== null) {
      this.callAddOrganizationAPI(publicEmail);
    } else {
      this.storeOrganizationDetails();
      this.modalService.dismissAll();
      this.openDialog(this.addEmailModal);
    }
  }

  storeOrganizationDetails() {
    const data = {
      organizationName: this.form.controls.companyName.value,
      organizationWebsite: this.form.controls.companyWebsite.value,
    }
    this.storageService.setItem(AppSettings.ORGANIZATION_DETAILS, data);
  }

  setOrganizationDetails() {
    const data = JSON.parse(this.storageService.getItem(AppSettings.ORGANIZATION_DETAILS));
    if (data !== undefined && data !== null) {
      this.form.controls.companyName.setValue(data.organizationName);
      this.form.controls.companyWebsite.setValue(data.organizationWebsite);
      this.storageService.removeItem(AppSettings.ORGANIZATION_DETAILS);
    }
  }

  onClickProccedEmailModal() {
    const publicEmail = this.publicEmailform.controls.publicEmail.value.trim();
    this.callAddOrganizationAPI(publicEmail);
  }

  callAddOrganizationAPI(publicEmail) {
    const userModel: UserModel = JSON.parse(this.storageService.getItem(AppSettings.USER));
    const data = {
      companyName: this.form.controls.companyName.value,
      companyWebsite: this.form.controls.companyWebsite.value,
      userEmail: publicEmail
    };
    console.log(data); // Required to check the payload on Gerrit flow.
    this.claContributorService.addCompany(userModel.user_id, data).subscribe(
      (response: CompanyModel) => {
        this.hasError = false;
        // chnage company model to organization model.
        this.selectedOrganization = {
          organization_id: response.companyID,
          organization_name: response.companyName,
          organization_website: response.companyWebsite
        };
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

  onSelectOrganization(organization) {
    this.hasOrganizationExist = true;
    this.selectedOrganization = organization;
    this.form.controls.companyName.setValue(organization.organization_name);
    this.form.controls.companyWebsite.setValue(organization.organization_website);
    this.organizationList = new OrganizationListModel;
  }

  openDialog(content) {
    this.modelRef = this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  }

  onClickDialogBtn() {
    if (!this.hasError) {
      const data = {
        action: 'ADD_NEW_ORGANIZATION',
        payload: this.selectedOrganization
      }
      this.claContributorService.openDialogModalEvent.next(data);
    } else {
      this.backToAddOrganization();
    }
  }

  backToAddOrganization() {
    const data = {
      action: 'BACK_TO_ADD_ORGANIZATION',
      payload: ''
    }
    this.storeOrganizationDetails();
    this.claContributorService.openDialogModalEvent.next(data);
  }

  onClickClose() {
    this.modalService.dismissAll();
  }
}
