import { Injectable } from '@angular/core';

import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network'


@Injectable()
export class CheckNetworkProvider {

  constructor(public toastController :ToastController, private network: Network) {
    console.log('Hello CheckNetworkProvider Provider');

    
  }

  display(state:string){
    var msg;
    if(state == 'online'){
      msg='서버와 연결 되었습니다.'
    }else if (state == 'offline'){
      msg = '서버와의 연결이 종료되었습니다.'
    }
    this.toastController.create({
      message : msg,
      duration : 2000
    }).present();
  }
}
