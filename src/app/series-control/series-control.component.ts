import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AggregateEnum,ScaleEnum } from '../app.model';

@Component({
  selector: 'app-series-control',
  templateUrl: './series-control.component.html',
  styleUrls: ['./series-control.component.css']
})

export class SeriesControlComponent  {
  
  @Input() title: string;

  @Input() scaleEnabled:boolean = false
  @Input() scale:ScaleEnum = ScaleEnum.Log10
  @Output() changeScale = new EventEmitter<any>();
  scaleEnum = ScaleEnum

  @Input() aggregateEnabled:boolean = false
  @Input() aggregate:AggregateEnum = AggregateEnum.Day
  @Output() changeAggregate = new EventEmitter<any>();
  aggregateEnum = AggregateEnum

  onChangeScale($event) {
    this.changeScale.emit($event.value)
  }

  onChangeAggregate($event) {
    this.changeAggregate.emit($event.value)
  }

  constructor() {

  }
 
 
}
