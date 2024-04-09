import { Component, OnInit, ViewChild,Directive } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../../service/error-handling-service.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS ,  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import * as imp from '../../AppAutoEngine/import-services/CommonimportFiles';
import { TaskService } from '../task.service';
import { ShareService } from '../share.service';
import { ErrorHandlingService } from '../error-handling.service';
import { NotificationService } from '../notification.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;
export interface Emplistss {
  id: string;
  full_name: string;
  name: string; 
}




export interface task {
  id: string;
  task: string;
}
export interface temployee {
  id: string;
  full_name: string;
  name: string;
  Name: string;
  code:string;
}
export interface tproject_head_Name {
  id: string;
  name: string;
  code:string;
}
export interface ttasktype {
  id: string;
  text: string;
}
export interface tClient {
  id: string;
  name: string;
}
export interface tsClient {
  id: string;
  name: string;
}
export interface tappName {
  id: string;
  name: string;
}
export interface PrName {
  id: string;
  name: string;
}
export interface appName {
  id: string;
  name: string;
}
export interface Client {
  id: string;
  name: string;
}
export interface ModeuleName {
  id: string;
  name: string;
}
export interface tUnit_head_Name {
  id: string;
  name: string;
  code:string;
}
export interface unitHead {
  id: string;
  name: string;
}
export interface tModeuleName {
  id: string;
  name: string;
}
export interface teamLead {
  id: string;
  name: string;
}
export interface Developer {
  id: string;
  name: string;
}

export interface emplistss {
  id: string;
  text: any
}

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
}
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-tasksummary',
  templateUrl: './tasksummary.component.html',
  styleUrls: ['./tasksummary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe, imp.HrmsAPI
  ]
})

export class TasksummaryComponent implements OnInit {
  taskSearchForm: FormGroup;
  summarySearchForm: FormGroup;
  TLFormForReject: FormGroup;
  taskreportForm: FormGroup;
  tasksumarryForm:FormGroup;
  teammemberForm:FormGroup;
  taskstatusForm: FormGroup;
  trclientList: Array<Client>;
  trappNameList: Array<appName>;

  taskList: any;
  presentpageTask: number = 1;
  summarypage:number=1;
  pagesizetask=10;
  has_nextTask = true;
  has_previousTask = true;
  devtypelist:any;
  statusList:any;
  isLoading = false;
  temployeeList: Array<temployee>;
taskreportfromdate = true;
  taskreporttodate = true;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  trmoduleNameList: Array<ModeuleName>;
  tunitheademployeeList: Array<tUnit_head_Name>;
  tprojectheademployeeList: Array<tproject_head_Name>;
  emp_project_has_next = true;
  emp_project_has_previous = true;
  emp_project_currentpage: number = 1;
  appNameList: Array<appName>;
  clientList: Array<Client>;
  moduleNameList: Array<ModeuleName>;
  unitheadList: Array<unitHead>;
  teamldList: Array<teamLead>;
  developerList: Array<Developer>;
  emp_has_next = true;
  emp_has_previous = true;
  emp_currentpage: number = 1;
  tasksubmoduleList:any;
  selected:any;
  emp_unit_has_next = true;
  emp_unit_has_previous = true;
  emp_unit_currentpage: number = 1;
  // task approval
  gettasknamelist: Array<task>;
  getemptasklist:Array<any>=[];

  taskapprovalList: any;
  presentpageTaskapproval: number = 1;
  modumoduledetailspresentpage: number =1;
  reportpresentpage: number =1;
  pagesizetaskapproval=10;
  has_nextTaskapproval = true;
  has_next_emp = true;
  has_pre_emp = true;
  has_previousTaskapproval = true;
  module_based:boolean=false;
  first=false;
  employee_based:boolean=false;
  taskreportemployeename:boolean=false;
  taskreportunithead:boolean=false;
  current_date: string;
  taskreportprojecthead:boolean=false;
  taskreporttask:boolean=false;
  taskreporttasktype:boolean=false;
  taskreportmonth:boolean=false;
  notificationList:any;
  client_n:boolean=true;
  project_n:boolean=true;
  // project_p:boolean=true;
  module_n:boolean=true;
  ShowViewDetailsTable:boolean=false;
  Carddetails:boolean=true;
  Tasksumarydetails:boolean=false;
  // client_s:boolean=true;
  // TaskSumary:boolean=false;
  teammeberdetail:boolean=false;
  showteammeberdetail:boolean=false
  

  attendanceReportsearchForm: FormGroup
  ListOfDaysInSelectedMonth: any = [];
  ListOfDaysInSelectedMonthFull: any = [];
  arrReport: any = []; 
  arrtime: any  = [];
  arrtime_1: any=[];
  employeeList: any
  CurrentMonthReport: any
  CurrentYearReport: any
  presentpageattreport = 1;
  has_nextattreport: boolean;
  has_previousattreport: boolean
  selectedclass: any = 0
  MonthlyActivityReport: any
  ActivityDataList: any
  logActivityList: any
  BasicDetails: any
  SelectedemployeeID: any
  SelectedEMP: any
  RemoveFromreport = ['code', 'duration', 'id', 'name', 'present_count','shift']
  PresentDate = null  
  
  log_date= new FormControl('')
  filter_key= new FormControl('')
 

  @ViewChild('appnm') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('appnmInput') appnmInput: any;
  @ViewChild('taskunithead') mattaskunitempAutocomplete: MatAutocomplete;
  @ViewChild('taskunitheadInput') taskunitheadInput: any;
  @ViewChild('clt') matclientAutocomplete: MatAutocomplete;
  @ViewChild('cltInput') cltInput: any;
  
  @ViewChild('modnm') matmodulenameAutocomplete: MatAutocomplete;
  @ViewChild('modnmInput') modnmInput: any;
  
  @ViewChild('unitHD') matunitheadAutocomplete: MatAutocomplete;
  @ViewChild('unitHDInput') unitHDInput: any;
  @ViewChild('taskname') mattaskAutocomplete: MatAutocomplete;
  @ViewChild('tasknameInput') tasknameInput: any;
  @ViewChild('teamld') matteamleadAutocomplete: MatAutocomplete;
  @ViewChild('teamldInput') teamldInput: any;
  @ViewChild('taskprojecthead') mattaskprojectempAutocomplete: MatAutocomplete;
  @ViewChild('taskprojectheadInput') taskprojectheadInput: any;
  @ViewChild('dev') matdevAutocomplete: MatAutocomplete;
  @ViewChild('developerInput') developerInput: any;
  @ViewChild('taskempl') mattaskempAutocomplete: MatAutocomplete;
  @ViewChild('taskrappInput') taskrempInput: any;
  @ViewChild('taskrclt') mattaskclientAutocomplete: MatAutocomplete;
  @ViewChild('taskrcltInput') taskrcltInput: any;
  @ViewChild('taskrmod') mattaskmodAutocomplete: MatAutocomplete;
  @ViewChild('taskmodInput') taskmodInput: any;
  // status for multiple selection
  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;
  @ViewChild('taskrapp') mattaskappAutocomplete: MatAutocomplete;
  @ViewChild('taskrappInput') taskrappInput: any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  has_next_module: any;
  has_pre_module: any;


  constructor(
private fb: FormBuilder, private router: Router,private toastr: ToastrService,
private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService,
private taskservice:TaskService, private datepipe: DatePipe, private taskShare: ShareService,
private notification: NotificationService,private shareService: SharedService ,private datePipe: DatePipe, private notify: imp.ToastrService,


  ) { }

