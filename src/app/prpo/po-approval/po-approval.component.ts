import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'
import { environment } from 'src/environments/environment';
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
}
export interface supplierlistss {
  id: string;
  name: string;
}
export interface Emplistss {
  id: string;
  full_name: string;
}
@Component({
  selector: 'app-po-approval',
  templateUrl: './po-approval.component.html',
  styleUrls: ['./po-approval.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class PoApprovalComponent implements OnInit {
  PoProductList: any
  PoDeliveryList: any
  POApprovalForm: FormGroup;
  approvalForm: FormGroup
  rejectForm: FormGroup
  PoTranHistoryList: any;
  employeeList: Array<Emplistss>;
  isLoading = false
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;
  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private dataService: PRPOSERVICEService,
    private prposhareService: PRPOshareService,
    private datePipe: DatePipe, private notification: NotificationService,private SpinnerService: NgxSpinnerService,
     private errorHandler: ErrorHandlingServiceService, private ref: ChangeDetectorRef) { }
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  ngOnInit(): void {
    this.approvalForm = this.fb.group({
      id: '',
      remarks: '',
      employee_id: 0,
      amount:"",
      commodity_id:""
    })
    this.rejectForm = this.fb.group({
      id: '',
      remarks: ['', Validators.required],
      amount:"",
      commodity_id:""
    })
    this.POApprovalForm = this.fb.group({
      no: ['', Validators.required],
      supplier_id: ['', Validators.required],
      commodity_id: ['', Validators.required],
      commodity: ['', Validators.required],
      terms_id: ['', Validators.required],
      validfrom: [{ value: "" }],
      validto: [{ value: "" }],
      branch_id: ['', Validators.required],
      onacceptance: ['', Validators.required],
      ondelivery: ['', Validators.required],
      oninstallation: ['', Validators.required],
      notepad: ['', Validators.required],
      amount: [0, Validators.required],
      mepno: ['', Validators.required],
    })
    this.getProductData();

    this.approvalForm.get('employee_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.dataService.getemployeeLimitSearchPODD(this.POApprovalForm.value.commodity, value, 1)
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
  poheaderID: any
  CommodityID: any
  getProductData(pageNumber = 1, pageSize = 10) {
    let data: any = this.prposhareService.PoApproveShare.value;
    this.poheaderID = data.id
    this.CommodityID = data.commodity_id.id
    this.POApprovalForm.patchValue({
      no: data.no,
      supplier_id: data.supplierbranch_id.name,
      branch_id: data.branch_id.name,
      amount: data.amount,
      commodity_id: data.commodity_id.name,
      commodity: data.commodity_id.id,
      terms_id: data.terms_id.name,
      notepad: data.notepad
    })
    this.approvalForm.patchValue({
      id: this.poheaderID,
      amount:data.amount,
      commodity_id:data.commodity_id.id
    })
    this.rejectForm.patchValue({
      id: this.poheaderID,
      amount:data.amount,
      commodity_id:data.commodity_id.id
    })
    console.log("Id", this.poheaderID)
    this.SpinnerService.show();
    this.dataService.getPoProductList(this.poheaderID, pageNumber = 1, pageSize = 10)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        console.log("PoProductList", datas);
        this.PoProductList = datas;
        let datapagination = results["pagination"];
        if (this.PoProductList.length > 0) {
          this.SpinnerService.hide();
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  pageSize = 10;

  nextClick() {
    if (this.has_next === true) {
      this.SpinnerService.show();
      this.dataService.getPoProductList(this.poheaderID, this.presentpage + 1, 10)
      .subscribe((results) => {
        this.SpinnerService.hide();
        let dataset = results["data"];
        this.PoProductList = dataset;
        console.log("getproduct", dataset);
        let datapagination = results["pagination"];
        if (this.PoProductList.length > 0) {
          this.SpinnerService.hide();
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    }
  }

  previousClick() {
    if (this.has_previous === true) {
      this.SpinnerService.show();
      this.dataService.getPoProductList(this.poheaderID, this.presentpage - 1, 10)
      .subscribe((results) => {
        let dataset = results["data"];
        this.SpinnerService.hide();
        this.PoProductList = dataset;
        console.log("getproduct", dataset);
        let datapagination = results["pagination"];
        if (this.PoProductList.length > 0) {
          this.SpinnerService.hide();
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    }
  }














  POdeliveryscreen(data) {
    let headerID = this.poheaderID
    let value = data
    console.log("headerID", headerID);
    console.log("idvalue", value);
    this.SpinnerService.show();
    this.dataService.getPoDeliveryList(headerID, value)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("PoDeliveryList", datas);
        this.PoDeliveryList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  state: boolean = true
  states: boolean = false
  onCancelClick() {
    // this.prposhareService.pocheckerstate.next(this.state)
    // this.prposhareService.poreeopenstate.next(this.states)
    // this.prposhareService.poclosecheckerstate.next(this.states)
    // this.prposhareService.pomakerstate.next(this.states)
    // this.prposhareService.poclosemakerstate.next(this.states)
    // this.prposhareService.pocancelmakerstate.next(this.states)
    // this.prposhareService.pocancelcheckerstate.next(this.states)
    // this.router.navigate(['/po'], { skipLocationChange: true })
    this.onCancel.emit()
  }
  approveClick() {
    let data = this.approvalForm.value
    if (this.approvalForm.value.employee_id == 0) { this.approvalForm.value.employee_id = 0 } else {
      this.approvalForm.value.employee_id = this.approvalForm.value?.employee_id?.id
    }
    console.log('approval data check', data)
    //   let dataConfirm = confirm("Are you sure, Do you want to continue?")
    // if(dataConfirm == true){

    if (this.approvalForm.value.employee_id != 0) {
      let dataConfirm = confirm("Are you sure, Do you want to Move to Forward?")
      if (dataConfirm == false) {
        return false
      }
    }
    if (this.approvalForm.value.employee_id == 0) {
      let dataConfirm = confirm("Are you sure, Do you want continue to Approve?")
      if (dataConfirm == false) {
        return false
      }
    }

    this.SpinnerService.show();
    this.dataService.getPoapprovaldata(data)
      .subscribe(result => {
        this.SpinnerService.hide();
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.notification.showError("This User Not Allowed To Approve")
          this.SpinnerService.hide();
          return false
        }
        if (result.code === "INVALID_REQUEST_ID" && result.description === "Invalid Request ID") {
          this.notification.showError("This User Not Allowed To Approve")
          this.SpinnerService.hide();
          return false
        }
        if (result.code === "NOLIMIT_APPROVER_ID" && result.description === "NO_LIMIT") {
          this.notification.showError("This User has no limit to Approve, Please choose next level Approver")
          this.SpinnerService.hide();
          return false
        }
        if (this.approvalForm.value.employee_id != 0) {
          this.notification.showSuccess("Successfully Forwarded to next level!...")
          this.SpinnerService.hide();
          this.onSubmit.emit();
        }
        else {
          this.notification.showSuccess("Successfully Approved!...")
          console.log("Approved", result)
          this.SpinnerService.hide();
          this.onSubmit.emit();
        }
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    // }
    // if(dataConfirm == false){
    //   return false
    // }
  }
  // result = {code: "INVALID_REQUEST_ID", description: "Invalid Request ID"}
  rejectClick() {
    if (this.rejectForm.value.remarks== "") {
      this.notification.showWarning('Remarks is Must to Reject');
      return false;
    }
    let data = this.rejectForm.value
    this.SpinnerService.show();
    this.dataService.getPorejectdata(data)
      .subscribe(result => {
        this.SpinnerService.hide();
        if (result.code === "INVALID_REQUEST_ID" && result.description === "Invalid Request ID") {
          this.notification.showError("Maker Not Allowed To Reject")
          this.SpinnerService.hide();
          return false
        } 
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.notification.showError("This User Not Allowed To Approve")
          this.SpinnerService.hide();
          return false
        }
        if (result.code === "INVALID_REQUEST_ID" && result.description === "Invalid Request ID") {
          this.notification.showError("This User Not Allowed To Approve")
          this.SpinnerService.hide();
          return false
        }
        if (result.code === "NOLIMIT_APPROVER_ID" && result.description === "NO_LIMIT") {
          this.notification.showError("This User has no limit to Approve, Please choose next level Approver")
          this.SpinnerService.hide();
          return false
        }
        else {
          this.notification.showError("Successfully Rejected!...")
          this.SpinnerService.hide();
          this.onSubmit.emit();
        }
        console.table("REJECTED", result)
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  tokenValues: any
  pdfUrls: string;
  jpgUrls: string;
  imageUrl = environment.apiURL
  fileDownloads(id, fileName) {
    this.SpinnerService.show();
    this.dataService.fileDownloadpo(id)
      .subscribe((results) => {
        this.SpinnerService.hide();
        console.log("re", results)
        let binaryData = [];
        binaryData.push(results)
        let filevalue = fileName.split('.')
        if(filevalue[1] != "pdf" && filevalue[1] != "PDF"){
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
        }else{
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData, { type: results.type }));
          window.open(downloadUrl, "_blank");
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  // grnjson:any
  // filejson(data){
  //   this.grnjson=data["file_data"]
  //   console.log("grnjson",this.grnjson)
  // }
  showimagepopup: boolean
  commentPopup(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showimagepopup = true
      this.jpgUrls = this.imageUrl + "prserv/prpo_fileview/" + id + "?token=" + token;
      console.log("url", this.jpgUrls)
    }
    else {
      this.showimagepopup = false
    }
  };
  gettranhistory(data) {
    let headerId = data.poheader_data[0].id
    console.log("headerId", headerId)
    this.SpinnerService.show();
    this.dataService.gettranhistory(headerId)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("getranhistory", datas);
        this.PoTranHistoryList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  getemployeeForApprover() {
    let commodityID = this.CommodityID
    console.log("commodityID", commodityID)
    this.SpinnerService.show();
    this.dataService.getemployeeApproverforPO(commodityID)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        this.employeeList = datas;
        console.log("employeeList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  public displayFnemp(emp?: Emplistss): string | undefined {
    // console.log('id', emp.id);
    // console.log('full_name', emp.full_name);
    return emp ? emp.full_name : undefined;
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
    this.editorDisabled = true;
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
              if (this.has_next === true) {
                this.dataService.getemployeeLimitSearchPODD(this.POApprovalForm.value.commodity, this.empInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    // console.log("emp", datas)
                    if (this.employeeList.length >= 0) {
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
}