import { ApiServiceProvider } from './../../providers/api-service/api-service';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'invest-list',
  templateUrl: 'invest-list.html'
})
export class InvestListComponent implements OnInit, OnChanges {
  //双向绑定的公共变量;
  //接受父类数据 datas是接口状态， page是刷新状态 re进入页面重新刷新
  @Input() datas: any;
  @Input() page: any;
   //向父类提交数据
  @Output()
  search = new EventEmitter();
  //监视父类变化
  ngOnChanges(OnChanges) {
    this.page;   //点击变化
    this.itemlist(this.pageindex, this.pagesize); //页面切换重新刷新
    this.search.emit(this.size_jugde);    //传递值给父类

    //下拉刷新
    if (this.page == 1) {
      this.ngOnInit();
      this.page = 0;
    }
    /* 
    上拉原理：对比pagesize和list_size
     pagesize是查询添加数； list_size是实际添加数。
    第一次对比：是通过的。
    第二次对比： list_size是实际添加数，如果本身只存在11条， 就算10+10执行后=11。
                而pagesize是查询添加数，10+10无论是否存在20条，都=20；
                当两者不相等情况下，说明list_size已经到底部了。 
    */
    if (this.page == 2) {
      let ten = 10;
      this.pagesize = this.pagesize + ten;
      this.list_size = this.list_size + ten;
      if (this.pagesize == this.list_size) {
        this.page = 0;
        this.itemlist(this.pageindex, this.pagesize);
      } else {
        this.page = 0;
        this.size_jugde = false;
        this.search.emit(this.size_jugde);
        this.itemlist(this.pageindex, this.list_size);
      }
    }

  }

  public Pcontent: any;    // 普通标
  public Zcontent: any;  // 债券转让
  public list_size: number;  //得出id总条数；以此判断上拉加载的极限
  public size_jugde: boolean = true; //判断上拉加载

  /** 
   * @name     体验标 --json只能一个个赋值取出来；
   * @param    releaseTime：    时间
   * @param    rate：         百分率
   * @param    isDay          用于判断；S是天数，F是月份
   * @param    cycle         根据isDay，标的期限
   * @param    status        判断按钮所显示的状态
   * @param    remainAmount  可投金额 
    */
  public Tcontent: any;
  public Tcontent_type: number;
  public releaseTime: any;
  public rate: number;
  public isDay: any;
  public cycle: number;
  public status: any;
  public remainAmount: number;
  public Tcontent_id: number;

  public pageindex: number = 1;
  public pagesize: number = 10;

  //  引入声明
  constructor(
    public navCtrl: NavController,
    public apiservice: ApiServiceProvider,
    public navParams: NavParams,
    public events: Events
  ) {

  }
  /**
 * @name 组件标列表接口--包含了首页个列表
 * @param datas:父类和子类建立交互的标记; 根据父类定义，子类来判断是哪个页面的父类传过来的
 * @param Pcontent:普通标
 * @param Zcontent:债权转让
 * @param Parr: 局部普通标--用来循环接受普通标的值
 * @param Zarr:局部债权转让--用来循环接受债权的值
 * @param pageindex:查询显示开始数--从1开始；      主要作用是刷新时从第几条开始；叠加：1开始，每次10条，手动刷新一次11；22；
 * @param pagesize:查询显示条数--每次查询显示条数。 主要作用是刷新时显示几条；基本不变
 */
  //第一次加载
  ngOnInit() {
    this.pagesize = 10;
    this. reSet();
  }

  //普通表和债券表数据;
  itemlist(start, size) {
    //  首页所显示的标，普通标和债券转让
    if (this.datas == 1) {
      let Parr = [];
      let Zarr = [];
      this.apiservice.bidExperIndex()
        .map(data => data.json())
        .subscribe
        (data => {
          for (let i = 0; i < data.data.length; i++) {
            if (data.data[i].type == '0') {
              Parr.push(data.data[i]);
            } else if (data.data[i].type == '2') {
              Zarr.push(data.data[i]);
            }
          }
          this.Pcontent = Parr;
          this.Zcontent = Zarr;
          console.group('首页普通标和债券数据')
          console.log(this.Pcontent);
          console.log(this.Zcontent);
          console.groupEnd();
        }
        )

    }
    else if (this.datas == '2') {
      this.apiservice.bidList(start, size)
        .map(data => data.json())
        .subscribe(
        data => {
          this.Pcontent = data.data;
          this.list_size = data.data.length;
          this.size_jugde = true;
          console.group('普通标条数')
          console.log(this.list_size);
          console.log(data.data);
          console.groupEnd();
        }
        )
    } else if (this.datas == '3') {
      this.apiservice.creditorList(start, size)
        .map(data => data.json())
        .subscribe(
        data => {
          this.Zcontent = data.data;
          this.list_size = data.data.length;
          this.size_jugde = true;
          console.group('债券条数')
          console.log(this.datas);
          console.log(this.list_size);
          console.log(data.data);
          console.groupEnd();
        }
        )
    }

  }
  // 体验标,然后唯独取出其体验标才
  contentlist() {
    //声明。保存全部体验标
    let Tarr = [];
    let firstTarr = [];
    this.apiservice.bidExperList()
      .map(data => data.json()).subscribe(
      data => {
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].type == '1') {
            Tarr.push(data.data[i]);
          }
        }
        //赋值，然后读取出索引0的体验标。
        let firstTarr = Tarr;
        this.Tcontent = firstTarr[0];
        // 当Tcontent内存在值才实例化；
        if (this.Tcontent != null && this.Tcontent != undefined) {
          this.Tcontent_id = firstTarr[0].id;
          this.Tcontent_type = firstTarr[0].type;
          this.rate = firstTarr[0].rate;
          this.isDay = firstTarr[0].isDay;
          this.cycle = firstTarr[0].cycle;
          this.status = firstTarr[0].status;
          this.remainAmount = firstTarr[0].remainAmount;
          console.group('体验标')
          console.log(this.Tcontent);
          console.groupEnd();
        }
      }
      )

  }
  //订阅事件
  reSet(){
    this.events.subscribe('user:Re',(user)=>{
      this.itemlist(this.pageindex, this.pagesize); //页面切换重新刷新
      this.contentlist();
      console.log('订阅事件执行啦。。。。')
      // this.events.unsubscribe('user:Re');
      // console.log('界面销毁');
    }); //订阅事件
  }
  
   

  //跳转到标的详情
  on_list_details(id, type) {
    this.navCtrl.push('ListDetailsPage', { id: id, type: type });
  }
  //跳转到债权
  on_invest_details(id, cid, bid) {
    console.log('因为债权标。在home[首页]页面和list[投资]页面，所需参数不一，重叠问题。 在home页面id是标id,cid是债权id。。在list页面id是债权id，bid是标id：' + this.datas)
    if (this.datas == 1) {
      this.navCtrl.push('ListDetailsPage', { id: id, type: 2, cid: cid });
    } else {
      this.navCtrl.push('ListDetailsPage', { id: bid, type: 2, cid: id });
    }

  }
}
