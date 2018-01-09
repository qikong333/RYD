import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { NativeServiveProvider }from '../../providers/native-servive/native-servive';
import { SERVER_URL }from '../../providers/constants/constants';

/**
 * Generated class for the RechargePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'RechargePage'
})
@Component({
  selector: 'page-recharge',
  templateUrl: 'recharge.html',
})
export class RechargePage {
  public tailFour:any;                //银行卡号截取后4位
  public tail_bankname:any;           //银行卡名字
  public tailFour_id:any;             //银行卡ID

  public phone:any;                   //获取手机号码
  public cz:any;                      //获取充值余额
  public all_money:any;               //总数
  public orderNo:any;                 //令牌

  public overAmountRB:any;            //获取账户余额
  public delaiameng:boolean;          //充值按钮的禁止

              

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public api:ApiServiceProvider,
     public alertCtrl:AlertController,
     public modalCtrl:ModalController,
     public nav:NativeServiveProvider,
     ) {
  }

  //返回上一页
  return(){
    this.navCtrl.pop();
  }

  //进入页面
  ionViewWillEnter(){
    this.int();
    this.all_list();
  }

  //初始化
  int(){
    this.phone='';
    this.cz='';
    this.orderNo='';
    this.delaiameng=false;
  }

  //监听input框的事件
  keyup(value){
    // let patt = /^((?!0)\d+(\.\d{1,2})?)$/g;
    // if(!patt.test(value)){
    //   this.cz='';
    // }
    this.all_money=Number(this.cz)+Number(this.overAmountRB);
  }

  //获取提现的所有的接口数据
  all_list(){

    //查找银行卡
    this.api.myBankList().map(data => data.json()).subscribe(data => {
        console.log(data);
        if (data.code == "000000") {
              if (data.data.myBankList.length > 0) {
                  this.tailFour = data.data.myBankList[0].bankNumber.substr(-4, 4); //银行卡号码--截取后4位
                  this.tail_bankname = data.data.myBankList[0].bankname;
                  this.tailFour_id = data.data.myBankList[0].id;
              } else {
                  return;
              }
          }
    });

    //获取账户余额
    this.api.account().map(data => data.json()).subscribe(data => {
      if(data.code=='000000'){
        this.overAmountRB=data.data.overAmountRB;
        this.all_money=Number(this.overAmountRB);
      }else{

      }
    })

  }

  //点击充值
  pay_value(type){
    // console.log(typeof pay_code)
    // console.log(typeof pay_phone)
    console.log(this.cz)
    console.log(this.phone)
    
    if (!Number(this.cz) || Number(this.cz) < 100) {
        this.showAlert('消息提醒','充值不能少于100元');
    }else if (Number(this.cz) > 100000) {
        this.showAlert('消息提醒','充值不能超过100000元');
    } else if (!(/(^[1-9]([0-9]*)$|^[0-9]$)/.test(this.cz))) {
        this.showAlert('消息提醒','充值数字不规范');
    } else if (!/^1[34578]\d{9}$/.test(this.phone)) {
        this.showAlert('消息提醒','手机有误，请重填');
    } else {
       this.all_data()
    }


  }

  //点击充值获取令牌
  all_data(){
    this.delaiameng=true;
    this.api.kJCharge(this.phone,this.cz).map(data => data.json()).subscribe(data => {

      //普通银行卡充值
      if(data.code == "000000"){
        this.delaiameng=true;        //禁止点击充值按钮
        this.orderNo=JSON.parse(data.data).orderNo;
        this.presentContactModal();
      }
      //招商银行卡充值
      else if (data.code == '000002') {
         this.orderNo=data.data.orderNo;
         this.nav.themeable(data.data.url).on('closeevent').subscribe(data => {
                this.api.kmjqSelect(SERVER_URL+'/app/rongbao/kmjqSelect.htm?orderNo='+this.orderNo+'').map(data => data.json()).subscribe(data => {
                   if(data.code=='000000'){
                     this.delaiameng=true;        //禁止点击充值按钮
                     this.presentContactModal();
                   }else{
                      this.showAlert('消息提醒',data.description);
                       this.delaiameng=false;
                   }
                })
            });
      }
      else{
        this.showAlert('消息提醒',data.description);
        this.delaiameng=false;
      }
    })
  }

  //弹窗
  showAlert(title,subTitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['确定']
    });
    alert.present();
  }

  //模态框
   presentContactModal() {
    let contactModal = this.modalCtrl.create('RechargeModalPage',{
      type:'充值',
      pay_code:this.cz,
      pay_phone:this.phone,
      pay_orderNo:this.orderNo
    });
    contactModal.onDidDismiss(data => {
      console.log(data);
      this.delaiameng=false;
      if(!data){
        this.orderNo='';
      }else{
        this.cz='';
        this.orderNo='';
        this.all_list();
      }
   });
    contactModal.present();
  }


  //限额说明
  toBankLimt(){
    this.navCtrl.push('BankLimtPage');
  }
}
