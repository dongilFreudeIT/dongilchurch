import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';



@Component({
  templateUrl: 'parking.html'
})
export class ParkingPage {
    url: string = 'http://13.125.35.123/api';
    parkingArray : any; //주차장 정보 가지고 있는 array
    eventId : any;
    thisPage : any;


  constructor(public navCtrl: NavController, public http : HTTP) {
    var _this = this;
    this.eventId = setInterval(
      function(){
        _this.http.post(_this.url + '/parking/get_status', null,{}).then(data =>{
          if(data.status == 200){
            console.log("user = " + data.data);
            var obj = JSON.parse(data.data);
            //값 얻어왔으면
            if(obj.code == "S01"){
              _this.parkingArray = obj.value;
            }else{
                console.log(obj.message);
            }
          }
      });
        
      }, 30000 );
      this.getParking();
  }

  ionViewDidLeave(){
    console.log("leave");
    clearInterval(this.eventId);
  }
  //주차장 정보 얻어와서 배열에 저장
  getParking(){
    this.http.post(this.url + '/parking/get_status', null,{}).then(data =>{
        if(data.status == 200){
          console.log("user = " + data.data);
          var obj = JSON.parse(data.data);
          //값 얻어왔으면
          if(obj.code == "S01"){
            this.parkingArray = obj.value;
          }else{
              console.log(obj.message);
          }
        }
    });
  }
  
}
