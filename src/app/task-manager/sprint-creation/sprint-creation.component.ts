import { Component, OnInit,EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../AppAutoEngine/import-services/CommonimportFiles'
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApicallserviceService } from 'src/app/AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import { TaskManagerService } from '../task-manager.service';


@Component({
  selector: 'app-sprint-creation',
  templateUrl: './sprint-creation.component.html',
  styleUrls: ['./sprint-creation.component.scss']
})
export class SprintCreationComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private taskmanagerservice: TaskManagerService
  ) { }
  @Output() OnSubmit = new EventEmitter<any>();
  @Output() OnCancel = new EventEmitter<any>();
  sprintForm:FormGroup;

  ngOnInit(): void {

    this.sprintForm = this.fb.group({
      name: "",
      start_day:new FormControl("",[Validators.required]),
      end_day: new FormControl("",[Validators.required]),
    })
    const today = new Date();
  this.sprintForm.get('start_day').setValue(today);
  this.sprintForm.get('end_day').setValue(today)
  }


  BackToSummary(){
    
    this.OnCancel.emit()
    this.sprintForm.get('name').reset();

  }


  SubmitSprint() {
    this.SpinnerService.show();
  
    if (this.sprintForm.value.name === "") {
      this.notify.error('Please Enter Name');
      this.SpinnerService.hide();
      return false;
    }
  
    if (this.sprintForm.value.start_day === "") {
      this.notify.error('Please Select Start Date');
      this.SpinnerService.hide();
      return false;
    }
  
    if (this.sprintForm.value.end_day === "") {
      this.notify.error('Please Select End Date');
      this.SpinnerService.hide();
      return false;
    }
  
    let dateValue = this.sprintForm.value;
    dateValue.start_day = this.datePipe.transform(dateValue.start_day, 'yyyy-MM-dd');
    dateValue.end_day = this.datePipe.transform(dateValue.end_day, 'yyyy-MM-dd');
  
    this.taskmanagerservice.sprintForm(dateValue).subscribe(
      (res) => {
        console.log("sprint click", res);
        if (res.message == 'Successfully Created') {
          this.notify.success("Created Successfully!...");
          this.OnSubmit.emit();
          this.sprintForm.get('name').reset();
          this.SpinnerService.hide();
        } else {
          this.notify.error(res.description);
          this.SpinnerService.hide();
          return false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
}    
