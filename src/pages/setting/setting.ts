import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { NotiSetting} from '../setting-modal/setting_modal';
import { Storage } from '@ionic/storage';
import { MyinfoPage } from '../myinfo/myinfo';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})

//t
export class SettingPage {

  user_serial : any;
  url: string = 'http://13.125.35.123/api';

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public http : HTTP, private storage: Storage, private alertCtrl : AlertController) {

  }

  goToMyInfo(){

    this.storage.get('user_serial').then((value) => {
      this.user_serial = value;


      if(this.user_serial==null || this.user_serial == ''){
        this.showAlert("안내","로그인을 해주세요.");
        return;
      }

      var param = { serial : this.user_serial };
      this.http.post(this.url + '/user/get_user', param,{}).then(data =>{
        if(data.status == 200){
          console.log(data.data);
          var obj = JSON.parse(data.data);
          //로그인 성공이면
          if(obj.code == "S01"){
              var user = obj.value;
              var tempBirthday = user.birthday;
              user.birthday = tempBirthday.substring(0,4) +"-"+ tempBirthday.substring(4,6) +"-"+ tempBirthday.substring(6,8);
              this.navCtrl.push(MyinfoPage, user);
          }else{

          }
        }
      });//http end

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



//   //예배 시간 추가할 모달(다이얼로그)
// showBlockTimeModal() {
//   var data = { "user" : this.userSerial };
//   let contactModal = this.modalCtrl.create(NotiSetting, data);
//   contactModal.onDidDismiss(data => {
//     if(data!=null){
//       this.getBlockTimer();
//     }
//   });
//   contactModal.present();
// }

// //유저가 설정해놓은 예배시간을 서버에서 가져오기
// getBlockTimer(){

//   this.storage.get('user_serial').then((value) => {
//           this.userSerial = value;
    
//           var param = { serial : value };
    
//           this.http.post(this.url + '/user/get_blocktime_list', param,{}).then(data =>{
//             if(data.status == 200){
//               console.log(data.data);
//               var obj = JSON.parse(data.data);
//               //로그인 성공이면
//               if(obj.code == "S01"){
//                   this.blockTimeArray = obj.value;
//                   this.storage.set("time_size", this.blockTimeArray.length);
//                   for(var i=0; i<this.blockTimeArray.length; i++){
//                     var tempStart =  this.blockTimeArray[i]['start_time'];
//                     var tempEnd = this.blockTimeArray[i]['end_time'];
//                     this.blockTimeArray[i]['start_time'] = tempStart.substring(0,5);
//                     this.storage.set("time_"+i, this.blockTimeArray[i]['start_time']);
//                     this.blockTimeArray[i]['end_time'] = tempEnd.substring(0,5);
//                   }
//               }else{
//                   console.log(obj.message);
//               }
//             }
//           });//http end
//     });//storage end

// }
// //예배 시간 삭제
// deleteBlock(blockTime){
//   var param = { serial : blockTime.serial };
  
//         this.http.post(this.url + '/user/delete_blocktime', param,{}).then(data =>{
//           if(data.status == 200){
//             console.log(data.data);
//             var obj = JSON.parse(data.data);
//             //로그인 성공이면
//             if(obj.code == "S01"){
//                 this.getBlockTimer();
//             }else{
//                 console.log(obj.message);
//             }
//           }
//         });//http end
// }



}

