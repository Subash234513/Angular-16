import { Component, OnInit,Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PayingempService } from '../payingemp.service';
import { PayingempShareService } from '../payingemp-share.service';
import { Subscription } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'app-empdetail-view',
  templateUrl: './empdetail-view.component.html',
  styleUrls: ['./empdetail-view.component.scss']
  // providers: [NotificationComponent,{
  //   provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false, showError: true }
  // }]
})
export class EmpdetailViewComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  lineName1: string;
  lineName2: string;
  lineName3: string;
  pinCode: number
  stateName: string
  cityName: string;
  districtName: string;
  per_lineName1: string;
  per_lineName2: string;
  per_lineName3: string;
  per_pinCode: number
  per_stateName: string
  per_cityName: string;
  per_districtName: string;
  firstname: string;
  middlename: string;
  lastname: string;
  fullname: string;
  approve_status:string
  code: string;
  effective_from: string;
  phoneno: string;
  dob: any;
  doj: string;
  expected_doj: string;
  email: string;
  grade: string;
  gender: string
  designation: string;
  department: string;
  account_no: string;
  entity: string
  functional_head: string;
  emp_branch: string;
  business_segment: string;
  cose_center: string;
  work_mode: string;
  profileBranch: number;
  profileRemarks: string;
  profileFactory: number;
  profileYear: number;
  emp_id:any;
  PreviewAction=2;
  DownloadAction=1;
  popupform:FormGroup;
  generateemail:boolean;
  mailflag:boolean;
  setcolor = 'primary';
  employeeDetails:any;
  payslip_data: any;
  userdata: any;
  is_hide: boolean;
  sal_total: number;
  sal_deductions: number;
  deduction_data: any;
  employeepay_detail: any;
  subscription:Subscription;
  deduction_sum: any;
  amount_total: any;
  bloodgroup: any;
  currDate: Date;
  newDate: any;
  offerDate : any;
  newDates: any;
  totalA : any = 0;
  totalB : any = 0;
  totalC : any = 0;
  totalD : any = 0;
  totals : any = 0;
  takeHome: any = 0;
  globalId : any;
  Payroll=new FormControl(false);
  disabled:boolean;

  
  EmpId: any;
  EmpInfoObjects={
    datafrom: null 
  }
  payroll_date: any;

  constructor(private formBuilder: FormBuilder,private router: Router,private datePipe: DatePipe,
    private SpinnerService: NgxSpinnerService,private errorHandler: ErrorHandlingServiceService,
    private payrollservice: PayingempService,private notification: NotificationService, 
    private payrollShareService:PayingempShareService ) { }

  ngOnInit(): void {
    
    let emp_id =this.payrollShareService.empView_id.value
    this.emp_id = emp_id;
    console.log("empview id", emp_id)
    this.getEmployeeDetailView();
    // this.preview_click();

    this.popupform = this.formBuilder.group({
      ID_card:[false],
      PC:[false]
      // actividet: [{
      //   value: false,
      //   disabled: isBoolean
      // }],
       
    })
    // console.log('status',this.empList.approve_status.text)
    console.log('Payroll',this.Payroll.value)
    // this.postPayroll()

    this.getEmpdata();
    

    const currDate = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = currDate.getDate();
    const month = months[currDate.getMonth()];
    const year = currDate.getFullYear();

     this.newDate = `${month} ${day}, ${year}`;
    console.log(this.newDate);


  
   
  }


  step = 0;
  setStep(index: number) {
    this.step = index;
  }


  empList:any;
  getEmployeeDetailView() {
    // this.fetchdata
    this.payrollservice.getEmployeeView(this.emp_id)
      .subscribe(result => {
        console.log("get employee APi")
        this.empList = result;
        console.log('emp details', this.empList)
        this.firstname = result.first_name;
        this.middlename = result.middle_name;
        this.lastname = result.last_name;
        this.fullname = result.full_name;
        this.code = result.code;
        this.gender = result.gender.name;
        this.email = result.email_id;
        this.work_mode = result.work_mode.text;
        this.dob = result.dob;
        this.doj = result.doj;
        this.expected_doj = result.expected_doj;
        this.effective_from = result.effective_from;
        this.phoneno = result.phone_no;
        this.account_no = result.accountnumber;
        this.designation = result.designation.name;
        this.department = result.department_id.name;
        this.grade = result.grade.name;
        this.entity = result.entity_id.name;
        this.functional_head = result.functional_head.name;
        // this.emp_branch = result.employee_branch_id.name;
        this.business_segment = result.businesssegment.name;
        this.cose_center = result.costcentre.name;
        this.approve_status=result.approve_status.text;
        this.payroll_date=result.payroll_date
        console.log('status',this.approve_status)
        if(this.approve_status=='Draft'){
          this.disabled=false
          
        }
        else{
          this.disabled=true
        }
        
        // this.appro = result.approve_button;
        // this.mailflag = result.mail_flag;
        // address
        // this.lineName1 = result.address_id.line1;
        // this.lineName2 = result.address_id.line2;
        // this.lineName3 = result.address_id.line3;
        // this.cityName = result.address_id.city_id.name;
        // this.districtName = result.address_id.district_id.name;
        // this.stateName = result.address_id.state_id.name;
        // this.pinCode = result.address_id.pincode_id.no;
        
        
        // temporary address
        this.lineName1 = result.address_id[0].line1;
        this.lineName2 = result.address_id[0].line2;
        this.lineName3 = result.address_id[0].line3;
        this.cityName = result.address_id[0].city_id.name;
        this.districtName = result.address_id[0].district_id.name;
        this.stateName = result.address_id[0].state_id.name;
        this.pinCode = result.address_id[0].pincode_id.no;  

        // permanent address
        this.per_lineName1 = result.address_id[1].line1;
        this.per_lineName2 = result.address_id[1].line2;
        this.per_lineName3 = result.address_id[1].line3;
        this.per_cityName = result.address_id[1].city_id.name;
        this.per_districtName = result.address_id[1].district_id.name;
        this.per_stateName = result.address_id[1].state_id.name;
        this.per_pinCode = result.address_id[1].pincode_id.no;
      })




  }






  // generate email
  generateEmail(){
    this.payrollservice.getgenerateEmail(this.emp_id)
    .subscribe(res => {
      console.log("generate email response", res)
      if(res.status == 'success'){
        this.notification.showSuccess("Mail Sent Successfully..");
        this.getEmployeeDetailView();
        this.SpinnerService.hide();
       } else {
        this.notification.showError(res.description)
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


  // create user
  create_user(){
    
    // this.postPayroll()
    this.ProceedCode();
    console.log('Payroll',this.Payroll.value)
    console.log("check list",this.popupform.value)
    this.payrollservice.getCreateUserApi(this.emp_id)
    .subscribe(res => {
      console.log("create user", res)
      if(res.status == 'success'){
        this.notification.showSuccess("Success");
        this.getEmployeeDetailView();
        this.SpinnerService.hide();
       } else {
        this.notification.showError(res.description)
        this.SpinnerService.hide();
        return false;
      }
    },
    error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    ) 
    this.router.navigate(['/payingemployee/empdetailsummary'])
  }
  postPayroll(){
    this.payrollservice.PostPayrollApi(this.emp_id,this.Payroll.value?1:0).subscribe(data=>{
      console.log('data',data)
    })
  }
  ProceedCode(){
    this.payrollservice.ProceedCodeApi(this.emp_id).subscribe(data=>{

    })

  }


  // submit to checker/approver
  submit_tochecker_approve(statuskey){
    this.payrollservice.getsubmit_tochecker(this.emp_id,statuskey)
    .subscribe(res => {
      if(res.status == 'success'){
        this.notification.showSuccess("Success");
        this.getEmployeeDetailView();
        this.SpinnerService.hide();
       } else {
        this.notification.showError(res.description)
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
  download_click(){
    this.payrollservice.emp_levelpf(this.emp_id,this.DownloadAction).subscribe( result=>{
      let binaryData=[]
      binaryData.push(result)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "Pay Structure" + ".pdf";
      link.click();
    })
    const pdf=document.querySelector('.pdfDownload');
    pdf.classList.add('fa-bounce');
  }
  closes(){
    const StyleClose=document.querySelector('.pdfDownload')
    StyleClose.classList.remove('fa-bounce')
  }
  // binaryData.push(results)
  // let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
  // let link = document.createElement('a');
  // link.href = downloadUrl;
  // link.download = "PayReviewData" + ".xlsx";
  // link.click();
  
  // preview_pay structure
  preview_click(){
    
    this.payrollservice.emp_levelpf(this.emp_id,this.PreviewAction).subscribe( result=> {
      console.log('userData',result)
      this.payslip_data = result['data'];
      this.userdata = result['data'];
      let payValue = this.userdata[0].employeepay_detail
      console.log("PaySlip Data", this.payslip_data)
      // console.log('Payvalue')
      this.sal_total=0
      this.sal_deductions=0
      this.deduction_data=this.payslip_data[0].deduction_data;
      this.employeepay_detail=this.payslip_data[0].employeepay_detail
      console.log('emp',this.employeepay_detail)
      // this.subscription=this.employeepay_detail
        this.amount_total = this.employeepay_detail.reduce((a,b) => a + +b.amount, 0)
    
      
        this.deduction_sum = this.deduction_data.reduce((a,b) => a + +b.amount, 0)

        let totalAmount = 0;
        let totalAmountB = 0;
        let totalAmountA = 0;
        for (const item of payValue) {
          // console.log("Item Values", item)
          if(item.company_contribution)
          {
            const amount = parseFloat(item.amount);
            totalAmount += amount;
          }
          else if(item.paycomponent.allowance_type.name === 'BONUS')
          {
            const amounts = parseFloat(item.amount);
            totalAmountB += amounts;
          }
          else
          {
            const amountPay = parseFloat(item.amount)
            totalAmountA += amountPay;
          }
  
        }
        this.totalA = totalAmountA.toFixed(2);
        this.totalB = (totalAmountB).toFixed(2);
        this.totalD = totalAmount.toFixed(2)
        console.log("Total Amount", totalAmount)
  
        let dedValue = this.userdata[0].deduction_data;
        let dedAmount = 0;
        for(const ded of dedValue)
        {
          const amounts = parseFloat(ded.amount);
          dedAmount += amounts
        }
        this.totalC = dedAmount.toFixed(2)
        
        this.takeHome =     (Number(this.totalA) + Number(this.totalB) - Number(this.totalC) ).toFixed(2);  
        this.totals = (Number(this.totalA) + Number(this.totalB) + Number(this.totalD)).toFixed(2);
       
        console.log("USER DATA", this.userdata)
        this.globalId = this.userdata[0].id;
        console.log("User Data Id", this.globalId)
    


      // for(let i in this.payslip_data?.Employeemonthlypay_details_data  ){
      //   if(!this.payslip_data?.Employeemonthlypay_details_data[i].is_deduction){
      //     this.sal_total=this.sal_total+parseFloat(this.payslip_data?.Employeemonthlypay_details_data[i]?.amount);
      //   }
      //   if(this.payslip_data?.Employeemonthlypay_details_data[i].is_deduction){
      //     this.sal_deductions=this.sal_deductions+parseFloat(this.payslip_data?.Employeemonthlypay_details_data[i]?.amount);
      //   }
      // }
      console.log('userData',this.userdata)
      });
   
  }

  onEmp_viewCancelClick(){
    this.onCancel.emit();
  }



//  fetchdata:any= [
//     {
//       "accountnumber": "77777534535",
//       "address_id": {
//           "city_id": {
//               "code": "CY04016",
//               "id": 15,
//               "name": "Chennai",
//               "state_id": 3
//           },
//           "district_id": {
//               "id": 22,
//               "name": "Chennai"
//           },
//           "id": 11,
//           "line1": "RAJIV GANDHI INTERNATIONAL AIRPORT, SU 04, , DOMESTIC SHA",
//           "line2": "RAJIV GANDHI INTERNATIONAL AIRPORT, SU 04, , DOMESTIC SHA 23232",
//           "line3": "RAJIV GANDHI INTERNATIONAL AIRPORT, SU 04, , DOMESTIC SHA 453545",
//           "pincode_id": {
//               "city_id": 15,
//               "district_id": 22,
//               "id": 29,
//               "no": "600056"
//           },
//           "state_id": {
//               "code": "SN00031",
//               "country_id": 1,
//               "created_by": 1,
//               "id": 3,
//               "name": "Tamil Nadu",
//               "status": 1,
//               "updated_by": null
//           }
//       },
//       "businesssegment": {
//           "code": "10",
//           "description": "DO - Small Business Loans",
//           "id": 2,
//           "name": "DO - Small Business Loans",
//           "no": 10,
//           "remarks": "DO - Small Business Loans"
//       },
//       "code": "",
//       "contact_id": null,
//       "costcentre": {
//           "code": "101",
//           "description": "Business",
//           "id": 5,
//           "name": "Business",
//           "no": 101,
//           "remarks": "Business"
//       },
//       "designation": {
//           "code": "DES032",
//           "id": 38,
//           "name": "AR Analyst"
//       },
//       "dob": "2023-03-01",
//       "doj": "2023-03-02",
//       "effective_from": "2023-03-13",
//       "email_id": "dhivya@gmail.com",
//       "employee_branch_id": {
//           "address_id": null,
//           "assetcodeprimary": "INMAA3BCAP",
//           "code": "401",
//           "contact_id": null,
//           "control_office_branch": "1",
//           "glno": null,
//           "gstin": "33AACCI0979B1ZX",
//           "id": 7,
//           "incharge": "apuser",
//           "name": "Coimbatore",
//           "status": 1,
//           "stdno": null,
//           "tanno": null
//       },
//       "expected_doj": "2023-03-10",
//       "first_name": "Dhivya",
//       "full_name": "DhivyaDharshini",
//       "functional_head": {
//           "code": "EMP002",
//           "id": 3,
//           "name": "Swathi Priya"
//       },
//       "gender": "Female",
//       "grade": {
//           "id": 4,
//           "is_active": true,
//           "name": "Grade D"
//       },
//       "id": 18,
//       "last_name": "A",
//       "mail_flag": false,
//       "middle_name": "Dharshini",
//       "org_id": {
//           "code": "ORG3",
//           "id": 3,
//           "latitude": "13.054340",
//           "longitude": "80.256639",
//           "name": "KVB",
//           "radius": "0.00024",
//           "status": 1
//       },
//       "phone_no": "9977777777",
//       "user": null,
//       "user_generate": false,
//       "work_mode": {
//           "id": 2,
//           "text": "work from home"
//       }
//   }
//   ]


preview:any = [
  {
    "name": "Swathi priya",
    "designation": "Front End Developer",
    "Department": "Chennai OMR",
    "DOJ": "23-02-2023",
    "pay_details": [
      {
        "component": "Basic & DA",
        "Monthly": "25,000",
        "annual": "2,60,000"
      },
      {
        "component": "HRA",
        "Monthly": "15,000",
        "annual": "1,60,000"
      },
      {
        "component": "Conveyance",
        "Monthly": "28,000",
        "annual": "1,40,000"
      },
      {
        "component": "Medical",
        "Monthly": "23,000",
        "annual": "6,40,000"
      },
      {
        "component": "others",
        "Monthly": "22,000",
        "annual": "3,12,000"
      }
    ]
  }
]


RouteToEmployeeCreate(data){
  let obj = {
    routes: true,
    data: data,
    empid: this.emp_id 
  }

  console.log("clicked data", obj)
  // this.route.navigateByUrl['/employeeCreate']
  // this.masterHrms.TypeOfCreateEmp = obj  
  if(obj.data == 'Emp Info'){
    this.router.navigate(['hrms/employeeInfoRoutes'],{ queryParams: { id: this.emp_id, datafrom: 'empview' } })
  // this.router.navigate(['/payingemployee/employeecreate'], {queryParams: {
  //   routes: true,
  //   data: data,
  //   empid: this.emp_id,
  //   datafrom: 'empInfo' 
  // }});
}

  if(this.EmpInfoObjects.datafrom == 'adminview'){
    this.router.navigate(['/payingemployee/employeecreate'], {queryParams: {
      routes: true,
      data: data,
      empid: this.emp_id,
      datafrom: 'adminview' 
    }});
  }





}

getEmpdata()
{
  this.payrollservice.getBloodGroup(this.emp_id)
  .subscribe(res => {
    this.bloodgroup = res.blood_grp;
    console.log("Emp Datass", res)
  })
}



}
