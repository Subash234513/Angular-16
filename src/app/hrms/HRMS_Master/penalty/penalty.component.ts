import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'
import { AttendanceService } from '../../attendance.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';

@Component({
  selector: 'app-penalty',
  templateUrl: './penalty.component.html',
  styleUrls: ['./penalty.component.scss'],
  providers: [imp.HrmsAPI, imp.Master,
  { provide: imp.DateAdapter, useClass: imp.PickDateAdapter },
  { provide: imp.MAT_DATE_FORMATS, useValue: imp.PICK_FORMATS }]
})
export class PenaltyComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private attendanceService: AttendanceService, private shareService: imp.SharedService, private hrmsapi: imp.HrmsAPI,
    private apicall: ApicallserviceService, private masterApi: imp.Master
  ) { }
  PenaltyForm: FormGroup 

  ngOnInit(): void {
    this.getPenaltyDatas() 
    this.getPenaltyList() 
    this.Screens.penaltyView = true 

    this.PenaltyForm = this.fb.group({
      shift: [''],
      effective_from: this.datePipe.transform(new Date(), 'yyyy-MM-dd'), 
      penalty: [''], 
    })
  }

  Screens = {
    "penaltyView": false,
    "PenaltyCreate": false
  }

  penaltyObjects = {
    PenaltyViewLists: null,
    PenaltyDD_Lists: null,
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


  getPenaltyDatas(){
    this.apicall.ApiCall("get", this.hrmsapi.HRMS_API.api.penalty + '?action=summary')
    .subscribe(res =>{
      console.log("res for  penaltyObjects data", res)
      this.penaltyObjects.PenaltyViewLists = res['data'] 
      this.penaltyObjects.PenaltyViewLists.forEach(x=> Object.assign(x, {"show": false}))
      console.log("data for penalty objs", this.penaltyObjects.PenaltyViewLists)
      return this.penaltyObjects.PenaltyViewLists
    }) 
  }


  getPenaltyList(){ 
    this.apicall.ApiCall("get", this.hrmsapi.HRMS_API.api.penalityDropDown) 
    .subscribe(res =>{
      console.log("res for  penaltyObjects data", res)
      this.penaltyObjects.PenaltyDD_Lists = res 
    }) 
  }


  showDetails(data){
    
    if(data.show == true){
      data.show = false 
    }
    else{
      data.show = true  
    }

  }


  ChangeDateFormat(key){
    console.log("this.reqRequestSearchForm.controls[key]", this.PenaltyForm.controls[key])
    this.PenaltyForm.patchValue({
      [key]: this.datePipe.transform(this.PenaltyForm.controls[key].value, 'yyyy-MM-dd')
    })
  
 
  }


  onSubmitClick(){
    let penaltyFormdate = this.PenaltyForm.value 

    this.apicall.ApiCall('post', this.hrmsapi.HRMS_API.api.penalty, penaltyFormdate)
    .subscribe(res=>{
      this.notify.success('Successfully Created');
      this.getPenaltyDatas()
      this.ScreensModules('penaltyView');
      return true 
    })

  }







}
