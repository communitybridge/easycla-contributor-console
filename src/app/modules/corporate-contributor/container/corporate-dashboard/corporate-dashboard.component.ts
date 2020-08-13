// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, ViewChild, ElementRef, TemplateRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlatformLocation } from '@angular/common';
import { OrganizationModel, OrganizationListModel } from 'src/app/core/models/organization';
import { StorageService } from 'src/app/shared/services/storage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ProjectModel } from 'src/app/core/models/project';
import { AppSettings } from 'src/app/config/app-settings';

@Component({
  selector: 'app-corporate-dashboard',
  templateUrl: './corporate-dashboard.component.html',
  styleUrls: ['./corporate-dashboard.component.scss']
})
export class CorporateDashboardComponent implements OnInit {
  @ViewChild('dropdown') dropdown: ElementRef;
  @ViewChild('configureCLAManager') configureCLAManager: TemplateRef<any>;
  @ViewChild('signedCLANotFoundModal') signedCLANotFoundModal: TemplateRef<any>;

  selectedCompany: string;
  searchBoxValue: string;
  searchTimeout = null;
  projectId: string;
  userId: string;
  hasShowNoSignedCLAFoundDialog: boolean;
  hasShowDropdown: boolean;
  organization = new OrganizationModel();
  organizationList = new OrganizationListModel();
  form: FormGroup;
  noCompanyFound: boolean;
  minLengthValidationMsg: string;
  emptySearchError: boolean;
  hasError: boolean;
  title: string;
  message: string;
  openView: string;
  hasShowContactAdmin: boolean;

  constructor(
    private route: ActivatedRoute,
    private claContributorService: ClaContributorService,
    private router: Router,
    private modalService: NgbModal,
    private location: PlatformLocation,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.openView = this.route.snapshot.queryParamMap.get('view');
    this.searchBoxValue = '';
    this.location.onPopState(() => this.modalService.dismissAll());
  }

  ngOnInit(): void {
    this.selectedCompany = '';
    this.hasShowDropdown = false;
    this.emptySearchError = true;
    this.noCompanyFound = false;
    this.hasShowContactAdmin = true;
    this.minLengthValidationMsg = 'Minimum 3 characters are required to search organization name';

    this.form = this.formBuilder.group({
      companyName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
    });

    this.openAuthRedirectionModal();
  }

  openAuthRedirectionModal() {
    setTimeout(() => {
      if (this.openView === AppSettings.SIGN_CLA) {
        this.open(this.configureCLAManager);
      }
    }, 250);
  }

  onClickProceed(signedCLANotFoundModal: any, successModal: any) {
    this.hasShowContactAdmin = true;
    this.getOrganizationInformation(signedCLANotFoundModal, successModal)
  }

  onSelectCompany(organization) {
    this.hasShowDropdown = false;
    this.selectedCompany = organization.organization_id;
    this.searchBoxValue = organization.organization_name;
    this.form.controls.companyName.setValue(organization.organization_name);
  }

  openCLANotSignModal(claNotSignModal: any) {
    this.hasShowContactAdmin = false;
    this.openWithDismiss(claNotSignModal);
  }

  getOrganizationInformation(signedCLANotFoundModal, successModal) {
    this.claContributorService.getOrganizationDetails(this.selectedCompany).subscribe(
      (response) => {
        this.organization = response;
        this.storageService.setItem(AppSettings.SELECTED_COMPANY, this.organization);
        this.checkEmployeeeSignature(signedCLANotFoundModal, successModal);
      },
      (exception) => {
        this.alertService.error(exception.error.Message);
      }
    );
  }

  checkEmployeeeSignature(signedCLANotFoundModal, successModal) {
    this.alertService.clearAlert();
    const data = {
      project_id: this.projectId,
      company_id: this.organization.companyID,
      user_id: this.userId
    };
    this.claContributorService.CheckPreparedEmployeeSignature(data).subscribe(
      (response) => {
        if (response.errors) {
          if (Object.prototype.hasOwnProperty.call(response.errors, 'missing_ccla')) {
            this.openWithDismiss(signedCLANotFoundModal)
          } else if (Object.prototype.hasOwnProperty.call(response.errors, 'ccla_approval_list')) {
            const url = '/corporate-dashboard/request-authorization/' + this.projectId + '/' + this.userId;
            this.router.navigate([url]);
          } else {
            this.alertService.error(response.errors.project_id);
          }
        } else {
          this.postEmployeeSignatureRequest(successModal);
        }
      },
      (exception) => {
        this.claContributorService.handleError(exception);
      }
    );
  }

