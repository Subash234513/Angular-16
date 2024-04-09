import { Component, OnInit,ViewChild,Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from, fromEvent } from 'rxjs';
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent,MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { NotificationService } from '../notification.service';
import { TaskService } from '../task.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ShareService } from '../share.service';




export interface emplistss {
  id: string;
  name: any;
  full_name: any
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
export interface unitHead {
  id: string;
  name: string;
}
export interface teamLead {
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
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class TaskViewComponent implements OnInit {
  taskViewForm:FormGroup;
  taskupdateForm:FormGroup;
  gettask:any;
  task_Id:number;
  devtypelist:any;
  hasnextdevname = true;
  haspreviousdevname = true;
  currentpagedevname: number = 1;
  update_actualdate:FormGroup;
  status_List:any;


  
  empList: emplistss[];
  public chipSelectedemp: emplistss[] = [];
  public chipSelectedempid = [];
  employee_arr = new FormControl();
  plannedSD:any;
  plannedED:any;
  planned_count:any;


  appNameList: Array<appName>;
  clientList: Array<Client>;
  moduleNameList: Array<ModeuleName>;
  unitheadList: Array<unitHead>;
  teamldList: Array<teamLead>;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  isShowUpdateForm = false;
  isShowTaskView = true;
  tomorrow_ASD = new Date();
  tomorrow_AED = new Date();

  @ViewChild('appnm') matAutocomplete: MatAutocomplete;
  @ViewChild('appnmInput') appnmInput: any;

  @ViewChild('clt') matclientAutocomplete: MatAutocomplete;
  @ViewChild('cltInput') cltInput: any;
  
  @ViewChild('modnm') matmodulenameAutocomplete: MatAutocomplete;
  @ViewChild('modnmInput') modnmInput: any;
  
  @ViewChild('unitHD') matunitheadAutocomplete: MatAutocomplete;
  @ViewChild('unitHDInput') unitHDInput: any;
  
  @ViewChild('teamld') matteamleadAutocomplete: MatAutocomplete;
  @ViewChild('teamldInput') teamldInput: any;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
    // developer name 
    @ViewChild('emp') matempAutocomplete: MatAutocomplete;
    @ViewChild('empInput') empInput: any;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  constructor(private formBuilder: FormBuilder,
    private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private notification: NotificationService, private toastr: ToastrService, private datePipe: DatePipe,
    private router: Router,private taskservice:TaskService, private taskShare: ShareService) { }

    set_Threedays_ago:any
  ngOnInit(): void {
    let d = new Date();
    console.log('Today is: ' + d);
    d.setDate(d.getDate() - 3);
    console.log('3 days ago was: ' + d);
    this.set_Threedays_ago = d;

  this.gettask = this.taskShare.gettaskview.value;
    console.log("get task",this.gettask)
    this.task_Id = this.gettask.id;
    this.taskViewForm = this.formBuilder.group({
      app_id: [''],
      client: [''],
      type: [''],
      module_id : [''],
      unit_head: [''],
      team_lead: [''],
      task: [''],
      start_date: [''],
      end_date: [''],
    })

    this.update_actualdate = this.formBuilder.group({
      actual_start_date: [''],
      actual_end_date: [''],
      delay_days: [''],
      reason_for_delay : [''],
      
    })

// update task form
    this.taskupdateForm = this.formBuilder.group({
      app_id: [''],
      client: [''],
      type: [''],
      module_id : [''],
      unit_head: [''],
      team_lead: [''],
      task: [''],
      start_date: [''],
      end_date: [''],
    })

    this.getTaskView();
    this.getdevtype();
    
  }


  getstatus_Update(type_Id) {
    console.log("tyoe-id",type_Id)
    this.taskservice.getstatus_Update(type_Id)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.status_List = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

// dev type
  getdevtype() {
    this.taskservice.getdevtype()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.devtypelist = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }




  developer_List = [];
  getTaskview:any;
  completed_actual_SD = false;
  completed_actual_ED = false;
  completed_delay_days = false;
  completed_reason_delay = false;
  isShowEmployee_hour = false;
  input_hrs = false;
  set_planed_StartDate:any;
  employee_Name:any;
  emphrslist:any;
  dateList:any;
  getTaskView() {
    this.taskservice.gettaskview(this.task_Id)
      .subscribe(result => {
          let data = result;
          console.log("task api", data)
          this.getTaskview = data;
          this.dateList = this.getTaskview.hour_arr
          console.log("date",this.dateList)
          this.emphrslist = this.getTaskview.employee_hours
          console.log("emphrslist",this.emphrslist)

          // yet to start
          if(data.task_status_id == 0){
            this.actualstratdate = false;
            this.actialenddate = false;
            this.delaydays = false;
            this.reasonfordelay = false;
            this.selectaction = true;
            this.isShowEmployee_hour = false;
            // this.updatebutton = true;
          }
          // wip
          if(data.task_status_id == 1){
            this.actualstratdate = true;
            this.actialenddate = false;
            this.delaydays = false;
            this.reasonfordelay = false;
            this.selectaction = true;
            this.updatebutton = true;
            this.isShowEmployee_hour = true;
            this.input_hrs = false;
            this.completed_actual_SD = true;
            const acu_startdate = this.datePipe.transform(data.actual_start_date, 'yyyy-MM-dd');
            this.update_actualdate.patchValue({
              "actual_start_date": acu_startdate,
            })
          }
          // completed
          if(data.task_status_id == 2){
            this.actualstratdate = true;
            this.actialenddate = true;
            if(data.delay_days > 0){
              this.delaydays = true;
              this.reasonfordelay = true;
            } else {
              this.delaydays = false;
              this.reasonfordelay = false;
            }
            this.selectaction = true;
            this.updatebutton = true;
            this.isShowEmployee_hour = true;
            this.input_hrs = false;
            const acu_startdate = this.datePipe.transform(data.actual_start_date, 'yyyy-MM-dd');
            const acu_enddate = this.datePipe.transform(data.actual_end_date, 'yyyy-MM-dd');
            this.update_actualdate.patchValue({
              "actual_start_date": acu_startdate,
              "actual_end_date": acu_enddate,
              "delay_days": data.delay_days,
              "reason_for_delay": data.reason_for_delay,
            })
            this.completed_actual_SD = false;
            this.completed_actual_ED = false;
            this.completed_delay_days = false;
            this.completed_reason_delay = false;
          }

          // hold
          if(data.task_status_id == 3){
            this.actualstratdate = false;
            this.actialenddate = false;
            this.delaydays = false;
            this.reasonfordelay = false;
            this.selectaction = true;
            // this.updatebutton = true;
            this.isShowEmployee_hour = false;
          }

          // draft
          if(data.task_status_id == 7){
            this.actualstratdate = false;
            this.actialenddate = false;
            this.delaydays = false;
            this.reasonfordelay = false;
            this.selectaction = false;
            this.isShowEmployee_hour = false;
          }

          // verified
          if(data.task_status_id == 5){
            this.actualstratdate = true;
            this.actialenddate = true;
            if(data.delay_days > 0){
              this.delaydays = true;
              this.reasonfordelay = true;
            } else {
              this.delaydays = false;
              this.reasonfordelay = false;
            }
            this.selectaction = false;
            this.updatebutton = false;
            this.isShowEmployee_hour = true;
            this.input_hrs = true;
            const acu_startdate = this.datePipe.transform(data.actual_start_date, 'yyyy-MM-dd');
            const acu_enddate = this.datePipe.transform(data.actual_end_date, 'yyyy-MM-dd');
            this.update_actualdate.patchValue({
              "actual_start_date": acu_startdate,
              "actual_end_date": acu_enddate,
              "delay_days": data.delay_days,
              "reason_for_delay": data.reason_for_delay,
            })
            this.completed_actual_SD = true;
            this.completed_actual_ED = true;
            this.completed_delay_days = true;
            this.completed_reason_delay = true;
          }

          this.chipSelectedemp = data.dev_arr;


          // set planned start date to actual start date 
          if(data.actual_start_date == ""){
          const Sdate = new Date(data.start_date)
          this.set_planed_StartDate = new Date(Sdate.getFullYear(), Sdate.getMonth(), Sdate.getDate())
          this.set_actual_StartDate = this.set_planed_StartDate;
          } else {
            const Adate = new Date(data.actual_start_date)
          this.set_planed_StartDate = new Date(Adate.getFullYear(), Adate.getMonth(), Adate.getDate())
          this.set_actual_StartDate = this.set_planed_StartDate;
          }
          

          // get panned startdate - planned end date ====>difference 
         const PSdate1 = new Date(data.start_date)
         this.plannedSD = PSdate1
         const PEdate = new Date(data.end_date)
         this.plannedED = PEdate
        //  this.planned_count = (this.plannedED.getDate() - this.plannedSD.getDate() + 1) +
        //  (12 * (this.plannedED.getFullYear() - this.plannedSD.getFullYear()))
	console.log(  "planned", PSdate1, PEdate);
      
	
	// To set two dates to two variables
	// var date1 = new Date("06/30/2019");
	// var date2 = new Date("07/30/2019");
	
	// To calculate the time difference of two dates
	var Difference_In_Time =  this.plannedED.getTime() - this.plannedSD.getTime();
	
	// To calculate the no. of days between two dates
	var planned_count_Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
	
	//To display the final no. of days (result)
	


         console.log("planned_count",planned_count_Difference_In_Days)
         this.planned_count = planned_count_Difference_In_Days.toFixed(0);;

          const startdate = this.datePipe.transform(data.start_date, 'yyyy-MM-dd');
          const date = new Date(startdate)
          this.set_StartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
          const enddate = this.datePipe.transform(data.end_date, 'yyyy-MM-dd');
      
          this.taskViewForm.patchValue({
            "app_id": data.app_id.name,
            "client": data.client_name.name,
            "type": data.dev_type.text,
            "module_id" : data.module_id.name,
            "unit_head": data.unit_head.name,
            "team_lead":data.team_lead.name,
            "task": data.task,
            "start_date": startdate,
            "end_date": enddate,
          })


          // task update form
          this.taskupdateForm.patchValue({
            "app_id": data.app_id,
            "client": data.client_name,
            "type": data.dev_type.id,
            "module_id" : data.module_id,
            "unit_head": data.unit_head,
            "team_lead":data.team_lead,
            "task": data.task,
            "start_date": startdate,
            "end_date": enddate,
          })

         

          this.getstatus_Update(data.task_status_id);
      })
  }


  getemp(keyvalue, type) {
    this.taskservice.employeesearch(keyvalue, 1, type)
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
    this.selectempByName(event.option.value.name);
    this.empInput.nativeElement.value = '';
    console.log('chipSelectedempid', this.chipSelectedempid)
  }
  private selectempByName(emp) {
    let foundemp1 = this.chipSelectedemp.filter(e => e.name == emp);
    if (foundemp1.length) {
      return;
    }
    let foundemp = this.empList.filter(e => e.name == emp);
    if (foundemp.length) {
      this.chipSelectedemp.push(foundemp[0]);
      this.chipSelectedempid.push(foundemp[0].id)
    }
  }


  autocompleteempScroll(type) {
    setTimeout(() => {
      if (
        this.matempAutocomplete &&
        this.autocompleteTrigger &&
        this.matempAutocomplete.panel
      ) {
        fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matempAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.hasnextdevname === true) {
                this.taskservice.employeesearch(this.empInput.nativeElement.value, this.currentpagedevname + 1, type)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.empList = this.empList.concat(datas);
                    if (this.empList.length >= 0) {
                      this.hasnextdevname = datapagination.has_next;
                      this.haspreviousdevname = datapagination.has_previous;
                      this.currentpagedevname = datapagination.index;
                    }
                  }, (error) => {

                  })
              }
            }
          });
      }
    });
  }

  update(){
    let search = this.update_actualdate.value;
    search.actual_start_date = this.datePipe.transform(search.actual_start_date, 'yyyy-MM-dd');
    search.actual_end_date = this.datePipe.transform(search.actual_end_date, 'yyyy-MM-dd');

    search.delay_days = Number(search?.delay_days)
    
    let obj = {
      "id":this.task_Id,
      "actual_start_date": search?.actual_start_date,
      "actual_end_date": search?.actual_end_date,
      "delay_days": search?.delay_days,
      "reason_for_delay": search?.reason_for_delay,
      "task_status": this.get_status_id,
      "emp_hr":this.emphrslist
    }

    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }

    if(this.get_status_text == "Work in Progress"){
      if (obj.actual_start_date === "") {
        this.toastr.error('Please Enter Actual Start date');
        this.SpinnerService.hide();
        return false;
      }

    }
   
    else if(this.get_status_text == "Completed"){
      if (obj.actual_end_date === "") {
        this.toastr.error('Please Enter Actual End date');
        this.SpinnerService.hide();
        return false;
      }
      if(this.update_actualdate.value.delay_days > 0){
        if (obj.reason_for_delay === "") {
          this.toastr.error('Please Enter Reason for Delay');
          this.SpinnerService.hide();
          return false;
        }
      }
    
    }
    
    console.log("bbbbb",this.emphrslist)
    console.log("obj",obj)
    this.taskservice.updateTaskForm(obj,this.task_Id)
    .subscribe(res => {
      console.log("task", res)
      if(res.message == 'Successfully Updated'){
        this.notification.showSuccess("Successfully Updated!...")
        this.SpinnerService.hide();
        this.getTaskView();
        
       } else {
        this.notification.showError(res.description)
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


  get_status_id:number;
  get_status_text:any;
  actualstratdate = true;
  actialenddate = true;
  delaydays = true;
  reasonfordelay = true;
  selectaction = false;
  updatebutton = false;
  gettingRecord(data){
    console.log("getting status record ",data)
    this.get_status_id = data.id;
    this.get_status_text = data.text;
    if(data.text == "Work in Progress"){
      this.actualstratdate = true;
      this.actialenddate = false;
      this.delaydays = false;
      this.reasonfordelay = false;
      this.updatebutton = true;

    }
    else if(data.text == "Hold"){
      this.actualstratdate = false;
      this.actialenddate = false;
      this.delaydays = false;
      this.reasonfordelay = false;
      this.updatebutton = true;
      
    }
    else if(data.text == "Completed"){
      this.actualstratdate = true;
      this.actialenddate = true;
      this.delaydays = false;
      this.reasonfordelay = false;
      this.updatebutton = true;
    }
    else if(data.text == "Verified"){
      this.updatebutton = true;
    }

  }

  set_actual_StartDate:any;
  select_actual_SD(event: string) {
    const date = new Date(event)
    this.set_actual_StartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }


  aa1:any;
  delay_count:any;
  actual_count:any;
  actualSD:any;
  select_actual_ED(event: string) {
    const date = new Date(event)
    this.aa1 = date

    // this.getTaskview.actual_start_date
    const date2 = new Date(this.getTaskview.actual_start_date)
    this.actualSD = date2

    var Difference_In_Time =  this.aa1.getTime() - this.actualSD.getTime();
	  var actualcount_Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    this.actual_count = actualcount_Difference_In_Days.toFixed(0);
    // this.actual_count = (this.aa1.getDate() - this.actualSD.getDate() + 1) +
    //   (12 * (this.aa1.getFullYear() - this.actualSD.getFullYear()))
      console.log("actual_count",this.actual_count)

    this.delay_count = (this.actual_count - this.planned_count )
    console.log("delay_count",this.delay_count)

    if(this.delay_count > 0){
      this.delaydays = true;
      this.reasonfordelay = true; 

    } else {
      this.delaydays = false;
      this.reasonfordelay = false; 
      this.update_actualdate.value.delay_days = 0;
    }
     
  }

  oncancel() {
    this.onCancel.emit()
  
  }


  
  filedownload(data) {
    console.log("fileName", data)
    this.SpinnerService.show();
    let fileName = data.name
    let id = data.id

    this.taskservice.fileDownloads(id)
      .subscribe((results) => {
        this.SpinnerService.hide();
        let filevalue = fileName.split('.')
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }






  // app name
  appName(){
    let appkeyvalue: String = "";
      this.getappName(appkeyvalue);
  
      this.taskupdateForm.get('app_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.taskservice.getappNameFilter(this.client_Id,value,1)
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
        this.taskservice.getappNameFilter(this.client_Id,appkeyvalue,1)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.appNameList = datas;
          })
      }

      public displayFnappnm(appnm?: appName): string | undefined {
        return appnm ? appnm.name : undefined;
      }
    
      get appnm() {
        return this.taskupdateForm.value.get('app_id');
      }


// client
      client(){
        let cltkeyvalue: String = "";
          this.getclt(cltkeyvalue);
      
          this.taskupdateForm.get('client').valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
                console.log('inside tap')
      
              }),
              switchMap(value => this.taskservice.getcltFilter(value,1)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.clientList = datas;
      
            })
      
      }
    
          private getclt(cltkeyvalue) {
            this.taskservice.getcltFilter(cltkeyvalue,1)
              .subscribe((results: any[]) => {
                let datas = results["data"];
                this.clientList = datas;
              })
          }
    
          public displayFnclt(clt?: Client): string | undefined {
            return clt ? clt.name : undefined;
          }
        
          get clt() {
            return this.taskupdateForm.value.get('client');
          }

// module name
moduleName(){
            let modkeyvalue: String = "";
              this.getModuleName(modkeyvalue);
          
              this.taskupdateForm.get('module_id').valueChanges
                .pipe(
                  debounceTime(100),
                  distinctUntilChanged(),
                  tap(() => {
                    this.isLoading = true;
                    console.log('inside tap')
          
                  }),
                  switchMap(value => this.taskservice.getmodulenameFilter(this.client_Id,this.project_Id,value,1)
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
                this.taskservice.getmodulenameFilter(this.client_Id,this.project_Id,modkeyvalue,1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    this.moduleNameList = datas;
                  })
              }
        
              public displayFnmodnm(mod?: ModeuleName): string | undefined {
                return mod ? mod.name : undefined;
              }
            
              get mod() {
                return this.taskupdateForm.value.get('module_id');
              }


// unit head
unitHead(){
  let unithdkeyvalue: String = "";
    this.getUnitHead(unithdkeyvalue);

    this.taskupdateForm.get('unit_head').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.taskservice.getUnitHeadFilter(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.unitheadList = datas;

      })

}

  private getUnitHead(unithdkeyvalue) {
      this.taskservice.getUnitHeadFilter(unithdkeyvalue,1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.unitheadList = datas;
        })
    }

    public displayFnunitHD(unithd?: unitHead): string | undefined {
      return unithd ? unithd.name : undefined;
    }
  
    get unithd() {
      return this.taskupdateForm.value.get('unit_head');
    }


