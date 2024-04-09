import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AttendanceMasterServiceService } from '../attendance-master-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emergency-info',
  templateUrl: './emergency-info.component.html',
  styleUrls: ['./emergency-info.component.scss']
})
export class EmergencyInfoComponent implements OnInit {
  summaryData: any=[];
    searchPagination: boolean;

  constructor(private service:AttendanceMasterServiceService,private SpinnerService:NgxSpinnerService,private router:Router) { }
  data=[]
  pagination={
    has_next:false,
    has_previous:false,
    index:1
  }
  ngOnInit(): void {
//     this.summaryData=[
//       {
//           "blood_grp": null,
//           "code": "EMP004",
//           "emergency_no": [
//               {
//                   "name": "Kavika",
//                   "phone_no": "987329907"
//               }
//           ],
//           "id": 4,
//           "name": "aswani",
//           "phone_no": null
//       },
//       {
//           "blood_grp": null,
//           "code": "EMP005",
//           "emergency_no": [
//               {
//                   "name": "sd",
//                   "phone_no": "77"
//               }
//           ],
//           "id": 5,
//           "name": "vignesh",
//           "phone_no": "2435346344"
//       },
//       {
//           "blood_grp": null,
//           "code": "EMP006",
//           "emergency_no": [
//               {
//                   "name": "siva j",
//                   "phone_no": "888799"
//               },
//               {
//                   "name": "Rathnam",
//                   "phone_no": "67676767"
//               }
//           ],
//           "id": 6,
//           "name": "raghul",
//           "phone_no": "9786543213"
//       },
//       {
//           "blood_grp": null,
//           "code": "EMP100",
//           "emergency_no": [
//               {
//                   "name": "Mom",
//                   "phone_no": "9889789789"
//               }
//           ],
//           "id": 13,
//           "name": "PremKumar",
//           "phone_no": null
//       },
//       {
//           "blood_grp": null,
//           "code": "EMP102",
//           "emergency_no": [
//               {
//                   "name": "Ram",
//                   "phone_no": "7897897890"
//               }
//           ],
//           "id": 15,
//           "name": "Bhuvaneswari",
//           "phone_no": null
//       },
//       {
//           "blood_grp": null,
//           "code": "EMP300",
//           "emergency_no": [
//               {
//                   "name": "Raju Baai",
//                   "phone_no": "9889789789"
//               }
//           ],
//           "id": 32,
//           "name": "hrms1",
//           "phone_no": "9876567891"
//       },
//       {
//           "blood_grp": null,
//           "code": "papprover6",
//           "emergency_no": null,
//           "id": 50,
//           "name": "papprover2",
//           "phone_no": null
//       },
//       {
//           "blood_grp": null,
//           "code": "apuser",
//           "emergency_no": null,
//           "id": 51,
//           "name": "apuser",
//           "phone_no": null
//       },
//       {
//           "blood_grp": null,
//           "code": "papprov320",
//           "emergency_no": null,
//           "id": 59,
//           "name": "papprover2",
//           "phone_no": null
//       },
//       {
//           "blood_grp": null,
//           "code": "papprover4",
//           "emergency_no": null,
//           "id": 60,
//           "name": "papprover2",
//           "phone_no": null
//       }
//   ]
    this.Summary('','','',this.pagination.index)
  }
  searchForm=new FormGroup({
    bloodGroup:new FormControl(''),
    code:new FormControl(''),
    name:new FormControl('')
  })
  Summary(code,name,blood_grp,page){
    const payload={
        blood_group:blood_grp,
        name:name,
       
    }
    this.SpinnerService.show()
    this.service.PostEmployeeScreen(payload,page).subscribe(data=>{
       this.SpinnerService.hide()
        this.summaryData=data['data']
        this.pagination={
            has_next:data?.pagination?.has_next,
            has_previous:data?.pagination?.has_previous,
            index:data?.pagination?.index
        }
    },
    error=>{
        this.SpinnerService.hide()
    })
  
  }
  Search(){
    let name=this.searchForm.get('name')?.value
    let code=this.searchForm.get('code')?.value
    let bloodGroup=this.searchForm.get('bloodGroup')?.value
    if(!name){
        name=''
    }
    if(!code){
        code=''
    }
    if(!bloodGroup){
        bloodGroup=''
    }
    if(name || code || bloodGroup){
        this.searchPagination=true
    }
    this.pagination.index=1
    this.Summary(code,name,bloodGroup,this.pagination.index)

  }
  Clear(){
    this.pagination.index=1
    this.searchForm.reset()
    this.Summary('','','',this.pagination.index)
    this.searchPagination=false
  }
  hasPrev(){
    this.pagination.index=this.pagination.index-1
    let name=this.searchForm.get('name')?.value
    let code=this.searchForm.get('code')?.value
    let bloodGroup=this.searchForm.get('bloodGroup')?.value
    if(this.searchPagination){
        if(code || name || bloodGroup){
            if(!name){
                name=''
            }
            if(!code){
                code=''
            }
            if(!bloodGroup){
                bloodGroup=''
            }
            this.Summary(code,name,bloodGroup,this.pagination.index)
        }
        else{
            this.Summary('','','',this.pagination.index)
        }
    }
    else{
        this.Summary('','','',this.pagination.index)
    }
  }
  hasNext(){
    this.pagination.index=this.pagination.index+1
    let name=this.searchForm.get('name')?.value
    let code=this.searchForm.get('code')?.value
    let bloodGroup=this.searchForm.get('bloodGroup')?.value
    if(this.searchPagination){
        if(code || name || bloodGroup){
            if(!name){
                name=''
            }
            if(!code){
                code=''
            }
            if(!bloodGroup){
                bloodGroup=''
            }
            this.Summary(code,name,bloodGroup,this.pagination.index)
        }
        else{
            this.Summary('','','',this.pagination.index)
        }
    }
    else{
        this.Summary('','','',this.pagination.index)
    }
  }
  Back(){
    this.router.navigate(['hrms/empdetails'])
  }

}
