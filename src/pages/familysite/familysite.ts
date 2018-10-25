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
items = [
      'familysite_freude',
      'Exodo',
      'Levitico',
      'Números',
      'Deuteronomio',
      'Josúe',
      'Jueces',
      'Rut',
      '1 Samuel',
      '2 Samuel',
      '1 Reies',
      '2 Reies',
      '1 Cronicas',
      '2 Cronicas',
      'Esdras',
      'Nehemías',
      'Ester',
      'Job',
      'Salmos',
      'Proverbios',
      'Eclesiastés',
      'Cantares',
      'Isaías',
      'Jeremías',
      'Lamentaciones',
      'Ezequiel',
      'Daniel',
      'Oseas',
      'Joel',
      'Amós',
      'Abdias',
      'Jonas',
      'Miqueas',
      'Nahum',
      'Habacuc',
      'Sofonías',
      'Hageos',
      'Zacarías',
      'Malaquías'
    ];
    
    gofamilysite_freude(){
      const browser = this.iab.create('http://freude.kr/');
      browser.show();
    }
    gofamilysite_dfks(){
      const browser = this.iab.create('http://dfks.kr/');
      browser.show();
    }
    gofamilysitegodaedo(){
      const browser = this.iab.create('http://godaedo.net/');
      browser.show();
    }
    gofamilysite_dfit(){
      const browser = this.iab.create('http://dfit.or.kr');
      browser.show();
    }
    gofamilysite_dfle(){
      const browser = this.iab.create('http://dfle.org');
      browser.show();
    }
    gofamilysite_dongiltimes(){
      const browser = this.iab.create('http://dongiltimes.org');
      browser.show();
    }
    gofamilysite_dongiltv(){
      const browser = this.iab.create('http://dongil.tv');
      browser.show();
    }
    gofamilysite_lib(){
      const browser = this.iab.create('http://dongil.egentouch.com/');
      browser.show();
    }

}
