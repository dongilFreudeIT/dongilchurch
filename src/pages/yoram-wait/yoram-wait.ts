import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { YoramProvider } from '../../providers/yoram/yoram';


@Component({
  selector: 'page-yoram-wait',
  templateUrl: 'yoram-wait.html',
})
export class YoramWaitPage {
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public yoramProvider: YoramProvider,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad YoramWaitPage');
  }

}
