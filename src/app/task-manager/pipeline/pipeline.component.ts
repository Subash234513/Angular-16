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
export interface popupClient {
  id: string;
  name: string;
}
export interface Client {
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
export interface clientlists{
  id:string;
  client_code:string;
  client_name:string;
}
export interface modulelists{
  id:string;
  client_code:string;
  module_name:string;
  description:string
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
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss'],
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
export class PipelineComponent implements OnInit {
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
  idarr:any=[]
  datatype:any=[{"id":1,"name":"Old"},{"id":2,"name":"New"}]
  startdate:boolean=false
  enddate:boolean=false
  query:boolean=false
  app_id:boolean=false
  client:boolean=false
  module_id:boolean=false
  priority:boolean=false
  statuss:boolean=false
  statuses:boolean=false
  statusss:boolean=false
  statuspipe:boolean=false
  story_taskView:boolean
  story_Task_ID:number
  developerid : boolean=false
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
  // story_taskView: boolean;
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
  sprintSummaryFormss: FormGroup;
  taskSummaryForm: FormGroup;
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
  has_previousStoryTask :boolean=true;
  has_nextStoryTask :boolean= true;
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
  pipelineSubmitform: FormGroup;
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
  @ViewChild('clientInput') clientInput: any;
  @ViewChild('teamInput') teamInput: any;
  @ViewChild('teamlead') teamlead: any;
  @ViewChild('moduleInput') moduleInput: any;
  @ViewChild('developerinput') developerinput: any;
  @ViewChild('clientrole') matappAutocomplete: MatAutocomplete;
  @ViewChild('teamsrole') matappAutoteamcomplete: MatAutocomplete;
  @ViewChild('modulerole') matmoduleAutocomplete: MatAutocomplete;
  @ViewChild('developerrole') matdevelopAutocomplete: MatAutocomplete;
  @ViewChild('collabrrole') matcollabAutocomplete: MatAutocomplete;
  @ViewChild('teamrole') matteamleadsAutocomplete: MatAutocomplete;
  @ViewChild('clientteamrole') matclienttAutocomplete: MatAutocomplete;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  empLists: any;
  isShowPipelines: boolean = true;
  dataPagination: any;
  pageNumbers: any = 1;
  pageSize: any = 10;
  dataPaginationSpr: any;
  pageNumb: any = 1;
  pageNumbt: any = 1;
  dataPaginationt: any;
  storysId: any;
  selectedItem: any;
  statusdrops:any
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
pipes: any;
  develop: any;
appdrop: any;
clientdrop: any;
moduledrop: any;
teams: any;
statuseslist: any;
  taskview: boolean = false;
  oldfield: boolean;
  newfield: boolean;
  getcollabdropdown: any=[];
  constructor( private fb: FormBuilder, private router: Router, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService,
    private TaskManagerService: TaskManagerService, private datepipe: DatePipe, private taskreportservice: TaskService,
    private notification: NotificationService, private datePipe: DatePipe, private shareservice: SharedService,
    private dialog: MatDialog, private taskmanagerservice: TaskManagerService, private localservice : ShareddataService
) { }

