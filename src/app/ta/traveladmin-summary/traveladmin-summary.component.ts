import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import{FormControl,FormGroup,FormBuilder,Validators,FormArray} from '@angular/forms';

import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import {TaService} from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import {ShareService} from "../share.service"
import {ActivatedRoute, Router} from "@angular/router";
export const PICK_FORMATS = {
  parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
  display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'}
  }
};
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date,'dd-MMM-yyyy',this.locale);
      } else {
          return date.toDateString();
      }
  }
}

@Component({
  selector: 'app-traveladmin-summary',
  templateUrl: './traveladmin-summary.component.html',
  styleUrls: ['./traveladmin-summary.component.scss']
})


export class TraveladminSummaryComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();  
   
  
  currentDate: any = new Date();
  // date = new Date().toLocaleDateString();
  defaultDate = new FormControl(new Date());
  today = new Date();
  date=new Date();
  has_next=true;
  has_previous=true;
  gettourapproveList:any
  memoSearchForm : FormGroup;
  tourapprovesummarypage:number=1;
  pagesize=10;
  currentpage: number = 1;
  presentpage: number = 1;
  istourappSummaryPagination:boolean;
  data:any;
  toursearch:any;
  latest:any;
  statusList: any;
  status: any;
  tourApprovalSearchForm : FormGroup;
  isTourChecker:boolean=true
  statusId: any = 2
  booktype: any;

  constructor(private  taService:TaService,private sharedService:SharedService,private datePipe: DatePipe,private route: ActivatedRoute,
    private router: Router,private shareservice:ShareService,private fb:FormBuilder,
    private SpinnerService :NgxSpinnerService) { }
  
  ngOnInit(): void {
    const heroId = this.route.snapshot.paramMap.get('id');
    // this.toursearch={
    //   requestno :'',
    //   requestdate:''   
    this.statusId=this.shareservice.statusvalue.value;
    this.booktype = this.shareservice.booking.value;
    let tourno = this.shareservice.tourno.value;
    let request_date= this.shareservice.requestdate.value;
    let reqsts = this.shareservice.booking_sts.value
    let branchid = this.shareservice.branchid.value;
    let employee  = this.shareservice.employee.value;
    console.log("VALUESSSs",request_date)
    this.send_value = ''
    request_date = this.datePipe.transform(request_date,"dd-MMM-yyyy");
    if (tourno){
      this.send_value = this.send_value+"&tour_no="+tourno
    }
    if (tourno && request_date){
      console.log(request_date)
      this.send_value = this.send_value+"&request_date="+request_date
    }
    else if(request_date){
      this.send_value = "&request_date="+request_date
    }
    if (reqsts != ""){
      this.send_value = this.send_value+"&booking_status="+reqsts
    }
    if (branchid){
      this.send_value = this.send_value+"&branch_id="+branchid
    }
    if(employee != '' && employee != null){
      this.send_value = this.send_value+"&makerid="+employee
    }
    
    console.log(tourno);
    console.log(request_date);
    this.tourApprovalSearchForm = this.fb.group({
      tourno:[''],
      requestdate:[''],
      
    })
    this.getapprovesumm(this.send_value,1);
    this.getstatusvalue();
  }
  getstatus(value){
  this.status = value
  console.log("this.status",this.status)
  }
  
  getstatusvalue(){
    // this.taService.getstatus()
    // .subscribe(res=>{
    //   this.statusList=res
    //   console.log("statusList",this.statusList)
    // })
  }

  tourview(data){
    this.data = {
      id:data['tourid'],
      status:data['status'],
      approverid:data['id'],
      approvedby_id:data['approver_id'],
      applevel:data['applevel'],
      employee_name:data['employee_name'],
      employee_code:data['employee_code'],
      empgrade:data['empgrade'],
      empdesignation:data['empdesignation'],
      empgid:data['empgid'],
      apptype:data['apptype']
    }
    var datas = JSON.stringify(Object.assign({}, this.data));
      localStorage.setItem('tourmakersummary',datas)
    // this.sharedService.summaryData.next(this.data)
   
    this.router.navigateByUrl('ta/touradmin');
  }
  searchClick(){
    
  }
  clearclick(){
    this.toursearch.requestno ='',
    this.toursearch.requestdate='' 
    this.toursearch.status='' 

  }


  
// tour maker summary

getapprovesumm(val,
  pageNumber) {
  this.SpinnerService.show();
  this.taService.getTourAdminSummary(this.statusId,pageNumber,val,this.booktype)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.gettourapproveList = datas;
      let datapagination = results["pagination"];
      this.gettourapproveList = datas;
      if (this.gettourapproveList.length === 0) {
        this.isTourChecker = false
      }
      if (this.gettourapproveList.length > 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.currentpage = datapagination.index;
        this.isTourChecker = true
      }
      this.SpinnerService.hide()
    })
   

}

TourapprovenextClick() {
  if (this.has_next === true) {
    this.getapprovesumm(this.send_value,this.currentpage + 1)
  }
}

TourapprovepreviousClick() {
  if (this.has_previous === true) {
    this.getapprovesumm(this.send_value,this.currentpage - 1)
  }


}




  send_value:String=""
  tourApproverSearch(){
    let form_value = this.tourApprovalSearchForm.value;

    if(form_value.tourno != "")
    {
      this.send_value=this.send_value+"&tour_no="+form_value.tourno
    }
    if(form_value.requestdate != "")
    {
      let date=this.datePipe.transform(form_value.requestdate,"dd-MMM-yyyy");
      this.send_value=this.send_value+"&request_date="+date
    }

    this.getapprovesumm(this.send_value,this.currentpage)

  }


  reset(){
    this.send_value=""
    this.tourApprovalSearchForm = this.fb.group({ 
      tourno:[''],
      requestdate:[''],
      
    })
    this.getapprovesumm(this.send_value,this.currentpage)
  }


  onStatusChange(e) {
    let status_name:any  = e
    if(status_name=="APPROVED"){
      this.statusId= 3
    }
    if(status_name=="PENDING"){
      this.statusId= 2
    }
    if(status_name=="REJECTED"){
      this.statusId= 4
    }
    if(status_name=="RETURN"){
      this.statusId= 5
    }
    if(status_name=="FORWARD"){
      this.statusId= 6
    }

    this.getapprovesumm(this.send_value,this.currentpage)
  }
}
