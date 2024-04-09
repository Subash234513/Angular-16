import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../attendance.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';

import { MatDatepicker } from '@angular/material/datepicker';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'  
import * as _moment from 'moment'; 
import { default as _rollupMoment, Moment } from 'moment';
import { trigger, state, style, transition, animate } from '@angular/animations';

const moment = _rollupMoment || _moment; 

@Component({
  selector: 'app-leave-history',
  templateUrl: './leave-history.component.html',
  styleUrls: ['./leave-history.component.scss'],
  providers: [
    { provide: imp.DateAdapter, useClass: imp.PickDateAdapter },
    { provide: imp.MAT_DATE_FORMATS, useValue: imp.PICK_FORMATS }, imp.HrmsAPI, imp.Userserv
  ]
})
export class LeaveHistoryComponent implements OnInit {
  panelOpenState = false;
  presentDays: number = 0;
  paidDays: number = 0;
  leaveDays: number = 0;
  totalDays: number = 0;
  reductionDays:number =0;
  availLeavePl:number =0;
  availLeaveCl:number =0;
  availLeaveMl:number =0;
  availLeaveTol:number =0;
  utilLeavePl:number=0;
  utilLeaveCl:number=0;
  utilLeaveMl:number=0;
  utilLeaveTol:number=0;
  data: any; 
  constructor(private attService :AttendanceService) { 
  }

  isHidden = true;

  toggleInfo() {
    this.isHidden = !this.isHidden;
  }
  ngOnInit(): void {
//degault search while on loading
    const monthYearValue = this.monyear.value;
    this.month = monthYearValue.format('M'); 
    this.year = monthYearValue.format('YYYY'); 
    console.log('Month:', this.month);
    console.log('Year:', this.year);

    this.getLeaveHistory(this.month, this.year);
  }
  LeaveTrackerReportsearchForm: FormGroup;
  monyear = new FormControl(moment())
chosenYearHandler(normalizedYear: Moment) {
  const ctrlValue = this.monyear.value;
  ctrlValue.year(normalizedYear.year());
  this.monyear.setValue(ctrlValue);
  
}
  // Define the function to log the values
  monthYearValue:any
  month:any
  year:any
  searchClicked() {
    const monthYearValue = this.monyear.value;
    this.month = monthYearValue.format('M'); 
    this.year = monthYearValue.format('YYYY'); 
    console.log('Month:', this.month);
    console.log('Year:', this.year);

    this.getLeaveHistory(this.month, this.year);

  }
  
chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
  const ctrlValue = this.monyear.value;
  ctrlValue.month(normalizedMonth.month());
  this.monyear.setValue(ctrlValue);
  datepicker.close();
  this.LeaveTrackerReportsearchForm.patchValue({
    monthyear:this.monyear.value
  })
}

ChangeDateFormat(key){
 
}
  getLeaveHistory(month: number, year: number): void {
    this.attService.getLeaveHistory(this.month, this.year).subscribe(
      (data) => {
        // Handle the leave history data here
        console.log('Leave History Data:', data);
        console.log("reduction history :", data.reduction_history)
        console.log("days count :",data.days_count)
        console.log("leave balance :",data.leave_balance["available Leave"]["PL"])
        this.data = data; 
        this.presentDays = data.days_count.present_days;
        this.paidDays = data.days_count.paid_days;
        this.leaveDays = data.days_count.leave_days;
        this.totalDays = data.days_count.total_days;
        this.reductionDays = data.days_count.reduction_days;
        this.availLeavePl = data.leave_balance["available Leave"]["PL"];
        this.availLeaveCl = data.leave_balance["available Leave"]["CL"];
        this.availLeaveMl = data.leave_balance["available Leave"]["ML"];
        this.availLeaveTol = data.leave_balance["available Leave"]["TOL"];
        this.utilLeavePl = data.leave_balance["Utilized Leave"]["PL"];
        this.utilLeaveCl = data.leave_balance["Utilized Leave"]["CL"];
        this.utilLeaveMl = data.leave_balance["Utilized Leave"]["ML"];
        this.utilLeaveTol = data.leave_balance["Utilized Leave"]["TOL"];

        console.log("util pl",this.utilLeavePl)
        console.log("util cl",this.utilLeaveCl)
        console.log("util ml",this.utilLeaveMl)
        console.log("util tol",this.utilLeaveTol)

      },
      (error) => {
        // Handle errors here
        console.error('Error fetching leave history:', error);
      }
    );
  }

}
