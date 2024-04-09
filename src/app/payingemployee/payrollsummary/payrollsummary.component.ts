import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { PayingempService } from '../payingemp.service';
import {FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe, formatDate } from '@angular/common';
import { NotificationService } from 'src/app/service/notification.service';
import { SharedService } from 'src/app/service/shared.service';
import { PdfgeneratorService } from '../pdfgenerator.service';
import { NgxSpinnerService } from "ngx-spinner";
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
} from '@angular/material/snack-bar';


@Component({
  selector: 'app-payrollsummary',
  templateUrl: './payrollsummary.component.html',
  styleUrls: ['./payrollsummary.component.scss']
})
export class PayrollsummaryComponent implements OnInit {
  payroll_array: any;
  presentpageemp = 1;
  pagesizeemp = 10;
  name: any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  componentdata: any;
  isShowRecords: boolean  = false;
  has_previousEmp = false;
  has_nextEmp = true;
  paydata: any;
  droplist: any;
  searchform: FormGroup;
  send_value:String="";
  limit = 10;
  paginations = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  years: number[] = [];
  currenYear: number;
  selectedValue : any;
  formGroup: FormGroup; 
  payRole: any;
  interPermission: any;
  adminUser: boolean = false;
  normalUser: boolean = false;
  empbranchid: any;
  currentUser: any;
  makerUser:  boolean = false;
  checkUser: boolean = false;
  checkerUser: boolean = false;
  // droplist: [];

  options = [{ key: 'Jan', value: '1' }, { key: 'Feb', value: '2' }, { key: 'Mar', value: 3 }, { key: 'Apr', value: 4 }, { key: 'May', value: 5 }, { key: 'Jun', value: 6 }, { key: 'Jul', value: 7 }, { key: 'Aug', value: 8 }, { key: 'Sep', value: 9 }, { key: 'Oct', value: 10 }, { key: 'Nov', value: 11 }, { key: 'Dec', value: 12 }]
  remarks: any;

  constructor(private apiservice: PayingempService, public dialog: MatDialog, private fb: FormBuilder, private notification: NotificationService, private sharedservice: SharedService,
    private pdfGeneratorService :PdfgeneratorService,  private SpinnerService: NgxSpinnerService, private snackBar: MatSnackBar) {
    let currenYear = new Date().getFullYear();
    let currYear = new Date().getFullYear();
    let startYear = currYear - 14;
    for(let year=startYear; year <= currYear + 17; year++)
    {
      this.years.push(year);
    }
    this.formGroup = this.fb.group({
      pay_change: [] 
    });
   }
   payrollForms: FormGroup[] = [];
   isSearching: boolean = false;
   idEmployee: any;

  ngOnInit(): void {
   let userdata = this.sharedservice.transactionList
    userdata.forEach(element => {
      if (element.name == 'Employee Payroll') {
        this.payRole = element.role
      }
    })
      if (this.payRole) {
      let isAdmin = false;
      this.payRole.forEach(element => {
        if (element.name.toLowerCase() == 'payroll admin') {
          this.interPermission = element.code
          this.adminUser = true;
          this.currentUser = 'admin';
          isAdmin = true;
        }
        if (element.name.toLowerCase() == 'maker' || element.name.toLowerCase() == 'checker' || element.name.toLowerCase() == 'admin' ) {
          this.interPermission = element.code
          this.normalUser = true;

        }
      
      })
      if(isAdmin)
      {
        this.normalUser = false;
        this.makerUser = false;
        this.checkUser = false;
        this.checkerUser = false;
      }
    }
    this.searchform = this.fb.group({
      name: '',
      month: '',
      year: '',
      status:''
    })
    this.getDropDown();
  }

