import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Legend } from '../app.model';


@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit {

  @Output() changeLegend = new EventEmitter<any>();
  

  constructor() { }

  @Input() legends: Legend[];

  change(event) {
    this.changeLegend.emit(
      {
        name:event.source.name,
        checked: event.checked
    })
  }

  backGroundColorStyle(color:string):string {
    return `background-color: ${color};`
  }
  ngOnInit(): void {
  }
}
