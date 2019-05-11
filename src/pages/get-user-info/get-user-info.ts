// import { Component, ViewChild, ElementRef, NgZone} from '@angular/core';
import { Component, ViewChild, NgZone} from '@angular/core';
import { NavController, NavParams, AlertController, ViewController, Slides, ModalController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { Platform } from 'ionic-angular';
// import { Device } from '@ionic-native/device';

import { MyinfoShowPage } from '../myinfo-show/myinfo-show';
import { GetUserInfoModalPage } from '../get-user-info-modal/get-user-info-modal';

import { CheckNetworkProvider } from '../../providers/check-network/check-network';
import { Network } from '@ionic-native/network'

@Component({
  selector: 'page-get-user-info',
  templateUrl: 'get-user-info.html',
})

export class GetUserInfoPage {
  @ViewChild(Slides) slides2: Slides;
  // @ViewChild('canvas') canvasEl : ElementRef;
  // _width = '1000px';
  // _height = '1000px';
  // color1 = "bisque";
  // private rect :any;
  // rectId = ['','slide1','slide2','slide3','slide4','slide5','slide6'];
  // rectAdj = false;
  // rectAdjRateAnroid = 56;
  // rectAdjRateIos = 40;

  url: string = 'http://13.125.35.123/api';
  userArray: any;
  searchArray = [];
  searchResult =1;
  usersInfo = [];
  name: string;
  mySerial: any;
  myName: string;
  private onResumeSubscription: Subscription;
  flagSlideHide: boolean = true;
  flagSendAllHide:boolean = true;
  eventId : any;

  subscribeNet1 : any;
  subscribeNet2 : any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HTTP,
    public storage: Storage,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    platform: Platform,
    private _zone: NgZone,
    // private device: Device,
    private modal: ModalController,
    private network: Network,
    private chechNetwork : CheckNetworkProvider
  ) {
    this.flagSlideHide = navParams.get('slide');
    this.onResumeSubscription = platform.resume.subscribe(() => {
      console.log("onResumeSubscription")
            this.getUsersInfo();
    });
    this.subscribeNet1 = this.network.onDisconnect().subscribe((data)=>{
      console.log("network disconnected");
      this.chechNetwork.display(data.type);
    });
    this.subscribeNet2 = this.network.onConnect().subscribe((data)=> {
      console.log("network connected");
      this.chechNetwork.display(data.type);

    });
    //모든 유저의 serial, name 받기
    this.http.post(this.url + '/user/get_user_by_type', { flag: true }, {}).then(data => {
      if (data.status == 200) {
        var obj = JSON.parse(data.data);
        console.log(data.data);
        if (obj.code == "S01") {
          this.userArray = obj.value;
        }
      } else {
        // this.showAlert("알림", "서버 접속에 실패하였습니다.");
        this.viewCtrl.dismiss();
      }

    }).catch(() => {
      // this.showAlert("알림", "서버 접속에 실패하였습니다.");
      this.viewCtrl.dismiss();
    });

    // platform.ready().then(() => {
    //   this._width = platform.width().toString();
    //   this._height = (platform.height()/2).toString();
    //   // this._height = platform.width().toString();
    //   console.log(this._height,this._width);
    // });

    this.eventId = setInterval(()=>{
        this.getUsersInfo();
      }, 5000 );
  }

  // slideChanged(event?: any) {
  //   console.log("slideChanged");
  //   console.log(this.slides2.getActiveIndex());
  //   if(this.slides2.getActiveIndex()<this.slides2.length()-1 && this.slides2.getActiveIndex()!= 0)
  //     this.drawHelp(this.rectId[this.slides2.getActiveIndex()]);
  // }
  // slideWillChange(event?: any) {
  //   console.log("ionSlideWillChange");
  //   if(this.rectAdj==false){
  //     this.rectAdj=true;
  //   }else{
  //     this._CONTEXT.clearRect(0, 0, this._CANVAS.width, this._CANVAS.height);
  //   }
  // }
  ngOnDestroy() {
    // always unsubscribe your subscriptions to prevent leaks
    this.onResumeSubscription.unsubscribe();
    clearInterval(this.eventId);
    this.subscribeNet1.unsubscribe();
    this.subscribeNet2.unsubscribe();
  }

  phoneCall(user) {
    window.open("tel:" + user.phone);
  }
  phoneSms(user) {
    window.open("sms:" + user.phone, "_system");

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad GetUserInfoPage');
    this.getUsersInfo();
    // this.slides2.lockSwipes(true);
    // if(this.flagSlide==false){
    //   this.drawHelp(this.rectId[0]);
    // }
  }

  // drawHelp(id){
  //   this.rect = document.getElementById(id).getBoundingClientRect();
  //   console.log(this.rect.left, this.rect.right, this.rect.top, this.rect.bottom);
  //   this._CANVAS = this.canvasEl.nativeElement;
  //   this._CANVAS.width = this._width;
  //   this._CANVAS.height = this._height;
  //   if(this._CANVAS.getContext)
  //   {
  //     this._CONTEXT = this._CANVAS.getContext('2d');
  //     // this._CONTEXT.fillStyle = "#C00";
  //     this._CONTEXT.strokeStyle = '#C00';
  //     // this._CONTEXT.fillthis.rect(0, 0, this._CANVAS.height, this._CANVAS.width);
  //     // this._CONTEXT.clearthis.rect(this.rect.left, this.rect.top, this.rect.right -this.rect.left, this.rect.bottom-this.rect.top);
  //     // this._CONTEXT.fillStyle = "rgba(255, 255, 255, 0)";
  //     this.roundrect(this._CONTEXT, (parseInt(this._width) -(this.rect.right-this.rect.left))/2, this.rect.top, this.rect.right -this.rect.left, this.rect.bottom-this.rect.top, 20,false, true);
  //   }
  // }
  // roundrect(ctx, x, y, width, height, radius, fill, stroke) {
  //   x+=5; width-=10;
  //   {
  //     console.log(this.device.platform);
  //     if(this.device.platform == "Android"){
  //       y-=this.rectAdjRateAnroid;
  //     }else if(this.device.platform == "iOS"){
  //       y-=this.rectAdjRateIos;
  //     }
  //   }

  //   if (typeof stroke == 'undefined') {
  //     stroke = true;
  //   }
  //   if (typeof radius === 'undefined') {
  //     radius = 5;
  //   }
  //   if (typeof radius === 'number') {
  //     radius = {tl: radius, tr: radius, br: radius, bl: radius};
  //   } else {
  //     var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
  //     for (var side in defaultRadius) {
  //       radius[side] = radius[side] || defaultRadius[side];
  //     }
  //   }
  //   let padding=1;
  //   x -= padding;
  //   y -= padding;
  //   width += padding*2;
  //   height += padding*2;

  //   // ctx.fillStyle = "#C00";
  //   // ctx.strokeStyle = '#09f';
  //   ctx.beginPath();
  //   ctx.moveTo(x + radius.tl, y);
  //   ctx.lineTo(x + width - radius.tr, y);
  //   ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  //   ctx.lineTo(x + width, y + height - radius.br);
  //   ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  //   ctx.lineTo(x + radius.bl, y + height);
  //   ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  //   ctx.lineTo(x, y + radius.tl);
  //   ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  //   ctx.closePath();
  //   if (fill) {
  //     ctx.fill();
  //   }
  //   if (stroke) {
  //     ctx.stroke();
  //   }
  
  // }
  getUsersInfo() {
    this.storage.get('get_user').then((obj) => {
      this.myName = obj.name;
      this.mySerial = obj.serial;
      var param = {
        serial: this.mySerial
      };
      console.log("getUsersInfo myName : " + this.myName);
      this.http.post(this.url + '/push/getReqUsersInfo', param, {}).then(data => {
        if (data.status == 200) {
          var obj = JSON.parse(data.data);
          console.log("getUsersInfo "+data.data);
          if (obj.code == "S01") {
            this._zone.run(() => {
              this.usersInfo = obj.value;
            });
          }
        } else {
          // this.showAlert("알림", "서버 접속에 실패하였습니다.");
          this.viewCtrl.dismiss();
        }

      }).catch(() => {
        // this.showAlert("알림", "서버 접속에 실패하였습니다.");
        this.viewCtrl.dismiss();
      });
      //요청 체크
      // this.http.post(this.url + '/push/checkRequest', { user_serial: this.mySerial }, {}).then(data => {
      //   if (data.status == 200) {
      //     var obj = JSON.parse(data.data);
      //     console.log(obj);
      //     for (const key in obj) {
      //       // console.log("for key : " + key);
      //       if (obj.hasOwnProperty(key)) {
      //         const element = obj[key];
      //         console.log(element);
      //         if (element.allow == null) {
      //           let alert = this.alertCtrl.create({
      //             title: '개인정보 열람요청',
      //             subTitle: '[' + element.sname + ']님께서 개인정보 열람을 요청하셨습니다. <br>아래 [승인]을 누르시면 연락처를 보냅니다.',
      //             buttons: [
      //               {
      //                 text: '거절',
      //                 handler: () => {
      //                   this.http.post(this.url + '/push/setRequest', { serial: element.serial, name: this.myName, sid: element.sid, allow: 0 }, {});
      //                 }
      //               },
      //               {
      //                 text: '승인',
      //                 handler: () => {
      //                   this.http.post(this.url + '/push/setRequest', { serial: element.serial, name: this.myName, sid: element.sid, allow: 1 }, {});
      //                 }
      //               }
      //             ]

      //           });
      //           alert.present();
      //         }
      //       }
      //     }

      //   } else {
      //   }
      // });
    });
  }
  sendRequest(user) {
    console.log(user.name, user.serial);
    let alert = this.alertCtrl.create({
      title: '알림',
      subTitle: '['+user.name + ']님에게 연락처 요청을 보냅니다.<br> 상대방이 승인해야 정보를 열람할 수 있습니다.',
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
                if (obj.code.includes("S")) {
                  this.showAlert("알림", obj.message);
                  this.userArray = obj.value;
                } else if (obj.code.includes("E")) {
                  this.showAlert("알림", obj.message);

                }
              }
            })
            // .catch(error => {
            //   console.error(error.error);
            //   this.showAlert("알림", "in app <br>연락처 요청에 실패하였습니다.<br>상대방이 앱을 재시작 하거나 업데이트를 해야합니다.");
            //   // this.showAlert("알림",error.error);
            // });
          }
        }
      ]

    });
    alert.present();

  }

  sendRequestAll(){
    let alert = this.alertCtrl.create({
      title: '알림',
      subTitle: '아래의 모든 성도에게 연락처 요청을 보냅니다.<br> 상대방이 승인해야 정보를 열람할 수 있습니다.',
      buttons: [
        {
          text: '취소',
          handler: () => {
          }
        },
        {
          text: '요청',
          handler: () => {
            this.http.post(this.url + '/push/sendRequestAll/',{serial: this.mySerial, sname: this.myName, jsonString :JSON.stringify(this.searchArray)}, {}).then(data => {
              if (data.status == 200) {
                var obj = JSON.parse(data.data);
                console.log(data.data);
                if (obj.code.includes("S")) {
                  this.showAlert("알림", obj.message);
                  this.userArray = obj.value;
                } else if (obj.code.includes("E")) {
                  this.showAlert("알림", obj.message);

                }
              }
            })
            // .catch(error => {
            //   console.error(error.error);
            //   this.showAlert("알림", "in app <br>연락처 요청에 실패하였습니다.<br>상대방이 앱을 재시작 하거나 업데이트를 해야합니다.");
            //   // this.showAlert("알림",error.error);
            // });
          }
        }
      ]

    });
    alert.present();
  }
  goToInfoShow(user) {
    this.navCtrl.push(MyinfoShowPage, user);
  }

  showSortModal(){
    this.flagSendAllHide = true;

    this.searchArray = [];
    const myModal = this.modal.create(GetUserInfoModalPage, null, { cssClass: 'inset-modal' });
    myModal.present();
    myModal.onDidDismiss((data) => {
      console.log(JSON.stringify(data));
      if(!data){return;}
      this.searchArray = this.userArray.filter((item)=>{
        if(data.place =="" && data.subgroup ==""){
          return false;
        }
        if( ((data.place =="")?true: item.place == data.place)
        &&((data.subgroup =="")?true: item.subgroup == data.subgroup) ){
          return true;
        }else{
          return false;
        }
      });
      // data.place
      // data.subgroup
      if(this.searchArray.length > 1){
        this.flagSendAllHide = false;
      }
      console.log(JSON.stringify(this.searchArray));
    });
  }

  deleteUser(user){
    console.log("DELETE : " + user.serial);
    this.http.post(this.url + '/push/hideUser/', { serial: user.serial }, {}).then(data => {
      if (data.status == 200) {
        var obj = JSON.parse(data.data);
        console.log(data.data);
        if (obj.code.includes("S")) {
          this.usersInfo = this.usersInfo.filter(item => item !== user);
          // this.getUsersInfo();
        } else if (obj.code.includes("E")) {
          
        }
      }
    });
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
    this.flagSendAllHide = true;

    this.searchResult=1;
    this.searchArray = [];
    //모든 유저의 serial, name 받기
    this.http.post(this.url + '/user/get_user_by_type', { flag: true }, {}).then(data => {
      if (data.status == 200) {
        var obj = JSON.parse(data.data);
        // console.log(data.data);
        if (obj.code == "S01") {
          this.userArray = obj.value;
          this.userArray.forEach(element => {
            if (element['name'] == this.name && this.name !='오현기') {
              console.log(element['serial']);

              this.searchArray.push(element);
            }
          });
          if (this.searchArray.length == 0) {
            this.searchResult=0;
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
    this.flagSlideHide = true;
    this.storage.set('flagSlideHide', true);
  }
  btnSlideNext() {
    // this.slides2.lockSwipes(false);
    this.slides2.slideNext();
    // this.slides2.lockSwipes(true);
  }
  btnSlideRemove() {
    this.flagSlideHide = true;
    this.storage.set('flagSlideHide', true);
    //내부 저장
  }
  showSlide() {
    this.flagSlideHide = false;

    // this.slides2.lockSwipes(true);
    // this.drawHelp(this.rectId[0]);

    // if (this.flagSlide == false) {
    //   this.ionViewDidLoad()
    //   var this.rect = document.getElementById('search').getBoundingClientthis.rect();
    //   console.log(this.rect.left, this.rect.right, this.rect.top, this.rect.bottom);
    //   this.drawHelp();
    // }
  }

  // ngAfterViewInit() {
  //   if (this.flagSlide == false) {
  //     this.ionViewDidLoad()
  //     var this.rect = document.getElementById('search').getBoundingClientthis.rect();
  //     console.log(this.rect.left, this.rect.right, this.rect.top, this.rect.bottom);
  //     this.drawHelp('search');
  //   }
  // }
}
