import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MenuController } from 'ionic-angular';

import { AlarmPage } from '../pages/alarm/alarm';
import { HomePage } from '../pages/home/home';
import { SettingPage } from '../pages/setting/setting';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { UsermanagerPage } from '../pages/usermanager/usermanager';
import { ParkingPage } from '../pages/parking/parking';
import { ParkingManagerPage } from '../pages/parkingmanager/parkingmanager';
import { MyinfoPage } from '../pages/myinfo/myinfo';
import { FamilysitePage } from '../pages/familysite/familysite';
import { RegisteruserPage } from '../pages/registeruser/registeruser';
import { WeeklyPage } from '../pages/weekly/weekly';
import { GetUserInfoPage } from '../pages/get-user-info/get-user-info';
import { YoramPage } from '../pages/yoram/yoram';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http';
import { FCM } from '@ionic-native/fcm'

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SignupCheckPage } from '../pages/signup-check/signup-check';

import { AppVersion } from '@ionic-native/app-version';
import { Market } from '@ionic-native/market';
import { Subscription } from 'rxjs';

// import * as firebase from "firebase";
// var config = {
//   apiKey: "AIzaSyCihLx56ZVvhnUlP_-1dkSNTDNLlAAy1XQ",
//   authDomain: "dongilchurch-b89c0.firebaseapp.com",
//   databaseURL: "https://dongilchurch-b89c0.firebaseio.com",
//   projectId: "dongilchurch-b89c0",
//   storageBucket: "dongilchurch-b89c0.appspot.com",
//   messagingSenderId: "521875318610"
// };
@Component({
  templateUrl: 'app.html'
})
//앱의 시작 class
export class MyApp {

