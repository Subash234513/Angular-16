import { Component, OnInit, ViewChild } from '@angular/core';
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
import {
  NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE,
} from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import * as imp from '../../AppAutoEngine/import-services/CommonimportFiles';
import { TaskManagerService } from 'src/app/task-manager/task-manager.service';
import { TaskService } from 'src/app/taskreport/task.service';
// import { ShareService } from '../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { COMMA, E, ENTER } from '@angular/cdk/keycodes';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { DialogfilterComponent } from '../dialogfilter/dialogfilter.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TooltipPosition } from '@angular/material/tooltip';
// import { ThrowStmt } from '@angular/compiler';
import { ShareddataService } from '../shareddata.service';

const moment = _rollupMoment || _moment;
export interface Emplistss {
  id: string;
  full_name: string;
  name: string;
}
export interface modulelists{
  id:string;
  client_code:string;
  module_name:string;
}
export interface statusclient {
  id: string;
  name: string;
  text: string;
}
export interface popupClient {
  id: string;
  name: string;
}
export interface clientlists{
  id:string;
  client_code:string;
  client_name:string;
}
export interface moduleclient {
  id: string;
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
  code: string;
}
export interface tproject_head_Name {
  id: string;
  name: string;
  code: string;
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
  code: string;
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
export interface Sprint {
  id: string;
  name: string;
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
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe, imp.HrmsAPI
  ],
  animations: [
    trigger('displayState', [
      state('false', style({ overflow: 'hidden', height: '0px', opacity: '0', })),
      state('true', style({ overflow: 'hidden', height: '*', opacity: '*' })),
      transition('false => true', animate('200ms ease-in')),
      transition('true => false', animate('200ms ease-out'))
    ]),
  ]
})
export class IssuesComponent implements OnInit {
  selectedDate: Date;
  sprintfilter:[{"name":"Start Date","id":1},{"name":"End Date","id":2},{"name":"Query","id":3}]
  sprintfilterss:[{"name":"Start Date","id":1},{"name":"End Date","id":2},{"name":"Query","id":3},{"name":"Team","id":4},{"name":"Sprint","id":5}]
  taskfilter:[{"name":"Start Date","id":1},{"name":"End Date","id":2},{"name":"Query","id":3},{"name":"App id","id":4},{"name":"Client ","id":5},{"name":"Module id  ","id":6},{"name":"Priority ","id":7},{"name":"Status ","id":8}]
  backlogfilter:[{"name":"Start Date","id":1},{"name":"End Date","id":2},{"name":"Query","id":3},{"name":"App id","id":4},{"name":"Client ","id":5},{"name":"Module id  ","id":6},{"name":"Developer id ","id":7},{"name":"Team lead ","id":8}]
  pipelinefilter:[{"name":"Start Date","id":1},{"name":"End Date","id":2},{"name":"Pipeline Status","id":3},{"name":"App id","id":4},{"name":"Client ","id":5},{"name":"Module id  ","id":6},{"name":"Developer id ","id":7},{"name":"Team lead ","id":8}]
  issuefilter:[{"name":"Start Date","id":1},{"name":"End Date","id":2},{"name":"Query","id":3},{"name":"App id","id":4},{"name":"Client ","id":5},{"name":"Module id  ","id":6},{"name":"Priority  ","id":7},{"name":"Status ","id":8}]
  Tran_Menu_List : any;
  statusList = [{ 'id': 1, 'name': 'Createdby Me' }, { 'id': 2, 'name': 'Others' }];
  returnnav: number;
  startdate:boolean=false
  enddate:boolean=false
  query:boolean=false
  app_id:boolean=false
  client:boolean=false
  module_id:boolean=false
  priority:boolean=false
  statuss:boolean=false
  statusss:boolean=false
  developer_id : boolean=false
  team_lead  : boolean=false
  pipeline_status : boolean=false
  team:boolean=false
  sprintss:boolean=false
  inpstartdatesprint:any
  inpenddatesprint:any
  taskcreate: boolean;
  isShowTasksummary: boolean = false;
  isShowStory: boolean;
  isShowStorySpr : boolean;
  storycreate: boolean;
  storyiew: boolean;
  story_taskView: boolean;
  sprintcreate: boolean;
  isShowSprint: boolean;
  taskSearchForm: FormGroup;
  statusdrops:any
  taskList: any;
  presentpageTask: number = 1;
  summarypage: number = 1;
  pagesizetask = 10;
  has_nextTask = true;
  has_previousTask = true;
  empList: emplistss[];
  public chipSelectedemp: emplistss[] = [];
  public chipSelectedempid = [];
  public chipSelectedempid1 = [];
  appNameList: Array<appName>;
  clientList: Array<Client>;
  moduleNameList: Array<ModeuleName>;
  unitheadList: Array<unitHead>;
  teamldList: Array<teamLead>;
  developerList: Array<Developer>;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  client_Id = 0;
  project_Id = 0;
  clientlist: Array<clientlists>
  summarySearchForm: FormGroup;
  TLFormForReject: FormGroup;
  taskreportForm: FormGroup;
  tasksumarryForm: FormGroup;
  teammemberForm: FormGroup;
  taskstatusForm: FormGroup;
  trclientList: Array<Client>;
  trappNameList: Array<appName>;
  storySummaryForm: FormGroup;
  sprintSummaryForm: FormGroup;
  sprintSummaryFormss: FormGroup;
  taskSummaryForm: FormGroup;
  isShowBacklog: boolean;
  backlogSummaryForm: FormGroup;
  isShowIssues: boolean = true;
  IssueSummaryForm: FormGroup;
  searclos: boolean;
  sprintFilterForm: FormGroup;


