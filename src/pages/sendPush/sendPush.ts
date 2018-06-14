import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';
import { ImagePicker } from '@ionic-native/image-picker';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Device } from '@ionic-native/device';

@Component({
  templateUrl: 'sendPush.html'
})
//푸쉬 보내는 화면
export class SendPushPage {

  url: string = 'http://13.125.35.123/api';

  userArray : any;
  userCount : any;
  title : any;
  message : any;
  lastImage: string = null;
  filePathStr : any;
  

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams,  public http : HTTP, private storage: Storage,
    private imagePicker: ImagePicker, private file: File, private filePath: FilePath, private device: Device
  ) {
    this.userArray = this.navParams.data; //전달받은 유저 array(푸쉬 보낼 사람들)
    this.userCount = this.userArray.length; //전달받은 유저 count
    console.log(this.userCount +"명 선택됨");

    imagePicker.requestReadPermission().then((result) =>{
      console.log(result);
    },(err) =>{
      console.log(err);
    });

  }

  //사진 선택
  selectPhoto(){
    this.imagePicker.getPictures({ maximumImagesCount: 1 }).then((results) => {
      console.log(results);
      for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          this.lastImage = results[i];
      }
    }, (err) => { console.log("image error")});

  }
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      this.filePath.resolveNativePath(img)
      .then(filePath => { 
        console.log(filePath);
        this.filePathStr = filePath;})
      .catch(err => console.log(err));
    }
  }

  //푸쉬 보내기
  sendPush(){

    if(this.title == null || this.title == ''){
      let alert = this.alertCtrl.create({
        title: "알림",
        subTitle: "제목을 입력해 주세요.",
        buttons: ['OK']
      });
      alert.present();
      return;
    }
    if(this.message == null || this.message == ''){
      let alert = this.alertCtrl.create({
        title: "알림",
        subTitle: "메세지를 입력해 주세요.",
        buttons: ['OK']
      });
      alert.present();
      return;
    }
    console.log(this.title +"/" + this.message);
   


    this.storage.get('user_serial').then((val2) => {

      var receiverArray = Array();
      var tokenArray = Array();
      //선택된 사람들의 push toekn 정보를 저장한다.
      for(var i=0; i<this.userCount; i++){
        console.log("serial = "+ this.userArray[i]['serial']);
        receiverArray.push(this.userArray[i]['serial']);
        tokenArray.push(this.userArray[i]['push_token']);
      }
      var param = { sender: val2, 
        receiver: JSON.stringify(receiverArray), 
        title : this.title, 
        body: this.message, 
        tokens : JSON.stringify(tokenArray) };

       //파일 첨부 없으면
      if(this.lastImage == '' || this.lastImage == null){

          this.http.post(this.url + '/push/send_push', param,{}).then(data =>{
            if(data.status == 200){
              console.log(data.data);
              var obj = JSON.parse(data.data);
              if(obj.code == "S01"){
                console.log(obj.value);
                var successCount = obj.value;
                let alert = this.alertCtrl.create({
                  title: "성공",
                  subTitle: "총 " + successCount + "명에서 메세지를 전송했습니다.",
                  buttons: ['OK']
                });
                alert.present();
                this.navCtrl.pop();
              }else{
                var errorMsg = obj.message;
                console.log(errorMsg);
                let alert = this.alertCtrl.create({
                  title: "실패",
                  subTitle: errorMsg,
                  buttons: ['OK']
                });
                alert.present();
              }
            }
          })
          .catch(error =>{
            console.log(error.error);
          });
      
      }
      else{ //파일 첨부 있으면
      
/*
           // File for Upload

           if(this.device.platform == "Android"){
             this.filePathStr = this.lastImage;
             this.pathForImage(this.lastImage);//만약 native로 받을 수 있으면 filePathStr 변경
           }else{
            //  this.file.documentsDirectory
           }
            console.log(this.filePathStr);
            
              var options = {
                fileKey: "file",
                fileName: this.lastImage,
                chunkedMode: false,
                mimeType: "multipart/form-data",
                params : param
              };
            
            
              // Use the FileTransfer to upload the image
              fileTransfer.upload(this.filePathStr, this.url + "/push/image_upload", options).then(data => {
                console.log(data.response);
                var obj = JSON.parse(data.response);
                if(obj.code == "S01"){
                  // console.log(obj.value);
                  let alert = this.alertCtrl.create({
                    title: "성공",
                    subTitle: "총 " + this.userCount + "명에서 메세지를 전송했습니다.",
                    buttons: ['OK']
                  });
                  alert.present();
                  this.navCtrl.pop();
                }else{
                  var errorMsg = obj.message;
                  console.log(errorMsg);
                  let alert = this.alertCtrl.create({
                    title: "실패",
                    subTitle: errorMsg,
                    buttons: ['OK']
                  });
                  alert.present();
                }
              }, err => {
                  console.log("upload fail");
            });
  */
      }
           

     


    });

    

  }
  
}
