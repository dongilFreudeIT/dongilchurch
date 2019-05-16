import { Component, NgZone } from "@angular/core";
import {
  NavController,
  Platform,
  AlertController,
  LoadingController,
  ItemSliding,
  Item
} from "ionic-angular";
import { Storage } from "@ionic/storage";

import { HTTP } from "@ionic-native/http";

import { PushShowPage } from "../pushShow/pushShow";
import { AlarmHidePage } from "../alarm-hide/alarm-hide";
import * as moment from "moment";
import { NativeStorage } from "@ionic-native/native-storage";

@Component({
  selector: "page-alarm",
  templateUrl: "alarm.html"
})
export class AlarmPage {
  url: string = "http://13.125.35.123/api";
  pushDataArray: any; //서버에서 받아온 푸쉬 메세지 리스트 저장 array
  bInfinite: boolean = true;
  bShowAlert: boolean = false;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    private storage: Storage,
    public http: HTTP,
    platform: Platform,
    private nativeStorage: NativeStorage,
    private _zone: NgZone
  ) {
    this.nativeStorage.getItem("pushDataArray2").then(data => {
      this.pushDataArray = data;
      console.log("native storage : ");
    });

    moment.lang("ko");

    document.addEventListener("resume", () => {
      console.log("document.addEventListener('resume' ");
      this._zone.run(() => {
        this.getPushMessage();
      });
    });
  }
  doInfinite(): Promise<any> {
    console.log("Begin async operation");
    this.getPushMessageAll();
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("Async operation has ended");
        resolve();
        this.bInfinite = false;
      }, 10000);
    });
  }

  doRefresh(refresher) {
    console.log("Begin async operation", refresher);
    this.getPushMessage();
    this.bInfinite = true;
    setTimeout(() => {
      console.log("Async operation has ended");
      refresher.complete();
    }, 1000);
  }

  showDetail(data) {
    this.navCtrl.push(PushShowPage, data);
  }

  getPushMessage() {
    //저장 된 user serial 가져와서 서버에 푸쉬 리스트 요청
    this.storage.get("user_serial").then(value => {
      var param = { serial: value };
      this.http.post(this.url + "/user/get_push_list", param, {}).then(data => {
        if (data.status == 200) {
          // console.log(data.data);
          var obj = JSON.parse(data.data);
          //로그인 성공이면
          if (obj.code == "S01") {
            this.pushDataArray = obj.value;
            //this.new_pushData = obj.value;
            // this.storage.set("pushDataArray", this.pushDataArray);
            this.nativeStorage
              .setItem("pushDataArray2", this.pushDataArray)
              .then(
                () => {
                  console.log(JSON.stringify(this.pushDataArray,null,2));
                },
                error => console.error("Error storing item", error)
              );
          } else {
            console.log(obj.message);
          }
        }
        this.addMoment();
      });
    });
  }
  getPushMessageAll() {
    //저장 된 user serial 가져와서 서버에 푸쉬 리스트 요청
    this.storage.get("user_serial").then(value => {
      var param = { serial: value };
      this.http
        .post(this.url + "/user/get_push_list_all", param, {})
        .then(data => {
          if (data.status == 200) {
            // console.log(data.data);
            var obj = JSON.parse(data.data);
            //로그인 성공이면
            if (obj.code == "S01") {
              this.pushDataArray = obj.value;
              //this.new_pushData = obj.value;
              // this.storage.set("pushDataArray", this.pushDataArray);
              this.nativeStorage
                .setItem("pushDataArray2", this.pushDataArray)
                .then(
                  () => console.log("Stored item!"),
                  error => console.error("Error storing item", error)
                );
            } else {
              console.log(obj.message);
            }
          }
          this.addMoment();
        });
    });
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

  storeLocalStorage() {
    this.nativeStorage
      .setItem("myitem", { property: "value", anotherProperty: "anotherValue" })
      .then(
        () => console.log("Stored item!"),
        error => console.error("Error storing item", error)
      );

    this.nativeStorage.getItem("myitem").then(data => {
      console.log(data.anotherProperty);
    });
  }
  showAlert(data) {
    const alert = this.alertCtrl.create({
      title: "안내",
      subTitle: "메시지를 삭제 하시겠습니까?",
      buttons: [
        {
          text: "취소",
          handler: data => {
            console.log("Cancel clicked");

            this.bShowAlert = false;
          }
        },
        {
          text: "삭제",
          handler: data1 => {
            console.log("Saved clicked");
            this.deletePush(data);
            this.bShowAlert = false;
          }
        }
      ]
    });
    alert.present();
  }

  deletePush(data) {
    this.presentLoading();
    console.log("DELETE : " + data.serial);
    this.http
      .post(this.url + "/user/hidePush/", { serial: data.serial }, {})
      .then(data => {
        if (data.status == 200) {
          var obj = JSON.parse(data.data);
          console.log(data.data);
          if (obj.code.includes("S")) {
            this._zone.run(() => {
              // this.pushDataArray = this.pushDataArray.filter(item => item !== data);
              this.getPushMessage();
              // this.pushDataArray.remove(data);
              console.log(JSON.stringify(data));
            });
            // this.getUsersInfo();
          } else if (obj.code.includes("E")) {
          }
        }
      });
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 1000
    });
    loader.present();
  }
  longPressed(data) {
    if (this.bShowAlert == false) {
      this.bShowAlert = true;
      console.log("active" + data.title + data.serial);
      this.showAlert(data);
    }
  }
  ionViewDidLeave() {
    console.log("leave");
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad");
    this.getPushMessage();
  }
  goToTrash() {}
  public open(itemSlide: ItemSliding, item: Item) {
    // reproduce the slide on the click
    itemSlide.moveSliding(200);
  }
  public close(item: ItemSliding) {
    item.close();
  }
}
