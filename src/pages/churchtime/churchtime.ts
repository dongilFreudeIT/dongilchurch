import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
/**
 * Generated class for the ChurchtimePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-churchtime',
  templateUrl: 'churchtime.html',
})
export class ChurchtimePage {

  toggle_1 : boolean;
  toggle_2 : boolean;
  toggle_3 : boolean;
  toggle_4 : boolean;
  toggle_5 : boolean;
  toggle_6 : boolean;
  toggle_7 : boolean;

  constructor( private storage: Storage, private alertCtrl: AlertController) {
    this.getSavedData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChurchtimePage');
  }

  getSavedData(){
    this.storage.get('toggle_array').then((value) => {
      //설정 안되어 있으면
      if(value == null || value.length == 0){
        this.toggle_1 = false;
        this.toggle_2 = false;
        this.toggle_3 = false;
        this.toggle_4 = false;
        this.toggle_5 = false;
        this.toggle_6 = false;
        this.toggle_7 = false;
      }else{//설정 되어 있으면 local array에 넣는다.
        var toggleArray = value;
        this.toggle_1 = toggleArray[0];
        this.toggle_2 = toggleArray[1];
        this.toggle_3 = toggleArray[2];
        this.toggle_4 = toggleArray[3];
        this.toggle_5 = toggleArray[4];
        this.toggle_6 = toggleArray[5];
        this.toggle_7 = toggleArray[6];
      }
    });
  }
  saveTime(){
    var toggleArray = [
      this.toggle_1, this.toggle_2, this.toggle_3, this.toggle_4, this.toggle_5, this.toggle_6, this.toggle_7
    ];
    this.storage.set("toggle_array", toggleArray);

    let alert = this.alertCtrl.create({
      title: "알림",
      subTitle: "예배 시간이 저장 되었습니다.",
      buttons: ['OK']
    });
    alert.present();


  }



}
