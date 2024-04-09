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
import { query } from '@angular/animations';

const moment = _rollupMoment || _moment;

export interface Emplistss {
  id: string;
  full_name: string;
  name: string; 
  code : string; 
}


@Component({
  selector: 'app-attendance-full-report',
  templateUrl: './attendance-full-report.component.html',
  styleUrls: ['./attendance-full-report.component.scss'],
  providers: [
    imp.UtilFiles
  ]
})
export class AttendanceFullReportComponent implements OnInit {
  attendanceReportsearchForm: FormGroup
  ListOfDaysInSelectedMonth: any = []
  ListOfDaysInSelectedMonthFull: any = []
  arrReport: any = [] 
  employeeList: any
  CurrentMonthReport: any
  CurrentYearReport: any
  presentpageattreport = 1;
  has_nextattreport: boolean;
  has_previousattreport: boolean
  selectedclass: any = 0
  MonthlyActivityReport: any
  ActivityDataList: any
  logActivityList: any
  BasicDetails: any
  SelectedemployeeID: any
  SelectedEMP: any
  RemoveFromreport = ['code', 'duration', 'id', 'name', 'present_count', 'shift']
  PresentDate = null  
  teamldList = null
  bsdatalist = null  
  ccdatalist = null 

  PageNumber=new FormControl('')
  log_date= new FormControl('')
  filter_key= new FormControl('')
  isPresentid: any;
  isPresentBool: boolean=false;
  PresentDataCount: any;
  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private attendanceService: AttendanceService, private shareService: imp.SharedService,
  ) { }

  ngOnInit(): void {
    let currentDate = new Date()
    this.PresentDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd')
    console.log("present date for validation", this.PresentDate)
    let month: any = currentDate.getMonth() + 1
    let year = currentDate.getFullYear()
    if (month <= 9) {
      month = '0' + month
    }
    let monthValue = year + '-' + month
    this.attendanceReportsearchForm = this.fb.group({
      emp: '',
      monthyear: [moment()],
      lead_id: '',
      department: '',
      org_id: '',
      bs: '',
      cc: '' 
    })

    this.AttendanceReportSearch('',this.log_date.value, this.filter_key.value)


  }


  getLeadBasedemployee(lead, data) {
    console.log("lead data ", lead)
    if(lead == undefined || lead == null || lead == ''){
      lead = ''
    }else{lead = lead}
    if(data == undefined || data == null || data == ''){
      data = ''
    }else{data = data}
    this.attendanceService.getLeadBasedemployee(lead, data, 1)
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
    this.filter_key.reset()
    this.PageNumber.reset()
    this.AttendanceReportSearch('',this.log_date.value, this.filter_key.value)
  }

  public displayFnemp(emp?: Emplistss): string | undefined {
    return emp ? emp.full_name : undefined; 
  }

  ////////////////////////////////////////////////////////////// Months and Years









  AttendanceReportSearch(hint: any, dateFilter?:any, type?:any ) {
    let search = this.attendanceReportsearchForm.value;

    let monthyeardata: any = this.datePipe.transform(search.monthyear, 'yyyy-MM')

    // let splitdata = search.monthyear.split('-')
    let splitdata = monthyeardata.split('-')
    console.log(splitdata)

    // this.daysInMonth(splitdata[1], splitdata[0])
    let month = splitdata[1]
    let year = splitdata[0]
    // let listNoOfDays = new Date(year, month, 0).getDate()
    // console.log('listNoOfDays', listNoOfDays)
    // let arr = []
    // let arrfulldate = []
    // for (let i = 1; i <= listNoOfDays; i++) {
    //   console.log(i)
    //   let dateArrange
    //   let dayArrange
    //   if (i < 10) {
    //     dateArrange = year + '-' + month + '-0' + i
    //     dayArrange = " 0" + i
    //   }
    //   if (i >= 10) {
    //     dateArrange = year + '-' + month + '-' + i
    //     dayArrange = " " + i
    //   }
    //   let obj = {
    //     date: dateArrange,
    //     day: dayArrange
    //   }
    //   arrfulldate.push(dateArrange)
    //   arr.push(obj)
    // }
 

    // console.log("finaldateprevious ", arr, arrfulldate)

    // console.log("date list arr arrfulldate ", arr, arrfulldate)
    // this.ListOfDaysInSelectedMonth = arr
    // this.ListOfDaysInSelectedMonthFull = arrfulldate
    // {"arr":[],"log_date":"2023-04-06","filter_key":1,"lead_id":1,"org_id":1,"department":1}
    let pageLength=this.PageNumber.value
    if(!pageLength){
      pageLength=''
    }
    console.log("particular date filter", dateFilter, type   )
    let obj = {
      arr: search?.emp?.id, 
      month: month,
      year: year,
      log_date: dateFilter,
      filter_key: type?.id,
      lead_id: search?.lead_id?.id,
      premise_id: search?.org_id?.id,
      department: search?.department?.id,
      bs_id : search?.bs?.id,
      cc_id : search?.cc?.id,
      end_limit:pageLength

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
      this.serviceCallAttendanceReportSummary(obj, this.presentpageattreport + 1, 10)
    }
    else if (hint == 'previous') {
      this.serviceCallAttendanceReportSummary(obj, this.presentpageattreport - 1, 10)
    }
    else {
      this.arrReport = []
      this.serviceCallAttendanceReportSummary(obj, 1, 10)
    }

  }



  AttendanceexceldownloadNew(hint: any, dateFilter?:any, type?:any) {
    this.SpinnerService.show();
    let search = this.attendanceReportsearchForm.value;
    if (search?.monthyear == "" || search?.monthyear == null || search?.monthyear == undefined) {
      this.notify.warning("Please select Month and Year")
      return false
    }
    let monthyeardata: any = this.datePipe.transform(search.monthyear, 'yyyy-MM')
    // let splitdata = search.monthyear.split('-')
    let splitdata = monthyeardata.split('-')
    console.log(splitdata)

    // let splitdata = search.monthyear.split('-')
    //11, 2023, 'monesh jai'
    console.log(splitdata)
    let month = splitdata[1]
    let year = splitdata[0]

    let obj = {
      arr: search?.emp?.id, 
      month: month,
      year: year,
      log_date: dateFilter,
      filter_key: type?.id,
      lead_id: search?.lead_id?.id,
      premise_id: search?.org_id?.id,
      department: search?.department?.id,
      bs_id : search?.bs?.id,
      cc_id : search?.cc?.id

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

    let jsonData= JSON.stringify(obj)

    console.log("json data",jsonData)
    console.log("month",month)
    console.log("year",year)


    this.attendanceService.AttendanceexceldownloadNew(month,year,jsonData)
      .subscribe((datas) => {
        console.log('Response received:', datas);
        let data = datas
        this.SpinnerService.hide()
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'Attendance Report' + ".xlsx";
        link.click();
      }, error => {
        this.SpinnerService.hide()
      })

  }



  getAttendanceBasedOnEmployee(data, dates) {
    console.log(data, dates)
    let dataGetIDEMP = data?.id

    let search = this.attendanceReportsearchForm.value;

    let monthyeardata: any = this.datePipe.transform(search.monthyear, 'yyyy-MM')
    // let splitdata = search.monthyear.split('-')
    let splitdata = monthyeardata.split('-')
    console.log(splitdata)

    // this.daysInMonth(splitdata[1], splitdata[0])
    let month = splitdata[1]
    let year = splitdata[0]
    this.attendanceService.getPerMonthActivityOfEmp(month, year, dataGetIDEMP)
      .subscribe(results => {
        console.log("this.MonthlyActivityReport data", results)
        let data = results["data"]
        this.MonthlyActivityReport = data

      })
  }


  getSelectedEMP(index, type) {
    console.log("datascheck datascheck datascheckdatascheck", index)

    if (type == 'summary') {
      // let seperatingDayFromDate = new Date(index)
      // let dayseperate = seperatingDayFromDate.getDate()
      // let numSeperate = Number(dayseperate)
      // this.selectedclass = numSeperate - 1
      // console.log("day for summary", dayseperate, numSeperate, this.selectedclass)
      let indexFind = this.ListOfDaysInSelectedMonth.indexOf(index) 
      console.log("findin index of Date", indexFind)
      this.selectedclass = indexFind
    }
    else if (type == 'popup') {
      this.selectedclass = index
    }

  }

  DatesBadge = null;  
  activityData(data, type, fulldata?: any) {
    console.log("Activity b4", data, fulldata, this.SelectedemployeeID)
    let id;
    if (type == 'summary') {
      id = fulldata?.id
      this.SelectedemployeeID = fulldata?.id
      this.BasicDetails = fulldata
    }
    if (type == 'popup') {
      id = this.SelectedemployeeID
    }
    console.log("Activity", data, fulldata, this.SelectedemployeeID, this.BasicDetails)
    console.log("Activity particular date", this.BasicDetails[data])
    this.ActivityDataList = data
    this.DatesBadge = this.BasicDetails[data] 
    // if(data.includes(null, undefined, '') || id.includes(null, undefined, '') ){
    //   return false 
    // }

    this.attendanceService.getActivitySinglelog(data, id)
      .subscribe(results => {
        let data = results
        this.logActivityList = data
        console.log("logActivityList", this.logActivityList)
      })

  }
  PresentCount(data){
    if(this.isPresentid!=data?.id){
   
      let search = this.attendanceReportsearchForm.value;
      let monthyeardata: any = this.datePipe.transform(search.monthyear, 'yyyy-MM')
      let splitdata=monthyeardata.split('-')
      let month=splitdata[1]
      let year=splitdata[0]
      this.attendanceService.getDaysPresent(data?.id,month,year).subscribe(result=>{
        this.PresentDataCount=result
        this.isPresentid=data?.id
        console.log(this.isPresentid)
        console.log(this.PresentDataCount)
      },
      error=>{
        console.log('error',error)
      })


    }
    else{
      this.isPresentid=0
    }
 
    this.isPresentBool=!this.isPresentBool
  }


  serviceCallAttendanceReportSummary(search, pageno, pageSize) {
    
    let obj = {
      "arr": search.emp,
      "log_date":search?.log_date,
      "filter_key":search?.filter_key,
      "lead_id":search?.lead_id,
      "org_id":search?.org_id,
      "department":search?.department,
      "bs_id": search?.bs_id, 
      "cc_id": search?.cc_id ,
     
      
    }
  
    for (let i in obj) {
      // console.log(i,"obj i",  obj[i])
      if (obj[i] == undefined || obj[i] == '' || obj[i] == null) {
        delete obj[i]  ;
      } 
    }

   

    this.attendanceService.FullattendanceReport(search, obj, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("AttendanceReport summary", result, result['pagination'])
         
        /////// To extract header
        this.ListOfDaysInSelectedMonth = []
        let AttendaanceHeaderDate
        let AttendaanceData = result["data"]
        let dataPagination = result['pagination'];
        if(result["data"]?.length == 0){
          this.has_nextattreport = dataPagination?.has_next;
          return false 
        }
        for(let i=0; i<1; i++ ){
          console.log("data form loop index")
          AttendaanceHeaderDate = Object.keys(AttendaanceData[i]) 
        } 
        let dataToRemove = this.RemoveFromreport
        let ActualDates = AttendaanceHeaderDate.filter( item => !dataToRemove.includes(item))
        this.ListOfDaysInSelectedMonth = ActualDates  
        console.log("this.ListOfDaysInSelectedMonth", this.ListOfDaysInSelectedMonth)
      ////////////////////////////
        
        let FullData = result['data']
        console.log("Full data values",FullData)
        this.has_nextattreport = dataPagination?.has_next;
        this.has_previousattreport = dataPagination?.has_previous;
        this.presentpageattreport = dataPagination?.index;
        if (this.arrReport?.length == 0) {
          this.arrReport = FullData
        }
        else if(this.arrReport?.length > 0){
          
          this.arrReport = this.arrReport.concat(result['data'])
        }

        console.log("arr report data for ngfor", this.arrReport)
         
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
      monthyear: this.monyear.value
    })
  }
 
  
 

 
 Present_Data = { name: 'Present', display: 'P', title: 'Present'  }
 Absent_Data = { name: 'Absent', display: 'A', title: 'Absent'     }
 Leave_Data = { name: 'Leave', display: 'L', title: 'Leave'    }
 Halfday_Data = { name: 'Half day', display: 'HD', title: 'Half Day'    }
 Holiday_Data = { name: 'Holiday', display: 'H', title: 'Holiday'    }
 Weekend_Data = { name: 'Weekend', display: 'W', title: 'Weekend'    }
 WFH_Data = { name: 'WFH', display: 'WFH',  title: 'Work From Home'    }
 CL_Data = { name: 'CL', display: 'CL', title: 'Casual Leave'    }
 PL_Data = { name: 'PL', display: 'PL', title: 'Planned Leave'    }
 SL_Data = { name: 'ML', display: 'SL', title: 'Sick / Medical Leave'   }
 OD_Data = { name: 'OD', display: 'On Duty', title: 'On Duty'    }
 ApprovedLeave_Data = { name: 'Leave Approved', display: 'LA' , title: 'Leave Approved'   }
 PendingLeave_Data = { name: 'Leave Pending', display: 'LP' , title: 'Leave Pending'   }
 Permission_Data = { name: 'PRM', display: 'PRM' , title: 'Permission'   }
 In_Data = { name: 'IN', display: 'In' , title: 'In / Checked In' }
 Out_Data = { name: 'OUT', display: 'Out' , title: 'Out / Checked out' }
 NotIn_Data = { name: 'NOT IN', display: 'NP' , title: 'Not In / Yet To Check' }
 Updated_Attendance_Data = { name: ' ', display: '!' , title: 'edited' }
 PartiallyPresent_Data = { name: 'Partially Present', display: 'PP' , title: 'Partially present' } 

 getToolTip(dataSummary, data, datascheck){ 
  console.log("Loop data attendance", dataSummary, data, dataSummary[datascheck] )
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

 getTeamLead(teamldkeyvalue) {
  this.attendanceService.getTeamLeadFilter(teamldkeyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.teamldList = datas;
    })
}

