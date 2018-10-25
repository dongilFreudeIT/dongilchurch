import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Network } from '@ionic-native/network'

import { CheckNetworkProvider } from '../../providers/check-network/check-network';

import { UserdetailPage } from '../userdetail/userdetail';
import { PushfilterModal } from '../pushfilter-modal/pushfilter';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-usermanager',
  templateUrl: 'usermanager.html'
})
export class UsermanagerPage {

  userArray : any; //유저 정보 가지고 있는 array
  userOriginalArray : any; //필터적용 후 sort를 위한 orginal array
  isAllSelect : boolean;
  searchKeyword : string;
  isConnected: number = 1;

  nUserArray:any;

  url: string = 'http://13.125.35.123/api';
  
  subscribeNet1 : any; 
  subscribeNet2 : any;

  constructor(public navCtrl: NavController, public http : HTTP, public modalCtrl: ModalController, public alertCtrl: AlertController
    , public toastController :ToastController, private network: Network, private iab: InAppBrowser, public storage: Storage,
    private chechNetwork : CheckNetworkProvider) {

    this.isAllSelect = false;
    this.getUsers();
    
    this.subscribeNet1 = this.network.onDisconnect().subscribe((data)=>{
      console.log("network disconnected");
      this.chechNetwork.display(data.type);
      this.isConnected = 0;
    });
    this.subscribeNet2 = this.network.onConnect().subscribe((data)=> {
      console.log("network connected");
      this.chechNetwork.display(data.type);
      this.isConnected = 1;
      this.getUsers();
    });
    
  }
  getUsers(){
    //모든 유저 불러온다.
    this.http.post(this.url + '/user/get_user_by_type', null,{}).then(data =>{
      if(data.status == 200){
        console.log("user = " + data.data);
        var obj = JSON.parse(data.data);
        //값 얻어왔으면
        if(obj.code == "S01"){
          var tempArray = obj.value;
          for(var i=0; i<tempArray.length; i++){
            //null이면 값 다시 대입
            if(tempArray[i].subgroup == '' || tempArray[i].subgroup == null){
              tempArray[i].subgroup = "그룹없음";
            }
            if(tempArray[i].place == '' || tempArray[i].place == null){
              tempArray[i].place = "지역없음";
            }
            if(tempArray[i].title == '' || tempArray[i].title == null){
              tempArray[i].title = "직책없음";
            }
            // if(tempArray[i].phone == '' || tempArray[i].phone == null){
            //   tempArray[i].phone = "번호 정보 없음";
            // }
            tempArray[i].selected = false;
          }

          this.userArray = tempArray;
          this.userArray = obj.value;
          this.userOriginalArray = Object.assign([], this.userArray);
          this.nUserArray = this.userArray.length + "명 ";
        }
      }else{

      }
    });
  }

  goToDetail(user){
      this.navCtrl.push(UserdetailPage, user);
  }

