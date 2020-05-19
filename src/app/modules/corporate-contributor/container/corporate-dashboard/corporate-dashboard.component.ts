// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component } from '@angular/core';
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
  showcompaniesList: boolean;
  searchTimeout = null;
  projectId: string;
  userId: string;
  hasShowNoSignedCLAFoundDialog: boolean;

  constructor(
    private route: ActivatedRoute,
    private claContributorService: ClaContributorService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.userId = this.route.snapshot.paramMap.get('userId');
  }

  ngOnInit(): void {
    this.companies = [
      'Vison',
      'Amol test company',
      'Long test check for just a dummy',
      'Long test check for just a dummy'
    ];
  }

  onSelectCompany(company) {
    this.selectedCompany = company;
    this.showcompaniesList = false;
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
    this.claContributorService.searchOrganization(searchText).subscribe(
      (response) => {
        console.log(response);
      },
      (exception) => {
        this.claContributorService.handleError(exception);
      }
    );
  }

  onClickProceed(content) {
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