  postEmployeeSignatureRequest(successModal) {
    const hasGerrit = JSON.parse(this.storageService.getItem(AppSettings.HAS_GERRIT));
    const signatureRequest = {
      project_id: this.projectId,
      company_id: this.organization.companyID,
      user_id: this.userId,
      return_url_type: hasGerrit ? AppSettings.GERRIT : AppSettings.GITHUB
    };
    this.claContributorService.postEmployeeSignatureRequest(signatureRequest).subscribe(
      () => {
        const project: ProjectModel = JSON.parse(this.storageService.getItem('project'));
        if (project.project_ccla_requires_icla_signature) {
          this.checkIndividualLastSignature(successModal);
        } else {
          this.showSuccessAndRedirectToGit(successModal);
        }
      },
      (exception) => {
        this.claContributorService.handleError(exception);
      }
    );
  }

  checkIndividualLastSignature(successModal) {
    this.claContributorService.getLastIndividualSignature(this.userId, this.projectId).subscribe(
      (response) => {
        if (response === null) {
          // User has no icla, they need one. Redirect to ICLA/
          this.showICLASignModal(successModal);
        } else {
          // get whether icla is up to date
          if (response.requires_resigning) {
            this.showICLASignModal(successModal);
          } else {
            // show success and redirect to github.
            this.postEmployeeSignatureRequest(successModal);
          }
        }
      },
      (exception) => {
        this.claContributorService.handleError(exception);
      }
    );
  }

  showSuccessAndRedirectToGit(successModal) {
    this.hasError = false;
    this.title = 'You are done!';
    this.message = 'You have completed the CLA steps necessary to contribute. You can now return to writing awesome stuff.';
    this.openWithDismiss(successModal);
  }

  showICLASignModal(successModal: any) {
    const project: ProjectModel = JSON.parse(this.storageService.getItem('project'));
    this.hasError = true;
    this.title = 'Sign ICLA Required';
    this.message = project.project_name + ' requires contributors covered by a corporate CLA to also sign an individual CLA. Click the button below to sign an individual CLA.';
    this.openWithDismiss(successModal);
  }

  onClickModalSuccessBtn() {
    this.modalService.dismissAll();
    if (this.hasError) {
      const url = '/individual-dashboard/' + this.projectId + '/' + this.userId;
      this.router.navigate([url]);
    } else {
      const redirectUrl = JSON.parse(this.storageService.getItem('redirect'));
      if (redirectUrl !== null) {
        window.open(redirectUrl, '_self');
      } else {
        const error = 'Unable to fetch redirect URL.';
        this.alertService.error(error);
      }
    }
  }

  onCompanyKeypress(event) {
    this.hasShowDropdown = true;
    this.noCompanyFound = false;
    this.emptySearchError = false;
    if (this.form.valid) {
      const companyName = event.target.value;
      if (this.selectedCompany !== companyName) {
        this.selectedCompany = '';
      }
      if (this.searchTimeout !== null) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.searchOrganization(encodeURIComponent(companyName));
      }, 300);
    } else {
      this.organizationList.list = [];
      this.resetEmptySearchMessage();
    }
  }

  resetEmptySearchMessage() {
    if (this.form.controls.companyName.value === '') {
      this.emptySearchError = true;
    }
  }

  toggleDropdown() {
    this.hasShowDropdown = !this.hasShowDropdown;
  }

  openCLANotfound(CLANotFound) {
    this.openWithDismiss(CLANotFound);
  }

  searchOrganization(companyName: string) {
    this.alertService.clearAlert();
    this.organizationList.list = [];
    this.claContributorService.searchOrganization(companyName).subscribe(
      (response) => {
        this.organizationList = response;
        if (this.organizationList.list.length <= 0) {
          this.noCompanyFound = true;
        }
        // Changed error message from organization not found to 3 char required.
        if (this.form.controls.companyName.value.length < 3) {
          this.noCompanyFound = false;
          this.organizationList.list = [];
        }
        this.resetEmptySearchMessage();
      },
      (exception) => {
        this.noCompanyFound = true;
        this.claContributorService.handleError(exception);
      }
    );
  }

  onClickBack() {
    const redirectUrl = JSON.parse(this.storageService.getItem('redirect'));
    this.router.navigate(['/cla/project/' + this.projectId + '/user/' + this.userId],
      { queryParams: { redirect: redirectUrl } });
  }

  open(content) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }

  openWithDismiss(content) {
    this.modalService.dismissAll();
    this.open(content);
  }

  onClickClose() {
    this.modalService.dismissAll();
  }

  onClickNoBtn(content) {
    this.modalService.open(content);
  }
}
