import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { LoginPage } from '../login/login';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'page-userdetail',
  templateUrl: 'userdetail.html'
})
//유저 상세 화면
export class UserdetailPage {

  url: string = 'http://13.125.35.123/api';
  user: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,  public navParams: NavParams, public http : HTTP) {
    this.user = this.navParams.data;
    console.log("received = " + this.user.name);
  }

  //유저 정보 수정
  changeUser(){
    var param = { 
      serial : this.user.serial, 
      name : this.user.name,
      birthday : this.user.birthday,
      phone : this.user.phone,
      address: this.user.address,
      grade: this.user.grade,
      place: this.user.place,
      subgroup: this.user.subgroup,
      title: this.user.title,
      subtitle: this.user.subtitle
    };
    this.http.post(this.url + '/user/update_user_for_admin', param,{}).then(data =>{
      if(data.status == 200){
        console.log(data.data);
        var obj = JSON.parse(data.data);
        //
        if(obj.code == "S01"){
          this.showAlert("정보 수정 완료", "수정되었습니다.");
          this.navCtrl.pop();
        }else{
          var errorMsg = obj.message;
          this.showAlert("정보 수정 실패", errorMsg);
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



  
}
