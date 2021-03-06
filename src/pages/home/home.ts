import { URLSearchParams } from '@angular/http';
import { Component, Input, OnInit  } from '@angular/core';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { SERVER_URL } from '../../providers/constants/constants';
import { IonicPage, NavController, NavParams, App, Events, ModalController } from 'ionic-angular';
import { NativeServiveProvider } from '../../providers/native-servive/native-servive';
import { TabsPage } from '../tabs/tabs';
  
@IonicPage({
  name: 'HomePage'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  

  public homeType: number = 1;    //用于让组件接受识别出哪个页面
  public list: any[];              //接受子类组件数据
  public type: any;                //下拉加载；用于让组件识别
  public re: number = 0;      //重新刷新

  public activity = [];           //轮播图数据

  public topdata;           //轮播图内数据

  public islogin: boolean = true;  //判断是否登录

  net: boolean;                 //判断网络连接


  public yaoqingma:any;        //获取验证码
  //水花
  // private timer;
  // public time = 4;
  // public splash: boolean = true;

  tabBarElement: any;
  constructor(
    public navCtrl: NavController,
    public api: ApiServiceProvider,
    public appurl: NativeServiveProvider,
    public app: App,
    public events: Events,
    public modalCtrl: ModalController
  ) {
    //水花
    // this.tabBarElement = document.querySelector('.tabbar');

  }
  /* 开机只执行一次 */
  ionViewDidLoad() {

    // this.openspalsh(); //水花动画
    //     this.open();  //广告

  }



  ionViewWillEnter() {

    this.login();
    //轮播图
    this.hot_activity();
    //轮播图内的数据
    this.getdata();
    //是否登录
    this.net = this.appurl.getnetwork();//获取当前网络连接情况

    this.yongjin_data(1,10);
    this.re = 1;
  
    this.Restart();
 

  }
 
  // 启动订阅事件
  Restart() {
    if (this.re == 1) {
      this.events.publish('user:Re', this.homeType);
    } else {
      console.log('订阅事件没启动')
    };


  }

 
 /* 开启水花动画 */
  /* openspalsh() {
    this.tabBarElement.style.display = 'none';
    setTimeout(() => {
      this.splash = false;
      this.tabBarElement.style.display = 'flex';
      // this.open();
     }, 4000);

    if (this.time > 0) {
      this.timer = setInterval(() => {
        this.time = this.time - 1
      }, 1000);
    }else if(this.time<0){
    };

  
  } */

  /* 水花 */
  // animation() {
  //   this.splash = false;
  //   this.tabBarElement.style.display = 'flex';
  // }


  willEnt() {
    this.ionViewWillEnter();
  
  }

  ngOnInit() {
    localStorage.setItem('risk', 'true')  //判断账号
    
    // this.open();
   
  }

  //子类组件传给父类；
  return(group) {
    // this.list=group;
  }

  //下拉刷新代码;
  doRefresh(refresher) {
    this.ionViewWillEnter();
    //下拉开始时启动;
    setTimeout(() => {
      //下拉刷新中启动;
      this.type = 1;
      refresher.complete();
    }, 1000);
    this.type = 0;
  }

  //首页轮播图
  hot_activity() {
    let hot = [];
    this.api.advServlet()
      .map(data => data.json())
      .subscribe(data => {
        console.log(data.data)
        if (data.data != 'null') {
          for (let i = 0; i < data.data.length; i++) {
            data.data[i].advImg = SERVER_URL + data.data[i].advImg;
            hot.push(data.data[i]);
            console.log(hot);
          }
          this.activity = data.data;
          console.group('首页轮播图')
          console.log(this.activity);
          console.groupEnd();
        } else {
          console.log('没有数据！！！！！！！！！！！！')
        }
      })
  }

  //佣金数据
  yongjin_data(pageindex,e){
    this.api.awardCommission(pageindex,10).map(data => data.json()).subscribe(data => {
      this.yaoqingma=data.reserve;
     })
  }

  //首页轮播图跳转
  on_hot_roundpicture(url) {
    console.group('热门活动');
    console.log(url);
    console.groupEnd(); 
    if(url.indexOf('wechatShare')!=-1){
      let gg=this.appurl.themeable_yaoqing('http://www.rongyudai.cn/app/newbit/recommendPage.screen?type=app')
      gg.on('backevent').subscribe(data => {  
      });
      gg.on('helloPressed').subscribe(data => {
         this.appurl.wechatShare2('我在用一个安全收益又不错的理财工具，推荐你也来试试！','新用户注册就送8888元体验金，还有1880元红包可领！' ,'融裕贷','https://www.rongyudai.cn/fun/pj16027w/images/bg/banner.png','https://www.rongyudai.cn/app/newbit/newbieActive.screen?spreadCode=' + this.yaoqingma + '&APP=app');
      });   //分享到微信
      gg.on('testPressed').subscribe(data => {
         this.appurl.wechatShare1('我在用一个安全收益又不错的理财工具，推荐你也来试试！','新用户注册就送8888元体验金，还有1880元红包可领！' ,'融裕贷','https://www.rongyudai.cn/fun/pj16027w/images/bg/banner.png','https://www.rongyudai.cn/app/newbit/newbieActive.screen?spreadCode=' + this.yaoqingma + '&APP=app');
      });   //分享到朋友圈
    }else{
      this.appurl.themeable(url);
    }
  }
  //轮播图内的数据
  getdata() {
    this.api.bidExperIndex()
      .map(data => data.json())
      .subscribe(data => {
        this.topdata = data.reserve;
        document.getElementById('sumMoney').innerHTML = this.topdata.sumMoney2;
        document.getElementById('runday').innerHTML = this.topdata.runday;
      })
  }
  //icon图标的跳转
  //关于我们
  on_icon4() {
    this.appurl.themeable('https://www.rongyudai.cn/app/wap/helpCenter/aboutUs.screen');
  }
  //新手任务
  on_icon3() {
    this.appurl.themeable(SERVER_URL + 'fun/pj16027w/index.html');
  }
  //安全保障
  on_icon() {
    this.appurl.themeable('https://www.rongyudai.cn/app/wap/helpCenter/safety.screen');
  }
  //数据披露
  on_icon2() {
    this.appurl.themeable('https://www.rongyudai.cn/app/datapub/index.screen');
  }
  //邀请好友
  on_icon5() {
    this.appurl.themeable('http://www.rongyudai.cn/app/newbit/recommendPage.screen?type=app');
  }
  //是否登录状态
  login() {
    if (localStorage.getItem('personal')) {
      this.islogin = false;      //登录状态
      console.group('已登录')
      console.log(this.islogin);
      console.groupEnd();
    } else {
      this.islogin = true;      //未登录状态
      console.group('未登录')
      console.log(this.islogin);
      console.groupEnd();
    }
  }


}
