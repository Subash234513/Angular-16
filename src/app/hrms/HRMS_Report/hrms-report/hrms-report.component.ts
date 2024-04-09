import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'
import { AttendanceService } from '../../attendance.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

export interface Emplistss {
  id: string;
  full_name: string;
  name: string;
}

@Component({
  selector: 'app-hrms-report',
  templateUrl: './hrms-report.component.html',
  styleUrls: ['./hrms-report.component.scss'],
  providers: [imp.HrmsAPI, imp.Master,
  { provide: imp.DateAdapter, useClass: imp.PickDateAdapter },
  { provide: imp.MAT_DATE_FORMATS, useValue: imp.PICK_FORMATS }]
})
export class HrmsReportComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private attendanceService: AttendanceService, private shareService: imp.SharedService, private hrmsapi: imp.HrmsAPI,
    private apicall: ApicallserviceService, private masterApi: imp.Master
  ) { }

  searchStatusEMP: FormGroup;
  EmployeeReportsearchForm: FormGroup;
  individualDate = new FormControl("") 
  HRMSReportsObject = {
    HeaderDataList: null,
    summaryKeys: null,
    counts: null,
    employeesummaryReport: null,
    todayDataView: false,
    OtherDataView: false,
    // type: null,
    teamldList: null,
    employeeList: null,
    deptList: null,
    org_idList: null,
    ListOfDaysInSelectedMonth: null,
    PresentDate: null,
    arrReport: null,
    has_nextEmpreport: false,
    showHide: false,
    type: null,
    RemoveFromreport : ['code', 'duration', 'id', 'name', 'present_count'],
    has_previousEmpreport: false,
    presentpageEmpreport: 1,
    bsdatalist: null,
    ccdatalist: null, 
    
    ReportStatusList: [{"id":1,"name":"Late check in"}, {"id":2,"name":"Early check out"}, 
    {"id":3,"name":"Permission"}, {"id":4,"name":"WFH"}, {"id":5,"name":"Leave"}]
  }

  ngOnInit(): void {

    let currentDate = new Date()
    this.HRMSReportsObject.PresentDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd')
    console.log("present date for validation", this.HRMSReportsObject.PresentDate)
    this.searchStatusEMP = this.fb.group({
      type: '1',
      subtype: '7',
      fromdate: '',
      todate: ''
    })

    this.EmployeeReportsearchForm = this.fb.group({
      emp: '',
      monthyear: [moment()],
      lead_id: '',
      department: '',
      org_id: '',
      bs: '',
      cc: '',
      filter_key: null
    })

    // this.getSummaryListData()
    this.getHeaderData()
    this.getTypeofview()
    this.EmployeeReportSearch('')
  }


  getHeaderData() {
    this.apicall.ApiCall('get', this.hrmsapi.HRMS_API.api.AttendanceReport)
      .subscribe(res => {
        console.log("header Report", res)
        this.HRMSReportsObject.counts = res
      })
  }

  getSummaryListData() {

    let searchTypeId = this.searchStatusEMP.value.type?.id
    console.log("search type id data ", searchTypeId)

    let search = this.searchStatusEMP.value
    console.log("search type id data ", search)

    let obj = {
      type: search?.type?.id,
      subtype: search?.subtype?.id,
      fromdate: search?.type?.id == 1 ? this.datePipe.transform(new Date(), 'yyyy-MM-dd') : search?.fromdate,
      todate: search?.type?.id == 1 ? this.datePipe.transform(new Date(), 'yyyy-MM-dd') : search?.todate,
    }
    console.log("obj data b4 api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }

    if (search?.subtype?.Template == 1) {
      this.HRMSReportsObject.todayDataView = true;
      this.HRMSReportsObject.OtherDataView = false;
    }
    if (search?.subtype?.Template == 2) {
      this.HRMSReportsObject.todayDataView = false;
      this.HRMSReportsObject.OtherDataView = true;
    }

    this.apicall.ApiCall('get', this.hrmsapi.HRMS_API.api.employeeattendanceReport + '?type=' + obj.subtype + '&from_date=' + obj.fromdate + '&to_date=' + obj.todate)
      .subscribe(res => {
        console.log(res)
        let datas = Object.keys(res)
        console.log("keys for summary", datas)
        this.HRMSReportsObject.summaryKeys = datas
        this.HRMSReportsObject.employeesummaryReport = res
      })

  }


  ChangeDateFormat(key) {
    console.log("this.searchStatusEMP.controls[key]", this.searchStatusEMP.controls[key])
    this.searchStatusEMP.patchValue({
      [key]: this.datePipe.transform(this.searchStatusEMP.controls[key].value, 'yyyy-MM-dd')
    })

    if (key == 'fromdate' && (this.searchStatusEMP.value.todate == '' || this.searchStatusEMP.value.todate == null || (this.searchStatusEMP.value.todate < this.searchStatusEMP.value.fromdate))) {
      this.searchStatusEMP.patchValue({
        todate: this.datePipe.transform(this.searchStatusEMP.controls[key].value, 'yyyy-MM-dd')
      })
    }

  }


  getTypeofview() {
    let date = this.datePipe.transform(new Date(), 'yyyy-MM-dd')

    this.apicall.ApiCall('get', this.hrmsapi.HRMS_API.api.attendanceFilterType)
      .subscribe(res => {
        console.log(res)
        this.HRMSReportsObject.type = res
      })
  }



  resetfromAndTodate() {
    this.searchStatusEMP.get('fromdate').reset()
    this.searchStatusEMP.get('todate').reset()
  }


  //////////// Employee Report Table View 

  //DD 
  getTeamLead(teamldkeyvalue) {
    this.attendanceService.getTeamLeadFilter(teamldkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.HRMSReportsObject.teamldList = datas;
      })
  }

  public displayFnteamld(teamld?: Emplistss): string | undefined {
    return teamld ? teamld.name : undefined;
  }


  getLeadBasedemployee(lead, data) {
    console.log("lead data ", lead)
    if (lead == undefined || lead == null || lead == '') {
      lead = ''
    } else { lead = lead }
    if (data == undefined || data == null || data == '') {
      data = ''
    } else { data = data }
    this.attendanceService.getLeadBasedemployee(lead, data, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.HRMSReportsObject.employeeList = datas;
        console.log("employeeList", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  public displayFnemp(emp?: Emplistss): string | undefined {
    return emp ? emp.full_name : undefined;
  }




  getDepartment(teamldkeyvalue) {
    this.attendanceService.getDepartment(teamldkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.HRMSReportsObject.deptList = datas;
      })


  }

  public displayFnDept(teamld?: Emplistss): string | undefined {
    return teamld ? teamld.name : undefined;
  }



  getorg_id(data) {
    console.log(data)
    this.attendanceService.getEmpBasedOrgDetails(data, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.HRMSReportsObject.org_idList = datas;
      })

  }

  public displayFnorg_id(teamld?: Emplistss): string | undefined {
    return teamld ? teamld.name : undefined;
  }



  monyear = new FormControl(moment())
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
    this.EmployeeReportsearchForm.patchValue({
      monthyear: this.monyear.value
    })
  }


  showHide: boolean = false
  Toggle(){
   console.log("show hide", this.showHide)
      if(this.showHide == true){
       this.showHide = false 
      }
      else{
       this.showHide = true 
      }
  }


  resetAttendanceReport() {
    this.EmployeeReportsearchForm.reset('')
    this.EmployeeReportsearchForm.patchValue({
      monthyear: moment()
    })
    this.individualDate.reset() 
    this.EmployeeReportSearch('') 
  }






