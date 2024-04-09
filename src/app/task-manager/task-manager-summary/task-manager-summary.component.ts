import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { SharedService } from "../../service/shared.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  FormGroupDirective,
  FormArrayName,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from "../../service/error-handling-service.service";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  filter,
  switchMap,
  finalize,
  takeUntil,
  map,
} from "rxjs/operators";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { fromEvent } from "rxjs";
import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { formatDate, DatePipe } from "@angular/common";
import * as imp from "../../AppAutoEngine/import-services/CommonimportFiles";
import { TaskManagerService } from "src/app/task-manager/task-manager.service";
import { TaskService } from "src/app/taskreport/task.service";
// import { ShareService } from '../share.service';
import { NotificationService } from "src/app/service/notification.service";
import { COMMA, E, ENTER } from "@angular/cdk/keycodes";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from "@angular/material/datepicker";
import * as _moment from "moment";
import { default as _rollupMoment, Moment } from "moment";
import { CustomPopviewComponent } from "src/app/custom-popview/custom-popview.component";

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from "@angular/animations";
import { DialogfilterComponent } from "../dialogfilter/dialogfilter.component";
import { MatDialog } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TooltipPosition } from "@angular/material/tooltip";
// import { ThrowStmt } from "@angular/compiler";
import { ShareddataService } from "../shareddata.service";

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
  text: any;
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
  parse: { dateInput: { month: "short", year: "numeric", day: "numeric" } },
  display: {
    dateInput: "input",
    monthYearLabel: { year: "numeric", month: "short" },
    dateA11yLabel: { year: "numeric", month: "long", day: "numeric" },
    monthYearA11yLabel: { year: "numeric", month: "long" },
  },
};
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === "input") {
      return formatDate(date, "dd-MMM-yyyy", this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: "app-task-manager-summary",
  templateUrl: "./task-manager-summary.component.html",
  styleUrls: ["./task-manager-summary.component.scss"],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
    imp.HrmsAPI,
  ],
  animations: [
    trigger("displayState", [
      state(
        "false",
        style({ overflow: "hidden", height: "0px", opacity: "0" })
      ),
      state("true", style({ overflow: "hidden", height: "*", opacity: "*" })),
      transition("false => true", animate("200ms ease-in")),
      transition("true => false", animate("200ms ease-out")),
    ]),
  ],
})
export class TaskManagerSummaryComponent implements OnInit {
  selectedDate: Date;
  sprintfilter: [
    { name: "Start Date"; id: 1 },
    { name: "End Date"; id: 2 },
    { name: "Query"; id: 3 }
  ];
  sprintfilterss: [
    { name: "Start Date"; id: 1 },
    { name: "End Date"; id: 2 },
    { name: "Query"; id: 3 },
    { name: "Team"; id: 4 },
    { name: "Sprint"; id: 5 }
  ];
  taskfilter: [
    { name: "Start Date"; id: 1 },
    { name: "End Date"; id: 2 },
    { name: "Query"; id: 3 },
    { name: "App id"; id: 4 },
    { name: "Client "; id: 5 },
    { name: "Module id  "; id: 6 },
    { name: "Developer id "; id: 7 },
    { name: "Team lead "; id: 8 },
    { name: "Status "; id: 9 }
  ];
  backlogfilter: [
    { name: "Start Date"; id: 1 },
    { name: "End Date"; id: 2 },
    { name: "Query"; id: 3 },
    { name: "App id"; id: 4 },
    { name: "Client "; id: 5 },
    { name: "Module id  "; id: 6 },
    { name: "Developer id "; id: 7 },
    { name: "Team lead "; id: 8 }
  ];
  pipelinefilter: [
    { name: "Start Date"; id: 1 },
    { name: "End Date"; id: 2 },
    { name: "Pipeline Status"; id: 3 },
    { name: "App id"; id: 4 },
    { name: "Client "; id: 5 },
    { name: "Module id  "; id: 6 },
    { name: "Developer id "; id: 7 },
    { name: "Team lead "; id: 8 }
  ];
  issuefilter: [
    { name: "Start Date"; id: 1 },
    { name: "End Date"; id: 2 },
    { name: "Query"; id: 3 },
    { name: "App id"; id: 4 },
    { name: "Client "; id: 5 },
    { name: "Module id  "; id: 6 },
    { name: "Priority  "; id: 7 },
    { name: "Status "; id: 8 }
  ];
  Tran_Menu_List: any;
  statusList = [
    { id: 1, name: "Createdby Me" },
    { id: 2, name: "Others" },
  ];
  teamdrop: any;
  appdrop: any;
  sprinttdrop: any;
  clientdrop: any;
  moduledrop: any;
  teams: any;
  statusdrops: any;
  develop: any;
  returnnav: number;
  startdate: boolean = false;
  enddate: boolean = false;
  query: boolean = false;
  app_id: boolean = false;
  client: boolean = false;
  module_id: boolean = false;
  priority: boolean = false;
  statuss: boolean = false;
  statusss: boolean = false;
  developer_id: boolean = false;
  team_lead: boolean = false;
  pipeline_status: boolean = false;
  team: boolean = false;
  sprintss: boolean = false;
  inpstartdatesprint: any;
  inpenddatesprint: any;
  taskcreate: boolean;
  isShowTasksummary: boolean = false;
  isShowStory: boolean;
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
  pageNumbersContainer = document.querySelector(".cus-pageNumbers");
  nextButton = document.querySelector(".cus-btnNext");
  issueList: any;
  reassignForm: FormGroup;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTriggers: MatAutocompleteTrigger;
  @ViewChild("emps") matempAutocompletes: MatAutocomplete;
  @ViewChild("empInputs") empInputs: any;
  @ViewChild("clientInput") clientInput: any;
  @ViewChild("teamInput") teamInput: any;
  @ViewChild("teamlead") teamlead: any;
  @ViewChild("moduleInput") moduleInput: any;
  @ViewChild("developerinput") developerinput: any;
  @ViewChild("clientrole") matappAutocomplete: MatAutocomplete;
  @ViewChild("teamsrole") matappAutoteamcomplete: MatAutocomplete;
  @ViewChild("modulerole") matmoduleAutocomplete: MatAutocomplete;
  @ViewChild("developerrole") matdevelopAutocomplete: MatAutocomplete;
  @ViewChild("teamrole") matteamleadsAutocomplete: MatAutocomplete;
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

  @ViewChild("appnm") matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("appnmInput") appnmInput: any;
  @ViewChild("taskunithead") mattaskunitempAutocomplete: MatAutocomplete;
  @ViewChild("taskunitheadInput") taskunitheadInput: any;
  @ViewChild("clt") matclientAutocomplete: MatAutocomplete;
  @ViewChild("cltInput") cltInput: any;

  @ViewChild("modnm") matmodulenameAutocomplete: MatAutocomplete;
  @ViewChild("modnmInput") modnmInput: any;

  @ViewChild("unitHD") matunitheadAutocomplete: MatAutocomplete;
  @ViewChild("unitHDInput") unitHDInput: any;
  @ViewChild("taskname") mattaskAutocomplete: MatAutocomplete;
  @ViewChild("tasknameInput") tasknameInput: any;
  @ViewChild("teamld") matteamleadAutocomplete: MatAutocomplete;
  @ViewChild("teamldInput") teamldInput: any;
  @ViewChild("taskprojecthead") mattaskprojectempAutocomplete: MatAutocomplete;
  @ViewChild("taskprojectheadInput") taskprojectheadInput: any;
  @ViewChild("dev") matdevAutocomplete: MatAutocomplete;
  @ViewChild("developerInput") developerInput: any;
  @ViewChild("taskempl") mattaskempAutocomplete: MatAutocomplete;
  @ViewChild("taskrappInput") taskrempInput: any;
  @ViewChild("taskrclt") mattaskclientAutocomplete: MatAutocomplete;
  @ViewChild("taskrcltInput") taskrcltInput: any;
  @ViewChild("taskrmod") mattaskmodAutocomplete: MatAutocomplete;
  @ViewChild("taskmodInput") taskmodInput: any;
  // status for multiple selection
  @ViewChild("emp") matempAutocomplete: MatAutocomplete;
  @ViewChild("empInput") empInput: any;
  @ViewChild("taskrapp") mattaskappAutocomplete: MatAutocomplete;
  @ViewChild("taskrappInput") taskrappInput: any;
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
  clientlist: Array<clientlists>;
  modulelist: Array<modulelists>;
  storiesget: any;
  sprintdata: any;
  storysList: any;
  pageNumbi: any = 1;
  droplist: any;
  textValues = [
    { id: "startdate", name: "Start Date" },
    { id: "enddate", name: "End Date" },
  ];
  storyrId: any;
  // assigns =[
  //   { id: 1, name: 'For Me' },
  //   { id: 2, name: 'For My Team' },
  //   { id: 3, name: 'All' }
  // ];
  assigns = [];
  singleissueViewData: any;
  commentText: string = "";
  commentTexts: string = "";
  selectedFile: File | null = null;
  showCommentBox: boolean = false;
  showCommentBoxs: boolean = false;
  commenthistoryarr: any;
  issueId: any;
  commenthistoryarrs: any;
  button1Styles = {
    "background-color": "white",
    color: "#172b4d",
  };
  button2Styles = {
    "background-color": "white",
    color: "#172b4d",
  };
  button3Styles = {
    "background-color": "white",
    color: "#172b4d",
  };
  button4Styles = {
    "background-color": "white",
    color: "#172b4d",
  };
  send_value: string;
  pipelinecreate: boolean;
  pagePipe: any = 1;
  statusLists: { name: string }[];
  isLastPage: boolean = true;
  filterForm: FormGroup;
  showPopup: boolean = false;
  showPopupss: boolean = false;
  taskpopup: boolean = false;
  taskPopups: boolean = false;
  backlogPopus: boolean = false;
  issuePopus: boolean = false;
  pipelinePopup: boolean = false;
  teamList: any;
  assignForm: FormGroup;
  showpagedata: boolean = true;

