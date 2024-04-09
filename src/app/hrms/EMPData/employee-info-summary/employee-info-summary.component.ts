import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service'; 
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { MasterHrmsService } from '../../master-hrms.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { NativeDateAdapter } from '@angular/material/core';
import { DatePipe, formatDate } from '@angular/common';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SharedHrmsService } from '../../shared-hrms.service';
import { AttendanceService } from '../../attendance.service';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'
export interface datainterface {
  id: any;
  name: string;
  code: string;
  full_name: string;

}
 
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};


class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-employee-info-summary',
  templateUrl: './employee-info-summary.component.html',
  styleUrls: ['./employee-info-summary.component.scss'],
  providers: [imp.HrmsAPI, imp.Master, imp.Userserv,
  { provide: imp.DateAdapter, useClass: imp.PickDateAdapter },
  { provide: imp.MAT_DATE_FORMATS, useValue: imp.PICK_FORMATS }]
})
export class EmployeeInfoSummaryComponent implements OnInit {
  statusList: any;
  pageNum = 1;
  releivedata: boolean;
  EmployeeListdata: boolean = true;
  isHighlighted: boolean;
  mainobj: { lead_id: any; emp: any; department: any; org_id: any; bs: any; cc: any; noticeperiod: any; status: number; };

  constructor(private fb: FormBuilder, private notify: NotificationService, private datepipe: DatePipe,
    private masterservice: MasterHrmsService, private error: ErrorHandlingServiceService, private SpinnerService: NgxSpinnerService,
    private route: Router, private share: SharedHrmsService, private attendanceService: AttendanceService,
    private hrmsapi: imp.HrmsAPI,
     private apicall: ApicallserviceService, private masterApi: imp.Master, private userservApi: imp.Userserv){} 

  EmployeeSummarySearch: FormGroup

  EmployeeSummaryPart: boolean = true 
  EmployeeViewPart: boolean = false 

  minLength: number = 10;
  maxLength: number = 10;
  today = new Date()
  adminValidation: boolean = false 
  EmpSummaryObjs = {
    teamldList: null,
    deptList : null, 
    org_idList : null,
    employeeList: null,
    ccdatalist: null, 
    bsdatalist: null 
  }

  ngOnInit(): void {
    console.log("employee info summary list")
    this.EmployeeSummarySearch = this.fb.group({
      lead_id: '',
      emp: '',
      department: '',
      org_id: '', 
      bs: '',
      cc: '' ,
      noticeperiod:''
    })

    this.EmployeeSearch('');
    this.adminviewbtn();
    this.getEmpStatus();
  }
  EmployeeList: any
  has_nextEmployee: boolean
  has_previousEmployee: boolean
  presentpageEmployee: any = 1
 

  serviceCallEmployeeSummary(search, pageno, pageSize) {
    this.SpinnerService.show();
    // let datas = this.apis.Employee_Search_Summary(search, pageno)

    // console.log("data summary employee APIS", datas)



    this.attendanceService.Employee_Search_Summary(search, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("Employee summary", result)
        this.EmployeeList = result['data']
        this.EmployeeListdata = true;
        this.releivedata = false;
        let dataPagination = result['pagination'];
        if (this.EmployeeList.length > 0) {
          this.has_nextEmployee = dataPagination.has_next;
          this.has_previousEmployee = dataPagination.has_previous;
          this.presentpageEmployee = dataPagination.index;
        }
      }, (error) => {
        this.error.handleError(error);
        this.SpinnerService.hide();
      })
      this.SpinnerService.hide();
  }

  EmployeeSearch(hint: any) {
    let search = this.EmployeeSummarySearch.value;
    if (search?.noticeperiod == 5)
    {
      this.mainobj = {
        lead_id: search?.lead_id?.id, 
        emp: search?.emp, 
        department: search?.department?.id, 
        org_id : search?.org_id?.id,
        bs: search?.bs?.id, 
        cc: search?.cc?.id ,
        noticeperiod: search?.noticeperiod,
        status : 0 
      }
    }
    else
    {
    this.mainobj = {
      lead_id: search?.lead_id?.id, 
      emp: search?.emp, 
      department: search?.department?.id, 
      org_id : search?.org_id?.id,
      bs: search?.bs?.id, 
      cc: search?.cc?.id ,
      noticeperiod: search?.noticeperiod,
      status: 1 
    }
  }
    console.log("obj data b4 api", this.mainobj)
    for (let i in this.mainobj) {
      if (this.mainobj[i] == undefined || this.mainobj[i] == null) {
        this.mainobj[i] = '';
      }
    }
    // this.SpinnerService.show();

    if (hint == 'next') {
      if(this.EmployeeListdata == true)
      {
      this.serviceCallEmployeeSummary(this.mainobj, this.presentpageEmployee + 1, 10)
      }
      else
      {
        this.showRelievedEmployees(this.presentpageEmployee + 1)
      }
    }
    else if (hint == 'previous') {
      if(this.EmployeeListdata == true)
      {
      this.serviceCallEmployeeSummary(this.mainobj, this.presentpageEmployee - 1, 10)
      }
      else
      {
        this.showRelievedEmployees(this.presentpageEmployee - 1)
      }
    }
    else {
      if(this.EmployeeListdata == true)
      {
      this.serviceCallEmployeeSummary(this.mainobj, 1, 10)
      }
      else
      {
        this.showRelievedEmployees(this.presentpageEmployee)
      }
    }

  }

  resetEmployee() {
    this.EmployeeSummarySearch.reset('')
    this.EmployeeListdata = true;
    this.isHighlighted = false;
    this.EmployeeSearch('')

  }
 

  // getbranchsdata(data) {
  //   let searchBranch: any = data
  //   this.masterservice.getbranchdatafilter(searchBranch, 1).subscribe(data => {
  //     this.branchdatalist = data['data'];
  //   });

  // }
  // getbsdata(data) {
  //   let bssearch: any = data
  //   this.masterservice.getbsdatafilter(bssearch, 1).subscribe(data => {
  //     this.bsdatalist = data['data'];
  //   });
  // }
  // getccdata(bs, cc) {

  //   if (bs == null || bs == '' || bs == undefined) {
  //     this.notify.showWarning("Please fill BS")
  //     return false
  //   }

  //   this.masterservice.getccdatafilter(bs, cc, 1).subscribe(data => {
  //     this.ccdatalist = data['data'];
  //   });

  // }
 
 
  // ///////////////////////////////////////////////////////////////////////Employee Type 
  // getEmployeedepartmentdata(data) {
  //   let dataEmp = data
  //   this.masterservice.getlistdepartment(dataEmp, 1).subscribe(results => {
  //     this.employeetypelist = results['data'];
  //   })
  // }
 

  keypress(event) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
 
  employeeViewPage(view){
    console.log("view data", view)
    let dataID = view.id 
    // this.route.navigate(['hrms/employeeInfo'],{ queryParams: { id: dataID, datafrom: 'adminview' } }) ; 
    this.route.navigate(['hrms/employeeInfoRoutes'],{ queryParams: { id: dataID, datafrom: 'adminview' } }) ; 

  }

  

  employeeHREdit(view){
    console.log("view data", view)
    let dataID = view.id 
    this.route.navigate(['hrms/empEdit'],{ queryParams: { id: dataID, datafrom: 'adminview' } }) ; 
  }

  





