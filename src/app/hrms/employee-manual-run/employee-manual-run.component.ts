import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AttendanceMasterServiceService } from '../attendance-master-service.service';
import { data } from 'jquery';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-employee-manual-run',
  templateUrl: './employee-manual-run.component.html',
  styleUrls: ['./employee-manual-run.component.scss']
})
export class EmployeeManualRunComponent implements OnInit {

  constructor(private service:AttendanceMasterServiceService,private notification:NotificationService) { }
  formData=new FormGroup({
    Month:new FormControl(''),
    Year:new FormControl('')
  })
  years=[]
  Searching:boolean=false

  ngOnInit(): void {
    let currendate=new Date().getFullYear()
    let startYear=currendate-14
    for(let year=startYear;year<=currendate+17;year++){
      this.years.push(year)
    }
  }
  Month=[{key:'Jan',Value:1},{key:'Feb',Value:2},{key:'Mar',Value:3},{key:'Apr',Value:4},{key:'May',Value:5},{key:'June',Value:6},{key:'July',Value:7},{key:'Aug',Value:8},{key:'Sep',Value:9},{key:'Oct',Value:10},{key:'Nov',Value:11},{key:'Dec',Value:12}]
  ManualRun(){
    let year=this.formData.get('Year').value
    let month=this.formData.get('Month').value
    this.Searching=true
    this.service.EmpManualRun(year,month).subscribe(data=>{
      if(data.message){
        this.notification.showSuccess(data.message)
        this.Searching=false
      }
      else if(data.description){
        this.notification.showError(data.description)
        this.Searching=false
      }
    },
    error=>{
      this.Searching=false
    })
  }
}
