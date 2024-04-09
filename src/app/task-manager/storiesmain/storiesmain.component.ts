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
export interface clientlists {
  id: string;
  client_code: string;
  client_name: string;
}
export interface modulelists {
  id: string;
  client_code: string;
  module_name: string;
}


export interface clientsprint{
  id:string;
  client_code:string;
  client_name:string;
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
  selector: 'app-storiesmain',
  templateUrl: './storiesmain.component.html',
  styleUrls: ['./storiesmain.component.scss'],
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
export class StoriesmainComponent implements OnInit {

  selectedDate: Date;
  sprintfilter: [{ "name": "Start Date", "id": 1 }, { "name": "End Date", "id": 2 }, { "name": "Query", "id": 3 }]
  sprintfilterss: [{ "name": "Start Date", "id": 1 }, { "name": "End Date", "id": 2 }, { "name": "Query", "id": 3 }, { "name": "Team", "id": 4 }, { "name": "Sprint", "id": 5 }]
  taskfilter: [{ "name": "Start Date", "id": 1 }, { "name": "End Date", "id": 2 }, { "name": "Query", "id": 3 }, { "name": "App id", "id": 4 }, { "name": "Client ", "id": 5 }, { "name": "Module id  ", "id": 6 }, { "name": "Developer id ", "id": 7 }, { "name": "Team lead ", "id": 8 }, { "name": "Status ", "id": 9 }]
  backlogfilter: [{ "name": "Start Date", "id": 1 }, { "name": "End Date", "id": 2 }, { "name": "Query", "id": 3 }, { "name": "App id", "id": 4 }, { "name": "Client ", "id": 5 }, { "name": "Module id  ", "id": 6 }, { "name": "Developer id ", "id": 7 }, { "name": "Team lead ", "id": 8 }]
  pipelinefilter: [{ "name": "Start Date", "id": 1 }, { "name": "End Date", "id": 2 }, { "name": "Pipeline Status", "id": 3 }, { "name": "App id", "id": 4 }, { "name": "Client ", "id": 5 }, { "name": "Module id  ", "id": 6 }, { "name": "Developer id ", "id": 7 }, { "name": "Team lead ", "id": 8 }]
  issuefilter: [{ "name": "Start Date", "id": 1 }, { "name": "End Date", "id": 2 }, { "name": "Query", "id": 3 }, { "name": "App id", "id": 4 }, { "name": "Client ", "id": 5 }, { "name": "Module id  ", "id": 6 }, { "name": "Priority  ", "id": 7 }, { "name": "Status ", "id": 8 }]
  Tran_Menu_List: any;
  statusList = [{ 'id': 1, 'name': 'Createdby Me' }, { 'id': 2, 'name': 'Others' }];
  teamdrop: any
  appdrop: any
  sprinttdrop: any
  clientdrop: any
  moduledrop: any
  teams: any
  statusdrops: any
  develop: any
  returnnav: number;
  startdate: boolean = false
  enddate: boolean = false
  query: boolean = false
  app_id: boolean = false
  client: boolean = false
  module_id: boolean = false
  priority: boolean = false
  statuss: boolean = false
  statusss: boolean = false
  developer_id: boolean = false
  team_lead: boolean = false
  pipeline_status: boolean = false
  team: boolean = false
  sprintss: boolean = false
  inpstartdatesprint: any
  inpenddatesprint: any
  taskcreate: boolean;
  isShowTasksummary: boolean = false;
  isShowStory: boolean = true;
  isShowStorySpr: boolean;
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
  
  @ViewChild('clientteamrole') matclienttAutocomplete: MatAutocomplete;
  @ViewChild('teamsprintrole') matappAutoteamsprintcomplete: MatAutocomplete;
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
  @ViewChild('closebutton1') closebutton1;

  pipeList: any;
  showMoreInfo: boolean;
  issuecreate: boolean = false;
  storySearchForm: FormGroup;
  allChecked: boolean = false;
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
  isShowbuttons: boolean = false;
  isShowComments: boolean = false;
  isShowWorklogs: boolean = false;
  isShowCommentTask: boolean = false;
  isShowHistory: boolean = false;
  clientdata: any;
  moduledata: any;
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
  pageNumbersl: any = 1;
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
  pageNumbi: any = 1;
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
  pagePipe: any = 1;
  statusLists: { name: string; }[];
  isLastPage: boolean = true;
  filterForm: FormGroup;
  showPopup: boolean = false;
  showPopupss: boolean = false;
  taskpopup: boolean = false;
  taskPopups: boolean = false;
  backlogPopus: boolean = false;
  issuePopus: boolean = false
  pipelinePopup: boolean = false
  teamList: any;
  assignForm: FormGroup;
  showpagedata: boolean = true;

