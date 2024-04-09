import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

const HRMS_Url = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class MasterHrmsService {

  headers(){
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token };
    return headers
  }

  constructor(private http: HttpClient, private idle: Idle,) { }
  idleState = 'Not started.';
  timedOut = false;
  public TypeOfCreateEmp;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  // Employee Search
  public Employee_Search_Summary(search, page): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'usrserv/employee?query=' + search.codename + '&page=' + page, { 'headers': headers })
  }


  public getDesignationList(data, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(HRMS_Url + "mstserv/designation?page=" + page + '&data=' + data, { 'headers': headers })
  }


  public getempbankaddsummarys(page: any): Observable<any> {


    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();


    return this.http.get<any>(HRMS_Url + 'usrserv/create_employee_account_details?page=' + page, { 'headers': headers })
  }
  public getempbankaddsummarys_new(page: any): Observable<any> {


    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();


    // return this.http.get<any>(HRMS_Url + 'usrserv/employee_account_get?page='+page, { 'headers': headers })
    return this.http.get<any>(HRMS_Url + 'usrserv/create_employee_account_details?page=' + page, { 'headers': headers })
  }



  public getbsdatafilter(data: any, page: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token


    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(HRMS_Url + 'usrserv/employee_bs_data?data=' + data + '&page=' + page, { 'headers': headers })
  }
  public getccdatafilter(id: any, data: any, page: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token


    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    return this.http.get<any>(HRMS_Url + 'usrserv/employee_bs_data?data=' + data + '&page=' + page, { 'headers': headers })
  }



  public getcitydatafilter(id: any, data: any, page: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(HRMS_Url + 'mstserv/city_scroll/' + id + '?page=' + page + '&data=' + data, { 'headers': headers })
  }

  public getbranchdatafilter(data: any, page: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(HRMS_Url + 'usrserv/Branch_data?data=' + data + '&page=' + page, { 'headers': headers })
  }
  public getbranchdataid(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(HRMS_Url + 'usrserv/employeebranch_get/' + data, { 'headers': headers })
  }
  public getstatedatafilter(id: any, data: any, page: any): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token


    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(HRMS_Url + 'mstserv/fetch_state_scroll/' + id + '?page=' + page + '&data=' + data, { 'headers': headers })
  }
  public getdistrictdatafilter(id: any, data: any, page: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(HRMS_Url + 'mstserv/district_scroll/' + id + '?page=' + page + '&data=' + data, { 'headers': headers })
  }

  public getPinCodeDropDownscroll(pinkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (pinkeyvalue === null) {
      pinkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = HRMS_Url + 'mstserv/pincode_search?query=' + pinkeyvalue + '&page=' + pageno;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getCityDropDownscroll(citykeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (citykeyvalue === null) {
      citykeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = HRMS_Url + 'mstserv/new_city_search?query=' + citykeyvalue + '&page=' + pageno;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getempcodedropdown(data: any, page: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(HRMS_Url + 'usrserv/employee_account_get?page=' + page + '&data=' + data, { 'headers': headers })
  }

  public getStateList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(HRMS_Url + "mstserv/state?page=" + pageNumber, { 'headers': headers })
  }

  public getHierarchyList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(HRMS_Url + "usrserv/employeehierarchy?page=" + pageNumber + "&data=" + pageSize, { 'headers': headers })
  }

  public getlistdepartment(data, pageNumber: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + "usrserv/employee_department?page=" + pageNumber + "&data=" + data, { 'headers': headers })
  }
  public getReportingBranch(data, pageNumber: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + "usrserv/Branch_data?data=" + pageNumber + "&data=" + data, { 'headers': headers })
  }
  public getlistdepartmentsenoor(pageNumber: any, data: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let params: any = new HttpParams();
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(HRMS_Url + "usrserv/fetch_emp_dropdown?data=" + data + "&page=" + pageNumber, { 'headers': headers })
  }
  public getDistrictList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(HRMS_Url + "mstserv/district?page=" + pageNumber, { 'headers': headers })
  }

  public getlistdepartmentcreate(data: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(HRMS_Url + "usrserv/employee", data, { 'headers': headers })
  }



  // public getEmpDetails(id): Observable<any> {
  //   this.reset()
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(HRMS_Url + 'usrserv/employee/' + id, { 'headers': headers })
  // }
  public getEmpDetails(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
      const apiUrl = HRMS_Url + 'usrserv/employee/' + id + '?action=hrms_employee';
  
    const headers = { 'Authorization': 'Token ' + token };
  
    return this.http.get<any>(apiUrl, { 'headers': headers });
  }

  public getTeamLead(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
      const apiUrl = HRMS_Url + 'taskserv/emp_common_search?page=1&designation=lead';
  
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(apiUrl, { 'headers': headers });
  }
  

  public getRole(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
      const apiUrl = HRMS_Url + 'taskserv/task_dropdown?action=role';
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(apiUrl, { 'headers': headers });
  }
  
  //usrserv/employee/64?action=hrms_employee
  public getEmpBasicInfo(id): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'hrmsserv/employeedetails/' + id, { 'headers': headers })
  }

  public getEmpEducationInfo(id): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'hrmsserv/employeeeducationdetails/' + id, { 'headers': headers })
  }

  public getEmpBankDetails(id): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'hrmsserv/employeebankdetails/' + id, { 'headers': headers })
  }

  public getEmpDocuments(id): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'hrmsserv/employeedocument/' + id, { 'headers': headers })
  }

  public getEmpDocumentNames(): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'hrmsserv/hrmsdocument_type' , { 'headers': headers })
  }
  
  public getEmpFamilyInfo(id): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'hrmsserv/employeefamilyinfo/' + id, { 'headers': headers })
  }

  public getEmergencyInfo(id): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'hrmsserv/empemergencycontact/' + id, { 'headers': headers })
  }
  public getEmpExperienceInfo(id): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'hrmsserv/employeeexperiences/' + id, { 'headers': headers })
  }

  public getEmpBankDetailsInfo(id): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'hrmsserv/employeebankdetails/' + id, { 'headers': headers })
  }
  public getEmpEmerencyContactInfo(id): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'hrmsserv/empemergencycontact/' + id, { 'headers': headers })
  }

  public EmpDetails(type, empid, method, data): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    ////// Education
    if (type == 'Education') {
      if (method == 'get') {
        return this.http.get<any>(HRMS_Url + 'hrmsserv/employeeeducationdetails/' + empid, { 'headers': headers })
      }
      if (method == 'post') {
        return this.http.post<any>(HRMS_Url + 'hrmsserv/employeeeducationdetails/' + empid, data, { 'headers': headers })
      }
    }
    ///// Experience
    if (type == 'Experience') {
      if (method == 'get') {
        return this.http.get<any>(HRMS_Url + 'hrmsserv/employeeexperiences/' + empid, { 'headers': headers })
      }
      if (method == 'post') {
        return this.http.post<any>(HRMS_Url + 'hrmsserv/employeeexperiences/' + empid, data, { 'headers': headers })
      }
    }
    ///////// Family Details
    if (type == 'Family Details') {
      if (method == 'get') {
        return this.http.get<any>(HRMS_Url + 'hrmsserv/employeefamilyinfo/' + empid, { 'headers': headers })
      }
      if (method == 'post') {
        return this.http.post<any>(HRMS_Url + 'hrmsserv/employeefamilyinfo/' + empid, data, { 'headers': headers })
      }
    }
    if (type == 'Emergency Contacts') {
      if (method == 'get') {
        return this.http.get<any>(HRMS_Url + 'hrmsserv/empemergencycontact/' + empid, { 'headers': headers })
      }
      if (method == 'post') {
        return this.http.post<any>(HRMS_Url + 'hrmsserv/empemergencycontact/' + empid, data, { 'headers': headers })
      } 
    }
    if (type == 'Bank Details') {
      if (method == 'get') {
        return this.http.get<any>(HRMS_Url + 'hrmsserv/employeebankdetails/' + empid, { 'headers': headers })
      }
      if (method == 'post') {
        return this.http.post<any>(HRMS_Url + 'hrmsserv/employeebankdetails/' + empid, data, { 'headers': headers })
      }
    }
    if (type == 'Emp Info') {
      if (method == 'get') {
        console.log("emp basic details api called")
        return this.http.get<any>(HRMS_Url + 'usrserv/employee/' + empid, { 'headers': headers })
      }
      if (method == 'post') {
        return this.http.post<any>(HRMS_Url + 'usrserv/employee/' + empid, data, { 'headers': headers })
      }
    }


  }

  public getrelationship(type): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'hrmsserv/hrms_drop_down?action='+type, { 'headers': headers })
  }

  public getbank(data, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(HRMS_Url + "" + page + '&data=' + data, { 'headers': headers })
  }

  public getbank_branchdata(data, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(HRMS_Url + "" + page + '&data=' + data, { 'headers': headers })
  }


  public TypeOfDocumentDownload(type): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    let empdata 
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
      empdata = tokenValue?.employee_id 
    }
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(HRMS_Url + 'hrmsserv/commontemplate_pdf/'+empdata+'?type='+type,{ headers, responseType: 'blob' as 'json' })
   }
  


   public getemployeetrackdetails(emp,date,page): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'atdserv/employee_tracker?emp_id='+emp+'&log_date='+date+'&page='+page, { 'headers': headers })
  }

  public emplevellogdata(id,date): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'atdserv/employee_tracker?emp_id='+id+'&log_date='+date, { 'headers': headers })
  }

  public employeecomments(id): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'atdserv/employee_comment?action=my_comment&my_comment='+id, { 'headers': headers })
  }

  public getTitleList(data, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(HRMS_Url + "mstserv/title?page=" + page + '&data=' + data, { 'headers': headers })
  }


  public getStreamList(data, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(HRMS_Url + "mstserv/stream?page=" + page + '&data=' + data, { 'headers': headers })
  }



  public postEmployeeEducationInfo(id, data): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(HRMS_Url + 'hrmsserv/employeeeducationdetails/' + id,data,{ 'headers': headers })
  }
  public postEmployeeFamilyInfo(id, data): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(HRMS_Url + 'hrmsserv/employeefamilyinfo/' + id,data,{ 'headers': headers })
  }

  public postEmgInfo(id:number, data:any): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(HRMS_Url + 'hrmsserv/empemergencycontact/' + id,data,{ 'headers': headers })
  }
