import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, Platform } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import { SiparisListePage } from '../siparis-liste/siparis-liste'
import { ListeGosterSiparisPage } from '../liste-goster-siparis/liste-goster-siparis'
import { SiparisListeUrunDetayPage } from '../siparis-liste-urun-detay/siparis-liste-urun-detay'
import { SiparisSepetProvider } from '../../providers/siparis-sepet'

import { SiparisTabsPage } from '../siparis-tabs/siparis-tabs';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';


/**
 * Generated class for the SiparisListeDetayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-siparis-liste-detay',
  templateUrl: 'siparis-liste-detay.html',
})
export class SiparisListeDetayPage {


  saveData: any[] = [];
  resposeData: any;
  gelen: any;
  public fiyat_kaydi = {
    "toplam_fiyat": 0,
    "toplam_urun": 0,
    "fatura_no": 0
  }
  public dataSet: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController,
    public authService: AuthService,
    public siparisSepetProvider: SiparisSepetProvider,
    public toastController: ToastController,
    public file: File,
    public fileOpener: FileOpener,
    public platform: Platform) {

    this.gelen = navParams.get('item');
    console.log("nerde kalmıştık" ,this.gelen)
    //this.gelen.toplam_fiyat=this.gelen.toplam_fiyat*1;



  }

  ionViewDidLoad() {

    this.liste_getir()

  }
  public deneme = {
    name: "Mali"
  }
  letterObj = {

  }
  pdfObject: any;

  generatePDF() {

    var docDefinition = {
      content: [
        {
          columns: [
            {
              image: 'data:image/jpeg;base64,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EYQ1XFm5UUkav+EKM9TNXP5/IdHg+TOpbd8me9QHB8mdS275M96gc+qcTC4DmtZpjtAa2eAAAHzRMgagfLsOI3HFdmqYXsut0KjUadQI0imUdZOQI697dYUWmhp5/Qh2r4xXamSY0Ri5KLHqjcRe+wbmpKbMvkojIx5nB8mdS275M96gOD5M6lt3yZ71A+UYQQYWfgNn1XNsSZa5r2z4BaSQb0SoLsyOrgTt37V6ycY2wm4qbXipLPF6bHKJFlmajW00WuiS5/U+/wCYlIgHB8mdS275M96gd6iU2+mKmyurV2iS6eR/asxaY404otPBRvKIuf0MZWOumjYZFfLmtKYhGK29Fm2vujDF5NM6Crf8KYgOPzAbKhFyAACIAACIAACIAACIAACIAACIOjWKJT7ggrhVOGzOiL+8zIQS0n+RgA+EAihXJrnMcHMNCFGqZhqxqNKakQrVpcZ9pW8hbcdJGk/mQmSUklJERaEXcRAA4tY1mDRRZ481HmiHR4hcRvJP5XIAA5rWXA5AARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARf/2Q==',
              width: 350,
              height: 45
            },
            // {  İnoksan amblemi gerekirse açılacak
            //   image: 'data:image/jpeg;base64,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',
            //   margin: [10, 0, 0, 0],
            //   width: 150,
            //   height: 50
            // },
            [
              {
                text: 'TEKLİF NO :' + "123", style: 'sub_header',
                margin: [18, 15, 0, 0]
              },
              {
                text: 'TARİH :' + new Date().toLocaleDateString(), style: 'sub_header'
                , margin: [18, 0, 0, 0]
              },

            ]
          ],

        },
        [{
          text: 'PROFORMA TEKLİF FORMU', style: 'header',
          margin: [0, 0, 0, 10],
        },
          //  { text: this.deneme.name , style:'sub_header'},
        ],
        {
          columns: [{
            text: 'FİRMA ÜNVANI :', style: 'sol_header',
           
          },
          { text: '' + this.deneme.name, style: "bos", margin: [2, 0, 0, 0] },
          {
            text: 'TEKLİF HAZIRLAYAN : ', style: 'sag_header',
            width: 250,
          },
          { 
            text: '' + this.deneme.name, style: "bos", margin: [2, 0, 0, 0] }]
            
        },{
          columns: [{
            text: 'YETKİLİ :', style: 'sol_header',
           
          },
          { text: '' + this.deneme.name, style: "bos", margin: [2, 0, 0, 0] },
          {
            text: 'İLETİŞİM : ', style: 'sag_header',
            width: 250,
          },
          { 
            text: '' + this.deneme.name, style: "bos", margin: [2, 0, 0, 0] }]
            
        },
        {
          columns: [{
            text: 'İLETİŞİM :', style: 'sol_header',
           
          },
          { text: '' + this.deneme.name, style: "bos", margin: [2, 0, 0, 0] },
          {
            text: 'MAİL ADRES : ', style: 'sag_header',
            width: 250,
          },
          { 
            text: '' + this.deneme.name, style: "bos", margin: [2, 0, 0, 0] }]
            
        },
        {
          columns: [{
            text: 'MAİL ADRES :', style: 'sol_header',
           
          },
          { text: '' + this.deneme.name, style: "bos", margin: [2, 0, 0, 0] },
          {
            text: 'TEKLİF HAZIRLAYAN : ', style: 'sag_header',
            width: 250,
          },
          { 
            text: '' + this.deneme.name, style: "bos", margin: [2, 0, 0, 0] }]
            
        },
        
      ],
      styles: {
        header: {
          bold: true,
          fontSize: 17,
          alignment: 'center'
        },
        sub_header: {
          fontSize: 10,
          alignment: 'left'
        },
        sol_header: {
          fontSize: 11,
          alignment: 'left'
        },
        sag_header: {
          fontSize: 11,
          alignment: 'right'
        },
        url: {
          fontSize: 16,
          alignment: 'right'
        },
        bos: {
          fontSize: 11,

        }
      },
      padding:0,
      pageSize: 'A4',
      pageOrientation: 'portrait'
    };

    this.pdfObject = pdfMake.createPdf(docDefinition);

    this.downloadPdf();

  }

  downloadPdf() {

    if (this.platform.is('cordova')) {
      this.pdfObject.getBuffer((buffer) => {

        
        var utf8 = new Uint8Array(buffer);
        

        var blob = new Blob([buffer], { type: 'application/pdf' });
        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'hello.pdf', blob, { replace: true }).then(fileEntry => {

          this.fileOpener.open(this.file.dataDirectory + 'hello.pdf', 'application/pdf');

        });

      });

      return true;
    }

    this.pdfObject.download();


  }

  //download


  downloadCSV() {

    this.dataSet.forEach(element => {

      element.iskontolu_satis_fiyati = element.satis_fiyati - ((element.satis_fiyati / 100) * element.sabit_iskonto)
      element.toplam_fiyat = element.stok_adet * element.iskontolu_satis_fiyati;
      element.iskontolu_satis_fiyati = element.iskontolu_satis_fiyati + "TL";
      element.toplam_fiyat = Number(element.toplam_fiyat.toFixed(2))
      element.toplam_fiyat = element.toplam_fiyat + " TL"
      if (element.barkod == null) {
        element.barkod = 0;
      }
      delete element.stok_id;

      console.log("iskonto", element);

    });

    let a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    let csvData = this.ConvertToCSV(this.dataSet);

    a.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csvData));
    a.download = this.gelen.fatura_no + '.csv';
    a.click();
  }

  ConvertToCSV(objArray) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = "";
    for (let index in objArray[0]) {
      //Now convert each value to string and comma-separated
      row += index + ';';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';

    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        if (line != '') line += ';';
        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }

  itemTapped(event, item) {
    console.log(item)
    item.stok_olcu_birim = "Adet";


    this.navCtrl.push(SiparisListeUrunDetayPage, { item: item });

  }

  liste_getir() {

    this.authService.postData(this.gelen, "siparis_liste_detay_getir")
      .subscribe((result) => {

        this.resposeData = result;

        this.dataSet = this.resposeData.feedData;
        console.log(this.dataSet);

        this.toplamfiyathesapla();
      }, (err) => {
        //Connection failed message
      });


  }

  saatcevir(time) {

    let a = new Date(time * 1000);
    return a;
  }

  toplamfiyathesapla() {
    this.fiyat_kaydi.toplam_fiyat = 0;

    this.dataSet.forEach(element => {
      console.log("bu var", element);
      this.fiyat_kaydi.toplam_urun = (this.fiyat_kaydi.toplam_urun * 1) + (element.stok_adet * 1);
      element.iskontolu_satis_fiyati = element.satis_fiyati - ((element.satis_fiyati / 100) * (element.sabit_iskonto));
      this.fiyat_kaydi.fatura_no = element.fatura_no;
      this.fiyat_kaydi.toplam_fiyat = (this.fiyat_kaydi.toplam_fiyat * 1) + ((element.iskontolu_satis_fiyati * 1) * (element.stok_adet * 1))

    });
  }

  kaydet() {

    this.fiyat_kaydi.toplam_fiyat = 0;

    this.dataSet.forEach(element => {
      console.log("bu var", element);
      this.fiyat_kaydi.toplam_urun = (this.fiyat_kaydi.toplam_urun * 1) + (element.stok_adet * 1);
      element.iskontolu_satis_fiyati = element.satis_fiyati - ((element.satis_fiyati / 100) * (element.sabit_iskonto));
      this.fiyat_kaydi.fatura_no = element.fatura_no;
      this.fiyat_kaydi.toplam_fiyat = (this.fiyat_kaydi.toplam_fiyat * 1) + ((element.iskontolu_satis_fiyati * 1) * (element.stok_adet * 1))
      this.authService.postData(element, "siparis_guncelle")
        .subscribe((result) => {
          this.resposeData = result;




        }, (err) => {
          //Connection failed message
        });


    });


    this.gelen.toplam_fiyat = this.fiyat_kaydi.toplam_fiyat;
    this.gelen.urun_adedi = this.fiyat_kaydi.toplam_urun;
    this.authService.postData(this.fiyat_kaydi, "toplam_fiyat")
      .subscribe((result) => {
        this.resposeData = result;




      }, (err) => {
        //Connection failed message
      });
    this.fiyat_kaydi.toplam_urun = 0;
    this.showToast2();

  };

  sil() {
    let alert = this.alertCtrl.create({
      title: 'Kayit sil',
      message: 'Silmek istedinizden emin misiniz?',
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

            this.authService
              .postData(this.gelen, "siparis_list_sil")
              .subscribe((result) => {
                this.resposeData = result;
                this.showToast();
                this.navCtrl.push(SiparisListePage);

              }, (err) => {
                //Connection failed message
              });
          }
        }
      ]
    });
    alert.present();


  }

  showToast() {
    let toast = this.toastController.create({
      message: 'Stok Kaydı silindi',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  showToast2() {
    let toast = this.toastController.create({
      message: 'Stok Kaydi Guncellendi',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  yazdir() {
    this.dataSet.forEach(element => {

      element.iskontolu_satis_fiyati = element.satis_fiyati - ((element.satis_fiyati / 100) * element.sabit_iskonto)
      element.toplam_fiyat = element.stok_adet * element.iskontolu_satis_fiyati;
      element.iskontolu_satis_fiyati = element.iskontolu_satis_fiyati;
      element.toplam_fiyat = Number(element.toplam_fiyat.toFixed(2))
      element.toplam_fiyat = element.toplam_fiyat + " TL"
      if (element.barkod == null) {
        element.barkod = 0;
      }
      delete element.stok_id;

      console.log("iskonto", element);

    });

    this.navCtrl.push(ListeGosterSiparisPage, { item: this.dataSet, item2: this.gelen });
  }
  devamet() {
    this.dataSet.forEach(element => {
      element.kdv_dahil_satis_fiyat = element.satis_fiyati;
      element.urun_adet = element.stok_adet;
      this.siparisSepetProvider.addToCart(element);

    });
    this.navCtrl.setRoot(SiparisTabsPage);

  }

}
