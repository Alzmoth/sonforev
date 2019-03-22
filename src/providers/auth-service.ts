import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

//let apiUrl = "http://localhost/PHP-Slim-Restful/api/";
let apiUrl = 'http://katalog.forev.com.tr/PHP-Slim-Restful-master/api/';
/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class AuthService {

  constructor(public http: Http) {
    console.log('Hello AuthService Provider');
  }

  postData(credentials, type){
   
    let headers = new Headers();
    console.log(JSON.stringify(credentials),type)
    return this.http.post(apiUrl + type, JSON.stringify(credentials),{headers:headers})
   
    .map(res => res.json())
    
      
      
    

  




  }

}
