import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'
import { AttendanceService } from '../../attendance.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';


@Component({
  selector: 'app-leave-request-create',
  templateUrl: './leave-request-create.component.html',
  styleUrls: ['./leave-request-create.component.scss'],
  providers: [imp.HrmsAPI, imp.Master,
  { provide: imp.DateAdapter, useClass: imp.PickDateAdapter },
  { provide: imp.MAT_DATE_FORMATS, useValue: imp.PICK_FORMATS }]
})
export class LeaveRequestCreateComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private attendanceService: AttendanceService, private shareService: imp.SharedService, private hrmsapi: imp.HrmsAPI,
    private apicall: ApicallserviceService, private masterApi: imp.Master
  ) { }

  leaveReqForm: FormGroup;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  nowDate = new Date().toISOString().split("T")[0];

  LeaveRequestCreateObjects = {
    leavetypelist: [],
    TotalDaysInLeaveCount: 0,
    Documentfilearray: [],
    TypesOfLeaveAndCounts: [],
    shift_time: null,
    countValidation: '',
    LeaveSession: [],
    typesBasedOnDateCount_OneDayLeave: [{ name: 'Full Day' }, { name: 'First Half Day' }, { name: 'Second Half Day' }],
    typesBasedOnDateCount_RangeLeave: [{ name: 'Full Day' }, { name: 'Half Day' }],
    leaveColors: ['#2fcc71', '#0088ff', '#845cee', '#2d294c', '#ff4858', '#08c7b6', '#002349', '#4F0341', '#0C1A1A', '#E9F1FA', '#DDD0C8'],
    PermissionsTimings: [{ id: 1, name: '1/2 Hour' }, { id: 2, name: '1 Hour' }, { id: 3, name: '1 1/2 Hour' }, { id: 4, name: '2 Hour' }],
    permissionValidation: false,
    HourTimeDifference: 0,
    MinuteTimeDifference: 0
  }

  ngOnInit(): void {

    let currentDate = new Date()
    console.log("currrent date for patch", currentDate)

    this.leaveReqForm = this.fb.group({
      leave_type: [''],
      from_date: new Date(),
      to_date: new Date(),
      reason: [''],




      fromDatepermission: new Date(),
      from_dateLeaveType: 'Full Day',
      to_dateLeaveType: 'Full Day',
      frompermissiontime: '',
      topermissiontime: '1/2 Hour'
    })

    this.getTypesOfLeaveAndCounts()
    this.leaveRequestList()
    this.countDays()
    this.shiftTime()
    console.log("now date new Date().toISOString().split", this.nowDate)
  }


  /////// Count Days 

  countDays() {
    let startDate = this.leaveReqForm.value.from_date
    let endDate = this.leaveReqForm.value.to_date

    let difference = endDate.getTime() - startDate.getTime();
    this.LeaveRequestCreateObjects.TotalDaysInLeaveCount = Math.ceil(difference / (1000 * 3600 * 24)) + 1;
    console.log("total days", this.LeaveRequestCreateObjects.TotalDaysInLeaveCount)
    if (this.LeaveRequestCreateObjects.TotalDaysInLeaveCount > 1) {
      this.LeaveRequestCreateObjects.countValidation = 'Range Leave'
      this.LeaveRequestCreateObjects.LeaveSession = this.LeaveRequestCreateObjects.typesBasedOnDateCount_RangeLeave
      this.leaveReqForm.patchValue({
        from_dateLeaveType: 'Full Day',
        to_dateLeaveType: 'Full Day'
      })
    }
    else if (this.LeaveRequestCreateObjects.TotalDaysInLeaveCount == 1) {
      this.LeaveRequestCreateObjects.countValidation = 'One Day Leave'
      this.LeaveRequestCreateObjects.LeaveSession = this.LeaveRequestCreateObjects.typesBasedOnDateCount_OneDayLeave
      this.leaveReqForm.patchValue({
        from_dateLeaveType: 'Full Day',
        to_dateLeaveType: 'Full Day'
      })
    }

  }


  ////////// File 

  onFileSelected(e) {
    console.log("e in file", e)
    this.LeaveRequestCreateObjects.Documentfilearray = [];
    for (var i = 0; i < e.target.files.length; i++) {
      this.LeaveRequestCreateObjects.Documentfilearray.push(e.target.files[i])
    }
    console.log("document array===>", this.LeaveRequestCreateObjects.Documentfilearray)
  }

  ////// Delete File 

  deleteInlineFile(fileindex, data) {
    console.log("fileindex", fileindex)
    let filedata = this.LeaveRequestCreateObjects.Documentfilearray
    console.log("filedata for delete before", filedata)
    console.log("filedata selected", data)

    filedata.splice(fileindex, 1)
    console.log("filedata for delete after", filedata)
  }

  /////// get leave Counts   

  getTypesOfLeaveAndCounts() {
    let dataOfCurrentYear = new Date()
    let year = dataOfCurrentYear.getFullYear()
    console.log("year for leave", year)
    this.attendanceService.getTypesOfLeaveAndCounts(year)
      .subscribe(results => {
        this.LeaveRequestCreateObjects.TypesOfLeaveAndCounts = results['data']

      })
  }

  ////// Type Of Leave 
  leaveRequestList() {
    // this.attendanceService.leaveRequestList()
    this.apicall.ApiCall('get', this.masterApi.masters.leave_type)
      .subscribe(result => {
        let datass = result['data'];
        this.LeaveRequestCreateObjects.leavetypelist = datass;
      })
  }



  shiftTime() {

    this.attendanceService.shiftTime()
      .subscribe(result => {
        this.LeaveRequestCreateObjects.shift_time = result;
        if(result?.start_time == null){
          this.notify.warning("Shift Time Not Mapped!")
        }
      })

  }


  // checkValidation(){
  //   console.log("check validation for time change")

  // }






  ////// Back to summary 

  onLeaveReqCancelClick() {
    this.onCancel.emit()

  }

  /////// Submit leave request 
  onSubmitLeaveReqClick() {
    let leaveType = this.leaveReqForm.value.leave_type?.name
    let obj: any = null
    let FinalObj: any = null

    let ShiftObj: any = this.LeaveRequestCreateObjects.shift_time

    if (leaveType != 'Permission' || leaveType != 'PERMISSION') {
      obj = {
        leave_type: this.leaveReqForm.value.leave_type?.id,
        from_date: this.datePipe.transform(this.leaveReqForm.value.from_date, "yyyy-MM-dd"),
        from_dateLeaveType: this.leaveReqForm.value.from_dateLeaveType,
        to_dateLeaveType: this.leaveReqForm.value.to_dateLeaveType,
        to_date: this.datePipe.transform(this.leaveReqForm.value.to_date, "yyyy-MM-dd"),
        reason: this.leaveReqForm.value.reason,

        fromDatepermission: this.leaveReqForm.value.fromDatepermission,
        frompermissiontime: this.leaveReqForm.value.frompermissiontime,
        topermissiontime: this.leaveReqForm.value.topermissiontime
      }

      if (this.LeaveRequestCreateObjects.TotalDaysInLeaveCount > 1) {

        if (obj.from_dateLeaveType == "Full Day" && obj.to_dateLeaveType == "Full Day") {
          obj.from_date = obj.from_date + " " + ShiftObj.start_time.replace('.', ':') 
          obj.to_date = obj.to_date + " " + ShiftObj.end_time.replace('.', ':') 
        }
        if (obj.from_dateLeaveType == "Half Day" && obj.to_dateLeaveType == "Full Day") {
          obj.from_date = obj.from_date + " " + ShiftObj.mid_time.replace('.', ':') 
          obj.to_date = obj.to_date + " " + ShiftObj.end_time.replace('.', ':') 
        }
        if (obj.from_dateLeaveType == "Full Day" && obj.to_dateLeaveType == "Half Day") {
          obj.from_date = obj.from_date + " " + ShiftObj.start_time.replace('.', ':') 
          obj.to_date = obj.to_date + " " + ShiftObj.mid_time.replace('.', ':')
        }
        if (obj.from_dateLeaveType == "Half Day" && obj.to_dateLeaveType == "Half Day") {
          obj.from_date = obj.from_date + " " + ShiftObj.mid_time.replace('.', ':') 
          obj.to_date = obj.to_date + " " + ShiftObj.mid_time.replace('.', ':') 
        }
      }
      if (this.LeaveRequestCreateObjects.TotalDaysInLeaveCount == 1) {
        if (obj.from_dateLeaveType == "Full Day") {
          obj.from_date = obj.from_date + " " + ShiftObj.start_time.replace('.', ':') 
          obj.to_date = obj.to_date + " " + ShiftObj.end_time.replace('.', ':') 
        }
        if (obj.from_dateLeaveType == "First Half Day") {
          obj.from_date = obj.from_date + " " + ShiftObj.start_time.replace('.', ':') 
          obj.to_date = obj.to_date + " " + ShiftObj.mid_time.replace('.', ':') 
        }
        if (obj.from_dateLeaveType == "Second Half Day") {
          obj.from_date = obj.from_date + " " + ShiftObj.mid_time.replace('.', ':') 
          obj.to_date = obj.to_date + " " + ShiftObj.end_time.replace('.', ':') 
        }

      }
    }
    if (leaveType == 'permission' || leaveType == 'Permission') {

      obj = {
        fromDatepermission: this.leaveReqForm.value.fromDatepermission,
        frompermissiontime: this.leaveReqForm.value.frompermissiontime+':00',
        topermissiontime: this.leaveReqForm.value.topermissiontime+':00',

        leave_type: this.leaveReqForm.value.leave_type?.id,
        from_date: this.datePipe.transform(this.leaveReqForm.value.fromDatepermission, "yyyy-MM-dd") + ' ' +obj.frompermissiontime+':00' ,
        // from_dateLeaveType: this.leaveReqForm.value.from_dateLeaveType,
        // to_dateLeaveType: this.leaveReqForm.value.to_dateLeaveType,
        to_date: this.datePipe.transform(this.leaveReqForm.value.fromDatepermission, "yyyy-MM-dd") + ' ' + obj.topermissiontime+':00' ,
        reason: this.leaveReqForm.value.reason,

        
      }

      console.log("permissionObj", obj,obj.frompermissiontime, obj.topermissiontime )
      if(obj.frompermissiontime > obj.topermissiontime){
        this.notify.warning('Invalid Time')
        return false 
      }

      if (obj.frompermissiontime < ShiftObj.start_time || obj.topermissiontime > ShiftObj.end_time) {
        console.log(obj.frompermissiontime < ShiftObj.start_time, obj.frompermissiontime, ShiftObj.start_time,
          obj.topermissiontime < ShiftObj.end_time, obj.topermissiontime, ShiftObj.end_time )
        this.notify.warning("Invalid Time based on Shift Time");
        return false
      }
      if (this.LeaveRequestCreateObjects.HourTimeDifference > 2 || (this.LeaveRequestCreateObjects.HourTimeDifference == 0 && this.LeaveRequestCreateObjects.MinuteTimeDifference == 0 )) {
        this.notify.warning("Permission is limited upto 2 hrs")
        return false
      }

    }
    // {"start_time": "9.30", "end_time": "6.30", "mid_time": "7.80", "shift_name": "day"}  First Half Day Second Half Day  Full Day  Half Day

    FinalObj = {
      leave_type : obj.leave_type,
      from_date: obj.from_date,
      to_date: obj.to_date, 
      reason : obj.reason
    }
    if(FinalObj.from_date > FinalObj.end_time){
      this.notify.warning("Invalid Date, Please check the Date")
      return false 
    }

    console.log("obj data for LR submit", FinalObj)
    const formData: FormData = new FormData();
    formData.append('data', JSON.stringify(FinalObj))
    for (var i = 0; i < this.LeaveRequestCreateObjects.Documentfilearray.length; i++) {
      let keyvalue = 'file'
      let pairValue = this.LeaveRequestCreateObjects.Documentfilearray[i];
      formData.append(keyvalue, pairValue)
    }

    this.apicall.ApiCall('post', this.hrmsapi.HRMS_API.api.leave_request, formData)
      .subscribe(results => {
        if(results.status == 'SUCCESS'){
          this.notify.success("Success")
          this.onSubmit.emit()
        }
        if(results?.status == 'FAILED'){
          this.notify.warning(results?.message)
          // this.onCancel.emit()
        }
        if(results.code){
          this.notify.warning(results?.description)
          return false;
          // this.onCancel.emit()
        }
      })

  }



  PermissionValidationCheck(data) {
    if (data?.name == 'Permission' || data?.name == 'PERMISSION') {
      this.LeaveRequestCreateObjects.permissionValidation = true
      this.leaveReqForm.controls['from_date'].reset(new Date())
      this.leaveReqForm.controls['to_date'].reset(new Date())
      // this.leaveReqForm.controls['fromDatepermission'].reset(new Date().toLocaleString())
      let datetoday = new Date();
      datetoday.setDate(datetoday.getDate());
      let pipedate = this.datePipe.transform(datetoday, 'yyyy-MM-dd');

      let hours = new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours()
      let minutes = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes()



      this.leaveReqForm.patchValue({
        fromDatepermission: pipedate,
        frompermissiontime: hours + ':' + minutes,
        topermissiontime: hours + ':' + minutes
      })
      this.getTimeValidations()
    } 
    else {
      this.LeaveRequestCreateObjects.permissionValidation = false
      // this.leaveReqForm.controls['from_date'].reset(new Date())
      this.leaveReqForm.controls['from_dateLeaveType'].reset('Full Day')
      // this.leaveReqForm.controls['to_date'].reset(new Date())
      this.leaveReqForm.controls['to_dateLeaveType'].reset('Full Day')

    }

  }


  getTimeValidations() {
    let fromTime: any = this.leaveReqForm.value.frompermissiontime
    let toTime: any = this.leaveReqForm.value.topermissiontime

    let splitFromTime: any = fromTime.split(":");
    let splitToTime: any = toTime.split(":");

    let fromTimeCalcualte: any = splitFromTime[0] * 3600 + splitFromTime[1] * 60;
    let ToTimeCalcualte: any = splitToTime[0] * 3600 + splitToTime[1] * 60;

    let diff: any = Math.abs(fromTimeCalcualte - ToTimeCalcualte);
    console.log(fromTimeCalcualte, ToTimeCalcualte)

    let hours: any = (diff / 3600);
    let seconds: any = (diff % 3600);
    let minutes: any = (seconds / 60);
    this.LeaveRequestCreateObjects.HourTimeDifference = Math.floor(hours)
    this.LeaveRequestCreateObjects.MinuteTimeDifference = minutes

    console.log(fromTime, toTime, diff, hours, minutes)

  }


















}
