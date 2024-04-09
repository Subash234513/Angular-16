import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { SharedService } from 'src/app/service/shared.service';
import { NotificationService } from '../notification.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-module-view',
  templateUrl: './module-view.component.html',
  styleUrls: ['./module-view.component.scss']
})
export class ModuleViewComponent implements OnInit {
  
  modulecreation:boolean;
  clientcreation:boolean;
  clientSummary:boolean;
  projectcreation:boolean;
  projectSummary:boolean;
  mappingcreation:boolean;
  mappingSummary:boolean;
  teamSummary:boolean;
  teamcreation:boolean;
  showmember:boolean;
  showcheckbox:boolean;
  pipelineSummary:boolean;
  pipelinecreation:boolean;
  moduleSummary:boolean=true;
  has_nextmodule = true;
  has_previousmodule = true;
  moduleForm:FormGroup;
  mappingForm:FormGroup;
  moduleList:any;
  presentpagemodule: number = 1;
  pagesizemodule=10;
  searchForm: FormGroup;
  send_value: string;

  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService, private taskservice: TaskService,
    private notification: NotificationService,private datePipe: DatePipe,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.moduleForm = this.fb.group({
      name: [''],
     
    })
    this.searchForm = this.fb.group({
      name: [''],
     
    })
    this.mappingForm = this.fb.group({
      client_id: [''],
      project_id: [''],
      module_id: [''],
    })
    this.get_moduleSummary(1)
  }
  oncancelModule(){
    this.clientcreation = false;
    this.clientSummary = false;
    this.projectcreation = false;
    this.projectSummary = false;
    this.modulecreation = false;
    this.moduleSummary = true;
    this.mappingcreation = false;
    this.mappingSummary = false;
    this.teamSummary = false;
    this.teamcreation = false;
    this.showmember = false;
    this.showcheckbox = false;
    this.pipelineSummary = false;
    this.pipelinecreation = false;
  }
  
  TypeOfForm:string;
  ID_Value_To_moduleEdit: any = ''
  addModule(formtype,data){
    this.TypeOfForm = formtype;
    this.modulecreation = true;
    this.moduleSummary = false;
    if (data != '') {
      this.ID_Value_To_moduleEdit = data.id
      this.moduleForm.patchValue({
        name: data.name
      })
    }
    else {
      this.moduleForm.reset('')
    }
  }
  get_moduleSummary(pageno) {
    this.taskservice.moduleSummary_master(pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        this.moduleList = result['data']
        let dataPagination = result['pagination'];
        if (this.moduleList.length > 0) {
          this.has_nextmodule = dataPagination.has_next;
          this.has_previousmodule = dataPagination.has_previous;
          this.presentpagemodule = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  moduleActiveInactive(status, data) {
    let moduleID = data?.id
    this.taskservice.moduleActiveInactive(moduleID,status)
      .subscribe(results => {
        console.log("results", results)
        this.notification.showSuccess(results.message)
        this.moduleSearch('') 
      })
  }
  moduleSearch(hint: any) {
   
    if (hint == 'next') {
      this.get_moduleSummary(this.presentpagemodule + 1)
    }
    else if (hint == 'previous') {
      this.get_moduleSummary(this.presentpagemodule - 1)
    }
    else {
      this.get_moduleSummary(1)
    }

  }
  moduleSubmit(){
    this.SpinnerService.show();
    if (this.moduleForm.value.name === ""||this.moduleForm.value.name===null||this.moduleForm.value.name===undefined) {
      this.toastr.error('Please Enter Module');
      this.SpinnerService.hide();
      return false;
    }
    let data = this.moduleForm.value
    let dataToSubmit;
    if (this.ID_Value_To_moduleEdit != '') {
      let id = this.ID_Value_To_moduleEdit
      dataToSubmit = Object.assign({}, { 'id': id }, data)
    }
    else {
      dataToSubmit = data
    }
    this.taskservice.moduleForm(dataToSubmit)
    .subscribe(res => {
      console.log("module click", res)
      if(res.status == 'success'){
        if (this.ID_Value_To_moduleEdit != '') {
          this.notification.showSuccess(res.message)
          this.ID_Value_To_moduleEdit = ''
        } else {
          this.notification.showSuccess(res.message)
          this.ID_Value_To_moduleEdit = ''
        }
        
        this.moduleForm = this.fb.group({
          name: [''],
         
        })
        this.moduleSummary = true;
        this.modulecreation = false;
        this.moduleSearch('')
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
  clearForm() {
    this.searchForm.reset();
    
    this.get_moduleSummary(1)
  }
  
  searchform(){
    let formValue = this.searchForm.value
    this.send_value = ""
    if (formValue.name) {
  this.send_value=  this.send_value + '&query=' + formValue.name
    }
    let page = 1;
    this.taskservice.getmodule_search(page,this.send_value).subscribe(result => {
      this.moduleList = result['data'];


    })
    
  }
}
