import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { map } from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';



//const APDATAURL = "http://emc-vysfin-sit.kvbank.in/insert_ap_frm_memo?Group=GENERIC_API_AP&Action=COMMON_API"

const PRPOUrl = environment.apiURL      //8000
const MicroUrl = environment.apiURL   /// 8184
@Injectable({
  providedIn: 'root'
})
export class PRPOSERVICEService {
  test: any;
  constructor(private http: HttpClient, private idle: Idle,) { }
  grnADDJson: any
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  ///////////////////////commodity
  public getcommodity(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    //console.log(headers);
    return this.http.get<any>(PRPOUrl + "mstserv/commodity?page=" + pageNumber, { 'headers': headers, params })
  }

  // public getCommoditySearch(search): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token } 
  //   return this.http.post<any>(PRPOUrl + 'mstserv/search_commodityAll' ,search, { 'headers': headers })
  // }
  public getCommoditySearch(code, name): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let names = name

    for (let i in names) {
      if (!names[i]) {
        delete names[i];
      }
    }
    let codes = code

    for (let i in codes) {
      if (!codes[i]) {
        delete codes[i];
      }
    }
    return this.http.get<any>(PRPOUrl + 'mstserv/commoditysearch?name=' + names + '&code=' + codes, { 'headers': headers })
  }

  public commodityCreateForm(com: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(com)
    // console.log("com Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'mstserv/commodity', data, { 'headers': headers })
  }
  public activeInactiveCommodity(comId, status_action): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "mstserv/commoditystatus/" + comId + '?status=' + status_action, { 'headers': headers })
  }
  //////////delmat
  public getdelmat(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    //console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/delmat?page=" + pageNumber, { 'headers': headers, params })
  }
  public getInactivelist() {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/listinactive", { 'headers': headers })
  }
  public getactivelist() {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/listactive", { 'headers': headers })
  }


  public delmatmakercreate(delmake): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(delmake)
    //console.log("delmake Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/delmat', data, { 'headers': headers })
  }
  public getemployeeFK(empkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/searchemployee?query=" + empkeyvalue, { 'headers': headers })
  }
  public getemployeeFKdd(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'usrserv/searchemployee?query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getcommodityFK(comkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/searchcommodity?query=' + comkeyvalue, { 'headers': headers })
  }
  public getcommodityFKdd(comkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/searchcommodity?query=' + comkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getdelmattype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/delmattype', { 'headers': headers })
  }

  ////////////////delmatapproval

  public getdelmatapp(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/pending_list?page=" + pageNumber, { 'headers': headers, params })
  }
  public getdelapprovalorRejectdata(delmatapprovalId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/delmat/" + delmatapprovalId, { 'headers': headers })
  }
  // public getdelapprovaldata(delmatapprovalId): Observable<any>{
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(MicroUrl + "prserv/delmat/" + delmatapprovalId +'/statusApproved', { 'headers': headers })
  // }
  // public getdelrejectdata(delmatapprovalId): Observable<any>{
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(MicroUrl + "prserv/delmat/" + delmatapprovalId +'/statusRejected', { 'headers': headers })
  // }

  public getdelapprovaldata(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(approval)
    //console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/updateapproved', data, { 'headers': headers })
  }
  public getdelrejectdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/updaterejected", data, { 'headers': headers })
  }
  public getdelmatappSearch(searchdel): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/searchpending', searchdel, { 'headers': headers })
  }
  /////////////////////   Apcategory
  public getapcategory(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "mstserv/categorylist?page=" + pageNumber, { 'headers': headers, params })
  }

  public apcategoryCreateForm(apcat: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(apcat)
    console.log("apcat Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'mstserv/Apcategory', data, { 'headers': headers })
  }
  public editapcat(apcatedit): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(apcatedit)
    // console.log("apcat Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'mstserv/updateisasset', data, { 'headers': headers })
  }
  public activeInactiveapcat(apId, status): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = apId + '?status=' + status
    //console.log('data check for apcat active inactive', data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "mstserv/categorystatus/" + apId + '?status=' + status, { 'headers': headers })
  }
  public getapcatsearch(no, name): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let names = name

    for (let i in names) {
      if (!names[i]) {
        delete names[i];
      }
    }
    let nos = no

    for (let i in nos) {
      if (!nos[i]) {
        delete nos[i];
      }
    }
    return this.http.get<any>(PRPOUrl + 'mstserv/categorysearch?name=' + names + '&no=' + nos, { 'headers': headers })
  }

  ////////////////////////apsubcat
  public getapsubcategory(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    //console.log(headers);
    return this.http.get<any>(PRPOUrl + "mstserv/subcategorylist?page=" + pageNumber, { 'headers': headers, params })
  }

  public apSubCategoryCreateForm(apsubcat: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(apsubcat)
    // console.log("apcat Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'mstserv/Apsubcategory', data, { 'headers': headers })
  }
  public getcategorydd(catkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/categoryname_search?query=' + catkeyvalue, { 'headers': headers })
  }
  public getcategoryFKdd(catkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/categoryname_search?query=' + catkeyvalue + '&page=' + pageno, { 'headers': headers })
  }
  public getexp(expkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/search_expense?query=' + expkeyvalue, { 'headers': headers })
  }
  public getexpen(expkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/search_expense?query=' + expkeyvalue + '&page=' + pageno, { 'headers': headers })
  }
  public editapsubcat(apsubcatedit): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(apsubcatedit)
    // console.log("editapsubcat Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'mstserv/editsubcategory', data, { 'headers': headers })
  }

  public getapsubcatsearch(searchapsub): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let names= name

    // for (let i in name) {
    //       if (!name[i]) {
    //         delete name[i];
    //       }
    //     }
    // let nos= no

    // for (let i in nos) {
    //       if (!nos[i]) {
    //         delete nos[i];
    //       }
    //     }    
    // if (name === undefined || name==="" || name===null ) {
    //   name ="";
    // }
    // if (no === undefined || no==="" || no===null ) {
    //   no ="";
    // }
    return this.http.post<any>(PRPOUrl + 'mstserv/subcategorysearch', searchapsub, { 'headers': headers })

    //return this.http.get<any>(PRPOUrl + 'mstserv/subcategorysearch?name='+ name +'&no='+ no, { 'headers': headers })
  }


  ////////////////// bs
  public getbs(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    //console.log(headers);
    return this.http.get<any>(PRPOUrl + "usrserv/businesssegmentlist?page=" + pageNumber, { 'headers': headers, params })
  }

  public BSCreateForm(bs: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(bs)
    //console.log("bs Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'usrserv/businesssegment', data, { 'headers': headers })
  }

  public getBssearch(no, name): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let names = name

    for (let i in names) {
      if (!names[i]) {
        delete names[i];
      }
    }
    let nos = no

    for (let i in nos) {
      if (!nos[i]) {
        delete nos[i];
      }
    }
    return this.http.get<any>(PRPOUrl + 'usrserv/businesssegmentsearch?name=' + names + '&no=' + nos, { 'headers': headers })
  }
  public activeInactivebs(bsId, status): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = bsId + '?status=' + status
    //console.log('data check for apcat active inactive', data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/businesssegmentstatus/" + bsId + '?status=' + status, { 'headers': headers })
  }

  ////////////////// CC
  public getcc(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "usrserv/costcentrelist?page=" + pageNumber, { 'headers': headers, params })
  }

  public getCCsearch(no, name): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let names = name

    for (let i in names) {
      if (!names[i]) {
        delete names[i];
      }
    }
    let nos = no

    for (let i in nos) {
      if (!nos[i]) {
        delete nos[i];
      }
    }
    return this.http.get<any>(PRPOUrl + 'usrserv/costcentresearch?name=' + names + '&no=' + nos, { 'headers': headers })
  }

  public CCCreateForm(cc: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(cc)
    // console.log("cc Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'usrserv/costcentre', data, { 'headers': headers })
  }

  public activeInactivecc(ccId, status): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = ccId + '?status=' + status
    // console.log('data check for apcat active inactive', data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/costcentrestatus/" + ccId + '?status=' + status, { 'headers': headers })
  }
  public activeInactivedel(delId, status): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = delId + '?status=' + status
    //console.log('data check for apcat active inactive', data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/delmatstatus/" + delId + '?status=' + status, { 'headers': headers })
  }
  public getdelmatSearch(searchdel): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    // if (type === undefined || type==="" ) {
    //   type ="";
    // }
    // if (empid === undefined || empid==="" ) {
    //   empid ="";
    // }
    // if (comid === undefined || comid==="" ) {
    //   comid ="";
    // }

    // let types= type.id
    // let comids= comid.id
    // let empids= empid.id
    // for (let i in types) {
    //       if (!types[i]) {
    //         delete types[i];
    //       }
    //     }
    // for (let i in comids) {
    //       if (!comids[i]) {
    //         delete comids[i];
    //       }
    //     } 
    // for (let i in empids) {
    //       if (!empids[i]) {
    //         delete empids[i];
    //       }
    //     }        
    //return this.http.get<any>(MicroUrl + 'prserv/delmatsearch?type='+ type +'&employee_id='+ empid + '&commodity_id=' + comid, { 'headers': headers })
    return this.http.post<any>(MicroUrl + 'prserv/delmatsearch', searchdel, { 'headers': headers })
  }



  /////////////////////////////////CCBS
  public getccBS(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "usrserv/ccbsmapping?page=" + pageNumber, { 'headers': headers, params })
  }


  public getbsvalue(bskeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "mstserv/searchbusinesssegment?query=" + bskeyvalue, { 'headers': headers })
  }
  public getbsFKdd(bskeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/searchbusinesssegment?query=' + bskeyvalue + '&page=' + pageno, { 'headers': headers })
  }


  public getccvalue(empkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/searchcostcentre?query=" + empkeyvalue, { 'headers': headers })
  }
  public getccFKdd(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'usrserv/searchcostcentre?query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public ccbsCreateForm(ccbs: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(ccbs)
    // console.log("ccbs Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'usrserv/ccbsmapping', data, { 'headers': headers })
  }

  public getCCBSsearch(searchccbs): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'usrserv/search_ccbs', searchccbs, { 'headers': headers })
  }

  public getapsubcatInactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    //  console.log(headers);
    return this.http.get<any>(PRPOUrl + "mstserv/subcategorylistinactive?page=" + pageNumber, { 'headers': headers, params })
  }

  public getapsubcatactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "mstserv/subcategorylistactive?page=" + pageNumber, { 'headers': headers, params })
  }



  public getapcatInactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "mstserv/categorylistinactive?page=" + pageNumber, { 'headers': headers, params })
  }

  public getapcatactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "mstserv/categorylistactive?page=" + pageNumber, { 'headers': headers, params })
  }

  public getbsInactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "usrserv/bslistinactive?page=" + pageNumber, { 'headers': headers, params })
  }

  public getbsactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "usrserv/bslistactive?page=" + pageNumber, { 'headers': headers, params })
  }


  public getccInactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "usrserv/cclistinactive?page=" + pageNumber, { 'headers': headers, params })
  }

  public getccactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "usrserv/cclistactive?page=" + pageNumber, { 'headers': headers, params })
  }



  public getproduct(prodkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return
    return this.http.get<any>(PRPOUrl + "mstserv/productsearch?query=" + prodkeyvalue, { 'headers': headers })
  }
  public getproductFKdd(prodkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return
    return this.http.get<any>(PRPOUrl + "mstserv/productsearch?query=" + prodkeyvalue + '&page=' + pageno, { 'headers': headers })
  }
  //   return this.http.get<any>(PRPOUrl +'mstserv/productsearch?query='+prodkeyvalue+'&page='+pageno,{ 'headers': headers })
  // }

  public productCreateForm(prod: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(prod)
    //console.log("prod Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/cpmapping', data, { 'headers': headers })
  }
  public getODIT(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(PRPOUrl + 'mstserv/categorytype', { 'headers': headers })
  }

  public getprodselectedlist(ids: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let id = ids
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/cpMap/' + id, { 'headers': headers })
  }


  //////////////////////////////////////////////Transaction


  public getpar(pageNumber, pageSize): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    //console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/par", { 'headers': headers, params })
  }
  public getparsummarySearch(searchdel): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/search_parmaker', searchdel, { 'headers': headers })
  }

  public getreqfor(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/department_search?query=", { 'headers': headers })
  }
  public getreqforFK(rforkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'usrserv/department_search?query=' + rforkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  parmakerdocJson: any;
  public PARmakerFormSubmit(par: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let formData = new FormData();
    // this.parmakerdocJson = par
    // formData.append('data', JSON.stringify(this.parmakerdocJson));
    // for (var i = 0; i < files.length; i++) {
    //   const addToFormData = ["file"]
    //   addToFormData.forEach(key => formData.append(key, files[i]));
    // }
    return this.http.post<any>(MicroUrl + 'prserv/par', par, { 'headers': headers })
  }

  public getallpar(id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/fetch_pardetails?query=" + id, { 'headers': headers })
  }
  public PARcontigencySubmit(par: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(par)
    // console.log("par Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/contigency_par', data, { 'headers': headers })
  }

  public getparchecker(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/parchecker_list?page=" + pageNumber, { 'headers': headers, params })
  }
  public getparapprovaldata(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(approval)
    // console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/parapproved', data, { 'headers': headers })
  }
  public getparrejectdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/parrejected", data, { 'headers': headers })
  }

  public getparcheckerSearch(searchdel): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/search_parchecker', searchdel, { 'headers': headers })
  }


  public getparEdit(id: any): Observable<any> {
    this.reset();
    let idValue = id.id
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/pardetails/' + id, { headers })
  }



  public getMepList(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/mep?page=" + pageNumber, { 'headers': headers, params })
  }

  public getmepsummarySearch(searchdel): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/search_mepmaker', searchdel, { 'headers': headers })
  }


  public getparnoFK(parnokeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/search_parno?query=" + parnokeyvalue, { 'headers': headers })
  }
  public getparnoFKdd(parnokeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/search_parno?query=' + parnokeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public MEPmakerFormSubmit(mep: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(mep)
    // console.log("mep Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/mep', data, { 'headers': headers })
  }

  public getbranch(branchkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/search_branch?query=" + branchkeyvalue, { 'headers': headers })
  }
  public getbranchFK(branchkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'usrserv/search_branch?query=' + branchkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getmepEdit(id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/mepdetails/' + id, { headers })
  }

  public getraisorFK(empkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/searchemployee?query=" + empkeyvalue, { 'headers': headers })
  }
  public getraisorFKdd(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'usrserv/searchemployee?query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getprojectownerFK(empkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/searchemployee?query=" + empkeyvalue, { 'headers': headers })
  }
  public getprojectownerFKdd(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'usrserv/searchemployee?query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getbudgetownerFK(empkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/searchemployee?query=" + empkeyvalue, { 'headers': headers })
  }
  public getbudgetownerFKdd(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'usrserv/searchemployee?query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getMepapproverList(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/get_mepchecker?page=" + pageNumber, { 'headers': headers, params })
  }

  public getmeapproverpsummarySearch(searchdel): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/search_mepchecker', searchdel, { 'headers': headers })
  }

  public getmepapprovaldata(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(approval)
    // console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/mepapproved', data, { 'headers': headers })
  }
  public getmeprejectdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/meprejected", data, { 'headers': headers })
  }

  public MepcontigencySubmit(mep: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(mep)
    // console.log("mep Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/contigency_mep', data, { 'headers': headers })
  }

  public getproductdetails(prodkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "mstserv/productsearch?query=" + prodkeyvalue, { 'headers': headers })
  }

  public getpoclosesummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/close_makerlist?page=" + pageNumber, { 'headers': headers, params })
  }

  public getpocloseappsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/approval_closelist?page=" + pageNumber, { 'headers': headers, params })
  }

  public getpoclosedatasummary(id: any): Observable<any> {
    this.reset();
    // let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/poclose_get/' + id, { headers })
  }

  public getpoclosesummarySearch(searchpo): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/search_poclose', searchpo, { 'headers': headers })
  }

  public getpoclosedata(id: any): Observable<any> {
    this.reset();
    // let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/get_poheader/' + id, { headers })
  }

  public pocloseremarks(close): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(close)
    // console.log("close Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/poclose', close, { 'headers': headers })
  }


  public getpocloseapprovaldata(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let data = JSON.stringify(approval)
    // console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/pocloseapproved', approval, { 'headers': headers })
  }


  public getpocloserejectdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/pocloserejected ", data, { 'headers': headers })
  }

  // public getpocloseappsummary(pageNumber = 1, pageSize = 10): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   params = params.append('page', pageNumber.toString());
  //   params = params.append('pageSize', pageSize.toString());
  //   console.log(params);
  //   console.log(headers);
  //   return this.http.get<any>(MicroUrl + "prserv/poclose?page=" + pageNumber, { 'headers': headers, params })
  // }

  public getpocloseappsummarySearch(searchpo): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/approval_closesearch', searchpo, { 'headers': headers })
  }

  public getporeopensummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/reopen?page=" + pageNumber, { 'headers': headers, params })
  }
  public getporeopensummarySearch(searchpo): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/search_poreopen', searchpo, { 'headers': headers })
  }

  public getporeopendata(id: any): Observable<any> {
    this.reset();
    // let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/poreopen_header/' + id, { headers })
  }

  public poreopenremarks(reopen): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(reopen)
    // console.log("reopen Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/reopen', data, { 'headers': headers })
  }

  public getpocancelsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/cancel_makerlist?page=" + pageNumber, { 'headers': headers, params })
  }
  public getpocancelsummarySearch(searchpo): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/search_pocancel', searchpo, { 'headers': headers })
  }
  public getpocancelappsummarySearch(searchpo): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/approval_cancelsearch', searchpo, { 'headers': headers })
  }

  public getpocanceldata(id: any): Observable<any> {
    this.reset();
    // let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/get_poheader/' + id, { headers })
  }

  public pocancelremarks(cancel): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(cancel)
    // console.log("cancel Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/pocancel', data, { 'headers': headers })
  }

  public getpocancelappsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/approval_cancellist?page=" + pageNumber, { 'headers': headers, params })
  }



  // public getpocancelappsummarySearch(searchpo): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.post<any>(MicroUrl + 'prserv/search_poclose', searchpo, { 'headers': headers })
  // }

  public getpoappcanceldata(id: any): Observable<any> {
    this.reset();
    // let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/get_poheader/' + id, { headers })
  }

  public getpocancelapprovaldata(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(approval)
    //console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/pocancelapproved', data, { 'headers': headers })
  }
  public getpocancelrejectdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/pocancelrejected", data, { 'headers': headers })
  }

  public getpo(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    //console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/poheader?page=" + pageNumber, { 'headers': headers, params })
  }

  public getposummarySearch(searchdel): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/posearch', searchdel, { 'headers': headers })
  }
  public getprapprovesummary(type, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    if( (type == undefined) || (type == null) || (type == "") || (type.value == "")){type = 0}
    // return this.http.get<any>(MicroUrl + "prserv/prdetailsapproved?query="+type+"?page=" + pageNumber, { 'headers': headers, params })
    return this.http.get<any>(MicroUrl + "prserv/prdetailsapproved?query="+type, { 'headers': headers, params })

  }

  public getprsummarySearch(type, searchdel, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if( (type == undefined) || (type == null) || (type == "") || (type.value == "")){type = 0}
    return this.http.post<any>(MicroUrl + 'prserv/prdetailsapprovedsearch?query='+type+"&page="+ page, searchdel, { 'headers': headers })
  }

  public getpodeliverydetails(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // console.log("idccbs", id)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/prccbsdtl/" + id, { 'headers': headers })
  }

  public getApprovalpo(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/poapprover?page=" + pageNumber, { 'headers': headers, params })
  }

  public getpoApprovalsummarySearch(searchdel): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/poapprovesearch', searchdel, { 'headers': headers })
  }

  public getdetailsforPO(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    //console.log("idccbs", id)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/prccbsid/" + id, { 'headers': headers })
  }

  public POCreateForm(po: any, ): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let data = JSON.stringify(po)
    // console.log("po Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    // let formData = new FormData();
    // formData.append('data', data);

    // for (var i = 0; i < filesHeadervalue.length; i++) {
    //   const addToFormData = ["file"]
    //   addToFormData.forEach(key => formData.append(key, filesHeadervalue[i]));
    // }

    // for (var i = 0; i < files.length; i++) {
    //   const addToFormData = ["file_detail"]
    //   addToFormData.forEach(key => formData.append(key, files[i]));
    // }

    // console.log("PO CREATE", formData)
    return this.http.post<any>(MicroUrl + 'prserv/poheader', po, { 'headers': headers })
  }

  // public getpodetailsforPOsummary(id): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   console.log("po single get details for summary popup", id)
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(MicroUrl + "prserv/posummary_get/" + id, { 'headers': headers })
  // }
  public getsupplier(supplierkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'venserv/search_suppliername?sup_id=&name=' + supplierkeyvalue, { 'headers': headers })
  }
  public getsupplierFK(supplierkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'venserv/search_suppliername?sup_id=&name=' + supplierkeyvalue + '&page=' + pageno, { 'headers': headers })
  }
  public getPoProductList(id, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    //console.log("po single get details for summary popup", id)
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/poheader_get/"+id+"?page="+pageNumber, { 'headers': headers, params })
  }


  public getPoDeliveryList(headerID, detailID): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    //console.log("po single get details for summary popup", id)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/productdelivery_get/"+headerID+"/"+detailID, { 'headers': headers })
  }

  public getPoapprovaldata(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(approval)
    //console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/poapproved', data, { 'headers': headers })
  }
  public getPorejectdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/poreject", data, { 'headers': headers })
  }

  public meptotalget(expense, par): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(MicroUrl + 'prserv/search_par?exp_type=' + expense + '&no=' + par, { 'headers': headers })
    return this.http.get<any>(MicroUrl + 'prserv/par_utilized_Mep?query='+par+'&exptype='+ expense, { 'headers': headers })
  }

  public fileDownloads(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/prpo_filedownload/' + id, { 'headers': headers, responseType: 'blob' as 'json' })

  }

  public fileDownloadpo(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/prpo_filedownload/' + id, { 'headers': headers, responseType: 'blob' as 'json' })

  }

  public fileDownloadspar(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/prpo_filedownload/' + id, { 'headers': headers, responseType: 'blob' as 'json' })

  }



  public grnsummarySearch(searchgrn): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/search_grndetail', searchgrn, { 'headers': headers })
  }

  public transactionget(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/grntran/' + id, { 'headers': headers })
  }


  public getgrncloseapprovaldata(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/grnupdateapproved', approval, { 'headers': headers })
  }


  public rcnupdate(rcn): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'pdserv/rcn_update', rcn, { 'headers': headers })
  }

  public grnflag(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/grnrems/' + id, { 'headers': headers })
  }
  public getgrncloserejectdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/grnupdaterejected", data, { 'headers': headers })
  }



  public deliverydetailssummary(pageNumber = 1, pageSize = 10, pocancelmakerid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //  console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/podtlid/" + pocancelmakerid, { 'headers': headers, params })
  }


  // public APsummary(pageNumber = 1, pageSize = 10, pocancelapprovalid): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   params = params.append('page', pageNumber.toString());
  //   params = params.append('pageSize', pageSize.toString());
  // //  console.log(params);
  // //  console.log(headers);
  //   return this.http.get<any>(PRPOUrl + "" + pageNumber, { 'headers': headers, params })
  // }


  public getpocancelapprovalldata(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let data = JSON.stringify(approval)
    // console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/pocancelapproved', approval, { 'headers': headers })
  }

  public getpocancelrejecttdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/pocancelrejected", data, { 'headers': headers })
  }

  public reopendeliverydetailssummary(pageNumber = 1, pageSize = 10, poreopenid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //  console.log(params);
    //  console.log(headers);
    return this.http.get<any>(PRPOUrl + "" + pageNumber, { 'headers': headers, params })
  }

  //grn inward coding starting part-------------------------------------//

  public getgrnsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //  console.log(params);
    //  console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/grninward", { 'headers': headers, params })
  }

  public getgrncreatesummarySearch(searchgrninward, pageNumber = 1, pageSize = 10): Observable<any> {

    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //  console.log(params);
    // console.log(headers);
    return this.http.post<any>(MicroUrl + 'prserv/search_grnlist', searchgrninward, { 'headers': headers, params })
  }

  public getrcninwardsummarySearch(searchgrn): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/search_rcninward', searchgrn, { 'headers': headers })
  }

  public transactionhistorysummary(pageNumber = 1, pageSize = 10, grnid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    ////  console.log(params);
    //  console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/grntran/" + grnid, { 'headers': headers, params })



  }

  public getgrnView(GRNID): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/grninwardviews/" + GRNID, { 'headers': headers })
  }
  // prserv/grninwardview/
  public getgrndetailsviewsummary(pageNumber = 1, pageSize = 10, grnid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/grninwardviews/" + grnid, { 'headers': headers, params })
  }
  public getgrndetailsfileviewsummary(pageNumber, pageSize, grnid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    //console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/grninward/" + grnid, { 'headers': headers, params })
  }
  // prserv/grnindetail

  public assetdetailssummary(pageNumber = 1, pageSize = 10, grndetailsviewid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return
    // return this.http.get<any>(PRPOUrl + "" + pageNumber, { 'headers': headers, params })
  }


  //grn create screen summary---------///

  // public getgrninwardsummary(pageNumber = 1, pageSize = 10): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   params = params.append('page', pageNumber.toString());
  //   params = params.append('pageSize', pageSize.toString());
  //   console.log(params);
  //   console.log(headers);
  //   return this.http.get<any>(MicroUrl + "prserv/search_grnlist", { 'headers': headers, params })
  // }

  public getgrninwardView(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "venserv/supplierbranch/" + id, { 'headers': headers })
  }
  public getsuppliername(id, suppliername): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (suppliername === undefined) {
      suppliername = "";
    }
    if (id === undefined) {
      id = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    // let urlvalue = PRPOUrl + 'venserv/search_suppliername?query=' + suppliername;
    return this.http.get<any>(PRPOUrl + 'venserv/search_suppliername?sup_id=' + id + '&name=' + suppliername, { headers })
  }


  public getbranchname(branchcode): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (branchcode === null) {
      branchcode = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    // let urlvalue = PRPOUrl + 'venserv/search_suppliername?query=' + suppliername;
    return this.http.get<any>(PRPOUrl + 'usrserv/search_branch?query=' + branchcode, { headers })

  }



  public grnCreateForm(GRN, files): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
    // if (id == "") {
    this.grnADDJson = GRN;
    this.grnADDJson = Object.assign({}, GRN)
    // } 
    formData.append('data', JSON.stringify(this.grnADDJson));
    if(files != null || files != undefined ){
    for (var i = 0; i < files.length; i++) {
      formData.append("file1", files[i]);
    }}
    return this.http.post<any>(MicroUrl + 'prserv/grninward', formData, { 'headers': headers })
  }

  public getgrnselectsupplierSearch(searchsupplier): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (searchsupplier.code === undefined) {
      searchsupplier.code = ''
    }
    if (searchsupplier.panno === undefined) {
      searchsupplier.panno = ''

    }
    if (searchsupplier.gstno === undefined) {
      searchsupplier.gstno = ''
    }
    return this.http.get<any>(MicroUrl + 'prserv/search_supplier?code=' + searchsupplier.code + '&panno=' + searchsupplier.panno + '&gstno=' + searchsupplier.gstno, { 'headers': headers })
  }

  public fileDownloadsgrnmaker(id: number) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/prpo_filedownload/' + id ,{ 'headers': headers, responseType: 'blob' as 'json' })
  }
  // }
  // public downloadfile(id: number) {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   let idValue = id;
  //   const headers = { 'Authorization': 'Token ' + token }
  //    window.open(PRPOUrl+'venserv/vendor_attactments/'+idValue+"?token="+token, '_blank');
  //   } 

  //____________________________________________________________________________________
  public getgrn(pageNumber = 1, pageSize = 10): Observable<any> {

    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/grndetail?page=" + pageNumber, { 'headers': headers, params })
  }

  public grndetail(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/grndetailview/' + id, { 'headers': headers })
  }

  public grnapprove(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/grnupdateapproved', id, { 'headers': headers })
  }

  public grnreject(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/grnupdaterejected', id, { 'headers': headers })
  }

  public product(id, namevalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/productdelivery_get/'+id+"/"+namevalue, { 'headers': headers })
  }

  public grnproduct(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/poheader_get/' + id, { 'headers': headers })

  }
  // ---PR start--
  public getprsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);

    return this.http.get<any>(MicroUrl + "prserv/prheader?page=" + pageNumber, { 'headers': headers })
  }

  public getprtransummary(id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/prtran/" + id, { 'headers': headers })
  }
  public getdetails(id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/prhdrdtl/" + id, { 'headers': headers })
  }


  public getproductcat(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "mstserv/pdtcat", { 'headers': headers })
  }

  public getproducttype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "mstserv/pdttype", { 'headers': headers })
  }

  // public getproduct(): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(PRPOUrl + "mstserv/product", { 'headers': headers })
  // }

  public getcommoditypro(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "mstserv/commodity", { 'headers': headers })
  }
  // public getsupplierproduct(id): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let idValue = id.id
  //   return this.http.get<any>(MicroUrl + "prserv/product_search?product_id" +'=' + idValue, { 'headers': headers })
  // }

  public getemployeebranch(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/employeebranch", { 'headers': headers })
  }
  public getcommodityproduct(ids: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let id = ids
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/cpMap/' + id, { 'headers': headers })
  }

  public getemployee(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/delmat", { 'headers': headers })

  }

  public getbslist(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/businesssegment", { 'headers': headers })
  }

  public getcclist(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/costcentre", { 'headers': headers })
  }


  public PRcreateForm(PR: any, name): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(PR)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    let prdetail = {
      "prdetails": name
    }
    let Json = Object.assign({}, PR, prdetail)
    //  console.log("js",Json)
    return this.http.post<any>(MicroUrl + "prserv/prsearch", Json, { 'headers': headers })
  }

  public getapproversummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(MicroUrl + "prserv/prapprovesummary?page=" + pageNumber, { 'headers': headers, params })
  }

  public getapprover(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/prdtl/" + id, { 'headers': headers })
  }
  public getpredit(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/prhdrdtl/" + id, { 'headers': headers })
  }
  public getprapproval(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let data = JSON.stringify(approval)
    //  console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/prapprover', data, { 'headers': headers })
  }
  public getprreject(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/prreject", data, { 'headers': headers })
  }
  public prCreateForm(pr: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(pr)
    //  console.log("com Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    // let formData = new FormData();
    // formData.append('data', data);

    // for (var i = 0; i < imagesHeader.length; i++) {
    //   const addToFormData = ["file_detail"]
    //   addToFormData.forEach(key => formData.append(key, imagesHeader[i]));
    // }
    // let typeCatlogOnly = pr.type
    // if( typeCatlogOnly == 1  ) {
    // for (var i = 0; i < images.length; i++) {
    //   const addToFormData = ["file"]
    //   addToFormData.forEach(key => formData.append(key, images[i]));
    // }}
    // return this.http.post<any>(MicroUrl + 'prserv/prheader', pr, { 'headers': headers })
    return this.http.post<any>(MicroUrl + 'prserv/pr_update', pr, { 'headers': headers })

  }
  // public prDraftForm(com: any,images:any): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   let data = JSON.stringify(com)
  //  // console.log("com Data", data)
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let formData = new FormData();
  //   formData.append('data', data);
  // for (var i = 0; i < images.length; i++) {
  //   formData.append("file", images[i]);
  // }
  //   return this.http.post<any>(MicroUrl + 'prserv/prdraft', formData, { 'headers': headers })
  // } 

  public getprSearch(search, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/prsearch?page='+ page, search, { 'headers': headers })
  }
  public getprapproverSearch(search, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/prapproversearch?page='+page, search, { 'headers': headers })
  }
  public getmepno(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/mep", { 'headers': headers })
  }
  public filedownloads(id: number) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    window.open(MicroUrl + 'prserv/prpo_filedownload/' + id + "?token=" + token, '_blank');
  }
  public getemployeeApproverforPR(commodityID,): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if( (commodityID == "") || (commodityID == undefined) || (commodityID == null)){
      commodityID = 0
    }
    return this.http.get<any>(MicroUrl + "mstserv/search_employeelimit?commodityid=" + commodityID + "&type=PR&employee=", { 'headers': headers })
  }
  // ---PR End--
  public getproductterms(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = { "type": "P" }
    //  console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/potemptype', data, { 'headers': headers })
  }

  public getserviceterms(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = { "type": "S" }
    // console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/potemptype', data, { 'headers': headers })
  }



  public POTermsCreateForm(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    // console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/potermstem', data, { 'headers': headers })
  }

  public POproductserviceCreateForm(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    // console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/poterms', data, { 'headers': headers })
  }


  // public POTermsCreForm(data): Observable<any>{
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token

  //   console.log("approval Data", data)
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.post<any>(MicroUrl + 'prserv/poterms', data, { 'headers': headers })
  // }

  public gettermsget(termid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/potermslist/" + termid, { 'headers': headers })
  }


  public gettermsFK(termskeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/search_poterm?query=' + termskeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getterms(termskeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/search_termsname?query=" + termskeyvalue, { 'headers': headers })
  }

  public geteermslist(key): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/search_poterm?query=" + key, { 'headers': headers })
  }


  //PO Amendment
  public getpoamendsearch(ponum, dates, branch): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let ponumdata = ponum
    let datesdata = dates 
    let branchdata = branch 

    if(ponum == '' || ponum == null || ponum == undefined){
      ponumdata = ''
    }
    if(dates == '' || dates == null || dates == undefined){
      datesdata = ''
    }
    if(branch == '' || branch == null || branch == undefined){
      branchdata = ''
    }
    console.log(ponumdata, datesdata, branchdata)
    return this.http.get<any>(MicroUrl + 'prserv/amendsearch?pono=' + ponumdata + '&podate=' + datesdata + '&branch_id='+ branchdata, { 'headers': headers })
  }
  public getpoamendmentsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/amendsummary", { 'headers': headers, params })
  }
  // public getpoheader(id): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(MicroUrl + "prserv/poheader_get/"+id, { 'headers': headers })
  // }

  // public getdeliverydetails(poheaderid,productids): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(MicroUrl + "prserv/productdelivery_get/"+poheaderid+"/"+productids, { 'headers': headers })
  // }



  // public fileDownloadspar(file_id): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(MicroUrl + 'prserv/prpo_filedownload/' + file_id, { 'headers': headers, responseType: 'blob' as 'json' })

  // }
  public gettranhistory(id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/potran/" + id, { 'headers': headers })
  }

  public retiredremarksPO(retiredRemarks): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/prretired', retiredRemarks, { 'headers': headers })
  }
  public getunitPrice(idproduct, idservice, catlog): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(PRPOUrl + "venserv/unitprice?suplier=" + idservice + "&product=" + idproduct, { 'headers': headers })
    return this.http.get<any>(PRPOUrl + "venserv/fetch_unitprice?supplier_id="+idservice+"&product_id="+ idproduct+'&catalog='+catlog, { 'headers': headers })

  }
  // public getsupplierProductmapping(data, query): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   //  console.log("approval Data", data)
  //   const headers = { 'Authorization': 'Token ' + token }
  //   // return this.http.post<any>(PRPOUrl + 'venserv/product_supplier', data, { 'headers': headers })
  //   return this.http.post<any>(PRPOUrl + 'venserv/catalogproduct_supplier?query='+CREDAI+"&page=1", data, { 'headers': headers })
  // }
  public getemployeeApproverforPO(commodityID,): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "mstserv/search_employeelimit?commodityid=" + commodityID + "&type=PO&employee=", { 'headers': headers })
  }


  // public getpdfPO(poheaderid): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(MicroUrl + "prserv/po/"+poheaderid +"/pdf", { 'headers': headers})
  // }

  public getpdfPO(poheaderid) : Observable<any>{
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/po/" + poheaderid + "/pdf", { headers, responseType: 'blob' as 'json' })
    
  }
  public getrcnapprovaldata(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    // console.log("aaaaaaaaaaaaaaaaaaaapppppppppppppppppppppppppppppppppppppppppprrrrrrrrrrrrrroooovvvvvaalllll",approval)
    return this.http.post<any>(MicroUrl + 'prserv/grnupdateapproved', approval, { 'headers': headers })
    //return
  }

  // public getInwardDataForAp(ID): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(MicroUrl + "prserv/inward/" + ID , { 'headers': headers })
  // }
  // public PostInwardDataToAP(apdata): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Bearer ' + token }
  //   //return this.http.get<any>(APDATAURL + apdata , { 'headers': headers })
  //   return this.http.post<any>(APDATAURL, apdata, { 'headers': headers })
  //  //return
  // }

  // public POEditForm(po: any, images:any,id:any): Observable<any> {
  //     this.reset();
  //     const getToken: any = localStorage.getItem('sessionData')
  //     let tokenValue = JSON.parse(getToken);
  //     let token = tokenValue.token
  //     let data = JSON.stringify(po)
  //     console.log("po Data", data)
  //     // let value = {
  //     //   "id": id,
  //     // }
  //     // let jsonValue = Object.assign({}, data)
  //     const headers = { 'Authorization': 'Token ' + token }
  //     let formData = new FormData();
  //     formData.append('data', data);
  //       // for (var i = 0; i < images.length; i++) {
  //         formData.append("file", images);
  //       // }
  //       // for (var i = 0; i < files.length; i++) {
  //       //   const addToFormData= ["file"]
  //       // addToFormData.forEach(key => formData.append(key, files[i]));
  //       // }
  //     return this.http.post<any>(MicroUrl + 'prserv/poheader', formData, { 'headers': headers })
  //   }

  public getpoheader(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/po/" + id, { 'headers': headers })
  }
  public getdeliverydetails(poheaderid, productids): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/productdelivery_get/" + poheaderid + "/" + productids, { 'headers': headers })
  }

  public POEditForm(po: any, images: any, id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(po)
    // console.log("po Data", data)
    // let value = {
    //   "id": id,
    // }
    // let jsonValue = Object.assign({}, data)
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
    formData.append('data', data);
    // for (var i = 0; i < images.length; i++) {
    formData.append("file", images);
    // }
    // for (var i = 0; i < files.length; i++) {
    //   const addToFormData= ["file"]
    // addToFormData.forEach(key => formData.append(key, files[i]));
    // }
    return this.http.post<any>(MicroUrl + 'prserv/poheader', formData, { 'headers': headers })
  }

  public getrcnsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    //  console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/rcnlist", { 'headers': headers, params })
  }

  public getrcn(pageNumber = 1, pageSize = 10): Observable<any> {

    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/rcnapproval_summary?page=" + pageNumber, { 'headers': headers, params })
  }
  public getrcncreatesummarySearch(searchgrninward, pageNumber = 1, pageSize = 10): Observable<any> {

    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.post<any>(MicroUrl + 'prserv/search_rcnlist', searchgrninward, { 'headers': headers, params })
  }
  public getpdfGRN(rcnheaderid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/rcnpdfgen', rcnheaderid, { headers, responseType: 'blob' as 'json' })
    //return 
  }
  public getPaymodetype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/paymodedtllist', { 'headers': headers })
  }
  public rcnCreateForm(GRN, id, files): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
    if (id == "") {
      this.grnADDJson = GRN;
      this.grnADDJson = Object.assign({}, GRN)
    }
    formData.append('data', JSON.stringify(this.grnADDJson));
    for (var i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }
    console.log("rcncreattttest", formData)
    return this.http.post<any>(MicroUrl + 'prserv/rcn_create', formData, { 'headers': headers })
  }

  public getrcnapproval(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/rcnupdateapproved', approval, { 'headers': headers })
    //return
  }
  public getrcnrejectdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/rcnupdaterejected", data, { 'headers': headers })
  }
  public getLandlordInfo(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "venserv/branch/" + id + "/payment", { 'headers': headers })
  }
  public rorelease(reopen): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(reopen)
    // console.log("reopen Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/reopen', data, { 'headers': headers })
  }
  public RoHold(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/po_hold', approval, { 'headers': headers })
  }
  public getROHoldsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/po_hold?page=" + pageNumber, { 'headers': headers, params })
  }
  public getroHoldsummarySearch(searchpo): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/search_release', searchpo, { 'headers': headers })
  }
  public RoRelease(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/po_release', approval, { 'headers': headers })
  }
  public getBankGstTaxSubtaxValidation(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "venserv/paymentsupp/" + id, { 'headers': headers })
  }
  public getclosecanceltranhistory(id, name): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/" + name + "/" + id, { 'headers': headers })
  }
  //PR Start
  public prDraftForm(pr: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(pr)
    // console.log("com Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    // let formData = new FormData();
    // formData.append('data', data);
    // for (var i = 0; i < imagesHeader.length; i++) {
    //   const addToFormData = ["file_detail"]
    //   addToFormData.forEach(key => formData.append(key, imagesHeader[i]));
    // }
    // let typeCatlogOnly = pr.type
    // if( typeCatlogOnly == 1  ) {
    // for (var i = 0; i < images.length; i++) {
    //   const addToFormData = ["file"]
    //   addToFormData.forEach(key => formData.append(key, images[i]));
    // }}
    return this.http.post<any>(MicroUrl + 'prserv/prdraft', pr, { 'headers': headers })
  }
  public getmepFK(mepkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/search_mepno?query=" + mepkeyvalue, { 'headers': headers })
  }
  public getmepFKdd(mepkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/search_mepno?query=' + mepkeyvalue + '&page=' + pageno, { 'headers': headers })
  }
  public getmepdtl(mepno: any, dataCom): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // if((mepno =="")|| (mepno ==null) || (mepno ==undefined)){
    //   mepno = "MEP1"
    // }
    // return this.http.get<any>(MicroUrl + "prserv/pr_mepno?query=" + mepno+"&commodity_id="+dataCom, { 'headers': headers })
    // prserv/utilized_Mep?mep_no=PCA21080046&commodity_id=2
    return this.http.get<any>(MicroUrl + "prserv/mep_utilized_pr?mep_no="+mepno+"&commodity_id="+dataCom, { 'headers': headers })
  }
  public getsupplierproduct(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    //  console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'venserv/product_supplier', data, { 'headers': headers })
  }
  //PR End

  public POAmendmentForm(po: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(po)
    // console.log("po Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/poamend', data, { 'headers': headers })
  }

  public getcclistDependentBs(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((id == null) || (id == undefined) || (id == "")) {
      return
    }
    return this.http.get<any>(PRPOUrl + "mstserv/searchbs_cc?bs_id=" + id + "&query=", { 'headers': headers })
  }

  public getcclistDependentBsdd(id, keyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((id == null) || (id == undefined) || (id == "")) {
      return
    }
    return this.http.get<any>(PRPOUrl + 'mstserv/searchbs_cc?bs_id=' + id + '&query=' + keyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getemployeeLimitSearchPO(commodityID, empkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((commodityID == "") || (commodityID == null) || (commodityID == undefined)) {
      commodityID = 0
    }
    return this.http.get<any>(MicroUrl + "mstserv/search_employeelimit?commodityid=" + commodityID + "&type=PO&employee=" + empkeyvalue, { 'headers': headers })
  }
  public getemployeeLimitSearchPR(commodityID, empkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((commodityID == "") || (commodityID == null) || (commodityID == undefined)) {
      commodityID = 0
    }
    return this.http.get<any>(MicroUrl + "mstserv/search_employeelimit?commodityid="+commodityID+"&type=PR&employee="+empkeyvalue, { 'headers': headers })
  }
  public getgrninwardsummarySearch(searchgrn): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.post<any>(MicroUrl + 'prserv/search_grndetail', searchgrn, { 'headers': headers })
    return this.http.post<any>(MicroUrl + 'prserv/search_grninward', searchgrn, { 'headers': headers })
  }

  public getMepBasedcommodityOrCommodityProduct(Mepdata): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((Mepdata != "") || (Mepdata != "") || (Mepdata != "")) {
      return this.http.get<any>(MicroUrl + 'prserv/mep_dts?query=' + Mepdata, { 'headers': headers })
    } else {
      return this.http.get<any>(PRPOUrl + 'mstserv/searchcommodity?query=', { 'headers': headers })
    }

  }

  public getMepBasedcommodityOrCommodityProductdd(pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/searchcommodity?query=' + '&page=' + pageno, { 'headers': headers })
  }



  public getMepCommodityproductOrCommodityProduct(Mepno, Comids: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    if (Mepno == "" && Comids == "") {
      return
    }
    else if (Mepno != "") {
      return this.http.get<any>(MicroUrl + 'prserv/mep_commodity?mep_no=' + Mepno + '&commodity_id=' + Comids, { 'headers': headers })
    }
    else {
      return this.http.get<any>(MicroUrl + 'prserv/cpMap/' + Comids, { 'headers': headers })
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////  PR
  ///////////////////////////////////////////////////////////////////////////////////////////changes for MEP and PR from here
  public getCatlog_NonCatlog(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/get_catelog_type", { 'headers': headers })
  }

  /////////////////////////////////////prodcat
  public getproductCategory(com): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((com == "") || (com == null) || (com == undefined)) {
      com = 0
    }
      // return this.http.get<any>(MicroUrl + "prserv/mep_pr?commodity_id="+com+"&name=", { 'headers': headers })
      return this.http.get<any>(MicroUrl + "prserv/commodity_product?commodity_id="+com+"&category=&name=", { 'headers': headers })
    }

  public getproductCategoryFKdd(com, keyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((com == "") || (com == null) || (com == undefined)) {
      com = 0
   }
      // return this.http.get<any>(MicroUrl + "prserv/mep_pr?commodity_id="+com+"&name="+keyvalue+"&page="+pageno, { 'headers': headers })
      return this.http.get<any>(MicroUrl + "prserv/commodity_product?commodity_id="+com+"&category=&name="+keyvalue+"&page="+pageno, { 'headers': headers })
    }

  ////////////////////prod type

  public getproductTypeFK(commodityID,productCatIddata, keyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((commodityID == null ) || (commodityID == undefined) || (commodityID == "") || (productCatIddata == undefined) ) {
      commodityID = 0
      productCatIddata =0
    }
    // return this.http.get<any>(MicroUrl + "prserv/mep_pr?commodity_id="+commodityID+"&category="+productCatIddata+"&name="+keyvalue, { 'headers': headers })
    return this.http.get<any>(MicroUrl + "prserv/commodity_product?commodity_id="+commodityID+"&category="+productCatIddata+"&name=", { 'headers': headers })
  }

  public getproductTypeFKdd(commodityID,productCatIddata, keyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((commodityID == null) || (commodityID == undefined) || (commodityID == "") || (productCatIddata == undefined)) {
      commodityID = 0
      productCatIddata = 0
    }
    // return this.http.get<any>(MicroUrl + "prserv/mep_pr?commodity_id="+commodityID+"&category="+productCatIddata+"&name="+keyvalue+ '&page='+pageno, { 'headers': headers })
    return this.http.get<any>(MicroUrl + "prserv/commodity_product?commodity_id="+commodityID+"&category="+productCatIddata+"&name="+keyvalue+ '&page='+pageno, { 'headers': headers })
  }


  ////////////////////prod

  public getproductDependencyFK(com, prodcat,prodtype, dts, keyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((prodtype == null) || (prodtype == undefined) || (prodtype == "")) {
      prodtype = 0
      com = 0 
      prodcat =0
    }
    return this.http.get<any>(MicroUrl + "prserv/commodityproduct?commodity="+com+"&product_category="+prodcat+"&product_type="+prodtype+"&dts="+dts+"&query="+ keyvalue, { 'headers': headers })
  }

  public getproductDependencyFKdd(com, prodcat,prodtype, dts, keyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((prodtype == null) || (prodtype == undefined) || (prodtype == "")) {
      prodtype = 0
      com = 0 
      prodcat =0
    }

    return   this.http.get<any>(MicroUrl + "prserv/commodityproduct?commodity="+com+"&product_category="+prodcat+"&product_type="+prodtype+"&dts="+dts+"&query="+keyvalue+ '&page=' + pageno, { 'headers': headers })
    //return this.http.get<any>(PRPOUrl + "venserv/get_product?product_type_id=" + prodtype + "&dts=" + dts + "&query=" + keyvalue + '&page=' + pageno, { 'headers': headers })
  }

  ////////////////////items

  public getitemsDependencyFK(prod, dts, supplier): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if( (prod == null) || (prod == undefined) || (prod == "")    ){
      prod = 0
    }
    if(supplier == ""){
      return this.http.get<any>(PRPOUrl + "venserv/product_catalog?product_id="+prod+"&dts="+dts, { 'headers': headers })
    }

    if((supplier != "")){
      supplier = supplier.id
      return this.http.get<any>(PRPOUrl + "venserv/supplier_catalog?supplier_id="+supplier+"&dts="+dts+"&product_id="+prod+"&query=", { 'headers': headers })
    }
  }

  public getitemsDependencyFKdd(prod, dts,supplier,key, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if( (prod == null) || (prod == undefined) || (prod == "")    ){
      prod = 0
    }
    if((supplier == "")||(supplier == null)||(supplier == undefined)){
    return this.http.get<any>(PRPOUrl+"venserv/product_catalog?product_id="+prod+"&dts="+dts+"&query="+key+ '&page=' + pageno, {'headers': headers })
    }
    if((supplier != "")){
      supplier = supplier.id
      return this.http.get<any>(PRPOUrl + "venserv/supplier_catalog?supplier_id="+supplier+"&dts="+dts+"&product_id="+prod+"&query=", { 'headers': headers })
    }
  
  }


  ////////////////////commodity

  public getcommodityDependencyFK(mep, keyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((mep == null) || (mep == undefined) || (mep == "")) {
      return this.http.get<any>(PRPOUrl + "mstserv/searchcommodity?query=", { 'headers': headers })
    }
    else {
      return this.http.get<any>(MicroUrl + "prserv/mep_pr?mep_no="+mep+"&name=", { 'headers': headers })
    }
  }

  public getcommodityDependencyFKdd(mep, keyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((mep == null) || (mep == undefined) || (mep == "")) {
      return this.http.get<any>(PRPOUrl + "mstserv/searchcommodity?query=" + keyvalue + '&page=' + pageno, { 'headers': headers })
    }
    else {
      return this.http.get<any>(MicroUrl + "prserv/mep_pr?mep_no="+mep+"&name="+keyvalue+'&page='+pageno, { 'headers': headers })
    }
  }

  ////////////////////supplier

  public getsupplierDependencyFK(productID, catvalue,type, dts): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if( (productID == null) || (productID == undefined) || (productID == "")    ){
      productID = 0
    }

    if(type == 1 && productID !="" && (catvalue == "" || catvalue == undefined)){
      return this.http.get<any>(PRPOUrl+"venserv/product_dts?product_id="+productID+"&dts="+dts+"&query=" , { 'headers': headers })
    }
    if(type == 1 && (catvalue != "" || catvalue != undefined)){
      return this.http.get<any>(PRPOUrl+"venserv/catalog_supplier?product_id="+productID+"&catalog="+catvalue+"&dts="+dts, { 'headers': headers })
    }
    if(type == 2){
      // return this.http.get<any>(PRPOUrl+"venserv/landlordbranch_list?query=", {'headers': headers })
      return this.http.get<any>(PRPOUrl+"venserv/supplier_list?query=", {'headers': headers })

    }
  }

  public getsupplierDependencyFKdd(productID,catvalue,keyvalue, pageno,type, dts): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if( (productID == null) || (productID == undefined) || (productID == "")    ){
      productID = 0
    }
    // if( (catvalue == null) || (catvalue == undefined) || (catvalue == "")    ){
    //   catvalue = 0
    // }
    if(type == 1 && productID !="" && (catvalue == "" || catvalue == undefined)){
      return this.http.get<any>(PRPOUrl+"venserv/product_dts?product_id="+productID+"&dts="+dts+"&query="+ keyvalue , { 'headers': headers })
    }
    if(type == 1 && (catvalue != "" || catvalue != undefined)){
    return this.http.get<any>(PRPOUrl+"venserv/catalog_supplier?product_id="+productID+"&catalog="+catvalue+"&dts="+dts+"&query="+keyvalue+'&page=' + pageno, { 'headers': headers })
  }
  if(type == 2){
    // return this.http.get<any>(PRPOUrl+"venserv/landlordbranch_list?query="+keyvalue+'&page='+pageno, { 'headers': headers })
    return this.http.get<any>(PRPOUrl+"venserv/supplier_list?query="+keyvalue+'&page='+pageno, { 'headers': headers })

  }
}

  public getHSNDropDown(HSNkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/search_hsncode?query=' + HSNkeyvalue, { 'headers': headers })
  }
  public getHSNDropDownPagination(HSNkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/search_hsncode?query=' + HSNkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getsupplierProductmapping(data, key): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    //  console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.post<any>(PRPOUrl + 'venserv/product_supplier', data, { 'headers': headers })
    // if( (key == "") || (key == undefined) || (key == null)){
    //   return this.http.post<any>(PRPOUrl + 'venserv/catalogproduct_supplier?query=', data, { 'headers': headers })
    // }
    // else{
    return this.http.post<any>(PRPOUrl + 'venserv/catalogproduct_supplier?query='+key, data, { 'headers': headers })
    // }
  }

  public getParyear(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/par_year", { 'headers': headers })
  }
  public getParexpensetype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/exp_type", { 'headers': headers })
  }

  public BulkUploadPR(dataBulk: any, images: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(dataBulk)
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
    formData.append('data', data);
    formData.append('file', images);
    return this.http.post<any>(MicroUrl + 'prserv/upload_pr',formData, { 'headers': headers })
  }


  public DownloadExcel(){
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/download_prtemplate', { 'headers': headers, responseType: 'blob' as 'json' })
  }

