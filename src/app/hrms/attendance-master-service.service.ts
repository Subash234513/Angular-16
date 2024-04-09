import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { map } from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { state } from '@angular/animations';
import { Action } from 'rxjs/internal/scheduler/Action';

const attendance_Url = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class AttendanceMasterServiceService {

  constructor(private http: HttpClient, private idle: Idle) { }
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }



  public getholidaydetails(data, page) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(data)
    return this.http.get<any>(attendance_Url + "mstserv/holidaymst?action=leavesummary&query=" + data.state + "&year=" + data.name + '&page=' +page, { 'headers': headers })
  }
  public getLeavedetails(data, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(attendance_Url + 'mstserv/leave_type?query=' + data + '&page=' + page, { 'headers': headers })
  }
  
  public getAttendancedetails(pageNumber = 1) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(attendance_Url + "mstserv/attendance?page=" + pageNumber, { 'headers': headers })
  }
  public getOrgDetails(data, pageno) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(attendance_Url + "mstserv/org_details?query=" + data.name + "&page=" + pageno, { 'headers': headers })
  }
  public getOrg_IP(data, pageno) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(attendance_Url + "mstserv/org_ip?query=" + data.name + "&page=" + pageno, { 'headers': headers })
  }
  public getGrade(data, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(data)
    return this.http.get<any>(attendance_Url+ 'mstserv/grade?query=' + data + '&page=' + pageno, { 'headers': headers })
  }
  public getShiftMapping(data, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(data)
    return this.http.post<any>(attendance_Url+ 'hrmsserv/employeeshiftmapping?page=' + pageno, data,{ 'headers': headers })
  }
  public getShiftMappingHistry(data, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(data)
    return this.http.get<any>(attendance_Url+ 'hrmsserv/employeeshiftmapping?action=shifthistory&employeeid=' + data.employee_id.id + '&page=' + pageno, { 'headers': headers })
  }
  public ShiftMappingHistry(data, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(data)
    return this.http.post<any>(attendance_Url+ 'hrmsserv/employeedetails/'+id+'?action=shift',data, { 'headers': headers })
  }

  public getShiftMappingEmployee(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(data)
    return this.http.get<any>(attendance_Url+ 'usrserv/searchemployee?query=' + data, { 'headers': headers })
  }



   // holidaytype list
   public holidaytypeList(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(attendance_Url + 'atdserv/holiday_type' , { 'headers': headers })
  }

  public holidayform(data: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(attendance_Url + 'mstserv/holidaymst', data, { 'headers': headers })
  }


  public leaveform(data: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(attendance_Url + 'mstserv/leave_type', data, { 'headers': headers })
  }
  public attendanceform(data: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let namespace = {
      "namespace": data.check_in_mode.toUpperCase()
    }
    let jsonValue = Object.assign({}, data, namespace)
    return this.http.post<any>(attendance_Url + 'mstserv/attendance', jsonValue, { 'headers': headers })
  }
  public orgdetailsform(data: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(attendance_Url + 'mstserv/org_details', data, { 'headers': headers })
  }
  public orgIPform(data: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(attendance_Url + 'mstserv/org_ip?status=2', data, { 'headers': headers })
  }
  
  public gradeform(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(attendance_Url + 'mstserv/grade', data, { 'headers': headers })
  }


  public getLeaveRequest(data,pageno) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(attendance_Url + "atdserv/leave_summary?fromdate=" + data.fromdate + "&todate=" + data.todate + "&status=" + data.status +  "&page=" + pageno, { 'headers': headers })
  }

  public leaveRequestform(formData): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(attendance_Url + 'atdserv/leave_request', formData, { 'headers': headers })
  }
  public leaveRequestList() {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(attendance_Url + "mstserv/leave_type", { 'headers': headers })
  }

  public getParticularLeaveRequest(leave_Req_Id: any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(attendance_Url + 'atdserv/leave_request/' + leave_Req_Id, { 'headers': headers })
       
  }
  public leaveRequest_Approval_Reject(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(attendance_Url + 'atdserv/leave_approve',data, { 'headers': headers })
  }

  // check in mode
  public check_IN_Mode(type, lat, long): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = {'Authorization': 'Token ' + token }
    // console.log("obj data for check in", obj)
    let obj = {
      latitude: lat,
      longitude: long 
    }
    return this.http.post<any>(attendance_Url + 'atdserv/check_in?mode='+type, obj,{ 'headers': headers})
  }

   // check out mode
   public check_OUT_Mode(obj): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = {'Authorization': 'Token ' + token }
    return this.http.post<any>(attendance_Url + 'atdserv/check_in?mode=2', obj, { 'headers': headers })
  }

  // public holidayDelete(holidaydelete_Id): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.delete<any>(attendance_Url + 'mstserv/holiday/' + holidaydelete_Id , { 'headers': headers })
  // }
  public leaveDelete(leavedelete_Id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(attendance_Url + 'mstserv/leave_type/' + leavedelete_Id , { 'headers': headers })
  }

  public attendanceDelete(attdelete_Id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(attendance_Url + 'mstserv/attendance/' + attdelete_Id , { 'headers': headers })
  }

  public orgDetailsDelete(orgdetdelete_Id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(attendance_Url + 'mstserv/org_details/' + orgdetdelete_Id , { 'headers': headers })
  }

  public orgIPDelete(orgipdelete_Id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(attendance_Url + 'mstserv/org_ip/' + orgipdelete_Id , { 'headers': headers })
  }


  // public GetApprovalStatus(): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(attendance_Url + 'atdserv/attendance_type_summary', { 'headers': headers })
  // }


  // public getPer_day_LogList(): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(attendance_Url + "atdserv/per_day_log?mode=2" , { 'headers': headers })
  // }

  public getpastattendance(pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(attendance_Url + 'atdserv/attendance?page=' + pageno, { 'headers': headers })
  }

  public files(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(attendance_Url + "atdserv/atd_download/" + id, { headers, responseType: 'blob' as 'json' })
  }


  public getParticularOrgdetailView(orgDetail_Id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(attendance_Url + 'mstserv/org_details_ip/' + orgDetail_Id, { 'headers': headers })
     
}


