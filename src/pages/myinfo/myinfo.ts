import { Component } from "@angular/core";
import { AlertController, NavController, NavParams } from "ionic-angular";
import { HTTP } from "@ionic-native/http";

import { ServerProvider } from "../../providers/server/server";
@Component({
  selector: "page-myinfo",
  templateUrl: "myinfo.html"
})
export class MyinfoPage {
  url: string = "http://13.125.35.123/api";

  user: any; //유저의 id, 주소, 등급등을 가지고 있는 객체
  password: string;
  // password_again: string;
  birthdate: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public http: HTTP,
    private server: ServerProvider
  ) {
    this.url = this.server.url;
    //전달받은 data(유저 정보)를 user 객체로 대입
    this.user = this.navParams.data;
    this.birthdate =
      this.user.birthday.substring(0, 4) +
      "-" +
      this.user.birthday.substring(4, 6) +
      "-" +
      this.user.birthday.substring(6, 8);

    // console.log("birth 1 : " +this.birthdate);
  }

  update() {
    // if(this.password == null || this.password == ''){
    //   this.showAlert("안내","입력하신 2개의 비밀번호가 일치하지 않습니다.");
    //   return;
    // }
    // if (this.password == null || this.password == '') {
    //   this.showAlert("안내", "비밀번호를 입력해 주세요.");
    //   return;
    // }
    // if(this.password != null && this.password != '' && this.chkPwd(this.password)== false){
    //   this.showAlert("안내", "비밀번호는 영문+숫자 6자 이상입니다.");
    //   return;
    // }

    // if(this.password != this.password_again){
    //   this.showAlert("안내","입력하신 2개의 비밀번호가 일치하지 않습니다.");
    //   return;
    // }
    if (this.user.name == null || this.user.name == "") {
      this.showAlert("안내", "이름을 입력해 주세요.");
      return;
    }
    if (this.user.name.length < 2) {
      this.showAlert("안내", "이름은 최소 2자 이상입니다.");
      return;
    }
    if (
      this.user.phone == null ||
      this.user.phone == "" ||
      this.user.phone.length != 11
    ) {
      this.showAlert("안내", "휴대폰 번호를 입력해 주세요.");
      return;
    }
    if (this.user.address == null || this.user.address == "") {
      this.user.address = " ";
    }
    //생년월일 체크
    if (this.user.birthday != null) {
      // console.log("birth 2 : " +this.birthdate);
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
      phone: this.user.phone,
      name: this.user.name,
      birthday: this.user.birthday,
      address: this.user.address,
      title: this.user.title,
      subgroup: this.user.subgroup,
      subtitle: this.user.subtitle,
      place: this.user.place
    };

    this.http.post(this.url + "/user/update_user", param, {}).then(data => {
      if (data.status == 200) {
        console.log(data.data);
        var obj = JSON.parse(data.data);
        //로그인 성공이면
        if (obj.code == "S01") {
          this.showAlert("성공", "정보를 수정했습니다.");
          this.navCtrl.pop();
        } else {
          this.showAlert("실패", obj.message);
        }
      }
    }); //http end
  }

  isValidDate(dateString) {
    // First check for the pattern
    if (dateString.length > 8) return false;

    // Parse the date parts to integers
    var day = parseInt(dateString.substring(0, 4));
    var month = parseInt(dateString.substring(4, 6));
    var year = parseInt(dateString.substring(6, 8));

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12) return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
      monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
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
  //비밀번호 영문 + 숫자 6자리 체크 로직
  chkPwd(str) {
    var reg_pwd = /^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
    if (!reg_pwd.test(str)) {
      return false;
    }
    return true;
  }
}
