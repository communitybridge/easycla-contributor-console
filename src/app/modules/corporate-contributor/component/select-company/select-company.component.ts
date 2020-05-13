// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  projectId: string;
  userId: string;

  constructor(
    private route: ActivatedRoute,
    private claContributorService: ClaContributorService,
    private router: Router
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

  onClickProceed() {

  }

  onClickBack() {
    this.router.navigate(['/dashboard'],
      { queryParams: { projectId: this.projectId, userId: this.userId } });
  }

}
