import { Component } from '@angular/core';
import { NavController, ViewController, ModalController, AlertController } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';
import { RegisteruserPage } from '../registeruser/registeruser';
import { SignupPage } from '../signup/signup';


@Component({
  selector: 'page-signup-check',
  templateUrl: 'signup-check.html',
})
export class SignupCheckPage {
  url: string = 'http://13.125.35.123/api';
  name:string;
  phone:string;
  year:string;
  month:string;
  day:string;
  birthday:string;
  modal:any;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public modalCtrl: ModalController, 
    public alertCtrl: AlertController, public http : HTTP) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupCheckPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  checkUser(){
    let _phone;
    if(this.phone && this.phone.length ==11){
      _phone= this.phone.substring(0,3)+'-'+this.phone.substring(3,7)+'-'+this.phone.substring(7,11);
    
    }
    if(this.month && this.month.length == 1){
      this.month = '0'+this.month;
    }
    if(this.day && this.day.length == 1){
      this.day = '0'+this.day;
    }
    this.birthday = this.year+this.month+this.day;
    let info = {name:this.name, phone:_phone, birthday:this.birthday}
    this.http.post(this.url + '/user/checkUser', info,{}).then(data =>{
      if(data.status == 200){
        console.log(data.data);
        var obj = JSON.parse(data.data);
        
        if(obj.code == "S01"){
          this.showAlert("안내","정보가 확인되었습니다. 나머지 정보를 입력하시면 가입이 완료됩니다.");
          this.modal = this.modalCtrl.create(RegisteruserPage,obj.value, {cssClass: 'modal-gradient'});
        }else{
          this.showAlert("안내","일치하는 정보가 없습니다. 회원가입 화면으로 이동합니다.")
          this.modal = this.modalCtrl.create(SignupPage, {}, {cssClass: 'modal-gradient'});
        }
      }else {
        this.showAlert("안내","일치하는 정보가 없습니다. 회원가입 화면으로 이동합니다.")
        this.modal = this.modalCtrl.create(SignupPage, {}, {cssClass: 'modal-gradient'});
      }

    });
  }
  showAlert(title, msg) {
    // console.log(title+","+msg);
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            console.log('alert clicked');
            this.viewCtrl.dismiss();
            this.modal.present();
          }
        }]
    });
    alert.present();

  }
}