public timelog(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + 'atdserv/day_log_summary', { 'headers': headers })
}

public showAttendanceCalender(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + 'atdserv/attendance', { 'headers': headers })
}


public attendanceReport(data, page): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  // if(name == null || name == undefined){ name = ''};
  // if(month == null || month == undefined){ month = ''};
  // if(year == null || year == undefined){ year = ''}
  return this.http.post<any>(attendance_Url + 'atdserv/attendance?action=report&name='+data.name+'&month='+data.month+'&year='+data.year+'&page'+page,{}, { 'headers': headers })
}

public getemployee(empkeyvalue): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + "usrserv/searchemployee?query=" + empkeyvalue, { 'headers': headers })
}

public getgradetypesum(data, page): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + 'mstserv/grade?query=' + data + '&page=' + page, { 'headers': headers })
}
public getleavemappingsum(code): Observable<any> { 
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  console.log(code)
  return this.http.get<any>(attendance_Url + 'mstserv/grade_leave_mapping?grade=' + code, { 'headers': headers })
}

// public getleavetypesum(data, page): Observable<any> {
//   this.reset();
//   const getToken = localStorage.getItem("sessionData")
//   let tokenValue = JSON.parse(getToken);
//   let token = tokenValue.token
//   const headers = { 'Authorization': 'Token ' + token }
//   return this.http.get<any>(attendance_Url + 'mstserv/leave_type?query=' + data + '&page=' + page, { 'headers': headers })
// }

public GradeLeaveMappingForm(data): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(attendance_Url + 'mstserv/grade_leave_mapping',  data, { 'headers': headers })
}
public getState(data): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + "mstserv/state?query="+ data, { 'headers': headers })
}

