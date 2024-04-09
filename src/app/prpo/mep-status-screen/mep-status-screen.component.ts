import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
// import { isBoolean } from 'util';
import { ViewChild } from '@angular/core';
import { debounceTime} from 'rxjs/operators';
import {  MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
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
export interface parnolistss {
  id: any;
  no: any;
}
export interface branchlistss {
  id: any;
  code: string;
  name: string;
}
export interface raisorlistss {
  id: any;
  full_name: string;
}
export interface projectownlistss {
  id: any;
  full_name: string;
}
export interface rforlistss {
  id: any;
  name: string;
}
export interface budgetownerlistss {
  id: any;
  full_name: string;
}
export interface emplistss {
  id: any;
  full_name: string;
}

export interface prodCatlistss {
  id: string;
  name, code: any
}

@Component({
  selector: 'app-mep-status-screen',
  templateUrl: './mep-status-screen.component.html',
  styleUrls: ['./mep-status-screen.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class MepStatusScreenComponent implements OnInit {
  MEPmakerForm: FormGroup;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() linesChange = new EventEmitter<any>();

  expensetype: any;
  FinancialYearList: any
  yesorno: any[] = [
    { value: 1, display: 'Yes' },
    { value: 0, display: 'No' }
  ]
  parornopar: any[] = [
    { value: 1, display: 'Par' },
    { value: 0, display: 'No Par' }
  ]
  date = new Date()

  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;

  parnoList: Array<parnolistss>;

  branchList: Array<branchlistss>;

  raisorList: Array<raisorlistss>;
 
  projectownerList: Array<projectownlistss>;
  
  requestforList: Array<rforlistss>;

  budgetownerList: Array<budgetownerlistss>;
 
  productCatList: Array<prodCatlistss>;
 

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('parno') matparnoAutocomplete: MatAutocomplete;
  @ViewChild('parnoInput') parnoInput: any;
  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('raisor') matraisorAutocomplete: MatAutocomplete;
  @ViewChild('raisorInput') raisorInput: any;
  @ViewChild('projectowner') matprojectownerAutocomplete: MatAutocomplete;
  @ViewChild('projectownerInput') projectownerInput: any;
  @ViewChild('rfor') matrforAutocomplete: MatAutocomplete;
  @ViewChild('rforInput') rforInput: any;
  @ViewChild('budgetowner') matbudgetownerAutocomplete: MatAutocomplete;
  @ViewChild('budgetownerInput') budgetownerInput: any;
  @ViewChild('prod') matprodAutocomplete: MatAutocomplete;
  @ViewChild('prodInput') prodInput: any;

  todayDate = new Date();
  clicked = false;

  constructor(private fb: FormBuilder, private prposhareService: PRPOshareService,
    private dataService: PRPOSERVICEService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService, 
    private datePipe: DatePipe, ) { }


  ngOnInit(): void {
    this.MEPmakerForm = this.fb.group({
      no: [''],
      name: [''],
      parno: [''],
      type: [''],
      amount: [''],
      finyear: [''],
      budgeted: [''],
      projectowner_id: [''],
      requestfor: [''],
      startdate: [{ value: ""}],
      enddate: [{ value: "" }],
      branch_id: [''],
      mode: [''],
      raisor_id: [''],
      budgetowner_id: [''],
      justification: [''],
      contigency: [''],
      content:'',
      mepdetails: new FormArray([
      ]),
      id: ['']
    })
    this.getmepedit();
    this.getParyear();
    this.getParexpensetype();
  }
  
  calcTotal(group: FormGroup) {
    const qty = +group.controls['qty'].value;
    const unitprice = +group.controls['unitprice'].value;
    group.controls['totalamt'].setValue((qty * unitprice), { emitEvent: false });
    this.datasums();
  }
  calcTotalpatch(unitprice, qty, totalamt: FormControl) {
    const unitprices = unitprice.value
    const qtys = qty.value
    totalamt.setValue((qtys * unitprices), { emitEvent: false });
    this.datasums();
  }
  amt: any;
  sum: any = 0.00;
  datasums() {
    this.amt = this.MEPmakerForm.value['mepdetails'].map(x => x.totalamt);
    console.log('data check amt', this.amt);
    this.sum = this.amt.reduce((a, b) => a + b, 0);
    console.log('sum of total ', this.sum);

  }
  convalue: any
  total: any
  totalconamount = new FormControl
  contigencyvaluechanges() {
    this.convalue = ((this.MEPmakerForm.value.contigency * this.MEPmakerForm.value.amount) / 100)
    console.log("check for value changees", this.convalue)
    this.total = this.MEPmakerForm.value.amount + this.convalue
    console.log("check for value total", this.total)
    this.totalconamount.setValue(this.total)
  }
  getSections(form) {
    return form.controls.mepdetails.controls;
  }


  ///////////////////////////////////patch data

  getFormArray(): FormArray {
    return this.MEPmakerForm.get('mepdetails') as FormArray;
  }

  statusShow: any
  justification_remarksStatus: any

  getmepedit() {
    this.SpinnerService.show();
    let data: any = this.prposhareService.MepStatusShare.value
    let id = data.id
    this.dataService.getmepEdit(id)
      .subscribe((result: any) => {
        console.log('array details', result.mepdetails)
        const { id, no, name, parno, type, originalamount, startdate, enddate, finyear, mode, remarks,content,
          raisor_id, budgeted, projectowner_id, requestfor, budgetowner_id, justification, contigency, mep_status } = result;
        let startdates = this.datePipe.transform(startdate, 'yyyy-MM-dd');
        let endates = this.datePipe.transform(enddate, 'yyyy-MM-dd');

        this.MEPmakerForm.patchValue({
          contigency, no, name, parno,content,
          type, amount: originalamount,

          startdate: startdates, enddate: endates, finyear,
          branch_id: result.branch_id,
          mode,
          raisor_id, budgeted, projectowner_id, requestfor, budgetowner_id, justification, id
        })
        this.statusShow = mep_status
        this.justification_remarksStatus = remarks
        for (let detail of result.mepdetails) {

          let productcategory_id: FormControl = new FormControl('');
          let descControl: FormControl = new FormControl('');
          let qty: FormControl = new FormControl('');
          let unitprice: FormControl = new FormControl('');
          let totalamt: FormControl = new FormControl('');
          let idControl: FormControl = new FormControl('');

          productcategory_id.setValue(detail.commodity_id)
          descControl.setValue(detail.desc);
          qty.setValue(detail.qty);
          unitprice.setValue(detail.unitprice);
          totalamt.setValue(detail.totalamt);
          idControl.setValue(detail.id);

          this.getFormArray().push(new FormGroup({
            productcategory_id: productcategory_id,
            desc: descControl,
            qty: qty,
            unitprice: unitprice,
            totalamt: totalamt,
            id: idControl,
          }));
          this.datasums();
          this.contigencyvaluechanges();
          setTimeout(() => {
            this.SpinnerService.hide();
          }, 1000);

          unitprice.valueChanges.pipe(
            debounceTime(20)
          ).subscribe(value => {
            console.log("should be called first")
            this.calcTotalpatch(unitprice, qty, totalamt)
            // this.datasums()
            if (!this.MEPmakerForm.valid) {
              return;
            }

            this.linesChange.emit(this.MEPmakerForm.value['mepdetails']);
          }
          )

          qty.valueChanges.pipe(
            debounceTime(20)
          ).subscribe(value => {
            console.log("should be called first")
            this.calcTotalpatch(unitprice, qty, totalamt)
            if (!this.MEPmakerForm.valid) {
              return;
            }
            this.linesChange.emit(this.MEPmakerForm.value['mepdetails']);
          }
          )

        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  //////////////////////////////////////par no scroll
  displayFnparno(parno?: any) {
    if ((typeof parno) === 'string') {
      return parno;
    }
    return parno ? this.parnoList.find(_ => _.no === parno).no : undefined;
  }
 
  public displayFnbranch(branch?: branchlistss): string | undefined {
    let code = branch ? branch.code : undefined;
    let name = branch ? branch.name : undefined;
    return branch? code + "-" + name : undefined;
    //return branch ? branch.code : undefined;
  }

  public displayFnraisor(raisor?: emplistss): string | undefined {
    return raisor ? raisor.full_name : undefined;
  }

  public displayFnprojectowner(projectowner?: emplistss): string | undefined {
    return projectowner ? projectowner.full_name : undefined;
  }

  displayFnrfor(rfor) {
    if ((typeof rfor) === 'string') {
      return rfor;
    }
    return rfor ? this.requestforList.find(x => x.id === rfor).name : undefined;
  }

  public displayFnbudgetowner(budgetowner?: emplistss): string | undefined {
    return budgetowner ? budgetowner.full_name : undefined;
  }


  public displayFnprodCat(prod?: prodCatlistss): string | undefined {
    return prod ? prod.name : undefined;
  }

  onCancelClick() {
    this.onCancel.emit()
  }

  getParyear() {
    this.dataService.getParyear()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.FinancialYearList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  
  getParexpensetype() {
    this.dataService.getParexpensetype()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.expensetype = datas;
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

  editorDisabled = true;

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
}

