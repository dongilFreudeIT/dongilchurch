import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

import { YoramHttpProvider } from '../../providers/yoram-http/yoram-http';

@Component({
  selector: 'page-yoram-modal-search-group',
  templateUrl: 'yoram-modal-search-group.html',
})
export class YoramModalSearchGroupPage {
  searchArray=[];
  isSearchNull :boolean=false;
  data ={place : '', subgroup: ''};
  
  constructor(
    public navCtrl: NavController, 
    public viewController: ViewController,
    public navParams: NavParams,
    public yoramHttpProvider: YoramHttpProvider
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad YoramModalSearchGroupPage');
  }

  applyFilter(){
    this.viewController.dismiss(this.data);
  }

  selectSubgroup($event){
    console.log(typeof $event +'selectSubgroup '+JSON.stringify($event));
    this.data.subgroup=$event;
    this.searchGroup();

  }
  selectPlace($event){
    console.log(typeof $event +'selectPlace '+JSON.stringify($event));
    this.data.place=$event;
    this.searchGroup();
  }

  searchGroup(){
    this.searchArray = this.yoramHttpProvider.allUsersInfo.filter((item)=>{
      if(this.data.place =="" && this.data.subgroup ==""){
        return false;
      }
      if( ((this.data.place =="")?true: item.place == this.data.place)
      &&((this.data.subgroup =="")?true: item.subgroup == this.data.subgroup) ){
        return true;
      }else{
        return false;
      }
    });
    console.log("searchGroup "+JSON.stringify(this.searchArray));
  }

  sendRequestAll(){
    // console.log("sendRequestAll "+JSON.stringify(this.searchArray));
    this.yoramHttpProvider.sendRequestAll(this.searchArray);
  }
}