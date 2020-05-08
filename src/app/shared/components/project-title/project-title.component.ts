import { Component, OnInit, Input } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { ClaContributorService } from 'src/app/core/services/cla-contributor.service';
import { Project } from 'src/app/core/models/project';

@Component({
  selector: 'app-project-title',
  templateUrl: './project-title.component.html',
  styleUrls: ['./project-title.component.scss']
})
export class ProjectTitleComponent implements OnInit {
  @Input() projectId: string;
  project = new Project();

  constructor(
    private alertService: AlertService,
    private claContributorService: ClaContributorService
  ) { }

  ngOnInit(): void {
    this.getProject();
  }

  getProject() {
    if (this.projectId) {
      this.claContributorService.getProject(this.projectId).subscribe(
        (response) => {
          this.project = response;
        },
        (exception) => {
          const error = exception.error.errors.project_id;
          this.alertService.error(error, 2000);
        }
      );
    } else {
      this.alertService.error('Invalid project id in URL');
    }
  }

}
