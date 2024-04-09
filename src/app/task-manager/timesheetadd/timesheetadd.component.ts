import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  ElementRef,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  FormGroupDirective,
  FormArrayName,
} from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
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
import { NgxSpinnerService } from "ngx-spinner";
import { fromEvent } from "rxjs";
import * as imp from "../../AppAutoEngine/import-services/CommonimportFiles";
import { NotificationService } from "src/app/service/notification.service";
import * as _moment from "moment";
import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { formatDate, DatePipe } from "@angular/common";
import { TaskManagerService } from "src/app/task-manager/task-manager.service";
import { ToastrService } from "ngx-toastr";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import { MatDatepicker } from "@angular/material/datepicker";
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
import { CustomPopviewComponent } from "src/app/custom-popview/custom-popview.component";
// Timesheet
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatCheckboxChange } from "@angular/material/checkbox";



// interface module
export interface popupClient {
  id: string;
  name: string;
}

export interface popuplogTypeRef {
  id: string;
  name: string;
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

export interface Client {
  id: string;
  name: string;
}

export interface ModeuleName {
  id: string;
  name: string;
}

export interface DialogData {
  id: number;
  description: null;
  time: number;
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
  selector: "app-timesheetadd",
  templateUrl: "./timesheetadd.component.html",
  styleUrls: ["./timesheetadd.component.scss"],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
    imp.HrmsAPI,
  ],
})

export class TimesheetaddComponent implements OnInit {
  // template add timesheet
  isShowAddTemplate: boolean;
  selectLogTypeValue: any;
  // Bootstrap Popup
  popupAddForm: FormGroup;
  popupClientList: Array<popupClient>;
  popupAppList: Array<popupApplication>;
  othersPopMenuNgif: boolean = false;
  activityPopMenuNgif: boolean = false;
  logTypeArr: any;
  logActionApplicationArr: any;
  activityArr: Array<Activityid>;
  popupForm: FormGroup;
  popupIsLoading = false;

  // timesheet array
  items: any[] = [];
  dateForm: FormGroup;
  timeSheet: FormGroup;
  temptimesheet: FormGroup;
  popupAddTemplateForm: FormGroup;

  formattedDate: any;
  popupFormattedDate: any;

  selectedDate: Date;

  client_Id = 0;
  module_Id = 0;
  project_Id = 0;

  sizetimesheet = 10;
  snotimesheet: number = 1;
  timsheetForm: FormGroup;

  @ViewChild("closeaddpopup") closeaddpopup;
  @ViewChild("closeaddtemppopup") closeaddtemppopup;
  @ViewChild("appnm") matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("appnmInput") appnmInput: any;
  @ViewChild("clt") matclientAutocomplete: MatAutocomplete;
  @ViewChild("logTypeInput") logTypeInput: any;
  @ViewChild("cltInput") cltInput: any;
  @ViewChild("act") matActivityAutocomplete: MatAutocomplete;
  @ViewChild("activityInput") activityInput: any;
  @ViewChild("closebutton") closebutton : ElementRef;



  isShowtimesheet: boolean = true;

  timeSheetList: any;
  temptimesummlist: any;
  temptimesummlistTf: any;
  dateID: any;
  activityArr2: any;
  errorHandler: any;
  has_next: any;
  has_previous: any;
  currentpage: any;
  clientList: any;
  logTypeArrID: any;
  logTypeArrIDTwo: any;
  form: any;
  defaulttemplate: any;
  globaltype: any;
  today: any;
  refIdvalue: any;
  tempRefidvalue: any;
  logtypeid: any;
  logdate: any;
  timeSheetDate: string;
  updateVal: any;
  ActivityDropDownData: any=[];
  SavedTemplates=new FormControl('')
  ClientProjectngif: boolean=false
  dataLength: any;
  set_StartDate: Date;


  constructor(
    private SpinnerService: NgxSpinnerService,
    private notify: imp.ToastrService,
    private popupFormBuilder: FormBuilder,
    private poptempFormBuilder: FormBuilder,
    private fb: FormBuilder,
    private dateFormBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private TaskManagerService: TaskManagerService,
    public customdialog: MatDialog, private datePipe: DatePipe,
    private notification: NotificationService,
  ) { }

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

  openAddPopup() { }

