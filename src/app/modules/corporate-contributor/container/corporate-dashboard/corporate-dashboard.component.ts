// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlatformLocation } from '@angular/common';
import {
  Organization,
  OrganizationListModel,
  OrganizationModel,
} from 'src/app/core/models/organization';
import { StorageService } from 'src/app/shared/services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ProjectModel } from 'src/app/core/models/project';
import { AppSettings } from 'src/app/config/app-settings';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-corporate-dashboard',
  templateUrl: './corporate-dashboard.component.html',
  styleUrls: ['./corporate-dashboard.component.scss'],
})
export class CorporateDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('configureCLAManager') configureCLAManager: TemplateRef<any>;
  @ViewChild('identifyCLAManager') identifyCLAManager: TemplateRef<any>;
  @ViewChild('addCompany') addCompany: TemplateRef<any>;
  @ViewChild('signedCLANotFoundModal') signedCLANotFoundModal: TemplateRef<any>;
  @ViewChild('successModal') successModal: TemplateRef<any>;
  @ViewChild('warningModal') warningModal: TemplateRef<any>;
  @ViewChild('errorModal') errorModal: TemplateRef<any>;

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
  hideDialogCloseBtn: boolean;
  mySubscription: Subscription;
  proccedWithExistingOrganization: Subscription;
  attempt: boolean;
  hasTermAccepted = false;

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
    this.location.onPopState(() => {
      this.modalService.dismissAll();
    });
    this.mySubscription =
      this.claContributorService.openDialogModalEvent.subscribe((result) => {
        switch (result.action) {
          case 'CLA_NOT_SIGN':
            this.openWithDismiss(this.signedCLANotFoundModal);
            break;
          case 'IDENTIFY_CLA_MANAGER':
            this.openWithDismiss(this.identifyCLAManager);
            break;
          case 'BACK_TO_ADD_ORGANIZATION':
            this.openWithDismiss(this.addCompany);
            break;
          case 'RETRY_CONFIG_CLA_MANAGER':
            this.open(this.configureCLAManager);
            break;
          case 'ADD_NEW_ORGANIZATION':
            if (result.payload !== undefined && result.payload !== null) {
              if (result.payload.organization_id) {
                // If organization already exist in SF.
                this.onSelectCompany(result.payload);
                this.onClickProceed();
              } else {
                // If organization not in SF but present in clearbit.
                this.form.controls.companyName.setValue('');
                this.openWithDismiss(this.signedCLANotFoundModal);
              }
            } else {
              // Newly created organization
              this.form.controls.companyName.setValue('');
              this.openWithDismiss(this.signedCLANotFoundModal);
            }
            break;
          default:
            break;
        }
      });
  }

  ngOnInit(): void {
    this.selectedCompany = '';
    this.hasShowDropdown = false;
    this.emptySearchError = true;
    this.noCompanyFound = false;
    this.hideDialogCloseBtn = false;

    this.minLengthValidationMsg =
      'Minimum 2 characters are required to search organization name';

    this.form = this.formBuilder.group({
      companyName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(new RegExp(AppSettings.NON_WHITE_SPACE_REGEX)),
        ]),
      ],
    });
    this.openAuthRedirectionModal();
    this.handledBrowserBack();
  }

  ngOnDestroy() {
    if (this.mySubscription !== undefined && this.mySubscription !== null) {
      this.mySubscription.unsubscribe();
    }
  }

  openAuthRedirectionModal() {
    setTimeout(() => {
      if (this.openView === AppSettings.SIGN_CLA) {
        window.location.href = window.location.href.split('?view=signCLA')[0];
        this.open(this.configureCLAManager);
      }
    }, 250);
  }

  onClickProceed() {
    this.storageService.removeItem(AppSettings.NEW_ORGANIZATIONS);
    this.getOrganizationInformation();
  }

  onClickAddOrganization() {
    // Clear org persist data and error messages.
    this.storageService.removeItem(AppSettings.ORGANIZATION_DETAILS);
    this.alertService.clearAlert();
    this.open(this.addCompany);
  }

  onSelectCompany(organization: Organization) {
    if (organization !== null) {
      this.hasShowDropdown = false;
      this.selectedCompany = organization.organization_id;
      this.searchBoxValue = organization.organization_name;
      this.form.controls.companyName.setValue(this.searchBoxValue);
    }
  }

  getOrganizationInformation() {
    this.claContributorService
      .getOrganizationDetails(this.selectedCompany)
      .subscribe(
        (response) => {
          this.organization = response;
          if(!this.organization.isSanctioned){
          this.storageService.setItem(
            AppSettings.SELECTED_COMPANY,
            this.organization
          );
          this.checkEmployeeSignature();
        }else {
          this.message =
            `We're sorry, you are currently unable to acknowledge the Employee Contributor License Agreement (ECLA) for this organization.
             If you believe this may be an error, please contact
             <a href="https://jira.linuxfoundation.org/plugins/servlet/desk/portal/4/create/143" target="_blank">EasyCLA Support</a>`;
          this.openWithDismiss(this.warningModal);
        }
        },
        () => {
          this.storageService.removeItem(AppSettings.SELECTED_COMPANY);
          const companyName = this.form.controls.companyName.value;
          this.title = 'Setup Required';
          this.message =
            'The selected company ' +
            companyName +
            ' has not been fully setup.</br>' +
            ' Please help us by <a href="' +
            AppSettings.TICKET_URL +
            '" target="_blank">filing a support ticket</a>' +
            ' to get the Organization Administrator assigned. Once the Organization Administrator is assigned to ' +
            companyName +
            ' you will be able to proceed with the CLA.';
          this.openWithDismiss(this.warningModal);
        }
      );
  }

  checkEmployeeSignature() {
    this.alertService.clearAlert();
    const data = {
      project_id: this.projectId,
      company_id: this.organization.companyID,
      user_id: this.userId,
    };
    this.claContributorService.CheckPreparedEmployeeSignature(data).subscribe(
      (response) => {
        if (response.errors) {
          if (
            Object.prototype.hasOwnProperty.call(
              response.errors,
              'missing_ccla'
            )
          ) {
            this.openWithDismiss(this.signedCLANotFoundModal);
          } else if (
            Object.prototype.hasOwnProperty.call(
              response.errors,
              'ccla_approval_list'
            )
          ) {
            const url =
              '/corporate-dashboard/request-authorization/' +
              this.projectId +
              '/' +
              this.userId;
            this.router.navigate([url]);
          } else {
            this.alertService.error(response.errors.project_id);
          }
        } else {
          this.postEmployeeSignatureRequest();
        }
      },
      (exception) => {
        this.claContributorService.handleError(exception);
      }
    );
  }

  postEmployeeSignatureRequest() {
    const hasGerrit = JSON.parse(
      this.storageService.getItem(AppSettings.HAS_GERRIT)
    );
    const signatureRequest = {
      project_id: this.projectId,
      company_id: this.organization.companyID,
      user_id: this.userId,
      return_url_type: hasGerrit
        ? AppSettings.GERRIT
        : this.claContributorService.getTypeByUrl(),
    };
    this.claContributorService
      .postEmployeeSignatureRequest(signatureRequest)
      .subscribe(
        () => {
          const project: ProjectModel = JSON.parse(
            this.storageService.getItem(AppSettings.PROJECT)
          );
          if (project.project_ccla_requires_icla_signature && !this.attempt) {
            this.checkIndividualLastSignature();
          } else {
            this.showSuccessAndRedirectToGit();
          }
        },
        (exception) => {
          this.claContributorService.handleError(exception);
        }
      );
  }

  checkIndividualLastSignature() {
    this.claContributorService
      .getLastIndividualSignature(this.userId, this.projectId)
      .subscribe(
        (response) => {
          this.attempt = true;
          if (response === null) {
            // User has no icla, they need one. Redirect to ICLA/
            this.showICLASignModal();
          } else {
            // get whether icla is up to date
            if (response.requires_resigning) {
              this.showICLASignModal();
            } else {
              // show success and redirect to github.
              this.postEmployeeSignatureRequest();
            }
          }
        },
        (exception) => {
          this.claContributorService.handleError(exception);
        }
      );
  }

  showSuccessAndRedirectToGit() {
    const hasGerrit = JSON.parse(
      this.storageService.getItem(AppSettings.HAS_GERRIT)
    );
    this.hasError = false;
    this.title = 'You are done!';
    this.message =
      'You have completed the CLA steps necessary to contribute. You can now return to writing awesome stuff.';
    if (hasGerrit) {
      this.message =
        'You have completed the CLA steps necessary to contribute. Please note that you will need to logout and log back in to your Gerrit account to get the updated permissions.' +
        ' You can now return to writing awesome stuff.';
    }
    this.openWithDismiss(this.successModal);
  }

  showICLASignModal() {
    const project: ProjectModel = JSON.parse(
      this.storageService.getItem(AppSettings.PROJECT)
    );
    this.hasError = true;
    this.title = 'Sign ICLA Required';
    this.message =
      project.project_name +
      ' requires contributors covered by a corporate CLA to also sign an individual CLA. Click the button below to sign an individual CLA.';
    this.openWithDismiss(this.successModal);
  }

  onClickModalSuccessBtn() {
    this.modalService.dismissAll();
    if (this.hasError) {
      const url = '/individual-dashboard/' + this.projectId + '/' + this.userId;
      this.router.navigate([url]);
    } else {
      this.redirectToSource();
    }
  }

  onClickExitCLA() {
    this.modalService.dismissAll();
  }

  redirectToSource() {
    const redirectUrl = JSON.parse(
      this.storageService.getItem(AppSettings.REDIRECT)
    );
    if (redirectUrl !== null) {
      window.open(redirectUrl, '_self');
    } else {
      const error = 'Unable to fetch redirect URL.';
      this.alertService.error(error);
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
      }, 500);
    } else {
      this.selectedCompany = '';
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

  hideShowCloseBtn(isHide: boolean) {
    this.hideDialogCloseBtn = isHide;
  }

  searchOrganization(companyName: string) {
    this.alertService.clearAlert();
    this.organizationList.list = [];
    this.claContributorService.searchOrganization(companyName).subscribe(
      (response) => {
        this.noCompanyFound = false;
        this.organizationList = response;
        if (this.organizationList.list.length <= 0) {
          this.noCompanyFound = true;
        }
        // Changed error message from organization not found to 2 char required.
        if (this.form.controls.companyName.value.length < 2) {
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
    const redirectUrl = JSON.parse(
      this.storageService.getItem(AppSettings.REDIRECT)
    );
    this.router.navigate(
      ['/cla/project/' + this.projectId + '/user/' + this.userId],
      { queryParams: { redirect: redirectUrl } }
    );
  }

  open(content) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
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

  handledBrowserBack() {
    if (
      window.performance &&
      window.performance.navigation.type ===
        window.performance.navigation.TYPE_BACK_FORWARD
    ) {
      const company: OrganizationModel = JSON.parse(
        this.storageService.getItem(AppSettings.SELECTED_COMPANY)
      );
      this.selectedCompany = company.companyExternalID;
    }
  }
}
