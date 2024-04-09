import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles';
import { AttendanceService } from '../../attendance.service';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import * as _moment from 'moment'; 
import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
const moment = _rollupMoment || _moment; 

export interface Emplistss {
  id: string;
  full_name: string;
}

@Component({
  selector: 'app-attendance-log',
  templateUrl: './attendance-log.component.html',
  styleUrls: ['./attendance-log.component.scss'],
  providers: [imp.HrmsAPI]
})
export class AttendanceLogComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private attendanceService: AttendanceService, private shareService: imp.SharedService,
    private hrmsapi: imp.HrmsAPI, private APiserv: ApicallserviceService, private ActRoute: ActivatedRoute
  ) { }

  AttendanceLogObjects: any = {
    TimeLogList: [],
    ActivityStatus: [],
    Days:  [],
    CalenderWeekDayslist:  [], 
    OtherDaysList: []
  }
  calenderform: FormGroup
  @Output() activityStatusData = new EventEmitter<any>();

  ngOnInit(): void {
    let currentDate = new Date()
    let month: any = currentDate.getMonth() + 1
    let year = currentDate.getFullYear()
    if(month <= 9){
      month = '0'+month
    }
    let monthValue =  year+'-'+month
    // console.log("month valuieue", monthValue, month)     

    this.calenderform = this.fb.group({
      data: moment() 
    })

    // this.getTimeLogList()
    this.searchCalenderData()
  }




  ////// Search Calendar Data 

  searchCalenderData() {
    console.log("change")
    let search = this.calenderform.value
    console.log("search and split b4", search)
    let monthyeardata:any = this.datePipe.transform(search.data, 'yyyy-MM') 
    let splitdata = monthyeardata.split('-') 
    console.log("search and split aftr", splitdata, monthyeardata) 

    this.daysInMonth(splitdata[1], splitdata[0])

  }



  ////////////////////////////////////////////// Calender Data
  
  async daysInMonth(month, year) {
    this.AttendanceLogObjects.CalenderWeekDayslist = imp.UtilFiles.WeekDays()
    let listNoOfDays = new Date(year, month, 0).getDate()

    //  this.attendanceService.showAttendanceCalender(year, month)
    // atdserv/attendance?month='+month+'&year='+year
    this.APiserv.ApiCall('get', this.hrmsapi.HRMS_API.api.attendance + '?month=' + month + '&year=' + year)
      .subscribe(results => {
        let dataFromAPI = results['data']
        let weekendDates = results["weekend"]
        let leaveDates = results["leave"]
        let holidayDates = results["holiday"]
        let weekArray = []
        let leaveArray = []
        let holidayArray = []
        if (weekendDates != null) {
          for (let data of weekendDates) {
            if (weekendDates?.length > 0) {
              weekArray.push(this.datePipe.transform(data, 'yyyy-MM-dd'))
            }
          }
        }
        if (leaveDates != null) {
          for (let data of leaveDates) {
            for (let nest of data?.leave_date){
              if (leaveDates?.length > 0) {
                leaveArray.push({date: this.datePipe.transform(nest, 'yyyy-MM-dd'),
                                  status: data?.status})
              }
            }
          }
        }
        if (holidayDates != null || holidayDates?.length == 0) {
          for (let data of holidayDates) {
            if (holidayDates?.length > 0) {
              holidayArray.push({date: this.datePipe.transform(data?.date, 'yyyy-MM-dd'), name: data?.name  })
            }
          }
        }

        let otherDays = {
          weekend: weekArray,
          holiday: holidayArray,
          leave: leaveArray
        }
        this.AttendanceLogObjects.OtherDaysList = otherDays
        console.log("dataFromAPI, listNoOfDays, year, month, otherDays ========> 1", this.AttendanceLogObjects.OtherDaysList)
        this.gettingjsonFormatForCalender(dataFromAPI, listNoOfDays, year, month, otherDays)


      })



  }


  gettingjsonFormatForCalender(dataFromAPI, listNoOfDays, year, month, otherDays) {

    let arr = []
    for (let day = 1; day <= listNoOfDays; day++) {
      let day_flag = true
      let dateArrange: any
      if (day < 10) {
        dateArrange = year + '-' + month + '-0' + day
      }
      if (day >= 10) {
        dateArrange = year + '-' + month + '-' + day
      }
      for (let dataapi of dataFromAPI) {
        if (dataapi?.log_date == dateArrange) {
          day_flag = false

          let dataObj = {
            showmonth: dateArrange,
            dataShow: dataapi,
            indexingBeforeSplit: day,
            weekday: new Date(dateArrange).toLocaleDateString('en-US', { weekday: 'long' })
          }
          arr.push(dataObj)
        }
      }
      if (day_flag) {
        let dataObj = {
          showmonth: dateArrange,
          indexingBeforeSplit: day,
          weekday: new Date(dateArrange).toLocaleDateString('en-US', { weekday: 'long' })
        }
        arr.push(dataObj)
      }
      // console.log("after arrangement of data stringify outer loop ========> 2", (arr))
      this.ArrangingForCalender(arr)

    }


  }


  ArrangingForCalender(arr) {

    let val = arr;
    let count = 0;
    let index_count = 0;
    let final_list = [];
    let temp_list = {};
    let day = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    for (let i of val) {
      if (count == 0 && i['weekday'] != 'Sunday') {
        if (Object.keys(temp_list).length > 0) {
          let index_val = 'index_' + index_count;
          temp_list[index_val] = i;
          index_count = index_count + 1;
        } else {
          for (let j of day) {
            if (j == i['weekday']) {
              break;
            } else {
              let data = { showmonth: '', indexingBeforeSplit: '-', weekday: j };
              let index_val = 'index_' + index_count;
              temp_list[index_val] = data;
              index_count = index_count + 1;
            }
          }
          let index_val = 'index_' + index_count;
          temp_list[index_val] = i;
          index_count = index_count + 1;
        }
      } else {
        if (i['weekday'] == 'Sunday') {
          index_count = 0;
          final_list.push(temp_list);
          temp_list = {};
        }
        let index_val = 'index_' + index_count;
        temp_list[index_val] = i;
        count = count + 1;
        index_count = index_count + 1;
      }
    }
    if (Object.keys(temp_list).length > 0 && Object.keys(temp_list).length < 7) {
      let dataremaining = 7 - Object.keys(temp_list).length
      let templength = Object.keys(temp_list).length
      for (let i = templength; i < 7; i++) {
        let obj = { showmonth: '', indexingBeforeSplit: '-', weekday: '-' };
        let index_val = 'index_' + i;
        temp_list[index_val] = obj;

      }

      final_list.push(temp_list);
    }
    // if (Object.keys(temp_list).length > 0) {
    //   final_list.push(temp_list);
    // }
    // console.log("days of final list =====> 3 ", final_list);
    this.AttendanceLogObjects.Days = final_list
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
    this.calenderform.patchValue({
      data:this.monyear.value
    })
  }










  callTaskSummary(){
 
    
    this.router.navigate(['taskreport/tasksummary']).then(() => {
        setTimeout(() => {
          this.router.navigate(['taskreport/mytask', 'fromlog']) ;
       }, 300);
    });
    
 
    // let callone = new Promise (res, rej) =>(this.router.navigate(['taskreport/tasksummary'])).then(this.router.navigate(['taskreport/mytask']))
  }














}
