import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TaskManagerSummaryComponent } from "../task-manager/task-manager-summary/task-manager-summary.component";
import { TaskManagerService } from "../task-manager/task-manager.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from "../service/error-handling-service.service";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  finalize,
} from "rxjs/operators";

export interface Client {
  id: string;
  name: string;
}

export interface Application {
  id: string;
  name: string;
}

@Component({
  selector: "app-custom-popview",
  templateUrl: "./custom-popview.component.html",
  styleUrls: ["./custom-popview.component.scss"],
})
export class CustomPopviewComponent implements OnInit {
  // Copy
  taskAddForm: FormGroup;
  clientForm: FormGroup;
  clientList: Array<Client>;
  appNameList: Array<Application>;

  // Old
  timeSheetList: any;
  othersPopMenuNgif = false;
  activityPopMenuNgif = false;
  logTypeArr: any;
  logTypeArrTwo: any;
  logActionClientArr: any;
  logActionApplicationArr: any;
  clienttoapplication: any;

  popupForm: FormGroup;
  isLoading = false;

  // chipclient
  chipselectclient : Client[]=[];

  constructor(
    public dialogRef: MatDialogRef<TaskManagerSummaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private TaskManagerService: TaskManagerService,
    private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingServiceService,
    private formBuilder: FormBuilder
  ) {
    this.data = { Description: "", Time: "", Type: "" };
  }

  onAddClick(): void {
    this.dialogRef.close(this.data);
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.popupForm = this.formBuilder.group({
      selectLogType: [],
      ActivityClient: [],
      ActivityApplication: [],
      ClienttoApplication: [],
    });

    // Copy
    this.taskAddForm = this.formBuilder.group({
      // old
      selectLogType: [],
      ActivityClient: [],
      ActivityApplication: [],
      ClienttoApplication: [],
      // new
      app_id: ["", Validators.required],
      client: ["", Validators.required],
      project_map_id: ["", Validators.required],
      data: new FormArray([]),
    });
    // client form
    this.clientForm = this.formBuilder.group({
      name: [""],
    });
    this.logTypeMethod();
  }

  logTypeMethod() {
    this.TaskManagerService.getLogType().subscribe((results) => {
      this.SpinnerService.hide();
      this.logTypeArr = results;
    });
  }

  // log type dropdown others & Activity
  dpclick() {
    const selectLogTypeValue = this.taskAddForm.get("selectLogType").value;
    if (selectLogTypeValue == "Others") {
      this.othersPopMenuNgif = true;
      this.activityPopMenuNgif = false;
    } else if (selectLogTypeValue == "Activity") {
      this.othersPopMenuNgif = false;
      this.activityPopMenuNgif = true;
      // const selectedLogType = this.logTypeArr.find(
      //   (logType) => logType.name === "Activity"
      // );

      // if (selectedLogType) {
      //   this.TaskManagerService.getLogType2(selectedLogType.id).subscribe(
      //     (results) => {
      //       this.SpinnerService.hide();
      //       this.logTypeArrTwo = results;
      //     }
      //   );
      // } else {
      //   console.error("Log type 'Activity' not found in logTypeArr");
      // }
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
  private getclient(cltkeyvalue) {
    this.TaskManagerService.getClientFilter(cltkeyvalue, 1).subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.clientList = datas;
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
      this.appNameList = datas;
    });
  }

  // client
  client() {
    let cltkeyvalue: String = "";
    this.getclient(cltkeyvalue);

    this.taskAddForm
      .get("client")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.TaskManagerService.getClientFilter(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.clientList = datas;
      });
  }

  // Application
  application() {
    let appkeyvalue: String = "";
    this.getApplication(appkeyvalue);

    this.taskAddForm
      .get("app_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.TaskManagerService.getAppFilter(this.client_Id, value, 1).pipe(
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

  public displayFnclient(clt?: Client): string | undefined {
    return clt ? clt.name : undefined;
  }

  public displayFnApp(appnm?: Application): string | undefined {
    return appnm ? appnm.name : undefined;
  }

  clearClient() {
    this.taskAddForm.controls["app_id"].reset("");
    this.taskAddForm.controls["module_id"].reset("");
  }

  client_Id = 0;
  FocusOut_select_client(data) {
    this.client_Id = data.id;
    console.log("client- id", this.client_Id);
  }

  project_Id = 0;
  FocusOut_select_app(data) {
    this.project_Id = data.id;
    console.log("project- id", this.project_Id);
  }

  clearApp() {
    this.taskAddForm.controls["module_id"].reset("");
  }
}