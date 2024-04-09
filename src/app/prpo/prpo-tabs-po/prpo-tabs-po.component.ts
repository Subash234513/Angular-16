import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { NotificationService } from '../notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { ErrorHandlingServiceService } from '../error-handling-service.service'
import { F } from '@angular/cdk/keycodes';
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
}
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
export interface datesvalue {
  value: any;
}
export interface supplierlistss {
  id: string;
  name: string;
}
export interface comlistss {
  id: string;
  name: string;
}
export interface branchlistss {
  id: any;
  name: string;
  code: string;
}
@Component({
  selector: 'app-prpo-tabs-po',
  templateUrl: './prpo-tabs-po.component.html',
  styleUrls: ['./prpo-tabs-po.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class PrpoTabsPOComponent implements OnInit {

  prpoPOList: any

  urls: string;
  urlPOmaker;
  urlPOapprover;
  urlPOclosemaker;
  urlPOcloseapprover;
  urlPOcancelmaker;
  urlPOcancelapprover;
  urlPOreopen;
  urlPOamendment;

  ismakerCheckerButton: boolean;
  roleValues: string;
  addFormBtn: any;




  isPOmaker: boolean;
  isPOmakerTab: boolean = false;

  isPOapprover: boolean
  isPOapproverTab: boolean = false

  isPOclosemaker: boolean
  isPOclosemakerTab: boolean = false

  isPOcloseapprover: boolean
  isPOcloseapproverTab: boolean = false

  isPOcancelmaker: boolean
  isPOcancelmakerTab: boolean = false

  isPOcancelapprover: boolean
  isPOcancelapproverTab: boolean = false

  isPOreopen: boolean
  isPOreopenTab: boolean = false
  isPOamendment: boolean
  isPOAmendmentTab: boolean = false

  isPOcreateScreenTab: boolean;
  isPOApproverScreenTab: boolean;
  isPOCloseScreenTab: boolean;
  isPOCloseAppScreenTab: boolean;
  isPOCancelScreenTab: boolean;
  isPOCancelAppScreenTab: boolean;
  isPOReopenScreenTab: boolean;
  isPOAmendmentScreenTab: boolean;

  pageSize = 10;
isLoading = false
@ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
supplierList: Array<supplierlistss>;
commodityList: Array<comlistss>;
@ViewChild('supplier') matsupplierAutocomplete: MatAutocomplete;
@ViewChild('supplierInput') supplierInput: any;
@ViewChild('com') matcomAutocomplete: MatAutocomplete;
  @ViewChild('comInput') comInput: any;
  branchList: Array<branchlistss>;
  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private dataService: PRPOSERVICEService,
    private prposhareService: PRPOshareService, private toastr: ToastrService, private notification: NotificationService, private route: ActivatedRoute,
    private datePipe: DatePipe, private http: HttpClient, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService) { }

  ngOnInit(): void {

    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "PO") {
        this.prpoPOList = subModule;
        this.isPOmaker = subModule[0].name;
        console.log("prpoPOmenuList", this.prpoPOList)
      }
    })


    ////////////////////////////////////////////////////PO MAKER
    this.POsummarySearchForm = this.fb.group({
      no: [''],
      // supplier_id:[''],
      name: [''],
      amount: [''],
      branch_id:[''],
      note_title:['']
    })
   

    ///////////////////////////////////////////////// PO Approval 

    this.POAppsummarySearchForm = this.fb.group({
      no: [''],
      suppliername: [''],
      commodityname: [''],
      branch_id:[''],
      note_title:['']
    })

    /////////////////////////////////////////////////////////// PO close maker

    this.pocloseSearchForm = this.fb.group({
      no: [''],
      name: [''],
      amount: [''],
      branch_id:['']
    })
    

    ///////////////////////////////////////////////////////////////// PO Close Approver 

    this.pocloseAppSearchForm = this.fb.group({
      no: [''],
      name: [''],
      amount: [null],
      branch_id:['']
    })
    

    /////////////////////////////////////////////////////// PO cancel maker 

    this.pocancelSearchForm = this.fb.group({
      no: [''],
      name: [''],
      amount: [null],
      branch_id:['']
    })
   


    /////////////////////////////////////////////////////// PO cancel Approval

    this.poCancelAppSearchForm = this.fb.group({
      no: [''],
      name: [''],
      amount: [null],
      branch_id:['']
    })
    



    //////////////////////////////////////////////////////PO Reopen
    this.poReopenSearchForm = this.fb.group({
      no: [''],
      name: [''],
      amount: [null],
      branch_id:['']
    })
    

    //////////////////////////////////////////////////////////PO Amendment
    this.poamendmentSearch = this.fb.group({
      no: [''],
      date: [''],
      branch_id:['']


    })
    

    this.POsummarySearchForm.get('name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getsupplierDropdownFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


      this.POAppsummarySearchForm.get('suppliername').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getsupplierDropdownFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

      this.pocloseSearchForm.get('name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getsupplierDropdownFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

      this.pocloseAppSearchForm.get('name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getsupplierDropdownFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

      this.pocancelSearchForm.get('name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getsupplierDropdownFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


      this.poCancelAppSearchForm.get('name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getsupplierDropdownFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

      this.poReopenSearchForm.get('name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getsupplierDropdownFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


      this.POAppsummarySearchForm.get('commodityname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getcommodityFKdd( value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.commodityList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

      this.POsummarySearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.dataService.getbranchFK(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

      this.POAppsummarySearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.dataService.getbranchFK(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


      this.pocloseSearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.dataService.getbranchFK(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

      this.pocloseAppSearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.dataService.getbranchFK(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

      this.pocancelSearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.dataService.getbranchFK(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

      this.poCancelAppSearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.dataService.getbranchFK(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


      this.poReopenSearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.dataService.getbranchFK(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

      this.poamendmentSearch.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.dataService.getbranchFK(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }


  subModuleData(data) {
    this.urls = data.url;
    this.urlPOmaker = "/pomaker";
    this.urlPOapprover = "/poapprover";
    this.urlPOclosemaker = "/poclosemaker";
    this.urlPOcloseapprover = "/pocloseapprover";
    this.urlPOcancelmaker = "/pocancelmaker";
    this.urlPOcancelapprover = "/pocancelapprover";
    this.urlPOreopen = "/poreopen";
    this.urlPOamendment = "/poamendment"


    this.isPOmaker = this.urlPOmaker === this.urls ? true : false;
    this.isPOapprover = this.urlPOapprover === this.urls ? true : false;
    this.isPOclosemaker = this.urlPOclosemaker === this.urls ? true : false;
    this.isPOcloseapprover = this.urlPOcloseapprover === this.urls ? true : false;
    this.isPOcancelmaker = this.urlPOcancelmaker === this.urls ? true : false;
    this.isPOcancelapprover = this.urlPOcancelapprover === this.urls ? true : false;
    this.isPOreopen = this.urlPOreopen === this.urls ? true : false;
    this.isPOamendment = this.urlPOamendment === this.urls ? true : false;
    this.roleValues = data.role[0].name;
    this.addFormBtn = data.name;
    
    if (this.isPOmaker) {
      this.isPOmakerTab = true
      this.isPOapproverTab = false
      this.isPOclosemakerTab = false
      this.isPOcloseapproverTab = false
      this.isPOcancelmakerTab = false
      this.isPOcancelapproverTab = false
      this.isPOreopenTab = false
      this.isPOAmendmentTab = false

      this.isPOcreateScreenTab = false
      this.isPOApproverScreenTab = false
      this.isPOCloseScreenTab = false
      this.isPOCloseAppScreenTab = false
      this.isPOCancelScreenTab = false
      this.isPOCancelAppScreenTab = false
      this.isPOReopenScreenTab = false
      this.isPOAmendmentScreenTab = false
      this.getpo();
    }
    else if (this.isPOapprover) {
      this.isPOmakerTab = false
      this.isPOapproverTab = true
      this.isPOclosemakerTab = false
      this.isPOcloseapproverTab = false
      this.isPOcancelmakerTab = false
      this.isPOcancelapproverTab = false
      this.isPOreopenTab = false
      this.isPOAmendmentTab = false

      this.isPOcreateScreenTab = false
      this.isPOApproverScreenTab = false
      this.isPOCloseScreenTab = false
      this.isPOCloseAppScreenTab = false
      this.isPOCancelScreenTab = false
      this.isPOCancelAppScreenTab = false
      this.isPOReopenScreenTab = false
      this.isPOAmendmentScreenTab = false
      this.getpoApproval();
    }

    else if (this.isPOclosemaker) {
      this.isPOmakerTab = false
      this.isPOapproverTab = false
      this.isPOclosemakerTab = true
      this.isPOcloseapproverTab = false
      this.isPOcancelmakerTab = false
      this.isPOcancelapproverTab = false
      this.isPOreopenTab = false
      this.isPOAmendmentTab = false

      this.isPOcreateScreenTab = false
      this.isPOApproverScreenTab = false
      this.isPOCloseScreenTab = false
      this.isPOCloseAppScreenTab = false
      this.isPOCancelScreenTab = false
      this.isPOCancelAppScreenTab = false
      this.isPOReopenScreenTab = false
      this.isPOAmendmentScreenTab = false
      this.getpoClose();
    }

    else if (this.isPOcloseapprover) {
      this.isPOmakerTab = false
      this.isPOapproverTab = false
      this.isPOclosemakerTab = false
      this.isPOcloseapproverTab = true
      this.isPOcancelmakerTab = false
      this.isPOcancelapproverTab = false
      this.isPOreopenTab = false
      this.isPOAmendmentTab = false

      this.isPOcreateScreenTab = false
      this.isPOApproverScreenTab = false
      this.isPOCloseScreenTab = false
      this.isPOCloseAppScreenTab = false
      this.isPOCancelScreenTab = false
      this.isPOCancelAppScreenTab = false
      this.isPOReopenScreenTab = false
      this.isPOAmendmentScreenTab = false
      this.getpocloseApp();
    }

    else if (this.isPOcancelmaker) {
      this.isPOmakerTab = false
      this.isPOapproverTab = false
      this.isPOclosemakerTab = false
      this.isPOcloseapproverTab = false
      this.isPOcancelmakerTab = true
      this.isPOcancelapproverTab = false
      this.isPOreopenTab = false
      this.isPOAmendmentTab = false

      this.isPOcreateScreenTab = false
      this.isPOApproverScreenTab = false
      this.isPOCloseScreenTab = false
      this.isPOCloseAppScreenTab = false
      this.isPOCancelScreenTab = false
      this.isPOCancelAppScreenTab = false
      this.isPOReopenScreenTab = false
      this.isPOAmendmentScreenTab = false
      this.getpoCancel();
    }


    else if (this.isPOcancelapprover) {
      this.isPOmakerTab = false
      this.isPOapproverTab = false
      this.isPOclosemakerTab = false
      this.isPOcloseapproverTab = false
      this.isPOcancelmakerTab = false
      this.isPOcancelapproverTab = true
      this.isPOreopenTab = false
      this.isPOAmendmentTab = false

      this.isPOcreateScreenTab = false
      this.isPOApproverScreenTab = false
      this.isPOCloseScreenTab = false
      this.isPOCloseAppScreenTab = false
      this.isPOCancelScreenTab = false
      this.isPOCancelAppScreenTab = false
      this.isPOReopenScreenTab = false
      this.isPOAmendmentScreenTab = false
      this.getpoCancelApp();
    }

    else if (this.isPOreopen) {
      this.isPOmakerTab = false
      this.isPOapproverTab = false
      this.isPOclosemakerTab = false
      this.isPOcloseapproverTab = false
      this.isPOcancelmakerTab = false
      this.isPOcancelapproverTab = false
      this.isPOreopenTab = true
      this.isPOAmendmentTab = false

      this.isPOcreateScreenTab = false
      this.isPOApproverScreenTab = false
      this.isPOCloseScreenTab = false
      this.isPOCloseAppScreenTab = false
      this.isPOCancelScreenTab = false
      this.isPOCancelAppScreenTab = false
      this.isPOReopenScreenTab = false
      this.isPOAmendmentScreenTab = false
      this.getpoReopen();
    }
    else if (this.isPOamendment) {
      this.isPOmakerTab = false
      this.isPOapproverTab = false
      this.isPOclosemakerTab = false
      this.isPOcloseapproverTab = false
      this.isPOcancelmakerTab = false
      this.isPOcancelapproverTab = false
      this.isPOreopenTab = false
      this.isPOAmendmentTab = true

      this.isPOcreateScreenTab = false
      this.isPOApproverScreenTab = false
      this.isPOCloseScreenTab = false
      this.isPOCloseAppScreenTab = false
      this.isPOCancelScreenTab = false
      this.isPOCancelAppScreenTab = false
      this.isPOReopenScreenTab = false
      this.isPOAmendmentScreenTab = false
      this.getamendmentsummary();
    }



  }


  //////////////////////////////////////////////////////////////////////////////////////// PO Maker
  POsummarySearchForm: FormGroup;
  PoList: any;
  PoProductList: any;
  PoTranHistoryList: any;
  has_next = true;
  has_previous = true;
  // currentpage: number = 1;
  presentpage: number = 1;
  // pageSize = 10;
  // isLoading = false
  tokenValues: any
  jpgUrls: string;
  imageUrl = environment.apiURL
  pdfSrc: any;
  isPoMakerExport:boolean

  getpo(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show();
    this.dataService.getpo(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        console.log(["getpo", datas]);
        let datapagination = results["pagination"];
        this.PoList = datas;
        if (this.PoList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.isPoMakerExport=false
        }
        if(this.PoList.length == 0){
          this.isPoMakerExport=true
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  nextClick() {
    if (this.has_next === true) {
      this.getpo(this.presentpage + 1, 10)
    }
  }

  previousClick() {
    if (this.has_previous === true) {
      this.getpo(this.presentpage - 1, 10)
    }
  }

  resetpo() {
    this.POsummarySearchForm.reset("")
    this.getpo();

  }
  POsummarySearch() {
    let searchdel = this.POsummarySearchForm.value;
    console.log('data for search', searchdel);
    // if ( typeof(searchdel?.name) == 'string' ){
    //   this.notification.showWarning('Please select Supplier from dropdown')
    //   return false 
    // }
    // if(typeof(searchdel?.branch_id) == 'string'){
    //   this.notification.showWarning("Please select Branch from dropdown")
    //   return false 
    // }
    let obj = {
      no: searchdel?.no,
      name: searchdel?.name?.id,
      amount: searchdel?.amount,
      branch_id:searchdel?.branch_id?.id,
      note_title: searchdel?.note_title
    }
    for (let i in obj) {
      if (obj[i] === null || obj[i] === "" || obj[i] === undefined) {
        delete obj[i];
      }
    }
    this.SpinnerService.show();
    this.dataService.getposummarySearch(obj)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("poList search result", result)
        this.PoList = result['data']
        // if (searchdel.no === '' && searchdel.name === '' && searchdel.amount === '') {
        //   this.getpo();
        // }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  makerexceldownload(){

    let pono:any
    let poname:any
    let poamt:any
    let branchid:any
    let notetitle:any

    let data = this.POsummarySearchForm.value
    if(data.no != null && data.no != undefined &&  data.no != ""){
      pono = data.no
    }else{
      pono = ""
    }

    if(data.name != null && data.name != undefined && data.name != ""){
      poname = data.name
    }else{
      poname = ""
    }

   if(data.amount != null && data.amount != undefined && data.amount != ""){
    poamt = data.amount
    }else{
      poamt = ""
    }

    if(data.note_title != null && data.note_title != undefined && data.note_title != ""){
      notetitle = data.note_title
      }else{
        notetitle = ""
      }

    if(typeof(data.branch_id) == 'object'){
      branchid = data.branch_id.id
    }else if(typeof(data.branch_id) == 'number'){
      branchid = data.branch_id
    }else{
      branchid = ""
    }

   
    this.SpinnerService.show();
    this.dataService.getPOMakerExcel(pono,poname,poamt,branchid,notetitle)
    .subscribe((data) => {
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'PO Maker Report'+".xlsx";
      link.click();
      })

  }

   checkerexceldownload(){

    let pono:any
    let poname:any
    let poamt:any
    let branchid:any
    let notetitle:any

    let data = this.POAppsummarySearchForm.value
    if(data.no != null && data.no != undefined &&  data.no != ""){
      pono = data.no
    }else{
      pono = ""
    }

    if(data.name != null && data.name != undefined && data.name != ""){
      poname = data.name
    }else{
      poname = ""
    }

   if(data.amount != null && data.amount != undefined && data.amount != ""){
    poamt = data.amount
    }else{
      poamt = ""
    }

    if(data.note_title != null && data.note_title != undefined && data.note_title != ""){
      notetitle = data.note_title
      }else{
        notetitle = ""
      }

    if(typeof(data.branch_id) == 'object'){
      branchid = data.branch_id.id
    }else if(typeof(data.branch_id) == 'number'){
      branchid = data.branch_id
    }else{
      branchid = ""
    }

   
    this.SpinnerService.show();
    this.dataService.getPOApproverExcel(pono,poname,poamt,branchid,notetitle)
    .subscribe((data) => {
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'PO Checker Report'+".xlsx";
      link.click();
      })


   }

   closemakerexceldownload(){

    let no:any
    let name:any
    let amount:any
    let branchid:any
   

    let data = this.pocloseSearchForm.value
    if(data.no != null && data.no != undefined &&  data.no != ""){
      no = data.no
    }else{
      no = ""
    }

    if(data.name != null && data.name != undefined && data.name != ""){
      name = data.name
    }else{
      name = ""
    }

   if(data.amount != null && data.amount != undefined && data.amount != ""){
    amount = data.amount
    }else{
    amount = ""
    }

   if(typeof(data.branch_id) == 'object'){
      branchid = data.branch_id.id
    }else if(typeof(data.branch_id) == 'number'){
      branchid = data.branch_id
    }else{
      branchid = ""
    }

   
    this.SpinnerService.show();
    this.dataService.getPOCloseMakerExcel(no,name,amount,branchid)
    .subscribe((data) => {
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'PO Close Maker Report'+".xlsx";
      link.click();
      })

  }

  closeappmakerexceldownload(){

    let no:any
    let name:any
    let amount:any
    let branchid:any
   

    let data = this.pocloseAppSearchForm.value
    if(data.no != null && data.no != undefined &&  data.no != ""){
      no = data.no
    }else{
      no = ""
    }

    if(data.name != null && data.name != undefined && data.name != ""){
      name = data.name
    }else{
      name = ""
    }

   if(data.amount != null && data.amount != undefined && data.amount != ""){
    amount = data.amount
    }else{
    amount = ""
    }

   if(typeof(data.branch_id) == 'object'){
      branchid = data.branch_id.id
    }else if(typeof(data.branch_id) == 'number'){
      branchid = data.branch_id
    }else{
      branchid = ""
    }

   
    this.SpinnerService.show();
    this.dataService.getPOCloseApproverExcel(no,name,amount,branchid)
    .subscribe((data) => {
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'PO Close Approver Report'+".xlsx";
      link.click();
      })

  }

  cancelmakerexceldownload(){

    let no:any
    let name:any
    let amount:any
    let branchid:any
   

    let data = this.pocancelSearchForm.value
    if(data.no != null && data.no != undefined &&  data.no != ""){
      no = data.no
    }else{
      no = ""
    }

    if(data.name != null && data.name != undefined && data.name != ""){
      name = data.name
    }else{
      name = ""
    }

   if(data.amount != null && data.amount != undefined && data.amount != ""){
    amount = data.amount
    }else{
    amount = ""
    }

   if(typeof(data.branch_id) == 'object'){
      branchid = data.branch_id.id
    }else if(typeof(data.branch_id) == 'number'){
      branchid = data.branch_id
    }else{
      branchid = ""
    }

   
    this.SpinnerService.show();
    this.dataService.getPOCancelMakerExcel(no,name,amount,branchid)
    .subscribe((data) => {
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'PO Cancel Maker Report'+".xlsx";
      link.click();
      })

  }

  cancelappexceldownload(){

    let no:any
    let name:any
    let amount:any
    let branchid:any
   

    let data = this.poCancelAppSearchForm.value
    if(data.no != null && data.no != undefined &&  data.no != ""){
      no = data.no
    }else{
      no = ""
    }

    if(data.name != null && data.name != undefined && data.name != ""){
      name = data.name
    }else{
      name = ""
    }

   if(data.amount != null && data.amount != undefined && data.amount != ""){
    amount = data.amount
    }else{
    amount = ""
    }

   if(typeof(data.branch_id) == 'object'){
      branchid = data.branch_id.id
    }else if(typeof(data.branch_id) == 'number'){
      branchid = data.branch_id
    }else{
      branchid = ""
    }

   
    this.SpinnerService.show();
    this.dataService.getPOCancelApproverExcel(no,name,amount,branchid)
    .subscribe((data) => {
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'PO Cancel Approver Report'+".xlsx";
      link.click();
      })

  }


  Reopenexceldownload(){

    let no:any
    let name:any
    let amount:any
    let branchid:any
   

    let data = this.poReopenSearchForm.value
    if(data.no != null && data.no != undefined &&  data.no != ""){
      no = data.no
    }else{
      no = ""
    }

    if(data.name != null && data.name != undefined && data.name != ""){
      name = data.name
    }else{
      name = ""
    }

   if(data.amount != null && data.amount != undefined && data.amount != ""){
    amount = data.amount
    }else{
    amount = ""
    }

   if(typeof(data.branch_id) == 'object'){
      branchid = data.branch_id.id
    }else if(typeof(data.branch_id) == 'number'){
      branchid = data.branch_id
    }else{
      branchid = ""
    }

   
    this.SpinnerService.show();
    this.dataService.getPOReopenExcel(no,name,amount,branchid)
    .subscribe((data) => {
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'PO Reopen Report'+".xlsx";
      link.click();
      })

  }

  Amendmentexceldownload(){

    let no:any
    let name:any
    let amount:any
    let branchid:any
   

    let data = this.poamendmentSearch.value
    if(data.no != null && data.no != undefined &&  data.no != ""){
      no = data.no
    }else{
      no = ""
    }

    if(data.name != null && data.name != undefined && data.name != ""){
      name = data.name
    }else{
      name = ""
    }

   if(data.amount != null && data.amount != undefined && data.amount != ""){
    amount = data.amount
    }else{
    amount = ""
    }

   if(typeof(data.branch_id) == 'object'){
      branchid = data.branch_id.id
    }else if(typeof(data.branch_id) == 'number'){
      branchid = data.branch_id
    }else{
      branchid = ""
    }

   
    this.SpinnerService.show();
    this.dataService.getPOAmendmentExcel(no,name,amount,branchid)
    .subscribe((data) => {
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'PO Amendment Report'+".xlsx";
      link.click();
      })


  }






  PoNumber: any; PoCommodity: any; PoType: any; PoBranch: any; PoSupplier: any
  has_previousdetail: boolean
  has_nextdetail: boolean
  presentpagepodetail: number = 1;
  PoheaderID_Data: any

  dataOnHeader(data){
    this.PoheaderID_Data = data.id
    this.PoNumber = data.no
    this.PoCommodity = data.commodity_id.name
    this.PoType = data.type
    this.PoBranch = data.branch_id.name
    this.PoSupplier = data.supplierbranch_id.name
    this.PoheaderID_Data = data.id 
  }

  getProductData(data, pageNumber = 1, pageSize = 10) {
    console.log("PO pop view data ", data)
    let idvalue = data.id
    console.log('idvalue value data getdetailsForQuantity', idvalue)
    this.SpinnerService.show();
    this.dataService.getPoProductList(idvalue, pageNumber, pageSize)
      .subscribe((result: any) => {
        let datas = result["data"];
        this.SpinnerService.hide();
        console.log(["getproduct", datas]);
        let datapagination = result["pagination"];
        this.PoProductList = datas;
        if (this.PoProductList.length > 0) {
          this.has_nextdetail = datapagination.has_next;
          this.has_previousdetail = datapagination.has_previous;
          this.presentpagepodetail = datapagination.index;
        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  nextClickdetail() {
    if (this.has_nextdetail === true) {
      this.SpinnerService.show();
      this.dataService.getPoProductList(this.PoheaderID_Data, this.presentpagepodetail + 1, 10)
      .subscribe((result: any) => {
        let datas = result["data"];
        this.SpinnerService.hide();
        console.log(["getproduct", datas]);
        let datapagination = result["pagination"];
        this.PoProductList = datas;
        if (this.PoProductList.length > 0) {
          this.has_nextdetail = datapagination.has_next;
          this.has_previousdetail = datapagination.has_previous;
          this.presentpagepodetail = datapagination.index;
        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    }
  }

  previousClickdetail() {
    if (this.has_previousdetail === true) {
      this.SpinnerService.show();
      this.dataService.getPoProductList(this.PoheaderID_Data, this.presentpagepodetail - 1, 10)
      .subscribe((result: any) => {
        let datas = result["data"];
        console.log(["getproduct", datas]);
        let datapagination = result["pagination"];
        this.PoProductList = datas;
        this.SpinnerService.hide();
        if (this.PoProductList.length > 0) {
          this.has_nextdetail = datapagination.has_next;
          this.has_previousdetail = datapagination.has_previous;
          this.presentpagepodetail = datapagination.index;
        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    }
  }


  gettranhistory(data) {

    let headerId = data.id
    console.log("headerId", headerId)
    this.SpinnerService.show();
    this.dataService.gettranhistory(headerId)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("getranhistory", datas);
        this.PoTranHistoryList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  fileDownloads(id, fileName) {
    this.SpinnerService.show();
    this.dataService.fileDownloadpo(id)
      .subscribe((results) => {
        console.log("re", results)
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results)
        let filevalue = fileName.split('.')
        if(filevalue[1] != "pdf" && filevalue[1] != "PDF"){
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
        }else{
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData, { type: results.type }));
          window.open(downloadUrl, "_blank");
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  fileListHeader: any
  HeaderFilesPOdownload(data) {
    console.log("For Header Files", data)

    let filesdataValue = data.file_data
    if (filesdataValue.length <= 0) {
      this.notification.showInfo("No Files Found")
    }
    else {
      this.fileListHeader = filesdataValue
      this.showHeaderimagepopup = true
    }
  }

  downloadUrlimage: any
  fileDownload(id, fileName) {
    this.SpinnerService.show();
    this.dataService.fileDownloadsPoHeader(id)
      .subscribe((results) => {
        console.log("re", results)
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results)
        let filevalue = fileName.split('.')
        if(filevalue[1] != "pdf" && filevalue[1] != "PDF"){
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
        }else{
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData, { type: results.type }));
          window.open(downloadUrl, "_blank");
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  showHeaderimagepopup: boolean
  showimageHeader: boolean
  commentPopupHeaderFiles(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showimageHeader = true
      this.jpgUrls = this.imageUrl + "prserv/prpo_fileview/" + id + "?token=" + token;
      console.log("urlHeader", this.jpgUrls)
    }
    else {
      this.showimageHeader = false
    }
  }

  showimagepopup: boolean
  commentPopup(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }

    let stringValue = file_name.split('.')

    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showimagepopup = true
      this.jpgUrls = this.imageUrl + "prserv/prpo_fileview/" + id + "?token=" + token;
      console.log("url", this.jpgUrls)
    }
    else {
      this.showimagepopup = false
    }

  };

  pdfPopup(pdf_id) {
    let id = pdf_id.id
    this.SpinnerService.show()
    this.dataService.getpdfPO(id)
      .subscribe((datas) => {
        this.SpinnerService.hide()
        let binaryData = [];
        binaryData.push(datas);
        let downloadLink = window.URL.createObjectURL(new Blob(binaryData, { type: datas.type }));
        window.open(downloadLink, "_blank");
      //   let binaryData = [];
      //   binaryData.push(data)
      //   let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      //   let link = document.createElement('a');
      //   link.href = downloadUrl;
      //   this.pdfSrc = downloadUrl
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  POPDf(data) {
    // let id = this.getMemoIdValue(this.idValue)
    let id = data.id
    let name = data.no
    this.SpinnerService.show();
    this.dataService.getpdfPO(id)
      .subscribe((data) => {
      this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = name + ".pdf";
        link.click();
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
     
       })

  }
  addPOdummy() {
    // this.router.navigate(['/podummy'], { skipLocationChange: true })
    this.isPOcreateScreenTab = true
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false

    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
  }
  PoCreateSubmit() {
    this.getpo()
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = true
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false

  }
  PoCreateCancel() {
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = true
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
  }
  barcode: any
  barcodePopup(pdf_id) {
    this.SpinnerService.show();
    let id = pdf_id.id
    this.dataService.getbarcodePO(id)
      .subscribe((data) => {
        let downloadUrl = data.imagepath;
        this.SpinnerService.hide();
        this.barcode = window.open(downloadUrl, '_blank');
        console.log('barcode', downloadUrl)

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  barcodePopupIndividual(pdf_id) {
    this.SpinnerService.show();
    let detailid = pdf_id.id
    let headerId = pdf_id.poheader_data[0].id
    this.dataService.getbarcodePOIndividual(headerId, detailid)
      .subscribe((data) => {
        let downloadUrl = data.imagepath;
        this.SpinnerService.hide();
        this.barcode = window.open(downloadUrl, '_blank');
        console.log('barcode', downloadUrl)

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////// PO APPROVAL 


  POAppsummarySearchForm: FormGroup;
  PoAppList: any;
  PoApproverExport:boolean

  has_nextApp = true;
  has_previousApp = true;
  currentpage: number = 1;
  presentpageApp: number = 1;
  pageSizeApp = 10;
  // isLoading = false




  getpoApproval(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show();
    this.dataService.getApprovalpo(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        console.log(["getpo Approval", datas]);
        let datapagination = results["pagination"];
        this.PoAppList = datas;
        if (this.PoAppList.length > 0) {
          this.has_nextApp = datapagination.has_next;
          this.has_previousApp = datapagination.has_previous;
          this.presentpageApp = datapagination.index;
          this.PoApproverExport=false
        }
        if (this.PoAppList.length ==0){
          this.PoApproverExport=true
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  nextClickApp() {
    if (this.has_nextApp === true) {
      this.getpoApproval(this.presentpageApp + 1, 10)
    }
  }

  previousClickApp() {
    if (this.has_previousApp === true) {
      this.getpoApproval(this.presentpageApp - 1, 10)
    }
  }

  resetpoApp() {
    this.POAppsummarySearchForm.controls['no'].reset("")
    this.POAppsummarySearchForm.controls['suppliername'].reset("")
    this.POAppsummarySearchForm.controls['commodityname'].reset("")
    this.POAppsummarySearchForm.controls['branch_id'].reset("")
    this.POAppsummarySearchForm.controls['note_title'].reset("")
    // this.POAppsummarySearchForm.value.reset("")
    this.getpoApproval();

  }
  POAppsummarySearch() {
    let searchdel = this.POAppsummarySearchForm.value;
    console.log('data for search', searchdel);
    // if ( searchdel.suppliername.id == undefined ){
    //   searchdel.suppliername = searchdel.suppliername
    // }else{
    //   searchdel.suppliername = searchdel.suppliername.id
    // }
    let obj = {
      no: searchdel.no,
      suppliername: searchdel.suppliername.id,
      commodityname: searchdel.commodityname.id,
      branch_id: searchdel.branch_id.id,
      note_title: searchdel.note_title,
    }
    for (let i in obj) {
      if (obj[i] === null || obj[i] === "" || obj[i] === undefined) {
        delete obj[i];
      }
    }
    this.SpinnerService.show();
    this.dataService.getpoApprovalsummarySearch(obj)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("poAppList search result", result)
        this.PoAppList = result['data']
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  POapprovalscreen(data) {
    this.prposhareService.PoApproveShare.next(data);
    //this.router.navigate(['/poapprovelScreen'], { skipLocationChange: true })
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = true
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
    return data;
  }
  PoApproverSubmit() {
    this.getpoApproval()
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = true
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
  }
  PoApproverCancel() {
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = true
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
  }







  ////////////////////////////////////////////////////////////////////////////////////////   PO close
  pocloseSearchForm: FormGroup;
  presentpagepoClose: number = 1;
  has_nextpoClose = true;
  has_previouspoClose = true;
  pageSizeClose = 10;
  poCloseList: any;
  isPocloseMakerExport:boolean
  getpoClose(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show();
    this.dataService.getpoclosesummary(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        console.log("getpo Close", datas);
        let datapagination = results["pagination"];
        this.poCloseList = datas;
        if (this.poCloseList.length > 0) {
          this.has_nextpoClose = datapagination.has_next;
          this.has_previouspoClose = datapagination.has_previous;
          this.presentpagepoClose = datapagination.index;
          this.isPocloseMakerExport=false
        }
        if(this.poCloseList.length == 0){
          this.isPocloseMakerExport=true
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  nextClickpoClose() {
    if (this.has_nextpoClose === true) {
      this.getpoClose(this.presentpagepoClose + 1, 10)
    }
  }

  previousClickpoClose() {
    if (this.has_previouspoClose === true) {
      this.getpoClose(this.presentpagepoClose - 1, 10)
    }
  }

  resetpoClose() {
    // this.pocloseSearchForm.reset()
    this.pocloseSearchForm.controls["no"].reset("");
    this.pocloseSearchForm.controls["name"].reset("");
    this.pocloseSearchForm.controls["amount"].reset("");
    this.pocloseSearchForm.controls["branch_id"].reset("");
    this.getpoClose();

  }
  pocloseSearch() {
    let searchpo = this.pocloseSearchForm.value;
    // if ( searchpo.name.id == undefined ){
    //   searchpo.name = ""
    // }
    // if ( searchpo.name.id == undefined ){
    //   searchpo.name = searchpo.name
    // }else{
    //   searchpo.name = searchpo.name.id
    // }
    let obj = {
      no: searchpo.no,
      name: searchpo.name.id,
      amount:searchpo.amount,
      branch_id:searchpo.branch_id.id 
    }

    console.log('data for searchpo', obj);
    for (let i in obj) {
      if (obj[i] === null || obj[i] === "" || obj[i] === undefined) {
        delete obj[i];
      }
    }
    this.SpinnerService.show();
    this.dataService.getpoclosesummarySearch(obj)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("poListClose search result", result)
        this.poCloseList = result['data']
        
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  sharePomakeClose(data) {
    this.prposhareService.PocloseShare.next(data)
    // this.router.navigate(['/poclosecreate'], { skipLocationChange: true })
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = true
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
    return data;
  }




  PoCloseSubmit() {
    this.getpoClose()
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = true
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
  }

  PoCloseCancel() {
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = true
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
  }






  /////////////////////////////////////////////////////////////////////////////////////////// PO close Approval

  pocloseAppSearchForm: FormGroup;
  presentpagepocloseApp: number = 1;
  has_nextpocloseApp = true;
  has_previouspocloseApp = true;
  pageSizecloseApp = 10;
  pocloseAppList: any;
  poCloseApproval:boolean



  getpocloseApp(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show();
    this.dataService.getpocloseappsummary(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("getcloseApppo", datas);
        let datapagination = results["pagination"];
        this.pocloseAppList = datas;
        if (this.pocloseAppList.length > 0) {
          this.has_nextpocloseApp = datapagination.has_next;
          this.has_previouspocloseApp = datapagination.has_previous;
          this.presentpagepocloseApp = datapagination.index;
          this.poCloseApproval=false
        }
        if(this.pocloseAppList.length== 0){
          this.poCloseApproval=true
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  nextClickpocloseApp() {
    if (this.has_nextpocloseApp === true) {
      this.getpocloseApp(this.presentpagepocloseApp + 1, 10)
    }
  }

  previousClickpocloseApp() {
    if (this.has_previouspocloseApp === true) {
      this.getpocloseApp(this.presentpagepocloseApp - 1, 10)
    }
  }

  resetpocloseApp() {
    this.pocloseAppSearchForm.controls["no"].reset("");
    this.pocloseAppSearchForm.controls["name"].reset("");
    this.pocloseAppSearchForm.controls["amount"].reset("");
    this.pocloseAppSearchForm.controls["branch_id"].reset("");
    // this.pocloseAppSearchForm.value.reset()
    this.getpocloseApp();

  }
  pocloseAppSearch() {
    let searchpo = this.pocloseAppSearchForm.value;
    console.log('data for searchpo', searchpo);
    // if ( searchpo.name.id == undefined ){
    //   searchpo.name = searchpo.name
    // }else{
    //   searchpo.name = searchpo.name.id
    // }
    let obj = {
      no: searchpo.no,
      name: searchpo?.name?.id,
      amount: searchpo?.amount,
      branch_id:searchpo?.branch_id?.id 
    }

    
    for (let i in obj) {
      if (obj[i] === null || obj[i] === "" || obj[i] === undefined ) {
        delete obj[i];
      }
    }
    this.SpinnerService.show();
    this.dataService.getpocloseappsummarySearch(obj)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("poList search result", result)
        this.pocloseAppList = result['data']
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  sharePomakecloseApp(data) {
    this.prposhareService.PocloseapprovalShare.next(data)
    //this.router.navigate(['/pocloseapproval'], { skipLocationChange: true })
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = true
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
    return data;
  }


  PoCloseAppSubmit() {
    this.getpocloseApp()
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = true
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
  }

  PoCloseAppCancel() {
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = true
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
  }

  ////////////////////////////////////////////////////////////////////////////////////////// PO Cancel

  pocancelSearchForm: FormGroup;
  presentpagepoCancel: number = 1;
  currentepagepoCancel: number = 1;
  has_nextpoCancel = true;
  has_previouspoCancel = true;
  pageSizeCancel = 10;
  poCancelList: any;
  pocancelpage: boolean = true;
  poCancelMakerExport:boolean
  getpoCancel(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show();
    this.dataService.getpocancelsummary(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        console.log("getpo cancel", datas);
        let datapagination = results["pagination"];
        this.poCancelList = datas;
        if (this.poCancelList.length === 0) {
          this.pocancelpage = false
        }
        if (this.poCancelList.length > 0) {
          this.has_nextpoCancel = datapagination.has_next;
          this.has_previouspoCancel = datapagination.has_previous;
          this.presentpagepoCancel = datapagination.index;
          this.pocancelpage = true
          this.poCancelMakerExport=false
        }
        if (this.poCancelList.length== 0){
          this.poCancelMakerExport=true
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  nextClickpoCancel() {
    if (this.has_nextpoCancel === true) {
      this.currentepagepoCancel = this.presentpagepoCancel + 1
      this.getpoCancel(this.presentpagepoCancel + 1, 10)
    }
  }

  previousClickpoCancel() {
    if (this.has_previouspoCancel === true) {
      this.currentepagepoCancel = this.presentpagepoCancel - 1
      this.getpoCancel(this.presentpagepoCancel - 1, 10)
    }
  }
  resetpoCancel() {
    this.pocancelSearchForm.controls['no'].reset("")
    this.pocancelSearchForm.controls['name'].reset("")
    this.pocancelSearchForm.controls['amount'].reset("")
    this.pocancelSearchForm.controls['branch_id'].reset("")
    this.getpoCancel();
  }

  pocancelSearch() {
    let searchpo = this.pocancelSearchForm.value;
    console.log('data for searchpo', searchpo);
    // if ( searchpo.name.id == undefined ){
    //   searchpo.name = searchpo.name
    // }else{
    //   searchpo.name = searchpo.name.id
    // }
    let obj ={
      no: searchpo.no,
      name: searchpo.name.id,
      amount: searchpo.amount,
      branch_id:searchpo.branch_id.id 
    }
    for (let i in obj) {
      if (obj[i] === null || obj[i] === "" || obj[i] === undefined ) {
        delete obj[i];
      }
    }
    this.SpinnerService.show();
    this.dataService.getpocancelsummarySearch(obj)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("poList search result", result)
        this.poCancelList = result['data']
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  sharePomakeCancel(data) {
    this.prposhareService.PocancelShare.next(data)
    //this.router.navigate(['/pocancel'], { skipLocationChange: true })
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = true
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
    return data;
  }




  PoCancelTabSubmit() {
    this.getpoCancel()
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = true
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
  }

  PoCancelTabCancel() {
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = true
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
  }


  ////////////////////////////////////////////////////////////////////////////////////////// PO Cancel Approval

  poCancelAppSearchForm: FormGroup;
  presentpagepoCancelApp: number = 1;
  currentepagepoCancelApp: number = 1;
  has_nextpoCancelApp = true;
  has_previouspoCancelApp = true;
  pageSizeCancelApp = 10;
  poCancelAppList: any;
  pocancelapprovalpage: boolean = true;
  poCancelApproverExport:boolean



  getpoCancelApp(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show();
    this.dataService.getpocancelappsummary(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        console.log("getpo cancel Approval", datas);
        let datapagination = results["pagination"];
        this.poCancelAppList = datas;
        if (this.poCancelAppList.length === 0) {
          this.pocancelapprovalpage = false
        }
        if (this.poCancelAppList.length > 0) {
          this.has_nextpoCancelApp = datapagination.has_next;
          this.has_previouspoCancelApp = datapagination.has_previous;
          this.presentpagepoCancelApp = datapagination.index;
          this.pocancelapprovalpage = true
          this.poCancelApproverExport=false
        }
        if (this.poCancelAppList.length == 0){
          this.poCancelApproverExport=true
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  nextClickpoCancelApp() {
    if (this.has_nextpoCancelApp === true) {
      this.currentepagepoCancelApp = this.presentpagepoCancelApp + 1
      this.getpoCancelApp(this.presentpagepoCancelApp + 1, 10)
    }
  }

  previousClickpoCancelApp() {
    if (this.has_previouspoCancelApp === true) {
      this.currentepagepoCancelApp = this.presentpagepoCancelApp - 1
      this.getpoCancelApp(this.presentpagepoCancelApp - 1, 10)
    }
  }

  resetpoCancelApp() {
    this.poCancelAppSearchForm.controls['no'].reset("")
    this.poCancelAppSearchForm.controls['name'].reset("")
    this.poCancelAppSearchForm.controls['amount'].reset("")
    this.poCancelAppSearchForm.controls['branch_id'].reset("")
    this.getpoCancelApp();

  }
  poCancelAppSearch() {
    let searchpo = this.poCancelAppSearchForm.value;
    console.log('data for searchpo', searchpo);
    // if ( searchpo.name.id == undefined ){
    //   searchpo.name = searchpo.name
    // }else{
    //   searchpo.name = searchpo.name.id
    // }
    let obj = {
      no: searchpo.no, 
      name: searchpo.name.id,
      amount: searchpo.amount,
      branch_id: searchpo.branch_id.id 
    }
    for (let i in obj) {
      if (obj[i] === null || obj[i] === "") {
        delete obj[i];
      }
    }
    this.SpinnerService.show();
    this.dataService.getpocancelappsummarySearch(obj)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("poList search result", result)
        this.poCancelAppList = result['data']
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  sharePomakeCancelApp(data) {
    this.prposhareService.PocancelapprovalShare.next(data)
    // this.router.navigate(['/pocancelapprovalreject'], { skipLocationChange: true })
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = true
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
    return data;
  }


  PoCancelAppSubmit() {
    this.getpoCancelApp()
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = true
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
  }

  PoCancelAppCancel() {
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = true
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
  }


  //////////////////////////////////////////////////////////////////////////////// PO Reopen


  poReopenSearchForm: FormGroup;
  presentpagepoReopen: number = 1;
  has_nextpoReopen = true;
  has_previouspoReopen = true;
  pageSizeReopen = 10;
  poReopenList: any;
  poreopenpageReopen: boolean = true;
  currentepageporpReopen: number = 1;
  isReopenExportButton=false

  getpoReopen(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show();
    this.dataService.getporeopensummary(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log("getpo Reopen", datas);
        this.SpinnerService.hide();
        let datapagination = results["pagination"];
        this.poReopenList = datas;
        if (this.poReopenList.length > 0) {
          this.has_nextpoReopen = datapagination.has_next;
          this.has_previouspoReopen = datapagination.has_previous;
          this.presentpagepoReopen = datapagination.index;
          this.isReopenExportButton=false}
        if(this.poReopenList.length == 0){
          this.isReopenExportButton=true

        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  nextClickpoReopen() {
    if (this.has_nextpoReopen === true) {
      this.currentepageporpReopen = this.presentpagepoReopen + 1
      this.getpoReopen(this.presentpagepoReopen + 1, 10)
    }
  }

  previousClickpoReopen() {
    if (this.has_previouspoReopen === true) {
      this.currentepageporpReopen = this.presentpagepoReopen - 1
      this.getpoReopen(this.presentpagepoReopen - 1, 10)
    }
  }

  resetpoReopen() {
    this.poReopenSearchForm.controls['no'].reset("")
    this.poReopenSearchForm.controls['name'].reset("")
    this.poReopenSearchForm.controls['amount'].reset("")
    this.poReopenSearchForm.controls['branch_id'].reset("")
    this.getpoReopen();

  }
  poReopenSearch() {
    let searchpo = this.poReopenSearchForm.value;
    console.log('data for searchpo', searchpo);
    // if ( searchpo.name.id == undefined ){
    //   searchpo.name = searchpo.name
    // }else{
    //   searchpo.name = searchpo.name.id
    // }
    let obj = {
      no: searchpo.no,
      name: searchpo.name.id,
      amount: searchpo.amount,
      branch_id: searchpo.branch_id.id   
    }
    for (let i in obj) {
      if (obj[i] === null || obj[i] === "") {
        delete obj[i];
      }
    }
    this.SpinnerService.show();
    this.dataService.getporeopensummarySearch(obj)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("poList search result", result)
        this.poReopenList = result['data']
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  sharePomakeReopen(data) {
    this.prposhareService.PoreopenShare.next(data)
    //this.router.navigate(['/poreopencreate'], { skipLocationChange: true })
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = true
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
    return data;
  }







  PoReopenSubmit() {
    this.getpoReopen()
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = true
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
  }

  PoReopenCancel() {
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = true
    this.isPOAmendmentScreenTab = false
    this.isPOAmendmentTab = false
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  poamendmentSearch: FormGroup;
  amendmentList: any;
  tomorrow = new Date();
  ponum: any;
  dates: any;
  isAmendmentExport:boolean

  presentpagepoAmendment: number = 1;
  has_nextpoAmendment = true;
  has_previouspoAmendment = true;
  pageSizeAmendment = 10;
  poreopenpageAmendment: boolean = true;
  currentepagepoAmendment: number = 1;

  getamendmentsummary(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show();
    this.dataService.getpoamendmentsummary(pageNumber, pageSize)
      .subscribe(result => {
        console.log("amendsummary", result)
        this.SpinnerService.hide();
        this.amendmentList = result['data']
        let datapagination = result["pagination"];
        if (this.amendmentList.length > 0) {
          this.has_nextpoAmendment = datapagination.has_next;
          this.has_previouspoAmendment = datapagination.has_previous;
          this.presentpagepoAmendment = datapagination.index;
          this.isAmendmentExport=false
        }
        if(this.amendmentList.length == 0){
          this.isAmendmentExport=true
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  nextClickpoAmendment() {
    if (this.has_nextpoAmendment === true) {
      this.currentepagepoAmendment = this.presentpagepoAmendment + 1
      this.getamendmentsummary(this.presentpagepoAmendment + 1, 10)
    }
  }

  previousClickpoAmendment() {
    if (this.has_previouspoAmendment === true) {
      this.currentepagepoAmendment = this.presentpagepoAmendment - 1
      this.getamendmentsummary(this.presentpagepoAmendment - 1, 10)
    }
  }
  PoAmdmentSearch() {
    let search = this.poamendmentSearch.value;

    this.ponum = this.poamendmentSearch.value.no;

    let Enddate = this.poamendmentSearch.value.date
    let enddate = this.datePipe.transform(Enddate, 'yyyy-MM-dd');
    let branch = this.poamendmentSearch.value.branch_id?.id 
    // for (let i in search) {
    //   if (search[i] === null || search[i] === "") {
    //     delete search[i];
    //   }
    // }
    this.SpinnerService.show();
    this.dataService.getpoamendsearch(this.ponum, enddate, branch)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("poamensearch", result)
        this.amendmentList = result['data']
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  resetAmendment() {
    this.getamendmentsummary();
    this.poamendmentSearch.reset('')


  }
  amendmentedit(data: any) {
    this.prposhareService.poamendmentshare.next(data);
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    this.isPOAmendmentScreenTab = true
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentTab = false
    return data;
  }

  PoAmendmentSubmit() {
    this.getamendmentsummary()
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    this.isPOAmendmentScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentTab = true
  }

  PoAmendmentCancel() {
    this.isPOcreateScreenTab = false
    this.isPOApproverScreenTab = false
    this.isPOCloseScreenTab = false
    this.isPOCloseAppScreenTab = false
    this.isPOCancelScreenTab = false
    this.isPOCancelAppScreenTab = false
    this.isPOReopenScreenTab = false
    this.isPOAmendmentScreenTab = false
    //summary
    this.isPOmakerTab = false
    this.isPOapproverTab = false
    this.isPOclosemakerTab = false
    this.isPOcloseapproverTab = false
    this.isPOcancelmakerTab = false
    this.isPOcancelapproverTab = false
    this.isPOreopenTab = false
    this.isPOAmendmentTab = true
  }






  only_numalpha(event) {
    var k;
    k = event.charCode;
    // return ((k > 96 && k < 123) || (k >= 48 && k <= 57));
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  only_char(event) {
    var a;
    a = event.which;
    if ((a < 65 || a > 90) && (a < 97 || a > 122)) {
      return false;
    }
  }



  fileListHeaderApp: any
  showHeaderimagepopupApp: any
  HeaderFilesPOdownloadApp(data) {
    console.log("For Header Files", data)

    let filesdataValue = data.file_data
    if (filesdataValue.length <= 0) {
      this.notification.showInfo("No Files Found")
    }
    else {
      this.fileListHeaderApp = filesdataValue
      this.showHeaderimagepopupApp = true
    }
  }

  // downloadUrlimage: any
  fileDownloadApp(id, fileName) {
    this.SpinnerService.show();
    this.dataService.fileDownloadsPoHeader(id)
      .subscribe((results) => {
        this.SpinnerService.hide();
        console.log("re", results)
        let binaryData = [];
        binaryData.push(results)
        let filevalue = fileName.split('.')
        if(filevalue[1] != "pdf" && filevalue[1] != "PDF"){
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
        }else{
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData, { type: results.type }));
          window.open(downloadUrl, "_blank");
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  showimageHeaderApp: boolean
  commentPopupHeaderFilesApp(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showimageHeaderApp = true
      this.jpgUrls = this.imageUrl + "prserv/prpo_fileview/" + id + "?token=" + token;
      console.log("urlHeader", this.jpgUrls)
    }
    else {
      this.showimageHeaderApp = false
    }
  }

  currentpagesupplier = 1
  has_nextsupplier = true;
  has_previoussupplier = true;
  autocompletesupplierScroll() {
    setTimeout(() => {
      if (
        this.matsupplierAutocomplete &&
        this.autocompleteTrigger &&
        this.matsupplierAutocomplete.panel
      ) {
        fromEvent(this.matsupplierAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsupplierAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsupplierAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsupplierAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsupplierAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextsupplier === true) {
                this.dataService.getsupplierDropdownFKdd(this.supplierInput.nativeElement.value, this.currentpagesupplier + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.supplierList = this.supplierList.concat(datas);
                    if (this.supplierList.length >= 0) {
                      this.has_nextsupplier = datapagination.has_next;
                      this.has_previoussupplier = datapagination.has_previous;
                      this.currentpagesupplier = datapagination.index;

                    }
                  },(error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  public displayFnsupplier(supplier?: supplierlistss): any | undefined {
    return supplier ? supplier.name : undefined;
  }

  getSupplier() {
    this.SpinnerService.show();
      this.dataService.getsupplierDropdown()
        .subscribe((results: any[]) => {
          this.SpinnerService.hide();
          let datas = results["data"]
          this.supplierList = datas;
          console.log("supplierList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  getcommodityFK() {
    this.SpinnerService.show();
    this.dataService.getcommodityFKkey()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        this.commodityList = datas;
        console.log("commodityList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  currentpagecom: number = 1;
  has_nextcom = true;
  has_previouscom = true;
  autocompletecomScroll() {
    setTimeout(() => {
      if (
        this.matcomAutocomplete &&
        this.autocompleteTrigger &&
        this.matcomAutocomplete.panel
      ) {
        fromEvent(this.matcomAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcomAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcomAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcomAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcomAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom === true) {
                this.dataService.getcommodityFKdd(this.comInput.nativeElement.value, this.currentpagecom + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.commodityList = this.commodityList.concat(datas);
                    // console.log("emp", datas)
                    if (this.commodityList.length >= 0) {
                      this.has_nextcom = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom = datapagination.index;
                    }
                  },(error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  public displayFncom(com?: comlistss): string | undefined {
    console.log('id', com.id);
    console.log('name', com.name);
    return com ? com.name : undefined;
  }

  pdfPopupJustificationNote(pdf_id) {
    let id = pdf_id.id
    this.SpinnerService.show()
    this.dataService.pdfPopupJustificationNote(id)
      .subscribe((datas) => {
        this.SpinnerService.hide()
        let binaryData = [];
        binaryData.push(datas)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData, { type: datas.type }));
        window.open(downloadUrl, "_blank");
        // let downloadUrl = window.URL.createObjectURL(new Blob(binaryData,));
        // let link = document.createElement('a');
        // link.href = downloadUrl;
        this.pdfSrc = downloadUrl
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  public displayFnbranch(branch?: branchlistss): any | undefined {
    return branch ? branch.code + "-" + branch.name : undefined;
  }

  getbranchFK() {
    this.SpinnerService.show()
    this.dataService.getbranchdd()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        this.branchList = datas;
        console.log("branchList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  currentpagebranch = 1
  has_nextbranch = true;
  has_previousbranch = true;
  autocompletebranchScroll() {
    setTimeout(() => {
      if (
        this.matbranchAutocomplete &&
        this.autocompleteTrigger &&
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
              if (this.has_nextbranch === true) {
                this.dataService.getbranchFK(this.branchInput.nativeElement.value, this.currentpagebranch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchList = this.branchList.concat(datas);
                    if (this.branchList.length >= 0) {
                      this.has_nextbranch = datapagination.has_next;
                      this.has_previousbranch = datapagination.has_previous;
                      this.currentpagebranch = datapagination.index;
                    }
                  },(error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

}
