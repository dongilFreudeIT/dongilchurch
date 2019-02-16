import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the GetUserInfoModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-get-user-info-modal',
  templateUrl: 'get-user-info-modal.html',
})
export class GetUserInfoModalPage {

  public data ={place : '', subgroup: ''};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewController: ViewController) {
  }

  ionViewWillLoad() {
    console.log('ionViewDidLoad GetUserInfoModalPage');
    console.log(JSON.stringify(this.data));

  }
  applyFilter(){

    this.viewController.dismiss(this.data);
  }
  dismiss(){
    this.data.place = "지역"
    this.viewController.dismiss(this.data);
  }
}
