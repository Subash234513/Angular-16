import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import {MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'
import { AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { AmountPipeCustomPipe } from '../amount-pipe-custom.pipe';
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
  selector: 'app-par-make-details',
  templateUrl: './par-make-details.component.html',
  styleUrls: ['./par-make-details.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class PARMakeDetailsComponent implements OnInit {
  files: FormGroup;
  PARmakerForm: FormGroup;
  PARmakerDetailsForm: FormGroup;
  pardetails: Array<any> = [];
  
  yesorno: any[] = [
    { value: 1, display: 'Yes' },
    { value: 0, display: 'No' }
  ]

  
  expensetype: any;
  fileData: File = null;
  fileName: any
  todayDate = new Date();
  images = [];
  groups: any;
  file_id: any;
  public errorMessage: string = '';
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('rfor') matrforAutocomplete: MatAutocomplete;
  @ViewChild('rforInput') rforInput: any;
  requestforList: Array<rforlistss>;
  requestfor = new FormControl();
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  pardett: any
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() linesChange = new EventEmitter<any>();
  clicked = false;
  x: any;
  fileUpload: any = [];
  FinancialYearList: any
  constructor(private fb: FormBuilder, private prposhareService: PRPOshareService, private shareService: SharedService,
    private dataService: PRPOSERVICEService, private toastr: ToastrService, private notification: NotificationService,
    private router: Router, private sanitizer: DomSanitizer, private SpinnerService: NgxSpinnerService, private datePipe: DatePipe, private errorHandler: ErrorHandlingServiceService, private readonly changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.PARmakerForm = this.fb.group({
      content: ['', Validators.required],
      date: ["", Validators.required],
      year: ['', Validators.required],
      amount: [0, Validators.required],
      desc: ['', Validators.required],
      isbudgeted: [1, Validators.required],
      burstlinewise: [0, Validators.required],
      burstmepwise: [0, Validators.required],
      pardetails: new FormArray([
        this.pardet(),

      ]),

    })


    this.files = this.fb.group({
      file_upload: new FormArray([
      ]),
    })

    let rforkeyvalue: String = "";
    // this.getreqforFK();
    this.getParyear();
    this.getParexpensetype();

  }
  pardet() {
    let group = new FormGroup({
      exptype: new FormControl(''),
      budgeted: new FormControl(1),
      requestfor: new FormControl(''),
      desc: new FormControl(''),
      year: new FormControl(''),
      amount: new FormControl(''),
      remarks: new FormControl('')
    })


    group.get('requestfor').valueChanges
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

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    group.get('amount').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
      ).subscribe(value => {
        //console.log("should be called first")
        this.datasums()
        if (!this.PARmakerForm.valid) {
          return;
        }

        this.linesChange.emit(this.PARmakerForm.value['pardetails']);
      }
      )
    return group
  }
 
  ///////////to add total amount
  amt: any;
  sum: any = 0.00;
  filesss: any;
  sumsss: any;
  datasums() {
    this.amt = this.PARmakerForm.value.pardetails.map(x => +x.amount);
    this.sum = this.amt.reduce((a, b) => a + b, 0);
  }

  getSections(form) {
    return form.controls.pardetails.controls;
  }
  ////// to add table row
  addSection(data) {
    console.log("data for add", data)
    if(data.length==2){
      this.notification.showWarning("Maximum Limit Reached")
      return false 
    }
    const control = <FormArray>this.PARmakerForm.get('pardetails');
    control.push(this.pardet());
    let exptypeAuto 
    if( data[0].exptype == "Capex"){
      exptypeAuto = "Opex"
    }else if(data[0].exptype == "Opex"){
      exptypeAuto = "Capex"
    }
    else{
      exptypeAuto = ""
    }
    this.PARmakerForm.get('pardetails')['controls'][1].get('exptype').setValue(exptypeAuto)
  }
  /////// to remove table row
  removeSection(index) {
    const control = <FormArray>this.PARmakerForm.get('pardetails');
    control.removeAt(index);
    // this.files.value.file_upload.splice(i)
    this.FileDataArray.splice(index, 1)	
    this.FileDataArrayIndex.splice(index, 1)	
    this.datasums()
  }
  //////////////autocomplete scroll requestfor
  autocompleterforScroll() {
    setTimeout(() => {
      if (
        this.matrforAutocomplete &&
        this.autocompleteTrigger &&
        this.matrforAutocomplete.panel
      ) {
        fromEvent(this.matrforAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matrforAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matrforAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matrforAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matrforAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getreqforFK(this.rforInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.requestforList = this.requestforList.concat(datas);
                    
                    if (this.requestforList.length >= 0) {
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
  /////////////////////display function requestfor
  displayFnrfor(rfor?: any) {
    return rfor ? this.requestforList.find(_ => _.name === rfor).name : undefined;
  }

  getreqforFK() {
    this.SpinnerService.show();
    this.dataService.getreqfor()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.requestforList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  //////////////////par submit
  parmakerSubmit() {

    
    if( (this.PARmakerForm.value.date == "") || (this.PARmakerForm.value.date == null) || (this.PARmakerForm.value.date == undefined)   ){
      this.notification.showWarning("Choose Date")
      return false
    }

    if( (this.PARmakerForm.value.year == "") || (this.PARmakerForm.value.year == null) || (this.PARmakerForm.value.year == undefined)   ){
      this.notification.showWarning("Choose Year")
      return false
    }

    if( (this.PARmakerForm.value.amount == "") || (this.PARmakerForm.value.amount == null) || (this.PARmakerForm.value.amount == undefined)   ){
      this.notification.showWarning("Please Fill Amount")
      return false
    }

    if( (this.PARmakerForm.value.desc == "") || (this.PARmakerForm.value.desc == null) || (this.PARmakerForm.value.desc == undefined)   ){
      this.notification.showWarning("Please Fill Description")
      return false
    }

    let dataPardetails = this.PARmakerForm.value.pardetails

    if( dataPardetails.length == 0  ){
      this.notification.showWarning("Details are not Filled")
      return false
    }

    let duplicateCheckOnExpense = this.PARmakerForm.value['pardetails'].map(x => x.exptype);
    console.log("duplicate check in commodity", duplicateCheckOnExpense)

    for (let i in duplicateCheckOnExpense){
      let first_index = duplicateCheckOnExpense.indexOf(duplicateCheckOnExpense[i]);
      let last_index = duplicateCheckOnExpense.lastIndexOf(duplicateCheckOnExpense[i]);

      console.log("first_index--->", first_index);
        console.log("last_index--->", last_index);  

      if (first_index !== last_index) {
        console.log('Duplicate item in array ' + duplicateCheckOnExpense[i]);
        console.log('Duplicate item in array index ' + i);   
        let indexNumber = Number(i)
        this.notification.showWarning("There is a duplicate Expense Type of '"+ duplicateCheckOnExpense[i] +"' indentified in line "+ (indexNumber + 1))
        return false
      }
    }

    for (let i in dataPardetails) {
      let exptype = dataPardetails[i].exptype
      let requestfor = dataPardetails[i].requestfor

      let desc = dataPardetails[i].desc
      let year = dataPardetails[i].year

      let amount = dataPardetails[i].amount
      let remarks = dataPardetails[i].remarks

      let indexNumber = Number(i)
      if ((exptype == "") || (exptype == undefined) || (exptype == null)) {
        this.notification.showWarning("Expense Type is not filled, Please check on line " + (indexNumber + 1))
        return false
      }
      
      if ((requestfor == "") || (requestfor == undefined) || (requestfor == null)) {
        this.notification.showWarning("Request For is not filled, Please check on line " + (indexNumber + 1))
        return false
      }

      if ((desc == "") || (desc == undefined) || (desc == null)) {
        this.notification.showWarning("Description is not filled, Please check on line " + (indexNumber + 1))
        return false
      }

      if ((year == "") || (year == undefined) || (year == null)) {
        this.notification.showWarning("Year is not filled, Please check on line " + (indexNumber + 1))
        return false
      }

      if ((amount == "") || (amount == undefined) || (amount == null)) {
        this.notification.showWarning("Amount is not filled, Please check on line " + (indexNumber + 1))
        return false
      }

      if ((remarks == "") || (remarks == undefined) || (remarks == null)) {
        this.notification.showWarning("Remarks is not filled, Please check on line " + (indexNumber + 1))
        return false
      }
    }
    
    this.SpinnerService.show();
    let amtvalid = this.PARmakerForm.value.amount
    if (this.PARmakerForm.value.amount <= 0) {
      this.notification.showWarning('Invalid BPA Amount')
      this.SpinnerService.hide();
    }
    if (amtvalid > this.sum) {
      this.notification.showWarning("Check BPA Details Amount is Low")
      this.SpinnerService.hide();
      return false
    }
    if (amtvalid < this.sum) {
      this.notification.showWarning("Check BPA Amount is Low, BPA Details Amount exceed")
      this.SpinnerService.hide();
      return false
    }
    let date = this.PARmakerForm.value.date
    // console.log('dataaaaaa', date)
    let dates = this.datePipe.transform(date, 'yyyy-MM-dd');
    //console.log('datessss', dates)  
    this.PARmakerForm.value.date = dates;
    // let datadetails = this.PARmakerForm.value.pardetails
    let filesvalue = this.files.value.file_upload
    // if( datadetails.length != filesvalue.length ) { 
    //   this.SpinnerService.hide();
    //   this.clicked = false
    //   this.notification.showWarning("Files are missing on the details, Please check ")
    //   return false
    //   }
    this.clicked = true
    let data = this.PARmakerForm.value

    this.formDataChange(data)
    
    

  }
  /////////////to prevent special charecters
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  ///////////////////accept only for number
  omit_special_num(event) {
    var k;
    k = event.charCode;
    return ((k == 190) || (k >= 48 && k <= 57));
  }
  ///////////// cancel path
  onCancelClick() {
    this.onCancel.emit()
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
  FileDataArray = []
  FileDataArrayIndex = []
  onFileSelected(e, j) {
    // let datavalue = this.files.value.file_upload
    // if (this.files.value.file_upload.length > j) {
    //   this.files.value.file_upload[j] = e.target.files[0]
    // } else {
    //   for (var i = 0; i < e.target.files.length; i++) {
    //     this.files.value.file_upload.push(e.target.files[i])
    //     let checkvalue = this.files.value.file_upload
    //   }
    // }

    let datavalue = this.files.value.file_upload
      this.FileDataArray[j] = e.target.files[0]
      this.FileDataArrayIndex[j] = j
      console.log("this.FilesDataArray", this.FileDataArray)
      console.log("this.FilesDataArrayIndex", this.FileDataArrayIndex)
  }



  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  
  getParyear() {
    this.SpinnerService.show();
    this.dataService.getParyear()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.FinancialYearList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  
  getParexpensetype() {
    this.SpinnerService.show();
    this.dataService.getParexpensetype()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.expensetype = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }




  formDataChange(dataPAR){
    console.log("fdataPAR", dataPAR)
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
    let ParFormData = this.PARmakerForm.value.pardetails
  
    for( let filekeyToinsert in formdataIndex ){
      let datakey = "file_key"+filekeyToinsert
      console.log("datakey", datakey)
      ParFormData[filekeyToinsert].file_key = datakey
    }
    
    let datavalue = JSON.stringify(dataPAR)
    formData.append('data', datavalue);
      console.log(datavalue)
      console.log(formData)
      this.SpinnerService.show();
      this.dataService.PARmakerFormSubmit(formData)
      .subscribe(result => {
        this.SpinnerService.hide();
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          this.SpinnerService.hide();
        }
        else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
          this.notification.showError("UNEXPECTED ERROR")
          this.SpinnerService.hide();
        }
        else {
          this.notification.showSuccess("Successfully Created!...")
          this.SpinnerService.hide();
          this.onSubmit.emit();
        }
        
        return true
      }
      ,(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  
  
  }
  duplicateCheckExpense(){

  }
}