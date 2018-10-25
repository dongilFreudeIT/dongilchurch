import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { AlarmPage } from '../alarm/alarm';
import { SettingPage } from '../setting/setting';
import { ParkingPage } from '../parking/parking';
import { FamilysitePage } from '../familysite/familysite';
import { WeeklyPage } from '../weekly/weekly';
<<<<<<< HEAD
import { SignupCheckPage } from '../signup-check/signup-check';
import { GetUserInfoPage } from '../get-user-info/get-user-info';
=======
>>>>>>> parent of 1c912fd... 웹뷰, 홈 디자인

import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Platform } from 'ionic-angular';

import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  url: string = 'http://13.125.35.123/api';
  user_serial: string; //유저 serial(user db primary key)

  urlVideo: any;
  urlDongil:string = 'http://dongil.org/data/preach.php';
  cWidth: any;
  cHeight: any;
  _width: any;
  _height: any;

  constructor(public navCtrl: NavController, private storage: Storage, private androidPermissions: AndroidPermissions, public http: HTTP,
    public alertCtrl: AlertController, private iab: InAppBrowser, private screenOrientation: ScreenOrientation,
    private platform: Platform, public sanitizer: DomSanitizer
  ) {
    
    platform.ready().then(() => {
      this.http.post(this.urlDongil, {}, {}).then(data => {
        this.urlVideo = data.data;
        console.log("this.urlVideo : " +this.urlVideo);
      });
    });

    this.screenOrientation.unlock();
    this.cWidth = platform.width();
    this.cHeight = platform.height();

    this.setSize(this.cWidth);
    this.screenOrientation.onChange().subscribe(() => {
      if (platform.isPortrait()) {
        this.setSize(this.cHeight);
      } else {
        this.setSize(this.cWidth);
      }
    }
    );
  }
  setSize(width) {
    this._width = width;
    this._height = Math.floor(this._width * 0.56);
  }

  goToAlarm() {
    this.storage.ready().then(() => {
      this.storage.get('user_serial').then((value) => {
        this.user_serial = value;
        if (this.user_serial == null || this.user_serial == '') {
          this.showAlert("안내", "로그인을 해주세요.");
          return;
        }
        this.navCtrl.push(AlarmPage);
      })
    });
  }

  goToSetting() {

    this.storage.get('user_serial').then((value) => {
      this.user_serial = value;

      if (this.user_serial == null || this.user_serial == '') {
        this.showAlert("안내", "로그인을 해주세요.");
        return;
      }
      this.navCtrl.push(SettingPage);

    });
  }

  goToParking() {
    this.navCtrl.push(ParkingPage);
  }
  goToHome(params) {
    const browser = this.iab.create('http://www.dongil.org/');
    browser.show();
    // if (!params) params = {};
    // this.navCtrl.setRoot(HomePage);
  }
  showAlert(title, msg) {
    console.log(title + "," + msg);
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();

  }
  goToFamilysite() {
    this.navCtrl.push(FamilysitePage);
  }
  goToWeekly() {
    this.navCtrl.push(WeeklyPage);
  }
<<<<<<< HEAD
  goToSignupCheck(){
    this.navCtrl.push(SignupCheckPage);
  }
  goToGetUserInfo(){
    this.navCtrl.push(GetUserInfoPage);
  }
=======
>>>>>>> parent of 1c912fd... 웹뷰, 홈 디자인
}
