import { ApiServiceProvider } from './../../providers/api-service/api-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { NativeServiveProvider } from './../../providers/native-servive/native-servive';
 
@IonicPage({
  name: 'ListPage'
})
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
  public icons: any = "2";   // 默认显示理财项目[普通标]
  public size_jugde: any[];      //接受子类组件数据  
  public type: any;          //上拉加载；用于让组件识别

  net: boolean; //判断网络连接
  public re: number = 0;  //重新刷新
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiservice: ApiServiceProvider,
    public native: NativeServiveProvider,
    public events: Events
  ) {

  }

  ionViewWillEnter() {
    this.net = this.native.getnetwork();//获取网络连接结果

    this.re = 2;
    this.Restart();
  }
 //启动订阅事件
 Restart() {
  if (this.re == 2) {
    this.events.publish('user:Re', this.icons);
  } else {
    console.log('订阅事件没启动')
  }
}
//离开页面
ionViewDidLeave() {
  this.re = 0;
  
}
  //子类组件传给父类；
  return(group) {
    this.size_jugde = group;
  }

  willEnt(){
    this.ionViewWillEnter();
  }

  // 下拉刷新代码;
  doRefresh(refresher) {
    this.ionViewWillEnter();
    //下拉开始时启动;
    setTimeout(() => {
      //下拉刷新中启动;
      this.type = 1;
      refresher.complete();
    });
    this.type = 0;
  }

  //上拉加载
  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.type = 2;
      infiniteScroll.complete();
    });
    this.type = 0;
  }
}