import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { AlertController } from "ionic-angular";
import { HTTP } from "@ionic-native/http";
import { NavParams } from "ionic-angular";

import { ServerProvider } from "../../providers/server/server";
@Component({
  selector: "page-userdetail",
  templateUrl: "userdetail.html"
})
//유저 상세 화면
export class UserdetailPage {
  url: string = "http://13.125.35.123/api";
  user: any;
  password: string;
  birthdate: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public http: HTTP,
    private server: ServerProvider
  ) {
    this.url = this.server.url;
    this.user = this.navParams.data;
    if (this.user.birthday) {
      try {
        this.birthdate =
          this.user.birthday.substring(0, 4) +
          "-" +
          this.user.birthday.substring(4, 6) +
          "-" +
          this.user.birthday.substring(6, 8);
      } catch (error) {}
    }
    console.log("received = " + this.user.name);
  }

  //유저 정보 수정
  changeUser() {
    if (this.user.address == null || this.user.address == "") {
      this.user.address = " ";
    }
    //생년월일 체크
    if (this.birthdate) {
      console.log("birth 2 : " + this.birthdate);
      var today = new Date();
      var birth = new Date(this.birthdate);
      if (birth >= today) {
        this.showAlert("안내", "생년월일 입력이 잘못 되었습니다.");
        return;
      }

      this.user.birthday = this.birthdate.replace(/-/gi, "");
      // console.log("birth 3 : " +this.user.birthday);
    }
    var param = {
      serial: this.user.serial,
      password: this.password,
      name: this.user.name,
      birthday: this.user.birthday,
      phone: this.user.phone,
      address: this.user.address,
      grade: this.user.grade,
      place: this.user.place,
      subgroup: this.user.subgroup,
      title: this.user.title,
      subtitle: this.user.subtitle
    };
    this.http
      .post(this.url + "/user/update_user_for_admin", param, {})
      .then(data => {
        if (data.status == 200) {
          console.log(data.data);
          var obj = JSON.parse(data.data);
          //
          if (obj.code == "S01") {
            this.showAlert("정보 수정 완료", "수정되었습니다.");
            this.navCtrl.pop();
          } else {
            var errorMsg = obj.message;
            this.showAlert("정보 수정 실패", errorMsg);
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
}
