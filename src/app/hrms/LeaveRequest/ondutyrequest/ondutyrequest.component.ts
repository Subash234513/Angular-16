import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles' 
import { AttendanceService } from '../../attendance.service';  
import { DatePipe } from '@angular/common'; 
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import { MasterHrmsService } from '../../master-hrms.service';
 


@Component({
  selector: 'app-ondutyrequest',
  templateUrl: './ondutyrequest.component.html',
  styleUrls: ['./ondutyrequest.component.scss'],
  providers: [imp.HrmsAPI, imp.Master]
})
export class OndutyrequestComponent implements OnInit {
  editData: any;
  isEditForm: boolean = false;
  years: number[] = [];

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
   private attendanceService: AttendanceService, private shareService: imp.SharedService, private hrmsapi: imp.HrmsAPI,
   private apicall: ApicallserviceService, private masterapi: imp.Master, private actroute: ActivatedRoute, private hrmsService:MasterHrmsService,
   private activateroute:ActivatedRoute,
    ) { 
      let currenYear = new Date().getFullYear();
      let currYear = new Date().getFullYear();
      let startYear = currYear - 3;
      for(let year=startYear; year <= currYear + 17; year++)
      {
        this.years.push(year);
      }
    } 

    @Input() TypeOfSummary: string
    leaveRequestSearchForm: FormGroup;
    editForm : FormGroup;

    LeaveObjects = {
      ApprovalStatusList: [{id: 1, text: 'Approved'}, {id: 2, text: 'Rejected'}, {id: -1, text: 'Pending'}],
      leavereqList: [],
      leaveRequestpprovalSummary:{

      },
      pagesize: 10,
      LeaveRequestSummaryScreen: false,
      LeaveRequestAddScreen: false, 

      LeaveRequestView: null,
      backmenu: null,
    TypeList: [{ id: 1, text: 'Me', query: 'maker' }, { id: 2, text: 'Approval', query: 'approver' }],

    }
    leaveRequestSummary: any = {
      has_nextlverqe: false,
      has_previouslvereq: false, 
      presentpagelvereq: 1

    }
    options = [{ key: 'Jan', value: '1' }, { key: 'Feb', value: '2' }, { key: 'Mar', value: 3 }, { key: 'Apr', value: 4 }, { key: 'May', value: 5 }, { key: 'Jun', value: 6 }, { key: 'Jul', value: 7 }, { key: 'Aug', value: 8 }, { key: 'Sep', value: 9 }, { key: 'Oct', value: 10 }, { key: 'Nov', value: 11 }, { key: 'Dec', value: 12 }]
    EmpId: any
    EmpBasicDetails:any
    
  EmpInfoObjects = {
    datafrom: null,
    booleanList: [{ text: "Yes", value: true }, { text: "No", value: false }]
  }
  ngOnInit(): void { 

    this.activateroute.queryParams.subscribe((params) => {
      // let id: any = params.get('data')
      console.log("summary call", params)
      this.EmpInfoObjects.datafrom = params['datafrom'];
      this.EmpId = params['id'];
      console.log("My Emp Idsss", this.EmpId)
    })
    this.leaveRequestSearchForm = this.fb.group({
      fromdate: '',
      todate: '',
      approvalstatus: '', 
      type: 1
    }) 
    this.RemarksForm = this.fb.group({
      remarks: '',
      action: '' 
    })
    this.editForm = this.fb.group({
      reason: [''],
      month:'',
      year:'',
      total_days:'',
      id:''
      })

    
    this.LeaveObjects.LeaveRequestSummaryScreen = true 
    this.LeaveObjects.LeaveRequestAddScreen= false 

    this.actroute.queryParams.subscribe((params)=>{
      console.log("summary call", params)
      let SummaryCall: any = params['datafrom']
      if(SummaryCall == 'fromEmpview'){ 
        this.leaveRequestSearchForm.value.type = 1
        this.LeaveObjects.backmenu = true  
      }
      

    })
    this.leaveReqSearch('')


  }

  getLeaveRequest(search, pageno) {
    // this.attendanceService.getLeaveRequest(search, pageno)

    let ApiCallBasedOnType = ''
    if( this.leaveRequestSearchForm.value.type ==  1){
      ApiCallBasedOnType = this.hrmsapi.HRMS_API.api.ondutyrequest+'?page='+ pageno+'&action=user&'  
    } 
    else if(this.leaveRequestSearchForm.value.type == 2) {
      ApiCallBasedOnType = this.hrmsapi.HRMS_API.api.ondutyrequest+'?page='+ pageno+'&action=approver&'  
    }
    console.log("ApiCallBasedOnType", ApiCallBasedOnType )
    this.apicall.ApiCall('get',ApiCallBasedOnType,search) 
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log('leave request', result)
        let datass = result['data'];
        this.LeaveObjects.leavereqList = datass;
        let datapagination = result["pagination"];
        if (this.LeaveObjects.leavereqList.length > 0) {
          this.leaveRequestSummary.has_nextlverqe = datapagination.has_next;
          this.leaveRequestSummary.has_previouslvereq = datapagination.has_previous;
          this.leaveRequestSummary.presentpagelvereq = datapagination.index; 
        } 
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  } 

  leaveReqSearch(hint: any) {
    let search = this.leaveRequestSearchForm.value;
    const dateValue = this.leaveRequestSearchForm.value;
    dateValue.fromdate = this.datePipe.transform(dateValue.fromdate, 'yyyy-MM-dd');
    const dateValue1 = this.leaveRequestSearchForm.value;
    dateValue.todate = this.datePipe.transform(dateValue1.todate, 'yyyy-MM-dd');

    let obj = {
      fromdate: search?.fromdate,
      todate: search?.todate,
      status: search?.approvalstatus,
    }
    console.log("obj data b4 api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }
    this.SpinnerService.show();

    if (hint == 'next') {
      this.getLeaveRequest(obj, this.leaveRequestSummary?.presentpagelvereq + 1)
    }
    else if (hint == 'previous') {
      this.getLeaveRequest(obj, this.leaveRequestSummary?.presentpagelvereq - 1) 
    }
    else {
      this.getLeaveRequest(obj, 1 )
    }

  }

  resetRequestSearch() {


    // fromdate: '',
    //   todate: '',
    //   approvalstatus: '', 
    //   type: 1


    this.leaveRequestSearchForm.controls['fromdate'].reset('')
    this.leaveRequestSearchForm.controls['todate'].reset('')
    this.leaveRequestSearchForm.controls['approvalstatus'].reset('')
    this.leaveRequestSearchForm.controls['type'].reset(1)
    
    this.leaveRequestSearchForm.patchValue({
      type: 1 
    })
    this.leaveReqSearch('')
  }

 

////////////////////////////////////////////////////// Request
  RequestProcess(typedata, processtype){
    if(this.leaveRequestSearchForm.value.type == 2){  
      return false 
    }
    let data = typedata 
    console.log(data, processtype)
    let id = data?.id 
    let type = processtype
    let dataConfirm = confirm("Do you want to cancel the request?") 
    if(dataConfirm){
      this.attendanceService.requestForLeave(id, type)
      .subscribe(results =>{
        console.log(results)
        this.notify.success("Successfully Cancelled");
        this.leaveReqSearch('')
      })
    }
  }


  getAddScreen(){
    this.LeaveObjects.LeaveRequestSummaryScreen = false 
    this.LeaveObjects.LeaveRequestAddScreen = true 
  } 

  getStatusList(){
    // this.apicall.ApiCall('get', this.hrmsapi.HRMS_API.api())
  }




//////////// View Leave Request 
  AdminView: boolean = false 
  RemarksForm: FormGroup; 
 
  leaveRequestView(typedata){
     
    this.LeaveObjects.LeaveRequestView = typedata 
    console.log("OD DATAs", typedata)
  
    if(this.leaveRequestSearchForm.value.type == 2){ 
      this.AdminView = true 

    }else{
      this.AdminView = false 
    }
    this.apicall.ApiCall("get", this.hrmsapi.HRMS_API.api.get_od_request+"/"+typedata?.id)
    .subscribe(res=>{
      let data = this.LeaveObjects.LeaveRequestView
      let finalObj = Object.assign(data, {"dataView": res}) 
      console.log("final obj", finalObj)
      return finalObj
    })    

  
  }


  Approval(data, type){  
    let id = data?.id 
    let obj = {
      "request_id" : id,
      "remarks": this.RemarksForm.value.remarks,
      "status": type 
    }
    this.SpinnerService.show();
    this.attendanceService.od_Approval_Reject(obj, id)
      .subscribe((results) => {
        console.log("results after approval", results)
        if (results.status == "SUCCESS") {
          this.notify.success("Success") 
          this.leaveReqSearch('');
          this.SpinnerService.hide();
        } else {
          this.notify.error(results.message)
          this.SpinnerService.hide();
          return false;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  Reject(data, type){  
    let id = data?.id 
    let obj = {
     
      "remarks": this.RemarksForm.value.remarks,
      "status": type 
    }
    this.SpinnerService.show();
    this.attendanceService.od_Approval_Reject(obj, id)
      .subscribe((results) => {
        console.log("results after approval", results)
        if (results.status == "SUCCESS") {
          this.notify.success("Success") 
          this.leaveReqSearch('');
          this.SpinnerService.hide();
        } else {
          this.notify.error(results.message)
          this.SpinnerService.hide();
          return false;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }


//   {
//     "approve_status": {
//         "id": -1,
//         "text": "Pending"
//     },
//     "approved_by": "",
//     "created_date": "",
//     "from_date": 1669496400000,
//     "id": 144,
//     "leave_type": {
//         "code": "PL",
//         "has_attendance": false,
//         "has_salary": true,
//         "id": 1,
//         "name": "privilegeLeave",
//         "status": 1
//     },
//     "reason": "Pk",
//     "requested_date": 1669379935507,
//     "to_date": 1669615200000,
//     "total_days": 3,
//     "user_id": {
//         "code": "EMP300",
//         "full_name": "hrms1",
//         "id": 32
//     }
// }



submitBack(){

  this.leaveRequestSearchForm.value.type = 1
  this.LeaveObjects.LeaveRequestSummaryScreen = true 
    this.LeaveObjects.LeaveRequestAddScreen= false 

  this.leaveReqSearch('')



}


CancelBack(){
  this.leaveRequestSearchForm.value.type = 1

  this.LeaveObjects.LeaveRequestSummaryScreen = true 
  this.LeaveObjects.LeaveRequestAddScreen= false 
}

ChangeDateFormat(key){
  console.log("this.leaveRequestSearchForm.controls[key]", this.leaveRequestSearchForm.controls[key])
  this.leaveRequestSearchForm.patchValue({
    [key]: this.datePipe.transform(this.leaveRequestSearchForm.controls[key].value, 'yyyy-MM-dd')
  })

  if(key == 'fromdate' && (this.leaveRequestSearchForm.value.todate == '' || this.leaveRequestSearchForm.value.todate == null || (this.leaveRequestSearchForm.value.todate < this.leaveRequestSearchForm.value.fromdate) ) ){
    this.leaveRequestSearchForm.patchValue({
      todate: this.datePipe.transform(this.leaveRequestSearchForm.controls[key].value, 'yyyy-MM-dd')
    })
  }

}

getFileData(filedata){
  let fileName = filedata?.file_name
  this.apicall.ApiCall("getFile", this.masterapi.files.files+filedata?.file_id+'?entity_id=1&user_id=1') 
  .subscribe((results) => {
    console.log("re", results)
    let binaryData = [];
    binaryData.push(results)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    link.click();
  })
}

BackToSummaryToEmpView(){
  if(this.LeaveObjects.backmenu){

    this.router.navigate(['hrms/empdetails'])

  }
}

editOverDraft(id)
{
  this.isEditForm = true;
  this.LeaveObjects.LeaveRequestSummaryScreen = false;
  console.log("table row", id)
  this.apicall.ApiCall("get", this.hrmsapi.HRMS_API.api.get_od_request+"/"+id)
  .subscribe(res=>{
   this.editData = res
  })   
  this.editForm.patchValue({
    reason: this.editData.reason,
    month: this.editData.month,
    year: this.editData.year,
    total_days: this.editData.total_days,
    id: this.editData.id
  })
  
}

onLeaveReqCancelClick() {
  this.isEditForm = false;
  this.LeaveObjects.LeaveRequestSummaryScreen = true;

}

onSubmitLeaveReqClick() {

  let leaveType = this.editForm.value.leave_type?.name
    let obj: any = null
    let FinalObj: any = null

  
    this.apicall.ApiCall('post', this.hrmsapi.HRMS_API.api.ondutyrequest, this.editForm.value )
      .subscribe(results => {
        if(results.status == 'SUCCESS'){
          this.notify.success(results.message)

        }
        if(results?.status == 'FAILED'){
          this.notify.warning(results?.message)
   
        }
        if(results.code){
          this.notify.warning(results?.description)
          return false;
          // this.onCancel.emit()
        }
      })

}

getEmployeeBasicDetails(){
  console.log("emp id",this.EmpId)
  this.hrmsService.getEmpDetails(this.EmpId).subscribe(results => {
    this.EmpBasicDetails = results;
    // this.EmpBankDetails.reverse();
    console.log("basic details", results)
    console.log("acc type details", this.EmpBasicDetails)
    console.log("is payroll", this.EmpBasicDetails?.is_payroll)

  }
  )
}


}