  hasnextdevname = true;
  haspreviousdevname = true;
  currentpagedevname: number = 1;
  status = new FormControl();

  detailsArray: string[] = [];
  idArray: string[] = [];
  nameArray: string[] = [];
  codeArray: string[] = [];

  storyList: any;
  isstorypage: boolean = true;
  storypresentpage: number = 1;
  storypagesize = 10;
  has_storynext = true;
  has_storyprevious = true;
  storyViewDaata: any;
  story_TaskViewData: any;
  storyId: any;
  storyTaskList: any;
  has_previousStoryTask:boolean = true;
  has_nextStoryTask: boolean= true;
  presentpageStoryTask: number = 1;
  presentpageSprint: number = 1;
  pagesizeStoryTask = 10;
  story_ID: any;
  sprintList: any;
  has_sprintprevious = true;
  has_sprintnext = true;
  sprintpresentpage: number = 1;
  showTasksPage: boolean = false;
  storiesForm: FormGroup;
  page = 2;
  value: any;
  isShowStorySummary: boolean = true;
  showTasksVuews: boolean = false;
  isStorySearch: boolean = true;
  backlogList: any;
  taskedit: boolean;
  objs: any;
  pageNumbersContainer = document.querySelector('.cus-pageNumbers');
  nextButton = document.querySelector('.cus-btnNext');
  issueList: any;
  reassignForm: FormGroup;
  @ViewChild(MatAutocompleteTrigger) autocompleteTriggers: MatAutocompleteTrigger;
  @ViewChild('emps') matempAutocompletes: MatAutocomplete;
  @ViewChild('empInputs') empInputs: any;
  @ViewChild('closebutton') closebutton;
  pipeList: any;
  showMoreInfo: boolean;
  issuecreate: boolean = false;
  storySearchForm: FormGroup;
  allChecked : boolean = false;
  showMoveToTaskButton: boolean = false;
  selectedItems: any[] = [];
  today: Date = new Date();

  pipelineSummaryForm: FormGroup;
  sprintFilterForms: FormGroup;
  formArray: FormArray;
  issueView: boolean;
  showChatbox = false;
  isShowbuttons : boolean = false;
  isShowComments: boolean = false;
  isShowWorklogs: boolean = false;
  isShowCommentTask: boolean = false; 
  isShowHistory : boolean = false;
  clientdata : any;
  moduledata : any;
  filteredOptions: any[] = [];
  sprintlsts: any;
  selectedFilters: any[] = [];
  





