import { Component, ViewChild } from '@angular/core';
import { ViewController, AlertController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { LoginPage } from '../login/login';
import { Device } from '@ionic-native/device';

import { InAppBrowser } from '@ionic-native/in-app-browser';

declare var daum :any;

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  url: string = 'http://13.125.35.123/api';

  user_id : string;
  password : string;
  password_again : string;
  user_name : string;
  user_phone : string;
  user_address : string;
  user_subtitle : string;
  user_title : string;
  user_place : string;
  user_subgroup : string;
  static cerPhone : string;
  // enc_data : string;

  browserRef: any;


  constructor( public alertCtrl: AlertController, public http : HTTP, public viewCtrl: ViewController, 
    public iab: InAppBrowser, private device: Device) {
    // this.getEncData();
  }


  //회원가입
  signup() {

    console.log(SignupPage.cerPhone);
        if(this.user_id == null || this.user_id == ''){
          this.showAlert("알림", "아이디를 입력해 주세요.");
          return;
        }
        if(this.user_id.length<3){
          this.showAlert("알림", "아이디는 최소 3자리 이상입니다.");
          return;
        }
        if(this.password == null || this.password == ''){
          this.showAlert("알림", "비밀번호를 입력해 주세요.");
          return;
        }
        if( this.chkPwd(this.password) == false){
          this.showAlert("알림", "비밀번호는 영문+숫자 6자 이상입니다.");
          return;
        }
        if(this.password_again == null || this.password_again == ''){
          this.showAlert("알림", "비밀번호를 다시 입력해 주세요.");
          return;
        }
        if(this.password != this.password_again){
          this.showAlert("알림", "동일한 비밀번호를 입력해 주세요.");
          return;
        }
        if(this.user_name == null || this.user_name == ''){
          this.showAlert("알림", "이름을 입력해 주세요.");
          return;
        }
        if(this.user_name.length<2){
          this.showAlert("알림", "이름은 최소 2자 이상입니다.");
          return;
        }
        if(this.user_phone == null || this.user_phone == ''|| this.user_phone.length<11){
          this.showAlert("알림", "폰번호를 입력해 주세요.");
          return;
        }

        if(SignupPage.cerPhone == ''){
          this.showAlert("알림", "본인인증을 해주세요.");
          return;
        }
        if(SignupPage.cerPhone != this.user_phone){
          this.showAlert("알림", "본인인증한 폰번호와 입력한 폰번호가 틀립니다.");
          return;
        }
        
      

        


        console.log(this.user_id +"/" + this.password + "/" + this.password_again + "/" + this.user_name + "/" + this.user_phone);
        var param = { 
          id : this.user_id, 
          pw: this.password, 
          name: this.user_name, 
          phone : this.user_phone, 
          address : this.user_address,
          title : this.user_title,
          subgroup : this.user_subgroup,
          subtitle : this.user_subtitle,
          place : this.user_place
         };
    
        this.http.post(this.url + '/user/register_user', param,{}).then(data =>{
          if(data.status == 200){
            console.log(data.data);
            var obj = JSON.parse(data.data);
            //로그인 성공이면
            if(obj.code == "S01"){

              this.showAlert("회원가입 성공", "가입하신 아이디로 로그인해주세요.");
              this.viewCtrl.dismiss();
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

chkPwd(str){
        var reg_pwd = /^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
        if(!reg_pwd.test(str)){
         return false;
        }
        return true;
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  //주소 검색(현재안씀)
  searchAddress(){

      new daum.Postcode({
          oncomplete: function (data) {
    
              var fullAddr = '';
              var extraAddr = '';
    
              if (data.userSelectedType === 'R') {
                  fullAddr = data.roadAddress;
              } else {
                  fullAddr = data.jibunAddress;
              }
    
              if (data.userSelectedType === 'R') {
                  if (data.bname !== '') {
                      extraAddr += data.bname;
                  }
                  if (data.buildingName !== '') {
                      extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                  }
    
                  fullAddr += (extraAddr !== '' ? ' (' + extraAddr + ')' : '');
              }
              this.user_address = fullAddr;
          }
      }).open();
    
  }


//본인인증 로직
//in app browser 켜서 본인인증 화면 호출 후 성공하면 url 읽어서 성고처리, 실패하면 url 읽어서 실패처리
  mobileAuth(){


  console.log("mobileAuth");

  let thisPage = this;

  if(this.device.platform == "Android"){
    this.browserRef=this.iab.create("http://13.125.35.123/checkplus_main.php","_blank" ,'toolbar=no');
  }else{
    console.log("ios");
    this.browserRef=this.iab.create("http://13.125.35.123/checkplus_main_ios.php","_blank" ,'location=no,closebuttoncaption=종료');
  }
  this.browserRef.on("exit").subscribe((event)=>{
    console.log("InAppBrowserEvent(exit):"+JSON.stringify(event)); 
    // if(event.url.startsWith("http://13.125.35.123/checkplus_success.php")){ // Just testing. Please add success and failure into server 
    //           console.log("cert success");
    //           thisPage.is_certificated = true;
    //           thisPage.showAlert("알림", "본인인증 성공했습니다. 나머지 정보를 입력해 주세요.");
    //           thisPage.browserRef.close();
    //           return;
            
    //     }else if(event.url.startsWith("http://13.125.35.123/checkplus_fail.php")){
    //           console.log("cert failure");
    //           thisPage.is_certificated = false;
    //           thisPage.showAlert("알림", "본인인증 실패했습니다. 다시 시도해 주세요.");
    //           thisPage.browserRef.close();
    //           return;
    //     }else{
      
            thisPage.browserRef.close();
        // }

});

  this.browserRef.on("loadstart").subscribe(function (e) {
    if(e.url.startsWith("http://13.125.35.123/success.php")){ // Just testing. Please add success and failure into server 
                        console.log("cert success");
                        var tempUrl = e.url;
                        var urlArr= tempUrl.split("?phone=");
                        SignupPage.cerPhone = urlArr[1];
                        console.log(SignupPage.cerPhone);
                        thisPage.showAlert("알림", "본인인증 성공했습니다. 나머지 정보를 입력해 주세요.");
                        thisPage.browserRef.close();
                        return;
                       
                  }else if(e.url.startsWith("http://13.125.35.123/checkplus_fail.php")){
                        console.log("cert failure");
                        thisPage.showAlert("알림", "본인인증 실패했습니다. 다시 시도해 주세요.");
                        thisPage.browserRef.close();
                        return;
                  }
   
       
  });
  this.browserRef.on("loaderror").subscribe((event)=>{
      console.log("loaderror:"+event.url);
      thisPage.showAlert("알림", "네트워크에 문제가 생겨서 페이지 로딩에 문제가 생겼습니다.");
      thisPage.browserRef.close();
      // if(event.url.startsWith("http://13.125.35.123/success.php")){ // Just testing. Please add success and failure into server 
      //         console.log("cert success");
      //         var tempUrl = event.url;
      //         var urlArr= tempUrl.split("?phone=");
      //         SignupPage.cerPhone = urlArr[1];
      //         console.log(SignupPage.cerPhone);
      //         thisPage.showAlert("알림", "본인인증 성공했습니다. 나머지 정보를 입력해 주세요.");
      //         thisPage.browserRef.close();
      //         return;
            
      //   }else if(event.url.startsWith("http://13.125.35.123/checkplus_fail.php")){
      //         console.log("cert failure");
      //         thisPage.showAlert("알림", "본인인증 실패했습니다. 다시 시도해 주세요.");
      //         thisPage.browserRef.close();
      //         return;
      //   }
  });

  this.browserRef.on("loadstop").subscribe((event)=>{
      console.log("loadstop event comes "+event.url);
      //본인인증 성공했으면
      if(event.url.startsWith("http://13.125.35.123/success.php")){ // Just testing. Please add success and failure into server 
              console.log("cert success");
              var tempUrl = event.url;
              var urlArr= tempUrl.split("?phone=");
              SignupPage.cerPhone = urlArr[1];
              console.log(SignupPage.cerPhone);
              thisPage.showAlert("알림", "본인인증 성공했습니다. 나머지 정보를 입력해 주세요.");
              thisPage.browserRef.close();
              return;
            
        }else if(event.url.startsWith("http://13.125.35.123/checkplus_fail.php")){
              console.log("cert failure");
              thisPage.showAlert("알림", "본인인증 실패했습니다. 다시 시도해 주세요.");
              thisPage.browserRef.close();
              return;
        }
      
  });


}
  

}
