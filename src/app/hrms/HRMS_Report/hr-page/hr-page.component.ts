import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'
import { AttendanceService } from '../../attendance.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import * as _moment from 'moment'; 
import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
const moment = _rollupMoment || _moment; 
type leaveObject = {
  HR_Menu_List: any[],
  leaveBalanceList:any,
  previouspageLeaveBalance: boolean,
  nextpageLeaveBalance: boolean,
  PresentPageLeaveBalance: number,
  teamldList:any,  
  ccdatalist: any, 
  org_idList: any,
  employeeList: any, 
  bsdatalist: any 
};

export interface datainterface {
  id: any;
  name: string;
  code: string;
  full_name: string;

}
@Component({
  selector: 'app-hr-page',
  templateUrl: './hr-page.component.html',
  styleUrls: ['./hr-page.component.scss'],
  providers: [imp.HrmsAPI, imp.Master,
  { provide: imp.DateAdapter, useClass: imp.PickDateAdapter },
  { provide: imp.MAT_DATE_FORMATS, useValue: imp.PICK_FORMATS }]
})
export class HRPageComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private attendanceService: AttendanceService, private shareService: imp.SharedService, private hrmsapi: imp.HrmsAPI,
    private apicall: ApicallserviceService, private masterApi: imp.Master
  ) { }

  searchEmployeeLeaveBalanceForm: FormGroup;
  monyear = new FormControl(moment())

  ngOnInit(): void {

    this.searchEmployeeLeaveBalanceForm = this.fb.group({
      data: moment(),
      lead_id: '',
      arr: '',
      org_id: '',
      bs: '',
      cc: '',
      emp: ''
    })

    this.leaveBalanceSearch('')


  }
 

  hrObjects:leaveObject = {
    HR_Menu_List: null,
    leaveBalanceList: [] as any[], 
    previouspageLeaveBalance: false,
    nextpageLeaveBalance: false,
    PresentPageLeaveBalance: 1, 
    teamldList:null, 
    ccdatalist: null, 
    org_idList: null, 
    employeeList: null, 
    bsdatalist: null 
  }



  getLeaveBalanceData() {
    this.apicall.ApiCall('get', this.hrmsapi.HRMS_API.api.Leavereportbalance)
      .subscribe(res => {
        this.hrObjects.leaveBalanceList = res['data']
      })
  }



  getLeaveBalance(search:any , obj, pageno) {
    // this.attendanceService.getLeaveRequest(search, pageno)
    console.log("pageno ", pageno)
    let listdata = {"arr":[]}
    this.apicall.ApiCall('post', this.hrmsapi.HRMS_API.api.Leavereportbalance+"?page="+pageno+"&month="+search[1]+"&year="+search[0]+"&query="+obj.emp, obj)  
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log('leave request', result)
        let datass = result['data'];
        // this.hrObjects.leaveBalanceList = datass;
        let datapagination = result["pagination"];
        // if (this.hrObjects.leaveBalanceList.length > 0) {
          this.hrObjects.nextpageLeaveBalance = datapagination.has_next;
          this.hrObjects.previouspageLeaveBalance = datapagination.has_previous;
          this.hrObjects.PresentPageLeaveBalance = datapagination.index;
        // }
        console.log("this.hrObjects.leaveBalanceList 1", this.hrObjects.leaveBalanceList)
        if (this.hrObjects?.leaveBalanceList?.length == 0) {
          this.hrObjects.leaveBalanceList = result['data']
        console.log("this.hrObjects.leaveBalanceList 2", this.hrObjects.leaveBalanceList)
        }
        else if(this.hrObjects?.leaveBalanceList?.length > 0){
          
          this.hrObjects.leaveBalanceList = this.hrObjects?.leaveBalanceList.concat(result['data'])
        }
        console.log("this.hrObjects.leaveBalanceList 3", this.hrObjects.leaveBalanceList)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  leaveBalanceSearch(hint: any) {
    let search = this.searchEmployeeLeaveBalanceForm.value;
    // const dateValue = this.searchEmployeeLeaveBalanceForm.value;
    // dateValue.fromdate = this.datePipe.transform(dateValue.fromdate, 'yyyy-MM-dd');
    // const dateValue1 = this.searchEmployeeLeaveBalanceForm.value;
    // dateValue.todate = this.datePipe.transform(dateValue1.todate, 'yyyy-MM-dd');

    // let obj = {
    //   month: search?.month,
    //   year: search?.year,
    // }
    // console.log("obj data b4 api", obj)
    // for (let i in obj) {
    //   if (obj[i] == undefined || obj[i] == null) {
    //     obj[i] = '';
    //   }
    // }
    console.log("emp  dataaaa", search)
    let obj = {
      arr: search?.emp?.id,
      lead_id: search?.lead_id?.id,
      org_id: search?.org_id?.id,
      bs: search?.bs?.id,
      cc: search?.cc?.id,
      emp: search?.emp
    }
    console.log("obj data b4 api", obj)
    for (let i in obj) {
      if (obj[i] === undefined || obj[i] === null) {
        obj[i] = '';
      }
      if (i == 'arr' && obj[i] == "") {
        obj[i] = []
      } else if (i == 'arr' && obj[i] != "") {
        obj[i] = [obj[i]]
      }
       
    }
    console.log("change") 
    console.log("search and split b4", search)
    let monthyeardata:any = this.datePipe.transform(search.data, 'yyyy-MM') 
    let splitdata = monthyeardata.split('-') 
    console.log("search and split aftr", splitdata, monthyeardata) 
    this.SpinnerService.show();

    if (hint == 'next') {
      this.getLeaveBalance(splitdata, obj, this.hrObjects?.PresentPageLeaveBalance + 1)
    }
    else if (hint == 'previous') {
      this.getLeaveBalance(splitdata, obj, this.hrObjects?.PresentPageLeaveBalance - 1)
    }
    else { 
      this.hrObjects.leaveBalanceList = []  
      this.getLeaveBalance(splitdata, obj, 1)
    }

  }

  resetRequestSearch() {
    this.searchEmployeeLeaveBalanceForm.reset('')
    this.leaveBalanceSearch('')
  }











  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.monyear.value;
    ctrlValue.year(normalizedYear.year());
    this.monyear.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monyear.value;
    ctrlValue.month(normalizedMonth.month());
    this.monyear.setValue(ctrlValue);
    datepicker.close();
    this.searchEmployeeLeaveBalanceForm.patchValue({
      data:this.monyear.value
    })
  }


  getTeamLead(teamldkeyvalue) {
    this.attendanceService.getTeamLeadFilter(teamldkeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"]; 
        this.hrObjects.teamldList = datas;
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
      this.hrObjects.employeeList = datas;
    })
}