public fileDownloadsPoHeader(id: number) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/prpo_filedownload/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
  }
  public getemployeeApproverforPRDD(commodityID,key, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((commodityID == "") || (commodityID == null) || (commodityID == undefined)) {
      commodityID = 0
    }
    return this.http.get<any>(MicroUrl + "mstserv/search_employeelimit?commodityid="+commodityID+"&type=PR&employee="+key+'&page='+page, { 'headers': headers })
  }

  public getpdfPR(prheaderid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/pr/" + prheaderid + "/pdf", { headers, responseType: 'blob' as 'json' })
  }

  public getbarcodePO(poheaderid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(MicroUrl + "prserv/assest_header?po_id=" + poheaderid + "&type=Header&name=Barcode", { 'headers':headers})
    // return this.http.get<any>(MicroUrl + "prserv/fa_asset_details?po_id=" + poheaderid + "&query=ALL_BARCODE", { 'headers':headers})
    return this.http.get<any>(MicroUrl + "prserv/prpo_fa_asset?po_id=" + poheaderid + "&query=PO_BARCODE", { 'headers':headers})
    // prserv/prpo_fa_asset?po_id=5232&detail_id=5351&query=PO_BARCODE

}
 
  public gettingUnitpricePR(catlogname, supplierID, productID): Observable<any>{
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "venserv/catalog_unitprice?catalog="+catlogname+"&supplier="+supplierID+"&product_id="+productID , { 'headers': headers })
  }

  public getassestheader(po_id,datadetailID,type, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(MicroUrl + "prserv/assest_header?po_id="+po_id+"&detail_id="+datadetailID+'&type='+type+"&Page_Index="+page , { 'headers': headers })
    // return this.http.get<any>(MicroUrl + "prserv/fa_asset_details?po_id="+po_id+"&detail_id="+datadetailID+'&query=PO_ASSET' , { 'headers': headers })
    return this.http.get<any>(MicroUrl + "prserv/prpo_fa_asset?po_id="+po_id+"&detail_id="+datadetailID+'&query=PO_ASSET&page='+page+'&received=0' , { 'headers': headers })
    // prserv/prpo_fa_asset?po_id=5232&detail_id=5351&query=PO_ASSET
  }


  public getprdetails(id: any, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    //console.log("po single get details for summary popup", id)
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/prdetail_get/"+id+"?page="+pageNumber, {'headers': headers, params })
  }

  public getGrnAssetdata(detailId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/grn_fa_asset/"+detailId, { 'headers': headers })
  }

  public getemployeeLimitSearchPODD(commodityID, empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "mstserv/search_employeelimit?commodityid=" + commodityID + "&type=PO&employee=" + empkeyvalue+ '&page=' + pageno,{ 'headers': headers })
  }

  public getbarcodePOIndividual(poheaderid, detailId): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(MicroUrl + "prserv/assest_header?po_id="+poheaderid+"&detail_id="+detailId+"&type=Headers&name=Barcode", { 'headers':headers})
    // return this.http.get<any>(MicroUrl + "prserv/fa_asset_details?po_id="+poheaderid+"&detail_id="+detailId+"&query=GET_BARCODE", { 'headers':headers})
    return this.http.get<any>(MicroUrl + "prserv/prpo_fa_asset?po_id="+poheaderid+"&detail_id="+detailId+"&query=PO_BARCODE", { 'headers':headers})
    // prserv/prpo_fa_asset?po_id=5232&detail_id=5351&query=PO_BARCODE

}

