import { Component } from '@angular/core';

import { NavController,ViewController, ModalController, NavParams, AlertController  } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';
import { MenuController } from 'ionic-angular';

@Component({
  selector: 'page-passwordset',
  templateUrl: 'passwordset.html'
})
export class PasswordsetPage {

  url: string = 'http://13.125.35.123/api';
  user_id : string; //사용자가 입력한 id
  password : string; //사용자 비밀번호
  password_again : string;
  
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public http : HTTP, public menuCtrl: MenuController, public viewCtrl: ViewController, public modalCtrl: ModalController ) {
     this.user_id = this.navParams.data;
  }

  changepw() {
    if (this.password == null || this.password == '') {
      this.showAlert("안내", "비밀번호를 입력해 주세요.");
      return;
    }
    // if(this.password != null && this.password != '' && this.chkPwd(this.password)== false){
    //   this.showAlert("안내", "비밀번호는 영문+숫자 6자 이상입니다.");
    //   return;
    // }

    if(this.password != this.password_again){
      this.showAlert("안내", "새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    console.log(this.user_id +" " + this.password);
    var accountInfo = { user_id : this.user_id, password: this.password };
    // //입력 받은 id, pw로 로그인 시도
    this.http.post(this.url + '/user/change_pw', accountInfo,{}).then(data =>{
      if(data.status == 200){
        console.log(data.data);
        var obj = JSON.parse(data.data);
        //로그인 성공이면
        if(obj.code == "S01"){
          this.showAlert("안내","비밀번호 변경 성공");
          this.navCtrl.pop();
        }else{
          var errorMsg = obj.message;
          this.showAlert("로그인 실패", errorMsg);
        }
      }
    })
    .catch(error =>{
      console.log(error.error);
    });
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

  cancel(){
    this.navCtrl.pop();
  }

  chkPwd(str){
    var reg_pwd = /^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
    if(!reg_pwd.test(str)){
     return false;
    }
    return true;
}
  
}
