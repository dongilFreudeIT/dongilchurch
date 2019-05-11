import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the FamilysitePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-familysite',
  templateUrl: 'familysite.html',
})
export class FamilysitePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private iab: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FamilysitePage');
  }
  gofamilysite_freude() {
    const browser = this.iab.create('http://freude.kr/',"target='_blank'");
    browser.show();
  }
  gofamilysite_dfks() {
    const browser = this.iab.create('http://dfks.kr/',"target='_blank'");
    browser.show();
  }
  gofamilysitegodaedo() {
    const browser = this.iab.create('http://godaedo.net/',"target='_blank'");
    browser.show();
  }
  gofamilysite_dfit() {
    const browser = this.iab.create('http://dfit.or.kr',"target='_blank'");
    browser.show();
  }
  gofamilysite_dfle() {
    const browser = this.iab.create('http://dfle.org',"target='_blank'");
    browser.show();
  }
  gofamilysite_dongiltimes() {
    const browser = this.iab.create('http://dongiltimes.org',"target='_blank'");
    browser.show();
  }
  gofamilysite_dongiltv() {
    const browser = this.iab.create('http://dongil.tv',"target='_blank'");
    browser.show();
  }
  gofamilysite_love() {
    const browser = this.iab.create('https://m.blog.naver.com/dongilove2019?suggestAddBuddy=true',"target='_blank'");
    browser.show();
  }
  gofamilysite_lib() {
    const browser = this.iab.create('http://dongil.egentouch.com/',"target='_blank'");
    browser.show();
  }

}
