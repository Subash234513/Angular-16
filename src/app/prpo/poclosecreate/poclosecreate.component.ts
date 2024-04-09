import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
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
  selector: 'app-poclosecreate',
  templateUrl: './poclosecreate.component.html',
  styleUrls: ['./poclosecreate.component.scss']
})
export class PoclosecreateComponent implements OnInit {
  poclosecreate: FormGroup;
  pocloseremarks: FormGroup;
  poclosedataList: any
  abc: any
  clicked = false;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  constructor(private fb: FormBuilder, private prposhareService: PRPOshareService, private shareService: SharedService,
    private dataService: PRPOSERVICEService, private toastr: ToastrService, private notification: NotificationService,
    private router: Router, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService    ) { }

  ngOnInit(): void {
    this.pocloseremarks = this.fb.group({
      // id:'',
      remarks: ['', Validators.required]
    })



    this.poclosecreate = this.fb.group({
      no: ['', Validators.required],
      supplier_id: ''
    })
    this.getPoclose();
  }

  ProductCategory: any
  ProductType: any
  ProductName: any
  UOM: any
  Quantity: any
  UnitPrice: any
  Amount: any
  TotalAmount: any
  poheaderid: any
  pocloseid: any
  approvedcheck: boolean = true
  totallineAmount: any = 0.00
  getPoclose() {
    let data: any = this.prposhareService.PocloseShare.value
    console.log("poclosedata", data)
    // if(data.closedata[0].poclose_status=="APPROVED"){
    //   this.approvedcheck=false

    // }
    // if ('closedata' in data){
    //   if(data.closedata[0].poclose_status=="APPROVED"){
    //     this.approvedcheck=false
    //   }
    // }
    this.pocloseid = data.id
    // this.pocloseid=data.product_data[0].id
    this.poclosecreate.patchValue({
      no: data.no,
      supplier_id: data.supplierbranch_id.name
    })

    let id = data.id
    this.SpinnerService.show();
    this.dataService.grnproduct(id)
      .subscribe(results => {
        this.SpinnerService.hide();
        let datapatch = results
        this.poheaderid = data.id
        let datas = results["data"];
        this.poclosedataList = datas
        let dataamount = datas.map(amount => amount.totalamount)
        this.totallineAmount = +dataamount
        console.log("total amount data", dataamount)
        console.log("po close product dataa id", this.poclosedataList)

        // this.poclosedataList = results
        this.TotalamountProductList(this.poclosedataList)
        console.log("pocloseresults", this.pocloseid)
        if (data?.closedata[0]?.poclose_status == "APPROVED") {
          this.SpinnerService.hide();
          this.approvedcheck = false

        }
        if (data?.closedata[0]?.poclose_status == "PENDING_FOR_APPROVAL") {
          this.SpinnerService.hide();
          this.approvedcheck = false

        }
        if (data?.closedata[0]?.poclose_status == "REJECTED") {
          this.SpinnerService.hide();
          this.approvedcheck = false
        }
        
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  deliverylist: any

  delivery(data2) {
    // console.log("poidsssss",this.pocloseid,data2)
    this.SpinnerService.show();
    this.dataService.product(this.pocloseid, data2)
      .subscribe(results => {
        let datas = results["data"];
        this.SpinnerService.hide();
        this.deliverylist = datas
        console.log("poi this.deliverylistdsssss", this.deliverylist)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })



  }



  poclosesubmit() {
    this.clicked = true
    // let data = this.pocloseremarks.value
    const data = this.pocloseremarks.value;
    data.poheader_id = this.poheaderid
    this.SpinnerService.show();
    this.dataService.pocloseremarks(data)
      .subscribe(results => {
        this.SpinnerService.hide();
        this.notification.showSuccess("Successfully Updated!...")
        this.onSubmit.emit();
        console.log("closed", results)
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

  TotalamountProductList(data) {
    console.log("total amount", data)
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
  dataForSelectedLine(data1,data2){
    this.ProductNameForSelectedLine = data1.product_name
    this.QtyForSelectedLine = data1.qty
  }







}
