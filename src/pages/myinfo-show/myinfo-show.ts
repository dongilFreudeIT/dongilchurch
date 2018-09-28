import { Component } from '@angular/core';
import { ActionSheetController, NavController, NavParams, ToastController } from 'ionic-angular';

import { DomSanitizer } from '@angular/platform-browser';
import { Clipboard } from '@ionic-native/clipboard';

@Component({
  selector: 'page-myinfo-show',
  templateUrl: 'myinfo-show.html',
})
export class MyinfoShowPage {
  user : any;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public sanitizer: DomSanitizer, public actionSheetCtrl: ActionSheetController,
    private clipboard: Clipboard, public toastController :ToastController) {
      //전달받은 data(유저 정보)를 user 객체로 대입
      this.user = this.navParams.data;
      var tempBirth = this.user.birthday;
      this.user.birthday = tempBirth.substring(0,4)+"년 " + tempBirth.substring(4,6) + "월 " + tempBirth.substring(6,8) +"일";

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyinfoShowPage');
    // window.open("tel:" + '01041485533');
    // window.open("this.sanitize('sms://' + user.phone)");
    // window.open("sms:"+this.user.phone, "_system");
  }

  GotoPreviousPage(){
    this.navCtrl.pop();
  }
  
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  phoneFunction(){
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Modify your album',
      buttons: [
        {
          text: '전화 걸기',
          // role: 'destructive',
          handler: () => {
            window.open("tel:" + this.user.phone);
          }
        },
        {
          text: '문자 메시지 보내기',
          handler: () => {
            window.open("sms:"+this.user.phone, "_system");
          }
        },
        {
          text: '전화번호 복사',
          handler: () => {
            this.clipboard.copy(this.user.phone);
            this.toastController.create({
              message : "\'"+this.user.phone+ "\'이 복사되었습니다.",
              duration : 2000
            }).present();
          }
        }
      ]
    });
 
    actionSheet.present();
  }
}
