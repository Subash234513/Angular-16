import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'
import { AttendanceService } from '../../attendance.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PayingempService } from 'src/app/payingemployee/payingemp.service';
import { MasterHrmsService } from '../../master-hrms.service';

interface interfaceDatas {
  id: string;
  name: string;
  code: string;
  full_name: string; 
}
export interface department {
  id: string;
  name: string;
}


@Component({
  selector: 'app-hr-update-emp-create',
  templateUrl: './hr-update-emp-create.component.html',
  styleUrls: ['./hr-update-emp-create.component.scss'],
  providers: [imp.HrmsAPI, imp.Master, imp.Userserv,
  { provide: imp.DateAdapter, useClass: imp.PickDateAdapter },
  { provide: imp.MAT_DATE_FORMATS, useValue: imp.PICK_FORMATS }]
})
export class HRUpdateEMPCreateComponent implements OnInit {
  DropGrade: any;
  employeetypelist: any;
  workmodeList: any[];
  esiNumber: string;

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private attendanceService: AttendanceService, private shareService: imp.SharedService, private hrmsapi: imp.HrmsAPI,private hrmsService: MasterHrmsService,
    private apicall: ApicallserviceService, private masterApi: imp.Master, private userservApi: imp.Userserv,private notification: NotificationService,private paying:PayingempService,
  ) { }

  Emp_Create_Form: FormGroup; 
  bank_branchlist: Array<any> = [];
  showBank: boolean = false 
  HR_empCreate = {
    genderList: [{id: 1, text: 'Male'}, {id: 2, text: 'Female'}, {id: 3, text: 'Others'}],
    designationList: null,
    branchList: null,
    ccdatalist: null,
    bsdatalist: null, 
    teamldList: null,
    shift_time: null,
    banklist: null, 
    bankbranchlist: null, 
    datafrom: null ,
    roleList:null
  }

  ngOnInit(): void {
    this.Emp_Create_Form = this.fb.group({
     
      email_id: [null,[ Validators.email]],
      phone_no: [null,[Validators.pattern(/^[0-9]{0,10}$/)]], 
      full_name: [null,[Validators.required]], 
      dob: [null],
      doj: [null,[Validators.required]],
      gender: [null,[Validators.required]],
      designation: null,
      branch_id: null,
      employee_branch_id: null,
      bs_id: null,
      cc_id: null,
      functional_head_id: null,
      shift_id: [null,[Validators.required]],
      account_name: null,
      bank_id: null,
      bank_branch: null,
      account_no: null,
      ifsc: null,
      role:null,
      Grade_id:null,
      department_id:'',
      workmode:'',
      Pan_no:'',
      Esi:'',
      UAN:'',
      PfNo:'',
      aadhar_number:'',


    })

    this.shiftTime() 
    this.getrole() 
    this.GradeDrop()
    this.getWorkMode()
  }
 
  // {
  //   "full_name": "abarna",
  //   "doj": "2023-11-01",
  //   "designation": "developer",
  //   "branch_id": 1,
  //   "employee_branch_id": 1,
  //   "cc_id": 1,
  //   "bs_id": 1,
  //   "functional_head_id": 1,
  //   "shift_id": 3,
  //   "bank": {
  //       "account_name":"abarna",
  //       "bank_id": 123,
  //       "bank_branch": "kotak",
  //       "account_no": 123435476,
  //       "ifsc": "HDFC0009217"
  //       },
  //   "code":"emp318",
  //   "phone_no":987654310,
  //   "email_id":"aravind@123",
  //   "gender":1,
  //   "dob":"2023-12-01"
  // }


  getdesignation(data) {
    let page = 1  
    this.apicall.ApiCall('get', this.masterApi.masters.designation+data +"&page="+page).subscribe(data => {
      this.HR_empCreate.designationList = data['data'];
    });
  }

  getdatadesignation(data?: interfaceDatas): string | undefined {
    return data ? data.name : undefined;
  } 


  getbranchsdata(data) { 
    let page = 1  
    this.apicall.ApiCall('get', this.userservApi.userserv.branch+data +"&page="+page).subscribe(data => {
      this.HR_empCreate.branchList = data['data'];
    });

  }

  getdatabranch(data?: interfaceDatas): string | undefined {
    return data ? data.name : undefined;
  } 


 ///////// BS CC
 
  getbsdata(data) {
    let bssearch: any = data
    this.attendanceService.getBS(bssearch, 1).subscribe(data => {
      this.HR_empCreate.bsdatalist = data['data'];
    });
  }
  getccdata( cc) {
 
    this.attendanceService.getCC( cc, 1).subscribe(data => {
      this.HR_empCreate.ccdatalist = data['data'];
    });

  }


  displayFnbs_id(data?: interfaceDatas): string | undefined {
    return data ? data.name : undefined;
  }
  displayFncc(data?: interfaceDatas): string | undefined {
    return data ? data.name : undefined;
  } 

  // taskserv/search_team_lead?query= 



  getTeamLead(teamldkeyvalue) {
    this.attendanceService.getTeamLead(teamldkeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.HR_empCreate.teamldList = datas;
      })
  }
  
  public displayFnteamld(teamld?: interfaceDatas): string | undefined {
    return teamld ? teamld.full_name : undefined;
  }


  shiftTime() {
    this.apicall.ApiCall("get", this.hrmsapi.HRMS_API.api.shift).subscribe(result => {
      this.HR_empCreate.shift_time = result['data']; 
    }) 
  } 


  getbank(data) { 
    console.log("bank search key", data)
    this.apicall.ApiCall('get', this.masterApi.masters.bank+data)
    .subscribe(res=>{
      this.HR_empCreate.banklist = res['data']  
    })
 
  }

  getBankBranch(bid){ 
    this.HR_empCreate.bankbranchlist = [] 
    console.log("bank search key", bid) 
    this.apicall.ApiCall('get', this.masterApi.masters.bankbranch+bid)
    .subscribe(res=>{
      this.HR_empCreate.bankbranchlist = res['bankbranch']  
    })
 
  }


  // getbank_branchdata(bankId, index?:any ) {
  //   console.log("bank data for branch list", bankId) 
  //   this.bank_branchlist = [] 
  //   if(bankId == '' || bankId == null || bankId == undefined){ 
  //     return false 
  //   }
  //   this.apicall.ApiCall('get', this.masterApi.masters.bankbranch+bankId?.id)
  //   .subscribe(res=>{
  //     this.bank_branchlist.push(res.bankbranch) 
  //   }) 
  // }

 

  getbankinterface(data?: interfaceDatas): string | undefined {
    return data ? data.name : undefined;
  }
  getbank_branchinterface(data?: interfaceDatas): string | undefined {
    return data ? data.name : undefined;
  }






  // [disabled]="Emp_Create_Form.invalid"


  EMP_Create_Submit(){
    this.SpinnerService.show()
    if(this.Emp_Create_Form.value.full_name==='' || this.Emp_Create_Form.value.full_name===null){
      this.notification.showError('Please Enter Name')
      this.SpinnerService.hide()
    }
    else if(this.Emp_Create_Form.value.doj==='' || this.Emp_Create_Form.value.doj===null){
      this.notification.showError('Please Select DOJ')
      this.SpinnerService.hide()
    }
    else if(this.Emp_Create_Form.value.dob==='' || this.Emp_Create_Form.value.dob===null){
      this.notification.showError('Please Select DOB')
      this.SpinnerService.hide()
    }
    else if(this.Emp_Create_Form.value.gender==='' || this.Emp_Create_Form.value.gender===null){
      this.notification.showError('Please Select Gender')
      this.SpinnerService.hide()
    }
    else if(this.Emp_Create_Form.value.designation==='' || this.Emp_Create_Form.value.designation===null){
      this.notification.showError('Please Select designation')
      this.SpinnerService.hide()
    }
    else if(this.Emp_Create_Form.value.branch_id==='' || this.Emp_Create_Form.value.branch_id===null){
      this.notification.showError('Please Select Reporting Branch')
      this.SpinnerService.hide()
    }
    else if(this.Emp_Create_Form.value.employee_branch_id==='' || this.Emp_Create_Form.value.employee_branch_id===null){
      this.notification.showError('Please Select Deployed Branch')
      this.SpinnerService.hide()
    }
    else if(this.Emp_Create_Form.value.functional_head_id==='' || this.Emp_Create_Form.value.functional_head_id===null){
      this.notification.showError('Please Select Functional Head')
      this.SpinnerService.hide()
    }
    else if(this.Emp_Create_Form.value.email_id==='' || this.Emp_Create_Form.value.email_id===null){
      this.notification.showError('Please Enter Mail Id')
      this.SpinnerService.hide()
    }
    else if(this.Emp_Create_Form.value.phone_no==='' || this.Emp_Create_Form.value.phone_no===null){
      this.notification.showError('Please Enter Phone No')
      this.SpinnerService.hide()
    }
    else if(this.Emp_Create_Form.value.role==='' || this.Emp_Create_Form.value.role===null){
      this.notification.showError('Please Select Role')
      this.SpinnerService.hide()
    }
    else if(this.Emp_Create_Form.value.shift_id==='' || this.Emp_Create_Form.value.shift_id===null){
      this.notification.showError('Please Select Shift')
      this.SpinnerService.hide()
    }
    else if(this.Emp_Create_Form.value.bs_id==='' || this.Emp_Create_Form.value.bs_id===null){
      this.notification.showError('Please Select BS')
      this.SpinnerService.hide()
    }
    else if(this.Emp_Create_Form.value.cc_id==='' || this.Emp_Create_Form.value.cc_id===null){
      this.notification.showError('Please Select CC')
      this.SpinnerService.hide()
    }
    else{
      let EmpData = this.Emp_Create_Form.value 


      let consoleerrors = this.Emp_Create_Form.controls 
      let consoleerrorsone = this.Emp_Create_Form 
  
      console.log(consoleerrors, consoleerrorsone) 
  
  
  
  
      let obj = {
         "role":EmpData.role,
        "email_id": EmpData.email_id, 
        "phone_no":  EmpData.phone_no, 
        "full_name":  EmpData.full_name, 
        "dob":  EmpData.dob, 
        "doj":  EmpData.doj, 
        "gender":  EmpData.gender, 
        "designation":  EmpData.designation == null ? null : EmpData.designation == '' ? null : EmpData.designation?.id, 
        "branch_id":  EmpData.branch_id == null ? null : EmpData.branch_id =='' ? null : EmpData.branch_id?.id, 
        "employee_branch_id":  EmpData.employee_branch_id == null ? null : EmpData.employee_branch_id == '' ? null : EmpData.employee_branch_id?.id, 
        "bs_id":  EmpData.bs_id == null ? null :  EmpData.bs_id == '' ? null : EmpData.bs_id?.id, 
        "cc_id":  EmpData.cc_id == null ? null : EmpData.cc_id == '' ? null : EmpData.cc_id?.id, 
        "functional_head_id":  EmpData.functional_head_id == null ? null : EmpData.functional_head_id == '' ? null : EmpData.functional_head_id?.id, 
        "shift_id":  EmpData.shift_id, 
        'grade':EmpData.Grade_id,
        'department_id': EmpData.department_id.id,
        'work_mode': EmpData.workmode,
        'pan_number':EmpData.Pan_no,
        'uan_number':EmpData.UAN,
        'esi_number':EmpData.Esi,
        'aadhar_number':EmpData.aadhar_number,
        'pf_number':EmpData.PfNo
        
      }
      if(this.showBank){ 
        let bankObj = {"bank": {
          "account_name":  EmpData.account_name, 
          "bank_id":  EmpData.bank_id == null ? null : EmpData.bank_id == '' ? null  : EmpData.bank_id?.id, 
          "bank_branch": EmpData.bank_branch == null ? null : EmpData.bank_branch == '' ? null : EmpData.bank_branch?.id, 
          "account_no":  EmpData.account_no, 
          "ifsc":  EmpData.ifsc, 
        }}
        obj = Object.assign(obj, bankObj )
      }else{
        obj = Object.assign(obj, {bank : null } )
      }
  
  
      this.apicall.ApiCall("post", this.hrmsapi.HRMS_API.api.EmployeeCreate, obj) 
      .subscribe(res=>{
        if(res.code){
          this.notification.showError(res.description)
          this.SpinnerService.hide()
        }
        else{
        
          this.notification.showSuccess(res.message)
          this.SpinnerService.hide()
          this.Emp_Create_Form.reset()
          this.router.navigate(['/hrms/hrmsview/empsummary'])
          
        }
      })
    }
   
  }









 
  backToSummary(){
    // if(this.HR_empCreate.datafrom == 'adminview'){
      this.router.navigate(['/hrms/hrmsview/empsummary'])

    // }
  }
  getrole() {
    this.attendanceService.getrole()
      .subscribe((results: any[]) => {
        let datas = results;
        this.HR_empCreate.roleList = datas;
      })
  }
  GradeDrop(){
    this.paying.searchGrades('',1).subscribe(data=>{
      this.DropGrade=data['data']
    })
  }
  getEmployeedepartmentdata(data) {
    let dataEmp = data
    this.hrmsService.getlistdepartment(dataEmp, 1).subscribe(results => {
      this.employeetypelist = results['data'];
    })
  }

  getdepartmentinterface(data?: department): string | undefined {
    return data && data.name ? data.name : '';

  }
  getWorkMode() {
    this.paying.getWorkModeApi()
      .subscribe((results: any[]) => {
        let datas = results;
        this.workmodeList = datas;
      })
  }
  onPanInput(event: any) {
    const input = event.target.value.toUpperCase();
    const isValidChar = (char: string, position: number) => {
      if (position < 5) {
        return /^[a-zA-Z]*$/.test(char);
      } else if (position < 9) {
        return /^[0-9]*$/.test(char);
      }
      else if (position < 10) {
        return /^[a-zA-Z]*$/.test(char);
      }
      return true;
    };

    const newValue = input
      .split('')
      .filter((char, index) => isValidChar(char, index))
      .join('');
    

    event.target.value = newValue;
  }

  formatEsiNumber(value: string) { 
    const numericValue = value.replace(/\D/g, '');
    this.esiNumber = numericValue.replace(/^(\d{2})(\d{2})(\d{7})(\d{3})(\d{4})$/, "$1-$2-$3-$4-$5");
  }

  formatEsi(value: string) {
    const cleanedValue = value.replace(/\D/g, '');
    let formattedValue = '';
    for (let i = 0; i < cleanedValue.length; i++) {
      if (i === 2 || i === 4 || i === 11 || i === 14) {
        formattedValue += '-';
      }
      formattedValue += cleanedValue[i];
    }
    return formattedValue;
  }

  onUANInput(event: any) {
    const input = event.target.value.toUpperCase();
    const isValidChar = (char: string, position: number) => {
    if (position < 12) {
        return /^[0-9]*$/.test(char);
      }
      return true;
    };
  
    const newValue = input
      .split('')
      .filter((char, index) => isValidChar(char, index))
      .join('');

    event.target.value = newValue;
  }

  onAadhaarInput(event:any){
    const input = event.target.value.toUpperCase();
    const isValidChar = (char: string, position: number) => {
    if (position < 15) {
        return /^[0-9]*$/.test(char);
      }
      return true;
    };
  
    const newValue = input
      .split('')
      .filter((char, index) => isValidChar(char, index))
      .join('');
  
    const formattedValue = this.formatAdhaar(newValue);
    event.target.value = formattedValue;
  }
  formatAdhaar(value: string) {
    // Remove any non-digit or non-letter characters
    const cleanedValue = value.replace(/[^A-Za-z0-9]/g, '');
    // Add slashes at appropriate positions
    let formattedValue = '';
    for (let i = 0; i < cleanedValue.length; i++) {
      if (i === 4 || i === 8 || i === 12 ) {
        formattedValue += '-';
      }
      formattedValue += cleanedValue[i];
    }
    return formattedValue;
  }

  onPfInput(event: any) {
    const input = event.target.value.toUpperCase();
    const isValidChar = (char: string, position: number) => {
      if (position < 6) {
        return /^[a-zA-Z]*$/.test(char);
      } else if (position < 27) {
        return /^[0-9]*$/.test(char);
      }
      return true;
    };
  
    const newValue = input
      .split('')
      .filter((char, index) => isValidChar(char, index))
      .join('');
  
    const formattedValue = this.formatPf(newValue);
    event.target.value = formattedValue;
  }
  
  formatPf(value: string) {
    // Remove any non-digit or non-letter characters
    const cleanedValue = value.replace(/[^A-Za-z0-9]/g, '');
    // Add slashes at appropriate positions
    let formattedValue = '';
    for (let i = 0; i < cleanedValue.length; i++) {
      if (i === 2 || i === 5 || i === 12 || i === 15) {
        formattedValue += '/';
      }
      formattedValue += cleanedValue[i];
    }
    return formattedValue;
  }

}
