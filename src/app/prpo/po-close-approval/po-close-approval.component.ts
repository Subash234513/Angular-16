import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'

@Component({
  selector: 'app-po-close-approval',
  templateUrl: './po-close-approval.component.html',
  styleUrls: ['./po-close-approval.component.scss']
})
export class PoCloseApprovalComponent implements OnInit {
  poclosecreate: FormGroup;
  pocloseremarks: FormGroup;
  poclosedataList: any
  approvalForm: FormGroup
  rejectForm: FormGroup
  approvedisable = false;
  rejectdisable = false;

  constructor(private fb: FormBuilder, private prposhareService: PRPOshareService, private shareService: SharedService,
    private dataService: PRPOSERVICEService, private toastr: ToastrService, private notification: NotificationService,
    private router: Router, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService) { }
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  ngOnInit(): void {
    this.approvalForm = this.fb.group({
      remarks: ['', Validators.required],
      id: ''
    })
    this.rejectForm = this.fb.group({
      remarks: ['', Validators.required],
      id: ''
    })




    this.poclosecreate = this.fb.group({
      no: ['', Validators.required],
      supplier_id: ''
    })
    this.getPoclose();
  }
  id: any
  approvedcheck: boolean = true
  totallineAmount: any = 0.00
  getPoclose() {
    // let data:any = this.prposhareService.PocloseapprovalShare.value
    let data: any = this.prposhareService.PocloseapprovalShare.value
    this.pocloseid = data.poheader.id
    console.log("pocloseappdata", data)
    // if(data.closedata[0].poclose_status=="APPROVED"){
    //   this.approvedcheck=false
    this.pocloseIDfortran = data.id
    // }
    console.log(" this.pocloseIDfortran = data.id", this.pocloseIDfortran)
    this.poclosecreate.patchValue({
      no: data.poheader.no,
      supplier_id: data.poheader.supplierbranch_id.name
    })

    let id = data.poheader.id
    this.SpinnerService.show();
    this.dataService.grnproduct(id)

      .subscribe(results => {
        this.SpinnerService.hide();
        let datapatch = results
        this.id = datapatch.id

        let datas = results["data"];
        this.poclosedataList = datas

        let dataamount = datas.map(amount => amount.totalamount)
        this.totallineAmount = +dataamount
        console.log("total amount data", dataamount)

        console.log(this.poclosedataList, "data poclose list")

        this.approvalForm.patchValue({
          id: data.id
        })
        this.rejectForm.patchValue({
          id: data.id
        })
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

 

  deliverylist: any
  pocloseid: any
  delivery(data) {
    console.log("poidsssss", this.pocloseid, data)
    this.SpinnerService.show();
    this.dataService.product(this.pocloseid, data)
      .subscribe(results => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.deliverylist = datas

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })



  }


  approveClick() {
    // let datas:any = this.prposhareService.PocloseapprovalShare.value 
    this.approvedisable = true;
    const data = this.approvalForm.value;
    // data.id = this.id
    this.SpinnerService.show();
    this.dataService.getpocloseapprovaldata(data)
      .subscribe(result => {
        this.SpinnerService.hide();
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.notification.showError("Maker Not Allowed To Approve")
          this.SpinnerService.hide();
          this.approvedisable = false;
          return false
        } else {

          this.notification.showSuccess("Successfully Approved!...")
          this.SpinnerService.hide();
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
    const data = this.rejectForm.value;
    // data.id = this.id
    this.SpinnerService.show();
    this.dataService.getpocloserejectdata(data)
      .subscribe(result => {
        this.SpinnerService.hide();
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.notification.showError("Maker Not Allowed To Reject")
          this.SpinnerService.hide();
          this.approvedisable = false;
          return false
        } else {
          this.SpinnerService.hide();
          this.notification.showSuccess("Successfully Rejected!...")
          this.onSubmit.emit();
        }
        return true
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }


  onCancelClick() {
    this.onCancel.emit()
  }


  PocloseTranHistoryList: any
  pocloseIDfortran: any
  gettranhistory(data) {
    console.log("data for trans", data)
    let headerId = this.pocloseIDfortran
    console.log("headerId", headerId)
    let name = "poclose_tran"
    this.SpinnerService.show();
    this.dataService.getclosecanceltranhistory(headerId, name)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        console.log("getranhistory", datas);
        this.PocloseTranHistoryList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }


  ProductNameForSelectedLine:any
  QtyForSelectedLine:any
  dataForSelectedLine(data1){
    console.log("ProductNameForSelectedLine", data1)
    this.ProductNameForSelectedLine = data1.product_name
    this.QtyForSelectedLine = data1.qty
  }

}
