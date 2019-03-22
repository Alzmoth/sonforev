import { Component } from '@angular/core';
import {  NavController, NavParams, ToastController,AlertController } from 'ionic-angular';
import { stoksepetprovider } from '../../providers/stok-sepet-provider'
import { SayimSepetUrun } from '../../entities/sayim-sepet-urun'

import { Common } from "../../providers/common";
import { AuthService } from "../../providers/auth-service";
/**
 * Generated class for the StokSepetPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: "page-stok-sepet",
  templateUrl: "stok-sepet.html"
})
export class StokSepetPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public stoksepetservis: stoksepetprovider,
    public common: Common,
    public authService: AuthService,
    public toastController: ToastController,
    public alertCtrl: AlertController
  ) {}
  //componentler
  public userDetails: any;

  //liste adı ve userid de gönderilmesi gerekiyor

  sayimsepetUrun: SayimSepetUrun[] = [];
  stok_fatura = {
    aciklama: ""
  };

  ionViewDidLoad() {
    this.sayimsepetUrun = this.stoksepetservis.list();

    const data = JSON.parse(localStorage.getItem("userData"));
    this.userDetails = data.userData;
  }
  ilgilikisi(){
    const confirm = this.alertCtrl.create({
      title: 'Use this lightsaber?',
      message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      
      inputs: [
        {
           name: 'İlgili Adi',
           placeholder: 'ilgili_adi'
        },
        {
          name: 'Ilgili Telefonu',
          placeholder: 'ilgili_tel'
        },
        {
          name: 'Ilgili mail',
          placeholder: 'ilgili_mail'
        }
],
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: data => {
    
            console.log(JSON.stringify(data)); //to see the object
            console.log(data.FirstName);
            console.log(data.LastName);
        }
        }
      ]
    });
    confirm.present();
 
  }
  kaydet() {
    this.stoksepetservis.stokkayit(this.stok_fatura.aciklama);
    this.stok_fatura.aciklama = "";
    this.showToast();
  }
  sil() {
    let alert = this.alertCtrl.create({
      title: "Sepeti Temizle",
      message: "Sepeti silmek istedinizden emin misiniz?",
      buttons: [
        {
          text: "İptal",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Sil",
          handler: () => {
            this.sildir();
          }
        }
      ]
    });
    alert.present();
  }

  sildir() {
    this.stok_fatura.aciklama = "";

    this.stoksepetservis.clear();
    this.stoksepetservis.clearveritabani();
  }
  adettt:any;

  updatestok(){
    console.log(this.adettt);
    
    this.deneme();


  }

  deneme(){
    console.log("bok")
  }


  showToast() {
    let toast = this.toastController.create({
      message: "Liste kaydedildi",
      duration: 1000,
      position: "middle"
    });
    toast.present();
  }
}