  @ViewChild('appnm') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('appnmInput') appnmInput: any;
  @ViewChild('taskunithead') mattaskunitempAutocomplete: MatAutocomplete;
  @ViewChild('taskunitheadInput') taskunitheadInput: any;
  @ViewChild('clt') matclientAutocomplete: MatAutocomplete;
  @ViewChild('cltInput') cltInput: any;
  @ViewChild('clientInput') clientInput: any;
  @ViewChild('clientrole') matappAutocomplete: MatAutocomplete;

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
  @ViewChild('moduleInput') moduleInput: any;
  @ViewChild('developerinput') developerinput: any;
  // @ViewChild('clientrole') matappAutocomplete: MatAutocomplete;
  @ViewChild('teamsrole') matappAutoteamcomplete: MatAutocomplete;
  @ViewChild('modulerole') matmoduleAutocomplete: MatAutocomplete;
  @ViewChild('developerrole') matdevelopAutocomplete: MatAutocomplete;
  @ViewChild('teamrole') matteamleadsAutocomplete: MatAutocomplete;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  empLists: any;
  isShowPipelines: boolean;
  dataPagination: any;
  pageNumbers: any = 1;
  pageSize: any = 10;
  dataPaginationSpr: any;
  pageNumb: any = 1;
  pageNumbt: any = 1;
  dataPaginationt: any;
  storysId: any;
  selectedItem: any;

  storiesget: any;
  sprintdata: any;
  storysList: any;
  pageNumbi : any = 1;
  droplist: any;
  textValues = [{ id: 'startdate', name: "Start Date" }, { id: 'enddate', name: "End Date" }]
  storyrId: any;
  // assigns =[
  //   { id: 1, name: 'For Me' },
  //   { id: 2, name: 'For My Team' },
  //   { id: 3, name: 'All' }
  // ]; 
  assigns = [];
  status_id:any;
  singleissueViewData: any;
  commentText: string = '';
  commentTexts: string = '';
  selectedFile: File | null = null;
  showCommentBox: boolean = false;
  showCommentBoxs: boolean = false;
  commenthistoryarr: any;
  issueId: any;
  commenthistoryarrs: any;
  button1Styles = {
    'background-color': 'white',
    color: '#172b4d'
  };
  button2Styles = {
    'background-color': 'white',
    color: '#172b4d'
  };
  button3Styles = {
    'background-color': 'white',
    color: '#172b4d'
  };
  button4Styles = {
    'background-color': 'white',
    color: '#172b4d'
  };
  send_value: string;
  pipelinecreate: boolean;
  pagePipe : any = 1;
  statusLists: { name: string; }[];
  isLastPage: boolean = true;
  filterForm: FormGroup;
  showPopup: boolean = false;
  showPopupss: boolean = false;
  taskpopup : boolean = false;
  taskPopups : boolean = false;
  backlogPopus : boolean = false;
  issuePopus : boolean = false
  pipelinePopup : boolean = false
  teamList : any;
  assignForm: FormGroup;
  showpagedata : boolean = true;

  showtabledatas: boolean = true
  appdrop: any;
  clientdrop: any;
  moduledrop: any;
ststusdrop: any;
prioritydrop: any;
  taskview: boolean;
  client_name: any;

  constructor( private fb: FormBuilder, private router: Router, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService,
    private TaskManagerService: TaskManagerService, private datepipe: DatePipe, private taskreportservice: TaskService,
    private notification: NotificationService, private datePipe: DatePipe, private shareservice: SharedService,
    private dialog: MatDialog, private taskmanagerservice: TaskManagerService, private localservice : ShareddataService
) { }

  ngOnInit(): void {
    

    this.IssueSummaryForm = this.fb.group({
      srint: '',
      team: '',
      type: '',
      status: '',
      client:'',
      module:'',
      code:'',
      from_date:'',
      to_date:'',
      issue_status:'',
      dynamicdropdown:'',
      start_date:'',
      end_date:'',
      query:'',
      app_id:'',
      module_id:'',
      priority:'',
      statusss:'',
      





    })
    this.clientSearch();
    this.moduleSearch();
    this.issueSearch('');
    this.getPrioritydrop()
  }