  payrollget(query, page) {

    this.apiservice.searchPayroll(this.send_value, page).subscribe(data => {
      this.payroll_array = data['data'];
      console.log("Payroll Lengthsss", this.payroll_array.length)
      this.payroll_array.forEach(entry => {
        const totalAmount = entry.Employeemonthlypay_details_data.reduce(
          (total, detail) => total + parseFloat(detail.amount),
          0
        );
        entry['newpay'] = totalAmount.toFixed(2); 
      });

      this.payroll_array.forEach(entrys =>{
        const totalDeduct = entrys.deduction_data.reduce(
          (totals, details) => totals + parseFloat(details.amount),
          0
        );
        entrys['deduct']= totalDeduct.toFixed(2);
      })
      console.log("Pay array", this.payroll_array)
      this.isShowRecords = true;
      if (this.payroll_array.length > 0) {
        this.has_nextEmp = data['pagination']?.has_next;
        this.has_previousEmp = data['pagination']?.has_previous;
        this.presentpageemp = data['pagination']?.index;
      }


    });

  }
  getDropDown() {
    this.apiservice.getStatus()
      .subscribe((results: any) => {
        this.droplist = results['data'];


      })
  }


  openDialog(type, id) {
    const dialogRef = this.dialog.open(Dialogclass, {
      height: '800px',
      width: '750px',
      data: {
        type: type,
        id: id,
        paydata: this.paydata,
        search:this.send_value
      }     
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  pagination(action) {
    if (action == 'next') {
      this.payrollget('', this.presentpageemp + 1)
    }
    else if (action == 'previous') {
      this.payrollget('', this.presentpageemp - 1)
    }
    else {
      this.payrollget('', 1);
    }
  }
  downloadPayData() {
    if(!this.searchform.value.month){
      this.notification.showError('Please Select Month')
    }
    else if(!this.searchform.value.year){
      this.notification.showError('Please Select Year')
    }
    else{
      let formValue = this.searchform.value;
      console.log("Search Values", formValue)
      this.send_value = ""
      if(formValue.name)
      {
          this.send_value = this.send_value+'&employeename='+formValue.name
      }
      if(formValue.month)
      {
        this.send_value = this.send_value+'&month='+formValue.month
      }
      if(formValue.year)
      {
        this.send_value = this.send_value+'&year='+formValue.year
      }
      if(formValue.status)
      {
        this.send_value = this.send_value+'&paystatus='+formValue.status
      }
      this.apiservice.downloadPayroll(this.send_value).subscribe(results => {
        let newdate = new Date();
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "PayRollSummary.xlsx";
        link.click();
      })
    }
 
  }
  clearData() {
    this.searchform.reset();
    this.searchData();
    
  }
  searchData() {
    this.SpinnerService.show();
    let formValue = this.searchform.value;
    this.send_value = ""
    if(formValue.name)
    {
        this.send_value = this.send_value+'&employeename='+formValue.name
    }
    if(formValue.month)
    {
      this.send_value = this.send_value+'&month='+formValue.month
    }
    if(formValue.year)
    {
      this.send_value = this.send_value+'&year='+formValue.year
    }
    if(formValue.status)
    {
      this.send_value = this.send_value+'&paystatus='+formValue.status
    }
    let page = 1;
    this.apiservice.searchPayroll(this.send_value, page).subscribe(result =>{
      this.SpinnerService.hide();
      this.payroll_array = result['data'];
      this.isShowRecords = true;
      this.payroll_array.forEach(entry => {
        const totalAmount = entry.Employeemonthlypay_details_data.reduce(       
          (total, detail) => total + parseFloat(detail.amount),0);
        entry['newpay'] = totalAmount.toFixed(2);       
      });
      this.payroll_array.forEach(entrys =>{
        if(entrys.Employeemonthlypay_details_data.length == 1)
        {
          entrys['deduct']= 0;
        }
        else
        {
        const totalDeduct = entrys.deduction_data.reduce((totals, details) => totals + parseFloat(details.amount), 0 );        
        entrys['deduct']= totalDeduct.toFixed(2);     
        }
      })   

      if (this.payroll_array.length > 0) {
        this.has_nextEmp = result['pagination']?.has_next;
        this.has_previousEmp = result['pagination']?.has_previous;
        this.presentpageemp = result['pagination']?.index;
      }   
    },
    (error) =>
    {
      this.SpinnerService.hide();
      this.notification.showError(error.status)
    })
    

   
  }
  manualRun()
  {
    if(!this.searchform.value.month && !this.searchform.value.year){
      this.notification.showError('Please Select Month and Year')
    }
    else if(!this.searchform.value.month){
      this.notification.showError('Please Select Month')
    }
    else if(!this.searchform.value.year){
      this.notification.showError('Please Select Year')
    }
    else{
      this.isSearching = true;
      let formValue = this.searchform.value;
      let month  =  formValue.month;
      let yr = formValue.year;
      this.apiservice.manualRuns(month, yr).subscribe(result =>{
        if(result.status == 'success'){
          this.notification.showSuccess("Manual Run Successfully Completed")
          this.isSearching = false;
        }
        else if(result.code)
        {
          this.notification.showError(result?.description);
          this.isSearching = false;
        }
        else
        {
          this.notification.showError(result.status)
          this.isSearching = false;
        }
    
      }   )
    }
   

  }
  // openRemarks(data)
  // {
  //   this.remarks = data?.remarks
  //   this.snackBar.open(data?.remarks, '', {
  //     duration: 3000
  //   });
  // }

  openSnackBar(message: string) {
    const config = new MatSnackBarConfig();
    config.duration = 4000;
    config.horizontalPosition = 'end';
    config.verticalPosition = 'top';
    config.panelClass = ["custom-style"];

    this.snackBar.open(message, '', config);
  }

  // Call this method wherever you want to open the snackbar
  openRemarks(data) {
    
    this.openSnackBar(data?.remarks);
  }
  // calculateTotalAndAddNewPay() {
 
  // }
}


@Component({

  templateUrl: 'payroll_popup.html',
  styleUrls: ['./payrollsummary.component.scss']
})
export class Dialogclass {
  payslip_data: any;
  sal_total: number;
  sal_deductions: any;
  deduction_data: any;
  employeepay_detail: any;
  amount_total: any;
  deduction_sum: any;
  payMonth: any;
  payYear : any;
  Summary=0;
  Excel=1
  datas:any;
  name:string;
  remarks: any;
  constructor(private apiservice: PayingempService, public dialogRef: MatDialogRef<Dialogclass>, @Inject(MAT_DIALOG_DATA) public data: any, private pdfGeneratorService :PdfgeneratorService,private datePipe:DatePipe) {
    this.datas=data
    this.apiservice.employee_monthlypayslips(data.type,data.id, data.search,this.Summary).subscribe(result => {
    this.payslip_data = result.data[0];
      this.deduction_data=this.payslip_data?.deduction_data
      this.employeepay_detail=this.payslip_data?.Employeempay_details_data
      this.amount_total = this.employeepay_detail.reduce((a,b) => a + +b.amount, 0)
      
      if(this.deduction_data == undefined)
      {
        this.deduction_sum = 0;
      }
      else
      {
        this.deduction_sum = this.deduction_data.reduce((a,b) => a + +b.amount, 0)   
      }
      let paysdates = this.payslip_data.payroll_date;
      let dateObjects = new Date(paysdates)
      this.payMonth = formatDate(dateObjects, 'MMM', 'en-US');
      this.payYear = formatDate(dateObjects, 'yyyy', 'en-US');
    });    
  }

  generatePDF() {
    this.apiservice.employee_monthlypayslips(this.datas.type,this.datas.id, this.datas.search,this.Excel).subscribe(result => {
      let currentDate=new Date();
      let time=String(this.datePipe.transform(currentDate,'h:mm:ss a')) 
      let timeColon=time.replace(/-/g,':')
      let hours=this.datePipe.transform(currentDate,'h')
      let Min=currentDate.getMinutes()
      let AmPm=this.datePipe.transform(currentDate,'a')
      let binaryData=[]
      binaryData.push(result)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = this.payslip_data?.employee?.code+'-'+this.payMonth+'-'+this.payYear+'-'+'('+hours+'.'+Min+')'+ ".pdf";
      link.click();
    })
  }

 


  




  



}
