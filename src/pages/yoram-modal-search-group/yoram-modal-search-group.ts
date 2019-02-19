import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-yoram-modal-search-group',
  templateUrl: 'yoram-modal-search-group.html',
})
export class YoramModalSearchGroupPage {

  public data ={place : '', subgroup: ''};

  constructor(
    public navCtrl: NavController, 
    public viewController: ViewController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad YoramModalSearchGroupPage');
  }

  applyFilter(){
    this.viewController.dismiss(this.data);
  }
  
}
