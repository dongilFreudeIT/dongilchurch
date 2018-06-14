import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MyinfoShowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-myinfo-show',
  templateUrl: 'myinfo-show.html',
})
export class MyinfoShowPage {
  user : any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
      //전달받은 data(유저 정보)를 user 객체로 대입
      this.user = this.navParams.data;
      var tempBirth = this.user.birthday;
      this.user.birthday = tempBirth.substring(0,4)+"년 " + tempBirth.substring(4,6) + "월 " + tempBirth.substring(6,8) +"일";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyinfoShowPage');
  }

}
