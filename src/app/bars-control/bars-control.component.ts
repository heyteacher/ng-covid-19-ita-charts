import { Component, OnInit,  EventEmitter, Input, Output } from '@angular/core';
import { DataService } from '../data.service';
import {faPlay, faPause, faStop } from '@fortawesome/free-solid-svg-icons';
import { AppConfigService } from '../app-config.service';

@Component({
  selector: 'app-bars-control',
  templateUrl: './bars-control.component.html',
  styleUrls: ['./bars-control.component.css']
})

export class BarsControlComponent  {
  
  faPlay = faPlay 
  faPause = faPause
  faStop = faStop

  @Input() title: string;
  @Output() change = new EventEmitter<any>();

  isPlaying: boolean = false
 
  private index:number = 0
  private interval = null

  constructor(public dataService:DataService, private appConfigService: AppConfigService) {
  }
 
  day(): string {
    return this.dataService.getDay(this.index)
  }  
  
  play() {
    this.clearInterval()
    this.isPlaying = true
    this.resetIndex()
    this.next()
    this.interval = setInterval(() => this.next(),1000)
  }

  pause() {
    this.clearInterval()
    this.isPlaying = false
    this.change.emit({
      value:this.day()
    }) 
  }

  stop() {
    this.pause()
    this.index = 0
    this.change.emit({
      value:this.day()
    }) 
  }
  
  onSelectionChange($event) {
    this.index = this.dataService.getDays().indexOf($event.value)
    this.change.emit($event)  
  }

  private resetIndex(){
    if (this.index <= 0) {
      this.index = this.appConfigService.daysToShowInBars
    }
  }

  private next() {
    if (this.index <= 0) {
      return this.stop()
    }
    this.index = this.index - 1 

    this.change.emit({
      value:this.day()
    }) 
  }

  private clearInterval() {
    if (this.interval) clearInterval(this.interval)
  }
}
