import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HTTP } from '@ionic-native/http';

import { PushShowPage } from '../pushShow/pushShow';

@Component({
  selector: 'page-alarm',
  templateUrl: 'alarm.html'
})
export class AlarmPage {
  url: string = 'http://13.125.35.123/api';
  pushDataArray : any; //서버에서 받아온 푸쉬 메세지 리스트 저장 array

  constructor(public navCtrl: NavController, private storage: Storage, public http : HTTP) {

    // 뱃지(숫자 보여주는거) 클리어
    // this.badge.clear();
    this.getPushMessage();

  }
showDetail(serial){
  this.navCtrl.push(PushShowPage, serial);
  }

  getPushMessage(){

    //저장 된 user serial 가져와서 서버에 푸쉬 리스트 요청
    this.storage.get('user_serial').then((value) => {

      var param = { serial: value };
      this.http.post(this.url + '/user/get_push_list', param ,{}).then(data =>{
        if(data.status == 200){
          console.log(data.data);
          var obj = JSON.parse(data.data);
          //로그인 성공이면
          if(obj.code == "S01"){
            this.pushDataArray = obj.value;
          }else{
            console.log(obj.message);
          }
        }
      });//http 부분

    });//storage 부분
  }
}
