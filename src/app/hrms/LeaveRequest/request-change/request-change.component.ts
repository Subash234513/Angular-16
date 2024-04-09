import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'
import { AttendanceService } from '../../attendance.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';

@Component({
  selector: 'app-request-change',
  templateUrl: './request-change.component.html',
  styleUrls: ['./request-change.component.scss'],
  providers: [imp.HrmsAPI, imp.Master,
  { provide: imp.DateAdapter, useClass: imp.PickDateAdapter },
  { provide: imp.MAT_DATE_FORMATS, useValue: imp.PICK_FORMATS }]
})
export class RequestChangeComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private attendanceService: AttendanceService, private shareService: imp.SharedService, private hrmsapi: imp.HrmsAPI,
    private apicall: ApicallserviceService, private masterApi: imp.Master
  ) { }

  RequestSearchForm: FormGroup;

  obj = {
    changeRequestSummary: true,
    requestcreatescreen: false,
    viewRequest: false
  }

  RequestObjects = {
    ApprovalStatusList: [{ id: 1, text: 'Approved' }, { id: 2, text: 'Rejected' }, { id: -1, text: 'Pending' }],
    RequestList: [],
    pagesize: 10,
    RequestSummaryScreen: false,
    RequestAddScreen: false,
    RequestView: null,
    has_nextRequest: false,
    has_previousRequest: false,
    presentpageRequest: 1,
    TypeList: [{ id: 1, text: 'Me', query: 'maker' }, { id: 2, text: 'My Team', query: 'approver' }],
    EmpId: null,
    LogData: null
  }

  ngOnInit(): void {

    this.RequestSearchForm = this.fb.group({
      type: 'maker',
      approvalstatus: -1,
    })

    this.RequestSearch('')



  }

  getRequest(search, pageno) {
    // this.attendanceService.getreqRequest(search, pageno)

    let ApiCallBasedOnType = this.hrmsapi.HRMS_API.api.AttendanceRequest + '?page=' + pageno + '&method=' + search.type + '&approve_status=' + search.status
    console.log("ApiCallBasedOnType", ApiCallBasedOnType)
    this.apicall.ApiCall('get', ApiCallBasedOnType)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log('req request', result)
        // let datass = result['data'];
        // this.RequestObjects.RequestList = datass;
        let datapagination = result["pagination"];
        if (this.RequestObjects.RequestList.length > 0) {
          this.RequestObjects.has_nextRequest = datapagination.has_next;
          this.RequestObjects.has_previousRequest = datapagination.has_previous;
          this.RequestObjects.presentpageRequest = datapagination.index;
        }
        this.RequestObjects.RequestList = result['data']
        this.RequestObjects.RequestList.forEach(x => Object.assign(x, { "show": false }))
        console.log("data for penalty objs", this.RequestObjects.RequestList)
        return this.RequestObjects.RequestList
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  RequestSearch(hint: any) {
    let search = this.RequestSearchForm.value;
    // const dateValue = this.RequestSearchForm.value;
    // dateValue.fromdate = this.datePipe.transform(dateValue.fromdate, 'yyyy-MM-dd');
    // const dateValue1 = this.RequestSearchForm.value;
    // dateValue.todate = this.datePipe.transform(dateValue1.todate, 'yyyy-MM-dd');

    let obj = {
      type: search?.type,
      status: search?.approvalstatus,
    }
    console.log("obj data b4 api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }
    console.log("obj data after filter", obj)
    this.SpinnerService.show();

    if (hint == 'next') {
      this.getRequest(obj, this.RequestObjects?.presentpageRequest + 1)
    }
    else if (hint == 'previous') {
      this.getRequest(obj, this.RequestObjects?.presentpageRequest - 1)
    }
    else {
      this.getRequest(obj, 1)
    }

  }

  resetRequestSearch() {
    this.RequestSearchForm.reset('')
    this.RequestSearch('')
  }


  ChangeDateFormat(key) {
    console.log("this.reqRequestSearchForm.controls[key]", this.RequestSearchForm.controls[key])
    this.RequestSearchForm.patchValue({
      [key]: this.datePipe.transform(this.RequestSearchForm.controls[key].value, 'yyyy-MM-dd')
    })

    if (key == 'fromdate' && (this.RequestSearchForm.value.todate == '' || this.RequestSearchForm.value.todate == null || (this.RequestSearchForm.value.todate < this.RequestSearchForm.value.fromdate))) {
      this.RequestSearchForm.patchValue({
        todate: this.datePipe.transform(this.RequestSearchForm.controls[key].value, 'yyyy-MM-dd')
      })
    }

  }

  getAddScreen() {
    this.obj.changeRequestSummary = false
    this.obj.requestcreatescreen = true
    this.obj.viewRequest = false
  }


  OnSubmitRequest() {
    this.RequestSearch('')
    this.obj.changeRequestSummary = true
    this.obj.requestcreatescreen = false
    this.obj.viewRequest = false
  }

  OnCancelRequest() {
    this.obj.changeRequestSummary = true
    this.obj.requestcreatescreen = false
    this.obj.viewRequest = false
  }


  showReason(data){ 
    console.log(data)
      if(data.show == true){
        data.show = false 
      }
      else{
        data.show = true  
      }

  }

  StatusChange(data, status){
    let obj = {
      request_id: data?.id,
      status: status
    }
    this.apicall.ApiCall('post', this.hrmsapi.HRMS_API.api.attendanceRequestApproval, obj) 
    .subscribe(res=>{
      // if(res?.code == 'INVALID_DATA'){
      //   this.notify.warning('Not Allowed to do the process!')
      // }
      if(res.code){
        this.notify.warning(res?.description)
        return false;
        // this.onCancel.emit()
      }
      else{
      this.RequestSearch('')
      let msg = status == 1 ? ' Approved' : ' Rejected'
      let valids = status == 1 ? 'success' : 'error' 
      this.notify[valids]("Successfully" + msg) 
      }
    })

  }

  CancelRequest(data){
    let obj = {
      request_id: data?.id
    }
    this.apicall.ApiCall('get', this.hrmsapi.HRMS_API.api.attendanceRequestApproval+'?request_id='+obj?.request_id) 
    .subscribe(res=>{
      this.RequestSearch('')
      this.notify.success("Successfully Cancelled Request")
    })

  }











}