  url: string = 'http://13.125.35.123/api';
  userSerial: any;
  @ViewChild(Nav) navCtrl: Nav;
  rootPage: any = HomePage;
  myName: string;
  private onResumeSubscription: Subscription;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public http: HTTP,
    public menuCtrl: MenuController,
    public storage: Storage,
    public fcm: FCM,
    public alertCtrl: AlertController,
    private iab: InAppBrowser,
    public modalCtrl: ModalController,
    private appVersion: AppVersion,
    private market: Market
  ) {

    platform.ready().then(() => {

      splashScreen.hide();
      statusBar.styleDefault();
      statusBar.overlaysWebView(false);

      //push 보내기 위한 설정
      this.setPushSetting(fcm);

      //로그인 된적 있는지 체크(storage에 user_serial 저장해놓았으면 로그인 된 상태)
      //처음 로그인부분, 확인 필요
      storage.get('user_serial').then((localSerial) => {
        //user serial 없으면 미 로그인
        if (localSerial == null || localSerial == "") {
          this.menuCtrl.enable(false, 'authenticated');
          this.menuCtrl.enable(false, 'master');
          this.menuCtrl.enable(true, 'unauthenticated');
          this.goToLogin();
        } else {  //로그인 접속 시간 갱신을 위해 서버 연결
          storage.get('grade').then((varGrade) => {
            console.log("user Grade : " + varGrade);
            //grade가 없으면 부회원모드
            if (varGrade == null || varGrade == '') {
              console.log('not loggin');
              this.menuCtrl.enable(true, 'unauthenticated');
            } else if (varGrade == "관리자") {
              // console.log('admin');
              this.menuCtrl.enable(true, 'master');
            } else if (varGrade == "주차장매니저") {
              this.menuCtrl.enable(true, 'parking_manager');
            } else {
              this.menuCtrl.enable(true, 'authenticated');
            }
          });

          let param = { user_serial: localSerial };
          this.http.post(this.url + '/user/login_refresh', param, {}).then(data => {
            if (data.status == 200) {
              var obj = JSON.parse(data.data);
              //로그인 접속시간 갱신했으면 받아온 grade에 따라 왼쪽 메뉴 구성 변경
              if (obj.code == "S01") {
                var grade = obj.grade;
                this.storage.set("grade", grade);
                //grade가 없으면 부회원모드
                if (grade == null || grade == '') {
                  console.log('not loggin');
                  this.menuCtrl.enable(true, 'unauthenticated');
                } else if (grade == "관리자") {
                  this.menuCtrl.enable(true, 'master');
                } else if (grade == "주차장매니저") {
                  this.menuCtrl.enable(true, 'parking_manager');
                } else {
                  this.menuCtrl.enable(true, 'authenticated');
                }

                //push_token도 refresh한다.
                this.storage.get("push_token").then((value) => {
                  //app Version 받기
                  this.appVersion.getVersionNumber().then((appversion) => {
                    var param = { push_token: value, serial: localSerial, version: appversion };
                    this.http.post(this.url + '/user/update_token', param, {}).then(data => {
                      if (data.status == 200) {
                        // console.log(data.data);
                        // var obj = JSON.parse(data.data);
                      }
                    });
                  });
                });
              } else {
                console.log("login not refreshed");
              }
            }
          });

          //유저 정보 서버에 받아서 내부에 저장
          this.http.post(this.url + '/user/get_user', param, {}).then(data => {
            if (data.status == 200) {
              var obj = JSON.parse(data.data);
              if (obj.code == "S01") {
                var user = obj.value;
                this.storage.set("get_user", user);
              } else {
              }
            }
          });

        }
        this.checkRequest();
        this.onResumeSubscription = platform.resume.subscribe(() => {
          this.checkRequest();
        });
      });

      storage.get('get_user').then((obj) => {
        this.myName = obj.name;
      });
    });
    // firebase.initializeApp(config);
    // firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     this.rootPage = FamilysitePage;
    //     console.log("auth test");

    //   } else {
    //     this.rootPage = SignupPage;
    //     console.log("auth test");
    //   }
    // });
  }
  ngOnDestroy() {
    // always unsubscribe your subscriptions to prevent leaks
    this.onResumeSubscription.unsubscribe();
  }
  
  checkRequest() {
    this.storage.get('user_serial').then((localSerial) => {

      this.http.post(this.url + '/yoram/checkRequest', { user_serial: localSerial }, {}).then(data => {
        if (data.status == 200) {
          var obj = JSON.parse(data.data);
          console.log(obj);
          for (const key in obj) {
            // console.log("for key : " + key);
            if (obj.hasOwnProperty(key)) {
              const element = obj[key];
              console.log(element);
                let alert = this.alertCtrl.create({
                  title: '개인정보 열람요청',
                  subTitle: '[' + element.sname + ']님께서 개인정보 열람을 요청하셨습니다. <br>아래 [승인]을 누르시면 연락처를 보냅니다.',
                  buttons: [
                    {
                      text: '거절',
                      handler: () => {
                        this.http.post(this.url + '/push/setRequest', { serial: element.serial, name: this.myName, sid: element.sid, allow: 0 }, {});
                      }
                    },
                    {
                      text: '승인',
                      handler: () => {
                        this.http.post(this.url + '/push/setRequest', { serial: element.serial, name: this.myName, sid: element.sid, allow: 1 }, {});
                      }
                    }
                  ]
                });
                alert.present();
              
            }
          }

        } else {
        }
      });
    });
  }
  //fcm 푸쉬 보내기 위한 세팅
  setPushSetting(fcm) {
    // 푸쉬 받을 수 있는 토큰 얻으면 저장소에 저장하고 로그인 하거나 회원가입 시 추가한다.
    fcm.getToken().then(token => {
      console.log("token : " + token);
      this.storage.set("push_token", token);
    });

    //fcm(push) token이 생성 또는 refresh되면 저장소에 저장하고 로그인 하거나 회원가입 시 추가한다.
    fcm.onTokenRefresh().subscribe(token => {
      console.log("refreshed : " + token);
      this.storage.set("push_token", token);
    });

    //push 메세지 도착하면
    fcm.onNotification().subscribe(data => {
      let alert;
      if (data.req == 'update') {
        alert = this.alertCtrl.create({
          title: "안내",
          subTitle: "최신 버전으로 업데이트 하시겠습니까?",
          buttons: [{
            text: '확인',
            handler: () => {
              this.market.open('com.dongil.church');
            }
          }]
        });
      }
      // this.badge.increase(1);
      if (data.wasTapped) { //백그라운드 모드이면
        console.log("Received in background:" + data);
        if (data.req == "1" || data.req == "2") {
          this.navCtrl.push(GetUserInfoPage,{slide:true});
        } else {
          // this.checkRequest();
          this.navCtrl.push(AlarmPage);
        }
      } else {
        console.log("Received in foreground:");
        console.log(data);

        if (data.req == "1") {
          // alert = this.alertCtrl.create({
          // title: "안내",
          // subTitle: "정보 요청이 왔습니다.",
          // buttons: [{
          //   text: '확인',
          //   handler: () => {
          this.checkRequest();
          //     }
          //   }]
          // });
        } else if (data.req == "allow") {
          alert = this.alertCtrl.create({
            title: "안내",
            subTitle: data.sname + "님으로부터 정보 요청이 승인되었습니다.",
            buttons: [{ text: '확인'}]
          }).present();
        }else if (data.req == "deny") {
          alert = this.alertCtrl.create({
            title: "안내",
            subTitle: data.sname + "님께서 정보 열람을 거부하였습니다.",
            buttons: [{ text: '확인'}]
          }).present();
        } else {
          alert = this.alertCtrl.create({
            title: "안내",
            subTitle: "알림 메시지가 도착했습니다.",
            buttons: ['OK']
          }).present();
        }
      };
    })
  }

  //홈페이지 이동(메뉴에서 선택 가능)
  goToHome(params) {
    const browser = this.iab.create('http://www.dongil.org/', "target='_black'");
    browser.show();
    // if (!params) params = {};
    // this.navCtrl.setRoot(HomePage);
  }
  //푸쉬 리스트 이동(메뉴에서 선택 가능)
  goToAlarm(params) {
    if (!params) params = {};
    this.navCtrl.push(AlarmPage);
  }

  //내 정보 수정으로 이동(메뉴에서 선택 가능)
  goToMyinfo(params) {
    //저장된 user_serial이 있으면(로그인 된적 있으면)
    this.storage.get('user_serial').then((value) => {

      var param = { user_serial: value };
      console.log("goto myinfo : " + param.user_serial);
      this.http.post(this.url + '/user/get_user', param, {}).then(data => {
        if (data.status == 200) {
          // console.log(data.data);
          var obj = JSON.parse(data.data);
          //로그인 성공이면
          if (obj.code == "S01") {
            var user = obj.value;
            // this.storage.set("push_token", user);
            this.storage.set("get_user", user);
            // this.navCtrl.push(MyinfoPage, user);
          }
          this.storage.get('get_user').then((value) => {
            console.log("get_user : " + value);
            this.navCtrl.push(MyinfoPage, value);
          });
        }
      }, () => {
        this.storage.get('get_user').then((value) => {
          console.log("get_user : " + value);
          this.navCtrl.push(MyinfoPage, value);
        });
      });//http end
    });//storage end

    // this.storage.get('get_user').then((value) => {
    //   console.log("get_user : " + value);
    //   this.navCtrl.push(MyinfoPage, value);
    // });
  }
  //로그인 화면으로 이동(메뉴에서)
  // goToLogin(params) {
  goToLogin() {
    // if (!params) params = {};
    // this.navCtrl.push(LoginPage);

    let modal = this.modalCtrl.create(LoginPage, {}, { cssClass: 'modal-gradient' });
    modal.onDidDismiss(data => {
      if (data) {
        this.showAlert('<strong>' + data + '</strong>님 로그인 되었습니다.<br>사랑하며 축복합니다!', '');
      }
    });
    modal.present();
  }
  //회원가입 화면으로 이동(메뉴에서)
  goToSign(params) {
    if (!params) params = {};
    this.navCtrl.push(SignupPage);
  }
  //예배시간 설정 화면으로 이동(메뉴에서)
  goToSetting(params) {
    if (!params) params = {};
    this.navCtrl.push(SettingPage);

  }
  //로그아웃 화면으로 이동(메뉴에서)
  logout(params) {
    this.storage.set("user_serial", null);
    this.storage.set("grade", null);
    this.menuCtrl.enable(false, 'authenticated');
    this.menuCtrl.enable(true, 'unauthenticated');
  }
  //유저 관리 화면으로 이동(메뉴에서)
  goToUserManager(params) {
    if (!params) params = {};
    this.navCtrl.push(UsermanagerPage);
  }
  //주차장 현황 화면으로 이동(메뉴에서)
  goToParking() {
    this.navCtrl.push(ParkingPage);
  }
  //주차장 관리 화면으로 이동(메뉴에서)
  goToParkingManager() {
    this.navCtrl.push(ParkingManagerPage);
  }
  goToFamilysite() {
    this.navCtrl.push(FamilysitePage);
  }
  goToRegisteruser() {
    // this.navCtrl.push(RegisteruserPage);
    let modal = this.modalCtrl.create(RegisteruserPage, { serial: false }, { cssClass: 'modal-gradient' });
    modal.present();
  }
  goToWeekly() {
    this.navCtrl.push(WeeklyPage);
  }
  goToSignupCheck() {
    let modal = this.modalCtrl.create(SignupCheckPage, {}, { cssClass: 'modal-gradient' });
    modal.present();
  }
  goToGetUserInfo() {
    this.storage.get('flagSlideHide').then((flag) => {
      // this.navCtrl.push(YoramPage, { slide: flag });
      this.navCtrl.push(GetUserInfoPage, { slide: flag });
    });

  }
  showAlert(title, msg) {
    // console.log(title+","+msg);
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();

  }
  sendPush(){
    console.log("푸시보내기");
    this.storage.get('user_serial').then((localSerial) => {
      const browser = this.iab.create('http://13.125.35.123/api/SendPush?serial='+localSerial,"target='_blank'");
      browser.show();
    });
  }
}