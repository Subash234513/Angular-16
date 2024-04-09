import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MasterHrmsService } from 'src/app/hrms/master-hrms.service';

@Component({
  selector: 'app-employeeinsurance',
  templateUrl: './employeeinsurance.component.html',
  styleUrls: ['./employeeinsurance.component.scss']
})
export class EmployeeinsuranceComponent implements OnInit {

  constructor(private hrmsService:MasterHrmsService) { }
  InsuranceInfoForm=new FormGroup({
    name:new FormControl(''),
    relationship:new FormControl(''),
    age:new FormControl('')

  })
  ngOnInit(): void {
    this.getEmployee()
  }
  get InsName() {
    return this.InsuranceInfoForm.get("name")
  }
  get InsRelation() {
    return this.InsuranceInfoForm.get("relationship")
  }
  get InsDob() {
    return this.InsuranceInfoForm.get("dob")
  }
  get Insno() {
    return this.InsuranceInfoForm.get("age")
  }
  EmpObjects = {
    employeeList: null, 
    employeeFirstLetter: null,
    ActivityStatus: null,
    TimeLogList: null,
    empId: null,
    pendingCounts: null   
  }  
  gettingProfilename(data){
    let name:any = data 
    let letter = name[0]
    console.log(letter) 
    this.EmpObjects.employeeFirstLetter = letter 
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

}
