import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { CustomPopviewComponent } from "src/app/custom-popview/custom-popview.component";

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

const moment = _rollupMoment || _moment;
export interface Emplistss {
  id: string;
  full_name: string;
  name: string;
}
export interface clientlists{
  id:string;
  client_code:string;
  client_name:string;
}
export interface modulelists{
  id:string;
  client_code:string;
  module_name:string;
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
export interface productlistss {
  id: string;
  name: string;
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
export interface popupClient {
  id: string;
  name: string;
}
export interface teamopClient {
  id: string;
  name: string;
}
export interface moduleclient {
  id: string;
  name: string;
}
export interface developclient {
  id: string;
  name: string;
}
export interface teamleadclient {
  id: string;
  name: string;
  text: string;
}
export interface statusclient {
  id: string;
  name: string;
  text: string;
}

export interface popupApplication {
  id: string;
  name: string;
}

export interface Activityid {
  activity: string;
  id: string;
  name: string;
}

export interface activityArr {
  id: string;
  name: string;
  app: {
    name: string;
  };
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
  selector: 'app-sprintmain',
  templateUrl: './sprintmain.component.html',
  styleUrls: ['./sprintmain.component.scss'],
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
export class SprintmainComponent implements OnInit {

  selectedDate: Date;
  sprintfilter:[{"name":"Start Date","id":1},{"name":"End Date","id":2},{"name":"Query","id":3}]
  sprintfilterss:[{"name":"Start Date","id":1},{"name":"End Date","id":2},{"name":"Query","id":3},{"name":"Team","id":4},{"name":"Sprint","id":5}]
  taskfilter:[{"name":"Start Date","id":1},{"name":"End Date","id":2},{"name":"Query","id":3},{"name":"App id","id":4},{"name":"Client ","id":5},{"name":"Module id  ","id":6},{"name":"Developer id ","id":7},{"name":"Team lead ","id":8},{"name":"Status ","id":9}]  
  backlogfilter:[{"name":"Start Date","id":1},{"name":"End Date","id":2},{"name":"Query","id":3},{"name":"App id","id":4},{"name":"Client ","id":5},{"name":"Module id  ","id":6},{"name":"Developer id ","id":7},{"name":"Team lead ","id":8}]
  pipelinefilter:[{"name":"Start Date","id":1},{"name":"End Date","id":2},{"name":"Pipeline Status","id":3},{"name":"App id","id":4},{"name":"Client ","id":5},{"name":"Module id  ","id":6},{"name":"Developer id ","id":7},{"name":"Team lead ","id":8}]
  issuefilter:[{"name":"Start Date","id":1},{"name":"End Date","id":2},{"name":"Query","id":3},{"name":"App id","id":4},{"name":"Client ","id":5},{"name":"Module id  ","id":6},{"name":"Priority  ","id":7},{"name":"Status ","id":8}]
  Tran_Menu_List : any;
  statusList = [{ 'id': 1, 'name': 'Createdby Me' }, { 'id': 2, 'name': 'Others' }];
  teamdrop:any
  appdrop:any
  sprinttdrop:any
  clientdrop:any
  moduledrop:any
  teams:any
  statusdrops:any
  develop:any
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
  isShowSprint: boolean = true;
  taskSearchForm: FormGroup;
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
  moduleList: Array<Client>;
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
  isShowIssues: boolean;
  IssueSummaryForm: FormGroup;
  searclos: boolean;
  sprintFilterForm: FormGroup;
  taskupdateForm: FormGroup;


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
  has_previousStoryTask = true;
  has_nextStoryTask = true;
  presentpageStoryTask: number = 1;
  presentpageSprint: number = 1;
  pagesizeStoryTask = 10;
  story_ID: any;
  sprintList: any;
  has_sprintprevious:boolean= true;
  has_sprintnext:boolean = true;
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
  @ViewChild('clientInput') clientInput: any;
  @ViewChild('teamInput') teamInput: any;
  @ViewChild('teamlead') teamlead: any;
  @ViewChild('moduleInput') moduleInput: any;
  @ViewChild('developerinput') developerinput: any;
  @ViewChild('clientrole') matappAutocomplete: MatAutocomplete;
  @ViewChild('teamsrole') matappAutoteamcomplete: MatAutocomplete;
  @ViewChild('modulerole') matmoduleAutocomplete: MatAutocomplete;
  @ViewChild('developerrole') matdevelopAutocomplete: MatAutocomplete;
  @ViewChild('teamrole') matteamleadsAutocomplete: MatAutocomplete;
  @ViewChild('closebutton') closebutton;
  pipeList: any;
  showMoreInfo: boolean;
  issuecreate: boolean = false;
  storySearchForm: FormGroup;
  allChecked : boolean = false;
  showMoveToTaskButton: boolean = false;
  selectedItems: any[] = [];
  today: Date = new Date();
  selectLogTypeValue: any;
  // Bootstrap Popup
  popupAddForm: FormGroup;
  popupClientList: Array<popupClient>;
  popupAppList: Array<popupApplication>;
  othersPopMenuNgif = false;
  activityPopMenuNgif = false;
  logTypeArr: any;
  logActionApplicationArr: any;
  activityArr: Array<Activityid>;
  popupForm: FormGroup;
  popupIsLoading = false;

