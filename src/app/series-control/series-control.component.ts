import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-series-control',
  templateUrl: './series-control.component.html',
  styleUrls: ['./series-control.component.css']
})

export class SeriesControlComponent  {
  
  @Input() title: string;
  @Input() log10:string = "log10"
  @Input() aggregate:string = "daily"

  @Input() aggregateEnabled:boolean = false
  @Input() log10Enabled:boolean = false
  

  @Output() changeLog10 = new EventEmitter<any>();
  @Output() changeAggregate = new EventEmitter<any>();

  newLog10($event) {
    this.changeLog10.emit($event.value == this.log10)
  }

  newAggregate($event) {
    this.changeLog10.emit($event.value)
  }

  constructor() {

  }
 
 
}
