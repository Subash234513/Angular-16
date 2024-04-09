import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { map } from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

const attendance_Url = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: HttpClient, private idle: Idle) { }
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }



  public getholidaydetails(data, pageno) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(attendance_Url + "mstserv/holiday?query=" + data.name + "&page=" + pageno, { 'headers': headers })
  }
  public getLeavedetails(pageNumber = 1) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(attendance_Url + "mstserv/leave_type?page=" + pageNumber, { 'headers': headers })
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
    return this.http.post<any>(attendance_Url + 'mstserv/holiday', data, { 'headers': headers })
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


  public getLeaveRequest(data,pageno) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(attendance_Url + "atdserv/leave_request?fromdate=" + data.fromdate + "&todate=" + data.todate +  "&page=" + pageno, { 'headers': headers })
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
  public leaveRequest_Approval_Reject(data, id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(attendance_Url + 'atdserv/leave_request/'+id+'?action=approval',data, { 'headers': headers })
  }

  // check in mode
  public check_IN_Mode(type, long, lat): Observable<any> {
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
    // let obj = {"latitude":12.9738668,"longitude":80.2496096}
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

  public holidayDelete(holidaydelete_Id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(attendance_Url + 'mstserv/holiday/' + holidaydelete_Id , { 'headers': headers })
  }
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

public showAttendanceCalender(year, month): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + 'atdserv/attendance?month='+month+'&year='+year, { 'headers': headers })
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
  let dataemp = {
    arr: data.emp 
  }
  // return this.http.post<any>(attendance_Url + 'atdserv/attendance?action=report&query=&month='+data.month+'&year='+data.year+'&page='+page,dataemp, { 'headers': headers })
  return this.http.post<any>(attendance_Url + 'atdserv/attendance?action=exl_report&query=&month='+data.month+'&year='+data.year+'&page='+page,dataemp, { 'headers': headers })

}

public getemployee(empkeyvalue): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + "usrserv/searchemployee?query=" + empkeyvalue, { 'headers': headers })
}

public getActivitySinglelog(data, id): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + "atdserv/per_day_log/"+id+"?log_date=" + data, { 'headers': headers })
}

public Attendanceexceldownload(month, year): Observable<any> {
  this.reset();
  let token = '';
  const getToken = localStorage.getItem("sessionData");
  if (getToken) {
    let tokenValue = JSON.parse(getToken);
    token = tokenValue.token
  }
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + 'atdserv/attendanceexcel?month='+month+'&year='+year,{ headers, responseType: 'blob' as 'json' })
 }


// public Attendanceexceldownload(obj): Observable<any> {
//   this.reset();
//   const getToken: any = localStorage.getItem('sessionData');
//   const tokenValue = JSON.parse(getToken);
//   const token = tokenValue.token;
//   const headers = { 'Authorization': 'Token ' + token };
//   let dataemp = {
//     arr: obj.emp 
//   }
//   const url = `${attendance_Url}atdserv/attendanceexcel?month=${obj.month}&year=${obj.year}&query=`;

//   return this.http.post<any>(url, obj, { headers });
// }

public AttendanceexceldownloadNew(month, year, obj): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData');
  const tokenValue = JSON.parse(getToken);
  const token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };

  const url = `${attendance_Url}atdserv/attendanceexcel?month=${month}&year=${year}`;

  return this.http.post<any>(url, obj,  { headers, responseType: 'blob' as 'json' });
}

 //http://127.0.0.1:8000/atdserv/attendanceexcel?month=10&year=2023&query=monesh jai
 public requestForLeave(id, type): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + 'atdserv/leave_request/'+id+'?action='+type,  { 'headers': headers })
}


public getLeaveRequestApprovalSummary(data,pageno) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + "atdserv/leave_request?fromdate=" + data.fromdate + "&todate=" + data.todate +  "&page=" + pageno+"&status=-1", { 'headers': headers })
}


public getTypesOfLeaveAndCounts(year: any): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + 'atdserv/employee_leave_count?is_admin=1&emp_id=32&year=' + year, { 'headers': headers })
   
}


public getPerMonthActivityOfEmp(month, year, id): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + "atdserv/attendance?action=employee_report&query=&month="+month+"&year="+year+"&emp_id="+id, { 'headers': headers })
}