  issueSummary(obj,page) {
    this.SpinnerService.show();
    this.TaskManagerService.getIssueSummary(obj,page)
      .subscribe(result => {
        
        console.log("story task summary", result)
        this.issueList = result['data']
        let dataPagination = result['pagination'];
        // this.issuePopup()
        this.issuePopus = false
        if (this.issueList.length >= 0) {
          this.has_nextStoryTask = dataPagination.has_next;
          this.has_previousStoryTask = dataPagination.has_previous;
          this.presentpageStoryTask = dataPagination.index;
          
        }
        this.SpinnerService.hide();

      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      

      )
  }
  issueSearchs()
{
  let formValue = this.IssueSummaryForm.value;
  console.log("Search Inputs",formValue )
  this.send_value = ""
  if(formValue.code)
 {
   this.send_value=this.send_value+"&code="+formValue.code
 }
 if(formValue.client)
 {
   this.send_value=this.send_value+"&client="+formValue.client
 }
 if(formValue.module)
 {
   this.send_value=this.send_value+"&module="+formValue.module
 }
 
 if(formValue.from_date)
 {
   this.send_value=this.send_value+"&from_date="+  this.datepipe.transform((formValue.from_date),'yyyy-MM-dd')
 }
 if(formValue.to_date)
 {
   this.send_value=this.send_value+"&to_date="+ this.datepipe.transform((formValue.to_date),'yyyy-MM-dd')
 }
 if(formValue.transaction_from_date)
 {
   this.send_value=this.send_value+"&transaction_from_date="+ this.datepipe.transform((formValue.transaction_from_date),'yyyy-MM-dd')
 }
 if(formValue.issue_status)
 {
   this.send_value=this.send_value+"&issue_status="+ formValue.issue_status
 }

let pagen = 1
 this.taskmanagerservice.issueSearch(this.send_value, pagen).subscribe(results=> {
  this.issueList = results['data'];
})
}

onClientChange(event: any):void
{
  this.issueSearch('');
}

clientSearch()
{
  this.taskmanagerservice.getClientData().subscribe(
    results=>{
      this.SpinnerService.hide()
          this.clientdata = results['data']
          this.client_name=this.clientdata.name
        return true 
      }, error =>{
      this.SpinnerService.hide()
      
      
      }) 
}
moduleSearch()
{
  // this.taskmanagerservice.getModuleData().subscribe(
  //   results=>{
  //     this.SpinnerService.hide()
  //         this.moduledata = results['data']
  //       return true 
  //     }, error =>{
  //     this.SpinnerService.hide()
      
      
  //     }) 
}
public displayFnclient(clt?: popupClient): string | undefined {
  console.log(`Client testing data - ${clt.name}`);
  return clt ? clt.name : undefined;
}
public displayclient(modulerole?: modulelists): string | undefined {
  return modulerole ? modulerole.module_name : undefined;
}
public displaymoduleclient(clt?: moduleclient): string | undefined {
  // console.log(`Client testing data - ${clt.name}`);
  return clt ? clt.name : undefined;
}
public displaystatusleadclient(clt?: statusclient): string | undefined {
  // console.log(`Client testing data - ${clt.text}`);
  return clt ? clt.name : undefined;
}

// statusclick(){
//   let devkeyvalue: String = "";
//   // this.getsprint(devkeyvalue);
//   // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
//   this.taskSummaryForm.get('team').valueChanges
//     .pipe(
//       debounceTime(100),
//       distinctUntilChanged(),
//       tap(() => {
//         this.isLoading = true;
//         console.log('inside tap')

//       }),
//       switchMap(value => this.TaskManagerService.gesta(value)
//         .pipe(
//           finalize(() => {
//             this.isLoading = false
//           }),
//         )
//       )
//     )
//     .subscribe((results: any[]) => {
//       let datas = results["data"];
//       this.statusdrops = datas;




//     })

// }



movetoTaskData()
{
  let payload = {"id": this.issueId,
"status": 2}
  this.taskmanagerservice.issuetoTask(payload).subscribe(results=>{
    if(results.status)
    {
    this.SpinnerService.hide()
    this.notification.showSuccess(results.message)
    this.issueView = false;
    this.isShowIssues = true;

    return true 
    }
    else if(results.code)
    {
      this.notification.showError(results.description);
    }
  
    
  })
}
InvalidIssue()
{
  let payload = {"id": this.issueId,
  "status": 3}
    this.taskmanagerservice.issuetoTask(payload).subscribe(results=>{
      if(results.code){
        this.notification.showError(results.description);
      this.SpinnerService.hide()}
      else{
      this.notification.showSuccess(results.message)
      this.issueView = false;
    this.isShowIssues = true;
      return true 
      this.SpinnerService.hide()
    } 
      
})
}

DuplicateIssue()
{
  let payload = {"id": this.issueId,
  "status": 4}
    this.taskmanagerservice.issuetoTask(payload).subscribe(results=>{
      this.SpinnerService.hide()
      this.issueView = false;
    this.isShowIssues = true;
      this.notification.showWarning("Issue marked as Duplicate")
      return true 
    }, error =>{
    this.SpinnerService.hide()
   
      
    })
}
updatePaginationIss() {
  let obj = {
    "start_date": '',
    "end_date": '',
    "query": '',
    "status": '',
  }
  if (this.pageNumbers >= 1) {
    this.pageNumbers = Math.max(this.pageNumbers, 1);
  this.issueSummary(obj,this.pageNumbers)
  }
}
previousPage():void {
  if (this.has_previousStoryTask ) {
    this.pageNumbers = this.pageNumbers - 1;
  this.updatePaginationIss();
  }
}
nextPage():void {
  if (this.has_nextStoryTask) {
    this.pageNumbers = this.pageNumbers + 1;
  this.updatePaginationIss();
  }
}
isNextPageAllowed(): boolean {
  return this.pageNumbers > 10; 
}
SubmitbackToIssue()
{

}
saveComment() {
  // Here, you can handle the logic to save the comment and the attached file.
  console.log('Comment Text:', this.commentText);
  console.log('Selected File:', this.selectedFile);
  let payload = {
    "comment": this.commentText
  }
  // this.issueId = 1;

  this.taskmanagerservice.addComment(payload, this.issueId).subscribe(
    results=>{
      this.SpinnerService.hide()
        this.notification.showSuccess("Comment Added")
        this.commentText = '';
        this.getCommentHistory();
        
        // this.OnSubmit.emit() 
        return true 
      }, error =>{
      this.SpinnerService.hide()
      
      
      }) 

}
toggleCommentBox() {
  this.showCommentBox = true;
  this.getCommentHistory();
}
getCommentHistory()
{
  this.taskmanagerservice.getCommentHistory(this.issueId).subscribe(
    results=>{
      this.SpinnerService.hide()
          this.commenthistoryarr = results['data']
        // this.OnSubmit.emit() 
        return true 
      }, error =>{
      this.SpinnerService.hide()
      
      
      }) 
  // this.commenthistoryarr =  [
  //       {
  //           "comment": "issue1",
  //           "created_by": {
  //               "code": "EMP001",
  //               "id": 1,
  //               "name": "monesh jai"
  //           },
  //           "created_date": 1697177245653,
  //           "id": 1,
  //           "ref_id": 1,
  //           "ref_type": {
  //               "id": 1,
  //               "name": "Task"
  //           }
  //       },
  //       {
  //           "comment": "issue2",
  //           "created_by": {
  //               "code": "EMP001",
  //               "id": 1,
  //               "name": "monesh jai"
  //           },
  //           "created_date": 1697182602176,
  //           "id": 2,
  //           "ref_id": 1,
  //           "ref_type": {
  //               "id": 1,
  //               "name": "Task"
  //           }
  //       }
  //   ]

}

issuePopup(){
  this.issuePopus = !this.issuePopus;
  console.log("this.issuePopus",this.issuePopus)
  this.issuefilter=[{"name":"Start Date","id":1},{"name":"End Date","id":2},{"name":"Query","id":3},{"name":"App id","id":4},{"name":"Client ","id":5},{"name":"Module id  ","id":6},{"name":"Priority  ","id":7},{"name":"Status ","id":8}]
}
onFileSelect(event: any) {
  this.selectedFile = event.target.files[0];
}
downloadfile(data)
{
  // this.taskmanagerservice.downloadIssueData(data.file[0].file_id).subscribe(res=>{
  //   this.SpinnerService.hide()
  //     let binaryData = [];
  //     binaryData.push(res)
  //     let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
  //     let link = document.createElement('a');
  //     link.href = downloadUrl;
  //     link.download = 'new'+".pdf";
  //     link.click();
  //     }, error=>{
  //       this.SpinnerService.hide()
  //     })
  this.taskmanagerservice.downloadIssueData(data.file[0].file_id).subscribe(
    (res: any) => {
      this.SpinnerService.hide();

      // Determine the content type (MIME type) from the response
      const contentType = res.type;

      // Create a blob for the response
      const blob = new Blob([res], { type: contentType });

      // Create a download link element
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);

      // Set the appropriate download filename based on the content type
      let filename = 'new.pdf'; // Default filename for unknown types

      if (contentType === 'application/pdf') {
        filename = 'new.pdf';
      } else if (contentType === 'image/png') {
        filename = 'new.png';
      } else if (contentType === 'application/msword') {
        filename = 'new.doc';
      } else if (contentType === 'application/vnd.ms-excel') {
        filename = 'new.xls';
      }

      link.download = filename;

      // Trigger the download by clicking the link
      link.click();
    },
    (error: any) => {
      this.SpinnerService.hide();
      console.error('Error:', error);
    }
  );
    
  }
  public displayappclient(clientrole?: clientlists): string | undefined {
    return clientrole ? clientrole.client_name : undefined;
  }
  onclickIssueAdd() {
    
    this.issuecreate = true;
    this.isShowIssues = true;
  }
  issueView_backnavigate()
  {
    this.issuecreate = false;
    this.isShowIssues = true;
    this.closebutton.nativeElement.click();
    this.issueSearch('');
    this.pageNumbers = 1;
  }
  getparticularIssue(issue)
{
  this.issueView = true;
//   this.singleissueViewData = {
//     "code": "ISSU001",
//     "created_by": {
//         "code": "EMP001",
//         "full_name": "monesh jai",
//         "id": 1
//     },
//     "created_date": 1696510661714,
//     "description": "descj",
//     "file": [
//         {
//             "file_id": "TASK_1",
//             "file_name": "Screenshot (5).png",
//             "id": 13
//         }
//     ],
//     "id": 1,
//     "issue_status": {
//         "id": 1,
//         "name": "Open"
//     },
//     "priority_type": {
//         "id": 1,
//         "text": "Normal"
//     },
//     "project": {
//         "app": "VoW",
//         "client": "KVB",
//         "module": "PRPO",
//         "project_id": 1
//     }
// }
 this.issueId = issue.id;
  this.taskmanagerservice.getIssueFetch(issue.id).subscribe(res=>{
      this.singleissueViewData = res;
 
  })
}

issueSearch(hint: any) {
  
  const statusid = this.IssueSummaryForm.get('status')?.value?.id
  if(statusid){
    this.status_id.push(statusid);
  }
  else{
    this.status_id=''
  }
  
  console.log("inpstartdatesprint",this.inpstartdatesprint)
console.log("inpenddatesprint",this.inpenddatesprint)
  let search = this.IssueSummaryForm.value;
  // IssueSummaryForm
  search.start_date = this.datepipe.transform(search.start_date, 'yyyy-MM-dd');
  search.end_date = this.datepipe.transform(search.end_date, 'yyyy-MM-dd');
  let obj = {
    "from_date": search?.start_date,
    "to_date": search?.end_date,
     "query": search?.query,
    "issue_status":this.status_id,
    //  "team": search?.team,
    "app_id": search?.app_id?.id,
    "client_id": search?.client,
    "module_id": search?.module_id?.id,
    //  "developerid": search?.developer_id?.id,
    //  "team_lead": search?.team_lead?.id,
    "priority":search?.priority?.id

  }
  console.log("obj api", obj)
  for (let i in obj) {
    if (obj[i] == undefined || obj[i] == null) {
      obj[i] = '';
    }
  }
  // this.SpinnerService.show();

  if (hint == 'next') {
    this.issueSummary(obj, this.sprintpresentpage + 1)
  }
  else if (hint == 'previous') {
    this.issueSummary(obj, this.sprintpresentpage - 1)
  }
  else {
    this.issueSummary(obj, 1)
  }
  this.status_id=[];
}
startdateclick(e){
    
  console.log("inpstartdatesprint",this.datepipe.transform(e.value, 'dd-MMM-yyyy'))
  this.inpstartdatesprint="Start date :"+this.datepipe.transform(e.value, 'dd-MMM-yyyy')

console.log("inpstartdatesprint",this.inpstartdatesprint)

}
enddateclick(e){
console.log("inpenddatesprint",this.datepipe.transform(e.value, 'dd-MMM-yyyy'))
this.inpenddatesprint="End date :"+this.datepipe.transform(e.value, 'dd-MMM-yyyy')
console.log("inpenddatesprint",this.datepipe.transform(e.value, 'dd-MMM-yyyy'))
}
moduleClick() {
  let devkeyvalue: String = "";
  // this.getsprint(devkeyvalue);
  // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
  this.IssueSummaryForm.get('module_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.TaskManagerService.getmodule(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.moduledrop = datas;




    })




}
statusclick(){
  let devkeyvalue: String = "";
  // this.getsprint(devkeyvalue);
  // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
  this.IssueSummaryForm.get('status').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.TaskManagerService.gesta(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results;
      this.statusdrops = datas;




    })

}

