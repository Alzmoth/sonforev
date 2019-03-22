import { Component } from '@angular/core';
import { Modal,ModalController,ModalOptions, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import 'rxjs/add/operator/map';
import { AuthService } from "../../providers/auth-service";

/**
 * Generated class for the CarisecPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-carisec',
  templateUrl: 'carisec.html',
})
export class CarisecPage {

  cariPostData = {
    
    search: "",
    sayac: 0
  };
  queryText: any;
  searchTerm: any;
  public resposeData: any;
  public noRecord: boolean;
  public dataSet: any[] = [];
  public datason:any;


  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public view:ViewController,
    public authService: AuthService,
    private modal:ModalController) {
  }

  ionViewWillLoad() {
    this.getcari()

  }

  itemTapped(event, carii) {

    //this.getcari();
    const myModal : Modal =this.modal.create('CariolusturPage' , {cariData:carii},);
    myModal.present();
    myModal.onWillDismiss(caridata=>{
      console.log(caridata,"geldi sonunda")
      this.datason=caridata
      if(caridata.cari_adi){
        this.view.dismiss(this.datason);
      }
    })
  
  }


  openModal(){ // didmiss kullanırsan geç alır will dismis dersen hızlı alır

    const myModalOptions:ModalOptions={
      enableBackdropDismiss:false,
      showBackdrop:true
      
    }

    const myModal : Modal =this.modal.create('CariolusturPage' , myModalOptions);
    myModal.present();
    myModal.onWillDismiss((cariData)=>{
      console.log("neden gelmiyorsun")

      
      if(cariData.cari_adi){
        this.view.dismiss(cariData);
      }
      console.log(cariData,"öyle mi dersin")
    })
  }

  closeModal(){
    this.view.dismiss(0);

  }

  getcari() {
    this.dataSet.slice;
    this.cariPostData.sayac = 0;
    this.authService.postData(this.cariPostData, "cari_cek").subscribe((result) => {
        this.resposeData = result;

        this.dataSet = this.resposeData.feedData;
        console.log(this.dataSet);
      },
      err => {
        //Connection failed message
      }
    );
  }

  doInfinite(): Promise<any> {
    console.log("Begin async operation");

    return new Promise(resolve => {
      setTimeout(() => {
        this.cariPostData.sayac += 50;

        this.authService
          .postData(this.cariPostData, "cari_cek")
          .subscribe((result) => {
              this.resposeData = result;
              if (this.resposeData.feedData.length) {
                const newData = this.resposeData.feedData;
                // kontrol et
                for (let i = 0; i < newData.length; i++) {
                  this.dataSet.push(newData[i]);

                }
                console.log(this.cariPostData.sayac)
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
  public search(queryText) {
    console.log(queryText)
    if (this.queryText.length >= 2) {
      this.cariPostData.search = this.queryText;
      this.getcari();
    } else if (this.queryText.length == 0) {
      this.cariPostData.search = "";
      this.getcari();
    } else {
      this.cariPostData.search = "";
    }
  }
  yeniCari(){

  }

}
