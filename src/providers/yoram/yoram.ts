import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { YoramAllPage } from '../../pages/yoram-all/yoram-all';
import { YoramAgreePage } from '../../pages/yoram-agree/yoram-agree';
import { YoramWaitPage } from '../../pages/yoram-wait/yoram-wait';
import { YoramDisagreePage } from '../../pages/yoram-disagree/yoram-disagree'

import { YoramModalSearchOnePage } from '../../pages/yoram-modal-search-one/yoram-modal-search-one';
import { YoramModalSearchGroupPage } from '../../pages/yoram-modal-search-group/yoram-modal-search-group';


@Injectable()
export class YoramProvider {
 
  constructor(
    private modal: ModalController,
    ) 
  {
    console.log('Hello YoramProvider Provider');
  }

  showModalSearchOne(){
    let myModal = this.modal.create(YoramModalSearchOnePage, null, { cssClass: 'inset-modal' });
    myModal.present();
    myModal.onDidDismiss((data) => {
      console.log("이름 검색 모달 반환 값 : "+ JSON.stringify(data));
    });
  }
  showModalSearchGroup(){
    let myModal = this.modal.create(YoramModalSearchGroupPage, null, { cssClass: 'inset-modal' });
    myModal.present();
    myModal.onDidDismiss((data) => {
      console.log("그룹 검색 모달 반환 값 : "+ JSON.stringify(data));
    });
  }
}
