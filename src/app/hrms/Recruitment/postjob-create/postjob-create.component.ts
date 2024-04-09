import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles';
import { AttendanceService } from '../../attendance.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service'
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AmountPipePipe } from '../../../AppAutoEngine/import-services/CommonimportFiles';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-postjob-create',
  templateUrl: './postjob-create.component.html',
  styleUrls: ['./postjob-create.component.scss'], 
  providers: [imp.HrmsAPI, imp.Userserv]
})
export class PostjobCreateComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private attendanceService: AttendanceService, private shareService: imp.SharedService,
    private hrmsapi: imp.HrmsAPI, private APiserv: ApicallserviceService, private userserv: imp.Userserv
  ) { }

  CreateJobPostingForm: FormGroup
  additional_info: FormGroup;
  OptionalFields: FormGroup;  
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  ngOnInit(): void {

    this.CreateJobPostingForm = this.fb.group({
    "job_title":"",
    "job_type":"",
    "additional_info":"", 
    "max_salary":"",
    "min_salary":"",
    "work_mode":"",
    "max_exp":"",
    "min_exp":"",
    "location":new FormArray([]),
    "skill_set":new FormArray([]),
    "approver":[],
    "locationInput": '',
    "skill_setInput":'',
    "department_id": '',
    "hiring_manager" : '' ,
    "no_opening" : '',
    "currency_type" : '',
    "salary_type" : '', 
    "is_hired": 0
  }) 
  this.additional_info = this.fb.group({})

    this.OptionalFields = this.fb.group({
      name: '',
      type: ''
    })

  }
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  PostJobCreateObjects = {
    JobTypeList: [{ "id": 1, "text": "Full Time" },
                  { "id": 2, "text": "Part Time"  },
                  { "id": 3, "text": "Contract" }],
    WorkModeList: [ { "id": 1, "text": "Work From Office" },
                    { "id": 2, "text": "Work From Home"  },
                    { "id": 3, "text": "Hybird" },
                    { "id": 3, "text": "Client Location"} ], 
    salary_typeList: [{"id":1,"text":"ANNUAL"}, {"id":2,"text":"MONTHLY"}], 
    currency_typeList: [{"id":1,"text":"RUPEE", "symbol": "INR"}, 
                        {"id":2,"text":"DOLLAR", "symbol":"USD"},
                        {"id":3,"text":"EURO", "symbol": "EUR"}], 
    detartmentList: [],
    ManagerList: []
  } 

///////// Location 
  addlocation(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our joblocation
    if ((value || '').trim()) {
      this.CreateJobPostingForm.get('location')['controls'].push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
      this.CreateJobPostingForm.value.locationInput = ''
    }
  }

  removelocation(joblocation): void {
    const index = this.CreateJobPostingForm.get('location')['controls'].indexOf(joblocation);
    if (index >= 0) {
      this.CreateJobPostingForm.get('location')['controls'].splice(index, 1);
    }
  }
/////// Skills 
addskill_set(event: MatChipInputEvent): void {
  const input = event.input;
  const value = event.value;
  // Add our skill
  if ((value || '').trim()) {
    this.CreateJobPostingForm.get('skill_set')['controls'].push(value.trim());
  }
  // Reset the input value
  if (input) {
    input.value = '';
    this.CreateJobPostingForm.value.skill_setInput = ''
  }
}

removeskill_set(jobskill_set): void {
  const index = this.CreateJobPostingForm.get('skill_set')['controls'].indexOf(jobskill_set);
  if (index >= 0) {
    this.CreateJobPostingForm.get('skill_set')['controls'].splice(index, 1); 
  }
}




@ViewChild('empapproval') matempapprovalAutocomplete: MatAutocomplete;
@ViewChild('empapprovalInput') empapprovalInput: any;
public chipSelectedempapproval: emplistss[] = [];
public chipSelectedempapprovalid = [];
empapproval_id = new FormControl();
empList: any = [] 


public removedempapproval(emp: emplistss) {
 
  const index = this.chipSelectedempapproval.indexOf(emp);
  if (index >= 0) {
    this.chipSelectedempapproval.splice(index, 1);
    console.log(this.chipSelectedempapproval);
    this.chipSelectedempapprovalid.splice(index, 1);
    console.log(this.chipSelectedempapprovalid);
    this.empapprovalInput.nativeElement.value = '';
  }
}