  showtabledatas: boolean = true
  isShowtimesheet: boolean;
  timeSheetList: any;
  dateID: any;
  activityArr2: any;
  timesumtable: any;
  timeSheet: FormGroup;
  actualdate: any;
  endadate: any;
  isActualDate: any;
  taskview: boolean;
  isButtonDisabled: boolean=false;



  constructor(
    private fb: FormBuilder, private router: Router, private toastr: ToastrService, private notify: imp.ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService,
    private TaskManagerService: TaskManagerService, private datepipe: DatePipe, private taskreportservice: TaskService,
    private notification: NotificationService, private datePipe: DatePipe, private shareservice: SharedService,
    private dialog: MatDialog, private taskmanagerservice: TaskManagerService, private LocalShareService:ShareddataService


  ) {

  }


  @Output() OnSubmit = new EventEmitter<any>();

  ngOnInit(): void {

    this.storySummaryForm = this.fb.group({
      start_date: '',
      end_date: '',
      query: '',
      status: '',
      team: '',
      sprint: '',
      dynamicdropdown: '',
      sprints: ''





    })
    if(this.storyId == null || this.storyId === undefined) {
    this.storySearch('');
    }
    this.getTeamDropDown();
    this.getSprintDropDown();
  }



  storySearch(hint: any) {
    let search = this.storySummaryForm.value;
    search.start_date = this.datepipe.transform(search.start_date, 'yyyy-MM-dd');
    search.end_date = this.datepipe.transform(search.end_date, 'yyyy-MM-dd');
    let obj = {
      "start_date": search?.start_date,
      "end_date": search?.end_date,
      // "query": search?.query,
      // "status": search?.status,
      "team": search?.team?.id,
      "sprint": search?.sprint?.id,
      // "app_id": search?.app_id?.id,
      // "client": search?.client?.id,
      // "module_id": search?.module_id?.id,
      // // "status": search?.status,
      // "developer_id": search?.developer_id?.id,
      // "team_lead": search?.team_lead?.id,
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
        if(result['data'].length == 0) {
          this.storyList = result['data']
         this.showTasksPage = false;
         this.has_storynext = false;
         this.showTasksVuews = false;
         this.SpinnerService.hide();
         this.showPopupss = false
         this.notify.error("No Stories Found")
        }
        else {
        this.SpinnerService.hide();
        console.log("story summary", result)
        this.storyList = result['data']
        this.showTasksPage = true;
        let dataPagination = result['pagination'];
        if (this.storyList.length > 0) {
          this.selectItem(this.storyList[0]);
          // this.viewTask(this.storyList[0]);
          this.has_storynext = dataPagination.has_next;
          this.has_storyprevious = dataPagination.has_previous;
          this.storypresentpage = dataPagination.index;
          // this.storySummaryForm.reset()
        }
        this.showPopupss = false
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
  selectItem(data) {
    if (data == '' || data == null) {
      this.isShowStory = true;
      console.log("data", data)


    }
    else {
      this.showTasksPage = true;
      this.selectedItem = data;
      this.storyId=data?.id
      // this.StoryTaskSearch('');/
      this.storyTaskSummary(this.storyId, this.pageNumbt)
    }

  }


  createStory() {
    this.storycreate = true;
    this.isShowStory = false;
  }
  onSelectChanges(event: any): void {
    this.storySearch('');
  }
  onSelectChangeSpr(event: any): void {
    this.storySearch('')
  }

  storySearching(hint: any) {
    let search = this.storySummaryForm.value;
    // search.start_date = this.datepipe.transform(search.start_date, 'yyyy-MM-dd');
    // search.end_date = this.datepipe.transform(search.end_date, 'yyyy-MM-dd');
    let obj = search
    console.log("obj api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }
    this.SpinnerService.show();

    if (hint == 'next') {
      this.storySummarys(obj, this.sprintpresentpage + 1)
    }
    else if (hint == 'previous') {
      this.storySummarys(obj, this.sprintpresentpage - 1)
    }
    else {
      this.storySummarys(obj, 1)
    }
  }

  // sprint summary
  storySummarys(obj, pageno) {
    this.TaskManagerService.getStorySummary(obj, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("sprint summary", result)
        this.storyList = result['data']

        this.dataPaginationSpr = result['pagination'];
        this.storyList.forEach(x => {
          Object.assign(x, {
            "DynamicStoryCall": false,

          })
        })
        if (this.storyList.length > 0) {
          this.has_sprintnext = this.dataPaginationSpr.has_next;
          this.has_sprintprevious = this.dataPaginationSpr.has_previous;
          this.sprintpresentpage = this.dataPaginationSpr.index;
          
        }
        // this.sprintList.forEach(x =>{
        //   console.log("Stories get", this.storiesget)
        // })
        
        console.log("storyList",this.storyList)
        return this.sprintList
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }

      )
  }

  resetStory() {
    this.storySummaryForm.reset();
    this.storySearch('');
  }

  getTeamDropDown() {
    this.taskmanagerservice.getTeams().subscribe(res => {
      this.teamList = res['data']
    })

  }
  getSprintDropDown() {
    this.taskmanagerservice.getSprints('').subscribe(res => {
      this.sprintlsts = res['data']
    })

  }
  popclose(){
    this.storySearch('');
    this.storyTaskSummary(this.storyId, this.pageNumbt)
    this.closebutton.nativeElement.click();
  }
  SubmitbackToStorySummary() {
    this.storycreate = false;
    this.isShowStory = true;
    this.taskcreate = false;
    this.closebutton.nativeElement.click();
    // this.closebutton1.nativeElement.click();
    // this.storySearch('');
    this.storyTaskSummary(this.storyId, this.pageNumbt)



  }
  SubmitbackToStorySummarys() {
    this.storycreate = false;
    this.isShowStory = true;
    this.taskcreate = false;
    // this.closebutton.nativeElement.click();
    // this.closebutton1.nativeElement.click();
    // this.storySearch('');
    this.storyTaskSummary(this.storyId, this.pageNumbt)



  }

  CancelbackToStorySummary()
  {
    this.storycreate = false;
    this.isShowStory = true;
    this.taskcreate = false;
    // this.storySearch('');
    if (this.storyId!=""&& this.storyId!=undefined){
      this.storyTaskSummary(this.storyId, this.pageNumbt)
    }
    

  }

  onclickTaskAdd()
  {
    this.LocalShareService.story_Id.next(this.selectedItem.id);
    this.LocalShareService.sprintfromdate.next(this.selectedItem?.sprint?.from_date)
    this.LocalShareService.sprinttodate.next(this.selectedItem?.sprint?.to_date)
    this.LocalShareService.storyName.next("("+this.selectedItem?.code+") "+this.selectedItem?.name)

    if (this.selectedItem?.sprint?.name !=""&& this.selectedItem?.sprint?.name !=undefined){
      this.LocalShareService.sprintName.next("("+this.selectedItem?.sprint?.code+") "+this.selectedItem?.sprint?.name)

    }
    else{
      this.LocalShareService.sprintName.next(" ")
    }

    this.taskcreate = true;
    this.storycreate = false;
    this.isShowStory = false;
  }

  togglePopupss() {
    this.showPopupss = !this.showPopupss;
    console.log("this.showPopupss",this.showPopupss)
    this.sprintfilterss=[{"name":"Start Date","id":1},{"name":"End Date","id":2},{"name":"Query","id":3},{"name":"Team","id":4},{"name":"Sprint","id":5}]
  }

  getteamdrop() {
    this.TaskManagerService.teamget('').subscribe(res=>{
      this.teamdrop= res['data']
    })
  }


  getsprintdrop() {
    this.TaskManagerService.sprintget().subscribe(res=>{
      this.sprinttdrop= res
    })
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
  getDeveloperdrop() {
    this.TaskManagerService.getdeveloper('').subscribe(res=>{
      this.develop = res['data']
    })
  }
  getTeamleaddrop() {
    this.TaskManagerService.getteams('').subscribe(res=>{
      this.teams= res['data']
    })
  }
  statusdrop() {
    this.TaskManagerService.gesta('').subscribe(res=>{
      this.statusdrops= res
    })
  }
  appClick() {
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.taskSummaryForm.get('app_id').valueChanges
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
teamsprintclick() {
  let devkeyvalue: String = "";
  // this.getsprint(devkeyvalue);
  // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
  this.storySummaryForm.get('sprint').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.TaskManagerService.getSprints(value)
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

teamclick() {
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.storySummaryForm.get('team').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.TaskManagerService.teamget(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.teamdrop = datas;




      })

  

  
}
moduleClick() {
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.taskSummaryForm.get('module_id').valueChanges
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
developerClick(){
  let devkeyvalue: String = "";
  // this.getsprint(devkeyvalue);
  // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
  this.taskSummaryForm.get('developer_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.TaskManagerService.getdeveloper(value)
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
teamleadclick(){
  let devkeyvalue: String = "";
  // this.getsprint(devkeyvalue);
  // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
  this.taskSummaryForm.get('team_lead').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.TaskManagerService.getteams(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.teams = datas;




    })

}
statusclick(){
  let devkeyvalue: String = "";
  // this.getsprint(devkeyvalue);
  // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
  this.taskSummaryForm.get('team').valueChanges
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
      let datas = results["data"];
      this.statusdrops = datas;




    })

}
public displaydis(AppId?: productlistss): string | undefined {
  // console.log('id', producttype.id);
  // console.log('name', producttype.name);
  return AppId ? AppId.name : undefined;
}
get AppId() {
  return this.taskSummaryForm.get('app_id');
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
  this.issueView = false;
  this.pipelinecreate = false;
}
eventpro(event: Event): void {
  event.stopPropagation();
}

openModal(event: Event): void {
  event.stopPropagation();
  // Additional logic for opening the modal if needed
}
storyTaskSummary(id, pageno) {
  // this.storyTaskList = this.data
  this.SpinnerService.show();
  this.storysId = id
  this.TaskManagerService.getStoryTaskSummary(id, pageno)
    .subscribe(result => {
      // this.SpinnerService.hide();
      if(result.data.length === 0)
      {
        // this.notification.showWarning('No Tasks added to the Story');
        this.showTasksPage = true;
        this.showpagedata = false;
        this.showtabledatas = false;
      }
      else
      {
      this.SpinnerService.hide();
      console.log("story task summary", result)
      this.storyTaskList = result['data']
      this.dataPaginationt = result['pagination'];
      this.showtabledatas = true;
      if (this.storyTaskList.length > 0) {
        this.has_nextStoryTask = this.dataPaginationt.has_next;
        this.has_previousStoryTask = this.dataPaginationt.has_previous;
        this.presentpageStoryTask = this.dataPaginationt.index;

      }
    }
    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }

    )
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


updatePagination():void {
  if (this.pageNumbers >= 1) {
    this.pageNumbers = Math.max(this.pageNumbers, 1);
  this.storysId 
  this.storyTaskSummary(this.storyId, this.pageNumbt)
  }
}
previousPage(): void {
  // if (this.pageNumbers > 1) {
  //   this.pageNumbers = this.pageNumbers - 1;
  //   this.updatePagination();
  // }
  
  this.pageNumbers = this.pageNumbers - 1;
  this.storyTaskSummary(this.storyId, this.pageNumbers);
}
nextPage(): void {

    this.pageNumbers = this.pageNumbers + 1;
    this.storyTaskSummary(this.storyId, this.pageNumbers);
    // this.updatePagination();
  
}
isNextPageAllowed(): boolean {
  return this.pageNumbers > 10; 
}
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
isDateExpired(endDate: string): boolean {
  if (endDate !== 'None') {
    const endDateObj = new Date(endDate);
    return endDateObj.getTime() > this.today.getTime();
  }
  return false;
}

story_TaskView(typeId) 
{
  this.SpinnerService.show();
  // this.router.navigate(['taskmanage/task_singleView', story_taskID]);
  
  this.LocalShareService.taskid.next(typeId)

  this.LocalShareService.sprintfromdate.next(this.selectedItem?.sprint?.from_date)
    this.LocalShareService.sprinttodate.next(this.selectedItem?.sprint?.to_date)
  this.taskcreate = false;
this.isShowStory = false;
this.taskview=true
}
taskcreateclose(){
  this.taskcreate = false;
  this.isShowStory = true;
  this.taskview=false
  this.storySearch('');
  this.storyTaskSummary(this.storyId, this.pageNumbt)
}

loadMoreStories() {
  let search = this.storySummaryForm.value;
  search.start_date = this.datepipe.transform(search.start_date, 'yyyy-MM-dd');
  search.end_date = this.datepipe.transform(search.end_date, 'yyyy-MM-dd');
  let obj = {
    "start_date": search?.start_date,
    "end_date": search?.end_date,
    // "query": search?.query,
    // "status": search?.status,
    "team": search?.team?.id,
    "sprint": search?.sprint?.id,
    // "app_id": search?.app_id?.id,
    // "client": search?.client?.id,
    // "module_id": search?.module_id?.id,
    // // "status": search?.status,
    // "developer_id": search?.developer_id?.id,
    // "team_lead": search?.team_lead?.id,
    "query": search?.query
  }
  console.log("obj api", obj)
  for (let i in obj) {
    if (obj[i] == undefined || obj[i] == null) {
      obj[i] = '';
    }
  }
  this.SpinnerService.show();
  this.pageNumbersl = this.pageNumbersl + 1 ;
  // this.storySummary(, this.pageNumbers);

  this.TaskManagerService.getStories(obj, this.pageNumbersl)
  .subscribe(result => {
    this.SpinnerService.hide();
    console.log("story summary", result)
    let datas = result['data']
    this.storyList = this.storyList.concat(datas);
    let dataPagination = result['pagination'];
    if (this.storyList.length > 0) {
      this.selectItem(this.storyList[0]);
      // this.viewTask(this.storyList[0]);
      this.has_storynext = dataPagination.has_next;
      this.has_storyprevious = dataPagination.has_previous;
      this.storypresentpage = dataPagination.index;
      // this.storySummaryForm.reset()
    }
    this.showPopupss = false

  }, (error) => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  }

  )
  

}

resetsprinitform(){
  // this.sprintSummaryForm.reset()
  // this.taskSummaryForm.reset()
  this.storySummaryForm.reset()
  this.storypresentpage=1
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
  this.storySearch('');

}

public displayFnteamclient(clt?: teamopClient): string | undefined {
  // console.log(`Client testing data - ${clt.name}`);
  return clt ? clt.name : undefined;
}
public displayclientteam(clientteamrole?: clientlists): string | undefined {
  return clientteamrole ? clientteamrole.client_name : undefined;

}
public displayteamsprintclient(teamsprintrole?: clientsprint): string | undefined {
  return teamsprintrole ? teamsprintrole.client_name : undefined;
}

public displayccclient(clt?: Client): string | undefined {
  // console.log(`Client testing data - ${clt.name}`);
  return clt ? clt.name : undefined;
}
public displaysprintteamclient(clt?: teamopClient): string | undefined {
  // console.log(`Client testing data - ${clt.name}`);
  return clt ? clt.name : undefined;
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
getEmployeeNames(assignedTo: any[]): string {
  return assignedTo.map(emp => emp.name).join(', ');
}

backtoTaskSummary()
{
  this.taskcreate = false;
  this.isShowStory = true;
  this.taskview=false;
  this.storySearch('');
  this.storyTaskSummary(this.storyId, this.pageNumbt)
}
SubmitbackToSummary()
{
  this.taskcreate = false;
  this.isShowStory = true;
  this.taskview=false;
  this.storySearch('');
}
handleClick()
{
  this.notification.showError("DONE")
}
addSprintToStory()
{
  let sprintName = this.storySummaryForm.get('sprints').value;
  let payload = {
    "story_id": this.storyId,
    "sprint_id": sprintName.id
  }
  this.taskmanagerservice.addSprinttoStory(payload)
  .subscribe(res => {
    console.log("story added to Sprint click", res)
    if(res.message){
      this.notify.success(res.message);
      this.SpinnerService.hide();
      // this.taskSummaryForm.reset();
      this.storySearch('');
     } else {
      this.notify.error(res.description)
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

teamsprintclicks() {
  let devkeyvalue: String = "";
  // this.getsprint(devkeyvalue);
  // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
  this.storySummaryForm.get('sprints').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.TaskManagerService.getSprints(value)
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







}
