import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';

import { Network } from '@ionic-native/network'

import { CheckNetworkProvider } from '../../providers/check-network/check-network';

@Component({
  templateUrl: 'parking.html'
})
export class ParkingPage {
    url: string = 'http://13.125.35.123/api';
    parkingArray : any; //주차장 정보 가지고 있는 array
    eventId : any;
    thisPage : any;
    isConnected: number = 1;
    subscribeNet1 : any;
    subscribeNet2 : any;

  constructor(public navCtrl: NavController, public toastController :ToastController, public http : HTTP, private network: Network,
        private chechNetwork : CheckNetworkProvider) {
    
    

    this.subscribeNet1 = this.network.onDisconnect().subscribe((data)=>{
      console.log("network disconnected");
      this.chechNetwork.display(data.type);
      this.isConnected = 0
    });
    this.subscribeNet2 = this.network.onConnect().subscribe((data)=> {
      console.log("network connected");
      this.chechNetwork.display(data.type);
      this.isConnected = 1;
      this.getParking();
    });

    var tmpthis = this;
    this.eventId = setInterval(
      function(){
        tmpthis.http.post(tmpthis.url + '/parking/get_status', null,{}).then(data =>{
          if(data.status == 200){
            console.log("user = " + data.data);
            var obj = JSON.parse(data.data);
            //값 얻어왔으면
            if(obj.code == "S01"){
              tmpthis.parkingArray = obj.value;
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
  
  ngOnDestroy(){
    this.subscribeNet1.unsubscribe();
    this.subscribeNet2.unsubscribe();
  }

}
