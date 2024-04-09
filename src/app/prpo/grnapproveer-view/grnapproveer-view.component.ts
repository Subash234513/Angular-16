import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-grnapproveer-view',
  templateUrl: './grnapproveer-view.component.html',
  styleUrls: ['./grnapproveer-view.component.scss']
})
export class GrnapproveerViewComponent implements OnInit {
  approvalForm: FormGroup
  rejectForm: FormGroup
  grncloseremarks: FormGroup;
  remshitform: FormGroup;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private dataService: PRPOSERVICEService,
    private prposhareService: PRPOshareService, private toastr: ToastrService,
    private notification: NotificationService, private datePipe: DatePipe) { }


  ngOnInit(): void {


    this.approvalForm = this.fb.group({
      remarks: ['', Validators.required],
      id: ''
    })
    this.rejectForm = this.fb.group({
      remarks: ['', Validators.required],
      id: ''
    })
    this.remshitform = this.fb.group({
      po_number: '',
      type: '',
      status: '',
      date: ''
    })
    this.getgrnclose(1)
    // this.getflag()
  }

  grnclosedataList: any
  grnno: any
  inwardid: any
  dcno: any
  recdate: any
  suppliername: any
  invoiceno: any
  remarks: any
  flagdetailsarray: any
  remspostjson: any
  isapprove = false
  isreject = false
  currentepagegrndetailsview       : number = 1;
  has_nextgrndetailsview           = true;
  has_previousgrndetailsview      = true;
  pageSize              = 10;
  presentpagegrndetailsview        : number = 1;
  getflag() {
    let data: any = this.prposhareService.grnapprovalShare.value

    this.dataService.grnflag(data.id)


      .subscribe(results => {

        this.flagdetailsarray = results
        const data = this.remshitform.value;
        data.po_number = this.flagdetailsarray.poheader_id.no
        data.type = this.flagdetailsarray.type
        data.status = this.flagdetailsarray.inwardheader.grn_status
        data.date = this.flagdetailsarray.inwardheader.date
        this.remspostjson = data




        console.log("datassss", this.grnclosedataList)
        if (this.flagdetailsarray.flag === "R") {
          this.remspost()


        }
        else {
          this.router.navigate(['/grnapproversummary'], { skipLocationChange: true });
        }




      })

  }

  remspost() {

    this.remspostjson.date = this.datePipe.transform(this.remspostjson.date, 'yyyy-MM-dd');
    this.dataService.rcnupdate(this.remspostjson)


      .subscribe(results => {
        this.router.navigate(['/grnapproversummary'], { skipLocationChange: true });
        console.log("closed", results)
        return true






      })


  }
  getgrnclose(page) {
    let data: any = this.prposhareService.grnapprovalShare.value
    console.log("prodata", data)


    this.grnno = data.inwardheader.code
    this.dcno = data.inwardheader.dcnote
    this.recdate = data.date
    this.suppliername = data.poheader_id.supplierbranch_id.name
    this.invoiceno = data.inwardheader.invoiceno
    this.remarks = data.inwardheader.remarks






    let id = data.inwardheader.id
    this.inwardid = data.inwardheader.id
    console.log("inwardid", id)

    this.dataService.getgrndetailsviewsummary( page, 10, id)
      .subscribe(results => {
        let datapatch = results['data']
        let datapagination = results['pagination']
        this.grnclosedataList = datapatch
        console.log("datassss", this.grnclosedataList)
        if (this.grnclosedataList.length >= 0) {
          // this.SpinnerService.hide();
          this.has_nextgrndetailsview = datapagination.has_next;
          this.has_previousgrndetailsview = datapagination.has_previous;
          this.presentpagegrndetailsview = datapagination.index;
          
        }
      },(error) => {
        console.log(error)
        // this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
      })
  }

  nextClickgrndetails() {
    if (this.has_nextgrndetailsview === true) {   
      this.currentepagegrndetailsview = this.presentpagegrndetailsview + 1                                                      
      this.getgrnclose(this.presentpagegrndetailsview + 1)
    }                                                                                        
  }

  previousClickgrndetails() {
    if (this.has_previousgrndetailsview === true) {
      this.currentepagegrndetailsview = this.presentpagegrndetailsview - 1
      this.getgrnclose(this.presentpagegrndetailsview - 1)
    }
  }

  approveClick() {
    this.isapprove = true
    const data = this.approvalForm.value;
    data.id = this.inwardid
    this.dataService.getgrncloseapprovaldata(data)
      .subscribe(results => {
        if (results.code === "INVALID_APPROVER_ID") {
          this.notification.showError("Maker Not Allowed To Approve")
          this.isapprove = false
          return false;
        }else{
        //this.getflag()
        this.notification.showSuccess("Successfully Approved!...")
        // this.router.navigate(['/grnapproversummary'], { skipLocationChange: true });
        this.onSubmit.emit();
        console.log("closed", results)
        return true
        }
      })
  }
  // reer(){
  //   this.isapprove=true
  // }
  rejectClick() {
    this.isreject = true

    const data = this.rejectForm.value;
    data.id = this.inwardid
    this.dataService.getgrncloserejectdata(data)
      .subscribe(results => {
        if (results.code === "INVALID_APPROVER_ID") {
          this.notification.showError("Maker Not Allowed To Reject")
          this.isreject = false
          return false;
        }else{
        //this.getflag()
        this.notification.showSuccess("Successfully Rejected!...")
        //this.router.navigate(['/grnapproversummary'], { skipLocationChange: true });
        this.onSubmit.emit();
        console.log("closed", results)
        return true;
        }
      })
  }



  onCancelClick() {
    //this.router.navigate(['/grnapproversummary'], { skipLocationChange: true })
    this.onCancel.emit()
  }

  assetList: any
  getGrnAssetdata(data) {
    let detailsID = data.id
    this.dataService.getGrnAssetdata(detailsID)
      .subscribe(results => {
        let datas = results
        this.assetList = datas
      })
  }



}
