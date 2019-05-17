import { Component } from "@angular/core";
import { ViewController, NavParams, AlertController } from "ionic-angular";
import { HTTP } from "@ionic-native/http";

import { ServerProvider } from "../../providers/server/server";
@Component({
  templateUrl: "modal_conent.html"
})
export class NotiSetting {
  url: string = "http://13.125.35.123/api";

  startTime: any;
  endTime: any;
  userSerial: any;

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public http: HTTP,
    public alertCtrl: AlertController,
    private server: ServerProvider
  ) {
    this.url = this.server.url;
    console.log("UserId= " + navParams.get("user"));
    this.userSerial = navParams.get("user");
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  //예배 시간 추가
  addBlockTime() {
    console.log(this.startTime + "~" + this.endTime);

    if (this.startTime >= this.endTime) {
      this.showAlert("오류", "종료시간이 시작시간보다 같거나 빠를수 없습니다.");
      return;
    }
    var param = {
      serial: this.userSerial,
      start: this.startTime,
      end: this.endTime
    };
    this.http.post(this.url + "/user/add_blocktime", param, {}).then(data => {
      if (data.status == 200) {
        console.log(data.data);
        var obj = JSON.parse(data.data);
        //로그인 성공이면
        if (obj.code == "S01") {
          this.viewCtrl.dismiss("successs");
        } else {
          console.log(obj.message);
        }
      }
    }); //http end
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
}
