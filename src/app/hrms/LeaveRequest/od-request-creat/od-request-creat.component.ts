import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'
import { AttendanceService } from '../../attendance.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';



@Component({
  selector: 'app-od-request-creat',
  templateUrl: './od-request-creat.component.html',
  styleUrls: ['./od-request-creat.component.scss'],
  providers: [imp.HrmsAPI, imp.Master,
    { provide: imp.DateAdapter, useClass: imp.PickDateAdapter },
    { provide: imp.MAT_DATE_FORMATS, useValue: imp.PICK_FORMATS }]
})
export class OdRequestCreatComponent implements OnInit {
  years: number[] = [];

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private attendanceService: AttendanceService, private shareService: imp.SharedService, private hrmsapi: imp.HrmsAPI,
    private apicall: ApicallserviceService, private masterApi: imp.Master
  ) {
    let currenYear = new Date().getFullYear();
    let currYear = new Date().getFullYear();
    let startYear = currYear - 3;
    for(let year=startYear; year <= currYear + 17; year++)
    {
      this.years.push(year);
    }
   }

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
  options = [{ key: 'Jan', value: '1' }, { key: 'Feb', value: '2' }, { key: 'Mar', value: 3 }, { key: 'Apr', value: 4 }, { key: 'May', value: 5 }, { key: 'Jun', value: 6 }, { key: 'Jul', value: 7 }, { key: 'Aug', value: 8 }, { key: 'Sep', value: 9 }, { key: 'Oct', value: 10 }, { key: 'Nov', value: 11 }, { key: 'Dec', value: 12 }]

  ngOnInit(): void {

    let currentDate = new Date()
    console.log("currrent date for patch", currentDate)

    this.leaveReqForm = this.fb.group({
 
      reason: [''],
      month:'',
      year:'',
      total_days:'',
 
    })

    // this.getTypesOfLeaveAndCounts()
    // this.leaveRequestList()
    // this.countDays()
    // this.shiftTime()
    console.log("now date new Date().toISOString().split", this.nowDate)
  }




  onLeaveReqCancelClick() {
    this.onCancel.emit()

  }

  /////// Submit leave request 
  onSubmitLeaveReqClick() {
    let leaveType = this.leaveReqForm.value.leave_type?.name
    let obj: any = null
    let FinalObj: any = null

  
    this.apicall.ApiCall('post', this.hrmsapi.HRMS_API.api.ondutyrequest, this.leaveReqForm.value )
      .subscribe(results => {
        if(results.status == 'SUCCESS'){
          this.notify.success("Success")
          this.onSubmit.emit()
        }
        if(results?.status == 'FAILED'){
          this.notify.warning(results?.message)
          this.onCancel.emit()
        }
        if(results.code){
          this.notify.warning(results?.description)
          return false;
          // this.onCancel.emit()
        }
      })

  }






}
