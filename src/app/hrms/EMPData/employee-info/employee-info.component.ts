import { Component, EventEmitter, OnInit, Output,ElementRef, ViewChild } from '@angular/core'; 
import { NotificationService } from 'src/app/service/notification.service';
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { MasterHrmsService } from '../../master-hrms.service';
import { SharedHrmsService } from '../../shared-hrms.service';
import { Router, ActivatedRoute, ParamMap,NavigationEnd } from '@angular/router'; 
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'
import { AttendanceService } from '../../attendance.service';
import { DatePipe } from '@angular/common'; 
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import { ToastrService } from '../../../AppAutoEngine/import-services/CommonimportFiles';
declare var $: any; 

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.scss'],
  providers: [imp.HrmsAPI, imp.Master, imp.Userserv,
  { provide: imp.DateAdapter, useClass: imp.PickDateAdapter },
  { provide: imp.MAT_DATE_FORMATS, useValue: imp.PICK_FORMATS }]
})
export class EmployeeInfoComponent implements OnInit {
  @ViewChild('deactivateModal') deactivateModal: ElementRef;

  constructor(private fb: FormBuilder, private notify: NotificationService, 
    private masterHrms: MasterHrmsService, private error: ErrorHandlingServiceService,
     private share: SharedHrmsService, private route: Router, private activateroute: ActivatedRoute, private hrmsapi: imp.HrmsAPI,
     private apicall: ApicallserviceService, private masterApi: imp.Master, private userservApi: imp.Userserv,private toastr:ToastrService){

      // this.route.events.subscribe((event) => {
        
      //   if (event instanceof NavigationEnd) {
      //     if (event.url === '/hrms/hrmsview/empsummary') {
            
      //       this.toastr.success(this.deactivateMsg + " SUCCESSFULLY");
      //       $(this.deactivateModal.nativeElement).modal('hide');

      //       // setTimeout(() => {
      //       //   // this.route.navigate(['/hrms/hrmsview/empsummary'])
              
      //       // }, 3000);
      //     }
      //   }
      // });
     }


  EMP_details_Menu_List: any = [{ name: 'Emp Info', conditionName: "EmpInfo" }, { name: 'Family Info', conditionName: "FamilyInfo" },
  { name: 'Education Info', conditionName: "EducationInfo" }, { name: 'Experience', conditionName: "Experience" },
  { name: 'Bank Details', conditionName: "BankDetails" }, { name: 'Emergency Contact', conditionName: "EmergencyContact" }]

  EmpInfo: boolean = false
  FamilyInfo: boolean = false
  Experience: boolean = false
  BankDetails: boolean = false
  EmergencyContact: boolean = false
  EducationInfo: boolean = false;
  DeactivateEmployee: FormGroup; 
  EmpId: any
  adminValidation: boolean = false 

  











  EmpInfoObjects={
    datafrom: null,
    booleanList : [{text: "Yes", value: true}, {text: "No", value: false}] 
  }

  @Output() backToSummary = new EventEmitter<any>();
  EMPNAME: any 
  ngOnInit(): void {


    this.DeactivateEmployee = this.fb.group({
      "reg_notice_date":"",
      "exit_date":"",
      "buy_back":"",
      "notice_period_served":"",
      "reason":"",
      // "manager_remarks":"" 
    })
 

    // let dataToView: any = this.share.employeeview.value
    // console.log("share data", dataToView)
    // this.EMPNAME = dataToView.data.full_name 
    // this.EmpId = dataToView?.id

    this.activateroute.queryParams.subscribe((params)=>{
      // let id: any = params.get('data')
      console.log("summary call",params)
      this.EmpInfoObjects.datafrom = params['datafrom']; 
      this.EmpId =  params['id'];  
      // if(this.EmpInfoObjects.datafrom == 'empview'){
        
      // }
      

    })

    this.getEmpBasicInfo()
    this.getEmpFamilyInfo()
    this.getEmpEducationInfo()
    this.getEmpExperienceInfo()
    this.getEmpBankDetailsInfo()
    this.getEmpEmerencyContactInfo()
    this.adminviewbtn() 


  }


  getData(data) {
    console.log("data for get api call", data)
    if (data?.conditionName == 'EmpInfo') {
      this.getEmpBasicInfo()
    }
    if (data?.conditionName == 'FamilyInfo') {
      this.getEmpFamilyInfo()
    }
    if (data?.conditionName == 'EducationInfo') {
      this.getEmpEducationInfo()
    }
    if (data?.conditionName == 'Experience') {
      this.getEmpExperienceInfo()
    }
    if (data?.conditionName == 'BankDetails') {
      this.getEmpBankDetailsInfo()
    }
    if (data?.conditionName == 'EmergencyContact') {
      this.getEmpEmerencyContactInfo()
    }

  }

  BasicInfoEmp: any
  EmpEducationInfo: any
  EmpFamilyInfo: any
  EmpExperienceInfo: any
  EmpBankDetailsInfo: any
  EmpEmerencyContactInfo: any

  getEmpBasicInfo() {
    this.masterHrms.getEmpBasicInfo(this.EmpId)
      .subscribe(results => {
        this.BasicInfoEmp = results

      })

  }

