import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { YoramProvider } from '../../providers/yoram/yoram';

@Component({
  selector: 'page-yoram-agree',
  templateUrl: 'yoram-agree.html',
})
export class YoramAgreePage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public yoramProvider: YoramProvider,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad YoramAgreePage');
  }

}
