import { Component, OnInit,Output ,EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TaskManagerService } from '../task-manager.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { DatePipe } from '@angular/common';

export interface teamopClient {
  id: string;
  name: string;
}
export interface developclient {
  id: string;
  name: string;
}

@Component({
  selector: 'app-report-ganttchart',
  templateUrl: './report-ganttchart.component.html',
  styleUrls: ['./report-ganttchart.component.scss']
})
export class ReportGanttchartComponent implements OnInit {
  reportsummary:boolean=false;
  reportcard:boolean = false;
  reportganttchart:boolean = true;

  reportChartt:FormGroup;
  reportList: any;
  teamdrop: any;
  isLoading: boolean;
  develop: any;

  constructor(private TaskManagerService:TaskManagerService,private SpinnerService: NgxSpinnerService,
    private fb: FormBuilder, private router: Router, private toastr: ToastrService,private notify:NotificationService,
    private errorHandler: ErrorHandlingServiceService,private datePipe:DatePipe) { }

    @Output() OnCancel = new EventEmitter<any>();

  ngOnInit(): void {

    this.reportChartt = this.fb.group({
      from_date :'',
      to_date :  '',
     //  query:'',
      team:'',
      developer_id:''
     });
  }
  
  reportTime() {
    // this.isShowAddTemplate = true; 
    // this.isShowtimesheet = false;
    let data =this.reportChartt.value
    let new_data={

    }
    
    if(data.team!="" && data.team!=undefined && data.team!=null){
      new_data["team_id"]=data.team.id
    }
    if(data.developer_id!="" && data.developer_id!=undefined && data.developer_id!=null){
      new_data["employee_id"]=data.developer_id.id
    }
    if(Object.entries(new_data).length==0){
      this.notify.showError("Please Choose Team or Employee")
      return false

    }
    if(data.from_date!="" && data.from_date!=undefined && data.from_date!=null){
      new_data["from_date"]=this.datePipe.transform(data.from_date,'yyyy-MM-dd');
    }
    if(data.to_date!="" && data.to_date!=undefined && data.to_date!=null){
      new_data["to_date"]=this.datePipe.transform(data.to_date,'yyyy-MM-dd');
      
    }
    this.TaskManagerService.getganttchart(new_data).subscribe(
      (result) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(result)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download ='ganttchart.xlsx';
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
    this.reportChartt.get('team').valueChanges
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
      this.reportChartt.get('developer_id').valueChanges
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
      this.reportChartt.reset();
      // this.reportTime()
    }
    backtoTaskSummary(){
      this.OnCancel.emit()
      }
}
