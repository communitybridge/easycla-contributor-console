// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-company',
  templateUrl: './select-company.component.html',
  styleUrls: ['./select-company.component.scss']
})
export class SelectCompanyComponent implements OnInit {
  selectedCompany: string;
  companies: any[];
  showcompaniesList: boolean;
  searchTimeout = null;

  constructor(
    private claContributorService: ClaContributorService,
    private modalService: NgbModal

  ) { }

  ngOnInit(): void {
    this.companies = [
      'Vison',
      'Amol test company',
      'Long test check for just a dummy',
      'Long test check for just a dummy'
    ]
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
      // this.searchOrganization(value);
    }, 300);
  }


  searchOrganization(searchText: string) {
    console.log(searchText);
    this.claContributorService.searchOrganization(searchText).subscribe(
      (response) => {
        console.log(response);
      },
      (exception) => {
        this.claContributorService.handleError(exception);
      }
    );
  }

  onClickProceed() {

  }

  onClickBack() {

  }

}
