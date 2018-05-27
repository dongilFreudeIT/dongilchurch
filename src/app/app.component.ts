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
import { UserdetailPage } from '../pages/userdetail/userdetail';
import { ParkingPage } from '../pages/parking/parking';
import { ParkingManagerPage } from '../pages/parkingmanager/parkingmanager';
import { MyinfoPage } from '../pages/myinfo/myinfo';

import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http';
import { FCM } from '@ionic-native/fcm'

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BackgroundMode } from '@ionic-native/background-mode';
import { ChurchtimePage } from '../pages/churchtime/churchtime';
import { MyinfoShowPage } from '../pages/myinfo-show/myinfo-show';
import { FindPasswordPage } from '../pages/findpassword/findpassword';
import { FamilysitePage } from '../pages/familysite/familysite';

declare var BackgroundTimer:any;
declare var androidVolume : any;


@Component({
  templateUrl: 'app.html'
})
//앱의 시작 class
export class MyApp {

  url: string = 'http://13.125.35.123/api';
  userSerial : any;
  @ViewChild(Nav) navCtrl: Nav;
  rootPage:any = HomePage;
  static toggleArray: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public http : HTTP, public menuCtrl: MenuController, 
    private storage: Storage, public fcm: FCM, public alertCtrl:AlertController, private iab: InAppBrowser, private backgroundMode: BackgroundMode,
    public modalCtrl: ModalController
  ) {
    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      splashScreen.hide();
      statusBar.styleDefault();
      statusBar.overlaysWebView(false);
      //1분마다 등록된 예배시간 체크하는 함수
      storage.get('toggle_array').then((value) => {
              //설정 안되어 있으면
          if(value == null || value.length == 0){
            MyApp.toggleArray = null;
          }else{//설정 되어 있으면 local array에 넣는다.
            MyApp.toggleArray = value;
          }
      });
      // this.setBackgroundTimer();
      //push 보내기 위한 설정
      this.setPushSetting(fcm);

      //로그인 된적 있는지 체크(storage에 user_serial 저장해놓았으면 로그인 된 상태)
      //처음 로그인부분, 확인 필요
      storage.get('user_serial').then((val2) => {
          //user serial 없으면 미 로그인
          if(val2 == null || val2 == ""){
            this.menuCtrl.enable(false, 'authenticated');
            this.menuCtrl.enable(false, 'master');
            this.menuCtrl.enable(true, 'unauthenticated');
          }else{  //로그인 접속 시간 갱신을 위해 서버 연결

              var param = { user_serial : val2 };
                this.http.post(this.url + '/user/login_refresh', param,{}).then(data =>{
                  if(data.status == 200){
                    // console.log(data.data);

                    var obj = JSON.parse(data.data);
                    //로그인 접속시간 갱신했으면 받아온 grade에 따라 왼쪽 메뉴 구성 변경
                    if(obj.code == "S01"){
                      var grade = obj.grade;
                      this.storage.set("grade", grade);
                      //grade가 없으면 부회원모드
                      if(grade == null || grade == ''){
                        console.log('not loggin');
                        this.menuCtrl.enable(true, 'unauthenticated');
                      }else if(grade == "관리자"){
                        // console.log('admin');
                        this.menuCtrl.enable(true, 'master');
                      }else if(grade == "주차장매니저"){
                        this.menuCtrl.enable(true, 'parking_manager');
                      }else{
                        this.menuCtrl.enable(true, 'authenticated');
                      }

                      //push_token도 refresh한다.
                      this.storage.get("push_token").then((value) => {
                        // console.log("start save token :" + value);
                        var param = { push_token : value, serial: val2 };
                        this.http.post(this.url + '/user/update_token', param,{}).then(data =>{
                          if(data.status == 200){
                            console.log(data.data);
                            // var obj = JSON.parse(data.data);
                          }
            
                        });
                      });
                    }else{
                      console.log("login not refreshed");
                    }
                  }
              });
          }
      });

    });
  }

 //앱이 꺼져도 1분마다 예배시간 체크하여 무음모드 설정하는 함수