resetsprinitform(){
  // this.sprintSummaryForm.reset()
  // this.taskSummaryForm.reset()
  // this.storySummaryForm.reset()
  // this.backlogSummaryForm.reset()
  this.IssueSummaryForm.reset()
  this.startdate=false
  this.enddate=false
  this.query=false
  this.statuss=false
  this.statusss=false
  this.priority=false
  this.team_lead=false
  this.developer_id=false
  this.client=false
  this.app_id=false
  this.module_id=false
  this.pipeline_status=false
  this.inpstartdatesprint=""
  this.inpenddatesprint=""
  this.issueSearch('');

}
issuefunction(){
  let date=this.IssueSummaryForm.value.dynamicdropdown
  if(date==1){
    this.startdate=true
    this.enddate=false
    this.query=false
    this.app_id =false
    this.client =false
    this.module_id  =false
    this.priority   =false
    this.statusss   =false
  }
  else if(date==2){
    this.startdate=false
    this.enddate=true
    this.query=false
    this.app_id =false
    this.client =false
    this.module_id  =false
    this.priority   =false
    this.statusss   =false
  }
  else if(date==3){
    this.startdate=false
    this.enddate=false
    this.query=true
    this.app_id =false
    this.client =false
    this.module_id  =false
    this.priority   =false
    this.statusss   =false
  }
  else if(date==4){
    this.startdate=false
    this.enddate=false
    this.query=false
    this.app_id =true
    this.client =false
    this.module_id  =false
    this.priority   =false
    this.statusss   =false
  }
  else if(date==5){
    this.startdate=false
    this.enddate=false
    this.query=false
    this.app_id =false
    this.client =true
    this.module_id  =false
    this.priority   =false
    this.statusss   =false
  }
  else if(date==6){
    this.startdate=false
    this.enddate=false
    this.query=false
    this.app_id =false
    this.client =false
    this.module_id  =true
    this.priority   =false
    this.statusss   =false
  }
  else if(date==7){
    this.startdate=false
    this.enddate=false
    this.query=false
    this.app_id =false
    this.client =false
    this.module_id  =false
    this.priority   =true
    this.statusss   =false
  }
  else if(date==8){
    this.startdate=false
    this.enddate=false
    this.query=false
    this.app_id =false
    this.client =false
    this.module_id  =false
    this.priority   =false
    this.statusss   =true
  }
this.inpstartdatesprint="Start date :"+this.taskSummaryForm.value.start_date
this.inpenddatesprint="End date :"+this.taskSummaryForm.value.end_date
console.log("inpstartdatesprint",this.inpstartdatesprint)
console.log("inpenddatesprint",this.inpenddatesprint)
}