  ngOnInit(): void {

    // Bootstrap Popup
    this.popupAddForm = this.popupFormBuilder.group({
      log_date: ["", Validators.required],
      duration: ["", Validators.required],
      ref_id: [""],
      ref_type: ["", Validators.required],
      client: ["", Validators.required],
      app_id: [""],
      description: null,
      isdefault: false,
      Templates:['']

      // selectLogType: [],
      // project_map_id: ["", Validators.required],
      // data: new FormArray([]),
    });
    this.ActivityDropDown('')

    this.popupAddTemplateForm = this.poptempFormBuilder.group({
      client: ["", Validators.required],
      app_id: [""],
      ref_id: [""],
      is_default: [false],
      ref_type: [1],
    });

    this.popupAddForm.get("ref_type").valueChanges.subscribe((value) => {
      this.selectLogTypeValue = value;
    });

    this.popupAddTemplateForm.get("ref_type").valueChanges.subscribe((value) => {
      this.selectLogTypeValue = value;
    });

    this.popupLogType();

    this.timeSheet = new FormGroup({
      date: new FormControl(),
    });
    this.dateForm = this.dateFormBuilder.group({
      timesheetControl: [null],
    });
    this.today = new Date();
    this.dateForm.get('timesheetControl').setValue(this.today);
    this.timeSheetsummary(this.datePipe.transform(this.today, 'yyyy-MM-dd'));

    this.activity();
    this.timsheetForm = this.fb.group({
      description:[''],
      duration: ["", Validators.required],
      ref_type: [''],
      id:['']


    })
  }

  // onDurationChange() {
  //   console.log(this.form.get('duration').value);
  // }

