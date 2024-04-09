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
import { COMMA, ENTER } from '@angular/cdk/keycodes';
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
  selector: 'app-taskmainpage',
  templateUrl: './taskmainpage.component.html',
  styleUrls: ['./taskmainpage.component.scss','../taskglobal.scss'],
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
export class TaskmainpageComponent implements OnInit {

  selectedDate: Date;
  Tran_Menu_List = [{ name: 'Sprint' }, { name: 'Stories' }, { name: 'Task' }, { name: 'Backlog' }, { name: 'Issues' }, { name: 'Pipeline' }, { name: 'Timesheet' }];
  statusList = [{ 'id': 1, 'name': 'Createdby Me' }, { 'id': 2, 'name': 'Others' }];
  returnnav: number;
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
  isShowBacklog: boolean;
  backlogSummaryForm: FormGroup;
  isShowIssues: boolean;
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
  has_previousStoryTask = true;
  has_nextStoryTask = true;
  presentpageStoryTask: number = 1;
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
  pipeList: any;
  showMoreInfo: boolean;
  issuecreate: boolean;
  storySearchForm: FormGroup;
  allChecked : boolean = false;
  showMoveToTaskButton: boolean = false;
  selectedItems: any[] = [];
  today: Date = new Date();

  pipelineSummaryForm: FormGroup;
  sprintFilterForms: FormGroup;
  formArray: FormArray;






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

  storiesget: any;
  sprintdata: any;
  storysList: any;
  pageNumbi : any = 1;
  droplist: any;
  textValues = [{ id: 'startdate', name: "Start Date" }, { id: 'enddate', name: "End Date" }]
  storyrId: any;
  assigns =[
    { id: 1, name: 'Assigned to Me' },
    { id: 2, name: 'Assigned to my Team' },
    { id: 3, name: 'All' }
  ];   





  constructor(
    private fb: FormBuilder, private router: Router, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService,
    private TaskManagerService: TaskManagerService, private datepipe: DatePipe, private taskreportservice: TaskService,
    private notification: NotificationService, private datePipe: DatePipe, private shareservice: SharedService,
    private dialog: MatDialog, private taskmanagerservice: TaskManagerService


  ) { 
   
  }

  ngOnInit(): void {


    this.taskSearchForm = this.fb.group({
      app_id: '',
      client: '',
      dev_type: '',
      module_id: '',
      unit_head: '',
      team_lead: '',
      start_date: '',
      end_date: '',
      status: '',
      query: '',
      developer_id: '',
      teamlead: '',
      dropfilter:''


    })

    this.storySummaryForm = this.fb.group({
      start_date: '',
      end_date: '',
      query: '',
      status: '',




    })

    this.sprintSummaryForm = this.fb.group({
      start_date: '',
      end_date: '',
      query: '',
      status: ''



    })
    this.storiesForm = this.fb.group({
      name: '',
      details: '',
      sprint: '',
      story: '',
      team_lead: ''

    })

    this.value = this.sprintSummaryForm.get('query').value;

    this.backlogSummaryForm = this.fb.group({
      srint: '',
      team: '',
      type: '',
      status: ''



    })
    this.IssueSummaryForm = this.fb.group({
      srint: '',
      team: '',
      type: '',
      status: ''



    })
    this.reassignForm = this.fb.group({
      developer_id: '',
    })

    this.storySearchForm = this.fb.group({
      query: '',
    })

    this.pipelineSummaryForm = this.fb.group({
      srint: '',
      team: '',
      type: '',
      status: ''



    })

    this.sprintFilterForm = this.fb.group({
      startdate :'',
      enddate :  ''
    })

    this.getDropDown();

    this.sprintFilterForms = this.fb.group({
      // filters: this.fb.array([]),
      field: '',
      options:''
    });



    // this.generatePageNumbers(this.storyTaskList.pagination.index, this.storyTaskList.pagination.has_next);
  }

  getDropDown() {
    this.droplist = [
      { id: -1, name: 'Verified' },
      { id: 1, name: 'Moved to production' },
      { id: 2, name: 'Moved to DO' },
      { id: 3, name: 'Moved to UAT' }
    ];   
     
  }