setBackgroundTimer(){
  // this.backgroundMode.enable();
  var settings = {
      timerInterval: 60000, // event함수 실행시킬 주기 milliseconds (Default: 60000)
      startOnBoot: false, // enable this to start timer after the device was restarted (Default: false)
      stopOnTerminate: false // set to true to force stop timer in case the app is terminated (User closed the app and etc.) (Default: true)

      // hours: -1, // delay timer to start at certain time (Default: -1)
      // minutes: , // delay timer to start at certain time (Default: -1)
  }

  BackgroundTimer.onTimerEvent(function(){
    // console.log("time check");
    // if(MyApp == null){
    //   console.log("null!!!!!!!!!!!!!!!!!!!!!!!!!");
    //   return;
    // }
      if(MyApp.toggleArray == null || MyApp.toggleArray.length == 0){
        return;
      }else{
        var day = new Date().getDay();
        console.log(day);
        var nowTime = new Date().toLocaleTimeString('en-GB').slice(0,5);
        var isTime = false;
        if(MyApp.toggleArray[0] == true && nowTime == "08:00" && day == 0){//일요일 8시이면
            isTime = true;
        }
        if(MyApp.toggleArray[1] == true && nowTime == "10:00" && day == 0){
          isTime = true;
        }
        if(MyApp.toggleArray[2] == true && nowTime == "12:00" && day == 0 ){
          isTime = true;
        }
        if(MyApp.toggleArray[3] == true && nowTime == "14:00" && day == 0){
          isTime = true;
        }
        if(MyApp.toggleArray[4] == true && nowTime == "15:30" && day == 0){
          isTime = true;
        }
        if(MyApp.toggleArray[5] == true && nowTime == "19:30" && day == 3){
          isTime = true;
        }
        if(MyApp.toggleArray[6] == true && nowTime == "20:30" && day == 5){
          isTime = true;
        }
        if(isTime){
          //안드로이드
            androidVolume.set(0, true, function(msg){
              // //console.log(msg); 
            }, function(msg){
              //console.log(msg); 
            });
        }
      }
  }); // subscribe on timer event
  BackgroundTimer.start(function(){}, function(e){
    console.log(e);
  }, settings);
}

//fcm 푸쉬 보내기 위한 세팅
setPushSetting(fcm){
    // 푸쉬 받을 수 있는 토큰 얻으면 저장소에 저장하고 로그인 하거나 회원가입 시 추가한다.
    fcm.getToken().then(token=>{
      console.log("token : " + token);
      this.storage.set("push_token", token);
    });

    //fcm(push) token이 생성 또는 refresh되면 저장소에 저장하고 로그인 하거나 회원가입 시 추가한다.
    fcm.onTokenRefresh().subscribe(token=>{
      console.log("refreshed : " + token);
      this.storage.set("push_token", token);
    });

    //push 메세지 도착하면
    fcm.onNotification().subscribe(data=>{
      // this.badge.increase(1);
      if(data.wasTapped){ //백그라운드 모드이면
        console.log("Received in background:" + JSON.stringify(data));
        // this.navCtrl.push(AlarmPage);
      } else {
        console.log("Received in foreground:" + JSON.stringify(data));
        let alert = this.alertCtrl.create({
          title: "안내",
          subTitle: "푸시 메시지가 도착했어요. 알림 리스트에서 확인하세요.",
          buttons: ['OK']
        });
        alert.present();
      };
    })

}
//홈페이지 이동(메뉴에서 선택 가능)
  goToHome(params){
    const browser = this.iab.create('http://www.dongil.org/');
    browser.show();
    // if (!params) params = {};
    // this.navCtrl.setRoot(HomePage);
  }
  //푸쉬 리스트 이동(메뉴에서 선택 가능)
  goToAlarm(params){
    if (!params) params = {};
    this.navCtrl.push(AlarmPage);
  }


  //내 정보 수정으로 이동(메뉴에서 선택 가능)
  goToMyinfo(params){
    //저장된 user_serial이 있으면(로그인 된적 있으면)
    this.storage.get('user_serial').then((value) => {

      var param = { serial : value };

      this.http.post(this.url + '/user/get_user', param,{}).then(data =>{
        if(data.status == 200){
          //console.log(data.data);
          var obj = JSON.parse(data.data);
          //로그인 성공이면
          if(obj.code == "S01"){
              var user = obj.value;
              this.navCtrl.push(MyinfoPage, user);
          }else{

          }
        }
      });//http end
    });//storage end
  }
  //로그인 화면으로 이동(메뉴에서)
  goToLogin(params){
    if (!params) params = {};
    // this.navCtrl.push(LoginPage);
    let modal = this.modalCtrl.create(LoginPage, {}, {cssClass: 'modal-gradient'});
    modal.present();
  }
  //회원가입 화면으로 이동(메뉴에서)
  goToSign(params){
    if (!params) params = {};
    this.navCtrl.push(SignupPage);
  }
  //예배시간 설정 화면으로 이동(메뉴에서)
  goToSetting(params){ 
    if (!params) params = {};
    this.navCtrl.push(SettingPage);
    
  }
  //로그아웃 화면으로 이동(메뉴에서)
  logout(params){
    this.storage.set("user_serial", null);
    this.storage.set("grade", null);
    this.menuCtrl.enable(false, 'authenticated');
    this.menuCtrl.enable(true, 'unauthenticated');
  }
  //유저 관리 화면으로 이동(메뉴에서)
  goToUserManager(params){
    if (!params) params = {};
    this.navCtrl.push(UsermanagerPage);
  }
  //주차장 현황 화면으로 이동(메뉴에서)
  goToParking(){
    this.navCtrl.push(ParkingPage);
  }
  //주차장 관리 화면으로 이동(메뉴에서)
  goToParkingManager(){
    this.navCtrl.push(ParkingManagerPage);
  }
  goToFamilysite(){
    this.navCtrl.push(FamilysitePage);
  }

}
