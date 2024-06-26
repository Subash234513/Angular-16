import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PprService } from '../ppr.service';
import { DatePipe } from '@angular/common';
import { moveItemInArray, CdkDragDrop } from "@angular/cdk/drag-drop";

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { ErrorhandlingService } from '../errorhandling.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
const { read, write, utils } = XLSX;
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MMM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export interface BSCNameLists {
  id: number
  name: string
}
export interface assetlist {
  id: number
  name: string
}
export interface assetLists {
  id: number
  name: string
}
export interface product {
  bsproduct_name: string
  id: number
}
export interface rm_name {
  rm_name: string
  rm_id: number
}
export interface client_name {
  client_name: string
  client_id: number
}
export interface business {
  bussines_name: string
  bussines_id: number
}
export class ItemList {
  constructor(public item: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}
@Component({
  selector: 'app-ppr-active-client',
  templateUrl: './ppr-active-client.component.html',
  styleUrls: ['./ppr-active-client.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe
  ],
})
export class PprActiveClientComponent implements OnInit {
  activeclient_summary: any;
  has_next: any;
  supplierview: boolean = true;
  exampleHeader;
  test_array = ['monesh', 'vanthi']
  has_previous: any;
  presentpage: any;
  isSummaryPagination: boolean;
  currentpage: number;
  ppr_clienttypelist: any;
  assetList: assetlist[];
  isLoading: boolean;
  ppractiveclient: FormGroup;
  income: any
  assestgrp = new FormControl();
  formImport: FormGroup;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('bssearchAutoComplete') bssearchAutoComplete: MatAutocomplete;
  @ViewChild('bssearchInput') bssearchInput: any;

  @ViewChild('chipinput') chipinput: any
  @ViewChild('asset') asset: MatAutocomplete;

  @ViewChild('product') productInput: any;
  @ViewChild('productsearch') matAutocompleteproduct: MatAutocomplete;

  @ViewChild('rm') rmInput: any;
  @ViewChild('rmsearch') matAutocompleterm: MatAutocomplete;

  @ViewChild('client') clientInput: any;
  @ViewChild('clientsearch') matAutocompleteclient: MatAutocomplete;

  public chipSelectedprod: assetlist[] = [];
  public chipSelectedprodid = [];
  chipSelectedEmployeeDept: assetLists[] = []
  assestgrpList: assetLists[] = []
  public chipSelectedEmployeeDeptid = [];
  isAllSelected: boolean;
  assectval: { asset_id: any[]; month: number; };
  expand: any;
  income_header: any;
  headers_name: any;
  val = []
  row_name: unknown[];
  new_form: any = FormGroup;
  otheroperating :any=FormGroup;
  incomedata: any;
  header_name: any;
  monthsearch: number;
  assest: any;
  productList: any;
  rm_data: any;
  client_data: any;
  maxDate: string;
  numberofitem: number = 5;
  Max_date = new Date();
  chipSelectedprodname: any = [];