  getEmpEducationInfo() {
    this.masterHrms.getEmpEducationInfo(this.EmpId)
      .subscribe(results => {
        this.EmpEducationInfo = results['data']
        

      })

  }


  getEmpFamilyInfo() {
    this.masterHrms.getEmpFamilyInfo(this.EmpId)
      .subscribe(results => {
        this.EmpFamilyInfo = results['data']

      })

  }


  getEmpExperienceInfo() {
    this.masterHrms.getEmpExperienceInfo(this.EmpId)
      .subscribe(results => {
        this.EmpExperienceInfo = results['data']

      })

  }

  getEmpBankDetailsInfo() {
    this.masterHrms.getEmpBankDetailsInfo(this.EmpId)
      .subscribe(results => {
        this.EmpBankDetailsInfo = results['data']

      })

  }


  getEmpEmerencyContactInfo() {
    this.masterHrms.getEmpEmerencyContactInfo(this.EmpId)
      .subscribe(results => {
        this.EmpEmerencyContactInfo = results['data']

      })

  }


  subModuleData(details) {
    console.log("details==>", details)
    let dataListMenu = this.EMP_details_Menu_List
    console.log("data for this in component of EMp", this)
    for (let data of dataListMenu) { 
      if (dataListMenu?.length > 0) {
        console.log("details.conditionName == data.conditionName", details.conditionName, data.conditionName)
        if (details.conditionName == data.conditionName) {
          this[data.conditionName] = true
        }
        else {
          this[data.conditionName] = false
        }
      }
    }
  }
  EmployeeDetails: any 

  getEmployee(){
    this.masterHrms.getEmpDetails(this.EmpId)
    .subscribe(results=>{
      this.EmployeeDetails = results

    })
  }




  backtosummary(){
    // this.backToSummary.emit() 
    if(this.EmpInfoObjects.datafrom == 'empview' || this.EmpInfoObjects.datafrom == 'empInfo'){
      this.route.navigate(['/hrms/empdetails'])
    }
    if(this.EmpInfoObjects.datafrom == 'adminview'){
      this.route.navigate(['/hrms/hrmsview/empsummary'])

    }
  }


  RouteToEmployeeCreate(data){
    let obj = {
      routes: true,
      data: data,
      empid: this.EmpId 
    }

    console.log("clicked data", obj)
    // this.route.navigateByUrl['/employeeCreate']
    // this.masterHrms.TypeOfCreateEmp = obj  
    if(this.EmpInfoObjects.datafrom == 'empview'|| this.EmpInfoObjects.datafrom == 'empInfo'){
    this.route.navigate(['hrms/employeeCreate'], {queryParams: {
      routes: true,
      data: data,
      empid: this.EmpId,
      datafrom: 'empInfo' 
    }});
  }

    if(this.EmpInfoObjects.datafrom == 'adminview'){
      this.route.navigate(['hrms/employeeCreate'], {queryParams: {
        routes: true,
        data: data,
        empid: this.EmpId,
        datafrom: 'adminview' 
      }});
    }





  }


  showSuccessMessage = false;
deactivateMsg:any;
  DeactivateEmp(){
    let data = this.DeactivateEmployee.value 

    let dataConfirm = confirm("Are you sure do you want to deactivate?")

    // if(dataConfirm){
    //   this.apicall.ApiCall("post", this.hrmsapi.HRMS_API.api.DeactivateEmployee+"/"+this.EmpId + "?type=deactivate", data)
    //   .subscribe(res=>{
    //     this.route.navigate(['/hrms/hrmsview/empsummary'])
    //     console.log(res.message)
    //     this.toastr.success(res.message + "SUCCESSFULLY")
     
    //     this.route.navigateByUrl(this.route.url);

    //   })
    // }
    if (dataConfirm) {
      this.apicall.ApiCall("post", this.hrmsapi.HRMS_API.api.DeactivateEmployee + "/" + this.EmpId + "?type=deactivate", data)
        .subscribe(res => {
          this.showSuccessMessage = true;
          this.deactivateMsg=res.message;
          console.log("daetivate step1")
          if (this.deactivateModal) {
            $(this.deactivateModal.nativeElement).modal('hide');
          }
      this.route.navigate(['/hrms/hrmsview/empsummary']);
      this.toastr.success(this.deactivateMsg + " SUCCESSFULLY");
      console.log("daetivate step2")


    });
    }
    
  }

  startingNoticePeriod(){

    let dataConfirm = confirm("Are you sure this Employee start serving Notice Period?")

    if(dataConfirm){
      this.apicall.ApiCall("post", this.hrmsapi.HRMS_API.api.EmployeeCreate+"/"+this.EmpId + "?type=noticeperiod", {})
      .subscribe(res=>{
        console.log(res)
        if(res?.message == "EMPLOYEE IN NOTICEPERIOD" && res.status == "success"  ){
          this.notify.showSuccess(res?.message)
        }
      })
    }

    
  }


  adminviewbtn(){

     
      this.apicall.ApiCall("get", this.hrmsapi.HRMS_API.api.AdminViewValidation)
      .subscribe(res=>{
         this.adminValidation = res?.hr_admin
      })
     
  }

}





















