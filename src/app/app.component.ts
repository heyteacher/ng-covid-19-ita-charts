import { Component, Inject, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import {
  faTwitter, faWhatsapp, faGithub,
  faAngular, faFacebook, faBootstrap,
  faLinkedin, faFontAwesome
} from '@fortawesome/free-brands-svg-icons';
import { faCopy, faShareAlt, faHeart } from '@fortawesome/free-solid-svg-icons';
import { environment } from './../environments/environment';
import { environment as environmentProdEn } from './../environments/environment.prod';
import { environment as environmentProdIt } from './../environments/environment.it.prod';
import { GoogleAnalyticsComponent } from './google-analytics/google-analytics.component';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent extends GoogleAnalyticsComponent {
  title = $localize`COVID-19 Italy`
  shareMessage = $localize`COVID-19 Italy Charts per region and province`
  shareUrl = environment.shareUrl
  otherLang = Object.assign({},environment.otherLang)

  faTwitter = faTwitter
  faWhatsapp = faWhatsapp
  faGithub = faGithub
  faAngular = faAngular
  faFacebook = faFacebook
  faBootstrap = faBootstrap
  faLinkedin = faLinkedin
  faCopy = faCopy
  faFontAwesome = faFontAwesome
  faShareAlt = faShareAlt
  faHeart = faHeart

  twitterLink() {
    return `https://twitter.com/intent/tweet?source=tweetbutton&text=${this.shareMessage}&url=${this.shareUrl}&${environment.shareTags}`
  }
  whatsappLink() {
    return `https://web.whatsapp.com/send?text=${this.shareMessage} ${this.shareUrl}`
  }
  facebookLink() {
    return `https://www.facebook.com/sharer/sharer.php?u=${this.shareUrl}`
  }
  linkedinLink() {
    return `https://www.linkedin.com/shareArticle?mini=true&url=${this.shareUrl}&title=${this.shareMessage}`
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  constructor(
    router: Router,
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer
  ) {
    super()
    super.subscribeEventsProvider()

    // if browser language is it and differs from page language
    // redirect to italian index
    if (sessionStorage.getItem('langRedirect') != 'true' &&
      navigator.language == 'it' &&
      document.documentElement.lang != 'it'
    ) {
      sessionStorage.setItem('langRedirect', 'true');
      location.href = location.href.replace(environmentProdEn.baseHref, environmentProdIt.baseHref)
      return
    }

    // add ngx-charts icon
    matIconRegistry.addSvgIcon(
      "ngx-charts",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.baseHref}assets/icon/ngx-charts.svg`)
    );

    /* this subscription will fire always when the url changes */
    router.events.subscribe(val => {

      /* the router will fire multiple events */
      /* we only want to react if it's the final active route */
      if (val instanceof NavigationEnd) {
        /* the variable curUrlTree holds all params, queryParams, segments and fragments from the current (active) route */
        let curUrlTree = router.parseUrl(router.url);
        this.otherLang.url = environment.otherLang.url
        if (curUrlTree.root.children['primary']) {
          this.otherLang.url += '#/' + curUrlTree.root.children.primary.segments.map(
            (segment) => {
              if (segment.path == 'NON ATTRIBUITI') return 'NOT ATTRIBUTED YET'
              if (segment.path == 'NOT ATTRIBUTED YET') return 'NON ATTRIBUITI'
              return segment.path 
            }
          ).join('/');
        }
      }
    });

  }
}