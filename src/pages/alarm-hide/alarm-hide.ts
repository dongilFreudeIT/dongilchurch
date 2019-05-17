import { Component } from "@angular/core";
import {
  NavController,
  Platform,
} from "ionic-angular";

import { HTTP } from "@ionic-native/http";

import { PushShowPage } from "../pushShow/pushShow";
import * as moment from "moment";

import { ServerProvider } from "../../providers/server/server";
@Component({
  selector: "page-alarm-hide",
  templateUrl: "alarm-hide.html"
})
export class AlarmHidePage {
  url: string = "http://13.125.35.123/api";
  pushDataArray: any; //서버에서 받아온 푸쉬 메세지 리스트 저장 array
  bInfinite: boolean = true;
  bShowAlert: boolean = false;

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    public http: HTTP,
    platform: Platform,
    private server:ServerProvider,
  ) {
    this.url = this.server.url;
    this.getPushMessageHided();
    moment.lang("ko");
  }
  


  showDetail(data) {
    this.navCtrl.push(PushShowPage, data);
  }

  getPushMessageHided() {
    //저장 된 user serial 가져와서 서버에 푸쉬 리스트 요청
    this.storage.get("user_serial").then(value => {
      var param = { serial: value };
      this.http.post(this.url + "/user/get_push_list_hide", param, {}).then(data => {
        if (data.status == 200) {
          // console.log(data.data);
          var obj = JSON.parse(data.data);
          //로그인 성공이면
          if (obj.code == "S01") {
            this.pushDataArray = obj.value;
            //this.new_pushData = obj.value;
            // this.storage.set("pushDataArray", this.pushDataArray);
            
          } else {
            console.log(obj.message);
          }
        }
        this.addMoment();
      });
    });
  }
  addMoment() {
    for (var i = 0; i < this.pushDataArray.length; i++) {
      var temp_json = this.pushDataArray[i];
      for (var key in temp_json) {
        var attrSerial = key;
        // var attrTitle = temp_json[key];
        if (attrSerial == "registered_date") {
          temp_json["registered_date"] = moment(
            temp_json["registered_date"]
          ).fromNow();
          // console.log(attrSerial + " === " + temp_json["registered_date"]);
        }
      }
      this.pushDataArray[i] = temp_json;
    }
  }

  ionViewDidLeave() {
    console.log("leave");
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad");
    this.getPushMessageHided();
  }
}