public displayFnemp(emp?: datainterface): string | undefined {
  return emp ? emp.full_name : undefined;
}
 
  // deptList =  null 
  // org_idList  = null 
  // getDepartment(teamldkeyvalue) {
  //   this.attendanceService.getDepartment(teamldkeyvalue,1)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.hrObjects.deptList = datas;
  //     })
  
    
  // }
  
  // public displayFnDept(teamld?: datainterface): string | undefined {
  //   return teamld ? teamld.name : undefined;
  // }
  
  ////Premise 
  
  getorg_id(data) { 
    console.log(data)
    this.attendanceService.getEmpBasedOrgDetails(data,1) 
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.hrObjects.org_idList = datas;
      })
     
  }
  
  public displayFnorg_id(teamld?: datainterface): string | undefined {
    return teamld ? teamld.name : undefined;
  }



 ///////// BS CC
 
  getbsdata(data) {
    let bssearch: any = data
    this.attendanceService.getBS(bssearch, 1).subscribe(data => {
      this.hrObjects.bsdatalist = data['data'];
    });
  }
  getccdata( cc) {
 
    this.attendanceService.getCC( cc, 1).subscribe(data => {
      this.hrObjects.ccdatalist = data['data'];
    });

  }


  displayFnbs_id(data?: datainterface): string | undefined {
    return data ? data.name : undefined;
  }
  displayFncc(data?: datainterface): string | undefined {
    return data ? data.name : undefined;
  } 


  Report(){
    let search = this.searchEmployeeLeaveBalanceForm.value 
    let monthyeardata:any = this.datePipe.transform(search.data, 'yyyy-MM') 
    let splitdata = monthyeardata.split('-') 
    console.log("search and split aftr", splitdata, monthyeardata) 
    let obj = {
      month: splitdata[1],
      year: splitdata[0]
    }
    this.apicall.ApiCall('getFile', this.hrmsapi.HRMS_API.api.leaveBalanceReport+
    "&month=" + obj.month + "&year=" + obj.year) 
    .subscribe(data => {
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let name = 'Leave Balance Report for the Month ' + obj.month + 'Year ' + obj.year   
      link.download = name + ".xlsx";
      link.click();
      this.SpinnerService.hide();

    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }

  resetLeaveBalance(){
    this.searchEmployeeLeaveBalanceForm.controls['lead_id'].reset()
    this.searchEmployeeLeaveBalanceForm.controls['emp'].reset()
    this.searchEmployeeLeaveBalanceForm.controls['org_id'].reset()
    this.searchEmployeeLeaveBalanceForm.controls['bs'].reset() 
    this.searchEmployeeLeaveBalanceForm.controls['cc'].reset()
    this.leaveBalanceSearch('')
  }

}
