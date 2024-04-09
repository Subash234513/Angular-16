import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';


@Component({
  selector: 'app-emp-task-summary',
  templateUrl: './emp-task-summary.component.html',
  styleUrls: ['./emp-task-summary.component.scss'],
  providers: [imp.HrmsAPI, imp.TaskApi]
})
export class EmpTaskSummaryComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private shareService: imp.SharedService, private hrmsapi: imp.HrmsAPI, private ActRoute: ActivatedRoute, 
    private apicall: ApicallserviceService, private taskapi: imp.TaskApi
  ) { }

  wip_startdate = new FormControl(new Date())
  complete_enddate = new FormControl(new Date())
  SelectedHourDate = new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))

  EmpTaskSummary: FormGroup;
  EmpTaskObj = {
    EmpTaskSummary: true,
    EmpTaskCreate: false,
    EmpHoursHistory: false,  
    ApprovalStatusList: [],
    pagesize: 10,
    taskLists: [],
    presentpageTask: 1,
    hasPreviousTask: false,
    hasNextTask: false,
    devtypelist: [],
    clientList: [],
    appNameList: [],
    statusList: [],
    moduleNameList: [],
    teamldList: [],
    DayTaskData: [], 
    taskHourList: [],
    SelectedHoursList: [],
    backmenu: false  
  }

  ngOnInit(): void {
    this.EmpTaskSummary = this.fb.group({
      app_id: '',
      client: '',
      dev_type: '',
      module_id: '',
      unit_head: '',
      team_lead: '',
      from_date: '',
      to_date: '',
      status: ''
    })

    this.ActRoute.paramMap.subscribe((params: ParamMap)=>{
      let SummaryCall: any = params.get('data')
      console.log("summary call",SummaryCall)
      if(SummaryCall == 'fromEmpview'){
        this.EmpTaskObj.backmenu = true 
      }
      

    })

    this.TaskSearch('');
    this.getdevtype();
    this.getStatus();
  }

  getEmpTask(search, pageno) {
    let ApiCallBasedOnType = this.taskapi.tasksApi.api.EmplevelTask + '?page=' + pageno
    this.apicall.ApiCall('post', ApiCallBasedOnType, search)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log('leave request', result)
        let datass = result['data'];
        this.EmpTaskObj.taskLists = datass;
        let datapagination = result["pagination"];
        if (this.EmpTaskObj.taskLists.length > 0) {
          this.EmpTaskObj.hasNextTask = datapagination.has_next;
          this.EmpTaskObj.hasPreviousTask = datapagination.has_previous;
          this.EmpTaskObj.presentpageTask = datapagination.index;
        }
        let currentDate = new Date()
        let formtDate = this.datePipe.transform(currentDate, "yyyy-MM-dd")
        this.EmpTaskObj.taskLists.forEach(x => {

          let Plan_Start: any
          let Plan_End: any
          let PlanDaysCalculate
          let TotalPlanDays

          // if(x.start_date == x.end_date){
          //   TotalPlanDays = 1
          // }else{
          Plan_Start = new Date(this.datePipe.transform(x.start_date, 'yyyy-MM-dd'));
          Plan_End = new Date(this.datePipe.transform(x.end_date, 'yyyy-MM-dd'));

          PlanDaysCalculate = Plan_Start.getTime() - Plan_End.getTime()
          TotalPlanDays = (Math.abs(PlanDaysCalculate) / (1000 * 60 * 60 * 24)) + 1;
          // console.log("days calculation", TotalPlanDays, PlanDaysCalculate, Plan_Start, Plan_End)
          // }
          Object.assign(x, {
            "DynamicStatusCall": false,
            "DynamicDate": formtDate,
            "DynamicHoursToSend": 0,
            "DynamicPlannedDays": TotalPlanDays,
            "DynamicActualDays": 0,
            "DynamicDelayDaysCount": 0
          })
        })
        console.log(this.EmpTaskObj.taskLists)
        return this.EmpTaskObj.taskLists
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }




  TaskSearch(hint: any) {
    let search = this.EmpTaskSummary.value;
    // const dateValue = this.leaveRequestSearchForm.value;
    // dateValue.fromdate = this.datePipe.transform(dateValue.fromdate, 'yyyy-MM-dd');
    // const dateValue1 = this.leaveRequestSearchForm.value;
    // dateValue.todate = this.datePipe.transform(dateValue1.todate, 'yyyy-MM-dd');

    let obj = {
      from_date: search?.from_date,
      to_date: search?.to_date,
      summary_type: search?.status
    }
    console.log("obj data b4 api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }
    this.SpinnerService.show();

    if (hint == 'next') {
      this.getEmpTask(obj, this.EmpTaskObj?.presentpageTask + 1)
    }
    else if (hint == 'previous') {
      this.getEmpTask(obj, this.EmpTaskObj?.presentpageTask - 1)
    }
    else {
      this.getEmpTask(obj, 1)
    }

  }

  resetRequestSearch() {
    this.EmpTaskSummary.reset('')
    this.TaskSearch('')
  }


  getAddScreen() {

    this.EmpTaskObj.EmpTaskSummary = false;
    this.EmpTaskObj.EmpTaskCreate = true;
    this.EmpTaskObj.EmpHoursHistory = false;

  }


  getdevtype() {
    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.devTypeDD)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.EmpTaskObj.devtypelist = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  clientsearch(Typedata) {

    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.clientsearch +
      this.taskapi.tasksApi.queries.query + Typedata + '&' +
      this.taskapi.tasksApi.queries.status + 2)

      .subscribe(results => {
        this.EmpTaskObj.clientList = results['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  displayFnclt(clt?: interfacedatas): string | undefined {
    return clt ? clt.name : undefined;
  }

  Projectsearch(Typedata) {
    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.projectSearch + this.taskapi.tasksApi.queries.query + Typedata + '&' + this.taskapi.tasksApi.queries.status + 2)
      .subscribe(results => {
        this.EmpTaskObj.appNameList = results['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  displayFnappnm(appnm?: interfacedatas): string | undefined {
    return appnm ? appnm.name : undefined;
  }

  getStatus() {
    this.apicall.ApiCall("get", this.taskapi.tasksApi.api.MyTaskStatus)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.EmpTaskObj.statusList = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  getModule(Typedata) {
    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.projectSearch + this.taskapi.tasksApi.queries.query + Typedata + '&' + this.taskapi.tasksApi.queries.status + 2)
      .subscribe(results => {
        this.EmpTaskObj.appNameList = results['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  displayFnmodnm(mod?: interfacedatas): string | undefined {
    return mod ? mod.name : undefined;
  }

  getTeamLead(data) {
    this.apicall.ApiCall("get", this.taskapi.tasksApi.api.teamLead + data)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.EmpTaskObj.teamldList = datas;
      })
  }

  displayFnteamld(teamld?: interfacedatas): string | undefined {
    return teamld ? teamld.name : undefined;
  }


  ChaneStatus(status, taskstatus) {
    let obj: any
    console.log("taskstatus", taskstatus)
    if (taskstatus?.task_status_id == 0) {
      obj = {
        actual_start_date: taskstatus?.DynamicDate,
        task_status: status,
      }
    }
    else if (taskstatus?.task_status_id == 1) {
      obj = {
        actual_end_date: taskstatus?.DynamicDate,
        task_status: status,
        emp_hr: taskstatus?.emp_hours,
        delay_days: taskstatus?.DynamicDelayDaysCount,
        reason_for_delay: taskstatus?.reason_for_delay
      }
    }

    else {
      obj = {
        task_status: status
      }
    }
    this.apicall.ApiCall("post", this.taskapi.tasksApi.api.changeTaskStatus + taskstatus.id, obj)
      .subscribe(results => {
        this.notify.success("Status Updated")
        this.TaskSearch('')
      })

  }

  showPopUp(data) {
    if (data.DynamicStatusCall == true) {
      data.DynamicStatusCall = false
    } else {
      data.DynamicStatusCall = true
    }

  }


  SubmitbackToSummary() {
    this.TaskSearch('')
    this.EmpTaskObj.EmpTaskSummary = true;
    this.EmpTaskObj.EmpTaskCreate = false;
    this.EmpTaskObj.EmpHoursHistory = false; 
  }


  CancelbackToSummary() {
    this.EmpTaskObj.EmpTaskSummary = true;
    this.EmpTaskObj.EmpTaskCreate = false;
    this.EmpTaskObj.EmpHoursHistory = false
  }

  ChangeDateFormat(data) {
    data.DynamicDate = this.datePipe.transform(data?.DynamicDate, 'yyyy-MM-dd');
  }
  ChangeDateFormatCommon(form, control, type) {
    console.log("console.log(control, type)", control, type)
    if (type == 'form'){
      // this.EmpTaskSummary.value[control] = this.datePipe.transform(this.EmpTaskSummary.value[control], 'yyyy-MM-dd');
      this.EmpTaskSummary.patchValue({ 
        [control]: this.datePipe.transform(this.EmpTaskSummary.value[control], 'yyyy-MM-dd')
    });
      console.log("console.log(control, type)", control, type)
    }
    else{
      this.SelectedHourDate.patchValue(this.datePipe.transform(this.SelectedHourDate.value, 'yyyy-MM-dd'))
    }
  }

  EndDateCalculate(data) {
    ///if Planned days = 5, and if actual task days = 6
    ///then delay days  = 1  
    let Plan_Start: any
    let Plan_End: any
    let PlanDaysCalculate
    let TotalPlanDays

      console.log("actual start date and end date ", data)
    Plan_Start = new Date(this.datePipe.transform(data.actual_start_date, 'yyyy-MM-dd'));
    Plan_End = new Date(this.datePipe.transform(data.DynamicDate, 'yyyy-MM-dd'));

    PlanDaysCalculate = Plan_Start.getTime() - Plan_End.getTime()
    TotalPlanDays = (Math.abs(PlanDaysCalculate) / (1000 * 60 * 60 * 24)) + 1;

    data.DynamicDelayDaysCount = (TotalPlanDays - data?.DynamicPlannedDays) > 0 ? (TotalPlanDays - data?.DynamicPlannedDays) : 0 

  }

  UpdateTask(data) {
    let obj = {
      emp_hr: data?.emp_hours,
      delay_days: data.DynamicDelayDaysCount,
      reason_for_delay: data.reason_for_delay
    }
    console.log(data, obj)
    this.apicall.ApiCall("post", this.taskapi.tasksApi.api.changeTaskStatus + data.id, obj)
      .subscribe(results => {
        this.notify.success("Status Updated")
        this.TaskSearch('')
      })

  }





  getTaskHours() {
    this.EmpTaskObj.SelectedHoursList = []
    let dates = [...Array(3)].map((x, i) => {
      let datesSelected = new Date(this.SelectedHourDate.value)
      datesSelected.setDate(datesSelected.getDate() - i)
      return datesSelected
    })
    this.EmpTaskObj.SelectedHoursList = dates

    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.EmpTaskHours + this.SelectedHourDate.value)
      .subscribe(results => {
        this.EmpTaskObj.DayTaskData = results 
      })

  }

  getdataForSelectedDate(data){
    console.log(data, this.EmpTaskObj.DayTaskData)
    let dateFormat = this.datePipe.transform(data, 'yyyy-MM-dd')
    this.EmpTaskObj.taskHourList = [];
    let filterData  = this.EmpTaskObj.DayTaskData[dateFormat]
    this.EmpTaskObj.taskHourList = filterData
    console.log("this.EmpTaskObj.taskHourList", this.EmpTaskObj.taskHourList)
    // let filterData  =  
    // console.log(filterData)
    // this.EmpTaskObj?.taskHourList = this.EmpTaskObj.DayTaskData[dateFormat]

    // let gettingData = this.EmpTaskObj.DayTaskData.find(x=>x.data)
    // console.log("EmpTaskObj.taskHourList", gettingData)
    // this.EmpTaskObj.taskHourList = gettingData


  }



  CancelbackToSummaryReport(){
    this.EmpTaskObj.EmpHoursHistory = false;
    this.EmpTaskObj.EmpTaskSummary = true;
    this.EmpTaskObj.EmpTaskCreate = false;
  }

  TaskHourReport(){
    this.EmpTaskObj.EmpHoursHistory = true;
    this.EmpTaskObj.EmpTaskSummary = false;
    this.EmpTaskObj.EmpTaskCreate = false;
  }

  BackToSummary(){
    this.EmpTaskObj.EmpHoursHistory = false;
    this.EmpTaskObj.EmpTaskSummary = true;
    this.EmpTaskObj.EmpTaskCreate = false;
  }

  BackToSummaryToAttendanceLog(){
    if(this.EmpTaskObj.backmenu){
    this.router.navigate(['hrms/empdetails'])
    }
  }
}



export interface interfacedatas {
  id: string;
  name: string;
}