  subModuleData(submodule) {
    console.log("submodule names ", submodule)
    if (submodule.name == 'Task') {
      this.isShowTasksummary = true;
      this.taskcreate = false;
      this.isShowStory = false;
      this.storycreate = false;
      this.storyiew = false;
      this.story_taskView = false;
      this.sprintcreate = false;
      this.isShowSprint = false;
      this.isShowBacklog = false;
      this.taskedit = false;
      this.isShowIssues = false;
      this.isShowPipelines = false;
      this.issuecreate = false;
      this.isShowStorySpr = false;
      this.TaskSearch('');
    }
    if (submodule.name == 'Stories') {
      this.isShowTasksummary = false;
      this.taskcreate = false;
      this.isShowStory = true;
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
      this.isShowStorySpr = false;
      this.storySearch('');
    }
    if (submodule.name == 'Sprint') {
      this.isShowTasksummary = false;
      this.taskcreate = false;
      this.isShowStory = false;
      this.storycreate = false;
      this.storyiew = false;
      this.story_taskView = false;
      this.sprintcreate = false;
      this.isShowSprint = true;
      this.isShowBacklog = false;
      this.taskedit = false;
      this.isShowIssues = false;
      this.isShowPipelines = false;
      this.issuecreate = false;
      this.isShowStorySpr = false;
      this.sprintSearch('');
    }
    if (submodule.name == 'Backlog') {
      this.isShowTasksummary = false;
      this.taskcreate = false;
      this.isShowStory = false;
      this.storycreate = false;
      this.storyiew = false;
      this.story_taskView = false;
      this.sprintcreate = false;
      this.isShowSprint = false;
      this.isShowBacklog = true;
      this.showTasksPage = false;
      this.showTasksVuews = false;
      this.isStorySearch = false;
      this.isShowStorySummary = false;
      this.taskedit = false;
      this.isShowIssues = false;
      this.isShowPipelines = false;
      this.issuecreate = false;
      this.isShowStorySpr = false;
      this.backlogSummary();
    }
    if (submodule.name == 'Issues') {
      this.isShowTasksummary = false;
      this.taskcreate = false;
      this.isShowStory = false;
      this.storycreate = false;
      this.storyiew = false;
      this.story_taskView = false;
      this.sprintcreate = false;
      this.isShowSprint = false;
      this.isShowBacklog = false;
      this.showTasksPage = false;
      this.showTasksVuews = false;
      this.isStorySearch = false;
      this.isShowStorySummary = false;
      this.taskedit = false;
      this.isShowIssues = true
      this.isShowPipelines = false;
      this.issuecreate = false;
      this.isShowStorySpr = false;
      this.issueSummary(1,'');
    }
    if (submodule.name == 'Pipeline') {
      this.isShowTasksummary = false;
      this.taskcreate = false;
      this.isShowStory = false;
      this.storycreate = false;
      this.storyiew = false;
      this.story_taskView = false;
      this.sprintcreate = false;
      this.isShowSprint = false;
      this.isShowBacklog = false;
      this.showTasksPage = false;
      this.showTasksVuews = false;
      this.isStorySearch = false;
      this.isShowStorySummary = false;
      this.taskedit = false;
      this.isShowIssues = false;
      this.isShowPipelines = true;
      this.issuecreate = false;
      this.isShowStorySpr = false;
      // this.pipelineSummary();
    }
  }

  onclickTaskAdd() {
    // this.shareservice.story_Id.next(this.story_ID);
    this.shareservice.story_Id.next(this.selectedItem.id)
    this.taskcreate = true;
    this.isShowTasksummary = false;
    this.isShowStory = false;
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = false;
    this.taskedit = false;
    this.isShowIssues = false;
    this.isShowPipelines = false;
    this.issuecreate = false;
    this.isShowBacklog = false;
    this.isShowStorySpr = false;


  }
  onclickTaskEdit(taskdata) {
    this.shareservice.story_Id.next(this.story_ID);
    this.taskcreate = false;
    this.isShowTasksummary = false;
    this.isShowStory = false;
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = false;
    this.taskedit = true;
    this.isShowIssues = false;
    this.isShowPipelines = false;
    this.issuecreate = false;
    this.isShowBacklog = false;
    this.isShowStorySpr = false;


  }

