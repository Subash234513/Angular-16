import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles';
import { AttendanceService } from '../../attendance.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service'

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.scss'],
  providers: [imp.HrmsAPI]
})
export class PostJobComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private attendanceService: AttendanceService, private shareService: imp.SharedService,
    private hrmsapi: imp.HrmsAPI, private APiserv: ApicallserviceService, 
  ) { }

  Objs = {
    'Post Job Summary': false,
    'Post Job Create': false,
    'Post Job View': false 
  }

  JobPostingSearchForm: FormGroup; 
  RemarksForm: FormGroup;

  JobPostingObjects = {
    JobList: [],
    hasnextPostJobSummary: false,
    hasPreviousPostJobSummary: false, 
    presentPagePostJobSummary: 1, 
    ApprovalStatusList: [],
    ViewPost: null,
    ProcessList: [{id: 1, name: 'Approved'}, {id: 2, name: 'Reject'}, {id: 3, name: 'Return'} ],
    SelectedProcess: '',
    JobId: 0,
    ProposedJobList: [],
    hasnextProposedSummary: false,
    hasPreviousproposedSummary: false, 
    presentPageproposedSummary: 1,                      

  } 
  ngOnInit(): void {
    this.Objs['Post Job Summary'] = true 

    this.JobPostingSearchForm = this.fb.group({
      approvalstatus: ''
    })
    this.RemarksForm = this.fb.group({
      remarks: ''
    })

    this.JobPostSearch('')
    this.getStatus()
  }


  SummaryCallJobpost(search, pageno) {  
    console.log("data search b4 submit in search",)
    this.APiserv.ApiCall('get',this.hrmsapi.HRMS_API.api.recruitment+'summary&page='+ pageno + '&', search)  
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log('leave request', result)
        let datass: Job[] = result['data'];
        console.log("data for Job interface", datass)
        this.JobPostingObjects.JobList = datass;
        let datapagination = result["pagination"];
        if (this.JobPostingObjects.JobList.length > 0) {
          this.JobPostingObjects.hasnextPostJobSummary = datapagination.has_next;
          this.JobPostingObjects.hasPreviousPostJobSummary = datapagination.has_previous;
          this.JobPostingObjects.presentPagePostJobSummary = datapagination.index; 
        } 
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  } 

  JobPostSearch(hint: any) {
    let search = this.JobPostingSearchForm.value; 
    console.log("search data ", search)
    let obj = { 
      approval_status: search?.approvalstatus,
    } 
    console.log("obj data b4 api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        // obj[i] = '';
        obj[i] = '';

      }
    }
    console.log("obj data after api", obj)
    this.SpinnerService.show();

    if (hint == 'next') {
      this.SummaryCallJobpost(obj, this.JobPostingObjects?.presentPagePostJobSummary + 1)
    }
    else if (hint == 'previous') {
      this.SummaryCallJobpost(obj, this.JobPostingObjects?.presentPagePostJobSummary - 1) 
    }
    else {
      this.SummaryCallJobpost(obj, 1 )
    }

  }

  resetRequestSearch() {
    this.JobPostingSearchForm.reset('')
    this.JobPostSearch('')
  }



  getAddScreen(){
    this.Objs['Post Job Create'] = true;
    this.Objs['Post Job Summary'] = false;
    this.Objs['Post Job View'] = false; 
  }


  // statusclick(data){ 
  //   this.APiserv.ApiCall("get", this.hrmsapi.HRMS_API.api )

  // }

  ViewJobPost(data){
    console.log(data, data?.id)
    let id = data?.id
    this.JobPostingObjects.JobId = id 
    this.Objs['Post Job Create'] = false ;
    this.Objs['Post Job Summary'] = false; 
    this.Objs['Post Job View'] = true;   
    console.log("data for view post job", data)
    this.APiserv.ApiCall("get", this.hrmsapi.HRMS_API.api.recruitment+'fetch&id='+id) 
    .subscribe(results =>{
      this.JobPostingObjects.ViewPost = results 


    })


  }

  


  gettingRemarks(type) {
    console.log("selected tuype for popup", type)
    let type_Of_Process = type?.name 
    this.JobPostingObjects.SelectedProcess = type_Of_Process
  }


  Approval_Reject_Review(type) {
    let typeID;
    if (type == 'Approve') {
      typeID = 3
    }
    if (type == 'Reject') {
      typeID = 4
    }
    if (type == 'Return') {
      typeID = 5
    }

    let obj = {
      "remarks": this.RemarksForm.value.remarks,
      "status": typeID
    }
    this.SpinnerService.show();

    this.APiserv.ApiCall('post', this.hrmsapi.HRMS_API.api, obj) 
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        console.log("results after approval", results)
        let obj = {
          data: {
            id: this.JobPostingObjects?.JobId
          }
        }
        this.notify.success("Success")
        this.ViewJobPost(obj)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  SubmitPostJob(){
    this.Objs['Post Job Create'] = false;
    this.Objs['Post Job Summary'] = true;
    this.Objs['Post Job View'] = false 
    this.JobPostSearch('')
  }

  CancelPostJob(){
    this.Objs['Post Job Create'] = false;
    this.Objs['Post Job Summary'] = true; 
    this.Objs['Post Job View'] = false 
    this.JobPostingObjects.ViewPost =  '';
    this.JobPostingObjects.JobId = 0
    this.JobPostingObjects.SelectedProcess = ''
  }

  getStatus(){
    this.APiserv.ApiCall("get", this.hrmsapi.HRMS_API.api.hrmsStatusDropdown)
    .subscribe(res=>{
      this.JobPostingObjects.ApprovalStatusList = res['data']
    })
  }


  

  SummaryCallproposed(search, pageno) {  
    console.log("data search b4 submit in search",)
    this.APiserv.ApiCall('get',this.hrmsapi.HRMS_API.api.proposedJob+'summary&page='+ pageno + '&', search)  
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log('leave request', result)
        let datass = result['data'];
        this.JobPostingObjects.JobList = datass;
        let datapagination = result["pagination"];
        if (this.JobPostingObjects.JobList.length > 0) {
          this.JobPostingObjects.hasnextPostJobSummary = datapagination.has_next;
          this.JobPostingObjects.hasPreviousPostJobSummary = datapagination.has_previous;
          this.JobPostingObjects.presentPagePostJobSummary = datapagination.index; 
        } 
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  } 

  ProposedJobPostSearch(hint: any) {
    // let search = this.JobPostingSearchForm.value;
    if(this.JobPostingObjects?.ViewPost?.approval_status?.text ){

    } 
    let search;
    console.log("search data ", search)
    let obj = { 
      approval_status: search?.approvalstatus,
    } 
    console.log("obj data b4 api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        // obj[i] = '';
        obj[i] = '';

      }
    }
    console.log("obj data after api", obj)
    this.SpinnerService.show();

    if (hint == 'next') {
      this.SummaryCallproposed(obj, this.JobPostingObjects?.presentPagePostJobSummary + 1)
    }
    else if (hint == 'previous') {
      this.SummaryCallproposed(obj, this.JobPostingObjects?.presentPagePostJobSummary - 1) 
    }
    else {
      this.SummaryCallproposed(obj, 1 )
    }

  }




}

interface Job {
  approval_status : any 
  id: number 
  job_title: string 
}


