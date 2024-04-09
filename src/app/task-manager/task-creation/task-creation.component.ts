import { Component, EventEmitter, Input, OnInit, Output, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';


import { Overlay, OverlayPositionBuilder } from '@angular/cdk/overlay';
// import { ComponentPortal } from '@angular/cdk/portal';
import * as imp from '../../AppAutoEngine/import-services/CommonimportFiles'
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';

import { ApicallserviceService } from 'src/app/AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, tap, filter,startWith, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
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
import { MatSelectTrigger } from '@angular/material/select';
// import { MatDialog } from '@angular/material/dialog';
import { DevTypeDialogComponent } from '../dev-type-dialog/dev-type-dialog.component';
import { ShareddataService } from '../shareddata.service';
import { data } from 'jquery';
import { NotificationService } from 'src/app/service/notification.service';



export interface emplistss {
  id: string;
  name: any
}
@Component({
  selector: 'app-task-creation',
  templateUrl: './task-creation.component.html',
  styleUrls: ['./task-creation.component.scss'],
  providers: [imp.TaskApi]

})


export class TaskCreationComponent implements OnInit {
  [x: string]: any;


  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private shareService: imp.SharedService,
    private apicall: ApicallserviceService, private taskapi: imp.TaskApi, private taskmanagerservice: TaskManagerService, private sharedservice:SharedService,
    private dialog: MatDialog, private overlay: Overlay, private overlayPositionBuilder: OverlayPositionBuilder, private sharedDataService: ShareddataService,private Notification:NotificationService
  ) { }
  @Output() OnSubmit = new EventEmitter<any>();
  @Output() OnCancel = new EventEmitter<any>();

  EmpTaskCreate: FormGroup;
  dataIndex: FormGroup

  // empList: emplistss[];
  empList: Array<developer>;
  // public chipSelectedemp: emplistss[] = [];
  public chipSelectedemp = [];

  array = [];
  public chipSelectedempid = [];
   readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('emp') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('empInput') commodityInput: any;
  @ViewChild('datepickerInput') datepickerInput: any;
  @ViewChild('datepickerInputs') datepickerInputs: any;
  @ViewChild(MatDatepicker) picker: MatDatepicker<Moment>;
  @ViewChild(MatDatepicker) picker1: MatDatepicker<Moment>;
  @ViewChild(MatDatepicker) picker2: MatDatepicker<Moment>;


  
  // @ViewChild('employee') matcommodityAutocomplete: MatAutocomplete;
  // @ViewChild('inputemployeeid') commodityInput: any;
  stories_Id:any; 
  icon : any ;
  icons : any = null;
  currentpagecom:number=1
  selectedDate: Moment;
  selectedDates : Moment;
  fastag:string='fa-solid fa-tag'
  squarecheck:string='fa-check-square-o'
  new_icon:string='fa-user-plus'
  dependiciestip:string=""
  fastagename:string=""
  taskstartdate:string=""
  taskenddate:string=""
  devtypearr:any
  employe_name:string=""
  dates: string = null;
  has_nextcom:boolean=false
  has_previouscom:boolean=false
  datest: string = null;
  @ViewChild('devTypeSelect') devTypeSelect: MatSelect;
  @ViewChildren(MatSelect) matSelects: QueryList<MatSelect>;
  @ViewChild('iconElement') iconElement: ElementRef;
  isShowType: boolean = false;
  selectedDevType: string; 
  @ViewChild('startsDate') startsDate : ElementRef;  
  @ViewChild('depInput') depInput : MatSelect;
  devTypeSelectOpenState: boolean[] = [];
  // @ViewChild('devTypeSelect') devTypeSelect: MatSelect;
  @ViewChild(MatSelectTrigger) selectTrigger: MatSelectTrigger;
  searchTerm: string = '';
  items: string[] ;
  filteredResults: string[];
  sprstartdate : any = '';
  sprenddate : any = '';
  actualStarts : any = '';
  storyName: any = '';
  sprintName: any = '';
  selectedMappingId: any;
  borderColor: string = '';
  borderColors: string = '';
  borderstart: string = '';
  borderend: string = '';
  borderdev: string = '';
  currentDate: any = '';
  quickviewlist:any
  clientname:any
  modulename:any
  projectname:any
  projectId:any

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

    this.sprstartdate = this.datePipe.transform(this.sharedDataService?.sprintfromdate?.value, 'yyyy-MM-dd') 
    this.sprenddate = this.datePipe.transform(this.sharedDataService?.sprinttodate?.value, 'yyyy-MM-dd') 
    this.storyName = this.sharedDataService?.storyName.value;
    this.sprintName = this.sharedDataService?.sprintName.value;
    this.clientname=this.sharedDataService?.clientname.value
    console.log( "clientname=",this.clientname)
    this.modulename=this.sharedDataService?.modulename.value
    console.log( "clientname=",this.modulename)
    this.projectname=this.sharedDataService?.projectname.value
    console.log( "clientname=",this.projectname)
    


    
if(this.sprstartdate == null || this.sprstartdate == '' ||this.sprstartdate == undefined){
  // this.sprstartdate= this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
}
else{
  this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
}

if(this.sprenddate == null || this.sprenddate == '' || this.sprenddate == undefined){
}
else{
  this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
}


    this.EmpTaskCreate = this.fb.group({
      client: [''],
      project: [''], 
      project_map_id:[''],
      // task: '',
      
      data: new FormArray([
         
      ])

     
    })

    this.dataIndex = this.fb.group({
      task: '',
      type: '',
      developer: '' ,
      dependency_id: '',
      priority_type: '',
      
      
      

    })
    let key: any = ""
    this.getlatestTasks() 
    this.getdevtype() 
    this.getPriority()
    // this.getemp(key);
    this.AddTask()
    let id =this.sharedDataService.story_Id.value;
    console.log("story id",id)
    if (id==0){
      this.stories_Id = "";
    }
    else{
      this.stories_Id =id
    }
    

    this.sharedDataService.setDevTypeList(this.EmpTaskCreateObj.devtypelist);

    
  }
  popclose() {
   
    this.OnSubmit.emit()
  }

  // popclose(){
  //  let startdate=this.sprstartdate || this.datePipe.transform(new Date(), 'yyyy-MM-dd')
  //  let enddate=this.sprenddate || this.datePipe.transform(new Date(), 'yyyy-MM-dd')
  //   this.EmpTaskCreate.reset()
  //   this.FormGroupArray.patchValue({
  //     "start_date":startdate,
  //      "end_date":enddate
  //   })
 
  // }


  // story_TaskViewData:any;
  // getTaskEdit(task_ID) {

  //   this.taskmanagerservice.getStories_taskView(task_ID)
  //   .subscribe(result => {
  //     this.SpinnerService.hide();
  //     console.log("story task View", result)
  //     this.story_TaskViewData = result;

     

  //     this.ScheduleLeasedForm.patchValue({
  //       term_number: data.term_number,
  //       start_date: data.start_date,
  //       end_date: data.end_date,
  //       term_period: this.termPeriod,
  //       rent_amount: data.rent_amount,
  //       amenties_amount: data.amenties_amount,
  //       maintenance_amount: data.maintenance_amount,
  //       rent_increment: data.rent_increment,
  //       amenties_increment: data.amenties_increment,
  //       maintenance_increment: data.maintenance_increment,
  //       recurring_frequency: data?.recurring_frequency.id,
  //       recurring_date: data.recurring_date,
  //       remarks: data.remarks,
  //       edit_flag: data.edit_flag,
  //       renttype: data?.renttype.id,
  //     });



  //   }, (error) => {
  //     this.errorHandler.handleError(error);
  //     this.SpinnerService.hide();
  //   }
    
  //   )
   
  // }



  getlatestTasks() {
    this.apicall.ApiCall("get", this.taskapi.tasksApi.api.QuickAccessProjects)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.EmpTaskCreateObj.QuickAccessList = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  SelectedLink(data) {
    this.EmpTaskCreateObj.selectedNav = data?.id
    console.log(data, this.EmpTaskCreateObj.selectedNav)
    let moduledata = {
      name: data?.module?.name,
      id: data?.id 
    }
    this.EmpTaskCreate.patchValue({
      client: data.client,
      project: data?.project,
      project_map_id: moduledata  }) 
      
  }

  // data?.client?.name}} >> {{data?.module?.name}} >> {{data?.project?.name}} 


  clearTags() {
    this.EmpTaskCreateObj.selectedNav = '';

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


  getdevtype() {
    this.SpinnerService.show()
    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.devTypeDD)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide() 
        let datas = results["data"];
        this.devtypearr=datas
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



  get dataForTask(): FormGroup {
    // this.array = [];
    // this.chipSelectedemp=[];
    // this.chipSelectedempid=[];
    let FormGroupArray = this.fb.group({
      // start_date: [this.sprstartdate || this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      // end_date:  [this.sprenddate || this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required], 
      start_date:'',
      end_date:'',
      dev_type_name: this.EmpTaskCreateObj?.toSelectDropDown,
      type: '',
      task: '',
      dependency_id:'',
      priority_type:1,
      // title:'',
      // devtype: '',
      developer:'',
      priority_type_color:'#ffcc00',
    })
    
    return FormGroupArray
  }

  AddTask(){
    let control = this.EmpTaskCreate.get("data") as FormArray;
    control.push(this.dataForTask)
  }
  deleteTask(index){ 
    let control = this.EmpTaskCreate.get("data") as FormArray;
    control.removeAt(index) 
  }

  ChangeDateFormat(index, key, date,e){
    this.EmpTaskCreate.get('data')['controls'][index].get(key).setValue(this.datePipe.transform(date, 'yyyy-MM-dd'))
    // this.taskstartdate="Start date :"+new Date(this.datepipe.transform(e.value,'yyyy-MM-dd'));
    this.actualStarts = (this.datePipe.transform(date, 'yyyy-MM-dd'))
    this.borderstart = '#5c52ed'

  }
  ChangeDateFormats(index, key, date,e){
    this.EmpTaskCreate.get('data')['controls'][index].get('end_date').setValue(this.datePipe.transform(date, 'yyyy-MM-dd'))
  
    this.taskenddate="End date :"+this.datepipe.transform(e, 'yyyy-MM-dd')
  }
  startdateclick(date){
    this.taskstartdate="Start date :"+this.datepipe.transform(date,'yyyy-MM-dd')

  }
  startendclick(date){
    this.taskenddate="End date :"+this.datepipe.transform(date, 'yyyy-MM-dd')

  }

  getdevTypeId(index, data, key){
    console.log(index, data, key) 
    this.EmpTaskCreate.get('data')['controls'][index].get(key).setValue(data?.id)
    this.EmpTaskCreate.get('data')['controls'][index].get('type').setValue(data?.id)
    let multiple_data = ['Management', 'Planning', 'Meeting']
    // if (multiple_data.includes(data.text) == false){
      // if(this.chipSelectedempid[index].length > 1)
      //   {
      //     this.EmpTaskCreate.get('data')['controls'][index].get("developer").setValue([this.chipSelectedempid[index][0]])
      //   this.chipSelectedemp[index] = [this.chipSelectedemp[index][0]]
      //   this.chipSelectedempid[index] = [this.chipSelectedempid[index][0]]
      // }
    // }
    // this.selectedDevType = data
    // this.yourForm.get('dev_type_name').setValue(devtype.text);
    // this.EmpTaskCreate.get('data')['controls'][index].get("dev_type_name").setValue(data)
    this.fastag='fa-solid fa-tags'
    this.fastagename=data.text
    this.borderColor = '#5c52ed';
  }

  SubmitTask(){
    let data = this.EmpTaskCreate.value

    data.data[0].story_id = this.stories_Id; 

    console.log("EMP Data", data)
    // data = [...data,{story_id: this.stories_Id}]
    // data.push({story_id: this.stories_Id})
    if(data?.project_map_id?.id == null || data?.project_map_id?.id == '' ||data?.project_map_id?.id == undefined){
      this.notify.warning("Module Not Selected")
      return false; 
    }
    if(data.data[0].task == null || data.data[0].task == '' || data.data[0].task ==  undefined)
    {
      this.notify.warning("Please Enter the Task Name")
      return false; 
    }
    if(data.data[0].type == null || data.data[0].type == '' || data.data[0].type ==  undefined)
    {
      this.notify.warning("Please Select the Type")
      return false; 
    }
    // if(data.data[0].developer == null || data.data[0].developer == '' || data.data[0].developer ==  undefined)
    // {
    //   this.notify.warning("Please Select Task Assignee")
    //   return false; 
    // }
    if(this.stories_Id !== '')
    {
      if(data.data[0].start_date == null || data.data[0].start_date == '' || data.data[0].start_date ==  undefined)
      {
        this.notify.warning("Please Select the Start Date")
        return false; 
      }
      if(data.data[0].end_date == null || data.data[0].end_date == '' || data.data[0].end_date ==  undefined)
      {
        this.notify.warning("Please Select the End Date")
        return false; 
      }
    }
    if(data.data[0].priority_type == null || data.data[0].priority_type == '' || data.data[0].priority_type ==  undefined)
    {
      this.notify.warning("Please Select Task Priority")
      return false; 
    }
    if(data?.data?.length == 0){
      this.notify.warning("Please Fill Atleast One Task")
      return false; 
    }
    let details =this.EmpTaskCreate.value.data
    for (let i in details) {
      details[i].dependency_id = details[i].dependency_id;
     }
     if(this.EmpTaskCreate.value.data[0].developer.id){
      this.datas={
        "start_date": this.EmpTaskCreate.value.data[0].start_date,     
        "end_date": this.EmpTaskCreate.value.data[0].end_date,     
        "dev_type_name": this.EmpTaskCreate.value.data[0].type.id,
        "type": this.EmpTaskCreate.value.data[0].type.id,
        "task": this.EmpTaskCreate.value.data[0].task,
        "dependency_id": this.EmpTaskCreate.value.data[0]?.dependency_id?.id,
        "priority_type": this.EmpTaskCreate.value.data[0].priority_type,
        "developer": [
          this.EmpTaskCreate.value.data[0].developer.id
        ],
        "priority_type_color": "#FFCC00",
        "story_id":  this.stories_Id
      }
     }
     else{
      this.datas={
        "start_date": this.EmpTaskCreate.value.data[0].start_date,     
        "end_date": this.EmpTaskCreate.value.data[0].end_date,     
        "dev_type_name": this.EmpTaskCreate.value.data[0].type.id,
        "type": this.EmpTaskCreate.value.data[0].type.id,
        "task": this.EmpTaskCreate.value.data[0].task,
        "dependency_id": this.EmpTaskCreate.value.data[0]?.dependency_id?.id,
        "priority_type": this.EmpTaskCreate.value.data[0].priority_type,
       
        "priority_type_color": "#FFCC00",
        "story_id":  this.stories_Id
      }
     }
  
    console.log('datas', this.datas)
    let obj = {
      project_id: data?.project_map_id?.mapping_id ? data?.project_map_id?.mapping_id : data?.project_map_id?.id , 
      data: [this.datas]
      // story_id: this.stories_Id
      
      
    }
    this.EmpTaskCreateObj.submitValidation = true 
    this.SpinnerService.show()
    this.taskmanagerservice.storyBasedTaskCreation(obj)
    .subscribe(results=>{
      if(results.code){
    this.SpinnerService.hide()
      this.notify.error(results.description)
      this.EmpTaskCreate.get('client').reset()
      this.EmpTaskCreate.get('project').reset()
        this.EmpTaskCreate.get('project_map_id').reset()
        this.dataIndex.get('task').reset()
        this.dataIndex.get('type').reset()
        this.dataIndex.get('developer').reset()
        this.dataIndex.get('dependency_id').reset()
        this.dataIndex.get('priority_type').reset()
        this.dataIndex.get('priority_type').reset()
      this.fastag='fa-solid fa-tag'
      this.squarecheck='fa-check-square-o'
      this.new_icon='fa-user-plus'
      this.EmpTaskCreateObj.submitValidation = false 
      this.EmpTaskCreate.reset()
      // this.EmpTaskCreate.reset()
      this.OnSubmit.emit() 
      return true
    }
      else{
        this.SpinnerService.hide()
        this.EmpTaskCreate.get('client').reset()
        this.EmpTaskCreate.get('project').reset()
        this.EmpTaskCreate.get('project_map_id').reset()
        this.dataIndex.get('task').reset()
        this.dataIndex.get('type').reset()
        this.dataIndex.get('developer').reset()
        this.dataIndex.get('dependency_id').reset()
        this.dataIndex.get('priority_type').reset()
        this.dataIndex.get('priority_type').reset()
        let datas = this.dataIndex.get('task') as FormArray
        // datas.clear()
    
      this.fastag='fa-solid fa-tag'
      this.notify.success(results.message)
      this.squarecheck='fa-check-square-o'
      this.new_icon='fa-user-plus'
      this.EmpTaskCreate.get('data')['controls'][0].get('priority_type').setValue(1)
      this.EmpTaskCreate.get('data')['controls'][0].get('priority_type_color').setValue('#ffcc00')
      this.borderColor = '';
      this.borderColors = '';
      this.borderstart = '';
      this.borderend = '';
      this.borderdev = '';
      this.EmpTaskCreate.reset()
      this.OnSubmit.emit() 
      return true 
      
      }

    },
    error=>{
      this.SpinnerService.hide()
    }) 
  

  }

  BackToSummary(){
    this.OnCancel.emit()

  }


  resetProjectAndModule(){
    this.EmpTaskCreate.controls['project'].reset()
    this.EmpTaskCreate.controls['project_map_id'].reset()
    this.empList=[]
    this.EmpTaskCreateObj.projectList=[]
  }
  resetModule(){
    this.EmpTaskCreate.controls['project_map_id'].reset()
    this.empList=[]
    this.EmpTaskCreateObj.projectList=[]

  }




  public removedemp(i, emp: emplistss) {
    const index = this.chipSelectedemp[i].indexOf(emp);
    // if (this.isEdit == true) {
    //   return false
    // }

    if (index >= 0) {

      this.chipSelectedemp[i].splice(index, 1);
      console.log(this.chipSelectedemp[i]);
      this.chipSelectedempid[i].splice(index, 1);
      console.log(this.chipSelectedempid[i]);
      this.empInput.nativeElement.value = '';
    }

  }


  public empSelected(event: MatAutocompleteSelectedEvent): void {
    console.log('event.option.value', event.option.value)
    this.selectempByName(event.option.value);
    // this.empInput.nativeElement.value = '';
    // console.log('chipSelectedempid', this.chipSelectedempid)
  }
  private selectempByName(emp) {
    let multiple_data = ['Management', 'Planning', 'Meeting']
      if (this.chipSelectedemp.length >= (0)){
       
        this.chipSelectedemp.push(emp);
        this.chipSelectedempid.push(emp?.id);
        
      } 
      else{
        this.chipSelectedemp = [emp];
        this.chipSelectedempid = [emp?.id]
      }
    

      
      console.log("iddddd", this.chipSelectedempid)
      // this.EmpTaskCreate.get('data')['controls'].setValue(this.chipSelectedempid)
  }

  // getselectedfocusout(index){
  //         this.EmpTaskCreate.get('data')['controls'][index].get("emp_id").setValue(this.chipSelectedempid)

  // }



  isLoading = false;
  dropdown(value){
    this.projectId = this.EmpTaskCreate.get('project').value?.id;
    if(this.projectId !== undefined && this.projectId !== null && this.projectId !== ''){
      this.taskmanagerservice.task_employeesearch_createproj(value,1, this.projectId).subscribe(data=>{
        this.empList=data['data']
      })
    }
    else if(this.projectId===undefined || this.projectId===null || this.projectId===''){
      this.Notification.showWarning('Module Not Selected')
    }

  }
  // // developer name
  develops(i){
    
    this.projectId = this.EmpTaskCreate.get('project').value?.id;
    console.log("projectId",this.projectId)
    if(this.projectId !== undefined && this.projectId !== null && this.projectId !== '')
    {
      // let devkeyvalue: String = "";
      // this.getemp(devkeyvalue);
      (this.EmpTaskCreate.get('data') as FormArray).at(i).get('developer').valueChanges
      // this.taskAddForm.get('developer').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
          }),
          switchMap(value => this.taskmanagerservice.task_employeesearch_createproj(value,1, this.projectId)
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
      (this.EmpTaskCreate.get('data') as FormArray).at(i).get('developer').valueChanges
      // this.taskAddForm.get('developer').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.taskmanagerservice.task_employeesearch_create(value,1)
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
selectemployee(index,dep){
  this.EmpTaskCreate.get('data')['controls'][index].get("developer").setValue([dep.id])
  // this.new_icon="fa-solid fa-"+dep.name[0]
  this.new_icon="fa-solid fa-user-check"
  this.employe_name=dep.name
  console.log("this.new_icon",this.new_icon)
  this.borderColors = '#5c52ed'


}
selectdependencies(dataIndex,dep){
  this.EmpTaskCreate.get('data')['controls'][dataIndex].get("dependency_id").setValue(dep.id)
  this.squarecheck='fa-square-check'
  this.dependiciestip=dep.task
  this.borderdev = '#5c52ed'
}
selectdependecies
  public displayFndev(emp?: developer): string | undefined {
    return emp ? emp.name : undefined;
  }
  getempData(e){
    
    this.employee_id=e
  
  }
  employeeautocomplete() {
    setTimeout(() => {
      if (
        this.matcommodityAutocomplete &&
        this.autocompletetrigger &&
        this.matcommodityAutocomplete.panel
      ) {
        fromEvent(this.matcommodityAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcommodityAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcommodityAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcommodityAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcommodityAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom === true) {
                this.taskmanagerservice.task_employeesearch(this.commodityInput.nativeElement.value, this.currentpagecom + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.empList = this.empList.concat(datas);
                    if (this.empList.length >= 0) {
                      this.has_nextcom = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom = datapagination.index;
                    }
                  },(error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }
  

  // get emp() {
  //   return this.taskAddForm.value.get('developer');
  // }



  // priority dropdown
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

  getprioritytype(index, data, key){
    console.log("selected prioritys",index, data) 
    this.EmpTaskCreate.get('data')['controls'][index].get(key).setValue(data)
    this.selectedPriority = data;
    let color =""
    if (this.selectedPriority === 1) {
      color= '#ffcc00'; // Normal
    } else if (this.selectedPriority === 2) {
      color='red'; // High
    } else if (this.selectedPriority === 3) {
      color= '#6fddff'; // Low
    }
    this.EmpTaskCreate.get('data')['controls'][index].get('priority_type_color').setValue(color)

  }

  chipList=[];
  addSection(i){
    // this.chipList=[];
    this.chipList.push(this.EmpTaskCreate.get('data')['controls'][i].get('developer').value)
    console.log("add",this.chipList)

  }






// dependency
dependencysearch(i) {
  let data = this.EmpTaskCreate.value
let project_id=data?.project_map_id?.mapping_id ? data?.project_map_id?.mapping_id : data?.project_map_id?.id 

if(project_id==undefined){
  project_id=""
}
  let devkeyvalue: String = "";
  this.getdev(devkeyvalue);
  (this.EmpTaskCreate.get('data') as FormArray).at(i).get('dependency_id').valueChanges
  // this.taskAddForm.get('developer').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.taskmanagerservice.dependencytype(value,1,project_id)
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
this.taskmanagerservice.dependencytype(keyvalue, 1,project_id)
  .subscribe((results: any[]) => {
    this.SpinnerService.hide();
    let datas = results["data"];
    this.EmpTaskCreateObj.dependencylist = datas;
  }, (error) => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
}

  displayFnDep(clt?: dependency): string | undefined {
    return clt ? clt.task : undefined;
  }
  openIconDialog(icon: string) {
    const dialogRef = this.dialog.open(IconDialogComponent, {
      data: { icon },
    });
  
    dialogRef.afterClosed().subscribe((selectedOption: string) => {
      if (selectedOption) {
        // Handle the selected option
        this.icons = selectedOption;
      }
    });
  }
  onDateSelected(event: MatDatepickerInputEvent<Moment>) {
    if (event.value) {
      this.selectedDate = moment(event.value);
      this.dates = this.selectedDate.format('MMM DD');
    }
  }
  openDatepicker(datepickerInput: any) {
    if (this.datepickerInput && this.picker) {
      this.picker.open();
    }
  }
  onDateSelecteds(event: MatDatepickerInputEvent<Moment>) {
    if (event.value) {
      this.selectedDates = moment(event.value);
      this.datest = this.selectedDates.format('MMM DD');
    }
  }
  openDatepickers(datepickerInputs: any) {
    if (this.datepickerInputs && this.picker1) {
      this.picker1.open();
    }
  }
 
  // openDevTypeSelect() {
  //   this.devTypeSelect.open();
  //   this.isShowType = true;
    // const iconElement = this.iconElement.nativeElement;

    // if (iconElement && this.matSelect) {
    //   const positionStrategy = this.overlayPositionBuilder
    //     .flexibleConnectedTo(iconElement)
    //     .withPositions([
    //       { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    //     ]);

    //   const overlayRef = this.overlay.create({
    //     positionStrategy,
    //     hasBackdrop: true,
    //     backdropClass: 'cdk-overlay-transparent-backdrop', // You can define this class in your CSS
    //   });

    //   this.matSelect.open();
    //   overlayRef.attach(this.matSelect._getOverlayRef());
    // }
  // }payrollserv/paystatus_dropdown
  setSelectedDevType(devTypeName: string) {
    // this.selectedDevType = devTypeName;
  }
  opencalendar()
  {
    this.picker1.open();
  }
  opencalendars()
  {
    this.picker2.open();
  }
  opendependency()
  {
    this.depInput.open();
  }
  openDevTypeSelect(index: number) {
    // Function to open the mat-select for the clicked "fa-tags" icon
    const devTypeSelect = this.devTypeSelectList.toArray()[index];
    
    if (devTypeSelect) {
      devTypeSelect.open();
      
      // Position the select panel below the icon
      const iconElement = (event.target as HTMLElement);
      const iconRect = iconElement.getBoundingClientRect();
      devTypeSelect.panelClass = 'below-icon';
      devTypeSelect.panel.nativeElement.style.left = iconRect.left + 'px';
      devTypeSelect.panel.nativeElement.style.top = iconRect.bottom + 'px';
    }
  }

  isDevTypeSelectOpen(index: number) {
    // Function to check if the mat-select should be open for the given row
    return this.devTypeSelectOpenState[index] === true;
  }
  // openDevTypeDialog() {
  //   const dialogRef = this.dialog.open(DevTypeDialogComponent, {
  //     data: { devTypeList: this.EmpTaskCreateObj.devtypelist },
      
  //   });
  //   console.log("LISTED", this.EmpTaskCreateObj.devtypelist)

  //   dialogRef.afterClosed().subscribe((selectedOption: string) => {
   
  //     console.log('Selected Option: ', selectedOption);
  //   });
  // }
  openDevTypeDialog() {
    const dialogRef = this.dialog.open(DevTypeDialogComponent, {
      data: { devTypeList: this.EmpTaskCreateObj.devtypelist },
    });
    console.log("LISTED", this.EmpTaskCreateObj.devtypelist)
  
    dialogRef.afterClosed().subscribe((selectedOption: string) => {
      console.log('Selected Option: ', selectedOption);
    });
  }

  filterItems() {
    this.filteredResults = this.items.filter(item =>
      item.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  emp_type(index) {
    let keyvalue: String = "";
    this.get_type(keyvalue);
    (this.EmpTaskCreate.get('data') as FormArray).at(index).get('developer').valueChanges
      .pipe(
        startWith(""),
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),

        switchMap(value => this.taskmanagerservice.task_employeesearch(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.empList = this.empList.concat(datas);
        if (this.empList.length >= 0) {
          this.has_nextcom = datapagination.has_next;
          this.has_previouscom = datapagination.has_previous;
          this.currentpagecom = datapagination.index;
        }
      })
  }
  get_type(keyvalue) {
    this.taskmanagerservice.task_employeesearch(keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empList = datas;

      })
  }

  // openDatePickerDialog(event: MouseEvent) {
  //   const dialogRef = this.dialog.open(DatepickerDropdownComponent, {
  //     width: '250px', // Set the desired width
  //     hasBackdrop: false, // Disable backdrop
  //     position: { top: event.clientY + 'px', left: event.clientX + 'px' }, // Position the dialog at the cursor's location
  //   });

  selectDevType(devtype) {
    // this.EmpTaskCreate.get('dev_type_name').setValue(devtype);
    // this.EmpTaskCreate.get('data')['controls'].get('dev_type_name').setValue(devtype)
    // this.EmpTaskCreateObj.toSelectDropDown = devtype
    // this.EmpTaskCreateObj.toSelectDropDown = this.EmpTaskCreateObj.devtypelist?.find(c => c.id == devtype.id);
    // this.EmpTaskCreate.get('data')['controls'].get('dev_type_name').setValue(devtype?.id)
  }

  getIconColor(): string {
    if (this.selectedPriority === 1) {
      return '#ffcc00'; // Normal
    } else if (this.selectedPriority === 2) {
      return 'red'; // High
    } else if (this.selectedPriority === 3) {
      return '#6fddff'; // Low
    }
    return ''; // Default color if no selection
  }
  onModuleSelected(event: MatAutocompleteSelectedEvent): void {

    if(event)
    {
    this.selectedMappingId = event.option.value;
    // Do something with the selectedModule...
    console.log('Selected Module:', this.selectedMappingId.mapping_id);
    }
    else
    {
     
  
    }
}
changeBorder()
{
  this.borderstart = '#5c52ed'
}
changeBorders()
{
  this.borderend = '#5c52ed'
}
taskpatch(){
  this.EmpTaskCreate.patchValue({
        client:this.clientname,
         project:this.projectname,
         project_map_id:this.modulename
        
        })
}









  

  


  
  


}



export interface interfacedatas {
  id: string;
  name: string;
}
export interface developer {
  id: string;
  name: string;
}
export interface dependency {
  id: string;
  task: string;
}


