import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { NotificationService } from 'src/app/service/notification.service';
import { FetserviceService } from '../fetservice.service';
// import { AttendanceMasterServiceService } from '../../attendance-master-service.service';
// import { MasterHrmsService } from '../../master-hrms.service';
// import { SharedHrmsService } from '../../shared-hrms.service';

@Component({
  selector: 'app-fetview',
  templateUrl: './fetview.component.html',
  styleUrls: ['./fetview.component.scss']
})
export class FetviewComponent implements OnInit {


  searchform:FormGroup

  constructor(private fb: FormBuilder, private notification: NotificationService, private datepipe: DatePipe,
    private masterservice: FetserviceService, private error: ErrorHandlingServiceService, private SpinnerService: NgxSpinnerService,
    private route: Router,) { }


  ngOnInit(): void {

    this.searchform=this.fb.group({
      employee_name:[''],
      customer_name:[''],
      from_date:[''],
      to_date:[''],
      hierarchy:[''],
      client_name:['']
    })

  }

}
