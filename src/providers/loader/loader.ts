import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular'

@Injectable()
export class LoaderProvider {
  private loading:any;
  constructor(private loadingCtrl:LoadingController) {
    console.log('Hello LoaderProvider Provider');
  }
  show(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();
  }
  hide(){
    this.loading.dismiss();

  }

}
