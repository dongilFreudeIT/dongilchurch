import { Component } from '@angular/core';

import { NavController, ViewController, AlertController } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';
import { Device } from '@ionic-native/device';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PasswordsetPage } from '../passwordset/passwordset';

@Component({
  templateUrl: 'findpassword.html'
})
export class FindPasswordPage {

  url: string = 'http://13.125.35.123/api';
  browserRef: any;
  phone: string;
  static cerPhone: string;
  user_id: any;
  
  contactTell =false;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HTTP, public iab: InAppBrowser, private device: Device, public viewCtrl: ViewController) {

  }

  showAlert(title, msg) {
    console.log(title + "," + msg);
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  next() {
    // console.log("cer phone=" + FindPasswordPage.cerPhone);
    // if (this.phone == null || this.phone == '') {
    //   this.showAlert("안내", "휴대폰 번호를 입력해 주세요.");
    //   return;
    // }
    // if (FindPasswordPage.cerPhone == '') {
    //   this.showAlert("안내", "본인인증을 해주세요.");
    //   return;
    // }
    // if (FindPasswordPage.cerPhone != this.phone) {
    //   this.showAlert("안내", "본인인증한 폰번호와 입력한 폰번호가 틀립니다.");
    //   return;
    // }
    // console.log(this.phone);
    // var param = {
    //   phone: this.phone
    // };

    // this.http.post(this.url + '/user/find_user', param, {}).then(data => {
    //   if (data.status == 200) {
    //     console.log(data.data);
    //     var obj = JSON.parse(data.data);
    //     //로그인 성공이면
    //     if (obj.code == "S01") {
    //       this.user_id = obj.id;
    //       this.navCtrl.pop();
    //       this.navCtrl.push(PasswordsetPage, this.user_id);

    //     } else {
    //       var errorMsg = obj.message;
    //       this.showAlert("안내", errorMsg);
    //     }
    //   }
    // })
    //   .catch(error => {
    //     console.log(error.error);
    //   });
    this.contactTell=true;
  }

  cancel() {
    this.navCtrl.pop();
  }

  // mobileAuth() {


  //   console.log("mobileAuth");

  //   let thisPage = this;

  //   if (this.device.platform == "Android") {
  //     this.browserRef = this.iab.create("http://13.125.35.123/checkplus_main.php", "_blank", 'toolbar=no');
  //   } else {
  //     console.log("ios");
  //     this.browserRef = this.iab.create("http://13.125.35.123/checkplus_main_ios.php", "_blank", 'location=no,closebuttoncaption=종료');
  //   }
  //   this.browserRef.on("exit").subscribe((event) => {
  //     console.log("InAppBrowserEvent(exit):" + JSON.stringify(event));
  //     // if(event.url.startsWith("http://13.125.35.123/checkplus_success.php")){ // Just testing. Please add success and failure into server 
  //     //           console.log("cert success");
  //     //           thisPage.is_certificated = true;
  //     //           thisPage.showAlert("안내", "본인인증 성공했습니다. 나머지 정보를 입력해 주세요.");
  //     //           thisPage.browserRef.close();
  //     //           return;

  //     //     }else if(event.url.startsWith("http://13.125.35.123/checkplus_fail.php")){
  //     //           console.log("cert failure");
  //     //           thisPage.is_certificated = false;
  //     //           thisPage.showAlert("안내", "본인인증 실패했습니다. 다시 시도해 주세요.");
  //     //           thisPage.browserRef.close();
  //     //           return;
  //     //     }else{
  //     thisPage.browserRef.close();
  //     // }

  //   });

  //   this.browserRef.on("loadstart").subscribe(function (e) {

  //     if (e.url.startsWith("http://13.125.35.123/success.php")) { // Just testing. Please add success and failure into server 
  //       console.log("cert success");
  //       var tempUrl = e.url;
  //       var urlArr = tempUrl.split("?phone=");
  //       var urlArr2 = urlArr[1].split("name=");
  //       FindPasswordPage.cerPhone = urlArr2[0];
  //       console.log(FindPasswordPage.cerPhone);
  //       thisPage.showAlert("안내", "본인인증 성공");
  //       thisPage.browserRef.close();
  //       return;

  //     } else if (e.url.startsWith("http://13.125.35.123/checkplus_fail.php")) {
  //       console.log("cert failure");
  //       thisPage.showAlert("안내", "본인인증 실패");
  //       thisPage.browserRef.close();
  //       return;
  //     }


  //   });
  //   this.browserRef.on("loaderror").subscribe((event) => {
  //     console.log("loaderror:" + event.url);
  //     if (event.url.startsWith("http://13.125.35.123/success.php")) { // Just testing. Please add success and failure into server 
  //       console.log("cert success");
  //       var tempUrl = event.url;
  //       var urlArr = tempUrl.split("?phone=");
  //       FindPasswordPage.cerPhone = urlArr[1];
  //       console.log(FindPasswordPage.cerPhone);
  //       thisPage.showAlert("안내", "본인인증 성공");
  //       thisPage.browserRef.close();
  //       return;

  //     } else if (event.url.startsWith("http://13.125.35.123/checkplus_fail.php")) {
  //       console.log("cert failure");
  //       thisPage.showAlert("안내", "본인인증 실패");
  //       thisPage.browserRef.close();
  //       return;
  //     }
  //   });

  //   this.browserRef.on("loadstop").subscribe((event) => {
  //     console.log("loadstop event comes " + event.url);
  //     //본인인증 성공했으면
  //     if (event.url.startsWith("http://13.125.35.123/success.php")) { // Just testing. Please add success and failure into server 
  //       console.log("cert success");
  //       var tempUrl = event.url;
  //       var urlArr = tempUrl.split("?phone=");
  //       FindPasswordPage.cerPhone = urlArr[1];
  //       console.log(FindPasswordPage.cerPhone);
  //       thisPage.showAlert("안내", "본인인증 성공");
  //       thisPage.browserRef.close();
  //       return;

  //     } else if (event.url.startsWith("http://13.125.35.123/checkplus_fail.php")) {
  //       console.log("cert failure");
  //       thisPage.showAlert("안내", "본인인증 실패");
  //       thisPage.browserRef.close();
  //       return;
  //     }

  //   });


  // }

}