public getcommodityFKkey(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(PRPOUrl + 'mstserv/searchcommodity?query=', { 'headers': headers })
}
public getbranchdd(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(PRPOUrl + "usrserv/search_branch?query=", { 'headers': headers })
}
public getbsvaluedd(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(PRPOUrl + "mstserv/searchbusinesssegment?query=", { 'headers': headers })
}
public getcommoditydd(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(PRPOUrl + 'mstserv/searchcommodity?query=', { 'headers': headers })
}

public getsupplierDropdown(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  // return this.http.get<any>(PRPOUrl+"venserv/landlordbranch_list?query=", {'headers': headers })
  return this.http.get<any>(PRPOUrl+"venserv/supplier_list?query=", {'headers': headers })

}
public getsupplierDropdownFKdd(keyvalue, pageno): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  // return this.http.get<any>(PRPOUrl+"venserv/landlordbranch_list?query="+ keyvalue + '&page=' + pageno, { 'headers': headers })
  return this.http.get<any>(PRPOUrl+"venserv/supplier_list?query="+ keyvalue + '&page=' + pageno, { 'headers': headers })

}

public GRRPDf(id): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/grn/"+id+"/pdf", { headers, responseType: 'blob' as 'json' })
  }


public getEmpBranchId(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let id = tokenValue.employee_id;
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(PRPOUrl + "usrserv/emp_empbranch/"+id, { 'headers': headers })
}