  onclickStoryAdd() {
    this.taskcreate = false;
    this.isShowTasksummary = false;
    this.isShowStory = false;
    this.storycreate = true;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = false;
    this.taskedit = false;
    this.isShowIssues = false;
    this.isShowPipelines = false;
    this.issuecreate = false;
    this.isShowBacklog = false;
    this.isShowStorySpr = false;


  }
  onclickIssueAdd() {
    this.shareservice.story_Id.next(this.story_ID);
    this.taskcreate = false;
    this.isShowTasksummary = false;
    this.isShowStory = false;
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = false;
    this.taskedit = false;
    this.isShowIssues = false;
    this.isShowPipelines = false;
    this.issuecreate = true;
    this.isShowBacklog = false;
    this.isShowStorySpr = false;

  }

  viewTask(data) {
    this.storyId = data.id;
    this.taskcreate = false;
    this.isShowTasksummary = false;
    this.isShowStory = true;
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = false;
    this.taskedit = false;
    this.isShowIssues = false;
    this.storyView();
    this.isShowPipelines = false;
    this.issuecreate = false;
    this.StoryTaskSearch('');
    this.isShowBacklog = false;
    this.isShowStorySpr = false;

  }

  backnavigate() {
    this.taskcreate = false;
    this.isShowTasksummary = false;
    this.isShowStory = false;
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = true;
    this.taskedit = false;
    this.isShowIssues = false;
    this.isShowPipelines = false;
    this.issuecreate = false;
    this.isShowStorySpr =false;
    // this.storySearch('')
  }


  story_Task_ID: number
  story_TaskView(story_taskID) {
    this.story_Task_ID = story_taskID;
    this.taskcreate = false;
    this.isShowTasksummary = false;
    this.isShowStory = false;
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = true;
    this.sprintcreate = false;
    this.isShowSprint = false;
    this.taskedit = false;
    this.isShowIssues = false;
    this.isShowPipelines = false;
    this.issuecreate = false;
    this.isShowStorySpr = false;
    this.storyTaskView(story_taskID);

  }

  story_taskView_backnavigate() {
    this.taskcreate = false;
    this.isShowTasksummary = false;
    this.isShowStory = true;
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = false;
    this.taskedit = false;
    this.isShowIssues = false;
    this.isStorySearch = true;
    this.isShowStorySummary = true;
    this.isShowPipelines = false;
    this.issuecreate = false;
    this.isShowStorySpr = false;
    this.StoryTaskSearch(this.storyViewDaata.id)
  }

  getStoryAddScreen() {
    this.isShowTasksummary = false;
    this.taskcreate = false;
    this.isShowStory = false;
    this.storycreate = true;
    this.storyiew = false;
    this.sprintcreate = false;
    this.isShowSprint = false;
    this.taskedit = false;
    this.isShowIssues = false;
    this.isShowPipelines = false;
    this.issuecreate = false;
    this.isShowStorySpr = false;

  }
  getSprintAddScreen() {
    this.isShowTasksummary = false;
    this.taskcreate = false;
    this.isShowStory = false;
    this.storycreate = false;
    this.storyiew = false;
    this.sprintcreate = true;
    this.isShowSprint = false;
    this.taskedit = false;
    this.isShowIssues = false;
    this.isShowPipelines = false;
    this.issuecreate = false;
    this.isShowStorySpr = false;

  }


