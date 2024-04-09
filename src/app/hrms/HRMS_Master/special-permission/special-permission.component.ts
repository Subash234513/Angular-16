import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'
import { AttendanceService } from '../../attendance.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';


@Component({
  selector: 'app-special-permission',
  templateUrl: './special-permission.component.html',
  styleUrls: ['./special-permission.component.scss'],
  providers: [imp.HrmsAPI, imp.Master,
  { provide: imp.DateAdapter, useClass: imp.PickDateAdapter },
  { provide: imp.MAT_DATE_FORMATS, useValue: imp.PICK_FORMATS }]
})
export class SpecialPermissionComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private attendanceService: AttendanceService, private shareService: imp.SharedService, private hrmsapi: imp.HrmsAPI,
    private apicall: ApicallserviceService, private masterApi: imp.Master
  ) { }
  SpecialPermissionForm: FormGroup
  SpecialPermissionRequestSearchForm: FormGroup

  ngOnInit(): void {
    
    this.Screens.SpecialPermissionView = true

    this.SpecialPermissionForm = this.fb.group({
      effective_to: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      effective_from: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      employee_id: [''],
    })

    this.SpecialPermissionRequestSearchForm = this.fb.group({
      employee_id: ''
    })

    this.SpecialPermissionReqSearch('') 
    this.getSpecialPermissionList()
  }

  Screens = {
    "SpecialPermissionView": false,
    "SpecialPermissionCreate": false
  }

  SpecialPermissionObjects = {
    SpecialPermissionViewLists: null,
    SpecialPermissionDD_Lists: null,
    employeeList: '',
    has_nextPermission: false,  
    has_previousPermission: false, 
    presentpagePermission: 1 
  }

  ScreensModules(details) {
    console.log("details==>", details)
    let objs = this.Screens
    for (let i in objs) {
      if (!(i == details)) {
        objs[i] = false;
      } else {
        objs[i] = true;
      }
    }
  }


  // getSpecialPermissionDatas() {
  //   this.apicall.ApiCall("get", this.hrmsapi.HRMS_API.api.SpecialPermission + '?action=summary')
  //     .subscribe(res => {
  //       console.log("res for  SpecialPermissionObjects data", res)
  //       this.SpecialPermissionObjects.SpecialPermissionViewLists = res['data']
         
  //     })
  // }

  getSpecialPermissionRequest(search, pageno) {
    // this.attendanceService.getSpecialPermissionRequest(search, pageno)

    let ApiCallBasedOnType = this.hrmsapi.HRMS_API.api.SpecialPermission+'?page='+ pageno+'&'
    
    console.log("ApiCallBasedOnType", ApiCallBasedOnType )
    this.apicall.ApiCall('get',ApiCallBasedOnType,search) 
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log('SpecialPermission request', result)
        let datass = result['data'];
        this.SpecialPermissionObjects.SpecialPermissionViewLists = datass;
        let datapagination = result["pagination"];
        if (this.SpecialPermissionObjects.SpecialPermissionViewLists.length > 0) {
          this.SpecialPermissionObjects.has_nextPermission= datapagination.has_next;
          this.SpecialPermissionObjects.has_previousPermission = datapagination.has_previous;
          this.SpecialPermissionObjects.presentpagePermission = datapagination.index; 
        } 
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  } 

  SpecialPermissionReqSearch(hint: any) {
    let search = this.SpecialPermissionRequestSearchForm.value;
    console.log("search data", search) 

    let obj = {
      employee_id: search?.employee_id?.id, 
    }
    console.log("obj data b4 api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }
    this.SpinnerService.show();

    if (hint == 'next') {
      this.getSpecialPermissionRequest(obj, this.SpecialPermissionObjects?.presentpagePermission + 1)
    }
    else if (hint == 'previous') {
      this.getSpecialPermissionRequest(obj, this.SpecialPermissionObjects?.presentpagePermission - 1) 
    }
    else {
      this.getSpecialPermissionRequest(obj, 1 )
    }

  }

  resetRequestSearch() {
    this.SpecialPermissionRequestSearchForm.reset('')
    this.SpecialPermissionReqSearch('')
  }



































  getSpecialPermissionList() {
    this.apicall.ApiCall("get", this.hrmsapi.HRMS_API.api.penalityDropDown)
      .subscribe(res => {
        console.log("res for  SpecialPermissionObjects data", res)
        this.SpecialPermissionObjects.SpecialPermissionDD_Lists = res
      })
  }


  showDetails(data) {

    if (data.show == true) {
      data.show = false
    }
    else {
      data.show = true
    }

  }


  ChangeDateFormat(key) {
    console.log("this.SpecialPermissionRequestSearchForm.controls[key]", this.SpecialPermissionForm.controls[key])
    this.SpecialPermissionForm.patchValue({
      [key]: this.datePipe.transform(this.SpecialPermissionForm.controls[key].value, 'yyyy-MM-dd')
    })

    if (key == 'effective_from' && (this.SpecialPermissionForm.value.effective_to == '' ||
      this.SpecialPermissionForm.value.effective_to == null || (this.SpecialPermissionForm.value.effective_to < this.SpecialPermissionForm.value.effective_from))) {
      this.SpecialPermissionForm.patchValue({
        effective_to: this.datePipe.transform(this.SpecialPermissionForm.controls[key].value, 'yyyy-MM-dd')
      })
    }

  }


  onSubmitClick() {
    let SpecialPermissiondata = this.SpecialPermissionForm.value
    let obj = {
      "employee_id": SpecialPermissiondata.employee_id?.id,
      "effective_from": SpecialPermissiondata?.effective_from,
      "effective_to": SpecialPermissiondata?.effective_to
    }

    this.apicall.ApiCall('post', this.hrmsapi.HRMS_API.api.SpecialPermission, obj) 
      .subscribe(res => {
        this.notify.success('Successfully Created');
        this.SpecialPermissionReqSearch('')
        this.ScreensModules('SpecialPermissionView');
        return true
      })

  }


  getemployee(data) {

    if (data == undefined || data == null || data == '') {
      data = ''
    } else { data = data }
    this.apicall.ApiCall('get', this.masterApi.masters.employee + data)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpecialPermissionObjects.employeeList = datas;
        console.log("employeeList", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }


  public displayFnemp(emp?: Emplistss): string | undefined {
    return emp ? emp.full_name : undefined;
  }


}
interface Emplistss {
  id: string;
  full_name: string;
  name: string;
}