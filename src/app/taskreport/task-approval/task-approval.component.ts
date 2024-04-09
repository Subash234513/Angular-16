import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { SharedService } from 'src/app/service/shared.service';
import { NotificationService } from '../notification.service';
import { ShareService } from '../share.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-approval',
  templateUrl: './task-approval.component.html',
  styleUrls: ['./task-approval.component.scss']
})

export class TaskApprovalComponent implements OnInit {

  taskapprover:boolean=true
  presentpageTaskapproval: number = 1;
  taskapprovalList: any;
  has_nextTaskapproval: any;
  has_previousTaskapproval: any;
  pagesizetaskapproval=10;
  ClientMasterDrop=[]
  ProjectMasterDrop=[]
  ModuleMasterDrop=[]
  isClientMasterId: any;
  isProjectMasterId: any;
  isModuleMasterId: any;

  constructor(
    private fb: FormBuilder, private router: Router,private toastr: ToastrService,
private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService,
private taskservice:TaskService, private datepipe: DatePipe, private taskShare: ShareService,
private notification: NotificationService,private shareService: SharedService ,private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.taskApprovalSummary('',1,10)
    this.ClientMaster('')
  }
  search=new FormGroup({
    client:new FormControl(''),
    project:new FormControl(''),
    module:new FormControl('')
  })
  TaskapprovalSearch(hint: any) {
    // let search = this.taskSearchForm.value;
    // search.start_date = this.datepipe.transform(search.start_date, 'yyyy-MM-dd');
    // search.end_date = this.datepipe.transform(search.end_date, 'yyyy-MM-dd');
    // let obj = {
    //   "start_date": search?.start_date,
    //   "end_date": search?.end_date,
    //   "dev_type": search?.dev_type,
    //   "app_id": search?.app_id.id,
    //   "client": search?.client?.id,
    //   "module_id": search?.module_id?.id,
    //   "status": search?.status
    // }
    // console.log("obj api", obj)
    // for (let i in obj) {
    //   if (obj[i] == undefined || obj[i] == null) {
    //     obj[i] = '';
    //   }
    // }
    // this.SpinnerService.show();
let obj = 1 
    if (hint == 'next') {
      this.taskApprovalSummary(obj, this.presentpageTaskapproval + 1, 10)
    }
    else if (hint == 'previous') {
      this.taskApprovalSummary(obj, this.presentpageTaskapproval - 1, 10)
    }
    else {
      this.taskApprovalSummary(obj, 1, 10)
    }

  }
  taskApprovalSummary(search, pageno, pageSize) {
    this.taskservice.task_Approval_Summary(search, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("task approval summary", result)
        this.taskapprovalList = result['data']
        let dataPagination = result['pagination'];
        if (this.taskapprovalList.length > 0) {
          this.has_nextTaskapproval = dataPagination.has_next;
          this.has_previousTaskapproval = dataPagination.has_previous;
          this.presentpageTaskapproval = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  projectstart_date:any;
  projectend_date:any;
  projectdata:any;
  project(data){
    console.log("gggg")
    this.projectdata = data;
    this.projectstart_date = data.project.start_date
    this.projectend_date= data.project.end_date

  }
  taskApproveClick(id){
    this.SpinnerService.show();
    this.taskservice.taskApproveClick(id)
    .subscribe(res => {
      console.log("taskApproveClick", res)
      if(res.message == 'Successfully Updated'){
        this.notification.showSuccess("Updated Successfully!...");
        this.TaskapprovalSearch('');
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
  ClientMaster(name){
    this.taskservice.getclientmasterFilter(name,1).subscribe(data=>{
      this.ClientMasterDrop=data['data']
    })
  }

  ProjectMaster(name){
    this.taskservice.getprojectnamemasterFilter(0,name,1).subscribe(data=>{
      this.ProjectMasterDrop=data['data']
    })
  }
  ModuleMaster(name){
    this.taskservice.getmodulenamemasterFilter(0,0,name,1).subscribe(data=>{
      this.ModuleMasterDrop=data['data']
    })
  }
  ClientMasterId(value){
    this.isClientMasterId=value.id
  }
  ProjectMasterId(value){
    this.isProjectMasterId=value.id
  }
  ModuleMasterId(value){
    this.isModuleMasterId=value.id
  }
  Search(){
    if(!this.isClientMasterId){
      this.isClientMasterId=''
    }
    if(!this.isProjectMasterId){
      this.isProjectMasterId=''
    }
    if(!this.isModuleMasterId){
      this.isModuleMasterId=''
    }
    this.taskservice.task_Approval_Search(this.isModuleMasterId,this.isProjectMasterId,this.isClientMasterId).subscribe(data=>{
      this.taskapprovalList=data['data']
      this.has_nextTaskapproval = data.pagination.has_next;
      this.has_previousTaskapproval = data.pagination.has_previous;
      this.presentpageTaskapproval = data.pagination.index; 
    })
  }
  clear(){
    this.search.reset()
    this.isModuleMasterId=''
    this.isClientMasterId=''
    this.isProjectMasterId=''
    this.Search()
  }

}
