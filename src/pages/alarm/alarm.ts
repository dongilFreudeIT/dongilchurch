import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HTTP } from '@ionic-native/http';

import { PushShowPage } from '../pushShow/pushShow';
import * as moment from 'moment';
import { NativeStorage } from '@ionic-native/native-storage';


@Component({
  selector: 'page-alarm',
  templateUrl: 'alarm.html'
})
export class AlarmPage {
  url: string = 'http://13.125.35.123/api';
  pushDataArray: any; //서버에서 받아온 푸쉬 메세지 리스트 저장 array

  constructor(public navCtrl: NavController, private storage: Storage, public http: HTTP
    , private nativeStorage: NativeStorage) {

    // 뱃지(숫자 보여주는거) 클리어
    // this.badge.clear();
    this.getPushMessage();
    moment.lang("ko");
  }
  showDetail(data) {
    this.navCtrl.push(PushShowPage, data);
  }

  getPushMessage() {


    //저장 된 user serial 가져와서 서버에 푸쉬 리스트 요청
    this.storage.get('user_serial').then((value) => {


      var param = { serial: value };
      this.http.post(this.url + '/user/get_push_list', param, {}).then(data => {
        if (data.status == 200) {
          console.log(data.data);
          var obj = JSON.parse(data.data);
          //로그인 성공이면
          if (obj.code == "S01") {
            this.pushDataArray = obj.value;
            //this.new_pushData = obj.value;
            // this.storage.set("pushDataArray", this.pushDataArray);
            this.nativeStorage.setItem('pushDataArray2', this.pushDataArray)
              .then(
                () => console.log('Stored item!'),
                error => console.error('Error storing item', error)
              );
          } else {
            console.log(obj.message);
          }
        }


        this.addMoment();
        // console.log("th : " +moment(this.pushDataArray[1]["registered_date"]).fromNow());

      });//http 부분

    });
    // this.storage.get('pushDataArray').then((_pushDataArray) => {
    //   this.pushDataArray = _pushDataArray;
    // });
    this.nativeStorage.getItem('pushDataArray2').then(data => {
        this.pushDataArray = data;
      }
    )


  }

  /**
   * 건호 추가
   * 날짜 변환 코드
   */
  addMoment() {
    for (var i = 0; i < this.pushDataArray.length; i++) {
      var temp_json = this.pushDataArray[i];
      for (var key in temp_json) {
        var attrSerial = key;
        var attrTitle = temp_json[key];
        if (attrSerial == "registered_date") {
          temp_json["registered_date"] = moment(temp_json["registered_date"]).fromNow();
          // console.log(attrSerial + " === " + temp_json["registered_date"]);
        }
      }
      this.pushDataArray[i] = temp_json;
    }
  }

  storeLocalStorage() {
    this.nativeStorage.setItem('myitem', { property: 'value', anotherProperty: 'anotherValue' })
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );

    this.nativeStorage.getItem('myitem')
      .then(
        data => { console.log(data.anotherProperty) }
      )
  }
}