  ngOnInit(): void {
    let currentDate = new Date()
    this.PresentDate = this.datePipe.transform(currentDate, 'yyyy-MM')
    console.log("present date for validation", this.PresentDate)
    let month: any = currentDate.getMonth() + 1
    let year = currentDate.getFullYear()
    if (month <= 9) {
      month = '0' + month
    }
    let monthValue = year + '-' + month
    this.attendanceReportsearchForm = this.fb.group({
      emp: '',
      monthyear: [moment()],
      lead_id: '',
      department: '',
      org_id: '',
      shift:''
      

    })

    this.tasksumarryForm=this.fb.group({
      'client':new FormControl(),
      'projectname':new FormControl(),
      'from_date':new FormControl(),
      'to_date':new FormControl(),

    })
    this.teammemberForm=this.fb.group({
      'client':new FormControl(),
      'projectname':new FormControl(),
      'from_date':new FormControl(),
      'to_date':new FormControl(),
      'teamlead':new FormControl(),
      'emp_id':new FormControl()
    })

    this.selected="module_based";
    this.taskreportForm = this.fb.group({
      'client':new FormControl(),
      'app_id':new FormControl(),
      'project_map_id':new FormControl(),
      'start_date':new FormControl(),
      'end_date':new FormControl(),
      'employee':new FormControl(),
      'unit_head':new FormControl(),
      'project_head':new FormControl(),
      'task_name':new FormControl(),
      'task_type':new FormControl(),
      'month':new FormControl(),
      'taskreportstatus':new FormControl(),
      'teamlead':new FormControl(),
      'numoftask':new FormControl(),
       'completed':new FormControl(),
       'wip':new FormControl(),
      //  'kvb':new FormControl(),
      //  'nac':new FormControl(),
      //  'vsolv':new FormControl()
      
     
    });
    this.taskstatusForm = this.fb.group({
      'status':new FormControl(),
    });
    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Project Tracker") {
        this.tasksubmoduleList = subModule;
        console.log("task master component value",this.tasksubmoduleList)
        // this.isCommodity = subModule[0].name;
        
       
      }})

    this.taskSearchForm = this.fb.group({
      app_id:  '',
      client: '',
      dev_type:  '',
      module_id :  '',
      unit_head: '',
      team_lead: '',
      start_date: '',
      end_date: '',
      status: '',
      query: '',
      developer_id: '',
      teamlead:'',
      //  numoftask:'',
      // completed:'',
      // wip:''
    
    })
    this.summarySearchForm=this.fb.group({
      client:'',
      projectname:'',
      from_date:'',
      to_date:''

    })

    
    this.TLFormForReject = this.fb.group({
      content: [''],


    })

    this.TaskSearch('');
    // this.TaskapprovalSearch('');
    this.getdevtype();
    this.getStatus();
    this.getNotification();

  }





  urls: string;
  urltaskmaker: string;
  urltaskapprover: string;
  urlquery_report:string;
  taskmaker:boolean;
  taskapprover:boolean;
  taskcreate:boolean;
  taskview:boolean;
  MyTask: boolean;  
  taskmetrics: boolean;
  TimeSheet: boolean; 
  taskreport:boolean;
  queryreport:boolean;
  query_report:boolean;
  subModuleData(data) { 
    this.urls = data.url;
    this.urltaskmaker= "/taskmaker";
    // this.urltaskapprover= "/taskapprover";
    this.urlquery_report="/queryreport"
    // let myTask = '/mytask'
    this.query_report=this.urlquery_report === this.urls ? true: false ;
    this.taskmaker = this.urltaskmaker === this.urls ? true : false;
    this.taskapprover = this.urltaskapprover === this.urls ? true : false;
    // let myTaskCondition = myTask === this.urls ? true : false 

    if (this.taskmaker) {
      this.taskmaker =true
      this.taskapprover =false
      this.taskreport = false
      this.taskcreate = false
      this.taskview = false
      this.TaskSearch('');
      this.MyTask = false 
      this.taskmetrics = false
      this.Carddetails=false
      this.Tasksumarydetails=false
      this.TimeSheet = false
      this.query_report=false
      this.teammeberdetail=false
    } 
    // else if (this.taskapprover) {
    //   this.taskmaker =false
    //   this.taskreport = false
    //   this.taskapprover =true
    //   this.Carddetails=false
    //   this.taskcreate = false
    //   this.Tasksumarydetails=false
    //   this.taskview = false
    //   this.TaskapprovalSearch('');
    //   this.MyTask = false 
    //   this.taskmetrics = false
    //   this.TimeSheet = false
    //   this.teammeberdetail=false
    //   this.query_report=false

    // } 
   
    else if (data.url == '/mytask' ) {
      this.taskreport = false
      this.taskmaker =false
      this.taskapprover =false 
      this.taskcreate = false 
      this.Tasksumarydetails=false
      this.taskview = false 
      this.Carddetails=false
      this.MyTask = true  
      this.taskmetrics = false
      this.TimeSheet = false
      this.teammeberdetail=false
      this.query_report=false
    } 
    else if (data.url == '/taskmetrics' ) {
      this.taskmaker =false
      this.taskapprover =false 
      this.taskcreate = false 
      this.taskview = false 
      this.MyTask = false
      this.Tasksumarydetails=false
      this.taskmetrics = true  
      this.taskreport = false
      this.Carddetails=false
      this.TimeSheet = false  
      this.query_report=false
      this.teammeberdetail=false
    } 
    else if(data.url == '/timesheet'){
      this.TimeSheet = true 
      this.taskmaker =false
      this.Carddetails=false
 
      this.taskapprover =false 
      this.taskcreate = false 
      this.taskreport = false
      this.taskview = false 
      this.Tasksumarydetails=false
      this.MyTask = false
      this.taskmetrics = false 
      this.teammeberdetail=false
      this.query_report=false
    }
    else if(data.url == '/task_report'){
      this.taskreport = true
      this.Carddetails=true
      this.taskmaker =false
      // this.taskmaker =false
      this.taskapprover =false
      this.taskcreate = false
      this.taskview = false
      this.MyTask = false
      this.taskmetrics = false
      this.TimeSheet = false
      this.teamleders()
      this.taskempstatus()
      this.query_report = false
      this.teammeberdetail=false

    }
    else if(data.url == '/queryreport'){
      this.query_report = true
      this.taskmaker =false
      // this.taskmaker =false
      this.Carddetails=false
      this.taskapprover =false
      this.taskcreate = false
      this.taskview = false
      this.Tasksumarydetails=false
      this.MyTask = false
      this.taskmetrics = false
      this.TimeSheet = false
      this.taskreport=false
      this.teammeberdetail=false
      this.ShowViewDetailsTable=false
      this.AttendanceReportSearch('',this.log_date.value, this.filter_key.value);
    }
  }

  

  onclickTaskAdd(){
    this.taskmaker =false
    this.taskapprover =false
    this.taskcreate = true
    this.taskview = false
    this.query_report=false
  }

  onClickTaskSummary(taskview){
    this.taskShare.gettaskview.next(taskview);
    this.taskmaker =false
    this.taskapprover =false
    this.taskcreate = false
    this.taskview = true
  }

  taskcancel() {
    this.taskmaker =true
    this.taskapprover =false
    this.taskcreate = false
    this.taskview = false
  }

  tasksumit(){
    this.taskmaker =true
      this.taskapprover =false
      this.taskcreate = false
      this.taskview = false
      this.TaskSearch('');
  }
  taskName(){
    this.taskservice.gettaskname('',1).subscribe(data=>{
      this.gettasknamelist=data['data'];
    });
    this.taskreportForm.get('task_name').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.taskservice.gettaskname(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.gettasknamelist=data['data'];
    });
  
  }
  emp_based_select(){
    this.module_based = false;
    this.employee_based=true;
    this.taskreportfromdate=false;
    this.taskreporttodate=false;
    this.taskreportemployeename=false;
    this.taskreportunithead=true;
    this.taskreportprojecthead=true;
    this.taskreporttask=true;
    this.taskreporttasktype=true;
    this.taskreportmonth=true;
    this.client_n=true;
    this.project_n=true;
    this.module_n=true;
  
  
  }
  taskprojectheadName(){ 
    this.taskservice.getprojectheadname('',1).subscribe(data=>{
      this.tprojectheademployeeList=data['data'];
    });
  
    this.taskreportForm.get('project_head').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.taskservice.getprojectheadname(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.tprojectheademployeeList=data['data'];
    });   
  }

  taskunitName(){ 
    this.taskservice.getunitheadname('',1).subscribe(data=>{
      this.tunitheademployeeList=data['data'];
    });
  
    this.taskreportForm.get('unit_head').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.taskservice.getunitheadname(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.tunitheademployeeList=data['data'];
    });   
  }
  taskviewcancel(){
    this.taskmaker =true
    this.taskapprover =false
    this.taskcreate = false
    this.taskview = false
    this.TaskSearch('')
  }
  taskemployee(){ 
    this.taskservice.getemployee('',1).subscribe(data=>{
      this.temployeeList=data['data'];
    });
  
    this.taskreportForm.get('employee').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.taskservice.getemployee(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.temployeeList=data['data'];
    });   
  }
  employeels:any=[]
  teamtaskemployee(){ 
    this.taskservice.getemployee('',1).subscribe(data=>{
      this.employeels=data['data'];
    });
  
    this.teammemberForm.get('emp_id').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.taskservice.getemployee(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.employeels=data['data'];
      console.log("employe list",this.employeels)
    });   
  }
  mod_based_select(){
    this.module_based = true;
    this.employee_based=false;
    this.taskreportfromdate=true;
    this.taskreporttodate=true;
    this.taskreportemployeename=false;
    this.taskreportunithead=false;
    this.taskreportprojecthead=false;
    this.taskreporttask=false;
    this.taskreporttasktype=false;
    this.taskreportmonth=false;
    this.client_n=true;
    this.project_n=true;
    this.module_n=true;
  }

  emp_cli_based_select(){
    this.taskreportfromdate=true;
    this.taskreporttodate=true;
    this.taskreportemployeename=true;
    this.taskreporttask=false;
    this.taskreporttasktype=false;
    this.taskreportmonth=false;
    this.module_based = false;
    this.taskreportunithead=false;
    this.client_n=false;
    this.project_n=false;
    this.module_n=false;
    this.taskreportprojecthead=false;
  }
  set_StartDate:any;
  StartDate(event: string) {
    const date = new Date(event)
    // this.ss1 = date
    this.set_StartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }
  taskrmoduleName(){
 
    if(this.taskreportForm.get('app_id').value.id == null || this.taskreportForm.get('app_id').value=='' || this.taskreportForm.get('app_id').value.id==undefined){
     this.notification.showError('Please Select The Project Name');
     return false;
    }
 
   let d:any=this.taskreportForm.get('client').value.id;
   console.log("Client_id",this.taskreportForm.value.client.id);
   console.log("project_id",this.taskreportForm.value.app_id.id);
   this.taskservice.getmodulenameFilter(this.taskreportForm.value.client.id,this.taskreportForm.get('app_id').value.id,'',1).subscribe(data=>{
     this.trmoduleNameList=data['data'];
     console.log("module_list",this.trmoduleNameList)
   });
   this.taskreportForm.get('project_map_id').valueChanges.pipe(
     tap(()=>{
       this.isLoading=true;
     }),
     switchMap((value:any)=>this.taskservice.getmodulenameFilter(this.taskreportForm.value.client.id,this.taskreportForm.get('app_id').value.id,value,1).pipe(
       finalize(()=>{
         this.isLoading=false;
       })
     ))
   ).subscribe(data=>{
     this.trmoduleNameList=data['data'];
   });
 }
 
  // dev type
  getdevtype() {
    this.taskservice.getdevtype()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.devtypelist = datas;
        // this.toastr.info("","Source Active  Succesfully",{timeOut:60000})
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

    // notification
    getNotification() {
      // this.notificationList = this.fetchdata
      // console.log("notification",this.notificationList)
      this.taskservice.getNotification()
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.notificationList = datas;
        }, (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }


    icon_product:boolean = true;
    isclick_product(){
      this.icon_product = !this.icon_product;
    }

  
   // status 
   getStatus() {
    this.taskservice.getStatus()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.statusList = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  typeStatus() {
    this.taskservice.getStatus().subscribe(data=>{
      this.statusList=data['data'];
    });
    this.taskreportForm.get('task_type').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.taskservice.getStatus().pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.statusList=data['data'];
    });
  }
  public displayemptask(taskname?: task): string | undefined {
    return taskname ? taskname.task : undefined;
  }
  public displayemptasktype(tasknameb?: ttasktype): string | undefined {
    return tasknameb ? tasknameb.text : undefined;
  }
  public displayprojecthead(project_head?: tproject_head_Name): string | undefined {
    return project_head ? project_head.name : undefined;
  }
  public displayunithead(unit_head?: tUnit_head_Name): string | undefined {
    return unit_head ? unit_head.name : undefined;
  }
  public displayemployee(emp?: temployee): string | undefined {
    return emp ? emp.name : undefined;
  }
  public displayemployeeteam(emp?: temployee): string | undefined {
    return emp ? emp.Name : undefined;
  }
  public displaytrclt(clt?: tClient): string | undefined {
    return clt ? clt.name : undefined;
  }
  public displaytrcli(cli?: tsClient): string | undefined {
    return cli ? cli.name : undefined;
  }
  public displaytacli(cli?: tsClient): string | undefined {
    return cli ? cli.name : undefined;
  }
  
  public displaytrcapp(app?: tappName): string | undefined {
    return app ? app.name : undefined;
  }
  public displayprjapp(pr?: PrName): string | undefined {
    return pr ? pr.name : undefined;
  }
  public displaytajapp(pr?: PrName): string | undefined {
    return pr ? pr.name : undefined;
  }
  taskrclient(){
    this.taskservice.getcltFilter('',1).subscribe(data=>{
      this.trclientList=data['data'];
    });
    this.taskreportForm.get('client').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.taskservice.getcltFilter(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.trclientList=data['data'];
      console.log("taskrclient",this.trclientList)
    });
  }
  summarycli:any=[];
  tasksummaryclient(){
    this.taskservice.getcltFilter('',1).subscribe(data=>{
      this.summarycli=data['data'];
    });
    this.tasksumarryForm.get('client').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.taskservice.getcltFilter(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.summarycli=data['data'];
      console.log("client of summary",this.summarycli)
    });
  }
  teamsummarycli:any=[]
  Teamsummaryclient(){
    this.taskservice.getcltFilter('',1).subscribe(data=>{
      this.teamsummarycli=data['data'];
    });
    this.teammemberForm.get('client').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.taskservice.getcltFilter(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.teamsummarycli=data['data'];
      console.log("client of summary",this.summarycli)
    });
  }
  
  TaskSearch(hint: any) {
    let search = this.taskSearchForm.value;
    search.start_date = this.datepipe.transform(search.start_date, 'yyyy-MM-dd');
    search.end_date = this.datepipe.transform(search.end_date, 'yyyy-MM-dd');
    // let array =this.chipSelectedempid
    let obj = {
      "start_date": search?.start_date,
      "end_date": search?.end_date,
      "dev_type": search?.dev_type,
      "app_id": search?.app_id?.id,
      "client": search?.client?.id,
      "module_id": search?.module_id?.id,
      // "status": search?.status,
      "developer_id": search?.developer_id?.id,
      "team_lead": search?.team_lead?.id,
      "query": search?.query
    }
    console.log("obj api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }
    this.SpinnerService.show();

    if (hint == 'next') {
      this.serviceCallProjectSummary(obj, this.presentpageTask + 1, this.type_Id,this.order_Id)
    }
    else if (hint == 'previous') {
      this.serviceCallProjectSummary(obj, this.presentpageTask - 1, this.type_Id,this.order_Id)
    }
    else {
      this.serviceCallProjectSummary(obj, 1, this.type_Id,this.order_Id)
    }

  }

  // default-1,start date - type 2 ,end date - type 3 -------- order 0 - ascending,order 1 - descending
  type_Id = 1;  
  order_Id = 1;
  startdate_icon:boolean = false;
  enddate_icon:boolean = false;
  startdate_iconclick(){
    this.startdate_icon = !this.startdate_icon;
    console.log("start date first click",this.startdate_icon)
    // start date ascending/descending 
    if(this.startdate_icon == true){
      this.type_Id = 2 
      this.order_Id = 0
      this.TaskSearch('');
    } else{
      this.type_Id = 2 
      this.order_Id = 1
      this.TaskSearch('')
    }
  }
  public displaytrmod(mod?: tModeuleName): string | undefined {
    return mod ? mod.name : undefined;
  }
  TaskSummarySearch(hint: any) {
    let searchsum = this.tasksumarryForm.value;
    searchsum.from_date = this.datepipe.transform(searchsum.from_date, 'yyyy-MM-dd');
    searchsum.to_date = this.datepipe.transform(searchsum.to_date, 'yyyy-MM-dd');
    // let array =this.chipSelectedempid
    // let obj = {
      let from_date = searchsum?.from_date;
      let to_date = searchsum?.to_date;
      let client = searchsum?.client?.id;
      let projectname = searchsum?.projectname?.id;
      //"client": search?.client?.id,
      // "module_id": search?.module_id?.id,
      // // "status": search?.status,
      // "developer_id": search?.developer_id?.id,
      // "team_lead": search?.team_lead?.id,
      // "query": search?.query
    
    // console.log("obj api", obj)
  
    this.SpinnerService.show()
    
      this.taskservice.TaskSumarryFullReport(this.emp_id,this.modumoduledetailspresentpage,from_date,to_date,client,'',projectname).subscribe(data=>{
        this.moduledetails=data['data'];
         this.SpinnerService.hide();
          if (this.moduledetails.length > 0) {
         let dataPagination = data['pagination'];
          this.has_next_emp = dataPagination.has_next;
          this.has_pre_emp = dataPagination.has_previous;
          this.modumoduledetailspresentpage = dataPagination.index;
        console.log("Client_list",data)
        }
   
  },(error)=>{
    this.SpinnerService.hide();
  });
}
resetfield(){
  this.tasksumarryForm.reset();
  this.employeFullDetails(this.emp_id,1);
}

  taskrappName(){
    if(this.taskreportForm.get('client').value.id == null || this.taskreportForm.get('client').value=='' || this.taskreportForm.get('client').value.id==undefined){
      this.notification.showError('Please Select The Cient Name');
      return false;
     }
    let d:any=this.taskreportForm.get('client').value.id;
    console.log("Client_id",this.taskreportForm.value.client.id);
    this.taskservice.getappNameFilter(this.taskreportForm.value.client.id,'',1).subscribe(data=>{
      this.trappNameList=data['data'];
      console.log("Client_list",this.trappNameList)
    });
  
    this.taskreportForm.get('app_id').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.taskservice.getappNameFilter(this.taskreportForm.value.client.id,value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.trappNameList=data['data'];
    });
    
  
  }
  prNameList:any=[]
  taskprojectName(){
    if(this.tasksumarryForm.get('client').value.id == null || this.tasksumarryForm.get('client').value=='' || this.tasksumarryForm.get('client').value.id==undefined){
      this.notification.showError('Please Select The Cient Name');
      return false;
     }
    let d:any=this.tasksumarryForm.get('client').value.id;
    console.log("Client_id",this.tasksumarryForm.value.client.id);
    this.taskservice.getappNameFilter(this.tasksumarryForm.value.client.id,'',1).subscribe(data=>{
      this.prNameList=data['data'];
      console.log("Client_list",this.prNameList)
    });
  
    this.tasksumarryForm.get('projectname').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.taskservice.getappNameFilter(this.tasksumarryForm.value.client.id,value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.prNameList=data['data'];

    });
  }

  teamprNameList:any=[]
  teamprojectName(){
    if(this.teammemberForm.get('client').value.id == null || this.teammemberForm.get('client').value=='' || this.teammemberForm.get('client').value.id==undefined){
      this.notification.showError('Please Select The Cient Name');
      return false;
     }
    let d:any=this.teammemberForm.get('client').value.id;
    console.log("Client_id",this.teammemberForm.value.client.id);
    this.taskservice.getappNameFilter(this.teammemberForm.value.client.id,'',1).subscribe(data=>{
      this.teamprNameList=data['data'];
      console.log("Client_list",this.teamprNameList)
    });
  
    this.teammemberForm.get('projectname').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.taskservice.getappNameFilter(this.teammemberForm.value.client.id,value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.teamprNameList=data['data'];

    });
  }
  enddate_iconclick(){
    this.enddate_icon = !this.enddate_icon;
    console.log(" end date first click",this.enddate_icon)
    // end date ascending/descending 
    if(this.enddate_icon == true){
      this.type_Id = 3 
      this.order_Id = 0
      this.TaskSearch('');
    } else{
      this.type_Id = 3 
      this.order_Id = 1
      this.TaskSearch('')
    }
  }
  
  serviceCallProjectSummary(search, pageno,type_Id,order_Id ) {
    this.taskservice.task_search_summary(search, pageno,this.chipSelectedempid,this.type_Id,this.order_Id)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("project summary", result)
        this.taskList = result['data']
        let dataPagination = result['pagination'];
        if (this.taskList.length > 0) {
          this.has_nextTask = dataPagination.has_next;
          this.has_previousTask = dataPagination.has_previous;
          this.presentpageTask = dataPagination.index;
          this.getNotification();
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      
      )
  }
  
  resetTask() {
    this.chipSelectedempid=[];
    this.chipSelectedemp=[];
    this.empInput.nativeElement.value = '';
    this.taskSearchForm = this.fb.group({
      app_id:  '',
      client: '',
      dev_type:  '',
      module_id :  '',
      unit_head: '',
      team_lead: '',
      start_date: '',
      end_date: '',
      status: '',
      query: '',
      developer_id: '',
      teamlead:'',

    
    })
    // this.taskSearchForm.reset("")
    this.type_Id=1;
    this.order_Id=1;
    this.TaskSearch('')

  }

  clearproject() {
    this.taskSearchForm.controls['app_id'].reset("");
    this.taskSearchForm.controls['module_id'].reset("");
  }
  clearmodule(){
    this.taskSearchForm.controls['module_id'].reset("");
  }

  // task download
  taskdownload() {
    this.SpinnerService.show();
    let search = this.taskSearchForm.value;
    search.start_date = this.datepipe.transform(search.start_date, 'yyyy-MM-dd');
    search.end_date = this.datepipe.transform(search.end_date, 'yyyy-MM-dd');
    let obj = {
      "start_date": search?.start_date,
      "end_date": search?.end_date,
      "dev_type": search?.dev_type,
      "app_id": search?.app_id.id,
      "client": search?.client?.id,
      "module_id": search?.module_id?.id,
      "developer_id": search?.developer_id?.id,
      "team_lead": search?.team_lead?.id,
      "query":search?.query
    }
    console.log("obj api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }
      this.taskservice.getTaskdownload(obj,this.chipSelectedempid)
        .subscribe((results) => {
          console.log("download result",results)
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          const d = new Date();
          let text = d.toLocaleString();
          link.download ="Tracker "+ text + ".xlsx" ;
          link.click();
          this.SpinnerService.hide()
        },
          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
  
        )
  }



  // task approval search
  TaskapprovalSearch(hint: any) {
    // let search = this.taskSearchForm.value;
    // search.start_date = this.datepipe.transform(search.start_date, 'yyyy-MM-dd');
    // search.end_date = this.datepipe.transform(search.end_date, 'yyyy-MM-dd');
    // let obj = {
    //   "start_date": search?.start_date,
    //   "end_date": search?.end_date,
    //   "dev_type": search?.dev_type,
    //   "app_id": search?.app_id.id,
    //   "client": search?.client?.id,
    //   "module_id": search?.module_id?.id,
    //   "status": search?.status
    // }
    // console.log("obj api", obj)
    // for (let i in obj) {
    //   if (obj[i] == undefined || obj[i] == null) {
    //     obj[i] = '';
    //   }
    // }
    // this.SpinnerService.show();
let obj = 1 
    if (hint == 'next') {
      this.taskApprovalSummary(obj, this.presentpageTaskapproval + 1, 10)
    }
    else if (hint == 'previous') {
      this.taskApprovalSummary(obj, this.presentpageTaskapproval - 1, 10)
    }
    else {
      this.taskApprovalSummary(obj, 1, 10)
    }

  }


  taskApprovalSummary(search, pageno, pageSize) {
    this.taskservice.task_Approval_Summary(search, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("task approval summary", result)
        this.taskapprovalList = result['data']
        let dataPagination = result['pagination'];
        if (this.taskapprovalList.length > 0) {
          this.has_nextTaskapproval = dataPagination.has_next;
          this.has_previousTaskapproval = dataPagination.has_previous;
          this.presentpageTaskapproval = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  // app name
  appName(){
    let appkeyvalue: String = "";
      this.getappName(appkeyvalue);
  
      this.taskSearchForm.get('app_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.taskservice.getprojectsearchFilter(this.client_Id,value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.appNameList = datas;
  
        })
  
  }

      private getappName(appkeyvalue) {
        this.taskservice.getprojectsearchFilter(this.client_Id,appkeyvalue,1)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.appNameList = datas;
          })
      }

      public displayFnappnm(appnm?: appName): string | undefined {
        return appnm ? appnm.name : undefined;
      }
    
      get appnm() {
        return this.taskSearchForm.value.get('app_id');
      }


      // app name
  autocompleteAppnmScroll() {
    setTimeout(() => {
      if (
        this.matAutocomplete &&
        this.autocompleteTrigger &&
        this.matAutocomplete.panel
      ) {
        fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskservice.getprojectsearchFilter(this.client_Id,this.appnmInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.appNameList = this.appNameList.concat(datas);
                    if (this.appNameList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }





  // client
  client(){
    let cltkeyvalue: String = "";
      this.getclt(cltkeyvalue);
  
      this.taskSearchForm.get('client').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.taskservice.getclientsearchFilter(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.clientList = datas;
  
        })
  
  }

      private getclt(cltkeyvalue) {
        this.taskservice.getclientsearchFilter(cltkeyvalue,1)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.clientList = datas;
          })
      }

      public displayFnclt(clt?: Client): string | undefined {
        return clt ? clt.name : undefined;
      }
    
      get clt() {
        return this.taskSearchForm.value.get('client');
      }



  // client
  autocompleteCltScroll() {
    setTimeout(() => {
      if (
        this.matclientAutocomplete &&
        this.autocompleteTrigger &&
        this.matclientAutocomplete.panel
      ) {
        fromEvent(this.matclientAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matclientAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matclientAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matclientAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matclientAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskservice.getclientsearchFilter(this.cltInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.clientList = this.clientList.concat(datas);
                    if (this.clientList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


// module name
moduleName(){
  let modkeyvalue: String = "";
    this.getModuleName(modkeyvalue);

    this.taskSearchForm.get('module_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.taskservice.getmodulesearchFilter(this.client_Id,this.project_Id,value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.moduleNameList = datas;

      })

}

  private getModuleName(modkeyvalue) {
      this.taskservice.getmodulesearchFilter(this.client_Id,this.project_Id,modkeyvalue,1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.moduleNameList = datas;
        })
    }

    public displayFnmodnm(mod?: ModeuleName): string | undefined {
      return mod ? mod.name : undefined;
    }
  
    get mod() {
      return this.taskSearchForm.value.get('module_id');
    
    }
    // unit head
unitHead(){
  let unithdkeyvalue: String = "";
    this.getUnitHead(unithdkeyvalue);

    this.taskSearchForm.get('unit_head').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.taskservice.getUnitHeadFilter(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.unitheadList = datas;

      })

}

  private getUnitHead(unithdkeyvalue) {
      this.taskservice.getUnitHeadFilter(unithdkeyvalue,1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.unitheadList = datas;
        })
    }

    public displayFnunitHD(unithd?: unitHead): string | undefined {
      return unithd ? unithd.name : undefined;
    }
  
    get unithd() {
      return this.taskSearchForm.value.get('unit_head');
    }
    tls:any=[];
teamleders(){
  switchMap(value => this.taskservice.tlpermision()
          .pipe(
            filter(val => {
              return val.Permission==true
            }),
          )
        )
        

}

// Team lead
TeamLead(){
  let teamldkeyvalue: String = "";
    this.getTeamLeads(teamldkeyvalue);

    this.taskSearchForm.get('team_lead').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.taskservice.getTeamLeadFilter(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {                                                              
        let datas = results["data"];
        this.teamldList = datas;

      })

}

  
    public displayFnteamld(teamld?: teamLead): string | undefined {
      return teamld ? teamld.name : undefined;
    }
  
    get teamld() {
      return this.taskSearchForm.value.get('team_lead');
    }


    // developer Name
    developerName(){
  let teamldkeyvalue: String = "";
    this.getdeveloper(teamldkeyvalue);

    this.taskSearchForm.get('developer_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.taskservice.getdeveloperFilter(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.developerList = datas;

      })

}

  private getdeveloper(teamldkeyvalue) {
      this.taskservice.getdeveloperFilter(teamldkeyvalue,1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.developerList = datas;
        })
    }

    public displayFndev(dev?: Developer): string | undefined {
      return dev ? dev.name : undefined;
    }
  
    get dev() {
      return this.taskSearchForm.value.get('developer_id');
    }


      // module name
  autocompletemodnmScroll() {
    setTimeout(() => {
      if (
        this.matmodulenameAutocomplete &&
        this.autocompleteTrigger &&
        this.matmodulenameAutocomplete.panel
      ) {
        fromEvent(this.matmodulenameAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matmodulenameAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matmodulenameAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matmodulenameAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matmodulenameAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskservice.getmodulesearchFilter(this.client_Id,this.project_Id,this.modnmInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.moduleNameList = this.moduleNameList.concat(datas);
                    if (this.moduleNameList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  DownloadSubmitted(){
    if(this.selected == "module_based"){
    let app_id='';
    let project_map_id='';
    if(this.taskreportForm.get('client').value ==undefined || this.taskreportForm.get('client').value =="" || this.taskreportForm.get('client').value ==''||this.taskreportForm.get('client').value.id ==undefined || this.taskreportForm.get('client').value.id =="" || this.taskreportForm.get('client').value.id==''){
      this.toastr.error('Please Select The Client ');
      return false;
    }
    if (this.taskreportForm.get('app_id').value != null && this.taskreportForm.get('app_id').value.id !='undefined'){
      app_id=this.taskreportForm.get('app_id').value.id

    }
    else{

      app_id=''

    }
    if (this.taskreportForm.get('project_map_id').value != null && this.taskreportForm.get('project_map_id').value.id !='undefined'){
       project_map_id=this.taskreportForm.get('project_map_id').value.id

    }
    else{
      project_map_id=''
    }
    let d:any={
      "client_id":this.taskreportForm.get('client').value.id,
      "project_id":app_id,
      "module_id":project_map_id,
      "from_date":this.datepipe.transform(this.taskreportForm.get('start_date').value,'yyyy-MM-dd')?this.datepipe.transform(this.taskreportForm.get('start_date').value,'yyyy-MM-dd'):'',
      "to_date":this.datepipe.transform(this.taskreportForm.get('end_date').value,'yyyy-MM-dd')?this.datepipe.transform(this.taskreportForm.get('end_date').value,'yyyy-MM-dd'):'',
    }
    this.SpinnerService.show();
    this.taskservice.downloaddata(d).subscribe(fullXLS=>{
      this.SpinnerService.hide();
      console.log(fullXLS);
      if(fullXLS.type=="application/json"){
        this.notification.showError('INVALID_DATA');
      }
      else{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'Task_report'+ date +".xlsx";
        link.click();
        this.notification.showSuccess('Download Successfully...')
      }
    },
      (error)=>{
     
        this.notification.showWarning(error.status+error.statusText)
      })
  }
  if(this.selected == "employee_based"){
    let app_id='';
    let project_map_id='';
    let emp_id='';
    let unit_head_id='';
    let proj_head_id='';
    let task_id='';
    let task_type_id='';
    if(this.taskreportForm.get('client').value ==undefined || this.taskreportForm.get('client').value =="" || this.taskreportForm.get('client').value ==''||this.taskreportForm.get('client').value.id ==undefined || this.taskreportForm.get('client').value.id =="" || this.taskreportForm.get('client').value.id==''){
      this.toastr.error('Please Select The Client ');
      return false;
    }
    if (this.taskreportForm.get('app_id').value != null && this.taskreportForm.get('app_id').value.id !='undefined'){
      app_id=this.taskreportForm.get('app_id').value.id

    }
    else{

      app_id=''

    }
    if (this.taskreportForm.get('project_map_id').value != null && this.taskreportForm.get('project_map_id').value.id !='undefined'){
       project_map_id=this.taskreportForm.get('project_map_id').value.id

    }
    else{
      project_map_id=''
    }
    if (this.taskreportForm.get('employee').value != null && this.taskreportForm.get('employee').value.id !='undefined'){
      emp_id=this.taskreportForm.get('employee').value.id

    }
    else{
      emp_id=''
    }
    if (this.taskreportForm.get('unit_head').value != null && this.taskreportForm.get('unit_head').value.id !='undefined'){
      unit_head_id=this.taskreportForm.get('unit_head').value.id

    }
    else{
      unit_head_id=''
    }
    if (this.taskreportForm.get('project_head').value != null && this.taskreportForm.get('project_head').value.id !='undefined'){
      proj_head_id=this.taskreportForm.get('project_head').value.id

    }
    else{
      proj_head_id=''
    }
    if (this.taskreportForm.get('task_name').value != null && this.taskreportForm.get('task_name').value.id !='undefined'){
      task_id=this.taskreportForm.get('task_name').value.id

    }
    else{
      task_id=''
    }
    if (this.taskreportForm.get('task_type').value != null && this.taskreportForm.get('task_type').value.id !='undefined'){
      task_type_id=this.taskreportForm.get('task_type').value.id

    }
    else{
      task_type_id=''
    }
    if(this.taskreportForm.get('month').value ==undefined || this.taskreportForm.get('month').value =="" || this.taskreportForm.get('month').value ==''){
      this.toastr.error('Please Select  The Month');
      return false;
    }
    let d:any={
        "client_id":this.taskreportForm.get('client').value.id,
        "project_id":app_id,
        "module_id":project_map_id,
        "emp_id":emp_id,
        "unit_head":unit_head_id,
        "proj_head":proj_head_id,
        "task":task_id,
        "task_type":task_type_id,
        "month":this.datepipe.transform(this.taskreportForm.get('month').value,'yyyy-MM')?this.datepipe.transform(this.taskreportForm.get('month').value,'yyyy-MM'):'',
    }
    this.SpinnerService.show();
    this.taskservice.downloademployeebaseddata(d).subscribe(fullXLS=>{
      this.SpinnerService.hide();
      console.log(fullXLS);
      if(fullXLS.type=="application/json"){
        this.notification.showError('INVALID_DATA');
      }
      else{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'Emp_Task_report'+ date +".xlsx";
        link.click();
        this.notification.showSuccess('Download Successfully...')
      }
      },
      (error)=>{
        this.SpinnerService.hide();
        this.notification.showWarning(error.status+error.statusText)
      })
  }
  if(this.selected == "employee_client_based"){
    
    let emp_id='';
    
    // }
    if (this.taskreportForm.get('employee').value != null && this.taskreportForm.get('employee').value.id !='undefined'){
      emp_id=this.taskreportForm.get('employee').value.id

    }
    else{
      emp_id=''
    }
    

    
    // }
    let d:any={
        
        "id":emp_id,
        
        "fromdate":this.datepipe.transform(this.taskreportForm.get('start_date').value,'yyyy-MM-dd')?this.datepipe.transform(this.taskreportForm.get('start_date').value,'yyyy-MM-dd'):'',
        "todate":this.datepipe.transform(this.taskreportForm.get('end_date').value,'yyyy-MM-dd')?this.datepipe.transform(this.taskreportForm.get('end_date').value,'yyyy-MM-dd'):'',
        // "month":this.datepipe.transform(this.taskreportForm.get('month').value,'yyyy-MM')?this.datepipe.transform(this.taskreportForm.get('month').value,'yyyy-MM'):'',
    }
    this.SpinnerService.show();
    this.taskservice.downloademployeeclientbased(d).subscribe(fullXLS=>{
      this.SpinnerService.hide();
      console.log(fullXLS);
      if(fullXLS.type=="application/json"){
        this.notification.showError('INVALID_DATA');
      }
      else{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'Emp_Client_Task_report'+ date +".xlsx";
        link.click();
        this.notification.showSuccess('Download Successfully...')
      }
      },
      (error)=>{
        this.SpinnerService.hide();
        this.notification.showWarning(error.status+error.statusText)
      })
  }

}
reset1(){
  this.taskreportForm.reset('');
}
  // unit head
autocompleteuntheadScroll() {
  setTimeout(() => {
    if (
      this.matunitheadAutocomplete &&
      this.autocompleteTrigger &&
      this.matunitheadAutocomplete.panel
    ) {
      fromEvent(this.matunitheadAutocomplete.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matunitheadAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matunitheadAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.matunitheadAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.matunitheadAutocomplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_next === true) {
              this.taskservice.getUnitHeadFilter(this.unitHDInput.nativeElement.value, this.currentpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.unitheadList = this.unitheadList.concat(datas);
                  if (this.unitheadList.length >= 0) {
                    this.has_next = datapagination.has_next;
                    this.has_previous = datapagination.has_previous;
                    this.currentpage = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });
}

// team  lead
autocompleteteteamldScroll() {
  setTimeout(() => {
    if (
      this.matteamleadAutocomplete &&
      this.autocompleteTrigger &&
      this.matteamleadAutocomplete.panel
    ) {
      fromEvent(this.matteamleadAutocomplete.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matteamleadAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matteamleadAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.matteamleadAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.matteamleadAutocomplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_next === true) {
              this.taskservice.getTeamLeadFilter(this.teamldInput.nativeElement.value, this.currentpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.teamldList = this.teamldList.concat(datas);
                  if (this.teamldList.length >= 0) {
                    this.has_next = datapagination.has_next;
                    this.has_previous = datapagination.has_previous;
                    this.currentpage = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });
}


// develoer 
autocompletetedevScroll() {
  setTimeout(() => {
    if (
      this.matdevAutocomplete &&
      this.autocompleteTrigger &&
      this.matdevAutocomplete.panel
    ) {
      fromEvent(this.matdevAutocomplete.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matdevAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matdevAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.matdevAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.matdevAutocomplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_next === true) {
              this.taskservice.getdeveloperFilter(this.developerInput.nativeElement.value, this.currentpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.developerList = this.developerList.concat(datas);
                  if (this.developerList.length >= 0) {
                    this.has_next = datapagination.has_next;
                    this.has_previous = datapagination.has_previous;
                    this.currentpage = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });
}

 


 


  taskApproveClick(id){
    this.SpinnerService.show();
    this.taskservice.taskApproveClick(id)
    .subscribe(res => {
      console.log("taskApproveClick", res)
      if(res.message == 'Successfully Updated'){
        this.notification.showSuccess("Updated Successfully!...");
        this.TaskapprovalSearch('');
        this.SpinnerService.hide();
       } else {
        this.notification.showError(res.description)
        this.SpinnerService.hide();
        return false;
      }
    },
    error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    ) 

  }

  autocompleteApptrScroll() {
    setTimeout(() => {
      if (
        this.mattaskappAutocomplete &&
        this.autocompleteTrigger &&
        this.mattaskappAutocomplete.panel
      ) {
        fromEvent(this.mattaskappAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattaskappAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattaskappAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattaskappAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattaskappAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskservice.getprojectsearchFilter(this.taskrcltInput.nativeElement.value.id,this.taskrappInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.trappNameList = this.trappNameList.concat(datas);
                    if (this.trappNameList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  projectstart_date:any;
  projectend_date:any;
  projectdata:any;
  project(data){
    console.log("gggg")
    this.projectdata = data;
    this.projectstart_date = data.project.start_date
    this.projectend_date= data.project.end_date

  }
  autocompletemodtrScroll() {
    setTimeout(() => {
      if (
        this.mattaskmodAutocomplete &&
        this.autocompleteTrigger &&
        this.mattaskmodAutocomplete.panel
      ) {
        fromEvent(this.mattaskmodAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattaskmodAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattaskmodAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattaskmodAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattaskmodAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskservice.getmodulesearchFilter(this.taskrcltInput.nativeElement.value.id,this.taskrappInput.nativeElement.value.id,this.taskmodInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.trmoduleNameList = this.trmoduleNameList.concat(datas);
                    if (this.trmoduleNameList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompleteunitScroll() {
    setTimeout(() => {
      if (
        this.mattaskunitempAutocomplete &&
        this.autocompleteTrigger &&
        this.mattaskunitempAutocomplete.panel
      ) {
        fromEvent(this.mattaskunitempAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattaskunitempAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattaskunitempAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattaskunitempAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattaskunitempAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.emp_unit_has_next === true) {
                this.taskservice.getunitheadname(this.taskunitheadInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.tunitheademployeeList = this.tunitheademployeeList.concat(datas);
                    if (this.tunitheademployeeList.length >= 0) {
                      this.emp_unit_has_next = datapagination.has_next;
                      this.emp_unit_has_previous = datapagination.has_previous;
                      this.emp_unit_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  
  autocompleteprojectScroll() {

    setTimeout(() => {
      if (
        this.mattaskprojectempAutocomplete &&
        this.autocompleteTrigger &&
        this.mattaskprojectempAutocomplete.panel
      ) {
        fromEvent(this.mattaskprojectempAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattaskprojectempAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattaskprojectempAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattaskprojectempAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattaskprojectempAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.emp_project_has_next === true) {
                this.taskservice.getprojectheadname(this.taskunitheadInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.tprojectheademployeeList = this.tprojectheademployeeList.concat(datas);
                    if (this.tprojectheademployeeList.length >= 0) {
                      this.emp_project_has_next = datapagination.has_next;
                      this.emp_project_has_previous = datapagination.has_previous;
                      this.emp_project_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocomplettaskScroll() {
    setTimeout(() => {
      if (
        this.mattaskAutocomplete &&
        this.autocompleteTrigger &&
        this.mattaskAutocomplete.panel
      ) {
        fromEvent(this.mattaskAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattaskAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattaskAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattaskAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattaskAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskservice.gettaskname(this.tasknameInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.gettasknamelist = this.gettasknamelist.concat(datas);
                    if (this.gettasknamelist.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompleteemployeeScroll() {
    setTimeout(() => {
      if (
        this.mattaskempAutocomplete &&
        this.autocompleteTrigger &&
        this.mattaskempAutocomplete.panel
      ) {
        fromEvent(this.mattaskempAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattaskempAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattaskempAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattaskempAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattaskempAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.emp_has_next === true) {
                this.taskservice.getemployee(this.taskrempInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.temployeeList = this.temployeeList.concat(datas);
                    if (this.temployeeList.length >= 0) {
                      this.emp_has_next = datapagination.has_next;
                      this.emp_has_previous = datapagination.has_previous;
                      this.emp_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  autocompleteamployeeScroll() {
    setTimeout(() => {
      if (
        this.mattaskempAutocomplete &&
        this.autocompleteTrigger &&
        this.mattaskempAutocomplete.panel
      ) {
        fromEvent(this.mattaskempAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattaskempAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattaskempAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattaskempAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattaskempAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.emp_has_next === true) {
                this.taskservice.getemployee(this.taskrempInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeels = this.employeels.concat(datas);
                    if (this.employeels.length >= 0) {
                      this.emp_has_next = datapagination.has_next;
                      this.emp_has_previous = datapagination.has_previous;
                      this.emp_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  client_Id=0;
  FocusOut_select_client(data) {
    console.log("client",data);
    this.client_Id = data.id;
    console.log("client- id", this.client_Id)
  }
  project_Id=0;
  FocusOut_select_project(data) {
    console.log("client",data);
    this.project_Id = data.id;
    console.log("project- id", this.project_Id)
  }


// delete task
deleteTask(data) {
    let taskId = data.id
    if (confirm("Delete Task details?")) {
    this.SpinnerService.show();
    this.taskservice.deleteTask(taskId)
        .subscribe(res => {
          console.log("task delete", res)
          if(res.message == 'Successfully Deleted'){
            this.notification.showSuccess("Deleted Successfully!...")
            this.TaskSearch('');
            this.SpinnerService.hide();
           } else {
            this.notification.showError(res.description)
            this.SpinnerService.hide();
            return false;
          }
        },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
        ) 
    }
      else{
        this.SpinnerService.hide();
        return false
      }
  }


  empList: emplistss[];
  public chipSelectedemp: emplistss[] = [];
  public chipSelectedempid = [];
  public chipSelectedempid1 = [];
  hasnextdevname = true;
  haspreviousdevname = true;
  currentpagedevname: number = 1;
  status = new FormControl();

  getemp(keyvalue) {
    this.taskservice.getStatus_multipleSelection(keyvalue, 1)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.empList = datas;
        console.log("emp data get ", this.empList)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }





  public removedemp(emp: emplistss): void {
    const index = this.chipSelectedemp.indexOf(emp);

    if (index >= 0) {

      this.chipSelectedemp.splice(index, 1);
      console.log(this.chipSelectedemp);
      this.chipSelectedempid.splice(index, 1);
      console.log(this.chipSelectedempid);
      this.empInput.nativeElement.value = '';
    }

  }



  public empSelected(event: MatAutocompleteSelectedEvent): void {
    console.log('event.option.value', event.option.value)
    this.selectempByName(event.option.value.text);
    this.empInput.nativeElement.value = '';
    console.log('chipSelectedempid', this.chipSelectedempid)
  }
  private selectempByName(emp) {
    let foundemp1 = this.chipSelectedemp.filter(e => e.text == emp);
    if (foundemp1.length) {
      return;
    }
    let foundemp = this.empList.filter(e => e.text == emp);
    if (foundemp.length) {
      this.chipSelectedemp.push(foundemp[0]);
      this.chipSelectedempid.push(foundemp[0].id)
    }
  }
 
  autocompletetaskCltScroll() {
    setTimeout(() => {
      if (
        this.mattaskclientAutocomplete &&
        this.autocompleteTrigger &&
        this.mattaskclientAutocomplete.panel
      ) {
        fromEvent(this.mattaskclientAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattaskclientAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattaskclientAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattaskclientAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattaskclientAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskservice.getclientsearchFilter(this.taskrcltInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.trclientList = this.trclientList.concat(datas);
                    if (this.trclientList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  autocompletetaskRptScroll() {
    setTimeout(() => {
      if (
        this.mattaskclientAutocomplete &&
        this.autocompleteTrigger &&
        this.mattaskclientAutocomplete.panel
      ) {
        fromEvent(this.mattaskclientAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattaskclientAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattaskclientAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattaskclientAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattaskclientAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskservice.getclientsearchFilter(this.taskrcltInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.trclientList = this.trclientList.concat(datas);
                    if (this.trclientList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompletetaskteamRptScroll() {
    setTimeout(() => {
      if (
        this.mattaskclientAutocomplete &&
        this.autocompleteTrigger &&
        this.mattaskclientAutocomplete.panel
      ) {
        fromEvent(this.mattaskclientAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattaskclientAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattaskclientAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattaskclientAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattaskclientAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskservice.getclientsearchFilter(this.taskrcltInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.trclientList = this.trclientList.concat(datas);
                    if (this.trclientList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  // autocompleteempScroll(type) {
  //   setTimeout(() => {
  //     if (
  //       this.matempAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matempAutocomplete.panel
  //     ) {
  //       fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matempAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.hasnextdevname === true) {
  //               this.taskservice.getStatus_multipleSelection(this.empInput.nativeElement.value, this.currentpagedevname + 1,)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.empList = this.empList.concat(datas);
  //                   if (this.empList.length >= 0) {
  //                     this.hasnextdevname = datapagination.has_next;
  //                     this.haspreviousdevname = datapagination.has_previous;
  //                     this.currentpagedevname = datapagination.index;
  //                   }
  //                 }, (error) => {

  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }




  isApprove = false;
  isReject = false;
  approveButton() {
    this.isApprove = true;
    this.isReject = false;

  }

  rejectButton() {
    this.isApprove = false;
    this.isReject = true;

  }


// project tracker team lead APPROVE
TeamLead_Approve(id) {
    this.taskservice.TeamLead_Approve(id)
    .subscribe(res => {
      console.log("APPROVE FOR TL", res)
      if(res.status == 'success'){
        this.notification.showSuccess("Approved Successfully!...");
        this.TaskSearch('');
        this.SpinnerService.hide();
       } else {
        this.notification.showError(res.description)
        this.SpinnerService.hide();
        return false;
      }
    },
    error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    ) 

}
taskempstatus(){
  this.taskservice.getemp_based_tstatus(1).subscribe(data=>{
    this.getemptasklist=data['data'];
  });}
// project tracker team lead REJECT
TeamLead_Reject() {
  this.taskservice.TeamLead_Reject(this.TLFormForReject.value)
  // .subscribe(res => {
  //   console.log("REJECT FOR TL", res)
  //   if(res.message == 'success'){
  //     this.notification.showSuccess("Rejected Successfully!...");
  //     this.TaskSearch('');
  //     this.SpinnerService.hide();
  //    } else {
  //     this.notification.showError(res.description)
  //     this.SpinnerService.hide();
  //     return false;
  //   }
  // },
  // error => {
  //   this.errorHandler.handleError(error);
  //   this.SpinnerService.hide();
  // }
  // ) 
}

//View Details
completed:any=[];
task:any=[];
wip:any=[];
kvb:any=[];
nac:any=[];
vsolv:any=[];
cli:any=[];

getemptasklist2:any;
TeamLeaders(teamld){
  console.log(teamld,"teamld");
  this.SpinnerService.show();
   this.taskservice.gettlFilter(teamld.id).subscribe(value=>{
    this.SpinnerService.hide();
    console.log(value);
    this.getemptasklist2=value[0]['Details'];
    let task = value[0]['Header']['Total no of task']
     let com=value[0]['Header']['Completed']
     let wip=value[0]['Header']['Work In Progress']
    //  let KVB=this.cli['Task in KVB']
    //  let NAC=this.cli['Task in NAC']
    //  let VSOLV=this.cli['Task in VSOLV']
     let clients=value[0]['Header']['client']
     console.log("clients",clients)
    //  for(let i of ){
    //   // console.log(i)
     this.cli=clients
    //  }
     console.log("cli",this.cli)
    this.taskreportForm.get('numoftask').patchValue(task);
    this.taskreportForm.get('completed').patchValue(com);
    this.taskreportForm.get('wip').patchValue(wip);
    // this.taskreportForm.get('kvb').patchValue(KVB)
    // this.taskreportForm.get('nac').patchValue(NAC)
    // this.taskreportForm.get('vsolv').patchValue(VSOLV)
     this.completed=com;
     this.task=task;
     this.wip=wip;
    //  this.kvb=KVB;
    //  this.nac=NAC;
    //  this.vsolv=VSOLV


   })
}

// fetchdata :any= [
//   {
//     "name":"swathipriya",
//     "code":"",
//     "id":"1"
//  },
//  {
//     "name":"Dhivyadharshini",
//     "code":"",
//     "id":"2"
//  },
//  {
//     "name":"Vigneshwaran",
//     "code":"",
//     "id":"3"
//  }
// ]
teamleader(){
const getToken = localStorage.getItem("sessionData");
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.employee_id;
          console.log("teamleader value",token)
}
getLeadBasedemployee(lead, data) {
  console.log("lead data ", lead)
  if(lead == undefined || lead == null || lead == ''){
    lead = ''
  }else{lead = lead}
  if(data == undefined || data == null || data == ''){
    data = ''
  }else{data = data}
  this.taskservice.getLeadBasedemployee(lead, data, 1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.employeeList = datas;
      console.log("employeeList", datas)
    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })

}

resetAttendanceReport() {
  this.attendanceReportsearchForm.reset('')
  this.attendanceReportsearchForm.patchValue({
    monthyear: moment()
  })
  this.AttendanceReportSearch('',this.log_date.value, this.filter_key.value)
  this.filter_key.reset()
}

public displayFnemp(emp?: Emplistss): string | undefined {
  return emp ? emp.full_name : undefined;
}

////////////////////////////////////////////////////////////// Months and Years









AttendanceReportSearch(hint: any, dateFilter?:any, type?:any ) {
  let search = this.attendanceReportsearchForm.value;

  let monthyeardata: any = this.datePipe.transform(search.monthyear, 'yyyy-MM')

  // let splitdata = search.monthyear.split('-')
  let splitdata = monthyeardata.split('-')
  console.log(splitdata)

  // this.daysInMonth(splitdata[1], splitdata[0])
  let month = splitdata[1]
  let year = splitdata[0]
  // let listNoOfDays = new Date(year, month, 0).getDate()
  // console.log('listNoOfDays', listNoOfDays)
  // let arr = []
  // let arrfulldate = []
  // for (let i = 1; i <= listNoOfDays; i++) {
  //   console.log(i)
  //   let dateArrange
  //   let dayArrange
  //   if (i < 10) {
  //     dateArrange = year + '-' + month + '-0' + i
  //     dayArrange = " 0" + i
  //   }
  //   if (i >= 10) {
  //     dateArrange = year + '-' + month + '-' + i
  //     dayArrange = " " + i
  //   }
  //   let obj = {
  //     date: dateArrange,
  //     day: dayArrange
  //   }
  //   arrfulldate.push(dateArrange)
  //   arr.push(obj)
  // }


  // console.log("finaldateprevious ", arr, arrfulldate)

  // console.log("date list arr arrfulldate ", arr, arrfulldate)
  // this.ListOfDaysInSelectedMonth = arr
  // this.ListOfDaysInSelectedMonthFull = arrfulldate
  // {"arr":[],"log_date":"2023-04-06","filter_key":1,"lead_id":1,"org_id":1,"department":1}
  console.log("particular date filter", dateFilter, type   )
  let obj = {
    emp: search?.emp?.id,
    month: month,
    year: year,
    log_date: dateFilter,
    filter_key: type?.id,
    lead_id: search?.lead_id?.id,
    org_id: search?.org_id?.id,
    department: search?.department?.id 
  }
  console.log("obj data b4 api", obj)
  for (let i in obj) {
    if (obj[i] === undefined || obj[i] === null) {
      obj[i] = '';
    }
    if (i == 'emp' && obj[i] == "") {
      obj[i] = []
    } else if (i == 'emp' && obj[i] != "") {
      obj[i] = [obj[i]]
    }
    console.log("object atta report search")
  }
  this.SpinnerService.show();

  if (hint == 'next') {
    this.serviceCallAttendanceReportSummary(obj, this.presentpageattreport + 1, 10)
  }
  else if (hint == 'previous') {
    this.serviceCallAttendanceReportSummary(obj, this.presentpageattreport - 1, 10)
  }
  else {
    this.arrReport = []
    this.arrtime_1 = []
    this.serviceCallAttendanceReportSummary(obj, 1, 10)
  }

}



Attendanceexceldownload() {
  this.SpinnerService.show();
  let search = this.attendanceReportsearchForm.value;
  if (search?.monthyear == "" || search?.monthyear == null || search?.monthyear == undefined) {
    this.notify.warning("Please select Month and Year")
    return false
  }
  let monthyeardata: any = this.datePipe.transform(search.monthyear, 'yyyy-MM')
  // let splitdata = search.monthyear.split('-')
  let splitdata = monthyeardata.split('-')
  console.log(splitdata)

  // let splitdata = search.monthyear.split('-')
  console.log(splitdata)
  let month = splitdata[1]
  let year = splitdata[0]
  this.taskservice.Attendanceexceldownloadtime(month, year)
    .subscribe((data) => {
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data);
      typeof(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Attendance Report' + ".xlsx";
      link.click();
    }, error => {
      this.SpinnerService.hide()
    })

}



getAttendanceBasedOnEmployee(data, dates) {
  console.log(data, dates)
  let dataGetIDEMP = data?.id

  let search = this.attendanceReportsearchForm.value;

  let monthyeardata: any = this.datePipe.transform(search.monthyear, 'yyyy-MM')
  // let splitdata = search.monthyear.split('-')
  let splitdata = monthyeardata.split('-')
  console.log(splitdata)

  // this.daysInMonth(splitdata[1], splitdata[0])
  let month = splitdata[1]
  let year = splitdata[0]
  this.taskservice.getPerMonthActivityOfEmp(month, year, dataGetIDEMP)
    .subscribe(results => {
      console.log("this.MonthlyActivityReport data", results)
      let data = results["data"]
      this.MonthlyActivityReport = data

    })
}


getSelectedEMP(index, type) {
  console.log("datascheck datascheck datascheckdatascheck", index)

  if (type == 'summary') {
    // let seperatingDayFromDate = new Date(index)
    // let dayseperate = seperatingDayFromDate.getDate()
    // let numSeperate = Number(dayseperate)
    // this.selectedclass = numSeperate - 1
    // console.log("day for summary", dayseperate, numSeperate, this.selectedclass)
    let indexFind = this.ListOfDaysInSelectedMonth.indexOf(index) 
    console.log("findin index of Date", indexFind)
    this.selectedclass = indexFind
  }
  else if (type == 'popup') {
    this.selectedclass = index
  }

}

DatesBadge = null;  
activityData(data, type, fulldata?: any) {
  console.log("Activity b4", data, fulldata, this.SelectedemployeeID)
  let id;
  if (type == 'summary') {
    id = fulldata?.id
    this.SelectedemployeeID = fulldata?.id
    this.BasicDetails = fulldata
  }
  if (type == 'popup') {
    id = this.SelectedemployeeID
  }
  console.log("Activity", data, fulldata, this.SelectedemployeeID, this.BasicDetails)
  console.log("Activity particular date", this.BasicDetails[data])
  this.ActivityDataList = data
  this.DatesBadge = this.BasicDetails[data] 
  // if(data.includes(null, undefined, '') || id.includes(null, undefined, '') ){
  //   return false 
  // }

  this.taskservice.getActivitySinglelog(data, id)
    .subscribe(results => {
      let data = results
      this.logActivityList = data
      console.log("logActivityList", this.logActivityList)
    })
  }
  ///employee team details

// reportpage:any=[]
searchreportpage:any=[]
Teamwisereport(){
  this.teamreport(this.reportpresentpage)
}
teamreport(page){
  this.teammeberdetail=true
  this.query_report = false
    this.taskmaker =false
    // this.taskmaker =false
    this.Carddetails=false
    this.taskapprover =false
    this.taskcreate = false
    this.taskview = false
    this.Tasksumarydetails=false
    this.MyTask = false
    this.taskmetrics = false
    this.TimeSheet = false
    this.taskreport=false
    this.ShowViewDetailsTable=false  
    this.SpinnerService.show()
    this.taskservice.TeamSumarryFullReport(this.employ_id,page,this.fd,this.tod,this.cli_id,'',this.project_id,this.tl_id).subscribe(result=>{
      console.log('team detais',result)
      this.searchreportpage=result['data']
      this.SpinnerService.hide()
      let dataPagination = result['pagination'];
      this.has_next_emp = dataPagination.has_next;
      this.has_pre_emp = dataPagination.has_previous;
      this.reportpresentpage = dataPagination.index;
    console.log("Client_list",result)
    })
}
reportdetailspage(hint: any) {
  let obj = 1 
  let a=(this.reportpresentpage + 1)
  let b=(this.reportpresentpage - 1)
  let c=(10)
  if (hint == 'next') {
    this.teamreport(a)
  }
  else if (hint == 'previous') {
    this.teamreport(b)
  }
  else {
    this.teamreport(c)
  }

}
cli_id:any=[];
project_id:any=[];
employ_id:any=[];
tl_id:any=[];
fd:any=[]
tod:any=[]
TeamTaskSummarySearch(hint: any) {
  let searchsum = this.teammemberForm.value;
  searchsum.from_date = this.datepipe.transform(searchsum.from_date, 'yyyy-MM-dd');
  searchsum.to_date = this.datepipe.transform(searchsum.to_date, 'yyyy-MM-dd');
  // let array =this.chipSelectedempid
  // let obj = {
    let from_date = searchsum?.from_date;
    let to_date = searchsum?.to_date;
    let client = searchsum?.client?.id;
    let projectname = searchsum?.projectname?.id;
    let teamlead=searchsum?.teamlead?.id;
    let emp_id=searchsum?.emp_id?.id;
    this.cli_id=client;
    this.project_id=projectname;
    this.employ_id=emp_id
    this.tl_id=teamlead;
    this.fd=from_date;
    this.tod=to_date
    
  this.SpinnerService.show()
  
    this.taskservice.TeamSumarryFullReport(emp_id,this.reportpresentpage,from_date,to_date,client,'',projectname,teamlead).subscribe(data=>{
      this.searchreportpage=data['data'];
      console.log("report page serach",this.searchreportpage)
    let emp_name=this.searchreportpage[0]['Employee'];
     let unit_head=this.searchreportpage[0]['Unit head'];
    let team_head=this.searchreportpage[0]['Team lead'];
     this.employye_name=emp_name;
     this.unit_lead=unit_head;
     this.team_lead=team_head;
 
       this.SpinnerService.hide();
        if (this.searchreportpage.length > 0) {
       let dataPagination = data['pagination'];
        this.has_next_emp = dataPagination.has_next;
        this.has_pre_emp = dataPagination.has_previous;
        this.reportpresentpage = dataPagination.index;
      console.log("Client_list",data)
      }
 
},(error)=>{
  this.SpinnerService.hide();
});
}
teamresetfield(){
  this.teammemberForm.reset();
  // this.employeFullDetails(this.emp_id,1);    this.modumoduledetailspresentpage,from_date,to_date,client,'',projectname
}

teamback(){
  this.teammeberdetail=false;
  this.taskreport=true;
  this.Carddetails=true;
}

//emloyeee details module level spent
moduledetailspage(hint: any) {
  let obj = 1 
  let a=(this.modumoduledetailspresentpage + 1)
  let b=(this.modumoduledetailspresentpage - 1)
  let c=(10)
  if (hint == 'next') {
    this.employeFullDetails(this.emp_id,a)
  }
  else if (hint == 'previous') {
    this.employeFullDetails(this.emp_id,b)
  }
  else {
    this.employeFullDetails(c)
  }

}

back(){
  this.Tasksumarydetails=false;
      this.taskreport = true;
      this.Carddetails=true;
      this.tasksumarryForm.reset();
 
}
tlemploye:any=[]
tlemployee(tl){
  this.taskservice.tlemployee(tl.id).subscribe(result =>{
    console.log("employeeFullDetails",result)
    this.employeels=result;
    })   
}
teamleademploee(){
  console.log(this.employeels)
}

moduledetails:any=[];
employye_name:any=[];
unit_lead:any=[];
// modulepagination:any=[];
team_lead:any=[];
emp_id:any;
employeFullDetails(id,page=1){
  this.emp_id=id;
  this.SpinnerService.show();
  this.Tasksumarydetails=true
      this.taskmaker =false
      this.taskreport = false
      this.taskapprover =false
      this.taskcreate = false
      this.taskview = false
      this.MyTask = false 
      this.taskmetrics = false
      this.TimeSheet = false
      this.Carddetails=false
      this.query_report=false
      
  this.taskservice.TaskSumarryFullReport(id,page).subscribe(result =>{
    console.log("employeeFullDetails",result)
    this.moduledetails=result['data'];
   // this.modulepagination=result['pagination']
    console.log("employe full details:",this.moduledetails)
    let emp_name=this.moduledetails[0]['Employee'];
    let unit_head=this.moduledetails[0]['Unit head'];
    let team_head=this.moduledetails[0]['Team lead'];
    this.employye_name=emp_name;
    this.unit_lead=unit_head;
    this.team_lead=team_head;
    this.SpinnerService.hide();
    console.log("emoloyee name",this.employye_name)
    console.log("unit name",this.unit_lead)
    console.log("team lead name",this.team_lead)
    console.log("the employe&team&list",this.moduledetails)
    // console.log("pagenation",this.modulepagination)

    let dataPagination = result['pagination'];
        if (this.moduledetails.length > 0) {
          this.has_next_module = dataPagination.has_next;
          this.has_pre_module = dataPagination.has_previous;
          this.modumoduledetailspresentpage = dataPagination.index;
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }) 
  
}



serviceCallAttendanceReportSummary(search, pageno, pageSize) {
  this.taskservice.FullattendanceReport(search, pageno)
    .subscribe(result => {
      this.SpinnerService.hide();
      console.log("Attandance report details",result['details'])
      console.log("AttendanceReport summary", result, result['pagination'])
      
      /////// To extract header
      this.ListOfDaysInSelectedMonth = []
      let AttendaanceHeaderDate
      let AttendaanceData = result["data"]
      let dataPagination = result['pagination'];
      if(result["data"]?.length == 0){
        this.has_nextattreport = dataPagination?.has_next;
        return false 
      }
      for(let i=0; i<1; i++ ){
        console.log("data form loop index")
        AttendaanceHeaderDate = Object.keys(AttendaanceData[i]) 
      } 
      let dataToRemove = this.RemoveFromreport
      let ActualDates = AttendaanceHeaderDate.filter( item => !dataToRemove.includes(item))
      this.ListOfDaysInSelectedMonth = ActualDates  
      console.log("this.ListOfDaysInSelectedMonth", this.ListOfDaysInSelectedMonth)
    ////////////////////////////
      
      let FullData = result['data'];
      this.arrtime=result['details'];

      this.has_nextattreport = dataPagination?.has_next;
      this.has_previousattreport = dataPagination?.has_previous;
      this.presentpageattreport = dataPagination?.index;
      if (this.arrReport?.length == 0) {
        this.arrReport = FullData
        this.arrtime_1 = this.arrtime
      }

      else if(this.arrReport?.length > 0){
        
        this.arrReport = this.arrReport.concat(result['data'])
        this.arrtime_1=this.arrtime_1.concat(result['details'])
      }

      console.log("arr report data for ngfor", this.arrReport)
      console.log("Reort in arrtime",this.arrtime_1)
       
    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
}

monyear = new FormControl(moment())
chosenYearHandler(normalizedYear: Moment) {
  const ctrlValue = this.monyear.value;
  ctrlValue.year(normalizedYear.year());
  this.monyear.setValue(ctrlValue);
}
chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
  const ctrlValue = this.monyear.value;
  ctrlValue.month(normalizedMonth.month());
  this.monyear.setValue(ctrlValue);
  datepicker.close();
  this.attendanceReportsearchForm.patchValue({
    monthyear: this.monyear.value
  })
}





Present_Data = { name: 'Present', display: 'P', title: 'Present'   }
Absent_Data = { name: 'Absent', display: 'A', title: 'Absent'     }
Leave_Data = { name: 'Leave', display: 'L', title: 'Leave'    }
Halfday_Data = { name: 'Half day', display: 'HD', title: 'Half Day'    }
Holiday_Data = { name: 'Holiday', display: 'H', title: 'Holiday'    }
Weekend_Data = { name: 'Weekend', display: 'W', title: 'Weekend'    }
WFH_Data = { name: 'WFH', display: 'WFH',  title: 'Work From Home'    }
CL_Data = { name: 'CL', display: 'CL', title: 'Casual Leave'    }
PL_Data = { name: 'PL', display: 'PL', title: 'Planned Leave'    }
SL_Data = { name: 'ML', display: 'SL', title: 'Sick / Medical Leave'   }
OD_Data = { name: 'OD', display: 'On Duty', title: 'On Duty'    }
ApprovedLeave_Data = { name: 'Leave Approved', display: 'LA' , title: 'Leave Approved'   }
PendingLeave_Data = { name: 'Leave Pending', display: 'LP' , title: 'Leave Pending'   }
Permission_Data = { name: 'PRM', display: 'PRM' , title: 'Permission'   }
In_Data = { name: 'IN', display: 'In' , title: 'In / Checked In' }
Out_Data = { name: 'OUT', display: 'Out' , title: 'Out / Checked out' }
NotIn_Data = { name: 'NOT IN', display: 'NP' , title: 'Not In / Yet To Check' }
Updated_Attendance_Data = { name: 'Is_updated', display: '!' , title: 'edited' }

getToolTip(dataSummary, data, datascheck){ 
console.log("Loop data attendance", dataSummary, data, dataSummary[datascheck] )
}
showHide: boolean = false
Toggle(){
console.log("show hide", this.showHide)
   if(this.showHide == true){
    this.showHide = false 
   }
   else{
    this.showHide = true 
   }
}

getTeamLeads(teamldkeyvalue) {
  this.taskservice.getTeamLeadFilter(teamldkeyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.teamldList = datas;
      console.log("The team leads ",results)
    })
}


deptList =  null 
org_idList  = null 
getDepartment(teamldkeyvalue) {
this.taskservice.getDepartment(teamldkeyvalue,1)
  .subscribe((results: any[]) => {
    let datas = results["data"];
    this.deptList = datas;
  })


}

public displayFnDept(teamld?: Emplistss): string | undefined {
return teamld ? teamld.name : undefined;
}



getorg_id(data) { 
console.log(data)
this.taskservice.getEmpBasedOrgDetails(data,1) 
  .subscribe((results: any[]) => {
    let datas = results["data"];
    this.org_idList = datas;
  })
 
}

public displayFnorg_id(teamld?: Emplistss): string | undefined {
return teamld ? teamld.name : undefined;
}







Filterlist: any 

getFilterBasedOnDate(date){
console.log(date)
if(this.PresentDate == date){
  this.Filterlist = [{id: "1", text: 'In'}, {id: "2", text: 'Out'}, {id: "0", text: 'Not In'}]
}
else{
  this.Filterlist = [{id: "1", text: 'Present'}, {id: "3", text: 'Absent'}, 
  {id: "0", text: 'Leave'}, {id: "2", text: 'Half Day'}]
}


}

checkdata(data, datascheck, datadatscheck){ 
console.log("data to check for ", data, datascheck, data[datascheck], datadatscheck)

}

}

export const DATE_FORMAT_2 = {
parse: {
  dateInput: 'MM/YYYY',
},
display: {
  dateInput: 'MMM YYYY',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
},
};


@Directive({
selector: '[dateFormat2]',
providers: [
  {
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
  },
  { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_2 },
],
})
export class FullCustomDateFormat2 { }







