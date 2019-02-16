import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { YoramAllPage } from '../../pages/yoram-all/yoram-all';
import { YoramAgreePage } from '../../pages/yoram-agree/yoram-agree';
import { YoramWaitPage } from '../../pages/yoram-wait/yoram-wait';
import { YoramDisagreePage } from '../../pages/yoram-disagree/yoram-disagree'

import { CheckNetworkProvider } from '../../providers/check-network/check-network';

import { Network } from '@ionic-native/network'

@Component({
  selector: 'page-yoram',
  templateUrl: 'yoram.html'
})
export class YoramPage {

  yoramAllRoot = YoramAllPage;
  yoramAgreeRoot = YoramAgreePage;
  yoramWaitRoot = YoramWaitPage;
  yoramDisagreeRoot = YoramDisagreePage;
  
  subscribeNet1 : any;
  subscribeNet2 : any;

  constructor(
    public navCtrl: NavController,
    private network: Network,
    private chechNetwork : CheckNetworkProvider) {
    this.subscribeNet1 = this.network.onDisconnect().subscribe((data)=>{
      console.log("network disconnected");
      this.chechNetwork.display(data.type);
    });
    this.subscribeNet2 = this.network.onConnect().subscribe((data)=> {
      console.log("network connected");
      this.chechNetwork.display(data.type);

    });
  }

}
