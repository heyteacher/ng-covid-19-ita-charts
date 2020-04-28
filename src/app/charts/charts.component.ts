import { Component, OnInit, HostListener } from '@angular/core';
import { SeriesService } from '../series.service';
import { ActivatedRoute } from '@angular/router';
import { Bar, Series } from '../app.model';
import { BarsService } from '../bars.service';
import { NumbersService } from '../numbers.service';
import moment from 'moment';
import { forkJoin } from 'rxjs';

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

  numbersData: Bar[] = [];

  showLegend: boolean
  log10: boolean = true

  constructor(
    private seriesService: SeriesService,
    private barsService: BarsService,
    private numbersService: NumbersService,
    activateRoute: ActivatedRoute
  ) {
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

  private setCountryData() {
    const fn = this.log10 ? this.formatLog10 : null
    forkJoin(
      this.seriesService.generateCountrySeries('totale_casi', $localize`Confirmed`, null, fn),
      this.seriesService.generateCountrySeries("dimessi_guariti", $localize`Recovered/Released`, null, fn),
      this.seriesService.generateCountrySeries('terapia_intensiva', $localize`Intensive Care`, null, fn),
      this.seriesService.generateCountrySeries('deceduti', $localize`Deaths`, null, fn),
      this.seriesService.generateCountrySeries('totale_positivi', $localize`Current Positive`, null, fn),
    )
      .subscribe(data => this.seriesData = data)

    forkJoin(
      this.seriesService.generateCountrySeries("totale_nuovi_casi", $localize`Confirmed`),
      this.seriesService.generateCountrySeries('nuovi_dimessi_guariti', $localize`Recovered/Released`),
      this.seriesService.generateCountrySeries('nuovi_terapia_intensiva', $localize`Intensive Care`),
      this.seriesService.generateCountrySeries('nuovi_deceduti', $localize`Deaths`),
      this.seriesService.generateCountrySeries('variazione_totale_positivi', $localize`Current Positive`),
      this.seriesService.generateCountryARIMAForecastSeries('p50', `AWS Forecast ARIMA`),
      this.seriesService.generateCountryForecastDeepARPlusSeries('p50', `AWS Forecast Deep AR+`)
    )
      .subscribe(data => this.seriesDailyData = data)

    forkJoin(
      this.seriesService.generateCountrySeries('totale_nuovi_casi', $localize`Confirmed`, 'totale_casi_ieri'),
      this.seriesService.generateCountrySeries('nuovi_dimessi_guariti', $localize`Recovered/Released`, 'dimessi_guariti_ieri'),
      this.seriesService.generateCountrySeries('nuovi_terapia_intensiva', $localize`Intensive Care`, 'terapia_intensiva_ieri'),
      this.seriesService.generateCountrySeries('nuovi_deceduti', $localize`Deaths`, 'deceduti_ieri'),
      this.seriesService.generateCountrySeries('variazione_totale_positivi', $localize`Current Positive`, 'totale_positivi'),
    )
      .subscribe(data => this.seriesPercData = data)

    forkJoin(
      this.seriesService.generateCountrySeries('nuovi_tamponi', $localize`Tests`),
      this.seriesService.generateCountrySeries('nuovi_casi_testati', $localize`People Tested`)
    )
      .subscribe(data => this.seriesSwabData = data)

    this.getIntensiveBarsData()
    this.getNewPositiveBarsData()
    this.getLethalityBarsData()

    this.getNewCasesPercBarsData()
    this.getTotalCasesBarsData()
    this.getTotalCasesPerProvinceBarsData()

    this.getTotalSwabBarsData()
    this.getPositivePerSwabBarsData()
    this.getNewSwabBarsData()

    this.numbersService.generateCountryNumbers()
      .subscribe(data => this.numbersData = data)
  }

  private setRegionalData(region: string) {
    const fn: Function = this.log10 ? this.formatLog10 : null
    forkJoin(
      this.seriesService.generateRegionalSeries(region, 'totale_casi', $localize`Confirmed`, null, fn),
      this.seriesService.generateRegionalSeries(region, "dimessi_guariti", $localize`Recovered/Released`, null, fn),
      this.seriesService.generateRegionalSeries(region, 'terapia_intensiva', $localize`Intensive Care`, null, fn),
      this.seriesService.generateRegionalSeries(region, 'deceduti', $localize`Deaths`, null, fn),
      this.seriesService.generateRegionalSeries(region, 'totale_positivi', $localize`Current Positive`, null, fn),
    )
      .subscribe(data => this.seriesData = data)

    forkJoin(
      this.seriesService.generateRegionalSeries(region, "totale_nuovi_casi", `Confirmed`),
      this.seriesService.generateRegionalSeries(region, 'nuovi_dimessi_guariti', $localize`Recovered/Released`),
      this.seriesService.generateRegionalSeries(region, 'nuovi_terapia_intensiva', $localize`Intensive Care`),
      this.seriesService.generateRegionalSeries(region, 'nuovi_deceduti', $localize`Deaths`),
      this.seriesService.generateRegionalSeries(region, 'variazione_totale_positivi', $localize`Current Positive`),
      this.seriesService.generateRegionalARIMAForecastSeries(region, 'p50', `AWS Forecast ARIMA`),
      this.seriesService.generateRegionalForecastDeepARPlusSeries(region, 'p50', `AWS Forecast Deep AR+`),
    )
      .subscribe(data => this.seriesDailyData = data)

    forkJoin(
      this.seriesService.generateRegionalSeries(region, 'totale_nuovi_casi', $localize`Confirmed`, 'totale_casi_ieri'),
      this.seriesService.generateRegionalSeries(region, 'nuovi_dimessi_guariti', $localize`Recovered/Released`, 'dimessi_guariti_ieri'),
      this.seriesService.generateRegionalSeries(region, 'nuovi_terapia_intensiva', $localize`Intensive Care`, 'terapia_intensiva_ieri'),
      this.seriesService.generateRegionalSeries(region, 'nuovi_deceduti', $localize`Deaths`, 'deceduti_ieri'),
      this.seriesService.generateRegionalSeries(region, 'variazione_totale_positivi', $localize`Current Positive`, 'totale_positivi'),
    )
      .subscribe(data => this.seriesPercData = data)

    forkJoin(
      this.seriesService.generateRegionalSeries(region, 'nuovi_tamponi', $localize`Tests`),
      this.seriesService.generateRegionalSeries(region, 'nuovi_casi_testati', $localize`People Tested`)
    )
      .subscribe(data => this.seriesSwabData = data)


    this.getTotalCasesBarsData()
    this.getNewCasesPercBarsData()
    this.getNewPositiveBarsData()

    this.numbersService.generateRegionNumbers(region)
      .subscribe((data) => this.numbersData = data)
  }

  private setProvincialData(region: string, province: string) {

    forkJoin(
      this.seriesService.generateProvincialSeries(region, province, 'totale_casi', $localize`Total Confirmed`),
      this.seriesService.generateProvincialSeries(region, province, 'totale_nuovi_casi', $localize`New Confirmed`)
    )
      .subscribe(data => this.seriesData = data)

    this.seriesService.generateProvincialSeries(region, province, 'totale_nuovi_casi', $localize`New Confirmed Rate`, 'totale_casi_ieri')
      .subscribe(data => this.seriesPercData = [data])

    this.numbersService.generateProvinceNumbers(region, province)
      .subscribe(data => this.numbersData = data)
  }

  getTotalCasesBarsData($event = { value: null }) {
    (this.breadcrumbs["region"] != null ?
      this.barsService.generateProvincialBars('totale_casi', $event.value, this.breadcrumbs["region"]) :
      this.barsService.generateRegionalBars('totale_casi', $event.value)
    )
      .subscribe((data) => [this.totalCasesBarsData, this.totalCasesBarsMax] = data)
  }

  getNewCasesPercBarsData($event = { value: null }) {
    (this.breadcrumbs["region"] != null ?
      this.barsService.generateProvincialBars('totale_nuovi_casi', $event.value, this.breadcrumbs["region"], 'totale_casi_ieri') :
      this.barsService.generateRegionalBars('totale_nuovi_casi', $event.value, 'totale_casi_ieri')
    )
      .subscribe((data) => [this.newCasesPercBarsData, this.newCasesPercBarsMax] = data)
  }

  getNewPositiveBarsData($event = { value: null }) {
    (this.breadcrumbs["region"] != null ?
      this.barsService.generateProvincialBars('totale_nuovi_casi', $event.value, this.breadcrumbs["region"]) :
      this.barsService.generateRegionalBars('totale_nuovi_casi', $event.value)
    )
      .subscribe((data) => [this.newPositiveBarsData, this.newPositiveBarsMax] = data)
  }

  getIntensiveBarsData($event = { value: null }) {
    this.barsService.generateRegionalBars('terapia_intensiva', $event.value)
      .subscribe((data) => {
        [this.intensiveBarsData, this.intensiveBarsMax] = data
      })
  }

  getLethalityBarsData($event = { value: null }) {
    this.barsService.generateRegionalBars('deceduti', $event.value, 'totale_casi')
      .subscribe((data) => {
        [this.lethalityBarsData, this.lethalityBarsMax] = data
      })
  }

  getTotalCasesPerProvinceBarsData($event = { value: null }) {
    this.barsService.generateProvincialBars('totale_casi', $event.value)
      .subscribe((data) => {
        [this.totalCasesPerProvinceBarsData, this.totalCasesPerProvinceBarsMax] = data
      })
  }

  getTotalSwabBarsData($event = { value: null }) {
    this.barsService.generateRegionalBars('tamponi', $event.value)
      .subscribe((data) => {
        [this.totalSwabBarsData, this.totalSwabBarsMax] = data
      })
  }

  getNewSwabBarsData($event = { value: null }) {
    this.barsService.generateRegionalBars('nuovi_tamponi', $event.value)
      .subscribe((data) => {
        [this.newSwabBarsData, this.newSwabBarsMax] = data
      })
  }

  getPositivePerSwabBarsData($event = { value: null }) {
    this.barsService.generateRegionalBars('totale_casi', $event.value, 'tamponi')
      .subscribe((data) => {
        [this.positivePerSwabBarsData, this.positivePerSwabBarsMax] = data
      })
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