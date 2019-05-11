import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';
import { MenuController } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-registeruser',
  templateUrl: 'registeruser.html',
})
export class RegisteruserPage {

  url: string = 'http://13.125.35.123/api';

  user_id: string;
  password: string;
  password_again: string;
  user_name: string;
  user_phone: string;
  user_address: string;
  user_subtitle: string;
  user_title: string;
  user_place: string;
  user_subgroup: string;
  user_birth:string;

  browserRef: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public http: HTTP, 
    public viewCtrl: ViewController, public modalCtrl: ModalController,
    public iab: InAppBrowser,
    public menuCtrl: MenuController, private storage: Storage) {
      console.log(JSON.stringify( navParams));
      if(navParams.get('serial')){
        this.user_name = navParams.get('name');
        this.user_phone = navParams.get('phone').replace(/\D/g,'');
        this.user_address = navParams.get('address');
        this.user_subgroup = navParams.get('subgroup');
        this.user_subtitle = navParams.get('subtitle');
        this.user_title = navParams.get('title');
        this.user_birth = navParams.get('birthday');
        if(navParams.get('place').length == 1)
        {
          this.user_place = navParams.get('place')+'지역'
        }
      }else{
        this.user_name = navParams.get('name');
        this.user_phone = navParams.get('phone').replace(/\D/g,'');
        this.user_birth = navParams.get('birthday');

      }
  }






  //회원가입
  signup() {

    if (this.user_id == null || this.user_id == '') {
      this.showAlert("안내", "아이디를 입력해 주세요.");
      return;
    }
    if (this.user_id.length < 3) {
      this.showAlert("안내", "아이디는 최소 3자리 이상입니다.");
      return;
    }
    if (this.password == null || this.password == '') {
      this.showAlert("안내", "비밀번호를 입력해 주세요.");
      return;
    }

    if (this.password_again == null || this.password_again == '') {
      this.showAlert("안내", "비밀번호를 다시 입력해 주세요.");
      return;
    }
    if (this.password != this.password_again) {
      this.showAlert("안내", "비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    if (this.user_name == null || this.user_name == '') {
      this.showAlert("안내", "이름을 입력해 주세요.");
      return;
    }
    if (this.user_name.length < 2) {
      this.showAlert("안내", "이름은 최소 2자 이상입니다.");
      return;
    }
    if (this.user_phone == null || this.user_phone == '' || this.user_phone.length < 11) {
      this.showAlert("안내", "휴대폰 번호를 입력해 주세요.");
      this.user_phone='';
      return;
    }

    if (this.user_address == null || this.user_address == '') {
      this.user_address = ' ';
    }

    console.log(this.user_id + "/" + this.password + "/" + this.password_again + "/" + this.user_name + "/" + this.user_phone);
    var param = {
      id: this.user_id,
      pw: this.password,
      name: this.user_name,
      phone: this.user_phone,
      address: this.user_address,
      title: this.user_title,
      subgroup: this.user_subgroup,
      subtitle: this.user_subtitle,
      place: this.user_place
    };

    this.http.post(this.url + '/user/register_user', param, {}).then(data => {
      if (data.status == 200) {
        console.log(data.data);
        var obj = JSON.parse(data.data);
        //로그인 성공이면
        if (obj.code == "S01") {
          // this.showAlert("회원가입 성공", "가입하신 아이디로 로그인해주세요.");
          // this.viewCtrl.dismiss();
          this.login();
        } else {
          var errorMsg = obj.message;
          this.showAlert("회원가입 실패", errorMsg);
        }
      }
    })
      .catch(error => {
        console.log(error.error);
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

  chkPwd(str) {
    var reg_pwd = /^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
    if (!reg_pwd.test(str)) {
      return false;
    }
    return true;
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  login() {

    console.log(this.user_id +" " + this.password);
    var accountInfo = { id : this.user_id, pw: this.password };
    //입력 받은 id, pw로 로그인 시도
    this.http.post(this.url + '/user/login', accountInfo,{}).then(data =>{
      if(data.status == 200){
        console.log(data.data);
        var obj = JSON.parse(data.data);
        //로그인 성공이면
        if(obj.code == "S01"){
          //user_serial, 등급을 내부 저장소에 저장하고 메뉴를 로그인 메뉴로 바꾸고 홈으로 이동
          this.storage.set('user_serial', obj.user_serial);
          console.log("login page store user serial : "
           + this.storage.get('user_serial'));
          this.storage.set('grade', obj.grade);
          if(obj.grade == "관리자"){

            this.menuCtrl.enable(true, 'master');
            this.menuCtrl.enable(false, 'authenticated');
            this.menuCtrl.enable(false, 'unauthenticated');
            this.menuCtrl.enable(false, 'parking_manager');

          }else if(obj.grade == "주차장매니저"){
            this.menuCtrl.enable(true, 'parking_manager');
            this.menuCtrl.enable(false, 'master');
            this.menuCtrl.enable(false, 'authenticated');
            this.menuCtrl.enable(false, 'unauthenticated');
          }
          else{
            this.menuCtrl.enable(false, 'master');
            this.menuCtrl.enable(true, 'authenticated');
            this.menuCtrl.enable(false, 'unauthenticated');
            this.menuCtrl.enable(false, 'parking_manager');
          }
          //만약 storage에 저장된 push_token이 있으면 서버에 등록 시킨다.
          //일반적으로 앱 실행시 이미 push_token이 이미 생성되어 storage에 저장되어 있다.
          this.storage.get("push_token").then((value) => {
            console.log("start save token :" + value);
            var param = { push_token : value, serial: obj.user_serial };
            this.http.post(this.url + '/user/update_token', param,{}).then(data =>{
              if(data.status == 200){
                console.log(data.data);
                // var obj = JSON.parse(data.data);
              }
            });
          });

          this.showAlert('<strong>' + this.user_name + '</strong>님 로그인 되었습니다.<br>사랑하며 축복합니다!', '');
          this.navCtrl.pop();
        }else{
          var errorMsg = obj.message;
          this.showAlert("로그인 실패", errorMsg);
        }


        this.http.post(this.url + '/user/get_user', {user_serial: obj.user_serial}, {}).then(data => {
          if (data.status == 200) {
            console.log(data.data);
            var obj = JSON.parse(data.data);
            //로그인 성공이면
            if (obj.code == "S01") {
              var user = obj.value;
              this.storage.set("get_user", user);
              // this.navCtrl.push(MyinfoPage, user);
            } else {
    
            }
          }
        });//http end


      }
    })
    .catch(error =>{
      console.log(error.error);
    });

    
  }
}