public empapprovalSelected(event: MatAutocompleteSelectedEvent): void {
  console.log('event.option.value', event.option.value)
  this.selectempapprovalByName(event.option.value.name);
  this.empapprovalInput.nativeElement.value = '';
  console.log('chipSelectedempapprovalid', this.chipSelectedempapprovalid)
}
private selectempapprovalByName(emp) {
  let foundemp1 = this.chipSelectedempapproval.filter(e => e.name == emp);
  if (foundemp1.length) {
    return;
  }
  let foundemp = this.empList.filter(e => e.name == emp);
  if (foundemp.length) {
    this.chipSelectedempapproval.push(foundemp[0]);
    this.chipSelectedempapprovalid.push(foundemp[0].id)
  }
}


getemp(keyvalue) {
  // this.SpinnerService.show();
  this.attendanceService.employeesearch(keyvalue, 1)
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


DataDropDown = [
  {
    "name": "Date",
    "type": "date"
  },
  {
    "name": "Text",
    "type": "text"
  },
  {
    "name": "Number",
    "type": "number"
  },
  {
    "name": "TextArea",
    "type": "textarea"
  },
]
SelectedDataJson: any = [] 
removecontrol(controlname) {
  this.additional_info.removeControl(controlname);
  console.log("remove data array before", this.SelectedDataJson, this.SelectedDataJson.findIndex(arr => arr.name == controlname))

  let index = this.SelectedDataJson.findIndex(arr => arr.name == controlname)

  this.SelectedDataJson.splice(index, 1)

  console.log("remove data array after", this.SelectedDataJson)
}


SelectedCreateFormData() {
  // console.log("controls", controls) 
  let controls = {
    "name": this.OptionalFields.value.name,
    "label": this.OptionalFields.value.name,
    "value": "",
    "type": this.OptionalFields.value.type
  }

  this.SelectedDataJson.push(controls)
  // console.log("arr data",  this.SelectedDataJson) 
  let arrset: any = this.SelectedDataJson
  console.log("controls data", this.SelectedDataJson)
  for (const control of arrset) {
    console.log("loop control", control)
    this.additional_info.addControl(
      control.name,
      this.fb.control(control.value)
    );
  }

  console.log("this.SelectedDataJson.controls", this.SelectedDataJson);
  this.OptionalFields.reset('')


}


getdepartment(data) {
 
  this.APiserv.ApiCall('get', this.userserv.userserv.employeegrp+data)
    .subscribe((results: any[]) => { 
      let datas = results["data"];
      this.PostJobCreateObjects.detartmentList = datas; 
    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
}


public displayFndepartment_id(dept?: deptUserserv): string | undefined {
  return dept ? dept.name : undefined; 
}
getHiringmanger(data) {
 
  this.APiserv.ApiCall('get', this.userserv.userserv.employeegrp+data)
    .subscribe((results: any[]) => { 
      let datas = results["data"];
      this.PostJobCreateObjects.ManagerList = datas; 
    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
}


public displayFnManger(dept?: deptUserserv): string | undefined {
  return dept ? dept.name : undefined; 
}






SubmitJobPost(){
  console.log("this.CreateJobPostingForm.get('location')['controls']", this.CreateJobPostingForm.get('location')['controls'])
  console.log(this.CreateJobPostingForm.value) 


  let Obj = {
    "job_title":this.CreateJobPostingForm.value.job_title,
    "job_type":this.CreateJobPostingForm.value.job_type,
    "additional_info":this.SelectedDataJson, 
    "max_salary":this.CreateJobPostingForm.value.max_salary,
    "min_salary":this.CreateJobPostingForm.value.min_salary,
    "work_mode":this.CreateJobPostingForm.value.work_mode,
    "max_exp":this.CreateJobPostingForm.value.max_exp,
    "min_exp":this.CreateJobPostingForm.value.min_exp,
    "location":this.CreateJobPostingForm.get('location')['controls'],
    "skill_set": this.CreateJobPostingForm.get('skill_set')['controls'],
    "approver":this.chipSelectedempapprovalid, 
    "department_id": this.CreateJobPostingForm.value.department_id.id,
    "hiring_manager" : this.CreateJobPostingForm.value.hiring_manager?.id,
    "no_opening" : this.CreateJobPostingForm.value.no_opening,
    "currency_type" : this.CreateJobPostingForm.value.currency_type.id,
    "salary_type" : this.CreateJobPostingForm.value.salary_type,
    "is_hired": 0
  }

  console.log("object for the data to submit", Obj)

  this.APiserv.ApiCall("post", this.hrmsapi.HRMS_API.api.recruit, Obj)
  .subscribe(results =>{
    this.notify.success("Success")
    this.onSubmit.emit()
  })
 
}





BackToSummary(){
  this.onCancel.emit()
}
















}



export interface emplistss {
  id: string;
  name: any;
  full_name: any
}

export interface deptUserserv {
  id: string;
  name: any;
}