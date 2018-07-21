import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';


@Component({
  selector: 'page-weekly',
  templateUrl: 'weekly.html',
})
export class WeeklyPage {
  url: string = 'http://dongil.org/data/app.php';
  img: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http : HTTP) {
    this.http.post(this.url ,{}, {}).then(data => {
      // console.log(data.data);
      var regex = /.*?src="(.*?)"/;
      this.img = regex.exec(data.data)[1];
      console.log(this.img);    
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WeeklyPage');
  }

}