  options: any = [{
    "bussines_name": "ALL",
    "bussines_id": 4
  }, {
    "bussines_name": "FI",
    "bussines_id": 1
  },
  {
    "bussines_name": "MM",
    "bussines_id": 2
  },
  {
    "bussines_name": "DO",
    "bussines_id": 3
  }]
  filteredOptions: Observable<string[]>;
  to_date: any;
  todate: string;
  fromdate: string;
  downloadUrl: string;
  excel: string;
  header_data: any[];
  fee_type: any;
  sample: any;
  fee_amounts: unknown[];
  show_and_hide: boolean = true;
  file_details: any;
  numberoffiled: any;
  filed_name: any;
  boptotalamount: number;
  closingamount: number;
  attritionamount: number;
  new_clientamount: number;
  otheroperexp_headername: any;
  otheroperexpgrp: any;
  otheroperexp: any;
  index_expense: any;
  prodect_id: any;
  headername: any;
  transation_minDate: string;
  trancationmaxDate: string;
  allocationval: any;
  BsccSearch: any;
  has_nextval: boolean;
  has_previousval: boolean;
  currentpagenum: number;
  srachid: any;
  assetval: any;
  showdata: boolean;
  exapnceshow: boolean;
  allocationheader: any;
  constructor(private fb: FormBuilder, private datePipe: DatePipe, private toastr: ToastrService, private ppractiveservice: PprService, private SpinnerService: NgxSpinnerService, private errorhandlingservice: ErrorhandlingService) {

  }
  ngOnInit(): void {
    this.ppractiveclient = this.fb.group({
      allocationbs_filter:[''],
      productgrp: [''],
      rm_search: [{ value: '', disabled: true }],
      client_search: [{ value: '', disabled: true }],
      client_fromdate: [''],
      client_todate: [''],
      business_Search: ['']
    })
    this.otheroperating=this.fb.group({
      pagenum:[''],
      pagesize:[''],
      transactionstartdate:[''],
      transactiontodate:['']
    })
    // this.ppr_activeclient_summary()
    // this.ppr_client_typelist()
    let clienttype = {
      "assest_class": [1],
      "month": 1,

    }
  

    // this.filteredOptions = this.ppractiveclient.get('business_Search').valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value)),
    // );
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter(option => option.toLowerCase().includes(filterValue));
  // }

  date = new FormControl(moment());
  min_todate(date) {
    // let minDate = moment({year: data. - 100, month: this.month, day: this.day}).format('YYYY-MM-DD');
    let year = date._i.year
    // new Date(date).getFullYear();
    let month = date._i.month
    //  new Date(date).getMonth();
    let day = date._i.date
    // new Date(date).getDay();
    console.log(day, month, year)
    this.maxDate = moment({ year: year, month: month, day: day }).format('YYYY-MM-DD');

    console.log("date=>", date, this.maxDate)
  }
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    console.log()
    const ctrlValue = this.date.value;
    console.log(ctrlValue._d.getMonth())
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    console.log(this.date)
    this.monthsearch = normalizedMonth.month() + 1
    console.log("monthsearch=>", this.monthsearch)
    datepicker.close();
  }
  asset_class_search(prokeyvalue) {
    this.ppractiveservice.get_bs_dropdown(1,prokeyvalue,1).subscribe((results: any[]) => {
      let datas = results["data"];
      console.log("data=>", datas)
      // let alldata={
      //   asset_name:"All",
      //   asset_id:''
      // }
      // results['data'].splice(0,0,alldata)
      console.log("results['data']=>",results['data'])
      // this.assestgrpList = datas;
      this.assetList = datas
      console.log("assetList",this.assetList)
      // this.assetList.push(alldata)

    })
  }
  public displayfnassest(branch?: assetLists): string | undefined {
    return branch ? branch.name : undefined;

  }
  // displayfnbussines
  public displayfnbussines(business?: business): string | undefined {
    return business ? business.bussines_name : undefined;

  }
  asset_dropdown() {
    let prokeyvalue: String = "";
    this.asset_class_search(prokeyvalue);
    this.assestgrp.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ppractiveservice.get_bs_dropdown(1,value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
              // this.header_name=value.asset_name
              // console.log("this.header_name",this.header_name)
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.assetList = datas
        // this.ppractiveclient.controls['client_search'].reset('')
        // this.ppractiveclient.controls['rm_search'].reset('')
        // console.log("this.header_name=>",this.header_name,this.assestgrp.value)
        // if( this.assestgrp.value != undefined ||  this.assestgrp.value != null || this.assestgrp.value!='' ){

        //   this.ppractiveclient.controls['rm_search'].enable();
        //   this.ppractiveclient.controls['client_search'].enable();
        // }
        // if( this.assestgrp.value == undefined ||  this.assestgrp.value == null || this.assestgrp.value=='' ){

        //   console.log("undefined")
        //   this.ppractiveclient.controls['rm_search'].disable();
        //   this.ppractiveclient.controls['client_search'].disable();
        // }


      })
  }
  p: any = 1
  product_search() {
    let prokeyvalue: String = "";
    this.productsearch(prokeyvalue);
    this.ppractiveclient.get('productgrp').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ppractiveservice.get_product_search(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
              // this.header_name=value.asset_name
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productList = datas

      })
  }
  productsearch(prokeyvalue) {
    this.ppractiveservice.get_product_search(prokeyvalue, 1).subscribe((data) => {
     
      let datas = data['data']
      

      this.productList = datas

      console.log(this.productList)
    }
    )
  }
  public displayfnproductdisp(product_name?: product): string | undefined {
    return product_name ? product_name.bsproduct_name : undefined;

  }
  autocompleteprodutsearch() {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1

    setTimeout(() => {
      if (
        this.matAutocompleteproduct &&
        this.autocompleteTrigger &&
        this.matAutocompleteproduct.panel
      ) {
        fromEvent(this.matAutocompleteproduct.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompleteproduct.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompleteproduct.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteproduct.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteproduct.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ppractiveservice.get_product_search(this.productInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.productList = this.productList.concat(datas);
                    if (this.productList.length >= 0) {
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
  rm_droupdown(type, assest_id) {
    // let type='RM'
    let prokeyvalue: String = "";
    console.log(this.assestgrp)
    if (this.assestgrp.value == undefined || this.assestgrp.value == null || this.assestgrp.value == '') {
      console.log("undefind")
      return false;
    }
    if (this.assestgrp.value != undefined || this.assestgrp.value != null || this.assestgrp.value != '') {
      this.get_rm_search(type, prokeyvalue, assest_id);
      this.ppractiveclient.get('rm_search').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ppractiveservice.rm_client(type, value, assest_id, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
                // this.header_name=value.asset_name
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.rm_data = datas

        })
    }

  }
  get_rm_search(type, prokeyvalue, assest_id) {
    console.log(this.assestgrp.value)
    if (this.assestgrp.value == undefined || this.assestgrp.value == null || this.assestgrp.value == '') {
      console.log("undefind")
      return false;
    }
    if (this.assestgrp.value != undefined || this.assestgrp.value != null || this.assestgrp.value != '') {
      this.ppractiveservice.rm_client(type, prokeyvalue, assest_id, 1).subscribe((data) => {
        let datas = data['data']
        this.rm_data = datas

        console.log(this.rm_data)
      }
      )
    }
  }
  public displayfnrm_search(rm_name?: rm_name): string | undefined {
    return rm_name ? rm_name.rm_name : undefined;

  }
  autocompleterm_search(type, assest_id) {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1
    // let type='RM'
    setTimeout(() => {
      if (
        this.matAutocompleterm &&
        this.autocompleteTrigger &&
        this.matAutocompleterm.panel
      ) {
        fromEvent(this.matAutocompleterm.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompleterm.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompleterm.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleterm.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleterm.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ppractiveservice.rm_client(type, this.rmInput.nativeElement.value, assest_id, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.productList = this.productList.concat(datas);
                    if (this.productList.length >= 0) {
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

  client_droupdown(type, assest_id) {
    // let type='RM'
    console.log(this.assestgrp.value)
    if (this.assestgrp.value == undefined || this.assestgrp.value == null || this.assestgrp.value == '') {
      console.log("undefind")
      return false;
    }
    if (this.assestgrp.value != null || this.assestgrp.value != undefined || this.assestgrp.value != '') {
      let prokeyvalue: String = "";
      this.get_client_search(type, prokeyvalue, assest_id);
      this.ppractiveclient.get('client_search').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ppractiveservice.rm_client(type, value, assest_id, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
                // this.header_name=value.asset_name
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.client_data = datas

        })
    }
  }
  get_client_search(type, prokeyvalue, assest_id) {
    if (this.assestgrp.value == undefined || this.assestgrp.value == null || this.assestgrp.value == '') {
      console.log("undefind")
      return false;
    }
    if (this.assestgrp.value != null || this.assestgrp.value != undefined || this.assestgrp.value != '') {

      this.ppractiveservice.rm_client(type, prokeyvalue, assest_id, 1).subscribe((data) => {
        let datas = data['data']
        this.client_data = datas

        console.log(this.client_data)
      }
      )
    }
  }
  public displayfnclient_search(client_name?: client_name): string | undefined {
    return client_name ? client_name.client_name : undefined;

  }
  autocompleteclient_search(type, assest_id) {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1
    // let type='RM'
    setTimeout(() => {
      if (
        this.matAutocompleteclient &&
        this.autocompleteTrigger &&
        this.matAutocompleteclient.panel
      ) {
        fromEvent(this.matAutocompleteclient.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompleteclient.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompleteclient.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteclient.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteclient.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ppractiveservice.rm_client(type, this.clientInput.nativeElement.value, assest_id, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.productList = this.productList.concat(datas);
                    if (this.productList.length >= 0) {
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

  public ppractiveSelected(event: MatAutocompleteSelectedEvent): void {

    this.selectprodByName(event.option.value.name);
    this.chipinput.nativeElement.value = '';

  }
  private selectprodByName(prod) {
    let foundprod1 = this.chipSelectedprod.filter(pro => pro.name == prod);
    if (foundprod1.length) {
      return;
    }
    let foundprod = this.assetList.filter(pro => pro.name == prod);
    if (foundprod.length) {
      this.chipSelectedprod.push(foundprod[0]);
      this.chipSelectedprodid.push(foundprod[0].id)
      
      // Object.keys(foundprod[0].asset_id).forEach((k) => this.chipSelectedprodid[k] == '' && delete this.chipSelectedprodid[k]);
      console.log("chipSelectedprodid=>", this.chipSelectedprodid)
      this.chipSelectedprodname.push(foundprod[0].name)
      this.ppractiveclient.controls['client_search'].reset('')
      this.ppractiveclient.controls['rm_search'].reset('')
      console.log("this.header_name=>", this.header_name, this.assestgrp.value)
      if (this.chipSelectedprodid.length != 0) {

        this.ppractiveclient.controls['rm_search'].enable();
        this.ppractiveclient.controls['client_search'].enable();
      }
      if (this.chipSelectedprodid.length == 0) {

        console.log("undefined")
        this.ppractiveclient.controls['rm_search'].disable();
        this.ppractiveclient.controls['client_search'].disable();
      }
    }
  }





  public removedprod(pro: assetlist): void {
    const index = this.chipSelectedprod.indexOf(pro);
    if (index >= 0) {
      this.chipSelectedprod.splice(index, 1);
      this.chipSelectedprodname.splice(index, 1)
      this.chipSelectedprodid.splice(index, 1);

      this.chipinput.nativeElement.value = '';
      this.ppractiveclient.controls['client_search'].reset('')
      this.ppractiveclient.controls['rm_search'].reset('')
      console.log("this.header_name=>", this.header_name, this.assestgrp.value)
      if (this.chipSelectedprodid.length != 0) {

        this.ppractiveclient.controls['rm_search'].enable();
        this.ppractiveclient.controls['client_search'].enable();
      }
      if (this.chipSelectedprodid.length == 0) {

        console.log("undefined")
        this.ppractiveclient.controls['rm_search'].disable();
        this.ppractiveclient.controls['client_search'].disable();
      }
    }
  }

  ppr_activeclient_summary(pageNumber = 1, pageSize = 10) {
    this.ppractiveservice.ppr_activeclient_summary(pageNumber, pageSize).subscribe((results: any[]) => {
      console.log("results=>", results)
      let data = results['data']
      let dataPagination = results['pagination']
      this.activeclient_summary = data
      if (data.length >= 0) {
        console.log("val")
        this.has_next = dataPagination.has_next;
        this.has_previous = dataPagination.has_previous;
        this.presentpage = dataPagination.index;
        this.isSummaryPagination = true;
      } if (data <= 0) {
        console.log("val1")

        this.isSummaryPagination = false;
      }
    })
  }

  ppr_client_typelist(client_type, pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show()
    this.ppractiveservice.ppr_client_typelist(client_type, pageNumber, pageSize).subscribe((results: any[]) => {
      this.SpinnerService.hide()
      console.log("results=>", results)
      let data = results['data']
      let headername = []

      let dataPagination = results['pagination']
      this.ppr_clienttypelist = data
      // console.log(this.ppr_clienttypelist[0].assest_class)
      if (this.ppr_clienttypelist[0].assest_class.length == 0) {
        this.header_name = this.chipSelectedprodname
        this.show_and_hide = true
      } if (this.ppr_clienttypelist[0].assest_class.length != 0) {
        headername = this.ppr_clienttypelist[0].assest_class
        this.show_and_hide = false
        this.header_name = headername
      }
      console.log(this.header_name)
    }, error => {
      this.errorhandlingservice.handleError(error);
      this.SpinnerService.hide();
    })
  }
  previousClick_typelist() {
    if (this.has_next === true) {
      console.log("previous")
      this.currentpage = this.presentpage - 1
      this.ppr_client_typelist(this.assectval, this.presentpage - 1, 10)
    }
  }
  nextClick_typelist() {
    if (this.has_next === true) {
      console.log("page=>", this.presentpage)
      this.currentpage = this.presentpage + 1
      console.log("pre=>", this.currentpage)
      this.ppr_client_typelist(this.assectval, this.presentpage + 1, 10)
    }

  }


  pprsearch(assestgrp, assestval, dateval, pageNumber = 1, pageSize = 10,) {
    this.numberofitem = 5
    this.p = 1
    this.header_data = []
    this.dup = []
    this.incomeheader=[]
    this.allocationheader=[]
    this.showdata=true
    this.exapnceshow=true
    // if (assestval.value.business_Search == null || assestval.value.business_Search == undefined || assestval.value.business_Search == '') {
    //   this.toastr.warning('', 'Please Select Bussiness', { timeOut: 1500 });
    //   return false;
    // }
    if (assestval.value.client_fromdate == null || assestval.value.client_fromdate == undefined || assestval.value.client_fromdate == '') {
      this.toastr.warning('', 'Please Select Form Date', { timeOut: 1500 });
      return false;
    }
    if (assestval.value.client_todate == null || assestval.value.client_todate == undefined || assestval.value.client_todate == '') {
      this.toastr.warning('', 'Please Select To Date', { timeOut: 1500 });
      return false;
    }
    if (assestval.value.rm_search == null || assestval.value.rm_search == undefined || assestval.value.rm_search == '') {
      assestval.value.rmid = ""
    } else {
      assestval.value.rmid = assestval.value.rm_search.rm_id
    }
    if (assestval.value.client_search == null || assestval.value.client_search == undefined || assestval.value.client_search == '') {
      assestval.value.client_id = ""
    } else {
      assestval.value.client_id = assestval.value.client_search.client_id
    }
    if (assestval.value.business_Search == null || assestval.value.business_Search == undefined || assestval.value.business_Search == '') {
      assestval.value.bussines_id = ""
    } else {
      assestval.value.bussines_id = assestval.value.business_Search.id
    }
    if (assestval.value.productgrp == null || assestval.value.productgrp == undefined || assestval.value.productgrp == '') {
      assestval.value.id = ""
      
    } else {
      assestval.value.id = assestval.value.productgrp.id
      
    }
    // activeclientsearch
    console.log("asset=>", this.chipSelectedprodid)
    console.log("dateval=>", dateval)
    // this.assectval={
    //   "asset_id":[assestgrp.value.asset_id],
    //   // [assestgrp.value.asset_id]
    //   "month":1,
    // }
    // this.income={
    //   "assest_class":[assestgrp.value.asset_id],
    //   // [assestgrp.value.asset_id]
    //   "month":1,
    // }
    if(assestgrp.value=='' || assestgrp?.value==null || assestgrp?.value==undefined){
      this.assetval=assestgrp?.value?.id
    }else{
      this.assetval=assestgrp?.value?.id
    }
    var from_date = assestval.value.client_fromdate
    this.fromdate = this.datePipe.transform(from_date, 'yyyy-MM-dd')
    console.log("validityfrom=>", this.fromdate)
    var to_date = assestval.value.client_todate
    this.todate = this.datePipe.transform(to_date, 'yyyy-MM-dd')
    this.assest = {
      "assest_class": this.chipSelectedprodid,
      "Rm_id": assestval.value.rmid,
      "fromdate": this.fromdate,
      "todate": this.todate,
      "product_id": assestval.value.id,
      "client_id": assestval.value.client_id,
      "business_id": assestval.value.bussines_id
    }
    console.log("assectval=>", this.assectval)
    this.active_clientlist(this.assest, pageNumber, pageSize)
    this.ppr_client_typelist(this.assest, pageNumber, pageSize)
    for (let levelslist of this.levelslist) {

      levelslist.expanded = false
    }
  }
  clear_todate(date) {
    this.ppractiveclient.controls['client_todate'].reset('')
    // let year = new Date(date).getFullYear();
    //  date.year
    // new Date(date).getFullYear();
    // let month = new Date(date).getMonth();
    //  date.month
    //  new Date(date).getMonth();
    // let day = new Date(date).getDay();
    // date.date
    // new Date(date).getDay();
    let day=date._i.data
    let month=date._i.month
    let year=date._i.year
    console.log("date=>",day, month, year)
    this.maxDate = moment({ year: year, month: month, day: day + 1 }).format('YYYY-MM-DD');

    console.log("date=>", date, this.maxDate)
  }
  active_clientlist(assectval, pageNumber, pageSize) {
    this.SpinnerService.show();
    let bop =0
    let new_client=0
    let attrition=0
    let closing=0
    this.boptotalamount=0
    this.new_clientamount=0
    this.attritionamount=0
    this.closingamount=0
    this.ppractiveservice.activeclientsearch(assectval, pageNumber, pageSize).subscribe((results: any[]) => {
      this.supplierview = false;
      this.SpinnerService.hide();
      console.log("results=>", results)
      let datas = results['data']
      let dataPagination = results['pagination']
      this.activeclient_summary = datas
      for(let summary of this.activeclient_summary){
        console.log("bop=",summary.bop)
         bop +=summary.bop
         new_client +=summary.new_client
         attrition +=summary.attrition
         closing +=summary.closing
      }
      console.log("bop=>",bop)
      this.boptotalamount=bop
      this.new_clientamount=new_client
      this.attritionamount=attrition
      this.closingamount=closing
      // if (datas.length >= 0) {
      //   console.log("val")
      //   this.has_next = dataPagination.has_next;
      //   this.has_previous = dataPagination.has_previous;
      //   this.presentpage = dataPagination.index;
      //   this.isSummaryPagination = true;
      // } if (datas <= 0) {
      //   console.log("val1")

      //   this.isSummaryPagination = false;
      // }
    },
      error => {
        this.errorhandlingservice.handleError(error);
        this.SpinnerService.hide();
      })
  }
  levelslist = [
    { name: "Level 0 - Income", expanded: false },
    { name: "Level 1 - Direct Cost - Establishment", expanded: false },
    { name: "Level 2 - Direct Cost - Other Operating Expense", expanded: false },
    { name: "Level 3 - ROE Adjusted", expanded: false },
    { name: "Level 4 (a) - Allocated Cost - Premises", expanded: false },
    { name: "Level 4 (b) - Allocated Cost - Technology", extends: false },
    { name: "Level 5 - Allocated Cost - B2B", extends: false },
    { name: "Level 6 - Allocated Cost - Corp Admin & Governance Func...", expanded: false }
  ]
  expant_level(i, assestgrp, level, dateval) {
    console.log(i, level)
    
    this.expand = level.expanded
    if (i == 0) {
      let activeval
      // let activeval={
      //     "assest_class":[assestgrp.value.asset_id],
      //     "month":dateval,
      //   }
      if (this.expand == false) {

        this.income_grp_fetch(i,level,this.assest)
      }else{
        this.showdata=true
      }
    }
    if (i == 2) {
      let activeval

      // let activeval={
      //     "assest_class":[assestgrp.value.asset_id],
      //     "month":dateval,
      //   }
      if (this.expand == false) {

        this.otheroperatingexp(level,this.assest)
      }else{
        this.exapnceshow=true
      }
    }
    if (i == 4) {
      let activeval
      // let activeval={
      //     "assest_class":[assestgrp.value.asset_id],
      //     "month":dateval,
      //   }
      if (this.expand == false) {

        this.allocation_cost(i,level,this.assest)
      }
    }
  }
  allocation_cost(index,level,assest){
    let assestgrp
    if(this.assestgrp.value==''|| this.assestgrp.value==undefined || this.assestgrp.value==null){
      assestgrp=''
    }else{
      assestgrp=this.assestgrp.value.id
    }
    let alocationval={
      "core_bscc_code":assest.business_id,
      "bs_id":assestgrp,
      "cc_id":'',
      "level":4
  }
//   let alocationval={
//     "core_bscc":1,
//     "bs_id":'',
//     "cc_id":'',
//     "level":4
// }
  this.SpinnerService.show();
  console.log("index=>",index)
  this.ppractiveservice.income_grp_fetch(index,alocationval).then((results: any[]) => {   
     
    this.SpinnerService.hide()
   
    let data=results['data']
    this.allocationval=data
    if(results['data']?.length==0){
      level.expanded=false
      this.toastr.warning('No Data Found','',{timeOut:1500})
      return false;
    }else{
      this.allocationheader=this.allocationval[0].value
    }
  }, error => {
    level.expanded = false
   
    this.errorhandlingservice.handleError(error);
    this.SpinnerService.hide();
  })
  }
  incomeheader
  async income_grp_fetch(index,level,assestval) {
    // income_header_fetch
    console.log("assestval=>",assestval)
    let PARAMS = {
      "from_date": assestval.fromdate,
      "to_date": assestval.todate,
      "asset_id": assestval.assest_class,
      "Rm_id": assestval.Rm_id,
      "product_id": assestval.product_id,
      "client_id": assestval.client_id,
      "business_id": assestval.business_id
      }
    // let PARAMS={
    //   "asset_id": [10,8,12],
    //   "business_id": 1,
    //   "client_id": "",
    //   "from_date": "2021-11-10",
    //   "product_id": "",
    //   "to_date": "2021-11-11"
    //   }
    this.SpinnerService.show();
    // this.assest
    await this.ppractiveservice.income_grp_fetch(index,PARAMS).then((results: any[]) => {
      this.supplierview = false;

      this.SpinnerService.hide();
      console.log("results=>", results)
      let datas = results['data']
      // let val
      this.incomedata = datas

      if (results['data'].length == 0) {
        this.toastr.warning('', 'No Data Found', { timeOut: 1500 });
       
        level.expanded = false
        
        return false
      }
      if(this.incomedata[0]?.name=='Total'){
        this.toastr.warning('', 'No Data Found', { timeOut: 1500 });
       this.showdata=true
        level.expanded = false
        return false
      }else{
      this.showdata=false
      for (let incomeval of this.incomedata) {
        // this.fee_type.push(incomeval.name)
        incomeval['Padding_left'] = "10px"
        incomeval['tree_flag']='Y'
        incomeval['color']="blue"
      //   for (let val of incomeval.value) {
      //     let classname = val.assest_class.name
      //     // let data = { 'name': val['fee_type'], [classname]: val.amount }
      //     // this.sample.push(data)
      //     this.incomeheader.push(val.assest_class.name)

      //   }
      // }
      // console.log("incomedata=>",this.incomedata)
      // // console.log(this.incomeheader, this.sample, this.fee_type)
      // this.header_name = Array.from(new Set(this.incomeheader))
      let headerdata=this.incomedata[0].asset_name
      this.headername=headerdata
      console.log("header_name=>", this.headername)
      }
      }
     
      console.log("asset=>",this.incomedata)
    }, error => {
      level.expanded = false
      this.showdata=true
      this.errorhandlingservice.handleError(error);
      this.SpinnerService.hide();
    })
  }
  income_treelevel_click(i,income,income_date){
    let a=[]
    let a2 = i + 1
    if (income.tree_flag == 'N') {
      if (income.Padding_left == '10px') {
        for (let i = a2; i < income_date.length; i++) {
          let a1 = income_date[i]
          if((a1.Padding_left == '50px')|| (a1.Padding_left == '100px')|| (a1.Padding_left == '120px')){
            a.push(i)
          }
          if (a1.Padding_left == '10px') { break; }

        }
      }
      if (income.Padding_left == '50px') {
        for (let i = a2; i < income_date.length; i++) {
          let a1 = income_date[i]
          if((a1.Padding_left == '100px')|| (a1.Padding_left == '120px')){
            a.push(i)
          }
          if ((a1.Padding_left == '50px')|| (a1.Padding_left == '10px')) { break; }

        }
      }
      if (income.Padding_left == '100px') {
        for (let i = a2; i < income_date.length; i++) {
          let a1 = income_date[i]
          if((a1.Padding_left == '120px')){
            a.push(i)
          }
          if ((a1.Padding_left == '50px') || (a1.Padding_left == '10px')|| (a1.Padding_left == '100px')) { break; }
         
        }
      }
      const indexSet = new Set(a);

      const arrayWithValuesRemoved = income_date.filter((value, i) =>  !a.includes(i));
      arrayWithValuesRemoved[i].tree_flag = 'Y'
      this.incomedata = arrayWithValuesRemoved;

    }else{
    if (income.Padding_left == '10px') {
      let asset_ref=this.headername.slice(-1)
      console.log("asset_ref=>",asset_ref)
      let exp_param={
        "from_date": this.assest.fromdate,
        "to_date": this.assest.todate,
        "id":income.id,
        "asset_ref":this.headername,
        "asset_id": this.assest.assest_class,
        "Rm_id": this.assest.Rm_id,
        "product_id": this.assest.product_id,
        "client_id": this.assest.client_id,
        "business_id": this.assest.business_id
        
          // "asset_ref":this.headername,
          // "id":income.id,
          // "asset_id": [10,8,12],
          // "business_id": 1,
          // "client_id": "",
          // "from_date": "2021-11-10",
          // "product_id": "",
          // "to_date": "2021-11-11"
          
      }
      console.log(income)
      this.income_headexpand_data(i,income,income_date,exp_param)
  }
  if (income.Padding_left == '50px') {
    let asset_ref=this.headername.slice(-1)
    let exp_param={
      "from_date": this.assest.fromdate,
      "to_date": this.assest.todate,
      "id":income.id,
      "asset_ref":this.headername,
      "asset_id": this.assest.assest_class,
      "Rm_id": this.assest.Rm_id,
      "product_id": this.assest.product_id,
      "client_id": this.assest.client_id,
      "business_id": this.assest.business_id,
      "expgrp_id":income.expensegrp_id
      // "asset_id": [10,8,12],
      // "id":income.id,
      // "asset_ref":this.headername,
      // "business_id": 1,
      // "client_id": "",
      // "from_date": "2021-11-10",
      // "product_id": "",
      // "to_date": "2021-11-11"
    }
    console.log(income)
    this.income_categoryexpand_data(i,income,income_date,exp_param)
}
if (income.Padding_left == '100px') {
  let asset_ref=this.headername.slice(-1)
  let exp_param={
    "from_date": this.assest.fromdate,
    "to_date": this.assest.todate,
    "id":income.id,
    "cat_id":income.id,
    "expgrp_id":income.expensegrp_id,
    "exp_id":income.expense_id,
    "asset_ref":this.headername,
    "asset_id": this.assest.assest_class,
    "Rm_id": this.assest.Rm_id,
    "product_id": this.assest.product_id,
    "client_id": this.assest.client_id,
    "business_id": this.assest.business_id
    // "id":income.id,
    // "asset_ref":this.headername,
    // "asset_id": [10,8,12],
    // "business_id": 1,
    // "client_id": "",
    // "from_date": "2021-11-10",
    // "product_id": "",
    // "to_date": "2021-11-11"
  }
  console.log(income)
  this.income_subcategoryexpand_data(i,income,income_date,exp_param)
}
    }
  }
  income_headexpand_data(i,income,income_date,exp_param){
    this.index_expense = i + 1
    console.log("data val==>",i,income,income_date,exp_param)
    this.SpinnerService.show()
    this.ppractiveservice.income_head_fetch(exp_param).subscribe((results:any)=>{
      this.SpinnerService.hide()
      console.log("results=>",results)
      let datas = results["data"];


      if (datas.length == 0) {
        this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        return false;
      } else {

        for (var val of datas) {
          
            val['Padding_left'] = "50px"
            val['tree_flag']='Y'
            val['color']="#5d4037"
            income_date[i]['tree_flag']='N'
            income_date.splice(this.index_expense, 0, val);
          this.index_expense = this.index_expense + 1
          }
          this.incomedata=income_date
          
    }
  }, error => {
    this.errorhandlingservice.handleError(error);
    this.SpinnerService.hide();
  })


  }
  income_categoryexpand_data(i,income,income_date,exp_param){
    this.index_expense = i + 1
    console.log("data val==>",i,income,income_date,exp_param)
    this.SpinnerService.show()
    this.ppractiveservice.income_cat_fetch(exp_param).subscribe((results:any)=>{
      console.log("results=>",results)
      this.SpinnerService.hide()
      let datas = results["data"];


      if (datas.length == 0) {
        this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        return false;
      } else {

        for (var val of datas) {
          
            val['Padding_left'] = "100px"
            val['tree_flag']='Y'
            val['color']="#455a64"
            income_date[i]['tree_flag']='N'
            income_date.splice(this.index_expense, 0, val);
          this.index_expense = this.index_expense + 1
          }
          this.incomedata=income_date
          
    }
  }, error => {
    this.errorhandlingservice.handleError(error);
    this.SpinnerService.hide();
  })



  }
  income_subcategoryexpand_data(i,income,income_date,exp_param){
    this.index_expense = i + 1
    console.log("data val==>",i,income,income_date,exp_param)
    this.SpinnerService.show()
    this.ppractiveservice.income_subcat_fetch(exp_param).subscribe((results:any)=>{
      this.SpinnerService.hide()
      console.log("results=>",results)
      let datas = results["data"];


      if (datas.length == 0) {
        this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        return false;
      } else {

        for (var val of datas) {
          
            val['Padding_left'] = "120px"
            val['tree_flag']='Y'
            val['color']="#000"
            income_date[i]['tree_flag']='N'
            income_date.splice(this.index_expense, 0, val);
          this.index_expense = this.index_expense + 1
          }
          this.incomedata=income_date
          
    }
  }, error => {
    this.errorhandlingservice.handleError(error);
    this.SpinnerService.hide();
  })
  }
  otheroperatingexp(level,assestval){
    console.log("level",level)
    console.log("assestval=>",assestval)
    console.log("buss=>",assestval.business_id)
    let otheropertingexp={
      "from_date": assestval.fromdate,
      "to_date": assestval.todate,
      "assest_class": assestval.assest_class,
      "Rm_id": assestval.Rm_id,
      "product_id": assestval.product_id,
      "client_id": assestval.client_id,
      "business_id": assestval.business_id
      
    }
  // let otheropertingexp={
  //   "asset_id": [],
  //   "business_id": 3,
  //   "client_id": "",
  //   "from_date": "2022-01-03",
  //   "product_id": "",
  //   "to_date": "2022-04-02"
  //   }
  
    console.log('otheropertingexp=>',otheropertingexp)
    this.SpinnerService.show()
    this.ppractiveservice.otheropertingexpgrp(otheropertingexp).subscribe((results: any[]) => {
    console.log("results=>",results)
    this.SpinnerService.hide()

      let data=results['data']
      this.otheroperexp=data

      if (results['data'].length == 0) {
        this.toastr.warning('', 'No Data Found', { timeOut: 1500 });
        

          level.expanded = false
        
        return false
      }else{
       for(let expgrp of this.otheroperexp){
        expgrp['Padding_left'] = "10px"
        expgrp['tree_flag']='Y'
        expgrp['color']="blue"    
        this.exapnceshow=false 
       }
      console.log("data=>",data[0])
      console.log("data asset=>",data[0].asset_name)
      let assetname=data[0].asset_name
      console.log("assetname=>",assetname)
      this.otheroperexp_headername=assetname
    }}, error => {
      this.errorhandlingservice.handleError(error);
      level.expanded = false
      this.exapnceshow=true
      this.SpinnerService.hide();
    })
  }
  exp_treelevel_click(index,expdata,exp_all_data){
    let a=[]
    let a2 = index + 1
    if (expdata.tree_flag == 'N') {
      if (expdata.Padding_left == '10px') {
        for (let i = a2; i < exp_all_data.length; i++) {
          let a1 = exp_all_data[i]
          if((a1.Padding_left == '50px')|| (a1.Padding_left == '100px')|| (a1.Padding_left == '120px')){
            a.push(i)
          }
          if (a1.Padding_left == '10px') { break; }

        }
      }
      if (expdata.Padding_left == '50px') {
        for (let i = a2; i < exp_all_data.length; i++) {
          let a1 = exp_all_data[i]
          if((a1.Padding_left == '100px')|| (a1.Padding_left == '120px')){
            a.push(i)
          }
          if ((a1.Padding_left == '50px')|| (a1.Padding_left == '10px')) { break; }

        }
      }
      if (expdata.Padding_left == '100px') {
        for (let i = a2; i < exp_all_data.length; i++) {
          let a1 = exp_all_data[i]
          if((a1.Padding_left == '120px')){
            a.push(i)
          }
          if ((a1.Padding_left == '50px') || (a1.Padding_left == '10px')|| (a1.Padding_left == '100px')) { break; }
         
        }
      }
      const indexSet = new Set(a);

      const arrayWithValuesRemoved = exp_all_data.filter((value, i) =>  !a.includes(i));
      arrayWithValuesRemoved[index].tree_flag = 'Y'
      this.otheroperexp = arrayWithValuesRemoved;

    }else{
      if (expdata.Padding_left == '10px') {
        let asset_ref=this.otheroperexp_headername.slice(-1)
        console.log("asset_ref=>",asset_ref)
        let exp_param={
          "from_date": this.assest.fromdate,
          "to_date": this.assest.todate,
          "expensegroup_id":expdata.id,
          "asset_ref":this.otheroperexp_headername,
          "assest_class": this.assest.assest_class,
          "Rm_id": this.assest.Rm_id,
          "product_id": this.assest.product_id,
          "client_id": this.assest.client_id,
          "business_id": this.assest.business_id
        }
        console.log(expdata)
        this.exp_expand_data(index,expdata,exp_all_data,exp_param)
    }
    if (expdata.Padding_left == '50px') {
      let asset_ref=this.otheroperexp_headername.slice(-1)
      let exp_param={
        "from_date": this.assest.fromdate,
        "to_date": this.assest.todate,
        "expensegroup_id":expdata.expensegrp_id,
        "apexpense_id":expdata.id,
        "asset_ref":this.otheroperexp_headername,
        "assest_class": this.assest.assest_class,
        "Rm_id": this.assest.Rm_id,
        "product_id": this.assest.product_id,
        "client_id": this.assest.client_id,
        "business_id": this.assest.business_id
      }
      console.log(expdata)
      this.category_expand_data(index,expdata,exp_all_data,exp_param)
  }
  if (expdata.Padding_left == '100px') {
    let asset_ref=this.otheroperexp_headername.slice(-1)
    let exp_param={
      "from_date": this.assest.fromdate,
      "to_date": this.assest.todate,
      "expensegroup_id":expdata.expensegrp_id,
      "apexpense_id":expdata.expense_id,
      "categorygid":expdata.id,
      "asset_ref":this.otheroperexp_headername,
      "assest_class": this.assest.assest_class,
      "Rm_id": this.assest.Rm_id,
      "product_id": this.assest.product_id,
      "client_id": this.assest.client_id,
      "business_id": this.assest.business_id
    }
    console.log(expdata)
    this.subcategory_expand_data(index,expdata,exp_all_data,exp_param)
}
  }
  }
  exp_expand_data(index,expdata,exp_all_data,exp_param){
    this.index_expense = index + 1
    console.log("data val==>",index,expdata,exp_all_data,exp_param)
    this.SpinnerService.show()
    this.ppractiveservice.expheader(exp_param).subscribe((results:any)=>{
      this.SpinnerService.hide()
      console.log("results=>",results)
      let datas = results["data"];


      if (datas.length == 0) {
        this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        return false;
      } else {

        for (var val of datas) {
          
            val['Padding_left'] = "50px"
            val['tree_flag']='Y'
            val['color']="#5d4037"
            exp_all_data[index]['tree_flag']='N'
            exp_all_data.splice(this.index_expense, 0, val);
          this.index_expense = this.index_expense + 1
          }
          this.otheroperexp=exp_all_data
          
    }
  }, error => {
    this.errorhandlingservice.handleError(error);
    this.SpinnerService.hide();
  })



  }
  category_expand_data(index,expdata,exp_all_data,exp_param){
    this.index_expense = index + 1
    console.log("data val==>",index,expdata,exp_all_data,exp_param)
    this.SpinnerService.show()
    this.ppractiveservice.expcategory(exp_param).subscribe((results:any)=>{
      console.log("results=>",results)
      this.SpinnerService.hide()
      let datas = results["data"];


      if (datas.length == 0) {
        this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        return false;
      } else {

        for (var val of datas) {
          
            val['Padding_left'] = "100px"
            val['tree_flag']='Y'
            val['color']="#455a64"
            exp_all_data[index]['tree_flag']='N'
            exp_all_data.splice(this.index_expense, 0, val);
          this.index_expense = this.index_expense + 1
          }
          this.otheroperexp=exp_all_data
          
    }
  }, error => {
    this.errorhandlingservice.handleError(error);
    this.SpinnerService.hide();
  })



  }
  subcategory_expand_data(index,expdata,exp_all_data,exp_param){
    this.index_expense = index + 1
    console.log("data val==>",index,expdata,exp_all_data,exp_param)
    this.SpinnerService.show()
    this.ppractiveservice.expsubcategory(exp_param).subscribe((results:any)=>{
      this.SpinnerService.hide()
      console.log("results=>",results)
      let datas = results["data"];


      if (datas.length == 0) {
        this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        return false;
      } else {

        for (var val of datas) {
          
            val['Padding_left'] = "120px"
            val['tree_flag']='Y'
            val['color']="#000"
            exp_all_data[index]['tree_flag']='N'
            exp_all_data.splice(this.index_expense, 0, val);
          this.index_expense = this.index_expense + 1
          }
          this.otheroperexp=exp_all_data
          
    }
  }, error => {
    this.errorhandlingservice.handleError(error);
    this.SpinnerService.hide();
  })



  }
  incomeinput = new FormControl();
  clientinput = new FormControl();
  @ViewChild('popup') popup;

  // @ViewChild("income_input")incomeinput : any;
  // @ViewChild("client_input")clientinput : any;
  fileupload_activeclient(event, client_income) {
    console.log(event)

    if (client_income == 1) {
      console.log("active client->event", event.value)
      // console.log("active client=>ElementRef",event['ElementRef'])
      // console.log("active client=>nativeElemen",event['nativeElemen'])
      // console.log("active client=>file",event.files)
      // console.log("active client=>ElementRef",event.nativeElement.file[0].file['name'])
    }
    if (client_income == 2) {
      console.log("income=>", event.value)
    }
  }
  clear_filedetails() {
    
    this.otheroperating.controls['pagenum'].reset('')
    this.otheroperating.controls['pagesize'].reset('')
    this.otheroperating.controls['transactionstartdate'].reset('')
    this.otheroperating.controls['transactiontodate'].reset('')

    this.clientinput.reset('')
    this.incomeinput.reset('')
    this.file_details=''
    this.filed_name=''
    this.numberoffiled=''
  }
  income_table: string[][]
  exceldownload() {
    // let pageNumber = 1
    // let pageSize = 10
    // // this.income_header_download()
    // this.SpinnerService.show();
    // this.ppractiveservice.income_header_fetch(this.assest, pageNumber, pageSize).subscribe((results: any[]) => {
    //   this.supplierview = false;
    //   this.SpinnerService.hide();
    //   let data = results['data']
    //   if (data.length != 0) {
    //     this.header_data = ['name'];

    //     let value = [];
    //     let col = [];

    //     for (let inco of data) {
    //       console.log(inco.name);
    //       col.push(inco.name);
    //       // let name = new Set(col);

    //       // this.dup = Array.from(col);
    //       console.log("col=>", col);

    //     }


    //     let namearray = data.map(x => x.name)
    //     let totalArray = []

    //     for( let index in data ){
    //       console.log("dastaaa -----> ", data )
    //       console.log("dastaaa index-----> ", index )
    //       if(namearray[index] == data[index].name){

    //         let secondValueArray = data[index].value
    //             let valueArraySet = secondValueArray.map(y => y.amount)



            
    //       }

          


    //     }













        // for (let cols of col) {


        //   for (let inco of data) {
        //     if (cols == inco.name) {


        //       for (let val of inco.value) {
        //         //   console.log(val.assest_class.name)

        //         value.push(val.amount);
        //         this.header_data.push(val.assest_class.name);
        //         console.log("header_data1=>", this.header_data, this.dup)

        //       }
        //     }
        //   }
        // }

        //  console.log
    //   } else {
    //     let nodata = "no data"
    //     this.header_data = ['Income']
    //     this.dup.push(nodata)
    //     console.log("else=>", this.dup, this.header_data)
    //   }
    // })
    
    let assestgrp=''
    let level={
      "name": "Level 0 - Income",
      "expanded": true
  }
  // for (let levelslist of this.levelslist) {

  //   levelslist.expanded = true
  // }
  let ind=0
  // this.levelslist[0].expanded=true
  //  this.income_grp_fetch(ind,assestgrp,this.assest)
  
    // console.log()
    // if(this.showdata=false ){
      this.income_header_download()

    // }
  
    // this.ppractiveservice.excel_download(this.assest)
    // .subscribe((data:any) => { 
    // this.SpinnerService.hide();

    // let binaryData = [];
    // binaryData.push(data)
    // let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    // let link = document.createElement('a');
    // link.href = downloadUrl;
    // link.download = "PPR Income.xlsx";
    // link.click();
    // }, error => {
    //   this.errorhandlingservice.handleError(error);
    //   this.SpinnerService.hide();
    // })
    // this.excel=undefined

  }
  dup: any[] = [];

  income_header_download(pageNumber = 1, pageSize = 10) {
    console.log("header_data=>", this.header_data)
    this.dup=[['name',1,13,3,4],['name',1,13,3,4]]
    this.income_table = [this.header_data, this.dup];
    console.log("income", this.income_table)
    var wsrows = [
      { hpt: 12 }, // row 1 sets to the height of 12 in points
      { hpx: 16 }, // row 2 sets to the height of 16 in pixels
    ];
    
    let header=[['PPR Report']]
    let client = document.getElementById('activeclient-table');
    let typelist = document.getElementById('typelist-table');
  

    const c_table: XLSX.WorkSheet = XLSX.utils.table_to_sheet(client);
    const t_table: XLSX.WorkSheet = XLSX.utils.table_to_sheet(typelist);
    // const i_table: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.income_table);

 
    let table1 = XLSX.utils.sheet_to_json(c_table, { header: 1 });
    let table2 = XLSX.utils.sheet_to_json(t_table, { header: 1 });
   
    table1 = table1.concat(['']).concat(table2);
    if(this.showdata==false){
      let incomelist = document.getElementById('income-header');
      const i_table: XLSX.WorkSheet = XLSX.utils.table_to_sheet(incomelist);
      let table3 = XLSX.utils.sheet_to_json(i_table, { header: 1 });
      table1 = table1.concat(['']).concat(table3);
    }
    if(this.exapnceshow==false){
      let expance = document.getElementById('expance-sheet');
      const e_table: XLSX.WorkSheet = XLSX.utils.table_to_sheet(expance);
      let table4 = XLSX.utils.sheet_to_json(e_table, { header: 1 });
      table1 = table1.concat(['']).concat(table4);
    }
    // bold = workbook.add_format({'bold': True});
    let worksheet = XLSX.utils.json_to_sheet(table1, { skipHeader: true });
    
    // worksheet.A1.v = "Name"
    // console.log("worksheet=>",worksheet)
    // var range = XLSX.utils.decode_range(worksheet['!ref']);
    // for(var C = range.s.c; C <= range.e.c; ++C) {
    //   var address = XLSX.utils.encode_col(C) + "1"; // <-- first row, column number C
    //   if(!worksheet[address]) continue;
    //   console.log("row v=>",worksheet[address].v)
    //   console.log("c=>",C)
    //   worksheet[address].v = worksheet[address].v.toUpperCase();
    // }
    const new_workbook = XLSX.utils.book_new();
    worksheet['!rows'] = wsrows;
    XLSX.utils.book_append_sheet(new_workbook, worksheet, 'PPR Reports');
    XLSX.writeFile(new_workbook, "PPR Report's.xls");
  }
  pprsearch_clear(assestgrp, ppractiveclient) {
    this.chipSelectedprod = []
    this.chipSelectedprodid = []
    ppractiveclient.controls['client_todate'].reset('');
    ppractiveclient.controls['client_fromdate'].reset('');
    ppractiveclient.controls['client_search'].reset('');
    ppractiveclient.controls['rm_search'].reset('');
    ppractiveclient.controls['productgrp'].reset('');
    ppractiveclient.controls['business_Search'].reset('');
    this.chipinput.nativeElement.value = '';



  }
  onDrop(event: CdkDragDrop<string[]>) {
    console.log(event.currentIndex)
    console.log(event.previousIndex)
    console.log(this.ppr_clienttypelist)
    // this.activeclient_summary[event.currentIndex]=this.activeclient_summary[event.previousIndex]
    // this.activeclient_summary[event.previousIndex]=this.activeclient_summary[event.currentIndex]
    console.log("event=>", event)
    moveItemInArray(this.ppr_clienttypelist, event.previousIndex, event.currentIndex);
    // this.activeclient_summary.forEach((user, idx) => {
    //   console.log(user)
    //   user.order = idx + 1;
    // });
  }
  upload_file(e){
    console.log("event=>",e.target.files[0])
    let file_uplode=e.target.files[0]
   this.file_details=file_uplode
    }
  upload(numberoffiled){
    console.log("file_details=>",this.file_details)
    if(this.file_details==null || this.file_details==undefined || this.file_details==''){
      this.toastr.warning('', 'Please Select The Any .xlsx File', { timeOut: 1500 });
      return false;

    }
    if(numberoffiled==1){
      this.SpinnerService.show()
      this.ppractiveservice.activeclientupload(this.file_details).subscribe(e=>{
      this.SpinnerService.hide()
      if(e.status=='success'){
        this.toastr.success('',e['message'],{timeOut:1500})
       }if(e.code=='UNEXPECTED_ERROR'){    
        this.toastr.warning('',e['description'],{timeOut:1500})
      
      }
      console.log("element=>",e)
      this.closepop.nativeElement.click();
      this.clientinput.reset('')
      this.incomeinput.reset('')
      this.file_details=''
      this.filed_name=''
      this.numberoffiled=''
        
    }, error => {
      this.errorhandlingservice.handleError(error);
      this.SpinnerService.hide();
    })
    }if(numberoffiled==3){
      this.SpinnerService.show()
      this.ppractiveservice.incomeupload(this.file_details).subscribe(e=>{
        this.SpinnerService.hide()
        console.log("element=>",e)
        if(e.status=='success'){
          this.toastr.success('',e['message'],{timeOut:1500})
        }if(e.code=='UNEXPECTED_ERROR'){    
          this.toastr.warning('',e['description'],{timeOut:1500})
        }
        this.closepop.nativeElement.click();
        this.clientinput.reset('')
        this.incomeinput.reset('')
        this.file_details=''
        this.filed_name=''
        this.numberoffiled=''

    }, error => {
      this.errorhandlingservice.handleError(error);
      this.SpinnerService.hide();
    })
    }
   
  }
  @ViewChild('closepop') closepop
  sum=0
  fileuploadopen(filed_name,numberoffiled){
    console.log("ref=>",filed_name,numberoffiled)
    this.numberoffiled=numberoffiled
    this.filed_name=filed_name
  }
  @ViewChild('closepopexp') closepopexp

  otheroperatingupload(otheroperating){
    let pagenum:Number=otheroperating.value.pagenum
    if(otheroperating.value.pagenum == ''|| otheroperating.value.pagenum == null || otheroperating.value.pagenum== undefined){
      this.toastr.warning('', 'Please Enter The Page Number', { timeOut: 1500 });
      return false;
    }
    if(otheroperating.value.pagesize =='' || otheroperating.value.pagesize == null || otheroperating.value.pagesize ==undefined){
      this.toastr.warning('', 'Please Enter The Page Size', { timeOut: 1500 });
      return false;
    }
    if(otheroperating.value.transactionstartdate =='' || otheroperating.value.transactionstartdate == null || otheroperating.value.transactionstartdate ==undefined){
      this.toastr.warning('', 'Please Select The Transaction From Date', { timeOut: 1500 });
      return false;
    }
    if(otheroperating.value.transactiontodate =='' || otheroperating.value.transactiontodate == null || otheroperating.value.transactiontodate ==undefined){
      this.toastr.warning('', 'Please Select The Transaction To Date', { timeOut: 1500 });
      return false;
    }
    console.log("otheroperating=>",otheroperating)
    console.log("pagenum=>",otheroperating.value.pagenum)
    console.log("page size=>",otheroperating.value.pagesize)
    console.log("Date=>",otheroperating.value.transactionstartdate)
    // otheroperatingupload
    let date=otheroperating.value.transactionstartdate
    let from_date=this.datePipe.transform(date, 'yyyy-MM-dd')
    console.log("from_date=>",from_date)
    let todate=otheroperating.value.transactiontodate
    let to_date=this.datePipe.transform(todate, 'yyyy-MM-dd')
    let otheroperatingprams={
      "page_number": otheroperating.value.pagenum-1,
      "page_size": otheroperating.value.pagesize,
      "transaction_from_date":from_date,
      "transaction_to_date":to_date
    }
    console.log("otheroperatingprams=>",otheroperatingprams)
    this.SpinnerService.show()
    this.ppractiveservice.otheroperatingupload(otheroperatingprams).subscribe(e=>{
    this.SpinnerService.hide()

      if(e.status=='success'){
        this.toastr.success('',e.message,{ timeOut: 1500 })
        this.otheroperating.controls['pagenum'].reset('')
        this.otheroperating.controls['pagesize'].reset('')
        this.otheroperating.controls['transactionstartdate'].reset('')
        this.otheroperating.controls['transactiontodate'].reset('')
        this.closepopexp.nativeElement.click();

        
      }
      if(e.code=='UNEXPECTED_ERROR'){
        this.toastr.warning('',e['description'],{timeOut:1500})
        this.otheroperating.controls['pagenum'].reset('')
        this.otheroperating.controls['pagesize'].reset('')
        this.otheroperating.controls['transactionstartdate'].reset('')
        this.otheroperating.controls['transactiontodate'].reset('')
        this.closepopexp.nativeElement.click();

        
      }
    }, error => {
      this.errorhandlingservice.handleError(error);
      this.SpinnerService.hide();
    })

  }
  transactiontodate(date) {
    // this.ppractiveclient.controls['client_todate'].reset('')
    let day=date._i.date
    let month=date._i.month
    let year=date._i.year
    console.log("date=>",day, month, year)
    this.transation_minDate = moment({ year: year, month: month, day: day}).format('YYYY-MM-DD');

    console.log("date=>", date, this.transation_minDate)
  }
  trancationmin_todate(date){
    if(date!=''|| date != null || date!= undefined){

    
        // let minDate = moment({year: data. - 100, month: this.month, day: this.day}).format('YYYY-MM-DD');
        let year = date._i.year
        // new Date(date).getFullYear();
        let month = date._i.month
        //  new Date(date).getMonth();
        let day = date._i.date
        // new Date(date).getDay();
        console.log(day, month, year)
        this.trancationmaxDate = moment({ year: year, month: month, day: day }).format('YYYY-MM-DD');
        console.log("maxdate=>",)
    }
  }
  private asset_Bscodesearch(keyvalue) {
    this.ppractiveservice.get_business_dropdown(1,keyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BsccSearch = datas;
        
        console.log("main=>",this.BsccSearch)
      })
  }
  allocationform_search() {
    let keyvalue: String = "";
    this.asset_Bscodesearch(keyvalue);
    this.ppractiveclient.get('business_Search').valueChanges
      .pipe(
        
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ppractiveservice.get_business_dropdown(1,value,1)
          .pipe(
            finalize(() => {
              // console.log(value.id)
              // this.val=value
              this.srachid=value.id
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BsccSearch = datas;
        console.log("value")
      })
  }
   
  public displaybspprsearch(bsccocde_level?: BSCNameLists): string | undefined {
    return bsccocde_level ? bsccocde_level.name : undefined;
  }
  allocationfromscroll(){
    console.log("scroll")
    this.has_nextval = true
    this.has_previousval = true
    this.currentpagenum = 1
    setTimeout(() => {
      if (
        this.bssearchAutoComplete &&
        this.autocompleteTrigger &&
        this.bssearchAutoComplete.panel
      ) {
        fromEvent(this.bssearchAutoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.bssearchAutoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.bssearchAutoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.bssearchAutoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.bssearchAutoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              console.log(this.has_nextval)
              if (this.has_nextval === true) {
                console.log("true")
                this.ppractiveservice.get_business_dropdown(1,this.bssearchInput.nativeElement.value, this.currentpagenum+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    console.log("loop",this.currentpagenum)
                    this.BsccSearch = this.BsccSearch.concat(datas);
                    if (this.BsccSearch.length >= 0) {
                      this.has_nextval = datapagination.has_next;
                      console.log("datapagination.has_next=>",datapagination.has_next)
                      this.has_previousval = datapagination.has_previous;
                      this.currentpagenum = datapagination.index;
                    }
                  })

              }
              
            }
          });
      }
    });
  }
}
