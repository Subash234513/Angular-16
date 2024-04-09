import { Component, OnInit, Directive } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'  
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
}

@Component({
  selector: 'app-track-leave-request',
  templateUrl: './track-leave-request.component.html',
  styleUrls: ['./track-leave-request.component.scss'],
  providers: [
    { provide: imp.DateAdapter, useClass: imp.PickDateAdapter },
    { provide: imp.MAT_DATE_FORMATS, useValue: imp.PICK_FORMATS }, imp.HrmsAPI, imp.Userserv
  ]
})
export class TrackLeaveRequestComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService, 
    private shareService: imp.SharedService, private apicall: ApicallserviceService, 
    private userservApi: imp.Userserv,  
    private hrmsapi: imp.HrmsAPI
    ) { }

    TrackLeaveObj = {
      employeeList: [],
      ListOfDaysInSelectedMonth: [],
      ListOfDaysInSelectedMonthFull: [],
      presentpageTrackreport: 1,
      has_nextTrackreport: false,
      has_previousTrackreport: false,  
      TrackerReport: []

    };
    LeaveTrackerReportsearchForm: FormGroup;

  ngOnInit(): void {

    let currentDate = new Date()
    let month: any = currentDate.getMonth() + 1
    let year = currentDate.getFullYear()
    if(month <= 9){
      month = '0'+month
    }
    let monthValue =  year+'-'+month
    this.LeaveTrackerReportsearchForm = this.fb.group({
      emp: '',
      monthyear: monthValue

    })

  }

 
  resetLeaveTrackerReport() {
    this.LeaveTrackerReportsearchForm.reset('')
  }

   





  LeaveTrackerReportSearch(hint: any) {
    let search = this.LeaveTrackerReportsearchForm.value;
    let monthyeardata:any = this.datePipe.transform(search.monthyear, 'yyyy-MM') 
    let splitdata = monthyeardata.split('-')
    console.log(splitdata)

    let obj = {
      month: splitdata[1],
      year: splitdata[0]
    }
    this.apicall.ApiCall('getFile', this.hrmsapi.HRMS_API.api.leaveTrackReport+
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
     
    // this.SpinnerService.show();

    // if (hint == 'next') {
    //   this.serviceCallLeaveTrackerReportSummary(obj, this.TrackLeaveObj.presentpageTrackreport + 1, 10)
    // }
    // else if (hint == 'previous') {
    //   this.serviceCallLeaveTrackerReportSummary(obj, this.TrackLeaveObj.presentpageTrackreport - 1, 10)
    // }
    // else {
    //   this.serviceCallLeaveTrackerReportSummary(obj, 1, 10)
    // }

  }

  serviceCallLeaveTrackerReportSummary(search, pageno, pageSize) {
    // this.LeaveTrackerService.LeaveTrackerReport(search, pageno)
    this.SpinnerService.hide();
    this.apicall.ApiCall("post",
     this.hrmsapi.HRMS_API.api.leave_request+"?page="+pageno+"&", search  
     )
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("LeaveTrackerReport summary", result, result['pagination'])
        this.TrackLeaveObj.TrackerReport = result
        let dataPagination = result['pagination'];
        if (this.TrackLeaveObj.TrackerReport["data"].length > 0) {
          this.TrackLeaveObj.has_nextTrackreport = dataPagination.has_next;
          this.TrackLeaveObj.has_previousTrackreport = dataPagination.has_previous;
          this.TrackLeaveObj.presentpageTrackreport = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

// action=leave_report&query=&month=02&year=2023&page=1&lr_week=1




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
  this.LeaveTrackerReportsearchForm.patchValue({
    monthyear:this.monyear.value
  })
}

ChangeDateFormat(key){
  // this.attendanceReportsearchForm.patchValue({
  //   [key]: this.datePipe.transform(key, 'yyyy-MM') 
  // }) 

}




}

export const DATE_FORMAT_LR = {
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
selector: '[dateFormatLR]',
providers: [ 
  {
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
  },
  { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_LR },
],
})
export class CustomDateFormatLR {}