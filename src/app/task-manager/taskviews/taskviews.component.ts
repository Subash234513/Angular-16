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
import { ShareddataService } from '../shareddata.service';
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
  selector: 'app-taskviews',
  templateUrl: './taskviews.component.html',
  styleUrls: ['./taskviews.component.scss'],
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

export class TaskviewsComponent implements OnInit {

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
  isShowTasksummary: boolean = true;
  isShowStory: boolean;
  isShowStorySpr : boolean;
  storycreate: boolean;
  storyiew: boolean;
  story_taskView: boolean;
  sprintcreate: boolean;
  isShowSprint: boolean;
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
  // story_ID: any;
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
  assignedit:boolean
  objs: any;
  pageNumbersContainer = document.querySelector('.cus-pageNumbers');
  nextButton = document.querySelector('.cus-btnNext');
  issueList: any;
  reassignForm: FormGroup;
  @ViewChild(MatAutocompleteTrigger) autocompleteTriggers: MatAutocompleteTrigger;
  @ViewChild('closebutton') closebutton;

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
  isShowWorklogs: boolean = true;
  isShowCommentTask: boolean = false; 
  isShowHistory : boolean = false;
  clientdata : any;
  moduledata : any;
  filteredOptions: any[] = [];
  sprintlsts: any;
  selectedFilters: any[] = [];
  sprstartdate : any = '';
  sprenddate : any = '';
  images: string[] = [];





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
  isTaskView : boolean = true;
  storyName: any;
  currentDates: Date =  new Date();
  endday: any;
  isShowRemarks: boolean = false;
  lastDate: any = '';
  isgotostory: boolean = false;
  reuploadfileArr: any=[];
  storyIds: any;
  sprintEndDay: any;
  storyCode: any;
  fileviews: any;
  sprintstartdate: any;
  sprintenddate: any;
  presenttDate: any = '';
  spgetstartdate: any;
  spgetenddate: any;
  startDate: any;
  endDate: null;
  task_id: any;
  sprintName: any;
  startsDate: any;
  planStartDate: string;
  endsDate: any;
  planEndDate: string;
  checkAssignee: any;
  getLastAssigned: string;



  constructor(
    private fb: FormBuilder, private router: Router, private toastr: ToastrService,  private notify: imp.ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService,
    private TaskManagerService: TaskManagerService, private datepipe: DatePipe, private taskreportservice: TaskService,
    private notification: NotificationService, private datePipe: DatePipe, private shareservice: SharedService,
    private dialog: MatDialog, private taskmanagerservice: TaskManagerService, private route: ActivatedRoute,
    private LocalShareService:ShareddataService

  ) { 
 
  }


  @Output() OnSubmit = new EventEmitter<any>();
  @Output() OnCancel = new EventEmitter<any>();
  @Output() OnCancel1 = new EventEmitter<any>();

  selectedFile: File [] =[];
ngOnInit(): void {
  
  
this.toggleButtons(2);
    this.reassignForm = this.fb.group({
      developer_id: '',
      story:''
    })
    this.assignForm = this.fb.group({
      developer_id: '',
    })

    // this.route.params.subscribe(params => {
    //   const typeId = +params['id']; 
    //   console.log(typeId);
    //   this.storyTaskView(typeId)
    // });
    let typeId=this.LocalShareService.taskid.value
    this.storyTaskView(typeId)
    this.taskupdateForm = this.fb.group({
      actual_start_date:'',
      actual_end_date:''
    })

    this.sprstartdate =  this.LocalShareService.sprintfromdate.value
    this.sprenddate =  this.LocalShareService.sprinttodate.value


    this.getSprintDropDown();
  }

