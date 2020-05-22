// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-cla-request-authorization',
  templateUrl: './cla-request-authorization.component.html',
  styleUrls: ['./cla-request-authorization.component.scss']
})
export class ClaRequestAuthorizationComponent implements OnInit {

  projectId: string;
  userId: string;
  mangers: any[];
  hasError: boolean;
  title: string;
  message: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private storageService: StorageService

  ) {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.userId = this.route.snapshot.paramMap.get('userId');
  }

  ngOnInit(): void {
    this.mangers = ['Amol Sontakke', 'David Deal'];
  }

  onClickBack() {
    this.modalService.dismissAll();
    const url = '/corporate-dashboard/' + this.projectId + '/' + this.userId;
    this.router.navigate([url]);
  }

  onClickRequestAuthorization(content) {
    this.title = 'Request Submitted';
    const projectName = JSON.parse(this.storageService.getItem('projectName'));
    this.message = 'The CLA Manager for ' + projectName + ' will be notified of your request to be authorized for contributions.' +
      ' You will be notified via email when the status has been approved or rejected.';
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      windowClass: 'custom-dialog'
    });
  }

}
