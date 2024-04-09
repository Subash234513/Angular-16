import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
// import { isBoolean } from 'util';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
// import { fromEvent } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
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
export interface amountlistss {
  amount: any;
}
export interface rforlistss {
  id: any;
  name: string;
}

@Component({
  selector: 'app-par-make-details-edit',
  templateUrl: './par-make-details-edit.component.html',
  styleUrls: ['./par-make-details-edit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ParMakeDetailsEditComponent implements OnInit {

  PARmakerForm: FormGroup;
  PARmakerconForm: FormGroup;
  pardetails: Array<any> = [];
  yesorno: any[] = [
    { value: 1, display: 'Yes' },
    { value: 0, display: 'No' }
  ]
  
  expensetype: any;
  fileData: File = null;
  fileName: string
  todayDate = new Date();
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('rfor') matrforAutocomplete: MatAutocomplete;
  @ViewChild('rforInput') rforInput: any;
  requestforList: Array<rforlistss>;
  requestfor = new FormControl();
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  totalvaluegetting: any
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() linesChange = new EventEmitter<any>();
  clicked = false;
  constructor(private fb: FormBuilder, private prposhareService: PRPOshareService, private shareService: SharedService,
    private dataService: PRPOSERVICEService, private toastr: ToastrService, private notification: NotificationService,
    private router: Router, private sanitizer: DomSanitizer, private datePipe: DatePipe, private SpinnerService: NgxSpinnerService) { }
  ngOnInit(): void {
    this.PARmakerconForm = this.fb.group({
      id: '',
      contigency: [0, Validators.required],
    })
    this.PARmakerForm = this.fb.group({
      id: ['', Validators.required,],
      content: ['', Validators.required,],
      no: ['', Validators.required],
      date: [{ value: "" }],
      year: ['', Validators.required],
      amount: ['', Validators.required],
      desc: ['', Validators.required],
      isbudgeted: [0, Validators.required],
      burstlinewise: [0, Validators.required],
      burstmepwise: [0, Validators.required],
      pardetails: new FormArray([
       
      ])
    })
    this.getparedit();
    this.getParexpensetype();
  }
  

  amt: any;
  sum: any = 0.00;
  datasums() {
    this.amt = this.PARmakerForm.value.pardetails.map(x => x.amount);
    this.sum = this.amt.reduce((a, b) => a + b, 0);
  }


  perceTotalsum: any
  datasumscon() {
    this.amt = this.PARmakerForm.value.pardetails.map(x => x.perceTotal);
    this.perceTotalsum = this.amt.reduce((a, b) => a + b, 0);
  }
  checkonevalue: any
  contigencyvaluechanges(amountControl, perceControl, perceTotalControl: FormControl) {
    this.checkonevalue = ((this.PARmakerconForm.value.contigency * amountControl.value) / 100)
    perceControl.setValue(this.checkonevalue)
    perceTotalControl.setValue(amountControl.value + perceControl.value)
    this.datasumscon()
  }


  getSections(form) {
    return form.controls.pardetails.controls;
  }


  getFormArray(): FormArray {
    return this.PARmakerForm.get('pardetails') as FormArray;
  }
  status: any
  statusremarks: any
  getparedit() {
    let data: any = this.prposhareService.ParParentShare.value
    let id = data.id
    this.dataService.getparEdit(id)
      .subscribe((result: any) => {
        const { no, year, originalamount, desc, isbudgeted, burstlinewise, burstmepwise, date, contigency, content, par_status, remarks } = result;
        let dates = this.datePipe.transform(date, 'yyyy-MM-dd');
        this.PARmakerconForm.patchValue({
          id,
          contigency
        })
        this.PARmakerForm.patchValue({
          id, no, year, amount: originalamount, desc, isbudgeted, burstlinewise, burstmepwise, date: dates, content
        })
        this.status = par_status
        this.statusremarks = remarks
        for (let detail of result.pardetails) {

          let exptypeControl: FormControl = new FormControl('');
          let requestfor: FormControl = new FormControl('');
          let budgetedControl: FormControl = new FormControl('');
          let descControl: FormControl = new FormControl('');
          let remarkControl: FormControl = new FormControl('');
          let yearControl: FormControl = new FormControl('');
          let amountControl: FormControl = new FormControl('');
          let idControl: FormControl = new FormControl('');
          let perceControl: FormControl = new FormControl('');
          let perceTotalControl: FormControl = new FormControl('');

          idControl.setValue(detail.id);
          exptypeControl.setValue(detail.exptype)
          requestfor.setValue(detail.requestfor);
          budgetedControl.setValue(detail.budgeted);
          descControl.setValue(detail.desc);
          remarkControl.setValue(detail.remarks);
          yearControl.setValue(detail.year);
          amountControl.setValue(detail.originalamount);
          perceControl.setValue((this.PARmakerconForm.value.contigency * amountControl.value) / 100);
          perceTotalControl.setValue((amountControl.value + perceControl.value));

          this.getFormArray().push(new FormGroup({
            id: idControl,
            exptype: exptypeControl,
            requestfor: requestfor,
            budgeted: budgetedControl,
            desc: descControl,
            remarks: remarkControl,
            year: yearControl,
            amount: amountControl,
            perce: perceControl,
            perceTotal: perceTotalControl
          }));

          this.datasums();
          this.datasumscon();
          requestfor.valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
                

              }),
              switchMap(value => this.dataService.getreqforFK(value, 1)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.requestforList = datas;

            })


          this.PARmakerconForm.get('contigency').valueChanges
            .pipe(
              debounceTime(20),
            ).subscribe(value => {
              
              this.contigencyvaluechanges(amountControl, perceControl, perceTotalControl);
            }
            )
        }

      })
  }

  

  displayFnrfor(rfor?: any) {
    if ((typeof rfor) === 'string') {
      return rfor;
    }
    return rfor ? this.requestforList.find(_ => _.name === rfor).name : undefined;
  }

  

  onCancelClick() {
    this.onCancel.emit()
  }


  PARconFormSubmit() {
    this.SpinnerService.show();
    if (this.PARmakerconForm.value.contigency === 0) {
      this.notification.showWarning("Zero% NOT ALLOWED ")
      this.SpinnerService.hide();
      this.clicked = false
      return false
    }
    this.clicked = true

    let data = this.PARmakerconForm.value
    this.dataService.PARcontigencySubmit(data)
      .subscribe(result => {
        if (result.percentage) {
          this.notification.showError('Maximum Allotted Contingency Percentage is ' + result.percentage + ' %',)
          this.clicked = false
          this.SpinnerService.hide();
          return false
        }
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showError("[INVALID_DATA! ...]")
          this.clicked = false
          this.SpinnerService.hide();
        }
        else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
          this.notification.showError("UNEXPECTED ERROR")
          this.clicked = false
          this.SpinnerService.hide();
        }
        else {
          this.notification.showSuccess("Successfully Updated!...")
          this.SpinnerService.hide();
          this.onSubmit.emit();
        }
        
        return true
      })
  }

  /////////////////////////////////content editor
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

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.PARmakerForm.get('html').value);
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

  only_numalpha(event) {
    var k;
    k = event.charCode;
    
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  getParexpensetype() {
    this.dataService.getParexpensetype()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.expensetype = datas;
      })
  }
}