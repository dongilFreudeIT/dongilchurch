import { NgModule, ErrorHandler } from '@angular/core';
import { HTTP } from '@ionic-native/http';
// import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';


import { MyApp } from './app.component';
import { AlarmPage } from '../pages/alarm/alarm';
import { MyinfoPage } from '../pages/myinfo/myinfo';
import { HomePage } from '../pages/home/home';
import { SettingPage} from '../pages/setting/setting';
import { NotiSetting} from '../pages/setting-modal/setting_modal';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { UsermanagerPage } from '../pages/usermanager/usermanager';
import { PushfilterModal } from '../pages/pushfilter-modal/pushfilter';
import { UserdetailPage } from '../pages/userdetail/userdetail';
import { SendPushPage } from '../pages/sendPush/sendPush';
import { ParkingPage } from '../pages/parking/parking';
import { ParkingManagerPage } from '../pages/parkingmanager/parkingmanager';
import { PushShowPage } from '../pages/pushShow/pushShow';
import { ChurchtimePage } from '../pages/churchtime/churchtime';
import { MyinfoShowPage } from '../pages/myinfo-show/myinfo-show';
import { PasswordsetPage } from '../pages/passwordset/passwordset';
import { FindPasswordPage } from '../pages/findpassword/findpassword';
import { FamilysitePage } from '../pages/familysite/familysite';
import { RegisteruserPage } from '../pages/registeruser/registeruser';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FCM } from '@ionic-native/fcm';

import { IonicStorageModule } from '@ionic/storage';
import { ImagePicker } from '@ionic-native/image-picker';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Device } from '@ionic-native/device';
import { LoaderProvider } from '../providers/loader/loader';

import { Network } from '@ionic-native/network'
import { CheckNetworkProvider } from '../providers/check-network/check-network';
import { NativeStorage } from '@ionic-native/native-storage';

@NgModule({
  //page 선언
  declarations: [
    MyApp,
    HomePage,
    AlarmPage,
    MyinfoPage,
    SettingPage,
    LoginPage,
    SignupPage,
    UsermanagerPage,
    PushfilterModal,
    UserdetailPage,
    SendPushPage,
    NotiSetting,
    ParkingPage,
    ParkingManagerPage,
    PushShowPage,
    ChurchtimePage,
    MyinfoShowPage,
    PasswordsetPage,
    FindPasswordPage,
    FamilysitePage,
    RegisteruserPage
    
  ],
  imports: [
    BrowserModule, 
    // HttpClientModule, //http 통신을 위해
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot() //앱 내에 데이터를 저장하기 위해
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AlarmPage,
    MyinfoPage,
    SettingPage,
    LoginPage,
    SignupPage,
    UsermanagerPage,
    PushfilterModal,
    UserdetailPage,
    SendPushPage,
    NotiSetting,
    ParkingPage,
    ParkingManagerPage,
    PushShowPage,
    ChurchtimePage,
    MyinfoShowPage,
    PasswordsetPage,
    FindPasswordPage,
    FamilysitePage,
    RegisteruserPage
  ],
  //사용되는 프로바이더(라이브러리 또는 플러그인)
  providers: [
    HTTP,
    File,
    FilePath,
    ImagePicker,
    FCM,
    // Storage,
    InAppBrowser,
    AndroidPermissions,
    BackgroundMode,
    StatusBar,
    SplashScreen,
    Device,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoaderProvider,
    Network,
    CheckNetworkProvider,
    NativeStorage


  ]
})
export class AppModule {}