//http://127.0.0.1:8002/hrmsserv/empemergencycontact/employee_id
  public postDeactivate(id: any, data: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
      const url = HRMS_Url + 'usrserv/hremployee/' + id + '?type=deactivate';
    return this.http.post<any>(url, data, { 'headers': headers });
  }
  //http://13.200.50.27:8188/usrserv/hremployee/1?type=deactivate
  public postEmployeeBankDetails(id:any, data:any): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(HRMS_Url + 'hrmsserv/employeebankdetails/' + id,data,{ 'headers': headers })
  }

  public postEmpBasicDetails(data: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(HRMS_Url + 'usrserv/employee?action=update', data, { 'headers': headers });
  }
   
//"http://13.200.50.27:8188/usrserv/employee/undefined?action=hrms_employee"
  
  public postEmployeeExperienceInfo(id:any, data:any): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(HRMS_Url + 'hrmsserv/employeeexperiences/' + id,data,{ 'headers': headers })
  }

  public postNoticePeriod(id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    const url = HRMS_Url + 'usrserv/hremployee/' + id + '?type=noticeperiod';
  
    const emptyObject = {};
  
    return this.http.post<any>(url, emptyObject, { 'headers': headers });
  }
  
  
//usrserv/hremployee/1?type=noticeperiod
  public editEmployeeEducationInfo(id, data): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(HRMS_Url + 'hrmsserv/employeeeducationdetails/' + id,data,{ 'headers': headers })
  }


  public deleteEmployeeEducationRecord(id: number, empId: number): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData');
    const tokenValue = JSON.parse(getToken);
    const token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    const options = {
      headers: new HttpHeaders(headers),
    };
    return this.http.get<any>(HRMS_Url + 'hrmsserv/employeeeducationdetails/' + empId + '?action=delete&id=' + id, options);
  }

  public deleteEmployeeBankRecord(id: number, empId: number): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData');
    const tokenValue = JSON.parse(getToken);
    const token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    const options = {
      headers: new HttpHeaders(headers),
    };
    return this.http.get<any>(HRMS_Url + 'hrmsserv/employeefamilyinfo/' + empId + '?action=delete&id=' + id, options);
  }
 

  public deleteEmployeeFamilyRecord(id: number, empId: number): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData');
    const tokenValue = JSON.parse(getToken);
    const token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    const options = {
      headers: new HttpHeaders(headers),
    };
    return this.http.get<any>(HRMS_Url + 'hrmsserv/employeebankdetails/' + empId + '?action=delete&id=' + id, options);
  }

  public deleteEmployeeExperienceRecord(id: number, empId: number): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData');
    const tokenValue = JSON.parse(getToken);
    const token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    const options = {
      headers: new HttpHeaders(headers),
    };
    return this.http.get<any>(HRMS_Url + 'hrmsserv/employeeexperiences/' + empId + '?action=delete&id=' + id, options);
  }
  // http://127.0.0.1:8002/hrmsserv/employeeexperiences/employee_id
  // http://127.0.0.1:8000/hrmsserv/employeeeducationdetails/1?action=delete&id=1
  public getStreamDropdownList(query: string): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    
    return this.http.get<any>(HRMS_Url + 'mstserv/stream', {
      headers,
      params: { query: query }
    });
  }

  public getTitleDropdownList(query): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    
    return this.http.get<any>(HRMS_Url + 'mstserv/title?', {
      headers,
      params: { query: query }
    });
  }

  //getting bussiness segment
  public getBusinessSegmentDropdownList(query: string, page: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
  
    return this.http.get<any>(HRMS_Url + 'usrserv/searchbusinesssegment', {
      headers,
      params: { query: query, page: page.toString() }
    });
  }
  
  //branch dropdown
  public getBranchDropdownList(query: string, page: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };    
    return this.http.get<any>(HRMS_Url + 'usrserv/Branch_data?data', {
      headers,
      params: { data: query, page: page.toString() }
    });
  }

  //pincode
  public getPincodeList(query: string, page: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };    
    return this.http.get<any>(HRMS_Url + 'mstserv/pincode_search?query', {
      headers,
      params: { data: query, page: page.toString() }
    });
  }

  //work shift
  public getWorkshiftData(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };

    const url = HRMS_Url+'hrmsserv/workshift';

    return this.http.get<any>(url, {
      headers
    });
  }
  
