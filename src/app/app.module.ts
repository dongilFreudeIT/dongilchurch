import { NgModule, ErrorHandler } from '@angular/core';
import { HTTP } from '@ionic-native/http';

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
import { ParkingPage } from '../pages/parking/parking';
import { ParkingManagerPage } from '../pages/parkingmanager/parkingmanager';
import { PushShowPage } from '../pages/pushShow/pushShow';
import { PasswordsetPage } from '../pages/passwordset/passwordset';
import { FindPasswordPage } from '../pages/findpassword/findpassword';
import { FamilysitePage } from '../pages/familysite/familysite';
import { RegisteruserPage } from '../pages/registeruser/registeruser';
import { SignupCheckPage } from '../pages/signup-check/signup-check';
import { WeeklyPage } from '../pages/weekly/weekly';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FCM } from '@ionic-native/fcm';

import { IonicStorageModule } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Device } from '@ionic-native/device';
import { LoaderProvider } from '../providers/loader/loader';

import { Network } from '@ionic-native/network'
import { CheckNetworkProvider } from '../providers/check-network/check-network';
import { NativeStorage } from '@ionic-native/native-storage';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SafePipe } from '../pipes/safe/safe';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ZoomAreaModule } from 'ionic2-zoom-area';
import {PhotoViewer} from '@ionic-native/photo-viewer';

@NgModule({
  //page 선언
  declarations: [
    SafePipe,
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
    NotiSetting,
    ParkingPage,
    ParkingManagerPage,
    PushShowPage,
    PasswordsetPage,
    FindPasswordPage,
    FamilysitePage,
    RegisteruserPage,
    SignupCheckPage,
    WeeklyPage
  ],
  imports: [
    BrowserModule, 
    IonicImageViewerModule,
    BrowserAnimationsModule,
    ZoomAreaModule.forRoot(),
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
    NotiSetting,
    ParkingPage,
    ParkingManagerPage,
    PushShowPage,
    PasswordsetPage,
    FindPasswordPage,
    FamilysitePage,
    RegisteruserPage,
    SignupCheckPage,
    WeeklyPage
  ],
  //사용되는 프로바이더(라이브러리 또는 플러그인)
  providers: [
    HTTP,
    FCM,
    // Storage,
    InAppBrowser,
    AndroidPermissions,
    StatusBar,
    SplashScreen,
    Device,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoaderProvider,
    Network,
    CheckNetworkProvider,
    NativeStorage,
    ScreenOrientation,
    PhotoViewer

  ]
})
export class AppModule {}