import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TaService } from "../ta.service";
import { ShareService } from "../share.service";
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-report-tour-detail',
  templateUrl: './report-tour-detail.component.html',
  styleUrls: ['./report-tour-detail.component.scss']
})
export class ReportTourDetailComponent implements OnInit {
  reporttourdetailForm: FormGroup
  tourdetailreportmodal: any
  gettourdetailreportList: any = []
  id: any
  ids: any
  emptourid: any
  empname: any
  reportindex: any
  datas: any
  tourreportid: any
  emptourreportid: any
  tourdetaillist: any
  has_next: any;
  presentpage: any = 1;
  has_previous: any;
  tourrequirementid: string;
  startdate: string;
  enddate: string;
  tourid: any;

  constructor(public taservice: TaService, private shareservice: ShareService,
    private router: Router,private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.id = this.shareservice.tourData.value
    this.emptourid = this.shareservice.empData.value
    this.datas = this.shareservice.report.value
    this.reportindex = this.datas.index
    this.tourreportid = this.shareservice.tourreasonid.value

    this.emptourreportid = this.shareservice.emptourreasonid.value
    this.tourrequirementid=this.shareservice.report_requirement.value

    this.startdate=this.shareservice.report_startdate.value
    this.enddate=this.shareservice.report_enddate.value
    this.tourid=this.shareservice.report_tournumb.value

    console.log('this.tourid',this.tourid)
    console.log('this.startdate',this.startdate)
    console.log('this.enddate',this.enddate)
    console.log('this tourrequirementid',this.tourrequirementid)

    this.tourdetailreportmodal = {
      requestno: ""
    }
    // this.gettourdetailreportList=[]

    // if (this.shareservice.report_tournumb.value == '' || this.shareservice.report_tournumb.value == null) {
    //   this.presentpage = 1

    //   this.gettourdetail(this.presentpage,this.tourrequirementid,this.startdate)
    // }
    // else {
      this.presentpage = 1
      this.getsearchtourdetail(this.shareservice.report_tournumb.value, this.presentpage,this.tourrequirementid,this.startdate,this.enddate)
    // }






  }
  tourrequestno: any
  gettourdetail(data,book,date ) {
    this.SpinnerService.show()
    let arr
    this.taservice.gettourdetailreport(data,book,date)
      .subscribe(data => {
        this.SpinnerService.hide()
        this.gettourdetailreportList = data['data']
        // console.log('this.gettourdetailreportlist', data['data'][0])
        let pagination = data['pagination'];

        if (this.gettourdetailreportList) {
          this.has_next = pagination.has_next;
          this.has_previous = pagination.has_previous;
          this.presentpage = pagination.index;

        }
        if (this.gettourdetailreportList.length == 0) {
          this.nextClick()

        }
        if (this.gettourdetailreportList) {
          this.gettourdetailreportList = this.gettourdetailreportList.sort((key1, key2) => (key1.tour_id < key2.tour_id) ? -1 : 1);
        }
        this.shareservice.report_tourpage.next(this.presentpage)


      })
  }


  getsearchtourdetail(tourid, page,book,startdate,enddate) {
    this.SpinnerService.show()
    let arr
    this.taservice.getsearchtourdetailreport(tourid, page,book,startdate,enddate)
      .subscribe(data => {
        this.SpinnerService.hide()
        this.gettourdetailreportList = data['data']
        // console.log('this.gettourdetailreportlist',data['data'][0] )
        let pagination = data['pagination'];

        if (this.gettourdetailreportList) {
          this.has_next = pagination.has_next;
          this.has_previous = pagination.has_previous;
          this.presentpage = pagination.index;

        }
        // if (this.gettourdetailreportList.length == 0) {
        //   this.nextClick()

        // }
        // if (this.gettourdetailreportList) {
        //   this.gettourdetailreportList = this.gettourdetailreportList.sort((key1, key2) => (key1.tour_id < key2.tour_id) ? -1 : 1);
        // }
        this.shareservice.report_tourpage.next(this.presentpage)


      })
  }

  nextClick() {
    if (this.has_next == true) {
        this.getsearchtourdetail(this.shareservice.report_tournumb.value, this.presentpage + 1,this.tourrequirementid,this.startdate,this.enddate)
    }
    this.shareservice.report_tourpage.next(this.presentpage)

  }
  previousClick() {
    if (this.has_previous == true) {
        this.getsearchtourdetail(this.shareservice.report_tournumb.value, this.presentpage - 1,this.tourrequirementid,this.startdate,this.enddate)
    }

    this.shareservice.report_tourpage.next(this.presentpage)
  }

  pagexldownload() {
    // gettourreportxl
    // console.log('sharedsssddfs',this.presentpage)
    // this.taservice.gettourreportxl(+this.presentpage).subscribe(data => {

    //   let binaryData = [];
    //   binaryData.push(data)
    //   let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    //   let link = document.createElement('a');
    //   link.href = downloadUrl;
    //   link.download = 'Report' + ".xlsx";
    //   link.click();
    //   // var file = new Blob([results], { type: 'application/pdf' })
    // var fileURL = window.URL.createObjectURL(file);

    // // window.open(fileURL); 
    // var a = document.createElement('a');
    // a.href = fileURL;
    // a.download = 'claim.pdf';
    // document.body.appendChild(a);
    // a.click();
    // }, (error) => {
    //   console.log('getPDF error: ', error.error.text);
    // })
  }

  download() {
    if (this.reportindex === 1) {

      this.taservice.gettourdetaildownload(this.tourreportid)
        .subscribe((results) => {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'Tour Detail Report' + ".xlsx";
          link.click();
        })
    }
    if (this.reportindex === 3) {
      this.taservice.gettourdetaildownload(this.emptourreportid)
        .subscribe((results) => {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'Tour Detail Report' + ".xlsx";
          link.click();
        })
    }
  }
  onCancelClick() {
    this.router.navigateByUrl("/ta_report")
  }
  touradvance() {
    this.router.navigateByUrl("/reporttouradvance")
  }
  tourexpense() {
    this.router.navigateByUrl("/reporttourexpense")
  }
  getdetail(data) {

    this.taservice.gettourdetailreportdetailitenary(data)
      .subscribe((results) => {
        console.log('tour', data, 'detail', results)
        this.tourdetaillist = results

      })
  }
}
