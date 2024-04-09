import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import * as imp from '../../import-services/CommonimportFiles'
const Url = imp.environment.apiURL
@Injectable({
  providedIn: 'root'
})
export class ApicallserviceService {

  headers: any
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  constructor(private http: HttpClient, private idle: Idle,) { }

  // Note: 
  // arguments[0] --> type    --> eg. get/post
  // arguments[1] --> API     --> eg. mstrserv/emp 
  // arguments[2] --> Options --> eg. 1. (summarysearcch { name: 1, age: 2, phone: 8989898989 }) or 2. venserv/1/doc/2
  // arguments[3] --> dataForpost --> eg. { name: 1, age: 2, phone: 8989898989 }


  public ApiCall(...queryCall): Observable<any> {
    console.log("api call service", ...queryCall)
    console.log("API arrange call get", arguments[2] , arguments[0], arguments[1],)

    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let headers = { 'Authorization': 'Token ' + token }
    let arrangeAPI;

    if(arguments[0] == "get" || arguments[0]== "post"){
    if ((arguments[2] == null || arguments[2] == '' || arguments[2] == undefined) && (arguments[0] == 'get') ) {
      arrangeAPI = arguments[1]
      console.log("if condition" , arrangeAPI)
    }
    else if (arguments[0] == 'post') {
      arrangeAPI = arguments[1]
      console.log("if condition post " , arrangeAPI)
    }
    else{
      console.log("else typeof(arguments[2])", arrangeAPI, typeof(arguments[2]))
      let arrangement = []
      if (typeof(arguments[2]) == 'object'  && arguments[0] == 'get') {
        console.log("else if called", Object.entries(arguments[2]))
        
        for (let [key, value] of Object.entries(arguments[2])) {
          console.log(key, value);
          // if (value == null || value == undefined || value == '') {
          //   continue
          // } else {
            arrangement.push(key + '=' + value)
          // }
        }
        
      }
      console.log("arrangement", arrangement)
      if (arrangement?.length > 0) {
        arrangeAPI = arguments[1] + arrangement.join('&')
      }
      if (typeof (arguments[2]) == 'string' || arguments[2] == undefined) {
        arrangeAPI = arguments[1] + arguments[2] || ''
      }
    }

    console.log("arrangge API", arrangeAPI)
  }

    if (arguments[0] == 'post') {
      return this.http.post(Url + arrangeAPI, arguments[2], { headers: headers });
    }

    if (arguments[0] == 'get') {
      return this.http.get(Url + arrangeAPI, { headers: headers });
    }

    if (arguments[0] == 'getFile') {
      arrangeAPI = arguments[1] 
      return this.http.get(Url + arrangeAPI, { headers, responseType: 'blob' as 'json' });
    }
  }




}









