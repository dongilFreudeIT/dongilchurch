import { Component } from "@angular/core";

import {
  NavController,
  ViewController,
  ModalController,
  NavParams,
  AlertController
} from "ionic-angular";

import { HTTP } from "@ionic-native/http";
import { MenuController } from "ionic-angular";
import { Storage } from "@ionic/storage";

import { ServerProvider } from "../../providers/server/server";
@Component({
  selector: "page-passwordset",
  templateUrl: "passwordset.html"
})
export class PasswordsetPage {
  url: string = "http://13.125.35.123/api";
  user_id: string; //사용자가 입력한 id
  password: string; //사용자 비밀번호
  password_again: string;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public http: HTTP,
    public menuCtrl: MenuController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    private storage: Storage,
    private server: ServerProvider
  ) {
    this.url = this.server.url;
    console.log("this.navParams.data" + JSON.stringify(this.navParams.data));
    this.user_id = this.navParams.data.id;
  }

  changepw() {
    if (this.password == null || this.password == "") {
      this.showAlert("안내", "비밀번호를 입력해 주세요.");
      return;
    }
    // if(this.password != null && this.password != '' && this.chkPwd(this.password)== false){
    //   this.showAlert("안내", "비밀번호는 영문+숫자 6자 이상입니다.");
    //   return;
    // }

    if (this.password != this.password_again) {
      this.showAlert(
        "안내",
        "새 비밀번호와 비밀번호 확인이 일치하지 않습니다."
      );
      return;
    }

    console.log(this.user_id + " " + this.password);
    var accountInfo = { user_id: this.user_id, password: this.password };
    // //입력 받은 id, pw로 로그인 시도
    this.http
      .post(this.url + "/user/change_pw", accountInfo, {})
      .then(data => {
        if (data.status == 200) {
          console.log(data.data);
          var obj = JSON.parse(data.data);
          //로그인 성공이면
          if (obj.code == "S01") {
            this.showAlert("안내", "비밀번호 변경 성공");
            this.login();
            this.navCtrl.pop();
          } else {
            var errorMsg = obj.message;
            this.showAlert("로그인 실패", errorMsg);
          }
        }
      })
      .catch(error => {
        console.log(error.error);
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

  cancel() {
    this.navCtrl.pop();
  }

  login() {
    console.log(this.user_id + " " + this.password);
    var accountInfo = { id: this.user_id, pw: this.password };
    //입력 받은 id, pw로 로그인 시도
    this.http
      .post(this.url + "/user/login", accountInfo, {})
      .then(data => {
        if (data.status == 200) {
          console.log(data.data);
          var obj = JSON.parse(data.data);
          //로그인 성공이면
          if (obj.code == "S01") {
            //user_serial, 등급을 내부 저장소에 저장하고 메뉴를 로그인 메뉴로 바꾸고 홈으로 이동
            this.storage.set("user_serial", obj.user_serial);
            console.log(
              "login page store user serial : " +
                this.storage.get("user_serial")
            );
            this.storage.set("grade", obj.grade);
            if (obj.grade == "관리자") {
              this.menuCtrl.enable(true, "master");
              this.menuCtrl.enable(false, "authenticated");
              this.menuCtrl.enable(false, "unauthenticated");
              this.menuCtrl.enable(false, "parking_manager");
            } else if (obj.grade == "주차장매니저") {
              this.menuCtrl.enable(true, "parking_manager");
              this.menuCtrl.enable(false, "master");
              this.menuCtrl.enable(false, "authenticated");
              this.menuCtrl.enable(false, "unauthenticated");
            } else {
              this.menuCtrl.enable(false, "master");
              this.menuCtrl.enable(true, "authenticated");
              this.menuCtrl.enable(false, "unauthenticated");
              this.menuCtrl.enable(false, "parking_manager");
            }
            //만약 storage에 저장된 push_token이 있으면 서버에 등록 시킨다.
            //일반적으로 앱 실행시 이미 push_token이 이미 생성되어 storage에 저장되어 있다.
            this.storage.get("push_token").then(value => {
              console.log("start save token :" + value);
              var param = { push_token: value, serial: obj.user_serial };
              this.http
                .post(this.url + "/user/update_token", param, {})
                .then(data => {
                  if (data.status == 200) {
                    console.log(data.data);
                    // var obj = JSON.parse(data.data);
                  }
                });
            });

            this.showAlert(
              "<strong>" +
                obj.name +
                "</strong>님 로그인 되었습니다.<br>사랑하며 축복합니다!",
              ""
            );
          } else {
            var errorMsg = obj.message;
            this.showAlert("로그인 실패", errorMsg);
          }

          this.http
            .post(
              this.url + "/user/get_user",
              { user_serial: obj.user_serial },
              {}
            )
            .then(data => {
              if (data.status == 200) {
                console.log(data.data);
                var obj = JSON.parse(data.data);
                //로그인 성공이면
                if (obj.code == "S01") {
                  var user = obj.value;
                  this.storage.set("get_user", user);
                  // this.navCtrl.push(MyinfoPage, user);
                } else {
                }
              }
            }); //http end
        }
      })
      .catch(error => {
        console.log(error.error);
      });
  }
}
