import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators,} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'
@Component({
  selector: 'app-po-reopen',
  templateUrl: './po-reopen.component.html',
  styleUrls: ['./po-reopen.component.scss']
})
export class PoReopenComponent implements OnInit {
  poreopencreate: FormGroup;
  poreopenremarks: FormGroup;
  poreopendataList: any
  clicked = false;
  amt: any
  sum: any
  deliverydetailList: any;
  has_nextddetails = true
  has_previousddetails = true
  presentpageDD: number = 1;
  currentpageDD: number = 1;
  is_deliverydetails = true
  has_next = true;
  has_previous = true;
  poreopenid: any;
  constructor(private fb: FormBuilder, private prposhareService: PRPOshareService, private shareService: SharedService,
    private dataService: PRPOSERVICEService, private toastr: ToastrService, private notification: NotificationService,
    private router: Router, private sanitizer: DomSanitizer, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService) { }
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  ngOnInit(): void {
    this.poreopenremarks = this.fb.group({
      id: '',
      remarks: ['', Validators.required]
    })



    this.poreopencreate = this.fb.group({
      no: ['', Validators.required],
      supplier_id: ''
    })
    this.getporeopen();

    let poreopen: any = this.prposhareService.PoreopenShare.value
    this.poreopenid = poreopen['id']
    console.log("reopenid", this.poreopenid)
  }

  ProductCategory: any
  ProductType: any
  ProductName: any
  UOM: any
  Quantity: any
  UnitPrice: any
  Amount: any
  TotalAmount: any
  approvedcheck: boolean = true
  totallineAmount: any = 0.00
  getporeopen() {
    let data: any = this.prposhareService.PoreopenShare.value
    console.log("reopen", data)
    let id = data.id
    this.reopenid = data.id
    this.SpinnerService.show();
    this.dataService.grnproduct(id)
      .subscribe(results => {
        this.SpinnerService.hide();
        let datapatch = results
        let datas = results["data"];
        this.poreopendataList = datas
        let dataamount = datas.map(amount => amount.totalamount)
        this.totallineAmount = +dataamount
        console.log("total amount data", dataamount)
        this.poreopencreate.patchValue({
          no: data.no,
          supplier_id: data.supplierbranch_id.name
        })
        this.poreopenremarks.patchValue({
          id: data.id
        })
        
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  deliverylistReopen: any
  reopenid: any
  deliveryReopen(data2) {
    this.SpinnerService.show();
    this.dataService.product(this.reopenid, data2)
      .subscribe(results => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.deliverylistReopen = datas

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })



  }


  poreopensubmit() {

    // if (this.poreopenremarks.value.remarks.trim() === "") {
    //   this.toastr.error('Add remarks Field', 'Empty value inserted', { timeOut: 1500 });

    //   return false;
    // }
    this.clicked = true
    let data = this.poreopenremarks.value
    this.SpinnerService.show();
    this.dataService.poreopenremarks(data)
      .subscribe(result => {
        this.SpinnerService.hide();
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.SpinnerService.hide();
          this.notification.showError("Maker Not Allowed To Approve")
          this.clicked = false;
          return false
        } else {
          this.notification.showSuccess("Successfully Reopened!...")
          this.SpinnerService.hide();
          this.onSubmit.emit();
        }
        return true
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
  addreopendeliverydetails(data) {
    this.poreopenid = data.id;
    this.reopendeliverydetailssummary();
    this.prposhareService.PoreopenShare.next(data)
  }
  datasums() {
    this.amt = this.poreopendataList.map(x => x.totalamt);
    console.log('data check amt', this.amt);
    this.sum = this.amt.reduce((a, b) => a + b, 0);
    console.log('sum of total ', this.sum);
  }
  reopendeliverydetailssummary(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show();
    this.dataService.reopendeliverydetailssummary(pageNumber, pageSize, this.poreopenid)
      .subscribe((result) => {
        let datas = result['data'];
        this.SpinnerService.hide();
        let datapagination = result["pagination"];
        this.deliverydetailList = datas;
        if (this.deliverydetailList.length === 0) {
          this.is_deliverydetails = false
        }
        if (this.deliverydetailList.length > 0) {
          this.has_nextddetails = datapagination.has_next;
          this.has_previousddetails = datapagination.has_previous;
          this.presentpageDD = datapagination.index;
          this.is_deliverydetails = true
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  nextClickDD() {
    if (this.has_next === true) {
      this.currentpageDD = this.presentpageDD + 1
      this.reopendeliverydetailssummary(this.presentpageDD + 1)
    }
  }

  previousClickDD() {
    if (this.has_previous === true) {
      this.currentpageDD = this.presentpageDD - 1
      this.reopendeliverydetailssummary(this.presentpageDD - 1)
    }
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
