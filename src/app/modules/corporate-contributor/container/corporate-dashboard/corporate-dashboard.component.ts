// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-corporate-dashboard',
  templateUrl: './corporate-dashboard.component.html',
  styleUrls: ['./corporate-dashboard.component.scss']
})
export class CorporateDashboardComponent {
  selectedCompany: string;
  companies: any[];
  searchTimeout = null;
  projectId: string;
  userId: string;
  hasShowNoSignedCLAFoundDialog: boolean;
  hasShowContactAdmin: boolean;
  hasShowDropdown: boolean;
  @ViewChild('dropdown') dropdown: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private claContributorService: ClaContributorService,
    private router: Router,
    private modalService: NgbModal,
    private renderer: Renderer2
  ) {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.renderer.listen('window', 'click', (e: Event) => {
      if (this.dropdown) {
        if (!this.dropdown.nativeElement.contains(e.target)) {
          this.hasShowDropdown = false;
        }
      }
    });
  }

  ngOnInit(): void {
    this.hasShowDropdown = false;
    this.hasShowContactAdmin = true;
    this.companies = [
      'Vison',
      'Amol test company',
      'Long test check for just a dummy',
      'Long test check for just a dummy'
    ];
  }

  onSelectCompany(company) {
    this.selectedCompany = company;
  }

  onCompanyKeypress(event) {
    const value = event.target.value;
    if (this.searchTimeout !== null) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.searchOrganization(value);
    }, 300);
  }


  searchOrganization(searchText: string) {
    console.log(searchText);
    this.hasShowDropdown = true;
    // this.claContributorService.searchOrganization(searchText).subscribe(
    //   (response) => {
    //     console.log(response);
    //   },
    //   (exception) => {
    //     this.claContributorService.handleError(exception);
    //   }
    // );
  }

  onClickProceed() {
    this.hasShowContactAdmin = true;
    const url = '/corporate-dashboard/request-authorization/' + this.projectId + '/' + this.userId;
    this.router.navigate([url]);
  }

  onClickBack() {
    this.router.navigate(['/dashboard'],
      { queryParams: { projectId: this.projectId, userId: this.userId } });
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

  onClickAddNewCompany(hasShowCompanyDetailDialog, signedCLANotFoundModal, companyDetailModal) {
    if (!hasShowCompanyDetailDialog) {
      this.hasShowContactAdmin = false;
      this.openWithDismiss(signedCLANotFoundModal);
    } else {
      this.openWithDismiss(companyDetailModal);
    }
  }

  onClickClose() {
    this.modalService.dismissAll();
  }

  onClickNoBtn(content) {
    this.modalService.open(content);
  }

  onClickSubmitRequestToAdmin() {

  }

  onClickProceedCLAManagerSetting() {

  }
}
