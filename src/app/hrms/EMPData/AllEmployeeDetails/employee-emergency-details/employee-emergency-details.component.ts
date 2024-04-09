import { Component, OnInit,ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterHrmsService } from 'src/app/hrms/master-hrms.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-employee-emergency-details',
  templateUrl: './employee-emergency-details.component.html',
  styleUrls: ['./employee-emergency-details.component.scss']
})
export class EmployeeEmergencyDetailsComponent implements OnInit {
  @ViewChild('closeButton', { static: false }) closeButton: ElementRef;

  EmpInfoObjects = {
    datafrom: null,
    booleanList: [{ text: "Yes", value: true }, { text: "No", value: false }]
  }
  EmpId:any;
  EmpFamilyDetails:any;
  addingMode: boolean = true;
  RelationshipList:any;
  updatedDate: string;

  constructor(private activateroute:ActivatedRoute,private hrmsService:MasterHrmsService,private datePipe: DatePipe,
    private toastr:ToastrService, private spinner: NgxSpinnerService,
   private fb:FormBuilder,private renderer: Renderer2 ) {
    this.familyInfoForm = this.fb.group({
      name: [''],
      relationship: [''],
      dob:[''],
      no:[''],

    });

   }
  familyInfoForm: FormGroup = new FormGroup({
    name: new FormControl(),
    relationship: new FormControl(),
    dob: new FormControl(),
    no: new FormControl(),

  });

  get famName() {
    return this.familyInfoForm.get("name")
  }
  get famRelation() {
    return this.familyInfoForm.get("relationship")
  }
  get famDob() {
    return this.familyInfoForm.get("dob")
  }
  get famno() {
    return this.familyInfoForm.get("no")
  }
  showSaveButton() {
    this.addingMode = true;
    this.familyInfoForm.reset();
  }
  EmpObjects = {
    employeeList: null, 
    employeeFirstLetter: null,
    ActivityStatus: null,
    TimeLogList: null,
    empId: null,
    pendingCounts: null   
  }  

  ngOnInit(): void {
    this.activateroute.queryParams.subscribe((params) => {
      this.EmpInfoObjects.datafrom = params['datafrom'];
      this.EmpId = params['id'];
    })

     this.getEmpFamilyDetails();
     this.getRelationshipDropdown();
     this.getEmployeeBasicDetails();

     this.getEmployee();

  }
  EmpBasicDetails:any;
  getEmployeeBasicDetails(){
   this.hrmsService.getEmpDetails(this.EmpId).subscribe(results => {
     this.EmpBasicDetails = results;
   }
   )
 }

  getRelationshipDropdown() {
    this.hrmsService.getrelationship('relationship')
      .subscribe(results => {
        this.RelationshipList = results['data']
      })

  }
  selectedId:any
  onSelectionChange(event: any): void {
    const selectedText = event.value;
    this.selectedId = this.RelationshipList.find(rel => rel.text === selectedText)?.id;
  }

  getEmpFamilyDetails(){
    this.spinner.show();
    this.hrmsService.getEmpFamilyInfoNews(this.EmpId)
    .subscribe(results => {
      if(results.code)
      {
        this.spinner.hide();
        this.toastr.error(results.code)
      }
      else
      {
      
      this.spinner.hide();
      this.EmpFamilyDetails = results['emergency_contact'];
      this.EmpFamilyDetails.reverse();
      }
    });
  }
  formattedPostDate:any;
  formatPostDate(date: string): string {
    this.formattedPostDate = this.datePipe.transform(new Date(date), 'yyyy-MM-dd');
    return this.formattedPostDate || ''; 
  }
  formattedDate: string = this.formatPostDate('Thu Nov 16 2023 00:00:00 GMT+0530 (India Standard Time)');
  selectedItem: any;
  editId:any
  relationshipId:any;
  editRow(item: any) {
    const timestamp = item.dob;
    const dateObject = new Date(timestamp);
    this.editId=item.id
    this.addingMode = false;
    this.selectedItem = item;
    const relationshipValue = this.RelationshipList.find(rel => rel.text === item.relationship.text)?.text;
this.familyInfoForm.patchValue({
  name: item.name,
  relationship:item.relationship.id,
   dob: '',
  no: item.mobile_no,
})

this. getRelationshipDropdown();
  }