// Team lead
TeamLead(){
  let teamldkeyvalue: String = "";
    this.getTeamLead(teamldkeyvalue);

    this.taskupdateForm.get('team_lead').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.taskservice.getTeamLeadFilter(value,1)
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

  private getTeamLead(teamldkeyvalue) {
      this.taskservice.getTeamLeadFilter(teamldkeyvalue,1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.teamldList = datas;
        })
    }

    public displayFnteamld(teamld?: teamLead): string | undefined {
      return teamld ? teamld.name : undefined;
    }
  
    get teamld() {
      return this.taskupdateForm.value.get('team_lead');
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
                this.taskservice.getappNameFilter(this.client_Id,this.appnmInput.nativeElement.value, this.currentpage + 1)
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

  // client
  autocompleteCltScroll() {
    setTimeout(() => {
      if (
        this.matclientAutocomplete &&
        this.autocompleteTrigger &&
        this.matclientAutocomplete.panel
      ) {
        fromEvent(this.matclientAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matclientAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matclientAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matclientAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matclientAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskservice.getcltFilter(this.cltInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.clientList = this.clientList.concat(datas);
                    if (this.clientList.length >= 0) {
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
                this.taskservice.getmodulenameFilter(this.client_Id,this.project_Id,this.modnmInput.nativeElement.value, this.currentpage + 1)
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

// unit head
autocompleteuntheadScroll() {
    setTimeout(() => {
      if (
        this.matunitheadAutocomplete &&
        this.autocompleteTrigger &&
        this.matunitheadAutocomplete.panel
      ) {
        fromEvent(this.matunitheadAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matunitheadAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matunitheadAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matunitheadAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matunitheadAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskservice.getUnitHeadFilter(this.unitHDInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.unitheadList = this.unitheadList.concat(datas);
                    if (this.unitheadList.length >= 0) {
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
                this.taskservice.getTeamLeadFilter(this.teamldInput.nativeElement.value, this.currentpage + 1)
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

  client_Id=0;
  FocusOut_select_client(data) {
    console.log("client",data);
    this.client_Id = data.id;
    console.log("client- id", this.client_Id)
  }
  project_Id=0;
  FocusOut_select_project(data) {
    console.log("client",data);
    this.project_Id = data.id;
    console.log("project- id", this.project_Id)
  }

      
        clearproject() {
          this.taskupdateForm.controls['app_id'].reset("");
          this.taskupdateForm.controls['module_id'].reset("");
        }
        clearmodule(){
          this.taskupdateForm.controls['module_id'].reset("");
        }


        oncancelupdate(){
          this.isShowUpdateForm = false;
          this.isShowTaskView = true;
          // this.savetrue = true;
        }

        submitUpdate(){
          this.SpinnerService.show();
          if (this.taskupdateForm.value.client.id === undefined || this.taskupdateForm.value.client === "") {
            this.toastr.error('Please Select Valid Client');
            this.SpinnerService.hide();
            return false;
          }
          if (this.taskupdateForm.value.app_id.id === undefined || this.taskupdateForm.value.app_id === "" ) {
            this.toastr.error('Please Select Valid Project ');
            this.SpinnerService.hide();
            return false;
          }
          if (this.taskupdateForm.value.module_id.id === undefined || this.taskupdateForm.value.module_id === "") {
            this.toastr.error('Please Select Valid Module');
            this.SpinnerService.hide();
            return false;
          }
          if (this.taskupdateForm.value.type === undefined || this.taskupdateForm.value.type === "") {
            this.toastr.error('Please Select Valid Dev Type');
            this.SpinnerService.hide();
            return false;
          }
          if (this.taskupdateForm.value.unit_head.id === undefined || this.taskupdateForm.value.unit_head === "") {
            this.toastr.error('Please Select Valid Unit Head');
            this.SpinnerService.hide();
            return false;
          }
          if (this.taskupdateForm.value.team_lead.id === undefined || this.taskupdateForm.value.team_lead === "") {
            this.toastr.error('Please Select Valid Team Lead');
            this.SpinnerService.hide();
            return false;
          }
       
          if (this.taskupdateForm.value.start_date === "") {
            this.toastr.error('Please Select Start Date');
            this.SpinnerService.hide();
            return false;
          }
      
          if (this.taskupdateForm.value.end_date === "") {
            this.toastr.error('Please Select End Date');
            this.SpinnerService.hide();
            return false;
          }
          if (this.taskupdateForm.value.task === "") {
            this.toastr.error('Please Enter Task');
            this.SpinnerService.hide();
            return false;
          }
        
            this.taskservice.taskEditForm(this.createFormate(),this.task_Id)
            .subscribe(res => {
              console.log("vendor", res)
              if(res.id === undefined){
                this.notification.showError(res.description)
                this.SpinnerService.hide();
                return false;
              } 
              else {
                this.notification.showSuccess("Updated Successfully!...")
                this.SpinnerService.hide();
                this.isShowUpdateForm = false;
                this.isShowTaskView = true;
                this.getTaskView()
              }
            },
            error => {
              this.errorHandler.handleError(error);
              this.SpinnerService.hide();
            }
            )
             
          
        }


        createFormate() {
          let data = this.taskupdateForm.controls;
          console.log("create formate",data)
          
          let taskclass = new task();
          taskclass.app_id = data['app_id'].value.id;
          taskclass.client = data['client'].value.id;
          taskclass.type = data['type'].value;
          taskclass.module_id = data['module_id'].value.id;
          taskclass.unit_head = data['unit_head'].value.id;
          taskclass.team_lead = data['team_lead'].value.id;
          taskclass.task = data['task'].value;
          taskclass.start_date = data['start_date'].value;
          taskclass.end_date = data['end_date'].value;
         
          let dateValue = this.taskupdateForm.value;
          taskclass.start_date = this.datePipe.transform(dateValue.start_date, 'yyyy-MM-dd');
          taskclass.end_date = this.datePipe.transform(dateValue.end_date, 'yyyy-MM-dd');
      
          console.log("taskclass", taskclass)
          return taskclass;
        }

        clickupdateTask(){
          this.isShowUpdateForm = true;
          this.isShowTaskView = false;

          const startdate = this.datePipe.transform(this.getTaskview.start_date, 'yyyy-MM-dd');
          const enddate = this.datePipe.transform(this.getTaskview.end_date, 'yyyy-MM-dd');
          // task update form
          this.taskupdateForm.patchValue({
            "app_id": this.getTaskview.app_id,
            "client": this.getTaskview.client_name,
            "type": this.getTaskview.dev_type.id,
            "module_id" : this.getTaskview.module_id,
            "unit_head": this.getTaskview.unit_head,
            "team_lead":this.getTaskview.team_lead,
            "task": this.getTaskview.task,
            "start_date": startdate,
            "end_date": enddate,
          })
        }

  set_StartDate:any;
  // savetrue:boolean= true;
  StartDate(event: string) {
    const date = new Date(event)
    this.set_StartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    // this.savetrue = false;
    this.taskupdateForm.controls['end_date'].reset("");
  }


  // project tracker team lead APPROVE
TeamLead_Approve() {
  this.taskservice.TeamLead_Approve(this.task_Id)
  .subscribe(res => {
    console.log("APPROVE FOR TL", res)
    if(res.status == 'success'){
      this.notification.showSuccess("Approved Successfully!...");
      this.getTaskView();
      this.SpinnerService.hide();
     } else {
      this.notification.showError(res.description)
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


 // Only Numbers with Decimals
 keyPressNumbersDecimal(event) {
  var charCode = (event.which) ? event.which : event.keyCode;
  if (charCode != 46 && charCode > 31
    && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
    return false;
  }
  return true;
}

}



class task {
  
  app_id: string;
  client: string;
  type: string;
  module_id : string;
  unit_head: string;
  team_lead: string;
  task:string;
  start_date: string;
  end_date: string;


}