//cost centre
public getCcDropdownList(query: string, page: number): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };

  return this.http.get<any>(HRMS_Url + 'usrserv/searchcostcentre', {
    headers,
    params: { query: query, page: page.toString() }
  });
}
  
  public getMappedDegreeList(titleId,query): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
  
    return this.http.get<any>(HRMS_Url + `mstserv/title/${titleId}/degree?`, { headers ,    params: { query: query }});
  }
  

  public getStreamAutList(titleId,query): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
  
    return this.http.get<any>(HRMS_Url + `mstserv/degree/${titleId}/stream?`, { headers ,    params: { query: query }});
  }
  
  public getCitySearchResults(query: string): Observable<any> {
    this.reset();
      const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = new HttpHeaders({
      'Authorization': 'Token ' + token
    });
    const params = new HttpParams()
      .set('query', query)
    const url = `${HRMS_Url}mstserv/city_search_new`;
      return this.http.get<any>(url, { headers, params });

  }



  public getBankIfscList(name:string): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    
    return this.http.get<any>(HRMS_Url + 'mstserv/ifsc_drop_down?', {
      headers,
      params: { query: name }
    });
  }
  // http://13.200.50.27:8188/mstserv/ifsc_drop_down?query=ALLA0210391
  public getBankTypeDropdownList(name: string): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
  
    const url = `${HRMS_Url}hrmsserv/hrms_drop_down?action=${name}`;
  
    return this.http.get<any>(url, {
      headers
    });
  }

  public getRoleDropdownList(name: string): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
  
    const url = `${HRMS_Url}taskserv/task_dropdown?action=${name}`;
  
    return this.http.get<any>(url, {
      headers
    });
  }
  



  public getBankBranchDropdownNameList(id:number): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'mstserv/bank_fetch/' + id,{ 'headers': headers })

  }
