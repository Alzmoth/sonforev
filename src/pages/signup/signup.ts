import {Component} from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import {AuthService} from "../../providers/auth-service";

import {Login} from "../login/login";
import { SiparisTabsPage } from '../siparis-tabs/siparis-tabs';

/**
 * Generated class for the Signup page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({selector: 'page-signup', templateUrl: 'signup.html'})
export class Signup {
  resposeData : any;
  userData = {
  "username":"",
  "password":"",
  "email":"",
  "name":"",
  "sube":""};
  constructor(public navCtrl : NavController, public authService : AuthService,public alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup');
  }

  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Lightsaber color');

    alert.addInput({
      type: 'radio',
      label: 'Büsan',
      value: '1',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Toptancılar',
      value: '2',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Pendik',
      value: '3',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Manavgat',
      value: '4',
      checked: false
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.userData.sube=data;
      }
    });
    alert.present();
    console.log(this.userData)
  }

  signup() {
    if(this.userData.username && this.userData.password && this.userData.name){
      //Api connections
    this.authService.postData(this.userData, "signup").subscribe((result) => {
    this.resposeData = result;
    console.log(this.resposeData);
    localStorage.setItem('userData', JSON.stringify(this.resposeData) )
    this.navCtrl.push(SiparisTabsPage);
    }, (err) => {
      //Connection failed message
    });
  }
  else {
    console.log("Give valid information.");
  }
  
  }

  login() {
    this
      .navCtrl
      .push(Login);
  }

}
