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
import { MatDatepicker } from "@angular/material/datepicker";
import * as _moment from "moment";
import { default as _rollupMoment, Moment } from "moment";
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
export interface modulelists {
  id: string;
  client_code: string;
  module_name: string;
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
export interface clientlists {
  id: string;
  client_code: string;
  client_name: string;
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
  text: any;
}
export interface Sprint {
  id: string;
  name: string;
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
  selector: "app-issueview",
  templateUrl: "./issueview.component.html",
  styleUrls: ["./issueview.component.scss"],
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
export class IssueviewComponent implements OnInit {
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
    { name: "Priority "; id: 7 },
    { name: "Status "; id: 8 }
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
  statusdrops: any;
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
  clientlist: Array<clientlists>;
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
  pipeList: any;
  showMoreInfo: boolean;
  issuecreate: boolean = false;
  storySearchForm: FormGroup;
  allChecked: boolean = false;
  showMoveToTaskButton: boolean = false;
  selectedItems: any[] = [];
  today: Date = new Date();

  pipelineSummaryForm: FormGroup;
  sprintFilterForms: FormGroup;
  formArray: FormArray;
  issueView: boolean = true;
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
  @Output() OnSubmit = new EventEmitter<any>();
  @Output() OnCancel = new EventEmitter<any>();

  @ViewChild("appnm") matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("appnmInput") appnmInput: any;
  @ViewChild("taskunithead") mattaskunitempAutocomplete: MatAutocomplete;
  @ViewChild("taskunitheadInput") taskunitheadInput: any;
  @ViewChild("clt") matclientAutocomplete: MatAutocomplete;
  @ViewChild("cltInput") cltInput: any;
  @ViewChild("clientInput") clientInput: any;
  @ViewChild("clientrole") matappAutocomplete: MatAutocomplete;

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
  @ViewChild("moduleInput") moduleInput: any;
  @ViewChild("developerinput") developerinput: any;
  // @ViewChild('clientrole') matappAutocomplete: MatAutocomplete;
  @ViewChild("teamsrole") matappAutoteamcomplete: MatAutocomplete;
  @ViewChild("modulerole") matmoduleAutocomplete: MatAutocomplete;
  @ViewChild("developerrole") matdevelopAutocomplete: MatAutocomplete;
  @ViewChild("teamrole") matteamleadsAutocomplete: MatAutocomplete;
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
  selectedFile: File [] =[];;
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
  appdrop: any;
  clientdrop: any;
  moduledrop: any;
  ststusdrop: any;
  prioritydrop: any;
  taskview: boolean;
  commentfile: any;
  reuploadfileArr: any=[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
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
    private localservice: ShareddataService
  ) {}
  

  ngOnInit(): void {
    let Val = this.localservice.taskid.value;
    this.getparticularIssue(Val);
  }

  getparticularIssue(issue) {
    this.issueView = true;

    this.issueId = issue;
    this.getCommentHistory();

    this.taskmanagerservice.getIssueFetch(issue).subscribe((res) => {
      this.singleissueViewData = res;
    });
  }
  formatCreatedDate(milliseconds: number): string {
    const date = new Date(milliseconds);
    return new DatePipe('en-US').transform(date, 'medium'); // Adjust the format as needed
  }

  movetoTaskData() {
    let payload = { id: this.issueId, status: 2 };
    this.taskmanagerservice.issuetoTask(payload).subscribe((results) => {
      if (results.status) {
        this.SpinnerService.hide();
        this.notification.showSuccess(results.message);

        let Val = this.localservice.taskid.value;
        this.getparticularIssue(Val);
        this.issueView_backnavigate()
        return true;
      } else {
        this.SpinnerService.hide();
        this.notification.showError(results.description);
      }
    });
  }
  InvalidIssue() {
    let payload = { id: this.issueId, status: 3 };
    this.taskmanagerservice.issuetoTask(payload).subscribe(
      (results) => {
        this.SpinnerService.hide();
        this.notification.showWarning("Issue moved to Invalid");
          
        return true;
      },
      (error) => {
        this.SpinnerService.hide();
      }
    );
    this.issueView_backnavigate()
  }

  DuplicateIssue() {
    let payload = { id: this.issueId, status: 4 };
    this.taskmanagerservice.issuetoTask(payload).subscribe(
      (results) => {
        this.SpinnerService.hide();

        this.notification.showWarning("Issue marked as Duplicate");
        return true;
      },
      (error) => {
        this.SpinnerService.hide();
      }
    );
    this.issueView_backnavigate()
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
  }

  onFileSelect(e) {
    // this.selectedFile = event.target.files[0];
    let reuploaddatavalue = e.target.files

    for (var i = 0; i < e.target.files.length; i++) {

      this.reuploadfileArr.push(e.target.files[i])
    }
  }

  saveComment() {
    // Here, you can handle the logic to save the comment and the attached file.
    console.log("Comment Text:", this.commentText);
    console.log("Selected File:", this.selectedFile);
    // let payload = {
    //   comment: this.commentText,
    // };
    let payload = {
      "comment": this.commentText
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
    // this.issueId = 1;

    this.taskmanagerservice.addComment(formData, this.issueId).subscribe(
      (results) => {
        if(results.status){
          this.SpinnerService.hide()
            this.notification.showSuccess(results.message)
            this.getCommentHistory();
            // this.OnSubmit.emit() 
            this.commentText = ''
            this.reuploadfileArr=[]
            this.selectedFile=[]
            return true }
            else{
              this.SpinnerService.hide()
          this.notification.showError(results.description)
          this.reuploadfileArr=[]
          this.selectedFile=[]
          } 
        })   
  }
  deleteComment(commentId) {
    this.taskmanagerservice.deleteComment(commentId).subscribe(
      results=>{
        this.SpinnerService.show()
        if(results.code)
        {
          this.notification.showError(results.description)
        }
        else
        {
          this.notification.showSuccess(results.message)
          this.getCommentHistory()
          return true 
        }
        }, error =>{
        this.SpinnerService.hide()
        
        
        }) 
    // You can make an API call to delete the comment here
  }

  attachmentDelete(file, index) {

    this.reuploadfileArr.splice(index,1)
    
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
        binaryData.push(res);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = data.file_name;
        link.click();

        // Trigger the download by clicking the link
        // link.click();
      },
      (error: any) => {
        this.SpinnerService.hide();
        console.error("Error:", error);
      }
    );
  }
  issueView_backnavigate() {
    this.OnCancel.emit();
  }
  fileview(data){
this.commentfile=data.file
  }

  story_TaskView(story_taskID) {
    this.localservice.taskid.next(story_taskID);
    this.issueView = false;
    this.taskview = true;
  }
  backtoTaskSummary()
  {
    this.issueView = true;
    this.taskview = false;
  }
}
