import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

import { YoramHttpProvider } from '../../providers/yoram-http/yoram-http';

@Component({
  selector: 'page-yoram-modal-search-one',
  templateUrl: 'yoram-modal-search-one.html',
})
export class YoramModalSearchOnePage {

  constructor(
    public navCtrl: NavController, 
    public viewController: ViewController,
    public navParams: NavParams,
    public yoramHttpProvider: YoramHttpProvider
)
  {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad YoramModalSearchOnePage');
  }

}
