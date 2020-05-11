import { Component, OnInit, Input } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { ProjectModel } from 'src/app/core/models/project';
import { UserModel } from 'src/app/core/models/user';
import { StorageService } from '../../services/storage.service';
import { AppSettings } from 'src/app/config/app-settings';

@Component({
  selector: 'app-project-title',
  templateUrl: './project-title.component.html',
  styleUrls: ['./project-title.component.scss']
})
export class ProjectTitleComponent implements OnInit {
  @Input() projectId: string;
  @Input() userId: string;

  project = new ProjectModel();
  user = new UserModel();

  constructor(
    private alertService: AlertService,
    private storageService: StorageService,
    private claContributorService: ClaContributorService
  ) { }

  ngOnInit(): void {
    this.getProject();
    this.getUser();
  }

  getProject() {
    if (this.projectId) {
      this.claContributorService.getProject(this.projectId).subscribe(
        (response) => {
          this.project = response;
        },
        (exception) => {
          this.claContributorService.handleError(exception);
        }
      );
    } else {
      this.alertService.error('Invalid project id in URL');
    }
  }


  getUser() {
    if (this.userId) {
      this.claContributorService.getUser(this.userId).subscribe(
        (response) => {
          this.storageService.setItem(AppSettings.CLA_USER, response);
        },
        (exception) => {
          this.claContributorService.handleError(exception);
        }
      );
    } else {
      this.alertService.error('Invalid user id in URL');
    }
  }




}
