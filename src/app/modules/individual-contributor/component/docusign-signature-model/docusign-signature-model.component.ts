import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-docusign-signature-model',
  templateUrl: './docusign-signature-model.component.html',
  styleUrls: ['./docusign-signature-model.component.scss']
})
export class DocusignSignatureModelComponent implements OnInit {
  @Input() status: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
