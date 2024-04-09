import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { EcfService } from '../ecf.service';
import { ShareService } from '../share.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NotificationService } from '../notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { fromEvent } from 'rxjs';
import { ErrorHandlingService } from '../error-handling.service';




export interface supplierListss {
  name: string;
  id: number;
}

export interface branchListss {
  name: string;
  codename: string;
  id: number;
}

export interface employeeListss {
  full_name: string;
  id: number;
}



export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd/MM/yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}


@Component({
  selector: 'app-ecf',
  templateUrl: './ecf.component.html',
  styleUrls: ['./ecf.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class EcfComponent implements OnInit {

  

  ECF_Sub_Menu_List: any;
  sub_module_url: any;
  pageSize = 10;
  Current_Page: string;

  ecfinventory: any;
  ecfapproval: any;
  ecfsummary: any;
  ecfcosummary:any

  ecfinventoryPath: any;
  ecfapprovalPath: any;
  ecfsummaryPath: any;
  ecfcosummaryPath:any

  ecfinventoryForm: boolean;
  ecfapprovalForm: boolean;
  ecfsummaryForm: boolean;
  ecfcosummaryForm:boolean
  ecfreport:any
  ecfviewForm: boolean;
  showapproverview: boolean;
  showappdtlview: boolean
  ecfcoview:boolean

  ecfSearchForm: FormGroup;
  TypeList: any
  StatusList: any
  APStatusList:any

  ecf_summary_data: any;
  has_pagenext = true;
  has_pageprevious = true;
  issummarypage: boolean = true;
  ecfpresentpage: number = 1;
  pagesizeecf = 10;

  crnum: any
  ecftype: any
  supplier: any
  status: any
  minamount: any
  maxamount: any

  ecfapprovalSearchForm: FormGroup
  tomorrow = new Date()
  TypeLists: any

  approvalList: any
  has_apppagenext = true;
  has_apppageprevious = true;
  isapprovalpage: boolean = true;
  approvalpresentpage: number = 1;
  approvalpagesize = 10;

  Supplierlist: Array<supplierListss>
  Branchlist: Array<branchListss>;
  Employeelist: Array<employeeListss>;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;

  ecfcoSearchForm:FormGroup
  ecf_cosummary_data: any;
  has_copagenext = true;
  has_copageprevious = true;
  iscosummarypage: boolean = true;
  ecfcopresentpage: number = 1;
  pagesizeecfco = 10;

  tranrecords:any
  showsearch = false
  showsummary = true
  ecf_cosearch_data:any
  commonECFSummaryForm: boolean;
  commonECFPath: any;
  commonECFSummary:any;
  

  @ViewChild('suppliertype') matsuppAutocomplete: MatAutocomplete;
  @ViewChild('suppInput') suppInput: any;
  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('emptype') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: NgxSpinnerService, private ecfservice: EcfService, private shareservice: ShareService
    , private toastr: ToastrService, private datePipe: DatePipe, private sanitizer: DomSanitizer,
    private notification: NotificationService, private sharedService: SharedService,
    private errorHandler:ErrorHandlingService) { }

  ngOnInit(): void {

    let datas = this.sharedService.menuUrlData;
    
   
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "ECF") {
        this.ECF_Sub_Menu_List = subModule;
        // console.log("ECF_Sub_Menu_List", this.ECF_Sub_Menu_List)
      }
    });

    this.ecfSearchForm = this.fb.group({
      crno: [''],
      ecftype: [''],
      ecfstatus: [''],
      minamt: [''],
      maxamt: [''],

    })

    this.ecfapprovalSearchForm = this.fb.group({
      crno: [''],
      ecftype: [''],
      minamt: [''],
      maxamt: ['']
    })

    this.ecfcoSearchForm = this.fb.group({
      crno:[''],
      ecftype:[''],
      invoiceno:[''],
      branch:[''],
      supplier_id:[''],
      // employee_id:[''],
      ecfstatus:[''],
      // apstatus:[''],
      fromdate:[''],
      todate:[''],
      minamount:[''],
      maxamount:['']

})
    // this.getecfSummaryList();
    // this.getapprovalsummary();
    // this.getecfcosummary();
    this.getecftype();
    this.getecfstatus();
    // this.getapstatus();



    
    //   let empkeyvalue: String = "";
    // this.employeedropdown(empkeyvalue);
    // this.ecfcoSearchForm.get('employee_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
         

    //     }),

    //     switchMap(value => this.ecfservice.getemployeescroll(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.Employeelist = datas;
        
    //   })

    


  }

  getsupplierdd(){

    let parentkeyvalue: String = "";
    this.getsupplierdropdown(parentkeyvalue);
    this.ecfcoSearchForm.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')

        }),

        switchMap(value => this.ecfservice.getsupplierscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Supplierlist = datas;

      })

  }

  getbranchdd(){
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.ecfcoSearchForm.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')

        }),

        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
       
      })



  }





  ECFSubModule(data) {

    this.sub_module_url = data.url;
    console.log("submoduleurl", this.sub_module_url)
    this.sub_module_url = data.url;
    this.ecfinventory = "/ecfinventory"
    this.ecfapproval = "/approvalsummary"
    this.ecfsummary = "/ecfsummary"
    this.ecfcosummary = "/cosummary"
    this.ecfreport = "/ecfreport"
    this.commonECFPath = "/commonsummary"

    this.ecfinventoryPath = this.ecfinventory === this.sub_module_url ? true : false;
    this.ecfapprovalPath = this.ecfapproval === this.sub_module_url ? true : false;
    this.ecfsummaryPath = this.ecfsummary === this.sub_module_url ? true : false;
    this.ecfcosummaryPath = this.ecfcosummary === this.sub_module_url ? true : false
    this.commonECFSummary=this.commonECFPath === this.sub_module_url ? true : false;

    if (this.ecfinventoryPath) {
    
      this.ecfinventoryForm = true
      this.ecfapprovalForm = false
      this.ecfsummaryForm = false
      this.ecfcosummaryForm = false
      this.ecfviewForm = false
      this.showapproverview = false
      this.showappdtlview = false
      this.ecfcoview = false
      this.getecfSummaryList();
     
      

    }
    else if (this.ecfapprovalPath) {
     
      this.ecfinventoryForm = false
      this.ecfapprovalForm = true
      this.ecfsummaryForm = false
      this.ecfcosummaryForm = false
      this.ecfviewForm = false
      this.showapproverview = false
      this.showappdtlview = false
      this.ecfcoview = false
      this.getapprovalsummary();
      
      

    }
    else if (this.ecfsummaryPath) {
    
      this.ecfinventoryForm = false
      this.ecfapprovalForm = false
      this.ecfsummaryForm = true
      this.ecfcosummaryForm = false
      this.ecfviewForm = false
      this.showapproverview = false
      this.showappdtlview = false
      this.ecfcoview = false
      this.getecfSummaryList();
      
     
    }

    else if( this.ecfcosummaryPath){
      
      this.ecfinventoryForm = false
      this.ecfapprovalForm = false
      this.ecfsummaryForm = false
      this.ecfcosummaryForm = true
      this.ecfviewForm = false
      this.showapproverview = false
      this.showappdtlview = false
      this.ecfcoview = false
      this.getecfcosummary();
      

    }
    
    else if (this.commonECFSummary)
    {
      this.router.navigateByUrl('/ap/commonsummary', {skipLocationChange: true});
      this.commonECFSummaryForm = true;
      this.ecfinventoryForm = false
      this.ecfapprovalForm = false
      this.ecfsummaryForm = false
      this.ecfcosummaryForm = false
      this.ecfviewForm = false
      this.showapproverview = false
      this.showappdtlview = false
      this.ecfcoview = false
      // this.getecfSummaryList();
      // this.getapprovalsummary();
      // this.getecfcosummary();
    }
  }





  getecftype() {
    this.ecfservice.getecftype()
      .subscribe(result => {
        let ecftypes = result["data"]
        this.TypeList = ecftypes.filter(type=>type.id != 1 ) 
      })
  }
  getecfstatus() {
    this.ecfservice.getecfstatus()
      .subscribe(result => {
        this.StatusList = result["data"]
      })
  }
  // getapstatus() {
  //   this.ecfservice.getapstatus()
  //     .subscribe(result => {
  //       this.APStatusList = result["data"]
  //     })
  // }
  gettotalcount:any
  getecfSummaryList(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
      this.SpinnerService.show()
    this.ecfservice.getecfSummaryDetails(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {

        let datas = results["data"];
        this.ecf_summary_data = datas;
        this.gettotalcount = results['count']
        // console.log("totalcount", this.gettotalcount)
        // console.log("ecfdatas", this.ecf_summary_data)
        let datapagination = results["pagination"];
        this.ecf_summary_data = datas;
        if (this.ecf_summary_data.length === 0) {
          this.issummarypage = false
        }
        if (this.ecf_summary_data.length > 0) {
          this.has_pagenext = datapagination.has_next;
          this.has_pageprevious = datapagination.has_previous;
          this.ecfpresentpage = datapagination.index;
          this.issummarypage = true
        }
        this.SpinnerService.hide()
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      
      )
  }

  nextClickPayment() {
    if (this.has_pagenext === true) {
      this.getecfSummaryList("", 'asc', this.ecfpresentpage + 1, 10)
    }
  }

  previousClickPayment() {
    if (this.has_pageprevious === true) {
      this.getecfSummaryList("", 'asc', this.ecfpresentpage - 1, 10)
    }
  }
  

  getecfcosummary(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
      this.SpinnerService.show()
    this.ecfservice.getecfcoSummaryDetails(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        this.showsearch = false
        this.showsummary = true

        let datas = results["data"];

        this.ecf_cosummary_data = datas;
        // console.log("search summary", this.ecf_cosummary_data)
        let datapagination = results["pagination"];
        this.ecf_cosummary_data = datas;
        if (this.ecf_cosummary_data.length === 0) {
          this.iscosummarypage = false
        }
        if (this.ecf_cosummary_data.length > 0) {
          this.has_copagenext = datapagination.has_next;
          this.has_copageprevious = datapagination.has_previous;
          this.ecfcopresentpage = datapagination.index;
          this.iscosummarypage = true
        }
        this.SpinnerService.hide()
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      
      
      )
  }

  nextClickecfco() {
    if (this.has_copagenext === true) {
      this.getecfcosummary("", 'asc', this.ecfcopresentpage + 1, 10)
    }
  }

  previousClickecfco() {
    if (this.has_copageprevious === true) {
      this.getecfcosummary("", 'asc', this.ecfcopresentpage - 1, 10)
    }
  }


  summarysearch() {

    this.SpinnerService.show()
    this.ecfservice.ecfsummarySearch(this.ecfSearchForm.value)
      .subscribe(result => {

        this.ecf_summary_data = result['data']
        let datapagination = result["pagination"];

        if (this.ecf_summary_data.length === 0) {
          this.issummarypage = false
        }
        if (this.ecf_summary_data.length > 0) {
          this.has_pagenext = datapagination.has_next;
          this.has_pageprevious = datapagination.has_previous;
          this.ecfpresentpage = datapagination.index;
          this.issummarypage = true
        }
        this.SpinnerService.hide()
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      
      )
  }

  cosummarysearch() {
    this.SpinnerService.show()
   const searchdata = this.ecfcoSearchForm.value
   if(searchdata.fromdate == null || searchdata.fromdate == undefined || searchdata.fromdate == ""){
    searchdata.fromdate = ""
   }else{
   searchdata.fromdate = this.datePipe.transform(searchdata.fromdate, 'yyyy-MM-dd');
   }
   if(searchdata.todate == null || searchdata.todate == undefined  || searchdata.todate == ""){
    searchdata.todate = ""
   }else{
   searchdata.todate = this.datePipe.transform(searchdata.todate, 'yyyy-MM-dd');
   }
   if(searchdata.branch != ""){
     searchdata.branch = searchdata.branch.id
   }
   if(searchdata.supplier_id != ""){
    searchdata.supplier_id = searchdata.supplier_id.id
  }

    this.ecfservice.ecfcosummarySearch(searchdata)
      .subscribe(result => {
        this.showsearch = true
        this.showsummary = false
        this.ecf_cosummary_data = result['data']
        // console.log("search result", this.ecf_cosummary_data)
        let datapagination = result["pagination"];
        if (this.ecf_cosummary_data.length === 0) {
          this.iscosummarypage = false
        }
        if (this.ecf_cosummary_data.length > 0) {
          this.has_copagenext = datapagination.has_next;
          this.has_copageprevious = datapagination.has_previous;
          this.ecfcopresentpage = datapagination.index;
          this.iscosummarypage = true
        }
        this.SpinnerService.hide()
      },

      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      
      )
  }
  Resetecfinventory() {
    this.ecfSearchForm.controls['crno'].reset(""),
      this.ecfSearchForm.controls['ecftype'].reset(""),
      this.ecfSearchForm.controls['ecfstatus'].reset(""),
      this.ecfSearchForm.controls['minamt'].reset(""),
      this.ecfSearchForm.controls['maxamt'].reset(""),
      this.getecfSummaryList();

  }

  resetco() {
      this.ecfcoSearchForm.controls['crno'].reset(""),
      this.ecfcoSearchForm.controls['ecftype'].reset(""),
      this.ecfcoSearchForm.controls['invoiceno'].reset(""),
      this.ecfcoSearchForm.controls['ecfstatus'].reset(""),
      this.ecfcoSearchForm.controls['supplier_id'].reset(""),
      // this.ecfcoSearchForm.controls['employee_id'].reset(""),
      this.ecfcoSearchForm.controls['branch'].reset(""),
      // this.ecfcoSearchForm.controls['apstatus'].reset(""),
      this.ecfcoSearchForm.controls['fromdate'].reset(""),
      this.ecfcoSearchForm.controls['todate'].reset(""),
      this.ecfcoSearchForm.controls['minamount'].reset(""),
      this.ecfcoSearchForm.controls['maxamount'].reset(""),
      this.getecfcosummary()

  }



  ecfheaderid: any
  showview(data) {
    this.ecfheaderid = data.id

    this.shareservice.ecfheader.next(this.ecfheaderid)
    this.ecfinventoryForm = false
    this.ecfapprovalForm = false
    this.ecfsummaryForm = false
    this.ecfviewForm = true
    this.ecfcosummaryForm = false
    this.ecfcoview = false

  }
  showedit(data) {

    this.shareservice.ecfheaderedit.next(data.id)
    this.ecfinventoryForm = true
    this.ecfapprovalForm = false
    this.ecfsummaryForm = false
    this.ecfviewForm = false
    this.ecfcosummaryForm = false
    this.ecfcoview = false

  }

  showadd() {
    let data = ''

    this.shareservice.ecfheaderedit.next(data)
    this.ecfinventoryForm = true
    this.ecfapprovalForm = false
    this.ecfsummaryForm = false
    this.ecfviewForm = false
    this.ecfcosummaryForm = false
    this.ecfcoview = false

    return data
  }
  delete(id) {
    this.SpinnerService.show()
    var answer = window.confirm("Are you sure to delete?");
    if (answer) {
      //some code
    }
    else {
      return false;
    }
    this.ecfservice.ecfhdrdelete(id)
      .subscribe(result => {
        if(result.status == "success"){
        this.notification.showSuccess("Deleted Successfully")
        this.getecfSummaryList()
        }else{
          this.notification.showError(result.description)
        }
        this.SpinnerService.hide()
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      
      )

  }

  coverNotedownload(id,ecftypeid) {
    this.SpinnerService.show()
    if(ecftypeid != 4){
    this.ecfservice.coverNotedownload(id)
      .subscribe((results) => {
        
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "ExpenseClaimForm.pdf";
        link.click();
        this.SpinnerService.hide()
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      
      )
    }else{

      this.ecfservice.coverNoteadvdownload(id)
      .subscribe((results) => {
        
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "ExpenseClaimForm.pdf";
        link.click();
        this.SpinnerService.hide()
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      
      )
    }


  }

downloadco(){

  this.ecfservice.ecfcodownload()
  .subscribe((results) => {
    
    let binaryData = [];
    binaryData.push(results)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    link.download = "ECF Report.xlsx";
    link.click();
  })

}


  getapprovalsummary(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
      this.SpinnerService.show()
    this.ecfservice.getapproversummary(filter, sortOrder, pageNumber, pageSize)
      .subscribe(result => {
        let datas = result["data"]
        this.approvalList = datas;
        
        let datapagination = result["pagination"];
        this.approvalList = datas;
        if (this.approvalList.length === 0) {
          this.isapprovalpage = false
        }
        if (this.approvalList.length > 0) {
          this.has_apppagenext = datapagination.has_next;
          this.has_apppageprevious = datapagination.has_previous;
          this.approvalpresentpage = datapagination.index;
          this.isapprovalpage = true
        }
        this.SpinnerService.hide()
      },

      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      
      )
  }

  nextapproverclick() {
    if (this.has_apppagenext === true) {
      this.getapprovalsummary("", 'asc', this.approvalpresentpage + 1, 10)
    }
  }

  previousapproverClick() {
    if (this.has_apppageprevious === true) {
      this.getapprovalsummary("", 'asc', this.approvalpresentpage - 1, 10)
    }
  }

  approversearch() {
    this.SpinnerService.show()
    this.ecfservice.approvalsummarySearch(this.ecfapprovalSearchForm.value)
      .subscribe(result => {
        this.approvalList = result["data"]
        let datapagination = result["pagination"];
        
        if (this.approvalList.length === 0) {
          this.isapprovalpage = false
        }
        if (this.approvalList.length > 0) {
          this.has_apppagenext = datapagination.has_next;
          this.has_apppageprevious = datapagination.has_previous;
          this.approvalpresentpage = datapagination.index;
          this.isapprovalpage = true
        }
       this.SpinnerService.hide()
      },

      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      
      )
  }


  reset() {
    this.ecfapprovalSearchForm.controls['crno'].reset(""),
      this.ecfapprovalSearchForm.controls['ecftype'].reset(""),
      this.ecfapprovalSearchForm.controls['minamt'].reset(""),
      this.ecfapprovalSearchForm.controls['maxamt'].reset(""),
      this.getapprovalsummary()

  }

  ecfheaderidd: any
  showapproveview(data) {
    this.ecfheaderidd = data.id
   
    this.shareservice.ecfapproveheader.next(this.ecfheaderidd)
    this.ecfinventoryForm = false
    this.ecfapprovalForm = false
    this.ecfsummaryForm = false
    this.ecfviewForm = false
    this.showapproverview = true
    this.showappdtlview = false
    this.ecfcosummaryForm = false
    this.ecfcoview = false

  }

  ecfcreateSubmit() {
    this.ecfinventoryForm = false
    this.ecfapprovalForm = false
    this.ecfsummaryForm = true
    this.ecfviewForm = false
    this.showapproverview = false
    this.ecfcosummaryForm = false
    this.ecfcoview = false
    this.showappdtlview = false
    this.getecfSummaryList()
  }

  ecfcreateCancel() {
    this.ecfinventoryForm = false
    this.ecfapprovalForm = false
    this.ecfsummaryForm = true
    this.ecfviewForm = false
    this.showapproverview = false
    this.showappdtlview = false
    this.ecfcosummaryForm = false
    this.ecfcoview = false
    this.getecfSummaryList()
  }

  ecfviewSubmit() {
    this.ecfinventoryForm = false
    this.ecfapprovalForm = false
    this.ecfsummaryForm = true
    this.ecfviewForm = false
    this.showapproverview = false
    this.showappdtlview = false
    this.ecfcosummaryForm = false
    this.ecfcoview = false
    this.getecfSummaryList()

  }

  ecfcoviewSubmit() {
    this.ecfinventoryForm = false
    this.ecfapprovalForm = false
    this.ecfsummaryForm = false
    this.ecfviewForm = false
    this.showapproverview = false
    this.showappdtlview = false
    this.ecfcosummaryForm = true
    this.ecfcoview = false
    this.getecfcosummary()

  }
  ecfviewCancel() {
    this.ecfinventoryForm = false
    this.ecfapprovalForm = false
    this.ecfsummaryForm = true
    this.ecfviewForm = false
    this.showapproverview = false
    this.showappdtlview = false
    this.ecfcosummaryForm = false
    this.ecfcoview = false
  }

  ecfcoviewCancel() {
    this.ecfinventoryForm = false
    this.ecfapprovalForm = false
    this.ecfsummaryForm = false
    this.ecfviewForm = false
    this.showapproverview = false
    this.showappdtlview = false
    this.ecfcosummaryForm = true
    this.ecfcoview = false
  }

  ecfappviewSubmit() {

    this.ecfinventoryForm = false
    this.ecfapprovalForm = true
    this.ecfsummaryForm = false
    this.ecfviewForm = false
    this.showapproverview = false
    this.showappdtlview = false
    this.ecfcosummaryForm = false
    this.ecfcoview = false
    this.getapprovalsummary()

  }

  ecfappviewCancel() {
    this.ecfinventoryForm = false
    this.ecfapprovalForm = true
    this.ecfsummaryForm = false
    this.ecfviewForm = false
    this.showapproverview = false
    this.showappdtlview = false
    this.ecfcosummaryForm = false
    this.ecfcoview = false
  }

  ecfappdtlviewSubmit() {
    this.ecfinventoryForm = false
    this.ecfapprovalForm = false
    this.ecfsummaryForm = false
    this.ecfviewForm = false
    this.showapproverview = false
    this.showappdtlview = true
    this.ecfcosummaryForm = false
    this.ecfcoview = false
    this.getapprovalsummary()

  }

  ecfappdtlviewCancel() {
    this.ecfinventoryForm = false
    this.ecfapprovalForm = false
    this.ecfsummaryForm = false
    this.ecfviewForm = false
    this.showapproverview = false
    this.showappdtlview = true
    this.ecfcosummaryForm = false
    this.ecfcoview = false

  }
public displayFnsupplier(suppliertype?: supplierListss): string | undefined {

  return suppliertype ? suppliertype.name : undefined;
}

get suppliertype() {
  return this.ecfcoSearchForm.get('supplier_id');
}

private getsupplierdropdown(parentkeyvalue) {
  this.ecfservice.getsupplier(parentkeyvalue)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.Supplierlist = datas;
     

    })
}

supplierScroll() {
  setTimeout(() => {
    if (
      this.matsuppAutocomplete &&
      this.matsuppAutocomplete &&
      this.matsuppAutocomplete.panel
    ) {
      fromEvent(this.matsuppAutocomplete.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matsuppAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matsuppAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.matsuppAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.matsuppAutocomplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_next === true) {
              this.ecfservice.getsupplierscroll(this.suppInput.nativeElement.value, this.currentpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  if (this.Supplierlist.length >= 0) {
                    this.Supplierlist = this.Supplierlist.concat(datas);
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


// public displayFnemployee(emptype?: employeeListss): string | undefined {

//   return emptype ? emptype.full_name : undefined;
// }

// get emptype() {
//   return this.ecfcoSearchForm.get('employee_id');
// }

// private employeedropdown(empkeyvalue) {
//   this.ecfservice.getemployee(empkeyvalue)
//     .subscribe((results: any[]) => {
//       let datas = results["data"];
//       this.Employeelist = datas;
     

//     })
// }

employeeScroll() {
  setTimeout(() => {
    if (
      this.matempAutocomplete &&
      this.matempAutocomplete &&
      this.matempAutocomplete.panel
    ) {
      fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matempAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_next === true) {
              this.ecfservice.getemployeescroll(this.empInput.nativeElement.value, this.currentpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  if (this.Employeelist.length >= 0) {
                    this.Employeelist = this.Employeelist.concat(datas);
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

public displayFnbranch(branchtype?: branchListss): string | undefined {

  return branchtype ? branchtype.codename : undefined;
}

get branchtype() {
  return this.ecfcoSearchForm.get('branch');
}

private branchdropdown(branchkeyvalue) {
  this.ecfservice.getbranch(branchkeyvalue)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.Branchlist = datas;
     

    })
}

branchScroll() {
  setTimeout(() => {
    if (
      this.matbranchAutocomplete &&
      this.matbranchAutocomplete &&
      this.matbranchAutocomplete.panel
    ) {
      fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_next === true) {
              this.ecfservice.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  if (this.Branchlist.length >= 0) {
                    this.Branchlist = this.Branchlist.concat(datas);
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
ViewData:any
ecfcoView(data){
  this.ecfservice.getcoview(data.crno)
  .subscribe(result =>{
    this.ViewData = result
    this.shareservice.coview.next(this.ViewData)
    this.ecfinventoryForm = false
    this.ecfapprovalForm = false
    this.ecfsummaryForm = false
    this.ecfviewForm = false
    this.showapproverview = false
    this.showappdtlview = false
    this.ecfcosummaryForm = false
    this.ecfcoview = true

  })
}

cosearchview(data){
  this.ecfservice.getcoview(data.ecfheader_id.crno)
  .subscribe(result =>{
    this.ViewData = result
    this.shareservice.coview.next(this.ViewData)
    this.ecfinventoryForm = false
    this.ecfapprovalForm = false
    this.ecfsummaryForm = false
    this.ecfviewForm = false
    this.showapproverview = false
    this.showappdtlview = false
    this.ecfcosummaryForm = false
    this.ecfcoview = true

  })
}
paymentdata:any 

getpaystatus(crno){
  this.ecfservice.getpaymentstatus(crno)
  .subscribe(result =>{
    if(result){
      this.paymentdata= result['data']
  
    }
  },error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
}


}