import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'
import { AttendanceService } from '../../attendance.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import { PayingempService } from 'src/app/payingemployee/payingemp.service';
import { MasterHrmsService } from '../../master-hrms.service';
import { E } from '@angular/cdk/keycodes';
import { NotificationService } from 'src/app/service/notification.service';

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
  selector: 'app-hr-update-emp-basic-details',
  templateUrl: './hr-update-emp-basic-details.component.html',
  styleUrls: ['./hr-update-emp-basic-details.component.scss'],
  providers: [imp.HrmsAPI, imp.Master, imp.Userserv,
  { provide: imp.DateAdapter, useClass: imp.PickDateAdapter },
  { provide: imp.MAT_DATE_FORMATS, useValue: imp.PICK_FORMATS }]
})
export class HRUpdateEMPBasicDetailsComponent implements OnInit {
  DropGrade: any;
  workmodeList: any[];
  employeetypelist: any;
  esiNumber: string;

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private attendanceService: AttendanceService, private shareService: imp.SharedService, private hrmsapi: imp.HrmsAPI,
    private apicall: ApicallserviceService, private masterApi: imp.Master, private userservApi: imp.Userserv,
     private activateroute : ActivatedRoute,private paying:PayingempService,private hrmsService: MasterHrmsService,private notification:NotificationService
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
    datafrom: null,
    EmpId: null,
    roleList:null 
  }

  statusList: any;

  ngOnInit(): void {
    this.Emp_Create_Form = this.fb.group({ 
      full_name: [null,[Validators.required]],  
      doj: [null,[Validators.required]], 
      designation: null,
      branch_id: null,
      employee_branch_id: null,
      bs_id: null,
      cc_id: null,
      functional_head_id: null,
      shift_id: [null,[Validators.required]],
      Grade_id:null,
      workmode:'',
      id: '',
      department_id:'',
      role:'',
      noticeperiod:'',
      pan_number:'',
      esi_number:'',
      uan_number:'',
      aadhar_number:'',
      pf_number:'',
      // account_name: null,
      // bank_id: null,
      // bank_branch: null,
      // account_no: null,
      // ifsc: null
    })

    this.activateroute.queryParams.subscribe((params)=>{

      console.log("summary call",params)
      this.HR_empCreate.datafrom = params['datafrom']; 
      this.HR_empCreate.EmpId =  params['id'];  
    })

    this.shiftTime()  
    this.getEmpEdit(this.HR_empCreate.EmpId)
    this.GradeDrop();
    this.getWorkMode() 
    this.getrole();
    this.getEmpStatus();    
  }
 
  

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
 
 

  getbankinterface(data?: interfaceDatas): string | undefined {
    return data ? data.name : undefined;
  }
  getbank_branchinterface(data?: interfaceDatas): string | undefined {
    return data ? data.name : undefined;
  }


  getEmpEdit(id){

    this.apicall.ApiCall('get', this.hrmsapi.HRMS_API.api.Employeeget+id)
    .subscribe(res=>{
      console.log("API Response", res);
      const mss = res.doj;
      const date = new Date(mss);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      const functionHeadCode=res?.functional_head?.code;
      const functinHeadName=res?.functional_head?.name;
      const functionHead={
        full_name: `(${functionHeadCode}) ${functinHeadName}`
      };
    
      [
       
      this.Emp_Create_Form.patchValue({
      full_name: res?.full_name,  
      doj: formattedDate,  
      designation: res?.designation,  
      branch_id: res?.report_branch,  
      employee_branch_id: res?.employee_branch_id,  
      bs_id: res?.businesssegment,  
      cc_id: res?.costcentre,  
      // functional_head_id: res?.functional_head,  
      functional_head_id:functionHead,
      shift_id: res?.shift?.shift_id, 
      Grade_id:res?.grade?.id, 
      workmode:res?.work_mode?.id,
      department_id : res?.department_id,
      id: res?.id,
      role: res?.role?.id,
      noticeperiod : res?.noticeperiod?.id,
      pan_number:res?.pan_number,
      esi_number:res?.esi_number,
      uan_number:res?.uan_number,
      aadhar_number:res?.aadhar_number,
      pf_number:res?.pf_number,
      // account_name: res,  
      // bank_id: res,  
      // bank_branch: res,  
      // account_no: res,  
      // ifsc: res,  
      })
    ]
  })
  

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
    // else if(this.Emp_Create_Form.value.dob==='' || this.Emp_Create_Form.value.dob===null){
    //   this.notification.showError('Please Select DOB')
    //   this.SpinnerService.hide()
    // }
    // else if(this.Emp_Create_Form.value.gender==='' || this.Emp_Create_Form.value.gender===null){
    //   this.notification.showError('Please Select Gender')
    //   this.SpinnerService.hide()
    // }
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
    // else if(this.Emp_Create_Form.value.email_id==='' || this.Emp_Create_Form.value.email_id===null){
    //   this.notification.showError('Please Enter Mail Id')
    //   this.SpinnerService.hide()
    // }
    // else if(this.Emp_Create_Form.value.phone_no==='' || this.Emp_Create_Form.value.phone_no===null){
    //   this.notification.showError('Please Enter Phone No')
    //   this.SpinnerService.hide()
    // }
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

    if(this.Emp_Create_Form.value.doj !== undefined || this.Emp_Create_Form.value.doj !== null || this.Emp_Create_Form.value.doj !== '')  {
      this.Emp_Create_Form.value.doj = '';
    }




    let obj = { 
      "full_name":  EmpData.full_name,  
      "doj":  EmpData.doj,  
      "designation":  EmpData.designation == null ? null : EmpData.designation == '' ? null : EmpData.designation?.id, 
      "branch_id":  EmpData.branch_id == null ? null : EmpData.branch_id =='' ? null : EmpData.branch_id?.id, 
      "employee_branch_id":  EmpData.employee_branch_id == null ? null : EmpData.employee_branch_id == '' ? null : EmpData.employee_branch_id?.id, 
      "bs_id":  EmpData.bs_id == null ? null :  EmpData.bs_id == '' ? null : EmpData.bs_id?.id, 
      "cc_id":  EmpData.cc_id == null ? null : EmpData.cc_id == '' ? null : EmpData.cc_id?.id, 
      "functional_head_id":  EmpData.functional_head_id == null ? null : EmpData.functional_head_id == '' ? null : EmpData.functional_head_id?.id, 
      "shift_id":  EmpData.shift_id, 
      "id" : EmpData?.id,
      'grade': EmpData?.Grade_id,
      'work_mode':EmpData?.workmode,
      'department_id': EmpData.department_id.id,
      'role': EmpData?.role,
      'noticeperiod': EmpData?.noticeperiod, 
      'pf_number':EmpData?.pf_number,
      'esi_number':EmpData?.esi_number,
      'uan_number':EmpData?.uan_number,
      'pan_number':EmpData?.pan_number,
      'aadhar_number':EmpData?.aadhar_number,
      ...(EmpData?.noticeperiod === 5 ? { 'status': 0 } : {})
    }
    // if(this.showBank){ 
    //   let bankObj = {"bank": {
    //     "account_name":  EmpData.account_name, 
    //     "bank_id":  EmpData.bank_id == null ? null : EmpData.bank_id == '' ? null  : EmpData.bank_id?.id, 
    //     "bank_branch": EmpData.bank_branch == null ? null : EmpData.bank_branch == '' ? null : EmpData.bank_branch?.id, 
    //     "account_no":  EmpData.account_no, 
    //     "ifsc":  EmpData.ifsc, 
    //   }}
    //   obj = Object.assign(obj, bankObj )
    // }else{
      obj = Object.assign(obj, {bank : 'hdfc' } )
    // }

    this.SpinnerService.show() 
    this.apicall.ApiCall("post", this.hrmsapi.HRMS_API.api.EmployeeCreate+"/"+obj?.id+"?type=update" , obj) 
    .subscribe(res=>{
      this.SpinnerService.hide() 
      console.log(res)
      if(res?.message == "Successfully Updated" && res?.status == "success"){
        this.backToSummary()
        this.notify.success(res?.message)
      }
    }, error=>{
      this.SpinnerService.hide() 
    })
    }


  }









 
  backToSummary(){
    // if(this.HR_empCreate.datafrom == 'adminview'){
      this.router.navigate(['/hrms/hrmsview/empsummary'])

    // }
  }
  GradeDrop(){
    this.paying.searchGrades('',1).subscribe(data=>{
      this.DropGrade=data['data']
    })
  }
  getWorkMode() {
    this.paying.getWorkModeApi()
      .subscribe((results: any[]) => {
        let datas = results;
        this.workmodeList = datas;
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

  getrole() {
    this.attendanceService.getrole()
      .subscribe((results: any[]) => {
        let datas = results;
        this.HR_empCreate.roleList = datas;
      })
  }
  getEmpStatus() {
    this.attendanceService.getEmpStatusfull()
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.statusList = datas;
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
        formattedValue += '';
      }
      formattedValue += cleanedValue[i];
    }
    return formattedValue;
  }
















}