  showtabledatas: boolean = true;
  isShowtimesheet: boolean;
  isShowReport: boolean;
  isShowBrd:boolean
  timeSheetList: any;
  dateID: any;
  activityArr2: any;
  timesumtable: any;
  timeSheet: FormGroup;
  actualdate: any;
  endadate: any;
  isActualDate: any;
  isShowmeeting: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private notify: imp.ToastrService,
    private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingServiceService,
    private TaskManagerService: TaskManagerService,
    private datepipe: DatePipe,
    private taskreportservice: TaskService,
    private notification: NotificationService,
    private datePipe: DatePipe,
    private shareservice: SharedService,
    private dialog: MatDialog,
    private taskmanagerservice: TaskManagerService,
    private localservice : ShareddataService
  ) {}

  @Output() OnSubmit = new EventEmitter<any>();

  // popuptimesheet component merge
  openPopup(): void {
    const dialogRef = this.dialog.open(CustomPopviewComponent, {
      width: "350px",
      data: { Description: "", Time: "", Type: "" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.items.push(result);
      }
    });
  }

  ngOnInit(): void {
    this.popupAddForm = this.fb.group({
      log_date: ["", Validators.required],
      duration: ["", Validators.required],
      // selectLogType: [],
      ref_id: ["", Validators.required],
      client: ["", Validators.required],
      app_id: ["", Validators.required],
      ref_type: ["", Validators.required],
      description: ["null", Validators.required],

      // project_map_id: ["", Validators.required],
      // data: new FormArray([]),
    });
    // Subscribe to changes in the ref_id control
    // this.popupAddForm.get("ref_id").valueChanges.subscribe((value) => {
    //   this.selectLogTypeValue = value;
    // });
    // Subscribe to changes in the ref_id control
    this.popupAddForm.get("ref_id").valueChanges.subscribe((value) => {
      this.selectLogTypeValue = value;
      this.updateViewConditions();
    });

    this.popupLogType();

    // timesheet formcontrol
    this.timeSheet = new FormGroup({
      date: new FormControl(),
    });
    this.dateForm = this.fb.group({
      timesheetControl: [null],
    });

    this.taskSearchForm = this.fb.group({
      app_id: "",
      client: "",
      dev_type: "",
      module_id: "",
      unit_head: "",
      team_lead: "",
      start_date: "",
      end_date: "",
      status: "",
      query: "",
      developer_id: "",
      teamlead: "",
      dropfilter: "",
    });

    this.sprintSummaryFormss = this.fb.group({
      start_date: "",
      end_date: "",
      query: "",
      team: "",
      sprint: "",
      dynamicdropdown: "",

      // method:''
    });

    this.storiesForm = this.fb.group({
      name: "",
      details: "",
      sprint: "",
      story: "",
      team_lead: "",
    });

    // this.value = this.sprintSummaryForm.get('query').value;

    this.reassignForm = this.fb.group({
      developer_id: "",
    });

    this.storySearchForm = this.fb.group({
      query: "",
      team: "",
      sprint: "",
    });

    this.sprintFilterForm = this.fb.group({
      startdate: "",
      enddate: "",
    });

    this.getDropDown();
    this.getTeamDropDown();
    this.getSprintDropDown();

    this.sprintFilterForms = this.fb.group({
      // filters: this.fb.array([]),
      field: "",
      options: "",
    });

    // this.getparticularIssue(1);

    this.filterForm = this.fb.group({
      // filters: this.fb.array([this.createFilter()])
      filters: this.fb.array([]),
    });

    this.assignForm = this.fb.group({
      developer_id: "",
    });

    let datas = this.shareservice.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Task Management") {
        this.Tran_Menu_List = subModule;
        console.log("Submodules TASKS", this.Tran_Menu_List);
        // this.isCommodity = subModule[0].name;
      }
    });

    this.getdesignationStatuss();

    this.taskupdateForm = this.fb.group({
      actual_start_date: "",
      actual_end_date: "",
    });

    // this.generatePageNumbers(this.storyTaskList.pagination.index, this.storyTaskList.pagination.has_next);
  }

  getDropDown() {
    this.taskmanagerservice.getStatus().subscribe((res) => {
      this.droplist = res;
    });
  }

  subModuleData(submodule) {
    console.log("submodule names ", submodule);
    if (submodule.name == "Task") {
      this.isShowTasksummary = true;
      this.isShowStory = false;
      this.isShowSprint = false;
      this.isShowBacklog = false;
      this.isShowIssues = false;
      this.isShowPipelines = false;
      this.isShowtimesheet = false;
      this.isShowmeeting = false;
      this.isShowBrd=false
      this.isShowReport = false;
      this.isShowBrd=false
      this.isShowPipelines = false;
      this.localservice.sprintfromdate.next('');
      this.localservice.sprinttodate.next('');
      this.localservice.story_Id.next(0);
      this.localservice.sprintName.next("");
      this.localservice.storyName.next("");

    }
    if (submodule.name == "Stories") {
      this.isShowStory = true;
      this.isShowSprint = false;
      this.isShowTasksummary = false;
      this.isShowBacklog = false;
      this.isShowIssues = false;
      this.isShowPipelines = false;
      this.isShowtimesheet = false;
      this.isShowReport = false;
      this.isShowmeeting = false;
      this.isShowBrd=false

    }

    if (submodule.name == "Sprint") {
      this.isShowSprint = true;
      this.isShowStory = false;
      this.isShowTasksummary = false;
      this.isShowBacklog = false;
      this.isShowIssues = false;
      this.isShowPipelines = false;
      this.isShowtimesheet = false;
      this.isShowReport = false;
      this.isShowmeeting = false;
      this.isShowBrd=false

    }
    if (submodule.name == "Backlog ") {
      this.isShowBacklog = true;
      this.isShowSprint = false;
      this.isShowStory = false;
      this.isShowTasksummary = false;
      this.isShowIssues = false;
      this.isShowPipelines = false;
      this.isShowtimesheet = false;
      this.isShowReport = false;
      this.isShowmeeting = false;
      this.isShowBrd=false

    }
    if (submodule.name == "Issues") {
      this.isShowIssues = true;
      this.isShowBacklog = false;
      this.isShowSprint = false;
      this.isShowStory = false;
      this.isShowTasksummary = false;
      this.isShowPipelines = false;
      this.isShowtimesheet = false;
      this.isShowReport = false;
      this.isShowmeeting = false;
      this.isShowBrd=false

    }
    if (submodule.name == "Pipeline") {
      this.isShowPipelines = true;
      this.isShowIssues = false;
      this.isShowBacklog = false;
      this.isShowSprint = false;
      this.isShowStory = false;
      this.isShowTasksummary = false;
      this.isShowtimesheet = false;
      this.isShowReport = false;
      this.isShowmeeting = false;
      this.isShowBrd=false

    }
    if (submodule.name == "Timesheet") {
      this.isShowPipelines = false;
      this.isShowIssues = false;
      this.isShowBacklog = false;
      this.isShowSprint = false;
      this.isShowStory = false;
      this.isShowTasksummary = false;
      this.isShowtimesheet = true;
      this.isShowReport = false;
      this.isShowmeeting = false;
      this.isShowBrd=false

    }
    // if (submodule.name == "Timesheet") {
    //   this.isShowPipelines = false;
    //   this.isShowIssues = false;
    //   this.isShowBacklog = false;
    //   this.isShowSprint = false;
    //   this.isShowStory = false;
    //   this.isShowTasksummary = false;
    //   this.isShowtimesheet = true;
    //   this.isShowmeeting = false;
    // }
    if (submodule.name == "Report") {
      this.isShowPipelines = false;
      this.isShowIssues = false;
      this.isShowBacklog = false;
      this.isShowSprint = false;
      this.isShowStory = false;
      this.isShowTasksummary = false;
      this.isShowtimesheet = false;
      this.isShowmeeting = false;
      this.isShowReport = true;
      this.isShowBrd=false

    }
    //Meeting
    if (submodule.name == "Meeting") {
      this.isShowPipelines = false;
      this.isShowIssues = false;
      this.isShowBacklog = false;
      this.isShowSprint = false;
      this.isShowStory = false;
      this.isShowTasksummary = false;
      this.isShowtimesheet = false;
      this.isShowReport = false;
      this.isShowmeeting = true;
      this.isShowBrd=false

    }
    
    if(submodule.url=="/brd"){
      this.isShowPipelines = false;
      this.isShowIssues = false;
      this.isShowBacklog = false;
      this.isShowSprint = false;
      this.isShowStory = false;
      this.isShowTasksummary = false;
      this.isShowtimesheet = false;
      this.isShowReport = false;
      this.isShowmeeting = false;
      this.isShowBrd=true
    }

  }

  onclickTaskAdd() {
    // this.shareservice.story_Id.next(this.story_ID);
    this.shareservice.story_Id.next(this.selectedItem.id);
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
    this.issueView = false;
    this.pipelinecreate = false;
  }
  onTaskAdds() {
    // this.shareservice.story_Id.next(this.selectedItem.id)
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
    this.issueView = false;
    this.pipelinecreate = false;
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
    this.issueView = false;
    this.pipelinecreate = false;
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
    this.issueView = false;
    this.pipelinecreate = false;
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
    this.issueView = false;
    this.pipelinecreate = false;
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
    // this.storyView();
    this.isShowPipelines = false;
    this.issuecreate = false;
    // this.StoryTaskSearch('');
    this.isShowBacklog = false;
    this.isShowStorySpr = false;
    this.issueView = false;
    this.pipelinecreate = false;
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
    this.isShowStorySpr = false;
    this.issueView = false;
    this.pipelinecreate = false;
    this.isShowBacklog = false;
    // this.storySearch('')
  }

  story_Task_ID: number;
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
    this.issueView = false;
    this.storyTaskView(story_taskID);
    this.pipelinecreate = false;
    this.isShowBacklog = false;
    // this.filterOptions()
  }

  SubmitbackToView() {
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
    this.issueView = false;
    this.storyTaskView(this.story_Task_ID);
    this.pipelinecreate = false;
    this.isShowBacklog = false;
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
    this.issueView = false;
    this.pipelinecreate = false;
    this.isShowBacklog = false;
    // this.StoryTaskSearch(this.storyViewDaata.id)
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
    this.issueView = false;
    this.pipelinecreate = false;
    this.isShowBacklog = false;
  }

  viewIssue(data) {
    this.isShowTasksummary = false;
    this.taskcreate = false;
    this.isShowStory = false;
    this.storycreate = false;
    this.storyiew = false;
    this.sprintcreate = false;
    this.isShowSprint = false;
    this.taskedit = false;
    this.isShowIssues = false;
    this.isShowPipelines = false;
    this.issuecreate = false;
    this.isShowStorySpr = false;
    this.issueView = true;
    this.pipelinecreate = false;
    this.isShowBacklog = false;
    this.getparticularIssue(data);
  }
  issueView_backnavigate() {
    this.taskcreate = false;
    this.isShowTasksummary = false;
    this.isShowStory = false;
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = false;
    this.taskedit = false;
    this.isShowIssues = true;
    this.isStorySearch = false;
    this.isShowStorySummary = false;
    this.isShowPipelines = false;
    this.issuecreate = false;
    this.isShowStorySpr = false;
    this.issueView = false;
    this.pipelinecreate = false;
    this.isShowBacklog = false;
    // this.StoryTaskSearch(this.storyViewDaata.id)
  }

  addpipeline() {
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
    this.isStorySearch = false;
    this.isShowStorySummary = false;
    this.isShowPipelines = false;
    this.issuecreate = false;
    this.isShowStorySpr = false;
    this.issueView = false;
    this.pipelinecreate = true;
    this.isShowBacklog = false;
  }
  backtopieline() {
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
    this.issueView = false;
    // this.pipelineSummary(1);
    this.pipelinecreate = false;
  }
  backtoTaskSummary() {
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
    this.issueView = false;
    this.pipelinecreate = false;
    this.isShowtimesheet = false;
    this.isShowReport = false;
  }

  // story view

  // ViewData:any;
  // story task view
  storyTaskView(story_taskID) {
    this.SpinnerService.show();
    this.storyrId = story_taskID;

    this.TaskManagerService.getStories_taskView(story_taskID).subscribe(
      (result) => {
        this.SpinnerService.hide();
        console.log("story task View", result);
        if (result.actual_start_date) {
          this.isActualDate = false;
        } else {
          this.isActualDate = true;
        }

        // this.ViewData = result;

        let currentDate = new Date();
        let formtDate = this.datePipe.transform(currentDate, "yyyy-MM-dd");
        let Plan_Start: any;
        let Plan_End: any;
        let PlanDaysCalculate;
        let TotalPlanDays;

        if (result.start_date !== "None" && result.end_date !== "None") {
          Plan_Start = new Date(
            this.datePipe.transform(result.start_date, "yyyy-MM-dd")
          );
          Plan_End = new Date(
            this.datePipe.transform(result.end_date, "yyyy-MM-dd")
          );
          PlanDaysCalculate = Plan_Start.getTime() - Plan_End.getTime();
          TotalPlanDays =
            Math.abs(PlanDaysCalculate) / (1000 * 60 * 60 * 24) + 1;
        } else {
          console.error("start_date or end_date is null");
        }

        // Plan_Start = new Date(this.datePipe.transform(result.start_date, 'yyyy-MM-dd'));
        // Plan_End = new Date(this.datePipe.transform(result.end_date, 'yyyy-MM-dd'));

        let json = {
          DynamicStatusCall: false,
          DynamicDate: formtDate,
          DynamicHoursToSend: 0,
          DynamicPlannedDays: TotalPlanDays,
          DynamicActualDays: 0,
          DynamicDelayDaysCount: 0,
        };

        this.story_TaskViewData = Object.assign({}, result, json);
        console.log("data", this.story_TaskViewData);
        this.filterOptions();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  ChangeDateFormat(data) {
    data.DynamicDate = this.datePipe.transform(data?.DynamicDate, "yyyy-MM-dd");
  }

  EndDateCalculate(data) {
    ///if Planned days = 5, and if actual task days = 6
    ///then delay days  = 1
    let Plan_Start: any;
    let Plan_End: any;
    let PlanDaysCalculate;
    let TotalPlanDays;

    console.log("actual start date and end date ", data);
    Plan_Start = new Date(
      this.datePipe.transform(data.actual_start_date, "yyyy-MM-dd")
    );
    Plan_End = new Date(
      this.datePipe.transform(data.DynamicDate, "yyyy-MM-dd")
    );

    PlanDaysCalculate = Plan_Start.getTime() - Plan_End.getTime();
    TotalPlanDays = Math.abs(PlanDaysCalculate) / (1000 * 60 * 60 * 24) + 1;

    data.DynamicDelayDaysCount =
      TotalPlanDays - data?.DynamicPlannedDays > 0
        ? TotalPlanDays - data?.DynamicPlannedDays
        : 0;
  }

  ChaneStatus(status, taskstatus) {
    let obj: any;

    this.actualdate = this.datePipe.transform(
      this.taskupdateForm.get("actual_start_date").value,
      "yyyy-MM-dd"
    );

    this.endadate = this.datePipe.transform(
      this.taskupdateForm.get("actual_end_date").value,
      "yyyy-MM-dd"
    );

    console.log("taskstatus", taskstatus);
    if (taskstatus?.task_status_id == 0) {
      if (
        this.endadate == undefined ||
        this.endadate == "" ||
        this.endadate == null
      ) {
        obj = {
          actual_start_date: this.actualdate,
          task_status: status,
        };
      } else if (this.isActualDate == true) {
        obj = {
          actual_start_date: this.actualdate,
          task_status: status,
        };
      } else {
        obj = {
          actual_start_date: this.actualdate,
          task_status: status,
          actual_end_date: this.endadate,
        };
      }
    } else if (taskstatus?.task_status_id == 1) {
      obj = {
        actual_start_date: this.actualdate,
        actual_end_date: this.endadate,
        task_status: status,
        emp_hr: taskstatus?.emp_hours,
        delay_days: taskstatus?.DynamicDelayDaysCount,
        reason_for_delay: taskstatus?.reason_for_delay,
      };
    } else if (taskstatus?.task_status_id == 3) {
      obj = {
        task_status: status,
      };
    } else {
      obj = {
        task_status: status,
      };
    }
    this.SpinnerService.show();
    this.TaskManagerService.ChaneStatus(obj, taskstatus.id).subscribe(
      (results) => {
        this.notification.showSuccess("Status Updated");
        this.storyTaskView(taskstatus.id);
        this.SpinnerService.hide();
      }
    );
  }

  UpdateTask(data) {
    console.log("MY Task Data", data);
    for (let i = 0; i < data.employee_hours.length; i++) {
      data.employee_hours[i].employee_id = data.employee_hours[i].employee_id;
    }
    let startsdate = this.datepipe.transform(
      data.actual_start_date,
      "yyyy-MM-dd"
    );
    let endsdate = this.datepipe.transform(data.actual_end_date, "yyyy-MM-dd");
    let obj = {
      id: data.id,
      actual_start_date: startsdate,
      actual_end_date: endsdate,
      // task_status: data.task_status_id,
      emp_hr: data?.employee_hours,
      delay_days: data.DynamicDelayDaysCount,
      reason_for_delay: data.reason_for_delay,
    };
    console.log(data, obj);
    this.TaskManagerService.ChaneStatus(obj, data.id).subscribe((results) => {
      this.notification.showSuccess("Status Updated");
      this.storyTaskView(data.id);
    });
  }

  SubmitbackToSummary() {
    // this.TaskSearch('')
    this.isShowTasksummary = false;
    this.taskcreate = false;
    this.isShowStory = true;
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = false;
    this.isStorySearch = true;
    this.isShowStorySummary = true;
    this.taskedit = false;
    // this.storySearch('')
  }

  CancelbackToSummary() {
    this.isShowTasksummary = false;
    this.taskcreate = false;
    this.isShowStory = false;
    this.storycreate = false;
    this.storyiew = false;
    this.story_taskView = false;
    this.sprintcreate = false;
    this.isShowSprint = false;
    this.isStorySearch = true;
    this.isShowStorySummary = true;
    this.isShowStory = true;
    this.taskedit = false;
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
    // this.storySearch('')
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
    // this.sprintSearch('');
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
    // this.sprintSearch('');
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
    this.isShowIssues = true;
    this.isShowPipelines = false;
    this.issuecreate = false;
    // this.issueSummary(1);
  }
  // app name
  appName() {
    let appkeyvalue: String = "";
    this.getappName(appkeyvalue);

    this.taskSearchForm
      .get("app_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.taskreportservice
            .getprojectsearchFilter(this.client_Id, value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              })
            )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.appNameList = datas;
      });
  }

  private getappName(appkeyvalue) {
    this.taskreportservice
      .getprojectsearchFilter(this.client_Id, appkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.appNameList = datas;
      });
  }

  public displayFnappnm(appnm?: appName): string | undefined {
    return appnm ? appnm.name : undefined;
  }

  get appnm() {
    return this.taskSearchForm.value.get("app_id");
  }

  // app name
  autocompleteAppnmScroll() {
    setTimeout(() => {
      if (
        this.matAutocomplete &&
        this.autocompleteTrigger &&
        this.matAutocomplete.panel
      ) {
        fromEvent(this.matAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskreportservice
                  .getprojectsearchFilter(
                    this.client_Id,
                    this.appnmInput.nativeElement.value,
                    this.currentpage + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.appNameList = this.appNameList.concat(datas);
                    if (this.appNameList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  });
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

    this.taskSearchForm
      .get("module_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.taskreportservice
            .getmodulesearchFilter(this.client_Id, this.project_Id, value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              })
            )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.moduleNameList = datas;
      });
  }

  private getModuleName(modkeyvalue) {
    this.taskreportservice
      .getmodulesearchFilter(this.client_Id, this.project_Id, modkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.moduleNameList = datas;
      });
  }

  public displayFnmodnm(mod?: ModeuleName): string | undefined {
    return mod ? mod.name : undefined;
  }

  get mod() {
    return this.taskSearchForm.value.get("module_id");
  }

  getemp(keyvalue) {
    this.taskreportservice.getStatus_multipleSelection(keyvalue, 1).subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.empList = datas;
        console.log("emp data get ", this.empList);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  public displayappclient(clientrole?: clientlists): string | undefined {
    return clientrole ? clientrole.client_name : undefined;
  }
  public displayteamopclient(teamsrole?: clientlists): string | undefined {
    return teamsrole ? teamsrole.client_name : undefined;
  }
  public displayclient(modulerole?: modulelists): string | undefined {
    return modulerole ? modulerole.module_name : undefined;
  }
  public displaydeveloperclient(
    developerrole?: modulelists
  ): string | undefined {
    return developerrole ? developerrole.module_name : undefined;
  }
  public displayteamclient(teamrole?: modulelists): string | undefined {
    return teamrole ? teamrole.module_name : undefined;
  }

  public removedemp(emp: emplistss): void {
    const index = this.chipSelectedemp.indexOf(emp);

    if (index >= 0) {
      this.chipSelectedemp.splice(index, 1);
      console.log(this.chipSelectedemp);
      this.chipSelectedempid.splice(index, 1);
      console.log(this.chipSelectedempid);
      this.empInput.nativeElement.value = "";
    }
  }

  public empSelected(event: MatAutocompleteSelectedEvent): void {
    console.log("event.option.value", event.option.value);
    this.selectempByName(event.option.value.text);
    this.empInput.nativeElement.value = "";
    console.log("chipSelectedempid", this.chipSelectedempid);
  }
  private selectempByName(emp) {
    let foundemp1 = this.chipSelectedemp.filter((e) => e.text == emp);
    if (foundemp1.length) {
      return;
    }
    let foundemp = this.empList.filter((e) => e.text == emp);
    if (foundemp.length) {
      this.chipSelectedemp.push(foundemp[0]);
      this.chipSelectedempid.push(foundemp[0].id);
    }
  }

  autocompletetaskCltScroll() {
    setTimeout(() => {
      if (
        this.mattaskclientAutocomplete &&
        this.autocompleteTrigger &&
        this.mattaskclientAutocomplete.panel
      ) {
        fromEvent(this.mattaskclientAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) =>
                this.mattaskclientAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.mattaskclientAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.mattaskclientAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.mattaskclientAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskreportservice
                  .getclientsearchFilter(
                    this.taskrcltInput.nativeElement.value,
                    this.currentpage + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.trclientList = this.trclientList.concat(datas);
                    if (this.trclientList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  });
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

    this.taskSearchForm
      .get("team_lead")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.TaskManagerService.getTeamFilter(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.teamldList = datas;
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
        fromEvent(this.matteamleadAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.matteamleadAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matteamleadAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matteamleadAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matteamleadAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.TaskManagerService.getTeamFilter(
                  this.teamldInput.nativeElement.value,
                  this.currentpage + 1
                ).subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.teamldList = this.teamldList.concat(datas);
                  if (this.teamldList.length >= 0) {
                    this.has_next = datapagination.has_next;
                    this.has_previous = datapagination.has_previous;
                    this.currentpage = datapagination.index;
                  }
                });
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
    return this.taskSearchForm.value.get("team_lead");
  }

  // developer Name
  developerName() {
    let teamldkeyvalue: String = "";
    this.getdeveloper(teamldkeyvalue);

    this.taskSearchForm
      .get("developer_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.taskreportservice.getdeveloperFilter(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.developerList = datas;
      });
  }

  private getdeveloper(teamldkeyvalue) {
    this.taskreportservice
      .getdeveloperFilter(teamldkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.developerList = datas;
      });
  }

  public displayFndev(dev?: Developer): string | undefined {
    return dev ? dev.name : undefined;
  }

  get dev() {
    return this.taskSearchForm.value.get("developer_id");
  }

  // develoer
  autocompletetedevScroll() {
    setTimeout(() => {
      if (
        this.matdevAutocomplete &&
        this.autocompleteTrigger &&
        this.matdevAutocomplete.panel
      ) {
        fromEvent(this.matdevAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matdevAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matdevAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matdevAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matdevAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskreportservice
                  .getdeveloperFilter(
                    this.developerInput.nativeElement.value,
                    this.currentpage + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.developerList = this.developerList.concat(datas);
                    if (this.developerList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  getTeamLeads(teamldkeyvalue) {
    this.TaskManagerService.getTeamFilter(teamldkeyvalue, 1).subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.teamldList = datas;
        console.log("The team leads ", results);
      }
    );
  }

  set_StartDate: any;
  StartDate(event: string) {
    const date = new Date(event);
    // this.ss1 = date
    this.set_StartDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }

  // module name
  autocompletemodnmScroll() {
    setTimeout(() => {
      if (
        this.matmodulenameAutocomplete &&
        this.autocompleteTrigger &&
        this.matmodulenameAutocomplete.panel
      ) {
        fromEvent(this.matmodulenameAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) =>
                this.matmodulenameAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matmodulenameAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matmodulenameAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matmodulenameAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskreportservice
                  .getmodulesearchFilter(
                    this.client_Id,
                    this.project_Id,
                    this.modnmInput.nativeElement.value,
                    this.currentpage + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.moduleNameList = this.moduleNameList.concat(datas);
                    if (this.moduleNameList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  showPopUp(data) {
    if (data.DynamicStoryCall == true) {
      data.DynamicStoryCall = false;
    } else {
      data.DynamicStoryCall = true;
    }
  }

  sprintClick() {
    let devkeyvalue: String = "";
    this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.storiesForm
      .get("sprint")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.TaskManagerService.getSprintFilter(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.sprintList = datas;
      });
  }
  private getsprint(unithdkeyvalue) {
    this.TaskManagerService.getSprintFilter(unithdkeyvalue, 1).subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.sprintList = datas;
      }
    );
  }
  public displayFn(sprint?: Sprint): string | undefined {
    return sprint ? sprint.name : undefined;
  }

  get sprint() {
    return this.storiesForm.value.get("sprint");
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
    // this.storyView();
    // this.StoryTaskSearch('');
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
    // this.storyView();
    // this.StoryTaskSearch('');
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

  getEmployeeNames(assignedTo: any[]): string {
    return assignedTo.map((emp) => emp.name).join(", ");
  }

  developer() {
    this.taskmanagerservice.task_employeesearch("", "").subscribe((res) => {
      console.log("type", res);
      this.empLists = res;
    });
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
    this.TaskManagerService.IssuetoTask(this.selectedItems).subscribe(
      (result) => {
        this.SpinnerService.hide();
        this.notification.showError(result);
        console.log("story task summary", result);
        this.pipeList = result["data"];
        let dataPagination = result["pagination"];
        if (this.issueList.length > 0) {
          this.has_nextStoryTask = dataPagination.has_next;
          this.has_previousStoryTask = dataPagination.has_previous;
          this.presentpageStoryTask = dataPagination.index;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  isEndDateExpired(): boolean {
    const endDate = new Date(this.taskList.end_date);
    const today = new Date();
    return endDate < today;
  }
  getBorderColor(taskStatus: string): string {
    switch (taskStatus) {
      case "Completed":
        return "green";
      case "Verified":
        return "orange";
      case "Yet to Start":
        return "red";
      case "Work In Progress":
        return "blueviolet";
      default:
        return "brown";
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
    // this.storyView();
    this.isShowPipelines = false;
    this.issuecreate = false;
    // this.StoryTaskSearch('');
    this.isShowBacklog = false;
    this.isShowStorySpr = true;
    // this.StoryTaskSearch('');
  }

  Reset() {}

  adsearchclose() {}

  sprintSearches() {}
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
    inputField.addEventListener("blur", () =>
      this.makeNonEditable(inputField, textElement)
    );
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

  // createFilter() {
  //   return this.fb.group({
  //     field: [''],    // You can set default values here if needed
  //     options: [''],  // You can set default values here if needed
  //   });
  // }

  // addFilter() {
  //   const filters = this.sprintFilterForm.get('filters') as FormArray;
  //   filters.push(this.createFilter());
  // }

  // removeFilter(index: number) {
  //   const filters = this.sprintFilterForm.get('filters') as FormArray;
  //   filters.removeAt(index);
  // }

  reassignTask() {
    let data = this.reassignForm.value;
    let payload = [
      {
        emp_id: data.developer_id.id,
        task_id: this.storyrId,
      },
    ];
    console.log("Reassigner", data);
    console.log("ReassignerPay", payload);

    this.taskmanagerservice.reassignTask(payload).subscribe(
      (results) => {
        this.SpinnerService.hide();
        if (results.code == "INVALID_DATA") {
          this.notification.showError(results.description);
        } else {
          this.notification.showSuccess("Task Reassigned");
          // this.OnSubmit.emit()
          return true;
        }
      },
      (error) => {
        this.SpinnerService.hide();
      }
    );
  }

  // getReportTooltip(report: any): string {
  // return `
  //   Completed: ${report.Completed}\n
  //   Hold: ${report.Hold}\n
  //   Work in Progress: ${report['Work in Progress']}\n
  //   Yet to Start: ${report['Yet to Start']}\n
  //   Total: ${report.total}
  // `;
  // }
  getTooltipPosition(): TooltipPosition {
    return "below"; // You can change this to 'below', 'before', or 'after' as needed.
  }

  getparticularIssue(issue) {
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
    this.taskmanagerservice.getIssueFetch(issue.id).subscribe((res) => {
      this.singleissueViewData = res;
    });
  }

  downloadfile(data) {
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
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);

        // Set the appropriate download filename based on the content type
        let filename = "new.pdf"; // Default filename for unknown types

        if (contentType === "application/pdf") {
          filename = "new.pdf";
        } else if (contentType === "image/png") {
          filename = "new.png";
        } else if (contentType === "application/msword") {
          filename = "new.doc";
        } else if (contentType === "application/vnd.ms-excel") {
          filename = "new.xls";
        }

        link.download = filename;

        // Trigger the download by clicking the link
        link.click();
      },
      (error: any) => {
        this.SpinnerService.hide();
        console.error("Error:", error);
      }
    );
  }
  // openChatbox() {
  //   this.showChatbox = !this.showChatbox;
  // }

  // closeChatbox()
  // {
  //   this.showChatbox = false;
  // }

  openChatbox() {}

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveCommentTask() {
    // Here, you can handle the logic to save the comment and the attached file.
    console.log("Comment Text:", this.commentTexts);
    console.log("Selected File:", this.selectedFile);
    let payload = {
      comment: this.commentTexts,
    };

    this.taskmanagerservice.addCommentTask(payload, this.storyrId).subscribe(
      (results) => {
        this.SpinnerService.hide();
        this.notification.showSuccess("Comment Added");
        this.getCommentHistorys();
        // this.OnSubmit.emit()
        return true;
      },
      (error) => {
        this.SpinnerService.hide();
      }
    );
  }
  toggleCommentBox() {
    this.showCommentBox = true;
    this.getCommentHistory();
  }
  toggleCommentBoxs() {
    this.showCommentBoxs = true;
    this.getCommentHistorys();
  }

  getCommentHistory() {
    this.taskmanagerservice.getCommentHistory(this.issueId).subscribe(
      (results) => {
        this.SpinnerService.hide();
        this.commenthistoryarr = results["data"];
        // this.OnSubmit.emit()
        return true;
      },
      (error) => {
        this.SpinnerService.hide();
      }
    );
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

  getCommentHistorys() {
    this.taskmanagerservice.getCommentHistorys(this.storyrId).subscribe(
      (results) => {
        this.SpinnerService.hide();
        this.commenthistoryarrs = results["data"];
        // this.OnSubmit.emit()
        return true;
      },
      (error) => {
        this.SpinnerService.hide();
      }
    );
  }

  toggleButton(buttonNumber: number): void {
    // Reset styles for all buttons
    this.resetButtonStyles();

    // Update the clicked button's styles
    switch (buttonNumber) {
      case 1:
        this.button1Styles = {
          "background-color": "#172b4d",
          color: "white",
        };
        this.isShowbuttons = true;
        this.isShowComments = true;
        break;
      case 2:
        this.button2Styles = {
          "background-color": "#172b4d",
          color: "white",
        };
        this.isShowbuttons = true;
        this.isShowComments = false;
        break;
      case 3:
        this.button3Styles = {
          "background-color": "#172b4d",
          color: "white",
        };
        this.isShowbuttons = false;
        this.isShowComments = true;
        this.getCommentHistory();
        break;
    }
  }

  resetButtonStyles(): void {
    this.button1Styles = {
      "background-color": "white",
      color: "#172b4d",
    };
    this.button2Styles = {
      "background-color": "white",
      color: "#172b4d",
    };
    this.button3Styles = {
      "background-color": "white",
      color: "#172b4d",
    };
  }

  toggleButtons(buttonNumber: number): void {
    this.resetButtonStyle();
    switch (buttonNumber) {
      case 1:
        this.button1Styles = {
          "background-color": "#172b4d",
          color: "white",
        };
        this.isShowWorklogs = true;
        this.isShowCommentTask = true;
        this.isShowHistory = true;
        break;
      case 2:
        this.button2Styles = {
          "background-color": "#172b4d",
          color: "white",
        };
        this.isShowWorklogs = true;
        this.isShowCommentTask = false;
        this.isShowHistory = false;
        break;
      case 3:
        this.button3Styles = {
          "background-color": "#172b4d",
          color: "white",
        };
        this.getCommentHistorys();
        this.isShowWorklogs = false;
        this.isShowCommentTask = true;
        this.isShowHistory = false;

        break;

      case 4:
        this.button4Styles = {
          "background-color": "#172b4d",
          color: "white",
        };
        this.isShowWorklogs = false;
        this.isShowCommentTask = false;
        this.isShowHistory = true;
        break;
    }
  }

  resetButtonStyle(): void {
    this.button1Styles = {
      "background-color": "white",
      color: "#172b4d",
    };
    this.button2Styles = {
      "background-color": "white",
      color: "#172b4d",
    };
    this.button3Styles = {
      "background-color": "white",
      color: "#172b4d",
    };
    this.button4Styles = {
      "background-color": "white",
      color: "#172b4d",
    };
  }

  filterOptions() {
    // Filter the options based on your conditions
    if (
      this.story_TaskViewData.task_status_id === 0 ||
      this.story_TaskViewData.task_status_id === 1
    ) {
      this.filteredOptions.push({ text: "Mark Complete", value: 2 });
    }
    if (this.story_TaskViewData.task_status_id === 0) {
      this.filteredOptions.push({ text: "Work In Progress", value: 1 });
    }
    if (this.story_TaskViewData.task_status_id === 1) {
      this.filteredOptions.push({ text: "Hold", value: 3 });
    }
    if (this.story_TaskViewData.task_status_id === 2) {
      this.filteredOptions.push({ text: "Verified", value: 5 });
    }
    if (
      this.story_TaskViewData.task_status_id === 10 ||
      this.story_TaskViewData.task_status_id === 2
    ) {
      this.filteredOptions.push({ text: "Return", value: 6 });
    }
    if (this.story_TaskViewData.task_status_id === 5) {
      this.filteredOptions.push({ text: "Tested", value: 10 });
    }
  }

  taskSearchs() {
    let formValue = this.IssueSummaryForm.value;
    console.log("Search Inputs", formValue);
    this.send_value = "";
    if (this.chipSelectedempid) {
      this.send_value = this.send_value + "&status=" + this.chipSelectedempid;
    }
    if (formValue.code) {
      this.send_value = this.send_value + "&code=" + formValue.code;
    }
    if (formValue.client) {
      this.send_value = this.send_value + "&client=" + formValue.client;
    }
    if (formValue.module) {
      this.send_value = this.send_value + "&module=" + formValue.module;
    }

    if (formValue.from_date) {
      this.send_value =
        this.send_value +
        "&from_date=" +
        this.datepipe.transform(formValue.from_date, "yyyy-MM-dd");
    }
    if (formValue.to_date) {
      this.send_value =
        this.send_value +
        "&to_date=" +
        this.datepipe.transform(formValue.to_date, "yyyy-MM-dd");
    }
    if (formValue.transaction_from_date) {
      this.send_value =
        this.send_value +
        "&transaction_from_date=" +
        this.datepipe.transform(formValue.transaction_from_date, "yyyy-MM-dd");
    }
    if (formValue.issue_status) {
      this.send_value =
        this.send_value + "&issue_status=" + formValue.issue_status;
    }
    let pagen = 1;
    this.taskmanagerservice
      .issueSearch(this.send_value, pagen)
      .subscribe((results) => {
        this.issueList = results["data"];
      });
  }

  getassignlist() {
    this.statusLists = [{ name: "Createdby Me" }, { name: "All" }];
  }

  onAssignChange(event: any) {
    let formValue = this.sprintSummaryForm.value;
    console.log("Search Inputs", formValue);
    this.send_value = "";
    if (formValue.method) {
      this.send_value = this.send_value + "&method=" + formValue.method;
    }

    let pagen = 1;
    this.taskmanagerservice
      .sprintSearch(this.send_value, pagen)
      .subscribe((results) => {
        this.sprintList = results["data"];
      });
  }

  // storySearchs()
  // {
  //   let formValue = this.storySearchForm.value;
  //   console.log("Search Inputs",formValue )
  //   this.send_value = ""
  //   if(formValue.query)
  //  {
  //    this.send_value=this.send_value+"&query="+formValue.query
  //  }
  //  if(formValue.client)
  //  {
  //    this.send_value=this.send_value+"&client="+formValue.client
  //  }
  //  if(formValue.module)
  //  {
  //    this.send_value=this.send_value+"&module="+formValue.module
  //  }

  //  if(formValue.from_date)
  //  {
  //    this.send_value=this.send_value+"&from_date="+  this.datepipe.transform((formValue.from_date),'yyyy-MM-dd')
  //  }
  //  if(formValue.to_date)
  //  {
  //    this.send_value=this.send_value+"&to_date="+ this.datepipe.transform((formValue.to_date),'yyyy-MM-dd')
  //  }
  //  if(formValue.transaction_from_date)
  //  {
  //    this.send_value=this.send_value+"&transaction_from_date="+ this.datepipe.transform((formValue.transaction_from_date),'yyyy-MM-dd')
  //  }
  //  if(formValue.issue_status)
  //  {
  //    this.send_value=this.send_value+"&issue_status="+ formValue.issue_status
  //  }
  // let pagen = 1
  //  this.taskmanagerservice.sprintSearchs(this.send_value, pagen).subscribe(results=> {
  //   this.issueList = results['data'];
  // })
  // }

  storySearchs(id) {}
  parseDate(dateString: string | undefined): Date {
    if (dateString) {
      const [year, month, day] = dateString.split("-").map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date();
  }

  getReportTooltip(report: any): string {
    return `
    Completed: ${report.Completed}\n
    Hold: ${report.Hold}\n
    Work in Progress: ${report["Work in Progress"]}\n
    Yet to Start: ${report["Yet to Start"]}\n
    Total: ${report.total}
  `;
  }

  pipelinePopups() {
    this.pipelinePopup = !this.pipelinePopup;
    console.log("this.pipelinePopup", this.pipelinePopup);
    this.pipelinefilter = [
      { name: "Start Date", id: 1 },
      { name: "End Date", id: 2 },
      { name: "Pipeline Status", id: 3 },
      { name: "App id", id: 4 },
      { name: "Client ", id: 5 },
      { name: "Module id  ", id: 6 },
      { name: "Developer id ", id: 7 },
      { name: "Team lead ", id: 8 },
    ];
  }

  createFilter() {
    return this.fb.group({
      field: [""], // From Date, To Date, Status, etc.
      value: [""], // Value for the selected field
    });
  }

  get filters() {
    return this.filterForm.get("filters") as FormArray;
  }

  removeFilter(index: number) {
    this.filters.removeAt(index);
  }

  getTeamDropDown() {
    this.taskmanagerservice.getTeams().subscribe((res) => {
      this.teamList = res["data"];
    });
  }

  getSprintDropDown() {
    this.taskmanagerservice.getSprints("").subscribe((res) => {
      this.sprintlsts = res["data"];
    });
  }

  addFilter() {
    const newFilter = this.filters.controls.map((control) => control.value);
    this.selectedFilters.push(...newFilter);
    this.clearFilters();
  }

  removeSelectedFilter(filter: any) {
    const index = this.selectedFilters.indexOf(filter);
    if (index >= 0) {
      this.selectedFilters.splice(index, 1);
    }
  }

  clearFilters() {
    const filtersArray = this.filterForm.get("filters") as FormArray;
    filtersArray.clear();
  }

  datefunc() {
    let date = this.sprintSummaryForm.value.dynamicdropdown;
    if (date == 1) {
      this.startdate = true;
      this.enddate = false;
      this.query = false;
    } else if (date == 2) {
      this.startdate = false;
      this.enddate = true;
      this.query = false;
    } else if (date == 3) {
      this.startdate = false;
      this.enddate = false;
      this.query = true;
    }
    this.inpstartdatesprint =
      "Start date :" + this.sprintSummaryForm.value.start_date;
    this.inpenddatesprint =
      "End date :" + this.sprintSummaryForm.value.end_date;
    console.log("inpstartdatesprint", this.inpstartdatesprint);
    console.log("inpenddatesprint", this.inpenddatesprint);
  }
  datefunction() {
    let date = this.storySummaryForm.value.dynamicdropdown;
    if (date == 1) {
      this.startdate = true;
      this.enddate = false;
      this.query = false;
      this.team = false;
      this.sprintss = false;
    } else if (date == 2) {
      this.startdate = false;
      this.enddate = true;
      this.query = false;
      this.team = false;
      this.sprintss = false;
    } else if (date == 3) {
      this.startdate = false;
      this.enddate = false;
      this.query = true;
      this.team = false;
      this.sprintss = false;
    } else if (date == 4) {
      this.startdate = false;
      this.enddate = false;
      this.query = false;
      this.team = true;
      this.sprintss = false;
    } else if (date == 5) {
      this.startdate = false;
      this.enddate = false;
      this.query = false;
      this.team = false;
      this.sprintss = true;
    }
    this.inpstartdatesprint =
      "Start date :" + this.sprintSummaryFormss.value.start_date;
    this.inpenddatesprint =
      "End date :" + this.sprintSummaryFormss.value.end_date;
    console.log("inpstartdatesprint", this.inpstartdatesprint);
    console.log("inpenddatesprint", this.inpenddatesprint);
  }

  pipelinefunction() {
    let date = this.taskSummaryForm.value.dynamicdropdown;
    if (date == 1) {
      this.startdate = true;
      this.enddate = false;
      this.pipeline_status = false;
      this.app_id = false;
      this.client = false;
      this.module_id = false;
      this.developer_id = false;
      this.team_lead = false;
    } else if (date == 2) {
      this.startdate = false;
      this.enddate = true;
      this.pipeline_status = false;
      this.app_id = false;
      this.client = false;
      this.module_id = false;
      this.developer_id = false;
      this.team_lead = false;
    } else if (date == 3) {
      this.startdate = false;
      this.enddate = false;
      this.pipeline_status = true;
      this.app_id = false;
      this.client = false;
      this.module_id = false;
      this.developer_id = false;
      this.team_lead = false;
    } else if (date == 4) {
      this.startdate = false;
      this.enddate = false;
      this.pipeline_status = false;
      this.app_id = true;
      this.client = false;
      this.module_id = false;
      this.developer_id = false;
      this.team_lead = false;
    } else if (date == 5) {
      this.startdate = false;
      this.enddate = false;
      this.pipeline_status = false;
      this.app_id = false;
      this.client = true;
      this.module_id = false;
      this.developer_id = false;
      this.team_lead = false;
    } else if (date == 6) {
      this.startdate = false;
      this.enddate = false;
      this.pipeline_status = false;
      this.app_id = false;
      this.client = false;
      this.module_id = true;
      this.developer_id = false;
      this.team_lead = false;
    } else if (date == 7) {
      this.startdate = false;
      this.enddate = false;
      this.pipeline_status = false;
      this.app_id = false;
      this.client = false;
      this.module_id = false;
      this.developer_id = true;
      this.team_lead = false;
    } else if (date == 8) {
      this.startdate = false;
      this.enddate = false;
      this.pipeline_status = false;
      this.app_id = false;
      this.client = false;
      this.module_id = false;
      this.developer_id = false;
      this.team_lead = true;
    }
    this.inpstartdatesprint =
      "Start date :" + this.taskSummaryForm.value.start_date;
    this.inpenddatesprint = "End date :" + this.taskSummaryForm.value.end_date;
    console.log("inpstartdatesprint", this.inpstartdatesprint);
    console.log("inpenddatesprint", this.inpenddatesprint);
  }
  resetsprinitform() {
    this.sprintSummaryForm.reset();
    this.taskSummaryForm.reset();
    this.storySummaryForm.reset();
    // this.backlogSummaryForm.reset()
    // this.IssueSummaryForm.reset()
    this.startdate = false;
    this.enddate = false;
    this.query = false;
    this.statuss = false;
    this.statusss = false;
    this.priority = false;
    this.team_lead = false;
    this.developer_id = false;
    this.client = false;
    this.app_id = false;
    this.module_id = false;
    this.pipeline_status = false;
    this.inpstartdatesprint = "";
    this.inpenddatesprint = "";
  }
  startdateclick(e) {
    console.log(
      "inpstartdatesprint",
      this.datepipe.transform(e.value, "dd-MMM-yyyy")
    );
    this.inpstartdatesprint =
      "Start date :" + this.datepipe.transform(e.value, "dd-MMM-yyyy");

    console.log("inpstartdatesprint", this.inpstartdatesprint);
  }
  enddateclick(e) {
    console.log(
      "inpenddatesprint",
      this.datepipe.transform(e.value, "dd-MMM-yyyy")
    );
    this.inpenddatesprint =
      "End date :" + this.datepipe.transform(e.value, "dd-MMM-yyyy");
    console.log(
      "inpenddatesprint",
      this.datepipe.transform(e.value, "dd-MMM-yyyy")
    );
  }
  assignTask() {
    let data = this.assignForm.value;
    let payload = [
      {
        emp_id: data.developer_id.id,
        task_id: this.storyrId,
      },
    ];
    console.log("Reassigner", data);
    console.log("ReassignerPay", payload);

    this.taskmanagerservice.assignTask(payload).subscribe(
      (results) => {
        this.SpinnerService.hide();
        if (results.code == "INVALID_DATA") {
          this.notification.showError(results.description);
        } else {
          this.notification.showSuccess("Task Assigned");
          // this.OnSubmit.emit()
          return true;
        }
      },
      (error) => {
        this.SpinnerService.hide();
      }
    );
  }

  getdesignationStatuss() {
    this.TaskManagerService.getdesignationStatus(1).subscribe((result) => {
      this.SpinnerService.hide();
      console.log("sprint summary", result);
      this.assigns = result;
    });
  }
  // Bootstrap Popup
  popupLogType() {
    this.TaskManagerService.getLogType().subscribe((results) => {
      this.SpinnerService.hide();
      this.logTypeArr = results;
    });
    // View Hide condition
    // if (this.selectLogTypeValue == "2") {
    //   this.othersPopMenuNgif = true;
    //   this.activityPopMenuNgif = false;
    // } else if (this.selectLogTypeValue == "3") {
    //   this.othersPopMenuNgif = false;
    //   this.activityPopMenuNgif = true;
    // }
  }

  updateViewConditions() {
    // View Hide condition
    if (this.selectLogTypeValue == "2") {
      this.othersPopMenuNgif = true;
      this.activityPopMenuNgif = false;
    } else if (this.selectLogTypeValue == "3") {
      this.othersPopMenuNgif = false;
      this.activityPopMenuNgif = true;
    } else {
      // Handle other conditions or reset values if needed
    }
  }

  // Application dropdown
  logActionApplication() {
    this.TaskManagerService.getActionApplication().subscribe((results) => {
      this.SpinnerService.hide();
      this.logActionApplicationArr = results;
      console.log(this.logActionApplicationArr);
    });
  }

  // Copy from task-create
  private getLogType(cltkeyvalue) {
    this.TaskManagerService.getClientFilter(cltkeyvalue, 1).subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.popupClientList = datas;
      }
    );
  }

  // Copy from task-create
  private getclient(cltkeyvalue) {
    this.TaskManagerService.getClientFilter(cltkeyvalue, 1).subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.popupClientList = datas;
      }
    );
  }

  private getApplication(appkeyvalue) {
    this.TaskManagerService.getAppFilter(
      this.client_Id,
      appkeyvalue,
      1
    ).subscribe((results: any[]) => {
      let datas = results["data"];
      this.popupAppList = datas;
    });
  }

  private getActivity(appkeyvalue) {
    this.TaskManagerService.getActionActivity(
      this.client_Id,
      this.module_Id,
      appkeyvalue,
      1
    ).subscribe((results: any[]) => {
      let datas = results["data"];
      this.activityArr = datas;
    });
  }

  // client 1st dropdown
  clients() {
    let cltkeyvalue: String = "";
    this.getclient(cltkeyvalue);

    this.popupAddForm
      .get("client")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.popupIsLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.TaskManagerService.getClientFilter(value, 1).pipe(
            finalize(() => {
              this.popupIsLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.popupClientList = datas;
      });
  }

  // Application - module 2nd dropdown
  application() {
    let appkeyvalue: String = "";
    this.getApplication(appkeyvalue);

    this.popupAddForm
      .get("app_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.popupIsLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.TaskManagerService.getAppFilter(this.client_Id, value, 1).pipe(
            finalize(() => {
              this.popupIsLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.popupAppList = datas;
      });
  }

  // Activity 3rd dropdown
  activity() {
    let appkeyvalue: String = "";
    this.getActivity(appkeyvalue);

    this.popupAddForm
      .get("Act_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.popupIsLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.TaskManagerService.getActionActivity(
            this.client_Id,
            this.module_Id,
            value,
            1
          ).pipe(
            finalize(() => {
              this.popupIsLoading = false;
            })
          )
        )
      )
      .subscribe((results) => {
        this.SpinnerService.hide();
        this.activityArr = results.data;
        console.log(this.activityArr);
      });
  }

  // LogType displayFn
  public displayFnLogType(clt?: popupClient): string | undefined {
    // console.log(`Client testing data - ${clt.name}`);
    return clt ? clt.name : undefined;
  }

  // client displayFn
  public displayFnclient(clt?: popupClient): string | undefined {
    // console.log(`Client testing data - ${clt.name}`);
    return clt ? clt.name : undefined;
  }
  public displayFnteamclient(clt?: teamopClient): string | undefined {
    // console.log(`Client testing data - ${clt.name}`);
    return clt ? clt.name : undefined;
  }
  public displaymoduleclient(clt?: moduleclient): string | undefined {
    // console.log(`Client testing data - ${clt.name}`);
    return clt ? clt.name : undefined;
  }
  public displaydevelopclient(clt?: developclient): string | undefined {
    // console.log(`Client testing data - ${clt.name}`);
    return clt ? clt.name : undefined;
  }
  public displayteamleadclient(clt?: teamleadclient): string | undefined {
    // console.log(`Client testing data - ${clt.text}`);
    return clt ? clt.name : undefined;
  }
  public displaystatusleadclient(clt?: statusclient): string | undefined {
    // console.log(`Client testing data - ${clt.text}`);
    return clt ? clt.text : undefined;
  }

  // module displayFn
  public displayFnApp(appnm?: popupApplication): string | undefined {
    return appnm ? appnm.name : undefined;
  }

  // Activity displayFn
  public displayFnActivity(act?: Activityid): string | undefined {
    // console.log(`Activity Testing data - ${act.activity}`);
    return act ? act.activity : undefined;
  }

  clearClient() {
    this.popupAddForm.controls["app_id"].reset("");
    this.popupAddForm.controls["module_id"].reset("");
  }

  // client_Id = 0;
  FocusOut_select_client(data) {
    this.client_Id = data.id;
    console.log("client- id", this.client_Id);
  }

  // module)Id = 0;
  FocusOut_select_module(data) {
    this.module_Id = data.id;
  }

  // project_Id = 0;
  FocusOut_select_app(data) {
    this.project_Id = data.id;
    console.log("project- id", this.project_Id);
  }

  // onActivitySelected(selectedActivity: Activityid): void {
  //   this.popupAddForm.get("Act_id").setValue(selectedActivity.activity);
  // }

  clearApp() {
    this.popupAddForm.controls["module_id"].reset("");
  }

  SubmitTms() {
    this.SpinnerService.show();
    if (this.popupAddForm.value.name === "") {
      this.notify.error("Please Enter Name");
      this.SpinnerService.hide();
      return false;
    }
    if (this.popupAddForm.value.start_day === "") {
      this.notify.error("Please Select Start Date");
      this.SpinnerService.hide();
      return false;
    }
    if (this.popupAddForm.value.end_day === "") {
      this.notify.error("Please Select End Date");
      this.SpinnerService.hide();
      return false;
    }
    // let dateValue = this.popupAddForm.value;
    // dateValue.start_day = this.datePipe.transform(
    //   dateValue.start_day,
    //   "yyyy-MM-dd"
    // );
    // dateValue.end_day = this.datePipe.transform(
    //   dateValue.end_day,
    //   "yyyy-MM-dd"
    // );

    this.taskmanagerservice.tmsSubmitForm(this.popupAddForm.value).subscribe(
      (res) => {
        console.log("Task click", res);
        if (res.message == "Successfully Created") {
          this.notify.success("Created Successfully!...");
          this.OnSubmit.emit();
          this.SpinnerService.hide();
        } else {
          this.notify.error(res.description);
          this.SpinnerService.hide();
          return false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
    this.get_timesheetsummary();
  }
  get_timesheetsummary() {
    // this.taskmanagerservice.gettimeSheetsummarytable()
    //   .subscribe(result => {
    //     this.SpinnerService.hide();
    //     this.timesumtable = result['data']
    //   }, (error) => {
    //     this.errorHandler.handleError(error);
    //     this.SpinnerService.hide();
    //   })
  }
  handleDateChange(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      this.formattedDate = `${year}-${month}-${day}`;
      // console.log(`Formatted Date: ${this.formattedDate}`);
      // Call the timeSheetsummary method and pass the formattedDate
      this.timeSheetsummary(this.formattedDate);
    }
  }

  // timesheet
  otherDateChange(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      this.formattedDate = `${year}-${month}-${day}`;
      this.timeSheetsummary(this.formattedDate);
    }
  }

  // timesheet
  timeSheetsummary(formattedDate: string) {
    this.TaskManagerService.gettimeSheetsummary(formattedDate).subscribe(
      (result) => {
        this.SpinnerService.hide();
        // console.log("TimeSheet task summary", result);
        this.timeSheetList = result["data"];
        // console.log(this.timeSheetList);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  getteamdrop() {
    this.TaskManagerService.teamget("").subscribe((res) => {
      this.teamdrop = res["data"];
    });
  }

  getsprintdrop() {
    this.TaskManagerService.sprintget().subscribe((res) => {
      this.sprinttdrop = res;
    });
  }

  getAppdrop() {
    this.TaskManagerService.getApp("").subscribe((res) => {
      this.appdrop = res["data"];
    });
  }
  getClientdrop() {
    this.TaskManagerService.getClient("").subscribe((res) => {
      this.clientdrop = res["data"];
    });
  }
  getModuledrop() {
    this.TaskManagerService.getmodule("").subscribe((res) => {
      this.moduledrop = res["data"];
    });
  }
  getDeveloperdrop() {
    this.TaskManagerService.getdeveloper("").subscribe((res) => {
      this.develop = res["data"];
    });
  }
  getTeamleaddrop() {
    this.TaskManagerService.getteams("").subscribe((res) => {
      this.teams = res["data"];
    });
  }
  statusdrop() {
    this.TaskManagerService.gesta("").subscribe((res) => {
      this.statusdrops = res;
    });
  }

  appClick() {
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.taskSummaryForm
      .get("app_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.TaskManagerService.getApp(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.appdrop = datas;
      });
  }
  teamclick() {
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.taskSummaryForm
      .get("team")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.TaskManagerService.teamget(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.teamdrop = datas;
      });
  }
  moduleClick() {
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.taskSummaryForm
      .get("module_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.TaskManagerService.getmodule(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.moduledrop = datas;
      });
  }
  developerClick() {
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.taskSummaryForm
      .get("developer_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.TaskManagerService.getdeveloper(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.develop = datas;
      });
  }
  teamleadclick() {
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.taskSummaryForm
      .get("team_lead")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.TaskManagerService.getteams(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.teams = datas;
      });
  }
  statusclick() {
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.taskSummaryForm
      .get("team")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.TaskManagerService.gesta(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.statusdrops = datas;
      });
  }
  public displaydis(AppId?: productlistss): string | undefined {
    // console.log('id', producttype.id);
    // console.log('name', producttype.name);
    return AppId ? AppId.name : undefined;
  }
  get AppId() {
    return this.taskSummaryForm.get("app_id");
  }

  updateTaskProgresss() {
    this.ChaneStatus(2, this.story_TaskViewData);
  }
}
