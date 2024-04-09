import { Component, EventEmitter, Input, OnInit, Output, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';


import { Overlay, OverlayPositionBuilder } from '@angular/cdk/overlay';
// import { ComponentPortal } from '@angular/cdk/portal';
import * as imp from '../../AppAutoEngine/import-services/CommonimportFiles'
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApicallserviceService } from 'src/app/AppAutoEngine/API Services/Api_and_Query/apicallservice.service';

import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ViewChild } from '@angular/core';
import { TaskManagerService } from '../task-manager.service';
import { SharedService } from 'src/app/service/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { IconDialogComponent } from '../icon-dialog/icon-dialog.component'; 
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MatSelect } from '@angular/material/select';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ShareddataService } from '../shareddata.service';



export interface emplistss {
  id: string;
  name: any
}

export interface dependency {
  id: string;
  task: string;
}

export interface interfacedatas {
  id: string;
  name: string;
}
export interface developer {
  id: string;
  name: string;
}
export interface developclient {
  id: string;
  name: string;
}


@Component({
  selector: 'app-taskedit',
  templateUrl: './taskedit.component.html',
  styleUrls: ['./taskedit.component.scss'],
  providers: [imp.TaskApi]
})
export class TaskeditComponent implements OnInit {

  @Input() jsonData : any;
  [x: string]: any;


  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private shareService: imp.SharedService,
    private apicall: ApicallserviceService, private taskapi: imp.TaskApi, private taskmanagerservice: TaskManagerService, private sharedservice:SharedService,
    private dialog: MatDialog, private overlay: Overlay, private overlayPositionBuilder: OverlayPositionBuilder, private localService: ShareddataService
  ) { }
  @Output() OnSubmit = new EventEmitter<any>();
  @Output() OnCancel = new EventEmitter<any>();

  EmpTaskCreate: FormGroup;
  selectedDevTypeName: string;
  selectedStartDate: Date;
  selectedEndDate: Date;
  StoryVals = 0;
  sprstartdate : any = '';
  sprenddate : any = '';
  unassigned:any=''
  assigned:any=''
  assign:boolean;
  readonly:boolean

  spstartdate:any;
  spenddate:any;
  taskstartdate:any;
  tasksenddate:any;
  dependency_ids:any;
  taskcode:any
  dependencyid:any
  taskstatus:any
  projectmap:any
  modulemapid:any
  actualenddate:any
  actualstartdate:any
  projectId:any
 
  empList: Array<developer>;
  isEndDateValid: boolean = false;

  
  EmpTaskCreateObj = {
    QuickAccessList: [],
    selectedNav: '',
    clientList: [],
    projectList: [],
    moduleList: [],
    createArray: [],
    from_date: '',
    to_date: '',
    task: '',
    type: '',
    devtypelist: [],
    statusListData: '',
    toSelectDropDown: null, 
    toSelectDependency: null,
    submitValidation: false,
    dependencylist: [], 
    priorityList:[]
   
    // priorityList: [{'id':1,'text':true},{'id':2,'text':false}]
  }



  ngOnInit(): void {
    
    this.EmpTaskCreate = this.fb.group({
      client: '',
      project: '', 
      project_map_id: '',
      task:'',
      dev_type_name:'',
      // start_date:'',
      start_date: ['', Validators.required],
      end_date:'',
      developer:'',
      dependency_id:'',
      priority_type:'',
      dependencylist:'',
      // title:'',
      type:'',
      developers:'',
      id:'',
      dev_type_names:'',
      actual_start_date:'',
      actual_end_date:'',
      remarks:''
      



    

      // data: new FormArray([
         
      // ])
    })
    this.taskstatus=this.localService.taskstatus.value
   
    this.dependencyid=this.localService.dependency.value
    this.taskcode=this.localService.taskcode.value
    this.taskstartdate=this.localService.taskstartdate.value
    this.tasksenddate=this.localService.taskenddate.value
    this.spstartdate=this.localService.taskstartdate.value
    this.spenddate=this.localService.taskenddate.value
    if(this.taskstartdate=='' && this.tasksenddate==''){

    }
    this. presenttDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        if(this.spenddate >= this. presenttDate || this.spenddate== null  ){
          this.spenddate = this.presenttDate;
        }
    this.sprstartdate = this.datePipe.transform(this.localService?.sprintfromdate?.value, 'yyyy-MM-dd') 
    this.sprenddate = this.datePipe.transform(this.localService?.sprinttodate?.value, 'yyyy-MM-dd') 
    console.log("JSON DATA",this.jsonData)
    this.actualenddate=this.jsonData.actual_end_date
    this.actualstartdate=this.jsonData.actual_start_date
    
    // this.assigned=this.localService.assignedit.value
    // if( this.assigned='assigned'){
    //   this.assign=true;
    // }
    this.unassigned=this.localService.unassignedit.value
    this.getdevtype();
    this.getPriority();
    if(this.unassigned==="Unassigned"){

      if(this.jsonData.start_date == 'None' || this.jsonData.end_date == 'None'){
        this.EmpTaskCreate.patchValue({
        
          task: this.jsonData.task,
          dev_type_name: this.jsonData.dev_type.id,       
          developer : this.jsonData.task_assignee[0]?.full_name,      
          priority_type: this.jsonData.priority_type.id,
          client : this.jsonData.client_name.name,
          project: this.jsonData.app_id.name, 
          project_map_id: this.jsonData.module_id.name,
          // type: this.jsonData.dev_type.id,
          // start_date: new Date(this.jsonData.start_date),
          // end_date : new Date(this.jsonData.end_date), 
          type: this.jsonData.dev_type.id,
         
        })
      }
      else{
      this.EmpTaskCreate.patchValue({
        
        task: this.jsonData.task,
        dev_type_name: this.jsonData.dev_type.id,       
        developer : this.jsonData.task_assignee[0]?.full_name,      
        priority_type: this.jsonData.priority_type.id,
        client : this.jsonData.client_name.name,
        project: this.jsonData.app_id.name, 
        project_map_id: this.jsonData.module_id.name,
        // type: this.jsonData.dev_type.id,
        start_date: new Date(this.jsonData.start_date),
        end_date : new Date(this.jsonData.end_date), 
        type: this.jsonData.dev_type.id,
       
      })
    }
        
    }
    if(this.unassigned!="Unassigned"){
      if(this.jsonData.start_date == "None")
      {
        this.EmpTaskCreate.patchValue({
        
          client : this.jsonData.client_name,
          project: this.jsonData.app_id, 
          project_map_id: this.jsonData.module_id,
          task: this.jsonData.task,
          dev_type_name: this.jsonData.dev_type,
          // start_date: new Date(this.jsonData.start_date),
          // end_date : new Date(this.jsonData.end_date),
          developer : this.jsonData.task_assignee[0].full_name,
          dependency_id: this.jsonData.dependency,
          dependencylist: this.jsonData.dependency,
          priority_type: this.jsonData.priority_type.id,
          // title: this.jsonData.title,
          // developers : this.jsonData.task_assignee[0].id,
          id: this.jsonData.id,
          // dev_type_names: this.jsonData.dev_type.id,
          type: this.jsonData.dev_type.id,
        
          // actual_start_date:new Date(this.jsonData.actual_start_date),
          // actual_end_date:new Date(this.jsonData.actual_end_date)
    
         
   
    
        })
        

      }
      else
      {
  
      this.EmpTaskCreate.patchValue({
        client : this.jsonData.client_name,
        project: this.jsonData.app_id, 
        project_map_id: this.jsonData.module_id,
        task: this.jsonData.task,
        dev_type_name: this.jsonData.dev_type,
        start_date: new Date(this.jsonData.start_date),
        end_date : new Date(this.jsonData.end_date),
        developer : this.jsonData.task_assignee[0].full_name,
        dependency_id: this.jsonData.dependency,
        dependencylist: this.jsonData.dependency,
        priority_type: this.jsonData.priority_type.id,
        // title: this.jsonData.title,
        developers : this.jsonData.task_assignee[0].id,
        id: this.jsonData.id,
        dev_type_names: this.jsonData.dev_type.id,
        type: this.jsonData.dev_type.id,
        actual_start_date:new Date(this.jsonData.actual_start_date),
        actual_end_date:new Date(this.jsonData.actual_end_date)
  
      })
  
      this.updateSelectedValues();
  
      this.StoryVals=this.localService.story_Id.value;

      this.start_date = new Date(this.jsonData.start_date)
      this.dev_type_name = this.jsonData.dev_type.text,
      this.end_date = new Date(this.jsonData.end_date)
  
      this.getModule( this.jsonData.client_name, this.jsonData.app_id, this.jsonData.module_id )
  

  
  this.getdevtype();
  this.getPriority();
    }
    }
    else{
      this.EmpTaskCreate.patchValue({
        
        task: this.jsonData.task,
        client : this.jsonData.client_name,
        project: this.jsonData.app_id, 
        project_map_id: this.jsonData.module_id,
        id: this.jsonData.id,

        priority_type:  this.jsonData.priority_type.id,  
      })
  
      this.getModule( this.jsonData.client_name, this.jsonData.app_id, this.jsonData.module_id )
  

  
  this.getdevtype();
  this.getPriority();
    }
    
  
}

  getdevtype() {
    this.SpinnerService.show()
    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.devTypeDD)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide() 
        let datas = results["data"];
        this.EmpTaskCreateObj.devtypelist = datas;
        if(this.EmpTaskCreateObj.devtypelist?.length > 0){
          // this.EmpTaskCreateObj.statusListData = this.EmpTaskCreateObj.devtypelist[0]?.id  
          this.EmpTaskCreateObj.toSelectDropDown = this.EmpTaskCreateObj.devtypelist?.find(c => c.id == 1);
          console.log("---------> data for dropdown", this.EmpTaskCreateObj.toSelectDropDown, this.EmpTaskCreateObj.devtypelist)
        }
        
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  deleteTask(index){ 
    let control = this.EmpTaskCreate.get("data") as FormArray;
    control.removeAt(index) 
  }

  ChangeDateFormat(index, key, date){
    // this.EmpTaskCreate.get('data')['controls'][index].get(key).setValue(this.datePipe.transform(date, 'yyyy-MM-dd'))

    this.EmpTaskCreate.get(key).setValue(this.datePipe.transform(date, 'yyyy-MM-dd'))
  }
  ChangeDateFormats(index, key, date){
    // this.EmpTaskCreate.get('data')['controls'][index].get('end_date').setValue(this.datePipe.transform(date, 'yyyy-MM-dd'))
  }

  getdevTypeId(index, data, key){
    console.log(index, data, key) 
    this.EmpTaskCreate.get(key).setValue(data.id)
    this.EmpTaskCreate.get('dev_type_name').setValue(data?.id)
    this.EmpTaskCreate.get('dev_type_names').setValue(data?.id)
    let multiple_data = ['Management', 'Planning', 'Meeting']
    // if (multiple_data.includes(data.text) == false){
    //   if(this.chipSelectedempid[index].length > 1)
    //     {
    //       this.EmpTaskCreate.get('data')['controls'][index].get("developer").setValue([this.chipSelectedempid[index][0]])
    //     this.chipSelectedemp[index] = [this.chipSelectedemp[index][0]]
    //     this.chipSelectedempid[index] = [this.chipSelectedempid[index][0]]
    //   }
    // }
    this.selectedDevType = data
   
  }

  dependencysearch(i) {
    let data = this.EmpTaskCreate.value

    let project_id=data?.project_map_id?.mapping_id ? data?.project_map_id?.mapping_id : data?.project_map_id?.id 
    if(project_id==undefined){
      project_id=""
    }
    let devkeyvalue: String = "";
    this.getdev(devkeyvalue);
    // (this.EmpTaskCreate.get('data') as FormArray).at(i).get('dependency_id').valueChanges
    this.EmpTaskCreate.get('dependency_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')
  
        }),
        switchMap(value => this.taskmanagerservice.dependencyedit(value,1,project_id,this.taskcode)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        
        let datas = results["data"];
        this.EmpTaskCreateObj.dependencylist = datas;
  
      })
  
  }

  getdev(keyvalue) {
    // this.SpinnerService.show();
    let data = this.EmpTaskCreate.value

    let project_id=data?.project_map_id?.mapping_id ? data?.project_map_id?.mapping_id : data?.project_map_id?.id 
    if(project_id==undefined){
      project_id=""
    }
    this.taskmanagerservice.dependencyedit(keyvalue, 1,project_id,this.taskcode)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.EmpTaskCreateObj.dependencylist = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    }

    getPriority() {
      this.SpinnerService.show()
      this.taskmanagerservice.get_Priority()
        .subscribe((results: any[]) => {
          this.SpinnerService.hide() 
          // let datas = results["data"];
          this.EmpTaskCreateObj.priorityList = results;
          console.log("priority dropdown",this.EmpTaskCreateObj.priorityList)
          
        }, (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }

    displayFnDep(clt?: dependency): string | undefined {
      return clt ? clt.task : undefined;
    }
    Submitassign(){
      this.SpinnerService.show();
    if (this.EmpTaskCreate.value.type === ""||this.EmpTaskCreate.value.type === null||this.EmpTaskCreate.value.type === undefined) {
      this.notify.error('choose type')
      this.SpinnerService.hide();
      return false;
    }
    if (this.EmpTaskCreate.get('start_date').value === ""||this.EmpTaskCreate.value.start_date === null||this.EmpTaskCreate.value.start_date === undefined ||this.EmpTaskCreate.value.start_date === 'Invalid Date' )  {
      this.notify.error('choose start date')
      this.SpinnerService.hide();
      return false;
    }
    if (this.EmpTaskCreate.value.start_date.invalid)
    {
      this.notify.error('choose start date')
      this.SpinnerService.hide();
      return false;
    }
    if (this.EmpTaskCreate.value.end_date === ""||this.EmpTaskCreate.value.end_date === null||this.EmpTaskCreate.value.end_date === undefined) {
      this.notify.error('choose End date')
      this.SpinnerService.hide();
      return false;
    }
    
    if (this.EmpTaskCreate.value.developer === ""||this.EmpTaskCreate.value.developer === null||this.EmpTaskCreate.value.developer === undefined) {
      this.notify.error('choose Employee')
      this.SpinnerService.hide();
      return false;
    }
    this.SubmitTask()
    }


    SubmitTask(){
      let data = this.EmpTaskCreate.value
      
      
      let dependency_id=this.EmpTaskCreate.get('dependency_id').value

      if(dependency_id){
        this.dependency_ids=dependency_id.id
      }
      else{
        this.dependency_ids=null
      }

      if(this.isEndDateValid == true)
      {

      }
      // data.data[0].story_id = this.stories_Id; 
      console.log("EMP Data", data)
      let actual_start_date = new Date(data.actual_start_date);

        let acstarttday = actual_start_date.getDate().toString().padStart(2, '0');
        let actstartmonth = (actual_start_date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1.
        let actstartyear = actual_start_date.getFullYear();

        // let formattedStartDate = `${day}-${month}-${year}`;
        let formattedactualStartDate = `${actstartyear}-${actstartmonth}-${acstarttday}`;
        if( this.actualstartdate ===''){
          formattedactualStartDate=null
        }
        else{
          formattedactualStartDate
        }
        if(data.start_date === '' || data.start_date === null || data.start_date === undefined)
        {
          this.notify.error("Please select Planned Start Date");
          return false;
        }
        if(data.end_date === '' || data.end_date === null || data.end_date === undefined)
        {
          this.notify.error("Please select Planned End Date");
          return false;
        }
            
      let startDate = new Date(data.start_date);

        let day = startDate.getDate().toString().padStart(2, '0');
        let month = (startDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1.
        let year = startDate.getFullYear();

        // let formattedStartDate = `${day}-${month}-${year}`;
        let formattedStartDate = `${year}-${month}-${day}`;

        let endDate = new Date(data.end_date);

        let days = endDate.getDate().toString().padStart(2, '0');
        let months = (endDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1.
        let years = endDate.getFullYear();

        // let formattedStartDates = `${days}-${months}-${years}`;
        let formattedendDates = `${years}-${months}-${days}`;

        let actual_end_date = new Date(data.actual_end_date);

        let actenddays = actual_end_date.getDate().toString().padStart(2, '0');
        let actendmonths = (actual_end_date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1.
        let actendyears = actual_end_date.getFullYear();

        // let formattedStartDates = `${days}-${months}-${years}`;
        let formattedactualendDates = `${actendyears}-${actendmonths}-${actenddays}`;
      
        if( this.actualenddate ===''){
          formattedactualendDates=null
        }
        else{
          formattedactualendDates
        }

let payload = {
  "type": data.type,
  "start_date": formattedStartDate,
  "end_date": formattedendDates,
  // "developer": [data.developers],
  "task": data.task,
  "dependency_id": this.dependency_ids,
  "priority_type": data.priority_type,
  // "title": data.title,
  "id": data.id,
  "story_id" : this.StoryVals,
  "actual_start_date":formattedactualStartDate,
  "actual_end_date":formattedactualendDates,
  "remarks": data?.remarks
};
if (this.unassigned==="Unassigned"){
  payload["developer"]=[this.EmpTaskCreate.get('developer').value.id]
}


      // data = [...data,{story_id: this.stories_Id}]
      // data.push({story_id: this.stories_Id})
      // let payload = {
      //   "type": data.dev_type_name.id,
      //   "start_date":data.start_date,
      //   "end_date": data.end_date,
      //   "developer": [data.developers],
      //   "task": data.task,
      //   "dependency_id": data.dependency_id.id,
      //   "priority_type":data.priority_type,
      //   "title": data.title,
      //   "id": data.id

      // }
      let modulemappingid=this.EmpTaskCreate.get('project_map_id').value
      this.modulemapid =modulemappingid.mapping_id
      if(this.modulemapid){
        this.projectmap=this.modulemapid
      }
      else{
        this.projectmap =this.jsonData.mapping_id
      }
      
      console.log("opayload", payload)
      let obj = {
        project_id: this.projectmap , 
        data: [payload]
        // story_id: this.stories_Id
        
        
      }
      if (this.unassigned=="Unassigned"){
        obj["action"]='assign'
      }
      this.EmpTaskCreateObj.submitValidation = true 
      this.SpinnerService.show()
      this.taskmanagerservice.storyBasedTaskCreation(obj)
      .subscribe(results=>{
        if(results.code)
        {
          this.SpinnerService.hide()

          this.notify.error(results.description)
        }
        else{
          this.SpinnerService.hide()
          this.notify.success(results.message)
          this.OnSubmit.emit() 
          return true 
        }
      }) 
  
    }
  
    BackToSummary(){
      this.OnSubmit.emit()
  
    }

    // getModule(clientdata, projectdata, Typedata) {
    //   if(clientdata?.id == undefined || projectdata?.id == undefined){
    //     return false 
    //   }
    //   this.apicall.ApiCall('get', this.taskapi.tasksApi.api.moduleSearch+projectdata?.id +'?'+ 'client_id='+clientdata?.id +'&' +  this.taskapi.tasksApi.queries.query +
    //    Typedata + '&' + this.taskapi.tasksApi.queries.status + 2 )
    //     .subscribe(results => {
    //       this.EmpTaskCreateObj.moduleList = results['data']
    //       console.log("Module Data", this.EmpTaskCreateObj.moduleList)
    //     }, (error) => {
    //       this.errorHandler.handleError(error);
    //       this.SpinnerService.hide();
    //     })
    // }

    updateSelectedValues() {
      let vals = this.EmpTaskCreate.get('dev_type_name').value;
      this.selectedDevTypeName = vals.text
      this.selectedStartDate = this.EmpTaskCreate.get('start_date').value;
      this.selectedEndDate = this.EmpTaskCreate.get('end_date').value;
    }

    

  clientsearch(Typedata) {

    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.clientsearch +
      this.taskapi.tasksApi.queries.query + Typedata + '&' +
      this.taskapi.tasksApi.queries.status + 2)

      .subscribe(results => {
        this.EmpTaskCreateObj.clientList = results['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  displayFnclt(clt?: interfacedatas): string | undefined {
    return clt ? clt.name : undefined;
  }


  Projectsearch(clientdata, Typedata) {
    if(clientdata?.id == undefined){
      return false 
    }
    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.projectSearch+'/'+clientdata?.id+'?'+ this.taskapi.tasksApi.queries.query + Typedata +
     '&' + this.taskapi.tasksApi.queries.status + 2) 
      .subscribe(results => {
        this.EmpTaskCreateObj.projectList = results['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  displayFnappnm(appnm?: interfacedatas): string | undefined {
    return appnm ? appnm.name : undefined;
  }




  getModule(clientdata, projectdata, Typedata) {
    if(clientdata?.id == undefined || projectdata?.id == undefined){
      return false 
    }
    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.moduleSearch+projectdata?.id +'?'+ 'client_id='+clientdata?.id +'&' +  this.taskapi.tasksApi.queries.query +
     Typedata + '&' + this.taskapi.tasksApi.queries.status + 2 )
      .subscribe(results => {
        this.EmpTaskCreateObj.moduleList = results['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  displayFnmodnm(mod?: interfacedatas): string | undefined {
    return mod ? mod.name : undefined;
  }

    
  public empSelected(data,i,event: MatAutocompleteSelectedEvent): void {
    console.log('event.option.value', event.option.value)
    this.selectempByName(data,i,event.option.value);
    this.empInput.nativeElement.value = '';
    // console.log('chipSelectedempid', this.chipSelectedempid)
  }
//   getemp(keyvalue) {
//     // let type = 2 // employee
//     console.log("emp fun called")
//     let data = this.EmpTaskCreate.value;
//     let projectId = data?.project_map_id?.mapping_id ? data?.project_map_id?.mapping_id : data?.project_map_id?.id
//     if(projectId !== undefined && projectId !== null && projectId !=='')
//     {
//       this.taskmanagerservice.task_employeesearch_createproj(keyvalue, 1, projectId)
//       .subscribe((results: any[]) => {
//         this.SpinnerService.hide();
//         let datas = results["data"];
//         this.empList = datas;
//         console.log("emp data get ", this.empList)
//       }, (error) => {
//         this.errorHandler.handleError(error);
//         this.SpinnerService.hide();
//       })
    
//     }
//  else
//  {
    
//     // this.SpinnerService.show();
//     this.taskmanagerservice.task_employeesearch_create(keyvalue, 1)
//       .subscribe((results: any[]) => {
//         this.SpinnerService.hide();
//         let datas = results["data"];
//         this.empList = datas;
//         console.log("emp data get ", this.empList)
//       }, (error) => {
//         this.errorHandler.handleError(error);
//         this.SpinnerService.hide();
//       })
//     }
//   }
  developer(i){
    let data = this.EmpTaskCreate.value;
    this. projectId =  data?.project?.id
    if(this. projectId !== undefined && this. projectId !== null && this. projectId !== '')
    {
      // let devkeyvalue: String = "";
      // this.getemp(devkeyvalue);
      (this.EmpTaskCreate.get('developer')).valueChanges
      // this.taskAddForm.get('developer').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.taskmanagerservice.task_employeesearch_createproj(value,1, this. projectId)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          
          let datas = results["data"];
          this.empList = datas;
          // this.EmpTaskCreateObj.devtypelist = this.empList;
          // console.log("this.EmpTaskCreateObj.devtypelist",this.EmpTaskCreateObj.devtypelist)
          // this.EmpTaskCreate.get('data')['controls'][i].get("emp_id").setValue(this.chipSelectedempid[i])
  
        })
  
    }
    else
    {

    // let devkeyvalue: String = "";
    //   this.getemp(devkeyvalue);
      // (this.EmpTaskCreate.get('data') as FormArray).at(i).get('developer').valueChanges
      this.taskAddForm.get('developer').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.taskmanagerservice.task_employeesearch(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          
          let datas = results["data"];
          this.empList = datas;
          // this.EmpTaskCreateObj.devtypelist = this.empList;
          // console.log("this.EmpTaskCreateObj.devtypelist",this.EmpTaskCreateObj.devtypelist)
          // this.EmpTaskCreate.get('data')['controls'][i].get("emp_id").setValue(this.chipSelectedempid[i])
  
        })
      }

  }
  getDeveloperdrop() {
    this.taskmanagerservice.getdeveloper('').subscribe(res=>{
      this.develop = res['data']
    })
  }

  developerClick(){
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.EmpTaskCreate.get('developer').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')
  
        }),
        switchMap(value => this.taskmanagerservice.getdeveloper(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.develop = datas;
  
  
  
  
      })
  
  }
  public displaydevelopclient(clt?: developclient): string | undefined {
    // console.log(`Client testing data - ${clt.name}`);
    return clt ? clt.name : undefined;
  }
  // isFieldReadOnly(fieldName: string){
  //   if (this.taskstatus === 0) {
  //     fieldName === 'client' || fieldName === 'project'|| fieldName==='project_map_id' ||fieldName==='developer';
      
  //   }if (this.taskstatus === 1) {
  //     fieldName === 'client' || fieldName === 'project'|| fieldName==='project_map_id' ||fieldName==='developer' || fieldName==='end_date'||fieldName==='priority_type';
    
  //   }
  //   if (this.taskstatus === 2) {
  //     fieldName === 'client' || fieldName === 'project'|| fieldName==='project_map_id' ||fieldName==='developer';
    
  //   }
    
  // }
  resetdataclient(){
    this.EmpTaskCreate.get('project').setValue('')
    this.EmpTaskCreate.get('project_map_id').setValue('')
  }
  // resetproject(){
  //   this.EmpTaskCreate.get('client').setValue('')
  //   this.EmpTaskCreate.get('project_map_id').setValue('')
  // }
  resetmodule(){
    
    this.EmpTaskCreate.get('project_map_id').setValue('')
  }

  checkEndDateValidity() {
    const actualEndDate = new Date(this.actualenddate);
    const taskEndDate = this.EmpTaskCreate.value.actual_end_date;
  
    if (actualEndDate < taskEndDate) {
      this.isEndDateValid = true;
    } else {
      this.isEndDateValid = false;
    }
  }

}
