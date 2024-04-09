
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


@Component({
  selector: 'app-pipelinecreate',
  templateUrl: './pipelinecreate.component.html',
  styleUrls: ['./pipelinecreate.component.scss'],
  providers: [imp.TaskApi]
})
export class PipelinecreateComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private taskmanagerservice: TaskManagerService, private apicall: ApicallserviceService,  private taskapi: imp.TaskApi, 
  ) { }
  pipelineform:FormGroup;
  @Output() OnSubmit = new EventEmitter<any>();
  @Output() OnCancel = new EventEmitter<any>();
  pipelineList = [];

  ngOnInit(): void {

    this.pipelineform = this.fb.group({
      name:''
    })
  }

  

  BackToSummary(){
    this.OnCancel.emit()

  }
  submitPipeline()
  {
    if (this.pipelineform.value.name === "") {
      this.notify.error('Please Enter Pipeline Name');
      return false;
    }
    


    this.taskmanagerservice.pipelineCreation(this.pipelineform.value)
    .subscribe(res => {
      console.log("issue click", res)
      if(res.message == 'Successfully Created'){
        this.notify.success("Created Successfully!...");
        this.OnSubmit.emit();
        this.SpinnerService.hide();
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

  }

}
