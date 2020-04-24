import { Component, OnInit, HostListener } from '@angular/core';
import { SeriesService } from '../series.service';
import { ActivatedRoute } from '@angular/router';
import { Bar, Series } from '../app.model';
import { BarsService } from '../bars.service';
import { DataService } from '../data.service';
import moment from 'moment';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})

export class ChartsComponent {
  breadcrumbs: any;

  colorScheme = {
    domain: ['#CFC0BB', '#5AA454', '#7aa3e5', '#E44D25', '#aae3f5', '#a8385d', '#aFb3F5']
  };

  seriesData: Series[] = [];
  seriesDailyData: Series[] = [];
  seriesPercData: Series[] = [];
  seriesSwabData: Series[];

  totalCasesBarsData: Bar[] = [];
  totalCasesBarsMax: number;

  intensiveBarsData: Bar[] = [];
  intensiveBarsMax: number;

  newPositiveBarsData: Bar[];
  newPositiveBarsMax: number;

  totalCasesPerProvinceBarsData: Bar[] = [];
  totalCasesPerProvinceBarsMax: number;

  totalSwabBarsData: Bar[] = []
  totalSwabBarsMax: number;

  positivePerSwabBarsData: Bar[] = []
  positivePerSwabBarsMax: number;

  lethalityBarsData: Bar[] = []
  lethalityBarsMax: number;

  newCasesPercBarsData: Bar[] = []
  newCasesPercBarsMax: number;

  newSwabBarsData: Bar[] = [];
  newSwabBarsMax: number;
  showLegend: boolean
  log10: boolean = true

  constructor(
    private seriesService: SeriesService,
    private barsService: BarsService,
    public dataService: DataService,
    activateRoute: ActivatedRoute) {
    activateRoute.params.subscribe(params => {
      this.breadcrumbs = params
      this.initData()
    })
  }

  private initData() {
    if (this.breadcrumbs['province']) {
      this.setProvincialData(this.breadcrumbs.region, this.breadcrumbs.province)
    }
    else if (this.breadcrumbs['region']) {
      this.setRegionalData(this.breadcrumbs.region)
    }
    else {
      this.setCountryData()
    }
  }

  private async setCountryData() {
    const fn = this.log10 ? this.formatLog10 : null
    this.seriesData = [
      await this.seriesService.generateCountrySeries('totale_casi', $localize`Confirmed`, null, fn),
      await this.seriesService.generateCountrySeries("dimessi_guariti", $localize`Recovered/Released`, null, fn),
      await this.seriesService.generateCountrySeries('terapia_intensiva', $localize`Intensive Care`, null, fn),
      await this.seriesService.generateCountrySeries('deceduti', $localize`Deaths`, null, fn),
      await this.seriesService.generateCountrySeries('totale_positivi', $localize`Current Positive`, null, fn),
    ]
    this.seriesDailyData = [
      await this.seriesService.generateCountrySeries("totale_nuovi_casi", $localize`Confirmed`),
      await this.seriesService.generateCountrySeries('nuovi_dimessi_guariti', $localize`Recovered/Released`),
      await this.seriesService.generateCountrySeries('nuovi_terapia_intensiva', $localize`Intensive Care`),
      await this.seriesService.generateCountrySeries('nuovi_deceduti', $localize`Deaths`),
      await this.seriesService.generateCountrySeries('variazione_totale_positivi', $localize`Current Positive`),
      await this.seriesService.generateCountryARIMAForecastSeries('p50', `AWS Forecast ARIMA`),
      await this.seriesService.generateCountryForecastDeepARPlusSeries('p50', `AWS Forecast Deep AR+`)
    ]
    this.seriesPercData = [
      await this.seriesService.generateCountrySeries('totale_nuovi_casi', $localize`Confirmed`, 'totale_casi_ieri'),
      await this.seriesService.generateCountrySeries('nuovi_dimessi_guariti', $localize`Recovered/Released`, 'dimessi_guariti_ieri'),
      await this.seriesService.generateCountrySeries('nuovi_terapia_intensiva', $localize`Intensive Care`, 'terapia_intensiva_ieri'),
      await this.seriesService.generateCountrySeries('nuovi_deceduti', $localize`Deaths`, 'deceduti_ieri'),
      await this.seriesService.generateCountrySeries('variazione_totale_positivi', $localize`Current Positive`, 'totale_positivi'),
    ]
    this.seriesSwabData = [
      await this.seriesService.generateCountrySeries('nuovi_tamponi', $localize`Tests`),
      await this.seriesService.generateCountrySeries('nuovi_casi_testati', $localize`People Tested`)
    ]
    await this.getIntensiveBarsData()
    await this.getNewPositiveBarsData()
    await this.getLethalityBarsData()
    await this.getNewCasesPercBarsData()
    await this.getTotalCasesBarsData()
    await this.getTotalCasesPerProvinceBarsData()

    await this.getTotalSwabBarsData()
    await this.getPositivePerSwabBarsData()
    await this.getNewSwabBarsData()
  }

