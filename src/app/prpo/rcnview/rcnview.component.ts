import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';


export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'app-rcnview',
  templateUrl: './rcnview.component.html',
  styleUrls: ['./rcnview.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class RCNViewComponent implements OnInit {
 
  GRNNo : number;
  DCNumber : number;
  ReceivedDate : Date;
  SupplierName : String;
  InvoiceNumber : number;
  Remarks : String;
  grnno:any
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  createdBy : string
  presentpagegrndetailsview        : number = 1;
  currentepagegrndetailsview       : number = 1;
  has_nextgrndetailsview           = true;
  has_previousgrndetailsview      = true;
  pageSize              = 10;
  grndetailsviewList               : any;
  grndetailsviewpage               : boolean = true;
  grnid:any;


  grndetailsviewid                 : any;
  presentpageAssetdetails       : number = 1;
  currentepageAssetdetails       : number = 1;
  has_nextAssetdetails           = true;
  has_previousAssetdetails       = true;
  pageSizeAssetdetails           = 10;
  AssetdetailsList               : any;
  Assetdetailspage               : boolean = true;
  GRNData  : any;
  grnview : any;
  isDisabled = true;
  supp:any;


  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private dataService: PRPOSERVICEService, 
    private prposhareService:PRPOshareService , private toastr:ToastrService, private datePipe: DatePipe  ) { }

  ngOnInit(): void {
    // let grndetailsviewsummary= this.prposhareService.grndetailsviewsummaryid.value
    // this.grndetailsviewid=grndetailsviewsummary['id']
    // console.log('ss', grndetailsviewsummary)
    
    let grnsummary= this.prposhareService.rcnsummary.value
    this.grnid = grnsummary;
    //console.log('ss', grnsummary)
    // this.getgrnView();
    this.getgrndetailsviewsummary();
    // this.assetdetailssummary();
  }

  getgrnView() {
    this.dataService.getgrnView(this.grnid)
      .subscribe(result => {
       console.log("grn", result)
        let datas = result['data']
        let overall = datas;
        for (var i = 0; i < overall.length; i++) {
          this.grnview = overall[i]
          let rdate=this.grnview;
          rdate.inwardheader.date=this.datePipe.transform(rdate.inwardheader.date, 'yyyy-MM-dd');
          //console.log("ccc",  rdate.inwardheader.date)
        // this.GRNData = result
        // this.prposhareService.grnsummaryid.next(this.GRNData)
        this.GRNNo = this.grnview?.inwardheader?.code;
        this.DCNumber = this.grnview?.inwardheader?.dcnote;
        this.ReceivedDate = this.grnview?.inwardheader?.date;
        this.SupplierName =this.grnview?.poheader_id?.supplierbranch_id?.code +"--"+this.grnview?.poheader_id?.supplierbranch_id?.name;
        this.InvoiceNumber =this.grnview?.inwardheader?.invoiceno;
        this.Remarks =this.grnview?.inwardheader?.remarks;
        this.createdBy = this.grnview?.created_by
        }
      })
    }

  getgrndetailsviewsummary(pageNumber = 1, pageSize = 10){
    this.dataService.getgrndetailsviewsummary(pageNumber, pageSize ,this.grnid)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      console.log("getgrn", datas);
      let datapagination = results["pagination"];
      this.grndetailsviewList = datas;

      let overall = datas;
      for (var i = 0; i < overall.length; i++) {
        this.grnview = overall[i]
        let rdate=this.grnview;
        rdate.inwardheader.date=this.datePipe.transform(rdate.inwardheader.date, 'yyyy-MM-dd');
        //console.log("ccc",  rdate.inwardheader.date)
      // this.GRNData = result
      // this.prposhareService.grnsummaryid.next(this.GRNData)
      this.GRNNo = this.grnview?.inwardheader?.code;
      this.DCNumber = this.grnview?.inwardheader?.dcnote;
      this.ReceivedDate = this.grnview?.inwardheader?.date;
      this.SupplierName =this.grnview?.poheader_id?.supplierbranch_id?.code +"--"+this.grnview?.poheader_id?.supplierbranch_id?.name;
      this.InvoiceNumber =this.grnview?.inwardheader?.invoiceno;
      this.Remarks =this.grnview?.inwardheader?.remarks;
      this.createdBy = this.grnview?.created_by.full_name
      }
       //disable condition starts------------------------
      //  let ss=this.grndetailsviewList
      //  //console.log("gh",ss)
      //  let ff=ss['podelivery']
      //  //console.log("jk",ff)
      //  let overall =ss;
      // //  for (var i = 0; i < overall.length; i++) {
      // //    this.supp = overall[i].podelivery.product_id.category_id.isasset
      // //   // console.log("sai",this.supp)
 
      // //  }
      //  if(this.supp === 1)
      //  {
      //    this.isDisabled = true
      //  }
      //  else {
      //    this.isDisabled = false
      //  }
       //disable condition ends------------------------
      // if (this.grndetailsviewList.length === 0) {
      //   this.grndetailsviewpage = false
      // }
      if (this.grndetailsviewList.length > 0) {
        this.has_nextgrndetailsview = datapagination.has_next;
        this.has_previousgrndetailsview = datapagination.has_previous;
        this.presentpagegrndetailsview = datapagination.index;
        this.grndetailsviewpage = true
      }
    })
  }
  nextClickgrndetails() {
    if (this.has_nextgrndetailsview === true) {   
      this.currentepagegrndetailsview = this.presentpagegrndetailsview + 1                                                      
      this.getgrndetailsviewsummary(this.presentpagegrndetailsview + 1, 10)
    }                                                                                        
  }

  previousClickgrndetails() {
    if (this.has_previousgrndetailsview === true) {
      this.currentepagegrndetailsview = this.presentpagegrndetailsview - 1
      this.getgrndetailsviewsummary(this.presentpagegrndetailsview - 1, 10)
    }
  }
 
// Asset details popup code.

assetdetailssummary(pageNumber = 1, pageSize = 10) {
  this.dataService.assetdetailssummary(pageNumber, pageSize, this.grndetailsviewid)
    .subscribe((result) => {
      let datas = result['data'];
      let datapagination = result["pagination"];
      this.AssetdetailsList = datas;
      if (this.AssetdetailsList.length === 0) {
        this.Assetdetailspage = false
      }
      if (this.AssetdetailsList.length >= 0) {
        this.has_nextAssetdetails = datapagination.has_next;
        this.has_previousAssetdetails = datapagination.has_previous;
        this.presentpageAssetdetails = datapagination.index;
        this.Assetdetailspage = true
      }
    })
  }
  nextClickassets() {
    if (this.has_nextAssetdetails === true) {
      this.currentepageAssetdetails = this.presentpageAssetdetails + 1
      this.assetdetailssummary(this.presentpageAssetdetails + 1)
    }
  }

  previousClickassets() {
    if (this.has_previousAssetdetails === true) {
      this.currentepageAssetdetails = this.presentpageAssetdetails - 1
      this.assetdetailssummary(this.presentpageAssetdetails - 1)
    }
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57));
  }
  assetinfo(data){}

  onCancelClick() {
    this.onCancel.emit()
  }
}
