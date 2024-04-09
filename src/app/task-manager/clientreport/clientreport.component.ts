import { Component, OnInit,ViewChild ,Output,EventEmitter} from '@angular/core';
import { TaskManagerService } from 'src/app/task-manager/task-manager.service';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { ToastrService } from 'ngx-toastr';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-clientreport',
  templateUrl: './clientreport.component.html',
  styleUrls: ['./clientreport.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
})
export class ClientreportComponent implements OnInit {
  isLoading:boolean=false
  trclientList: any;
  trappNameList:any;
  trmoduleNameList:any;
  tunitheademployeeList:any
  reportsearchform:FormGroup
  tprojectheademployeeList:any
  gettasknamelist:any
  current_date: string;
  statusList:any
  develop:any
  constructor(private errorHandler: ErrorHandlingServiceService,private notification: NotificationService,private SpinnerService: NgxSpinnerService,private datePipe:DatePipe,private taskservice:TaskManagerService,private fb:FormBuilder,private toastr: ToastrService,) { }
  @ViewChild('clt') matclientAutocomplete: MatAutocomplete;
  @ViewChild('taskmodInput') taskmodInput: any;
  @ViewChild('taskrappInput') taskrempInput: any;
  @ViewChild('taskrcltInput') taskrcltInput: any;
  @ViewChild('taskprojectheadInput') taskprojectheadInput: any;
    @Output() OnCancel = new EventEmitter<any>();


  ngOnInit(): void {
    this.reportsearchform=this.fb.group({
      client_id:'',
      app_id:'',
      project_map_id:'',
      project_head:'',
      unit_head:'',
      task_name:'',
      task_type:'',
      month:'',
      developer_id:''
    })
  }
  taskrclient(){
    this.taskservice.getcltFilter('',1).subscribe(data=>{
      this.trclientList=data['data'];
    });
    

}
getDeveloperdrop() {
  this.taskservice.get_emp('', 1).subscribe(res=>{
    this.develop = res['data']
  })
}
developerClick(){
  let devkeyvalue: String = "";
  // this.getsprint(devkeyvalue);
  // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
  this.reportsearchform.get('developer_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.taskservice.get_emp(value,1)
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
clientclick() {
  let devkeyvalue: String = "";
  // this.getsprint(devkeyvalue);
  // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
  this.reportsearchform.get('client_id').valueChanges
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
      this.trclientList = datas;
    })
}
taskrappName(){
  if(this.reportsearchform.get('client_id').value.id == null || this.reportsearchform.get('client_id').value=='' || this.reportsearchform.get('client_id').value.id==undefined){
    this.notification.showError('Please Select The Cient Name');
    return false;
   }
  let d:any=this.reportsearchform.get('client_id').value.id;
  console.log("Client_id",this.reportsearchform.value.client_id.id);
  this.taskservice.getappNameFilter(this.reportsearchform.value.client_id.id,'',1).subscribe(data=>{
    this.trappNameList=data['data'];
    console.log("Client_list",this.trappNameList)
  });

  this.reportsearchform.get('app_id').valueChanges.pipe(
    tap(()=>{
      this.isLoading=true;
    }),
    switchMap((value:any)=>this.taskservice.getappNameFilter(this.reportsearchform.value.client_id.id,value,1).pipe(
      finalize(()=>{
        this.isLoading=false;
      })
    ))
  ).subscribe(data=>{
    this.trappNameList=data['data'];
  });
  

}
taskrmoduleName(){
 
  if(this.reportsearchform.get('app_id').value.id == null || this.reportsearchform.get('app_id').value=='' || this.reportsearchform.get('app_id').value.id==undefined){
   this.notification.showError('Please Select The Project Name');
   return false;
  }

 let d:any=this.reportsearchform.get('client_id').value.id;
 console.log("Client_id",this.reportsearchform.value.client_id.id);
 console.log("project_id",this.reportsearchform.value.app_id.id);
 this.taskservice.getmodulenameFilter(this.reportsearchform.value.client_id.id,this.reportsearchform.get('app_id').value.id,'',1).subscribe(data=>{
   this.trmoduleNameList=data['data'];
   console.log("module_list",this.trmoduleNameList)
 });
 this.reportsearchform.get('project_map_id').valueChanges.pipe(
   tap(()=>{
     this.isLoading=true;
   }),
   switchMap((value:any)=>this.taskservice.getmodulenameFilter(this.reportsearchform.value.client_id.id,this.reportsearchform.get('app_id').value.id,value,1).pipe(
     finalize(()=>{
       this.isLoading=false;
     })
   ))
 ).subscribe(data=>{
   this.trmoduleNameList=data['data'];
 });
}
public displaytrclt(clt?: tClient): string | undefined {
  return clt ? clt.name : undefined;
}
public displaytrcapp(app?: tappName): string | undefined {
  return app ? app.name : undefined;
}
public displaytrmod(mod?: tModeuleName): string | undefined {
  return mod ? mod.name : undefined;
}
public displayprojecthead(project_head?: tproject_head_Name): string | undefined {
  return project_head ? project_head.name : undefined;
}
public displayunithead(unit_head?: tUnit_head_Name): string | undefined {
  return unit_head ? unit_head.name : undefined;
}
public displayemptask(taskname?: task): string | undefined {
  return taskname ? taskname.task : undefined;
}
public displayemptasktype(taskname?: task): string | undefined {
  return taskname ? taskname.name : undefined;
}
taskprojectheadName(){ 
  this.taskservice.getprojectheadname('',1).subscribe(data=>{
    this.tprojectheademployeeList=data['data'];
  });

  this.reportsearchform.get('project_head').valueChanges.pipe(
    tap(()=>{
      this.isLoading=true;
    }),
    switchMap((value:any)=>this.taskservice.getprojectheadname(value,1).pipe(
      finalize(()=>{
        this.isLoading=false;
      })
    ))
  ).subscribe(data=>{
    this.tprojectheademployeeList=data['data'];
  });   
}
taskunitName(){ 
  this.taskservice.getunitheadname('',1).subscribe(data=>{
    this.tunitheademployeeList=data['data'];
  });

  this.reportsearchform.get('unit_head').valueChanges.pipe(
    tap(()=>{
      this.isLoading=true;
    }),
    switchMap((value:any)=>this.taskservice.getunitheadname(value,1).pipe(
      finalize(()=>{
        this.isLoading=false;
      })
    ))
  ).subscribe(data=>{
    this.tunitheademployeeList=data['data'];
  });   
}
taskName(){
  this.taskservice.gettaskname('',1).subscribe(data=>{
    this.gettasknamelist=data['data'];
  });
  this.reportsearchform.get('task_name').valueChanges.pipe(
    tap(()=>{
      this.isLoading=true;
    }),
    switchMap((value:any)=>this.taskservice.gettaskname(value,1).pipe(
      finalize(()=>{
        this.isLoading=false;
      })
    ))
  ).subscribe(data=>{
    this.gettasknamelist=data['data'];
  });

}
typeStatus() {
  this.taskservice.getStatus().subscribe(data=>{
    this.statusList=data;
  });
  this.reportsearchform.get('task_type').valueChanges.pipe(
    tap(()=>{
      this.isLoading=true;
    }),
    switchMap((value:any)=>this.taskservice.getStatus().pipe(
      finalize(()=>{
        this.isLoading=false;
      })
    ))
  ).subscribe(data=>{
    this.statusList=data;
  });
}
clearfunc(){
  this.reportsearchform.reset()
}
reportdownload() {
  this.SpinnerService.show();
    // if (this.reportsearchform.value.client_id === ""||this.reportsearchform.value.client_id === null||this.reportsearchform.value.client_id === undefined) {
    //   this.toastr.error('Choose client');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    if (this.reportsearchform.value.month === ""||this.reportsearchform.value.month === null||this.reportsearchform.value.month === undefined) {
      this.toastr.error('Choose Month');
      this.SpinnerService.hide();
      return false;
    }
  // this.isShowAddTemplate = true; 
  // this.isShowtimesheet = false;