  formatCreatedDate(milliseconds: number): string {
    const date = new Date(milliseconds);
    return new DatePipe('en-US').transform(date, 'medium'); // Adjust the format as needed
  }
  reassignTask()
  {
    
    let data = this.reassignForm.value
    let payload = {
      "emp_id" : data.developer_id.id,
      "task_id":  this.storyrId
    }
    console.log("Reassigner", data)
    console.log("ReassignerPay", payload)
  
    this.taskmanagerservice.reassignTask(payload).subscribe(
      results=>{
        this.SpinnerService.hide()
        if(results.code)
        {
          this.notification.showError(results.description)
          this.reassignForm.reset()
        }
        else
        {
          this.notification.showSuccess(results.message)
          let typeId=this.LocalShareService.taskid.value
          this.storyTaskView(typeId)
          this.reassignForm.reset()
          return true 
        }
        }, error =>{
        this.SpinnerService.hide()
        
        }) 
    
  }
  developerName() {
    let teamldkeyvalue: String = "";
    this.getdeveloper(teamldkeyvalue);

    this.reassignForm.get('developer_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.taskreportservice.getdeveloperFilter(value, 1)
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
    this.taskreportservice.getdeveloperFilter(teamldkeyvalue, 1)
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
                this.taskreportservice.getdeveloperFilter(this.developerInput.nativeElement.value, this.currentpage + 1)
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
  assignTask()
  {
    
    let data = this.assignForm.value
    let payload = [{
      "emp_id" : data.developer_id.id,
      "task_id":  this.storyrId
    }]
    console.log("Reassigner", data)
    console.log("ReassignerPay", payload)
  
    this.taskmanagerservice.assignTask(payload).subscribe(
      results=>{
        this.SpinnerService.hide()
        if(results.code)
        {
          this.notification.showError(results.description)
        }
        else
        {
          this.notification.showSuccess(results.message)
          return true 
        }
        }, error =>{
        this.SpinnerService.hide()
        
        }) 
    
  }
  storyTaskView(story_taskID) {
    this.storyrId = story_taskID
    this.SpinnerService.show()
    this.TaskManagerService.getStories_taskView(story_taskID)
      .subscribe(result => { 
         this.SpinnerService.hide()


      //date validation
        this.sprintstartdate=result.sprint?.start_date
        this.sprintenddate=result.sprint?.end_date
        this.spgetstartdate=this.sprintstartdate
        this.spgetenddate=this.sprintenddate
        this.LocalShareService.taskstartdate.next(result.sprint?.start_date)
        this.LocalShareService.taskenddate.next(result.sprint?.end_date)
        this.LocalShareService.taskcode.next(result.id)
        this.LocalShareService.dependency.next(result.dependency)
        this.LocalShareService.taskstatus.next(result.task_status_id)
        this. presenttDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        if(this.spgetenddate >= this. presenttDate || this.spgetenddate== null  ){
          this.spgetenddate = this.presenttDate;
        }
        
        console.log("story task View", result)
        this.LocalShareService.story_Id.next(result?.story?.id)
        console.log("STOORY DATTA", result)
        if(result.story)
        {
          this.storyName = result.story.name;
          this.storyCode = result?.story?.code;
         
          // this.LocalShareService.taskid.next(typeId)
        }
        if(result.sprint){
          this.sprintName=result.sprint.name
        }
        if(result.actual_start_date)
        {
          this.isActualDate = false;
        }
        else
        {
          this.isActualDate = true;
        }
      
        // this.ViewData = result;

        let currentDate = new Date()
        this.currentDates = new Date()
        let formtDate = this.datePipe.transform(currentDate, "yyyy-MM-dd")
        let Plan_Start: any
        let Plan_End: any
        let PlanDaysCalculate
        let TotalPlanDays
        this.startsDate = result.start_date;
        this.endsDate = result.end_date;

        if (result.start_date !== 'None' && result.end_date !== 'None') {
          Plan_Start = new Date(this.datePipe.transform(result.start_date, 'yyyy-MM-dd'));
          Plan_End = new Date(this.datePipe.transform(result.end_date, 'yyyy-MM-dd'));
          PlanDaysCalculate = Plan_Start.getTime() - Plan_End.getTime()
          TotalPlanDays = (Math.abs(PlanDaysCalculate) / (1000 * 60 * 60 * 24)) + 1;
        } else {
  
          console.error('start_date or end_date is null');
        }
        

        // Plan_Start = new Date(this.datePipe.transform(result.start_date, 'yyyy-MM-dd'));
        // Plan_End = new Date(this.datePipe.transform(result.end_date, 'yyyy-MM-dd'));

      

        let json = {
          "DynamicStatusCall": false,
          "DynamicDate": formtDate,
          "DynamicHoursToSend": 0,
          "DynamicPlannedDays": TotalPlanDays,
          "DynamicActualDays": 0,
          "DynamicDelayDaysCount": 0
        }

        this.story_TaskViewData = Object.assign({}, result, json)
        console.log("data", this.story_TaskViewData)
        this.filterOptions();

        this.checkAssignee  = this.story_TaskViewData?.task_assignee;
        this.getLastAssigned = this.getLastFullName(this.checkAssignee);

       this.endday =   this.story_TaskViewData.end_date;
       if(result?.last_timesheet_updated_on != null)
       {
       this.lastDate = new Date(this.datePipe.transform(result?.last_timesheet_updated_on, 'yyyy-MM-dd'))
       }
              if(result?.actual_start_date != null && result?.actual_start_date != "" && result?.actual_start_date != undefined)
       {
       let startt_date= new Date(this.datePipe.transform(result?.actual_start_date, 'yyyy-MM-dd'))
       this.taskupdateForm.get('actual_start_date').patchValue(startt_date)
       }

      //  if(result.story == null)
      //  {
      //   this.notification.showWarning("Task not mapped to Story")
      //  }

       this.storyIds = result?.story?.id;
       if(this.storyIds !== undefined)
       {
       console.log("Strory IDDSSS", this.storyIds)
      //  this.SpinnerService.show() 
       this.TaskManagerService.getStoriesView(this.storyIds)
       .subscribe(result => {
         this.SpinnerService.hide();
         console.log("story View", result)
         this.storyViewDaata = result;
         this.sprintEndDay = this.storyViewDaata?.sprint?.to_date;
         console.log("Data this end date", this.sprintEndDay) 
       }, (error) => {
         this.errorHandler.handleError(error);
         this.SpinnerService.hide();
       }
   
       )
      }
       
      //  if(this.currentDates < this.sprstartdate)
      //  {
      //   this.isShowRemarks  = true;
      //  }

      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }

      )
      
  }
  


  ChangeDateFormat(data) {
    data.DynamicDate = this.datePipe.transform(data?.DynamicDate, 'yyyy-MM-dd');
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
    if(data.DynamicDelayDaysCount)
    {
      this.isShowRemarks = true;
    }

  }

  ChaneStatus(status, taskstatus) {
    
    let obj: any
    
    this.actualdate =  this.datePipe.transform(this.taskupdateForm.get('actual_start_date').value, "yyyy-MM-dd");
    if(this.startsDate !== 'None' )
    { 
    this.planStartDate = this.datePipe.transform(this.startsDate, "yyyy-MM-dd");
    }
    if(this.endsDate !== 'None' )
    {
    this.planEndDate = this.datePipe.transform(this.endsDate, "yyyy-MM-dd");
    }
   
    // this.endadate =  this.datePipe.transform(taskstatus?.actual_end_date, "yyyy-MM-dd");
    this.endadate =  this.datePipe.transform(this.taskupdateForm.get('actual_end_date').value, "yyyy-MM-dd");
   
    console.log("taskstatus", taskstatus)


    if (taskstatus?.task_status_id == 0) {

      if(this.startsDate === null || this.startsDate === undefined || this.startsDate === '' || this.startsDate === 'None') { 
        obj = {
          actual_start_date: this.actualdate,
          task_status: status,
        
        
        }
      } 

      
      else if(this.endadate == undefined || this.endadate == '' || this.endadate == null  )
      {
        
        obj = {
          actual_start_date: this.actualdate,
          task_status: status,
          start_date: this.planStartDate
        
        }
      
      }
      else if(this.isActualDate == true && !this.endadate )
      {
        obj = {
          actual_start_date: this.actualdate,
           task_status: status,
           start_date: this.planStartDate
        
        }
      }
      else{

      obj = {
        actual_start_date: this.actualdate,
        task_status: status,
        actual_end_date : this.endadate,
        start_date: this.planStartDate,
        end_date : this.planEndDate

      }
    }
    }
    else if (taskstatus?.task_status_id == 1) {
      obj = {
        actual_start_date: this.actualdate,
        actual_end_date: this.endadate,
        task_status: status,
        emp_hr: taskstatus?.emp_hours,
        delay_days: taskstatus?.DynamicDelayDaysCount,
        reason_for_delay: taskstatus?.reason_for_delay
      }
    }
    else if (taskstatus?.task_status_id == 3) {
      obj = {
        task_status: status
      }
    }
    else if (taskstatus?.task_status_id == 2) {
      obj = {
        task_status: status,
        actual_end_date : this.endadate
      }
    }


    else {
      obj = {
        task_status: status
      }
    }
    this.SpinnerService.show();
    this.TaskManagerService.ChaneStatus(obj, taskstatus.id)
      .subscribe(results => {
        if(results.code)
        {
          this.notification.showError(results.description)
          this.SpinnerService.hide();

        }
        else
        {
          this.notification.showSuccess(results.message)
          this.storyTaskView(taskstatus.id)
          this.SpinnerService.hide();
        }
      
      })  
        
        

  }


  UpdateTask(data) {
    this.SpinnerService.show()

    console.log("MY Task Data", data)
    for (let i = 0; i < data.employee_hours.length; i++) {
      data.employee_hours[i].employee_id = data.employee_hours[i].employee_id;
    }
    let startsdate = this.datepipe.transform(data.actual_start_date, 'yyyy-MM-dd');
    let endsdate = this.datepipe.transform(data.actual_end_date, 'yyyy-MM-dd'); 
    let obj = {
      id: data.id,
      actual_start_date: startsdate,
      actual_end_date : endsdate,
      // task_status: data.task_status_id,
      emp_hr: data?.employee_hours,
      delay_days: data.DynamicDelayDaysCount,
      reason_for_delay: data.reason_for_delay
    }
    console.log(data, obj)
    this.TaskManagerService.ChaneStatus(obj, data.id)
      .subscribe(results => {
        if(results.code){
          this.notification.showError(results.description)
          this.SpinnerService.hide()
        }
        else{
          this.notification.showSuccess(results.message)
          this.SpinnerService.hide()
          this.storyTaskView(data.id)
        }
      
        
      })

  }

  filterOptions() {
    // Filter the options based on your conditions
    if (this.story_TaskViewData.task_status_id === 0 || this.story_TaskViewData.task_status_id === 1) {
      this.filteredOptions.push({ text: 'Mark Complete', value: 2 });
    }
    if (this.story_TaskViewData.task_status_id === 0) {
      this.filteredOptions.push({ text: 'Work In Progress', value: 1 });
    }
    if (this.story_TaskViewData.task_status_id === 1) {
      this.filteredOptions.push({ text: 'Hold', value: 3 });
    }
    if (this.story_TaskViewData.task_status_id === 2) {
      this.filteredOptions.push({ text: 'Verified', value: 5 });
    }
    if (this.story_TaskViewData.task_status_id === 10 || this.story_TaskViewData.task_status_id === 2) {
      this.filteredOptions.push({ text: 'Return', value: 6 });
    }
    if (this.story_TaskViewData.task_status_id === 5) {
      this.filteredOptions.push({ text: 'Tested', value: 10 });
    }
  }
  onFileSelect(e) {
    // this.selectedFile = e.target.files;
    let reuploaddatavalue = e.target.files

    for (var i = 0; i < e.target.files.length; i++) {

      this.reuploadfileArr.push(e.target.files[i])
    }
  }
  
  
  
  saveCommentTask() {
    // Here, you can handle the logic to save the comment and the attached file.
    console.log('Comment Text:', this.commentTexts);
    console.log('Selected File:', this.selectedFile);
    let payload = {
      "comment": this.commentTexts
    }
    const formData: FormData = new FormData(); 
    let reuploadfiles = this.reuploadfileArr
    if(reuploadfiles.length!=0){
      for (let reuploadindividual in reuploadfiles ) {
        let reuploadfilekeydata = 'file'
        let datavalue = JSON.stringify(payload)
        formData.append('data', datavalue);
        formData.append(reuploadfilekeydata, reuploadfiles[reuploadindividual])
  
      }
    
    }
    else{
      let datavalue = JSON.stringify(payload)
        formData.append('data', datavalue);
    }
    
  
    this.taskmanagerservice.addCommentTask(formData, this.storyrId).subscribe(
      results=>{
        if(results.status){
        this.SpinnerService.hide()
          this.notification.showSuccess(results.message)
          this.getCommentHistorys();
          // this.OnSubmit.emit() 
          this.commentTexts = ''
          this.reuploadfileArr=[]
          // this.selectedFile=[]
          return true }
          else{
            this.SpinnerService.hide()
        this.notification.showError(results.description)
        this.reuploadfileArr=[]
        // this.selectedFile=[]
        } 
        
        
        
        }) 
  
  }
  toggleCommentBox() {
    this.showCommentBox = true;
    this.getCommentHistory();
  }
  toggleCommentBoxs() {
    this.showCommentBoxs = true;
    this.getCommentHistorys();
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
  
  deleteComment(commentId: number) {
    // Add your code here to delete the comment with the given commentId
    console.log(`Deleting comment with ID: ${commentId}`);
    // You can make an API call to delete the comment here
  }
  fileview(data){
    this.fileviews=data.file
  }
  getCommentHistorys()
  {
    this.taskmanagerservice.getCommentHistorys(this.storyrId).subscribe(
      results=>{
        this.SpinnerService.hide()
            this.commenthistoryarrs = results['data']
            console.log("file", this.commenthistoryarrs)
          // this.OnSubmit.emit() 
          return true 
        }, error =>{
        this.SpinnerService.hide()
        
        
        }) 
  
  }
  
  toggleButton(buttonNumber: number): void {
    // Reset styles for all buttons
    this.resetButtonStyles();
  
    // Update the clicked button's styles
    switch (buttonNumber) {
      case 1:
        this.button1Styles = {
          'background-color': '#172b4d',
          color: 'white'
        };
        this.isShowbuttons = true;
        this.isShowComments = true;
        break;
      case 2:
        this.button2Styles = {
          'background-color': '#172b4d',
          color: 'white'
        };
        this.isShowbuttons = true;
        this.isShowComments = false;
        break;
      case 3:
        this.button3Styles = {
          'background-color': '#172b4d',
          color: 'white'
        };
        this.isShowbuttons = false;
        this.isShowComments = true;
        this.getCommentHistory();
        break;
    }
  }
  
  resetButtonStyles(): void {
    this.button1Styles = {
      'background-color': 'white',
      color: '#172b4d'
    };
    this.button2Styles = {
      'background-color': '#172b4d',
      color: 'white'
    };
    this.button3Styles = {
      'background-color': 'white',
      color: '#172b4d'
    };
  }
  
  toggleButtons(buttonNumber: number): void {
    this.resetButtonStyle();
    switch (buttonNumber) {
      case 1:
        this.button1Styles = {
          'background-color': '#172b4d',
          color: 'white'
        };
        this.isShowWorklogs = true;
         this.isShowCommentTask = true;
         this.isShowHistory = true;
        break;
      case 2:
        this.button2Styles = {
          'background-color': '#172b4d',
          color: 'white'
        };
        this.isShowWorklogs = true;
        this.isShowCommentTask = false;
        this.isShowHistory = false;
        break;
      case 3:
        this.button3Styles = {
          'background-color': '#172b4d',
          color: 'white'
        };
        this.getCommentHistorys();
        this.isShowWorklogs = false;
         this.isShowCommentTask = true;
        this.isShowHistory = false;
        
        break;
  
        case 4:
          this.button4Styles = {
            'background-color': '#172b4d',
            color: 'white'
          };
          this.isShowWorklogs = false;
         this.isShowCommentTask = false;
         this.isShowHistory = true;
          break;
        
        
  }
  }
  


  resetButtonStyle(): void {
    this.button1Styles = {
      'background-color': 'white',
      color: '#172b4d'
    };
    this.button2Styles = {
      'background-color': 'white',
      color: '#172b4d'
    };
    this.button3Styles = {
      'background-color': 'white',
      color: '#172b4d'
    };
    this.button4Styles = {
      'background-color': 'white',
      color: '#172b4d'
    };
  }
  onclickTaskEdit(data)
  {
    if (data.task_status_id==8){
      this.LocalShareService.unassignedit.next("Unassigned")
     
    }
    else{
      this.LocalShareService.unassignedit.next("")

    }
    this.taskedit = true;
    this.isTaskView = true;
  }
  assignEdit(data)
  {
    if (data.task_status_id==8){
      this.LocalShareService.unassignedit.next("Unassigned")
     
    }
    else{
      this.LocalShareService.unassignedit.next("")

    }
  
    this.assignedit = true;
    this.isTaskView = true;
  }
  popassignclose(){
    this.assignedit = false;
    this.isTaskView = true;
    let typeId=this.LocalShareService.taskid.value

    this.storyTaskView(typeId)
  }
  popclose(){
    this.taskedit = false;
    this.isTaskView = true;
    let typeId=this.LocalShareService.taskid.value

    this.storyTaskView(typeId)
  }
  updateTaskProgress()
  {
    if (this.taskupdateForm.value.actual_start_date==='' || this.taskupdateForm.value.actual_start_date===null || this.taskupdateForm.value.actual_start_date===undefined  ) {
      this.toastr.error("Choose Actual start date");
      return; 
    }
    this.ChaneStatus(1, this.story_TaskViewData);
    this.taskupdateForm.reset()

  }
  ChaneStatuss(story_TaskViewData){
    this.story_TaskViewData=story_TaskViewData

  }
  getBorderColor(taskStatus: string): string {
    switch (taskStatus) {
      case 'Completed':
        return 'green';
      case 'Verified':
        return 'orange';
      case "Yet to Start":
        return 'red';
      case "Work In Progress":
        return 'blueviolet'  
      default:
        return 'brown';
    }
  }
  backtoTaskSummary()
  {
    this.OnCancel.emit()
    this.OnCancel1.emit()
  }
  updateTaskProgresss()
  {
    if (this.taskupdateForm.value.actual_start_date==='' || this.taskupdateForm.value.actual_start_date===null || this.taskupdateForm.value.actual_start_date===undefined  ) {
      this.toastr.error("Choose Actual start date");
      return; 
    }
    if (this.taskupdateForm.value.actual_end_date==='' || this.taskupdateForm.value.actual_end_date===null || this.taskupdateForm.value.actual_end_date===undefined  ) {
      this.toastr.error("Choose Actual End date");
      return; 
    }
    this.ChaneStatus(2, this.story_TaskViewData);
    this.taskupdateForm.reset()

  }

  updateTaskProgressHold()
  {
    this.ChaneStatus(2, this.story_TaskViewData);
  }
  resetdate()
{
  this.taskupdateForm.get('actual_end_date').setValue("")
}
  SubmitbackToView()
  {
    this.taskedit = false;
    this.isTaskView = true;
    let typeId=this.LocalShareService.taskid.value

    this.storyTaskView(typeId)
    this.closebutton.nativeElement.click();


  }
  SubmitbackToSummary()
  {
    this.ChaneStatus(3, this.story_TaskViewData); 
  }

  validateInput(dateHours: any) {

    const min = 1;
    const max = 12;

    if (dateHours.hour < min) {
      dateHours.hour = min;
    } else if (dateHours.hour > max) {
      dateHours.hour = max;
    }
  }

  checkendDate(event : MatDatepickerInputEvent<any>)
  {
    let selectedDate:Date | null=event.value
    let endDater = new Date(this.datePipe.transform(this.endday, 'yyyy-MM-dd'))
    let events = new Date(this.datePipe.transform(selectedDate, 'yyyy-MM-dd'))
   
    if(events >  endDater)
    {
      this.isShowRemarks = true;
    }
    else{
      this.isShowRemarks = false;
    }
  }

  assignStoryTasks()
  {
    let sprintName = this.reassignForm.get('story').value;
  let payload = {
    "task_id": this.storyrId,
    "story_id": sprintName.id
  }
  this.taskmanagerservice.addStorytoTask(payload)
  .subscribe(res => {
    console.log("story added to Task click", res)
    if(res.status){
      this.notify.success(res.message);
      this.SpinnerService.hide();
      // this.taskSummaryForm.reset();
      let typeId=this.LocalShareService.taskid.value
    this.storyTaskView(typeId)
    this.reassignForm.reset();
     } else {
      this.notify.error(res.description)
      this.SpinnerService.hide();
      this.reassignForm.reset();
      return false;
    }
  },
  error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
    this.reassignForm.reset();
  }
  )
  }

  getSprintDropDown() {
    this.taskmanagerservice.getStoriesdd('',1).subscribe(res => {
      this.sprintlsts = res['data']
    })

  }

  teamsprintclicks() {
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.reassignForm.get('story').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')
  
        }),
        switchMap(value => this.taskmanagerservice.getStoriesdd(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.sprintlsts = datas;
  
  
  
  
      })
  
  
  
  
  }

