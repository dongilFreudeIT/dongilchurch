import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { AlarmPage } from '../alarm/alarm';
import { SettingPage } from '../setting/setting';
import { ParkingPage } from '../parking/parking';

import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { MyinfoShowPage } from '../myinfo-show/myinfo-show';

// declare var audio_mode: any; 
declare var AudioManagement: any;
declare var androidVolume : any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  url: string = 'http://13.125.35.123/api';
  user_serial : string; //유저 serial(user db primary key)

  constructor(public navCtrl: NavController, private storage: Storage,  private androidPermissions: AndroidPermissions, public http : HTTP, public alertCtrl : AlertController) {
  
  }

  
  goToAlarm(){
    this.storage.get('user_serial').then((value) => {
      this.user_serial = value;
      if(this.user_serial==null || this.user_serial == ''){
        this.showAlert("알림","로그인을 해주세요.");
        return;
      }
      this.navCtrl.push(AlarmPage);
    });
  }
  goToMyinfo(){
    this.storage.get('user_serial').then((value) => {
      this.user_serial = value;


      if(this.user_serial==null || this.user_serial == ''){
        this.showAlert("알림","로그인을 해주세요.");
        return;
      }

      var param = { serial : this.user_serial };
      this.http.post(this.url + '/user/get_user', param,{}).then(data =>{
        if(data.status == 200){
          console.log(data.data);
          var obj = JSON.parse(data.data);
          //로그인 성공이면
          if(obj.code == "S01"){
              var user = obj.value;
              this.navCtrl.push(MyinfoShowPage, user);
          }else{

          }
        }
      });//http end

    });
  
  }

  goToSetting(){

    this.storage.get('user_serial').then((value) => {
      this.user_serial = value;

    if(this.user_serial==null || this.user_serial == ''){
      this.showAlert("알림","로그인을 해주세요.");
      return;
    }
    this.navCtrl.push(SettingPage);

  });
  }

  goToParking(){

    this.storage.get('user_serial').then((value) => {
      this.user_serial = value;
    if(this.user_serial==null || this.user_serial == ''){
      this.showAlert("알림","로그인을 해주세요.");
      return;
    }
    this.navCtrl.push(ParkingPage);

  });
  }

  showAlert(title, msg){
    console.log(title+","+msg);
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: msg,
        buttons: ['OK']
      });
    alert.present();
  
  }

  
}
