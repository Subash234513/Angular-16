import { Component, ComponentFactoryResolver, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, FormControl, FormArray, FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';

import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
  selector: 'app-grn-inward-createeditdelete',
  templateUrl: './grn-inward-createeditdelete.component.html',
  styleUrls: ['./grn-inward-createeditdelete.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})

export class GrnInwardCreateeditdeleteComponent implements OnInit {
  @ViewChild('mytemplate') tmpref:TemplateRef<any>;
  GRNForm: FormGroup;
  GRNForm2: FormGroup;
  GrnAssestForm: any;
  SelectSupplierForm: FormGroup;
  supplierchooseForm: FormGroup;
  fileData: File = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  grninwardList: Array<any>;
  presentpagegrninward: number = 1;
  currentepagegrninward: number = 1;
  has_nextgrninward = true;
  has_previousgrninward = true;
  pageSizegrninward = 10;
  grninwardpage: boolean = true;
  grninwardsummary: any;
  supplierNameData: any;
  isLoading: boolean;
  qty = new FormControl('');
  SupplierName: string;
  SupplierCode: string;
  SupplierGSTNumber: string;
  SupplierPANNumber: string;
  Address: string;
  City: string;
  idValue: any;
  tomorrow = new Date();
  selectsupplierlist: any;
  fileName: any;
  grndetails: Array<any> = [];
  addassetbutton: boolean = false;
  isDisabled = true
  suplierids = [];
  supp: any;
  line1: any;
  line2: any;
  line3: any;
  // isDisabledcheckbox = [true, true, true, true, true, true, true, true, true, true]
  // quantitycount: number;
  inputSUPPLIERValue = "";
  inputSUPPLIERValueID = "";
  branchNameData: any;
  // BranchName: string;
  suplist: any;
  // assetdatas: boolean = false
  // JsonArray = []
  // supparrayid: any;
  default = true
  alternate = false
  successdata: any[] = [];
  inputDCValue = "";
  inputINVValue = "";
  // isDisabledslidebar = [false, false, false, false, false, false, false, false, false, false]
  currentPage: number = 1;
  // equaldata: any;
  // check: boolean;
  // summarylist: any;
  // validationdata: any;
  // validationdat: any;
  // validationda: any;
  // condition: any;
  // Disabletext = false
  // Defaulttext = true
  fromdate: any;
  todate: any;
  // isCheckBox = true;
  // quantity: any;
  // un used lines------
  // defaulttext = true
  // alternatetext = false
  // isDisabledslidebars: boolean
  // sss: any
  //-ends here --------
  // equaldataid: any;
  // validationid: any;
  // elsevalidation: any;
  issubmit = false
  // testQty: any;
  // testArray = []
  // summaryid = []
  // pushdataid: any;
  // spid: Array<any>
  // pid: any;
  // qtyValues: any;
  // defa = [true, true, true, true, true, true, true, true, true, true]
  // alter = [false, false, false, false, false, false, false, false, false, false]
  // checker = [true, true, true, true, true, true, true, true, true, true]


  clicked = true;
  @ViewChild('name') supplier_names;
  @ViewChild(FormGroupDirective) fromGroupDirective: FormGroupDirective
 
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  popup: number = 1;
  itemsPerPage = 10;
  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private dataService: PRPOSERVICEService,public dialog: MatDialog,
    private prposhareService: PRPOshareService, private notification: NotificationService, private toastr: ToastrService, private datePipe: DatePipe, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService) { }

  ngOnInit(): void {
    this.GRNForm = this.fb.group({
      pono: [''],
      prno: [''],
      suppliername: [''],
      branchcode: [''],
    })

    this.SelectSupplierForm = this.fb.group({
      gstno: [''],
      code: [''],
      panno: [''],
      name: ['']
    })
    this.GRNForm2 = this.fb.group({
      dcnote: [''],
      invoiceno: [''],
      date: [''],
      remarks: [''],
      file_key:[["file1"]],
      fileData: [''],
      suppliername: [''],
      locations: [''],
      grndetails: new FormArray([
      ]),
    })
    this.GrnAssestForm = this.fb.group({
      // assestserial_no: '',
      // assest_manufacturer: [''],
      // asseststart_date: '',
      // assestend_date: '',
      // isassest: '',

      assetitems: new FormArray([])





    })
    let suppliername: String = "";
    this.getsuppliername(this.suplist, suppliername);
    this.SelectSupplierForm.get('name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getsuppliername(this.suplist, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierNameData = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    let branchcode: String = "";
    this.getbranchname(branchcode);
    this.GRNForm.get('branchcode').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbranchname(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchNameData = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    this.getsuppliername(this.suplist, "");
  }

  //-------------------------------------------------------
  public displaytest(SupplierName?: SupplierName): string | undefined {
    return SupplierName ? SupplierName.name : undefined;
  }
  //--------------------------------------------------------

  public displayFn(SupplierName?: SupplierName): string | undefined {
    return SupplierName ? SupplierName.name : undefined;
  }

  get supplierName() {
    return this.SelectSupplierForm.get('name');
  }

  getsuppliername(id, suppliername) {
    this.SpinnerService.show();
    this.dataService.getsuppliername(id, suppliername)
      .subscribe((results) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.supplierNameData = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  public displayFns(BranchName?: branchcodeLists): string | undefined {
    let code = BranchName ? BranchName.code : undefined;
    let name = BranchName ? BranchName.name : undefined;
    return BranchName ? code + "-" + name : undefined;

  }
  get branchName() {
    return this.GRNForm.get('branchcode');
  }
  getbranchname(bankname) {
    this.SpinnerService.show();
    this.dataService.getbranchname(bankname)
      .subscribe((results) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.branchNameData = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  grnindet() {
    let group = new FormGroup({
      podetails_id: new FormControl(''),
      poheader_id: new FormControl(''),
      product_id: new FormControl(''),
      quantity: new FormControl(''),
      uom: new FormControl(''),
      unitprice: new FormControl(''),
      amount: new FormControl(''),
      taxamount: new FormControl(''),
      totalamount: new FormControl(''),
      isremoved: new FormControl(''),
      remarks: new FormControl(''),
      podelivery_id: new FormControl(''),
      date: new FormControl(''),
      qty: new FormControl(''),
      grnflag: new FormControl(''),
      branch_id: new FormControl(''),
    })
    return group
  }
  ///////////////add row in details
  addSection() {
    const control = <FormArray>this.GRNForm2.get('grndetails');
    control.push(this.grnindet());
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
    // return ((k > 96 && k < 123) || (k >= 48 && k <= 57));
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  getgrnView(data) {
    this.dataService.getgrninwardView(data.id)
      .subscribe(result => {
        let datas = result
        let overall = datas;
        // for (var i = 0; i < overall.length; i++) {
          this.supp = overall
          this.SupplierName = this.supp.name;
          this.SupplierCode = this.supp.code;
          this.SupplierGSTNumber = this.supp.gstno;
          this.SupplierPANNumber = this.supp.panno;
          this.Address = this.supp.address_id;
          this.line1 = this.supp.address_id.line1;
          this.line2 = this.supp.address_id.line2;
          this.line3 = this.supp.address_id.line3;
          this.City = this.supp.address_id.city_id.name;
        // }
        this.inputSUPPLIERValue = data.name;
        this.inputSUPPLIERValueID = data.id;
        this.GRNForm.patchValue({
          suppliername: this.inputSUPPLIERValue,
        })
      })
  }
  SelectSuppliersearch() {
    let searchsupplier = this.SelectSupplierForm.value;
    if (searchsupplier.code === "" && searchsupplier.panno === "" && searchsupplier.gstno === "") {
      this.getsuppliername("", "");
    }
    else {
      this.alternate = true;
      this.default = false;
      this.Testingfunctionalternate();
    }
  }
  Testingfunctionalternate() {
    let searchsupplier = this.SelectSupplierForm.value;
    this.SpinnerService.show();
    this.dataService.getgrnselectsupplierSearch(searchsupplier)
      .subscribe(result => {
        this.SpinnerService.hide();
        this.selectsupplierlist = result.data
        this.successdata = this.selectsupplierlist
      })
  }
  fileProgress(fileInput: any) {
    this.fileData = fileInput.target.files;
    this.fileName = this.fileData[0].name;
  }
  dataclear() {
    this.SelectSupplierForm.controls['gstno'].reset("")
    this.SelectSupplierForm.controls['code'].reset("")
    this.SelectSupplierForm.controls['panno'].reset("")
    this.SelectSupplierForm.controls['name'].reset("")

    this.SupplierName = "";
    this.SupplierCode = "";
    this.SupplierGSTNumber = "";
    this.SupplierPANNumber = "";
    this.Address = "";
    this.line1 = "";
    this.line2 = "";
    this.line3 = "";
    this.City = "";
    this.suplist = "";
    // this.JsonArray = [];
    this.alternate = false
    this.default = true
  }
  dataclearinwardform() {
    this.GRNForm.controls['pono'].reset("")
    this.GRNForm.controls['prno'].reset("")
    this.GRNForm.controls['branchcode'].reset("")
    this.GRNForm.controls['suppliername'].reset("")
    this.inputSUPPLIERValueID = ""
    this.GRNCreateEditForm();
  }
  supplier() {
    this.supplierchooseForm.reset()
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////omit special characters
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57));
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////// summary
  GRNCreateEditForm(pageNumber = 1, pageSize = 10) {
    let searchgrninward = this.GRNForm.value;
    searchgrninward.suppliername = this.inputSUPPLIERValueID
    if (this.GRNForm.value.branchcode == undefined) {
      this.GRNForm.value.branchcode = ""
    }
    if (this.GRNForm.value.branchcode.id == undefined) {
      this.GRNForm.value.branchcode = this.GRNForm.value.branchcode.id
    }
    else {
      this.GRNForm.value.branchcode = this.GRNForm.value.branchcode.id
    }
    // searchgrninward.branchcode = this.GRNForm.value.branchcode.id
    for (let i in searchgrninward) {
      if (!searchgrninward[i]) {
        delete searchgrninward[i];
      }
    }
    this.SpinnerService.show();
    this.dataService.getgrncreatesummarySearch(searchgrninward, pageNumber, pageSize)
      .subscribe(result => {
        this.SpinnerService.hide();
        this.grninwardList = result['data']
        console.log("grn data summary", this.grninwardList)
        let datapagination = result["pagination"];
        if (this.grninwardList.length === 0) {
          this.grninwardpage = false
          this.SpinnerService.hide();
        }
        if (this.grninwardList.length > 0) {
          this.has_nextgrninward = datapagination.has_next;
          this.has_previousgrninward = datapagination.has_previous;
          this.presentpagegrninward = datapagination.index;
          this.grninwardpage = true
          this.SpinnerService.hide();
        }
        if (result) {
          this.SpinnerService.hide();
          if (this.GRNForm2.value.grndetails.length > 0) { this.UpdatingWhenUsingPagination() }
        }
        return this.grninwardList.map(row => {
          return Object.assign({}, row, { disableds: false, fieldtext: false });
        });
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  nextClickgrninward() {
    if (this.has_nextgrninward === true) {
      this.currentepagegrninward = this.presentpagegrninward + 1
      this.GRNCreateEditForm(this.presentpagegrninward + 1)
    }
  }
  previousClickgrninward() {
    if (this.has_previousgrninward === true) {
      this.currentepagegrninward = this.presentpagegrninward - 1
      this.GRNCreateEditForm(this.presentpagegrninward - 1)
    }
  }
  getFormArray(): FormArray {
    return this.GRNForm2.get('grndetails') as FormArray;
  }
  getData(data, indexOfSelectedRow, quantityvalue, e, choosentype) {
  console.log("indexOfSelectedRow", indexOfSelectedRow)
  console.log("quantityvalue", quantityvalue)
  console.log("choosentype", choosentype)
  console.log("choosen data", data)

    let valueOfQuantityandRemainingQty = data.qty - data.received_quantity
  if(choosentype == 'checkbox'){
    if (quantityvalue > valueOfQuantityandRemainingQty || quantityvalue == 0) {
      this.notification.showWarning(" 'Current Received Quantity' must be less than or equal to 'Remaining Quantity'")
      e.preventDefault();
      e.stopPropagation();
      return false
    }
  }
  console.log("auto selected value value",data)
    console.log("event.target total  value", e.target)
    let grnHeaderData = this.GRNForm2.value
    let checkCommonValidationAndEnable = this.GRNForm2.value.grndetails
    if(e.target.checked == false) {
      data.CheckboxenableDiableArrays = false
      this.removeSection(data, e)
    }
    else {
      if (data.is_asset == 1) {
        console.log("this.Assetarrray -------------------------------------->", this.Assetarrray)
        if (this.Assetarrray.length == 0) {
          this.notification.showWarning("Please Enter Asset ")
          e.preventDefault();
          e.stopPropagation();
          return false
        }
      }
      if (data.is_asset == 1) {
      if ((this.Assetarrray.length != this.TotalAssetRequired)) {
        this.notification.showWarning("Required Asset Not Satisfied ")
        e.preventDefault();
        e.stopPropagation();
        return false
      }
    }
      this.GRNForm2.patchValue({
        suppliername: data.poheader_id.supplierbranch_id.name,
        locations: data.prpoqty_id.prccbs_id.branch_id.name
      })
      data.CheckboxenableDiableArrays = true
      data.fieldtext = true
      
      
      let podetails_id: FormControl = new FormControl('');
      let poheader_id: FormControl = new FormControl('');
      let product_id: FormControl = new FormControl('');
      let quantitycontrol: FormControl = new FormControl('');
      let uom: FormControl = new FormControl('');
      let unitprice: FormControl = new FormControl('');
      let amount: FormControl = new FormControl('');
      let taxamount: FormControl = new FormControl('');
      let totalamount: FormControl = new FormControl('');
      let isremoved: FormControl = new FormControl('');
      let remarks: FormControl = new FormControl('');
      let podelivery_id: FormControl = new FormControl('');
      let date: FormControl = new FormControl('');
      let grnflag: FormControl = new FormControl('');
      let ASSET: FormControl = new FormControl('')
      let assest_ids: FormControl = new FormControl('')
      let Received_Date: FormControl = new FormControl('');
      let branch_id: FormControl = new FormControl('');
      podetails_id.setValue(data.podetails_id.id)
      poheader_id.setValue(data.poheader_id.id)
      product_id.setValue(data.podetails_id.product_id)
      // quantity.setValue(data.podetails_id.qty)
      quantitycontrol.setValue(+quantityvalue)
      uom.setValue(data.podetails_id.uom)
      unitprice.setValue(data.podetails_id.unitprice)
      amount.setValue(data.poheader_id.amount)
      taxamount.setValue(data.podetails_id.taxamount)
      totalamount.setValue(data.podetails_id.totalamount)
      isremoved.setValue(data.isremoved)
      remarks.setValue(data.poheader_id.supplierbranch_id.remarks)
      podelivery_id.setValue(data.id)
      date.setValue(data.poheader_id.date)
      grnflag.setValue(data.prpoqty_id.prdetails_id.prheader_id.flag)
      ASSET.setValue(this.Assetarrray)
      let assest_idsdata = this.Assetarrray.map(x => x.id)
      console.log("Asset IDS only", assest_ids)
      assest_ids.setValue(assest_idsdata)
      branch_id.setValue(data.poheader_id.branch_id.id)
      // id.setValue(data.id)
      this.getFormArray().push(new FormGroup({
        podetails_id: podetails_id,
        poheader_id: poheader_id,
        product_id: product_id,
        quantity: quantitycontrol,
        uom: uom,
        unitprice: unitprice,
        amount: amount,
        taxamount: taxamount,
        totalamount: totalamount,
        isremoved: isremoved,
        remarks: remarks,
        podelivery_id: podelivery_id,
        date: date,
        grnflag: grnflag,
        Received_Date: date,
        assest_ids: assest_ids,
        ASSET: ASSET,
        branch_id:branch_id
      }))
      //disable all other checkboxes
      let CheckboxenableDiableCheck = this.GRNForm2.value
      this.grninwardList.forEach((row, index) => {
        let dataForArrayGrnToDisableInput = this.GRNForm2.value.grndetails
        if (row.id == data.id) {
          row.fieldtext = true
          row.CheckboxenableDiableArrays = true
        }
        if (CheckboxenableDiableCheck.suppliername == row.poheader_id.supplierbranch_id.name && CheckboxenableDiableCheck.locations == row.prpoqty_id.prccbs_id.branch_id.name) {
          row.disabled = false;
        }
        else {
          row.disabled = true;
          row.fieldtext = true;
        }
      });
    } 
    this.Assetarrray = []
    this.closedialog();
  }
  ////////////////////////////////////////////////////////////////////////////////////////remove section
  removeSection(i, event) {
    let dataConfirm;
    if(i.is_asset == 1){
    dataConfirm = confirm("If you want to Change, Selected Asset will be deleted! Do you want to continue?")}
    else{ dataConfirm = true}
    if (dataConfirm == true) {
      let dataremovevaluecheck = this.GRNForm2.value
      let dataremove = this.GRNForm2.value.grndetails
      let index = -1;
      let val = i.id
      let filteredObj = dataremove.find(function (item, ival) {
        if (item.podelivery_id === val) {
          index = ival;
          return ival;
        }
      });
      const control = <FormArray>this.GRNForm2.get('grndetails');
      control.removeAt(index);

      this.grninwardList.forEach((row, index) => {
        if (this.GRNForm2.value.grndetails.length === 0) {
          row.disabled = false;
          row.fieldtext = false
          this.GRNForm2.controls.suppliername.reset()
          this.GRNForm2.controls.locations.reset()
          if (row.id == val) {
            row.fieldtext = false
          }
          return
        }
        if (this.GRNForm2.value.grndetails.length > 0) {
          if (this.GRNForm2.value.suppliername == row.poheader_id.supplierbranch_id.name && this.GRNForm2.value.locations == row.prpoqty_id.prccbs_id.branch_id.name) {
            row.disabled = false;
          }
          else {
            row.disabled = true;
          }
        }
        if (row.id == val) {
          row.fieldtext = false
        }

      });
      if(i.is_asset == 1){
      this.notification.showInfo("Asset data deleted")}
      this.Assetarrray = []
    }
    if (dataConfirm == false) {
      event.preventDefault();
      event.stopPropagation();
      return false

    }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////updating while using pagination
  UpdatingWhenUsingPagination() {
    let dataarray = this.GRNForm2.value.grndetails
    let aValueToCheckAndPatch = this.grninwardList
    for (let datapatchcheck in aValueToCheckAndPatch) {
      let filteredObj = dataarray.find(function (item, ival) {
        if (item.podelivery_id === aValueToCheckAndPatch[datapatchcheck].id) {
          aValueToCheckAndPatch[datapatchcheck].qtyfield = +item.quantity
          aValueToCheckAndPatch[datapatchcheck].CheckboxenableDiableArrays = true
        }
      });
    }
    this.grninwardList.forEach((row, index) => {
      let headerGrn = this.GRNForm2.value
      let dataarray = this.GRNForm2.value.grndetails
      dataarray.forEach((rowarray, index) => {
        if (rowarray.podelivery_id == row.id) {
          row.fieldtext = true
        }
      })
      if (headerGrn.suppliername == row.poheader_id.supplierbranch_id.name && headerGrn.locations == row.prpoqty_id.prccbs_id.branch_id.name) {
        row.disabled = false;
      }
      else {
        row.disabled = true;
        row.fieldtext = true;
      }
    });
  }
  /////////////////////////////////////////////////////////////////////////// submit function
  GRNCreateEditForm2() {
    this.issubmit = true
    // if (this.GRNForm2.value.dcnote == "") {
    //   this.toastr.warning('', 'Please Enter  Dcnote', { timeOut: 1500 });
    //   this.issubmit = false
    //   return false;
    // }
    if (this.GRNForm2.value.invoiceno == "") {
      this.toastr.warning('', 'Please Enter  Invoiceno', { timeOut: 1500 });
      this.issubmit = false
      return false;
    }
    if (this.GRNForm2.value.date == "") {
      this.toastr.warning('', 'Please Enter Date', { timeOut: 1500 });
      this.issubmit = false
      return false;
    }
    if (this.GRNForm2.value.remarks == "") {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      this.issubmit = false
      return false;
    }
    if (this.GRNForm2.value.grndetails.length <=0) {
      this.toastr.warning('', 'Make select the PO !!', { timeOut: 1500 });
      this.issubmit = false
      return false;
    }
    const currentDate = this.GRNForm2.value
    currentDate.date = this.datePipe.transform(currentDate.date, 'yyyy-MM-dd');
    let dataSubmit = this.GRNForm2.value
    for (let data in dataSubmit) {
      delete dataSubmit.suppliername
      delete dataSubmit.locations
    }
    this.SpinnerService.show();
    this.dataService.grnCreateForm(dataSubmit, this.fileData)
      .subscribe(result => {
        this.SpinnerService.hide();
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.SpinnerService.hide();
          this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          this.issubmit = false
        }
        if (result.rentamount) {
          this.SpinnerService.hide();
          this.notification.showError("Remaining Amount is " + result.rentamount + " Please Check the Approved Amount or Clear the Pending Amount")
          this.issubmit = false;
          return false;
        }
        if (result.rentamount === 0) {
          this.SpinnerService.hide();
          this.notification.showError("Remaining Amount is " + result.rentamount + " Please Check the Approved Amount or Clear the Pending Amount")
          this.issubmit = false;
          return false;
        }
        else {
          this.SpinnerService.hide();
          this.notification.showSuccess("Successfully created!...")
          // this.router.navigate(['/grninward'])
          this.onSubmit.emit();
          this.fromGroupDirective.resetForm()
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  onCancelClick() {
    // this.router.navigate(['/prmaster'], { skipLocationChange: true })
    this.onCancel.emit()
  }









  //////////////////////////////////////////////////////////////////////////////////////////////////////asset work 

  GrnassestheaderList: any;
  assetpopup: boolean = false
  TotalAssetRequired: any
  SelectedAsset: any
  nextasset = 1
  previousasset: any
  presentpageasset = 1
  headerIDForAsset: any
  detailIDForAsset: any
  FulldataOnLine: any
  passgrninwardid(data, detailID, fulldataOnParticularline, quantityvalue, templatepopup) {
    // this.GrnAssestForm.reset()
    (this.GrnAssestForm.get('assetitems') as FormArray).clear();
    this.Assetarrray = []
    this.SelectedAsset = this.Assetarrray.length
    console.log("selected data in popup", data)
    if (quantityvalue == 0) {
      this.notification.showWarning("Please Enter Quantity")
      this.assetpopup = false
      this.dialog.closeAll()
      return false
    }
    this.TotalAssetRequired = quantityvalue
    let headerId = data.id;
    let datadetailID = detailID.id
    this.headerIDForAsset = data.id;
    this.detailIDForAsset = detailID.id

    let type = 'Headers';
    // console.log("headerId", headerId)
    // console.log("detail Id", datadetailID)
    this.presentpageasset = 1
    let page = this.presentpageasset 
    
    this.dialog.open(templatepopup, {
      width: '100%',
      disableClose: true 
    });
    this.assetpopup = true
    this.SpinnerService.show();
    this.dataService.getassestheader(headerId, datadetailID, type, page)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results
        console.log("Asset popup data patch ", datas)
        this.FulldataOnLine = fulldataOnParticularline
        this.loadAssetForm(datas, fulldataOnParticularline)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  closedialog(): void {
    this.dialog.closeAll()
    this.Assetarrray = []
  }

  // previousassetClick(){
  //   if( this.presentpageasset <= 1  ){
  //     return false
  //   }

  //   let headerId = this.headerIDForAsset
  //   let datadetailID = this.detailIDForAsset
  //   let type = 'Headers';
  //   let page: any
  //   let present = this.presentpageasset ;
  //   let backward;
  //       backward = --present; 
  //       this.presentpageasset = backward
  //       this.SpinnerService.show();
  //   this.dataService.getassestheader(headerId, datadetailID, type, this.presentpageasset-1)
  //     .subscribe((results: any[]) => {
  //       this.SpinnerService.hide();
  //       let datas = results
  //       console.log("Asset popup data patch ", datas)
  //       this.loadAssetForm(datas, this.FulldataOnLine)
  //     },(error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }


  nextassetClick(){
    let headerId = this.headerIDForAsset
    let datadetailID = this.detailIDForAsset
    let type = 'Headers';
    let page: any
    
    let present = this.presentpageasset ;
    let forward;
        forward = ++present; 
        this.presentpageasset = forward


        this.SpinnerService.show();
    this.dataService.getassestheader(headerId, datadetailID, type, this.presentpageasset)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results
        if(datas.length == 0){ this.notification.showInfo("Maximum Asset Reached"); this.SpinnerService.hide();    }
        console.log("Asset popup data patch ", datas)
        this.loadAssetForm(datas, this.FulldataOnLine)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  ShowHideAssertInstallation: any

  loadAssetForm(Assetdata, fulldataOnParticularline) {


    console.log("Assetdata", Assetdata)
    console.log("fulldataOnParticularline", fulldataOnParticularline)




    for (let detail of Assetdata) {

      // let assetid_name: FormControl = new FormControl('');
      // let assetid_gid: FormControl = new FormControl('');
      // let UserInputassestserial_no: FormControl = new FormControl('');
      // let UserInputassest_manufacturer: FormControl = new FormControl('');
      // let UserInputasseststart_date: FormControl = new FormControl('');
      // let UserInputassestend_date: FormControl = new FormControl('');
      // let UserInputInstallationRequired: FormControl = new FormControl(''); 

      let po_id: FormControl = new FormControl('');
      let podetails_id: FormControl = new FormControl('');
      let manufacturer: FormControl = new FormControl('');
      let serialno: FormControl = new FormControl('');
      let details: FormControl = new FormControl('');
      let id: FormControl = new FormControl('');
      let assetid: FormControl = new FormControl('');
      let warranty_from_date: FormControl = new FormControl(new Date());
      let warranty_to_date: FormControl = new FormControl(new Date());
      let installation_required: FormControl = new FormControl(''); 
      let installation_date: FormControl = new FormControl('');

      po_id.setValue(detail.po_id)
      podetails_id.setValue(detail.podetails_id)
      manufacturer.setValue("")
      serialno.setValue("")
      details.setValue(detail.details)
      id.setValue(detail.id)
      assetid.setValue(detail.assetid)
      warranty_from_date.setValue(new Date())
      warranty_to_date.setValue(new Date())
      installation_required.setValue(detail.installation_required)
      
      if( fulldataOnParticularline.prpoqty_id.prdetails_id.installationrequired == 1  ){
        this.ShowHideAssertInstallation = true
        installation_date.setValue(new Date())
      }
      if( fulldataOnParticularline.prpoqty_id.prdetails_id.installationrequired == 0  ){
        this.ShowHideAssertInstallation = false
        installation_date.setValue(detail.installation_date)
      }

      const AssetArrayForm = this.GrnAssestForm.get('assetitems') as FormArray;

      AssetArrayForm.push(new FormGroup({
        po_id: po_id,
        podetails_id: podetails_id, 
        manufacturer: manufacturer,
        serialno: serialno,
        details: details,
        id: id,
        assetid: assetid,
        warranty_from_date: warranty_from_date,
        warranty_to_date: warranty_to_date,
        installation_required: installation_required,
        installation_date:installation_date
      })
      )
      

      // assetid_gid.setValue(detail.id)
      // assetid_name.setValue(detail.assetid)
      // UserInputassestserial_no.setValue("")
      // UserInputassest_manufacturer.setValue("")
      // UserInputasseststart_date.setValue(new Date())
      // UserInputassestend_date.setValue(new Date())
      // checkboxvalue.setValue(false)
      
      // AssetArrayForm.push(new FormGroup({
      //   UserInputassestserial_no: UserInputassestserial_no,
      //   UserInputassest_manufacturer: UserInputassest_manufacturer,
      //   // UserInputasseststart_date: UserInputasseststart_date,
      //   // UserInputassestend_date: UserInputassestend_date,
      //   assetid_name: assetid_name,
      //   assetid_gid: assetid_gid,
      //   // UserInputInstallationRequired:UserInputInstallationRequired,
      //   // checkboxvalue: checkboxvalue
      // })
      // )
    }
    this.updateWhenUsingPopup()

  }

/////////////////////////////////////////// patching already filled asset data on popup 
  updateWhenUsingPopup() {
    let PatchDataWhileCheckArray = this.patchofAssetarray
    console.log("Patch Data While Check Asset Array", PatchDataWhileCheckArray)

    let dataarray = this.GrnAssestForm.value.assetitems
    let aValueToCheckAndPatch = PatchDataWhileCheckArray

    for (let datapatchcheck in aValueToCheckAndPatch) {
      for (let dataform in dataarray) {
        if (aValueToCheckAndPatch[datapatchcheck].id == dataarray[dataform].id) {
          console.log("index value of an Form array", dataform)
          console.log(" aValueToCheckAndPatch[datapatchcheck]", aValueToCheckAndPatch[datapatchcheck])

          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('po_id').setValue(aValueToCheckAndPatch[datapatchcheck].po_id)
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('podetails_id').setValue(aValueToCheckAndPatch[datapatchcheck].podetails_id)
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('manufacturer').setValue(aValueToCheckAndPatch[datapatchcheck].manufacturer)
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('serialno').setValue(aValueToCheckAndPatch[datapatchcheck].serialno)
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('details').setValue(aValueToCheckAndPatch[datapatchcheck].details)   
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('id').setValue(aValueToCheckAndPatch[datapatchcheck].id)  
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('assetid').setValue(aValueToCheckAndPatch[datapatchcheck].assetid)  
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('warranty_from_date').setValue(aValueToCheckAndPatch[datapatchcheck].warranty_from_date)   
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('warranty_to_date').setValue(aValueToCheckAndPatch[datapatchcheck].warranty_to_date)  
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('installation_required').setValue(aValueToCheckAndPatch[datapatchcheck].installation_required)  
          this.GrnAssestForm.get('assetitems')['controls'][dataform].get('installation_date').setValue(aValueToCheckAndPatch[datapatchcheck].installation_date)  




          // this.GrnAssestForm.get('assetitems')['controls'][dataform].get('UserInputassestserial_no').setValue(aValueToCheckAndPatch[datapatchcheck].UserInputassestserial_no)
          // this.GrnAssestForm.get('assetitems')['controls'][dataform].get('UserInputassest_manufacturer').setValue(aValueToCheckAndPatch[datapatchcheck].UserInputassest_manufacturer)
          // // this.GrnAssestForm.get('assetitems')['controls'][dataform].get('UserInputasseststart_date').setValue(aValueToCheckAndPatch[datapatchcheck].UserInputasseststart_date)
          // // this.GrnAssestForm.get('assetitems')['controls'][dataform].get('UserInputassestend_date').setValue(aValueToCheckAndPatch[datapatchcheck].UserInputassestend_date)
          // // this.GrnAssestForm.get('assetitems')['controls'][dataform].get('UserInputInstallationRequired').setValue(aValueToCheckAndPatch[datapatchcheck].UserInputInstallationRequired)  
        }
      }
      this.PopupCheckboxdisable()
    }
  }

  // fieldCheckboxAsset= [false, false, false, false, false, false, false, false, false, false]
  fieldCheckboxAsset= Array(1000).fill(false)

  /////////////////////////////////////////////disabling checkbox on popup when already selected
  PopupCheckboxdisable() {

    /////// collecting assetID from grn details of asset array and assetID in popup


    let dataAssetOnPopup = this.GrnAssestForm.value.assetitems
    let assetIDdata = dataAssetOnPopup.map(x => x.id)
    console.log(" asset data in popup part 1 ", assetIDdata)
    let dataInGrnDetails = this.GRNForm2.value.grndetails
    let AssetDatailsGrndetails = []
    for (let data in dataInGrnDetails) {
      let datacollectionOfAssetId = dataInGrnDetails[data].ASSET
      for (let dataassetarray in datacollectionOfAssetId) {
        let dataAssert_GidID = datacollectionOfAssetId[dataassetarray].Assert_Gid
        let dataget = AssetDatailsGrndetails.push(dataAssert_GidID)
        console.log(" data Collection Of Asset Id Part 2", AssetDatailsGrndetails)
      }
    }

    //////////////////// disabling checkbox 
    let dataArrayOfAssetPopup  = assetIDdata
    let dataArrayOfGRNDetails  = AssetDatailsGrndetails

    for( let dataID in dataArrayOfGRNDetails ){
      for( let dataAsset in dataArrayOfAssetPopup ){
        if( dataArrayOfGRNDetails[dataID] == dataArrayOfAssetPopup[dataAsset]   ){
          this.fieldCheckboxAsset[dataAsset] = true
          // dataAssetOnPopup[dataAsset].disablecheckbox = true
        }
        // else{
        //   this.fieldCheckboxAsset[dataAsset] = false
        //   // dataAssetOnPopup[dataAsset].disablecheckbox = false
        // }
      }
    }
  }


  do_save() {
    let datacheckValidationOnPopupSubmit = this.Assetarrray
    if (datacheckValidationOnPopupSubmit.length == 0) {
      this.notification.showWarning("Asset not selected")
      this.assetpopup = false
      this.dialog.closeAll()
    }
    if (datacheckValidationOnPopupSubmit.length > this.TotalAssetRequired) {
      this.notification.showWarning("Asset not selected")
      this.assetpopup = false
      this.dialog.closeAll()
    }

    else {
      this.assetpopup = false
      this.dialog.closeAll()
    }
  }


  Assetarrray = []
  patchofAssetarray = []
  assetArrayFormation(data, index, event) {
    // console.log("grnasset popup summary ", this.GrnassestheaderList);
    // let assetformdata = this.GrnAssestForm.value
    // console.log('data on select', data.value)


    if ((data.value.manufacturer == "") || (data.value.manufacturer == undefined) || (data.value.manufacturer == null)) {
      this.notification.showWarning("Please fill Manufacture ")
      event.preventDefault();
      event.stopPropagation();
      return false
    }

    if (data.value.warranty_from_date > data.value.warranty_to_date ) {
      this.notification.showWarning("End Date  must be greater than Start Date")
      event.preventDefault();
      event.stopPropagation();
      return false
    }

    if ((data.value.serialno == "") || (data.value.serialno == undefined) || (data.value.serialno == null)) {
      this.notification.showWarning("Please fill Serial No ")
      event.preventDefault();
      event.stopPropagation();
      return false
    }

    // if ((data.value.UserInputasseststart_date == "") || (data.value.UserInputasseststart_date == undefined) || (data.value.UserInputasseststart_date == null)) {
    //   this.notification.showWarning("Please fill Start Day")
    //   event.preventDefault();
    //   event.stopPropagation();
    //   return false
    // }

    if (event.target.checked) {
      let datalength = this.SelectedAsset
      let totaldata = this.TotalAssetRequired

      if (datalength >= totaldata) {
        this.notification.showWarning("Required data satisfied")
        event.preventDefault();
        event.stopPropagation();
        return false
      }
      let assetdata = data.value
      this.patchofAssetarray.push(assetdata)
      console.log("Patch Assset selected dataaa", this.patchofAssetarray)

      // let warentydateStart = this.datePipe.transform(assetdata.warranty_from_date, "dd-MMM-yy")
      
      let dataAssetArrangement = {
        // Sno: assetdata.UserInputassestserial_no,
        // Assert_Gid: assetdata.assetid_gid,
        // ManuF: assetdata.UserInputassest_manufacturer,
        // IsWarranty: "Y",
        // WarrantyEndDate: assetdata.UserInputassestend_date,
        // Installation_Date: assetdata.UserInputInstallationRequired,
        // WarrantyStartDate: assetdata.UserInputasseststart_date,
        // Remarks: "GRN"
        po_id: assetdata.po_id,
        podetails_id: assetdata.podetails_id, 
        manufacturer: assetdata.manufacturer,
        serialno: assetdata.serialno,
        details: assetdata.details,
        id: assetdata.id,
        assetid: assetdata.assetid,
        warranty_from_date: this.datePipe.transform( assetdata.warranty_from_date, 'yyyy-MM-dd'),
        warranty_to_date:this.datePipe.transform( assetdata.warranty_to_date, 'yyyy-MM-dd'),
        installation_required: assetdata.installation_required,
        installation_date:this.datePipe.transform( assetdata.installation_date, 'yyyy-MM-dd'),
      }

      this.Assetarrray.push(dataAssetArrangement)
      console.log("Assset selected dataaa", this.Assetarrray)
      this.SelectedAsset = this.Assetarrray.length

    }
    else {

      let dataremove =  this.Assetarrray
      let index = -1;
      let val = data.value.id
      let filteredObj = dataremove.find(function (item, ival) {
        if (item.Assert_Gid == val) {
          index = ival;
          return ival;
        }
      })

      console.log("index value of data in this.Assetarrray ", this.Assetarrray[index])
      this.Assetarrray.splice(index, 1)
      let totalLengthSelected = this.Assetarrray.length
      this.SelectedAsset = totalLengthSelected
      console.log("Total Asset", this.Assetarrray)
    }

  }
  fieldGlobalIndex(index) {
    return this.itemsPerPage * (this.currentPage - 1) + index;
  }


}








