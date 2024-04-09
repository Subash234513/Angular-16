import { Component, OnInit,ViewChild,Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../../service/shared.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PayingempService } from '../payingemp.service';
import { PayingempShareService } from '../payingemp-share.service';
import { MatAutocompleteSelectedEvent,MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { Observable, from, fromEvent } from 'rxjs';

export interface FunctionHead {
  id: string;
  full_name: string;
}

@Component({
  selector: 'app-newemployeepay',
  templateUrl: './newemployeepay.component.html',
  styleUrls: ['./newemployeepay.component.scss','../payroll.scss']
})
export class NewemployeepayComponent implements OnInit {

  @ViewChild('fn') matFHAutocomplete: MatAutocomplete;
  @ViewChild('fnInput') fnInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  payrollsubmoduleList:any;
  empList:any;
  presentpageemp: number = 1;
  pagesizeemp=10;
  has_nextEmp = true;
  has_previousEmp = true;
  empSearchForm:FormGroup;
  functionalHeadList: Array<FunctionHead>;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  isLoading = false;
  statusList:any;
  paysummary: boolean;
  isShowFilters: boolean = true;

  constructor(private shareService: SharedService,
    private formBuilder: FormBuilder,private router: Router,private datePipe: DatePipe,
    private SpinnerService: NgxSpinnerService,private errorHandler: ErrorHandlingServiceService,
    private payrollservice: PayingempService,private notification: NotificationService, private payrollShareService:PayingempShareService) { }

  ngOnInit(): void {
    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Employee Payroll") {
        this.payrollsubmoduleList = subModule;
        console.log("payroll component value",this.payrollsubmoduleList)
      }})
      

      this.empSearchForm = this.formBuilder.group({
        code: [''],
        functional_head: [''],
        status: ['']
      })

      this.empSearch('');
      this.getStatusList();
  }

// 
paystructure_creation(e){
  this.payrollShareService.empView_id.next(e);
  this.router.navigate(['/payingemployee/emp_pay'], { skipLocationChange: true })
}
// 
  isshowemployeedetails= true
  addempcreate = false
  isshowEmployeeView = false
  ismasterForm = false
  subModuleData(data) { 
    if(data.url == '/employeedetails'){
      this.isshowemployeedetails = true;
      this.addempcreate = false; 

      this.ismasterForm = false;

      this.paysummary=false;
    }
    if(data.url == '/payrollsmry'){
      this.isshowemployeedetails = false;
      this.addempcreate = false; 
      this.paysummary=true;

    }
    
  }

  payroll(){
      this.isshowemployeedetails = false;
      this.addempcreate = false; 
      this.ismasterForm = true;
      this.payrollShareService.payroll.next('Payroll')
  }
  employeePF(){
      this.isshowemployeedetails = false;
      this.addempcreate = false; 
      this.ismasterForm = true;
      this.payrollShareService.employeepf.next('EmployeePF')
  }

  getStatusList() {
    this.payrollservice.getStatusListApi()
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.statusList = datas;
      })
  }

  getAddScreen(){
    this.addempcreate = true;
    this.isshowemployeedetails = false;
    this.ismasterForm = false;
  }


  empSearch(hint:any) {
    let search = this.empSearchForm.value;
    let obj = {
      "code": search?.code,
      "functional_head": search?.functional_head.id,
      "status": search?.status
    }
    console.log("obj api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }
    this.SpinnerService.show();
    if (hint == 'next') {
      this.empSummary(obj,this.presentpageemp + 1)
    }
    else if (hint == 'previous') {
      this.empSummary(obj,this.presentpageemp - 1)
    }
    else {
      this.empSummary(obj,1);
    }
  }


  empSummary(obj,pageno) {
    // this.empList = this.FETCHDATA
    this.payrollservice.empSummary(obj,pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("emp detail summary", result)
        this.empList = result['data']
        let dataPagination = result['pagination'];
        if (this.empList.length > 0) {
          this.has_nextEmp = dataPagination.has_next;
          this.has_previousEmp = dataPagination.has_previous;
          this.presentpageemp = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      
      )
  }

  empDetailCancel() {
      this.isshowemployeedetails = true;
      this.addempcreate = false;
      this.isshowEmployeeView = false;
      this.ismasterForm = false;
   
  }

  empDetailSubmit(){
    this.isshowemployeedetails = true;
    this.addempcreate = false;
    this.isshowEmployeeView = false;
    this.ismasterForm = false;
    this.empSearch('');
  }
  gotopaysummary(){
    this.paysummary=true;
    this.isshowemployeedetails = false;
    this.addempcreate = false;
    this.isshowEmployeeView = false;

  }
  backtomain(){
    this.isshowemployeedetails = true;
    this.addempcreate = false;
    this.isshowEmployeeView = false;
    this.paysummary=false;
  }

  getemployeeviewclick(id){
    this.isshowemployeedetails = false;
    this. addempcreate= false;
    this.isshowEmployeeView = true;
    this.ismasterForm = false;
    this.payrollShareService.empView_id.next(id);
  }

  empviewCancel(){
    this.isshowemployeedetails = true;
    this.addempcreate = false;
    this.isshowEmployeeView = false;
    this.ismasterForm = false;
    this.empSearch('');
  }

  resetEmpSearchk() {
    this.empSearchForm = this.formBuilder.group({
      code:  '',
      functional_head: '',
      status: ''
    })
    this.empSearch('')

  }


  functionalHead(){
    let gstkeyvalue: String = "";
   
    this.getFunctional(gstkeyvalue);

    this.empSearchForm.get('functional_head').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.payrollservice.getFunctionalHead(value,1)
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
    this.payrollservice.getFunctionalHead(gstkeyvalue,1)
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
                this.payrollservice.getFunctionalHead(this.fnInput.nativeElement.value, this.currentpage + 1)
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

showFilters()
{
  this.isShowFilters = !this.isShowFilters;
}

clear() {
  this.empSearchForm.get('code').reset();
}
removeFilters()
{ 
  this.empSearchForm.get('functional_head').reset();
  this.empSearchForm.get('status').reset();
  this.empSearchForm.get('code').reset();
  this.empSearch('');

}


}
