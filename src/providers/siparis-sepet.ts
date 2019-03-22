import { Injectable } from '@angular/core';
import { Urun } from '../entities/urunler'
import { SiparisSepetUrun } from '../entities/siparis-sepet-urun'
import { siparis_sepet_urun } from '../entities/siparis_sepet_list'
import { AuthService } from './auth-service'

@Injectable()
export class SiparisSepetProvider {

  siparissepetUrun: SiparisSepetUrun[];
  public dataSet: any[] = [];
  public dataSet1: any[] = [];
  public userDetails: any;
  public resposeData:any;
  postData: Urun;
  gelen: any;
  userPostData = {
    "user_id": "",
    "token": "",
    "stok_kayit_id": "",
    "aciklama": "",
    "cari_id":"",
    urun_adedi: 0,
    toplam_fiyat: 0,
    genel_iskonto:0
  };
  public toplam_urun ={
    "toplam_fiyat":0,
    "toplam_urun_adet":0

  } 
  
  stokPostData = {
    barkod: 0,
    "firma_kodu": "",
    stok_adet: 1,
    "stok_adi": "",
    "stok_kodu": "",
    "fatura_no": ""

  };

  public gelenaciklama: any;

  gelenveri: any;

  constructor(public authService: AuthService) {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
    this.userPostData.user_id = this.userDetails.user_id;
    this.userPostData.token = this.userDetails.token;
   
  }

  veritabanındangelen(urun: Urun): void {
    console.log(urun)
    var addedItem = siparis_sepet_urun.find(t => t.urun.stok_kodu == urun.stok_kodu);
    if (addedItem) {

      addedItem.urun.stok_adet =  urun.stok_adet * 1;
    
    }
    else {
      let siparisUrun = new SiparisSepetUrun();
      siparisUrun.urun = urun;
      siparisUrun.urun_toplam_fiyat = (siparisUrun.urun.urun_adet * siparisUrun.urun.kdvsiz_satis_fiyat)
      this.toplam_urun.toplam_urun_adet= ((this.toplam_urun.toplam_urun_adet)*1 + (siparisUrun.urun.urun_adet)*1);

      this.toplam_urun.toplam_fiyat = this.toplam_urun.toplam_fiyat +
      (siparisUrun.urun_toplam_fiyat - ((siparisUrun.urun_toplam_fiyat/100) * siparisUrun.urun.sabit_iskonto));
      
      siparis_sepet_urun.push(siparisUrun);
      console.log("ilk kez" + siparisUrun);


    }
  }

  addToCart(urun: Urun): void {
    console.log(urun)
    var addedItem = siparis_sepet_urun.find(t => t.urun.stok_kodu == urun.stok_kodu);
    if (addedItem) {

      addedItem.urun.stok_adet =  urun.stok_adet * 1;
    
    }
    else {
      let siparisUrun = new SiparisSepetUrun();
      siparisUrun.urun = urun;
      siparisUrun.urun_toplam_fiyat = (siparisUrun.urun.urun_adet * siparisUrun.urun.kdvsiz_satis_fiyat)
      this.toplam_urun.toplam_urun_adet= ((this.toplam_urun.toplam_urun_adet)*1 + (siparisUrun.urun.urun_adet)*1);

      this.toplam_urun.toplam_fiyat = this.toplam_urun.toplam_fiyat +
      (siparisUrun.urun_toplam_fiyat - ((siparisUrun.urun_toplam_fiyat/100) * siparisUrun.urun.sabit_iskonto));
      
      siparis_sepet_urun.unshift(siparisUrun);
      console.log("ilk kez" + siparisUrun);


    }
  }

  list(): SiparisSepetUrun[] {
    return siparis_sepet_urun;
  }

  toplam() {
    return this.toplam_urun;
  } 

  clear() {
    siparis_sepet_urun.splice(0, siparis_sepet_urun.length);
    

  }
  clearveritabani(){

        this.authService
          .postData(this.userPostData, "siparis_sepet_sil")
          .subscribe((result) => {
              this.resposeData = result;
            },
            err => {
              //Connection failed message
            }
          );
  }

  clearsepettenurun(){
    
    this.authService
      .postData(this.stokPostData, "siparis_urun_sil")
      .subscribe((result) => {
          this.resposeData = result;
        },
        err => {
          //Connection failed message
        }
      );
}


  removeFromCart(urun) {
    console.log("hello",urun)
    var addedItem = siparis_sepet_urun.find(t => t.urun.stok_kodu == urun.urun.stok_kodu);
    var indexNo = siparis_sepet_urun.indexOf(addedItem);
    if (indexNo != -1) {
      siparis_sepet_urun.splice(indexNo, 1);
    }
    this.stokPostData.stok_kodu= urun.urun.stok_kodu;
    this.stokPostData.stok_adi = this.userPostData.user_id; // tek seferlik ürünü silmek için apiye gönderilmek üzere böyle bir işlem yapılıyor sıkıntı
    this.clearsepettenurun();
  }

  stokkayit(gelen) {
    this.userPostData.toplam_fiyat= this.toplam_urun.toplam_fiyat;
    this.userPostData.urun_adedi=this.toplam_urun.toplam_urun_adet;
    this.userPostData.aciklama = gelen.aciklama;
    this.userPostData.cari_id=gelen.cari_id;
    console.log(this.userPostData,"burayada mı gelmiyor");
    this.authService
      .postData(this.userPostData, "siparis_fatura_kayit")//fatura ive isim kaydediliyor ve fatura no çagırılıyor ve kullanılıyor
      .subscribe((result) => {
        this.gelenveri = result;
        this.dataSet = this.gelenveri.feedData;

        console.log("buraya geldi")


        for (var index = 0; index < siparis_sepet_urun.length; index++) {
          var element = siparis_sepet_urun[index];
          element.urun.fatura_no = this.gelenveri.feedData.fatura_no;
       
          console.log(element,"bak bakalım nasilmis")
          this.authService.postData(element.urun, "siparis_kayit").subscribe((result) => {
            this.gelen = result;
            this.dataSet = this.gelen.feedData;

            this.stokPostData.fatura_no = "";

          });

        }
        this.clear();
        this.clearveritabani();


      }, (err) => {
        //Connection failed message
      });

  

  }
  urunkaydet() {



    // urunler faturaid ye geri veritabanına kaydediliyor


  }

}