public pdfPopupJustificationNote(poheaderid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/po_notepad/" + poheaderid + "/pdf", { headers, responseType: 'blob' as 'json' })
    // return this.http.get<any>(MicroUrl + "prserv/download_po_justification/" + poheaderid, { headers, responseType: 'blob' as 'json' })
  }

  public pardelete(idTodelete): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/par_delete", idTodelete, { 'headers': headers })
  }

  public PAReditFormSubmit(par: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/par_update', par, { 'headers': headers })
  }

  public MEPmakerUpdate(mep: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(mep)
    // console.log("mep Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/mep_update', data, { 'headers': headers })
  }

  public getPRStatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "prserv/get_prpo_status", { 'headers': headers })
  }
  public getuomFK(mepkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "mstserv/uom_search?query=" + mepkeyvalue, { 'headers': headers })
  }
  public getuomFKdd(mepkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'mstserv/uom_search?query=' + mepkeyvalue + '&page=' + pageno, { 'headers': headers })
  }
  public getPARMakerExcel(bpano,bpadesc,bpadate,bpaamount,bpayear): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/par_maker_report?no='+bpano+'&desc='+bpadesc+'&date='+bpadate+'&amount='+bpaamount+'&year='+bpayear,{ headers, responseType: 'blob' as 'json' })
   }

   public getPARCheckerExcel(bpano,bpadesc,bpadate,bpaamount,bpayear): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/par_checker_report?no='+bpano+'&desc='+bpadesc+'&date='+bpadate+'&amount='+bpaamount+'&year='+bpayear,{ headers, responseType: 'blob' as 'json' })
   }

   public getMEPMakerExcel(mepno,mepname,mepamt,mepyear,mepbudget): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/mep_maker_report?no='+mepno+'&name='+mepname+'&amount='+mepamt+'&finyear='+mepyear+'&budgeted='+mepbudget,{ headers, responseType: 'blob' as 'json' })
   }

   public getMEPCheckerExcel(mepno,mepname,mepamt,mepyear,mepbudget): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/mep_approver_report?no='+mepno+'&name='+mepname+'&amount='+mepamt+'&finyear='+mepyear+'&budgeted='+mepbudget,{ headers, responseType: 'blob' as 'json' })
   }

   public getPRMakerExcel(prno,prstatus,branchid,supid,pramt,mepno,prdate): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/pr_maker_report?no='+prno+'&prheader_status='+prstatus+'&branch_id='+branchid+'&supplier_id='+supid+'&amount='+pramt+'&mepno='+mepno+'&date='+prdate,{ headers, responseType: 'blob' as 'json' })
   }

   public getPRCheckerExcel(prno,prstatus,branchid,supid,pramt,mepno,prdate,commname): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/pr_approver_report?no='+prno+'&prheader_status='+prstatus+'&branch_id='+branchid+'&supplier_id='+supid+'&amount='+pramt+'&mepno='+mepno+'&date='+prdate+'&commodityname='+commname,{ headers, responseType: 'blob' as 'json' })
   }

   public getPOMakerExcel(pono,poname,poamount,branchid,notetitle): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/po_maker_report?no='+pono+'&name='+poname+'&amount='+poamount+'&branch_id='+branchid+'&note_title='+notetitle,{ headers, responseType: 'blob' as 'json' })
   }

   public getPOApproverExcel(pono,poname,poamount,branchid,notetitle): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/po_approver_report?no='+pono+'&name='+poname+'&amount='+poamount+'&branch_id='+branchid+'&note_title='+notetitle,{ headers, responseType: 'blob' as 'json' })
   }

   public getPOAmendmentExcel(no,name,amount,branchid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/poamend_report?no='+no+'&name='+name+'&amount='+amount+'&branch_id='+branchid,{ headers, responseType: 'blob' as 'json' })
   }

   public getPOCancelMakerExcel(no,name,amount,branchid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/pocancel_maker_report?no='+no+'&name='+name+'&amount='+amount+'&branch_id='+branchid,{ headers, responseType: 'blob' as 'json' })
   }

   public getPOCancelApproverExcel(no,name,amount,branchid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/pocancel_approver_report?no='+no+'&name='+name+'&amount='+amount+'&branch_id='+branchid,{ headers, responseType: 'blob' as 'json' })
   }

   public getPOCloseMakerExcel(no,name,amount,branchid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/poclose_maker_report?no='+no+'&name='+name+'&amount='+amount+'&branch_id='+branchid,{ headers, responseType: 'blob' as 'json' })
   }

   public getPOCloseApproverExcel(no,name,amount,branchid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/poclose_approver_report?no='+no+'&name='+name+'&amount='+amount+'&branch_id='+branchid,{ headers, responseType: 'blob' as 'json' })
   }

   public getPOReopenExcel(no,name,amount,branchid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/po_reopen_report?no='+no+'&name='+name+'&amount='+amount+'&branch_id='+branchid,{ headers, responseType: 'blob' as 'json' })
   }

   public getGRNMakerExcel(no,supname,fromdate,todate,branchid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/grn_maker_report?no='+no+'&suppliername='+supname+'&fromdate='+fromdate+'&todate='+todate+'&branch_id='+branchid,{ headers, responseType: 'blob' as 'json' })
   }

   public getGRNApproverExcel(no,supname,fromdate,todate,branchid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/grn_approver_report?no='+no+'&suppliername='+supname+'&fromdate='+fromdate+'&todate='+todate+'&branch_id='+branchid,{ headers, responseType: 'blob' as 'json' })
   }






}





