import { Component, OnInit, SimpleChanges, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl,  AbstractControl, Validators  } from "@angular/forms";
import { EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { PRPOSERVICEService } from '../prposervice.service';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service'
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, from, fromEvent } from 'rxjs';
import { PRPOshareService } from '../prposhare.service'
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'
export interface mepnoLists {
  // no: string;
  id: number;
  mepno: string;
}

export interface productCategoryLists {
  no: string;
  name: string;
  id: number;
}

export interface productTypeLists {
  no: string;
  name: string;
  id: number;
}

export interface productLists {
  no: string;
  name: string;
  id: number;
  code: string;
}
export interface itemsLists {
  no: string;
  name: string;
  id: number;
}

export interface commoditylistss {
  id: string;
  name: string;
}

export interface supplierlistss {
  id: string;
  name: string;
  branch_data: any;
}

export interface branchlistss {
  id: any;
  name: string;
  code: string;
}

export interface HSNlistss {
  id: string;
  code: string;
}

export interface Emplistss {
  id: string;
  full_name: string;
}

export interface bslistss {
  id: string;
  name: string;
  bs: any
}

export interface cclistss {
  id: string;
  costcentre_id: any
  name: string;
}
export interface uomlistsss {
  id: string;
  name: string;
}

@Component({
  selector: 'app-pr-maker',
  templateUrl: './pr-maker.component.html',
  styleUrls: ['./pr-maker.component.scss']
})
export class PrMakerComponent implements OnInit {
  prForm: FormGroup;
  files: FormGroup;
  filesHeader: FormGroup;

  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  pageSize = 10;
  isLoading = false

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() linesChange = new EventEmitter<any>();

  MEPList: Array<mepnoLists>;

  productCategoryList: Array<productCategoryLists>;

  productTypeList: Array<productTypeLists>;

  productList: Array<productLists>;

  itemList: Array<itemsLists>;

  commodityList: Array<commoditylistss>;

  supplierList: Array<supplierlistss>;

  branchList: Array<branchlistss>;

  employeeList: Array<Emplistss>;

  bslist: Array<bslistss>;

  cclist: Array<cclistss>;

  hsnrateList: Array<HSNlistss>;

  uomlist:Array<uomlistsss>;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;


  @ViewChild('mepname') matmepAutocomplete: MatAutocomplete;
  @ViewChild('mepinput') mepinput: any;

  @ViewChild('productCategory') matproductCategoryAutocomplete: MatAutocomplete;
  @ViewChild('productCategoryInput') productCategoryInput: any;

  @ViewChild('productType') matproductTypeAutocomplete: MatAutocomplete;
  @ViewChild('productTypeinput') productTypeinput: any;

  @ViewChild('product') matproductAutocomplete: MatAutocomplete;
  @ViewChild('productInput') productInput: any;

  @ViewChild('item') matitemAutocomplete: MatAutocomplete;
  @ViewChild('itemInput') itemInput: any;

  @ViewChild('commodity') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;

  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;

  @ViewChild('supplier') matsupplierAutocomplete: MatAutocomplete;
  @ViewChild('supplierInput') supplierInput: any;

  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;

  @ViewChild('bs') matbsAutocomplete: MatAutocomplete;
  @ViewChild('bsInput') bsInput: any;

  @ViewChild('cc') matccAutocomplete: MatAutocomplete;
  @ViewChild('ccInput') ccInput: any;

  @ViewChild('hsn') matHSNAutocomplete: MatAutocomplete;
  @ViewChild('hsnInput') hsnInput: any;

  @ViewChild('uom') matuomAutocomplete: MatAutocomplete;
  @ViewChild('uomInput') uomInput: any;


  @ViewChild('takeInput', { static: false }) InputVar: ElementRef;
  // @ViewChild('mytemplate') mytemplate: TemplateRef<any>;
  @ViewChild('popupcontainer', { static: false }) popupcontainerbox: ElementRef
  //////////////////////////////////////////////Yes or no radio button variables
  yesorno: any[] = [
    { value: 1, display: 'Yes' },
    { value: 0, display: 'No' }
  ]

  ///////////////// Edit or create 
  isEditPRScreen: boolean


  //////////////// Field enable disable variables
  Options: boolean = false

  mepreadonly: boolean = false
  comreadonly: boolean = false
  prodcatreadonly: boolean = false
  prodSubreadonly: boolean = false
  prodreadonly: boolean = false
  itemreadonly: boolean = false
  supplierreadonly: boolean = false
  branchreadonly: boolean = false

  ShowHideFile: boolean
  ShowHideAssert: boolean


  ///////// edit PR variables for ID
  prapproveId: any
  prodcatID = 0

  ///////////// calculation amount variables

  amt: any;
  sum: any = 0.00;
  ////////////////////////ccbs related variables
  qtytotaloRow: any
  RequiredQtyForThisccbs: any


  ccbsqty: any
  totalccbs: any

  qtytotalInPopup: any


  sums: any
  cbqty: any

  seletedPRdetailsIndex: any
  selectedCCBSindex: any

  //////////////////////////////popupmep global variables
  totalamount: any;
  pramt: any;
  poamt: any;
  remainamt: any;
  amount: number;
  quantitycount: number;
  mepnumber: string;
  description: any;

  ///////////////
  getCatlog_NonCatlogList: any

  ///////////////////////////////////////////////// caltlog non catlog based variables
  dtsShow: boolean
  productcatlog: boolean
  itemcalog: boolean
  productNonCatlog: boolean
  itemNonCalog: boolean
  TypeData: any
  DownloadnUploadExcelButton: boolean


  ///////////////////////////////////////////////////////////////////patch index variable
  indexDet: any







  constructor(
    private fb: FormBuilder, private prposervice: PRPOSERVICEService, private router: Router,
    private notification: NotificationService, private prposhareService: PRPOshareService, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService) { }



