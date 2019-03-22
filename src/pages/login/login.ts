import { Component } from '@angular/core';
import {  NavController, ToastController } from 'ionic-angular';
import { SiparisTabsPage } from '../siparis-tabs/siparis-tabs'
import {AuthService} from "../../providers/auth-service";
import { Storage } from '@ionic/storage'; 

import { Http } from '@angular/http';
import { Signup } from '../signup/signup';

/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  
  resposeData : any;
  userData = {"username":"", "password":""};

  constructor(public navCtrl: NavController,
    public authService: AuthService, private toastCtrl:ToastController,
    public storage: Storage,
    public http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  login(){
    this.authService.postData(this.userData,'login').subscribe((result) => {
      console.log(result)
     
     this.resposeData = result;
    

    
   
    if(this.resposeData.userData){
     localStorage.setItem('userData', JSON.stringify(this.resposeData) )
     this.navCtrl.setRoot(SiparisTabsPage);
     console.log(this.userData)
  }
  else{
    this.presentToast("Kullanici adi yada Sifre Yanlis");
  }
    


    }, (err) => {
      this.presentToast("Kullanici adi ve sifre eksik");
    });
 

   }
   
  
  
  

  
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  signup() {
    this
      .navCtrl
      .push(Signup);
  }

}