itemArr:[]
  // public postDocumentDetails(id: any, data: any[], file: FormData): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData');
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   const headers = { 'Authorization': 'Token ' + token };
  //   const url = HRMS_Url + 'hrmsserv/employeebankdetails/' + id;
  
  //   // Append 'data' to 'file'
  //   data.forEach((item) => {
  //     file.append('data', JSON.stringify(item));
  //   });
  // console.log("upload data",data)
  //   return this.http.post<any>(url, file, { 'headers': headers });
  // }

  public postDocumentDetails(id: any, data: any[], file: FormData): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    const url = HRMS_Url + 'hrmsserv/employeedocument/' + id;
  
    // Append other form fields to FormData
    data.forEach(item => {
      file.append('data', JSON.stringify([item]));
    });
  
    // Log the formatted FormData
    console.log('Formatted FormData:', file);
  
    return this.http.post<any>(url, file, { 'headers': headers });
  }
  
  public getEmployeeDocumentDetails(employeeId: number, docId: number): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.delete<any>(HRMS_Url + `hrmsserv/employeedocument/${employeeId}?doc_id=${docId}`, { 'headers': headers });
  }
  
  public getEmployeeRoleValidation(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
  
    return this.http.get<any>(HRMS_Url +'/usrserv/hr_employee_role_validation', { 'headers': headers });
  }

  public createNewEmployee(jsonData): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
  
    return this.http.post<any>(HRMS_Url +'usrserv/new_employee_creation',jsonData , { 'headers': headers });
  }

  public getEmployeeDetails(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
      const apiUrl = HRMS_Url + 'usrserv/employeeinfo_get/'+ id ;
  
    const headers = { 'Authorization': 'Token ' + token };
  
    return this.http.get<any>(apiUrl, { 'headers': headers });
  }
  public EmpUpdate(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(HRMS_Url + 'usrserv/new_employee_creation',data, { 'headers': headers })
  }

  public getEmpBankDetailsNew(id): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'usrserv/get_bank_details_data/' + id, { 'headers': headers })
  }

  public postEmployeeBankDetailsNew(id:any, data:any): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(HRMS_Url + 'usrserv/new_employee_creation/' +id+'/employeebankdetails_create?hr_approval=True',data,{ 'headers': headers })
  }

  public createNewEmployeeAddress(id, jsonData): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
  
    return this.http.post<any>(HRMS_Url +'usrserv/new_employee_creation/'+id+'/employeeaddress_create?hr_approval=True',jsonData , { 'headers': headers });
  }

  public getEmpFamilyInfoNew(id): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'usrserv/get_employeefamily_data/' + id+'?is_emcp=False', { 'headers': headers })
  }

  public postEmployeeFamilyInfoNew(id, data): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(HRMS_Url + 'usrserv/new_employee_creation/'+id+'/employeefamilyinfo_create',data,{ 'headers': headers })
  }

  public getEmpExperienceInfoNew(id): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'usrserv/get_employeeexperience_data/'+id, { 'headers': headers })
  }

  public postEmployeeExperienceInfoNew(id:any, data:any): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(HRMS_Url + 'usrserv/new_employee_creation/'+id+'/employeeexperience_create?hr_approval=True',data,{ 'headers': headers })
  }

  public getEmpEducationInfoNew(id): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'usrserv/get_employeeeducation_data/' + id, { 'headers': headers })
  }

  public postEmployeeEducationInfoNew(id, data): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(HRMS_Url + 'usrserv/new_employee_creation/'+id+'/employeeeducationdetails_create?hr_approval=True',data,{ 'headers': headers })
  }
  public getEmpFamilyInfoNews(id): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'usrserv/get_employeefamily_data/' + id+'?is_emcp=True', { 'headers': headers })
  }
  public getEmpAddressInfoNew(id): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + 'usrserv/get_address_data/'+id, { 'headers': headers })
  }
  public getPincodeLists(query: string): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };    
    return this.http.get<any>(HRMS_Url + 'mstserv/pincode_search?query', {
      headers,
      params: { data: query}
    });
  }
  public viewDocumentDetails(employeeId: number, docId: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(HRMS_Url + 'docserv/doc_download/'+docId+'?entity_id=1&user_id='+employeeId, { 'headers': headers,  responseType: 'blob' as 'json' });
  }
  public postprofilepics(id: any, data: any, file: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    const url = HRMS_Url + 'hrmsserv/employeedocument/' + id;
    // let formData = new FormData();
    // formData.append('data', data);
    // formData.append('file', file)
     file.append('data', JSON.stringify([data]));  
    console.log('Formatted FormData:', file);
    return this.http.post<any>(url, file, { 'headers': headers });
  }

  public checkIfsc(ifsc: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>('https://ifsc.razorpay.com/'+ifsc);
  }

  public get_singleBankBranch(bankBranchId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = bankBranchId
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + "mstserv/bankbranch?query="+idValue, { 'headers': headers })

  }

  
  get_singleBank(bankBranchId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = bankBranchId
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(HRMS_Url + "mstserv/bank?query="+idValue, { 'headers': headers })

  }

  public createBankForm(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(HRMS_Url + "mstserv/bank", body, { 'headers': headers })
}

