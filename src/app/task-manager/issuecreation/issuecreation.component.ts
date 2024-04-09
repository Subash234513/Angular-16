
import { Component, EventEmitter, Input, OnInit, Output, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';


import { Overlay, OverlayPositionBuilder } from '@angular/cdk/overlay';
// import { ComponentPortal } from '@angular/cdk/portal';
import * as imp from '../../AppAutoEngine/import-services/CommonimportFiles'
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApicallserviceService } from 'src/app/AppAutoEngine/API Services/Api_and_Query/apicallservice.service';

import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ViewChild } from '@angular/core';
import { TaskManagerService } from '../task-manager.service';
import { SharedService } from 'src/app/service/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { IconDialogComponent } from '../icon-dialog/icon-dialog.component';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MatSelect } from '@angular/material/select';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { MatSelectTrigger } from '@angular/material/select';
// import { MatDialog } from '@angular/material/dialog';
import { DevTypeDialogComponent } from '../dev-type-dialog/dev-type-dialog.component';
import { ShareddataService } from '../shareddata.service';

export interface interfacedatas {
  id: string;
  name: string;
}

@Component({
  selector: 'app-issuecreation',
  templateUrl: './issuecreation.component.html',
  styleUrls: ['./issuecreation.component.scss'],
  providers: [imp.TaskApi]
})
export class IssuecreationComponent implements OnInit {
  projectList: any;
  priorityList: any[];
  reuploadfileArr: any = [];
  addData: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private taskmanagerservice: TaskManagerService, private apicall: ApicallserviceService, private taskapi: imp.TaskApi,
  ) { }

  issueForm: FormGroup;
  @Output() OnSubmit = new EventEmitter<any>();
  @Output() OnCancel = new EventEmitter<any>();
  @ViewChild('labelImport') labelImport: ElementRef;
  EmpTaskCreateObj = {
    QuickAccessList: [],
    selectedNav: '',
    clientList: [],
    projectList: [],
    moduleList: [],
    createArray: [],
    from_date: '',
    to_date: '',
    task: '',
    type: '',
    devtypelist: [],
    statusListData: '',
    toSelectDropDown: null,
    toSelectDependency: null,
    submitValidation: false,
    dependencylist: [],
    priorityList: []
    // priorityList: [{'id':1,'text':true},{'id':2,'text':false}]
  }
  images: string[] = [];
  docFunctionList = [];
  @ViewChild('fileInput') fileInput: any;


  ngOnInit(): void {

    this.issueForm = this.fb.group({
      description: new FormControl(""),
      project: new FormControl(""),
      // status: new FormControl("",[Validators.required]),
      priority_type: new FormControl(""),
      client: '',
      project_map_id: '',
      files: ''

    })
    this.docFunctionList = [];

    this.getPriority();
    this.clientsearch('');
    // this.Projectsearch(1,'')
  }


  BackToSummary() {
    this.OnCancel.emit()

  }
  SubmitIssue() {

    //   if (this.issueForm.value.description === "") {
    //     this.notify.error('Please Enter Issue Name');

    //     return false;
    //   }
    //   if (this.issueForm.value.project === "") {
    //     this.notify.error('Please Select Project');

    //     return false;
    //   }

    //   if (this.issueForm.value.priority === "") {
    //     this.notify.error('Please Select Priority');

    //     return false;
    //   }
    //   let currValue = this.issueForm.value;
    //   let payload = {
    //     "project_id": currValue.project_map_id.mapping_id,
    //     "description": currValue.description,
    //     "priority_type":currValue.priority_type,
    // }
    // const formData: FormData = new FormData(); 
    // let reuploadfiles = this.reuploadfileArr
    // if(reuploadfiles.length!=0){
    //   for (let reuploadindividual in reuploadfiles ) {
    //     let reuploadfilekeydata = 'file'
    //     let datavalue = JSON.stringify(payload)
    //   formData.append('data', datavalue);
    //     formData.append(reuploadfilekeydata, reuploadfiles[reuploadindividual])

    //   }
    // }
    // else{
    //   let datavalue = JSON.stringify(payload)
    //   formData.append('data', datavalue);
    // }

    this.SpinnerService.show();
    console.log("submit", this.docFunctionList);

    if (this.docFunctionList.length === 0) {
      this.notify.error('Please Fill All Details');
      this.SpinnerService.hide();
      return false;
    }

    let count = 1;
    for (let i = 0; i < this.docFunctionList.length; i++) {
      this.docFunctionList[i].attachment = 'file' + count++;
    }
    console.log("ffff", this.docFunctionList);

    // for (let i = 0; i < this.docFunctionList.length; i++) {
    //   if (this.docFunctionList[i].docgroup_id.id != undefined) {
    //     this.docFunctionList[i].docgroup_id = this.docFunctionList[i].docgroup_id.id;
    //   }
    // }
    console.log("docgp", this.docFunctionList);

    let successfulSubmissions = 0;

    const processSubmission = (index) => {
      const dataset = this.docFunctionList[index];
      const formData: FormData = new FormData();
      const Finaldata = [dataset];
      const datavalue = JSON.stringify(Finaldata);
      formData.append('data', datavalue);

      const string_value = this.docFunctionList[index].attachment;
      const file_list = this.docFunctionList[index].filekey;

      formData.append(string_value, file_list[0]);
      this.SpinnerService.show();
      this.taskmanagerservice.issueCreation(formData)
        .subscribe(res => {
          console.log("issue click", res)

          if (res.message == 'Successfully Created') {
            this.notify.success("Created Successfully!...");
            this.docFunctionList = [];
            this.OnSubmit.emit();
            this.SpinnerService.hide();
            this.issueForm.reset();

            this
          } else {
            this.notify.error(res.description)
            this.SpinnerService.hide();
            return false;
          }
        },
          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }

        )

      this.SpinnerService.hide();

    }
    for (let i = 0; i < this.docFunctionList.length; i++) {
      processSubmission(i);
    }
    this.SpinnerService.hide();
    this.issueForm.reset();
  }

  // displayFnappnm(appnm?: interfacedatas): string | undefined {
  //   return appnm ? appnm.name : undefined;
  // }

  // Projectsearch(clientdata, Typedata) {

  //   this.apicall.ApiCall('get', this.taskapi.tasksApi.api.projectSearch+'/'+clientdata?.id+'?'+ this.taskapi.tasksApi.queries.query + Typedata +
  //    '&' + this.taskapi.tasksApi.queries.status + 2) 
  //     .subscribe(results => {
  //       this.projectList = results['data']
  //     }, (error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }
  getPriority() {
    this.SpinnerService.show()
    this.taskmanagerservice.get_Priority()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        // let datas = results["data"];
        this.priorityList = results;
        console.log("priority dropdown", this.priorityList)

      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  clientsearch(Typedata) {

    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.clientsearch +
      this.taskapi.tasksApi.queries.query + Typedata + '&' +
      this.taskapi.tasksApi.queries.status + 2)

      .subscribe(results => {
        this.EmpTaskCreateObj.clientList = results['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  displayFnclt(clt?: interfacedatas): string | undefined {
    return clt ? clt.name : undefined;
  }


  Projectsearch(clientdata, Typedata) {
    if (clientdata?.id == undefined) {
      return false
    }
    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.projectSearch + '/' + clientdata?.id + '?' + this.taskapi.tasksApi.queries.query + Typedata +
      '&' + this.taskapi.tasksApi.queries.status + 2)
      .subscribe(results => {
        this.EmpTaskCreateObj.projectList = results['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  displayFnappnm(appnm?: interfacedatas): string | undefined {
    return appnm ? appnm.name : undefined;
  }




  getModule(clientdata, projectdata, Typedata) {
    if (clientdata?.id == undefined || projectdata?.id == undefined) {
      return false
    }
    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.moduleSearch + projectdata?.id + '?' + 'client_id=' + clientdata?.id + '&' + this.taskapi.tasksApi.queries.query +
      Typedata + '&' + this.taskapi.tasksApi.queries.status + 2)
      .subscribe(results => {
        this.EmpTaskCreateObj.moduleList = results['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  displayFnmodnm(mod?: interfacedatas): string | undefined {
    return mod ? mod.name : undefined;
  }


  resetProjectAndModule() {
    // this.EmpTaskCreate.controls['project'].reset()
    // this.EmpTaskCreate.controls['project_map_id'].reset()
  }
  resetModule() {
    // this.EmpTaskCreate.controls['project_map_id'].reset()
  }
  // fileChange(file, files:FileList) {
  //   this.labelImport.nativeElement.innerText = Array.from(files)
  //   .map(f => f.name)
  //   .join(', ');
  //   this.images = <File>file.target.files[0];
  // }
  attachmentDelete(file, index) {

    this.reuploadfileArr.splice(index, 1)

  }

  onFileSelect(e) {
    // this.selectedFile = e.target.files;
    let reuploaddatavalue = e.target.files

    for (var i = 0; i < e.target.files.length; i++) {

      this.reuploadfileArr.push(e.target.files[i])
    }
  }

  fileChange(event) {
    // let imagesList = [];
    this.images = [];
    for (var i = 0; i < event.target.files.length; i++) {
      this.images.push(event.target.files[i]);
    }
  }

  showimageHeaderPreviewPDF: boolean
  showimageHeaderPreview: boolean
  jpgUrls: any;
  pdfurl: any;
  fileview(files) {
    console.log("file data to view ", files)
    let stringValue = files.name.split('.')
    if (stringValue[1] === "PNG" || stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" || stringValue[1] === "JPG" || stringValue[1] === "JPEG") {
      this.showimageHeaderPreview = true
      this.showimageHeaderPreviewPDF = false
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.jpgUrls = reader.result
      }
    }
    if (stringValue[1] === "pdf") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = true
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.pdfurl = reader.result
      }
    }
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = false
    }
  }

  adddocformarray() {
    this.addData = true;
    if (this.issueForm.value.description == undefined || this.issueForm.value.description == null) {
      this.notify.error('Please Enter Description');
      this.SpinnerService.hide();
      return false;
    }
    if (this.issueForm.value.project === "") {
      this.notify.error('Please Select Project');
      this.SpinnerService.hide();
      return false;
    }
    //  if(this.images.length == 0){
    //    this.notify.error('', 'Choose Upload Files ', { timeOut: 1500 });
    //    this.SpinnerService.hide();
    //    return false;
    //  }
    let dataArray = this.issueForm.value
    let data = {
      project_id: dataArray.project_map_id.mapping_id,
      description: dataArray.description,
      priority_type: dataArray.priority_type,
      attachment: "",
      filekey: this.images
    }

    console.log("dataArray", data)
    this.docFunctionList.push(data)
    console.log("array", this.docFunctionList)

    this.issueForm.controls["description"].reset('');
    this.issueForm.controls["priority_type"].reset('');
    this.images = [];
    this.fileInput.nativeElement.value = ""
  }


  savetemp() {
    this.SpinnerService.show();
    console.log("submit", this.docFunctionList);

    if (this.docFunctionList.length === 0) {
      this.notify.error('Please Fill All Details');
      this.SpinnerService.hide();
      return false;
    }

    let count = 1;
    for (let i = 0; i < this.docFunctionList.length; i++) {
      this.docFunctionList[i].attachment = 'file' + count++;
    }
    console.log("ffff", this.docFunctionList);
    console.log("docgp", this.docFunctionList);
    let successfulSubmissions = 0;
    const processSubmission = (index) => {
      const dataset = this.docFunctionList[index];
      const formData: FormData = new FormData();
      const Finaldata = [dataset];
      const datavalue = JSON.stringify(Finaldata);
      formData.append('data', datavalue);

      const string_value = this.docFunctionList[index].attachment;
      const file_list = this.docFunctionList[index].filekey;

      formData.append(string_value, file_list[0]);
      this.SpinnerService.show();
      this.taskmanagerservice.issueCreation(formData)
        .subscribe(res => {
          console.log("issue click", res)

          if (res.message == 'Successfully Created') {
            this.notify.success("Created Successfully!...");
            this.docFunctionList = [];
            this.OnSubmit.emit();
            this.SpinnerService.hide();
            this.issueForm.reset();

            this
          } else {
            this.notify.error(res.description)
            this.SpinnerService.hide();
            return false;
          }
        },
          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }

        )

      this.SpinnerService.hide();

    }
    for (let i = 0; i < this.docFunctionList.length; i++) {
      processSubmission(i);
    }
    this.SpinnerService.hide();
    this.issueForm.reset();
  }

}
   

