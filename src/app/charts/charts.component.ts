import { Component, OnInit, HostListener } from '@angular/core';
import { SeriesService } from '../series.service';
import { ActivatedRoute } from '@angular/router';
import { Bar, Series } from '../app.model';
import { BarsService } from '../bars.service';
import { DataService } from '../data.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import moment from 'moment';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})

export class ChartsComponent implements OnInit{
  breadcrumbs: any;

  colorScheme = {
    domain: ['#CFC0BB', '#5AA454', '#7aa3e5', '#E44D25', '#a8385d', '#aae3f5']
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

  constructor(
    private seriesService: SeriesService,
    private barsService: BarsService,
    public dataService: DataService,
    activateRoute: ActivatedRoute,
    public breakpointObserver: BreakpointObserver) {
    activateRoute.params.subscribe(params => {
      this.breadcrumbs = params
      this.initData()
    })
  }
  ngOnInit(): void {
    this.onResize();
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
    const fn = this.log10? this.formatLog10: null
    this.seriesData = [
      await this.seriesService.getCountrySeries('totale_casi', $localize`Confirmed`, null, fn),
      await this.seriesService.getCountrySeries("dimessi_guariti", $localize`Recovered/Released`, null, fn),
      await this.seriesService.getCountrySeries('terapia_intensiva', $localize`Intensive Care`, null, fn),
      await this.seriesService.getCountrySeries('deceduti', $localize`Deaths`, null, fn),
    ]
    this.seriesDailyData = [
      await this.seriesService.getCountrySeries("totale_nuovi_casi", $localize`Confirmed`),
      await this.seriesService.getCountrySeries('nuovi_dimessi_guariti', $localize`Recovered/Released`),
      await this.seriesService.getCountrySeries('nuovi_terapia_intensiva', $localize`Intensive Care`),
      await this.seriesService.getCountrySeries('nuovi_deceduti', $localize`Deaths`),
      await this.seriesService.getCountryForecastSeries('p50', $localize`AWS Forecast QLoss 0.5`)
    ]
    this.seriesPercData = [
      await this.seriesService.getCountrySeries('totale_nuovi_casi', $localize`Confirmed`, 'totale_casi_ieri'),
      await this.seriesService.getCountrySeries('nuovi_dimessi_guariti', $localize`Recovered/Released`, 'dimessi_guariti_ieri'),
      await this.seriesService.getCountrySeries('nuovi_terapia_intensiva', $localize`Intensive Care`, 'terapia_intensiva_ieri'),
      await this.seriesService.getCountrySeries('nuovi_deceduti', $localize`Deaths`, 'deceduti_ieri'),
    ]
    this.seriesSwabData = [
      await this.seriesService.getCountrySeries('nuovi_tamponi', $localize`Tests`),
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
    const fn = this.log10? this.formatLog10: null
    this.seriesData = [
      await this.seriesService.getRegionalSeries(region, 'totale_casi', $localize`Confirmed`, null, fn),
      await this.seriesService.getRegionalSeries(region, "dimessi_guariti", $localize`Recovered/Released`, null, fn),
      await this.seriesService.getRegionalSeries(region, 'terapia_intensiva', $localize`Intensive Care`, null, fn),
      await this.seriesService.getRegionalSeries(region, 'deceduti', $localize`Deaths`, null, fn),
    ]
    this.seriesDailyData = [
      await this.seriesService.getRegionalSeries(region, "totale_nuovi_casi", `Confirmed`),
      await this.seriesService.getRegionalSeries(region, 'nuovi_dimessi_guariti', $localize`Recovered/Released`),
      await this.seriesService.getRegionalSeries(region, 'nuovi_terapia_intensiva', $localize`Intensive Care`),
      await this.seriesService.getRegionalSeries(region, 'nuovi_deceduti', $localize`Deaths`),
      await this.seriesService.getRegionalForecastSeries(region, 'p50', $localize`AWS Forecast QLoss 0.5`),
    ]
    this.seriesPercData = [
      await this.seriesService.getRegionalSeries(region, 'totale_nuovi_casi', $localize`Confirmed`, 'totale_casi_ieri'),
      await this.seriesService.getRegionalSeries(region, 'nuovi_dimessi_guariti', $localize`Recovered/Released`, 'dimessi_guariti_ieri'),
      await this.seriesService.getRegionalSeries(region, 'nuovi_terapia_intensiva', $localize`Intensive Care`, 'terapia_intensiva_ieri'),
      await this.seriesService.getRegionalSeries(region, 'nuovi_deceduti', $localize`Deaths`, 'deceduti_ieri'),
    ]
    this.seriesSwabData = [
      await this.seriesService.getRegionalSeries(region, 'nuovi_tamponi', $localize`Tests`),
    ]
    await this.getTotalCasesBarsData()
    await this.getNewCasesPercBarsData()
    await this.getNewPositiveBarsData()
  }

  private async setProvincialData(region: string, province: string) {
    this.seriesData = [
      await this.seriesService.getProvincialSeries(region, province, 'totale_casi', $localize`Total Confirmed`),
      await this.seriesService.getProvincialSeries(region, province, 'totale_nuovi_casi', $localize`New Confirmed`)
    ]
    this.seriesPercData = [
      await this.seriesService.getProvincialSeries(region, province, 'totale_nuovi_casi', $localize`New Confirmed Rate`, 'totale_casi_ieri'),
    ]
  }

  async getTotalCasesBarsData($event = { value: null }) {
    this.totalCasesBarsData = this.breadcrumbs["region"] != null ?
      await this.barsService.getProvincialBars('totale_casi', $event.value, this.breadcrumbs["region"]) :
      await this.barsService.getRegionalBars('totale_casi', $event.value)
    this.totalCasesBarsMax = this.getMaxValue(this.totalCasesBarsData,this.totalCasesBarsMax)
  }
  
  async getNewCasesPercBarsData($event = { value: null }) {
    this.newCasesPercBarsData = this.breadcrumbs["region"] != null ?
      await this.barsService.getProvincialBars('totale_nuovi_casi', $event.value, this.breadcrumbs["region"], 'totale_casi') :
      await this.barsService.getRegionalBars('totale_nuovi_casi', $event.value, 'totale_casi')
    this.newCasesPercBarsMax = this.getMaxValue(this.newCasesPercBarsData,this.newCasesPercBarsMax)
  }

  async getNewPositiveBarsData($event = { value: null }) {
    this.newPositiveBarsData = this.breadcrumbs["region"] != null ?
      await this.barsService.getProvincialBars('totale_nuovi_casi', $event.value, this.breadcrumbs["region"]) :
      await this.barsService.getRegionalBars('totale_nuovi_casi', $event.value)
    this.newPositiveBarsMax = this.getMaxValue(this.newPositiveBarsData,this.newPositiveBarsMax)
  }

  async getIntensiveBarsData($event = { value: null }) {
    this.intensiveBarsData = await this.barsService.getRegionalBars('terapia_intensiva', $event.value)
    this.intensiveBarsMax = this.getMaxValue(this.intensiveBarsData,this.intensiveBarsMax)
  }
  
  async getLethalityBarsData($event = { value: null }) {
    this.lethalityBarsData = await this.barsService.getRegionalBars('deceduti', $event.value, 'totale_casi')
    this.lethalityBarsMax = this.getMaxValue(this.lethalityBarsData,this.lethalityBarsMax)
  }
  
  async getTotalCasesPerProvinceBarsData($event = { value: null }) {
    this.totalCasesPerProvinceBarsData = await this.barsService.getProvincialBars('totale_casi', $event.value)
    this.totalCasesPerProvinceBarsMax = this.getMaxValue(this.totalCasesPerProvinceBarsData,this.totalCasesPerProvinceBarsMax )
  }
  
  async getTotalSwabBarsData($event = { value: null }) {
    this.totalSwabBarsData = await this.barsService.getRegionalBars('tamponi', $event.value)
    this.totalSwabBarsMax = this.getMaxValue(this.totalCasesBarsData,this.totalSwabBarsMax)
  }

  async getNewSwabBarsData($event = { value: null }) {
    this.newSwabBarsData = await this.barsService.getRegionalBars('nuovi_tamponi', $event.value)
    this.newSwabBarsMax = this.getMaxValue(this.newSwabBarsData,this.newSwabBarsMax)
    return this.newSwabBarsData
  }

  async getPositivePerSwabBarsData($event = { value: null }) {
    this.positivePerSwabBarsData = await this.barsService.getRegionalBars('totale_casi', $event.value,'tamponi')
    this.positivePerSwabBarsMax = this.getMaxValue(this.positivePerSwabBarsData,this.positivePerSwabBarsMax)
  }

  changeAggregate($event) {
    console.log($event)
  }

  log10:boolean = true

  changeLog10($event) {
    this.log10 = $event
    this.initData()
  }
  
  private getMaxValue(barsData: Bar[], maxValue = null): number {
    return maxValue? maxValue: barsData[0].value
  }

  public formatPercentage(input) {
    return `${input}%`
  }

  public formatRound(input) {
    return Math.round(input).toLocaleString()
  }

  public formatPow10(input) {
    return Math.round(Math.pow(10,input)).toLocaleString()
  }

  public formatLog10(input) {
    return input && input > 0? Math.log10(input): input
  }

  public xAxisTickClassByTick(tick) {
    var day = moment(tick,'DD/MM').day();
    var isWeekend = (day === 6) || (day === 0);
    return isWeekend? "grid-line-path-weekend": ""
  }

  @HostListener("window:resize", [])
  onResize() {
       this.breakpointObserver
      .observe(['(min-width: 540px)'])
      .subscribe((state: BreakpointState) => {
        this.showLegend = state.matches
      });
  }
}