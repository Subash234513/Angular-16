import { Component, OnInit,EventEmitter,Output } from '@angular/core';
import { TaskManagerService } from '../task-manager.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../../service/error-handling-service.service';
import { FormGroup,FormArray,FormBuilder,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { ShareddataService } from '../shareddata.service';
import { DatePipe } from '@angular/common';
export interface teamopClient {
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

@Component({
  selector: 'app-report-mytask',
  templateUrl: './report-mytask.component.html',
  styleUrls: ['./report-mytask.component.scss']
})

export class ReportMytaskComponent implements OnInit {

  ReportSummary:FormGroup;
  isShowReport: boolean = true;
  isTaskView:boolean=false
  // isShowReportIcon:boolean = true;
  reportList: any;
  testone : any;
  teamdrop: any;
  isLoading = false;
  develop: any;
  teams:any
  pageNumbers: any = 1;
  hasNext : boolean ;
  hasPrevious : boolean;
  // has_nextTask: boolean ;
  // has_previousTask: boolean ;
  presentpageTask: number = 1;
  istaskpagination: boolean;
  // pageReport : any = 1;
  // pagesizereportlog = 10;
  // errorHandler: any;

  constructor(private TaskManagerService:TaskManagerService,private SpinnerService: NgxSpinnerService,
    private fb: FormBuilder, private router: Router, private toastr: ToastrService,
    private errorHandler: ErrorHandlingServiceService,private LocalShareService:ShareddataService,private datePipe:DatePipe) {}
    
    @Output() OnCancel = new EventEmitter<any>();
  ngOnInit(): void {
   // formgroup

    this.ReportSummary = this.fb.group({
     from_date :'',
     to_date :  '',
    //  query:'',
     team:'',
     developer_id:'',
     team_lead: ''
    });

    //  report summarycall
    this.reportTime()
  }

  
  reportTime() {
    // this.isShowAddTemplate = true; 
    // this.isShowtimesheet = false;
    this.SpinnerService.show();

    let data =this.ReportSummary.value

    let new_data={
    }
    if(data.from_date!="" && data.from_date!=undefined && data.from_date!=null){
      new_data["from_date"]=this.datePipe.transform(data.from_date,'yyyy-MM-dd');
    }
    if(data.to_date!="" && data.to_date!=undefined && data.to_date!=null){
      new_data["to_date"]=this.datePipe.transform(data.to_date,'yyyy-MM-dd');
    }
    if(data.team!="" && data.team!=undefined && data.team!=null){
      new_data["team_id"]=data.team.id
    }
    if(data.developer_id!="" && data.developer_id!=undefined && data.developer_id!=null){
      new_data["employee_id"]=data.developer_id.id
    }
    if(data.team_lead!="" && data.team_lead!=undefined && data.team_lead!=null){
      new_data["team_lead"]=data.team_lead.id
    }
    this.TaskManagerService.getreportTask(new_data, this.pageNumbers).subscribe(
      (result) => {
        this.SpinnerService.hide();
       this.reportList=result;
       let dataPagination = result["pagination"];
      //  if (this.reportList.length >= 0) {
      //    this.hasNext = dataPagination.has_next;
      //    this.hasPrevious = dataPagination.has_previous;
      //    this.presentpageTask = dataPagination.index;
      //    this.istaskpagination = true;
      //  }
      console.log("Has Next:", dataPagination.has_next);
    console.log("Has Previous:", dataPagination.has_previous);

    if (typeof dataPagination.has_next === 'boolean' && typeof dataPagination.has_previous === 'boolean') {
      this.hasNext = dataPagination.has_next;
      this.hasPrevious = dataPagination.has_previous;
      this.presentpageTask = dataPagination.index;
      this.istaskpagination = true;
    } else {
      console.error("Invalid data type for hasNext or hasPrevious");
    }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }


  reportDownload() {
    // this.isShowAddTemplate = true; 
    // this.isShowtimesheet = false;
    this.SpinnerService.show();

    let data =this.ReportSummary.value
    let excelreport={
    }
    if(data.from_date!="" && data.from_date!=undefined && data.from_date!=null){
      excelreport["from_date"]=this.datePipe.transform(data.from_date,'yyyy-MM-dd');
    }
    if(data.to_date!="" && data.to_date!=undefined && data.to_date!=null){
      excelreport["to_date"]=this.datePipe.transform(data.to_date,'yyyy-MM-dd');
    }
    if(data.team!="" && data.team!=undefined && data.team!=null){
      excelreport["team_id"]=data.team.id
    }
    if(data.developer_id!="" && data.developer_id!=undefined && data.developer_id!=null){
      excelreport["employee_id"]=data.developer_id.id
    }
    if(data.team_lead!="" && data.team_lead!=undefined && data.team_lead!=null){
      excelreport["team_lead"]=data.team_lead.id
    }

    this.TaskManagerService.getreportdownload(excelreport).subscribe(
      (result) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(result)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download ='ganttchart.xlsx';
        // link.download ='action:excelreport'
        link.click();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  getteamdrop() {
    this.TaskManagerService.teamget('').subscribe(res=>{
      this.teamdrop= res['data']
    })
  }
  teamclick() {
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.ReportSummary.get('team').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.TaskManagerService.teamgetTwo(value)
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
    public displayFnteamclient(clt?: teamopClient): string | undefined {
      // console.log(`Client testing data - ${clt.name}`);
      return clt ? clt.name : undefined;
    }
    getDeveloperdrop() {
      this.TaskManagerService.getdeveloper('').subscribe(res=>{
        this.develop = res['data']
      })
    }
    developerClick(){
      let devkeyvalue: String = "";
      // this.getsprint(devkeyvalue);
      // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
      this.ReportSummary.get('developer_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
    
          }),
          switchMap(value => this.TaskManagerService.getdeveloperTwo(value)
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
    public displaydevelopclient(clt?: developclient): string | undefined {
      // console.log(`Client testing data - ${clt.name}`);
      return clt ? clt.name : undefined;
    }
    resetTasks(){
      this.ReportSummary.reset();
      this.reportTime()
    }
  reporttask(data){
    this.LocalShareService.taskid.next(data?.id)
this.isTaskView=true
this.isShowReport=false
  }
backtoreport(){
  this.isTaskView=false
this.isShowReport=true
}
backtoTaskSummary(){
this.OnCancel.emit()
}

getTeamleaddrop() {
  this.TaskManagerService.getteams('').subscribe(res=>{
    this.teams= res['data']
  })
}

teamleadclick(){
  let devkeyvalue: String = "";
  // this.getsprint(devkeyvalue);
  // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
  this.ReportSummary.get('team_lead').valueChanges
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


public displayteamleadclient(clt?: teamleadclient): string | undefined {
  // console.log(`Client testing data - ${clt.text}`);
  return clt ? clt.name : undefined;
}

previousPage(): void {

  if (this.hasPrevious) {
    this.pageNumbers = this.pageNumbers - 1;
    this.updatePagination();
  }
}
nextPage(): void {
  if (this.hasNext) {

    this.pageNumbers = this.pageNumbers + 1;
    this.updatePagination();
  }
}


updatePagination(): void {
 this.reportTime();
  }

}
