import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AttendanceService } from '../attendance.service';
import { DatePipe } from '@angular/common';
import { NotificationService } from 'src/app/service/notification.service';
import { AttendanceMasterServiceService } from '../attendance-master-service.service';

@Component({
  selector: 'app-hr-manual-run',
  templateUrl: './hr-manual-run.component.html',
  styleUrls: ['./hr-manual-run.component.scss']
})
export class HrManualRunComponent implements OnInit {
  constructor(private service:AttendanceMasterServiceService,private datePipe:DatePipe,private notification:NotificationService) { }
  logDate=new FormControl()
  Searching:boolean=false

  ngOnInit(): void {
  }
  ManualRun(){
    if(!this.logDate.value){
      this.notification.showError('Please Select the Date')
    }
    else{
      this.Searching=true
      let date=this.datePipe.transform(this.logDate.value,'yyyy-MM-dd')
      console.log('Date',date)
      this.service.HrManualRun(date).subscribe(data=>{
        this.notification.showSuccess(data.message)
        this.Searching=false
      })
    }
  
  }
  clear(){
    this.logDate.reset()
  }

}
