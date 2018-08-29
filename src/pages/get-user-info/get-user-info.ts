import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';

import { MyinfoShowPage } from '../myinfo-show/myinfo-show';


@Component({
  selector: 'page-get-user-info',
  templateUrl: 'get-user-info.html',
})
export class GetUserInfoPage {
  url: string = 'http://13.125.35.123/api';
  userArray: any;
  searchArray=[];
  usersInfo=[];
  name:string;
  mySerial:any;
  myName:string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HTTP, 
    public storage: Storage,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController
  ) {
    storage.get('get_user').then((obj) => {
      this.myName = obj.name;
      this.mySerial = obj.serial;
      var param = {
        serial:this.mySerial
      };
      this.http.post(this.url + '/push/getReqUsersInfo', param, {}).then(data => {
        if (data.status == 200) {
          var obj = JSON.parse(data.data);
          console.log(data.data);
          if (obj.code == "S01") {
            this.usersInfo = obj.value;
          }
        }else{
          this.showAlert("알림","서버 접속에 실패하였습니다.");
          this.viewCtrl.dismiss();
        }
  
      }).catch(()=>{
        this.showAlert("알림","서버 접속에 실패하였습니다.");
        this.viewCtrl.dismiss();
      });
      //요청 체크
    this.http.post(this.url + '/push/checkRequest', { user_serial: this.mySerial }, {}).then(data => {
      if (data.status == 200) {
        var obj = JSON.parse(data.data);
        console.log(obj);
        for (const key in obj) {
          // console.log("for key : " + key);
          if (obj.hasOwnProperty(key)) {
            const element = obj[key];
            console.log(element);
            if (element.allow == null) {
              let alert = this.alertCtrl.create({
                title: '알림',
                subTitle: element.sname + '님에게 정보요청이 왔습니다.',
                buttons: [
                  {
                    text: '거절',
                    handler: () => {
                      this.http.post(this.url + '/push/setRequest', { serial: element.serial,name:this.myName, sid: element.sid, allow: 0 }, {});
                    }
                  },
                  {
                    text: '승인',
                    handler: () => {
                      this.http.post(this.url + '/push/setRequest', { serial: element.serial, name:this.myName, sid: element.sid, allow: 1 }, {});
                    }
                  }
                ]

              });
              alert.present();
            }
          }
        }

      } else {
      }
    });
    });
    
    

    //모든 유저의 serial, name 받기
    this.http.post(this.url + '/user/get_user_by_type', {flag: true}, {}).then(data => {
      if (data.status == 200) {
        var obj = JSON.parse(data.data);
        // console.log(data.data);
        if (obj.code == "S01") {
          this.userArray = obj.value;
        }
      }else{
        this.showAlert("알림","서버 접속에 실패하였습니다.");
        this.viewCtrl.dismiss();
      }

    }).catch(()=>{
      this.showAlert("알림","서버 접속에 실패하였습니다.");
      this.viewCtrl.dismiss();
    });


    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GetUserInfoPage');
  }
  getUsersInfo(){
    
  }
  sendRequest(user) {
    console.log(user.name, user.serial);
    let alert = this.alertCtrl.create({
      title: '알림',
      subTitle: user.name + '님에게 정보요청을 합니다.',
      buttons: [
        {
          text: '취소',
          handler: () => {
          }
        },
        {
          text: '요청',
          handler: () => {
            this.http.post(this.url + '/push/sendRequest/', {serial:this.mySerial, rid:user.serial, sname: this.myName}, {}).then(data => {
              if (data.status == 200) {
                var obj = JSON.parse(data.data);
                console.log(data.data);
                if (obj.code == "S01") {
                  this.userArray = obj.value;
                }else if(obj.code == "E00"){
                  this.showAlert("알림", obj.message);

                }
              }
            }).catch(error=>{
              console.error(error.error);
              this.showAlert("알림","정보 요청에 실패하였습니다.\n푸시 토큰 없음. 상대방의 로그인 기록이 없습니다.");
              // this.showAlert("알림",error.error);
            });
          }
        }
      ]

    });
    alert.present();
    
  }
  goToInfoShow(user){
    this.navCtrl.push(MyinfoShowPage, user);
  }
  showAlert(title, msg){
    console.log(title+","+msg);
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: msg,
        buttons: ['OK'] 
      });
    alert.present();
  
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    // this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;
    console.log("val : " + val );
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.userArray = this.userArray.filter((item) => {
        console.log(item);
      })
    }
  }
  eventHandler(keyCode) {
    if(keyCode == 13)
      this.searchName();
  }
  searchName(){

    this.searchArray=[];
    //모든 유저의 serial, name 받기
    this.http.post(this.url + '/user/get_user_by_type', {flag: true}, {}).then(data => {
      if (data.status == 200) {
        var obj = JSON.parse(data.data);
        // console.log(data.data);
        if (obj.code == "S01") {
          this.userArray = obj.value;
          this.userArray.forEach(element => {
            if(element['name'] == this.name){
              console.log(element['serial']);
      
              this.searchArray.push(element);
            }
           });
           if(this.searchArray.length == 0){
            this.searchArray=[{serial:-1, name:'검색 결과가 없습니다.'}];
           }
        }
      }else{
        this.showAlert("알림","서버 접속에 실패하였습니다.");
        this.viewCtrl.dismiss();
      }

    }).catch(()=>{
      this.showAlert("알림","서버 접속에 실패하였습니다.");
      this.viewCtrl.dismiss();
    });
    
    // if(this.name == this.userArray[2]['name'])
    //   console.log("name " + this.userArray[2]['name']);
  }
}
