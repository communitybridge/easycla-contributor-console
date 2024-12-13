import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss']
})
export class ConsentComponent implements OnInit {

  @Input() hasTermAccepted: boolean = false;
  @Output() termAccepted: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }

  onClickTermAccepted(event:boolean) {
    this.hasTermAccepted = event
    this.termAccepted.emit(event)
  }
}
