import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'
import { AttendanceService } from '../../attendance.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import moment from 'moment';

@Component({
  selector: 'app-request-change-create',
  templateUrl: './request-change-create.component.html',
  styleUrls: ['./request-change-create.component.scss'],
  providers: [imp.HrmsAPI, imp.Master,
  { provide: imp.DateAdapter, useClass: imp.PickDateAdapter },
  { provide: imp.MAT_DATE_FORMATS, useValue: imp.PICK_FORMATS }]
})

export class RequestChangeCreateComponent implements OnInit {

  RequestChangeForm: FormGroup
  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private attendanceService: AttendanceService, private shareService: imp.SharedService, private hrmsapi: imp.HrmsAPI,
    private apicall: ApicallserviceService, private masterApi: imp.Master
  ) { }
 
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  prev_date = null 

  ngOnInit(): void {

    let today = new Date(); 
    today.setDate(today.getDate() - 1); 
    console.log(today);
    let date = this.datePipe.transform(today, 'yyyy-MM-dd');

    this.RequestChangeForm = this.fb.group({
      date: date,
      in_time:'',
      out_time: '',
      actualin_time: '',
      actualout_time:'',
      reason: [''],
    })
    const getId: any = localStorage.getItem('sessionData')
    let IdValue = JSON.parse(getId);
    let id = IdValue.employee_id

    this.RequestObjects.EmpId = id 
    this.perdayLog(date); 
    this.shiftTime(); 
  }
  RequestObjects = {
    EmpId: null,
    LogData: null,
    shift_time: null,
    
    ActualInTime: null, 
    ActualoutTime : null, 
    InTime: null, 
    OutTime: null,
  }

  changeDateFormat(key){
    this.RequestChangeForm.patchValue({
      [key]: this.datePipe.transform(this.RequestChangeForm.controls[key].value, 'yyyy-MM-dd')
    })
  }

  timeChange(){
    console.log("Time Changes")
  }


  onRequestCancelClick(){
    this.onCancel.emit() 
  }

  onSubmitRequestClick(){
    console.log("submit data", this.RequestChangeForm.value )
    let data = {
      date: this.datePipe.transform(this.RequestChangeForm.value.date, 'yyyy-MM-dd'),
      in_time: this.RequestChangeForm.value.in_time == '' ? '':  this.datePipe.transform(this.RequestChangeForm.value.date, 'yyyy-MM-dd') +' ' +this.RequestChangeForm.value.in_time+':00' ,
      out_time: this.RequestChangeForm.value.out_time == '' ?  '': this.datePipe.transform(this.RequestChangeForm.value.date, 'yyyy-MM-dd') +' ' +this.RequestChangeForm.value.out_time+':00' ,
      reason: this.RequestChangeForm.value.reason
    } 
    console.log("submit data data arrrangement", data )

    if((data.in_time == '') && (data.out_time == '' )){
      this.notify.warning('Please Fill either In Time or Out Time')
      return false 
    } 


    // if(data?.in_time == '' || data?.in_time == null || data?.in_time == undefined ){
    //   this.notify.warning('Please Fill In Time')
    //   return false 
    // }
    // if(data?.out_time == '' || data?.out_time == null || data?.out_time == undefined ){
    //   this.notify.warning('Please Fill Out Time')
    //   return false 
    // }
    if(data?.reason == '' || data?.reason == null || data?.reason == undefined ){
      this.notify.warning('Please Fill Reason/Remarks')
      return false 
    }

    this.apicall.ApiCall('post', this.hrmsapi.HRMS_API.api.AttendanceRequest, data)
    .subscribe(res=>{
      if(res.code == "INVALID_DATA" && res.description == "NO RECORDS"){
        this.notify.warning('Request Not created for this Date !!')
        return false 
      }
      else if(res.code == "INVALID_DATA" && res.description == "Duplicate Entry"){
        this.notify.warning('Request already raised for this Date !!')
        return false 
      }
     else if(res.code == "INVALID_DATA"){
        this.notify.warning(res.description)
        return false 
      }
      else{
        this.notify.success('Successfully Requested')
        this.onSubmit.emit()
      }  
    })


  }

  perdayLog(date){
    let id = this.RequestObjects.EmpId 
    this.apicall.ApiCall("get", this.hrmsapi.HRMS_API.api.perDayLog+id+"?log_date="+date)
    .subscribe(res=>{
      this.RequestObjects.LogData = res 
      let inTime = this.datePipe.transform(this.RequestObjects.LogData?.active_status?.check_in, 'h:mm a')
      let outTime = this.datePipe.transform(this.RequestObjects.LogData?.active_status?.check_out, 'h:mm')
      console.log("in time, out time", inTime, outTime)
      this.RequestChangeForm.patchValue({
        actualin_time: moment(inTime, ["h:mm A"]).format("HH:mm"),
        actualout_time: outTime
      })
      console.log("res data log for that day ", res ) 
    })

  }


  shiftTime() {

    this.attendanceService.shiftTime()
      .subscribe(result => {
        this.RequestObjects.shift_time = result;
        if(result?.start_time == null){
          this.notify.warning("Shift Time Not Mapped!")
        }
      })

  }




  dateFilter = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
    return date < today;
  };

}