public shiftTime() {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + "hrmsserv/employee_workshift", { 'headers': headers })
}

public employeesearch(data: any, page): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + 'usrserv/employeegroup_search?name=' + data + '&page=' + page, { 'headers': headers })
}


public FullattendanceReport(data, obj, page): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  // if(name == null || name == undefined){ name = ''};
  // if(month == null || month == undefined){ month = ''};
  // if(year == null || year == undefined){ year = ''}
 
  // console.log("final data in search", obj)
  // return this.http.post<any>(attendance_Url + 'atdserv/attendance?action=report&query=&month='+data.month+'&year='+data.year+'&page='+page,dataemp, { 'headers': headers })
  return this.http.post<any>(attendance_Url + 'atdserv/attendance?action=new_attendance_report&query=&month='+data.month+'&year='+data.year+'&page='+page,data, { 'headers': headers })

}

 // team lead
 public getTeamLeadFilter(appkeyvalue, pageno): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + 'taskserv/search_team_lead?query=' + appkeyvalue + '&page=' + pageno, { 'headers': headers })
}



public getOrg(appkeyvalue, pageno): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + 'taskserv/search_team_lead?query=' + appkeyvalue + '&page=' + pageno, { 'headers': headers })
}


public getDepartment(appkeyvalue, pageno): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + 'usrserv/searchdepartment?query=' + appkeyvalue + '&page=' + pageno, { 'headers': headers })
}

public getLeadBasedemployee(lead, data, page): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + "usrserv/employee_entry?query="+data+"&head="+lead+"&status=3&page="+page, { 'headers': headers })
}


public getEmpBasedOrgDetails(data, pageno) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(attendance_Url + "usrserv/search_employeebranch?query=" + data + "&page=" + pageno, { 'headers': headers })
  }

  public getBS(data, pageno) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(attendance_Url + "usrserv/searchbusinesssegment?query=" + data + "&page=" + pageno, { 'headers': headers })
  }
  public getCC(data, pageno) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(attendance_Url + "usrserv/searchcostcentre?query=" + data + "&page=" + pageno, { 'headers': headers })
  }

  public Employee_Search_Summary(search, page): Observable<any> {
    this.reset()
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(attendance_Url + 'usrserv/employee?query=' + search.emp+'&lead_id='+search.lead_id+'&premise_id='+search.org_id+'&dept_id='+search.department+'&cc_id='+search.cc+'&bs_id='+search.bs +'&noticeperiod='+search.noticeperiod + '&page=' + page +'&status=' + search?.status , { 'headers': headers })
  }

 // Function to get leave history
 public getLeaveHistory(month:number, year:number): Observable<any> {
  const leaveHistoryUrl = `${attendance_Url}atdserv/employee_history?month=${month}&year=${year}`;
  const getToken = localStorage.getItem("sessionData");
  const tokenValue = JSON.parse(getToken);
  const token = tokenValue.token;
  console.log("token: ",token)
  const headers = new HttpHeaders({
    'Authorization': 'Token ' + token
  });
  return this.http.get<any>(leaveHistoryUrl, { headers });
}
public getTeamLead(appkeyvalue, pageno): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + 'usrserv/searchemployee?query='+ appkeyvalue + '&page=' + pageno, { 'headers': headers })
}
public getrole(): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + 'taskserv/task_dropdown?action=role', { 'headers': headers })
}
public od_Approval_Reject(data, id): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(attendance_Url + 'atdserv/od_request?action=approver',data, { 'headers': headers })
}
public od_Approval_Rejects(data, id): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(attendance_Url + 'atdserv/get_od_request/'+id+'?action=deactive',data, { 'headers': headers })
}
public EmpUpdate(data): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(attendance_Url + 'usrserv/new_employee_creation',data, { 'headers': headers })
}
public getEmpStatus() {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + "usrserv/statuschangedrop_down?type=''", { 'headers': headers })
}
public relievedemployee(pageNum, obj): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + "usrserv/relieved_employees?page="+pageNum+"&query="+obj.emp, { 'headers': headers })
}

public getEmpStatusfull() {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + "usrserv/statuschangedrop_down?type=1", { 'headers': headers })
}

public getDaysPresent(empId,month,year) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(attendance_Url + "atdserv/attendance_count?employee_id="+empId+"&month="+month+"&year="+year, { 'headers': headers })
}



  

}