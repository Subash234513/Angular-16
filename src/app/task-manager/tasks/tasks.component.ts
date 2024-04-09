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
  selector: "app-tasks",
  templateUrl: "./tasks.component.html",
  styleUrls: ["./tasks.component.scss"],
})
export class TasksComponent implements OnInit {
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
  isShowTasksummary: boolean = true;
  isShowStory: boolean;
  isShowStorySpr: boolean;
  storycreate: boolean;
  storyiew: boolean;
  story_taskView: boolean;
  sprintcreate: boolean;
  isShowSprint: boolean;
  taskSearchForm: FormGroup;
  taskList: any;
  get_value: string = "";
  presentpageTask: number = 1;
  summarypage: number = 1;
  pagesizetask = 10;
  typeid: number = 0;
  has_nextTask: boolean = true;
  has_previousTask: boolean = true;
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
  has_next: boolean = true;
  has_previous: boolean = true;
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
  @ViewChild("closebutton") closebutton;
  @ViewChild('labelImport') labelImport
  pipeList: any;
  showMoreInfo: boolean;
  issuecreate: boolean = false;
  storySearchForm: FormGroup;
  ExcelUpload:boolean=false
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
  istaskpagination: boolean;
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
  timeSheetList: any;
  dateID: any;
  activityArr2: any;
  timesumtable: any;
  timeSheet: FormGroup;
  actualdate: any;
  endadate: any;
  isActualDate: any;
  taskview: boolean = false;
  quickviewlist: any;
  clientName: any;
  moduleName: any;
  projectName: any;
  filedata: any;

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
    private LocalShareService: ShareddataService
  ) {}

  @Output() OnSubmit = new EventEmitter<any>();

  ngOnInit(): void {
    this.taskSummaryForm = this.fb.group({
      start_date: "",
      end_date: "",
      query: "",
      status: "",
      app_id: "",
      client: "",
      priority: "",
      module_id: "",
      dynamicdropdown: "",
      team: "",
      developer_id: "",
      team_lead: "",
      dropfilter: "",
      sprint:""
    });

    this.getdesignationStatuss("");
     this.getSprintDropDown();
  }

  TaskSearch(hint: any, page) {
    let search = this.taskSummaryForm.value;
    // let searchs = this.taskSearchForm.value;
    console.log("Stories Searchs", search);
    search.start_date = this.datepipe.transform(
      search.start_date,
      "yyyy-MM-dd"
    );
    search.end_date = this.datepipe.transform(search.end_date, "yyyy-MM-dd");
    let obj = {
      start_date: search?.start_date,
      end_date: search?.end_date,
      dev_type: search?.dev_type,
      app_id: search?.app_id?.id,
      client: search?.client,
      module_id: search?.module_id?.id,
      developer_id: search?.developer_id?.id,
      team_lead: search?.team_lead?.id,
      query: search?.query,
      summary_type: search?.dropfilter,
      status: search?.status?.id,
      team_id: search?.team?.id,
      sprint_id:search?.sprint?.id
    };
    console.log("obj api", obj);
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = "";
      }
    }

    if (hint == "next") {
      this.taskSummary(obj, this.presentpageTask + 1);
    } else if (hint == "previous") {
      this.taskSummary(obj, this.presentpageTask - 1);
    } else {
      this.taskSummary(obj, 1);
    }
    this.taskPopups = false;
  }
  nextClick() {
    if (this.has_nextTask === true) {
      this.TaskSearch(this.presentpageTask + 1, 10);
    }
  }
  previousClick() {
    if (this.has_previousTask === true) {
      this.TaskSearch(this.presentpageTask - 1, 10);
    }
  }

  taskSummary(search, pageno) {
    this.SpinnerService.show();

    this.TaskManagerService.storyBasedTaskSummary(
      search,
      pageno,
      this.chipSelectedempid
    ).subscribe(
      (result) => {
        this.SpinnerService.hide();

        // this.SpinnerService.hide();
        console.log("task summary", result);
        this.taskList = result["data"];
        let dataPagination = result["pagination"];
        // this.updatePagination();
        if (this.taskList.length >= 0) {
          this.has_nextTask = dataPagination.has_next;
          this.has_previousTask = dataPagination.has_previous;
          this.presentpageTask = dataPagination.index;
          this.istaskpagination = true;
          // this.taskSearchForm.reset()
          // this.taskSummaryForm.reset()
          this.taskPopups = false;
        }
        if (this.taskList.length <= 0) {
          this.istaskpagination = false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  taskfunction() {
    let date = this.taskSummaryForm.value.dynamicdropdown;
    if (date == 1) {
      this.startdate = true;
      this.enddate = false;
      this.query = false;
      this.app_id = false;
      this.client = false;
      this.module_id = false;
      this.developer_id = false;
      this.team_lead = false;
      this.statuss = false;
    } else if (date == 2) {
      this.startdate = false;
      this.enddate = true;
      this.query = false;
      this.app_id = false;
      this.client = false;
      this.module_id = false;
      this.developer_id = false;
      this.team_lead = false;
      this.statuss = false;
    } else if (date == 3) {
      this.startdate = false;
      this.enddate = false;
      this.query = true;
      this.app_id = false;
      this.client = false;
      this.module_id = false;
      this.developer_id = false;
      this.team_lead = false;
      this.statuss = false;
    } else if (date == 4) {
      this.startdate = false;
      this.enddate = false;
      this.query = false;
      this.app_id = true;
      this.client = false;
      this.module_id = false;
      this.developer_id = false;
      this.team_lead = false;
      this.statuss = false;
    } else if (date == 5) {
      this.startdate = false;
      this.enddate = false;
      this.query = false;
      this.app_id = false;
      this.client = true;
      this.module_id = false;
      this.developer_id = false;
      this.team_lead = false;
      this.statuss = false;
    } else if (date == 6) {
      this.startdate = false;
      this.enddate = false;
      this.query = false;
      this.app_id = false;
      this.client = false;
      this.module_id = true;
      this.developer_id = false;
      this.team_lead = false;
      this.statuss = false;
    } else if (date == 7) {
      this.startdate = false;
      this.enddate = false;
      this.query = false;
      this.app_id = false;
      this.client = false;
      this.module_id = false;
      this.developer_id = true;
      this.team_lead = false;
      this.statuss = false;
    } else if (date == 8) {
      this.startdate = false;
      this.enddate = false;
      this.query = false;
      this.app_id = false;
      this.client = false;
      this.module_id = false;
      this.developer_id = false;
      this.team_lead = true;
      this.statuss = false;
    } else if (date == 9) {
      this.startdate = false;
      this.enddate = false;
      this.query = false;
      this.app_id = false;
      this.client = false;
      this.module_id = false;
      this.developer_id = false;
      this.team_lead = false;
      this.statuss = true;
    }
    this.inpstartdatesprint =
      "Start date :" + this.taskSummaryForm.value.start_date;
    this.inpenddatesprint = "End date :" + this.taskSummaryForm.value.end_date;
    console.log("inpstartdatesprint", this.inpstartdatesprint);
    console.log("inpenddatesprint", this.inpenddatesprint);
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
          this.TaskManagerService.getdevelopers(value, this.typeid).pipe(
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

  updatePagination(): void {
    if (this.pageNumbers >= 1) {
      this.pageNumbers = Math.max(this.pageNumbers, 1);
      // this.taskSummary('', this.pageNumbers)
      let search = this.taskSummaryForm.value;
      // let searchs = this.taskSearchForm.value;
      console.log("Stories Searchs", search);
      search.start_date = this.datepipe.transform(
        search.start_date,
        "yyyy-MM-dd"
      );
      search.end_date = this.datepipe.transform(search.end_date, "yyyy-MM-dd");
      let obj = {
        start_date: search?.start_date,
        end_date: search?.end_date,
        dev_type: search?.dev_type,
        app_id: search?.app_id?.id,
        client: search?.client?.id,
        module_id: search?.module_id?.id,
        developer_id: search?.developer_id?.id,
        team_lead: search?.team_lead?.id,
        query: search?.query,
        summary_type: search?.dropfilter,
        status: search?.status?.id,
      };
      console.log("obj api", obj);
      for (let i in obj) {
        if (obj[i] == undefined || obj[i] == null) {
          obj[i] = "";
        }
      }
      this.taskSummary(obj, this.pageNumbers);
    }
  }
  previousPage(): void {
    this.SpinnerService.show();
    if (this.has_previousTask) {
      this.pageNumbers = this.pageNumbers - 1;
      this.updatePagination();
    }
  }
  nextPage(): void {
    if (this.has_nextTask) {
      this.SpinnerService.show();
      this.pageNumbers = this.pageNumbers + 1;
      this.updatePagination();
    }
  }
  isNextPageAllowed(): boolean {
    return this.pageNumbers > 10;
  }

  isDateExpired(endDate: string): boolean {
    if (endDate !== "None") {
      const endDateObj = new Date(endDate);
      return endDateObj.getTime() > this.today.getTime();
    }
    return false;
  }

  getEmployeeNames(assignedTo: any[]): string {
    return assignedTo.map((emp) => emp.name).join(", ");
  }

  getdesignationStatuss(page) {
    this.TaskManagerService.getdesignationStatus(page).subscribe((result) => {
      console.log("sprint summary", result);
      this.assigns = result;

      let last_element = this.assigns[this.assigns.length - 1];
      this.typeid = last_element?.id;
      this.taskSummaryForm.get("dropfilter").patchValue(last_element.id);
      this.TaskSearch("", "");
    });
  }
  onTaskAdds() {
    // this.shareservice.story_Id.next(this.selectedItem.id)
    this.taskcreate = true;
    this.isShowTasksummary = false;
    this.taskview = false;
    this.LocalShareService.sprintfromdate.next("");
    this.LocalShareService.sprinttodate.next("");
    this.LocalShareService.story_Id.next(0);
    //  this.quickview()
  }
  SubmitbackToSummary() {
    this.taskcreate = false;
    this.isShowTasksummary = true;
    this.taskview = false;
    this.TaskSearch("", "");
  }
  backtoTaskSummary() {
    this.taskcreate = false;
    this.isShowTasksummary = true;
    this.taskview = false;
    this.TaskSearch("", "");
    this.pageNumbers = 1;

  }
  modalclose() {
    this.taskcreate = false;
    this.closebutton.nativeElement.click();
  }
  // getdesignationStatuss()
  // {
  //   this.TaskManagerService.getdesignationStatus()
  //   .subscribe(result => {
  //     this.SpinnerService.hide();
  //     console.log("sprint summary", result)
  //     this.assigns = result
  //   })
  // }

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
  public displayclientteam(clientteamrole?: clientlists): string | undefined {
    return clientteamrole ? clientteamrole.client_name : undefined;
  }

  public displayccclient(clt?: Client): string | undefined {
    // console.log(`Client testing data - ${clt.name}`);
    return clt ? clt.name : undefined;
  }
  public displaysprintteamclient(clt?: teamopClient): string | undefined {
    // console.log(`Client testing data - ${clt.name}`);
    return clt ? clt.name : undefined;
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
  taskPopup() {
    this.taskPopups = !this.taskPopups;
    if(this.taskPopups){
      this.ExcelUpload=false
    }
 
    console.log("this.taskPopups", this.taskPopups);
    this.taskfilter = [
      { name: "Start Date", id: 1 },
      { name: "End Date", id: 2 },
      { name: "Query", id: 3 },
      { name: "App id", id: 4 },
      { name: "Client ", id: 5 },
      { name: "Module id  ", id: 6 },
      { name: "Developer id ", id: 7 },
      { name: "Team lead ", id: 8 },
      { name: "Status ", id: 9 },
    ];
  }

  story_TaskViews(typeId: number) {
    // this.router.navigate(['taskmanage/task_singleView', typeId]);
    this.LocalShareService.taskid.next(typeId);
    this.taskcreate = false;
    this.isShowTasksummary = false;
    this.taskview = true;
  }
  resetsprinitform() {
    // this.sprintSummaryForm.reset()
    this.taskSummaryForm.reset();

    let last_element = this.assigns[this.assigns.length - 1];
    this.taskSummaryForm.get("dropfilter").patchValue(last_element.id);
    // this.TaskSearch('','');
    // this.storySummaryForm.reset()
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
    this.TaskSearch("", "");
  }

  public displayteamleadclient(clt?: teamleadclient): string | undefined {
    // console.log(`Client testing data - ${clt.text}`);
    return clt ? clt.name : undefined;
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
    this.TaskManagerService.getdevelopers("", this.typeid).subscribe((res) => {
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
  resetTasks() {
    this.taskSummaryForm.reset();

    let last_element = this.assigns[this.assigns.length - 1];
    this.taskSummaryForm.get("dropfilter").patchValue(last_element.id);
    this.TaskSearch("", "");
    this.clearMatChipInput();
    this.TaskSearch("", 1);
  }

  clearMatChipInput() {
    // Clear the array that holds the mat-chip values
    this.chipSelectedemp = [];
    this.chipSelectedempid = [];
    // Clear the form control associated with the mat-chip input
    this.taskSummaryForm.get("status").setValue(null);
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
  public displayFnclient(clt?: popupClient): string | undefined {
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

  clientclick() {
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.taskSummaryForm
      .get("client")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.TaskManagerService.getClient(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.clientdrop = datas;
      });
  }

  ApplyFilters() {
    this.TaskSearch("", 1);
    this.pageNumbers = 1;
  }
  searchFilter() {
    this.TaskSearch("", 1);
    this.pageNumbers = 1;
  }
  public displayFnteamclient(clt?: teamopClient): string | undefined {
    // console.log(`Client testing data - ${clt.name}`);
    return clt ? clt.name : undefined;
  }

  newdrop(data) {
    this.typeid = data.id;
  }

  downloadexcel() {
    let search = this.taskSummaryForm.value;
    // let searchs = this.taskSearchForm.value;
    console.log("Stories Searchs", search);
    search.start_date = this.datepipe.transform(
      search.start_date,
      "yyyy-MM-dd"
    );
    search.end_date = this.datepipe.transform(search.end_date, "yyyy-MM-dd");
    let obj = {
      start_date: search?.start_date,
      end_date: search?.end_date,
      dev_type: search?.dev_type,
      app_id: search?.app_id?.id,
      client: search?.client,
      module_id: search?.module_id?.id,
      developer_id: search?.developer_id?.id,
      team_lead: search?.team_lead?.id,
      query: search?.query,
      summary_type: search?.dropfilter,
      status: search?.status?.id,
      team: search?.team?.id,
      
    };
    console.log("obj api", obj);
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = "";
      }
    }

    this.downloadsumexcel(obj);
  }
  downloadsumexcel(data) {
    this.taskmanagerservice.getexceldownload(data).subscribe((results) => {
      let binaryData = [];
      binaryData.push(results);
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "Taskcomponent.xlsx";
      link.click();
    });
  }
  quickview() {
    this.taskmanagerservice.quickview()
      .subscribe((results: any[]) => {
        let datas = results["data"];
  
        for (let i = 0; i < datas.length; i++) {
          let quickviewItem = datas[i];
  
          this.clientName = quickviewItem.client.name;
          this.moduleName = quickviewItem.module.name;
          this.projectName = quickviewItem.project.name;
  
          
          this.LocalShareService.clientname.next(this.clientName);
          this.LocalShareService.modulename.next(this.moduleName);
          this.LocalShareService.projectname.next(this.projectName);
          // console.log("clientname=",this.clientName)
        
        }
      });
  }
  getSprintDropDown() {
    this.taskmanagerservice.getSprints('').subscribe(res => {
      this.sprintlsts = res['data']
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
  fileChange(files,file:FileList){
    this.labelImport.nativeElement.innerText=Array.from(file).map(f=>f.name)
    this.filedata=<File>files.target.files[0]
    console.log(this.filedata)
  } 
  uploadDocuments(){
    this.taskmanagerservice.TaskExcelUpload(this.filedata).subscribe(data=>{
      if(data.message){
        this.notification.showSuccess(data.message)
        this.CancelBulk()
        this.filedata=''
      }
      else if(data.description){
        this.notification.showError(data.description)
      }
      
 
      this.TaskSearch('','')
    }) 
  }


  downloadTemplate(){
   
    this.taskmanagerservice.TaskExcelDowload().subscribe(data=>{
      let Blogdata=[]
      Blogdata.push(data)
      let downloadUrl=window.URL.createObjectURL(new Blob(Blogdata))
      let Url=document.createElement('a')
      Url.href=downloadUrl
      Url.download='Template'+'.xlsx'
      Url.click();
      
    })
    
  }
  BulkClick(){
  
    this.ExcelUpload=!this.ExcelUpload
    if(this.ExcelUpload){
      this.taskPopups=false
     
    }
  }
  CancelBulk(){
    this.ExcelUpload=!this.ExcelUpload
    if(this.ExcelUpload){
      this.taskPopups=false
      this.labelImport.nativeElement.innerText=''
    }
  }
}
