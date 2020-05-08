import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-docusign-signature-model',
  templateUrl: './docusign-signature-model.component.html',
  styleUrls: ['./docusign-signature-model.component.scss']
})
export class DocusignSignatureModelComponent implements OnInit {
  @Input() status: string;
  checkedItems: string[];
  @Output() backBtnEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    this.checkedItems = [
      'Generating Contract',
      'Adding Information',
      'Document Ready'
    ];
  }

  onClickBack() {
    this.backBtnEmitter.emit();
  }

  onClickSignCLA() {

  }
}
