import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

/**
 * Generated class for the RealnamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'RealnamePage'
})
@Component({
  selector: 'page-realname',
  templateUrl: 'realname.html',
})
export class RealnamePage {
  public real_name:any;           //真实姓名
  public card:any;                //身份证
  public yzm:any;                 //验证码
  public verBase64:any;           //图片验证码
  public submit_phone:boolean;    //确定禁止按钮

  public tianxie:boolean;         //判断是否已经填写
  public bid_name:any;            //已开通的真实姓名
  public bid_cad:any;            //已开通的真实姓名

  public ZC:boolean;              //判断是否从注册成功后那边过来的，从而判断返回键是返回到上一页还是根目录

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public api:ApiServiceProvider,
    public alertCtrl:AlertController
    ) {
  }

    //进入页面
  ionViewWillEnter(){
    this.int();
    this.refreshCode();
  }

  //将要离开页面
  ionViewWillLeave(){
     this.api.user().map(data => data.json()).subscribe(data => {
      console.log(data);
      if (data.code == '000000') {
        let information ={
            'realName':data.data.realName,         //保存用户名字
         };
         localStorage.setItem('personal',JSON.stringify(information));
      } else {
        console.log('没有个人信息')
      }

    })
  }

  //默认进入页面的
  int(){
    console.log(this.navParams.get('type'));
    console.log(this.navParams.get('name'));
    console.log(this.navParams.get('cad'));
    
    if(this.navParams.get('type')=='已开通'){
       this.tianxie=true;
       this.bid_name=this.navParams.get('name');
       this.bid_cad=this.navParams.get('cad');
     }else{
       this.tianxie=false;
       this.real_name='';
       this.card='';
       this.yzm='';
       this.verBase64='';
       this.submit_phone=false;
     }
  }

  //返回上一页
  return(){
    this.navCtrl.pop();
  }

   //刷新图片验证码
  refreshCode(){
    this.api.smrzVerify().map(data => data.json()).subscribe(data => {
        console.log(data);
        this.verBase64 = "data:image/jpg;base64," + data.data;
        this.yzm='';
    });
  }

  //确定
  submitPassword(real_name,card,yzm){
    if(!real_name || !card || !yzm){
        this.showAlert('消息提醒','请填写完整');
    }else if(!/^([\u4e00-\u9fa5]{2,6})$/.test(real_name)){
        this.showAlert('消息提醒','姓名格式不对');        
    }else{
        this.submit_phone=true;
        this.api.setUserInfo(real_name,card,yzm).map(data => data.json()).subscribe(data => {
             if (data.code == '000000') {
                  if(this.navParams.get('ZC_type')=='注册'){
                     this.showAlert('开通银行存管成功','恭喜您获得130元现金券');
                     this.navCtrl.pop();
                  }else{
                     this.navCtrl.pop();
                  }
              } else {
                  this.showAlert('消息提醒',data.description);
                  this.refreshCode();
                  this.submit_phone=false;
              }
        })
    }
  }

   //弹窗接口
  showAlert(title,subTitle){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['确定']
    });
    alert.present();
  }



}
