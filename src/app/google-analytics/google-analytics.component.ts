import { Component } from '@angular/core';
import { GoogleAnalyticsService } from './google-analytics.service';
import { GoogleAnalyticsModule } from './google-analytics.module';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
declare let gtag: Function;


@Component({
  selector: 'app-google-analytics',
  template: ''
})
export class GoogleAnalyticsComponent {

  private googleAnalyticsService: GoogleAnalyticsService
  private router: Router
  constructor() {
    this.googleAnalyticsService = GoogleAnalyticsModule.injector.get(GoogleAnalyticsService);
    this.router = GoogleAnalyticsModule.injector.get(Router);
  }

  protected subscribeEventsProvider() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', environment.gTagConfig,
          {
            'page_path': event.urlAfterRedirects
          }
        );
      }
    })
  }

  sendEvent(
    eventAction: string,
    eventCategory: string =  null,
    eventLabel: string = null,
    eventValue: number = null) {
    this.googleAnalyticsService.eventEmitter(eventAction, eventCategory, eventLabel, eventValue);
  }

  sendShare(
    method: string) {
    this.googleAnalyticsService.eventShareEmitter(method);
  }

}