//////// Dropdown data

  ///// Lead

  getTeamLead(teamldkeyvalue) {
    this.attendanceService.getTeamLeadFilter(teamldkeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"]; 
        this.EmpSummaryObjs.teamldList = datas;
      })
  }
  
  public displayFnteamld(teamld?: datainterface): string | undefined {
    return teamld ? teamld.name : undefined;
  }

 ///////// Employee 

 getemployee(keyvalue) {
  this.attendanceService.getemployee(keyvalue)
    .subscribe((results: any[]) => {
      let datas = results["data"]; 
      this.EmpSummaryObjs.employeeList = datas;
    })
}

public displayFnemp(emp?: datainterface): string | undefined {
  return emp ? emp.full_name : undefined;
}
 
  // deptList =  null 
  // org_idList  = null 
  getDepartment(teamldkeyvalue) {
    this.attendanceService.getDepartment(teamldkeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.EmpSummaryObjs.deptList = datas;
      })
  
    
  }
  
  public displayFnDept(teamld?: datainterface): string | undefined {
    return teamld ? teamld.name : undefined;
  }
  
  ////Premise 
  
  getorg_id(data) { 
    console.log(data)
    this.attendanceService.getEmpBasedOrgDetails(data,1) 
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.EmpSummaryObjs.org_idList = datas;
      })
     
  }
  
  public displayFnorg_id(teamld?: datainterface): string | undefined {
    return teamld ? teamld.name : undefined;
  }



 ///////// BS CC
 
  getbsdata(data) {
    let bssearch: any = data
    this.attendanceService.getBS(bssearch, 1).subscribe(data => {
      this.EmpSummaryObjs.bsdatalist = data['data'];
    });
  }
  getccdata( cc) {
 
    this.attendanceService.getCC( cc, 1).subscribe(data => {
      this.EmpSummaryObjs.ccdatalist = data['data'];
    });

  }


  displayFnbs_id(data?: datainterface): string | undefined {
    return data ? data.name : undefined;
  }
  displayFncc(data?: datainterface): string | undefined {
    return data ? data.name : undefined;
  } 


  AddEmployee(){
 
    this.route.navigate(['hrms/empCreate'],{ queryParams: { datafrom: 'adminview' } }) ; 
  }



  adminviewbtn(){
    this.apicall.ApiCall("get", this.hrmsapi.HRMS_API.api.AdminViewValidation)
    .subscribe(res=>{
       this.adminValidation = res?.hr_admin
    })
   
  
}
getEmpStatus() {
  this.attendanceService.getEmpStatusfull()
    .subscribe((results: any[]) => {
      let datas = results['data'];
      this.statusList = datas;
    })
}

showRelievedEmployees(pageNumber)
{
  this.SpinnerService.show();
  let search = this.EmployeeSummarySearch.value;
  let obj = {
    lead_id: search?.lead_id?.id, 
    emp: search?.emp, 
    department: search?.department?.id, 
    org_id : search?.org_id?.id,
    bs: search?.bs?.id, 
    cc: search?.cc?.id ,
    noticeperiod: search?.noticeperiod
  }
  console.log("obj data b4 api", obj)
  for (let i in obj) {
    if (obj[i] == undefined || obj[i] == null) {
      obj[i] = '';
    }
  }
  this.attendanceService.relievedemployee(pageNumber, obj)
    .subscribe((results: any[]) => {
      this.SpinnerService.hide();
      let datas = results["data"]; 
      this.EmployeeList = datas;
      this.presentpageEmployee = 1
      this.releivedata = true;
      this.EmployeeListdata = false;
      this.isHighlighted = true;
      let dataPagination = results['pagination'];
      if (this.EmployeeList.length > 0) {
        this.has_nextEmployee = dataPagination.has_next;
        this.has_previousEmployee = dataPagination.has_previous;
        this.presentpageEmployee = dataPagination.index;
      }
    })
    this.SpinnerService.hide();
}






}
