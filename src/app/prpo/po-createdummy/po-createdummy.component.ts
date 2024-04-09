import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, from, fromEvent } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from "ngx-spinner";
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { ErrorHandlingServiceService } from '../error-handling-service.service'
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
export interface branchlistss {
  id: any;
  code: string;
  name: string;
}
export interface supplierlistss {
  id: string;
  name: string;
}
export interface termslistss {
  id: string;
  name: string;
}
export interface Emplistss {
  id: string;
  full_name: string;
}

export interface commoditylistss {
  id: string;
  name: string;
}

export interface supplierlistsearch {
  id: string;
  name: string;
}

@Component({
  selector: 'app-po-createdummy',
  templateUrl: './po-createdummy.component.html',
  styleUrls: ['./po-createdummy.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class PoCreatedummyComponent implements OnInit {
  PRsummarySearchForm: FormGroup;
  POForm: FormGroup;
  qty = new FormControl('');
  retired_remarks = new FormControl('');
  TermsForm: FormGroup;
  producttermsForm: FormGroup;
  servicetermsForm: FormGroup;
  // Istermsbutton:boolean=true;
  image: any;

  todayDate = new Date();
  PrList: any;
  delivaryList: any

  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  pageSize = 10;
  isLoading = false
  branchList: Array<branchlistss>;
  branch_id = new FormControl();

  supplierList: Array<supplierlistss>;
  termsList: Array<termslistss>;

  supplierbranch_id = new FormControl();
  terms_id = new FormControl();
  termlist: Array<any>;
  files: FormGroup;
  filesHeader: FormGroup;
  employeeList: Array<Emplistss>;
  employee_id = new FormControl();
  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('supplier') matsupplierAutocomplete: MatAutocomplete;
  @ViewChild('supplierInput') supplierInput: any;
  @ViewChild('tnc') mattermsAutocomplete: MatAutocomplete;
  @ViewChild('tncInput') tncInput: any;
  @Output() linesChange = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('takeInput', { static: false }) InputVar: ElementRef;
  type = new FormControl({ value: '' })
  ShowNonCat: boolean;
  ShowCat: boolean;
  supplierdisable: boolean;
  clicked: boolean = false



  commodityList: Array<commoditylistss>;
  @ViewChild('commodity') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;
  suppliersearchList: Array<supplierlistsearch>;
  @ViewChild('suppliersearch') matsuppliersearchAutocomplete: MatAutocomplete;
  @ViewChild('suppliersearchInput') suppliersearchInput: any;

  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private dataService: PRPOSERVICEService,
    private prposhareService: PRPOshareService,
    private datePipe: DatePipe, private notification: NotificationService,
    private ref: ChangeDetectorRef, private sanitizer: DomSanitizer, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService) { }
  ngOnInit(): void {

    this.TermsForm = this.fb.group({
      desc: '',
      type: ''
    })
    this.producttermsForm = this.fb.group({
      name: '',
    })

    this.servicetermsForm = this.fb.group({
      name: '',
    })

    this.files = this.fb.group({
      file_upload: new FormArray([
      ]),
      file_uploadindexs: new FormArray([
      ]),
    })
    this.filesHeader = this.fb.group({
      file_upload: new FormArray([
      ]),
    })

    this.PRsummarySearchForm = this.fb.group({
      prno: [''],
      suppliername: [''],
      commodityname: [''],
      branchname: ['']
    })
    this.POForm = this.fb.group({
      supplierbranch_id: ['', Validators.required],
      commodity_id: ['', Validators.required],
      terms_id: ['', Validators.required],
      validfrom: [{ value: "" }],
      validto: [{ value: "" }],
      branch_id: ['', Validators.required],
      onacceptance: 0,
      ondelivery: 0,
      oninstallation: 0,
      notepad: ['', Validators.required],
      warrenty: 0,
      amount: [0, Validators.required],
      employee_id: ['', Validators.required],
      mepno: ['', Validators.required],
      Header_img: null,
      file_key: [["fileheader"]],
      note_justify:'',
      note_placedto: '',
      note_title: '',
      podetails: this.fb.array([
        //this.addpodetailsGroup()
      ])
    })
    this.getEmployeeBranchData();
    let branchkeyvalue: String = "";
    this.getbranchFK(branchkeyvalue);
    this.PRsummarySearchForm.get('branchname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

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


    // let branchkeyvalue: String = "";
    // this.getbranchFK(branchkeyvalue);
    this.POForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

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




    this.PRsummarySearchForm.get('commodityname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getcommodityFKdd(value, 1)
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


    this.PRsummarySearchForm.get('suppliername').valueChanges
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
        this.suppliersearchList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    // let supplierkeyvalue: String = "";
    // this.getsupplierFK(supplierkeyvalue);
    // this.POForm.get('supplierbranch_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.dataService.getsupplierFK(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.supplierList = datas;
    //   },(error) => {
      //   this.errorHandler.handleError(error);
      //   this.SpinnerService.hide();
      // })

    this.serviceTab();
    let key = ""
    this.gettermsFK(key);
    if (this.POForm.value.supplierbranch_id != "") {
      this.formNotComplete = false
    }

    this.POForm.get('employee_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getemployeeLimitSearchPO(this.POForm.value.commodity_id, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    this.POForm.get('terms_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.gettermsFK(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.termlist = datas;

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    this.getCatlog_NonCatlog()
  }
  IDtype: any
  // CheckValidationInSummary(event, id){
  //   this.IDtype = this.type.value
  //   let dataidCondition = this.IDtype
  //   let dataForm = this.POForm.value.podetails
  //   if((dataidCondition != "") || dataidCondition != undefined){
  //   if(dataForm.length > 0){
  //     event.preventDefault();
  //     event.stopPropagation();
  //     this.notification.showWarning("This action is not allowed Please delete Product if you want to change in Details below")
  //     return false;
  //   }
  //   else{
  //     this.getprapprovesummary()
  //   }
  // }
  // }

  getprapprovesummary(pageNumber = 1, pageSize = 10) {
    let dataForm = this.POForm.value.podetails
    // if (dataForm.length > 0) {
    //   this.notification.showWarning("This Action is not allowed, If you want to change Please delete the selected Product below")
    //   return false
    // }
    this.SpinnerService.show();
    this.dataService.getprapprovesummary(this.type.value, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log(["getprapprovesummary", datas]);
        let datapagination = results["pagination"];
        this.PrList = datas;
        // console.log(" this.PrList", this.PrList)
        if (this.PrList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  nextClick() {
    if (this.has_next === true) {
      this.PRsummarySearch(this.presentpage + 1)
    }
  }

  previousClick() {
    if (this.has_previous === true) {
      this.PRsummarySearch(this.presentpage - 1)
    }
  }

  resetpr() {
    this.PRsummarySearchForm.controls['prno'].reset("")
    this.PRsummarySearchForm.controls['suppliername'].reset("")
    this.PRsummarySearchForm.controls['commodityname'].reset("")
    this.PRsummarySearchForm.controls['branchname'].reset("")
    // this.PRsummarySearchForm.reset("")
    // this.getprapprovesummary();
    this.PRsummarySearch(1);

  } 
  PRsummarySearch(page) {


    let searchdel = this.PRsummarySearchForm.value;
    console.log('data for search', searchdel);
    if (searchdel.commodityname?.id == undefined) {
      searchdel.commodityname = searchdel.commodityname
    }
    else {
      searchdel.commodityname = searchdel.commodityname?.id
    }
    if (searchdel.branchname?.id == undefined) {
      searchdel.branchname = searchdel.branchname
    }
    else {
      searchdel.branchname = searchdel.branchname?.id
    }
    if (searchdel.suppliername?.id == undefined) {
      searchdel.suppliername = searchdel.suppliername
    }
    else {
      searchdel.suppliername = searchdel.suppliername?.id
    }
    for (let i in searchdel) {
      if (searchdel[i] === null || searchdel[i] === "" || searchdel[i] == undefined) {
        delete searchdel[i];
      }
    }
    this.SpinnerService.show();
    this.dataService.getprsummarySearch(this.type.value, searchdel, page)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("prList search result", result)
        this.PrList = result['data']
        // console.log(" this.PrList1", this.PrList)
        let datapagination = result["pagination"];
        if (this.PrList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
        // if (searchdel.prno === '' && searchdel.suppliername === '' && searchdel.commodityname === '' && searchdel.branchname === '') {
        //   this.getprapprovesummary();
        // }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  iddata: any
  prnodata: any
  prSupplier: any
  posharedata(data) {
    //this.prposhareService.PoShare.next(data);
    this.iddata = data.id
    this.prnodata = data.prheader_id.no
    this.prSupplier = data.supplier_id.name
    return data
  }
  retiredRemarks(data) {
    //this.prposhareService.PoShare.next(data);
    this.iddata = data.id
    this.prnodata = data.prheader_id.no
    console.log('retired ID', this.iddata)
    console.log('this.prnodata', this.prnodata)
    return data
  }
  retiredRemarksSubmit(data, retired_remarks, event) {
    this.iddata = data.id
    this.prnodata = data.prheader_id.no
    console.log('retired ID', this.iddata)
    console.log('this.prnodata', this.prnodata)
    console.log('retired_remarks', retired_remarks)
    let retvalue = {
      id: [this.iddata],
      remarks: retired_remarks
    }
    console.log("retvalue", retvalue)
    // event.preventDefault();
    // event.stopPropagation();
    let dataConfirm = confirm("Do you want to continue to retire?")
    if (dataConfirm == true) {
      this.SpinnerService.show();
      this.dataService.retiredremarksPO(retvalue)
        .subscribe(res => {
          this.SpinnerService.hide();
          if (res.code === "PO Created" && res.description === "Already PO as been created for this PR") {
            this.SpinnerService.hide();
            this.notification.showWarning('This PR is Not Allowed To Retire, PO Already Created')
            return false
            // event.preventDefault();
            // event.stopPropagation();
          } else {
            this.notification.showSuccess("Successfully Retired")
            this.onCancel.emit()
            this.SpinnerService.hide();
            this.PRsummarySearch(1)
            return
          }
        },(error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }
    if (dataConfirm == false) {
      this.notification.showInfo("Cancelled")
    }

    // return data
  }


  ngAfterContentChecked() {
    this.ref.detectChanges();
  }


  formNotComplete: boolean = true


  addpodetailsGroup() {
    let group = new FormGroup({
      installationrequired: new FormControl(''),
      capitalized: new FormControl(''),
      commodity: new FormControl(''),

      Product_name: new FormControl(''),

      product_id: new FormControl(''),
      qty: new FormControl(0),
      uom: new FormControl(''),
      unitprice: new FormControl(0),
      amount: new FormControl(0),
      taxamount: new FormControl(''),
      amcvalue: new FormControl(0),
      deliveryperiod: new FormControl(0),
      totalamount: new FormControl(''),
      is_asset: new FormControl(''),
      delivery_details: this.fb.array([
        this.fb.group({
          ccbsqty: new FormControl(''),
          prdetails_id: new FormControl(''),
          product_id: new FormControl(''),
          commodity_id: new FormControl(''),
          prccbs_id: new FormControl(''),
          ccbs: new FormControl(''),
          qty: new FormControl(0),
          uom: new FormControl(''),
          bs: new FormControl(''),
          cc: new FormControl(''),
          prccbs_remaining_qty_Value: new FormControl(''),
          location: new FormControl(''),
        })
      ])
    }
    )
    return group
  }

  delivery_detailsGroup(): FormGroup {
    return this.fb.group({
      ccbsqty: new FormControl(''),
      prdetails_id: new FormControl(''),
      product_id: new FormControl(''),
      commodity_id: new FormControl(''),
      prccbs_id: new FormControl(''),
      ccbs: new FormControl(''),
      qty: new FormControl(0),
      uom: new FormControl(''),
      bs: new FormControl(''),
      cc: new FormControl(''),
      prccbs_remaining_qty_Value: new FormControl(''),
      location: new FormControl(''),
    });
  }

  get podetailsArray(): FormArray {
    return <FormArray>this.POForm.get('podetails');
  }

  addSection() {
    const control = <FormArray>this.POForm.get('podetails');
    control.push(this.addpodetailsGroup());
  }

  removeSection(index) {
    const control = <FormArray>this.POForm.get('podetails');
    control.removeAt(index);
    this.POForm.controls['employee_id'].reset("")
    // this.files.value.file_upload.splice(index)	
    // this.files.value.file_uploadindexs.splice(index)	
    this.FileDataArray.splice(index, 1)
    this.FileDataArrayIndex.splice(index, 1)
    let lengthCheckForRefreshData = this.POForm.value.podetails
    let lengthval = lengthCheckForRefreshData.length
    if (lengthval === 0) {
      this.POForm.reset()
      this.type.enable()
      // if (this.type.value == 1) {	
      this.POForm.controls['supplierbranch_id'].reset("")
      this.POForm.controls['employee_id'].reset("")
      // }	
      this.getEmployeeBranchData()
    }
    console.log("this.FileDataArray", this.FileDataArray)
    console.log("this.this.FileDataArrayIndex", this.FileDataArrayIndex)
    this.datasums()
  }

  getdeliveryDetails() {
    let id = this.iddata
    this.SpinnerService.show()
    this.dataService.getpodeliverydetails(id)
      .subscribe((results) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        console.log("getsummaryddin grid", datas);
        this.delivaryList = datas
        this.qty.reset();
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  amt: any;
  sum: any = 0.00;



  getFormArray(): FormArray {
    return this.POForm.get('podetails') as FormArray;
  }
  qtypatchpo: any
  variableforIndexccbs: any
  totalqtydetails: any
  gettingarrayOfCcbsValue(i, data) {
    let variableForccbs = this.POForm.value.podetails[i].delivery_details.map(x => x.ccbs);
    console.log("variableForccbs", variableForccbs)

    let indexvalueofccbsindifferentfunction = variableForccbs.indexOf(data.id);
    console.log("indexvalueofccbsindifferentfunction", indexvalueofccbsindifferentfunction)
    this.variableforIndexccbs = indexvalueofccbsindifferentfunction
    console.log("this.variableforIndexccbs", this.variableforIndexccbs)
  }

  arrayvalueget = []
  ccbspatchpo: any
  datavalueget: any
  //////////////////////////////////////////////////// Type 1 and Type 2 (if conditions is used below) 
  getpodata(data, qtyvalues) {
    // console.log("data1",data)
    // console.log('qty', qtyvalues)
    let valueTocheckQuantity: any = +qtyvalues
    if (valueTocheckQuantity <= 0 || valueTocheckQuantity > data.remainingQty) {
      this.notification.showWarning("Please Enter Valid Quantity")
      return false
    }
    if (this.POForm.value.podetails.length > 0) {
      if (this.POForm.value.mepno !== "" && data.prdetails.prheader_id.mepno === "") {
        this.notification.showWarning("Choose MEP")
        return false
      }
      if (this.POForm.value.mepno === "" && data.prdetails.prheader_id.mepno !== "") {
        this.notification.showWarning("Choose MEP")
        return false
      }
    }
    console.log('data', data)
    console.log('qty', qtyvalues)
    /// reset supplier and approver for every changes in the table 
    // if (this.type.value == 1) {
    //   this.POForm.controls['supplierbranch_id'].reset("")
    // }
    this.POForm.controls['employee_id'].reset("")
    let formvalues = this.POForm.value.podetails
    //checking the condition if commodity in poform or if commodity is present check same commodity or not  
    if (!this.POForm.value.commodity_id || this.POForm.value.commodity_id === data.prdetails.prheader_id.commodity_id.id) {
      //checking if podetails length for updata the data 
      if (formvalues.length > 0) {
        // if podetails is present check same product or different product to push or update
        for (let i in formvalues) {
          //if same product we have to update the delivery details data in podetails 
          if (this.type.value == 1) {
            if (this.POForm.value.podetails.length > 0) {
              if (this.POForm.value.supplierbranch_id.id != data.prdetails.supplier_id.id) {
                this.notification.showWarning("Choose Same Supplier")
                return false
              }
            }
            if (formvalues[i].product_id === data.prdetails.product_id && formvalues[i].item === data.prdetails.item) {
              //for checking purpose getting delivery details data in array if same delivery details then product delivery details is updated
              this.ccbspatchpo = this.POForm.value.podetails[i].delivery_details.map(x => x.ccbs);
              console.log('data check ccbspatchpo', this.ccbspatchpo)
              let variaccbs = this.ccbspatchpo
              console.log("variaccbs", variaccbs)
              //if same commodity and same product and same delivery details then delivery details is updated in this portion else pushes the new delivery details with calculation of qty and unit price and total amount
              for (let z in variaccbs) {
                if (this.ccbspatchpo[z] === data.id) {
                  this.notification.showInfo("Product Quantity Updated")
                  console.log("ccbs for index in array ", data.id)
                  let indexvalueofccbs = variaccbs.indexOf(data.id);
                  console.log("indexvalueofccbs", indexvalueofccbs)

                  formvalues[i].delivery_details[indexvalueofccbs].qty = +qtyvalues
                  let qty: FormControl = new FormControl(null);
                  let amount: FormControl = new FormControl(null);
                  let unitprice: FormControl = new FormControl(null);
                  let totalamount: FormControl = new FormControl(null);
                  this.qtypatchpo = this.POForm.value.podetails[i].delivery_details.map(x => x.qty);
                  console.log('data check qtypatchpo', this.qtypatchpo);
                  this.totalqtydetails = this.qtypatchpo.reduce((a, b) => a + b, 0);
                  this.POForm.get('podetails')['controls'][i].get('qty').setValue(this.totalqtydetails)
                  this.calcTotalpatch(unitprice, qty, amount, totalamount)
                  unitprice.valueChanges.pipe(
                    debounceTime(20)
                  ).subscribe(value => {
                    console.log("should be called first")
                    this.calcTotalpatch(unitprice, qty, amount, totalamount)
                    if (!this.POForm.valid) {
                      return;
                    }
                    this.linesChange.emit(this.POForm.value['podetails']);
                  }
                  )
                  qty.valueChanges.pipe(
                    debounceTime(20)
                  ).subscribe(value => {
                    console.log("should be called first")
                    this.calcTotalpatch(unitprice, qty, amount, totalamount)
                    if (!this.POForm.valid) {
                      return;
                    }
                    this.linesChange.emit(this.POForm.value['podetails']);
                  }
                  )



                  return
                }
              }
              //if not same delivery details in same product pushes the new delivery details in same product delivery details
              let ccbsqty: FormControl = new FormControl('')
              let prdetails_id: FormControl = new FormControl('')
              let commodity_id: FormControl = new FormControl('')
              let prccbs_id: FormControl = new FormControl('')
              let ccbs: FormControl = new FormControl('')
              let bs: FormControl = new FormControl('')
              let cc: FormControl = new FormControl('')
              let prccbs_remaining_qty_Value: FormControl = new FormControl('')
              let location: FormControl = new FormControl('')
              let product_id: FormControl = new FormControl('');
              let item: FormControl = new FormControl('');
              let product_name: FormControl = new FormControl('');
              let item_name: FormControl = new FormControl('');

              let uom: FormControl = new FormControl('');
              let qty: FormControl = new FormControl(null);
              let amount: FormControl = new FormControl(null);
              let unitprice: FormControl = new FormControl(null);
              let totalamount: FormControl = new FormControl(null);
              // console.log("dataassspo",data)
              product_id.setValue(data.prdetails.product_id)
              item.setValue(data.prdetails.item)
              product_name.setValue(data.prdetails.product_name)
              item_name.setValue(data.prdetails.item_name)
              uom.setValue(data.prdetails.uom)
              ccbsqty.setValue(data.qty)
              prdetails_id.setValue(data.prdetails.id)
              commodity_id.setValue(data.prdetails.prheader_id.commodity_id.id)
              prccbs_id.setValue(data.id)
              ccbs.setValue(data.id)
              bs.setValue(data.bs)
              cc.setValue(data.cc)
              prccbs_remaining_qty_Value.setValue(data.remainingQty - qtyvalues)
              location.setValue(data.branch_id.name)
              qty.setValue(+qtyvalues)

              this.POForm.value.podetails[i].delivery_details.push({
                ccbsqty: ccbsqty.value,
                prdetails_id: prdetails_id.value,
                product_id: product_id.value,
                item: item.value,
                product_name: product_name.value,
                item_name: item_name.value,
                commodity_id: commodity_id.value,
                prccbs_id: prccbs_id.value,
                ccbs: ccbs.value,
                qty: qty.value,
                uom: uom.value,
                bs: bs.value,
                cc: cc.value,
                prccbs_remaining_qty_Value: prccbs_remaining_qty_Value.value,
                location: location.value
              })
              this.qtypatchpo = this.POForm.value.podetails[i].delivery_details.map(x => x.qty);
              console.log('data check qtypatchpo', this.qtypatchpo);
              this.totalqtydetails = this.qtypatchpo.reduce((a, b) => a + b, 0);
              this.POForm.get('podetails')['controls'][i].get('qty').setValue(this.totalqtydetails)
              //this.POForm.get('podetails')['controls'][i].get('totalamount').setValue(this.POForm.get('podetails')['controls'][i].get('qty') * this.POForm.get('podetails')['controls'][i].get('unitprice'))
              this.calcTotalpatch(unitprice, qty, amount, totalamount)
              unitprice.valueChanges.pipe(
                debounceTime(20)
              ).subscribe(value => {
                console.log("should be called first")
                this.calcTotalpatch(unitprice, qty, amount, totalamount)
                if (!this.POForm.valid) {
                  return;
                }
                this.linesChange.emit(this.POForm.value['podetails']);
              }
              )
              qty.valueChanges.pipe(
                debounceTime(20)
              ).subscribe(value => {
                console.log("should be called first")
                this.calcTotalpatch(unitprice, qty, amount, totalamount)
                if (!this.POForm.valid) {
                  return;
                }
                this.linesChange.emit(this.POForm.value['podetails']);
              }
              )
              this.notification.showInfo("Selected")
              return
            }
          }

          
          if (this.type.value == 2) {
            if (this.POForm.value.podetails.length > 0) {
              if (this.POForm.value.supplierbranch_id.id != data.prdetails.supplier_id.id) {
                this.notification.showWarning("Choose Same Supplier")
                return false
              }
            }

            if (formvalues[i].item_name === data.prdetails.item_name) {
              //for checking purpose getting delivery details data in array if same delivery details then product delivery details is updated
              this.ccbspatchpo = this.POForm.value.podetails[i].delivery_details.map(x => x.ccbs);
              console.log('data check ccbspatchpo', this.ccbspatchpo)
              let variaccbs = this.ccbspatchpo
              console.log("variaccbs", variaccbs)
              //if same commodity and same product and same delivery details then delivery details is updated in this portion else pushes the new delivery details with calculation of qty and unit price and total amount
              for (let z in variaccbs) {
                if (this.ccbspatchpo[z] === data.id) {
                  this.notification.showInfo("Product Quantity Updated")
                  console.log("ccbs for index in array ", data.id)
                  let indexvalueofccbs = variaccbs.indexOf(data.id);
                  console.log("indexvalueofccbs", indexvalueofccbs)

                  formvalues[i].delivery_details[indexvalueofccbs].qty = +qtyvalues
                  let qty: FormControl = new FormControl(null);
                  let amount: FormControl = new FormControl(null);
                  let unitprice: FormControl = new FormControl(null);
                  let totalamount: FormControl = new FormControl(null);
                  this.qtypatchpo = this.POForm.value.podetails[i].delivery_details.map(x => x.qty);
                  console.log('data check qtypatchpo', this.qtypatchpo);
                  this.totalqtydetails = this.qtypatchpo.reduce((a, b) => a + b, 0);
                  this.POForm.get('podetails')['controls'][i].get('qty').setValue(this.totalqtydetails)
                  this.calcTotalpatch(unitprice, qty, amount, totalamount)
                  unitprice.valueChanges.pipe(
                    debounceTime(20)
                  ).subscribe(value => {
                    console.log("should be called first")
                    this.calcTotalpatch(unitprice, qty, amount, totalamount)
                    if (!this.POForm.valid) {
                      return;
                    }
                    this.linesChange.emit(this.POForm.value['podetails']);
                  }
                  )
                  qty.valueChanges.pipe(
                    debounceTime(20)
                  ).subscribe(value => {
                    console.log("should be called first")
                    this.calcTotalpatch(unitprice, qty, amount, totalamount)
                    if (!this.POForm.valid) {
                      return;
                    }
                    this.linesChange.emit(this.POForm.value['podetails']);
                  }
                  )



                  return
                }
              }
              //if not same delivery details in same product pushes the new delivery details in same product delivery details
              let ccbsqty: FormControl = new FormControl('')
              let prdetails_id: FormControl = new FormControl('')
              let commodity_id: FormControl = new FormControl('')
              let prccbs_id: FormControl = new FormControl('')
              let ccbs: FormControl = new FormControl('')
              let bs: FormControl = new FormControl('')
              let cc: FormControl = new FormControl('')
              let prccbs_remaining_qty_Value: FormControl = new FormControl('')
              let location: FormControl = new FormControl('')
              let uom: FormControl = new FormControl('');
              let qty: FormControl = new FormControl(null);
              let amount: FormControl = new FormControl(null);
              let unitprice: FormControl = new FormControl(null);
              let totalamount: FormControl = new FormControl(null);

              let product_name: FormControl = new FormControl('')
              let item_name: FormControl = new FormControl('')
              let item: FormControl = new FormControl('')
              let product_id: FormControl = new FormControl('');

              product_id.setValue(data.prdetails.product_id)
              item.setValue("")
              product_name.setValue(data.prdetails.product_name)
              item_name.setValue(data.prdetails.item_name)

              uom.setValue(data.prdetails.uom)
              ccbsqty.setValue(data.qty)
              prdetails_id.setValue(data.prdetails.id)
              commodity_id.setValue(data.prdetails.prheader_id.commodity_id.id)
              prccbs_id.setValue(data.id)
              ccbs.setValue(data.id)
              bs.setValue(data.bs)
              cc.setValue(data.cc)
              prccbs_remaining_qty_Value.setValue(data.remainingQty - qtyvalues)
              location.setValue(data.branch_id.name)
              qty.setValue(+qtyvalues)


              this.POForm.value.podetails[i].delivery_details.push({
                ccbsqty: ccbsqty.value,
                prdetails_id: prdetails_id.value,
                product_id: product_id.value,
                item: item.value,
                product_name: product_name.value,
                item_name: item_name.value,
                commodity_id: commodity_id.value,
                prccbs_id: prccbs_id.value,
                ccbs: ccbs.value,
                qty: qty.value,
                uom: uom.value,
                bs: bs.value,
                cc: cc.value,
                prccbs_remaining_qty_Value: prccbs_remaining_qty_Value.value,
                location: location.value
              })
              this.qtypatchpo = this.POForm.value.podetails[i].delivery_details.map(x => x.qty);
              console.log('data check qtypatchpo', this.qtypatchpo);
              this.totalqtydetails = this.qtypatchpo.reduce((a, b) => a + b, 0);
              this.POForm.get('podetails')['controls'][i].get('qty').setValue(this.totalqtydetails)
              //this.POForm.get('podetails')['controls'][i].get('totalamount').setValue(this.POForm.get('podetails')['controls'][i].get('qty') * this.POForm.get('podetails')['controls'][i].get('unitprice'))
              this.calcTotalpatch(unitprice, qty, amount, totalamount)
              unitprice.valueChanges.pipe(
                debounceTime(20)
              ).subscribe(value => {
                console.log("should be called first")
                this.calcTotalpatch(unitprice, qty, amount, totalamount)
                if (!this.POForm.valid) {
                  return;
                }
                this.linesChange.emit(this.POForm.value['podetails']);
              }
              )
              qty.valueChanges.pipe(
                debounceTime(20)
              ).subscribe(value => {
                console.log("should be called first")
                this.calcTotalpatch(unitprice, qty, amount, totalamount)
                if (!this.POForm.valid) {
                  return;
                }
                this.linesChange.emit(this.POForm.value['podetails']);
              }
              )
              this.notification.showInfo("Selected")
              return
            }
          }


        }
      }
      //if empty it works to push new data in table with qty, total amount and amount

      this.POForm.patchValue({
        commodity_id: data.prdetails.prheader_id.commodity_id.id,
        mepno: data.prdetails.prheader_id.mepno
      });
      if (data) {
        if (this.type.value == 1) {
          this.POForm.patchValue({
            supplierbranch_id: data.prdetails.supplier_id
          })
          this.ShowNonCat = false
          this.ShowCat = true
          this.supplierdisable = false
        }
        if (this.type.value == 2) {
          this.ShowNonCat = true
          this.ShowCat = false
          this.POForm.patchValue({
            supplierbranch_id: data.prdetails.supplier_id
          })
          this.supplierdisable = true
        }
        // if (this.type.value == 2) {
        if (this.POForm.value.podetails.length > 0) {
          if (this.POForm.value.supplierbranch_id.id != data.prdetails.supplier_id.id) {
            this.notification.showWarning("Choose Same Supplier")
            return false
          }
        }
        // }

        let installationrequired: FormControl = new FormControl('');
        let capitalized: FormControl = new FormControl('');
        let commodity: FormControl = new FormControl('');
        let product_name: FormControl = new FormControl('');
        let product_idCatlog: FormControl = new FormControl('');
        let itemCatlog: FormControl = new FormControl('');
        let product_id: FormControl = new FormControl('');
        let item: FormControl = new FormControl('');
        let item_name: FormControl = new FormControl('');
        let qty: FormControl = new FormControl(null);
        let uom: FormControl = new FormControl('');
        let amount: FormControl = new FormControl(null);
        let unitprice: FormControl = new FormControl(null);
        let taxamount: FormControl = new FormControl('');
        let amcvalue: FormControl = new FormControl(0);
        let deliveryperiod: FormControl = new FormControl(0);
        let totalamount: FormControl = new FormControl('');
        let is_asset: FormControl = new FormControl('');
        let file_key: FormControl = new FormControl('');

        let ccbsqty: FormControl = new FormControl('')
        let prdetails_id: FormControl = new FormControl('')
        let commodity_id: FormControl = new FormControl('')
        let prccbs_id: FormControl = new FormControl('')
        let ccbs: FormControl = new FormControl('')
        let bs: FormControl = new FormControl('')
        let cc: FormControl = new FormControl('')
        let prccbs_remaining_qty_Value: FormControl = new FormControl('')
        let location: FormControl = new FormControl('')

        file_key.setValue("")
        installationrequired.setValue(data.prdetails.installationrequired)
        capitalized.setValue(data.prdetails.capitialized)
        commodity.setValue(data.prdetails.prheader_id.commodity_id.name)

        if (this.type.value == 1) {
          product_idCatlog.setValue(data.prdetails.product_name)
          product_id.setValue(data.prdetails.product_id)
          product_name.setValue(data.prdetails.product_name)
        }
        else {
          product_idCatlog.setValue('')
          product_name.setValue(data.prdetails.product_name)
          product_id.setValue(data.prdetails.product_id)
        }
        if (data.prdetails.prheader_id.type_id == 1) {
          item.setValue(data.prdetails.item)
          item_name.setValue(data.prdetails.item_name)
          itemCatlog.setValue(data.prdetails.item_name)
        }
        else {
          item_name.setValue(data.prdetails.item_name)
          item.setValue('')
          itemCatlog.setValue('')
        }
        uom.setValue(data.prdetails.uom)
        taxamount.setValue(0)
        qty.setValue(+qtyvalues)
        if (this.type.value == 1) {
          unitprice.setValue(0)
        }
        else {
          unitprice.setValue(data.prdetails.unitprice)
        }

        amount.setValue(qty.value * unitprice.value)
        totalamount.setValue(qty.value * unitprice.value)
        is_asset.setValue(data.prdetails.is_asset)

        ccbsqty.setValue(data.qty)
        prdetails_id.setValue(data.prdetails.id)
        commodity_id.setValue(data.prdetails.prheader_id.commodity_id.id)
        prccbs_id.setValue(data.id)
        ccbs.setValue(data.id)
        bs.setValue(data.bs)
        cc.setValue(data.cc)
        prccbs_remaining_qty_Value.setValue(data.remainingQty - qtyvalues)
        location.setValue(data.branch_id.name)

        this.getFormArray().push(new FormGroup({
          installationrequired: installationrequired,
          capitalized: capitalized,
          commodity: commodity,
          product_idCatlog: product_idCatlog,
          itemCatlog: itemCatlog,
          product_name: product_name,
          product_id: product_id,
          item_name: item_name,
          item: item,
          uom: uom,
          qty: qty,
          unitprice: unitprice,
          amount: amount,
          taxamount: taxamount,
          amcvalue: amcvalue,
          deliveryperiod: deliveryperiod,
          totalamount: totalamount,
          is_asset: is_asset,
          //image: image,
          delivery_details: this.fb.array([
            this.fb.group({
              ccbsqty: ccbsqty,
              prdetails_id: prdetails_id,
              product_id: product_id,
              product_name: product_name,
              item_name: item_name,
              item: item,
              commodity_id: commodity_id,
              prccbs_id: prccbs_id,
              ccbs: ccbs,
              qty: qty,
              uom: uom,
              bs: bs,
              cc: cc,
              prccbs_remaining_qty_Value: prccbs_remaining_qty_Value,
              location: location,
            })
          ])
        }))
        this.calcTotalpatch(unitprice, qty, amount, totalamount)

        unitprice.valueChanges.pipe(
          debounceTime(20)
        ).subscribe(value => {
          console.log("should be called first")
          this.calcTotalpatch(unitprice, qty, amount, totalamount)
          if (!this.POForm.valid) {
            return;
          }
          this.linesChange.emit(this.POForm.value['podetails']);
        }
        )
        qty.valueChanges.pipe(
          debounceTime(20)
        ).subscribe(value => {
          console.log("should be called first")
          this.calcTotalpatch(unitprice, qty, amount, totalamount)
          if (!this.POForm.valid) {
            return;
          }
          this.linesChange.emit(this.POForm.value['podetails']);
        }
        )

        amcvalue.valueChanges.pipe(
          debounceTime(20)
        ).subscribe(value => {
          console.log("should be called first amc", value)
          // this.ChangingAmcAndDelivaryPeriod('amc')
          this.onChangeAMCandDelivaryPeriod(this.POForm.get('podetails'))
          
          if (!this.POForm.valid) {
            return;
          }
          this.linesChange.emit(this.POForm.value['podetails']);
        }
        )

        deliveryperiod.valueChanges.pipe(
          debounceTime(20)
        ).subscribe(value => {
          console.log("should be called first delivaryperiod", value)
          // this.ChangingAmcAndDelivaryPeriod('delivaryperiod')
          
          if (!this.POForm.valid) {
            return;
          }
          this.linesChange.emit(this.POForm.value['podetails']);
        }
        )


        this.notification.showInfo("Product Selected")
        this.type.disable();
        this.gettingUnitPrice()
      }
    }
    else {
      this.notification.showWarning("Choose same Commmdity")
    }
  }
  //calculation to patch amount 
  calcTotalpatch(unitprice, qty, amount, totalamount: FormControl) {
    const unitprices = unitprice.value
    const qtys = qty.value
    amount.setValue((qtys * unitprices), { emitEvent: false });
    totalamount.setValue((qtys * unitprices), { emitEvent: false });
    this.datasums();
  }
  datasums() {
    this.amt = this.POForm.value.podetails.map(x => x.amount);
    console.log('data check amt', this.amt);
    this.sum = this.amt.reduce((a, b) => a + b, 0);
    console.log('sum of total ', this.sum);
    this.POForm.patchValue({
      amount: this.sum
    })
  }

  arraydata: any
  ccpopup: any
  bspopup: any
  branchpopup: any
  qtypopup: any
  namesvaluedel: any
  modalsboot(group) {
    console.log("index value", group.value.Product_name)
    let names = group.value
    console.log("popup value", names)
    this.arraydata = names
    this.namesvaluedel = group.value.delivery_details
    console.log("popup value namesvaluedel", this.namesvaluedel)
  }

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
              if (this.has_next === true) {
                this.dataService.getbranchFK(this.branchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchList = this.branchList.concat(datas);
                    if (this.branchList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
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

  // displayFnbranch(branch?: any) {
  //   return branch ? this.branchList.find(_ => _.id === branch).code : undefined;
  // }
  public displayFnbranch(branch?: branchlistss): string | undefined {
    let code = branch ? branch.code : undefined;
    let name = branch ? branch.name : undefined;
    return branch ? code + '-' + name : undefined;
  }

  get branch() {
    return this.POForm.get('branch_id');
  }

  getbranchFK(branchkeyvalue) {
    this.SpinnerService.show();
    this.dataService.getbranch(branchkeyvalue)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.branchList = datas;
        console.log("branchList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  public displayFnsupplier(supplier?: supplierlistss): string | undefined {
    return supplier ? supplier.name : undefined;
  }

  get supplier() {
    return this.POForm.get('supplierbranch_id');
  }


  public displayFnterms(terms?: termslistss): string | undefined {
    return terms ? terms.name : undefined;
  }


  gettermsFK(termskeyvalue) {
    this.SpinnerService.show();
    this.dataService.geteermslist(termskeyvalue)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.termlist = datas;
        console.log("termsList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  IsProductTab = false
  IsServiceTab = false
  IsCreateTab = false
  typeList: any[] = [
    { display: 'Service', value: 'S' },
    { display: 'Product', value: 'P' }
  ]
  ServiceTermList: any
  ProductTermList: any

  // productTab(){


  // }
  producttermslistproduct: any
  productTab() {
    this.IsProductTab = true
    this.IsServiceTab = false
    this.IsCreateTab = false
    this.SpinnerService.show();
    this.dataService.getproductterms()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.producttermslistproduct = datas;
        console.log("producttermslistproduct", this.producttermslistproduct)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  servicetermslist
  serviceTab() {
    this.IsProductTab = false
    this.IsServiceTab = true
    this.IsCreateTab = false
    this.SpinnerService.show();
    this.dataService.getserviceterms()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.servicetermslist = datas;
        console.log("servicelist", this.servicetermslist)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  createTab() {
    this.IsProductTab = false
    this.IsServiceTab = false
    this.IsCreateTab = true
  }


  termscreateSubmit() {
    let data: any = this.TermsForm.value

    if ((data.type == undefined) || (data.type == "") || (data.type == null)) {
      this.notification.showWarning("Please Fill Type of Term")
      return false
    }
    if ((data.desc == undefined) || (data.desc == "") || (data.desc == null)) {
      this.notification.showWarning("Please Fill Description")
      return false
    }
    this.SpinnerService.show();
    this.dataService.POTermsCreateForm(data)
      .subscribe(res => {
        this.SpinnerService.hide();
        this.notification.showSuccess("New term added!...")

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  checkboxlistid: any[] = [];

  productCheckBoxvalue(listItem, event) {
    if (event.checked == true) {
      this.checkboxlistid.push(listItem.id);
      console.log("checkboxlistid", this.checkboxlistid)


    }
    else {
      const index = this.checkboxlistid.indexOf(listItem.id)
      this.checkboxlistid.splice(index, 1)
      console.log("checkboxlistid", this.checkboxlistid)
    }

  }

  scheckboxlistid: any[] = [];


  serviceCheckBoxvalue(listItem, event) {
    if (event.checked == true) {
      this.scheckboxlistid.push(listItem.id);
      console.log("scheckboxlistid", this.scheckboxlistid)


    }
    else {
      const index = this.scheckboxlistid.indexOf(listItem.id)
      this.scheckboxlistid.splice(index, 1)
      console.log("scheckboxlistid", this.scheckboxlistid)
    }

  }


  servicetermsFormSubmit() {
    let data: any = this.servicetermsForm.value
    let suplierid = this.POForm.value.supplierbranch_id.id
    let text = ""

    data.supplierbranch_id = suplierid
    data.potermstemplate = this.scheckboxlistid
    if ((suplierid == undefined) || (suplierid == "") || (suplierid == null)) {
      this.notification.showWarning("Choose Supplier")
      return false
    }

    let TermServiceName = this.servicetermsForm.value.name
    if ((TermServiceName == undefined) || (TermServiceName == "") || (TermServiceName == null)) {
      this.notification.showWarning("Please Fill Service Term Name")
      return false
    }
    let selectedTerms = this.scheckboxlistid
    if (selectedTerms.length == 0) {
      this.notification.showWarning("Please Select Atleast One Term ")
      return false
    }

    let dataterms = {
      name: this.servicetermsForm.value.name,
      supplier_id: suplierid,
      text: "",
      potermstemplate: this.scheckboxlistid
    }

    data.text = text
    this.SpinnerService.show();
    this.dataService.POproductserviceCreateForm(dataterms)
      .subscribe(res => {
        this.SpinnerService.hide();
        this.notification.showSuccess("New Service term added!...")
        let key = ""
        this.gettermsFK(key)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  producttermsFormSubmit() {
    let data: any = this.producttermsForm.value
    let suplierid = this.POForm.value.supplierbranch_id.id
    let text = ""

    data.supplierbranch_id = suplierid
    data.text = text
    data.potermstemplate = this.checkboxlistid
    if ((suplierid == undefined) || (suplierid == "") || (suplierid == null)) {
      this.notification.showWarning("Choose Supplier")
      return false
    }
    let TermProductName = this.producttermsForm.value.name
    if ((TermProductName == undefined) || (TermProductName == "") || (TermProductName == null)) {
      this.notification.showWarning("Please Fill Product Term Name")
      return false
    }
    let selectedTerms = this.checkboxlistid
    if (selectedTerms.length == 0) {
      this.notification.showWarning("Please Select Atleast One Term ")
      return false
    }



    let dataterms = {
      name: this.producttermsForm.value.name,
      supplier_id: suplierid,
      text: "",
      potermstemplate: this.checkboxlistid
    }
    this.SpinnerService.show();
    this.dataService.POproductserviceCreateForm(dataterms)
      .subscribe(res => {
        this.SpinnerService.hide();
        this.notification.showSuccess("New Product term added!...")
        let key = ""
        this.gettermsFK(key)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  producttermslist: any
  termsmodal() {
    let termid = this.POForm.value.terms_id.id
    if ((termid == "") || (termid == null) || (termid == undefined)) { this.notification.showWarning("Please choose the Terms"); return false }
    this.SpinnerService.show();
    this.dataService.gettermsget(termid)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.producttermslist = datas;
        console.log("aa", this.producttermslist)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  POSubmit() {

    if ((this.POForm.value.supplierbranch_id == "") || (this.POForm.value.supplierbranch_id == null) || (this.POForm.value.supplierbranch_id == undefined)) {
      this.notification.showWarning("Choose Supplier")
      this.clicked = false
      return false
    }

    if ((this.POForm.value.validfrom == "") || (this.POForm.value.validfrom == null) || (this.POForm.value.validfrom == undefined)) {
      this.notification.showWarning("Choose From Date")
      this.clicked = false
      return false
    }

    if ((this.POForm.value.validto == "") || (this.POForm.value.validto == null) || (this.POForm.value.validto == undefined)) {
      this.notification.showWarning("Choose To Date")
      this.clicked = false
      return false
    }

    if ((this.POForm.value.terms_id == "") || (this.POForm.value.terms_id == null) || (this.POForm.value.terms_id == undefined)) {
      this.notification.showWarning("Choose Terms And Conditions")
      this.clicked = false
      return false
    }
    if ((this.POForm.value.branch_id == "") || (this.POForm.value.branch_id == null) || (this.POForm.value.branch_id == undefined)) {
      this.notification.showWarning("Choose Branch ")
      this.clicked = false
      return false
    }
    if ((this.POForm.value.warrenty == "") || (this.POForm.value.warrenty == null) || (this.POForm.value.warrenty == undefined)) {
      this.notification.showWarning("Please Fill Warrenty")
      this.clicked = false
      return false
    }
    if ((this.POForm.value.employee_id == "") || (this.POForm.value.employee_id == null) || (this.POForm.value.employee_id == undefined)) {
      this.notification.showWarning("Choose Approver")
      this.clicked = false
      return false
    }

    let totalDaysCheck = this.POForm.value.onacceptance + this.POForm.value.ondelivery + this.POForm.value.oninstallation
    if (totalDaysCheck != 100) {
      this.notification.showWarning('Days for On Acceptance, On Delivery, On Installation Must be equal to 100');
      this.clicked = false
      return false;
    }
    if (this.POForm.value.onacceptance == undefined || this.POForm.value.onacceptance == '' || this.POForm.value.onacceptance == null ) {
      this.POForm.value.onacceptance = 0
    }
    if (this.POForm.value.ondelivery == null || this.POForm.value.ondelivery == '' || this.POForm.value.ondelivery == undefined) {
      this.POForm.value.ondelivery = 0
    }
    if (this.POForm.value.oninstallation == null || this.POForm.value.oninstallation == '' || this.POForm.value.oninstallation == undefined) {
      this.POForm.value.oninstallation = 0
    }
    let datadetails = this.POForm.value.podetails
    console.log("datadetails",datadetails)
    let filesvaluedetail = this.files.value.file_upload
    for (let i in datadetails) {
      let amcdata = datadetails[i].amcvalue
      let delivaryperiod = datadetails[i].deliveryperiod
      // datadetails[i].product_name = datadetails[i].product_idCatlog
      // datadetails[i].item_name = datadetails[i].itemCatlog
      let indexNumber = Number(i)
      if ((amcdata == "") || (amcdata == undefined)) {
        // this.notification.showWarning("AMC% is not filled, Please check on line " + (indexNumber + 1))
        // this.clicked = false
        // return false
        datadetails[i].amcvalue = 0
      }
      if ((delivaryperiod == "") || (delivaryperiod == undefined)) {
        datadetails[i].deliveryperiod = 0
        // this.notification.showWarning("Delivery Period is not filled, Please check on line " + (indexNumber + 1))
        // this.clicked = false
        // return false
      }
    }
    if (this.POForm.value.supplierbranch_id.id == undefined) {
      this.POForm.value.supplierbranch_id = this.POForm.value.supplierbranch_id
    }
    else {
      this.POForm.value.supplierbranch_id = this.POForm.value.supplierbranch_id.id
    }
    if (this.POForm.value.branch_id.id == undefined) {
      this.POForm.value.branch_id = this.POForm.value.branch_id
    }
    else {
      this.POForm.value.branch_id = this.POForm.value.branch_id.id
    }
    if (this.POForm.value.employee_id.id == undefined) {
      this.POForm.value.employee_id = this.POForm.value.employee_id
    }
    else {
      this.POForm.value.employee_id = this.POForm.value.employee_id.id
    }
    if (this.POForm.value.terms_id.id == undefined) {
      this.POForm.value.terms_id = this.POForm.value.terms_id
    }
    else {
      this.POForm.value.terms_id = this.POForm.value.terms_id.id
    }
    // this.POForm.value.supplierbranch_id = this.POForm.value.supplierbranch_id.id
    // this.POForm.value.branch_id = this.POForm.value.branch_id.id
    // this.POForm.value.employee_id = this.POForm.value.employee_id.id
    // this.POForm.value.terms_id = this.POForm.value.terms_id.id
    // const currentDate = this.POForm.value.validfrom
    // let validfrom = this.datePipe.transform(currentDate.date, 'yyyy-MM-dd');
    this.POForm.value.validfrom = this.datePipe.transform(this.POForm.value.validfrom, 'yyyy-MM-dd');
    this.POForm.value.validto = this.datePipe.transform(this.POForm.value.validto, 'yyyy-MM-dd');
    let data = this.POForm.value
    let dataID = Object.assign({}, data, { "type": this.type.value })
    let filesvalue = this.files.value.file_upload
    let filesHeadervalue = this.filesHeader.value.file_upload
    this.formDataChange(dataID)
  }

  onCancelClick() {
    this.onCancel.emit()
  }

  ScrollTopFunction() {
    window.scrollTo(0, 0);
  }

  pdfSrc = "";

  // onFileSelected(e, j) {
  //   let datavalue = this.files.value.file_upload
  //   if (this.files.value.file_upload.length > j) {
  //     this.files.value.file_upload[j] = e.target.files[0]
  //   } else {
  //     for (var i = 0; i < e.target.files.length; i++) {
  //       // this.fileUpload.push(e.target.files[i]);
  //       this.files.value.file_upload.push(e.target.files[i])
  //       let checkvalue = this.files.value.file_upload
  //       console.log("checkvalue", checkvalue)
  //     }
  //   }
  //   console.log("this.files.value.file_upload", this.files.value.file_upload)
  // }

  autocompleteempScroll() {
    // setTimeout(() => {
    //   if (
    //     this.matempAutocomplete &&
    //     this.autocompleteTrigger &&
    //     this.matempAutocomplete.panel
    //   ) {
    //     fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
    //       .pipe(
    //         map(x => this.matempAutocomplete.panel.nativeElement.scrollTop),
    //         takeUntil(this.autocompleteTrigger.panelClosingActions)
    //       )
    //       .subscribe(x => {
    //         const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
    //         const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
    //         const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
    //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    //         if (atBottom) {
    //           if (this.has_next === true) {
    //             this.dataService.getemployeeFKdd(this.empInput.nativeElement.value, this.currentpage + 1)
    //               .subscribe((results: any[]) => {
    //                 let datas = results["data"];
    //                 let datapagination = results["pagination"];
    //                 this.employeeList = this.employeeList.concat(datas);
    //                 // console.log("emp", datas)
    //                 if (this.employeeList.length >= 0) {
    //                   this.has_next = datapagination.has_next;
    //                   this.has_previous = datapagination.has_previous;
    //                   this.currentpage = datapagination.index;
    //                 }
    //               })
    //           }
    //         }
    //       });
    //   }
    // });
  }

  public displayFnemp(emp?: Emplistss): string | undefined {
    // console.log('id', emp.id);
    // console.log('full_name', emp.full_name);
    return emp ? emp.full_name : undefined;
  }

  get emp() {
    return this.POForm.get('employee_id');
  }
  getemployeeForApprover() {
    let commodityID = this.POForm.value.commodity_id
    console.log("commodityID", commodityID)
    if (commodityID === "") {
      this.notification.showInfo("Please Select the Product to choose the Approver")
      return false
    }
    this.SpinnerService.show();
    this.dataService.getemployeeApproverforPO(commodityID)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        if (datas.length == 0) {
          this.SpinnerService.hide();
          this.notification.showInfo("No PR Approver is found against this Commodity")
          return false;
        }
        this.employeeList = datas;
        console.log("employeeList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  //unit price of product according to the supplier 
  gettingUnitPrice() {


    let supplieridvalue = this.POForm.value.supplierbranch_id.id

    let productidvalue = this.POForm.value.podetails

    if (this.type.value == 2) {
      // this.notification.showInfo("Please Select the Product")
      return false
    }
    for (let i in productidvalue) {
      console.log("productidvalue", productidvalue)
      let productID = productidvalue[i].product_id
      let catlogName = productidvalue[i].item

      console.log("productID", productID)

      console.log("catlogName", catlogName)

      this.SpinnerService.show();
      this.dataService.getunitPrice(productID, supplieridvalue, catlogName)
        .subscribe((results) => {
          this.SpinnerService.hide();
          let datas = results
          //let unitprice: FormControl = new FormControl(null);
          console.log("unit price", datas)
          //this.POForm.value.podetails[i].unitprice.setValue(datas.unitprice)
          this.POForm.get('podetails')['controls'][i].get('unitprice').setValue(datas.unitprice)
        },(error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })

      //return
    }

  }
  //getting product to get the supplier 
  gettingProductforSuplier() {

    let productdatainArray = this.POForm.value.podetails.map(x => x.product_id)
    let itemdatainArray = this.POForm.value.podetails.map(x => x.itemCatlog)
    let stringValue = ""
    if (stringValue in productdatainArray) { return false }
    if (productdatainArray.length == 0) {
      this.supplierList = []
      this.notification.showInfo("Please Select the Product to choose the Supplier")
      return false
    }
    let ProductForSupplierGet = {
      product: productdatainArray,
      dts: 0,
      catalog: itemdatainArray
    }
    console.log("supplierbranch_id", this.POForm.value.supplierbranch_id)

    this.POForm.get('supplierbranch_id').valueChanges
      .pipe(
        debounceTime(20),
      ).subscribe(value => {
        console.log("Hitted")
        this.SpinnerService.show();
        this.dataService.getsupplierProductmapping(ProductForSupplierGet, value)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.SpinnerService.hide();
            this.supplierList = datas;
            console.log("supplierList", datas)
          },(error) => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          })
      }
      )
    // console.log("ProductForSupplierGet", ProductForSupplierGet)
  }


  disablebutton = [true, true, true, true, true, true, true, true, true, true]
  eneblecheckbox(i, data) {
    this.qty.valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      console.log("should be called first")
      console.log("iiii index value for PO", i)
      this.disablebutton[i] = false;
    }
    )

  }

  ////////////////////////content editor
  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      link: [['link', ['linkDialogShow', 'unlink']]],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear',
          ],
        ],
      ],
    },
    height: '200px',
    // uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear',
        ],
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };

  editorDisabled = false;

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.POForm.get('notepad').value);
  }


  enableEditor() {
    this.editorDisabled = false;
  }

  disableEditor() {
    this.editorDisabled = true;
  }

  onBlur() {
    // console.log('Blur');
  }

  onDelete(file) {
    // console.log('Delete file', file.url);
  }

  summernoteInit(event) {
    // console.log(event);
  }

  omit_special_num(event) {
    var k;
    k = event.charCode;
    return ((k == 190) || (k >= 48 && k <= 57));
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






  getCatlog_NonCatlogList: any
  getCatlog_NonCatlog() {
    this.SpinnerService.show();
    this.dataService.getCatlog_NonCatlog()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        this.getCatlog_NonCatlogList = datas;
        console.log("getCatlog_NonCatlog", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  onFileSelectedHeader(e) {
    let datavalue = this.filesHeader.value.file_upload
    // this.filesHeader.value.file_upload.push(e.target.files)
    // let checkvalue = this.filesHeader.value.file_upload
    // console.log("checkvalue", checkvalue)
    for (var i = 0; i < e.target.files.length; i++) {
      // this.fileUpload.push(e.target.files[i]);
      this.filesHeader.value.file_upload.push(e.target.files[i])
      let checkvalue = this.filesHeader.value.file_upload
      console.log("checkvalue", checkvalue)
    }


  }

  HeaderFilesDelete() {
    let checkvalue = this.filesHeader.value.file_upload

    for (let i in checkvalue) {
      checkvalue.splice(i)
    }


    console.log("checkvalue", checkvalue)
    this.InputVar.nativeElement.value = "";
    console.log("checkvalue", checkvalue)
  }

  employeeCode: any
  employeeLimit: any
  empValues(data) {
    this.employeeCode = data.code
    this.employeeLimit = data.limit
  }

  public displayFncommodity(commodity?: commoditylistss): string | undefined {
    return commodity ? commodity.name : undefined;
  }
  getCommodityFK() {
    this.SpinnerService.show();
    this.dataService.getcommoditydd()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        this.commodityList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  currentpagecom = 1
  has_nextcom = true;
  has_previouscom = true;
  autocompletecommodityScroll() {
    setTimeout(() => {
      if (
        this.matcommodityAutocomplete &&
        this.autocompleteTrigger &&
        this.matcommodityAutocomplete.panel
      ) {
        fromEvent(this.matcommodityAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcommodityAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcommodityAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcommodityAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcommodityAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom === true) {
                this.dataService.getcommodityFKdd(this.commodityInput.nativeElement.value, this.currentpagecom + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.commodityList = this.commodityList.concat(datas);
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






  currentpagesupplier = 1
  has_nextsupplier = true;
  has_previoussupplier = true;
  autocompletesuppliersearchScroll() {
    setTimeout(() => {
      if (
        this.matsuppliersearchAutocomplete &&
        this.autocompleteTrigger &&
        this.matsuppliersearchAutocomplete.panel
      ) {
        fromEvent(this.matsuppliersearchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsuppliersearchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsuppliersearchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsuppliersearchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsuppliersearchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextsupplier === true) {
                this.dataService.getsupplierDropdownFKdd(this.suppliersearchInput.nativeElement.value, this.currentpagesupplier + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.suppliersearchList = this.suppliersearchList.concat(datas);
                    if (this.suppliersearchList.length >= 0) {
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

  public displayFnsuppliersearch(supplier?: supplierlistsearch): any | undefined {
    return supplier ? supplier.name : undefined;
  }

  getSuppliersearch() {
    this.SpinnerService.show();
    this.dataService.getsupplierDropdown()
      .subscribe((results: any[]) => {
        let datas = results["data"]
        this.SpinnerService.hide();
        this.suppliersearchList = datas;
        console.log("suppliersearchList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  FileDataArray = []
  FileDataArrayIndex = []
  onFileSelected(e, j) {
    let datavalue = this.files.value.file_upload
    this.FileDataArray[j] = e.target.files[0]
    this.FileDataArrayIndex[j] = j
    console.log("this.FilesDataArray", this.FileDataArray)
    console.log("this.FilesDataArrayIndex", this.FileDataArrayIndex)
  }

  formDataChange(dataPO) {
    console.log("fdataPO", dataPO)
    const formData: FormData = new FormData();
    let formdataIndex = this.FileDataArrayIndex
    let formdataValue = this.FileDataArray
    console.log("formdataIndex  after", formdataIndex)
    console.log("formdataValue  after", formdataValue)
    for (let i = 0; i < formdataValue.length; i++) {
      let keyvalue = 'file_key' + formdataIndex[i];
      let pairValue = formdataValue[i];
      if (formdataValue[i] == "") {
        console.log("")
      } else {
        formData.append(keyvalue, pairValue)
      }
    }
    let POFormData = this.POForm.value.podetails

    for (let filekeyToinsert in formdataIndex) {
      let datakey = "file_key" + filekeyToinsert
      console.log("datakey", datakey)
      POFormData[filekeyToinsert].file_key = datakey
    }
    let HeaderFilesdata = this.filesHeader.value.file_upload
    for (var i = 0; i < HeaderFilesdata.length; i++) {
      let keyvalue = 'fileheader'
      let pairValue = HeaderFilesdata[i];

      if (HeaderFilesdata[i] == "") {
        console.log("")
      } else {
        formData.append(keyvalue, pairValue)
      }
    }
    let datavalue = JSON.stringify(dataPO)
    formData.append('data', datavalue);
    this.SpinnerService.show();
    this.dataService.POCreateForm(formData)
      .subscribe(res => {
        this.SpinnerService.hide();
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("[INVALID_DATA! ...]")
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate Data! ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
        }
        else {
          this.notification.showSuccess("Successfully created!...")
          this.onSubmit.emit();
        }
        console.log("pomaker Form SUBMIT", res)
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


  }





  empBranchdata: any
  getEmployeeBranchData() {
    this.SpinnerService.show();
    this.dataService.getEmpBranchId()
      .subscribe((results: any) => {
        this.SpinnerService.hide();
        if (results.error) {
          this.SpinnerService.hide();
          this.notification.showWarning(results.error + results.description)
          this.POForm.controls["branch_id"].reset("");
          return false
        }
        let datas = results;
        this.empBranchdata = datas;
        console.log("empBranchdata", datas)
        this.POForm.patchValue({
          branch_id: this.empBranchdata
        })
        console.log(this.POForm.value)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }




  onChangeAMCandDelivaryPeriod(event){

    let lengthofPOformDetails = this.POForm.value.podetails.length 
    // console.log("change event", event)
    // console.log("change detection")

    // if(lengthofPOformDetails > 1){
    //   for(let i=1; i<=lengthofPOformDetails; i++ ){
    //     console.log("indexx on for loop", i)
    //     if( type == 'amc' ){
    //       this.POForm.get('podetails')['controls'][i].get('amcvalue').setValue()
    //     }
    //     if( type == 'delivaryperiod' ){
    //       this.POForm.get('podetails')['controls'][i].get('deliveryperiod').setValue()
    //     }
    //   }
    // }

  }

  changeValueAmcDelivaryPeriod(value, index, type){

    console.log("value", value)
    console.log("change index", index)
    let lengthofPOformDetails = this.POForm.value.podetails.length 

    if(lengthofPOformDetails > 1 && index == 0){
      for(let i=1; i<lengthofPOformDetails; i++ ){
        console.log("indexx on for loop", i)
        if( type == 'amc' ){
          this.POForm.get('podetails')['controls'][i].get('amcvalue').setValue(value)
        }
        if( type == 'delivaryperiod' ){
          this.POForm.get('podetails')['controls'][i].get('deliveryperiod').setValue(value)
        }
      }
    }

  }














}