  // client_id:'',
  // app_id:'',
  // project_map_id:'',
  // project_head:'',
  // unit_head:'',
  // task_name:'',
  // task_type:'',
  // month:'',
  // {"client_id":1,"project_id":1,"module_id":1,
  // "unit_head":1,"proj_head":1,"task":"abc","task_type":1,"month":2,"emp_id":2}
  let data =this.reportsearchform.value
  let new_data={

  }
  
  if(data.month!="" && data.month!=undefined && data.month!=null){
    new_data["month"]=this.datePipe.transform(data.month,'yyyy-MM');
    // new_data["month"]=this.monyear.value;
  }
  if(data.client_id!="" && data.client_id!=undefined && data.client_id!=null){
    new_data["client_id"]=data.client_id?.id 
  }
  if(data.app_id!="" && data.app_id!=undefined && data.app_id!=null){
    new_data["project_id"]=data.app_id?.id 
  }
  // project_map_id
  if(data.project_map_id!="" && data.project_map_id!=undefined && data.project_map_id!=null){
    new_data["project_map_id"]=data.project_map_id?.id 
  }
  // if(data.unit_head!="" && data.unit_head!=undefined && data.unit_head!=null){
  //   new_data["unit_head"]=data.unit_head?.id 
  // }
  if(data.project_head!="" && data.project_head!=undefined && data.project_head!=null){
    new_data["proj_head"]=data.project_head?.id 
  }
  if(data.task_type!="" && data.task_type!=undefined && data.task_type!=null){
    new_data["task_type"]=data.task_type?.id 
  }
  if(data.developer_id!="" && data.developer_id!=undefined && data.developer_id!=null){
    new_data["emp_id"]=data.developer_id?.id 
  }

  this.taskservice.clientreportdownload(new_data).subscribe(
    (result) => {
      this.SpinnerService.hide();
      let binaryData = [];
      binaryData.push(result)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download ='ClientReport.xlsx';
      link.click();
    },
    (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
  );
}
public displaydevelopclient(clt?: developclient): string | undefined {
  // console.log(`Client testing data - ${clt.name}`);
  return clt ? clt.name : undefined;
}
backtoTaskSummary(){
  this.OnCancel.emit()
}

monyear = new FormControl(moment())

chosenYearHandler(normalizedYear: Moment) {
  const ctrlValue = this.monyear.value;
  ctrlValue.year(normalizedYear.year());
  this.monyear.setValue(ctrlValue);


}
chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
  const ctrlValue = this.monyear.value;
  ctrlValue.month(normalizedMonth.month());
  this.monyear.setValue(ctrlValue);
  datepicker.close();
  this.reportsearchform.patchValue({
    month: this.monyear.value
  })

}

}
export interface tClient {
  id: string;
  name: string;
}
export interface tappName {
  id: string;
  name: string;
}
export interface tModeuleName {
  id: string;
  name: string;
}
export interface tproject_head_Name {
  id: string;
  name: string;
  code:string;
}
export interface tUnit_head_Name {
  id: string;
  name: string;
  code:string;
}
export interface task {
  id: string;
  task: string;
  name:string
}
export interface developclient {
  id: string;
  name: string;
}