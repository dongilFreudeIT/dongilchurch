import { Component } from "@angular/core";
import {
  NavController,
  ViewController,
  ModalController,
  AlertController
} from "ionic-angular";
import { HTTP } from "@ionic-native/http";
import { PasswordsetPage } from "../passwordset/passwordset";
import { RegisteruserPage } from "../registeruser/registeruser";

import { ServerProvider } from "../../providers/server/server";

@Component({
  selector: "page-findpassword-new",
  templateUrl: "findpassword-new.html"
})
export class FindpasswordNewPage {
  url: string = "http://13.125.35.123/api";
  name: string;
  phone: string;
  modal: any;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public http: HTTP,
    private server: ServerProvider
  ) {
    this.url = this.server.url;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad FindpasswordNewPage");
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  checkUser() {
    let info = {
      name: this.name,
      phone: this.phone
    };
    this.http
      .post(this.url + "/user/checkUserInPassword", info, {})
      .then(data => {
        if (data.status == 200) {
          console.log("checkUser : " + data.data);
          let obj2 = JSON.parse(data.data);
          this.showAlert("안내", obj2.message);

          if (obj2.code == "S01") {
            console.log("S01 " + data.data);
            this.modal = this.modalCtrl.create(PasswordsetPage, obj2.value, {
              // cssClass: "modal-gradient"
            });
          } else {
            //go to sign up
            console.log("NOT S01 " + data.data);
            this.modal = this.modalCtrl.create(RegisteruserPage, info, {
              cssClass: "modal-gradient"
            });
          }
        } else {
          // this.showAlert("안내","일치하는 정보가 없습니다. 회원가입 화면으로 이동합니다.")
          // this.modal = this.modalCtrl.create(SignupPage, {}, {cssClass: 'modal-gradient'});
        }
      });
  }

  showAlert(title, msg) {
    // console.log(title+","+msg);
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: [
        {
          text: "OK",
          handler: () => {
            console.log("alert clicked");
            if (this.modal) {
              this.viewCtrl.dismiss();
              this.modal.present();
            }
          }
        }
      ]
    });
    alert.present();
  }
}
