import { Component, ViewChild, ElementRef} from '@angular/core';
import { NavController, NavParams, AlertController, ViewController, Slides } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { Platform } from 'ionic-angular';

import { MyinfoShowPage } from '../myinfo-show/myinfo-show';


@Component({
  selector: 'page-get-user-info',
  templateUrl: 'get-user-info.html',
})

export class GetUserInfoPage {
  @ViewChild(Slides) slides2: Slides;
  @ViewChild('canvas') canvasEl : ElementRef;
  private _CANVAS : any;
  private _CONTEXT : any;
  _width = '1000px';
  _height = '1000px';
  color1 = "bisque";

  url: string = 'http://13.125.35.123/api';
  userArray: any;
  searchArray = [];
  usersInfo = [];
  name: string;
  mySerial: any;
  myName: string;
  private onResumeSubscription: Subscription;
  flagSlide: boolean = true;
  slides = [
    {
      title: "사용방법 안내",
      description: "동일교회 앱에 가입되어 있는 회원의 정보를 열람할 수 있습니다.",
      image: "assets/imgs/home_back.jpg",
    },
    {
      title: "성도 찾기",
      description: "찾을 성도의 이름을 검색합니다. 연락처 요청 버튼을 눌러 요청하게 되고 대상 성도는 알림 메시지를 받게 됩니다.",
      image: "assets/imgs/requestInfo1.png",
    },
    {
      title: "승인 대기",
      description: "상대방이 승인을 하면 연락처를 볼 수 있습니다.",
      image: "assets/imgs/requestInfo2.png",
    }, {
      title: "정보 열람",
      description: "전화와 문자를 보낼 수 있습니다.<br> 리스트를 누르면 가입정보를 볼 수 있습니다.",
      image: "assets/imgs/requestInfo3.png",
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HTTP,
    public storage: Storage,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    platform: Platform
  ) {
    this.flagSlide = navParams.get('slide');
    this.onResumeSubscription = platform.resume.subscribe(() => {
      console.log("onResumeSubscription")
    });
    this.getUsersInfo();

    //모든 유저의 serial, name 받기
    this.http.post(this.url + '/user/get_user_by_type', { flag: true }, {}).then(data => {
      if (data.status == 200) {
        var obj = JSON.parse(data.data);
        // console.log(data.data);
        if (obj.code == "S01") {
          this.userArray = obj.value;
        }
      } else {
        this.showAlert("알림", "서버 접속에 실패하였습니다.");
        this.viewCtrl.dismiss();
      }

    }).catch(() => {
      this.showAlert("알림", "서버 접속에 실패하였습니다.");
      this.viewCtrl.dismiss();
    });

    // window.location.reload();
    platform.ready().then(() => {
      this._width = platform.width().toString();
      this._height = (platform.height()*2/3).toString();
      // this._height = platform.width().toString();
      console.log(this._height,this._width);
    });
  }

  ngOnDestroy() {
    // always unsubscribe your subscriptions to prevent leaks
    this.onResumeSubscription.unsubscribe();
  }
  phoneCall(user) {
    window.open("tel:" + user.phone);
  }
  phoneSms(user) {
    window.open("sms:" + user.phone, "_system");

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad GetUserInfoPage');
    
    if(this.flagSlide==false){
      this.drawHelp();
    }
  
  }
  drawHelp(){
    var rect = document.getElementById('search').getBoundingClientRect();
    console.log(rect.left, rect.right, rect.top, rect.bottom);
    this._CANVAS = this.canvasEl.nativeElement;
    this._CANVAS.width = this._width;
    this._CANVAS.height = this._height;
    if(this._CANVAS.getContext)
    {
      this._CONTEXT = this._CANVAS.getContext('2d');
      this._CONTEXT.fillStyle = "rgba(255, 0, 0)";
      // this._CONTEXT.fillRect(0, 0, this._CANVAS.width, this._CANVAS.height);
      // this._CONTEXT.clearRect(rect.left, rect.top, rect.right -rect.left, rect.bottom-rect.top);
      // this._CONTEXT.fillStyle = "rgba(255, 255, 255, 0)";
      this.roundRect(this._CONTEXT, (parseInt(this._width) -(rect.right-rect.left))/2, rect.top, rect.right -rect.left, rect.bottom-rect.top, 20,false, true);
    }
  }
  roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == 'undefined') {
      stroke = true;
    }
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    let padding=1;
    x -= padding;
    y -= padding;
    width += padding*2;
    height += padding*2;

    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  
  }
  getUsersInfo() {
    this.storage.get('get_user').then((obj) => {
      this.myName = obj.name;
      this.mySerial = obj.serial;
      var param = {
        serial: this.mySerial
      };
      console.log("myName : " + this.myName);
      this.http.post(this.url + '/push/getReqUsersInfo', param, {}).then(data => {
        if (data.status == 200) {
          var obj = JSON.parse(data.data);
          console.log(data.data);
          if (obj.code == "S01") {
            this.usersInfo = obj.value;
          }
        } else {
          this.showAlert("알림", "서버 접속에 실패하였습니다.");
          this.viewCtrl.dismiss();
        }

      }).catch(() => {
        this.showAlert("알림", "서버 접속에 실패하였습니다.");
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
          }

        } else {
        }
      });
    });
  }
  sendRequest(user) {
    console.log(user.name, user.serial);
    let alert = this.alertCtrl.create({
      title: '알림',
      subTitle: user.name + '님에게 연락처 요청을 보냅니다.<br> 상대방이 승인해야 정보를 열람할 수 있습니다.',
      buttons: [
        {
          text: '취소',
          handler: () => {
          }
        },
        {
          text: '요청',
          handler: () => {
            this.http.post(this.url + '/push/sendRequest/', { serial: this.mySerial, rid: user.serial, sname: this.myName }, {}).then(data => {
              if (data.status == 200) {
                var obj = JSON.parse(data.data);
                console.log(data.data);
                if (obj.code == "S01") {
                  this.userArray = obj.value;
                } else if (obj.code == "E00") {
                  this.showAlert("알림", obj.message);

                }
              }
            }).catch(error => {
              console.error(error.error);
              this.showAlert("알림", "연락처 요청에 실패하였습니다.<br>상대방이 앱을 재시작 하거나 업데이트를 해야합니다.");
              // this.showAlert("알림",error.error);
            });
          }
        }
      ]

    });
    alert.present();

  }
  goToInfoShow(user) {
    this.navCtrl.push(MyinfoShowPage, user);
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
  getItems(ev: any) {
    // Reset items back to all of the items
    // this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;
    console.log("val : " + val);
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.userArray = this.userArray.filter((item) => {
        console.log(item);
      })
    }
  }
  eventHandler(keyCode) {
    if (keyCode == 13)
      this.searchName();
  }
  searchName() {
    this.searchArray = [];
    //모든 유저의 serial, name 받기
    this.http.post(this.url + '/user/get_user_by_type', { flag: true }, {}).then(data => {
      if (data.status == 200) {
        var obj = JSON.parse(data.data);
        // console.log(data.data);
        if (obj.code == "S01") {
          this.userArray = obj.value;
          this.userArray.forEach(element => {
            if (element['name'] == this.name) {
              console.log(element['serial']);

              this.searchArray.push(element);
            }
          });
          if (this.searchArray.length == 0) {
            this.searchArray = [{ serial: -1, name: '검색 결과가 없습니다.' }];
          }
        }
      } else {
        this.showAlert("알림", "서버 접속에 실패하였습니다.");
        this.viewCtrl.dismiss();
      }

    }).catch(() => {
      this.showAlert("알림", "서버 접속에 실패하였습니다.");
      this.viewCtrl.dismiss();
    });

    // if(this.name == this.userArray[2]['name'])
    //   console.log("name " + this.userArray[2]['name']);
  }
  btnStart() {
    this.flagSlide = true;
    this.storage.set('flagSlide', true);
  }
  btnSlideNext() {
    this.slides2.slideNext();
  }
  btnSlideRemove() {
    this.flagSlide = true;
    this.storage.set('flagSlide', true);
    //내부 저장
  }
  showSlide() {
    this.flagSlide = false;
    // if (this.flagSlide == false) {
    //   this.ionViewDidLoad()
    //   var rect = document.getElementById('search').getBoundingClientRect();
    //   console.log(rect.left, rect.right, rect.top, rect.bottom);
    //   this.drawHelp();
    // }
  }

  ngAfterViewInit() {
    if (this.flagSlide == false) {
      this.ionViewDidLoad()
      var rect = document.getElementById('search').getBoundingClientRect();
      console.log(rect.left, rect.right, rect.top, rect.bottom);
      this.drawHelp();
    }
  }
}