  //정렬할 모달 띄우기
  showSortModal() {
    let contactModal = this.modalCtrl.create(PushfilterModal);
    //모달이 dismiss(닫힘)면 그때 전달 받은 data에 따라 정렬시킴
    contactModal.onDidDismiss(data => {

      console.log(data);
      if(data==null){
        this.userArray = Object.assign([], this.userOriginalArray);
        return;
      }
      else if(data.place==null && data.subgroup==null && data.title == null && data.subtitle == null && data.grade == null){
        this.userArray = Object.assign([], this.userOriginalArray);
        return;
      }
      else if(data.place=='' && data.subgroup=='' && data.title=='' && data.subtitle =='' && data.grade == ''){
        this.userArray = Object.assign([], this.userOriginalArray);
        return;
      }

      
      //설정된 검색 값으로 filter한다.
        this.userArray = this.userArray.filter((item) => {
          var tempPlace = item.place;
          var tempGroup = item.subgroup;
          var tempTitle = item.title;
          var tempSubtitle = item.subtitle;
          var tempGrade = item.grade;
          

          if(( (data.place!=null && data.place!='') ? (tempPlace != null && tempPlace.includes(data.place)) : true ) 
          && ( (data.subgroup!=null && data.subgroup!='') ? (tempGroup != null && tempGroup.includes(data.subgroup)) : true ) 
          && ( (data.title!=null && data.title!='') ? (tempTitle != null && tempTitle.includes(data.title)) : true )
          && ( (data.grade!=null && data.grade!='') ? (tempGrade != null && tempGrade.includes(data.grade)) : true ) 
          && ( (data.subtitle!=null && data.subtitle!='') ? (tempSubtitle != null && tempSubtitle.includes(data.subtitle)) : true ) ) {
            return true;
          }else{
            return false;
          }
        });
        //filter된 것 먼저 보여주고 나머지 유저들 추가한다.
        
        for(var i=0; i<this.userOriginalArray.length; i++){
          var isExsit = false;
          for(var j=0; j<this.userArray.length; j++){
            if(this.userOriginalArray[i].serial == this.userArray[j].serial){
                isExsit = true;
                break;
            }
          }
          if(isExsit == false){
            this.userArray.push(this.userOriginalArray[i]);
          }
        }

        console.log(data.subgroup);
        // 필터 된 사람중에 해당하는 사람 체크하기
        for(i=0; i<this.userArray.length; i++){
          this.userArray[i].selected = false;
          console.log(data.subgroup + +"/" + this.userArray[i].subgroup);
          if( (data.place === undefined ||  data.place === '' || data.place === this.userArray[i].place) 
          && (data.subgroup === undefined || data.subgroup === '' ||  data.subgroup === this.userArray[i].subgroup)
          && (data.subtitle === undefined || data.subtitle === ''  || data.subtitle === this.userArray[i].subtitle)
          && (data.title === undefined || data.title === '' ||  data.title === this.userArray[i].title)
          && (data.grade === undefined || data.grade === '' || data.grade === this.userArray[i].grade))
          {
            this.userArray[i].selected = true;
          }

          if( data.place === undefined  && data.subgroup === undefined && data.subtitle === undefined && data.title === undefined && data.grade === undefined){
            this.userArray[i].selected = false;
          } 
          // if(data.group!== undefined &&  data.group ===this.userArray[i].group){
          //   console.log(data.group + " " + this.userArray[i].group + " 일치");
          //   this.userArray[i].selected = true;
          // }
          // if(data.subgroup!== undefined &&  data.subgroup ===this.userArray[i].subgroup){
          //   console.log(data.subgroup + " " + this.userArray[i].subgroup + " 일치");
          //   this.userArray[i].selected = true;
          // }
          // if(data.title!== undefined &&  data.title ===this.userArray[i].title){
          //   console.log(data.title + " " + this.userArray[i].title + " 일치");
          //   this.userArray[i].selected = true;
          // }
          // if(data.grade!== undefined &&  data.grade ===this.userArray[i].grade){
          //   console.log(data.grade + " " + this.userArray[i].grade + " 일치");
          //   this.userArray[i].selected = true;
          // }
          // console.log(this.userArray[i].selected);
        }
      

    });
    contactModal.present();
  }

  //전체선택/전체해제
  selectToggle(){
    this.isAllSelect = !this.isAllSelect;
    for(var i=0; i<this.userArray.length; i++){
      this.userArray[i].selected = this.isAllSelect;
    }
    
  }

  //푸쉬 보내는 화면으로 이동
  sendPush(){
    //선택된 사람들만 보낸다.
    // var sendUserArray = Array();
    // for(var i=0; i<this.userArray.length; i++){
    //   if(this.userArray[i].selected == true){
    //     sendUserArray.push(this.userArray[i]);
    //   }
    // }
    // if(sendUserArray.length == 0){
    //   let alert = this.alertCtrl.create({
    //       title: "안내",
    //       subTitle: "푸시 메지지 보낼 유저를 선택해 주세요.",
    //       buttons: ['OK']
    //     });
    //   alert.present();
    // }else if(this.isConnected == 0){
    //     let alert = this.alertCtrl.create({
    //         title: "안내",
    //         subTitle: "인터넷 연결을 확인해주세요.",
    //         buttons: ['OK']
    //       });
    //     alert.present();
    // } else{
    //   this.navCtrl.push(SendPushPage, sendUserArray);
    // }
    console.log("푸시보내기");
    this.storage.get('user_serial').then((localSerial) => {
      const browser = this.iab.create('http://13.125.35.123/api/SendPush?serial='+localSerial,"target='_blank'");
      browser.show();
    });

  }
  //유저 검색
  searchUser(event : any){
    console.log(event.target.value)
     // Reset items back to all of the items
     this.userArray = Object.assign([], this.userOriginalArray);
     
         // set val to the value of the searchbar
         let val = event.target.value;
         // if the value is an empty string don't filter the items
         if (val && val.trim() != '') {
           this.userArray = this.userArray.filter((item) => {
             var tempName = item.name;
             var tempPhone = item.phone;
             var tempId = item.id;
              if( (tempName != null && tempName.includes(val)) || (tempPhone != null && tempPhone.includes(val)) || (tempId!=null &&tempId.includes(val))) {
                return true;
              }else{
                return false;
              }
         })
        }
  }
  onCancel(event : any){

  }
  ngOnDestroy(){
    this.subscribeNet1.unsubscribe();
    this.subscribeNet2.unsubscribe();
  }

  
}
