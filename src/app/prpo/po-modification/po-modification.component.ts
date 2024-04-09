import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Component, OnInit, ViewChild, Output, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, startWith } from 'rxjs/operators';
import { takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
// import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe, formatDate } from '@angular/common';
// import { isBoolean } from 'util';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
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

@Component({
  selector: 'app-po-modification',
  templateUrl: './po-modification.component.html',
  styleUrls: ['./po-modification.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class PoModificationComponent implements OnInit {

  POForm: FormGroup;
  TermsForm: FormGroup;
  producttermsForm: FormGroup;
  servicetermsForm: FormGroup;
  todayDate = new Date();
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  pageSize = 10;
  isLoading = false

  branchList: Array<branchlistss>;
  branch_id = new FormControl();

  supplierList: Array<supplierlistss>;
  supplier_id = new FormControl();

  termsList: Array<termslistss>;
  terms_id = new FormControl();

  employeeList: Array<Emplistss>;
  employee_id = new FormControl();
  getCatlog_NonCatlogList: Array<any>;

  termlist: Array<any>;
  files: FormGroup;
  clicked = false;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;
  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('supplier') matsupplierAutocomplete: MatAutocomplete;
  @ViewChild('supplierInput') supplierInput: any;
  @ViewChild('tnc') mattermsAutocomplete: MatAutocomplete;
  @ViewChild('tncInput') tncInput: any;


  @Output() linesChange = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  tokenValues: any
  pdfUrls: string;
  jpgUrls: string;
  imageUrl = environment.apiURL
  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private dataService: PRPOSERVICEService,
    private prposhareService: PRPOshareService, private toastr: ToastrService,
    private datePipe: DatePipe, private notification: NotificationService,
    private ref: ChangeDetectorRef, private sanitizer: DomSanitizer, public dialog: MatDialog, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService) { }


  ngOnInit(): void {

    this.POForm = this.fb.group({
      type: ['', Validators.required],
      typename: ['', Validators.required],
      supplier_id: ['', Validators.required],
      commodity_id: ['', Validators.required],
      terms_id: ['', Validators.required],
      validfrom: [{ value: "" }],
      validto: [{ value: "" }],
      branch_id: ['', Validators.required],
      onacceptance: null,
      ondelivery: null,
      oninstallation: null,
      notepad: ['', Validators.required],
      amount: [0, Validators.required],
      employee_id: ['', Validators.required],
      mepno: ['', Validators.required],
      Header_img: null,
      id: '',
      podetails: this.fb.array([
      ])
    })


    ///////////////////////////////////////////////////branch
    let branchkeyvalue: String = "";
    this.getbranchFK(branchkeyvalue);
    this.POForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          //console.log('inside tap')

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


    this.getPOamendmentvalue();

    ///////////////////////////////////////////////////////// TermsForm
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
    })


    this.serviceTab();
    let key = ""
    this.gettermsFK(key);
    // if (this.POForm.value.supplier_id != "") {
    //   this.formNotComplete = false
    // }
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




  }

  ///////////////////////////////////////////// PO details add
  get podetails() {
    let group = new FormGroup({
      installationrequired: new FormControl(''),
      capitalized: new FormControl(''),
      commodity: new FormControl(''),
      Product_name: new FormControl(''),
      product_id: new FormControl(''),
      qty: new FormControl(),
      uom: new FormControl(''),
      unitprice: new FormControl(),
      amount: new FormControl(),
      taxamount: new FormControl(''),
      amcvalue: new FormControl(''),
      deliveryperiod: new FormControl(''),
      totalamount: new FormControl(''),
      delivery_details: this.fb.array([
        this.delivery_details
      ])
    }
    )
    return group
  }

  get delivery_details() {
    let groupDD = new FormGroup({
      ccbsqty: new FormControl(''),
      prdetails_id: new FormControl(''),
      product_id: new FormControl(''),
      commodity_id: new FormControl(''),
      prccbs_id: new FormControl(''),
      ccbs: new FormControl(''),
      qty: new FormControl(),
      uom: new FormControl(''),
      bs: new FormControl(''),
      cc: new FormControl(''),
      prccbs_remaining_qty_Value: new FormControl(''),
      location: new FormControl(''),
    });
    return groupDD
  }
  ///////////////////////////////////////////////////////////////////////////////// Get function for PO amendment
  get podetailsArray(): FormArray {
    return <FormArray>this.POForm.get('podetails');
  }
  PoNo: any
  SupplierProductMappingID: any
  typeID: any
  getPOamendmentvalue() {
    let data: any = this.prposhareService.poamendmentshare.value
    this.PoNo = data.no
    let id = data.id
    this.SpinnerService.show();
    this.dataService.getpoheader(id)
      .subscribe((result: any) => {
        this.SpinnerService.hide();
        //console.log(" result date for po id ", result)
        //console.log(" result date for po id json stringify ", JSON.stringify(result))
        const { supplierbranch_id, commodity_id, terms_id, validfrom, validto, branch_id, onacceptance, ondelivery, oninstallation,
          notepad, amount, employee, mepno, Header_img, type_id, type } = result;
        this.SupplierProductMappingID = supplierbranch_id.id
        console.log(" this.SupplierProductMappingID ", this.SupplierProductMappingID)
        let fromdates = this.datePipe.transform(validfrom, 'yyyy-MM-dd');
        let Todates = this.datePipe.transform(validto, 'yyyy-MM-dd');
        this.typeID = type_id
        this.POForm.patchValue({
          id,
          type: type_id,
          typename: type,
          supplier_id: supplierbranch_id,
          commodity_id: commodity_id.id,
          terms_id: terms_id,
          validfrom: fromdates,
          validto: Todates,
          branch_id,
          onacceptance,
          ondelivery,
          oninstallation,
          notepad,
          amount,
          employee_id: employee,
          mepno,
          Header_img,
          //podetails: this.setpodetails(result.podetails)
        })
        //console.log("PO details data", JSON.stringify(result.podetails))
        this.setpodetails(result.podetails, result.commodity_id.name, result)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  ArrayQuantity = []

  setpodetails(podet, commodityname, dataset) {
    for (let data of podet) {
      let installationrequired: FormControl = new FormControl('');
      let capitalized: FormControl = new FormControl('');
      let commodity: FormControl = new FormControl('');
      // let Product_name: FormControl = new FormControl('');
      let product_id: FormControl = new FormControl('');
      let product_name: FormControl = new FormControl('');
      let product_idCatlog: FormControl = new FormControl('');
      let itemCatlog: FormControl = new FormControl('');
      let item: FormControl = new FormControl('');
      let item_name: FormControl = new FormControl('');
      let qty: FormControl = new FormControl();
      let uom: FormControl = new FormControl('');
      let amount: FormControl = new FormControl();
      let unitprice: FormControl = new FormControl();
      let taxamount: FormControl = new FormControl('');
      let amcvalue: FormControl = new FormControl('');
      let deliveryperiod: FormControl = new FormControl('');
      let totalamount: FormControl = new FormControl('');
      let id: FormControl = new FormControl('');
      //let file_data= new FormArray([]);

      installationrequired.setValue(data.installationrequired)
      capitalized.setValue(data.capitalized)
      commodity.setValue(commodityname)
      // Product_name.setValue(data.product_id.name)
      // product_id.setValue(data.product_id.id)

      if (dataset.type_id == 1) {
        product_idCatlog.setValue(data.product_name)
        product_id.setValue(data.product_id)
        product_name.setValue(data.product_name)
      }
      else {
        product_idCatlog.setValue(data.product_name)
        product_name.setValue(data.product_name)
        product_id.setValue("")
      }
      if (dataset.type_id == 1) {
        item.setValue(data.item)
        item_name.setValue(data.item_name)
        itemCatlog.setValue(data.item_name)
      }
      else {
        item_name.setValue(data.item_name)
        itemCatlog.setValue(data.item_name)
        item.setValue('')
      }

      uom.setValue(data.uom)
      taxamount.setValue(data.taxamount)
      qty.setValue(data.qty)
      // unitprice.setValue(data.unitprice)
      // if (dataset.type_id == 1) {
      //   unitprice.setValue(0)
      // }
      // else {
      unitprice.setValue(data.unitprice)
      // }
      amcvalue.setValue(data.amcvalue)
      deliveryperiod.setValue(data.deliveryperiod)
      amount.setValue(qty.value * unitprice.value)
      totalamount.setValue(qty.value * unitprice.value)
      id.setValue(data.id)
      //file_data.push(data.file_data)
      this.ArrayQuantity.push(data.qty)
      console.log("Arrray Quantity value ", this.ArrayQuantity)

      let file_id: FormControl = new FormControl('');
      let file_name: FormControl = new FormControl('');
      let fileid: FormControl = new FormControl('');
      const podetFormArray = this.POForm.get("podetails") as FormArray;
      console.log("file data", data.file_data)
      data.file_data.forEach(element => {
        file_id.setValue(element.file_id)
        file_name.setValue(element.file_name)
        fileid.setValue(element.id)
      });


      if (dataset.type_id == 1) {
        podetFormArray.push(new FormGroup({
          installationrequired: installationrequired,
          capitalized: capitalized,
          commodity: commodity,
          product_idCatlog: product_idCatlog,
          itemCatlog: itemCatlog,
          product_id: product_id,
          item: item,
          product_name: product_name,
          item_name: item_name,
          uom: uom,
          qty: qty,
          unitprice: unitprice,
          amount: amount,
          taxamount: taxamount,
          amcvalue: amcvalue,
          deliveryperiod: deliveryperiod,
          totalamount: totalamount,
          id: id,
          file_data: this.fb.array([
            this.fb.group({
              file_id: file_id,
              file_name: file_name,
              id: fileid
            })
          ]),
          delivery_details: this.setdelivarydata(data.delivery_details, unitprice, dataset)
        }))
      }

      if (dataset.type_id == 2) {
        podetFormArray.push(new FormGroup({
          installationrequired: installationrequired,
          capitalized: capitalized,
          commodity: commodity,
          product_idCatlog: product_idCatlog,
          itemCatlog: itemCatlog,
          product_name: product_name,
          item_name: item_name,
          uom: uom,
          qty: qty,
          unitprice: unitprice,
          amount: amount,
          taxamount: taxamount,
          amcvalue: amcvalue,
          deliveryperiod: deliveryperiod,
          totalamount: totalamount,
          id: id,
          file_data: this.fb.array([
            this.fb.group({
              file_id: file_id,
              file_name: file_name,
              id: fileid
            })
          ]),
          delivery_details: this.setdelivarydata(data.delivery_details, unitprice, dataset)
        }))
      }








      qty.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        //console.log("should be called first")

        this.calcTotalpatch(unitprice, qty, amount, totalamount)
        if (!this.POForm.valid) {
          return;
        }
        this.linesChange.emit(this.POForm.value['podetails']);
      })
      this.calcTotalpatch(unitprice, qty, amount, totalamount)
    }
  }
  qtypatchpo: any;
  totalqtydetails: any;
  MaximumQty: any;

  setdelivarydata(delivery_details, unitprice, dataset) {
    let arr = new FormArray([])
    for (let podata of delivery_details) {
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
      let qty: FormControl = new FormControl();
      let uom: FormControl = new FormControl('');
      let id: FormControl = new FormControl('');

      let amount: FormControl = new FormControl();
      let unitprice: FormControl = new FormControl();
      let totalamount: FormControl = new FormControl();

      let product_name: FormControl = new FormControl('');
      let item: FormControl = new FormControl('');
      let item_name: FormControl = new FormControl('');

      ccbsqty.setValue(podata.prpoqty_id.prccbs_id.qty)
      prdetails_id.setValue(podata.prpoqty_id.prdetails_id.id)
      commodity_id.setValue(podata.prpoqty_id.prdetails_id.prheader_id.commodity_id.id)
      prccbs_id.setValue(podata.prpoqty_id.prccbs_id.id)
      ccbs.setValue(podata.prpoqty_id.prccbs_id.id)
      bs.setValue(podata.prpoqty_id.prccbs_id.bs)
      cc.setValue(podata.prpoqty_id.prccbs_id.cc)


      // product_id.setValue(podata.prpoqty_id.prdetails_id.product_id.id)
      if (dataset.type_id == 1) {
        product_id.setValue(podata.prpoqty_id.prdetails_id.product_id)
        product_name.setValue(podata.prpoqty_id.prdetails_id.product_name)
      }
      else {
        product_name.setValue(podata.prpoqty_id.prdetails_id.product_name)
        product_id.setValue("")
      }
      if (dataset.type_id == 1) {
        item.setValue(podata.prpoqty_id.prdetails_id.item)
        item_name.setValue(podata.prpoqty_id.prdetails_id.item_name)
      }
      else {
        item_name.setValue(podata.prpoqty_id.prdetails_id.item_name)
        item.setValue('')
      }

      qty.setValue(podata.qty)
      uom.setValue(podata.prpoqty_id.prdetails_id.uom)
      prccbs_remaining_qty_Value.setValue(podata.prpoqty_id.prccbs_id.qty - podata.qty)
      location.setValue(podata.prpoqty_id.prccbs_id.branch_id.name)
      id.setValue(podata.prpoqty_id.id)


      if (dataset.type_id == 1) {
        arr.push(new FormGroup({
          ccbsqty: ccbsqty,
          prdetails_id: prdetails_id,
          product_id: product_id,
          item: item,
          product_name: product_name,
          item_name: item_name,
          commodity_id: commodity_id,
          prccbs_id: prccbs_id,
          ccbs: ccbs,
          qty: qty,
          uom: uom,
          bs: bs,
          cc: cc,
          prccbs_remaining_qty_Value: prccbs_remaining_qty_Value,
          location: location,
          id: id
        }))
      }


      if (dataset.type_id == 2) {
        arr.push(new FormGroup({
          ccbsqty: ccbsqty,
          prdetails_id: prdetails_id,
          product_name: product_name,
          item_name: item_name,
          commodity_id: commodity_id,
          prccbs_id: prccbs_id,
          ccbs: ccbs,
          qty: qty,
          uom: uom,
          bs: bs,
          cc: cc,
          prccbs_remaining_qty_Value: prccbs_remaining_qty_Value,
          location: location,
          id: id
        }))
      }

      this.calcTotalpatch(unitprice, qty, amount, totalamount)
      qty.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        //console.log("should be called first")

        this.qtypatchpo = this.POForm.value.podetails[this.SelectedIndexOfDelivary].delivery_details.map(x => x.qty);
        //console.log('data check qtypatchpo', this.qtypatchpo);
        this.totalqtydetails = this.qtypatchpo.reduce((a, b) => a + b, 0);
        this.POForm.get('podetails')['controls'][this.SelectedIndexOfDelivary].get('qty').setValue(this.totalqtydetails)
        let unitpriceValue = this.POForm.get('podetails')['controls'][this.SelectedIndexOfDelivary].get('unitprice').value


        // if (this.totalqtydetails > this.ArrayQuantity[this.SelectedIndexOfDelivary]) {
        //   this.notification.showWarning("Quantity Limit Exceeded, Quantity limit must be less than or equal to Actual Quantity")
        //   //this.clicked = true
        // } 
        // else {
        //   this.clicked = false
        // }
        if (!this.POForm.valid) {
          return;
        }
        this.linesChange.emit(this.POForm.value['podetails']);
        //this.ChangeColorBasedOnQty()
      }
      )

    }


    return arr
  }
  SaveDelivaryDetails() {
    if (this.totalqtydetails > this.ArrayQuantity[this.SelectedIndexOfDelivary]) {
      this.notification.showWarning("Quantity Limit Exceeded, Quantity limit must be less than or equal to Actual Quantity")
    }
  }



  SelectedIndexOfDelivary: any
  GettingArrayOfQuantityInPODetails: any
  gettingIndexOfDelivary(Index) {
    this.SelectedIndexOfDelivary = Index
    // console.log(" Selected Qty index", this.SelectedIndexOfDelivary)
  }
  GettingArrayOfQuantityInPODetailsValue() {
    this.GettingArrayOfQuantityInPODetails = this.POForm.value.podetails.map(x => x.qty)
    //console.log(" PODetails Quantity Array Value    ", this.GettingArrayOfQuantityInPODetails)
  }

  MaximumQuantityForPODetail: any
  NowClickedIndex: any
  QuantityValidation(data, index) {
    // console.log("Quantity check", data.value.qty)
    this.MaximumQuantityForPODetail = data.value.qty
    this.MaximumQty = this.ArrayQuantity[index]
    this.NowClickedIndex = index
    console.log("this.NowClickedIndex", this.NowClickedIndex)
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }


  ngOnDestroy() {
  }

  ///////////////////////////////////////////////////Quantity validation should not exceed than the limit of quantity



  amt: any
  sum: any = 0.00
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
    //console.log('data check amt', this.amt);
    this.sum = this.amt.reduce((a, b) => a + b, 0);
    //console.log('sum of total ', this.sum);
    this.POForm.patchValue({
      amount: this.sum
    })
    //this.ChangeColorBasedOnQty()
  }
  disablebutton = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,]
  ChangeColorBasedOnQty() {
    let QtyFromArray = this.ArrayQuantity
    let ValueInPOForm = this.POForm.value.podetails
    console.log(" ValueInPOForm[this.NowClickedIndex]", ValueInPOForm[this.NowClickedIndex].qty)
    console.log(" QtyFromArray[this.NowClickedIndex]", QtyFromArray[this.NowClickedIndex])
    console.log(" index of checking validation", this.NowClickedIndex)
    if (ValueInPOForm[this.NowClickedIndex].qty > QtyFromArray[this.NowClickedIndex]) {
      // if (this.NowClickedIndex != ValueInPOForm[this.NowClickedIndex]) {
      //this.disablebutton[this.NowClickedIndex] = true;
      ValueInPOForm.forEach((row, index) => {
        console.log(" index of form", index)
        if (this.NowClickedIndex === index) {
          this.disablebutton[this.NowClickedIndex] = false;
        }
        else {
          this.disablebutton[this.NowClickedIndex] = true;
        }
      });
      // }
    }
  }






  //////////////////////////////////////Search DD functions

  public displayFnsupplier(supplier?: supplierlistss): string | undefined {
    return supplier ? supplier.name : undefined;
  }


  ////////////////////////////////////Search branch

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
        //console.log("branchList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
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


  ////////////////////////////////////////////////////// search employee
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
    // console.log("commodityID", commodityID)
    if (commodityID === "") {
      this.notification.showInfo("Please Select the Product to choose the Approver")
      return false
    }
    this.SpinnerService.show();
    this.dataService.getemployeeApproverforPO(commodityID)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        this.employeeList = datas;
        //console.log("employeeList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  ////////////////////////////////////////////////////////////////////////////////////// TERMS AND CONDITION


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
        let datas = results["data"];
        this.SpinnerService.hide();
        this.producttermslistproduct = datas;
        // console.log("producttermslistproduct", this.producttermslistproduct)
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
        // console.log("servicelist", this.servicetermslist)
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

  termscreateSubmit() {
    let data: any = this.TermsForm.value
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
      //console.log("checkboxlistid", this.checkboxlistid)


    }
    else {
      const index = this.checkboxlistid.indexOf(listItem.id)
      this.checkboxlistid.splice(index, 1)
      //console.log("checkboxlistid", this.checkboxlistid)
    }

  }

  scheckboxlistid: any[] = [];


  serviceCheckBoxvalue(listItem, event) {
    if (event.checked == true) {
      this.scheckboxlistid.push(listItem.id);
      //console.log("scheckboxlistid", this.scheckboxlistid)


    }
    else {
      const index = this.scheckboxlistid.indexOf(listItem.id)
      this.scheckboxlistid.splice(index, 1)
      //console.log("scheckboxlistid", this.scheckboxlistid)
    }

  }


  servicetermsFormSubmit() {
    let data: any = this.servicetermsForm.value
    let suplierid = this.POForm.value.supplier_id.id
    if (this.POForm.value.supplier_id.id == "" || null || undefined) {
      this.notification.showWarning("select Supplier")
    }
    let text = ""

    data.supplier_id = suplierid
    data.potermstemplate = this.scheckboxlistid

    data.text = text
    this.SpinnerService.show();
    this.dataService.POproductserviceCreateForm(data)
      .subscribe(res => {
        this.SpinnerService.hide();
        this.notification.showSuccess("New product term added!...")
        let key = ""
        this.gettermsFK(key)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  producttermsFormSubmit() {
    let data: any = this.producttermsForm.value
    let suplierid = this.POForm.value.supplier_id.id
    if (this.POForm.value.supplier_id.id == "" || null || undefined) {
      this.notification.showWarning("select Supplier")
    }
    let text = ""

    data.supplier_id = suplierid
    data.text = text
    data.potermstemplate = this.checkboxlistid
    this.SpinnerService.show();
    this.dataService.POproductserviceCreateForm(data)
      .subscribe(res => {
        this.SpinnerService.hide();
        this.notification.showSuccess("New service term added!...")
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
    if (termid == "") { this.notification.showWarning("Please choose the Terms"); return false }
    this.SpinnerService.show();
    this.dataService.gettermsget(termid)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.producttermslist = datas;
        //console.log("aa", this.producttermslist)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }




  onCancelClick() {
    this.onCancel.emit()
  }



  ////////////////////////////////////////////////// POP up

  dialogRef: any

  openModal(templateRef) {
    this.dialogRef = this.dialog.open(templateRef, {
      width: '100%',
    });
    this.dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });
  }
  closedialog(): void {
    this.dialogRef.close();
  }

  ////////////////////////////////////////////////////////////////// File data download

  fileDownloads(data) {
    let id = data.value.file_data[0].file_id
    let fileName = data.value.file_data[0].file_name
    this.SpinnerService.show();
    this.dataService.fileDownloadpo(id)
      .subscribe((results) => {
        // console.log("re", results)
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  showimagepopup: boolean
  commentPopup(data) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = data.value.file_data[0].file_id
    let fileName = data.value.file_data[0].file_name
    const headers = { 'Authorization': 'Token ' + token }

    let stringValue = fileName.split('.')

    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showimagepopup = true
      this.jpgUrls = this.imageUrl + "prserv/prpo_fileview/" + id + "?token=" + token;
      //console.log("url", this.jpgUrls)
    }
    else {
      this.showimagepopup = false
    }
  };

  POsubmit() {
    // console.log("Form submit value", this.POForm.value)

    let InitialOriginalArray = this.ArrayQuantity
    let FormPOdetailsArray = this.POForm.value.podetails
    console.log(" this.MaximumQty i.e original quantity ", this.ArrayQuantity)
    for (let indexx in FormPOdetailsArray) {
      console.log("index value in loop", indexx)

      console.log("index value in loop value form", FormPOdetailsArray[indexx].qty, "on", indexx)

      console.log("index value in loop value in original array", InitialOriginalArray[indexx], 'on', indexx)

      if (FormPOdetailsArray[indexx].qty > InitialOriginalArray[indexx]) {
        let a = Number(indexx)
        let c = parseInt(indexx)

        console.log("change into number step 1", a)
        console.log("change into number step 2", c)

        this.notification.showError("Please check quantity on line   " + (a + 1) +
          ", It exceeded the maximum limit of " + InitialOriginalArray[indexx] + " quantity, It should be less than or equal to Maximum limit ")
        return false
      }
      //return false
    }

    this.POForm.value.branch_id = this.POForm.value.branch_id.id
    this.POForm.value.supplier_id = this.POForm.value.supplier_id.id
    this.POForm.value.employee_id = this.POForm.value.employee_id.id
    this.POForm.value.terms_id = this.POForm.value.terms_id.id
    this.POForm.value.Header_img = null
    console.log("after ID input value", JSON.stringify(this.POForm.value))
    let data = this.POForm.value
    this.SpinnerService.show();
    this.dataService.POAmendmentForm(data)
      .subscribe(res => {
        this.SpinnerService.hide();
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.SpinnerService.hide();
          this.notification.showError("[INVALID_DATA! ...]")
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.SpinnerService.hide();
          this.notification.showWarning("Duplicate Data! ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide();
          this.notification.showError("INVALID_DATA!...")
        }
        else {
          this.notification.showSuccess("Successfully created!...")
          this.SpinnerService.hide();
          this.onSubmit.emit();
        }
        console.log("pomaker Form SUBMIT", res)
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



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

  // get sanitizedHtml() {
  //   return this.sanitizer.bypassSecurityTrustHtml(this.MEPmakerForm.get('html').value);
  // }

  onBlur() {
    // console.log('Blur');
  }

  onDelete(file) {
    // console.log('Delete file', file.url);
  }

  summernoteInit(event) {
    // console.log(event);
  }

  only_numalpha(event) {
    var k;
    k = event.charCode;
    // return ((k > 96 && k < 123) || (k >= 48 && k <= 57));
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
}

