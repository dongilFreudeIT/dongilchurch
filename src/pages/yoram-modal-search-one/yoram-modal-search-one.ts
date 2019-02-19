import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

import { YoramHttpProvider } from '../../providers/yoram-http/yoram-http';

@Component({
  selector: 'page-yoram-modal-search-one',
  templateUrl: 'yoram-modal-search-one.html',
})

export class YoramModalSearchOnePage {
  
  name: string;
  searchArray=[];
  isSearchNull :boolean=false;

  constructor(
    public navCtrl: NavController, 
    public viewController: ViewController,
    public navParams: NavParams,
    public yoramHttpProvider: YoramHttpProvider
)
  {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad YoramModalSearchOnePage');
  }
  
  eventHandler(keyCode) {
    if (keyCode == 13)
      this.searchName();
  }
  searchName() {
    this.isSearchNull = false;
    this.searchArray = [];
    this.yoramHttpProvider.allUsersInfo.forEach(element => {
      if (element['name'] == this.name) {
        console.log(element['serial']);
        this.searchArray.push(element);
      }
    });
    console.log(JSON.stringify( this.searchArray));

    if(this.searchArray){
      this.isSearchNull = true;
    }
  }
}