  // story view
  storyView() {
    this.TaskManagerService.getStoriesView(this.storyId)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("story View", result)
        this.storyViewDaata = result;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }

      )
  }


  // ViewData:any;
  // story task view
  storyTaskView(story_taskID) {
    this.storyrId = story_taskID
    this.TaskManagerService.getStories_taskView(story_taskID)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("story task View", result)
        // this.ViewData = result;

        let currentDate = new Date()
        let formtDate = this.datePipe.transform(currentDate, "yyyy-MM-dd")
        let Plan_Start: any
        let Plan_End: any
        let PlanDaysCalculate
        let TotalPlanDays


        Plan_Start = new Date(this.datePipe.transform(result.start_date, 'yyyy-MM-dd'));
        Plan_End = new Date(this.datePipe.transform(result.end_date, 'yyyy-MM-dd'));

        PlanDaysCalculate = Plan_Start.getTime() - Plan_End.getTime()
        TotalPlanDays = (Math.abs(PlanDaysCalculate) / (1000 * 60 * 60 * 24)) + 1;

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
    this.TaskManagerService.ChaneStatus(obj, taskstatus.id)
      .subscribe(results => {
        this.notification.showSuccess("Status Updated")
        this.storyTaskView(taskstatus.id)
      })

  }


  UpdateTask(data) {
    for (let i = 0; i < data.employee_hours.length; i++) {
      data.employee_hours[i].employee_id = data.employee_hours[i].employee_id.id;
    }
    let obj = {
      emp_hr: data?.employee_hours,
      delay_days: data.DynamicDelayDaysCount,
      reason_for_delay: data.reason_for_delay
    }
    console.log(data, obj)
    this.TaskManagerService.ChaneStatus(obj, data.id)
      .subscribe(results => {
        this.notification.showSuccess("Status Updated")
        this.storyTaskView(data.id)
      })

  }



  StoryTaskSearch(hint: any) {

    if (hint == 'next') {
      this.storyTaskSummary(this.storyId, this.presentpageStoryTask + 1)
    }
    else if (hint == 'previous') {
      this.storyTaskSummary(this.storyId, this.presentpageStoryTask - 1)
    }
    else {
      this.storyTaskSummary(this.storyId, 1)
    }
  }

  storyTaskSummary(id, pageno) {
    // this.storyTaskList = this.data
    this.storysId = id
    this.TaskManagerService.getStoryTaskSummary(id, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("story task summary", result)
        this.storyTaskList = result['data']
        this.dataPaginationt = result['pagination'];
        if (this.storyTaskList.length > 0) {
          this.has_nextStoryTask = this.dataPaginationt.has_next;
          this.has_previousStoryTask = this.dataPaginationt.has_previous;
          this.presentpageStoryTask = this.dataPaginationt.index;

        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }

      )
  }



  storySearch(hint: any) {
    let search = this.storySummaryForm.value;
    search.start_date = this.datepipe.transform(search.start_date, 'yyyy-MM-dd');
    search.end_date = this.datepipe.transform(search.end_date, 'yyyy-MM-dd');
    let obj = {
      "start_date": search?.start_date,
      "end_date": search?.end_date,
      "query": search?.query,
      "status": search?.status,
      // "app_id": search?.app_id?.id,
      // "client": search?.client?.id,
      // "module_id": search?.module_id?.id,
      // // "status": search?.status,
      // "developer_id": search?.developer_id?.id,
      // "team_lead": search?.team_lead?.id,
      // "query": search?.query
    }
    console.log("obj api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }
    this.SpinnerService.show();

    if (hint == 'next') {
      this.storySummary(obj, this.storypresentpage + 1)
    }
    else if (hint == 'previous') {
      this.storySummary(obj, this.storypresentpage - 1)
    }
    else {
      this.storySummary(obj, 1)
    }
  }

  storySummary(search, pageno) {
    this.TaskManagerService.getStories(search, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("story summary", result)
        this.storyList = result['data']
        let dataPagination = result['pagination'];
        if (this.storyList.length > 0) {
          this.has_storynext = dataPagination.has_next;
          this.has_storyprevious = dataPagination.has_previous;
          this.storypresentpage = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }

      )
  }




  storyreset() {
    this.storySummaryForm = this.fb.group({
      start_date: '',
      end_date: '',
      query: '',
      status: ''
    })
    this.storySearch('')

  }


  TaskSearch(hint: any) {
    let search = this.taskSearchForm.value;
    search.start_date = this.datepipe.transform(search.start_date, 'yyyy-MM-dd');
    search.end_date = this.datepipe.transform(search.end_date, 'yyyy-MM-dd');
    let obj = {
      "start_date": search?.start_date,
      "end_date": search?.end_date,
      "dev_type": search?.dev_type,
      "app_id": search?.app_id?.id,
      "client": search?.client?.id,
      "module_id": search?.module_id?.id,
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
      this.taskSummary(obj, this.presentpageTask + 1)
    }
    else if (hint == 'previous') {
      this.taskSummary(obj, this.presentpageTask - 1)
    }
    else {
      this.taskSummary(obj, 1)
    }
  }




  taskSummary(search, pageno) {
    this.TaskManagerService.storyBasedTaskSummary(search, pageno, this.chipSelectedempid)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("task summary", result)
        this.taskList = result['data']
        let dataPagination = result['pagination'];
        // this.updatePagination();
        if (this.taskList.length > 0) {
          this.has_nextTask = dataPagination.has_next;
          this.has_previousTask = dataPagination.has_previous;
          this.presentpageTask = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }

      )
  }

  resetTask() {
    this.chipSelectedempid = [];
    this.chipSelectedemp = [];
    this.taskSearchForm = this.fb.group({
      app_id: '',
      client: '',
      dev_type: '',
      module_id: '',
      unit_head: '',
      team_lead: '',
      start_date: '',
      end_date: '',
      status: '',
      query: '',
      developer_id: '',
      teamlead: '',


    })
    this.TaskSearch('')

  }



  sprintSearch(hint: any) {
    let search = this.sprintSummaryForm.value;
    search.start_date = this.datepipe.transform(search.start_date, 'yyyy-MM-dd');
    search.end_date = this.datepipe.transform(search.end_date, 'yyyy-MM-dd');
    let obj = {
      "start_date": search?.start_date,
      "end_date": search?.end_date,
      "query": search?.query,
      "status": search?.status,
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

  SubmitbackToSummary() {
    this.TaskSearch('')
    this.isShowTasksummary = false;
    this.taskcreate = false;
    this.isShowStory = false;
    this.storycreate = false;
    this.storyiew = true;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = false;


  }


  CancelbackToSummary() {
    this.isShowTasksummary = false;
    this.taskcreate = false;
    this.isShowStory = false;
    this.storycreate = false;
    this.storyiew = true;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = false;


  }



  SubmitbackToStorySummary() {
    this.isShowTasksummary = false;
    this.storycreate = false;
    this.isShowStory = true;
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = false;
    this.storySearch('')

  }


  CancelbackToStorySummary() {
    this.isShowTasksummary = false;
    this.taskcreate = false;
    this.isShowStory = true;
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = false;


  }

  SubmitbackTosprintSummary() {
    this.isShowTasksummary = false;
    this.storycreate = false;
    this.isShowStory = false;
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = true;
    // this.storySearch('')

  }


  CancelbackTosprintSummary() {
    this.isShowTasksummary = false;
    this.taskcreate = false;
    this.isShowStory = false;
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = true;
  }
  SubmitbackToIssue() {
    this.isShowTasksummary = false;
    this.taskcreate = false;
    this.isShowStory = false;
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = false;
    this.isShowBacklog = false;
    this.showTasksPage = false;
    this.showTasksVuews = false;
    this.isStorySearch = false;
    this.isShowStorySummary = false;
    this.taskedit = false;
    this.isShowIssues = true
    this.isShowPipelines = false;
    this.issuecreate = false;
    this.issueSummary(1,'');
  }
  // app name
  appName() {
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
        switchMap(value => this.taskreportservice.getprojectsearchFilter(this.client_Id, value, 1)
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
    this.taskreportservice.getprojectsearchFilter(this.client_Id, appkeyvalue, 1)
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
                this.taskreportservice.getprojectsearchFilter(this.client_Id, this.appnmInput.nativeElement.value, this.currentpage + 1)
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




  // module name
  moduleName() {
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
        switchMap(value => this.taskreportservice.getmodulesearchFilter(this.client_Id, this.project_Id, value, 1)
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
    this.taskreportservice.getmodulesearchFilter(this.client_Id, this.project_Id, modkeyvalue, 1)
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


  getemp(keyvalue) {
    this.taskreportservice.getStatus_multipleSelection(keyvalue, 1)
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
                this.taskreportservice.getclientsearchFilter(this.taskrcltInput.nativeElement.value, this.currentpage + 1)
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


  // Team lead
  TeamLead() {
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
        switchMap(value => this.TaskManagerService.getTeamFilter(value, 1)
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
                this.TaskManagerService.getTeamFilter(this.teamldInput.nativeElement.value, this.currentpage + 1)
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

  public displayFnteamld(teamld?: teamLead): string | undefined {
    return teamld ? teamld.name : undefined;
  }

  get teamld() {
    return this.taskSearchForm.value.get('team_lead');
  }


  // developer Name
  developerName() {
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




  getTeamLeads(teamldkeyvalue) {
    this.TaskManagerService.getTeamFilter(teamldkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.teamldList = datas;
        console.log("The team leads ", results)
      })
  }


  set_StartDate: any;
  StartDate(event: string) {
    const date = new Date(event)
    // this.ss1 = date
    this.set_StartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
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
                this.taskreportservice.getmodulesearchFilter(this.client_Id, this.project_Id, this.modnmInput.nativeElement.value, this.currentpage + 1)
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


  showPopUp(data) {
    if (data.DynamicStoryCall == true) {
      data.DynamicStoryCall = false
    } else {
      data.DynamicStoryCall = true
    }

  }
  selectItem(data) {
    if(data == '' || data == null)
    {
      this.isShowStory = true;
      console.log("data", data)
    }
    else{
      this.showTasksPage = true;
    this.selectedItem = data;
    }
    
  }
  createStory() {
    this.storycreate = true;
    this.isShowStory = false;
  }
  sprintClick() {
    let devkeyvalue: String = "";
    this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.storiesForm.get('sprint').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.TaskManagerService.getSprintFilter(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.sprintList = datas;

      })

  }
  private getsprint(unithdkeyvalue) {
    this.TaskManagerService.getSprintFilter(unithdkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.sprintList = datas;
      })
  }
  public displayFn(sprint?: Sprint): string | undefined {
    return sprint ? sprint.name : undefined;
  }

  get sprint() {
    return this.storiesForm.value.get('sprint');
  }

  loadMoreStories() {
    let obj = {
      "start_date": '',
      "end_date": '',
      "query": '',
      "status": ''
    }
    // Make an HTTP request to fetch the next set of data
    this.TaskManagerService.getStories(obj, this.page)
      .subscribe((data: any) => {
        // Append the new data to the existing storyList
        let datas = data['data']
        this.storyList = this.storyList.concat(datas);

        // Increment the page number for the next request
        this.page++;
      });
  }

  viewTasks(data) {
    this.storyId = data.id;
    this.taskcreate = false;
    this.isShowTasksummary = false;
    this.isShowStory = true;
    this.showTasksPage = true;
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = false;
    this.isShowStorySummary = false;
    this.storyView();
    this.StoryTaskSearch('');

  }
  viewTasksPage(data) {
    this.storyId = data.id;
    this.taskcreate = false;
    this.isShowTasksummary = false;
    this.isShowStory = true;
    this.showTasksPage = false;
    this.showTasksVuews = true;
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = false;
    this.isShowStorySummary = false;
    this.isStorySearch = false;
    this.storyView();
    this.StoryTaskSearch('');
  }
  backlogSummary() {
    this.TaskManagerService.getBacklogSummary('','')
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("story task summary", result)
        this.backlogList = result['data']
        let dataPagination = result['pagination'];
        if (this.backlogList.length > 0) {
          this.has_nextStoryTask = dataPagination.has_next;
          this.has_previousStoryTask = dataPagination.has_previous;
          this.presentpageStoryTask = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }

      )
  }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(DialogfilterComponent, {
  //     position: { top: '170px', right: '0' },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log('Values from Dialog', result);
  //     this.sprintSearchs(result)

  //   });
  //   // this.searclos = true;
  // }

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


  getEmployeeNames(assignedTo: any[]): string {
    return assignedTo.map(emp => emp.name).join(', ');
  }

  issueSummary(page,obj) {
    this.TaskManagerService.getIssueSummary(page,obj)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("story task summary", result)
        this.issueList = result['data']
        let dataPagination = result['pagination'];
        if (this.issueList.length > 0) {
          this.has_nextStoryTask = dataPagination.has_next;
          this.has_previousStoryTask = dataPagination.has_previous;
          this.presentpageStoryTask = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }

      )
  }
  developer() {
    this.taskmanagerservice.task_employeesearch('', '')
      .subscribe(res => {
        console.log('type', res)
        this.empLists = res
      })
  }
  //pipelineSummary
  pipelineSummary() {
    let page = 1;
    let action  = this.pipelineSummaryForm.get('status').value;
    this.TaskManagerService.getPipelineSummary(page, action)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("story task summary", result)
        this.pipeList = result['data']
        let dataPagination = result['pagination'];
        if (this.issueList.length > 0) {
          this.has_nextStoryTask = dataPagination.has_next;
          this.has_previousStoryTask = dataPagination.has_previous;
          this.presentpageStoryTask = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }

      )
  }
  updatePagination() {
    this.taskSummary('', this.pageNumbers)
  }
  previousPage() {
    this.pageNumbers--;
    this.updatePagination();
  }
  nextPage() {
    this.pageNumbers++;
    this.updatePagination();

  }
  updatePaginationSpr() {
    let obj = {
      "start_date": '',
      "end_date": '',
      "query": '',
      "status": '',
    }
    this.sprintSummary(obj, this.pageNumb)
  }
  previousPageSummary() {
    this.pageNumb--;
    this.updatePaginationSpr();
  }
  nextPageSummary() {
    this.pageNumb++;
    this.updatePaginationSpr();

  }

  updatePaginationt() {
    this.storysId 
    this.storyTaskSummary(this.storyId, this.pageNumbt)
  }
  previousPaget() {
    this.pageNumbt--;
    this.updatePaginationt();
  }
  nextPaget() {
    this.pageNumbt++;
    this.updatePaginationt();

  }
  checkAll() {
    for (const type of this.issueList) {
      type.isChecked = this.allChecked;
    }
    this.updateSelectedItems();
  }
  
  updateSelectedItems() {
    this.selectedItems = this.issueList.filter((type) => type.isChecked);
    this.showMoveToTaskButton = this.selectedItems.length > 0;
    this.showMoveToTaskButton = true;
  }
  moveToTask() {

    this.TaskManagerService.IssuetoTask(this.selectedItems)
    .subscribe(result => {
      this.SpinnerService.hide();
      this.notification.showError(result)
      console.log("story task summary", result)
      this.pipeList = result['data']
      let dataPagination = result['pagination'];
      if (this.issueList.length > 0) {
        this.has_nextStoryTask = dataPagination.has_next;
        this.has_previousStoryTask = dataPagination.has_previous;
        this.presentpageStoryTask = dataPagination.index;
      }
    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }

    )

  }
  isEndDateExpired(): boolean {
    const endDate = new Date(this.taskList.end_date);
    const today = new Date();
    return endDate < today;
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

  viewTaskSpr(data) {
    this.storyId = data.id;
    this.taskcreate = false;
    this.isShowTasksummary = false;
    this.isShowStory = false;
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = false;
    this.taskedit = false;
    this.isShowIssues = false;
    this.storyView();
    this.isShowPipelines = false;
    this.issuecreate = false;
    // this.StoryTaskSearch('');
    this.isShowBacklog = false;
    this.isShowStorySpr = true;
    this.StoryTaskSearch('');

  }

  updatePaginationIss() {
    let obj = {
      "start_date": '',
      "end_date": '',
      "query": '',
      "status": '',
    }
    this.issueSummary(this.pageNumbi,'')
  }
  previousPageSummaryI() {
    this.pageNumbi--;
    this.updatePaginationIss();
  }
  nextPageSummaryI() {
    this.pageNumbi++;
    this.updatePaginationIss();

  }
  onSelectChange(event: any):void
  {
    this.pipelineSummary();
  }

  Reset()
  {

  }

  adsearchclose()
  {

  }

  sprintSearches()
  {

  }
  makeEditable() {
    const textElement = document.getElementById("editableText");
    const text = textElement.innerText;
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = text;
    
    // Replace the text with the input field
    textElement.innerText = "";
    textElement.appendChild(inputField);
    
    inputField.focus(); // Focus on the input field
    inputField.select(); // Select the text in the input field
    inputField.addEventListener("blur", () => this.makeNonEditable(inputField, textElement));
    inputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            this.makeNonEditable(inputField, textElement);
        }
    });
}

 makeNonEditable(inputField, textElement) {
    const newText = inputField.value;
    textElement.innerText = newText;
    // You can also update your data here if needed.
}

createFilter() {
  return this.fb.group({
    field: [''],    // You can set default values here if needed
    options: [''],  // You can set default values here if needed
  });
}

// Add a new FormGroup to the FormArray
addFilter() {
  const filters = this.sprintFilterForm.get('filters') as FormArray;
  filters.push(this.createFilter());
}

removeFilter(index: number) {
  const filters = this.sprintFilterForm.get('filters') as FormArray;
  filters.removeAt(index);
}

reassignTask()
{
  
  let data = this.reassignForm.value
  let payload = [{
    "emp_id" : data.developer_id.id,
    "task_id":  this.storyrId
  }]
  console.log("Reassigner", data)
  console.log("ReassignerPay", payload)

  this.taskmanagerservice.reassignTask(payload).subscribe(
    results=>{
      this.SpinnerService.hide()
        this.notification.showSuccess("Task Reassigned")
        // this.OnSubmit.emit() 
        return true 
      }, error =>{
      this.SpinnerService.hide()
      
      }) 
  
}

resetTasks()
{
  this.taskSearchForm.reset();
  this.clearMatChipInput();
  this.TaskSearch('');

}

clearMatChipInput() {
  // Clear the array that holds the mat-chip values
  this.chipSelectedemp = [];

  // Clear the form control associated with the mat-chip input
  this.taskSearchForm.get('status').setValue(null);
}



  













}
