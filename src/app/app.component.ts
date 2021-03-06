import { MePage } from './../pages/me/me';
import { Component} from '@angular/core';
import { Platform, ModalController, IonicApp,App,Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { ApiServiceProvider } from '../providers/api-service/api-service';
import { NativeServiveProvider } from './../providers/native-servive/native-servive';
import { APP_NUM } from '../providers/constants/constants';
import { VERSION_NUM } from '../providers/constants/constants';
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage: any = TabsPage;
  backButtonPressed: boolean = false;  //用于判断返回键是否触发
  public advertise = [];   //广告

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private apiservice: ApiServiceProvider,
    private modalCtrl:ModalController,
    private native: NativeServiveProvider,
    private ionicApp: IonicApp,
    private keyboard: Keyboard,
    private app:App,
    private events:Events
  ) {


    platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        splashScreen.hide();


        //ios的selsect的确定键
        this.keyboard.disableScroll(false);
        this.keyboard.hideKeyboardAccessoryBar(false);


        this.standby();        //待机状态的检测
        this.gesure();         //手势验证
	      this.app_updata();        //版本更新和检查
        this.registerBackButtonAction();    //安卓返回键
     });

     this.adv();  //广告
  }
 
  //待机状态的检测(应用从后台切换到前台)
  standby(){
    document.addEventListener("resume",  ()=> {
      //登录设置手势密码的
      if(localStorage.getItem('personal') && !localStorage.getItem('handlock_passwd')){
        this.apiservice.account_data().map(data => data.json()).subscribe( data => {
          if(data.code=="000000"){
            console.log('有登录状态');
          }else{
            // if(this.app.getActiveNav().canGoBack()){
              
            // }else{

            // }

            let modal=this.modalCtrl.create('LoginPage',{ type :'登录状态失效' });
            modal.present();
          }
        })
      }
      //登录没设置手势密码的
      else if(localStorage.getItem('personal') && localStorage.getItem('handlock_passwd')){
        this.apiservice.account_data().map(data => data.json()).subscribe( data => {
          if(data.code=='000000'){
            console.log('有登录状态');
          }else{
            this.gesure();
          }
        })
      }
    }, false);
  }

  //开启广告
  open() {
    this.apiservice.appAdvServlet()
      .map(data => data.json())
      .subscribe(data => {
        if (data.code == "000000") {
          this.advertise = data.data;
          let modal = this.modalCtrl.create('AdvertisePage', { data: data.data });
          modal.present();
          console.group('广告')
          console.log(data)
          console.groupEnd()
        } else {
          console.log('没有广告图片')
          console.log('不执行模态框')
        }
      })
  }
  //广告订阅
  adv() {
    console.log('进入adver方法')
    this.events.subscribe('user:Ad',()=>{
      this.open();
      console.log('广告已经发布');
    });
  };
  ionViewWillLeave(){
    this.events.unsubscribe('user:Ad',()=>{});
  }


  //手势验证
  gesure(){
    if(localStorage.getItem('handlock_passwd')&&localStorage.getItem('personal')){
      let modal=this.modalCtrl.create('SetGesturePage',{core:'待机广告失效'});
      modal.present();
    }else{
      this.open();
    }

  
  }


    //版本更新
  app_updata(){
      this.apiservice.timing().map(data => data.json()).subscribe(data => {
          console.log(data);
          let serverAppVersion = data.data.version[0]; //从服务端获取最新版本
          if (this.native.isAndroid()) {
            if (serverAppVersion.id != APP_NUM) {
              this.native.isUpdata(serverAppVersion.id, serverAppVersion.verNO,serverAppVersion.localUrl,serverAppVersion.mark);
              // this.native.isUpdata(data.data.appVersion, data.data.isupdate, data.msg, data.data.downloadUrl);
              // serverAppVersion.mark//升级内容
              // serverAppVersion.version[0].appVersion//版本号
              // serverAppVersion.localUrl//下载地址
            }
          }else if (this.native.isIos()) {
            if (data.data.iosVer != APP_NUM) {
              // this.native.iosUp(data.data.iosVer,data.data.iosIsupdateVer);
            }
          }
        })
  }


  //返回键方法
  registerBackButtonAction() {
    this.platform.registerBackButtonAction(() => {
      let activePortal = this.ionicApp._overlayPortal.getActive() || this.ionicApp._modalPortal.getActive();//呈现框和模态框
      let otherActive = this.ionicApp._loadingPortal.getActive();//加载框

      if (otherActive) {//加载框的时候禁止返回键
        console.log('不需要返回')
      }else if (activePortal) {

         console.log('不需要返回')

        //  alert('456')
        // if(localStorage.getItem('state')){
        //    alert('789')
        // }else{
        //    alert('0123')
        //   activePortal.dismiss().catch(() => { });
        // }
      } else {

        let is = this.app.getActiveNav().canGoBack();//是否可以返回
        if (is) {
          this.app.getActiveNav().pop();
        } else {
          this.exit();
        }

      }
    }, 101)
 };




   //退出app的方法
    exit() {
      if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
        this.platform.exitApp();
      } else {
        this.native.showToast('再按一次退出应用', 2000);

        this.backButtonPressed = true;
        setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
      }
    }





}