  private async setRegionalData(region: string) {
    const fn: Function = this.log10 ? this.formatLog10 : null
    this.seriesData = [
      await this.seriesService.generateRegionalSeries(region, 'totale_casi', $localize`Confirmed`, null, fn),
      await this.seriesService.generateRegionalSeries(region, "dimessi_guariti", $localize`Recovered/Released`, null, fn),
      await this.seriesService.generateRegionalSeries(region, 'terapia_intensiva', $localize`Intensive Care`, null, fn),
      await this.seriesService.generateRegionalSeries(region, 'deceduti', $localize`Deaths`, null, fn),
      await this.seriesService.generateRegionalSeries(region, 'totale_positivi', $localize`Current Positive`, null, fn),
    ]
    this.seriesDailyData = [
      await this.seriesService.generateRegionalSeries(region, "totale_nuovi_casi", `Confirmed`),
      await this.seriesService.generateRegionalSeries(region, 'nuovi_dimessi_guariti', $localize`Recovered/Released`),
      await this.seriesService.generateRegionalSeries(region, 'nuovi_terapia_intensiva', $localize`Intensive Care`),
      await this.seriesService.generateRegionalSeries(region, 'nuovi_deceduti', $localize`Deaths`),
      await this.seriesService.generateRegionalSeries(region, 'variazione_totale_positivi', $localize`Current Positive`),
      await this.seriesService.generateRegionalARIMAForecastSeries(region, 'p50', `AWS Forecast ARIMA`),
      await this.seriesService.generateRegionalForecastDeepARPlusSeries(region, 'p50', `AWS Forecast Deep AR+`),
    ]
    this.seriesPercData = [
      await this.seriesService.generateRegionalSeries(region, 'totale_nuovi_casi', $localize`Confirmed`, 'totale_casi_ieri'),
      await this.seriesService.generateRegionalSeries(region, 'nuovi_dimessi_guariti', $localize`Recovered/Released`, 'dimessi_guariti_ieri'),
      await this.seriesService.generateRegionalSeries(region, 'nuovi_terapia_intensiva', $localize`Intensive Care`, 'terapia_intensiva_ieri'),
      await this.seriesService.generateRegionalSeries(region, 'nuovi_deceduti', $localize`Deaths`, 'deceduti_ieri'),
      await this.seriesService.generateRegionalSeries(region, 'variazione_totale_positivi', $localize`Current Positive`, 'totale_positivi'),
    ]
    this.seriesSwabData = [
      await this.seriesService.generateRegionalSeries(region, 'nuovi_tamponi', $localize`Tests`),
      await this.seriesService.generateRegionalSeries(region, 'nuovi_casi_testati', $localize`People Tested`)
    ]
    await this.getTotalCasesBarsData()
    await this.getNewCasesPercBarsData()
    await this.getNewPositiveBarsData()
  }

