import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ] 
})
export class GoogleAnalyticsModule { 
  static injector: Injector;
constructor(injector: Injector) {
  GoogleAnalyticsModule.injector = injector;
}

}
