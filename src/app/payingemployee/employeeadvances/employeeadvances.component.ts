import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { PayingempService } from '../payingemp.service';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { SharedService } from 'src/app/service/shared.service';
import { Subscription, combineLatest, forkJoin, of } from 'rxjs';

export interface FunctionHead {
  id: string;
  full_name: string;
}
@Component({
  selector: 'app-employeeadvances',
  templateUrl: './employeeadvances.component.html',
  styleUrls: ['./employeeadvances.component.scss']
})
export class EmployeeadvancesComponent implements OnInit {
  isLoading: boolean;
  @ViewChild('fn') matFHAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('fnInput') fnInput: any;
  // datepipe: any;

  constructor(private payRollService:PayingempService, private fb: FormBuilder, private notification: NotificationService,
    private router: Router, private SpinnerService: NgxSpinnerService, public datepipe: DatePipe, private sharedservice: SharedService) { 
      this.fromDateControl.setValue(this.currentDate);
    }
  advanceSummary: [];
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  isShowSummary : boolean = true;
  isShowNewAdd : boolean = false;
  isShowAdvanceEdit: boolean = false;
  advSearchForm: FormGroup;
  newAdvanceForm: FormGroup;
  editAdvanceForm: FormGroup;
  empData: Array<FunctionHead>;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  TranHistoryList: any;
  idEmployee: any;
  EmployeeFullName: any;
  payRole: any;
  interPermission: any;
  adminUser: boolean = false;
  normalUser: boolean = false;
  empbranchid: any;
  currentUser: any;
  makerUser:  boolean = false;
  checkUser: boolean = false;
  checkerUser: boolean = false;
  currentId: any;
  approveDetails: any;
  empId: any;
  personData : any;
  isShowApproval: boolean = false;
  currentDate = new Date();
  fromDateControl = new FormControl();
  subscription: Subscription;
  select : any;
  ngOnInit(): void {
    const getDataid = localStorage.getItem("sessionData")
    let idValue = JSON.parse(getDataid);
     this.idEmployee = idValue.employee_id;
    this.EmployeeFullName = idValue.name;

    let userdata = this.sharedservice.transactionList
    console.log("USER DATE", userdata)
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

          console.log("PERMISSION", this.interPermission)
        }
        if (element.name.toLowerCase() == 'maker' || element.name.toLowerCase() == 'checker' || element.name.toLowerCase() == 'admin' ) {
          this.interPermission = element.code
          this.normalUser = true;
          console.log("PERMISSION", this.interPermission)
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

    this.advSearchForm = this.fb.group({
      empName: '',
      status:'',
      status1:''
    })
    this.newAdvanceForm = this.fb.group({
      emplName: '',
      fromDate:'',
      toDate:'',
      actual_amount:'',
      payable_amount:'',
      reason:'',
      emi_amount:'',
      remarks:'',
      advance_status:''

      

    })

    this.editAdvanceForm = this.fb.group({
      id:'',
      emplName: '',
      fromDate:'',
      toDate:'',
      actual_amount:'',
      payable_amount:'',
      reason:'',
      emi_amount:'',
      remarks:'',
      advance_status:'',
      employee_id: ''

    })

    this.getAdvanceSummary();
      this.subscription = this.newAdvanceForm.get('fromDate').valueChanges.subscribe(data => {
      this.select = new Date(this.newAdvanceForm.get('fromDate').value);
    })
  }


  getAdvanceSummary()
  {
      this.payRollService.getEmpAdvances(this.pagination.index).subscribe(results => {
        if (!results) {
          return false;
        }
        this.advanceSummary = results['data'];
        this.isShowSummary =true;
        this.isShowNewAdd = false;
        this.isShowAdvanceEdit = false;
        this.pagination = results.pagination ? results.pagination : this.pagination;
      })
  
    }
    addNewAdvance()
    {
      this.isShowSummary =false;
      this.isShowNewAdd = true;
      this.isShowAdvanceEdit = false;
    }

