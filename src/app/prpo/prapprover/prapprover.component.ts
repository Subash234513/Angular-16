import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'


export interface Emplistss {
  id: string;
  full_name: string;
}
@Component({
  selector: 'app-prapprover',
  templateUrl: './prapprover.component.html',
  styleUrls: ['./prapprover.component.scss']
})
export class PrapproverComponent implements OnInit {
  PRApprovalForm: FormGroup;
  prapproveId: number;
  yesorno: any[] = [
    { value: 1, display: 'Yes' },
    { value: 0, display: 'No' }
  ]
  prno: string;
  raisedby: string;
  commodity: string;
  capatilization: number;
  date: Date;
  prapproverlist: any
  approvalForm: FormGroup;
  rejectForm: FormGroup;
  prdts: number;
  employeeList: Array<Emplistss>;
  tokenValues: any
  jpgUrls: string;
  imageUrl = environment.apiURL

  isLoading = false
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  constructor(private prsharedservice: PRPOshareService,
    private prservice: PRPOSERVICEService, private formbuilder: FormBuilder,
    private notification: NotificationService, private toastr: ToastrService, private router: Router, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService) { }

  ngOnInit(): void {

    this.PRApprovalForm = this.formbuilder.group({
      full_name: [''],
      name: [''],
      no: [''],
      date: [''],
      raisedby: [''],
      notepad: [''],
      dts: [null],
      totalamount:"",
      commodity_id:"",
      commodity:""
    })
    this.approvalForm = this.formbuilder.group({
      id: '',
      remarks: '',
      dts: '',
      employee_id: 0,
      totalamount:"",
      commodity_id:""
    })
    this.rejectForm = this.formbuilder.group({
      id: '',
      remarks: ['', Validators.required],
      dts: '',
      totalamount:"",
      commodity_id:""
    })


    let data: any = this.prsharedservice.Prapprover.value;
    this.prapproveId = data.id
    this.prdts = data
    this.commodity = data.commodity_id.name
    this.capatilization = data.capitialized
    this.raisedby = data.created_by.full_name
    this.prno = data.no
    this.date = data.date
    console.log("Priddd..............", this.prapproveId)
    console.log("Prdtsss..............", this.prdts)
    this.approveform();
    this.getapproveredit();

    let data1: any = this.prsharedservice.Prapprover.value
    console.log("data1", data1)
    let id = data1.id

    this.approvalForm.patchValue({
      id: id,
      dts: this.PRApprovalForm.value.dts,
      totalamount:this.PRApprovalForm.value.totalamount,
      commodity_id:this.PRApprovalForm.value.commodity_id,
      // dts:data.dts
    })
    this.rejectForm.patchValue({
      id: id,
      dts: this.PRApprovalForm.value.dts,
      totalamount:this.PRApprovalForm.value.totalamount,
      commodity_id:this.PRApprovalForm.value.commodity_id
      // dts:data.dts
    })
    console.log("pr header check", this.PRApprovalForm.value)

    this.approvalForm.get('employee_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.prservice.getemployeeApproverforPRDD(this.PRApprovalForm.value.commodity_id, value, 1)
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
  checkboxvalue: any
  kboxvalue: any
  IsChecked: boolean = true;
  CommodityID: any;
  getapproveredit() {
    let data: any = this.prsharedservice.Prapprover.value;
    console.log("Prapprover..............", data)
    // this.checkboxvalue===data.dts
    // if(this.checkboxvalue===1){
    //   this.IsChecked===true
    // }
    // if(this.checkboxvalue===0){
    //   this.IsChecked===false


    // }



    this.CommodityID = data.commodity_id.id
    let Name = data.commodity_id.name;
    let RAISED = data.created_by.full_name;
    let APPROVER = data.employee.full_name;
    let CAPI = data.capitialized;
    let NO = data.no;
    let Notepad = data.notepad
    let HSN = data.hsn_id;
    let Date = data.date;
    let dts = data.dts;
    let totalamount = data.totalamount;
    let commodity_id = data.commodity_id.id;
    console.log("dataaaa", data)
    this.PRApprovalForm.patchValue({
      name: Name,
      full_name: APPROVER,
      no: NO,
      date: Date,
      raisedby: RAISED,
      notepad: Notepad,
      capitialized: CAPI,
      dts: dts,
      totalamount:totalamount,
      commodity_id:commodity_id

    })

  }
  totalamount: any
  dtsvalueget: any
  approveform() {
    let id = this.prapproveId
    this.SpinnerService.show();
    this.prservice.getpredit(id)
      // .subscribe(result => {
      //   console.log("RESULSSS", result)
      //   this.prapproverlist = result["data"];
      .subscribe((results) => {
        let datas = results;
        this.SpinnerService.hide();
        this.prapproverlist = datas.prdetails;
        this.yesorno = datas.prdetails.capitialized;
        console.log("cap", this.yesorno)
        this.dtsvalueget = datas.dts
        this.totalamount = datas.totalamount
        console.log("dts", this.dtsvalueget)
        console.log("appro", datas.totalamount)
        console.log("appro", datas.prdetails)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  

  approveClick() {
    if (this.approvalForm.value.employee_id == 0) { this.approvalForm.value.employee_id = 0 } else {
      this.approvalForm.value.employee_id = this.approvalForm.value?.employee_id?.id
    }
    let data = this.approvalForm.value
    console.log('approval data check', data)

    if (this.approvalForm.value.employee_id != 0) {
      let dataConfirm = confirm("Are you sure, Do you want to Forward?")
      if (dataConfirm == false) {
        return false
      }
    }
    if (this.approvalForm.value.employee_id == 0) {
      let dataConfirm = confirm("Are you sure, Do you want to continue to Approve?")
      if (dataConfirm == false) {
        return false
      }
    }

    // if(dataConfirm == true){
      this.SpinnerService.show();
    this.prservice.getprapproval(data)
      .subscribe(result => {
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.SpinnerService.hide();
          this.notification.showError("This User Not Allowed To Approve")
          return false
        }
        if (result.code === "INVALID_APPROVER_ID" && result.description === "No_Rights_To_Approve") {
          this.SpinnerService.hide();
          this.notification.showError("This User Not Allowed To Approve")
          return false
        }
        if (result.code === "INVALID_REQUEST_ID" && result.description === "Invalid Request ID") {
          this.SpinnerService.hide();
          this.notification.showError("This User Not Allowed To Approve")
          return false
        }
        if (result.code === "NOLIMIT_APPROVER_ID" && result.description === "NO_LIMIT") {
          this.SpinnerService.hide();
          this.notification.showError("This User has no limit to Approve, Please choose next level Approver")
          return false
        }
        if (this.approvalForm.value.employee_id != 0) {
          this.SpinnerService.hide();
          this.notification.showSuccess("Successfully Forwarded to next level!...")
          console.log("Approved", result)
          this.approvalForm.controls['remarks'].reset()
          // this.router.navigate(['/PRApproverSummary'], { skipLocationChange: true })
          this.onSubmit.emit();
        }
        else {
          this.SpinnerService.hide();
          this.notification.showSuccess("Successfully Approved!...")
          console.log("Approved", result)
          this.approvalForm.controls['remarks'].reset()
          // this.router.navigate(['/PRApproverSummary'], { skipLocationChange: true })
          this.onSubmit.emit();
        }
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    // }

  }
  rejectClick() {

    if (this.rejectForm.value.remarks== "") {
      this.toastr.error('Remarks is Must to Reject');
      return false;
    }
    let data = this.rejectForm.value
    // let dataConfirm = confirm("Are you sure, Do you want to continue?")

    // if(dataConfirm == true){
      this.SpinnerService.show();
    this.prservice.getprreject(data)
      .subscribe(result => {
        this.SpinnerService.hide();
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.SpinnerService.hide();
          this.notification.showError("Maker Not Allowed To Reject")
          return false
        } else {
          this.notification.showError("Successfully Rejected!...")
          this.SpinnerService.hide();
          // this.router.navigate(['/PRApproverSummary'], { skipLocationChange: true })
          this.onSubmit.emit();
        }
        console.table("REJECTED", result)
        this.rejectForm.controls['remarks'].reset()
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
  fileDownload(id, fileName) {
    if (id == null) {
      this.notification.showWarning("No Files Found")
      return false
    }
    this.SpinnerService.show();
    this.prservice.fileDownloadpo(id)
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




  enableEditor() {
    this.editorDisabled = false;
  }

  disableEditor() {
    this.editorDisabled = true;
  }



  onBlur() {

  }

  onDelete(file) {

  }

  summernoteInit(event) {

  }
  getemployeeForApprover() {
    let commodityID = this.CommodityID
    console.log("commodityID", commodityID)
    this.SpinnerService.show();
    this.prservice.getemployeeApproverforPR(commodityID)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
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
  showimagepopup: boolean
  commentPopup(pdf_id, file_name) {
    if (pdf_id == null) {
      this.notification.showWarning("No Files Found")
      return false
    }
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    this.showimagepopup = true
    this.jpgUrls = this.imageUrl + "prserv/prpo_fileview/" + id + "?token=" + token;
    // console.log("img", this.jpgUrls)
  };



  prccbsDetailsList: any
  delivaryDetailsPatch(data) {
    console.log("Delivary details patching data", data)
    this.prccbsDetailsList = data


  }
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  pageSize = 10;
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
                this.prservice.getemployeeLimitSearchPODD(this.PRApprovalForm.value.commodity_id, this.empInput.nativeElement.value, this.currentpage + 1)
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



  onCancelClick() {
    // this.router.navigate(['/prmaster'], { skipLocationChange: true })
    this.onCancel.emit()
   }




}



