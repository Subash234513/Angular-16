import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles' 
import { AttendanceService } from '../../attendance.service';  
import { DatePipe } from '@angular/common'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-leave-request-page',
  templateUrl: './leave-request-page.component.html',
  styleUrls: ['./leave-request-page.component.scss']
})
export class LeaveRequestPageComponent implements OnInit {
  
  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
   private attendanceService: AttendanceService, private shareService: imp.SharedService,
    ) { }

  MenuLeave = {
    'Leave Summary': false, 
    'Approval Leave Summary': false,
    'Leave Report': false,
    'Attendance Change Request': false , 
    'Od Request': false
      
  }

  LeavePageObjects = {
    LeaveRequest_Menu_List: [],
    typeOfSummary: '' 

  }



  ngOnInit(): void {
    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Leave Request") {
        this.LeavePageObjects.LeaveRequest_Menu_List = subModule;
      }
    })

  }



  subModuleData(details) {
    console.log("details==>", details)
     let objs = this.MenuLeave
      for (let i in objs) {
        console.log("click menu loop", i, details.name)
        if (!(i == details.name)) {
          objs[i] = false;
        } else {
          objs[i] = true;
          this.LeavePageObjects.typeOfSummary = i  
        } 
      }
      // console.log("menu leave after click", this.MenuLeave, this.LeavePageObjects.typeOfSummary)
  }



}
