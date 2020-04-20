import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit {

  @Input() colorScheme: any
  @Input() isProvince: boolean

  constructor() { }

  private labels = [
    $localize`Confirmed`,
    $localize`Recovered/Released`,
    $localize`Intensive Care`,
    $localize`Deaths`,
    $localize`Current Positive`,
    `AWS Forecast ARIMA`,
    `AWS Forecast Deep AR+`
  ];

  private provLabels = [
    $localize`Confirmed`,
    $localize`New Confirmed`,
  ];

  getLabels():string[] {
   return this.isProvince? this.provLabels: this.labels 
  }

  backGroundColorStyle(color:string):string {
    return `background-color: ${color};`
  }
  ngOnInit(): void {
  }

}
