import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-pushfilter',
  templateUrl: 'pushfilter.html'
})

//푸쉬 보낼 때 정렬 기준 선택하는 다이얼로그
export class PushfilterModal {

  place : string;
  group : string;
  title : string;
  subtitle : string;
  grade : string;

  constructor(public viewCtrl: ViewController) {
    //  console.log('UserId', params.get('userId'));
   }
   //선택 된 정렬 기준을 data로 담아서 부모뷰(sendPush에 전달)
  applyFilter(){
    console.log( this.place + "/" + this.group);
    let data = { place : this.place, subgroup : this.group, title : this.title, subtitle : this.subtitle, grade : this.grade};
    this.viewCtrl.dismiss(data);
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}