    functionalHead(){
      let gstkeyvalue: String = "";
     
      this.getFunctional(gstkeyvalue);
  
      this.newAdvanceForm.get('emplName').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.payRollService.getFunctionalHead(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
              
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.empData = datas;
  
        })
    }

    private getFunctional(gstkeyvalue) {
      this.payRollService.getFunctionalHead(gstkeyvalue,1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.empData = datas;
        })
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
                  this.payRollService.getFunctionalHead(this.fnInput.nativeElement.value, this.currentpage + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.empData = this.empData.concat(datas);
                      if (this.empData.length >= 0) {
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

    public displayFnFunHead(fn?: FunctionHead): string | undefined {
      return fn ? fn.full_name : undefined;
    }
  
    // get fn() {
    //   return this.newAdvanceForm.value.get('emplName');
    // }
    get fn() {
      const formValue = this.newAdvanceForm.value;
      if (formValue && typeof formValue.get === 'function') {
        return formValue.get('emplName');
      } else {
        console.error('Unable to retrieve form value or get method is missing.');
        return null; // or any default value you want to assign
      }
    }

    cancelAdd()
    {
      this.newAdvanceForm.reset();
      this.isShowSummary =true;
      this.isShowNewAdd = false;
      this.isShowAdvanceEdit = false;
      this.isShowApproval = false;

    }
    addAdvance()
    {
      let values = this.newAdvanceForm.value;
      console.log("EMP Values", values)
      let FromDates  = values.fromDate;
      console.log("FROM DATE", FromDates)
      

      let payload = {
        "employee_id": this.idEmployee ,
        // "type":3,
        "from_date":  this.datepipe.transform((values.fromDate), 'yyyy-MM-dd'),
        "to_date": this.datepipe.transform((values.toDate), 'yyyy-MM-dd'),
        "advance_status":1,
        "actual_amount":values.actual_amount,
        "emi_amount": values.emi_amount,
        "payable_amount": values.payable_amount,
        "reason": values.reason,
        "remarks":values.remarks
      }
      this.payRollService.addNewAdvanceEmployee(payload).subscribe(result => {
        if (result.message == 'Successfully Created') {
  
          this.notification.showSuccess("Added Successfully")
          this.getAdvanceSummary();
          this.isShowSummary =true;
          this.isShowNewAdd = false;
          this.isShowAdvanceEdit = false;
          this.newAdvanceForm.reset();
  
        } else {
          this.notification.showError(result.description)
  
          return false;
        }
      })
    }
    deleteAdvance(id) {
      this.payRollService.deleteempadvance(id).subscribe(results => {
        if (results.status == 'success') {
  
          this.notification.showSuccess("Deleted Successfully")
          this.getAdvanceSummary();
        } else {
          this.notification.showError(results.description)
  
          return false;
        }
      })
    }

    editAdvance(data)
    {
      this.isShowSummary =false;
      this.isShowNewAdd = false;
      this.isShowAdvanceEdit = true;
      this.payRollService.getAdvanceParticularGet(data.id).subscribe(result=>
        {
          console.log("API RESPONSE", result)
          this.editAdvanceForm.patchValue({
            id: result.id,
            emplName: result.name,
            fromDate: result.from_date,
            toDate: result.to_date,
            actual_amount: result.actual_amount,
            payable_amount: result.payable_amount,
            reason: result.reason,
            emi_amount: result.emi_amount,
            remarks: result.remarks,
            advance_status: result.advance_status.id,
            type: result.type,
            employee_id: result.employee_id
          })
        })


    }

    prevpage()
    {
      if(this.pagination.has_previous){
        this.pagination.index = this.pagination.index-1
      }
      this.getAdvanceSummary();
    }
    nextpage()
    {
      if(this.pagination.has_next){
        this.pagination.index = this.pagination.index+1
      }
      this.getAdvanceSummary();
  
    }

    gettranhistory(data) {
      let headerId = data.id
      console.log("headerId", headerId)
      this.payRollService.getAdvanceHistory(headerId)
        .subscribe((results) => {
          let datas = results['data'];
          console.log("getranhistory", datas);
          console.log("Type OF", typeof(datas))
          this.TranHistoryList = datas;
        },(error) => {
          this.notification.showError(error)
        })
    }

    AdvanceSubmit()
    {
      let values = this.editAdvanceForm.value;
      let payload = {
        "emplName": values.emplName,
        "employee_id": this.idEmployee,
        "type": values.type,
        "from_date":  this.datepipe.transform((values.fromDate), 'yyyy-MM-dd'),
        "to_date": this.datepipe.transform((values.toDate), 'yyyy-MM-dd'),
        "advance_status": values?.advance_status?.id,
        "actual_amount":values.actual_amount,
        "emi_amount": values.emi_amount,
        "payable_amount": values.payable_amount,
        "reason": values.reason,
        "remarks":values.remarks,
        "id": values.id
      }
      this.payRollService.addNewAdvanceEmployee(payload).subscribe(result => {
        if (result.message == 'Successfully Updated') {
  
          this.notification.showSuccess("Updated Successfully")
          this.getAdvanceSummary();
          this.isShowSummary =true;
          this.isShowNewAdd = false;
          this.isShowAdvanceEdit = false;
          this.newAdvanceForm.reset();
  
        } else {
          this.notification.showError(result.message)
  
          return false;
        }
      })

    }

    gotoNewAdvance()
    {
      this.router.navigate(['payingemployee/newadvance'])
    }

    approveAdvance(data)
    {
      this.isShowSummary =false;
      this.isShowNewAdd = false;
      this.isShowAdvanceEdit = false;
      this.isShowApproval  = true;
      this.payRollService.getAdvanceParticularGet(data.id).subscribe(result=>{
        this.approveDetails = result
        this.currentId = result.id
    
      })


    }

    finalApprove()
{
  // let employee_ids = this.selectedId
  // let values = this.advanceApprove.value;
  // console.log("EMP Values", values)
  this.payRollService.advanceFinalApproval(this.currentId).subscribe(result => {
    if (result.status == 'success') {

      this.notification.showSuccess("Advance Approved")
      this.getAdvanceSummary();
      this.isShowApproval = false;
      this.isShowSummary =true;
      // this.advRequest.reset();

    } else {
      this.notification.showError(result.description)

      return false;
    }
  }) 
}

rejectAdvances()
{
  // let employee_ids = this.selectedId
  // let values = this.advanceApprove.value;
  // console.log("EMP Values", values)
  this.payRollService.advanceReject(this.currentId).subscribe(result => {
    if (result.status == 'success') {

      this.notification.showWarning("Advance Rejected")
      this.getAdvanceSummary();
      this.isShowApproval = false;
      this.isShowSummary =true;
      // this.advRequest.reset();

    } else {
      this.notification.showError(result.description)

      return false;
    }
  }) 
}

     
  

}
