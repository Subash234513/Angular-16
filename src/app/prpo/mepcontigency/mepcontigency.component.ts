import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { isBoolean } from 'util';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from "ngx-spinner";
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { emplistss } from '../mepapprover/mepapprover.component';
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

export interface prodCatlistss {
  id: string;
  name, code: any
}


@Component({
  selector: 'app-mepcontigency',
  templateUrl: './mepcontigency.component.html',
  styleUrls: ['./mepcontigency.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class MepcontigencyComponent implements OnInit {
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
  prodCatList: Array<prodCatlistss>;




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
  @ViewChild('prodCat') matprodCatAutocomplete: MatAutocomplete;
  @ViewChild('prodCatInput') prodCatInput: any;

  todayDate = new Date();
  clicked = false;

  constructor(private fb: FormBuilder, private prposhareService: PRPOshareService, private shareService: SharedService,
    private dataService: PRPOSERVICEService, private toastr: ToastrService,
    private notification: NotificationService, private errorHandler: ErrorHandlingServiceService,
    private router: Router, private datePipe: DatePipe, private SpinnerService: NgxSpinnerService) { }


  ngOnInit(): void {
    this.MEPmakerForm = this.fb.group({
      no: ['', Validators.required],
      content: ['', Validators.required],
      name: ['', Validators.required],
      parno: ['', Validators.required],
      type: ['', Validators.required],
      amount: ['', Validators.required],
      finyear: ['', Validators.required],
      budgeted: ['', Validators.required],
      projectowner_id: ['', Validators.required],
      requestfor: ['', Validators.required],
      startdate: [{ value: "", enabled: isBoolean }],
      contigency :['', Validators.required],
      enddate: [{ value: "", enabled: isBoolean }],
      branch_id: ['', Validators.required],
      mode: ['', Validators.required],
      raisor_id: ['', Validators.required],
      budgetowner_id: ['', Validators.required],
      justification: ['', Validators.required],
      mepdetails: new FormArray([
       
      ]),
      id: ['', Validators.required]
    })


    
    



    this.getmepedit();
    this.getParyear();
    this.getParexpensetype();

  }
  MEPdet() {
    let group = new FormGroup({
      productcategory_id: new FormControl(''),
      desc: new FormControl(''),
      
      totalamt: new FormControl(''),
    })
    

    group.get('totalamt').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      console.log("should be called first")
      this.datasums()
      if (!this.MEPmakerForm.valid) {
        return;
      }
      this.linesChange.emit(this.MEPmakerForm.value['mepdetails']);
    }
    )

    return group
  }

  //////////////////calculation for mep details multiplication and total
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
  getSections(form) {
    return form.controls.mepdetails.controls;
  }
  addSection() {
    const control = <FormArray>this.MEPmakerForm.get('mepdetails');
    control.push(this.MEPdet());
  }

  removeSection(i) {
    const control = <FormArray>this.MEPmakerForm.get('mepdetails');
    control.removeAt(i);

  }

  ///////////////////////////////////patch data
  getFormArray(): FormArray {
    return this.MEPmakerForm.get('mepdetails') as FormArray;
  }
  isopex: boolean
  iscapex: boolean
  selectedValue: any
  selectedsValue: any
  statusShow: any
  justification_remarksStatus: any
  getmepedit() {
    this.SpinnerService.show();
    let data: any = this.prposhareService.MepParentShare.value
    let id = data.id
    this.dataService.getmepEdit(id)
      .subscribe((result: any) => {
        console.log('array details', result.mepdetails)
        console.log('header details', result)
        const { id, no, name, parno, type, originalamount, startdate, enddate, finyear, mode, branch_id,
          raisor_id, budgeted, projectowner_id, requestfor, budgetowner_id, justification, contigency, content, mep_status, remarks } = result;
        let startdates = this.datePipe.transform(startdate, 'yyyy-MM-dd');
        let endates = this.datePipe.transform(enddate, 'yyyy-MM-dd');
      
        this.MEPmakerForm.patchValue({
          no, name, parno, content,
          type, amount: originalamount,

          startdate: startdates, enddate: endates, finyear,
          branch_id,contigency,
          mode,
          raisor_id, budgeted, projectowner_id, requestfor, budgetowner_id, justification, id
        })
        this.statusShow = mep_status
        this.justification_remarksStatus = remarks
        this.meptotalget();
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
          
            this.SpinnerService.hide();
          
          totalamt.valueChanges.pipe(
            debounceTime(20)
          ).subscribe(value => {
            console.log("should be called first")
            this.datasums()
            if (!this.MEPmakerForm.valid) {
              return;
            }
            this.linesChange.emit(this.MEPmakerForm.value['mepdetails']);
          }
          )


          this.MEPmakerForm.get('contigency').valueChanges
            .pipe(
              debounceTime(20),
            ).subscribe(value => {
              console.log("should be called first")
              this.contigencyvaluechanges();
            }
            )

        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
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









  //////////////////////////////////////par no scroll

  displayFnparno(parno?: any) {
    if ((typeof parno) === 'string') {
      return parno;
    }
    return parno ? this.parnoList.find(_ => _.no === parno).no : undefined;
  }


  //////////////////////////////////////////branch scroll

  public displayFnbranch(branch?: branchlistss): string | undefined {
    let code = branch ? branch.code : undefined;
    let name = branch ? branch.name : undefined;
    return branch ? code + "-" + name : undefined;
  }

  get branch() {
    return this.MEPmakerForm.get('branch_id');
  }


  //////////////////////////////////raisor scroll


  public displayFnraisor(raisor?: emplistss): string | undefined {
    return raisor ? raisor.full_name : undefined;
  }

  get raisor() {
    return this.MEPmakerForm.get('raisor_id');
  }




  //////////////////////////////////project owner scroll


  public displayFnprojectowner(projectowner?: emplistss): string | undefined {
    return projectowner ? projectowner.full_name : undefined;
  }

  get projectowner() {
    return this.MEPmakerForm.get('projectowner_id');
  }



  //////////////////////////////////req for scroll


  displayFnrfor(rfor) {
    if ((typeof rfor) === 'string') {
      return rfor;
    }
    return rfor ? this.requestforList.find(x => x.id === rfor).name : undefined;
  }

 



  //////////////////////////////////budgetowner scroll

  public displayFnbudgetowner(budgetowner?: emplistss): string | undefined {
    return budgetowner ? budgetowner.full_name : undefined;
  }

  

  

  public displayFnprodCat(prod?: prodCatlistss): string | undefined {
    return prod ? prod.name : undefined;
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  onCancelClick() {
    this.onCancel.emit()
    //this.router.navigate(['/mepmaker'], { skipLocationChange: true })
  }



  resultpercentage: any
 
  mepmakerSubmit() {
    if (this.MEPmakerForm.value.contigency === 0) {
      this.notification.showWarning("Zero % NOT ALLOWED ")
      this.clicked = false
      return false
    }
    let amountintotalCon: any = this.totalconamount.value
    let ConAmountValidation = amountintotalCon - this.MEPmakerForm.value.amount
    console.log("amountintotalCon", amountintotalCon)
    console.log("ConAmountValidation", ConAmountValidation)

    // if (this.totalconamount.value < this.sum || this.totalconamount.value > this.sum) {
    //   this.notification.showWarning("Invalid Amount, Please Check Contingency Total Amount and Details Amount ")
    //   this.clicked = false
    //   return false
    // }

    let Startdate = this.MEPmakerForm.value.startdate
    let startdate = this.datePipe.transform(Startdate, 'yyyy-MM-dd');

    let Enddate = this.MEPmakerForm.value.enddate
    let enddate = this.datePipe.transform(Enddate, 'yyyy-MM-dd');


    this.MEPmakerForm.value.startdate = startdate
    this.MEPmakerForm.value.enddate = enddate


    // let enddateAndFinalYear = this.datePipe.transform(Enddate, 'yyyy');
    // let yearvalidation: number = +enddateAndFinalYear         //////////////end date chaning to number
    // let maxfinalyear = new Date()
    // let maxfinalyearformat = this.datePipe.transform(maxfinalyear, 'yyyy');   //////////now date changing format 
    // let maxfinalyearformatToNumber: number = +maxfinalyearformat               //////////now date changing to number 
    // let maxfinalyearvalidation = maxfinalyearformatToNumber + 50  //////////now date changing to 50 years
    if (this.totalconamount.value < this.sum || this.totalconamount.value > this.sum) {
      this.notification.showWarning("Invalid Amount in Contingency Total amount and PCA details Amount")
      this.clicked = false
      return false
    }
    if (this.MEPmakerForm.value.amount <= 0) {
      this.toastr.error('Check PCA Amount', 'Please Enter Valid Amount');
      this.clicked = false
      return false;
    }
    if (this.MEPmakerForm.value.enddate < this.MEPmakerForm.value.startdate) {
      this.toastr.error('Select Valid Date', 'End date must be greater than Start date');
      this.clicked = false
      return false;
    }
    // if (this.MEPmakerForm.value.finyear > maxfinalyearvalidation) {
    //   this.toastr.error('Select Valid Final Year', 'From this year to 50 years Valid');
    //   this.clicked = false
    //   return false;
    // }
    // if (yearvalidation > this.MEPmakerForm.value.finyear) {
    //   this.toastr.error('Select Valid End Date', 'From Selected Final year to 50 years Valid');
    //   this.clicked = false
    //   return false;
    // }
    if (this.MEPmakerForm.value.contigency === 0) {
      this.notification.showWarning("Zero% NOT ALLOWED ")
      this.clicked = false
      return false
    }
    // if (this.totalconamount.value < this.sum || this.totalconamount.value > this.sum) {
    //   this.notification.showWarning("Invalid Amount ")
    //   this.clicked = false
    //   return false
    // }

    this.clicked = true
    let datas = this.MEPmakerForm.get('mepdetails')['controls']
    for (let i in datas) {
      if (datas) {
        if (datas[i].value.productcategory_id.id == undefined) {
          datas[i].value.productcategory_id = datas[i].value.productcategory_id
        }
        else {
          datas[i].value.productcategory_id = datas[i].value.productcategory_id.id
        }
      }
    }
    if ( this.MEPmakerForm.value.branch_id.id == undefined) {
      this.MEPmakerForm.value.branch_id = this.MEPmakerForm.value.branch_id
    }
    else {
      this.MEPmakerForm.value.branch_id = this.MEPmakerForm.value.branch_id.id
    }

    if ( this.MEPmakerForm.value.raisor_id.id == undefined) {
      this.MEPmakerForm.value.raisor_id = this.MEPmakerForm.value.raisor_id
    }
    else {
      this.MEPmakerForm.value.raisor_id = this.MEPmakerForm.value.raisor_id.id
    }


    if ( this.MEPmakerForm.value.projectowner_id.id == undefined) {
      this.MEPmakerForm.value.projectowner_id = this.MEPmakerForm.value.projectowner_id
    }
    else {
      this.MEPmakerForm.value.projectowner_id = this.MEPmakerForm.value.projectowner_id.id
    }


    if ( this.MEPmakerForm.value.budgetowner_id.id == undefined) {
      this.MEPmakerForm.value.budgetowner_id = this.MEPmakerForm.value.budgetowner_id
    }
    else {
      this.MEPmakerForm.value.budgetowner_id = this.MEPmakerForm.value.budgetowner_id.id
    }
    console.log('datas', datas)
    let data = this.MEPmakerForm.value
    this.dataService.MEPmakerFormSubmit(data)
      .subscribe(result => {
        if (result.percentage) {
          this.notification.showError('Maximum Allotted Contingency Percentage is' + " " + result.percentage + '%')
          this.resultpercentage = result.percentage
          this.clicked = false
          return false
        }
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          this.clicked = false
        }
        else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
          this.notification.showError("UNEXPECTED ERROR")
          this.clicked = false
        }
        else if (result.error == "Error" && result.description == "Please Check Total Amount") {
          this.clicked = false
          this.notification.showError("Check PCA amount should not exceed than Selected BPA amount")
        }
        else {
          this.notification.showSuccess("Successfully Updated!...")
          this.onSubmit.emit();
        }
        console.log("prserv/mep Form SUBMIT", result)
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  paramountaddition: any
  gettingamount: any
  meptotalList: any
  amoun: any
  approvedamt = 0
  pendamt: any
  mepappr: any
  balanceAmount:any
  private meptotalget() {
    this.selectedsValue = this.MEPmakerForm.get('parno').value	
    this.selectedValue = this.MEPmakerForm.get('type').value	
    if(this.selectedsValue == undefined){	
      return false	
    }	
    if(this.selectedValue == undefined){	
      return false	
    }	
    this.iscapex = true
    this.dataService.meptotalget(this.selectedValue, this.selectedsValue)
      .subscribe((results: any[]) => {
        this.meptotalList = results;
        this.amoun = this.meptotalList.par_amount
        this.balanceAmount = this.meptotalList.balance_amount
        this.approvedamt = this.meptotalList.balance_amount
        
          this.pendamt = this.meptotalList.pending_amount
       
          this.mepappr = this.meptotalList.approved_amount
       
        if (!('pardetails' in results)) {
          this.approvedamt = 0
        }

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

  omit_hyphen(event) {
    var k;
    k = event.charCode;
    return ((k >= 48 && k <= 57));
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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



}