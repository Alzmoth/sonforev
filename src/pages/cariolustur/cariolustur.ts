import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController ,ViewController} from 'ionic-angular';



/**
 * Generated class for the CariolusturPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-cariolustur',
  templateUrl: 'cariolustur.html',
})
export class CariolusturPage {
   cariData={
    "cari_adi":"",
    "cari_adres":"",
    "cari_mail":"",
    "cari_tel": "",
    "ilgili_adi": "",
    "ilgili_mail":"",
    "ilgili_tel": "",
    "teslim_adres":"",
    "vergi_dairesi": "",
    "vergi_no":"",
    "odeme_plan":"",
    "yetkili_adi": "",
    "yetkili_mail": "",
    "yetkili_tel":""}
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController,private view:ViewController,
   
    ) {
 
  }

  ionViewWillLoad() {
    if(this.navParams.get("cariData")){
      this.cariData = this.navParams.get('cariData');
    }
    
    
  }


  closeModal(){
 
    this.view.dismiss(0);
  
  
    /*this.navCtrl.setRoot(SiparisTabsPage);*/
  }

  ilgilikisi(){
    const confirm = this.alertCtrl.create({
      title: 'Ilgili bilgileri',
      message: 'İlgili kişi ile bilgi varsa giriniz(zorunlu degildir)',
      
      inputs: [
        {
           name: 'ilgili_adi',
           placeholder: 'İlgili Adi'+" = "+ this.cariData.ilgili_adi
        },
        {
          name: 'ilgili_tel',
          placeholder: 'Ilgili Telefonu'+" = "+ this.cariData.ilgili_tel
        },
        {
          name: 'ilgili_mail',
          placeholder: 'Ilgili mail'+" = "+ this.cariData.ilgili_mail
        }
],
      buttons: [
        {
          text: 'İptal',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Kaydet',
          handler: data => {
            this.cariData.ilgili_tel=data.ilgili_tel;
            this.cariData.ilgili_mail=data.ilgili_mail;
            this.cariData.ilgili_adi=data.ilgili_adi;
            console.log(JSON.stringify(data)); //to see the object
            console.log(data.FirstName);
            console.log(data.LastName);
        }
        }
      ]
    });
    confirm.present();
 
  }





  
  yetkilikisi(){
    const confirm = this.alertCtrl.create({
      title: 'Yetkili bilgileri',
      message: 'Yetkili kişi ile bilgi varsa giriniz(zorunlu degildir)',
      
      inputs: [
        {
           name: 'yetkili_adi',
           placeholder: "Yetkili Adi" +" = "+this.cariData.yetkili_adi,
        },
        {
          name: 'yetkili_tel',
          placeholder: 'yetkili Telefonu'+" = "+ this.cariData.yetkili_tel
        },
        {
          name: 'yetkili_mail',
          placeholder: 'yetkili mail'+" = "+ this.cariData.yetkili_mail
        }
],
      buttons: [
        {
          text: 'İptal',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Kaydet',
          handler: data => {
            this.cariData.yetkili_tel=data.yetkili_tel;
            this.cariData.yetkili_mail=data.yetkili_mail;
            this.cariData.yetkili_adi=data.yetkili_adi;
            console.log(JSON.stringify(data)); //to see the object
            console.log(data.FirstName);
            console.log(data.LastName);
        }
        }
      ]
    });
    confirm.present();
 

  }
  Kayit(){



    this.view.dismiss(this.cariData);
   
  }
}
