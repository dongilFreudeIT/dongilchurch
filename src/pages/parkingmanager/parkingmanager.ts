import { Component } from "@angular/core";
import { NavController, AlertController, ToastController } from "ionic-angular";

import { HTTP } from "@ionic-native/http";
import { Network } from "@ionic-native/network";

import { CheckNetworkProvider } from "../../providers/check-network/check-network";

import { ServerProvider } from "../../providers/server/server";
@Component({
  templateUrl: "parkingmanager.html"
})
export class ParkingManagerPage {
  url: string = "http://13.125.35.123/api";
  parkingArray: any; //주차장 정보 array
  isConnected: number = 1;
  subscribeNet1: any;
  subscribeNet2: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public toastController: ToastController,
    public http: HTTP,
    private network: Network,
    private chechNetwork: CheckNetworkProvider,
    private server: ServerProvider
  ) {
    this.url = this.server.url;
    this.getParking();

    this.subscribeNet1 = this.network.onDisconnect().subscribe(data => {
      console.log("network disconnected");
      this.chechNetwork.display(data.type);
      this.isConnected = 0;
    });
    this.subscribeNet2 = this.network.onConnect().subscribe(data => {
      console.log("network connected");
      this.chechNetwork.display(data.type);
      this.isConnected = 1;
      this.getParking();
    });
  }
  //서버로부터 주차장 상태 받아오는 함수
  getParking() {
    this.http.post(this.url + "/parking/get_status", null, {}).then(data => {
      if (data.status == 200) {
        console.log("user = " + data.data);
        var obj = JSON.parse(data.data);
        //값 얻어왔으면
        if (obj.code == "S01") {
          this.parkingArray = obj.value;
        } else {
          console.log(obj.message);
        }
      }
    });
  }
  //주차장의 자리 몇개 남았는지 서버에 저장하는 함수
  setParking(serial_input, status_input) {
    if (this.isConnected == 0) {
      this.showAlert("안내", "인터넷 연결을 확인해주세요.");
    }
    var param = {
      serial: serial_input,
      status: status_input
    };

    this.http
      .post(this.url + "/parking/update_parking", param, {})
      .then(data => {
        if (data.status == 200) {
          console.log("user = " + data.data);
          var obj = JSON.parse(data.data);
          //값 얻어왔으면
          if (obj.code == "S01") {
            this.showAlert("안내", "수정 되었습니다.");
            this.getParking();
          } else {
            console.log(obj.message);
          }
        }
      });
  }

  showAlert(title, msg) {
    console.log(title + "," + msg);
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ["OK"]
    });
    alert.present();
  }

  ngOnDestroy() {
    this.subscribeNet1.unsubscribe();
    this.subscribeNet2.unsubscribe();
  }
}
