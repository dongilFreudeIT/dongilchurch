import { Injectable } from '@angular/core';

import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';

@Injectable()
export class YoramHttpProvider {
  url: string = 'http://13.125.35.123/api';
 
  public allUsersInfo: any;
  public myReqInfos: any;
  public myReqInfoAgree: any;
  public myReqInfoDisgree: any;
  public myReqInfoWait: any;


  constructor(
    public http: HTTP,
    public storage: Storage
    ) 
  {
    console.log('Hello YoramHttpProvider Provider');
    this.getAllUserInfo();

  }

  getAllUserInfo(){
    console.log('YoramProvider getAllUserInfo start');

    this.http.post(this.url + '/yoram/getAllUserInfo', { flag: true }, {}).then(data => {
      if (data.status == 200) {
        var obj = JSON.parse(data.data);
        console.log(data.data);
        if (obj.code == "S01") {
          this.allUsersInfo = obj.value;
        }else{
          console.log("obj.code");
        }
      }else{
        console.log("data.status == 200");
      } 
    });
    console.log('YoramProvider getAllUserInfo end');

  }
}