  Ontemplatetimesheet() {
    this.isShowAddTemplate = true;
    this.isShowtimesheet = false;

    this.TaskManagerService.gettimetempSummary("").subscribe(
      (result) => {
        this.SpinnerService.hide();
        this.temptimesummlist = result["data"];
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  defaultapi(e: MatCheckboxChange) {
    if (e.checked) {
      this.SpinnerService.show()
      this.TaskManagerService.getdefaulttimetempSummary().subscribe(
        (result) => {

          this.defaulttemplate = result["data"];
          const objectLength = Object.keys(this.defaulttemplate).length;
          if (objectLength != 0) {
            this.popupAddForm.get('log_date').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))

            this.popupAddForm.get('ref_type').setValue(this.globaltype)
            this.logtypeid = this.globaltype.id
            this.othersPopMenuNgif = false;
            this.activityPopMenuNgif = true;
            this.popupAddForm.get('client').setValue(this.defaulttemplate.client)
            this.client_Id = this.defaulttemplate.client.id;
            this.popupAddForm.get('app_id').setValue(this.defaulttemplate.module)
            this.module_Id = this.defaulttemplate.module.id;

            this.popupAddForm.get('ref_id').setValue({ "id": this.defaulttemplate.activity_id, "activity": this.defaulttemplate.activity })
            this.project_Id = this.defaulttemplate.activity_id.id;
            this.SpinnerService.hide();
          }

        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      );
      this.SpinnerService.hide()

    }
    else {

      this.popupAddForm.reset()
      this.othersPopMenuNgif = false;
      this.activityPopMenuNgif = false;
      this.client_Id = 0
      this.module_Id = 0
      this.project_Id = 0
      this.SpinnerService.hide()

    }

  }
  Onreturnsummary() {
    // this.timeSheetsummary('')
    // console.log(this.Onreturnsummary)
    // this.isShowtimesheet = true;
    this.isShowAddTemplate = false;
    this.isShowtimesheet = true;
  }

  // Bootstrap Popup
  popupLogType() {
    this.TaskManagerService.getLogType().subscribe((results) => {
      this.SpinnerService.hide();
      this.logTypeArr = results;
      // this.logtypeid=this.logTypeArr.id
      for (let type of this.logTypeArr) {
        if (type.name == "Activity") {
          this.globaltype = type
        }
      }
    });
  }

  updateViewConditions(data) {
    // View Hide condition
    // this.client_Id = data.id;
    this.logtypeid = data.id
    if (data.name == "Others") {
      this.othersPopMenuNgif = true;
      this.activityPopMenuNgif = false;
      this.popupAddForm.get("description").patchValue("");
      this.popupAddForm.get("ref_id").patchValue("");
      this.popupAddForm.get("client").patchValue("");
      this.popupAddForm.get("app_id").patchValue("");
      this.client_Id = 0;
      this.module_Id = 0;
      this.project_Id = 0;
    } else if (data.name == "Activity") {
      this.othersPopMenuNgif = false;
      this.activityPopMenuNgif = true;
      this.popupAddForm.get("description").patchValue("");
      this.popupAddForm.get("ref_id").patchValue("");
      this.popupAddForm.get("client").patchValue("");
      this.popupAddForm.get("app_id").patchValue("");
      this.client_Id = 0;
      this.module_Id = 0;
      this.project_Id = 0;
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
  // private getLogType(cltkeyvalue) {
  //   this.TaskManagerService.getClientFilter(cltkeyvalue, 1).subscribe(
  //     (results: any[]) => {
  //       let datas = results["data"];
  //       this.popupClientList = datas;
  //     }
  //   );
  // }

  // Copy from task-create
  inputValue: any;
  onClientInputChange(event: any) {
    this.inputValue = event.target.value;
    console.log('Input Value:', this.inputValue);
    this.getclient(this.inputValue);

  }
  getclient(cltkeyvalue) {
    console.log("client input", this.inputValue)
    this.TaskManagerService.timesheetgetClientFilter(cltkeyvalue, 1).subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.popupClientList = datas;
        console.log("client data api", this.popupClientList)
      }
    );
  }

getApplication(appkeyvalue) {
    this.TaskManagerService.timesheetgetAppFilter(
      this.client_Id,
      appkeyvalue,
      1
    ).subscribe((results: any[]) => {
      let datas = results["data"];
      this.popupAppList = datas;
    });
  }
  getActivity(appkeyvalue) {
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
  client() {
    let cltkeyvalue: String = "";
    this.getclient(this.inputValue);

    this.popupAddForm
      .get("client")
      .value.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.popupIsLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>

          this.TaskManagerService.timesheetgetClientFilter(value, 1).pipe(
            finalize(() => {
              this.popupIsLoading = false;
              console.log("values input", value)
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.popupClientList = datas;
      });
  }


  autocompleteCltScroll() {
    setTimeout(() => {
      if (
        this.matclientAutocomplete &&
        this.autocompleteTrigger &&
        this.matclientAutocomplete.panel
      ) {
        fromEvent(this.matclientAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.matclientAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matclientAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matclientAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matclientAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.TaskManagerService.getcltFilter(
                  this.cltInput.nativeElement.value,
                  this.currentpage + 1
                ).subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.clientList = this.clientList.concat(datas);
                  if (this.clientList.length >= 0) {
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

  //  module 2nd dropdown in timesheet service method

  projectValue: any;
  onProjectInputChange(event: any) {
    this.projectValue = event.target.value;
    console.log('Project Value:', this.projectValue);
    this.getApplication(this.projectValue);

  }
  application() {
    let appkeyvalue: String = "";
    this.getApplication(this.projectValue);

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
          this.TaskManagerService.timesheetgetAppFilter(this.client_Id, value, 1).pipe(
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

  // Activity 3rd dropdown in timesheet method
  activity() {
    let appkeyvalue: String = "";
    this.getActivity(appkeyvalue);

    this.popupAddForm
      .get("ref_id")
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
  public displayFnLogType(logTypeRef?: popuplogTypeRef): string | undefined {
    // console.log(`Client testing data - ${clt.name}`);
    return logTypeRef ? logTypeRef.name : undefined;
  }

  // client displayFn
  public displayFnclient(clt?: popupClient): string | undefined {
    // console.log(`Client testing data - ${clt.name}`);
    return clt ? clt.name : undefined;
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
    // this.popupForm.patchValue({
    //   app_id:'',
    //   ref_id:''
    // })
    this.popupAddForm.get('app_id').reset();
    this.popupAddForm.get('ref_id').reset();
    this.popupAddForm.get('Templates').reset()
    this.SavedTemplates.reset()
  }

  // module_Id = 0;
  FocusOut_select_module(data) {
    this.module_Id = data.id;
    this.popupAddForm.get("ref_id").patchValue("");
  }

  // project_Id = 0;
  FocusOut_select_app(data) {
    this.project_Id = data.id;
    console.log("project- id", this.project_Id);
  }
  // onActivitySelected(selectedActivity: Activityid): void {
  //   this.popupAddForm.get("Act_id").setValue(selectedActivity.activity);
  // }

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
  timeSheetsummary(formattedDate: string) {
    this.timeSheetDate = formattedDate;
    this.TaskManagerService.gettimeSheetsummary(formattedDate).subscribe(
      (result) => {
        this.SpinnerService.hide();
        // console.log("TimeSheet task summary", result);
        this.timeSheetList = result["data"];
        this.dataLength = this.timeSheetList.length;
        // console.log(this.timeSheetList);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  otherDateChange(event: MatDatepickerInputEvent<Date>) {
    const popupSelectDate = event.value;
    if (popupSelectDate) {
      this.popupAddForm
        .get("log_date")
        .setValue(this.formatDate(popupSelectDate));
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // clearApp() {
  //   this.popupAddForm.controls["module_id"].reset("");
  // }

  SubmitTms() {
    this.refIdvalue = this.popupAddForm.get('ref_id').value.activity
    this.SpinnerService.show();

    if (this.popupAddForm.value.log_date === "" || this.popupAddForm.value.log_date === null || this.popupAddForm.value.log_date === undefined) {
      this.notify.error("Select Start Date");
      this.SpinnerService.hide();
      return false;
    }
    if (this.popupAddForm.value.duration === "" || this.popupAddForm.value.duration === null || this.popupAddForm.value.duration === undefined) {
      this.notify.error("Select Duration");
      this.SpinnerService.hide();
      return false;
    }
    if (this.popupAddForm.value.ref_type === "" || this.popupAddForm.value.ref_type === null || this.popupAddForm.value.ref_type === undefined) {
      this.notify.error("Select LogType");
      this.SpinnerService.hide();
      return false;
    }
    if (this.logtypeid === 2) {
      if (this.popupAddForm.value.description === "" || this.popupAddForm.value.description === null || this.popupAddForm.value.description === undefined) {
        this.notify.error('Enter Description');
        this.SpinnerService.hide();
        return false;
      }
    }
    if (this.logtypeid === 3) {
      if (this.popupAddForm.value.ref_id === "" || this.popupAddForm.value.ref_id === null || this.refIdvalue === undefined) {
        this.notify.error('choose Activity');
        this.SpinnerService.hide();
        return false;
      }
    }
    this.logdate = this.popupAddForm.get("log_date").value

    let formData = [
      {
        log_date: this.logdate,
        ref_id: this.popupAddForm.get("ref_id").value.id,
        ref_type: this.popupAddForm.get("ref_type").value.id,
        duration: this.popupAddForm.get("duration").value,
        description: this.popupAddForm.get("description").value || null,
      },
    ];
    this.TaskManagerService.tmsSubmitForm(formData).subscribe(
      (res) => {
        console.log("Task click", res);
        if (res.message === "Successfully Created") {
          this.notify.success("Created Successfully!...");
          this.closeaddpopup.nativeElement.click();
          this.OnSubmit.emit();
          this.SpinnerService.hide();
          this.notify.success;
          this.othersPopMenuNgif = false;
          this.activityPopMenuNgif = false;
          // this.popupAddForm.close();
          this.popupAddForm.reset();
          this.client_Id = 0;
          this.module_Id = 0;
          this.project_Id = 0;
          this.timeSheetsummary(this.datePipe.transform(this.logdate, 'yyyy-MM-dd'));
          this.dateForm.get('timesheetControl').setValue(this.logdate);
        } else {
          this.notify.error(res.description);
          this.SpinnerService.hide();
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }


  // temp timesheet post add
  temptimesubmit() {
    this.tempRefidvalue = this.popupAddTemplateForm.get('ref_id').value.activity
    if (this.popupAddTemplateForm.value.ref_id === "" || this.popupAddTemplateForm.value.ref_id === null || this.tempRefidvalue === undefined) {
      this.notify.error('choose Activity');
      this.SpinnerService.hide();
      return false;
    }
    let tempdata = {
      ref_id: this.popupAddTemplateForm.get("ref_id").value.id,
      ref_type: 1,
      is_default: this.popupAddTemplateForm.get("is_default").value,
    };

    console.log("tempdata", tempdata)
    this.TaskManagerService.temptimeadd(tempdata).subscribe((res) => {
      console.log("Task click", res);
      if (res.message === "Successfully Created") {
        this.notify.success("Created Successfully!...");
        this.closeaddtemppopup.nativeElement.click();
        this.OnSubmit.emit();
        this.SpinnerService.hide();
        this.notify.success;
        this.popupAddTemplateForm.reset();
        this.Ontemplatetimesheet();
        console.log(res.message)
        // this.cltInput.nativeElement.value='';
        // this.appnmInput.nativeElement.value='';
        // this.activityInput.nativeElement.value='';
      }
      else {
        this.notify.error(res.description)
        this.closeaddtemppopup.nativeElement.click();
        this.OnSubmit.emit();
        this.SpinnerService.hide();
        this.notify.success;
        this.popupAddTemplateForm.reset();
        this.Ontemplatetimesheet();
        console.log(res.message)
      }
    });
  }


  cancelForm() {
    // Reset the form to its initial state
    this.popupAddForm.reset({
      log_date: "",
      duration: "",
      ref_id: "",
      ref_type: "",
      client: "",
      app_id: "",
      description: null,
    });
    this.othersPopMenuNgif = false;
    this.activityPopMenuNgif = false;
  }


  cancelFormTwo() {
    // Reset the form to its initial state
    this.popupAddTemplateForm.reset({
      client: "",
      ref_id: "",
      ref_type: "",
    });
  }

  //  newchanges
  // applyFilter(){
  //   this.popupClientList.filter = this.clt.trim(). toLowerCase();;
  // }


  deletetemp(member) {
    let memberid = member.id
    if (confirm("Confirm?")) {
      this.SpinnerService.show();
      this.TaskManagerService.deleteteammembers(memberid)
        .subscribe(res => {

          if (res.code) {
            this.notification.showError(res.description)
          }
          else {

            this.notification.showSuccess(res.message)
            this.Ontemplatetimesheet()
          }
          this.SpinnerService.hide()

        }


        )
    }



  }
  setdefault(temtimesum) {
    let temid = temtimesum.id
    this.SpinnerService.show();
    this.TaskManagerService.setusdefault(temid)
      .subscribe(res => {
        if (res.code) {
          this.notification.showError(res.description)
        }
        else {
          this.notification.showSuccess(res.message)
          this.Ontemplatetimesheet()
        }
        this.SpinnerService.hide();

      })

  }
  editTemplate(data) {
    console.log("Template description", data)
    this.timsheetForm.patchValue({
      description: data?.name,
      duration: data?.duration,
      ref_type: data?.ref_type,
      id: data?.id
    })
  }

  deleteTemplate(data) {
    this.TaskManagerService.deleteTimesheet(data.id).subscribe(res => {


      this.notification.showSuccess(res.message);
      this.timeSheetsummary(this.timeSheetDate);

    })
  }
  popclose()
  {

  }

  updateTemplate()
  {
    this.updateVal = this.timsheetForm.value
    if (this.timsheetForm.value.description=== "" || this.timsheetForm.value.description === null || this.timsheetForm.value.description === undefined) {
      this.notification.showError('Enter Task Description');
      this.SpinnerService.hide();
      return false;
    }
    if (this.timsheetForm.value.duration === "" || this.timsheetForm.value.duration === null || this.timsheetForm.value.duration === undefined) {
      this.notification.showError('Enter Time Duration');
      this.SpinnerService.hide();
      return false;
    }
    // if (this.timsheetForm.value.ref_type=== "" || this.timsheetForm.value.ref_type === null || this.timsheetForm.value.ref_type === undefined) {
    //   this.notification.showError('choose Log Type');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    let payload = [this.timsheetForm.value]
    this.SpinnerService.show();
    this.TaskManagerService.updateTimssheets(payload).subscribe((res) => {
      // this.notification.showSuccess(res.message)
      if (res.message == 'Successfully Updated') {
        this.notification.showSuccess("Updated Successfully!...");
        this.closebutton.nativeElement.click();
        this.timeSheetsummary(this.timeSheetDate)
        this.SpinnerService.hide();
      } else {
        this.notification.showError(res.code);
        this.SpinnerService.hide();
        return false;
      }
      this.SpinnerService.hide();
    });
    this.SpinnerService.hide();
  }
  ActivityDropDown(value){
    this.popupIsLoading=true
    this.TaskManagerService.gettimetempSummaryDropdown(value).subscribe(data=>{
      this.ActivityDropDownData=data['data']
      this.popupIsLoading=false
    })
  }
  ActivityClickdata(data){
    this.ClientProjectngif=true
    console.log('data',data)
    this.popupAddForm.patchValue({
      client:data.client,
      app_id:data.module,
      ref_id:data.activity_info
    })
    this.client_Id=data.client.id
    this.module_Id=data.module.id
  }


  StartDate() {
    const currentDate = new Date();
    return this.set_StartDate.toISOString().split('T')[0];
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    return this.datePipe.transform(currentDate, 'yyyy-MM-dd')!;
  }
  



}
