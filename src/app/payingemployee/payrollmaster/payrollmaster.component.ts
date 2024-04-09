import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../../service/error-handling-service.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { map, startWith, finalize, switchMap, debounceTime, distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { PayingempService } from '../payingemp.service';
import { NotificationService } from '../../service/notification.service';
import { formatDate, DatePipe } from '@angular/common';
import { Observable, from, fromEvent, } from 'rxjs';
import { PayingempShareService } from '../payingemp-share.service';

@Component({
  selector: 'app-payrollmaster',
  templateUrl: './payrollmaster.component.html',
  styleUrls: ['./payrollmaster.component.scss']
})
export class PayrollmasterComponent implements OnInit {
  setcolor = 'primary';
  allowanceTypeList:any;
  task_Master_Menu_List: any
  clientSummary:boolean
  payrollSummary:boolean;
  employeePFStructurecreation:boolean;
  employeePFStructure:boolean;
  moduleSummary:boolean
  mappingSummary:boolean
  clientcreation:boolean
  payrollcreation:boolean
  modulecreation:boolean
  mappingcreation:boolean
  clientList:any;
  payrollList:any;
  PFStructureList:any;
  mappingList:any;
 
  // clientForm:FormGroup;
  payrollForm:FormGroup;
  PFForm:FormGroup;
  // moduleForm:FormGroup;
  // mappingForm:FormGroup;
  presentpageclient: number = 1;
  pagesizeclient=10;
  has_nextclient = true;
  has_previousclient = true;
  presentpagepayroll: number = 1;
  pagesizepayroll=10;
  has_nextpayroll = true;
  has_previouspayroll = true;
  presentpagepf: number = 1;
  pagesizepf=10;
  has_nextPF = true;
  has_previousPF = true;
  presentpagemapping: number = 1;
  pagesizemapping=10;
  has_nextmapping = true;
  has_previousmapping = true;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  // appNamemasterList: Array<appNamemaster>;
  // clientmasterList: Array<Clientmaster>;
  // moduleNamemasterList: Array<ModeuleNamemaster>;

  Objects = {
    allowanceTypeList:[{id: 1, text: 'Percentage'}, {id: 2, text: 'Fixed'} ],
  }

  constructor(
    private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService, private payrollservice: PayingempService,
    private notification: NotificationService,private datePipe: DatePipe,private payrollShareService:PayingempShareService
  ) { }

  ngOnInit(): void {
    // payroll form
    this.payrollForm = this.fb.group({
      name: [''],
      allowance_type: [''],
      pf_include:[false],
      is_deduction:[false],
    })
      // pf form
      this.PFForm = this.fb.group({
        name: [''],
        percentage: [''],
        amount:[''],
        is_standard:[false],
      })
    this.payrollSearch('');
    this.getAllowance();
    this.PFSearch('');
    if(this.payrollShareService.payroll.value == 'Payroll'){
     this.payrollSummary = true;
     this.employeePFStructure = false
    }
    if(this.payrollShareService.employeepf.value == 'EmployeePF'){
      this.payrollSummary = false;
      this.employeePFStructure = true;
    }
  }





  // payroll component master
  get_payrollSummary(pageno) {
    this.SpinnerService.show();
    this.payrollservice.payrollSummary_master(pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        this.payrollList = result['data']
        let dataPagination = result['pagination'];
        if (this.payrollList.length > 0) {
          this.has_nextpayroll = dataPagination.has_next;
          this.has_previouspayroll = dataPagination.has_previous;
          this.presentpagepayroll = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  payrollSearch(hint: any) {
    if (hint == 'next') {
      this.get_payrollSummary(this.presentpagepayroll + 1)
    }
    else if (hint == 'previous') {
      this.get_payrollSummary(this.presentpagepayroll - 1)
    }
    else {
      this.get_payrollSummary(1)
    }

  }

  getAllowance() {
    this.SpinnerService.show();
    this.payrollservice.getAllowances()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results['data'];
        this.allowanceTypeList = datas;
      },
    error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    )
  }

  payrollSubmit(){
    this.SpinnerService.show();
    if (this.payrollForm.value.name === "") {
      this.toastr.error('Please Enter Name');
      this.SpinnerService.hide();
      return false;
    }
    if (this.payrollForm.value.allowance_type === "") {
      this.toastr.error('Please Select Allowance Type');
      this.SpinnerService.hide();
      return false;
    }
    // if (this.payrollForm.value.pf_include === "") {
    //   this.toastr.error('Please Select PF Include');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.payrollForm.value.is_deduction === "") {
    //   this.toastr.error('Please Select is Deduction');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // let dateValue = this.payrollForm.value;
    // dateValue.start_date = this.datePipe.transform(dateValue.start_date, 'yyyy-MM-dd');
    // dateValue.end_date = this.datePipe.transform(dateValue.end_date, 'yyyy-MM-dd');

    let data = this.payrollForm.value
    let dataToSubmit;
    if (this.ID_Value_To_payrollEdit != '') {
      let id = this.ID_Value_To_payrollEdit
      dataToSubmit = Object.assign({}, { 'id': id }, data)
    }
    else {
      dataToSubmit = data
    }
    this.payrollservice.payrollForm(dataToSubmit)
    .subscribe(res => {
      console.log("payroll click", res)
      this.SpinnerService.hide();
      if(res.status == 'success'){
        if (this.ID_Value_To_payrollEdit != '') {
          this.notification.showSuccess('Successfully Updated')
          this.ID_Value_To_payrollEdit = ''
        } else {
          this.notification.showSuccess('Successfully Created')
          this.ID_Value_To_payrollEdit = ''
        }
        this.payrollForm = this.fb.group({
          name: [''],
          allowance_type:[''],
          pf_include:[false],
          is_deduction:[false],
        })
        this.payrollSummary = true;
        this.payrollcreation = false;
        this.employeePFStructurecreation = false;
        this.employeePFStructure = false;
        this.payrollSearch('');
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
 
  oncancelPayroll(){
    this.payrollcreation = false;
    this.payrollSummary = true;
    this.employeePFStructurecreation = false;
    this.employeePFStructure = false;
  }

  oncancelPF(){
    this.payrollcreation = false;
    this.payrollSummary = false;
    this.employeePFStructurecreation = false;
    this.employeePFStructure = true;
  }


  TypeOfForm:string;
  ID_Value_To_PFEdit: any = ''
  ID_Value_To_payrollEdit: any = ''
  

  addPayroll(formtype,data){
    this.TypeOfForm = formtype;
    this.payrollcreation = true;
    this.payrollSummary = false;
    if (data != '') {
      this.ID_Value_To_payrollEdit = data.id
      // const startdate = this.datePipe.transform(data.start_date, 'yyyy-MM-dd');
      // const enddate = this.datePipe.transform(data.end_date, 'yyyy-MM-dd');
      this.payrollForm.patchValue({
        name: data.name,
        allowance_type: data.allowance_type.id,
        pf_include:data.pf_include,
        is_deduction:data.is_deduction,
      })
    }
    else {
      // this.payrollForm.reset('')
      this.payrollForm = this.fb.group({
        name: [''],
        allowance_type:[''],
        pf_include:[false],
        is_deduction:[false],
      })
    }
  }

  deletepayroll(data) {
    this.SpinnerService.show();
    this.payrollservice.deletepayroll(data.id)
      .subscribe((res) => {
        if(res.status == 'success'){
          this.payrollSearch('');
          this.SpinnerService.hide();
         } else {
          this.notification.showError(res.description)
          this.SpinnerService.hide();
          return false;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
 

 // PF master
 get_pFSummary(pageno) {
  this.SpinnerService.show();
  this.payrollservice.pFSummary_master(pageno)
    .subscribe(result => {
      this.SpinnerService.hide();
      this.PFStructureList = result['data']
      let dataPagination = result['pagination'];
      if (this.PFStructureList.length > 0) {
        this.has_nextPF = dataPagination.has_next;
        this.has_previousPF = dataPagination.has_previous;
        this.presentpagepf = dataPagination.index;
      }
    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
}


PFSearch(hint: any) {
  if (hint == 'next') {
    this.get_pFSummary(this.presentpagepf + 1)
  }
  else if (hint == 'previous') {
    this.get_pFSummary(this.presentpagepf - 1)
  }
  else {
    this.get_pFSummary(1)
  }

}


addEmployeePF(formtype,data){
  this.TypeOfForm = formtype;
  this.employeePFStructurecreation = true;
  this.employeePFStructure = false;
  if (data != '') {
    this.ID_Value_To_PFEdit = data.id
    this.payrollservice.getPF_ParticularGet(data.id)
    .subscribe((res) => {
      this.PFForm.patchValue({
        name: res.name,
        percentage: res.percentage,
        amount:res.amount,
        is_standard:res.is_standard,
      })
    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
    
  }
  else {
    // this.payrollForm.reset('')
    this.PFForm = this.fb.group({
      name: [''],
      percentage:[''],
      amount:[''],
      is_standard:[false],
    })
  }
}

deletePFStructure(data) {
  this.SpinnerService.show();
  this.payrollservice.deletepf(data.id)
    .subscribe((res) => {
      if(res.status == 'success'){
        this.PFSearch('');
        this.SpinnerService.hide();
       } else {
        this.notification.showError(res.description)
        this.SpinnerService.hide();
        return false;
      }
    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
}

pfSubmit(){
  this.SpinnerService.show();
  if (this.PFForm.value.name === "") {
    this.toastr.error('Please Enter Name');
    this.SpinnerService.hide();
    return false;
  }
  if (this.PFForm.value.percentage === "") {
    this.toastr.error('Please Enter Percentage');
    this.SpinnerService.hide();
    return false;
  }
  if (this.PFForm.value.amount === "") {
    this.toastr.error('Please Enter Amount');
    this.SpinnerService.hide();
    return false;
  }

  let data = this.PFForm.value
  let dataToSubmit;
  if (this.ID_Value_To_PFEdit != '') {
    let id = this.ID_Value_To_PFEdit
    dataToSubmit = Object.assign({}, { 'id': id }, data)
  }
  else {
    dataToSubmit = data
  }
  this.payrollservice.pfForm(dataToSubmit)
  .subscribe(res => {
    console.log("pf  click", res)
    this.SpinnerService.hide();
    if(res.status == 'success'){
      if (this.ID_Value_To_PFEdit != '') {
        this.notification.showSuccess('Successfully Updated')
        this.ID_Value_To_PFEdit = ''
      } else {
        this.notification.showSuccess('Successfully Created')
        this.ID_Value_To_PFEdit = ''
      }
      this.PFForm = this.fb.group({
        name: [''],
        percentage:[''],
        amount:[''],
        is_standard:[false],
      })
      this.payrollSummary = false;
      this.payrollcreation = false;
      this.employeePFStructurecreation = false;
      this.employeePFStructure = true;
      this.PFSearch('');
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

}