  private async setProvincialData(region: string, province: string) {
    this.seriesData = [
      await this.seriesService.generateProvincialSeries(region, province, 'totale_casi', $localize`Total Confirmed`),
      await this.seriesService.generateProvincialSeries(region, province, 'totale_nuovi_casi', $localize`New Confirmed`)
    ]
    this.seriesPercData = [
      await this.seriesService.generateProvincialSeries(region, province, 'totale_nuovi_casi', $localize`New Confirmed Rate`, 'totale_casi_ieri'),
    ]
  }

  async getTotalCasesBarsData($event = { value: null }) {
    [this.totalCasesBarsData,this.totalCasesBarsMax] = this.breadcrumbs["region"] != null ?
      await this.barsService.generateProvincialBars('totale_casi', $event.value, this.breadcrumbs["region"]) :
      await this.barsService.generateRegionalBars('totale_casi', $event.value)
  }

  async getNewCasesPercBarsData($event = { value: null }) {
    [this.newCasesPercBarsData,this.newCasesPercBarsMax] = this.breadcrumbs["region"] != null ?
      await this.barsService.generateProvincialBars('totale_nuovi_casi', $event.value, this.breadcrumbs["region"], 'totale_casi_ieri') :
      await this.barsService.generateRegionalBars('totale_nuovi_casi', $event.value, 'totale_casi_ieri')
    }

  async getNewPositiveBarsData($event = { value: null }) {
    [this.newPositiveBarsData,this.newPositiveBarsMax]= this.breadcrumbs["region"] != null ?
      await this.barsService.generateProvincialBars('totale_nuovi_casi', $event.value, this.breadcrumbs["region"]) :
      await this.barsService.generateRegionalBars('totale_nuovi_casi', $event.value)
  }

  async getIntensiveBarsData($event = { value: null }) {
    [this.intensiveBarsData, this.intensiveBarsMax]= await this.barsService.generateRegionalBars('terapia_intensiva', $event.value)
  }

  async getLethalityBarsData($event = { value: null }) {
    [this.lethalityBarsData,this.lethalityBarsMax] = await this.barsService.generateRegionalBars('deceduti', $event.value, 'totale_casi')
  }

  async getTotalCasesPerProvinceBarsData($event = { value: null }) {
    [this.totalCasesPerProvinceBarsData,this.totalCasesPerProvinceBarsMax] = await this.barsService.generateProvincialBars('totale_casi', $event.value)
  }

  async getTotalSwabBarsData($event = { value: null }) {
    [this.totalSwabBarsData,this.totalSwabBarsMax] = await this.barsService.generateRegionalBars('tamponi', $event.value)
  }

  async getNewSwabBarsData($event = { value: null }) {
    [this.newSwabBarsData,this.newSwabBarsMax] = await this.barsService.generateRegionalBars('nuovi_tamponi', $event.value)
  }

  async getPositivePerSwabBarsData($event = { value: null }) {
    [this.positivePerSwabBarsData,this.positivePerSwabBarsMax] = await this.barsService.generateRegionalBars('totale_casi', $event.value, 'tamponi')
  }

  changeAggregate($event) {

  }


  changeLog10($event) {
    this.log10 = $event
    this.initData()
  }

  public formatPercentage(input) {
    return `${input}%`
  }

  public formatRound(input) {
    return Math.round(input).toLocaleString()
  }

  public formatPow10(input) {
    return Math.round(Math.pow(10, input)).toLocaleString()
  }

  public formatLog10(input) {
    return input && input > 0 ? Math.log10(input) : input
  }

  public gridLineNgStyleByXAxisTick(tick) {
    var day = moment(tick, 'DD/MM').day();
    var isWeekend = (day === 6) || (day === 0);
    return isWeekend ? { stroke: '#999' } : null
  }

  public gridLineNgStyleByYAxisTick(tick) {
    return tick == 0 ? { stroke: '#999' } : null
  }
}