getAppdrop() {
  this.TaskManagerService.getApp('').subscribe(res=>{
    this.appdrop = res['data']
  })
}
getClientdrop() {
  this.TaskManagerService.getClient('').subscribe(res=>{
    this.clientdrop = res['data']
  })
}
getModuledrop() {
  this.TaskManagerService.getmodule('').subscribe(res=>{
    this.moduledrop = res['data']
  })
}
getPrioritydrop() {
  this.TaskManagerService.getpriority().subscribe(res=>{
    this.prioritydrop = res
  })
}
issuestatusdrop() {
  this.TaskManagerService.getissues().subscribe(res=>{
    this.ststusdrop= res['data']
  })
}
statusdrop() {
  this.TaskManagerService.gesta('').subscribe(res=>{
    this.statusdrops= res
  })
}
viewIssue(data)
  {
    this.localservice.taskid.next(data.id)
   this.isShowIssues = false;
   this.taskview = true;
  }
  appClick() {
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.IssueSummaryForm.get('app_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.TaskManagerService.getApp(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.appdrop = datas;




      })

  

  
}

backtoTaskSummary()
{
  this.taskview = false;
  this.isShowIssues= true;
  this.issueSearch('')
  this.pageNumbers = 1;
}
resetTasks()
{
  this.IssueSummaryForm.reset();
  this.issueSearch('')

}
deleteIssue(data)
{
  this.TaskManagerService.deleteIssue(data.id).subscribe(res => {
    if(res.code)
    {
      this.notification.showError(res.code)
    }
    else
    {  
        this.notification.showSuccess(res.message);
        this.issueSearch('')
    }
  })
}

}