  ngOnInit(): void {

    this.pipelineSubmitform=this.fb.group({
      name:'',
      datatype:'',
      collab_id:"",
    })
    this.pipelineSummaryForm = this.fb.group({
      srint: '',
      team: '',
      type: '',
      statuspipe:'',
      dynamicdropdown:'',
      pipeline_status:'',
      start_date:'',
      end_date:'',
      app_id:'',
      client:'',
      module_id:'',
      developerid:'',
      teamlead:'',
      statuses:'',
      query:'',
      developer_id:'',
      team_lead:'',
      status:'',
      dropfilter:''






    })

    this.getdesignationStatuss(1);
    this.getDropDown();
  }
  getdesignationStatuss(page)
{
  this.TaskManagerService.getdesignationStatus(page)
  .subscribe(result => {
    // this.SpinnerService.hide();
    console.log("sprint summary", result)
    this.assigns = result
    
    let last_element =this.assigns[this.assigns.length - 1]
    this.pipelineSummaryForm.get("dropfilter").patchValue(last_element.id)
    this.pipesSearch('');

  })
}
  public displayFnclient(clt?: popupClient): string | undefined {
    // console.log(`Client testing data - ${clt.name}`);
    return clt ? clt.name : undefined;
  }
  public displayccclient(clt?: Client): string | undefined {
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
  public displayclientteam(clientteamrole?: clientlists): string | undefined {
    return clientteamrole ? clientteamrole.client_name : undefined;
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
  public displayappclient(clientrole?: clientlists): string | undefined {
    return clientrole ? clientrole.client_name : undefined;
  }
  public displayteamopclient(teamsrole?: clientlists): string | undefined {
    return teamsrole ? teamsrole.client_name : undefined;
  }
  public displayclient(modulerole?: modulelists): string | undefined {
    return modulerole ? modulerole.module_name : undefined;
  }
  public displaydeveloperclient(developerrole?: modulelists): string | undefined {
    return developerrole ? developerrole.module_name : undefined;
  }
  public displaycollabclient(collabrrole?: modulelists): string | undefined {
    return collabrrole ? collabrrole.description : undefined;
  }
  public displayteamclient(teamrole?: modulelists): string | undefined {
    return teamrole ? teamrole.module_name : undefined;
  }

  pipelineSummary(obj,page) {
    this.SpinnerService.show();
    
    // let action  = this.pipelineSummaryForm.get('status').value;
    // let action = {}
    this.TaskManagerService.getPipelineSummary(page,obj)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("story task summary", result)
        this.pipeList = result['data']
        let dataPagination = result['pagination'];
        // this.pipelinePopups()
        this.pipelinePopup = false
        if (this.pipeList.length > 0) {
          for(let list of this.pipeList){
            list["ischecked"]=false
            for(let array of this.idArray){
              if(list.id==array){
                list["ischecked"]=true
              }

            }
            
          }
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
  statusdrop() {
    this.TaskManagerService.gesta('').subscribe(res=>{
      this.statusdrops= res
    })
  }

  resetsprinitform(){
    // this.sprintSummaryForm.reset()
    // this.taskSummaryForm.reset()
    // this.storySummaryForm.reset()
    // this.backlogSummaryForm.reset()
    // this.IssueSummaryForm.reset()
    this.pipelineSummaryForm.reset()
    this.startdate=false
    this.enddate=false
    this.query=false
    // this.status=false
    this.statuss=false
    this.statusss=false
    this.priority=false
    this.team_lead=false
    this.developerid=false
    this.client=false
    this.app_id=false
    this.module_id=false
    this.statuspipe=false
    this.pipeline_status=false
    this.inpstartdatesprint=""
    this.inpenddatesprint=""
    this.pipesSearch('');
    

  }

  updatePaginationPipe() {
    // let obj = {
    //   "start_date": '',
    //   "end_date": '',
    //   "query": '',
    //   "status": '',
    // }
    if (this.pageNumbers >= 1) {
      this.pageNumbers = Math.max(this.pageNumbers, 1);
    this.pipesSearch('next')
    }
  }
  previousPage() {
    // if (this.has_previousStoryTask) {
    //   this.pageNumbers = this.pageNumbers - 1;
    // this.updatePaginationPipe();
    // }
    this.pipesSearch('previous')
  }
  nextPage() {
    // if (this.has_nextStoryTask) {
    //   this.pageNumbers = this.pageNumbers + 1;
    // this.updatePaginationPipe();
    
    // }
    this.pipesSearch('next')

  }
  isNextPageAllowed(): boolean {
    return this.pageNumbers > 10; 
  }

  // onSelectChange(event: any):void
  // {
  //   this.pipelineSummary(obj,1);
  // }



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

  pipelinePopups(){
    this.pipelinePopup = !this.pipelinePopup;
    console.log("this.pipelinePopup",this.pipelinePopup)
    this.pipelinefilter=[{"name":"Start Date","id":1},{"name":"End Date","id":2},{"name":"Pipeline Status","id":3},{"name":"App id","id":4},{"name":"Client ","id":5},{"name":"Module id  ","id":6},{"name":"Developer id ","id":7},{"name":"Team lead ","id":8}]
  
  }

  pipesSearch(hint:any) {
    
    console.log("inpstartdatesprint",this.inpstartdatesprint)
    console.log("inpenddatesprint",this.inpenddatesprint)
    let search = this.pipelineSummaryForm.value;
    search.start_date = this.datepipe.transform(search.start_date, 'yyyy-MM-dd');
    search.end_date = this.datepipe.transform(search.end_date, 'yyyy-MM-dd');
    let obj = {
      "from_date": search?.start_date,
      "to_date": search?.end_date,
      "query": search?.query,
      //  "status": search?.status?.id,
      "team": search?.team?.id,
      "app_id": search?.app_id?.id,
      "client": search?.client?.id,
      "module_id": search?.module_id?.id,
      "employee_id": search?.developer_id?.id,
      "team_lead": search?.team_lead?.id,
       "statuses": search?.statuses?.id,
     "pipeline_status":search?.status,
     



    }
    console.log("obj api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }
    // this.SpinnerService.show();

    if (hint == 'next') {
      this.sprintpresentpage=this.sprintpresentpage + 1
      this.pipelineSummary(obj, this.sprintpresentpage)
    }
    else if (hint == 'previous') {
      this.sprintpresentpage=this.sprintpresentpage - 1
      this.pipelineSummary(obj, this.sprintpresentpage)
    }
    else {
      this.sprintpresentpage=1
      this.pipelineSummary(obj, this.sprintpresentpage)
    }
    // this.SpinnerService.hide();
  }
  appClick() {
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.pipelineSummaryForm.get('app_id').valueChanges
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
moduleClick() {
  let devkeyvalue: String = "";
  // this.getsprint(devkeyvalue);
  // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
  this.pipelineSummaryForm.get('module_id').valueChanges
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
this.pipelineSummaryForm.get('developer_id').valueChanges
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
collabClick(){
  let devkeyvalue: String = "";
  // this.getsprint(devkeyvalue);
  // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
  this.pipelineSubmitform.get('collab_id').valueChanges
  .pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;
      console.log('inside tap')

    }),
    switchMap(value => this.TaskManagerService.getreleaseSummary(1 ,"&query="+value)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
    )
  )
  .subscribe((results: any[]) => {
    let datas = results["data"];
    this.getcollabdropdown = datas;




  })
  }
teamleadclick(){
let devkeyvalue: String = "";
// this.getsprint(devkeyvalue);
// (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
this.pipelineSummaryForm.get('team_lead').valueChanges
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
// statusclick(){
// let devkeyvalue: String = "";
// // this.getsprint(devkeyvalue);
// // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
// this.taskSummaryForm.get('team').valueChanges
//   .pipe(
//     debounceTime(100),
//     distinctUntilChanged(),
//     tap(() => {
//       this.isLoading = true;
//       console.log('inside tap')

//     }),
//     switchMap(value => this.TaskManagerService.gesta(value)
//       .pipe(
//         finalize(() => {
//           this.isLoading = false
//         }),
//       )
//     )
//   )
//   .subscribe((results: any[]) => {
//     let datas = results["data"];
//     this.statusdrops = datas;




//   })

// }
// statusclick(){
//   let devkeyvalue: String = "";
//   // this.getsprint(devkeyvalue);
//   // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
//   this.pipelineSummaryForm.get('status').valueChanges
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
//       let datas = results;
//       this.statusdrops = datas;




//     })

// }
clientclick() {
  let devkeyvalue: String = "";
  // this.getsprint(devkeyvalue);
  // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
  this.pipelineSummaryForm.get('client').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.TaskManagerService.getClient(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.clientdrop = datas;




    })




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

pipelinefunction(){
  let date=this.pipelineSummaryForm.value.dynamicdropdown
  if(date==1){
    this.startdate=true
    this.enddate=false
    this.pipeline_status =false
    this.app_id =false
    this.client =false
    this.module_id  =false
    this.developerid   =false
    this.team_lead   =false
    this.query = false
    this.statuses = false
  }
  else if(date==2){
    this.startdate=false
    this.enddate=true
    this.pipeline_status =false
    this.app_id =false
    this.client =false
    this.module_id  =false
    this.developerid   =false
    this.team_lead   =false
    this.query = false
    this.statuses = false
  }
  else if(date==3){
    this.startdate=false
    this.enddate=false
    this.pipeline_status =true
    this.app_id =false
    this.client =false
    this.module_id  =false
    this.developerid   =false
    this.team_lead   =false
    this.query = false
    this.statuses = false
  }
  else if(date==4){
    this.startdate=false
    this.enddate=false
    this.pipeline_status =false
    this.app_id =true
    this.client =false
    this.module_id  =false
    this.developerid   =false
    this.team_lead   =false
    this.query = false
    this.statuses = false
  }
  else if(date==5){
    this.startdate=false
    this.enddate=false
    this.pipeline_status =false
    this.app_id =false
    this.client =true
    this.module_id  =false
    this.developerid   =false
    this.team_lead   =false
    this.query = false
    this.statuses = false
  }
  else if(date==6){
    this.startdate=false
    this.enddate=false
    this.pipeline_status =false
    this.app_id =false
    this.client =false
    this.module_id  =true
    this.developerid   =false
    this.team_lead   =false
    this.query = false
    this.statuses = false
  }
  else if(date==7){
    this.startdate=false
    this.enddate=false
    this.pipeline_status =false
    this.app_id =false
    this.client =false
    this.module_id  =false
    this.developerid   =true
    this.team_lead   =false
    this.query = false
    this.statuses = false
  }
  else if(date==8){
    this.startdate=false
    this.enddate=false
    this.pipeline_status =false
    this.app_id =false
    this.client =false
    this.module_id  =false
    this.developerid   =false
    this.team_lead   =true
    this.query = false
    this.statuses = false
  }
  else if(date==9){
    this.startdate=false
    this.enddate=false
    this.pipeline_status =false
    this.app_id =false
    this.client =false
    this.module_id  =false
    this.developerid   =false
    this.team_lead   =false
    this.query = true
    this.statuses = false
  }
  else if(date==9){
    this.startdate=false
    this.enddate=false
    this.pipeline_status =false
    this.app_id =false
    this.client =false
    this.module_id  =false
    this.developerid   =false
    this.team_lead   =false
    this.query = false
    this.statuses = true
  }
this.inpstartdatesprint="Start date :"+this.taskSummaryForm.value.start_date
this.inpenddatesprint="End date :"+this.taskSummaryForm.value.end_date
console.log("inpstartdatesprint",this.inpstartdatesprint)
console.log("inpenddatesprint",this.inpenddatesprint)
}

getDropDown() {
  this.taskmanagerservice.getStatus().subscribe(res=>{
    this.droplist = res
  })
}

backtopieline()
{
  
}
getPipelinedrop() {
  this.TaskManagerService.getpipe().subscribe(res=>{
    this.pipes= res
  })
}
getDeveloperdrop() {
  this.TaskManagerService.getdeveloper('').subscribe(res=>{
    this.develop = res['data']
  })
}
getcollabdrop() {
  this.TaskManagerService.getreleaseSummary(1,'').subscribe(res=>{
    this.getcollabdropdown = res['data']
  })
}
getAppdrop() {
  this.TaskManagerService.getApp('').subscribe(res=>{
    this.appdrop = res['data']
  })
}
getModuledrop() {
  this.TaskManagerService.getmodule('').subscribe(res=>{
    this.moduledrop = res['data']
  })
}
getpipestatus() {
  this.TaskManagerService.statusget().subscribe(res=>{
    this.statuseslist= res
  })
}
getTeamleaddrop() {
  this.TaskManagerService.getteams('').subscribe(res=>{
    this.teams= res['data']
  })
}
getClientdrop() {
  this.TaskManagerService.getClient('').subscribe(res=>{
    this.clientdrop = res['data']
  })
}
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
    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    )
}
story_TaskView(story_taskID) {
  this.localservice.taskid.next(story_taskID);
  this.isShowPipelines = false;
  this.taskview = true;
}
backtoTaskSummary()
{
  this.isShowPipelines = true;
  this.taskview = false;
}
resetpipes()
{
  this.pipelineSummaryForm.reset();
  this.pipesSearch('')
}
check(e,data){
  if(data.ischecked){
    this.idArray.push(data.id)

  }
  else{
    this.idArray = this.idArray.filter(item => item !== data.id);

  }

}
popclose(){
  this.closebutton.nativeElement.click();

}
SubmitTask(){
  let datatype=this.pipelineSubmitform.get('datatype').value
  if(datatype==2){
    let data={
      "task_arr":this.idArray,
      "description":this.pipelineSubmitform.get('name').value
    }
    this.SpinnerService.show()
    this.TaskManagerService.releasecreate(data)
    .subscribe(result => {
      if(result.status){
        this.notification.showSuccess(result.message)
        this.idArray=[]
        this.pipelineSubmitform.reset()
        this.pipesSearch('');
        this.closebutton.nativeElement.click();
        this.SpinnerService.hide()
        this.newfield=false
        this.oldfield=false
  
      }
      else{
        this.notification.showError(result.description)
        this.closebutton.nativeElement.click();
        this.SpinnerService.hide()
  
      }
    })
  }
  else if(datatype==1){
    let collab_id=this.pipelineSubmitform.get('collab_id').value?.id
    let data={
      "task_arr":this.idArray,
      "action":""
    }
    this.SpinnerService.show()
    this.TaskManagerService.removerelease(data,collab_id)
    .subscribe(result => {
      if(result.status){
        this.notification.showSuccess(result.message)
        this.idArray=[]
        this.pipelineSubmitform.reset()
        this.pipesSearch('');
        this.closebutton.nativeElement.click();
        this.SpinnerService.hide()
        this.newfield=false
        this.oldfield=false
      }
      else{
        this.notification.showError(result.description)
        this.closebutton.nativeElement.click();
        this.SpinnerService.hide()
  
      }
    })
  }
 
}
invtype(type){
  if(type.id==1){
    this.oldfield=true
    this.newfield=false

  }
else if(type.id==2){
  this.oldfield=false
  this.newfield=true
}
}
}