public getdataBasedOnStateAndYear(year, state): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + 'mstserv/holidaymst?state='+ state +'&year='+ year, { 'headers': headers }) 
}
public HrManualRun(data):Observable<any>{
  const gettoken=JSON.parse(localStorage.getItem('sessionData'))
  let token=gettoken.token
  const headers={'Authorization':'Token '+token}
  return this.http.get<any>(attendance_Url + 'atdserv/attendance_schd?date='+data,{'headers':headers})
}
public EmpManualRun(year,month):Observable<any>{
  const gettoken=JSON.parse(localStorage.getItem('sessionData'))
  let token=gettoken.token
  const headers={'Authorization':'Token '+token}
  return this.http.get<any>(attendance_Url + 'atdserv/leave_monthly_scheduler?year='+year+'&month='+month,{'headers':headers})
}
public EmpLocSummary(employeeID,status,action,page):Observable<any>{
  const gettoken=JSON.parse(localStorage.getItem('sessionData'))
  let token=gettoken.token
  const headers={'Authorization':'Token '+token}
  if(page){
    if(employeeID || status){
      return this.http.get<any>(attendance_Url + 'atdserv/create_wfhlocation?action='+action+'&page='+page+'&employee_id='+employeeID+'&approve_status='+status,{'headers':headers})
    }
    else{
      return this.http.get<any>(attendance_Url + 'atdserv/create_wfhlocation?action='+action+'&page='+page,{'headers':headers})
    }
  }
  else{
    if(employeeID || status){
      return this.http.get<any>(attendance_Url + 'atdserv/create_wfhlocation?action='+action+'&page=1&employee_id='+employeeID+'&approve_status='+status,{'headers':headers})
    }
    else{
      return this.http.get<any>(attendance_Url + 'atdserv/create_wfhlocation?action='+action+'&page=1',{'headers':headers})
    }
  }
 

}
public EmpLocSummaryPatch(page):Observable<any>{
  const gettoken=JSON.parse(localStorage.getItem('sessionData'))
  let token=gettoken.token
  const headers={'Authorization':'Token '+token}
  return this.http.get<any>(attendance_Url + 'atdserv/create_wfhlocation?action=summary&page='+page,{'headers':headers})


}
public EmpDataLocation(name):Observable<any>{
  const gettoken=JSON.parse(localStorage.getItem('sessionData'))
  let token=gettoken.token
  const headers={'Authorization':'Token '+token}
  return this.http.get<any>(attendance_Url + 'taskserv/project_employee_summary?query='+name,{'headers':headers})
}
public EmpDataLocationCreate(name):Observable<any>{
  const gettoken=JSON.parse(localStorage.getItem('sessionData'))
  let token=gettoken.token
  const headers={'Authorization':'Token '+token}
  return this.http.post<any>(attendance_Url + 'atdserv/create_wfhlocation',name,{'headers':headers})
}
public EmpDataLocationApprovee(data,approve):Observable<any>{
  const gettoken=JSON.parse(localStorage.getItem('sessionData'))
  let token=gettoken.token
  const headers={'Authorization':'Token '+token}
  return this.http.post<any>(attendance_Url + 'atdserv/create_wfhlocation?action='+approve,data,{'headers':headers})
}
public EmpDataLocationEdit(name):Observable<any>{
  const gettoken=JSON.parse(localStorage.getItem('sessionData'))
  let token=gettoken.token
  const headers={'Authorization':'Token '+token}
  return this.http.get<any>(attendance_Url + 'atdserv/create_wfhlocation?action=get&wfh_id='+name,{'headers':headers})
}
public EmpDataLocationDelete(name):Observable<any>{
  const gettoken=JSON.parse(localStorage.getItem('sessionData'))
  let token=gettoken.token
  const headers={'Authorization':'Token '+token}
  return this.http.delete<any>(attendance_Url + 'atdserv/create_wfhlocation?wfh_id='+name,{'headers':headers})
}
PostEmployeeScreen(data,page): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(attendance_Url + "hrmsserv/emergency_info?page="+page,data, { 'headers': headers })

}


}

