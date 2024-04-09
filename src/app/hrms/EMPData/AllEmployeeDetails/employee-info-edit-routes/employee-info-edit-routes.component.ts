import { Component, OnInit,ElementRef,ViewChild,Renderer2,AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';

import { MasterHrmsService } from 'src/app/hrms/master-hrms.service'; // Adjust the path
import { Subscription } from 'rxjs';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { SharedService } from 'src/app/service/shared.service';



@Component({
  selector: 'app-employee-info-edit-routes',
  templateUrl: './employee-info-edit-routes.component.html',
  styleUrls: ['./employee-info-edit-routes.component.scss'],

})
export class EmployeeInfoEditRoutesComponent implements OnInit{

  EmpInfoObjects={
    datafrom: null,
    booleanList : [{text: "Yes", value: true}, {text: "No", value: false}] 
  }
  EmpObjects = {
    employeeList: null, 
    employeeFirstLetter: null,
    ActivityStatus: null,
    TimeLogList: null,
    empId: null,
    pendingCounts: null   
  }  
  isLinear = false;
  EmpId: any
  isEducationStepDisabled: boolean = true;
  Tran_Menu_List:any;
  returnnav: number;
  isShowEmployeeInfo: boolean;
  isShowAddress: boolean;
  isShowEducation: boolean;
  isShowExperience: boolean;
  isShowFamily: boolean;
  isShowEmergency: boolean;
  isShowInsurance: boolean;
  isShowbank: boolean;
  isShowDocuments: boolean;



  constructor(private activateroute: ActivatedRoute,private router: Router,private renderer: Renderer2,private hrmsService:MasterHrmsService,
    private shareservice: SharedService,) { 

  }


  includeEducationStep: boolean = false;

  currentStepIndex: number = 0;

  logStepIndex(event: any): void {
    this.currentStepIndex = event.selectedIndex;
  }
educationNo:any;
  navigateToEmployeeEducation() {
    this.router.navigate(['/hrms/employeeInfoRoutes', 'employee-education'], {
      queryParams: { id: this.EmpId , datafrom: 'empview' }
    });
this.educationNo=1
  }
 

  navigateToEmployeeExperience() {
    this.router.navigate(['/hrms/employeeInfoRoutes', 'employee-experience'], {
      queryParams: { id: this.EmpId , datafrom: 'empview' }
    });
  }

  navigateToEmployeeBankDetails() {
    this.router.navigate(['/hrms/employeeInfoRoutes', 'employee-bank-details'], {
      queryParams: { id:this.EmpId , datafrom: 'empview' }
    });
  }
 
  navigateToEmployeeDocuments() {
    this.router.navigate(['/hrms/employeeInfoRoutes', 'employee-documents'], {
      queryParams: { id:this.EmpId , datafrom: 'empview' }
    });
  }

  navigateToEmployeeFamilyInfo() {
    this.router.navigate(['/hrms/employeeInfoRoutes', 'employee-family-info'], {
      queryParams: { id:this.EmpId , datafrom: 'empview' }
    });
  }
 
  ngOnInit(): void {

  //   this..saveSuccess.subscribe(() => {
  //     this.stepper.selectedIndex = 1; // Navigate to the second step
  //   });
  // }

    //setting up id to get the values
    this.activateroute.queryParams.subscribe((params)=>{
      // let id: any = params.get('data')
      this.EmpInfoObjects.datafrom = params['datafrom']; 
      this.EmpId =  params['id'];  
    })
    this.getEmployeeBasicDetails();

    this.Tran_Menu_List = ['Employee Info', 'Address', 'Education', 'Experience', 'Family Details', 'Emergency Contact','Bank','Documents' ]

    


  }
  EmpBasicDetails:any;
  getEmployeeBasicDetails(){
    this.hrmsService.getEmpDetails(this.EmpId).subscribe(results => {
      this.EmpBasicDetails = results;
    }
    )
  }

  isStepActive(index: number): boolean {
    return this.currentStepIndex === index;
  }

  subModuleData(submodule) {
 
    if (submodule == "Employee Info") {
      this.isShowEmployeeInfo = true;
      this.isShowAddress = false;
      this.isShowEducation = false;
      this.isShowExperience = false;
      this.isShowFamily = false;
      this.isShowEmergency = false;
      this.isShowInsurance = false;
      this.isShowbank = false;
      this.isShowDocuments = false;


    }
    if (submodule == "Address") {
      this.isShowEmployeeInfo = false;
      this.isShowAddress = true;
      this.isShowEducation = false;
      this.isShowExperience = false;
      this.isShowFamily = false;
      this.isShowEmergency = false;
      this.isShowInsurance = false;
      this.isShowbank = false;
      this.isShowDocuments = false;
    }

    if (submodule == "Education") {
      this.isShowEmployeeInfo = false;
      this.isShowAddress = false;
      this.isShowEducation = true;
      this.isShowExperience = false;
      this.isShowFamily = false;
      this.isShowEmergency = false;
      this.isShowInsurance = false;
      this.isShowbank = false;
      this.isShowDocuments = false;

    }
    if (submodule == "Experience") {
      this.isShowEmployeeInfo = false;
      this.isShowAddress = false;
      this.isShowEducation = false;
      this.isShowExperience = true;
      this.isShowFamily = false;
      this.isShowEmergency = false;
      this.isShowInsurance = false;
      this.isShowbank = false;
      this.isShowDocuments = false;

    }
    if (submodule == "Family Details") {
      this.isShowEmployeeInfo = false;
      this.isShowAddress = false;
      this.isShowEducation = false;
      this.isShowExperience = false;
      this.isShowFamily = true;
      this.isShowEmergency = false;
      this.isShowInsurance = false;
      this.isShowbank = false;
      this.isShowDocuments = false;

    }
    if (submodule == "Emergency Contact") {
     
      this.isShowEmployeeInfo = false;
      this.isShowAddress = false;
      this.isShowEducation = false;
      this.isShowExperience = false;
      this.isShowFamily = false;
      this.isShowEmergency = true;
      this.isShowInsurance = false;
      this.isShowbank = false;
      this.isShowDocuments = false;
    }
    if (submodule == "Insurance") {
      this.isShowEmployeeInfo = false;
      this.isShowAddress = false;
      this.isShowEducation = false;
      this.isShowExperience = false;
      this.isShowFamily = false;
      this.isShowEmergency = false;
      this.isShowInsurance = true;
      this.isShowbank = false;
      this.isShowDocuments = false;

    }
    if (submodule == "Bank") {
      this.isShowEmployeeInfo = false;
      this.isShowAddress = false;
      this.isShowEducation = false;
      this.isShowExperience = false;
      this.isShowFamily = false;
      this.isShowEmergency = false;
      this.isShowInsurance = false;
      this.isShowbank = true;
      this.isShowDocuments = false;
    }
    if (submodule == "Documents") {
      this.isShowEmployeeInfo = false;
      this.isShowAddress = false;
      this.isShowEducation = false;
      this.isShowExperience = false;
      this.isShowFamily = false;
      this.isShowEmergency = false;
      this.isShowInsurance = false;
      this.isShowbank = false;
      this.isShowDocuments = true;

    }
    

  }
  
}
