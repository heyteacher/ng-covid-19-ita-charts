import { Component, Inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { faTwitter, faWhatsapp, faGithub, 
         faAngular, faFacebook, faBootstrap,
         faLinkedin, faFontAwesome} from '@fortawesome/free-brands-svg-icons';
import {faCopy, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { environment } from './../environments/environment';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = $localize`COVID-19 Italy`
  shareMessage = $localize`COVID-19 Italy Charts per region and province`
  shareUrl = environment.shareUrl
  otherLang = environment.otherLang

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

  copyMessage(val: string){
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
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer)
  {
    matIconRegistry.addSvgIcon(
      "ngx-charts",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.baseHref}assets/icon/ngx-charts.svg`)
    );
  } 
}