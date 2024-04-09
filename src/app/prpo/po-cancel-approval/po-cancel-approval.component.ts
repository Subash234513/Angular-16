import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'
@Component({
  selector: 'app-po-cancel-approval',
  templateUrl: './po-cancel-approval.component.html',
  styleUrls: ['./po-cancel-approval.component.scss']
})
export class PoCancelApprovalComponent implements OnInit {
  pocancelcreate: FormGroup;
  pocancelremarks: FormGroup;
  pocanceldataList: any
  approvalForm: FormGroup
  rejectForm: FormGroup
  pocancelapprovalid: any

  apprejList: any
  has_nextapprej = true
  has_previousapprej = true
  presentpageAR: number = 1;
  currentpageAR: number = 1;
  is_apprej = true
  has_next = true;
  has_previous = true;
  Amount: any
  TotalAmount: any
  amt: any
  sum: any
  pocancelmakerid: any
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  approvedisable = false;
  rejectdisable = false;

  constructor(private fb: FormBuilder, private prposhareService: PRPOshareService, private shareService: SharedService,
    private dataService: PRPOSERVICEService, private toastr: ToastrService, private notification: NotificationService,
    private router: Router, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService) { }

  ngOnInit(): void {
    this.approvalForm = this.fb.group({
      remarks: ['', Validators.required],
      id: ''
    })
    this.rejectForm = this.fb.group({
      remarks: ['', Validators.required],
      id: ''
    })
    let pocancelapproval: any = this.prposhareService.PocancelapprovalShare.value
    this.pocancelapprovalid = pocancelapproval['id']
    console.log("makerid", this.pocancelapprovalid)
    let pocancelmaker: any = this.prposhareService.PocancelShare.value
    this.pocancelmakerid = pocancelmaker['id']



    this.pocancelcreate = this.fb.group({
      no: ['', Validators.required],
      supplier_id: ''
    })
    this.getPocancel();
  }
  approvedcheck: boolean = true
  totallineAmount: any = 0.00 
  getPocancel() {
    let data: any = this.prposhareService.PocancelapprovalShare.value
    console.log("poceappdata", data)
    this.PocancelIdFordelivery = data.poheader.id
    let id = data.poheader.id
    this.pocloseid = data.id
    this.approvalForm.patchValue({
      id: data.id
    })
    this.rejectForm.patchValue({
      id: data.id
    })
    this.SpinnerService.show();
    this.dataService.grnproduct(id)
      .subscribe(results => {
        this.SpinnerService.hide();
        let datapatch = results
        let datas = results["data"];
        this.pocanceldataList = datas
        let dataamount = datas.map(amount => amount.totalamount)
        this.totallineAmount = +dataamount
        console.log("total amount data", dataamount)

        this.pocancelcreate.patchValue({
          no: data.poheader.no,
          supplier_id: data.poheader.supplierbranch_id.name
        })
        // if(data.canceldata[0].pocancel_status=="APPROVED"){
        //   this.approvedcheck=false

        // }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  // approveClick(){}

  // rejectClick(){}
  PocancelIdFordelivery: any
  deliverylist: any
  pocloseid: any
  delivery(data2) {
    this.SpinnerService.show();
    this.dataService.product(this.PocancelIdFordelivery, data2)
      .subscribe(results => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.deliverylist = datas

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  state: boolean = true
  states: boolean = false



  onCancelClick() {
    this.onCancel.emit()
  }


  approveClick() {
    this.approvedisable = true;
    let data = this.approvalForm.value
    console.log('approval data check', data)
    this.SpinnerService.show();
    this.dataService.getpocancelapprovalldata(data)
      .subscribe(result => {
        this.SpinnerService.hide();
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.notification.showError("Maker Not Allowed To Approve")
          this.SpinnerService.hide();
          this.approvedisable = false;
          return false
        } else {
          this.SpinnerService.hide();
          this.notification.showSuccess("Successfully Approved!...")
          this.onSubmit.emit();
        }
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  rejectClick() {
    this.rejectdisable = true;
    let data = this.rejectForm.value
    this.SpinnerService.show();
    this.dataService.getpocancelrejecttdata(data)
      .subscribe(result => {
        this.SpinnerService.hide();
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.notification.showError("Maker Not Allowed To Reject")
          this.SpinnerService.hide();
          this.rejectdisable = false;
          return false
        } else {
          this.notification.showError("Successfully Rejected!...")
          this.SpinnerService.hide();
          this.onSubmit.emit();
        }
        console.table("REJECTED", result)
        this.rejectForm.controls['remarks'].reset()
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  datasums() {
    this.amt = this.pocanceldataList.map(x => x.totalamt);
    console.log('data check amt', this.amt);
    this.sum = this.amt.reduce((a, b) => a + b, 0);
    console.log('sum of total ', this.sum);
  }
  PocancelTranHistoryList: any

  gettranhistory(data) {
    console.log("data for trans", data)
    let headerId = this.pocloseid
    console.log("headerId", headerId)
    let name = "pocancel_tran"
    this.SpinnerService.show();
    this.dataService.getclosecanceltranhistory(headerId, name)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("getranhistory", datas);
        this.PocancelTranHistoryList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  only_numalpha(event) {
    var k;
    k = event.charCode;
    // return ((k > 96 && k < 123) || (k >= 48 && k <= 57));
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }



  only_char(event) {
    var a;
    a = event.which;
    if ((a < 65 || a > 90) && (a < 97 || a > 122)) {
      return false;
    }
  }


   ProductNameForSelectedLine:any
  QtyForSelectedLine:any
  dataForSelectedLine(data1){
    console.log("ProductNameForSelectedLine", data1)
    this.ProductNameForSelectedLine = data1.product_name
    this.QtyForSelectedLine = data1.qty
  }
}