  ngOnInit() {
    this.prForm = this.fb.group({
      type: "",
      mepno: '',
      mepnokey: '',
      commodity: '',
      commodity_id: '',
      productCategory: '',
      productType: '',
      dts: [0, Validators.required],
      product: '',
      items: '',
      itemsid: '',
      productnoncatlog: '',
      itemnoncatlog: '',
      supplier: '',
      supplier_id: '',
      unitprice: '',
      uom: '',
      employee_id: '',
      branch_id: '',
      totalamount: 0,
      notepad: '',
      prdetails: this.fb.array([]),
      file_key:[["fileheader"]],
    });

    this.files = this.fb.group({
      file_upload: new FormArray([
      ]),
    })

    this.filesHeader = this.fb.group({
      file_upload: new FormArray([
      ]),
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// MEP
    // let mepkey = ""
    // this.getmepFK()
    this.prForm.get('mepno').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.prposervice.getmepFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.MEPList = datas;

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// commodity

    this.prForm.get('commodity').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.prposervice.getcommodityDependencyFKdd(this.prForm.value.mepno, value, 1)
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// product cat

    // let prodcatkey = ""
    // this.getprodcatkeyFK(prodcatkey)



    this.prForm.get('productCategory').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.prposervice.getproductCategoryFKdd(this.prForm.value.commodity.id, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productCategoryList = datas;

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// product type

    this.prForm.get('productType').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.prposervice.getproductTypeFKdd(this.prForm.value.commodity?.id, this.prForm.value.productCategory?.id, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe(
        response => {
          this.productTypeList = response["data"];
          console.log(this.productTypeList);
        },(error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// product

    this.prForm.get('product').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.prposervice.getproductDependencyFKdd(this.prForm.value.commodity.id, this.prForm.value.productCategory.id, this.prForm.value.productType.id, this.prForm.value.dts, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productList = datas;

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// items/ models

    this.prForm.get('items').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.prposervice.getitemsDependencyFKdd(this.prForm.value.product.id, this.prForm.value.dts, this.prForm.value.supplier, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.itemList = datas;

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// supplier
    this.prForm.get('supplier').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.prposervice.getsupplierDependencyFKdd(this.prForm.value.product.id, this.prForm.value.items.name, value, 1, this.prForm.value.type, this.prForm.value.dts)
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


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////branch
    let branchkeyvalue: String = "";
    this.getbranchFK();

    this.prForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.prposervice.getbranchFK(value, 1)
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
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// approver
    this.prForm.get('employee_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.prposervice.getemployeeApproverforPRDD(this.prForm.value.commodity.id, value, 1)
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

    let data: any = this.prposhareService.prsummary.value
    if (data != "") {
      this.prapproveId = data.id
      this.patchForm(this.prapproveId)
      this.isEditPRScreen = true
    }
    else {
      this.isEditPRScreen = false
      // this.getCatlog_NonCatlog()
    }

    this.getCatlog_NonCatlog()
    this.getEmployeeBranchData()

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Calculation


  calcTotalpatch(unitprice, qty, amount: FormControl) {
    const unitprices = unitprice.value
    const qtys = qty.value
    amount.setValue((qtys * unitprices), { emitEvent: false });
    this.datasums();
  }
  calcTotal(fg: FormGroup) {
    const qty = +fg.controls['qty'].value;
    const unitprice = +fg.controls['unitprice'].value;
    fg.controls['amount'].setValue((qty * unitprice), { emitEvent: false });
    console.log("amount patched or not ", fg.controls['amount'].value)
    this.datasums();
  }
  datasums() {
    this.amt = this.prForm.value.prdetails.map(x => x.amount);
    console.log('data check amt szssss', this.amt);
    this.sum = this.amt.reduce((a, b) => a + b, 0);
    console.log('sum of total ', this.sum);
    this.prForm.patchValue({
      totalamount: this.sum
    })

  }

  requiredqty(prdet, prdetailsIndex) {
    this.RequiredQtyForThisccbs = prdet.value.qty
    this.seletedPRdetailsIndex = prdetailsIndex
    console.log("this.seletedPRdetailsIndex", this.seletedPRdetailsIndex)

    this.ccbsqty = this.prForm.value.prdetails[prdetailsIndex].prccbs.map(x => x.qty);
    console.log('data check qty', this.ccbsqty);
    this.totalccbs = this.ccbsqty.reduce((a, b) => a + b, 0);
    console.log('sum of totals ccbs ', this.totalccbs);
  }


  checkqtyvalue() {
    let datavalue = this.prForm.value.prdetails
    // for (let i in datavalue) {
    this.ccbsqty = this.prForm.value.prdetails[this.seletedPRdetailsIndex].prccbs.map(x => x.qty);
    console.log('data check qty', this.ccbsqty);
    this.totalccbs = this.ccbsqty.reduce((a, b) => a + b, 0);
    console.log('sum of totals ccbs ', this.totalccbs);
    // }

  }

  omit_special_num(event) {
    var k;
    k = event.charCode;
    return ((k == 190) || (k >= 48 && k <= 57));
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////popup
  openLink(event: MouseEvent): void {
    // this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  // dialogRef: any
  displayVal = "none";
  buttonOpacity = 1
  openModal(prdetailsIndex, prdetails, event) {
    prdetails.editable = true
    let qtycheck = prdetails.value.qty
    if ((qtycheck == "") || (qtycheck == null) || (qtycheck == undefined)) {
      this.notification.showWarning("Please fill Quantity ")
      return false
    }
    let unitpricecheck = prdetails.value.unitprice
    if ((unitpricecheck == "") || (unitpricecheck == null) || (unitpricecheck == undefined)) {
      this.notification.showWarning("Please check Unitprice ")
      return false
    }
    let uomcheck = prdetails.value.uom
    if ((uomcheck == "") || (uomcheck == null) || (uomcheck == undefined)) {
      this.notification.showWarning("Please fill UOM ")
      return false
    }
    this.displayVal = "flex";
    console.log("emp data", this.empBranchdata)
    let defaultValueCCBSCheck = this.prForm.value.prdetails
    console.log("event data get ", event)
    // console.log("event of particular dataaa ", this.prForm.get('prdetails')['controls'][prdetailsIndex].get('prccbs')['controls'][0].get('qty'))
    // if(defaultValueCCBSCheck.length == 1){
    // this.prForm.get('prdetails')['controls'][prdetailsIndex].get('prccbs')['controls'][0].get('qty').setValue(qtycheck)
    // this.prForm.get('prdetails')['controls'][prdetailsIndex].get('prccbs')['controls'][0].get('branch_id').setValue(this.empBranchdata)
    // }

  }


  dataccbs: boolean = false
  saveccbs(prdetailsIndex, prdetails) {
    // document.getElementById('popupcontainer').style.display = "none";
    prdetails.editable = false
    this.displayVal = "none";
    let datavalue = this.prForm.value.prdetails[prdetailsIndex].prccbs
    if(datavalue.length == 0){ this.notification.showWarning("CCBS Details Not filled")}

    this.ccbsqty = this.prForm.value.prdetails[this.seletedPRdetailsIndex].prccbs.map(x => x.qty);
    console.log('data check qty', this.ccbsqty);
    this.qtytotalInPopup = this.ccbsqty.reduce((a, b) => a + b, 0);
    console.log('sum of totals qtytotalInPopup ', this.qtytotalInPopup);
    if (this.RequiredQtyForThisccbs != this.totalccbs) {
      this.notification.showWarning("Required quantity and ccbs quantity must be equal")
    }
    // else {
    //   // this.dataccbs = true
    //   prdetails.editable = false
    //   // this.displayVal = "flex";
    // }
  }
  closepopup(prdetails) {
    prdetails.editable = false
    this.displayVal = "none";
  }
  //////////////////////////////////////////////// CCBS Validation

  ccbqty(data) {
    let datavalue = this.prForm.value.prdetails
    for (let i in datavalue) {
      for (let j in datavalue[i]) {
        this.ccbsqty = this.prForm.value.prdetails[i].prccbs.map(x => x.qty);
        console.log('data check qty', this.ccbsqty);
        this.sums[i] = this.ccbsqty.reduce((a, b) => a + b, 0);
        console.log('sum of totals ', this.sums);
        this.cbqty = this.sums[i]
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////////// get functions

  MEPUtilizationAmountList: any
  getmepdtl() {
    let dataMep = this.prForm.value.mepno
    let dataCom = this.prForm.value.commodity.id
    if (dataMep == "") {
      this.ismepdtl = false
      return false
    }
    this.ismepdtl = true
    let IDMep: any
    if (typeof (dataMep) == 'string') {
      IDMep = dataMep
    } else {
      IDMep = dataMep.no
    }
    console.log("mepno", IDMep)
    this.SpinnerService.show();
    this.prposervice.getmepdtl(IDMep, dataCom)
      .subscribe(result => {
        this.SpinnerService.hide();
        let datas = result["data"]
        this.MEPUtilizationAmountList = datas
        // this.mepnumber = result.mep_no
        // this.totalamount = result.mep_amount
        // this.pramt = result.pr_total
        // this.poamt = result.po_total
        // this.description = result[0].justification
        // this.ismep = true
        this.remainamt = datas[0]?.unutilized_amount

        // this.mepnumber = result.mepno
        // this.totalamount = result.originalamount
        // this.pramt = result.amount
        // this.poamt = result.po_amount
        // this.description = result.justification
        // this.ismep = true
        // this.remainamt = result.pending_amount
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    // if (this.mepid != '') {
    //   this.ismepdtl = true
    // } else {
    //   this.ismepdtl = false

    // }

  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////// dropdown scrolls, get fucn


  getCatlog_NonCatlog() {
    this.SpinnerService.show();
    this.prposervice.getCatlog_NonCatlog()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.getCatlog_NonCatlogList = datas;
        console.log("getCatlog_NonCatlog", datas)
        this.patchCatlogNoncatlog()
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  patchCatlogNoncatlog() {
    if (this.isEditPRScreen == false) {
      const toSelect = this.getCatlog_NonCatlogList?.find(c => c.id == 1);
      this.prForm.patchValue({
        type: toSelect.id
      })
    }
    this.CatlogOrNotCatlog()
  }




  CatlogOrNotCatlog() {
    let catlogOrNonCatlog = this.prForm.value.type
    this.TypeData = this.prForm.value.type
    console.log("checking value for catlog non catlog", catlogOrNonCatlog)
    if (catlogOrNonCatlog == '1') {
      this.dtsShow = true
      this.productcatlog = true
      this.itemcalog = true
      this.productNonCatlog = false
      this.itemNonCalog = false
      this.prForm.get('productCategory').enable();
      this.prForm.get('productType').enable();

      this.ShowHideAssert = false
      this.ShowHideFile = true

      this.DownloadnUploadExcelButton = false
    }
    if (catlogOrNonCatlog == '2') {
      this.dtsShow = false
      this.productcatlog = true
      this.itemcalog = false
      this.productNonCatlog = false
      this.itemNonCalog = true
      // this.prForm.get('productCategory').disable();
      // this.prForm.get('productType').disable();
      this.prForm.get('productCategory').enable();
      this.prForm.get('productType').enable();


      this.ShowHideAssert = true
      this.ShowHideFile = false

      this.DownloadnUploadExcelButton = true


    }
  }








  ///////////////////////////////////////////////////////////////// validations

  resetAfterCatlogChange() {
    let prFormData = this.prForm.value.prdetails
    if (prFormData.length == 0) {
      this.prForm.controls["dts"].reset(0)
      this.prForm.controls["mepno"].reset("")
      this.prForm.controls["mepnokey"].reset("")
      this.prForm.controls["productCategory"].reset("")
      this.prForm.controls["productType"].reset("")
      this.prForm.controls["product"].reset("")
      this.prForm.controls["items"].reset("")
      this.prForm.controls["productnoncatlog"].reset("")
      this.prForm.controls["itemnoncatlog"].reset("")
      this.prForm.controls["commodity"].reset("")
      this.prForm.controls["commodity_id"].reset("")
      this.prForm.controls["supplier"].reset("")
      this.prForm.controls["supplier_id"].reset("")
      this.prForm.controls["employee_id"].reset("")
      // this.prForm.controls["branch_id"].reset("");
      this.prForm.controls["unitprice"].reset("");
      this.prForm.controls["totalamount"].reset(0);
      this.ismep = false
      this.ismepdtl = false
      // (this.prForm.get('prdetails') as FormArray).clear();
    }
  }

  dtsValidation(event) {
    let prformValue = this.prForm.value.prdetails
    if (prformValue.length > 0) {
      event.preventDefault();
      event.stopPropagation();
      this.notification.showWarning("This action is not allowed Please delete Product if you want to change in Details below")
      return false;
    }
    if (prformValue.length == 0) {
      this.prForm.controls["productCategory"].reset("")
      this.prForm.controls["productType"].reset("")
      this.prForm.controls["product"].reset("")
      this.prForm.controls["items"].reset("")
      this.prForm.controls["productnoncatlog"].reset("")
      this.prForm.controls["itemnoncatlog"].reset("")
      this.prForm.controls["commodity"].reset("")
      this.prForm.controls["supplier"].reset("")
      // this.prForm.controls["branch_id"].reset("");
      this.prForm.controls["unitprice"].reset("");
    }
  }
  resetMepChange(){
    let prformValue = this.prForm.value.prdetails
    if (prformValue.length > 0) {
      this.notification.showWarning("This action is not allowed to add, Please delete Product if you want to change in Details below")
      return false;
    }
      this.prForm.controls["mepno"].reset("")
      this.ismepdtl = false
  }
  resetAfterMepChange() {
    let prformValue = this.prForm.value.prdetails
    if (prformValue.length > 0) {
      this.notification.showWarning("This action is not allowed to add, Please delete Product if you want to change in Details below")
      return false;
    }
    let prFormData = this.prForm.value.prdetails
    if (prFormData.length == 0) {
      this.prForm.controls["productCategory"].reset("")
      this.prForm.controls["productType"].reset("")
      this.prForm.controls["product"].reset("")
      this.prForm.controls["items"].reset("")
      this.prForm.controls["productnoncatlog"].reset("")
      this.prForm.controls["itemnoncatlog"].reset("")
      this.prForm.controls["commodity"].reset("")
      this.prForm.controls["supplier"].reset("")
      // this.prForm.controls["branch_id"].reset("");
      this.prForm.controls["unitprice"].reset("");
    }
  }
  resetAfterCommodityChange(type) {
    this.prForm.controls["productCategory"].reset("")
    this.prForm.controls["productType"].reset("")
    this.prForm.controls["product"].reset("")
    this.prForm.controls["items"].reset("")
    this.prForm.controls["productnoncatlog"].reset("")
    this.prForm.controls["itemnoncatlog"].reset("")
    this.prForm.controls["unitprice"].reset("");
    let prFormData = this.prForm.value.prdetails
    if (prFormData.length == 0) {
      this.prForm.controls["supplier"].reset("")
    }
    if( type == 'removecom'){
      this.prForm.controls["commodity"].reset("")
    }
    this.ismepdtl = false
  }

  resetAfterProdCatChange(type) {
    this.prForm.controls["productType"].reset("")
    this.prForm.controls["product"].reset("")
    this.prForm.controls["items"].reset("")
    this.prForm.controls["productnoncatlog"].reset("")
    this.prForm.controls["itemnoncatlog"].reset("")
    this.prForm.controls["unitprice"].reset("");
    let prFormData = this.prForm.value.prdetails
    if (prFormData.length == 0) {
      this.prForm.controls["supplier"].reset("")
    }
    if( type == 'removePC'){
      this.prForm.controls["productCategory"].reset("")
    }
  }

  resetAfterProdTypeChange(type) {
    this.prForm.controls["product"].reset("")
    this.prForm.controls["items"].reset("")
    this.prForm.controls["productnoncatlog"].reset("")
    this.prForm.controls["itemnoncatlog"].reset("")
    this.prForm.controls["unitprice"].reset("");
    let prFormData = this.prForm.value.prdetails
    if (prFormData.length == 0) {
      this.prForm.controls["supplier"].reset("")
    }
    if( type == 'removePT'){
      this.prForm.controls["productType"].reset("")
    }
  }
  resetAfterProductChange(type) {
    this.prForm.controls["items"].reset("")
    this.prForm.controls["productnoncatlog"].reset("")
    this.prForm.controls["itemnoncatlog"].reset("")
    this.prForm.controls["unitprice"].reset("");
    let prFormData = this.prForm.value.prdetails
    if (prFormData.length == 0) {
      this.prForm.controls["supplier"].reset("")
    }
    if( type == 'removeProd'){
      this.prForm.controls["product"].reset("")
    }
    
  }
  resetAfterItemChange(){
    this.prForm.controls["items"].reset("")
    this.prForm.controls["unitprice"].reset("");
  }
  resetAfterSupplierChange(){
    this.prForm.controls["supplier"].reset("")
    this.prForm.controls["unitprice"].reset("");
  }
  resetAfterBranchChange(){
    this.prForm.controls["branch_id"].reset("");
  }




  /////////////////////////////////////////////////////////////////////////// Add / Delete
  FormGroupArray: any
  mepid: any;
  ismepdtl: any;
  ismep: boolean;
  ForCatlog: boolean


  get prdetails(): FormGroup {
    let catlogOrNonCatlogtype = this.prForm.value.type
    console.log("this.prForm.value",this.prForm.value)
    if (catlogOrNonCatlogtype == '1') {
      this.ForCatlog = true

      let FormGroupArray = this.fb.group({
        capitialized: 0,
        hsn: 0,
        hsnrate: 0,
        images: "",
        installationrequired: 0,
        item: this.prForm.value.itemsid,
        item_name: this.prForm.value.items.name,
        product_id: this.prForm.value.product.id,
        product_name: this.prForm.value.product.name,
        qty: '',
        unitprice: this.prForm.value.unitprice,
        amount: 0,
        uom: this.prForm.value.uom,
        supplier_id: this.prForm.value.supplier.id,
        is_asset: 0,

        //duplicate form control
        suppliername: this.prForm.value.supplier.name,
        commodityname: this.prForm.value.commodity.name,
        itemname: this.prForm.value.items.name,
        productname: this.prForm.value.product.name,
        branch: this.prForm.value.branch_id.name,
        editable: false,

        /////// form array prccbs
        prccbs: this.fb.array([
          // this.prccbs
        ]),
      })
      FormGroupArray.get('qty').valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        console.log("should be called first")
        this.calcTotal(FormGroupArray)
        // this.calcTotalOnIndex(this.indexDet)
        if (!this.prForm.valid) {
          return;
        }
        this.linesChange.emit(this.prForm.value['prdetails']);
      }
      )
      FormGroupArray.get('unitprice').valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        console.log("should be called first")
        this.calcTotal(FormGroupArray)
        // this.calcTotalOnIndex(this.indexDet)
        if (!this.prForm.valid) {
          return;
        }
        this.linesChange.emit(this.prForm.value['prdetails']);
      }
      )
      return FormGroupArray
    }

    if (catlogOrNonCatlogtype == '2') {
      this.ForCatlog = false
      let FormGroupArray = this.fb.group({
        capitialized: 0,
        hsn: 0,
        hsnrate: 0,
        images: "",
        installationrequired: 0,
        item: "",
        item_name: this.prForm.value.itemnoncatlog,
        product_id:this.prForm.value.product.id,
        product_name: this.prForm.value.product.name,
        qty: '',
        amount: 0,
        unitprice: 0,
        uom: this.prForm.value.uom.name,
        supplier_id: this.prForm.value.supplier.id,
        is_asset: 0,
        //duplicate form control
        suppliername: this.prForm.value.supplier.name,
        commodityname: this.prForm.value.commodity.name,
        itemname: this.prForm.value.itemnoncatlog,
        productname: this.prForm.value.product.name,
        branch: this.prForm.value.branch_id.name,
        //prccbs
        prccbs: this.fb.array([
          // this.prccbs
        ]),
      })

      FormGroupArray.get('uom').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.prposervice.getuomFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.uomlist = datas;
        this.linesChange.emit(this.prForm.value['prdetails']);
      })

      FormGroupArray.get('qty').valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        console.log("should be called first")
        this.calcTotal(FormGroupArray)
        // this.calcTotalOnIndex(this.indexDet)
        if (!this.prForm.valid) {
          return;
        }
        this.linesChange.emit(this.prForm.value['prdetails']);
      }
      )
      FormGroupArray.get('unitprice').valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        console.log("should be called first")
        this.calcTotal(FormGroupArray)
        // this.calcTotalOnIndex(this.indexDet)
        if (!this.prForm.valid) {
          return;
        }
        this.linesChange.emit(this.prForm.value['prdetails']);
      }
      )
      return FormGroupArray
    }


    // return FormGroupArray
  }

  public displayFnuom(uomtype?: uomlistsss): string | undefined {
    return uomtype ? uomtype.name : undefined;
  }

  get uomtype() {
    return this.prForm.get('uom');
  }

  getuom() {
    this.prposervice.getuomFK('')
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.uomlist = datas;


      })
  }

  uomScroll() {
    setTimeout(() => {
      if (
        this.matuomAutocomplete &&
        this.matuomAutocomplete &&
        this.matuomAutocomplete.panel
      ) {
        fromEvent(this.matuomAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matuomAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matuomAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matuomAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matuomAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.prposervice.getuomFKdd(this.uomInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.uomlist.length >= 0) {
                      this.uomlist = this.uomlist.concat(datas);
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



  get prccbs(): FormGroup {
    let fgccbs = this.fb.group({
      branch_id: '',
      bs: '',
      cc: '',
      qty: 0,
    })

    fgccbs.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.prposervice.getbranchFK(value, 1)
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


    fgccbs.get('bs').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.prposervice.getbsFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bslist = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


    fgccbs.get('cc').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.prposervice.getcclistDependentBsdd(this.prForm.get('prdetails')['controls'][this.seletedPRdetailsIndex].get('prccbs')['controls'][this.selectedCCBSindex].value.bs.id, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cclist = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    fgccbs.get('qty').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      console.log("qty")
      this.checkqtyvalue()

    }
    )

    return fgccbs
  }

  getPrccbsIndex(index) {
    this.selectedCCBSindex = index
    console.log("this.selectedCCBSindex", this.selectedCCBSindex)
  }


  validationAdd() {
    const control = <FormArray>this.prForm.get('prdetails');
    control.push(this.prdetails);
    this.Options = true
    this.mepreadonly = true
    this.branchreadonly = true
    this.comreadonly = true
  }




  addProduct() {
    let PRFormData = this.prForm.value
    let PRFormdetailsData = this.prForm.value.prdetails
    if (PRFormdetailsData.length > 0) {
      if (this.prForm.value.commodity_id != this.prForm.value.commodity.id) {
        this.notification.showWarning("Please Choose Same Commodity")
        return false
      }
    }
    if (PRFormdetailsData.length > 0) {
      if (this.prForm.value.supplier_id != this.prForm.value.supplier.id) {
        this.notification.showWarning("Please Choose Same Supplier")
        return false
      }
    }
    if (PRFormdetailsData.length > 0) {
      if (this.prForm.value.mepno != this.prForm.value.mepnokey) {
        this.notification.showWarning("Please Choose Same MEP")
        return false
      }
    }
    if ((PRFormData.mepno == "") || (PRFormData.mepno == null) || (PRFormData.mepno == undefined)) {
      this.ismep = false
      this.ismepdtl = false
    }
    else {
      this.ismep = true
      this.ismepdtl = true
    }

    if (PRFormData.type == 1) {




      if (PRFormData.product == "") {
        this.notification.showWarning("Please Choose Product")
        return false
      }
      if (typeof (PRFormData.product) == 'string') {
        this.notification.showWarning("Please Choose Product")
        return false
      }
      if (PRFormData.items == "") {
        this.notification.showWarning("Please Choose Items")
        return false
      }

      if (PRFormData.commodity == "") {
        this.notification.showWarning("Please Choose Commodity")
        return false
      }

      if (PRFormData.supplier == "") {
        this.notification.showWarning("Please Choose Supplier")
        return false
      }

      if (PRFormdetailsData.length > 0) {
        for (let duplicateFind in PRFormdetailsData) {
          // console.log("PRFormdetailsData[duplicateFind].product_id " +duplicateFind +" index "+PRFormdetailsData[duplicateFind].product_id)
          // console.log("PRFormData.product.id "+duplicateFind +" index "+ PRFormData.product.id)
          // console.log("PRFormdetailsData[duplicateFind].item "+duplicateFind +" index "+ PRFormdetailsData[duplicateFind].item)
          // console.log("PRFormData.items.id "+duplicateFind +" index "+PRFormData.itemsid)
          if ((PRFormdetailsData[duplicateFind].product_id == PRFormData.product.id) && (PRFormdetailsData[duplicateFind].item == PRFormData.itemsid)) {
            this.notification.showWarning(" 'Already Choosen',  Duplicate Product and Item ")
            return false
          }
        }

      }




    }
    if (PRFormData.type == 2) {
      if (PRFormData.product == "") {
        this.notification.showWarning("Please Choose Product")
        return false
      }
      if (PRFormData.itemnoncatlog == "") {
        this.notification.showWarning("Please Choose Item / Model")
        return false
      }
      if (PRFormData.commodity == "") {
        this.notification.showWarning("Please Choose Commodity")
        return false
      }
      if (PRFormData.supplier == "") {
        this.notification.showWarning("Please Choose Supplier")
        return false
      }
    }

    if (PRFormdetailsData.length == 0) {
      let supplierID = this.prForm.value.supplier.id
      let commodityID = this.prForm.value.commodity.id
      let mepnovalue = this.prForm.value.mepno

      this.prForm.patchValue({
        supplier_id: supplierID,
        commodity_id: commodityID,
        mepnokey: mepnovalue
      })
    }
    if (PRFormData.branch_id == "") {
      this.notification.showWarning("Please Choose Branch")
      return false
    }


    this.validationAdd()
  }

  deleteProduct(index: number) {
    (<FormArray>this.prForm.get('prdetails')).removeAt(index);
    this.files.value.file_upload.splice(index)

    let lengthCheckForRefreshData = this.prForm.value.prdetails
    let lengthval = lengthCheckForRefreshData.length
    if (lengthval === 0) {
      this.mepreadonly = false
      this.branchreadonly = false
      this.supplierreadonly = false
      this.comreadonly = false

      this.Options = false
      this.prForm.controls["commodity_id"].reset("");
      this.prForm.controls["supplier_id"].reset("");
    }
    this.datasums()

  }

  addccbs(userIndex: number, data?: any) {
    console.log('userIndex', userIndex, '-------', 'data', data);
    (<FormArray>(<FormGroup>(<FormArray>this.prForm.controls['prdetails'])
      .controls[userIndex]).controls['prccbs']).push(this.prccbs);
      let BSpatchValue = data[0].prccbs[0]?.bs 
      let CCpatchValue = data[0].prccbs[0]?.cc 
      console.log("BSpatchValue", BSpatchValue)
      console.log("CCpatchValue", CCpatchValue)
      let branchdata = this.prForm.value.prdetails[userIndex].prccbs.length
      this.prForm.get('prdetails')['controls'][userIndex].get('prccbs')['controls'][branchdata -1].get('branch_id').setValue(this.empBranchdata)
      this.prForm.get('prdetails')['controls'][userIndex].get('prccbs')['controls'][branchdata -1].get('bs').setValue(BSpatchValue)
      this.prForm.get('prdetails')['controls'][userIndex].get('prccbs')['controls'][branchdata -1].get('cc').setValue(CCpatchValue)


      if(branchdata == 1){
        this.prForm.get('prdetails')['controls'][userIndex].get('prccbs')['controls'][0].get('qty').setValue(this.RequiredQtyForThisccbs)
      }

      


  }

  deleteccbs(userIndex: number, index: number) {
    console.log('userIndex', userIndex, '-------', 'index', index);
    (<FormArray>(<FormGroup>(<FormArray>this.prForm.controls['prdetails'])
      .controls[userIndex]).controls['prccbs']).removeAt(index);
    this.checkqtyvalue()
  }



































  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////EDIT Function
  patchForm(id): void {
    this.SpinnerService.show();
    this.prposervice.getpredit(id)
      .subscribe((results) => {
        this.SpinnerService.hide();
        let datas = results;
        console.log("dattat", datas)
        this.prForm.patchValue({
          type: datas.type.id,
          branch_id: datas.branch_id,
          commodity: datas.commodity_id,
          commodity_id: datas.commodity_id.id,
          mepno: datas.mepno,
          mepnokey: datas.mepno,
          dts: datas.dts,
          totalamount: datas.totalamount,
          notepad: datas.notepad
        })
        this.DataToDisableOnPatch()
        this.getmepdtl()
        this.loadForm(datas);
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  loadForm(data) {
    console.log("datadata",data)
    let catlogOrNonCatlogtype = data.type.id
    if (catlogOrNonCatlogtype == 1) {
      this.ForCatlog = true
    }
    if (catlogOrNonCatlogtype == 2) {
      this.ForCatlog = false
    }
    for (let prdet of data.prdetails) {
      let amount: FormControl = new FormControl('');
      let capitialized: FormControl = new FormControl('');
      let hsn: FormControl = new FormControl('');
      let hsnrate: FormControl = new FormControl(0);
      let images: FormControl = new FormControl('');
      let installationrequired: FormControl = new FormControl('');
      let item: FormControl = new FormControl('');
      let item_name: FormControl = new FormControl('');
      let product_id: FormControl = new FormControl('');
      let product_name: FormControl = new FormControl('');
      let qty: FormControl = new FormControl('');
      let supplier_id: FormControl = new FormControl('');
      let unitprice: FormControl = new FormControl('');
      let uom: FormControl = new FormControl('');
      let is_asset: FormControl = new FormControl('');
      //duplicate form control
      let suppliername: FormControl = new FormControl('');
      let commodityname: FormControl = new FormControl('');
      let itemname: FormControl = new FormControl('');
      let productname: FormControl = new FormControl('');
      let branch: FormControl = new FormControl('');
      let editable: FormControl = new FormControl('');
      let idControl: FormControl = new FormControl('');
      const prdetFormArray = this.prForm.get("prdetails") as FormArray;
      idControl.setValue(prdet.id);
      console.log("dataaaasss",data)
      console.log("prdet",prdet)
      if (data.type.id == 1) {
        productname.setValue(prdet.product_name)
        product_id.setValue(prdet.product_id.id)
        product_name.setValue("")
      }
      else if (data.type.id == 2) {
        // productname.setValue(prdet.product_name)
        // product_name.setValue(prdet.product_name)
        // product_id.setValue("")
        productname.setValue(prdet.product_name)
        product_id.setValue(prdet.product_id.id)
        product_name.setValue("")
      }
      if (data.type.id == 1) {
        itemname.setValue(prdet.item_name)
        item.setValue(prdet.item)
        item_name.setValue("")
      }
      if (data.type.id == 2) {
        itemname.setValue(prdet.item_name)
        item_name.setValue(prdet.item_name)
        item.setValue("")
      }
      this.prForm.patchValue({
        supplier_id: prdet.supplier_id.id,
        supplier: prdet.supplier_id
      })
      supplier_id.setValue(prdet.supplier_id.id)
      suppliername.setValue(prdet.supplier_id.name);
      commodityname.setValue(data.commodity_id.name);
      editable.setValue(false)
      hsn.setValue(0);
      hsnrate.setValue(0);
      images.setValue(prdet.images);
      uom.setValue(prdet.uom)
      branch.setValue(data.branch_id.name)
      amount.setValue(prdet.amount);
      qty.setValue(prdet.qty);
      unitprice.setValue(prdet.unitprice);
      amount.setValue(prdet.qty * prdet.unitprice);
      installationrequired.setValue(prdet.installationrequired);
      capitialized.setValue(prdet.capitialized);


      let isassert = null
      if (prdet.is_assert == 'Y') {
        isassert = 1
      } else {
        isassert = 0
      }
      is_asset.setValue(isassert);
      prdetFormArray.push(new FormGroup({
        product_id: product_id,
        supplier_id: supplier_id,
        qty: qty,
        unitprice: unitprice,
        installationrequired: installationrequired,
        capitialized: capitialized,
        amount: amount,
        hsn: hsn,
        hsnrate: hsnrate,
        images: images,
        item: item,
        item_name: item_name,
        product_name: product_name,
        uom: uom,
        is_asset: is_asset,
        editable: editable,
        //duplicate form control
        suppliername: suppliername,
        commodityname: commodityname,
        itemname: itemname,
        productname: productname,
        branch: branch,
        id: idControl,

        prccbs: this.setccbs(prdet.prccbs)

      }
      )
      )
      this.calcTotalpatch(unitprice, qty, amount)
      unitprice.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        console.log("should be called first")
        this.calcTotalpatch(unitprice, qty, amount)
        if (!this.prForm.valid) {
          return;
        }
        this.linesChange.emit(this.prForm.value['prdetails']);
      }
      )

      qty.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        console.log("should be called first")
        this.calcTotalpatch(unitprice, qty, amount)
        if (!this.prForm.valid) {
          return;
        }
        this.linesChange.emit(this.prForm.value['prdetails']);
      }
      )
    }
  }
  setccbs(prccbs) {
    console.log("prccbs after", prccbs)
    let arr = new FormArray([])
    for (let ccbs of prccbs) {
      let branch_id: FormControl = new FormControl('');
      let bs: FormControl = new FormControl('');
      let cc: FormControl = new FormControl('');
      let qty: FormControl = new FormControl('');
      let code: FormControl = new FormControl('');
      let idccbsControl: FormControl = new FormControl('');
      branch_id.setValue(ccbs.branch_id);
      bs.setValue(ccbs.bs);
      cc.setValue(ccbs.cc);
      qty.setValue(ccbs.qty);
      code.setValue(ccbs.code);
      idccbsControl.setValue(ccbs.id);
      arr.push(new FormGroup({
        branch_id: branch_id,
        bs: bs,
        cc: cc,
        qty: qty,
        code: code,
        id: idccbsControl
      }
      )
      )
      branch_id.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.prposervice.getbranchFK(value, 1)
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
      bs.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.prposervice.getbsFKdd(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.bslist = datas;
        },(error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
      cc.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.prposervice.getcclistDependentBsdd(this.prForm.get('prdetails')['controls'][this.seletedPRdetailsIndex].get('prccbs')['controls'][this.selectedCCBSindex].value.bs.id, value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.cclist = datas;
        },(error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
      qty.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        console.log("qty")
        this.checkqtyvalue()
      }
      )
    }
    this.CatlogOrNotCatlog()
    return arr;
  }


  DataToDisableOnPatch() {
    let formData = this.prForm.value.type
    this.Options = true
    if ((formData == 2) || (formData == "2")) {
      this.prForm.get('productCategory').disable();
      this.prForm.get('productType').disable();
    }

  }


  indexvalueOnprdetails(index) {
    this.indexDet = index
  }

  calcTotalOnIndex(index) {
    let dataOnDetails = this.prForm.value.prdetails
    let qtyvalue = +dataOnDetails[index].qty
    let unitpricevalue = +dataOnDetails[index].unitprice
    let amountValue = +(qtyvalue * unitpricevalue)
    this.prForm.get('prdetails')['controls'][index].get('amount').setValue(amountValue)
    this.datasums();
  }







  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////Bulk Upload 

  downloadFileXLSXprTemplate() {
    this.SpinnerService.show();
    this.prposervice.DownloadExcel()
      .subscribe((results) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "Non Catelog PR Template.xlsx"
        link.click();
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  UPloadCSVFileData: any
  errorXLSXList: any
  ErrorMSgDivBulk: boolean



  onFileSelectedBulkUpload(e) {
    let dataFilevalue = e.target.files[0]
    this.UPloadCSVFileData = dataFilevalue
  }

  UploadCsv() {
    this.SpinnerService.show()
    let FilesRequiredData = this.prForm.value
    if (!FilesRequiredData.commodity) {
      this.SpinnerService.hide();
      this.notification.showWarning("Choose Commodity")
      return false
    }

    if (!FilesRequiredData.supplier) {
      this.SpinnerService.hide();
      this.notification.showWarning("Choose Supplier")
      return false
    }

    if (!FilesRequiredData.branch_id) {
      this.SpinnerService.hide();
      this.notification.showWarning("Choose Branch")
      return false
    }
    if ((this.UPloadCSVFileData == "") || (this.UPloadCSVFileData == null) || (this.UPloadCSVFileData == undefined)) {
      this.SpinnerService.hide();
      this.notification.showWarning("Please select file for bulk upload")
      return false
    }
    let datalengthCheck = this.prForm.value.prdetails
    if (datalengthCheck.length > 0) {
      this.SpinnerService.hide();
      this.notification.showWarning("Bulk Upload not allowed once filled details below ")
      return false
    }

    let data = {
      commodity_id: FilesRequiredData.commodity.id,
      supplier_id: FilesRequiredData.supplier.id,
      branch_id: FilesRequiredData.branch_id.id
    }

    this.SpinnerService.show();
    this.prposervice.BulkUploadPR(data, this.UPloadCSVFileData)
      .subscribe((results) => {
        this.SpinnerService.hide();
        let datas = results
        if (results.code === "INVALID_DATA" && results.description === "Invalid Data or DB Constraint") {
          this.SpinnerService.hide();
          this.notification.showError("Template has no correct format data!!")
          return false;
        }
        if (results) {
          for (let errorOrData in results) {
            if (results[errorOrData].error) {
              this.errorXLSXList = results
              console.log(" error from bulk ", this.errorXLSXList)
              this.ErrorMSgDivBulk = true
              this.SpinnerService.hide();
              return false
            }
            else {
              this.patchBulkUploadDataInForm(results)
              console.log("data to patch", results)
              this.ErrorMSgDivBulk = false
              this.SpinnerService.hide();
              return false
            }
          }
        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  patchBulkUploadDataInForm(data) {
    this.prForm.patchValue({
      mepno: this.prForm.value.mepno,
      mepnokey: this.prForm.value.mepno,
      commodity_id: this.prForm.value.commodity.id,
      supplier_id: this.prForm.value.supplier.id
    })
    this.mepreadonly = true
    this.branchreadonly = true
    this.supplierreadonly = true
    this.comreadonly = true

    for (let prdet of data.data) {
      let amount: FormControl = new FormControl('');
      let capitialized: FormControl = new FormControl('');
      let images: FormControl = new FormControl('');
      let installationrequired: FormControl = new FormControl('');
      let item: FormControl = new FormControl('');
      let item_name: FormControl = new FormControl('');
      let product_id: FormControl = new FormControl('');
      let product_name: FormControl = new FormControl('');
      let qty: FormControl = new FormControl('');
      let supplier_id: FormControl = new FormControl('');
      let unitprice: FormControl = new FormControl('');
      let uom: FormControl = new FormControl('');
      let is_asset: FormControl = new FormControl('');
      let editable: FormControl = new FormControl('');
      //duplicate form control
      let suppliername: FormControl = new FormControl('');
      let commodityname: FormControl = new FormControl('');
      let itemname: FormControl = new FormControl('');
      let productname: FormControl = new FormControl('');
      let branch: FormControl = new FormControl('');
      // let idControl: FormControl = new FormControl('');
      const prdetFormArray = this.prForm.get("prdetails") as FormArray;
      productname.setValue(prdet.product_name)
      product_name.setValue(prdet.product_name)
      product_id.setValue(prdet.product_id)
      itemname.setValue(prdet.item_name)
      item.setValue(prdet.item)
      item_name.setValue(prdet.item_name)
      supplier_id.setValue(prdet.supplier_id)
      suppliername.setValue(this.prForm.value.supplier.name);
      commodityname.setValue(this.prForm.value.commodity.name);
      images.setValue(prdet.images);
      uom.setValue(prdet.uom)
      editable.setValue(false)
      branch.setValue(this.prForm.value.branch_id.name)
      amount.setValue(prdet.amount);
      qty.setValue(prdet.qty);
      unitprice.setValue(prdet.unitprice);
      amount.setValue(prdet.qty * prdet.unitprice);
      let install = null
      let capitalize = null
      if (prdet.installationrequired == 'Y') {
        install = 1
      } else {
        install = 0
      }
      if (prdet.capitialized == 'Y') {
        capitalize = 1
      } else {
        capitalize = 0
      }

      let isassert = null
      if (prdet.is_assert == 'Y') {
        isassert = 1
      } else {
        isassert = 0
      }

      // is_asset.setValue(isassert);
      is_asset.setValue(0);
      installationrequired.setValue(install);
      capitialized.setValue(capitalize);

      prdetFormArray.push(new FormGroup({
        product_id: product_id,
        supplier_id: supplier_id,
        qty: qty,
        unitprice: unitprice,
        installationrequired: installationrequired,
        capitialized: capitialized,
        amount: amount,
        images: images,
        item: item,
        item_name: item_name,
        product_name: product_name,
        uom: uom,
        is_asset: is_asset,
        editable: editable,
        //duplicate form control
        suppliername: suppliername,
        commodityname: commodityname,
        itemname: itemname,
        productname: productname,
        branch: branch,

        prccbs: this.setccbsBulk(prdet.prccbs)

      }
      )
      )
      this.calcTotalpatch(unitprice, qty, amount)
      unitprice.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        console.log("should be called first")
        this.calcTotalpatch(unitprice, qty, amount)
        if (!this.prForm.valid) {
          return;
        }
        this.linesChange.emit(this.prForm.value['prdetails']);
      }
      )

      qty.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        console.log("should be called first")
        this.calcTotalpatch(unitprice, qty, amount)
        if (!this.prForm.valid) {
          return;
        }
        this.linesChange.emit(this.prForm.value['prdetails']);
      }
      )
    }
  }
  setccbsBulk(prccbs) {
    console.log("prccbs after", prccbs)
    let arr = new FormArray([])
    for (let ccbs of prccbs) {
      let branch_id: FormControl = new FormControl('');
      let bs: FormControl = new FormControl('');
      let cc: FormControl = new FormControl('');
      let qty: FormControl = new FormControl('');
      let code: FormControl = new FormControl('');
      branch_id.setValue(ccbs.branch_id);
      bs.setValue(ccbs.bs);
      cc.setValue(ccbs.cc);
      qty.setValue(ccbs.qty);
      code.setValue(ccbs.code);
      arr.push(new FormGroup({
        branch_id: branch_id,
        bs: bs,
        cc: cc,
        qty: qty,
        code: code
      }
      )
      )
    }
    this.DataToDisableOnPatch()
    this.getmepdtl()
    return arr;
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////mep
  public displayFnMep(MEP?: any) {
    if (typeof (MEP) == "string") {
      return MEP
    }
    return MEP ? this.MEPList.find(_ => _.mepno == MEP).mepno : undefined;
  }
  getmepFK() {
    this.SpinnerService.show();
    this.prposervice.getmepFK("")
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.MEPList = datas;
        this.SpinnerService.hide();
        console.log("mepList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  currentpagemep = 1
  has_nextmep = true;
  has_previousmep = true;
  mepcurrentpage = 0;
  autocompleteMepScroll() {
    setTimeout(() => {
      if (
        this.matmepAutocomplete &&
        this.autocompleteTrigger &&
        this.matmepAutocomplete.panel
      ) {
        fromEvent(this.matmepAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matmepAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matmepAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matmepAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matmepAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 50 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextmep == true ) {
                if(this.mepcurrentpage == this.currentpagemep){
                  return false 
                }
                this.prposervice.getmepFKdd(this.mepinput.nativeElement.value, this.currentpagemep + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.MEPList = this.MEPList.concat(datas);
                    if (this.MEPList.length > 0) {
                      this.has_nextmep = datapagination.has_next;
                      this.has_previousmep = datapagination.has_previous;
                      this.currentpagemep = datapagination.index;
                      this.mepcurrentpage = datapagination.index + 1
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

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////product category
  public displayFnproductCategory(prodcat?: productCategoryLists): string | undefined {
    return prodcat ? prodcat.name : undefined;
  }
  DisabledMep = false
  getprodcatkeyFK() {
    this.SpinnerService.show();
    let comData = this.prForm.value.commodity.id
    this.prposervice.getproductCategory(comData)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        if (datas.length == 0) {
          this.notification.showInfo("No Records Found ")
        }
        this.SpinnerService.hide();
        this.productCategoryList = datas;
        console.log("prod cat", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  currentpageprodcat = 1
  has_nextprodcat = true;
  has_previousprodcat = true;
  autocompleteproductCategoryScroll() {
    setTimeout(() => {
      if (
        this.matproductCategoryAutocomplete &&
        this.autocompleteTrigger &&
        this.matproductCategoryAutocomplete.panel
      ) {
        fromEvent(this.matproductCategoryAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matproductCategoryAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matproductCategoryAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matproductCategoryAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matproductCategoryAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextprodcat === true) {
                this.prposervice.getproductCategoryFKdd(this.prForm.value.commodity.id, this.productCategoryInput.nativeElement.value, this.currentpageprodcat + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.productCategoryList = this.productCategoryList.concat(datas);
                    if (this.productCategoryList.length >= 0) {
                      this.has_nextprodcat = datapagination.has_next;
                      this.has_previousprodcat = datapagination.has_previous;
                      this.currentpageprodcat = datapagination.index;
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

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////product type

  public displayFnproductType(prodsubcat?: productTypeLists): string | undefined {
    return prodsubcat ? prodsubcat.name : undefined;
  }
  getproductTypeFK() {
    this.SpinnerService.show();
    let commoditydata = this.prForm.value.commodity.id
    let productCatIddata = this.prForm.value.productCategory?.id
    this.prposervice.getproductTypeFK(commoditydata, productCatIddata, '')
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        if (datas.length == 0) {
          this.notification.showInfo("No Records Found ")
        }
        this.SpinnerService.hide();
        this.productTypeList = datas;
        console.log("productType", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    // this.resetAfterProdCatChange()
  }
  currentpageprodsubcat = 1
  has_nextprodsubcat = true;
  has_previousprodsubcat = true;
  autocompleteproductTypeScroll() {
    setTimeout(() => {
      if (
        this.matproductTypeAutocomplete &&
        this.autocompleteTrigger &&
        this.matproductTypeAutocomplete.panel
      ) {
        fromEvent(this.matproductTypeAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matproductTypeAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matproductTypeAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matproductTypeAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matproductTypeAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextprodsubcat === true) {
                this.prposervice.getproductTypeFKdd(this.prForm.value.commodity.id, this.prForm.value.productCategory.id, this.productTypeinput.nativeElement.value, this.currentpageprodsubcat + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.productTypeList = this.productTypeList.concat(datas);
                    if (this.productTypeList.length >= 0) {
                      this.has_nextprodsubcat = datapagination.has_next;
                      this.has_previousprodsubcat = datapagination.has_previous;
                      this.currentpageprodsubcat = datapagination.index;
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

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////product

  public displayFnproduct(prod?: productLists): string | undefined {
    return prod ? prod.name : undefined;
  }

  getproductFK() {
    this.SpinnerService.show();
    let commodity = this.prForm.value.commodity.id
    let productCat = this.prForm.value.productCategory.id
    let prodType = this.prForm.value.productType.id
    let Dts = this.prForm.value.dts
    this.prposervice.getproductDependencyFK(commodity, productCat, prodType, Dts, "")
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        if (datas.length == 0) {
          this.notification.showInfo("No Records Found")
        }
        this.productList = datas;
        console.log("product", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  currentpageprod = 1
  has_nextprod = true;
  has_previousprod = true;
  autocompleteproductScroll() {
    setTimeout(() => {
      if (
        this.matproductAutocomplete &&
        this.autocompleteTrigger &&
        this.matproductAutocomplete.panel
      ) {
        fromEvent(this.matproductAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matproductAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matproductAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matproductAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matproductAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextprod === true) {
                this.prposervice.getproductDependencyFKdd(this.prForm.value.commodity.id, this.prForm.value.productCategory.id, this.prForm.value.productType.id, this.prForm.value.dts, this.productInput.nativeElement.value, this.currentpageprod + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.productList = this.productList.concat(datas);
                    if (this.productList.length >= 0) {
                      this.has_nextprod = datapagination.has_next;
                      this.has_previousprod = datapagination.has_previous;
                      this.currentpageprod = datapagination.index;
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
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////items
  public displayFnitem(item?: itemsLists): string | undefined {
    return item ? item.name : undefined;
  }
  getitemFK() {
    // this.SpinnerService.show();
    let product = this.prForm.value.product.id
    let dts = this.prForm.value.dts
    let supplier = this.prForm.value.supplier
    this.SpinnerService.show();
    this.prposervice.getitemsDependencyFK(product, dts, supplier)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        if (datas.length == 0) {
          this.notification.showInfo("No Records Found")
        }
        this.itemList = datas;
        console.log("product", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  // getitemUnitPrice(data) {
  //   this.prForm.patchValue({
  //     unitprice: data.unitprice
  //   })
  // }
  currentpageitem = 1
  has_nextitem = true;
  has_previousitem = true;
  autocompleteitemScroll() {
    setTimeout(() => {
      if (
        this.matitemAutocomplete &&
        this.autocompleteTrigger &&
        this.matitemAutocomplete.panel
      ) {
        fromEvent(this.matitemAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matitemAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matitemAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matitemAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matitemAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextitem === true) {
                this.prposervice.getitemsDependencyFKdd(this.prForm.value.product.id, this.prForm.value.dts, this.itemInput.nativeElement.value, this.prForm.value.supplier, this.currentpageitem + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.itemList = this.itemList.concat(datas);
                    if (this.itemList.length >= 0) {
                      this.has_nextitem = datapagination.has_next;
                      this.has_previousitem = datapagination.has_previous;
                      this.currentpageitem = datapagination.index;
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

  //////////////////////////////////////////////////////////////////////////////////////////////commodity

  public displayFncommodity(commodity?: commoditylistss): string | undefined {
    return commodity ? commodity.name : undefined;
  }
  getCommodityFK() {
    if(this.prForm.value.prdetails.length >0 ){
      this.notification.showWarning("Here after, Commodity is not allowed to choose!!. If you want to change Commodity please DELETE the Product Below ")
      return false;
    }
    this.SpinnerService.show();
    let productData = this.prForm.value.mepno
    this.prposervice.getcommodityDependencyFK(productData, "")
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.commodityList = datas;
        console.log("product", datas)
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
                this.prposervice.getcommodityDependencyFKdd(this.prForm.value.mepno, this.commodityInput.nativeElement.value, this.currentpagecom + 1)
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

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////supplier
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
                this.prposervice.getsupplierDependencyFKdd(this.prForm.value.product.id, this.prForm.value.items.name, this.supplierInput.nativeElement.value, this.currentpagesupplier + 1, this.prForm.value.type, this.prForm.value.dts)
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

    let itemkeyvalue = this.prForm.value.items.name
    let productID = this.prForm.value.product.id
    let type = this.prForm.value.type
    let dts = this.prForm.value.dts
    if (this.prForm.value.type == 1) {
      // if ((itemkeyvalue == "") || (itemkeyvalue == null) || (itemkeyvalue == undefined)) {
      //   return false
      // }
      this.SpinnerService.show()
      this.prposervice.getsupplierDependencyFK(productID, itemkeyvalue, type, dts)
        .subscribe((results: any[]) => {
          let datas = results["data"]
          this.SpinnerService.hide()
          if (datas.length == 0) {
            this.notification.showInfo("No Records Found")
          }
          this.supplierList = datas;
          console.log("supplierList", datas)
        },(error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }
    if (this.prForm.value.type == 2) {
      this.SpinnerService.show()
      this.prposervice.getsupplierDependencyFK(itemkeyvalue, itemkeyvalue, type, dts)
        .subscribe((results: any[]) => {
          let datas = results["data"]
          this.SpinnerService.hide()
          this.supplierList = datas;
          console.log("supplierList", datas)
        },(error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }
  }

  getUnitprice() {
    let typedata = this.prForm.value.type
    if (typedata == 1) {
      let supplierdata = this.prForm.value.supplier.id
      let itemsname = this.prForm.value.items.name
      let productID = this.prForm.value.product.id
      if ((itemsname == "") || (itemsname == null) || (itemsname == undefined)) {
        return false
      }
      if ((supplierdata == "") || (supplierdata == null) || (supplierdata == undefined)) {
        return false
      }
      this.SpinnerService.show()
      this.prposervice.gettingUnitpricePR(itemsname, supplierdata, productID)
        .subscribe(results => {
          this.SpinnerService.hide()
          let data = results['data']
          this.prForm.patchValue({
            unitprice: data[0].unitprice,
            itemsid: data[0].id,
            uom: data[0].uom.name
          })
        },(error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }
  }
  // getSupplierUnitPrice(data) {
  //   this.prForm.patchValue({
  //     unitprice: data.unit_price
  //   })
  // }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// branch

  public displayFnbranch(branch?: branchlistss): any | undefined {
    return branch ? branch.code + "-" + branch.name : undefined;
  }

  getbranchFK() {
    this.SpinnerService.show()
    this.prposervice.getbranchdd()
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
                this.prposervice.getbranchFK(this.branchInput.nativeElement.value, this.currentpagebranch + 1)
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

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////bs
  currentpagebs = 1
  has_nextbs = true;
  has_previousbs = true;
  getbsdd() {
    this.SpinnerService.show();
    this.prposervice.getbsvaluedd()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        this.bslist = datas;
        console.log("bslist", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  autocompletebsScroll() {
    setTimeout(() => {
      if (
        this.matbsAutocomplete &&
        this.autocompleteTrigger &&
        this.matbsAutocomplete.panel
      ) {
        fromEvent(this.matbsAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbsAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbsAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbsAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbsAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbs === true) {
                this.prposervice.getbsFKdd(this.bsInput.nativeElement.value, this.currentpagebs + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.bslist = this.bslist.concat(datas);
                    if (this.bslist.length >= 0) {
                      this.has_nextbs = datapagination.has_next;
                      this.has_previousbs = datapagination.has_previous;
                      this.currentpagebs = datapagination.index;
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

  public displayFnbs(bs?: bslistss): any | undefined {
    if ((typeof bs) === 'string') {
      return bs
    }
    return bs ? bs.name : undefined;
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////cc

  autocompleteccScroll() {
    // setTimeout(() => {
    //   if (
    //     this.matccAutocomplete &&
    //     this.autocompleteTrigger &&
    //     this.matccAutocomplete.panel
    //   ) {
    //     fromEvent(this.matccAutocomplete.panel.nativeElement, 'scroll')
    //       .pipe(
    //         map(x => this.matccAutocomplete.panel.nativeElement.scrollTop),
    //         takeUntil(this.autocompleteTrigger.panelClosingActions)
    //       )
    //       .subscribe(x => {
    //         const scrollTop = this.matccAutocomplete.panel.nativeElement.scrollTop;
    //         const scrollHeight = this.matccAutocomplete.panel.nativeElement.scrollHeight;
    //         const elementHeight = this.matccAutocomplete.panel.nativeElement.clientHeight;
    //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    //         if (atBottom) {
    //           if (this.has_next === true) {
    //             this.prposervice.getcclistDependentBsdd(this.prForm.value.commodity.id, this.ccInput.nativeElement.value, this.currentpage + 1)
    //               .subscribe((results: any[]) => {
    //                 let datas = results["data"];
    //                 let datapagination = results["pagination"];
    //                 this.cclist = this.cclist.concat(datas);
    //                 // console.log("emp", datas)
    //                 if (this.cclist.length >= 0) {
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

  getccValue(productIndex, ccbsIndex) {
    let BsLine = this.prForm.get('prdetails')['controls'][productIndex].get('prccbs')['controls'][ccbsIndex].value.bs.id
    console.log(" bs id getting   ", BsLine)
    if ((BsLine == null) || (BsLine == undefined) || (BsLine == "")) {
      return false
    }
    this.SpinnerService.show();
    this.prposervice.getcclistDependentBs(BsLine)
      .subscribe(result => {
        let datas = result['data']
        this.SpinnerService.hide();
        if (datas.length == 0) {
          this.SpinnerService.hide();
          this.notification.showInfo("No Records Found")
        }
        this.cclist = result['data']
        console.log("cc", this.cclist)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  ccclear(productIndex, ccbsIndex) {
    this.prForm.get('prdetails')['controls'][productIndex].get('prccbs')['controls'][ccbsIndex].get("cc").setValue("")
  }


  public displayFncc(cc?: cclistss): any | undefined {
    if ((typeof cc) === 'string') {
      return cc
    }
    return cc ? cc.name : undefined;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////emp
  currentpageemp = 1
  has_nextemp = true;
  has_previousemp = true;
  autocompleteempScroll() {
    setTimeout(() => {
      if (
        this.matempAutocomplete &&
        this.autocompleteTrigger &&
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
              if (this.has_nextemp === true) {
                this.prposervice.getemployeeApproverforPRDD(this.prForm.value.commodity.id, this.empInput.nativeElement.value, this.currentpageemp + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    // console.log("emp", datas)
                    if (this.employeeList.length >= 0) {
                      this.has_nextemp = datapagination.has_next;
                      this.has_previousemp = datapagination.has_previous;
                      this.currentpageemp = datapagination.index;
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
  public displayFnemp(emp?: Emplistss): string | undefined {
    // console.log('id', emp.id);
    // console.log('full_name', emp.full_name);
    return emp ? emp.full_name : undefined;
  }


  getemployeeForApprover() {
    let commodityID = this.prForm.value.commodity.id
    console.log("commodityID", commodityID)
    if ((commodityID === "") || (commodityID === undefined)) {
      this.notification.showInfo("Please Select the Commdity to choose the Approver")
      return false
    }
    this.SpinnerService.show();
    this.prposervice.getemployeeApproverforPR(commodityID)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        if (datas.length == 0) {
          this.SpinnerService.hide();
          this.notification.showInfo("No PR Approver is found against this Commodity")
          return false
        }
        this.employeeList = datas;
        console.log("employeeList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////SUBMIT
  PRSubmit(typeOfSubmit) {
    if (this.prForm.value.mepno != "") {
      if (this.prForm.value.totalamount > this.remainamt) {
        this.notification.showWarning("Total Amount Exceeded than PCA Remaining Amount ")
        return false
      }
    }
    if (this.prForm.value.employee_id == "") {
      this.notification.showWarning("Please choose Approver Employee")
      return false
    }
    // let headerfilesvalue = this.filesHeader.value.file_upload
    // if (this.prForm.value.type == 2) {
    //   if (headerfilesvalue.length == 0) {
    //     this.notification.showWarning("Please Choose Header Files")
    //     return false
    //   }
    // }
    let filesvalueDetails = this.files.value.file_upload
    let detailsValue = this.prForm.value.prdetails

    if (detailsValue.length == 0) {
      this.notification.showWarning("Details seems empty Please fill the details before submit")
      return false
    }
    // if (this.prForm.value.type == 1) {
    //   if (filesvalueDetails.length != detailsValue.length) {
    //     this.notification.showWarning("Please Check files is selected for all details")
    //     return false
    //   }

    // }

    let datadetails = this.prForm.value.prdetails
    console.log("datadetails",datadetails)
    for (let detail in datadetails) {
      let datadetailsUom:any
      console.log("this.prForm.value.type",this.prForm.value.type)
      console.log("datadetails[detail].uom",datadetails[detail].uom)
      if(this.prForm.value.type == 1){
        datadetails[detail].uom = datadetails[detail].uom
      }else{
        datadetails[detail].uom = datadetails[detail].uom.name
      }
      console.log("datadetailsUom",datadetailsUom)
      let datadetailsqty = datadetails[detail].qty
      let datadetailsunitPrice = datadetails[detail].unitprice

      let detailIndex = Number(detail)

      if (( datadetails[detail].uom  == "") || ( datadetails[detail].uom  == null) || ( datadetails[detail].uom  == undefined)) {
        this.notification.showWarning("Please fill UOM at line " + (detailIndex + 1))
        return false
      }
      if ((datadetailsqty == "") || (datadetailsqty == null) || (datadetailsqty == undefined)) {
        this.notification.showWarning("Please fill Quantity at line " + (detailIndex + 1))
        return false
      }
      if ((datadetailsunitPrice == "") || (datadetailsunitPrice == null) || (datadetailsunitPrice == undefined)) {
        this.notification.showWarning("Please fill Unitprice at line " + (detailIndex + 1))
        return false
      }

      let prccbsdata = datadetails[detail].prccbs
      for (let ccbs in prccbsdata) {
        let branchdata = prccbsdata[ccbs].branch_id
        let bsdata = prccbsdata[ccbs].bs
        let ccdata = prccbsdata[ccbs].cc
        let qtydataOnCCBS = prccbsdata[ccbs].qty
        let detailIndex = Number(detail)
        let ccbsindex = Number(ccbs)
        if ((branchdata == "") || (branchdata == null) || (branchdata == undefined)) {
          this.notification.showWarning("Please fill branch details at line " + (detailIndex + 1) + " in CCBS at line " + (ccbsindex + 1))
          return false
        }
        if ((bsdata == "") || (bsdata == null) || (bsdata == undefined)) {
          this.notification.showWarning("Please fill BS details at line " + (detailIndex + 1) + " in CCBS at line " + (ccbsindex + 1))
          return false
        }
        if ((ccdata == "") || (ccdata == null) || (ccdata == undefined)) {
          this.notification.showWarning("Please fill CC details at line " + (detailIndex + 1) + " in CCBS at line " + (ccbsindex + 1))
          return false
        }
        if ((qtydataOnCCBS == "") || (qtydataOnCCBS == null) || (qtydataOnCCBS == undefined)) {
          this.notification.showWarning("Please fill Quantity details at line " + (detailIndex + 1) + " in CCBS at line " + (ccbsindex + 1))
          return false
        }
      }
    }


    ///////////////////////////////////////// ccbs validation on each row
    let ccbsarrayqtyTotal = []
    let arrayofQtyPrdetails = this.prForm.value.prdetails.map(x => x.qty)
    console.log("prdetailsarray", arrayofQtyPrdetails)
    let ccbsarray = this.prForm.value.prdetails
    ccbsarray.forEach((row, index) => {
      let ccbsarrayqty = ccbsarray[index].prccbs.map(x => x.qty)
      console.log("ccbs array qty", ccbsarrayqty)
      let totalqtydetails = ccbsarrayqty.reduce((a, b) => a + b, 0);
      ccbsarrayqtyTotal.push(totalqtydetails)
      console.log("ccbs array qty Total", ccbsarrayqtyTotal)
    });

    for (let indexx in arrayofQtyPrdetails) {
      if (arrayofQtyPrdetails[indexx] != ccbsarrayqtyTotal[indexx]) {
        let a = Number(indexx)
        this.notification.showError("CCBS Error: Please check quantity on line   " + (a + 1) +
          ", The maximum limit is " + arrayofQtyPrdetails[indexx] + " quantity, It should be equal to Maximum limit ")
        return false
      }
    }

    let detailsvalue = this.prForm.value
    if (detailsvalue) {
      delete detailsvalue.productCategory
      delete detailsvalue.commodity
      delete detailsvalue.itemnoncatlog
      delete detailsvalue.items
      delete detailsvalue.product
      delete detailsvalue.productnoncatlog
      delete detailsvalue.productType
      delete detailsvalue.supplier
      delete detailsvalue.supplier_id
      delete detailsvalue.unitprice
    }

    let prdetailsvalue = this.prForm.value.prdetails
    for (let i in prdetailsvalue) {
      delete prdetailsvalue[i].branch
      delete prdetailsvalue[i].commodityname
      delete prdetailsvalue[i].itemname
      delete prdetailsvalue[i].productname
      delete prdetailsvalue[i].suppliername
      if (this.prForm.value.type == 2) {
        // this.prForm.value.hsn = prdetailsvalue[i].hsn.id
        this.prForm.value.hsn = 0
      }
      let ccbsbranch = prdetailsvalue[i].prccbs
      for (let j in ccbsbranch) {
        if (ccbsbranch[j].branch_id.id == undefined) {
          ccbsbranch[j].branch_id = ccbsbranch[j].branch_id
        }
        else {
          ccbsbranch[j].branch_id = ccbsbranch[j].branch_id.id
        }
        if (ccbsbranch[j].bs.name == undefined) {
          ccbsbranch[j].bs = ccbsbranch[j].bs
        }
        else {
          ccbsbranch[j].bs = ccbsbranch[j].bs.name
        }
        if (ccbsbranch[j].cc.name == undefined) {
          ccbsbranch[j].cc = ccbsbranch[j].cc
        }
        else {
          ccbsbranch[j].cc = ccbsbranch[j].cc.name
        }
      }
    }
    this.prForm.value.branch_id = this.prForm.value.branch_id.id
    this.prForm.value.employee_id = this.prForm.value.employee_id.id
    let dataSubmit = this.prForm.value
    if ((this.prapproveId == "") || (this.prapproveId == undefined) || (this.prapproveId == null)) {
      dataSubmit = this.prForm.value
    }
    else {
      dataSubmit = Object.assign({}, dataSubmit, { "id": this.prapproveId })
    }
    console.log("Pr Final Data", JSON.stringify(dataSubmit))


    let filesvalue = this.files.value.file_upload
    let filesHeadervalue = this.filesHeader.value.file_upload

    this.formDataChange(dataSubmit, typeOfSubmit)

  }









  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Note Pad

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

  // get sanitizedHtml() {
  //   return this.sanitizer.bypassSecurityTrustHtml(this.PARmakerForm.get('html').value);
  // }


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




  employeeCode: any
  employeeLimit: any
  empValues(data) {
    this.employeeCode = data.code
    this.employeeLimit = data.limit
  }


  onCancelClick() {
    // this.router.navigate(['/prmaster'], { skipLocationChange: true })
    this.onCancel.emit()
  }






  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// File upload

  onFileSelectedHeader(e) {
    for (var i = 0; i < e.target.files.length; i++) {
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

  FileDataArray = []
  FileDataArrayIndex = []
  onFileSelected(e, j) {
    this.FileDataArray[j] = e.target.files[0]
    this.FileDataArrayIndex[j] = j
    console.log("this.FilesDataArray", this.FileDataArray)
    console.log("this.FilesDataArrayIndex", this.FileDataArrayIndex)
  }



  formDataChange(dataPO, typeOfSubmit){
    console.log("fdataPO", dataPO)
    const formData: FormData = new FormData();
    let formdataIndex = this.FileDataArrayIndex
    let formdataValue = this.FileDataArray
    console.log("formdataIndex  after", formdataIndex)
    console.log("formdataValue  after", formdataValue)
    for (let i = 0; i < formdataValue.length; i++) {
      let keyvalue = 'file_key' + formdataIndex[i];
      let pairValue = formdataValue[i];
      if( formdataValue[i] == ""  ){
        console.log("")
      }else{
      formData.append( keyvalue, pairValue)
      }
  }
    let PRFormData = this.prForm.value.prdetails
  
    for( let filekeyToinsert in formdataIndex ){
      let datakey = "file_key"+filekeyToinsert
      console.log("datakey", datakey)
      PRFormData[filekeyToinsert].file_key = datakey
    }
    let HeaderFilesdata = this.filesHeader.value.file_upload
    for (var i = 0; i < HeaderFilesdata.length; i++) {
        let keyvalue = 'fileheader'
        let pairValue = HeaderFilesdata[i];
  
        if( HeaderFilesdata[i] == ""  ){
          console.log("")
        }else{
        formData.append( keyvalue, pairValue)
        }
      }
    let datavalue = JSON.stringify(dataPO)
    formData.append('data', datavalue);
    if( typeOfSubmit == 'makersubmit'){
      this.SpinnerService.show()
      this.prposervice.prCreateForm(formData )
        .subscribe(result => {
          this.SpinnerService.hide()
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.SpinnerService.hide()
            this.notification.showError("Please fill all  the field")
          }
          if(result.Error){ this.notification.showWarning(result.Error)}
          else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
            this.SpinnerService.hide()
            this.notification.showError("something went wrong")
          }
          else {
            this.SpinnerService.hide()
            this.notification.showSuccess("Successfully created!...")
            this.onSubmit.emit();
          }
          console.log("pomaker Form SUBMIT", result)
          return true
        },(error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
      }
      else if ( typeOfSubmit == 'draft'   ){
        this.SpinnerService.show()
        this.prposervice.prDraftForm(formData)
      .subscribe(result => {
        this.SpinnerService.hide()
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.SpinnerService.hide()
          this.notification.showError("Please fill all  the field")
        }
        else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide()
          this.notification.showError("something went wrong")
        }
        else {
          this.SpinnerService.hide()
          this.notification.showSuccess("Successfully Drafted!...")
          // this.router.navigate(['/pr'], { skipLocationChange: true })
          this.onSubmit.emit();
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
      }
  }

empBranchdata: any
  getEmployeeBranchData() {
    this.SpinnerService.show();
    this.prposervice.getEmpBranchId()
      .subscribe((results: any) => {
        this.SpinnerService.hide();
        if(results.error){
          this.SpinnerService.hide();
          this.notification.showWarning(results.error + results.description)
          this.prForm.controls["branch_id"].reset("");
          return false
        }
      

        let datas = results;
        this.empBranchdata = datas;
        console.log("empBranchdata", datas)
        this.prForm.patchValue({
          branch_id: this.empBranchdata
        })
        console.log(this.prForm.value)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



resetAfterccbsbranchChange(prindex, ccbsindex){
  // this.prForm.controls["items"].reset("")
  this.prForm.get("prdetails")['controls'][prindex].get('prccbs')['controls'][ccbsindex].get('branch_id').reset("")
}



resetAfterbsccbsChange(prindex, ccbsindex){
  this.prForm.get("prdetails")['controls'][prindex].get('prccbs')['controls'][ccbsindex].get('bs').reset("")

}


resetAfterSccccbsChange(prindex, ccbsindex){
  this.prForm.get("prdetails")['controls'][prindex].get('prccbs')['controls'][ccbsindex].get('cc').reset("")

}





}