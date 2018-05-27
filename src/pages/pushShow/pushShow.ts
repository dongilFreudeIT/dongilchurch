import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';

@Component({
  templateUrl: 'pushShow.html'
})
//푸쉬 1개를 상세히 보는 화면
export class PushShowPage {
  url: string = 'http://13.125.35.123/api';
  serial : string; //유저 serial
  title : string;
  message : string;
  // image : string;
  registered_date : string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http : HTTP) {
    this.serial = navParams.data;
    this.getPushData();
  }

  //서버로부터 push 데이터 가져옴
  getPushData(){

    var param = { 
        serial : this.serial
      };

    this.http.post(this.url + '/push/get_push_detail', param ,{}).then(data =>{
        if(data.status == 200){
          console.log("user = " + data.data);
          var obj = JSON.parse(data.data);
          //값 얻어왔으면
          if(obj.code == "S01"){
            var tempValue = obj.value;
            this.title = tempValue[0].title;
            this.message  = tempValue[0].body;
            this.registered_date = tempValue[0].registered_date;
            // this.image = "http://13.125.35.123"+ tempValue[0].image;
        
          }else{
              console.log(obj.message);
          }
        }
    });
  }
  
}
