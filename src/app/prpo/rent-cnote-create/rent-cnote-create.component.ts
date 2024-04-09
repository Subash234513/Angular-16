import { Component, ComponentFactoryResolver, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

export interface branchcodeLists {
  name: string;
  code: string;
  id: number;
}
export interface SupplierName {
  id: number;
  name: string;
}
export interface supplierlistsearch {
  id: string;
  name: string;
}
export interface branchlistss {
  id: any;
  name: string;
  code: string;
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

@Component({
  selector: 'app-rent-cnote-create',
  templateUrl: './rent-cnote-create.component.html',
  styleUrls: ['./rent-cnote-create.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class RentCNoteCreateComponent implements OnInit {
  RcnSearchForm: FormGroup;
  RcnCreateForm: FormGroup;
  remsHitform: FormGroup;
  fileData: File = null;
  rcnList: Array<any>;
  presentpagegrninward: number = 1;
  currentepagegrninward: number = 1;
  has_nextgrninward = true;
  has_previousgrninward = true;
  pageSizegrninward = 10;
  grninwardpage: boolean = true;
  grninwardsummary: any;
  isLoading: boolean;
  qty = new FormControl(0);
  tomorrow = new Date();
  idValue: any;
  fileName: any;
  grndetails: Array<any> = [];
  isDisabled = true;

  isDisabledcheckbox = false
  branchNameData: Array<branchcodeLists>;
  BranchName: string;
  clicked = true;

  headerIDRCN: any
  successdata: any[] = [];
  isDisabledslidebar = false
  @ViewChild('name') supplier_names;
  @ViewChild(FormGroupDirective) fromGroupDirective: FormGroupDirective
  @ViewChild('autoPrimary') matAutocompleteDept: MatAutocomplete;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  suppliersearchList: Array<supplierlistsearch>;
  @ViewChild('suppliersearch') matsuppliersearchAutocomplete: MatAutocomplete;
  @ViewChild('suppliersearchInput') suppliersearchInput: any;
  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  branchList: Array<branchlistss>;
  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private dataService: PRPOSERVICEService,
    private prposhareService: PRPOshareService, private notification: NotificationService, private toastr: ToastrService, private datePipe: DatePipe,  private SpinnerService: NgxSpinnerService,private errorHandler: ErrorHandlingServiceService) { }
  ngOnInit(): void {
    this.RcnSearchForm = this.fb.group({
      pono: [''],
      suppliername: [''],
      branchcode: [''],
    })
    this.RcnCreateForm = this.fb.group({
      dcnote: ["RCN999"],
      invoiceno: [''],
      date: [''],
      remarks: [''],
      fileData: [''],
      paymodedetails_id: null,
      grndetails: new FormArray([
      ]),
    })

    // let branchcode: String = "";
    // this.getbranchname(branchcode);
    // this.RcnSearchForm.get('branchcode').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.dataService.getbranchname(value)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.branchNameData = datas;
    //   })


    this.remsHitform = this.fb.group({
      po_number: '',
      type: '',
      status: '',
      date: ''
    })
    //this.getgrnclose();
    this.Holdform = this.fb.group({
      poheader_id: '',
      remarks: ''
    })
    this.getPaymodetype();

    this.RcnSearchForm.get('branchcode').valueChanges
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

    this.RcnSearchForm.get('suppliername').valueChanges
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

      this.getbranchFK();
  }
  //-------------------------------------------------------



  //////////////////////////////////////////////////////////////////////////////////////////////////////////   display branch data and get
  displayFns(branch?: any) {
    let a = branch ? this.branchNameData.find(_ => _.name === branch).code : undefined;
    let b = branch ? this.branchNameData.find(_ => _.name === branch).name : undefined;
    return branch ? a + "--" + b : undefined;
  }
  get branchName() {
    return this.RcnSearchForm.get('branchcode');
  }
  getbranchname(bankname) {
    this.SpinnerService.show();
    this.dataService.getbranch(bankname)
      .subscribe((results) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.branchNameData = datas;
        console.log("this.branchNameData", this.branchNameData)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  //////////////////////////////////////////////////////////////////////////////////////////////////Form controlfor arraaaaaay
  grnindet() {
    let group = new FormGroup({
      podetails_id: new FormControl(''),
      poheader_id: new FormControl(''),
      product_id: new FormControl(''),
      quantity: new FormControl(0),
      uom: new FormControl(''),
      unitprice: new FormControl(''),
      amount: new FormControl(''),
      taxamount: new FormControl(''),
      totalamount: new FormControl(''),
      // isremoved: new FormControl(''),
      remarks: new FormControl(''),
      podelivery_id: new FormControl(''),
      date: new FormControl(''),
      qty: new FormControl(''),
      grnflag: new FormControl(''),
    })
    return group
  }




  //////////////////////////////////////////////////////////////////////////////////////////////////////////////// Rcn summary
  GRNCreateEditForm(pageNumber = 1, pageSize = 10) {
    let searchgrninward = this.RcnSearchForm.value;
    // searchgrninward.branchcode = this.RcnSearchForm.value.branchcode.id
    // searchgrninward.suppliername = this.RcnSearchForm.value.suppliername.id

    // searchgrninward.suppliername = this.rcnreleaseSearchForm.value.suppliername.id
    if ( searchgrninward.suppliername?.id == undefined ){
      searchgrninward.suppliername = searchgrninward.suppliername
    }else{
      searchgrninward.suppliername = searchgrninward.suppliername.id
    }
    // searchgrninward.branchcode = this.rcnreleaseSearchForm.value.branchcode.id
    if ( searchgrninward.branchcode?.id == undefined ){
      searchgrninward.branchcode = searchgrninward.branchcode
    }else{
      searchgrninward.branchcode = searchgrninward.branchcode.id
    }

    for (let i in searchgrninward) {
      if (searchgrninward[i] == null || searchgrninward[i] == "" || searchgrninward[i] == undefined) {
        delete searchgrninward[i];
      }
    }
    this.SpinnerService.show();
    this.dataService.getrcncreatesummarySearch(searchgrninward, pageNumber, pageSize)
      .subscribe(result => {
        this.SpinnerService.hide();
        this.rcnList = result['data']
        let datapagination = result["pagination"];
        if (this.rcnList.length > 0) {
          this.SpinnerService.hide();
          this.has_nextgrninward = datapagination.has_next;
          this.has_previousgrninward = datapagination.has_previous;
          this.presentpagegrninward = datapagination.index;
          this.grninwardpage = true
        }

        if (result) {
          this.SpinnerService.hide();
          if (this.RcnCreateForm.value.grndetails.length > 0) { this.UpdatingWhenUsingPagination() }
        }
        return this.rcnList.map(row => {
          return Object.assign({}, row, { fieldtext: false, CheckboxenableDiableArray: false, disabled: false });
        });

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


  }
  nextClickgrninward() {
    if (this.has_nextgrninward === true) {
      this.currentepagegrninward = this.presentpagegrninward + 1
      this.GRNCreateEditForm(this.presentpagegrninward + 1)
      this.qty.reset(0)
    }
  }
  previousClickgrninward() {
    if (this.has_previousgrninward === true) {
      this.currentepagegrninward = this.presentpagegrninward - 1
      this.GRNCreateEditForm(this.presentpagegrninward - 1)
      this.qty.reset(0)
    }
  }






  ///////////////////////////////////////////////////////////////////////////////////////////////////////// File process

  fileProgress(fileInput: any) {
    this.fileData = fileInput.target.files;
    this.fileName = this.fileData[0].name;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////// disable check box
  plusfunction(data) {
    this.isDisabledcheckbox = false
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////reset function
  dataclearinwardform() {
    this.RcnSearchForm.controls['pono'].reset("")
    this.RcnSearchForm.controls['suppliername'].reset("")
    this.RcnSearchForm.controls['branchcode'].reset("")
    this.GRNCreateEditForm();
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////omit special characters
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57));
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  only_numalpha(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }





  /////////////////////////////////////////////////////////////////paaaaymode checkbox enable disable null function

  ispaymode: boolean
  public savePaymode: boolean;
  paymodeTypeList: any
  LandlordInfoList: any
  public onSavePaymodeChanged(value: boolean) {
    this.savePaymode = value;
    console.log(this.savePaymode)
    if (this.savePaymode === true) {
      this.ispaymode = true
    } else {
      this.ispaymode = false
      this.RcnCreateForm.controls['paymodedetails_id'].reset(null)
    }
  }


  ////////////////////////////////////////////////////// Paymode drop down

  getPaymodetype() {
    this.SpinnerService.show();
    this.dataService.getPaymodetype()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.paymodeTypeList = datas;
        console.log("paymodeTypeList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  ////////////////////////////////////////////////////////////////////////////////////////// Land lord deatilssss


  getLandlordInfo(data) {
    let branchIDforSupplierInfo = data.poheader_id.supplierbranch_id.id
    console.log("branchIDforSupplierInfo", branchIDforSupplierInfo)
    this.SpinnerService.show();
    this.dataService.getLandlordInfo(branchIDforSupplierInfo)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.LandlordInfoList = datas;
        console.log("LandlordInfoList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }




  /////cancel part



  onCancelClick() {
    // this.router.navigate(['/prmaster'], { skipLocationChange: true })
    this.onCancel.emit()
  }





  ///////////////////////////////////////////////////////////////////////////HOld data for patch

  ROHeader: any
  RObranchCode: any
  ROSupplierCode: any
  ROSupplierName: any
  ROBranchName: any
  RoType: any
  RoAmount: any
  Holdform: FormGroup

  holddata(data) {
    this.ROHeader = data.poheader_id.no
    this.RObranchCode = data.prpoqty_id.prccbs_id.branch_id.code
    this.ROBranchName = data.prpoqty_id.prccbs_id.branch_id.name
    this.ROSupplierCode = data.poheader_id.supplierbranch_id.code
    this.ROSupplierName = data.poheader_id.supplierbranch_id.name
    this.RoType = data.podetails_id.product_name
    this.RoAmount = data.qty - data.received_quantity

    this.Holdform.patchValue({
      poheader_id: data.poheader_id.id
    })
  }


  //////////////////////////////////////////////////////////////hold function submit
  HoldRoSubmit() {
    const data = this.Holdform.value;
    this.SpinnerService.show();
    this.dataService.RoHold(data)
      .subscribe(results => {
        this.SpinnerService.hide();
        this.notification.showSuccess("Successfully Put on Hold!...")
        this.GRNCreateEditForm();
        this.onSubmit.emit();
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  ////////////////////////////////////////////////////////////////////////////////////////// bank tax subtax validation
  getBankGstTaxSubtaxValidation(data, event) {
    if (event.target.checked) {
      let supplier_id = data.poheader_id.supplierbranch_id.id
      this.SpinnerService.show();
      this.dataService.getBankGstTaxSubtaxValidation(supplier_id)
        .subscribe((results: any[]) => {
          this.SpinnerService.hide();
          // if( results["data"] === ["Tax  and subtax and bank id prsent"]  ){
          if (results["data"][0] == "All Details Found") {
            this.SpinnerService.hide();
            // console.log(" validation ", results)
            // console.log(" validation 1 ", results["data"])
            //this.notification.showInfo(results['data'])
            //  this.clicked = false;
            return true
          }
          else {
            this.SpinnerService.hide();
            this.notification.showWarning(results['data'])
            this.clicked = true;
          }
        }
        ,(error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////    create part
  getFormArray(): FormArray {
    return this.RcnCreateForm.get('grndetails') as FormArray;
  }
  getdatagrn(e, data, indexOfSelectedRow, qtyinput) {
    console.log(" rcn list after check ", this.rcnList)
    this.clicked = false;
    let remainingvalue = data.qty - data.received_quantity
    if (this.RcnCreateForm.value.grndetails.length >= 1) {
      this.clicked = true;
    }
    // if (qtyinput === "0" || qtyinput > remainingvalue) {
    //   e.preventDefault();
    //   e.stopPropagation();
    //   this.clicked = true;
    //   this.notification.showError('Please check Net Payable Amount')
    //   return false
    // }
    let podetails_id: FormControl = new FormControl('');
    let poheader_id: FormControl = new FormControl('');
    let product_id: FormControl = new FormControl('');
    let quantity: FormControl = new FormControl('');
    let uom: FormControl = new FormControl('');
    let unitprice: FormControl = new FormControl('');
    let amount: FormControl = new FormControl('');
    let taxamount: FormControl = new FormControl('');
    let totalamount: FormControl = new FormControl('');
    //let isremoved: FormControl = new FormControl('');
    let branch_id: FormControl = new FormControl('');
    let remarks: FormControl = new FormControl('');
    let podelivery_id: FormControl = new FormControl('');
    let date: FormControl = new FormControl('');
    let grnflag: FormControl = new FormControl('');
    podetails_id.setValue(data.podetails_id.id)
    poheader_id.setValue(data.poheader_id.id)
    product_id.setValue(data.podetails_id.product_name)
    quantity.setValue(qtyinput)
    uom.setValue(data.podetails_id.uom)
    unitprice.setValue(data.podetails_id.unitprice)
    amount.setValue(data.poheader_id.amount)
    taxamount.setValue(data.podetails_id.taxamount)
    totalamount.setValue(data.podetails_id.totalamount)
    //isremoved.setValue(data.isremoved)
    branch_id.setValue(data.poheader_id.branch_id.id)
    // remarks.setValue(data.poheader.supplierbranch_id.remarks)
    podelivery_id.setValue(data.id)
    date.setValue(data.poheader_id.date)
    // grnflag.setValue(data.prpoqty_id.prdetails_id.prheader_id.flag)
    grnflag.setValue(data.poheader_id.flag)
    if (e.target.checked) {
      this.isDisabledslidebar = true
      this.getFormArray().push(new FormGroup({
        podetails_id: podetails_id,
        poheader_id: poheader_id,
        product_id: product_id,
        quantity: quantity,
        uom: uom,
        unitprice: unitprice,
        amount: amount,
        taxamount: taxamount,
        totalamount: totalamount,
        // isremoved: isremoved,
        branch_id: branch_id,
        remarks: remarks,
        podelivery_id: podelivery_id,
        date: date,
        grnflag: grnflag
      }))
      console.log(" rcn lst of data while disable", this.rcnList)
      this.rcnList.forEach((row, index) => {
        if (row.id == data.id) {
          row.fieldtext = true
        }
        // else {
        if (indexOfSelectedRow != index) {
          row.disabled = true;
        }
        //row.disabled = true;
        // }
      });
    }
    else {
      this.isDisabledslidebar = false
      this.removeSection(this.getFormArray())
    }
  }
  ///////////////////////////////////////////////////////////////////////////////// remove section
  addSection() {
    const control = <FormArray>this.RcnCreateForm.get('grndetails');
  }
  removeSection(i) {
    // const control = <FormArray>this.RcnCreateForm.get('grndetails');
    // control.removeAt(i);


    let dataremovevaluecheck = this.RcnCreateForm.value
    console.log("dataremovevaluecheck", dataremovevaluecheck)
    let dataremove = this.RcnCreateForm.value.grndetails
    console.log("grndetailsdeletepoints", dataremove)
    let index = -1;
    let val = i.id
    console.log(" value to compare for delete", val)
    let filteredObj = dataremove.find(function (item, ival) {
      console.log(" value to compare for delete in gendetails array", item.podelivery_id)
      if (item.podelivery_id === val) {
        index = ival;
        return ival;
      }
    });

    const control = <FormArray>this.RcnCreateForm.get('grndetails');
    control.removeAt(index);
    this.rcnList.forEach((row, index) => {
      if (this.RcnCreateForm.value.grndetails.length === 0) {
        row.disabled = false;
        row.fieldtext = false
      }
      // if (row.id == val) {
      //   row.fieldtext = false
      // }
    });
  }
  //////////////////////////////////////////////////////////////enable disable function but not in use
  disablebutton = [true, true, true, true, true, true, true, true, true, true]
  eneblecheckbox(i, data) {
    this.qty.valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      this.disablebutton[i] = false;
    }
    )
  }

////////////////////////////////////////////////////////////////////////////approve and reject part
  nameForApproveOrReject: any
  approveNameclick() {
    // this.nameForApproveOrReject = 'APPROVE'
    let ApproveOrReject = 'APPROVE'
    // console.log("Approver click name", this.nameForApproveOrReject)
    this.RCNNCreateFormSubmit(ApproveOrReject);
  }
  RejectNameclick() {
    // this.nameForApproveOrReject = 'REJECT'
    let ApproveOrReject = 'REJECT'
    // console.log("Reject click name", this.nameForApproveOrReject)
    this.RCNNCreateFormSubmit(ApproveOrReject);
  }

  RCNNCreateFormSubmit(ApproveOrRejectKey) {
    console.log("ApproveOrRejectKey click name", ApproveOrRejectKey)
    this.RcnCreateForm.value.remarks = this.RcnCreateForm.value.remarks.trim()
    this.RcnCreateForm.value.invoiceno = this.RcnCreateForm.value.invoiceno.trim()
    if (this.RcnCreateForm.value.invoiceno === "") {
      this.toastr.warning('', 'Please Enter  Invoiceno', { timeOut: 1500 });
      return false;
    }
    if (this.RcnCreateForm.value.date === "") {
      this.toastr.warning('', 'Please Enter Date', { timeOut: 1500 });
      return false;
    }
    if (this.RcnCreateForm.value.remarks === "") {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    }
    if (this.RcnCreateForm.value.fileData === "") {
      this.toastr.warning('', 'Please Choose File', { timeOut: 1500 });
      return false;
    }
    if (this.RcnCreateForm.value.grndetails.length === 0) {
      this.toastr.warning('', 'Please Choose Net Payable Amount', { timeOut: 1500 });
      return false;
    }
    const currentDate = this.RcnCreateForm.value
    currentDate.date = this.datePipe.transform(currentDate.date, 'yyyy-MM-dd');
    this.clicked = true;
    let RCNValue = this.RcnCreateForm.value
    if (this.idValue == undefined) {
      let dataValue = Object.assign({}, RCNValue, { "action": ApproveOrRejectKey })
      this.SpinnerService.show();
      this.dataService.rcnCreateForm(dataValue, '', this.fileData)
        .subscribe(result => {
          this.SpinnerService.hide();
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.SpinnerService.hide();
            this.notification.showError("INVALD DATA!")
            this.clicked = false;
          }
          if (result.code ===  "INVALID_FILETYPE" && result.description ===  "Invalid Filetype" ) {
            this.SpinnerService.hide();
            this.notification.showError("Please Check the File Format")
            this.clicked = false;
          }
          if (result.rentamount) {
            this.SpinnerService.hide();
            this.notification.showError("Remaining Amount is " + result.rentamount + " Please Check the Approved Amount or Clear the Pending Amount")
            this.clicked = false;
          }
          if (result.rentamount === 0) {
            this.SpinnerService.hide();
            this.notification.showError("Remaining Amount is " + result.rentamount + " Please Check the Approved Amount or Clear the Pending Amount")
            this.clicked = false;
          }
          if (result.id) {
            this.SpinnerService.hide();
            this.headerIDRCN = result.inwardheader_id
            this.rcnDetailID = result.id
            // console.log("this.headerIDRCN", this.headerIDRCN)
            // console.log("this.rcnDetailID", this.rcnDetailID)
            this.clicked = true;
            this.getflag()
            if (ApproveOrRejectKey == 'APPROVE') {
              this.SpinnerService.hide();
              this.notification.showSuccess("Successfully Approved!...")
            }
            if (ApproveOrRejectKey == 'REJECT') {
              this.SpinnerService.hide();
              this.notification.showError("Successfully Rejected!...")
            }
            // if (this.nameForApproveOrReject == 'Approved') {
            //   this.approveclick()
            // }
            // if (this.nameForApproveOrReject == 'Rejected') {
            //   this.rejectclick()
            // }
            // this.fromGroupDirective.resetForm()
          }
        },(error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }
  }


  ///////////////////////////////////////////////////////////////////////////////////////// approve submit

  approveclick() {
    //this.RCNNCreateFormSubmit();
    let data = this.headerIDRCN
    let dataToPass = {
      "id": this.headerIDRCN,
      "remarks": this.RcnCreateForm.value.remarks
    }
    console.log(dataToPass)
    this.SpinnerService.show();
    this.dataService.getrcnapproval(dataToPass)
      .subscribe(results => {
        this.SpinnerService.hide();
        this.getflag()
        this.notification.showSuccess("Successfully Approved!...")
        //this.router.navigate(['/rcn'], { skipLocationChange: true });
        //console.log("closed", results)
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////// reject submit

  rejectclick() {
    //this.RCNNCreateFormSubmit();
    let data = this.headerIDRCN
    let dataToPass = {
      "id": this.headerIDRCN,
      "remarks":  this.RcnCreateForm.value.remarks
    }
    this.SpinnerService.show();
    this.dataService.getrcnrejectdata(dataToPass)
      .subscribe(results => {
        this.SpinnerService.hide();
        this.getflag()
        this.notification.showSuccess("Successfully Rejected!...")
        //this.router.navigate(['/rcn'], { skipLocationChange: true });
        //console.log("closed", results)
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  /////////////////////////////////////////////////////////////////////////////////////////// getting flag for rems
  grnclosedataList: any
  grnno: any
  inwardid: any
  dcno: any
  recdate: any
  suppliername: any
  invoiceno: any
  remarks: any
  flagdetailsarray: any
  remspostjson: any
  rcnDetailID: any
  getflag() {
    let data: any = this.rcnDetailID
    this.SpinnerService.show();
    this.dataService.grnflag(data)
      .subscribe(results => {
        this.SpinnerService.hide();
        this.flagdetailsarray = results
        const data = this.remsHitform.value;
        data.po_number = this.flagdetailsarray.poheader_id.no
        data.type = this.flagdetailsarray.type
        data.status = this.flagdetailsarray.inwardheader.grn_status
        data.date = this.flagdetailsarray.inwardheader.date
        this.remspostjson = data
        if (this.flagdetailsarray.flag === "R") {
        this.SpinnerService.hide();
          this.remspost()
        }
        // else {
        //   this.router.navigate(['/rcn'], { skipLocationChange: true });
        // }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////posting data to rems
  remspost() {
    this.remspostjson.date = this.datePipe.transform(this.remspostjson.date, 'yyyy-MM-dd');
    this.SpinnerService.show();
    this.dataService.rcnupdate(this.remspostjson)
      .subscribe(results => {
        this.SpinnerService.hide();
        //this.router.navigate(['/rcn'], { skipLocationChange: true });
        this.onSubmit.emit();
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  UpdatingWhenUsingPagination() {
    let dataarray = this.RcnCreateForm.value.grndetails

    let aValueToCheckAndPatch = this.rcnList
    for (let datapatchcheck in aValueToCheckAndPatch) {
      let filteredObj = dataarray.find(function (item, ival) {
        if (item.podelivery_id === aValueToCheckAndPatch[datapatchcheck].id) {
          aValueToCheckAndPatch[datapatchcheck].qtyfield = +item.quantity
          aValueToCheckAndPatch[datapatchcheck].CheckboxenableDiableArray = true
        }
      });
    }
    this.rcnList.forEach((row, index) => {
      let headerGrn = this.RcnCreateForm.value
      let dataarray = this.RcnCreateForm.value.grndetails
      dataarray.forEach((rowarray, index) => {
        if (rowarray.podelivery_id == row.id) {
          row.fieldtext = true
          row.disabled = false;
        }
        else {
          row.disabled = true;
        }
      })
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
        this.SpinnerService.hide();
          let datas = results["data"]
          this.suppliersearchList = datas;
          console.log("suppliersearchList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }




  public displayFnbranch(branch?: branchlistss): any | undefined {
    return branch ? branch.code + "-" + branch.name : undefined;
  }



  getbranchFK() {
    this.SpinnerService.show();
    this.dataService.getbranchdd()
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