  public displaysprintteamclient(clt?: teamopClient): string | undefined {
    // console.log(`Client testing data - ${clt.name}`);
    return clt ? clt.name : undefined;
  }

  gotoStories()
  {
    this.isgotostory = true;
    this.isTaskView = false;
  }
  SubmitbackToStorySummary()
  {
    this.isgotostory = false;
    this.isTaskView = true;
    this.getSprintDropDown()
  }
  getMaxDate() {
    const currentDate = new Date();

    if (this.sprintEndDay > currentDate) {
      return currentDate;
    } else {
      return this.sprintEndDay;
    }
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
  this.taskmanagerservice.downloadIssueData(data.file_id).subscribe(
    (res: any) => {
      this.SpinnerService.hide();

      // Determine the content type (MIME type) from the response
      // const contentType = res.type;

      // Create a blob for the response
      // const blob = new Blob([res], { type: contentType });

      // Create a download link element
      // const link = document.createElement('a');
      // link.href = window.URL.createObjectURL(blob);

      // Set the appropriate download filename based on the content type
      let binaryData = [];
        binaryData.push(res)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.file_name;
        link.click();

      // Trigger the download by clicking the link
      // link.click();
    },
    (error: any) => {
      this.SpinnerService.hide();
      console.error('Error:', error);
    }
  );
    
  }

  
  deleteComments(commentId) {
    this.taskmanagerservice.deleteComment(commentId).subscribe(
      results=>{
        this.SpinnerService.show()
        if(results.code)
        {
          this.notification.showError(results.code);
          this.SpinnerService.hide();
        }
        else
        {
          this.notification.showSuccess(results.message);
          this.getCommentHistorys();
          this.SpinnerService.hide();
          return true 
        }
        }, error =>{
        this.SpinnerService.hide();
        
        
        }) 
        
    // You can make an API call to delete the comment here
  }

