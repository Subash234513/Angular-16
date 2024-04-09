import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PayingempService } from '../payingemp.service';
import { NotificationService } from 'src/app/service/notification.service';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent, throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Subscription} from 'rxjs';
import { data } from 'jquery';
import { NgxSpinnerService } from "ngx-spinner";
import { I } from '@angular/cdk/keycodes';

export interface paycomonent {
  id: number;
  name: string;
}
export interface FunctionHead {
  id: string;
  full_name: string;
}
@Component({
  selector: 'app-bulkupload',
  templateUrl: './bulkupload.component.html',
  styleUrls: ['./bulkupload.component.scss']
})
export class BulkuploadComponent implements OnInit {
  @ViewChild('fn') matFHAutocomplete: MatAutocomplete;
  @ViewChild('fnInput') fnInput: any;
  @ViewChild('fns') matFHAutocompletes: MatAutocomplete;
  @ViewChild('fnd') matFHAutocomplet: MatAutocomplete;
  @ViewChild('fnInputs') fnInputs: any;
  @ViewChild('fnds') matFHAutocomplets: MatAutocomplete;
  @ViewChild('fnsD') matFHAutocompleteD: MatAutocomplete;

  @ViewChild('fnInputss') fnInputss: any;
  @ViewChild('fnInputD') fnInputD: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) autocompleteTriggers: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrig: MatAutocompleteTrigger;
  paycomponent_arrays: any;
  fromdatevalue: any=[];
  filedata: any;
  paycomponent_earn: any;
  paycomponent_deduct: any;

  constructor(private fb: FormBuilder, private uploadservice: PayingempService, private notification: NotificationService, public datepipe: DatePipe, private SpinnerService: NgxSpinnerService) { 
    this.fromDateControl.setValue(this.currentDate);
  }
  uploadForm: FormGroup;
  uploadForms: FormGroup;
  dropDownForm: FormGroup;
  images: any;
  templateText: any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  summarylist: [];
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  Summary = [];
  Summarys = [];
  DSummary = [];
  isLoading = false;
  selectedOption: any;
  emp_paysrtuctureform: FormGroup;
  deductsrtuctureform: FormGroup;
  paycomponent_array: any;
  paycomponentEarnings : any;
  
  functionalHeadList: any;
  editForm: FormGroup;
  editForms: FormGroup;
  editFormD : FormGroup;
  currentDate = new Date();
  fromDateControl = new FormControl();

  paystatusform: FormGroup;
  isShowAddPage: boolean = false;
  empSearchForm: FormGroup;
  empSearchForms: FormGroup;
  empDSearchForms: FormGroup;
  isShowSummary: boolean = true;
  isEditContribution: boolean = false;
  isShowTable: boolean = false;
  isShowSummarys: boolean = true;
  isShowTables: boolean = true;
  isShowNewAdd: boolean = false;
  isShowNewAdds: boolean = false;
  isEditAllowance: boolean = false;
  isShowDSummary: boolean = true;
  isEditDeduction: boolean = false;
  
  select : any;
  selects : any;
  selectPay: any;
  subscription: Subscription;
  inputs = document.querySelectorAll('.file-input')
  @ViewChild('labelImport')  labelImport: ElementRef;
  @ViewChild('labelImportDeduction')  labelImportDeduction: ElementRef;
  droplist: [];
  statusList = [
    { value: 2, text: 'Pay Structure' },
    { value: 3, text: 'Custom Earnings' },
    { value: 4, text: 'Custom Deduction' },
    { value: 5, text: 'Payment Hold' },
    { value: 6, text: 'Attendance Upload'}
  ];

  ngOnInit(): void {
    
    this.emp_paysrtuctureform = this.fb.group({
      employeepay_detail: new FormArray([
      ]),
      employee_id: ['']
    })

    this.deductsrtuctureform = this.fb.group({
      employeepay_detail: new FormArray([
        
      ]),
      employee_id: ['']
    })
    this.paystatusform = this.fb.group({
      paydetail: new FormArray([
      ]),
      employee_id: ['']
    })

    this.editForm = this.fb.group({
      functional_head: [''],
      from_date: [''],
      to_date: [''],
      pay_change: [''],
      reason: [''],
      id: [''],
      empid: ['']
    })
    this.uploadForm = this.fb.group({
      file: ['', Validators.required],
    })

    this.getUploadSummary();

    this.dropDownForm = this.fb.group({
      droplist: ['']
    })
    this.uploadForms = this.fb.group({
      files: ['', Validators.required],
    })

    this.empSearchForm = this.fb.group({

      functional_head: [''],
      from_date: [''],
      to_date: ['']
    })

    this.empSearchForms = this.fb.group({

      functional_head: [''],
      from_date: [''],
      to_date: ['']
    })
    
    this.empDSearchForms = this.fb.group({

      functional_head: [''],
      from_date: [''],
      to_date: ['']
    })

    
    this.getDropDown();
    this.getAddAllowances();
    this.getDeductions();

    this.editForms = this.fb.group({
      functional_head: [''],
      active_date: [''],
      end_date: [''],
      type: [''],
      amount: [''],
      id: [''],
      empid: ['']


    })
    this.editFormD = this.fb.group({
      functional_head: [''],
      active_date: [''],
      end_date: [''],
      type: [''],
      amount: [''],
      id: [''],
      empid: ['']


    })

    this.getpaymentcomponentinfo();

    this.getDataPay();
 
    this.emp_paysrtuctureform.get('employeepay_detail')?.valueChanges.subscribe(value_arrya => {

      const control = <FormArray>this.emp_paysrtuctureform.controls['employeepay_detail'];
      for (let i in value_arrya) {
        const fromDate :any = control.at(+i).get('fromDate');
        fromDate.valueChanges.pipe(
          distinctUntilChanged() 
        ).subscribe(res => {
          
        this.select =  new Date(fromDate.value);
        
          
    
        },
        error=>{
          this.SpinnerService.hide()
        });
      }
     
      
    
    });

    this.deductsrtuctureform.get('employeepay_detail')?.valueChanges.subscribe(value_arrya => {
      const control = <FormArray>this.deductsrtuctureform.controls['employeepay_detail'];
      for (let i in value_arrya) {
        const fromDate :any = control.at(+i).get('fromDate');
        fromDate.valueChanges.pipe(
          distinctUntilChanged() 
        ).subscribe(res => {
          
        this.selects =  new Date(fromDate.value);
        
          
    
        });
      }
      
    
    },
    error=>{
      this.SpinnerService.hide();
    });

    this.paystatusform.get('paydetail')?.valueChanges.subscribe(value_arrya => {
      const control = <FormArray>this.paystatusform.controls['paydetail'];
      for (let i in value_arrya) {
        const fromDate :any = control.at(+i).get('from_date');
        fromDate.valueChanges.pipe( 
          distinctUntilChanged() 
        ).subscribe(res => {
          
        this.selectPay =  new Date(fromDate.value);
        
          
    
        });
      }
      
    
    });
    this.paycomponent_searchs('');

  }

  getDropDown() {
    this.SpinnerService.show();
    this.uploadservice.getStatus()
      .subscribe((results: any) => {
this.SpinnerService.hide();

        this.droplist = results['data'];


      },
      error=>{
        this.SpinnerService.hide()
      })
  }

  fileChange(file, files:FileList) {
    this.labelImport.nativeElement.innerText = Array.from(files)
    .map(f => f.name)
    .join(', ');
    this.images = <File>file.target.files[0];
  }

  uploadDocument() {
    this.uploadservice.uploadDocument(this.images)
      .subscribe((results: any) => {

        if (results?.description) {

          this.notification.showError(results.description)
        }
        else {

          this.notification.showSuccess('File Upload Successfull')
          this.uploadForm.reset();
          
        }

      })
  }

  uploadDocuments() {
    if(this.images === null || this.images === undefined || this.images === "")
    {
      this.notification.showError('Please Select File');
      return false;
    }
    
    

    
    
    
    

    
    
    
    

    
    
      
    
    


    
    this.uploadservice.uploadPayStructure(this.images)
      .pipe(
        catchError((error) => {
          if (error.status === 500) {
            this.notification.showError("Internal Server Error. Please try again later.");
          } else {
            this.notification.showError("An error occurred: " + error.message);
          }
          return throwError(error); 
        })
      )
      .subscribe((results: any) => {
        if (results?.status == 'INVALID DATA') {
                this.notification.showError("INVALID DATA")
              }
              else {
      
                this.notification.showSuccess('File Upload Successfull')
                this.uploadForm.reset();
              }    
       
      });
    

  }

  getUploadSummary() {
    this.uploadservice.getUploadSummary(this.pagination.index).subscribe(results => {
      if (!results) {
        return false;
      }
      this.summarylist = results['data'];
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }

  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.getUploadSummary();
  }
  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getUploadSummary();
  }
  addSection() {
    const control = <FormArray>this.emp_paysrtuctureform.get('employeepay_detail');
    control.push(this.getemp_payinfo());
  }

  getemp_payinfo() {
    let group = new FormGroup({
      functional_head: new FormControl(''),
      paycomponent: new FormControl(''),
      type_name: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      amount: new FormControl(''),
      min: new FormControl(''),

    })
    return group
  }

  deductgrp() {
    let group = new FormGroup({
      functional_head: new FormControl(''),
      
      type: new FormControl(''),
      
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      amount: new FormControl(''),

    })
    return group
  }

  statusgrp() {
    let group = new FormGroup({
      functional_head: new FormControl(''),
      from_date: new FormControl(''),
      to_date: new FormControl(''),
      pay_change: new FormControl(''),
      reason: new FormControl(''),
      

    })
    return group
  }

  getSections(forms) {
    return forms.controls.employeepay_detail.controls;
  }

  deletepay(i) {
    (<FormArray>this.emp_paysrtuctureform.get('employeepay_detail')).removeAt(i);
    
    
  }

  type_info(type_info, index) {

    var arrayControl = this.emp_paysrtuctureform.get('employeepay_detail') as FormArray;

    
    
    
    


  }
  addSectionded() {
    const control = <FormArray>this.deductsrtuctureform.get('employeepay_detail');
    control.push(this.deductgrp());
  }
  type_infoded(type_info, index) {

    var arrayControl = this.deductsrtuctureform.get('employeepay_detail') as FormArray;

    
    
    
    


  }

  getSectionsded(forms) {
    return forms.controls.employeepay_detail.controls;
  }

  deletepayded(i) {
    (<FormArray>this.deductsrtuctureform.get('employeepay_detail')).removeAt(i);
     this.notification.showSuccess("Empty Row Deleted Successfully")
  }
  getpaymentcomponentinfo() {

    this.uploadservice.getpaycomponents('', 1).subscribe(data => {
      this.paycomponent_array = data['data'];
    });
  }
  getpaymentcomponentinfos() {

    this.uploadservice.getpaycomponentEarning('', 1).subscribe(data => {
      this.paycomponent_earn = data['data'];
    });
  }
  getpaymentcomponentinfod() {

    this.uploadservice.getpaycomponentDeduct('', 1).subscribe(data => {
      this.paycomponent_deduct = data['data'];
    });
  }

  validation(event: any) {
    let d: any = new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    if (d.test(event.key) == true) {
      return false;
    }
    return true;
  }
  paycomponent_search(value) {
    this.uploadservice.getpaycomponents( value, 1).subscribe(data => {
      this.paycomponent_array = data['data'];
    });
  }
  paycomponent_searches(value) {
    this.uploadservice.getpaycomponentEarning(value, 1).subscribe(data => {
      this.paycomponent_earn = data['data'];
    });
  }
  paycomponent_searchD(value) {
    this.uploadservice.getpaycomponentDeduct(value, 1).subscribe(data => {
      this.paycomponent_deduct = data['data'];
    });
  }
  public displaycom(data?: paycomonent): any | undefined {
    return data ? data.name : undefined;
  }

  Formsubmission() {
    let values = this.paystatusform.get('paydetail').value
    let payload = [];

    for (let i = 0; i < values.length; i++) {

      if(values[i].functional_head.id === null || values[i].functional_head.id === undefined || values[i].functional_head.id === '' )
      {
        this.notification.showError("Please Select Employee in row  " + i);
        this.SpinnerService.hide();
        return false;
      }
     
      if(values[i].from_date === null || values[i].from_date === undefined || values[i].from_date === '')
      {
        this.notification.showError("Please Select From Date in row  " + i);
        this.SpinnerService.hide();
        return false;
      }
      if(values[i].to_date === null || values[i].to_date === undefined || values[i].to_date === '')
      {
        this.notification.showError("Please Select To Date in row  " + i);
        this.SpinnerService.hide();
        return false;
      }
   
      if(values[i].reason === null || values[i].reason === undefined || values[i].reason ==='')
      {
        this.notification.showError("Please Enter Reason in row  " + i);
        this.SpinnerService.hide();
        return false;
      }
      if(values[i].pay_change === null || values[i].pay_change === undefined || values[i].pay_change ==='')
      {
        this.notification.showError("Please select Status in row  " + i);
        this.SpinnerService.hide();
        return false;
      }



      let item = {
        "employee_id": values[i].functional_head.id,
        "from_date": this.datepipe.transform((values[i].from_date), 'yyyy-MM-dd'),
        "to_date": this.datepipe.transform((values[i].to_date), 'yyyy-MM-dd'),
        "pay_change": values[i].pay_change,
        "reason": values[i].reason,
        "custom_deduct" : 0
      };

      payload.push(item);
    }
    if(payload.length === 0){
      this.notification.showError("Atleast add one Payment Hold...");
      this.SpinnerService.hide();
      return false;
    }

    this.uploadservice.addNewPayChange(payload).subscribe(result => {
      if (result.message == 'Successfully Created') {

        this.notification.showSuccess("Added Successfully")

        this.isEditContribution = false;
        this.isShowAddPage = false;
        this.isShowSummary = true;
        this.paystatusform.reset();
        this.getDataPay();



      }
      else if(result.date_message){
        this.notification.showError(result.date_message)

      }
       else {
        this.notification.showError(result.description)

        return false;
      }
    })

  }

  getSectionss(forms) {
    return forms.controls.paydetail.controls;
  }

  deletepays(i) {
    (<FormArray>this.paystatusform.get('paydetail')).removeAt(i);
      this.notification.showSuccess("Empty Row Deleted Successfully")
  }

  addSections() {
    const control = <FormArray>this.paystatusform.get('paydetail');
    control.push(this.statusgrp());
  }

  functionalHead() {
    let gstkeyvalue: String = "";

    this.getFunctional(gstkeyvalue);

    this.empSearchForm.get('functional_head').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.uploadservice.getFunctionalHead(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),

          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.functionalHeadList = datas;

      })
  }

  private getFunctional(gstkeyvalue) {
    this.uploadservice.getFunctionalHead(gstkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.functionalHeadList = datas;
      })
  }

  public displayFnFunHead(fn?: FunctionHead): string | undefined {
    return fn ? fn.full_name : undefined;
  }

  get fn() {
    return this.empSearchForm.value.get('functional_head');
  }



  autocompleteFunctionalHeadScroll() {
    setTimeout(() => {
      if (
        this.matFHAutocomplete &&
        this.autocompleteTrigger &&
        this.matFHAutocomplete.panel
      ) {
        fromEvent(this.matFHAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matFHAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matFHAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matFHAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matFHAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.uploadservice.getFunctionalHead(this.fnInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.functionalHeadList = this.functionalHeadList.concat(datas);
                    if (this.functionalHeadList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  getAddScreen() {
    this.isShowAddPage = true;
    this.isShowSummary = false;

  }

  cancelClick() {
    this.isShowAddPage = false;
    this.isShowSummary = true;
  }

  getSearch() {
    let emplId = this.empSearchForm.value;
    let NewData = emplId?.functional_head?.id;
    let fDate = this.datepipe.transform((emplId.from_date), 'yyyy-MM-dd')
    let tDate = this.datepipe.transform((emplId.to_date), 'yyyy-MM-dd')
    this.uploadservice.getpaychanges(NewData, fDate, tDate).subscribe(results => {
      if (!results) {
        return false;
      }
      this.Summary = results['data'];
      this.isShowTable = true;

      this.pagination = results.pagination ? results.pagination : this.pagination;
    })

  }
  editPay(data) {
    this.isEditContribution = true;
    this.isShowSummary = false;
    this.isShowAddPage = false;
    this.uploadservice.getPay_ParticularGet(data.id).subscribe(res => {
      this.editForm.patchValue({
        functional_head: res.Employee_info.Employeename,
        from_date: res.from_date,
        to_date: res.to_date,
        pay_change: res.pay_change.id,
        reason: res.reason,
        id: res.id,
        empid: res.Employee_info.Employee_id



      })
    })

  }

  deletePay(id) {
    this.uploadservice.deletepays(id).subscribe(results => {
      if (results.status == 'success') {

        this.notification.showSuccess("Deleted Successfully")
        
      } else {
        this.notification.showError(results.description)

        return false;
      }
    })

  }
  onEdit() {
    let values = this.editForm.value;
    if(values.from_date === undefined || values.from_date === null || values.from_date === "") {
      this.notification.showError("Please Select From Date");
      return false;
    }
    if(values.to_date === undefined || values.to_date === null || values.to_date === "")
    {
      this.notification.showError("Please Select To Date");
      return false;
    }
    if(values.reason === undefined || values.reason === null || values.reason === "")
    {
      this.notification.showError("Please Select Reason");
      return false;
    }
    const payload = [{
      "employee_id": values.empid,
      "from_date": this.datepipe.transform((values.from_date), 'yyyy-MM-dd'),
      "to_date": this.datepipe.transform((values.to_date), 'yyyy-MM-dd'),
      "pay_change": values.pay_change,
      "reason": values.reason,
      "id": values.id
    }];
    this.uploadservice.addNewPayChange(payload).subscribe(result => {
      this.notification.showSuccess("Updated Successfully")
      this.isShowSummary = true;
      this.isShowAddPage = false;
      this.isEditContribution = false;

    })

  }
  onCancel() {


    this.isEditContribution = false;
    this.isShowAddPage = false;
    this.isShowSummary = true;

  }
  addCancel() {
    this.isEditContribution = false;
    this.isShowSummary = true;
    this.isShowAddPage = false;
    this.paystatusform.reset();
    const control = <FormArray>this.paystatusform.get('paydetail');
    control.clear();
  }

  autocompleteFunctionalHeadScrolls() {
    setTimeout(() => {
      if (
        this.matFHAutocompletes &&
        this.autocompleteTrigger &&
        this.matFHAutocompletes.panel
      ) {
        fromEvent(this.matFHAutocompletes.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matFHAutocompletes.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matFHAutocompletes.panel.nativeElement.scrollTop;
            const scrollHeight = this.matFHAutocompletes.panel.nativeElement.scrollHeight;
            const elementHeight = this.matFHAutocompletes.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.uploadservice.getFunctionalHead(this.fnInputs.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.functionalHeadList = this.functionalHeadList.concat(datas);
                    if (this.functionalHeadList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public displayFnFunHeads(fns?: FunctionHead): string | undefined {
    return fns ? fns.full_name : undefined;
  }

  get fns() {
    return this.paystatusform.get('paydetail').value.functional_head;

  }

  functionalHeads() {
    let gstkeyvalue: String = "";

    this.getFunctional(gstkeyvalue);

    (this.paystatusform.get('paydetail') as FormArray).at(0).get('functional_head').valueChanges

      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.uploadservice.getFunctionalHead(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),

          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.functionalHeadList = datas;

      })
  }
  ActiveDate(int){
    let values = this.emp_paysrtuctureform.get('employeepay_detail').value[int];
    
      
      
        this.fromdatevalue.push(values.fromDate)
        console.log('loop',this.fromdatevalue);
        
        (this.emp_paysrtuctureform.get('employeepay_detail') as FormArray).get([int, 'min']).patchValue(values.fromDate);


      
     
    
  }

  EarnFormsubmission() {
    this.SpinnerService.show();
    let values = this.emp_paysrtuctureform.get('employeepay_detail').value;
    let payload = [];
    for (let i = 0; i < values.length; i++) {

      if(values[i].functional_head.id === null || values[i].functional_head.id === undefined || values[i].functional_head.id === '' )
      {
        this.notification.showError("Please Select Employee in row  " + i);
        this.SpinnerService.hide();
        return false;
      }
      if(values[i].paycomponent=== null || values[i].paycomponent=== undefined || values[i].paycomponent=== "")
      {
        this.notification.showError("Please Select Pay Component in row  " + i);
        this.SpinnerService.hide();
        return false;
      }
      if(values[i].fromDate === null || values[i].fromDate === undefined || values[i].fromDate === '')
      {
        this.notification.showError("Please Select Active Date in row  " + i);
        this.SpinnerService.hide();
        return false;
      }
      if(values[i].toDate === null || values[i].toDate === undefined || values[i].toDate === '')
      {
        this.notification.showError("Please Select End Date in row  " + i);
        this.SpinnerService.hide();
        return false;
      }
   
      if(values[i].amount === null || values[i].amount === undefined || values[i].amount ==='')
      {
        this.notification.showError("Please Enter Amount in row  " + i);
        this.SpinnerService.hide();
        return false;
      }

      let item = {
        "employee_id": values[i]?.functional_head?.id,
        "active_date": this.datepipe.transform(values[i].fromDate, 'yyyy-MM-dd'),
        "end_date": this.datepipe.transform(values[i].toDate, 'yyyy-MM-dd'),
        "type": values[i].paycomponent.id,
        "amount": values[i].amount,
        "custom_deduct": 0
      };
      payload.push(item);
    }
    
    if(payload.length === 0){
      this.notification.showError("Atleast add one Custom Earnings...");
      this.SpinnerService.hide();
      return false;
    }
  
    this.uploadservice.addNewAllowance(payload).subscribe(result => {
      this.SpinnerService.hide();
      if (result.message == 'Successfully Created') {
        this.notification.showSuccess("Added Successfully")
        this.isShowNewAdd = false;
        this.isShowSummarys = true;
        this.getAddAllowances();
        this.emp_paysrtuctureform.reset();
      }
      else if(result.date_message){
        this.notification.showError(result.date_message)
      } 
      else {
        this.notification.showError(result.description)
        return false;
      }
    },
    error=>{
      this.SpinnerService.hide()
    })
  }

  public displayFnFunHeadss(fn?: FunctionHead): string | undefined {
    return fn ? fn.full_name : undefined;
  }

  get fnss() {
    return this.empSearchForms.value.get('functional_head');
  }



  autocompleteFunctionalHeadScrollss() {
    setTimeout(() => {
      if (
        this.matFHAutocomplete &&
        this.autocompleteTrigger &&
        this.matFHAutocomplete.panel
      ) {
        fromEvent(this.matFHAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matFHAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matFHAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matFHAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matFHAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.uploadservice.getFunctionalHead(this.fnInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.functionalHeadList = this.functionalHeadList.concat(datas);
                    if (this.functionalHeadList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  functionalHeadss() {
    let gstkeyvalue: String = "";

    this.getFunctional(gstkeyvalue);

    this.empSearchForms.get('functional_head').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.uploadservice.getFunctionalHead(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),

          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.functionalHeadList = datas;

      })
  }

  getAddAllowances() {
    this.SpinnerService.show()
    this.uploadservice.getNewAllowances(this.pagination.index).subscribe(results => {
      if (!results) {
        return false;
      }
      this.SpinnerService.hide()
      this.Summarys = results['data'];
      this.isShowTable = true;

      this.pagination = results.pagination ? results.pagination : this.pagination;
    },
    error=>{
      this.SpinnerService.hide()
    })

  }

  addNewAllowance() {
    this.isShowSummarys = false;
    this.isShowNewAdd = true;
  }


  autocompleteFunctionalHeadScrol() {
    setTimeout(() => {
      if (
        this.matFHAutocomplet &&
        this.autocompleteTrigger &&
        this.matFHAutocomplet.panel
      ) {
        fromEvent(this.matFHAutocomplet.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matFHAutocomplet.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matFHAutocomplet.panel.nativeElement.scrollTop;
            const scrollHeight = this.matFHAutocomplet.panel.nativeElement.scrollHeight;
            const elementHeight = this.matFHAutocomplet.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.uploadservice.getFunctionalHead(this.fnInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.functionalHeadList = this.functionalHeadList.concat(datas);
                    if (this.functionalHeadList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  
  
  
  
  
  
  
  employeecomponent_search(value) {
    this.uploadservice.getFunctionalHead(value, 1).subscribe(data => {
      this.functionalHeadList = data['data'];
    });
  }
  public displayFnFunHea(fnd?: FunctionHead): string | undefined {
    return fnd ? fnd.full_name : undefined;
  }

  get fnd() {
    return this.emp_paysrtuctureform.get('employeepay_detail').value.functional_head;

  }

  functionalHeade() {
    let gstkeyvalue: String = "";

    this.getFunctional(gstkeyvalue);

    (this.emp_paysrtuctureform.get('employeepay_detail') as FormArray).at(0).get('functional_head').valueChanges

      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.uploadservice.getFunctionalHead(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),

          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.functionalHeadList = datas;

      })
  }

  prevpages() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.getAddAllowances();
  }
  nextpages() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getAddAllowances();
  }

  deleteAllowance(data) {
    if (data.id == undefined) {
      this.notification.showSuccess("Empty Row Deleted Successfully")

    }
    else {

      this.uploadservice.deleteallowances(data.id).subscribe(results => {
        if (results.status == 'success') {

          this.notification.showSuccess("Deleted Successfully")
          this.getAddAllowances();
          
        } else {
          this.notification.showError(results.description)

          return false;
        }
      })
    }

  }
  editAllowance(data) {
    this.isEditAllowance = true;
    this.isShowSummarys = false;
    this.isShowNewAdd = false;
    this.uploadservice.getAllowance_ParticularGet(data.id).subscribe(res => {

      this.editForms.patchValue({
        functional_head: res.Employee_info.Employeename,
        active_date: res.active_date,
        end_date: res.end_date,
        type: res.type,
        amount: res.amount,
        id: res.id,
        empid: res.Employee_info.Employee_id



      })
    })

  }

  onEdits() {
    let values = this.editForms.value;
    if(values.active_date === null || values.active_date === undefined || values.active_date === "") {
      this.notification.showError("Please Select Active Date");
      return false;
    }  
    if(values.end_date === null || values.end_date === undefined || values.end_date === "") {
      this.notification.showError("Please Select End Date");
      return false;
    } 
    if(values.amount === null || values.amount === undefined || values.amount === "") {
      this.notification.showError("Please enter Amount");
      return false;
    } 
    const payload = [{
      "employee_id": values.empid,
      "active_date": this.datepipe.transform((values.active_date), 'yyyy-MM-dd'),
      "end_date": this.datepipe.transform((values.end_date), 'yyyy-MM-dd'),
      "type": values.type,
      "amount": values.amount,
      "id": values.id,
      "custom_deduct": 0
    }];
    this.uploadservice.addNewAllowance(payload).subscribe(result => {
      if(result.date_message){
        this.notification.showError(result.date_message)
      }
      else{
        this.notification.showSuccess("Updated Successfully")
        this.isShowSummarys = true;
        this.isShowNewAdd = false;
        this.isEditAllowance = false;
        this.getAddAllowances();
      }
     
    })
  }
  cancelClicks() {
    this.isShowNewAdd = false;
    this.isShowSummarys = true;
    this.emp_paysrtuctureform.reset();
    const control = <FormArray>this.emp_paysrtuctureform.get('employeepay_detail');
    control.clear();
  }

  onCancels() {


    this.isEditAllowance = false;
    this.isShowNewAdd = false;
    this.isShowSummarys = true;

  }

  getDataPay() {
    this.uploadservice.getpaydata(this.pagination.index).subscribe(results => {
      if (!results) {
        return false;
      }
      this.Summary = results['data'];
      this.isShowTable = true;

      this.pagination = results.pagination ? results.pagination : this.pagination;
    })

  }

  /**
* This is the Search function
*/

  getSearchs() {
    this.SpinnerService.show();
    let emplId = this.empSearchForms.value;
    let NewData = emplId?.functional_head?.id;
    let fDate = this.datepipe.transform((emplId.from_date), 'yyyy-MM-dd')
    let tDate = this.datepipe.transform((emplId.to_date), 'yyyy-MM-dd')
    this.uploadservice.getallowancechangesEarnings(NewData, fDate, tDate).subscribe(results => {
      if (!results) {
        return false;
      }
      this.Summarys = results['data'];
      this.isShowTables = true;
      this.pagination = results.pagination ? results.pagination : this.pagination;
      this.SpinnerService.hide();
    })
  }

  clearForm() {
    this.empSearchForms.reset();
    this.getAddAllowances();
  }

  clearForms() {
    this.empSearchForm.reset();
    this.getDataPay();
  }

  prevpag() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.getDataPay();
  }
  nextpag() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getDataPay();
  }



  
  autocompleteFunctionalHeadScrll() {
    setTimeout(() => {
      if (
        this.matFHAutocomplet &&
        this.autocompleteTrig &&
        this.matFHAutocomplets.panel
      ) {
        fromEvent(this.matFHAutocomplets.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matFHAutocomplets.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrig.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matFHAutocomplets.panel.nativeElement.scrollTop;
            const scrollHeight = this.matFHAutocomplets.panel.nativeElement.scrollHeight;
            const elementHeight = this.matFHAutocomplets.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.uploadservice.getFunctionalHead(this.fnInputss.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.functionalHeadList = this.functionalHeadList.concat(datas);
                    if (this.functionalHeadList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public displayFnFunHeas(fnds?: FunctionHead): string | undefined {
    return fnds ? fnds.full_name : undefined;
  }

  get fnds() {
    return this.deductsrtuctureform.get('employeepay_detail').value.functional_head;

  }

  functionalHeades() {
    let gstkeyvalue: String = "";

    this.getFunctional(gstkeyvalue);

    (this.deductsrtuctureform.get('employeepay_detail') as FormArray).at(0).get('functional_head').valueChanges

      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.uploadservice.getFunctionalHead(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),

          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.functionalHeadList = datas;

      })
  }

  DeductFormsubmission()
  {
    this.SpinnerService.show();
    let values = this.deductsrtuctureform.get('employeepay_detail').value;


    
    let payload = [];
    for (let i = 0; i < values.length; i++) {

      
      if(values[i].functional_head.id === null || values[i].functional_head.id === undefined || values[i].functional_head.id === '' )
      {
        this.notification.showError("Please Select Employee in row  " + i);
        this.SpinnerService.hide();
        return false;
      }
      if(values[i].type=== null || values[i].type=== undefined || values[i].type=== "")
      {
        this.notification.showError("Please Select Pay Component in row  " + i);
        this.SpinnerService.hide();
        return false;
      }
      if(values[i].fromDate === null || values[i].fromDate === undefined || values[i].fromDate === '')
      {
        this.notification.showError("Please Select Active Date in row  " + i);
        this.SpinnerService.hide();
        return false;
      }
      if(values[i].toDate === null || values[i].toDate === undefined || values[i].toDate === '')
      {
        this.notification.showError("Please Select End Date in row  " + i);
        this.SpinnerService.hide();
        return false;
      }
   
      if(values[i].amount === null || values[i].amount === undefined || values[i].amount ==='')
      {
        this.notification.showError("Please Enter Amount in row  " + i);
        this.SpinnerService.hide();
        return false;
      }

      let item = {
        "employee_id": values[i].functional_head.id,
        "active_date": this.datepipe.transform(values[i].fromDate, 'yyyy-MM-dd'),
        "end_date": this.datepipe.transform(values[i].toDate, 'yyyy-MM-dd'),
        "type": values[i].type.id,
        "amount": values[i].amount,
        "custom_deduct" : 1
      };
this.SpinnerService.hide();
      payload.push(item);
    }
    if(payload.length === 0){
      this.notification.showError("Atleast add one Custom Deduction...");
      this.SpinnerService.hide();
      return false;
    }
    this.uploadservice.addNewDeduction(payload).subscribe(result => {
      if (result.message == 'Successfully Created') {

        this.notification.showSuccess("Added Successfully")
        
        this.isShowNewAdds = false;
        this.isShowDSummary = true;
        this.getAddAllowances();
        this.deductsrtuctureform.reset();
        this.getDeductions();



      }
      else if(result.date_message){
        this.notification.showError(result.date_message)
      } 
       else {
        this.notification.showError(result.description)

        return false;
      }
    },
    error=>{
      this.SpinnerService.hide()
    })
    
  }

  getDSearchs() {
    let emplId = this.empDSearchForms.value;
    let NewData = emplId?.functional_head?.id;
    let fDate = this.datepipe.transform((emplId.from_date), 'yyyy-MM-dd')
    let tDate = this.datepipe.transform((emplId.to_date), 'yyyy-MM-dd')
    this.uploadservice.getallowancechanges(NewData, fDate, tDate).subscribe(results => {
      if (!results) {
        return false;
      }
      this.DSummary = results['data'];
      this.isShowTables = true;

      this.pagination = results.pagination ? results.pagination : this.pagination;
    })

  }

  clearDForm() {
    this.empDSearchForms.reset();
    this.getDeductions();
  }
  getDeductions() {
    this.uploadservice.getDeductionSummary(this.pagination.index).subscribe(results => {
      if (!results) {
        return false;
      }
      this.DSummary = results['data'];
      this.isShowTable = true;

      this.pagination = results.pagination ? results.pagination : this.pagination;
    })

  }
  addNewDeduction() {
    this.isShowDSummary = false;
    this.isShowNewAdds = true;
  }

  editDeduction(data) {
    this.isEditDeduction = true;
    this.isShowDSummary = false;
    this.isShowNewAdds = false;
    this.uploadservice.getAllowance_ParticularGet(data.id).subscribe(res => {

      this.editFormD.patchValue({
        functional_head: res.Employee_info.Employeename,
        active_date: res.active_date,
        end_date: res.end_date,
        type: res.type,
        amount: res.amount,
        id: res.id,
        empid: res.Employee_info.Employee_id
      })
    })

  }

  onEditDed() {
    let values = this.editFormD.value;
    if(values.active_date === undefined || values.active_date === null || values.active_date ==="") {
      this.notification.showError("Please Select Active Date");
      return false; 
    }
    if(values.end_date === undefined || values.end_date === null || values.end_date ==="") {
      this.notification.showError("Please Select End Date");
      return false; 
    }
    if(values.amount === undefined || values.amount === null || values.amount ==="") {
      this.notification.showError("Please Enter Amount");
      return false; 
    }
    const payload = [{
      "employee_id": values.empid,
      "active_date": this.datepipe.transform((values.active_date), 'yyyy-MM-dd'),
      "end_date": this.datepipe.transform((values.end_date), 'yyyy-MM-dd'),
      "type": values.type,
      "amount": values.amount,
      "id": values.id,
      "custom_deduct": 1
    }];

    this.uploadservice.addNewDeduction(payload).subscribe(result => {
      if(result.date_message){
        this.notification.showError(result.date_message)
      } 
      else{
        this.notification.showSuccess("Updated Successfully")
        this.isShowDSummary = true;
        this.isShowNewAdds = false;
        this.isEditDeduction = false;
        this.getDeductions();
      }

    
    })
  }
  deleteDeductions(data) {
    if (data.id == undefined) {
      this.notification.showSuccess("Empty Row Deleted Successfully")

    }
    else {

      this.uploadservice.deleteallowances(data.id).subscribe(results => {
        if (results.status == 'success') {

          this.notification.showSuccess("Deleted Successfully")
          this.getDeductions();
          
        } else {
          this.notification.showError(results.description)

          return false;
        }
      })
    }

  }
  cancelClickD() {
    this.isShowNewAdds = false;
    this.isShowDSummary = true;
    this.deductsrtuctureform.reset();
    const control = <FormArray>this.deductsrtuctureform.get('employeepay_detail');
    control.clear();
  }

  onCancelD() {


    this.isEditDeduction = false;
    this.isShowNewAdds = false;
    this.isShowDSummary = true;

  }

  
  public displayFnFunHeadD(fn?: FunctionHead): string | undefined {
    return fn ? fn.full_name : undefined;
  }

  get fnsD() {
    return this.empSearchForms.value.get('functional_head');
  }



  autocompleteFunctionalHeadScrollD() {
    setTimeout(() => {
      if (
        this.matFHAutocompleteD &&
        this.autocompleteTrigger &&
        this.matFHAutocompleteD.panel
      ) {
        fromEvent(this.matFHAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matFHAutocompleteD.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matFHAutocompleteD.panel.nativeElement.scrollTop;
            const scrollHeight = this.matFHAutocompleteD.panel.nativeElement.scrollHeight;
            const elementHeight = this.matFHAutocompleteD.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.uploadservice.getFunctionalHead(this.fnInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.functionalHeadList = this.functionalHeadList.concat(datas);
                    if (this.functionalHeadList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  functionalHeadD() {
    let gstkeyvalue: String = "";

    this.getFunctional(gstkeyvalue);

    this.empDSearchForms.get('functional_head').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.uploadservice.getFunctionalHead(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),

          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.functionalHeadList = datas;

      })
  }
  prevpageD() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.getDeductions();
  }
  nextpageD() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getDeductions();
  }

  downloadTemplate()
  {
    this.uploadservice.downloadTemplate().subscribe(results => {
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "Sample_template" + ".xlsx";
      link.click();
    })    
  }

  paycomponent_searchs(value) {
    let page = 1;
    this.paycomponent_arrays = []; 
  
    
    const fetchPageData = () => {
      this.uploadservice.getpaycomponents(value, page).subscribe(data => {
        const pageData = data['data'];
  
        
        if (pageData.length > 0) {
          
          this.paycomponent_arrays = this.paycomponent_arrays.concat(pageData);
          
          
          page++;
  
          
          fetchPageData();
        }
      });
    };
  
    
    fetchPageData();
    console.log("Pay comp datasss", this.paycomponent_arrays)
  }
  fileChangededuction(file){
    const files:FileList=file.target.files
    this.labelImportDeduction.nativeElement.innerText=Array.from(files).map(f=>f.name)
    this.filedata=file.target.files[0]
  }
  Upload(){
    this.uploadservice.BulkUploadDeductionUpload(this.filedata).subscribe(data=>{
      if(data.message.SuccessMessage){
        this.notification.showSuccess(data.message.SuccessMessage)
      }
      else if(data.message[0].ErrorMessage){
        this.notification.showError(data.message[0].ErrorMessage)
      }

   
    })
  }
  Download(){
    this.uploadservice.BulkUploadDeductionTemplate().subscribe(data=>{
      let binaryData=[]
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "Sample_template" + ".xlsx";
      link.click();
    })
  }
  					
}


