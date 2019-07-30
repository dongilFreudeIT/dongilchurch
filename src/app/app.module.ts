import { NgModule, ErrorHandler } from "@angular/core";
import { HTTP } from "@ionic-native/http";

import { BrowserModule } from "@angular/platform-browser";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";

import { MyApp } from "./app.component";
import { AlarmPage } from "../pages/alarm/alarm";
import { AlarmHidePage } from "../pages/alarm-hide/alarm-hide";
import { MyinfoPage } from "../pages/myinfo/myinfo";
import { HomePage } from "../pages/home/home";
import { SettingPage } from "../pages/setting/setting";
import { NotiSetting } from "../pages/setting-modal/setting_modal";
import { LoginPage } from "../pages/login/login";
import { SignupPage } from "../pages/signup/signup";
import { UsermanagerPage } from "../pages/usermanager/usermanager";
import { PushfilterModal } from "../pages/pushfilter-modal/pushfilter";
import { UserdetailPage } from "../pages/userdetail/userdetail";
import { ParkingPage } from "../pages/parking/parking";
import { ParkingManagerPage } from "../pages/parkingmanager/parkingmanager";
import { PushShowPage } from "../pages/pushShow/pushShow";
import { PasswordsetPage } from "../pages/passwordset/passwordset";
import { FindPasswordPage } from "../pages/findpassword/findpassword";
import { FamilysitePage } from "../pages/familysite/familysite";
import { RegisteruserPage } from "../pages/registeruser/registeruser";
import { SignupCheckPage } from "../pages/signup-check/signup-check";
import { WeeklyPage } from "../pages/weekly/weekly";
import { GetUserInfoPage } from "../pages/get-user-info/get-user-info";
import { MyinfoShowPage } from "../pages/myinfo-show/myinfo-show";
import { GetUserInfoModalPage } from "../pages/get-user-info-modal/get-user-info-modal";
import { YoramPage } from "../pages/yoram/yoram";
import { YoramAllPage } from "../pages/yoram-all/yoram-all";
import { YoramAgreePage } from "../pages/yoram-agree/yoram-agree";
import { YoramWaitPage } from "../pages/yoram-wait/yoram-wait";
import { YoramDisagreePage } from "../pages/yoram-disagree/yoram-disagree";
import { YoramModalSearchGroupPage } from "../pages/yoram-modal-search-group/yoram-modal-search-group";
import { YoramModalSearchOnePage } from "../pages/yoram-modal-search-one/yoram-modal-search-one";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { FCM } from "@ionic-native/fcm";

import { IonicStorageModule } from "@ionic/storage";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { Device } from "@ionic-native/device";
import { LoaderProvider } from "../providers/loader/loader";

import { Network } from "@ionic-native/network";
import { CheckNetworkProvider } from "../providers/check-network/check-network";
import { NativeStorage } from "@ionic-native/native-storage";
import { IonicImageViewerModule } from "ionic-img-viewer";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { SafePipe } from "../pipes/safe/safe";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ZoomAreaModule } from "ionic2-zoom-area";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { AppVersion } from "@ionic-native/app-version";
import { Clipboard } from "@ionic-native/clipboard";
import { Market } from "@ionic-native/market";
import { YoramProvider } from "../providers/yoram/yoram";
import { YoramHttpProvider } from "../providers/yoram-http/yoram-http";

import { LongPressModule } from "ionic-long-press";
import { ServerProvider } from "../providers/server/server";

import { FormsModule } from "@angular/forms";

import { FirebaseUIModule, firebase, firebaseui } from "firebaseui-angular";

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: "popup",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      scopes: ["public_profile", "email", "user_likes", "user_friends"],
      customParameters: {
        auth_type: "reauthenticate"
      },
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID
    },
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    {
      requireDisplayName: false,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    },
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],
  tosUrl: "<your-tos-link>",
  privacyPolicyUrl: "<your-privacyPolicyUrl-link>",
  credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
};
@NgModule({
  //page 선언
  declarations: [
    SafePipe,
    MyApp,
    HomePage,
    AlarmPage,
    AlarmHidePage,
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
    WeeklyPage,
    GetUserInfoPage,
    MyinfoShowPage,
    GetUserInfoModalPage,
    YoramPage,
    YoramAllPage,
    YoramAgreePage,
    YoramDisagreePage,
    YoramWaitPage,
    YoramModalSearchGroupPage,
    YoramModalSearchOnePage
  ],
  imports: [
    LongPressModule,
    BrowserModule,
    IonicImageViewerModule,
    BrowserAnimationsModule,
    ZoomAreaModule.forRoot(),
    // HttpClientModule, //http 통신을 위해
    IonicModule.forRoot(MyApp, {
      tabsPlacement: "top"
    }),
    IonicStorageModule.forRoot(), //앱 내에 데이터를 저장하기 위해
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyCihLx56ZVvhnUlP_-1dkSNTDNLlAAy1XQ",
      authDomain: "dongilchurch-b89c0.firebaseapp.com",
      databaseURL: "https://dongilchurch-b89c0.firebaseio.com",
      projectId: "dongilchurch-b89c0",
      storageBucket: "dongilchurch-b89c0.appspot.com",
      messagingSenderId: "521875318610"
    }),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AlarmPage,
    AlarmHidePage,
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
    WeeklyPage,
    GetUserInfoPage,
    MyinfoShowPage,
    GetUserInfoModalPage,
    YoramPage,
    YoramAllPage,
    YoramAgreePage,
    YoramDisagreePage,
    YoramWaitPage,
    YoramModalSearchGroupPage,
    YoramModalSearchOnePage
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
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoaderProvider,
    Network,
    CheckNetworkProvider,
    NativeStorage,
    ScreenOrientation,
    PhotoViewer,
    AppVersion,
    Clipboard,
    Market,
    YoramProvider,
    YoramHttpProvider,
    ServerProvider
  ]
})
export class AppModule {}
