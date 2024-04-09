import { Component, OnInit,ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterHrmsService } from 'src/app/hrms/master-hrms.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-employee-family-info',
  templateUrl: './employee-family-info.component.html',
  styleUrls: ['./employee-family-info.component.scss']
})
export class EmployeeFamilyInfoComponent implements OnInit {
  @ViewChild('closeButton', { static: false }) closeButton: ElementRef;

  EmpInfoObjects = {
    datafrom: null,
    booleanList: [{ text: "Yes", value: true }, { text: "No", value: false }]
  }
  EmpId:any;
  EmpFamilyDetails:any;
  addingMode: boolean = true;
  RelationshipList:any;

  constructor(private activateroute:ActivatedRoute,private hrmsService:MasterHrmsService,private datePipe: DatePipe,
    private toastr:ToastrService, private spinner : NgxSpinnerService,
   private fb:FormBuilder,private renderer: Renderer2 ) {
    // this.familyInfoForm = this.fb.group({
    //   name: ['', Validators.required],
    //   relationship: ['', Validators.required],
    //   dob:['', Validators.required],
    //   no:['', [Validators.required,  Validators.pattern("[0-9]+")]],

    // });

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
    // this.getEmpRoleValidation();
    this.activateroute.queryParams.subscribe((params) => {
      // let id: any = params.get('data')
      console.log("summary call", params)
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
    this.spinner.show();
   this.hrmsService.getEmpDetails(this.EmpId).subscribe(results => {
    this.spinner.hide();
     this.EmpBasicDetails = results;
     // this.EmpBankDetails.reverse();
     console.log("basic details", results)
     console.log("acc type details", this.EmpBasicDetails)
   }
   )
 }
  // Emprole:any;

  // getEmpRoleValidation(){
  //   this.hrmsService.getEmployeeRoleValidation().subscribe(results => {
  //     this.Emprole = results;
  //     // this.EmpBankDetails.reverse();
  //     console.log("role validation", results)
  //     console.log("role validation", this.Emprole.hr_admin)
  //   }
  //   )
  // }

  getRelationshipDropdown() {
    this.hrmsService.getrelationship('relationship')
      .subscribe(results => {
        console.log(results)
        this.RelationshipList = results['data']
      })

  }
  
  formatDate(date: any): string {
    const formattedDate = this.datePipe.transform(date, 'MMM dd yyyy');
    return formattedDate || ''; 
  }

  selectedId:any
  onSelectionChange(event: any): void {
    const selectedText = event.value.id;
    // this.selectedId = this.RelationshipList.find(rel => rel.text === selectedText)?.id;
    this.selectedId=event.value
    console.log('Selected ID:', this.selectedId);
  }

  getEmpFamilyDetails(){
    this.spinner.show();
    this.hrmsService.getEmpFamilyInfoNew(this.EmpId)
    .subscribe(results => {
      if(results.code)
      {
        this.spinner.hide();
        this.toastr.error(results.code)
      }
      else
      {
      this.spinner.hide();
      this.EmpFamilyDetails = results['familyinfo'];
      this.EmpFamilyDetails.reverse();
      // this.EmpBankDetails.reverse();
      console.log("all family details", results)
      console.log("family details", this.EmpFamilyDetails)
      }
    });
  
  }
  formattedPostDate:any;
  formatPostDate(date: string): string {
    this.formattedPostDate = this.datePipe.transform(new Date(date), 'yyyy-MM-dd');
    return this.formattedPostDate || ''; // Handle the case when formatting fails
  }
  formattedDate: string = this.formatPostDate('Thu Nov 16 2023 00:00:00 GMT+0530 (India Standard Time)');
  selectedItem: any;
  editId:any
  relationshipId:any;
  editRow(item: any) {
    const timestamp = item.dob;
    const dateObject = new Date(timestamp);
    
    console.log(dateObject);
    this.editId=item.id
    this.addingMode = false;
    this.selectedItem = item;
    console.log("all patch items", item)
    console.log("relationship", item.relationship.text)
    const relationshipValue = this.RelationshipList.find(rel => rel.text === item.relationship.text)?.text;
    // this.relationshipId = this.RelationshipList.find(rel => rel.id === item.relationship.id)?.id;

console.log("relarion edit id",this.relationshipId)
    console.log("edit id", item.id)
this.familyInfoForm.patchValue({
  name: item.name,
  relationship:item.relationship.id,
   dob: dateObject,
  no: item.mobile_no,
})

this.selectedId=item.relationship.id
this. getRelationshipDropdown();
  }

  onUpdate() {

    if(this.familyInfoForm.value.name == '' || this.familyInfoForm.value.name == null ||  this.familyInfoForm.value.name ==undefined)
    { 
      this.toastr.error("Please Enter Name");
      return false;
    }
    if(this.familyInfoForm.value.relationship == '' || this.familyInfoForm.value.relationship == null || this.familyInfoForm.value.relationship == undefined)
    {
      this.toastr.error("Please select Relationship");
      return false;
    }
    if(this.familyInfoForm.value.no == '' || this.familyInfoForm.value.no == null ||  this.familyInfoForm.value.no ==undefined)
    { 
      this.toastr.error("Please Enter Contact Number");
      return false;
    }
    if(this.familyInfoForm.value.no.length < 10)
    { 
      this.toastr.error("Please Enter Valid Phone Number");
      return false;
    }
    // const dobDate = this.familyInfoForm.value.dob; 
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    // const formattedDOB = dobDate.toLocaleDateString('en-US', options);
    // const formattedDOBl = formattedDOB; 
    // const dateParts = formattedDOBl.split('/');
    // const rearrangedDate = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`;    
    
    if (this.familyInfoForm.valid)  {

      const formIntoJson = {
        name: this.familyInfoForm.value.name || null,
        relationship:this.selectedId|| null,
      mobile_no:this.familyInfoForm.value.no|| null,
      is_emcp:false,
      id:this.editId
      };
    const jsonData = JSON.stringify([formIntoJson]);
    console.log("json data to add id", jsonData)
    this.spinner.show();
    this.hrmsService.postEmployeeFamilyInfoNew(this.EmpId, jsonData).subscribe(
      (response) => {
        this.spinner.hide();
        console.log('Successfully posted family info:', response);
        this.toastr.success('Successfully posted family info');
        this.getEmpFamilyDetails();
        this.renderer.selectRootElement(this.closeButton.nativeElement).click();
      },
      (error) => {
        this.spinner.hide();
        console.error('Error while posting family info:', error);
        this.toastr.error('Error while posting family info');
        this.renderer.selectRootElement(this.closeButton.nativeElement).click();

      }
    );
  } else {
    console.log("not valid");
    this.toastr.warning('All details need to be filled');
  }
}


  onSave(){
    if(this.familyInfoForm.value.name == '' || this.familyInfoForm.value.name == null ||  this.familyInfoForm.value.name ==undefined)
    { 
      this.toastr.error("Please Enter Name");
      return false;
    }
    if(this.familyInfoForm.value.relationship == '' || this.familyInfoForm.value.relationship == null || this.familyInfoForm.value.relationship == undefined)
    {
      this.toastr.error("Please select Relationship");
      return false;
    }
    if(this.familyInfoForm.value.no == '' || this.familyInfoForm.value.no == null ||  this.familyInfoForm.value.no ==undefined)
    { 
      this.toastr.error("Please Enter Contact Number");
      return false;
    }
    if(this.familyInfoForm.value.no.length < 10)
    { 
      this.toastr.error("Please Enter Valid Phone Number");
      return false;
    }

   if (this.familyInfoForm.valid ) {
      // const dobDate = this.familyInfoForm.value.dob; 
const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
// const formattedDOB = dobDate.toLocaleDateString('en-US', options);
// const formattedDOBl = formattedDOB;
// const dateParts = formattedDOBl.split('/');
// const rearrangedDate = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`;
    const formIntoJson = {
      name: this.familyInfoForm.value.name || null,
      relationship:this.selectedId|| null,
     dob: ''|| null,
    phone_no:this.familyInfoForm.value.no|| null,
    mobile_no:this.familyInfoForm.value.no|| null,

    };
    const jsonData = JSON.stringify([formIntoJson]);
    // let dobs = this.datePipe.transform(this.familyInfoForm.get('dob').value, "yyyy-MM-dd")
    console.log("JSON Data:", jsonData);
    let payload =[ {
      "name": this.familyInfoForm.get('name').value,
      "relationship": this.familyInfoForm.get('relationship').value,
      "mobile_no":  this.familyInfoForm.get('no').value,
      // "phone_no":  this.familyInfoForm.get('no').value,
      "is_emcp": false,

    }]
    this.spinner.show();
    this.hrmsService.postEmployeeFamilyInfoNew(this.EmpId, payload).subscribe(
      (response) => {
        this.spinner.hide();
        console.log('Successfully posted family info:', response);
        this.toastr.success('Successfully posted family info');
        this.getEmpFamilyDetails();
        this.renderer.selectRootElement(this.closeButton.nativeElement).click();


        // location.reload();
      },
      (error) => {
        this.spinner.hide();
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
     console.log("not valid");
      this.toastr.warning('All details needed to be filled');
     }
}


deleteBankRecord(recordId: number) {
  if (confirm('Are you sure you want to delete this family member record?')) {
    this.hrmsService.deleteEmergencyRecord(recordId, this.EmpId).subscribe(
      (response) => {
        console.log('Bank record deleted:', response);
        this.toastr.success("Bank record deleted successfully")
        this.getEmpFamilyDetails();
        // window.location.reload();
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

    console.log("employee data ", res)
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
  console.log(letter) 
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