  // timesheet array
  items: any[] = [];
  dateForm: FormGroup;
  formattedDate: any;
  module_Id = 0;

  // selectedDate: Date;


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
  clientlist: Array<clientlists>
  modulelist: Array<modulelists>
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
  isShowtimesheet: boolean;
  timeSheetList: any;
  dateID: any;
  activityArr2: any;
  timesumtable: any;
  timeSheet: FormGroup;
  actualdate : any;
  endadate : any;
  isActualDate: any;



  constructor(
    private fb: FormBuilder, private router: Router, private toastr: ToastrService,  private notify: imp.ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService,
    private TaskManagerService: TaskManagerService, private datepipe: DatePipe, private taskreportservice: TaskService,
    private notification: NotificationService, private datePipe: DatePipe, private shareservice: SharedService,
    private dialog: MatDialog, private taskmanagerservice: TaskManagerService


  ) { 
 
  }


  @Output() OnSubmit = new EventEmitter<any>();



  ngOnInit(): void {

    
    this.sprintSummaryForm = this.fb.group({
      start_date: '',
      end_date: '',
      query: '',
      status: '',
      dynamicdropdown:'',

      // method:''



    })
    this.sprintSearch('');
  }

  resetSprint()
{
  this.sprintSummaryForm.reset();
  this.sprintpresentpage=1
  this.sprintSearch('');
  this.pageNumbers = 1;
}
resetsprinitform(){
  
  this.sprintSummaryForm.reset()
  this.taskSummaryForm.reset()
  this.storySummaryForm.reset()
  this.sprintpresentpage=1
  // this.backlogSummaryForm.reset()
  // this.IssueSummaryForm.reset()
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
  this.sprintSearch('')

}
sprintSearch(hint: any) {
  console.log("inpstartdatesprint",this.inpstartdatesprint)
console.log("inpenddatesprint",this.inpenddatesprint)
  let search = this.sprintSummaryForm.value;
  search.start_date = this.datepipe.transform(search.start_date, 'yyyy-MM-dd');
  search.end_date = this.datepipe.transform(search.end_date, 'yyyy-MM-dd');
  let obj = {
    "start_date": search?.start_date,
    "end_date": search?.end_date,
    "query": search?.query,
    "status": search?.status,
    "team": search?.team,
    "app_id": search?.app_id?.id,
    "client": search?.client?.id,
    "module_id": search?.module_id?.id,
    "developer_id": search?.developer_id?.id,
    "team_lead": search?.team_lead?.id,

  }
  console.log("obj api", obj)
  for (let i in obj) {
    if (obj[i] == undefined || obj[i] == null) {
      obj[i] = '';
    }
  }
  this.SpinnerService.show();

  if (hint == 'next') {
    this.sprintSummary(obj, this.sprintpresentpage + 1)
  }
  else if (hint == 'previous') {
    this.sprintSummary(obj, this.sprintpresentpage - 1)
  }
  else {
    this.sprintSummary(obj, 1)
  }

}

// sprint summary
sprintSummary(obj, pageno) {
  this.TaskManagerService.getSprintSummary(obj, pageno)
    .subscribe(result => {
      this.SpinnerService.hide();
      console.log("sprint summary", result)
      this.sprintList = result['data']
    
      this.dataPaginationSpr = result['pagination'];
      if (this.sprintList.length > 0) {
        this.has_sprintnext = this.dataPaginationSpr.has_next;
        this.has_sprintprevious = this.dataPaginationSpr.has_previous;
        this.sprintpresentpage = this.dataPaginationSpr.index;
                this.showPopup=false
            }

     
      // this.sprintList.forEach(x =>{
      //   console.log("Stories get", this.storiesget)
      // })
      this.sprintList.forEach(x => {
        Object.assign(x, {
          "DynamicStoryCall": false,

        })
      })
      console.log(this.sprintList)
      return this.sprintList
    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }

    )
}

sprintreset() {
  this.sprintSummaryForm = this.fb.group({
    start_date: '',
    end_date: '',
    query: '',
    status: ''
  })
  this.sprintSearch('')

}

getSprintAddScreen() {
  
  this.sprintcreate = true;
  this.isShowSprint = true;
 
}
sprintSearchs(result) {
  let search = result;

  if (result.dropdown1 == 'startdate') {
    search.inputField = this.datepipe.transform(search.inputField, 'yyyy-MM-dd');
    this.objs = {
      "start_date": search?.inputField,
      "end_date": '',
      "query": '',
      "status": '',
    }
  }
  else if (result.dropdown1 == 'enddate') {
    search.inputField = this.datepipe.transform(search.inputField, 'yyyy-MM-dd');
    this.objs = {
      "start_date": '',
      "end_date": search?.inputField,
      "query": '',
      "status": '',
    }
  }
  else {
    this.objs = {
      "start_date": '',
      "end_date": '',
      "query": '',
      "status": search?.inputField,
    }
  }


  this.SpinnerService.show();


  this.sprintSummary(this.objs, 1)
}
// updatePaginationSpr() {
//   if (this.pageNumbers >= 1) {
//     this.pageNumbers = Math.max(this.pageNumbers, 1);
//   let obj = {
//     "start_date": '',
//     "end_date": '',
//     "query": '',
//     "status": '',
//   }
//   this.sprintSummary(obj, this.pageNumb)
// }
// }
updatePaginationSpr() {
  let search = this.sprintSummaryForm.value;
  search.start_date = this.datepipe.transform(search.start_date, 'yyyy-MM-dd');
  search.end_date = this.datepipe.transform(search.end_date, 'yyyy-MM-dd');
  let obj = {
    "start_date": search?.start_date,
    "end_date": search?.end_date,
    "query": search?.query,
    "status": search?.status,
    "team": search?.team,
    "app_id": search?.app_id?.id,
    "client": search?.client?.id,
    "module_id": search?.module_id?.id,
    "developer_id": search?.developer_id?.id,
    "team_lead": search?.team_lead?.id,

  }
  console.log("obj api", obj)
  for (let i in obj) {
    if (obj[i] == undefined || obj[i] == null) {
      obj[i] = '';
    }
  }

  // Reset page number to 1 when updating pagination
  // this.pageNumb = 1;
  this.sprintSummary(obj, this.pageNumbers);
}

previousPage(): void {
  if (this.has_sprintprevious ) {
    this.SpinnerService.show();
    this.pageNumbers = this.pageNumbers - 1;
    this.updatePaginationSpr();
  }
}
nextPage(): void {
  if (this.has_sprintnext) {
    this.SpinnerService.show();
    this.pageNumbers = this.pageNumbers + 1;
    this.updatePaginationSpr();
  }
}
isNextPageAllowed(): boolean {
  return this.pageNumbers > 10; 
}
SubmitbackTosprintSummary()
{
  this.sprintcreate = false;
  this.isShowSprint = true;
  this.sprintSearch('')
  this.closebutton.nativeElement.click();

}
CancelbackTosprintSummary()
{
  this.sprintcreate = false;
  this.isShowSprint = true;
  this.sprintSearch('')
}
togglePopup() {
  this.showPopup = !this.showPopup;
  console.log("this.showPopup",this.showPopup)
  this.sprintfilter=[{"name":"Start Date","id":1},{"name":"End Date","id":2},{"name":"Query","id":3}]
}
  showStoryGet(data)
  {
    this.isShowTasksummary = false;
    this.taskcreate = false;
    this.isShowStory = false;
   
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = false;
    this.isShowTasksummary = false;
    this.isShowBacklog = false;
    this.showTasksPage = false;
    this.showTasksVuews = false;
    this.isStorySearch = true;
    this.isShowStorySummary = true;
    this.taskedit = false;
    this.isShowIssues = false;
    this.isShowPipelines = false;
    this.issuecreate = false;
    this.fetchSprint(data);

  }
  fetchSprint(storydata)
  {
    console.log("Stories Info", storydata)

    if(storydata == '' || storydata == null)
    {
        this.notification.showWarning("No Stories added for this Sprint")
        this.isShowSprint = true;
    }
    else
    {
      this.isShowStorySpr = true;
    this.storysList = storydata
    }

  }
  popclose(){
    this.sprintSearch('')

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

applyfilter()
{
  this.sprintSearch('');
  this.pageNumbers = 1;
}
searchsprints()
{
  this.sprintSearch('');
  this.pageNumbers = 1;
}


}
