import { Component, OnInit, Directive } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles' 
import { AttendanceService } from '../../attendance.service';  
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';  
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
}

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.scss'],
  providers: [
    // { provide: imp.DateAdapter, useClass: imp.PickDateAdapter },
    // { provide: imp.MAT_DATE_FORMATS, useValue: imp.PICK_FORMATS }, imp.UtilFiles
    imp.UtilFiles
  ]
})
export class AttendanceReportComponent implements OnInit {

  attendanceReportsearchForm: FormGroup
  ListOfDaysInSelectedMonth: any = []
  ListOfDaysInSelectedMonthFull: any = []
  arrReport: any
  employeeList: any
  CurrentMonthReport: any
  CurrentYearReport: any
  presentpageattreport = 1;
  has_nextattreport: boolean;
  has_previousattreport: boolean
  selectedclass:any = 0
  MonthlyActivityReport: any 
  ActivityDataList: any 
logActivityList: any 
BasicDetails: any 
SelectedemployeeID: any 
SelectedEMP: any 


  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
   private attendanceService: AttendanceService, private shareService: imp.SharedService,
    ) { }

  ngOnInit(): void {
    let currentDate = new Date()
    let month: any = currentDate.getMonth() + 1
    let year = currentDate.getFullYear()
    if(month <= 9){
      month = '0'+month
    }
    let monthValue =  year+'-'+month
    this.attendanceReportsearchForm = this.fb.group({
      emp: '',
      monthyear: [moment()]

    })

    // this.serviceCallAttendanceReportSummary({ 
    //   month: month, 
    //   year: year 
    // }, 1, 10)
    this.AttendanceReportSearch('')


  }


  getemployee(data) {
    this.attendanceService.getemployee(data)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
        console.log("employeeList", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  resetAttendanceReport() {
    this.attendanceReportsearchForm.reset('')
    this.attendanceReportsearchForm.patchValue({
      monthyear: moment()
    })
    this.AttendanceReportSearch('')
  }

  public displayFnemp(emp?: Emplistss): string | undefined {
    return emp ? emp.full_name : undefined;
  }

   ////////////////////////////////////////////////////////////// Months and Years
 
 
 
 
  
 
   


  AttendanceReportSearch(hint: any) {
    let search = this.attendanceReportsearchForm.value;

    let monthyeardata:any = this.datePipe.transform(search.monthyear, 'yyyy-MM') 
    
    // let splitdata = search.monthyear.split('-')
    let splitdata = monthyeardata.split('-')
    console.log(splitdata)

    // this.daysInMonth(splitdata[1], splitdata[0])
    let month = splitdata[1]
    let year = splitdata[0]
    let listNoOfDays = new Date(year, month, 0).getDate()
    console.log('listNoOfDays', listNoOfDays)
    let arr = []
    let arrfulldate = []
    for (let i = 1; i <= listNoOfDays; i++) {
      console.log(i)
      let dateArrange 
      let dayArrange
      if(i < 10){
        dateArrange = year + '-' + month + '-0' + i
        dayArrange = " 0"+i
      }
      if(i >= 10){
        dateArrange = year + '-' + month + '-' + i
        dayArrange = " "+i
      }
      let obj = {
        date: dateArrange,
        day: dayArrange
      }
      arrfulldate.push(dateArrange)
      arr.push(obj)
    }
    console.log("date list arr arrfulldate ", arr, arrfulldate )
    this.ListOfDaysInSelectedMonth = arr
    this.ListOfDaysInSelectedMonthFull = arrfulldate

    // let obj = {
    //   emp: search?.emp?.id,
    //   month: splitdata[1], 
    //   year: splitdata[0]
    // }
    let obj = {
      emp: search?.emp?.id,
      month: month, 
      year: year 

    }
    console.log("obj data b4 api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
      if(i == 'emp' && obj[i]==""){
        obj[i]=[]
      }else if(i == 'emp' && obj[i]!="" ){
        obj[i]=[obj[i]]
      }
    }
    this.SpinnerService.show();

    if (hint == 'next') {
      this.serviceCallAttendanceReportSummary(obj, this.presentpageattreport + 1, 10)
    }
    else if (hint == 'previous') {
      this.serviceCallAttendanceReportSummary(obj, this.presentpageattreport - 1, 10)
    }
    else {
      this.serviceCallAttendanceReportSummary(obj, 1, 10)
    }

  }



  Attendanceexceldownload(){ 
    this.SpinnerService.show();
    let search = this.attendanceReportsearchForm.value;
    if(search?.monthyear == ""|| search?.monthyear == null|| search?.monthyear == undefined){
      this.notify.warning("Please select Month and Year")
      return false 
    }
    let monthyeardata:any = this.datePipe.transform(search.monthyear, 'yyyy-MM') 
    // let splitdata = search.monthyear.split('-')
    let splitdata = monthyeardata.split('-')
    console.log(splitdata)
 
    // let splitdata = search.monthyear.split('-')
    console.log(splitdata)
    let month = splitdata[1]
    let year = splitdata[0]
    this.attendanceService.Attendanceexceldownload(month, year)
    .subscribe((data) => {
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Attendance Report'+".xlsx";
      link.click();
      }, error=>{
        this.SpinnerService.hide()
      })

  }



  getAttendanceBasedOnEmployee(data, dates){
    console.log(data, dates)
    let dataGetIDEMP = data?.id 
    
    let search = this.attendanceReportsearchForm.value;
   
      let monthyeardata:any = this.datePipe.transform(search.monthyear, 'yyyy-MM') 
    // let splitdata = search.monthyear.split('-')
    let splitdata = monthyeardata.split('-') 
      console.log(splitdata)
  
      // this.daysInMonth(splitdata[1], splitdata[0])
      let month = splitdata[1]
      let year = splitdata[0]
    this.attendanceService.getPerMonthActivityOfEmp(month, year, dataGetIDEMP)
    .subscribe(results =>{
      console.log(results)
      let data = results["data"]
      this.MonthlyActivityReport = data 
  
    })
  }
  
  
  getSelectedEMP(index, type){
    console.log("datascheck datascheck datascheckdatascheck", index)
  
    if(type == 'summary'){
      let seperatingDayFromDate = new Date(index) 
      let dayseperate = seperatingDayFromDate.getDate()
      let numSeperate = Number(dayseperate)
      this.selectedclass =  numSeperate - 1
      console.log(dayseperate)
    }
    else if(type == 'popup'){
      this.selectedclass = index
    }
  
  }


  activityData(data, type, fulldata?:any ){
    console.log("Activity b4", data, fulldata, this.SelectedemployeeID)
    let id; 
    if(type == 'summary'){
     id =  fulldata?.id 
     this.SelectedemployeeID = fulldata?.id 
     this.BasicDetails = fulldata  
    }
    if(type == 'popup'){
      id = this.SelectedemployeeID
    } 
    console.log("Activity", data, fulldata, this.SelectedemployeeID)
    this.ActivityDataList = data   
    // if(data.includes(null, undefined, '') || id.includes(null, undefined, '') ){
    //   return false 
    // }
  
    this.attendanceService.getActivitySinglelog(data, id)
    .subscribe(results=>{
      let data = results 
      this.logActivityList = data
      console.log("logActivityList", this.logActivityList)
    })
  
  }
  

  serviceCallAttendanceReportSummary(search, pageno, pageSize) {
    this.attendanceService.attendanceReport(search, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("AttendanceReport summary", result, result['pagination'])
        this.arrReport = result
        let dataPagination = result['pagination'];
        if (this.arrReport["data"].length > 0) {
          this.has_nextattreport = dataPagination.has_next;
          this.has_previousattreport = dataPagination.has_previous;
          this.presentpageattreport = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
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
    this.attendanceReportsearchForm.patchValue({
      monthyear:this.monyear.value
    })
  }

  ChangeDateFormat(key){
    // this.attendanceReportsearchForm.patchValue({
    //   [key]: this.datePipe.transform(key, 'yyyy-MM') 
    // }) 

  }




}

export const DATE_FORMAT_2 = {
  parse: {
    dateInput:  'MM/YYYY',
  },
  display: {
    dateInput:  'MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Directive({
  selector: '[dateFormat2]',
  providers: [ 
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_2 },
  ],
})
export class CustomDateFormat2 {}