  onUpdate() {    
    if(this.familyInfoForm.get('name').value == '' || this.familyInfoForm.get('name').value == null || this.familyInfoForm.get('name').value == undefined)
    {
      this.toastr.error("Please Enter Contact Name");
      return false;
    }
    if(this.familyInfoForm.get('relationship').value == '' || this.familyInfoForm.get('relationship').value == null || this.familyInfoForm.get('relationship').value == undefined)
    {
      this.toastr.error("Please Select Relationship");
      return false;
    }
    if(this.familyInfoForm.get('no').value == '' || this.familyInfoForm.get('no').value == null || this.familyInfoForm.get('no').value == undefined)
    {
      this.toastr.error("Please Enter Contact Number");
      return false;
    }
    if((this.familyInfoForm.get('no').value).length < 10)
    {
      this.toastr.error("Please Enter Valid Contact Number");
      return false;
    }
    if (this.familyInfoForm.valid)  {

      const formIntoJson = {
        name: this.familyInfoForm.value.name || null,
        relationship:this.selectedId|| null,
       dob:'' || null,
      no:this.familyInfoForm.value.no|| null,
  id:this.editId
      };
    const jsonData = JSON.stringify([formIntoJson]);
    let dobs = this.datePipe.transform(this.familyInfoForm.get('dob').value, "yyyy-MM-dd")
    let payloads =[ {
      "name": this.familyInfoForm.get('name').value,
      "relationship": this.familyInfoForm.get('relationship').value,
      "mobile_no":  this.familyInfoForm.get('no').value,
      "is_emcp": true,  
      id:this.editId

    }]
    this.hrmsService.postEmployeeFamilyInfoNew(this.EmpId, payloads).subscribe(
      (response) => {
        this.toastr.success('Successfully posted family info');
        this.getEmpFamilyDetails();
        this.renderer.selectRootElement(this.closeButton.nativeElement).click();
      },
      (error) => {
        this.toastr.error('Error while posting family info');
        this.renderer.selectRootElement(this.closeButton.nativeElement).click();

      }
    );
  } else {
    this.toastr.warning('All details need to be filled');
  }
}


  onSave(){
    if(this.familyInfoForm.get('name').value == '' || this.familyInfoForm.get('name').value == null || this.familyInfoForm.get('name').value == undefined)
    {
      this.toastr.error("Please Enter Contact Name");
      return false;
    }
    if(this.familyInfoForm.get('relationship').value == '' || this.familyInfoForm.get('relationship').value == null || this.familyInfoForm.get('relationship').value == undefined)
    {
      this.toastr.error("Please Select Relationship");
      return false;
    }
    if(this.familyInfoForm.get('no').value == '' || this.familyInfoForm.get('no').value == null || this.familyInfoForm.get('no').value == undefined)
    {
      this.toastr.error("Please Enter Contact Number");
      return false;
    }
    if((this.familyInfoForm.get('no').value).length < 10)
    {
      this.toastr.error("Please Enter Valid Contact Number");
      return false;
    }
   if (this.familyInfoForm.valid ) {
    const formIntoJson = {
      name: this.familyInfoForm.value.name || null,
      relationship:this.selectedId|| null,
     dob: ''|| null,
    no:this.familyInfoForm.value.no|| null,

    };
    const jsonData = JSON.stringify([formIntoJson]);
    let payload =[ {
      "name": this.familyInfoForm.get('name').value,
      "relationship": this.familyInfoForm.get('relationship').value,
      "mobile_no":  this.familyInfoForm.get('no').value,
      "is_emcp": true,
    }]
    this.hrmsService.postEmployeeFamilyInfoNew(this.EmpId, payload).subscribe(
      (response) => {
        this.toastr.success('Successfully posted family info');
        this.getEmpFamilyDetails();
        this.renderer.selectRootElement(this.closeButton.nativeElement).click();
      },
      (error) => {
        console.error('Error while posting family info:', error);
        this.toastr.error('Error while posting family info');
        this.renderer.selectRootElement(this.closeButton.nativeElement).click();

      }
    );

   }  
     else {
      for (const control in this.familyInfoForm.controls) {
        if (this.familyInfoForm.controls.hasOwnProperty(control)) {
         this.familyInfoForm.get(control).markAsTouched();
        }
     }
      this.toastr.warning('All details needed to be filled');
     }
}


deleteBankRecord(recordId: number) {
  if (confirm('Are you sure you want to delete this bank record?')) {
    this.hrmsService.deleteEmergencyRecord(recordId, this.EmpId).subscribe(
      (response) => {
        this.toastr.success("Emergency Contact deleted successfully")
        this.getEmpFamilyDetails();
      },
      (error) => {
        console.error('Error while deleting Bank record:', error);
        this.toastr.error("Error while deleting bank record")

      }
    );
  }
}

getEmployee(){

  const getDataid = localStorage.getItem("sessionData")
  let idValue = JSON.parse(getDataid);
  let id = idValue.employee_id;
  this.EmpObjects.empId = idValue.employee_id;
  this.hrmsService.getEmpDetails( id )
  .subscribe(res=>{
    this.EmpObjects.employeeList = res 
    if(res?.id){ 
      this.gettingProfilename(res?.full_name) 
    }
  }, error=>{
    
  })
}

gettingProfilename(data){
  let name:any = data 
  let letter = name[0]
  this.EmpObjects.employeeFirstLetter = letter 
}

keyPressNumbers(event) {
  var charCode = (event.which) ? event.which : event.keyCode;

  if ((charCode < 48 || charCode > 57)) {
    event.preventDefault();
    return false;
  } else {
    return true;
  }
}
  }
  