import { Injectable } from '@angular/core';
import { Legend, objectify } from './app.model';

@Injectable({
  providedIn: 'root'
})
export class LegendsService {

  legends: Legend[] = [
    { name: 'confirmed', checked: true, label: $localize`Confirmed`, color: '#CFC0BB' },
    { name: 'recovered', checked: true, label: $localize`Recovered/Released`, color: '#5AA454' },
    { name: 'intensiveCare', checked: true, label: $localize`Intensive Care`, color: '#7aa3e5' },
    { name: 'deaths', checked: true, label: $localize`Deaths`, color: '#E44D25' },
    { name: 'currentPositive', checked: true, label: $localize`Current Positive`, color: '#aae3f5' },
  //  { name: 'awsForecastARIMA', checked: true, label: `AWS Forecast ARIMA`, color: '#a8385d' },
  //  { name: 'awsForecastDeepARPlus', checked: true, label: `AWS Forecast Deep AR+`, color: '#aFb3F5' }
  ];
  legendsDict = this.legends.reduce(objectify, {})

  provLegends: Legend[] = [
    { name: 'confirmed', checked: true, label: $localize`Confirmed`, color: '#CFC0BB' },
    { name: 'newConfirmed', checked: true, label: $localize`New Confirmed`, color: '#a8385d' },
  ];

  provLegendsDict = this.provLegends.reduce(objectify, {})



  colorScheme = {
    domain: this.legends.map(elem => elem.color)
  };

  provColorScheme = {
    domain: this.provLegends.map(elem => elem.color)
  };
  constructor() { 
    this.legendsDict.tests = { name: 'tests', checked: true, label: $localize`Tests`, color: '#CFC0BB' }
    this.legendsDict.peopleTested = { name: 'peopleTested', checked: true, label: $localize`People Tested`, color: '#a8385d' }
    this.provLegendsDict.newConfirmedRate = { name: 'newConfirmedRate', checked: true, label: $localize`New Confirmed Rate`, color: '#a8385d' }
  }
}
