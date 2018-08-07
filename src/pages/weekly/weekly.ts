import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';


@Component({
  selector: 'page-weekly',
  templateUrl: 'weekly.html',
})
export class WeeklyPage {
  url: string = 'http://dongil.org/data/app.php';
  img: string;
  flagGetImage:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http : HTTP
    ,private iab: InAppBrowser) {
    this.http.post(this.url ,{}, {}).then(data => {
      // console.log(data.data);
      var regex = /.*?src="(.*?)"/;
      this.img = regex.exec(data.data)[1];
      console.log(this.img);    
      this.flagGetImage=true;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WeeklyPage');
  }
  showWeekly(){
    const browser = this.iab.create(this.img,"target='_blank'"  );
    browser.show();
    
  }
}
