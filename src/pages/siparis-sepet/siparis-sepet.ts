import { Component } from '@angular/core';
import { Modal, NavController,ModalOptions, NavParams, ToastController, AlertController,ItemSliding, ModalController } from 'ionic-angular';
import { SiparisSepetProvider } from '../../providers/siparis-sepet'
import { SiparisUrunDetayPage } from '../siparis-urun-detay/siparis-urun-detay'

import { SiparisSepetUrun } from '../../entities/siparis-sepet-urun'

import { Common } from "../../providers/common";

import { Storage } from '@ionic/storage'; 
import { AuthService } from '../../providers/auth-service';
//import { Urun } from '../../entities/urunler';

/**
 * Generated class for the SiparisSepetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



@Component({
  selector: 'page-siparis-sepet',
  templateUrl: 'siparis-sepet.html',
})
export class SiparisSepetPage {
 

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public siparissepetservis: SiparisSepetProvider,
    public common: Common,
    public storage: Storage,
    public toastController: ToastController,
    public alertCtrl:AlertController,
    private modal:ModalController,
    private authService:AuthService
    ) {
  }
  //componentler
  public postData:any;
  public resposeData:any;
  public userDetails: any;
  public sepet_fiyat=0;
  public sepet_adet=0;
  //public toplam: any;
  public toplam = {
    "toplam_fiyat": 0,
    "toplam_urun_adet": 0
  }

  //liste adı ve userid de gönderilmesi gerekiyor

  siparisepetUrun: SiparisSepetUrun[] = [];
  stok_fatura = {
    "aciklama": "" ,
    "musteri_ismi":"",
     cari_id:0
  }

  ionViewDidLoad() {
   
    this.siparisepetUrun = this.siparissepetservis.list();
    this.toplam = this.siparissepetservis.toplam();


    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;

   
  }
openModal(){ // didmiss kullanırsan geç alır will dismis dersen hızlı alır

  const myModalOptions:ModalOptions={
    enableBackdropDismiss:false,
    showBackdrop:true
    
  }
  const myModalData={
    name:"diriri"
  }
  const myModal : Modal =this.modal.create('CarisecPage' , {data:myModalData}, myModalOptions);
  myModal.present();
  myModal.onDidDismiss((data)=>{
    if(data.cari_adi){
      console.log(data)
      this.stok_fatura.musteri_ismi=data.cari_adi;
      this.postData= data;

      if(this.postData.cari_id!=0 && this.postData.cari_id!=null){
        (this.postData.cari_id*1);
        console.log("son kontrol carili", this.postData)
        this.authService.postData(this.postData, "cari_guncelle")
        .subscribe((result) => {
  
          this.resposeData = result;
  
          console.log(this.resposeData,"kayit oldi mi")
  
        }, (err) => {
          //Connection failed message
        });
  
      }else{
        this.postData.cari_id=0;
      console.log("son kontrol yeniolustur", this.postData)
      this.authService.postData(this.postData,"cari_olustur")
      .subscribe((result) => {

        this.resposeData = result;

        console.log(this.resposeData,"kayit oldi mi")

      }, (err) => {
        //Connection failed message
      });

      }
   

    }
    if(data.cari_id!=null && data.cari_id1!=0){
      console.log("buraya gelmiyorsun demi")
    this.stok_fatura.cari_id=data.cari_id;
   // console.log(this.stok_fatura)

    }
  })
}

  kaydet() {
    this.siparissepetservis.stokkayit(this.stok_fatura);
    console.log("buraya geldi")
    this.stok_fatura.aciklama = "";
    this.toplam.toplam_fiyat = 0;
    this.toplam.toplam_urun_adet = 0;
    this.showToast();
  }

  sil() {
    
    let alert = this.alertCtrl.create({
      title: 'Sepeti Temizle',
      message: 'Sepeti silmek istedinizden emin misiniz?',
      buttons: [
        {
          text: 'İptal',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Sil',
          handler: () => {

            this.sildir();

          }
        }
      ]
    });
    alert.present();
  }
  showPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Cari oluştur',
      message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
        {
          name: 'title1',
          placeholder: 'Title'
        },
        {
          name: 'title2',
          placeholder: 'Title'
        },
        {
          name: 'title2',
          placeholder: 'Title'
        },
        {
          name: 'title2',
          placeholder: 'Title'
        },
        {
          name: 'title2',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          
            handler: data => {
              console.log(JSON.stringify(data)); //to see the object
         
            
          }
          
        }
      ]
    });
    prompt.present();
  }

  sildir(){
    this.stok_fatura.aciklama = "";
    this.toplam.toplam_fiyat = 0;
    this.toplam.toplam_urun_adet = 0;
    this.siparissepetservis.clear();
    this.siparissepetservis.clearveritabani();

  }

  guncelle(){
    
    this.toplam.toplam_fiyat=0;
    this.toplam.toplam_urun_adet=0;
    this.siparisepetUrun.forEach(element => {
      this.toplam.toplam_fiyat += ((element.urun.kdvsiz_satis_fiyat) - ((element.urun.kdvsiz_satis_fiyat/100)*element.urun.sabit_iskonto))*element.urun.urun_adet;
      this.toplam.toplam_urun_adet+= (element.urun.urun_adet*1);
     console.log(this.toplam.toplam_fiyat)
    });
    
  }

    more(event,urun ,item:ItemSliding) {
      console.log(urun);
      //urun.urun.stok_olcu_birim= urun.urun.olcu_birim
      this.navCtrl.push(SiparisUrunDetayPage, { item: urun.urun });
     
    }

  
    delete(event,urun) {
    console.log("haydaa",urun)
      let alert = this.alertCtrl.create({
        title: "Urunu Sil",
        message: "Urunu silmek istediginizden Emin misiniz?",
        buttons: [
          {
            text: "İptal",
            role: "cancel",
            handler: () => {
         
            }
          },
          {
            text: "Sil",
            handler: () => {
              this.siparissepetservis.removeFromCart(urun);
              
              this.guncelle();
            }
          }
        ]
      });
      alert.present();
      
    }
  
    mute(item: ItemSliding) {
      console.log('Mute');
      item.close();
      
    }
  
 

  showToast() {
    let toast = this.toastController.create({
      message: 'Liste kaydedildi',
      duration: 1000,
      position: 'middle'
    });
    toast.present();
  }

}
