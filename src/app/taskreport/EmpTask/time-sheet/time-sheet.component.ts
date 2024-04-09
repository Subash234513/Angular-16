import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';

@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.scss'],
  providers: [imp.TaskApi, imp.HrmsAPI]
})
export class TimeSheetComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private shareService: imp.SharedService, private hrmsapi: imp.HrmsAPI,
    private apicall: ApicallserviceService, private taskapi: imp.TaskApi
  ) { }

  SelectedHourDate = new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
  EmpType = new FormControl('');
  EmpBasedOnType = new FormControl('');
  @Output() OnCancel = new EventEmitter<any>();

  timeSheetObjs = {
    taskHourList: [],
    DayTaskData: [],
    SelectedHoursList: [],
    Emp_Me_MyTeam_All: [],
    EmpList: [] 
  }

  ngOnInit(): void {
    this.getEmpTypeView();
    
  }



  getdataForSelectedDate(data){
    console.log(data, this.timeSheetObjs.DayTaskData)
    let dateFormat = this.datePipe.transform(data, 'yyyy-MM-dd')
    this.timeSheetObjs.taskHourList = [];
    let filterData  = this.timeSheetObjs.DayTaskData[dateFormat]
    this.timeSheetObjs.taskHourList = filterData
    console.log("this.EmpTaskObj.taskHourList", this.timeSheetObjs.taskHourList)
    // let filterData  =  
    // console.log(filterData)
    // this.EmpTaskObj?.taskHourList = this.EmpTaskObj.DayTaskData[dateFormat]

    // let gettingData = this.EmpTaskObj.DayTaskData.find(x=>x.data)
    // console.log("EmpTaskObj.taskHourList", gettingData)
    // this.EmpTaskObj.taskHourList = gettingData


  }


  // getTaskHours() {
  //   this.timeSheetObjs.SelectedHoursList = []
  //   let dates = [...Array(1)].map((x, i) => {
  //     let datesSelected = new Date(this.SelectedHourDate.value)
  //     datesSelected.setDate(datesSelected.getDate() - i)
  //     return datesSelected
  //   })
  //   this.timeSheetObjs.SelectedHoursList = dates

  //   this.apicall.ApiCall('get', this.taskapi.tasksApi.api.EmpTaskHours + this.SelectedHourDate.value)
  //     .subscribe(results => {
  //       this.timeSheetObjs.DayTaskData = results 
  //     })

  // }


  getEmpTypeView(){
    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.Emp_Me_MyTeam_All)
    .subscribe(results=>{
      this.timeSheetObjs.Emp_Me_MyTeam_All = results['data']
    })
  }

  getEmpBasedOnView(data) {
    let DataEmpType = this.EmpType.value || ''  
    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.Emp_Me_MyTeam_All_Emp_DD+"?query="+data+"&type="+DataEmpType )
      .subscribe(results => {
        this.timeSheetObjs.EmpList = results['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  displayFnclt(clt?: interfacedatas): string | undefined {
    return clt ? clt.name : undefined;
  }

  getTimeBasedOnDate(){
    let dev = this.EmpBasedOnType.value["id"]
    this.apicall.ApiCall("get",
     this.taskapi.tasksApi.api.taskHourSearch+"?date="+this.SelectedHourDate.value+"&dev="+dev+"&action="+this.EmpType.value )
    .subscribe(results=>{
      this.timeSheetObjs.taskHourList = results[this.SelectedHourDate.value] 
      console.log("timesheet data", results)

      


    })
    
  }
  // &dev=&action=


  ChangeDateFormatCommon() {
    
      this.SelectedHourDate.patchValue(this.datePipe.transform(this.SelectedHourDate.value, 'yyyy-MM-dd'))

  }

  BackToSummary(){
    this.OnCancel.emit()

  }

  updateTask(data){
     let obj = {
      "data": [
        {
          id: data?.id,
          hours: data?.hours 
        }

      ]
     }
    console.log("data time sheet obj and task hour sheet", obj)
    this.apicall.ApiCall("post", this.taskapi.tasksApi.api.taskHourSearch, obj)
    .subscribe(results=>{
      this.notify.success("Successfully Updated!!")
    })
  }

}




export interface interfacedatas {
  id: string;
  name: string;
}


