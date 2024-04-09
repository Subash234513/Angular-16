import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NotificationService } from '../notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'
@Component({
  selector: 'app-po-cancel',
  templateUrl: './po-cancel.component.html',
  styleUrls: ['./po-cancel.component.scss']
})
export class PoCancelComponent implements OnInit {
  pocancelcreate: FormGroup;
  pocancelremarks: FormGroup;
  pocanceldataList: any
  pocancelmakerid: any;
  deliverydetailList: any;
  has_nextddetails = true
  has_previousddetails = true
  presentpageDD: number = 1;
  currentpageDD: number = 1;
  is_deliverydetails = true
  has_next = true;
  has_previous = true;
  clicked = false;
  constructor(private fb: FormBuilder, private prposhareService: PRPOshareService, private shareService: SharedService,
    private dataService: PRPOSERVICEService, private notification: NotificationService, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService) { }
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  ngOnInit(): void {
    this.pocancelremarks = this.fb.group({
      poheader_id: '',
      remarks: ['', Validators.required]
    })



    this.pocancelcreate = this.fb.group({
      no: ['', Validators.required],
      supplier_id: ''
    })
    let pocancelmaker: any = this.prposhareService.PocancelShare.value
    this.pocancelmakerid = pocancelmaker['id']
    console.log("makerid", this.pocancelmakerid)
    this.getPocancel();
  }

  ProductCategory: any
  ProductType: any
  ProductName: any
  UOM: any
  Quantity: any
  UnitPrice: any
  Amount: any
  TotalAmount: any
  amt: any
  sum: any
  pageSizeDD = 10;
  approvedcheck: boolean = true

  totallineAmount: any = 0.00
  getPocancel() {
    let data: any = this.prposhareService.PocancelShare.value
    this.pocloseid = data.id

    console.log("datacan", data);
    this.pocancelcreate.patchValue({
      no: data.no,
      supplier_id: data.supplierbranch_id.name
    })

    let id = data.id
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

        this.pocancelremarks.patchValue({
          poheader_id: data.id
        })
        console.log("cancel status", data.canceldata[0]?.pocancel_status )
        if(data.canceldata[0]?.pocancel_status=="APPROVED"){
          this.approvedcheck=false
          this.SpinnerService.hide();
        }
        if (data?.canceldata[0]?.pocancel_status == "PENDING_FOR_APPROVAL") {
          this.approvedcheck = false
          this.SpinnerService.hide();
        }
        if (data?.canceldata[0]?.pocancel_status == "REJECTED") {
          this.approvedcheck = false
          this.SpinnerService.hide();
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  deliverylist: any
  pocloseid: any
  delivery(data) {
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
  pocancelsubmit() {
    this.clicked = true
    this.SpinnerService.show();
    let data = this.pocancelremarks.value
    this.dataService.pocancelremarks(data)
      .subscribe(results => {
        this.SpinnerService.hide();
        this.notification.showSuccess("Successfully Updated!...")
        this.onSubmit.emit();
        console.log("cancled", results)
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


  adddeliverydetails(data) {
    this.pocancelmakerid = data.id;
    this.deliverydetailssummary();
    this.prposhareService.PocancelShare.next(data)
  }
  deliverydetailssummary(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show();
    this.dataService.deliverydetailssummary(pageNumber, pageSize, this.pocancelmakerid)
      .subscribe((result) => {
        this.SpinnerService.hide();
        let datas = result;
        let datapagination = result["pagination"];
        this.deliverydetailList = datas;
        if (this.deliverydetailList.length === 0) {
          this.is_deliverydetails = false
          this.SpinnerService.hide();
        }
        if (this.deliverydetailList.length >= 0) {
          this.SpinnerService.hide();
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
      this.deliverydetailssummary(this.presentpageDD + 1)
    }
  }

  previousClickDD() {
    if (this.has_previous === true) {
      this.currentpageDD = this.presentpageDD - 1
      this.deliverydetailssummary(this.presentpageDD - 1)
    }
  }

  datasums() {
    this.amt = this.pocanceldataList.map(x => x.totalamt);
    console.log('data check amt', this.amt);
    this.sum = this.amt.reduce((a, b) => a + b, 0);
    console.log('sum of total ', this.sum);
  }

  
  ProductNameForSelectedLine:any
  QtyForSelectedLine:any
  dataForSelectedLine(data1){
    console.log("ProductNameForSelectedLine", data1)
    this.ProductNameForSelectedLine = data1.product_name
    this.QtyForSelectedLine = data1.qty
  }
}