public branchCreateForm(branch: any): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let data = JSON.stringify(branch)
  console.log("bankbrach", data)
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(HRMS_Url + 'mstserv/bankbranch', data, { 'headers': headers })
}

getGenderDropDown(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(HRMS_Url + "usrserv/gender_drop_down", { 'headers': headers })

}
getMaritalDrop(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(HRMS_Url + "usrserv/martial_status_drop_down", { 'headers': headers })

}

public deleteAddressInfo(id: number, empId: number): Observable<any> {
  const getToken: any = localStorage.getItem('sessionData');
  const tokenValue = JSON.parse(getToken);
  const token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  const options = {
    headers: new HttpHeaders(headers),
  };
  return this.http.delete<any>(HRMS_Url + 'usrserv/inactive_address/'+id, options);
}
PostEmployeeScreen(data): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(HRMS_Url + "usrserv/martial_status_drop_down", { 'headers': headers })

}

public deleteEducationInfo(id: number, empId: number): Observable<any> {
  const getToken: any = localStorage.getItem('sessionData');
  const tokenValue = JSON.parse(getToken);
  const token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  const options = {
    headers: new HttpHeaders(headers),
  };
  return this.http.delete<any>(HRMS_Url + 'usrserv/inactive_education/'+id, options);
}
public deleteBankInfo(id: number, empId: number): Observable<any> {
  const getToken: any = localStorage.getItem('sessionData');
  const tokenValue = JSON.parse(getToken);
  const token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  const options = {
    headers: new HttpHeaders(headers),
  };
  return this.http.delete<any>(HRMS_Url + 'usrserv/inactive_bank/'+id, options);
}
public deleteEmergencyRecord(id: number, empId: number): Observable<any> {
  const getToken: any = localStorage.getItem('sessionData');
  const tokenValue = JSON.parse(getToken);
  const token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  const options = {
    headers: new HttpHeaders(headers),
  };
  return this.http.delete<any>(HRMS_Url + 'usrserv/inactive_familyinfo/'+id, options);
}

public deleteExperienceInfo(id: number, empId: number): Observable<any> {
  const getToken: any = localStorage.getItem('sessionData');
  const tokenValue = JSON.parse(getToken);
  const token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  const options = {
    headers: new HttpHeaders(headers),
  };
  return this.http.delete<any>(HRMS_Url + 'usrserv/inactive_experience/'+id, options);
}
}




  
  