 attachmentDelete(file, index) {

  this.reuploadfileArr.splice(index,1)
  
}

deletetask_task(typeId) {
  
  if (confirm("Confirm?")) {
  this.SpinnerService.show();
  this.taskmanagerservice.deletetask(typeId)
      .subscribe(res => {
       
        if(res.code){
          this.notification.showError(res.description)
        }
        else{
        
          this.notification.showSuccess(res.message)
       this.backtoTaskSummary()
         
        }
        this.SpinnerService.hide()
     
      }
      
      
      )}
   
   
}
opentask()
{
  if(this.startsDate === 'None' || this.startsDate === null || this.startsDate === undefined || this.startsDate === '') {
  this.notify.error("Please fill the Planned Start Date and End Date in Task Edit to continue")
}
}
updateTaskProgressOne()
{
  if (this.taskupdateForm.value.actual_end_date==='' || this.taskupdateForm.value.actual_end_date===null || this.taskupdateForm.value.actual_end_date===undefined  ) {
    this.toastr.error("Choose Actual end date");
    return; 
  }
  this.ChaneStatus(6, this.story_TaskViewData);
  this.taskupdateForm.reset()

}

getLastFullName(data): string | undefined {
  if (data.length === 0) {
    return undefined; 
  } else {
    return data[data.length - 1].full_name; 
  }
}

}