public displayFnteamld(teamld?: Emplistss): string | undefined {
  return teamld ? teamld.name : undefined;
}

deptList =  null 
org_idList  = null 
getDepartment(teamldkeyvalue) {
  this.attendanceService.getDepartment(teamldkeyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.deptList = datas;
    })

  
}

public displayFnDept(teamld?: Emplistss): string | undefined {
  return teamld ? teamld.name : undefined;
}



getorg_id(data) { 
  console.log(data)
  this.attendanceService.getEmpBasedOrgDetails(data,1) 
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.org_idList = datas;
    })
   
}

public displayFnorg_id(teamld?: Emplistss): string | undefined {
  return teamld ? teamld.name : undefined;
}


 ///////// BS CC
 
  getbsdata(data) {
    let bssearch: any = data
    this.attendanceService.getBS(bssearch, 1).subscribe(data => {
      this.bsdatalist = data['data'];
    });
  }
  getccdata( cc) {
 
    this.attendanceService.getCC( cc, 1).subscribe(data => {
      this.ccdatalist = data['data'];
    });

  }


  displayFnbs_id(data?: Emplistss): string | undefined {
    return data ? data.name : undefined;
  }
  displayFncc(data?: Emplistss): string | undefined {
    return data ? data.name : undefined;
  } 




Filterlist: any 

getFilterBasedOnDate(date){
  console.log(date)
  if(this.PresentDate == date){
    this.Filterlist = [{id: "1", text: 'In'}, {id: "2", text: 'Out'}, {id: "0", text: 'Not In'}]
  }
  else{
    this.Filterlist = [{id: "1", text: 'Present'}, {id: "3", text: 'Absent'}, 
    {id: "0", text: 'Leave'}, {id: "2", text: 'Half Day'}]
  }


}
 
checkdata(data, datascheck, datadatscheck){ 
  console.log("data to check for ", data, datascheck, data[datascheck], datadatscheck)

}

}

export const DATE_FORMAT_2 = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MMM YYYY',
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
export class FullCustomDateFormat2 { }