////////////////////////////////////////////////////////////////////


EmployeeReportSearch(hint, filter?:any, day?:any ){
  let search = this.EmployeeReportsearchForm.value; 
  console.log("hint, filter, day, search?.filter_key", hint, filter, day, search?.filter_key) 

  let monthyeardata: any = this.datePipe.transform(search.monthyear, 'yyyy-MM')

  // let splitdata = search.monthyear.split('-')
  let splitdata = monthyeardata.split('-')
  console.log(splitdata)

  // this.daysInMonth(splitdata[1], splitdata[0])
  let month = splitdata[1]
  let year = splitdata[0]
  let obj = {
    arr: search?.emp?.id, 
    month: month,
    year: year, 
    lead_id: search?.lead_id?.id,
    org_id: search?.org_id?.id,
    department: search?.department?.id,
    filter_key: search?.filter_key == null ? filter : search?.filter_key,
    log_date: day
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
  this.SpinnerService.show();

  if (hint == 'next') {
    this.serviceCallEmpReportSummary(obj, this.HRMSReportsObject.presentpageEmpreport + 1, 10)
  }
  else if (hint == 'previous') {
    this.serviceCallEmpReportSummary(obj, this.HRMSReportsObject.presentpageEmpreport - 1, 10)
  }
  else {
    this.HRMSReportsObject.arrReport = []
    this.serviceCallEmpReportSummary(obj, 1, 10)
  }

}



serviceCallEmpReportSummary(search, pageno, pageSize) {
  // this.attendanceService.FullattendanceReport(search, pageno)
  let arrdata = {"arr":[] }
  let arr = Object.assign(arrdata, search) 
  this.apicall.ApiCall('post', this.hrmsapi.HRMS_API.api.EmpReportFilterSummary+"&month="+search?.month+"&year="+search?.year+"&page="+pageno, arr) 
    .subscribe(result => {
      this.SpinnerService.hide();
      console.log("AttendanceReport summary", result, result['pagination'])
       
      /////// To extract header
      this.HRMSReportsObject.ListOfDaysInSelectedMonth = []
      let EmpReportHeaderDate
      let EmpReportData = result["data"]
      let dataPagination = result['pagination'];
      if(result["data"]?.length == 0){
        this.HRMSReportsObject.has_nextEmpreport = dataPagination?.has_next;
        return false 
      }
      for(let i=0; i<1; i++ ){
        console.log("data form loop index")
        EmpReportHeaderDate = Object.keys(EmpReportData[i]) 
      } 
      let dataToRemove = this.HRMSReportsObject.RemoveFromreport
      let ActualDates = EmpReportHeaderDate.filter( item => !dataToRemove.includes(item))
      this.HRMSReportsObject.ListOfDaysInSelectedMonth = ActualDates  
      console.log("this.ListOfDaysInSelectedMonth", this.HRMSReportsObject.ListOfDaysInSelectedMonth)
    ////////////////////////////
      
      let FullData = result['data']
      
      this.HRMSReportsObject.has_nextEmpreport = dataPagination?.has_next;
      this.HRMSReportsObject.has_previousEmpreport = dataPagination?.has_previous;
      this.HRMSReportsObject.presentpageEmpreport = dataPagination?.index;
      if (this.HRMSReportsObject.arrReport?.length == 0) {
        this.HRMSReportsObject.arrReport = FullData
      }
      else if(this.HRMSReportsObject.arrReport?.length > 0){
        
        this.HRMSReportsObject.arrReport = this.HRMSReportsObject.arrReport.concat(result['data'])
      }

      console.log("arr report data for ngfor", this.HRMSReportsObject.arrReport)
       
    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
}

resetStatusFilter(type){
  if(type == 'summary'){
    this.individualDate.reset()
  }
  if(type == 'inline'){
    this.EmployeeReportsearchForm.controls['filter_key'].reset('')
  }
}
 
getbsdata(data) {
    let bssearch: any = data
    this.attendanceService.getBS(bssearch, 1).subscribe(data => {
      this.HRMSReportsObject.bsdatalist = data['data'];
    });
  }
  getccdata( cc) {
 
    this.attendanceService.getCC( cc, 1).subscribe(data => {
      this.HRMSReportsObject.ccdatalist = data['data'];
    });

  }


  displayFnbs_id(data?: Emplistss): string | undefined {
    return data ? data.name : undefined;
  }
  displayFncc(data?: Emplistss): string | undefined {
    return data ? data.name : undefined;
  } 






}
