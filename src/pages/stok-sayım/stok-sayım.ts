import { Component } from '@angular/core';
import {  NavController, App, AlertController,Refresher,ToastController } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import {stoksepetprovider} from '../../providers/stok-sepet-provider'
import { Common } from "../../providers/common";
import { UrunDetayPage} from '../urun-detay/urun-detay'

/**
 * Generated class for the StokSayımPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-stok-sayım', templateUrl: 'stok-sayım.html',
})
export class StokSayımPage {

  public resposeData: any;
  public resposeData2: any;
  public resposeData3: any;
  public dataSet: any[] = [];
  public dataSet1: any[] = [];
  public dataSet2: any[] = [];
  public kategori: any[] = [];
  public kategori2: any;
  public userDetails: any;
  public noRecord:boolean;
  public segment = 'Stoklar';

  searchTerm: any;
  queryText:any;
  secilenKategori:string;
  stokPostData = {
    kategori: "",
    search: "",
      sayac:0
  };
  userPostData = {
    "user_id": "",
    "token": ""
  };


  constructor(public common: Common,
    public navCtrl: NavController, public app: App,
    public authService: AuthService,
    public sepetprovider: stoksepetprovider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController) 
    
    {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
    this.userPostData.user_id = this.userDetails.user_id;
    this.userPostData.token = this.userDetails.token;
    this.noRecord=false;

  }

  ionViewDidLoad() {
    //this.getFeed();
    this.getkategori();
    this.getstok();
    this.getsepet();
    this.segment = 'Stoklar';
  }

  getkategori() {
  
    this.authService.postData(this.stokPostData, "kategori")
    .subscribe((result) => {
        this.resposeData = result;
        this.common.closeLoading();
        this.kategori = this.resposeData.feedData;
        this.kategori2 = this.kategori;
        console.log(this.kategori);


      }, (err) => {
        //Connection failed message
      });

  }
  getstok() {
    this.stokPostData.sayac = 0;
    console.log(this.stokPostData)
    console.log(this.stokPostData.sayac,"sayacccccc")

    this.authService.postData(this.stokPostData, "stok_sayim")
    .subscribe((result) => {
        this.resposeData2 = result;
        this.dataSet = this.resposeData2.feedData;
        console.log(this.dataSet);
        


      }, (err) => {
        //Connection failed message
      });

  }

  doInfinite(): Promise<any> {
    console.log("Begin async operation");

    return new Promise(resolve => {
      setTimeout(() => {
        this.stokPostData.sayac += 50;

        this.authService.postData(this.stokPostData, "stok_sayim")
        .subscribe((result) => {
              this.resposeData2 = result;
              if (this.resposeData2.feedData.length) {
                const newData = this.resposeData2.feedData;
                // kontrol et
                for (let i = 0; i < newData.length; i++) {
                  this.dataSet.push(newData[i]);

                }
                console.log(this.stokPostData.sayac)
              } else {
                this.noRecord = true;
              }

            },
            err => {
              //Connection failed message
            }
          );
        // api çagırılır

        console.log("Async operation has ended");
        resolve();
      }, 200);
    });
  }
  getsepet() {
    this.authService.postData(this.userPostData, "stok_sepet_getir")
    .subscribe((result) => {
        this.resposeData3 = result;
        this.dataSet2 = this.resposeData3.feedData;
        console.log(this.dataSet2)
        if (this.dataSet2.length != 0) {
          let alert = this.alertCtrl.create({
            title: 'Sepette urun var',
            message: 'Sepette run var devam edilsin mi?',
            buttons: [

              {
                text: 'Devam Et',
                handler: () => {

                }
              }
            ]
          });
          alert.present();
          this.sepetprovider.clear();

          this.dataSet2.forEach(element => {
            this.sepetprovider.addToCart(element);
          });
        }

      }, (err) => {
        //Connection failed message
      });

  }


  public search(queryText) {
    console.log(queryText)
    console.log("hello")
    if (this.queryText.length >= 2) {
      this.stokPostData.search = this.queryText;
      this.getstok();
    } else if (this.queryText.length == 0) {
      this.stokPostData.search = "";
      this.getstok();
    } else {
      this.stokPostData.search = "";
    }
  }

  

   kat(event, firma) {
    console.log(firma)
    this.stokPostData.kategori = firma.firma_kodu;
    console.log(this.stokPostData);
    this.getstok();
    this.segment = 'Stoklar';
  }

  kattemizle() {
    this.kategori = this.kategori2;
  }
  filterItems(searchTerm) {
    //  this.kattemizle();
    return this.kategori.filter((firma) => {
      return firma.firma_adi.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }
  sayac2 = 0;
  setFilteredItems() {

    if (this.searchTerm.length > this.sayac2) {

      this.kategori = this.filterItems(this.searchTerm);
      this.sayac2++;

    } else {
    this.sayac2--;
      this.kattemizle();
    }


  }

itemTapped(event, urun){
   /* this.authService.postData(urun, "detay_katagori") // ürünü seçince firmasını yazması içindi
      .subscribe((result) => {
        this.resposeData = result;
        this.dataSet1 = this.resposeData.feedData;

        urun.firma_adi = this.dataSet1[0].firma_adi;

      }, (err) => {
        //Connection failed message
      });*/
      this.getstok();
      
    this.navCtrl.push(UrunDetayPage, { item: urun });

  }

  doRefresh(refresher: Refresher) {

    this.stokPostData.kategori = "";
    this.stokPostData.sayac = 0;
    this.stokPostData.search = "";
    this.queryText = "";
    this.getstok();
    // simulate a network request that would take longer
    // than just pulling from out local json file
    setTimeout(() => {
      refresher.complete();

      const toast = this.toastCtrl.create({
        message: 'Sıfırlandı',
        duration: 1000
      });
      toast.present();
    }, 1000);

  }

}
